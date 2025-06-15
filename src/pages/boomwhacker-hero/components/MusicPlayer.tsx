
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
  const [audioStatus, setAudioStatus] = useState<'loading' | 'ready' | 'error' | 'none' | 'simulation'>('none');
  const [errorMessage, setErrorMessage] = useState<string>('');
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

  // Event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      console.log(`✅ Áudio carregado com sucesso - Duração: ${audioRef.current.duration}s`);
      setDuration(audioRef.current.duration || track?.duration || 0);
      setAudioStatus('ready');
      setErrorMessage('Áudio carregado!');
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
    console.error('❌ Erro no áudio - Modo simulação ativado');
    setAudioStatus('simulation');
    setErrorMessage('Modo simulação (sem áudio)');
    onPlayPause(false);
  };

  const handleCanPlay = () => {
    console.log('✅ Áudio pronto para reprodução');
    setAudioStatus('ready');
    setErrorMessage('Áudio carregado!');
  };

  // Inicializar áudio com fallback para simulação
  const initializeAudio = () => {
    if (!track) {
      setDuration(0);
      setCurrentTime(0);
      setAudioStatus('none');
      setErrorMessage('');
      return;
    }

    console.log(`🎵 Carregando música: ${track.title} (${track.source})`);
    cleanupAudio();

    // Se não tem preview_url ou é synthesized, usar modo simulação
    if (!track.preview_url || track.source === 'synthesized') {
      console.log(`🎵 Modo simulação para: ${track.title}`);
      setDuration(track.duration);
      setAudioStatus('simulation');
      setCurrentTime(0);
      setErrorMessage('Modo simulação');
      return;
    }

    // Tentar carregar áudio real
    try {
      console.log(`🎵 Tentando carregar áudio de: ${track.preview_url}`);
      setAudioStatus('loading');
      setErrorMessage('Carregando áudio...');
      
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
      
      // Configurar timeout para fallback
      const timeoutId = setTimeout(() => {
        console.log('⏰ Timeout no carregamento - usando simulação');
        handleError(new Event('timeout'));
      }, 5000);
      
      // Limpar timeout se carregar com sucesso
      audio.addEventListener('canplay', () => {
        clearTimeout(timeoutId);
      }, { once: true });
      
      // Carregar o áudio
      audio.src = track.preview_url;
      audioRef.current = audio;
      audio.load();
      
    } catch (error) {
      console.error('❌ Erro ao criar áudio:', error);
      handleError(new Event('creation-error'));
    }
  };

  // Controlar play/pause
  const handlePlayPause = async () => {
    if (!track) return;

    if (audioStatus === 'ready' && audioRef.current) {
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
        handleError(new Event('playback-error'));
      }
    } else if (audioStatus === 'simulation') {
      // Para modo simulação, apenas alternar estado
      onPlayPause(!isPlaying);
    }
  };

  // Função para pular música
  const handleSkip = () => {
    console.log('⏭️ Pulando música atual');
    if (onTrackFailed) {
      onTrackFailed();
    }
  };

  // Efeito principal para inicializar áudio
  useEffect(() => {
    initializeAudio();
    return cleanupAudio;
  }, [track?.id, track?.preview_url]);

  // Controlar volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Simular progresso para modo simulação
  useEffect(() => {
    if (track && audioStatus === 'simulation' && isPlaying && duration > 0) {
      console.log('🎵 Iniciando simulação de reprodução');
      simulationIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
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
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = undefined;
      }
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = undefined;
      }
    };
  }, [track?.preview_url, isPlaying, duration, audioStatus, onPlayPause, onTrackEnd]);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    
    if (audioRef.current && audioStatus === 'ready') {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleRetry = () => {
    setErrorMessage('');
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

  const getStatusDisplay = () => {
    switch (audioStatus) {
      case 'loading':
        return { text: '🔄 Carregando...', color: 'text-blue-400', showSpinner: true };
      case 'error':
        return { text: '⚠️ Erro no áudio', color: 'text-red-400', showSpinner: false };
      case 'ready':
        return { text: '🎵 Áudio carregado', color: 'text-green-400', showSpinner: false };
      case 'simulation':
        return { text: '🎮 Modo jogo (sem áudio)', color: 'text-yellow-400', showSpinner: false };
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
                  Pular música
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
