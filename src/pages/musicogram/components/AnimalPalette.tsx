
import React from 'react';
import { AnimalInstrument } from '../types/tea';
import { teaAudio } from '../utils/teaAudioService';

interface AnimalPaletteProps {
  animals: AnimalInstrument[];
  selectedAnimal: string | null;
  onSelectAnimal: (animalId: string) => void;
  calmMode: boolean;
}

const AnimalPalette: React.FC<AnimalPaletteProps> = ({
  animals,
  selectedAnimal,
  onSelectAnimal,
  calmMode
}) => {
  const handleAnimalClick = async (animal: AnimalInstrument) => {
    onSelectAnimal(animal.id);
    await teaAudio.playAnimalSound(animal.id, animal.frequency, 0.8);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-r-4 border-rainbow-500 p-6 overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-green-300">
          🎪 Orquestra Animal
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Clique nos animais para ouvi-los!
        </div>
      </div>
      
      <div className="space-y-3">
        {animals.map((animal) => (
          <button
            key={animal.id}
            onClick={() => handleAnimalClick(animal)}
            className={`
              w-full p-4 rounded-2xl border-3 transition-all duration-300 transform
              hover:scale-105 active:scale-95 hover:shadow-xl
              ${selectedAnimal === animal.id 
                ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 shadow-2xl scale-105' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400'
              }
              ${calmMode ? 'hover:scale-102 transition-transform duration-500' : ''}
            `}
            style={{
              borderColor: selectedAnimal === animal.id ? animal.color : undefined,
              boxShadow: selectedAnimal === animal.id ? `0 0 30px ${animal.color}60` : undefined
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="text-4xl mb-1">{animal.emoji}</div>
                <div className="text-2xl">{animal.instrument}</div>
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">
                  {animal.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {animal.description}
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: animal.color }}
                  ></span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {animal.soundType === 'melodic' ? '🎵 Melodia' : 
                     animal.soundType === 'rhythmic' ? '🥁 Ritmo' : '🌊 Ambiente'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-700">
        <div className="text-center">
          <div className="text-2xl mb-2">🌟</div>
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            Cada animal tem seu som especial!
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Experimente todos e crie sua música
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimalPalette;
