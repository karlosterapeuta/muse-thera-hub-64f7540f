
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

  // Inicializar áudio quando track muda
  useEffect(() => {
    if (track?.preview_url) {
      console.log(`🎵 Carregando áudio: ${track.title} - ${track.preview_url}`);
      
      // Limpar áudio anterior
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      try {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.preload = "auto";
        audio.volume = isMuted ? 0 : volume;
        
        // Event listeners
        audio.addEventListener('loadedmetadata', () => {
          console.log(`✅ Metadados carregados - Duração: ${audio.duration}s`);
          setDuration(audio.duration);
          setAudioError(false);
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
          onPlayPause(false);
        });

        audio.addEventListener('canplay', () => {
          console.log('✅ Áudio pronto para tocar');
          setAudioError(false);
        });

        audio.src = track.preview_url;
        audioRef.current = audio;
        
      } catch (error) {
        console.error('❌ Erro ao criar áudio:', error);
        setAudioError(true);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [track?.preview_url]);

  // Controlar play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !audioError) {
        console.log('▶️ Iniciando reprodução');
        audioRef.current.play().catch(error => {
          console.error('❌ Erro ao tocar:', error);
          setAudioError(true);
          onPlayPause(false);
        });
      } else {
        console.log('⏸️ Pausando reprodução');
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioError]);

  // Controlar volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
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
          {audioError && (
            <p className="text-red-400 text-sm">⚠️ Erro no áudio - usando música demo</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onPlayPause(!isPlaying)}
            disabled={audioError && !track.preview_url}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
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
