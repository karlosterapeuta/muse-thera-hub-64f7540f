export type Disorder = 'TEA' | 'TDAH' | 'TOD' | 'DI';

export type Demand = 
  | 'Comunicação e Linguagem'
  | 'Cognição e Aprendizagem'
  | 'Socioemocional'
  | 'Sensorial e Motor'
  | 'Atenção e Funções Executivas'
  | 'Comportamento'
  | 'Autonomia'
  // TEA - Sub-demandas de Comunicação e Linguagem
  | 'Ausência ou atraso na fala'
  | 'Dificuldade em manter turnos de conversação'
  | 'Ecolalia (repetição de palavras ou frases)'
  | 'Uso inadequado da entonação ou do olhar'
  | 'Dificuldade em compreender linguagem figurada'
  | 'Pouca intenção comunicativa'
  // TEA - Sub-demandas de Cognitivo e Aprendizagem
  | 'Dificuldade em generalizar o aprendizado'
  | 'Pensamento concreto e literal'
  | 'Hiperfoco em temas de interesse restrito'
  | 'Desempenho irregular'
  | 'Lentidão no processamento das informações'
  // TEA - Sub-demandas de Socioemocional
  | 'Dificuldade em reconhecer e expressar emoções'
  | 'Pouco interesse em interações sociais'
  | 'Crises de ansiedade frente a mudanças'
  | 'Dificuldade com frustrações ou espera'
  | 'Apegos excessivos a objetos ou rotinas'
  // TEA - Sub-demandas de Sensorial e Motor
  | 'Hipersensibilidade sensorial'
  | 'Hipossensibilidade (busca de estímulos)'
  | 'Estereotipias motoras'
  | 'Dificuldades em coordenação motora'
  | 'Preferência por atividades repetitivas';

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

export interface SubDemand {
  id: string;
  label: string;
  associatedConditions?: string[];
}

export interface DemandCategory {
  category: string;
  icon: string;
  subDemands: SubDemand[];
}
