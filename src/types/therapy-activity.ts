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
  | 'Preferência por atividades repetitivas'
  // TDAH - Sub-demandas de Atenção e Funções Executivas
  | 'Dificuldade em manter o foco por longos períodos'
  | 'Esquecimento de tarefas e materiais escolares'
  | 'Tendência à distração por estímulos externos'
  | 'Problemas em seguir instruções complexas'
  | 'Lentidão para iniciar e concluir tarefas'
  | 'Falta de organização no tempo e no espaço'
  // TDAH - Sub-demandas de Comportamento e Autorregulação
  | 'Impulsividade (agir antes de pensar)'
  | 'Interrompe conversas, fala sem ser chamado'
  | 'Dificuldade em esperar a vez ou lidar com regras'
  | 'Comportamentos de risco e busca por estímulos intensos'
  | 'Dificuldade em manter o autocontrole frente a frustrações'
  | 'Agitação motora (balançar pernas, levantar-se)'
  // TDAH - Sub-demandas de Socioemocional e Autoestima
  | 'Sentimento de inadequação e rejeição social'
  | 'Dificuldade em fazer e manter amizades'
  | 'Frustração e desânimo diante de críticas'
  | 'Baixa tolerância à espera e à negação'
  | 'Oscilações de humor'
  | 'Necessidade constante de reforço positivo'
  // TDAH - Sub-demandas de Cognitivo e Aprendizagem
  | 'Dificuldade em manter o raciocínio lógico sequencial'
  | 'Problemas com leitura prolongada e interpretação'
  | 'Lentidão na execução de tarefas escolares'
  | 'Esquecimento de conteúdos já aprendidos'
  | 'Pouca capacidade de planejamento e autoavaliação'
  | 'Maior desempenho em atividades práticas'
  // TDAH - Sub-demandas de Sensorial e Motor
  | 'Inquietação física constante'
  | 'Dificuldade em permanecer sentado ou quieto'
  | 'Coordenação motora fina prejudicada'
  | 'Hipersensibilidade a sons ou toques'
  | 'Necessidade de movimento para manter atenção';

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
