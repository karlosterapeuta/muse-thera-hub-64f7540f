export type DisorderType = 'TEA' | 'TDAH' | 'TOD' | 'DI';

export type DemandCategory = 
  | 'communication' 
  | 'sensory' 
  | 'socioemotional' 
  | 'motor' 
  | 'cognitive' 
  | 'behavior'
  | 'attention'
  | 'executive_functions'
  | 'emotional_control'
  | 'self_regulation'
  | 'autonomy';

export interface ProfessionalActivity {
  id: number;
  title: string;
  disorder: DisorderType;
  demandCategory: DemandCategory;
  generalObjective: string;
  specificObjectives: string[];
  description: string;
  materials: string[];
  estimatedTime: string;
  ageRange: string;
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
  evaluationCriteria: string[];
  adaptations: {
    level1: string;
    level2: string;
    level3: string;
  };
  contraindications?: string[];
  practicalTips?: string[];
  theoreticalBasis: string;
}

export const disorderInfo: Record<DisorderType, { name: string; color: string; description: string }> = {
  TEA: {
    name: 'Transtorno do Espectro Autista',
    color: 'bg-blue-500',
    description: 'Atividades específicas para desenvolvimento de comunicação, interação social e regulação sensorial'
  },
  TDAH: {
    name: 'Transtorno de Déficit de Atenção e Hiperatividade',
    color: 'bg-orange-500',
    description: 'Atividades focadas em atenção, controle de impulsos e funções executivas'
  },
  TOD: {
    name: 'Transtorno Opositor Desafiador',
    color: 'bg-red-500',
    description: 'Atividades para regulação emocional, manejo de comportamentos e habilidades sociais'
  },
  DI: {
    name: 'Deficiência Intelectual',
    color: 'bg-purple-500',
    description: 'Atividades adaptadas para desenvolvimento cognitivo, comunicação e autonomia'
  }
};

export const demandCategoryInfo: Record<DemandCategory, { name: string; icon: string }> = {
  communication: { name: 'Comunicação', icon: 'MessageCircle' },
  sensory: { name: 'Sensorial', icon: 'Sparkles' },
  socioemotional: { name: 'Socioemocional', icon: 'Heart' },
  motor: { name: 'Motor', icon: 'Move' },
  cognitive: { name: 'Cognitivo', icon: 'Brain' },
  behavior: { name: 'Comportamento', icon: 'Shield' },
  attention: { name: 'Atenção', icon: 'Focus' },
  executive_functions: { name: 'Funções Executivas', icon: 'Workflow' },
  emotional_control: { name: 'Controle Emocional', icon: 'Gauge' },
  self_regulation: { name: 'Autorregulação', icon: 'Settings' },
  autonomy: { name: 'Autonomia', icon: 'User' }
};

export const getDisorderColor = (disorder: DisorderType): string => {
  const colors: Record<DisorderType, string> = {
    TEA: 'border-l-blue-500',
    TDAH: 'border-l-orange-500',
    TOD: 'border-l-red-500',
    DI: 'border-l-purple-500'
  };
  return colors[disorder];
};

export const getDisorderBgColor = (disorder: DisorderType): string => {
  const colors: Record<DisorderType, string> = {
    TEA: 'bg-blue-500/10',
    TDAH: 'bg-orange-500/10',
    TOD: 'bg-red-500/10',
    DI: 'bg-purple-500/10'
  };
  return colors[disorder];
};
