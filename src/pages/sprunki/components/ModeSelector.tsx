
import React from 'react';
import { GameMode } from '../types/sensorSync';
import { gameModes } from '../utils/colorTheory';

interface ModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Object.values(gameModes).map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode)}
          className={`
            p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
            ${currentMode.id === mode.id 
              ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30 shadow-lg scale-105' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
            }
          `}
          style={{
            background: currentMode.id === mode.id 
              ? `linear-gradient(135deg, ${mode.colorPalette[0]}20, ${mode.colorPalette[1]}20)`
              : undefined
          }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">
              {mode.id === 'calm' && '🌊'}
              {mode.id === 'energy' && '⚡'}
              {mode.id === 'focus' && '🎯'}
              {mode.id === 'creative' && '🎨'}
            </div>
            <div className="font-bold text-sm mb-1">{mode.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {mode.description}
            </div>
            
            {/* Color palette preview */}
            <div className="flex justify-center gap-1 mt-2">
              {mode.colorPalette.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
