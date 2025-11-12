export type Disorder = 'TEA' | 'TDAH' | 'TOD' | 'DI';

export type Demand = 
  | 'Comunicação e Linguagem'
  | 'Cognição e Aprendizagem'
  | 'Socioemocional'
  | 'Sensorial e Motor'
  | 'Atenção e Funções Executivas'
  | 'Comportamento'
  | 'Autonomia';

export type Specialty = 
  | 'Musicoterapia'
  | 'Psicologia'
  | 'Fonoaudiologia'
  | 'Terapia Ocupacional'
  | 'Psicopedagogia'
  | 'ABA'
  | 'Psicomotricidade';

export type ComplexityLevel = 'Leve' | 'Moderado' | 'Severo';

export interface TherapyActivity {
  id: string;
  disorder: Disorder;
  demand: Demand;
  specialty: Specialty;
  generalObjective: string;
  specificObjective: string;
  activityDescription: string;
  materials: string[];
  estimatedTime: string;
  evaluationCriteria: string[];
  complexityLevel: ComplexityLevel;
}

export interface DemandOption {
  disorder: Disorder;
  label: string;
  icon: string;
  demands: string[];
}
