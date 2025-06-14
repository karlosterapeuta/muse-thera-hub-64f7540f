
import { SprunkiCharacter } from '../types';

export const sprunkiCharacters: SprunkiCharacter[] = [
  {
    id: 'beatbox-guy',
    name: 'Beatbox Guy',
    emoji: '🎤',
    type: 'beat',
    color: '#FF6B35',
    frequency: 220,
    soundPattern: 'boom-boom-clap',
    description: 'Beats e percussão poderosos',
    animation: 'bounce'
  },
  {
    id: 'melody-girl',
    name: 'Melody Girl',
    emoji: '🎵',
    type: 'melody',
    color: '#FF69B4',
    frequency: 523.25,
    soundPattern: 'do-re-mi-fa',
    description: 'Melodias doces e cativantes',
    animation: 'sway'
  },
  {
    id: 'bass-dude',
    name: 'Bass Dude',
    emoji: '🎸',
    type: 'bass',
    color: '#8A2BE2',
    frequency: 110,
    soundPattern: 'bum-bum-bum',
    description: 'Linhas de baixo profundas',
    animation: 'rock'
  },
  {
    id: 'harmony-twin',
    name: 'Harmony Twin',
    emoji: '🎼',
    type: 'harmony',
    color: '#32CD32',
    frequency: 659.25,
    soundPattern: 'ah-oh-ah',
    description: 'Harmonias celestiais',
    animation: 'float'
  },
  {
    id: 'effect-master',
    name: 'Effect Master',
    emoji: '✨',
    type: 'effect',
    color: '#FFD700',
    frequency: 440,
    soundPattern: 'whoosh-zing',
    description: 'Efeitos mágicos especiais',
    animation: 'sparkle'
  },
  {
    id: 'rhythm-robot',
    name: 'Rhythm Robot',
    emoji: '🤖',
    type: 'rhythm',
    color: '#00CED1',
    frequency: 293.66,
    soundPattern: 'tick-tock-boom',
    description: 'Ritmos robóticos precisos',
    animation: 'mechanical'
  },
  {
    id: 'vocal-star',
    name: 'Vocal Star',
    emoji: '🌟',
    type: 'melody',
    color: '#FF1493',
    frequency: 783.99,
    soundPattern: 'la-la-la',
    description: 'Vocais estelares brilhantes',
    animation: 'twinkle'
  },
  {
    id: 'synth-wave',
    name: 'Synth Wave',
    emoji: '🌊',
    type: 'harmony',
    color: '#00BFFF',
    frequency: 349.23,
    soundPattern: 'wave-synth',
    description: 'Ondas sintéticas suaves',
    animation: 'wave'
  }
];
