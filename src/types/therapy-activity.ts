export type Disorder = 'TEA' | 'TDAH' | 'TOD' | 'DI' | 'ALZHEIMER' | 'PARKINSON';

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
  | 'Necessidade de movimento para manter atenção'
  // TOD - Sub-demandas de Comportamento e Controle Emocional
  | 'Recusa frequente em seguir regras e instruções'
  | 'Discussões constantes com figuras de autoridade'
  | 'Agressividade verbal (gritos, insultos, ameaças)'
  | 'Reatividade emocional exagerada diante de contrariedades'
  | 'Tendência a culpar os outros por seus erros'
  | 'Resistência a mudanças ou ordens externas'
  // TOD - Sub-demandas de Socioemocional e Relações Interpessoais
  | 'Dificuldade em lidar com frustração e rejeição'
  | 'Baixa tolerância à crítica e ao erro'
  | 'Conflitos frequentes com pares (colegas, irmãos)'
  | 'Pouca empatia e dificuldade em reconhecer emoções nos outros'
  | 'Baixa autoestima mascarada por atitudes de superioridade'
  | 'Comportamento controlador ou desafiador para obter atenção'
  // TOD - Sub-demandas de Cognitivo e Aprendizagem
  | 'Desinteresse por atividades que exigem esforço mental prolongado'
  | 'Dificuldade de concentração, principalmente em tarefas sem estímulo imediato'
  | 'Desorganização e resistência à rotina'
  | 'Baixo rendimento escolar por desmotivação ou oposição'
  | 'Uso de comportamento desafiador como forma de evitar tarefas difíceis'
  // TOD - Sub-demandas de Regulação Sensorial e Motora
  | 'Agitação psicomotora em momentos de tensão'
  | 'Hipersensibilidade a sons, luzes ou contato físico (levando à irritabilidade)'
  | 'Dificuldade em relaxar e controlar impulsos motores'
  | 'Reações corporais exageradas (chutar, bater, empurrar)'
  | 'Necessidade de atividades que ajudem na descarga de energia emocional'
  // DI - Sub-demandas de Cognitivo e Aprendizagem
  | 'Dificuldade em compreender conceitos abstratos (tempo, quantidade, causa e efeito)'
  | 'Atraso nas habilidades acadêmicas (leitura, escrita, matemática)'
  | 'Ritmo de aprendizagem lento, exigindo repetição e reforço'
  | 'Dificuldade em planejar, organizar e concluir tarefas'
  | 'Dependência de instruções concretas e visuais'
  | 'Dificuldade em generalizar aprendizados para novos contextos'
  // DI - Sub-demandas de Comunicação e Linguagem
  | 'Atraso no desenvolvimento da fala'
  | 'Vocabulário reduzido e dificuldade de articulação'
  | 'Dificuldade em compreender instruções longas ou abstratas'
  | 'Comunicação centrada em necessidades básicas'
  | 'Uso frequente de gestos, expressões e comunicação alternativa'
  | 'Dificuldade de manutenção de diálogo espontâneo'
  // DI - Sub-demandas de Socioemocional e Comportamental
  | 'Dificuldade em interpretar emoções próprias e dos outros'
  | 'Imaturidade emocional (reações infantis, mesmo em idades avançadas)'
  | 'Frustração fácil diante de tarefas difíceis'
  | 'Ansiedade em situações sociais ou novas'
  | 'Dificuldade em resolver conflitos de forma adequada'
  | 'Baixa autoestima devido à percepção de limitações'
  // DI - Sub-demandas de Sensorial e Motor
  | 'Atraso no desenvolvimento motor grosso e fino (andar, correr, segurar objetos)'
  | 'Dificuldade em coordenação e equilíbrio'
  | 'Hipotonia muscular (fraqueza ou baixo tônus)'
  | 'Dificuldade em atividades que exigem precisão motora'
  | 'Necessidade de estimulação sensorial controlada'
  | 'Respostas exageradas a estímulos sensoriais (sons, toques, texturas)';

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
