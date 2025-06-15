
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from '../utils/musicAPIs';

interface MusicPlayerProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onTrackEnd?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onTrackEnd,
  volume = 0.5,
  onVolumeChange
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar áudio quando track muda
  useEffect(() => {
    console.log(`🎵 Carregando música: ${track?.title}`);
    
    // Limpar áudio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    if (!track) {
      setDuration(0);
      setCurrentTime(0);
      setAudioError(false);
      setIsLoading(false);
      return;
    }

    // Se tem preview_url, tentar carregar áudio real
    if (track.preview_url) {
      console.log(`🎵 Carregando áudio real: ${track.preview_url}`);
      setIsLoading(true);
      setAudioError(false);
      
      try {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.preload = "metadata";
        audio.volume = isMuted ? 0 : volume;
        
        // Event listeners
        audio.addEventListener('loadedmetadata', () => {
          console.log(`✅ Áudio carregado - Duração: ${audio.duration}s`);
          setDuration(audio.duration || track.duration);
          setAudioError(false);
          setIsLoading(false);
        });

        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
          console.log('🔚 Música terminou');
          onPlayPause(false);
          if (onTrackEnd) {
            onTrackEnd();
          }
        });

        audio.addEventListener('error', (e) => {
          console.error('❌ Erro no áudio:', e);
          setAudioError(true);
          setIsLoading(false);
          onPlayPause(false);
        });

        audio.addEventListener('canplay', () => {
          console.log('✅ Áudio pronto para tocar');
          setAudioError(false);
          setIsLoading(false);
        });

        // Carregar o áudio
        audio.src = track.preview_url;
        audioRef.current = audio;
        
      } catch (error) {
        console.error('❌ Erro ao criar áudio:', error);
        setAudioError(true);
        setIsLoading(false);
      }
    } else {
      // Sem preview_url - usar simulação
      console.log(`🎵 Música sem preview - usando simulação: ${track.title}`);
      setDuration(track.duration);
      setAudioError(false);
      setIsLoading(false);
      setCurrentTime(0);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [track?.id, track?.preview_url]);

  // Simular progresso para músicas sem preview
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (track && !track.preview_url && isPlaying && !audioError) {
      console.log('🎵 Iniciando simulação de reprodução');
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            console.log('🔚 Simulação de música terminou');
            onPlayPause(false);
            if (onTrackEnd) {
              onTrackEnd();
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [track?.preview_url, isPlaying, duration, audioError, onPlayPause, onTrackEnd]);

  // Controlar play/pause para áudio real
  useEffect(() => {
    if (audioRef.current && track?.preview_url && !audioError && !isLoading) {
      if (isPlaying) {
        console.log('▶️ Iniciando reprodução de áudio real');
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('❌ Erro ao tocar:', error);
            setAudioError(true);
            onPlayPause(false);
          });
        }
      } else {
        console.log('⏸️ Pausando reprodução de áudio real');
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioError, isLoading, track?.preview_url]);

  // Controlar volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    
    if (audioRef.current && track?.preview_url) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-black bg-opacity-80 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{track.title}</h3>
          <p className="text-gray-300">{track.artist}</p>
          {isLoading && (
            <p className="text-blue-400 text-sm">🔄 Carregando música...</p>
          )}
          {audioError && track.preview_url && (
            <p className="text-red-400 text-sm">⚠️ Erro no áudio - usando simulação</p>
          )}
          {!track.preview_url && (
            <p className="text-yellow-400 text-sm">🎵 Música de demonstração - sem áudio real</p>
          )}
          {track.preview_url && !audioError && !isLoading && (
            <p className="text-green-400 text-sm">🎵 Áudio real carregado</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onPlayPause(!isPlaying)}
            disabled={isLoading}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={1}
          className="w-full"
          disabled={isLoading}
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="text-white p-2"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          onValueChange={(value) => {
            if (onVolumeChange) {
              onVolumeChange(value[0] / 100);
            }
            if (value[0] > 0) {
              setIsMuted(false);
            }
          }}
          max={100}
          step={1}
          className="w-24"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
