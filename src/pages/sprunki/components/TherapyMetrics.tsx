
import React from 'react';
import { TherapyMetrics } from '../types/sensorSync';
import { Clock, MousePointer, Activity, Palette } from 'lucide-react';

interface TherapyMetricsProps {
  metrics: TherapyMetrics;
}

const TherapyMetrics: React.FC<TherapyMetricsProps> = ({ metrics }) => {
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity < 0.3) return 'text-blue-600';
    if (intensity < 0.7) return 'text-green-600';
    return 'text-orange-600';
  };

  const getIntensityLabel = (intensity: number): string => {
    if (intensity < 0.3) return 'Calmo';
    if (intensity < 0.7) return 'Moderado';
    return 'Intenso';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-4">
        📊 Métricas Terapêuticas
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Session Duration */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Clock className="w-6 h-6 text-blue-600" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Duração</div>
            <div className="font-bold text-blue-700 dark:text-blue-300">
              {formatDuration(metrics.sessionDuration)}
            </div>
          </div>
        </div>

        {/* Movement Count */}
        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <MousePointer className="w-6 h-6 text-green-600" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Movimentos</div>
            <div className="font-bold text-green-700 dark:text-green-300">
              {metrics.movementCount}
            </div>
          </div>
        </div>

        {/* Average Intensity */}
        <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Activity className="w-6 h-6 text-orange-600" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Intensidade</div>
            <div className={`font-bold ${getIntensityColor(metrics.averageIntensity)}`}>
              {getIntensityLabel(metrics.averageIntensity)}
            </div>
          </div>
        </div>

        {/* Creative Patterns */}
        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Palette className="w-6 h-6 text-purple-600" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Criações</div>
            <div className="font-bold text-purple-700 dark:text-purple-300">
              {metrics.creativePatterns}
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="mt-4 space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">Engajamento</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(100, (metrics.movementCount / 50) * 100)}%` 
            }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right">
          {Math.round((metrics.movementCount / 50) * 100)}% do objetivo
        </div>
      </div>

      {/* Session feedback */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="text-sm text-center">
          {metrics.movementCount > 30 ? (
            <span className="text-green-700 dark:text-green-300">
              🎉 Excelente engajamento!
            </span>
          ) : metrics.movementCount > 15 ? (
            <span className="text-blue-700 dark:text-blue-300">
              👍 Boa participação!
            </span>
          ) : (
            <span className="text-gray-600 dark:text-gray-400">
              💫 Continue explorando!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyMetrics;
