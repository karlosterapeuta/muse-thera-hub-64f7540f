import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Star, Music, Sparkles, Dog, Cat, Bird, Fish, Baby } from "lucide-react";
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

const animalIcons = [Dog, Cat, Bird, Fish, Baby];
const animalSounds = ["woof", "meow", "tweet", "blub", "baba"];

export default function SpeechDetector({
  onVocalization,
  sensitivity = 15,
  autoStop = true,
  duration = 10,
}: SpeechDetectorProps) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showConfetti, setShowConfetti] = useState(false);
  const [consecutiveVocalizations, setConsecutiveVocalizations] = useState(0);
  const [recentStars, setRecentStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [showAnimalReward, setShowAnimalReward] = useState(false);
  const { width, height } = useWindowSize();
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVocalizationRef = useRef<number>(0);
  const micPermissionGrantedRef = useRef<boolean>(false);
  
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
      
      console.log("Requesting microphone permission...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log("Microphone permission granted");
      micPermissionGrantedRef.current = true;
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported in this browser");
      }
      
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
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
        title: "Microfone ativado!",
        description: "Agora estou ouvindo você. Tente fazer um som!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Erro ao acessar o microfone",
        description: "Verifique se você permitiu o acesso ao microfone no navegador.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    console.log("Stopping listening...");
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Track stopped:", track.kind);
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
    
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
          console.log("Audio context closed");
        } catch (e) {
          console.error("Error closing audio context:", e);
        }
      }
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

  const showAnimalAnimation = () => {
    setShowAnimalReward(true);
    
    setTimeout(() => {
      setShowAnimalReward(false);
    }, 2000);
  };

  const triggerVocalization = () => {
    const now = Date.now();
    const timeSinceLastVocalization = now - lastVocalizationRef.current;
    
    if (timeSinceLastVocalization < 500) return;
    
    lastVocalizationRef.current = now;
    
    if (typeof (window as any).addShapeToCanvas === 'function') {
      for (let i = 0; i < 3; i++) {
        (window as any).addShapeToCanvas();
      }
    }
    
    if (consecutiveVocalizations % 3 === 0) {
      showAnimalAnimation();
    }
    
    setConsecutiveVocalizations(prev => {
      const newCount = prev + 1;
      
      if (newCount === 3) {
        playRewardSound('levelUp');
        toast({
          title: "🌟 Incrível!",
          description: "3 sons seguidos! Continue assim!",
        });
      } else if (newCount === 5) {
        playRewardSound('achievement');
        toast({
          title: "🏆 Extraordinário!",
          description: "5 sons seguidos! Você é demais!",
        });
      } else {
        playRewardSound('success');
      }
      
      return newCount;
    });
    
    setShowConfetti(true);
    addStar();
    
    onVocalization();
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const analyzeAudio = () => {
    if (!isListening || !analyserRef.current) {
      console.log("Not listening or no analyser");
      return;
    }
    
    try {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(average);
      
      if (average > 0) {
        console.log("Current volume:", average, "threshold:", sensitivity);
      }
      
      if (average > sensitivity) {
        console.log("Volume above threshold, triggering vocalization");
        triggerVocalization();
      }
      
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    } catch (error) {
      console.error("Error analyzing audio:", error);
      stopListening();
      
      toast({
        title: "Erro na detecção de áudio",
        description: "Ocorreu um erro ao analisar o áudio. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isListening && autoStop && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isListening, autoStop, timeLeft]);

  const getPromptText = () => {
    if (consecutiveVocalizations === 0) {
      return "Clique no microfone e faça qualquer som!";
    } else if (consecutiveVocalizations < 3) {
      return `Tente dizer "${animalSounds[currentAnimal]}"!`;
    } else if (consecutiveVocalizations < 5) {
      return "Você está indo muito bem! Continue falando!";
    } else {
      return "Uau! Você é incrível falando!";
    }
  };

  const AnimalIcon = animalIcons[currentAnimal];

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
          <Sparkles className="text-yellow-500" />
          Detector de Fala Mágico
          <Sparkles className="text-yellow-500" />
        </h3>
        
        <div className="w-full max-w-md mx-auto mb-6">
          <SpeechCanvas width={400} height={300} />
        </div>
        
        <AnimatePresence>
          {showAnimalReward && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: [0, 1.5, 1], y: [50, -20, 0], rotate: [0, -10, 10, 0] }}
              exit={{ scale: 0, y: -50 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-white rounded-full p-6 shadow-lg">
                <AnimalIcon size={80} className="text-purple-500" />
              </div>
              <motion.div 
                className="text-center font-bold text-purple-700 text-xl mt-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 3, duration: 0.5 }}
              >
                {animalSounds[currentAnimal].toUpperCase()}!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="w-40 h-40 rounded-full flex items-center justify-center bg-white shadow-lg relative">
          <motion.div 
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-colors ${
              isListening ? 'bg-purple-500' : 'bg-gray-200'
            }`}
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isListening ? Infinity : 0,
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
              aria-label={isListening ? "Parar de ouvir" : "Começar a ouvir"}
            >
              {isListening ? <MicOff size={48} /> : <Mic size={48} />}
            </Button>
          </motion.div>
          
          {isListening && consecutiveVocalizations > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg"
            >
              {consecutiveVocalizations}
            </motion.div>
          )}
        </div>
        
        {isListening && (
          <>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <Volume2 className={`${volume > sensitivity ? 'text-green-500' : 'text-purple-500'}`} />
                <span className={`font-medium ${volume > sensitivity ? 'text-green-600' : 'text-purple-700'}`}>
                  {Math.round(volume)}
                </span>
              </div>
              <motion.div className="relative h-4">
                <Progress value={volume} max={100} className="h-4" />
                {volume > sensitivity && (
                  <motion.div
                    className="absolute inset-0 bg-green-500 opacity-20 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </div>
            
            {autoStop && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Tempo restante: {timeLeft}s</p>
                <Progress value={(timeLeft / duration) * 100} className="mt-1 h-2" />
              </div>
            )}
          </>
        )}
        
        <motion.div 
          className="p-4 bg-white rounded-lg shadow-sm max-w-xs text-center"
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
            borderColor: ['#d8b4fe', '#c084fc', '#d8b4fe'],
          }}
          transition={{
            duration: 2,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="flex justify-center mb-2"
            animate={{ rotate: isListening ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AnimalIcon className="text-purple-500 w-8 h-8" />
          </motion.div>
          
          <p className="font-medium text-purple-700">
            {isListening ? getPromptText() : "Clique no microfone para começar a detectar sua voz"}
          </p>
        </motion.div>
        
        {consecutiveVocalizations > 0 && (
          <div className="text-center bg-purple-50 px-4 py-2 rounded-full">
            <p className="text-sm text-purple-600 font-medium">
              {consecutiveVocalizations} {consecutiveVocalizations === 1 ? 'som' : 'sons'} detectados!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
