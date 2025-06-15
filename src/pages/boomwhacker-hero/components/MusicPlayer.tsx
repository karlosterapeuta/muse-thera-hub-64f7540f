
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
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
  const [audioStatus, setAudioStatus] = useState<'loading' | 'ready' | 'error' | 'none'>('none');
  const [retryCount, setRetryCount] = useState(0);

  // Limpar áudio anterior
  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('canplay', handleCanPlay);
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  // Event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      console.log(`✅ Áudio carregado - Duração: ${audioRef.current.duration}s`);
      setDuration(audioRef.current.duration || track?.duration || 0);
      setAudioStatus('ready');
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    console.log('🔚 Música terminou');
    setCurrentTime(0);
    onPlayPause(false);
    if (onTrackEnd) {
      onTrackEnd();
    }
  };

  const handleError = (e: Event) => {
    console.error('❌ Erro no áudio:', e);
    setAudioStatus('error');
    onPlayPause(false);
    
    // Tentar novamente após erro (máximo 2 tentativas)
    if (retryCount < 2 && track?.preview_url) {
      console.log(`🔄 Tentativa ${retryCount + 1} de recarregar áudio`);
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        initializeAudio();
      }, 1000);
    }
  };

  const handleCanPlay = () => {
    console.log('✅ Áudio pronto para tocar');
    setAudioStatus('ready');
  };

  // Inicializar áudio
  const initializeAudio = () => {
    if (!track) {
      setDuration(0);
      setCurrentTime(0);
      setAudioStatus('none');
      return;
    }

    console.log(`🎵 Carregando música: ${track.title}`);
    cleanupAudio();

    if (track.preview_url) {
      console.log(`🎵 Carregando áudio: ${track.preview_url}`);
      setAudioStatus('loading');
      
      try {
        const audio = new Audio();
        
        // Configurar áudio
        audio.crossOrigin = "anonymous";
        audio.preload = "metadata";
        audio.volume = isMuted ? 0 : volume;
        
        // Adicionar event listeners
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);
        
        // Carregar o áudio
        audio.src = track.preview_url;
        audioRef.current = audio;
        
      } catch (error) {
        console.error('❌ Erro ao criar áudio:', error);
        setAudioStatus('error');
      }
    } else {
      // Sem preview_url - usar duração da música
      console.log(`🎵 Música sem preview: ${track.title}`);
      setDuration(track.duration);
      setAudioStatus('ready');
      setCurrentTime(0);
    }
  };

  // Controlar play/pause
  const handlePlayPause = async () => {
    if (!track) return;

    if (track.preview_url && audioRef.current && audioStatus === 'ready') {
      try {
        if (isPlaying) {
          console.log('⏸️ Pausando reprodução');
          audioRef.current.pause();
        } else {
          console.log('▶️ Iniciando reprodução');
          await audioRef.current.play();
        }
        onPlayPause(!isPlaying);
      } catch (error) {
        console.error('❌ Erro ao controlar reprodução:', error);
        setAudioStatus('error');
      }
    } else {
      // Para músicas sem preview, apenas alternar estado
      onPlayPause(!isPlaying);
    }
  };

  // Efeito principal para inicializar áudio
  useEffect(() => {
    setRetryCount(0);
    initializeAudio();
    return cleanupAudio;
  }, [track?.id, track?.preview_url]);

  // Controlar volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Simular progresso para músicas sem preview
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (track && !track.preview_url && isPlaying && audioStatus === 'ready') {
      console.log('🎵 Iniciando simulação de reprodução');
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            console.log('🔚 Simulação terminou');
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
  }, [track?.preview_url, isPlaying, duration, audioStatus, onPlayPause, onTrackEnd]);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    
    if (audioRef.current && track?.preview_url) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleRetry = () => {
    setRetryCount(0);
    initializeAudio();
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

  const getStatusMessage = () => {
    switch (audioStatus) {
      case 'loading':
        return { text: '🔄 Carregando música...', color: 'text-blue-400' };
      case 'error':
        return { text: '⚠️ Erro no áudio - clique para tentar novamente', color: 'text-red-400' };
      case 'ready':
        if (track.preview_url) {
          return { text: '🎵 Áudio real carregado', color: 'text-green-400' };
        } else {
          return { text: '🎵 Música de demonstração', color: 'text-yellow-400' };
        }
      default:
        return { text: '', color: '' };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="bg-black bg-opacity-80 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{track.title}</h3>
          <p className="text-gray-300">{track.artist}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm ${statusMessage.color}`}>
              {statusMessage.text}
            </span>
            {audioStatus === 'error' && (
              <Button
                onClick={handleRetry}
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Tentar novamente
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayPause}
            disabled={audioStatus === 'loading'}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
          >
            {audioStatus === 'loading' ? (
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
          disabled={audioStatus === 'loading'}
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
