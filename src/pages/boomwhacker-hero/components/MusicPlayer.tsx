
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, RotateCcw, SkipForward } from 'lucide-react';
import { MusicTrack } from '../utils/musicAPIs';

interface MusicPlayerProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onTrackEnd?: () => void;
  onTrackFailed?: () => void;
  onTimeUpdate?: (time: number) => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onTrackEnd,
  onTrackFailed,
  onTimeUpdate,
  volume = 0.5,
  onVolumeChange
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'loading' | 'ready' | 'error' | 'none'>('none');
  const [loadAttempts, setLoadAttempts] = useState(0);
  const simulationIntervalRef = useRef<NodeJS.Timeout>();

  // Limpar áudio anterior
  const cleanupAudio = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = undefined;
    }
    
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

  // Event handlers melhorados
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      console.log(`✅ Áudio carregado: ${track?.title} - ${audioRef.current.duration}s`);
      setDuration(audioRef.current.duration || track?.duration || 0);
      setAudioStatus('ready');
      setLoadAttempts(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
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
    const error = e.target as HTMLAudioElement;
    console.error('❌ Erro no áudio:', error.error);
    
    setLoadAttempts(prev => prev + 1);
    
    // Tentar novamente até 2 vezes
    if (loadAttempts < 2 && track?.preview_url) {
      console.log(`🔄 Tentativa ${loadAttempts + 1} de carregar áudio...`);
      setTimeout(() => {
        initializeAudio();
      }, 1000);
    } else {
      console.log('❌ Falha definitiva no carregamento do áudio');
      setAudioStatus('error');
      onPlayPause(false);
      
      if (onTrackFailed) {
        onTrackFailed();
      }
    }
  };

  const handleCanPlay = () => {
    console.log('✅ Áudio pronto para reprodução');
    setAudioStatus('ready');
  };

  // Inicializar áudio com tratamento robusto
  const initializeAudio = () => {
    if (!track) {
      setDuration(0);
      setCurrentTime(0);
      setAudioStatus('none');
      return;
    }

    console.log(`🎵 Inicializando: ${track.title} (${track.source})`);
    cleanupAudio();

    if (!track.preview_url) {
      console.log(`⚠️ Sem preview URL para: ${track.title}`);
      setDuration(track.duration);
      setAudioStatus('error');
      setCurrentTime(0);
      return;
    }

    try {
      setAudioStatus('loading');
      
      const audio = new Audio();
      
      // Configurações otimizadas para CORS e streaming
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      audio.volume = isMuted ? 0 : volume;
      
      // Event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);
      
      // Timeout para forçar carregamento
      const timeoutId = setTimeout(() => {
        if (audioRef.current && audioRef.current.readyState < 2) {
          console.log('⏰ Timeout no carregamento');
          handleError(new Event('timeout'));
        }
      }, 8000);
      
      audio.addEventListener('canplay', () => {
        clearTimeout(timeoutId);
      }, { once: true });
      
      // Carregar áudio
      audio.src = track.preview_url;
      audioRef.current = audio;
      audio.load();
      
    } catch (error) {
      console.error('❌ Erro ao criar áudio:', error);
      setAudioStatus('error');
    }
  };

  // Controlar reprodução
  const handlePlayPause = async () => {
    if (!track) return;

    if (audioStatus === 'ready' && audioRef.current) {
      try {
        if (isPlaying) {
          console.log('⏸️ Pausando');
          audioRef.current.pause();
        } else {
          console.log('▶️ Reproduzindo');
          await audioRef.current.play();
        }
        onPlayPause(!isPlaying);
      } catch (error) {
        console.error('❌ Erro na reprodução:', error);
        setAudioStatus('error');
        if (onTrackFailed) {
          onTrackFailed();
        }
      }
    }
  };

  const handleSkip = () => {
    console.log('⏭️ Pulando música');
    if (onTrackFailed) {
      onTrackFailed();
    }
  };

  const handleRetry = () => {
    console.log('🔄 Tentando novamente...');
    setLoadAttempts(0);
    setAudioStatus('none');
    initializeAudio();
  };

  // Efeitos
  useEffect(() => {
    initializeAudio();
    return cleanupAudio;
  }, [track?.id, track?.preview_url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    
    if (audioRef.current && audioStatus === 'ready') {
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

  const getStatusDisplay = () => {
    switch (audioStatus) {
      case 'loading':
        return { text: '🔄 Carregando áudio...', color: 'text-blue-400', showSpinner: true };
      case 'error':
        return { text: '⚠️ Erro no áudio', color: 'text-red-400', showSpinner: false };
      case 'ready':
        return { text: '🎵 Pronto para tocar', color: 'text-green-400', showSpinner: false };
      default:
        return { text: '', color: '', showSpinner: false };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="bg-black bg-opacity-80 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{track.title}</h3>
          <p className="text-gray-300">{track.artist}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-sm ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
            {audioStatus === 'error' && (
              <div className="flex gap-1">
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  className="text-xs h-6 px-2"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Tentar novamente
                </Button>
                <Button
                  onClick={handleSkip}
                  size="sm"
                  variant="outline"
                  className="text-xs h-6 px-2"
                >
                  <SkipForward className="w-3 h-3 mr-1" />
                  Próxima música
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayPause}
            disabled={audioStatus === 'loading'}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
          >
            {statusDisplay.showSpinner ? (
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
          disabled={audioStatus !== 'ready'}
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
