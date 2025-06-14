
export interface AnimalInstrument {
  id: string;
  name: string;
  animal: string;
  emoji: string;
  instrument: string;
  color: string;
  frequency: number;
  soundType: 'melodic' | 'rhythmic' | 'ambient';
  description: string;
}

export interface StageCell {
  id: string;
  animalId: string | null;
  position: { row: number; col: number };
  isActive: boolean;
}

export interface TEAComposition {
  id: string;
  name: string;
  stage: StageCell[][];
  tempo: number;
  createdAt: string;
  stickers: string[];
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
  description: string;
}
