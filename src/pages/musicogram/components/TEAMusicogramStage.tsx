
import React from 'react';
import { StageCell, AnimalInstrument } from '../types/tea';
import { teaAudio } from '../utils/teaAudioService';

interface TEAMusicogramStageProps {
  stage: StageCell[][];
  animals: AnimalInstrument[];
  selectedAnimal: string | null;
  onCellClick: (row: number, col: number) => void;
  isPlaying: boolean;
  currentColumn: number;
  calmMode: boolean;
}

const TEAMusicogramStage: React.FC<TEAMusicogramStageProps> = ({
  stage,
  animals,
  selectedAnimal,
  onCellClick,
  isPlaying,
  currentColumn,
  calmMode
}) => {
  const getAnimal = (animalId: string | null) => {
    return animals.find(a => a.id === animalId);
  };

  const handleCellClick = async (row: number, col: number) => {
    if (isPlaying) return;
    
    onCellClick(row, col);
    
    // Tocar som quando animal é colocado/removido
    const cell = stage[row][col];
    if (cell.animalId) {
      const animal = getAnimal(cell.animalId);
      if (animal && teaAudio.getInitialized()) {
        try {
          await teaAudio.playAnimalSound(animal.id, animal.frequency, 0.6);
        } catch (error) {
          console.warn('Erro ao tocar som:', error);
        }
      }
    }
  };

  const getStageBackground = () => {
    if (calmMode) {
      return 'bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 dark:from-green-900/10 dark:via-blue-900/10 dark:to-purple-900/10';
    }
    return 'bg-gradient-to-br from-yellow-100 via-green-100 via-blue-100 to-purple-100 dark:from-yellow-900/20 dark:via-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20';
  };

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-b from-sky-50 to-green-50 dark:from-sky-900/10 dark:to-green-900/10 min-h-0 overflow-auto">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Stage Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
            🎭 Palco Musical dos Animais
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
            {selectedAnimal ? (
              <>Coloque o <strong>{animals.find(a => a.id === selectedAnimal)?.name}</strong> no palco!</>
            ) : (
              'Escolha um animal da orquestra para começar'
            )}
          </p>
        </div>

        {/* Musical Stage */}
        <div className={`${getStageBackground()} p-4 sm:p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 dark:border-yellow-600 relative overflow-hidden flex-1 min-h-0`}>
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-2xl sm:text-4xl opacity-30">🌟</div>
          <div className="absolute top-4 right-4 text-2xl sm:text-4xl opacity-30">🎪</div>
          <div className="absolute bottom-4 left-4 text-2xl sm:text-4xl opacity-30">🌈</div>
          <div className="absolute bottom-4 right-4 text-2xl sm:text-4xl opacity-30">🎊</div>
          
          {/* Stage Grid Container */}
          <div className="bg-white/50 dark:bg-gray-800/50 p-3 sm:p-6 rounded-2xl backdrop-blur-sm relative z-10 h-full flex items-center justify-center">
            <div className="w-full max-w-6xl overflow-auto">
              {/* Stage Grid */}
              <div className="grid grid-cols-16 gap-1 sm:gap-2 mx-auto" style={{ width: 'fit-content' }}>
                {stage.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const animal = getAnimal(cell.animalId);
                    const isCurrentColumn = isPlaying && currentColumn === colIndex;
                    const hasAnimal = !!cell.animalId;
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
                          w-8 h-8 sm:w-12 sm:h-12 rounded-xl cursor-pointer transition-all
                          flex items-center justify-center text-lg sm:text-2xl
                          border-2 sm:border-3 relative overflow-hidden
                          ${calmMode ? 'duration-500 hover:scale-105' : 'duration-200 hover:scale-110 active:scale-95'}
                          ${isCurrentColumn ? 'ring-2 sm:ring-4 ring-yellow-400 ring-opacity-75 animate-pulse shadow-2xl' : ''}
                          ${hasAnimal 
                            ? 'border-gray-300 dark:border-gray-600 shadow-lg' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white/70 dark:bg-gray-700/70'
                          }
                          ${isPlaying ? 'pointer-events-none' : ''}
                        `}
                        style={{
                          backgroundColor: animal ? `${animal.color}40` : undefined,
                          borderColor: animal ? animal.color : undefined,
                          boxShadow: animal && isCurrentColumn ? `0 0 15px sm:0 0 25px ${animal.color}80` : undefined
                        }}
                      >
                        {animal && (
                          <div className="relative">
                            <div className="text-lg sm:text-2xl filter drop-shadow-sm">
                              {animal.emoji}
                            </div>
                            {isCurrentColumn && (
                              <div className="absolute -top-1 -right-1 text-sm sm:text-lg animate-bounce">
                                ✨
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Subtle stage lighting effect */}
                        {isCurrentColumn && (
                          <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/30 to-transparent rounded-xl pointer-events-none"></div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stage Instructions */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-4 bg-white dark:bg-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border-2 border-blue-200 dark:border-blue-700">
            <span className="text-lg sm:text-2xl">🎵</span>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              {isPlaying ? 'Apresentação em andamento! 🎭' : 'Arranje os animais para criar sua música mágica!'}
            </div>
            {!calmMode && <span className="text-lg sm:text-2xl animate-pulse">🌟</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TEAMusicogramStage;
