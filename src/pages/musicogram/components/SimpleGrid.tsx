
import React from 'react';
import { GridCell, SimpleInstrument } from '../types/simple';
import { realisticAudio } from '../utils/realisticAudioService';

interface SimpleGridProps {
  grid: GridCell[][];
  instruments: SimpleInstrument[];
  selectedInstrument: string | null;
  onCellClick: (row: number, col: number) => void;
  isPlaying: boolean;
  currentColumn: number;
}

const SimpleGrid: React.FC<SimpleGridProps> = ({
  grid,
  instruments,
  selectedInstrument,
  onCellClick,
  isPlaying,
  currentColumn
}) => {
  const getInstrument = (instrumentId: string | null) => {
    return instruments.find(i => i.id === instrumentId);
  };

  const handleCellClick = async (row: number, col: number) => {
    if (isPlaying) return;
    
    onCellClick(row, col);
    
    const cell = grid[row][col];
    if (cell.instrumentId) {
      const instrument = getInstrument(cell.instrumentId);
      if (instrument) {
        await realisticAudio.playRealisticNote(instrument.id, instrument.frequency, 0.6);
      }
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-16 gap-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const instrument = getInstrument(cell.instrumentId);
              const isCurrentColumn = isPlaying && currentColumn === colIndex;
              const hasInstrument = !!cell.instrumentId;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    w-10 h-10 border-2 rounded-lg cursor-pointer transition-all duration-200
                    flex items-center justify-center text-lg
                    hover:scale-110 active:scale-95
                    ${isCurrentColumn ? 'ring-4 ring-blue-400 ring-opacity-50 animate-pulse' : ''}
                    ${hasInstrument 
                      ? 'border-gray-300 dark:border-gray-600 shadow-sm' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }
                    ${isPlaying ? 'pointer-events-none' : ''}
                  `}
                  style={{
                    backgroundColor: instrument ? `${instrument.color}30` : 'transparent',
                    borderColor: instrument ? instrument.color : undefined,
                    boxShadow: instrument && isCurrentColumn ? `0 0 15px ${instrument.color}60` : undefined
                  }}
                >
                  {instrument && (
                    <span className="drop-shadow-sm filter">
                      {instrument.emoji}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedInstrument ? (
              <>Clique nas células para adicionar <strong>{instruments.find(i => i.id === selectedInstrument)?.name}</strong></>
            ) : (
              'Selecione um instrumento da paleta para começar'
            )}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            🎵 Agora com sons realistas de instrumentos!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGrid;
