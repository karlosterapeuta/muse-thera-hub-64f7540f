
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Trash2, Save, Volume2, VolumeX, Moon, Sun } from 'lucide-react';

interface TEAControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onClear: () => void;
  onSave: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  calmMode: boolean;
  onToggleCalmMode: () => void;
}

const TEAControls: React.FC<TEAControlsProps> = ({
  isPlaying,
  onPlay,
  onStop,
  onClear,
  onSave,
  tempo,
  onTempoChange,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  calmMode,
  onToggleCalmMode
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-b-4 border-purple-200 dark:border-purple-700 p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Main Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={isPlaying ? onStop : onPlay}
              size="lg"
              className={`
                text-white font-bold px-6 py-3 rounded-full shadow-lg transform transition-all duration-200
                ${isPlaying 
                  ? 'bg-red-500 hover:bg-red-600 hover:scale-105' 
                  : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                }
                ${calmMode ? 'hover:scale-102' : 'active:scale-95'}
              `}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Parar Show
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Começar Show
                </>
              )}
            </Button>

            <Button
              onClick={onClear}
              variant="outline"
              size="lg"
              disabled={isPlaying}
              className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium px-4 py-3 rounded-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Palco
            </Button>

            <Button
              onClick={onSave}
              variant="outline"
              size="lg"
              disabled={isPlaying}
              className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium px-4 py-3 rounded-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Música
            </Button>
          </div>

          {/* Settings */}
          <div className="flex items-center gap-6">
            {/* Calm Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                onClick={onToggleCalmMode}
                variant="outline"
                size="sm"
                className={`
                  px-4 py-2 rounded-full border-2 font-medium transition-all duration-300
                  ${calmMode 
                    ? 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                {calmMode ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                {calmMode ? 'Modo Calmo' : 'Modo Normal'}
              </Button>
            </div>

            {/* Tempo Control */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                🎵 Velocidade:
              </span>
              <Slider
                value={[tempo]}
                onValueChange={(value) => onTempoChange(value[0])}
                min={60}
                max={160}
                step={10}
                className="w-24"
                disabled={isPlaying}
              />
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400 min-w-[3rem]">
                {tempo}
              </span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600">
              <Button
                onClick={onToggleMute}
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-green-600" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={(value) => onVolumeChange(value[0] / 100)}
                max={60}
                step={5}
                className="w-20"
                disabled={isMuted}
              />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[2rem]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 px-6 py-2 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {isPlaying ? 'Tocando' : 'Parado'}
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-gray-600 dark:text-gray-400">
                {calmMode ? '🌙 Modo Calmo Ativo' : '☀️ Modo Normal'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TEAControls;
