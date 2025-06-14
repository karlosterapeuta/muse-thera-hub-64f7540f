
import { SprunkiCharacter } from '../types';

export const sprunkiCharacters: SprunkiCharacter[] = [
  // BEATS Category
  {
    id: 'beat-1',
    name: 'Oren',
    emoji: '🟠',
    type: 'beat',
    color: '#FF6B35',
    frequency: 80,
    soundPattern: 'kick-drum',
    description: 'Batida principal forte',
    animation: 'bounce',
    category: 'beats'
  },
  {
    id: 'beat-2', 
    name: 'Clukr',
    emoji: '🔴',
    type: 'beat',
    color: '#E74C3C',
    frequency: 90,
    soundPattern: 'snare-drum',
    description: 'Batida de caixa',
    animation: 'rock',
    category: 'beats'
  },
  
  // EFFECTS Category
  {
    id: 'effect-1',
    name: 'Raddy',
    emoji: '🟡',
    type: 'effect',
    color: '#F1C40F',
    frequency: 400,
    soundPattern: 'synth-stab',
    description: 'Efeito sintetizador',
    animation: 'sparkle',
    category: 'effects'
  },
  {
    id: 'effect-2',
    name: 'Vineria',
    emoji: '🟢',
    type: 'effect',
    color: '#27AE60',
    frequency: 350,
    soundPattern: 'fx-sweep',
    description: 'Efeito de varredura',
    animation: 'wave',
    category: 'effects'
  },
  
  // MELODIES Category
  {
    id: 'melody-1',
    name: 'Gray',
    emoji: '⚪',
    type: 'melody',
    color: '#95A5A6',
    frequency: 523.25,
    soundPattern: 'lead-synth',
    description: 'Melodia principal',
    animation: 'sway',
    category: 'melodies'
  },
  {
    id: 'melody-2',
    name: 'Brud',
    emoji: '🟤',
    type: 'melody',
    color: '#8B4513',
    frequency: 659.25,
    soundPattern: 'arp-sequence',
    description: 'Sequência de arpejos',
    animation: 'float',
    category: 'melodies'
  },
  
  // VOICES Category
  {
    id: 'voice-1',
    name: 'Garnold',
    emoji: '🟣',
    type: 'harmony',
    color: '#9B59B6',
    frequency: 440,
    soundPattern: 'vocal-loop',
    description: 'Loop vocal principal',
    animation: 'twinkle',
    category: 'voices'
  },
  {
    id: 'voice-2',
    name: 'OWAKCX',
    emoji: '🔵',
    type: 'harmony',
    color: '#3498DB',
    frequency: 392,
    soundPattern: 'vocal-harmony',
    description: 'Harmonia vocal',
    animation: 'mechanical',
    category: 'voices'
  }
];

export const characterCategories = [
  { id: 'beats', name: 'Beats', color: '#FF6B35' },
  { id: 'effects', name: 'Effects', color: '#F1C40F' },
  { id: 'melodies', name: 'Melodies', color: '#27AE60' },
  { id: 'voices', name: 'Voices', color: '#9B59B6' }
];
