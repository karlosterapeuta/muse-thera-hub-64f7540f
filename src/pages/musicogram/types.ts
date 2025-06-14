
export interface TherapySession {
  id: string;
  patientId?: string;
  templateId: string;
  startTime: string;
  endTime?: string;
  progress: number;
  completedActivities: string[];
  notes?: string;
}

export interface TherapyTemplate {
  id: string;
  name: string;
  category: 'motor' | 'communication' | 'attention' | 'emotional' | 'social' | 'memory';
  difficulty: 'easy' | 'medium' | 'hard';
  objective: string;
  description: string;
  ageGroup: string;
  duration: string;
  activities: TherapyActivity[];
  icon: string;
  color: string;
}

export interface TherapyActivity {
  id: string;
  type: 'sequence' | 'selection' | 'creation' | 'response';
  title: string;
  instruction: string;
  symbols: ActivitySymbol[];
  correctOrder?: number[];
  timeLimit?: number;
  soundEnabled: boolean;
}

export interface ActivitySymbol {
  id: string;
  emoji: string;
  name: string;
  category: 'instrument' | 'emotion' | 'action' | 'dynamic' | 'nature';
  sound?: string;
  color: string;
  x?: number;
  y?: number;
  scale?: number;
}

export interface ProgressData {
  activityId: string;
  attempts: number;
  completions: number;
  averageTime: number;
  lastAttempt: string;
  accuracy: number;
}
