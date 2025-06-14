import React from 'react';
import { SprunkiSlot, SprunkiCharacter, SprunkiSettings } from '../types';
import SprunkiCharacterVisual from './SprunkiCharacterVisual';

interface SprunkiHorizontalStageProps {
  stage: SprunkiSlot[];
  characters: SprunkiCharacter[];
  onSlotDrop: (slotIndex: number, characterId: string) => void;
  onSlotClick: (slotIndex: number) => void;
  isPlaying: boolean;
  settings: SprunkiSettings;
}

const SprunkiHorizontalStage: React.FC<SprunkiHorizontalStageProps> = ({
  stage,
  characters,
  onSlotDrop,
  onSlotClick,
  isPlaying,
  settings
}) => {
  const getCharacter = (characterId: string | null) => {
    return characters.find(c => c.id === characterId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData('text/plain');
    if (characterId) {
      onSlotDrop(slotIndex, characterId);
    }
  };

  const getSlotAnimation = (slot: SprunkiSlot, character: SprunkiCharacter | undefined) => {
    if (!settings.showAnimations || !character) return '';
    
    if (isPlaying && slot.characterId) {
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
    <div className="bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 p-6 rounded-2xl shadow-2xl border-4 border-purple-300 dark:border-purple-600 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)]"></div>
      
      {/* Stage Title */}
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
          🎭 Sprunki Stage
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Arraste os personagens para criar sua música!
        </p>
      </div>

      {/* Stage Slots - Horizontal Layout */}
      <div className="flex justify-center items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm relative z-10">
        {stage.map((slot, index) => {
          const character = getCharacter(slot.characterId);
          const hasCharacter = !!slot.characterId;
          
          return (
            <div
              key={slot.id}
              onClick={() => onSlotClick(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                w-20 h-20 lg:w-24 lg:h-24 rounded-2xl cursor-pointer transition-all duration-300
                flex items-center justify-center
                border-4 relative overflow-hidden
                ${hasCharacter 
                  ? 'border-gray-400 dark:border-gray-500 shadow-xl transform scale-105' 
                  : 'border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 bg-white/50 dark:bg-gray-700/50'
                }
                ${isPlaying && hasCharacter ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
                hover:scale-110 active:scale-95
                ${getSlotAnimation(slot, character)}
              `}
              style={{
                backgroundColor: character ? `${character.color}30` : undefined,
                borderColor: character ? character.color : undefined,
                boxShadow: character && isPlaying ? `0 0 20px ${character.color}80` : undefined
              }}
            >
              {character ? (
                <div className="relative">
                  <SprunkiCharacterVisual 
                    character={character} 
                    size="small"
                    isPlaying={isPlaying}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-2xl">+</div>
                </div>
              )}
              
              {/* Slot number */}
              <div className="absolute bottom-0 right-0 bg-gray-600 text-white text-xs rounded-tl-md px-1">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Stage Status */}
      <div className="text-center mt-4 relative z-10">
        <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border-2 border-purple-200 dark:border-purple-700">
          <span className="text-xl">🎵</span>
          <div className="text-sm text-purple-700 dark:text-purple-300">
            {isPlaying ? 'Mix tocando! 🔥' : 'Arraste personagens para os slots!'}
          </div>
          {!settings.sensoryMode && <span className="text-xl animate-pulse">✨</span>}
        </div>
      </div>
    </div>
  );
};

export default SprunkiHorizontalStage;
