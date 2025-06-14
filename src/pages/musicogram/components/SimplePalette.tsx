
import React from 'react';
import { SimpleInstrument } from '../types/simple';
import { realisticAudio } from '../utils/realisticAudioService';

interface SimplePaletteProps {
  instruments: SimpleInstrument[];
  selectedInstrument: string | null;
  onSelectInstrument: (instrumentId: string) => void;
}

const SimplePalette: React.FC<SimplePaletteProps> = ({
  instruments,
  selectedInstrument,
  onSelectInstrument
}) => {
  const handleInstrumentClick = async (instrument: SimpleInstrument) => {
    onSelectInstrument(instrument.id);
    await realisticAudio.playRealisticNote(instrument.id, instrument.frequency, 0.8);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        🎵 Instrumentos Realistas
      </h3>
      
      <div className="space-y-2">
        {instruments.map((instrument) => (
          <button
            key={instrument.id}
            onClick={() => handleInstrumentClick(instrument)}
            className={`
              w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3
              hover:scale-105 active:scale-95 hover:shadow-md
              ${selectedInstrument === instrument.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg' 
                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              }
            `}
            style={{
              borderColor: selectedInstrument === instrument.id ? instrument.color : undefined,
              boxShadow: selectedInstrument === instrument.id ? `0 0 20px ${instrument.color}40` : undefined
            }}
          >
            <span className="text-2xl">{instrument.emoji}</span>
            <div className="text-left">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {instrument.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(instrument.frequency)}Hz • Clique para ouvir
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
          💡 Sons realistas com síntese avançada!
        </p>
      </div>
    </div>
  );
};

export default SimplePalette;
