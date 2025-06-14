
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save, Volume2, VolumeX } from 'lucide-react';

interface SimpleControlsProps {
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
}

const SimpleControls: React.FC<SimpleControlsProps> = ({
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
  onToggleMute
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Controles de Reprodução */}
        <div className="flex items-center gap-3">
          <Button
            onClick={isPlaying ? onStop : onPlay}
            size="lg"
            className={`${
              isPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Parar' : 'Reproduzir'}
          </Button>
          
          <Button variant="outline" onClick={onClear}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
          
          <Button variant="outline" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>

        {/* Controles de Tempo e Volume */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tempo:
            </label>
            <input
              type="range"
              min="60"
              max="180"
              value={tempo}
              onChange={(e) => onTempoChange(Number(e.target.value))}
              className="w-20"
              disabled={isPlaying}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
              {tempo} BPM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMute}
              className="p-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              className="w-20"
              disabled={isMuted}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleControls;
