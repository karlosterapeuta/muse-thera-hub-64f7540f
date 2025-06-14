
export interface SprunkiChallenge {
  id: string;
  level: number;
  sequence: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  maxAttempts: number;
}

export interface ChallengeGameState {
  currentLevel: number;
  score: number;
  lives: number;
  isPlaying: boolean;
  isShowingSequence: boolean;
  isPlayerTurn: boolean;
  playerSequence: string[];
  currentSequence: string[];
  timeRemaining: number;
  attempts: number;
  gameStatus: 'waiting' | 'playing' | 'success' | 'failed' | 'gameOver';
}

export interface ChallengeSettings {
  speed: 'slow' | 'normal' | 'fast';
  allowRepeat: boolean;
  sensoryMode: boolean;
  visualFeedbackOnly: boolean;
  pauseBetweenChallenges: boolean;
}
