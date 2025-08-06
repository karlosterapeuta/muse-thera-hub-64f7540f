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