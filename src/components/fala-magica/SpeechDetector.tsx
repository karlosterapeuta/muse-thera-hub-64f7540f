
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

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
  duration = 10,
}: SpeechDetectorProps) {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize audio analyzer
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startListening = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio context and analyzer
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      setIsListening(true);
      setTimeLeft(duration);
      
      // Start monitoring volume
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsListening(false);
    setVolume(0);
  };

  const analyzeAudio = () => {
    if (!isListening || !analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume from frequency data
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setVolume(average);
    
    // Check if volume exceeds threshold for vocalization
    if (average > sensitivity) {
      triggerVocalization();
    }
    
    // Continue monitoring
    requestAnimationFrame(analyzeAudio);
  };

  const triggerVocalization = () => {
    setShowConfetti(true);
    onVocalization();
    
    // Reset confetti after a short delay
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  // Countdown timer
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
      
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-2xl font-bold text-purple-700">Detector de Fala</h3>
        
        <div className="w-40 h-40 rounded-full flex items-center justify-center bg-white shadow-lg">
          <div 
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening ? 'bg-purple-500 animate-pulse' : 'bg-gray-200'
            }`}
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
          </div>
        </div>
        
        {isListening && (
          <>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <Volume2 className="text-purple-500" />
                <span className="font-medium text-purple-700">
                  {Math.round(volume)}
                </span>
              </div>
              <Progress value={volume} max={100} className="h-4" />
            </div>
            
            {autoStop && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Tempo restante: {timeLeft}s</p>
                <Progress value={(timeLeft / duration) * 100} className="mt-1 h-2" />
              </div>
            )}
          </>
        )}
        
        <p className="text-center text-gray-700 max-w-xs">
          {isListening 
            ? "Fale algo! Quando eu detectar sua voz, você ganhará uma recompensa!"
            : "Clique no microfone para começar a detectar sua voz"}
        </p>
      </div>
    </div>
  );
}
