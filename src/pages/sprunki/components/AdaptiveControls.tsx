
import React from 'react';
import { SensorSyncSettings } from '../types/sensorSync';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Volume2, Eye, Zap, Settings } from 'lucide-react';

interface AdaptiveControlsProps {
  settings: SensorSyncSettings;
  onSettingsChange: (settings: Partial<SensorSyncSettings>) => void;
}

const AdaptiveControls: React.FC<AdaptiveControlsProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">
          Controles Adaptativos
        </h3>
      </div>

      <div className="space-y-4">
        {/* Audio Volume */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <label className="text-sm font-medium">Volume do Áudio</label>
          </div>
          <Slider
            value={[settings.audioVolume * 100]}
            onValueChange={(value) => onSettingsChange({ audioVolume: value[0] / 100 })}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">
            {Math.round(settings.audioVolume * 100)}%
          </div>
        </div>

        {/* Sensitivity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <label className="text-sm font-medium">Sensibilidade</label>
          </div>
          <Slider
            value={[settings.sensitivity * 100]}
            onValueChange={(value) => onSettingsChange({ sensitivity: value[0] / 100 })}
            max={200}
            step={10}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">
            {Math.round(settings.sensitivity * 100)}%
          </div>
        </div>

        {/* Visual Intensity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-green-600" />
            <label className="text-sm font-medium">Intensidade Visual</label>
          </div>
          <Slider
            value={[settings.visualIntensity * 100]}
            onValueChange={(value) => onSettingsChange({ visualIntensity: value[0] / 100 })}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="text-xs text-gray-500 text-right">
            {Math.round(settings.visualIntensity * 100)}%
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Rastros Visuais</label>
            <Switch
              checked={settings.showTrails}
              onCheckedChange={(checked) => onSettingsChange({ showTrails: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Feedback Tátil</label>
            <Switch
              checked={settings.enableVibration}
              onCheckedChange={(checked) => onSettingsChange({ enableVibration: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Adaptação Automática</label>
            <Switch
              checked={settings.autoAdaptive}
              onCheckedChange={(checked) => onSettingsChange({ autoAdaptive: checked })}
            />
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="text-sm font-medium mb-2">Presets Rápidos:</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSettingsChange({
              sensitivity: 0.5,
              visualIntensity: 0.3,
              audioVolume: 0.4,
              showTrails: true
            })}
            className="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            🌊 Relaxante
          </button>
          <button
            onClick={() => onSettingsChange({
              sensitivity: 1.2,
              visualIntensity: 0.9,
              audioVolume: 0.7,
              showTrails: false
            })}
            className="px-3 py-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            ⚡ Energético
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveControls;
