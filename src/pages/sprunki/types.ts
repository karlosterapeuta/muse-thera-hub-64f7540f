
export interface SprunkiCharacter {
  id: string;
  name: string;
  emoji: string;
  type: 'beat' | 'melody' | 'bass' | 'harmony' | 'effect' | 'rhythm';
  color: string;
  frequency: number;
  soundPattern: string;
  description: string;
  animation?: string;
  category: 'beats' | 'effects' | 'melodies' | 'voices';
}

export interface SprunkiSlot {
  id: string;
  characterId: string | null;
  position: number;
  isActive: boolean;
  volume: number;
}

export interface SprunkiComposition {
  id: string;
  name: string;
  slots: SprunkiSlot[];
  bpm: number;
  volume: number;
  createdAt: string;
}

export interface SprunkiSettings {
  sensoryMode: boolean;
  individualVolumes: boolean;
  showAnimations: boolean;
  autoSave: boolean;
  visualFeedbackOnly: boolean;
}

// Export challenge types
export * from './types/challenge';
