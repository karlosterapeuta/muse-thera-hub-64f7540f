
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Star, Sparkles, Music, Bird } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { motion, AnimatePresence } from "framer-motion";
import { playRewardSound } from "@/utils/soundRewards";
import SpeechCanvas from './SpeechCanvas';
import AudioVisualizer from "./AudioVisualizer";

interface SpeechDetectorProps {
  onVocalization: () => void;
  sensitivity?: number;
  autoStop?: boolean;
  duration?: number;
}

export default function SpeechDetector({
  onVocalization,
  sensitivity = 15,
  autoStop = true,
  duration = 30,
}: SpeechDetectorProps) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showConfetti, setShowConfetti] = useState(false);
  const [consecutiveVocalizations, setConsecutiveVocalizations] = useState(0);
  const [recentStars, setRecentStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const [micError, setMicError] = useState<string | null>(null);
  const [soundDetected, setSoundDetected] = useState(false);
  const [maxVolume, setMaxVolume] = useState(0);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128).fill(0));
  const { width, height } = useWindowSize();
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVocalizationRef = useRef<number>(0);
  const hasTriedInitRef = useRef(false);
  const micAttempts = useRef(0);
  
  const resumeAudioContextInterval = useRef<NodeJS.Timeout | null>(null);

  const cleanupAudio = () => {
    console.log("Stopping listening...");
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (resumeAudioContextInterval.current) {
      clearInterval(resumeAudioContextInterval.current);
      resumeAudioContextInterval.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(err => {
        console.error("Error closing audio context:", err);
      });
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    setVolume(0);
    setAudioData(new Uint8Array(128).fill(0));
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const startListening = async () => {
    try {
      cleanupAudio();
      setMicError(null);
      micAttempts.current += 1;
      
      console.log("Requesting microphone access...");
      
      // Improved microphone request with proper constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: false,    // Turn off echo cancellation for better detection
          noiseSuppression: false,    // Turn off noise suppression for better detection
          autoGainControl: true       // Keep auto gain control ON for better sensitivity
        } 
      });
      
      console.log("Microphone access granted!");
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported in this browser");
      }
      
      try {
        audioContextRef.current = new AudioContextClass();
        console.log("AudioContext created with state:", audioContextRef.current.state);
        
        // Resume audio context immediately after creation if needed
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
          console.log("AudioContext resumed from suspended state");
        }
      } catch (contextError) {
        console.error("Error creating or resuming AudioContext:", contextError);
        throw new Error("Could not initialize audio processing");
      }
      
      const analyser = audioContextRef.current.createAnalyser();
      analyserRef.current = analyser;
      // Increased FFT size for better frequency resolution
      analyser.fftSize = 2048;
      // Lower smoothing for more responsive visualization
      analyser.smoothingTimeConstant = 0.1;
      
      // Create gain node with higher boost for better sensitivity
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 5.0; // Increased from 3.0
      
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(gainNode);
      gainNode.connect(analyser);
      console.log("Microphone connected to analyser with increased gain boost");
      
      setIsListening(true);
      setTimeLeft(duration);
      setConsecutiveVocalizations(0);
      setMaxVolume(0);
      setAudioData(new Uint8Array(analyser.frequencyBinCount).fill(0));
      
      // Setup interval to regularly attempt resuming audio context (common fix for iOS/Safari)
      resumeAudioContextInterval.current = setInterval(() => {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(err => {
            console.error("Failed to resume audio context in interval:", err);
          });
        }
      }, 300) as unknown as NodeJS.Timeout;
      
      analyzeAudio();
      
      if (autoStop && duration > 0) {
        timeoutRef.current = setTimeout(() => {
          cleanupAudio();
        }, duration * 1000) as unknown as NodeJS.Timeout;
      }
      
      toast({
        title: "🎤 Vamos começar nossa aventura sonora!",
        description: "Faça qualquer som! Pode ser 'Aaaa', 'Mmmm' ou o que você quiser!",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setMicError(`Erro de microfone: ${errorMessage}`);
      
      toast({
        title: "❌ Ops! Não consigo ouvir você",
        description: "Por favor, permita o acesso ao microfone para brincarmos juntos!",
        variant: "destructive",
      });
      
      if (micAttempts.current > 2) {
        toast({
          title: "🤔 Dicas para o microfone",
          description: "Verifique se seu navegador tem permissão. Em celulares, toque na tela várias vezes antes de ativar o microfone.",
          duration: 6000,
        });
      }
    }
  };

  const addStar = () => {
    const starId = Date.now();
    const x = Math.random() * (width - 100);
    const y = Math.random() * (height - 100);
    
    setRecentStars(prev => [...prev, { id: starId, x, y }]);
    
    setTimeout(() => {
      setRecentStars(prev => prev.filter(star => star.id !== starId));
    }, 2000);
  };

  const triggerVocalization = () => {
    const now = Date.now();
    if (now - lastVocalizationRef.current < 500) return;
    
    lastVocalizationRef.current = now;
    
    const volumeIntensity = Math.max(1, volume / 10);
    
    if (typeof (window as any).addShapeToCanvas === 'function') {
      const burstCount = Math.min(15, Math.ceil(volumeIntensity * 2.0));
      for (let i = 0; i < burstCount; i++) {
        (window as any).addShapeToCanvas(volumeIntensity);
      }
    }
    
    setConsecutiveVocalizations(prev => {
      const newCount = prev + 1;
      playRewardSound(newCount >= 5 ? 'achievement' : newCount >= 3 ? 'levelUp' : 'success');
      return newCount;
    });
    
    setShowConfetti(true);
    addStar();
    onVocalization();
    
    console.log("Vocalization triggered! Volume level:", volume, "Intensity:", volumeIntensity);
    
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const analyzeAudio = () => {
    if (!isListening || !analyserRef.current) {
      return;
    }
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Apply higher gain factor for more sensitivity
    const gainFactor = 8.0; // Increased from 5.0
    const amplifiedData = new Uint8Array(dataArray.length);
    for (let i = 0; i < dataArray.length; i++) {
      amplifiedData[i] = Math.min(255, dataArray[i] * gainFactor);
    }
    
    setAudioData(amplifiedData);
    
    let sum = 0;
    let count = 0;
    
    // Focus more on voice frequency range (250Hz-4kHz)
    // With 2048 FFT size, we have more precise frequency bins
    const voiceStartBin = Math.floor(dataArray.length * 0.01);  // ~200Hz
    const voiceEndBin = Math.floor(dataArray.length * 0.2);     // ~4kHz
    
    for (let i = voiceStartBin; i < voiceEndBin; i++) {
      sum += dataArray[i];
      count++;
    }
    
    const average = count > 0 ? (sum / count) : 0;
    setVolume(average);
    
    setMaxVolume(prevMax => Math.max(prevMax, average));
    
    // Lower sensitivity threshold for easier detection
    const actualSensitivity = Math.max(2, sensitivity - 14); // Reduced from 12
    
    if (average > actualSensitivity) {
      setSoundDetected(true);
      
      const intensityFactor = Math.min(8, (average - actualSensitivity) / (100 - actualSensitivity) * 5 + 1);
      
      if (typeof (window as any).addShapeToCanvas === 'function') {
        (window as any).addShapeToCanvas(intensityFactor);
      }
      
      const now = Date.now();
      if (now - lastVocalizationRef.current > 500) {
        triggerVocalization();
        lastVocalizationRef.current = now;
      }
    } else {
      setSoundDetected(false);
    }
    
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  };

  const getVolumeColor = (volume: number) => {
    if (volume < 20) return 'bg-purple-500';
    if (volume < 40) return 'bg-blue-500';
    if (volume < 60) return 'bg-green-500';
    if (volume < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getVolumeStyles = (currentVolume: number) => {
    const baseStyles = "transition-all duration-200 h-full rounded-full";
    const colorClass = getVolumeColor(currentVolume);
    return `${baseStyles} ${colorClass}`;
  };

  useEffect(() => {
    if (isListening && autoStop && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isListening, autoStop, timeLeft]);

  useEffect(() => {
    if (!hasTriedInitRef.current) {
      hasTriedInitRef.current = true;
      
      const timer = setTimeout(() => {
        if (!isListening) {
          startListening();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isListening && audioContextRef.current) {
      const resumeAudioContext = async () => {
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          try {
            console.log("Attempting to resume suspended audio context...");
            await audioContextRef.current.resume();
            console.log("Audio context resumed successfully");
          } catch (err) {
            console.error("Failed to resume audio context:", err);
          }
        }
      };
      
      resumeAudioContext();
      
      // Add multiple event handlers to resume audio context
      // This is especially important for iOS/Safari
      const resumeAudio = () => {
        resumeAudioContext();
      };

      document.addEventListener('click', resumeAudio, { capture: true });
      document.addEventListener('touchstart', resumeAudio, { capture: true });
      document.addEventListener('touchend', resumeAudio, { capture: true });
      document.addEventListener('keydown', resumeAudio, { capture: true });
      
      // Try to resume audio context on regular intervals
      const intervalId = setInterval(resumeAudioContext, 500);
      
      return () => {
        document.removeEventListener('click', resumeAudio, { capture: true });
        document.removeEventListener('touchstart', resumeAudio, { capture: true });
        document.removeEventListener('touchend', resumeAudio, { capture: true });
        document.removeEventListener('keydown', resumeAudio, { capture: true });
        clearInterval(intervalId);
      };
    }
  }, [isListening]);

  // Extra touch interaction for mobile
  useEffect(() => {
    const handleTouch = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(err => {
          console.error("Failed to resume audio context on touch:", err);
        });
      }
    };

    document.addEventListener('touchstart', handleTouch);
    
    return () => {
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      
      <AnimatePresence>
        {recentStars.map(star => (
          <motion.div
            key={star.id}
            initial={{ scale: 0, x: star.x, y: star.y }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 45, -45, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute"
          >
            <Star className="text-yellow-400 fill-yellow-400 w-8 h-8" />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <Bird className="text-blue-500" />
          Vamos Fazer Sons Juntos!
          <Music className="text-pink-500" />
        </h3>
        
        <div className="w-full">
          <AudioVisualizer audioData={audioData} isActive={isListening && volume > 1} />
        </div>
        
        {micError && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-3">
            <p className="font-medium">Problema com o microfone:</p>
            <p>{micError}</p>
            <p className="mt-2 text-xs">
              Dicas para resolver:
              <ul className="list-disc pl-5 mt-1">
                <li>Verifique se o navegador tem permissão para acessar o microfone nas configurações</li>
                <li>Em celulares, toque várias vezes na tela ou no botão antes de ativar o microfone</li>
                <li>Tente atualizar a página e tentar novamente</li>
                <li>Use um navegador como Chrome ou Firefox que tenha melhor suporte a áudio</li>
                <li>Desligue outros aplicativos que possam estar usando o microfone</li>
                <li>Em Android, verifique se o app do navegador tem permissão para usar o microfone</li>
                <li>Em iOS, certifique-se de estar usando Safari para melhor compatibilidade</li>
              </ul>
            </p>
          </div>
        )}
        
        <motion.div 
          className="w-40 h-40 rounded-full flex items-center justify-center bg-white shadow-lg relative cursor-pointer"
          animate={isListening ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            ]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={isListening ? cleanupAudio : startListening}
        >
          <motion.div 
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors ${
              isListening 
                ? soundDetected 
                  ? 'bg-green-500' 
                  : 'bg-purple-500' 
                : 'bg-gray-200'
            }`}
            animate={isListening ? {
              scale: soundDetected ? [1, 1.2, 1] : [1, 1.1, 1],
              rotate: soundDetected ? [0, 5, -5, 0] : [0, 3, -3, 0]
            } : {}}
            transition={{
              duration: soundDetected ? 0.5 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={isListening ? cleanupAudio : startListening}
              variant="ghost"
              size="icon"
              className={`w-24 h-24 rounded-full ${
                isListening 
                  ? soundDetected 
                    ? 'text-white hover:bg-green-600' 
                    : 'text-white hover:bg-purple-600' 
                  : 'text-gray-500 hover:bg-gray-300'
              }`}
            >
              {isListening ? <MicOff size={48} /> : <Mic size={48} />}
            </Button>
          </motion.div>
          
          {isListening && consecutiveVocalizations > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              className="absolute -top-2 -right-2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              {consecutiveVocalizations}
            </motion.div>
          )}
        </motion.div>
        
        {isListening && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className={`${soundDetected ? 'text-green-500 animate-pulse' : 'text-purple-500'}`} />
                <motion.span 
                  className={`font-medium ${soundDetected ? 'text-green-600' : 'text-purple-700'}`}
                  animate={soundDetected ? { 
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.3, repeat: Infinity }
                  } : {}}
                >
                  Volume: {Math.round(volume)} | Máximo: {Math.round(maxVolume)}
                </motion.span>
              </div>
              {soundDetected && (
                <motion.div 
                  className="text-green-600 font-medium flex items-center space-x-2"
                  animate={{ 
                    opacity: [1, 0.7, 1],
                    transition: { duration: 1, repeat: Infinity }
                  }}
                >
                  <Sparkles className="w-5 h-5 text-green-500" />
                  Som detectado!
                </motion.div>
              )}
            </div>
            
            <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={getVolumeStyles(volume)}
                style={{
                  width: `${Math.min(100, volume)}%`,
                }}
                animate={{
                  scale: soundDetected ? [1, 1.02, 1] : 1
                }}
                transition={{
                  duration: 0.3,
                  repeat: soundDetected ? Infinity : 0
                }}
              />
            </div>
            
            <div className="w-full flex justify-between text-xs text-gray-500">
              <span>Baixo</span>
              <span>Médio</span>
              <span>Alto</span>
            </div>
          </div>
        )}
        
        {consecutiveVocalizations > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-purple-50 px-4 py-2 rounded-full"
          >
            <p className="text-sm text-purple-600 font-medium">
              {consecutiveVocalizations === 1 
                ? "Uau! Que som legal! Vamos fazer outro?" 
                : `Incrível! Você já fez ${consecutiveVocalizations} sons! Continue assim!`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
