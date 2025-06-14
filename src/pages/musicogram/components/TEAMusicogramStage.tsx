
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
          await teaAudio.playAnimalSound(animal.id, animal.frequency, 0.4);
        } catch (error) {
          console.log('Som não disponível, continuando silenciosamente');
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
    <div className="flex-1 p-3 sm:p-6 bg-gradient-to-b from-sky-50 to-green-50 dark:from-sky-900/10 dark:to-green-900/10 min-h-0 overflow-auto">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Stage Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
            🎭 Palco Musical dos Animais
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {selectedAnimal ? (
              <>Coloque o <strong>{animals.find(a => a.id === selectedAnimal)?.name}</strong> no palco!</>
            ) : (
              'Escolha um animal da orquestra para começar'
            )}
          </p>
        </div>

        {/* Musical Stage */}
        <div className={`${getStageBackground()} p-4 sm:p-6 rounded-2xl shadow-xl border-3 border-yellow-300 dark:border-yellow-600 relative overflow-hidden flex-1 min-h-0`}>
          {/* Decorative elements */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xl sm:text-3xl opacity-30">🌟</div>
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-3xl opacity-30">🎪</div>
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-xl sm:text-3xl opacity-30">🌈</div>
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-xl sm:text-3xl opacity-30">🎊</div>
          
          {/* Stage Grid Container */}
          <div className="bg-white/60 dark:bg-gray-800/60 p-3 sm:p-4 rounded-xl backdrop-blur-sm relative z-10 h-full flex items-center justify-center">
            <div className="w-full overflow-auto">
              {/* Stage Grid - Agora 4x8 */}
              <div className="grid grid-cols-8 gap-2 sm:gap-3 mx-auto max-w-2xl">
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
                          w-12 h-12 sm:w-16 sm:h-16 rounded-xl cursor-pointer transition-all
                          flex items-center justify-center text-xl sm:text-2xl
                          border-2 sm:border-3 relative overflow-hidden
                          ${calmMode ? 'duration-500 hover:scale-105' : 'duration-200 hover:scale-110 active:scale-95'}
                          ${isCurrentColumn ? 'ring-3 sm:ring-4 ring-yellow-400 ring-opacity-75 animate-pulse shadow-xl' : ''}
                          ${hasAnimal 
                            ? 'border-gray-300 dark:border-gray-600 shadow-lg' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white/70 dark:bg-gray-700/70'
                          }
                          ${isPlaying ? 'pointer-events-none' : ''}
                        `}
                        style={{
                          backgroundColor: animal ? `${animal.color}50` : undefined,
                          borderColor: animal ? animal.color : undefined,
                          boxShadow: animal && isCurrentColumn ? `0 0 20px ${animal.color}80` : undefined
                        }}
                      >
                        {animal && (
                          <div className="relative">
                            <div className="text-lg sm:text-2xl filter drop-shadow-sm">
                              {animal.emoji}
                            </div>
                            {isCurrentColumn && (
                              <div className="absolute -top-1 -right-1 text-sm animate-bounce">
                                ✨
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Efeito de iluminação do palco */}
                        {isCurrentColumn && (
                          <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/40 to-transparent rounded-xl pointer-events-none"></div>
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
        <div className="mt-3 sm:mt-4 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg border-2 border-blue-200 dark:border-blue-700">
            <span className="text-lg sm:text-xl">🎵</span>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              {isPlaying ? 'Apresentação em andamento! 🎭' : 'Arranje os animais para criar sua música!'}
            </div>
            {!calmMode && <span className="text-lg sm:text-xl animate-pulse">🌟</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TEAMusicogramStage;
