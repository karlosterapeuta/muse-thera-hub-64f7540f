
import React from 'react';
import { SprunkiSlot, SprunkiCharacter, SprunkiSettings } from '../types';

interface SprunkiStageProps {
  stage: SprunkiSlot[];
  characters: SprunkiCharacter[];
  selectedCharacter: string | null;
  onSlotClick: (slotIndex: number) => void;
  isPlaying: boolean;
  currentSlot: number;
  settings: SprunkiSettings;
}

const SprunkiStage: React.FC<SprunkiStageProps> = ({
  stage,
  characters,
  selectedCharacter,
  onSlotClick,
  isPlaying,
  currentSlot,
  settings
}) => {
  const getCharacter = (characterId: string | null) => {
    return characters.find(c => c.id === characterId);
  };

  const getStageBackground = () => {
    if (settings.sensoryMode) {
      return 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 dark:from-gray-900/10 dark:via-blue-900/10 dark:to-purple-900/10';
    }
    return 'bg-gradient-to-br from-purple-100 via-pink-100 via-blue-100 to-yellow-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:via-blue-900/20 dark:to-yellow-900/20';
  };

  const getSlotAnimation = (slot: SprunkiSlot, character: SprunkiCharacter | undefined) => {
    if (!settings.showAnimations) return '';
    
    const isCurrentSlot = isPlaying && currentSlot === slot.position;
    if (isCurrentSlot && character) {
      switch (character.animation) {
        case 'bounce': return 'animate-bounce';
        case 'sway': return 'animate-pulse';
        case 'rock': return 'animate-ping';
        case 'float': return 'animate-pulse';
        case 'sparkle': return 'animate-spin';
        case 'mechanical': return 'animate-pulse';
        case 'twinkle': return 'animate-bounce';
        case 'wave': return 'animate-pulse';
        default: return 'animate-pulse';
      }
    }
    
    return '';
  };

  return (
    <div className="flex-1 p-3 sm:p-6 bg-gradient-to-b from-sky-50 to-purple-50 dark:from-sky-900/10 dark:to-purple-900/10 min-h-0 overflow-auto">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Stage Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
            🎭 Palco Musical Sprunki
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {selectedCharacter ? (
              <>Coloque o <strong>{characters.find(c => c.id === selectedCharacter)?.name}</strong> no palco!</>
            ) : (
              'Escolha um personagem para começar sua música'
            )}
          </p>
        </div>

        {/* Musical Stage */}
        <div className={`${getStageBackground()} p-4 sm:p-6 rounded-2xl shadow-xl border-3 border-purple-300 dark:border-purple-600 relative overflow-hidden flex-1 min-h-0`}>
          {/* Decorative elements */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xl sm:text-3xl opacity-30">🌟</div>
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-3xl opacity-30">🎪</div>
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-xl sm:text-3xl opacity-30">🎵</div>
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-xl sm:text-3xl opacity-30">✨</div>
          
          {/* Stage Grid Container */}
          <div className="bg-white/60 dark:bg-gray-800/60 p-3 sm:p-4 rounded-xl backdrop-blur-sm relative z-10 h-full flex items-center justify-center">
            <div className="w-full overflow-auto">
              {/* Stage Slots - 8 horizontal slots */}
              <div className="flex gap-2 sm:gap-4 mx-auto max-w-3xl justify-center flex-wrap lg:flex-nowrap">
                {stage.map((slot, index) => {
                  const character = getCharacter(slot.characterId);
                  const isCurrentSlot = isPlaying && currentSlot === index;
                  const hasCharacter = !!slot.characterId;
                  
                  return (
                    <div
                      key={slot.id}
                      onClick={() => onSlotClick(index)}
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl cursor-pointer transition-all
                        flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl
                        border-3 relative overflow-hidden
                        ${settings.sensoryMode ? 'duration-500 hover:scale-105' : 'duration-200 hover:scale-110 active:scale-95'}
                        ${isCurrentSlot ? 'ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl' : ''}
                        ${hasCharacter 
                          ? 'border-gray-300 dark:border-gray-600 shadow-lg' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 bg-white/70 dark:bg-gray-700/70'
                        }
                        ${isPlaying ? 'pointer-events-none' : ''}
                        ${getSlotAnimation(slot, character)}
                      `}
                      style={{
                        backgroundColor: character ? `${character.color}40` : undefined,
                        borderColor: character ? character.color : undefined,
                        boxShadow: character && isCurrentSlot ? `0 0 25px ${character.color}80` : undefined
                      }}
                    >
                      {character && (
                        <div className="relative">
                          <div className="filter drop-shadow-lg">
                            {character.emoji}
                          </div>
                          {isCurrentSlot && (
                            <div className="absolute -top-2 -right-2 text-sm animate-bounce">
                              🎵
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Slot number indicator */}
                      <div className="absolute bottom-0 right-0 bg-gray-600 text-white text-xs rounded-tl-md px-1">
                        {index + 1}
                      </div>
                      
                      {/* Playing effect */}
                      {isCurrentSlot && (
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/50 to-transparent rounded-2xl pointer-events-none"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Timeline indicator */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1">
                {stage.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      currentSlot === index 
                        ? 'bg-yellow-400 scale-150' 
                        : stage[index].characterId 
                          ? 'bg-purple-400' 
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stage Instructions */}
        <div className="mt-3 sm:mt-4 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 rounded-full shadow-lg border-2 border-purple-200 dark:border-purple-700">
            <span className="text-lg sm:text-xl">🎵</span>
            <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
              {isPlaying ? 'Música tocando! 🎭' : 'Clique nos slots para adicionar personagens!'}
            </div>
            {!settings.sensoryMode && <span className="text-lg sm:text-xl animate-pulse">✨</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprunkiStage;
