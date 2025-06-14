
import React from 'react';
import { SprunkiCharacter, SprunkiSettings } from '../types';
import { sprunkiAudio } from '../utils/sprunkiAudioService';

interface SprunkiCharactersProps {
  characters: SprunkiCharacter[];
  selectedCharacter: string | null;
  onSelectCharacter: (characterId: string) => void;
  settings: SprunkiSettings;
}

const SprunkiCharacters: React.FC<SprunkiCharactersProps> = ({
  characters,
  selectedCharacter,
  onSelectCharacter,
  settings
}) => {
  const handleCharacterClick = async (character: SprunkiCharacter) => {
    onSelectCharacter(character.id);
    
    // Play sound preview if audio is initialized
    if (sprunkiAudio.getInitialized() && !settings.visualFeedbackOnly) {
      try {
        await sprunkiAudio.playCharacterSound(
          `preview-${character.id}`, 
          character.frequency, 
          character.type
        );
        
        // Stop preview after 800ms
        setTimeout(() => {
          sprunkiAudio.stopCharacterSound(`preview-${character.id}`);
        }, 800);
      } catch (error) {
        console.log('Som não disponível para este personagem');
      }
    }
  };

  const getCharacterAnimation = (character: SprunkiCharacter, isSelected: boolean) => {
    if (!settings.showAnimations) return '';
    
    if (isSelected) {
      return 'animate-bounce';
    }
    
    switch (character.animation) {
      case 'bounce': return 'hover:animate-bounce';
      case 'sway': return 'hover:animate-pulse';
      case 'rock': return 'hover:animate-ping';
      case 'float': return 'hover:animate-pulse';
      case 'sparkle': return 'hover:animate-spin';
      case 'mechanical': return 'hover:animate-pulse';
      case 'twinkle': return 'hover:animate-bounce';
      case 'wave': return 'hover:animate-pulse';
      default: return 'hover:animate-pulse';
    }
  };

  return (
    <div className="w-full lg:w-72 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-b-4 lg:border-b-0 lg:border-r-4 border-blue-300 p-3 sm:p-4 overflow-y-auto">
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-purple-700 dark:text-purple-300">
          🎪 Personagens Sprunki
        </h3>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Clique nos personagens para ouvi-los!
        </div>
      </div>
      
      {/* Character Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => handleCharacterClick(character)}
            className={`
              w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform
              hover:scale-105 active:scale-95 hover:shadow-lg
              ${selectedCharacter === character.id 
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 shadow-xl scale-105' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400'
              }
              ${settings.sensoryMode ? 'hover:scale-102 transition-transform duration-500' : ''}
              ${getCharacterAnimation(character, selectedCharacter === character.id)}
            `}
            style={{
              borderColor: selectedCharacter === character.id ? character.color : undefined,
              boxShadow: selectedCharacter === character.id ? `0 0 15px ${character.color}60` : undefined
            }}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-4xl mb-2">{character.emoji}</div>
              <div className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200 mb-1">
                {character.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {character.description}
              </div>
              <div className="flex items-center justify-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: character.color }}
                ></span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {character.type}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
        <div className="text-center">
          <div className="text-lg sm:text-xl mb-1">🎵</div>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">
            Estilo Sprunki!
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Arraste e crie música
          </p>
        </div>
      </div>
    </div>
  );
};

export default SprunkiCharacters;
