export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  duration: string;
  materials?: string[];
  objectives: string[];
  therapeuticAreas: string[];
  tags: string[];
  instructions?: string[];
  adaptations?: string[];
  benefits?: string[];
  contraindications?: string[];
  resourceLinks?: ResourceLink[];
  evaluationCriteria?: string[];
  sessionPlan?: SessionPlan;
  detailedInstructions?: DetailedInstruction[];
  preparationSteps?: PreparationStep[];
  facilitationGuide?: FacilitationGuide;
  executionTips?: ExecutionTip[];
}

export interface ResourceLink {
  type: 'audio' | 'video' | 'document' | 'image' | 'link';
  title: string;
  url: string;
  description?: string;
}

export interface SessionPlan {
  warmUp?: string;
  mainActivity: string;
  coolDown?: string;
  variations?: string[];
  progressionSteps?: string[];
}

export interface DetailedInstruction {
  step: number;
  title: string;
  description: string;
  subSteps: SubStep[];
  timing: string;
  observationPoints: string[];
  tips: string[];
  commonIssues?: string[];
}

export interface SubStep {
  id: string;
  action: string;
  expectedResponse?: string;
  duration?: string;
  notes?: string;
}

export interface PreparationStep {
  category: 'environment' | 'materials' | 'therapist' | 'participants';
  title: string;
  items: PreparationItem[];
}

export interface PreparationItem {
  id: string;
  description: string;
  required: boolean;
  timeNeeded?: string;
  notes?: string;
}

export interface FacilitationGuide {
  introduction: string[];
  keyPhrases: string[];
  motivationTechniques: string[];
  redirectionStrategies: string[];
  closingApproach: string[];
}

export interface ExecutionTip {
  stage: 'preparation' | 'execution' | 'evaluation';
  type: 'success_indicator' | 'warning_sign' | 'adaptation_cue' | 'timing_note';
  content: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface Category {
  id: string;
  name: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  subcategories?: string[];
}

export interface ActivityFilter {
  category?: string;
  difficulty?: string;
  ageGroup?: string;
  duration?: string;
  tags?: string[];
  therapeuticArea?: string;
  searchTerm?: string;
}