
import { SprunkiCharacter } from '../types';

export const sprunkiCharacters: SprunkiCharacter[] = [
  // BEATS Category - Formas vermelhas/laranja
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
    category: 'beats',
    visualShape: 'spiky-red',
    bodyColor: '#E74C3C',
    headShape: 'spiky'
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
    category: 'beats',
    visualShape: 'round-orange',
    bodyColor: '#FF8C42',
    headShape: 'round'
  },
  
  // EFFECTS Category - Formas azuis/escuras
  {
    id: 'effect-1',
    name: 'Raddy',
    emoji: '🟡',
    type: 'effect',
    color: '#3498DB',
    frequency: 400,
    soundPattern: 'synth-stab',
    description: 'Efeito sintetizador',
    animation: 'sparkle',
    category: 'effects',
    visualShape: 'round-blue',
    bodyColor: '#3498DB',
    headShape: 'round'
  },
  {
    id: 'effect-2',
    name: 'Vineria',
    emoji: '🟢',
    type: 'effect',
    color: '#2C3E50',
    frequency: 350,
    soundPattern: 'fx-sweep',
    description: 'Efeito de varredura',
    animation: 'wave',
    category: 'effects',
    visualShape: 'hat-gray',
    bodyColor: '#2C3E50',
    headShape: 'hat'
  },
  
  // MELODIES Category - Formas amarelas/verdes
  {
    id: 'melody-1',
    name: 'Gray',
    emoji: '⚪',
    type: 'melody',
    color: '#F1C40F',
    frequency: 523.25,
    soundPattern: 'lead-synth',
    description: 'Melodia principal',
    animation: 'sway',
    category: 'melodies',
    visualShape: 'tv-yellow',
    bodyColor: '#F1C40F',
    headShape: 'rectangular'
  },
  {
    id: 'melody-2',
    name: 'Brud',
    emoji: '🟤',
    type: 'melody',
    color: '#27AE60',
    frequency: 659.25,
    soundPattern: 'arp-sequence',
    description: 'Sequência de arpejos',
    animation: 'float',
    category: 'melodies',
    visualShape: 'round-green',
    bodyColor: '#27AE60',
    headShape: 'round'
  },
  
  // VOICES Category - Formas roxas/coloridas
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
    category: 'voices',
    visualShape: 'spiky-purple',
    bodyColor: '#9B59B6',
    headShape: 'spiky'
  },
  {
    id: 'voice-2',
    name: 'OWAKCX',
    emoji: '🔵',
    type: 'harmony',
    color: '#E67E22',
    frequency: 392,
    soundPattern: 'vocal-harmony',
    description: 'Harmonia vocal',
    animation: 'mechanical',
    category: 'voices',
    visualShape: 'round-orange-accent',
    bodyColor: '#E67E22',
    headShape: 'round'
  },
  
  // Personagens adicionais baseados na imagem
  {
    id: 'voice-3',
    name: 'Sky',
    emoji: '🔷',
    type: 'harmony',
    color: '#85C1E9',
    frequency: 330,
    soundPattern: 'ethereal-voice',
    description: 'Voz etérea',
    animation: 'float',
    category: 'voices',
    visualShape: 'round-cyan',
    bodyColor: '#85C1E9',
    headShape: 'round'
  },
  {
    id: 'voice-4',
    name: 'Jevin',
    emoji: '⚫',
    type: 'harmony',
    color: '#34495E',
    frequency: 294,
    soundPattern: 'deep-voice',
    description: 'Voz profunda',
    animation: 'rock',
    category: 'voices',
    visualShape: 'round-dark',
    bodyColor: '#34495E',
    headShape: 'round'
  },
  {
    id: 'voice-5',
    name: 'Tunner',
    emoji: '🟨',
    type: 'harmony',
    color: '#F7DC6F',
    frequency: 349,
    soundPattern: 'bright-voice',
    description: 'Voz brilhante',
    animation: 'sparkle',
    category: 'voices',
    visualShape: 'round-yellow',
    bodyColor: '#F7DC6F',
    headShape: 'round'
  },
  {
    id: 'voice-6',
    name: 'Wenda',
    emoji: '🟪',
    type: 'harmony',
    color: '#BB8FCE',
    frequency: 262,
    soundPattern: 'mystical-voice',
    description: 'Voz mística',
    animation: 'twinkle',
    category: 'voices',
    visualShape: 'round-pink',
    bodyColor: '#BB8FCE',
    headShape: 'round'
  }
];

export const characterCategories = [
  { id: 'beats', name: 'Beats', color: '#FF6B35' },
  { id: 'effects', name: 'Effects', color: '#3498DB' },
  { id: 'melodies', name: 'Melodies', color: '#F1C40F' },
  { id: 'voices', name: 'Voices', color: '#9B59B6' }
];
