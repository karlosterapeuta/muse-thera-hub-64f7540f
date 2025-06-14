
export interface SensorPosition {
  x: number;
  y: number;
  pressure?: number;
  velocity?: number;
}

export interface SoundWave {
  id: string;
  x: number;
  y: number;
  radius: number;
  frequency: number;
  amplitude: number;
  color: string;
  decay: number;
  timestamp: number;
}

export interface GameMode {
  id: 'calm' | 'energy' | 'focus' | 'creative';
  name: string;
  description: string;
  baseFrequency: number;
  colorPalette: string[];
  sensitivity: number;
  waveDecay: number;
  maxWaves: number;
}

export interface SensorSyncSettings {
  sensitivity: number;
  visualIntensity: number;
  audioVolume: number;
  showTrails: boolean;
  enableVibration: boolean;
  autoAdaptive: boolean;
  currentMode: GameMode['id'];
}

export interface TherapyMetrics {
  sessionDuration: number;
  movementCount: number;
  averageIntensity: number;
  modeChanges: number;
  creativePatterns: number;
}
