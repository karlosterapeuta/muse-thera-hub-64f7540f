export interface InteractivePDF {
  id: string;
  title: string;
  category: 'casa' | 'animais' | 'emocoes' | 'brinquedos' | 'outros';
  thumbnailUrl?: string;
  pdfUrl: string;
  words: Word[];
  createdAt: Date;
}

export interface Word {
  id: string;
  text: string;
  imageUrl: string;
  audioUrl: string;
  sungAudioUrl: string;
}

export interface GuidedAudio {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl?: string;
  voiceType: 'adulto' | 'infantil' | 'personalizado';
  category: 'palavras' | 'frases' | 'musicas' | 'historias';
  tags: string[];
  duration: number;
  hasBackgroundMusic: boolean;
  therapistId?: string;
  createdAt: Date;
  metadata?: {
    bpm?: number;
    key?: string;
    words?: string[];
    difficulty?: 'facil' | 'medio' | 'avancado';
  };
}

export interface Reward {
  id: string;
  name: string;
  type: 'adesivo' | 'personagem' | 'efeito';
  imageUrl: string;
  unlocked: boolean;
  requiredPoints: number;
  description?: string;
  category?: 'natureza' | 'animais' | 'magia' | 'música';
  animation?: 'float' | 'spin' | 'bounce' | 'glow';
  soundEffect?: 'sparkle' | 'magic' | 'cheer' | 'tada';
}

export interface UserProgress {
  totalPoints: number;
  vocalizationCount: number;
  completedActivities: string[];
  unlockedRewards: string[];
  lastSessionDate: Date;
  currentLevel?: number;
  streakDays?: number;
  achievements?: string[];
}
