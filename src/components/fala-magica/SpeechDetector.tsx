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
  const { width, height } = useWindowSize();
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVocalizationRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      stopListening();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      stopListening();
      setMicError(null);
      
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log("Microphone access granted!");
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported in this browser");
      }
      
      audioContextRef.current = new AudioContextClass();
      console.log("AudioContext created");
      
      const analyser = audioContextRef.current.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyser);
      console.log("Microphone connected to analyser");
      
      setIsListening(true);
      setTimeLeft(duration);
      setConsecutiveVocalizations(0);
      
      analyzeAudio();
      
      if (autoStop) {
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, duration * 1000);
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
    }
  };

  const stopListening = () => {
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
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(err => {
        console.error("Error closing audio context:", err);
      });
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsListening(false);
    setVolume(0);
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
    
    if (typeof (window as any).addShapeToCanvas === 'function') {
      for (let i = 0; i < 3; i++) {
        (window as any).addShapeToCanvas();
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
    
    console.log("Vocalization triggered! Volume level:", volume);
    
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const analyzeAudio = () => {
    if (!isListening || !analyserRef.current) {
      return;
    }
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setVolume(average);
    
    setMaxVolume(prevMax => Math.max(prevMax, average));
    
    if (average > sensitivity) {
      setSoundDetected(true);
      
      if (typeof (window as any).addShapeToCanvas === 'function') {
        (window as any).addShapeToCanvas();
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

  useEffect(() => {
    if (isListening && autoStop && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isListening, autoStop, timeLeft]);

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
        
        <div className="w-full max-w-md mx-auto mb-6">
          <SpeechCanvas width={400} height={300} />
        </div>
        
        {micError && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-3">
            <p className="font-medium">Problema com o microfone:</p>
            <p>{micError}</p>
            <p className="mt-2 text-xs">Dicas: Verifique se seu navegador tem permissão para acessar o microfone. 
            Tente atualizar a página ou usar outro navegador como Chrome.</p>
          </div>
        )}
        
        <motion.div 
          className="w-40 h-40 rounded-full flex items-center justify-center bg-white shadow-lg relative"
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
        >
          <motion.div 
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors ${
              isListening ? 'bg-purple-500' : 'bg-gray-200'
            }`}
            animate={isListening ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={isListening ? stopListening : startListening}
              variant="ghost"
              size="icon"
              className={`w-24 h-24 rounded-full ${
                isListening ? 'text-white hover:bg-purple-600' : 'text-gray-500 hover:bg-gray-300'
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
                  animate={soundDetected ? { scale: [1, 1.2, 1] } : {}}
                >
                  Volume: {Math.round(volume)} | Máximo: {Math.round(maxVolume)}
                </motion.span>
              </div>
              {soundDetected && (
                <div className="text-green-600 font-medium flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  Som detectado!
                </div>
              )}
            </div>
            <Progress 
              value={volume} 
              max={100} 
              className={`h-4 ${soundDetected ? 'border-2 border-green-500' : ''}`} 
            />
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
