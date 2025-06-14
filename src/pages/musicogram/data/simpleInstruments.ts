
import { SimpleInstrument } from "../types/simple";

export const simpleInstruments: SimpleInstrument[] = [
  {
    id: 'piano',
    name: 'Piano',
    emoji: '🎹',
    color: '#8B5CF6',
    frequency: 261.63, // C4
    waveType: 'sine'
  },
  {
    id: 'guitar',
    name: 'Violão',
    emoji: '🎸',
    color: '#F59E0B',
    frequency: 329.63, // E4
    waveType: 'triangle'
  },
  {
    id: 'drum',
    name: 'Bateria',
    emoji: '🥁',
    color: '#EF4444',
    frequency: 100, // Low frequency
    waveType: 'square'
  },
  {
    id: 'violin',
    name: 'Violino',
    emoji: '🎻',
    color: '#10B981',
    frequency: 440, // A4
    waveType: 'sawtooth'
  },
  {
    id: 'trumpet',
    name: 'Trompete',
    emoji: '🎺',
    color: '#F97316',
    frequency: 523.25, // C5
    waveType: 'square'
  },
  {
    id: 'flute',
    name: 'Flauta',
    emoji: '🪈',
    color: '#06B6D4',
    frequency: 783.99, // G5
    waveType: 'sine'
  },
  {
    id: 'bell',
    name: 'Sino',
    emoji: '🔔',
    color: '#84CC16',
    frequency: 1046.5, // C6
    waveType: 'triangle'
  },
  {
    id: 'clap',
    name: 'Palma',
    emoji: '👏',
    color: '#EC4899',
    frequency: 200,
    waveType: 'square'
  }
];
