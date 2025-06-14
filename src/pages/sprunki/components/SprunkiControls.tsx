
import React from 'react';
import { SprunkiSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Play, Square, Trash2, Save, Volume2, VolumeX, Settings, Eye, EyeOff } from 'lucide-react';

interface SprunkiControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onClear: () => void;
  onSave: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  settings: SprunkiSettings;
  onSettingsChange: (settings: Partial<SprunkiSettings>) => void;
}

const SprunkiControls: React.FC<SprunkiControlsProps> = ({
  isPlaying,
  onPlay,
  onStop,
  onClear,
  onSave,
  bpm,
  onBpmChange,
  volume,
  onVolumeChange,
  settings,
  onSettingsChange
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border-b-2 border-purple-200 dark:border-purple-700 p-3 sm:p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Main Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={isPlaying ? onStop : onPlay}
              className={`${
                isPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Tocar
                </>
              )}
            </Button>
            
            <Button
              onClick={onClear}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 px-4 py-2 rounded-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            
            <Button
              onClick={onSave}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 px-4 py-2 rounded-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>

          {/* BPM Control */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              BPM: {bpm}
            </span>
            <Slider
              value={[bpm]}
              onValueChange={(value) => onBpmChange(value[0])}
              min={60}
              max={200}
              step={5}
              className="flex-1 max-w-32"
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => onSettingsChange({ visualFeedbackOnly: !settings.visualFeedbackOnly })}
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {settings.visualFeedbackOnly ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              min={0}
              max={1}
              step={0.1}
              className="w-16 sm:w-20"
              disabled={settings.visualFeedbackOnly}
            />
          </div>

          {/* Settings Toggle */}
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Settings */}
        {showSettings && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 sm:p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Configurações de Acessibilidade
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Modo Sensorial
                </label>
                <Switch
                  checked={settings.sensoryMode}
                  onCheckedChange={(checked) => onSettingsChange({ sensoryMode: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrar Animações
                </label>
                <Switch
                  checked={settings.showAnimations}
                  onCheckedChange={(checked) => onSettingsChange({ showAnimations: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Volumes Individuais
                </label>
                <Switch
                  checked={settings.individualVolumes}
                  onCheckedChange={(checked) => onSettingsChange({ individualVolumes: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Salvamento Automático
                </label>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => onSettingsChange({ autoSave: checked })}
                />
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 Dica: O modo sensorial reduz animações e efeitos para uma experiência mais calma
              </p>
            </div>
          </div>
        )}

        {/* Quick Status */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className={`flex items-center gap-1 ${settings.sensoryMode ? 'text-blue-600' : ''}`}>
            <Eye className="w-3 h-3" />
            {settings.sensoryMode ? 'Modo Calmo' : 'Modo Normal'}
          </span>
          <span className={`flex items-center gap-1 ${settings.visualFeedbackOnly ? 'text-yellow-600' : ''}`}>
            {settings.visualFeedbackOnly ? <EyeOff className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            {settings.visualFeedbackOnly ? 'Apenas Visual' : 'Com Som'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SprunkiControls;
