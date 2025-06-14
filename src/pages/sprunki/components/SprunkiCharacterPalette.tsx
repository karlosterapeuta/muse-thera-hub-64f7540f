import React from 'react';
import { SprunkiCharacter, SprunkiSettings } from '../types';
import { characterCategories } from '../data/sprunkiCharacters';
import { sprunkiAudio } from '../utils/sprunkiAudioService';
import SprunkiCharacterVisual from './SprunkiCharacterVisual';

interface SprunkiCharacterPaletteProps {
  characters: SprunkiCharacter[];
  settings: SprunkiSettings;
}

const SprunkiCharacterPalette: React.FC<SprunkiCharacterPaletteProps> = ({
  characters,
  settings
}) => {
  const handleDragStart = (e: React.DragEvent, character: SprunkiCharacter) => {
    e.dataTransfer.setData('text/plain', character.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCharacterClick = async (character: SprunkiCharacter) => {
    // Play sound preview
    if (sprunkiAudio.getInitialized() && !settings.visualFeedbackOnly) {
      try {
        await sprunkiAudio.playCharacterSound(
          `preview-${character.id}`, 
          character.frequency, 
          character.type
        );
        
        // Stop preview after 1 second
        setTimeout(() => {
          sprunkiAudio.stopCharacterSound(`preview-${character.id}`);
        }, 1000);
      } catch (error) {
        console.log('Som não disponível para este personagem');
      }
    }
  };

  const getCharactersByCategory = (categoryId: string) => {
    return characters.filter(char => char.category === categoryId);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-purple-50 dark:from-gray-900/20 dark:to-purple-900/20 p-4 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-1">
          🎪 Personagens Sprunki
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Arraste para o palco ou clique para ouvir
        </p>
      </div>

      {/* Character Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {characterCategories.map((category) => (
          <div key={category.id} className="space-y-2">
            {/* Category Header */}
            <div 
              className="text-center py-2 rounded-lg text-white font-bold text-sm uppercase tracking-wide"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </div>
            
            {/* Characters in Category */}
            <div className="grid grid-cols-1 gap-2">
              {getCharactersByCategory(category.id).map((character) => (
                <div
                  key={character.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, character)}
                  onClick={() => handleCharacterClick(character)}
                  className={`
                    cursor-grab active:cursor-grabbing p-3 rounded-xl border-2 
                    transition-all duration-300 transform hover:scale-105 active:scale-95
                    bg-white dark:bg-gray-800 hover:shadow-lg
                    ${settings.sensoryMode ? 'hover:scale-102 transition-transform duration-500' : ''}
                  `}
                  style={{
                    borderColor: character.color,
                    boxShadow: `0 2px 8px ${character.color}30`
                  }}
                >
                  <div className="text-center">
                    {/* Visual Character */}
                    <div className="flex justify-center mb-2">
                      <SprunkiCharacterVisual 
                        character={character} 
                        size="medium"
                      />
                    </div>
                    <div className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1">
                      {character.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {character.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
        <div className="text-center">
          <div className="text-lg mb-1">🎵</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Estilo Sprunki Incredibox!
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Arraste e solte para criar música
          </p>
        </div>
      </div>
    </div>
  );
};

export default SprunkiCharacterPalette;
