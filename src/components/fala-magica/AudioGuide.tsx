
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Music,
} from "lucide-react";
import { Howl } from "howler";
import { GuidedAudio } from "./types";

interface AudioGuideProps {
  audio: GuidedAudio;
  onComplete?: () => void;
}

export default function AudioGuide({ audio, onComplete }: AudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const soundRef = useRef<Howl | null>(null);
  
  useEffect(() => {
    // Create a new Howl instance
    const sound = new Howl({
      src: [audio.audioUrl],
      html5: true,
      volume: isMuted ? 0 : volume,
      onload: () => {
        setDuration(sound.duration());
      },
      onplay: () => {
        setIsPlaying(true);
        requestAnimationFrame(updateProgress);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => {
        if (isRepeat) {
          sound.play();
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
          if (onComplete) {
            onComplete();
          }
        }
      },
    });
    
    soundRef.current = sound;
    
    return () => {
      sound.unload();
    };
  }, [audio.audioUrl, volume, isMuted, isRepeat, onComplete]);
  
  // Update progress while playing
  const updateProgress = () => {
    if (soundRef.current && isPlaying) {
      const time = soundRef.current.seek();
      setCurrentTime(typeof time === 'number' ? time : 0);
      requestAnimationFrame(updateProgress);
    }
  };
  
  const togglePlayPause = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (!soundRef.current) return;
    
    const seekTime = value[0];
    soundRef.current.seek(seekTime);
    setCurrentTime(seekTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!soundRef.current) return;
    
    setIsMuted(!isMuted);
    soundRef.current.mute(!isMuted);
  };
  
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
          <Music size={32} className="text-purple-600" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-purple-700">{audio.title}</h3>
          <p className="text-sm text-gray-600">{audio.description}</p>
          <p className="text-xs text-gray-500">Voz: {audio.voiceType}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
          <span className="text-sm text-gray-600">{formatTime(duration)}</span>
        </div>
        
        <Progress value={(currentTime / duration) * 100} className="h-2 mb-2" />
        
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 1}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="rounded-full"
            aria-label={isMuted ? "Ativar som" : "Silenciar"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          <div className="w-24">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            disabled={true}
            aria-label="Anterior"
          >
            <SkipBack size={18} />
          </Button>
          
          <Button
            onClick={togglePlayPause}
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700"
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            disabled={true}
            aria-label="Próximo"
          >
            <SkipForward size={18} />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleRepeat}
          className={`rounded-full ${isRepeat ? 'bg-purple-100 text-purple-600' : ''}`}
          aria-label={isRepeat ? "Desativar repetição" : "Ativar repetição"}
        >
          <Repeat size={18} />
        </Button>
      </div>
    </div>
  );
}
