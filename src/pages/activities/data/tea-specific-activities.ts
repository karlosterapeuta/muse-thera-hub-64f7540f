import { Activity } from '../types';

export interface TEAActivity extends Activity {
  supportLevel: 1 | 2 | 3; // Nível de suporte no espectro
  sensoryProfile: {
    auditoryIntensity: 'low' | 'medium' | 'high';
    visualStimuli: 'minimal' | 'moderate' | 'rich';
    tactileElements: boolean;
    movementRequired: 'none' | 'minimal' | 'moderate' | 'high';
  };
  communicationStyle: 'verbal' | 'non-verbal' | 'mixed';
  attentionSpan: number; // minutos
  predictabilityLevel: 'high' | 'medium' | 'low';
  sensoryAlerts: string[];
  teaSpecificBenefits: string[];
  adaptationSuggestions: {
    level1: string[];
    level2: string[];
    level3: string[];
  };
}

export const teaActivitiesData: TEAActivity[] = [
  {
    id: 1001,
    title: "Sequências Musicais Estruturadas",
    description: "Atividade que utiliza padrões musicais repetitivos e previsíveis para desenvolver comunicação e regulação emocional.",
    category: "cognitive",
    difficulty: "easy",
    ageGroup: "3-12 anos",
    duration: "15-20 min",
    supportLevel: 2,
    sensoryProfile: {
      auditoryIntensity: 'low',
      visualStimuli: 'minimal',
      tactileElements: false,
      movementRequired: 'minimal'
    },
    communicationStyle: 'mixed',
    attentionSpan: 15,
    predictabilityLevel: 'high',
    sensoryAlerts: ["Sons podem ser repetitivos", "Volume controlável necessário"],
    materials: ["Instrumentos simples", "Cards visuais com sequências", "Timer visual"],
    objectives: [
      "Desenvolver tolerância a estímulos auditivos",
      "Melhorar capacidade de seguir sequências",
      "Promover autorregulação através do ritmo"
    ],
    therapeuticAreas: ["Comunicação Social", "Processamento Sensorial", "Comportamentos Repetitivos"],
    tags: ["estruturado", "previsível", "autorregulação", "sequências"],
    teaSpecificBenefits: [
      "Reduz ansiedade através da previsibilidade",
      "Canaliza comportamentos repetitivos funcionalmente",
      "Melhora regulação sensorial auditiva"
    ],
    adaptationSuggestions: {
      level1: [
        "Adicionar variações graduais nas sequências",
        "Incluir elementos de improvisação controlada",
        "Expandir para interação social em duplas"
      ],
      level2: [
        "Manter estrutura rígida inicialmente",
        "Usar apoios visuais claros para cada sequência",
        "Permitir pausas quando necessário"
      ],
      level3: [
        "Começar com sequências de 2-3 elementos apenas",
        "Usar comunicação alternativa/aumentativa",
        "Permitir estereotipias durante a atividade se funcionais"
      ]
    },
    instructions: [
      "Apresentar a sequência visualmente primeiro",
      "Demonstrar cada elemento da sequência",
      "Praticar um elemento por vez",
      "Combinar elementos gradualmente",
      "Permitir repetições até domínio"
    ]
  },
  {
    id: 1002,
    title: "Expressão Emocional com Instrumentos",
    description: "Uso de diferentes instrumentos para identificar, expressar e regular emoções de forma não-verbal.",
    category: "emotional",
    difficulty: "medium",
    ageGroup: "4-16 anos",
    duration: "20-25 min",
    supportLevel: 1,
    sensoryProfile: {
      auditoryIntensity: 'medium',
      visualStimuli: 'moderate',
      tactileElements: true,
      movementRequired: 'moderate'
    },
    communicationStyle: 'mixed',
    attentionSpan: 20,
    predictabilityLevel: 'medium',
    sensoryAlerts: ["Texturas variadas dos instrumentos", "Volume pode variar"],
    materials: ["Tambores", "Chocalhos", "Sinos", "Xilofone", "Cards de emoções"],
    objectives: [
      "Desenvolver vocabulário emocional",
      "Melhorar expressão não-verbal",
      "Fortalecer autorregulação emocional"
    ],
    therapeuticAreas: ["Regulação Emocional", "Comunicação Social", "Processamento Sensorial"],
    tags: ["emoções", "não-verbal", "instrumentos", "autorregulação"],
    teaSpecificBenefits: [
      "Oferece canal alternativo para expressão",
      "Desenvolve consciência interoceptiva",
      "Melhora tolerância a diferentes texturas"
    ],
    adaptationSuggestions: {
      level1: [
        "Incluir discussão verbal sobre as emoções",
        "Adicionar elementos de improvisação musical",
        "Trabalhar reconhecimento de emoções em outros"
      ],
      level2: [
        "Usar cards visuais para cada emoção",
        "Estabelecer rotina clara para cada instrumento",
        "Permitir escolha limitada de instrumentos"
      ],
      level3: [
        "Começar com 2-3 emoções básicas apenas",
        "Usar instrumentos familiares primeiro",
        "Permitir autoestimulação através dos instrumentos"
      ]
    },
    instructions: [
      "Apresentar cada instrumento individualmente",
      "Demonstrar como cada som pode representar uma emoção",
      "Permitir exploração livre inicial",
      "Guiar associações emoção-som gradualmente",
      "Praticar regulação através da música"
    ]
  },
  {
    id: 1003,
    title: "Jogos de Turnos Musicais",
    description: "Atividade estruturada para desenvolver habilidades sociais através da alternância musical.",
    category: "social",
    difficulty: "medium",
    ageGroup: "5-14 anos",
    duration: "15-30 min",
    supportLevel: 2,
    sensoryProfile: {
      auditoryIntensity: 'low',
      visualStimuli: 'moderate',
      tactileElements: false,
      movementRequired: 'minimal'
    },
    communicationStyle: 'mixed',
    attentionSpan: 25,
    predictabilityLevel: 'high',
    sensoryAlerts: ["Interação social necessária", "Aguardar vez pode ser desafiador"],
    materials: ["Instrumentos simples", "Timer visual", "Bastão de turno", "Símbolos visuais"],
    objectives: [
      "Desenvolver habilidades de turno",
      "Melhorar interação social",
      "Fortalecer atenção compartilhada"
    ],
    therapeuticAreas: ["Comunicação Social", "Comportamentos Repetitivos", "Regulação Emocional"],
    tags: ["turnos", "social", "atenção-compartilhada", "estruturado"],
    teaSpecificBenefits: [
      "Ensina paciência e espera de forma estruturada",
      "Desenvolve consciência do outro",
      "Melhora flexibilidade comportamental"
    ],
    adaptationSuggestions: {
      level1: [
        "Adicionar elementos de improviso nos turnos",
        "Incluir conversa sobre a experiência do parceiro",
        "Expandir para grupos maiores"
      ],
      level2: [
        "Usar timer visual claro para cada turno",
        "Estabelecer regras visuais explícitas",
        "Começar com turnos muito curtos"
      ],
      level3: [
        "Trabalhar inicialmente terapeuta-cliente apenas",
        "Usar objetos concretos para marcar turnos",
        "Permitir repetição do mesmo padrão se necessário"
      ]
    },
    instructions: [
      "Explicar o conceito de turno com apoios visuais",
      "Demonstrar com exemplo concreto",
      "Praticar turnos de 30 segundos inicialmente",
      "Aumentar gradualmente a duração",
      "Celebrar cada turno completado"
    ]
  },
  {
    id: 1004,
    title: "Gradação Sensorial Auditiva",
    description: "Exposição gradual a diferentes intensidades sonoras para desenvolver tolerância sensorial.",
    category: "sensory",
    difficulty: "easy",
    ageGroup: "3-10 anos",
    duration: "10-15 min",
    supportLevel: 3,
    sensoryProfile: {
      auditoryIntensity: 'low',
      visualStimuli: 'minimal',
      tactileElements: false,
      movementRequired: 'none'
    },
    communicationStyle: 'non-verbal',
    attentionSpan: 10,
    predictabilityLevel: 'high',
    sensoryAlerts: ["Hipersensibilidade auditiva", "Sons podem causar desconforto inicialmente"],
    materials: ["Instrumentos de volume graduável", "Fones de ouvido", "Escala visual de volume"],
    objectives: [
      "Aumentar tolerância auditiva",
      "Desenvolver autorregulação sensorial",
      "Reduzir comportamentos de fuga"
    ],
    therapeuticAreas: ["Processamento Sensorial", "Regulação Emocional", "Comportamentos Repetitivos"],
    tags: ["sensorial", "gradação", "tolerância", "autorregulação"],
    teaSpecificBenefits: [
      "Reduz hipersensibilidade auditiva",
      "Melhora participação em ambientes sonoros",
      "Desenvolve estratégias de enfrentamento"
    ],
    adaptationSuggestions: {
      level1: [
        "Trabalhar discriminação de intensidades",
        "Incluir elementos de controle próprio do volume",
        "Expandir para diferentes timbres"
      ],
      level2: [
        "Usar escala visual clara de intensidade",
        "Permitir pausas frequentes",
        "Começar com sons familiares"
      ],
      level3: [
        "Iniciar com volume mínimo audível",
        "Permitir uso de fones ou tampões se necessário",
        "Usar dessensibilização muito gradual"
      ]
    },
    instructions: [
      "Começar sempre no nível mais baixo tolerado",
      "Aumentar volume em incrementos mínimos",
      "Observar sinais de desconforto constantemente",
      "Permitir pausas quando solicitadas",
      "Registrar progressos diariamente"
    ]
  },
  {
    id: 1005,
    title: "Imitação Rítmica Estruturada",
    description: "Desenvolvimento de habilidades de imitação através de padrões rítmicos progressivos.",
    category: "cognitive",
    difficulty: "easy",
    ageGroup: "2-8 anos",
    duration: "10-20 min",
    supportLevel: 2,
    sensoryProfile: {
      auditoryIntensity: 'low',
      visualStimuli: 'moderate',
      tactileElements: true,
      movementRequired: 'moderate'
    },
    communicationStyle: 'non-verbal',
    attentionSpan: 15,
    predictabilityLevel: 'high',
    sensoryAlerts: ["Requer coordenação motora", "Pode ser frustrante inicialmente"],
    materials: ["Tambores pequenos", "Baquetas adaptadas", "Metrônomo visual", "Espelho"],
    objectives: [
      "Desenvolver habilidades de imitação",
      "Melhorar coordenação motora",
      "Fortalecer atenção visual"
    ],
    therapeuticAreas: ["Comunicação Social", "Coordenação Motora", "Comportamentos Repetitivos"],
    tags: ["imitação", "ritmo", "coordenação", "visual"],
    teaSpecificBenefits: [
      "Base para desenvolvimento da comunicação",
      "Melhora sincronização social",
      "Desenvolve praxias"
    ],
    adaptationSuggestions: {
      level1: [
        "Incluir variações criativas nos padrões",
        "Adicionar elementos melódicos",
        "Trabalhar imitação recíproca"
      ],
      level2: [
        "Usar apoio visual para cada batida",
        "Começar com padrões de 2-3 elementos",
        "Permitir velocidade própria inicialmente"
      ],
      level3: [
        "Trabalhar imitação básica de movimento primeiro",
        "Usar hand-over-hand se necessário",
        "Aceitar aproximações do padrão"
      ]
    },
    instructions: [
      "Demonstrar padrão lentamente",
      "Usar apoio visual simultâneo",
      "Permitir várias tentativas",
      "Celebrar cada tentativa",
      "Aumentar complexidade gradualmente"
    ]
  }
];

// Categorias específicas para TEA
export const teaCategories = [
  {
    id: "comunicacao-social",
    name: "Comunicação Social",
    description: "Atividades focadas no desenvolvimento de habilidades de interação e comunicação",
    color: "#3B82F6"
  },
  {
    id: "processamento-sensorial",
    name: "Processamento Sensorial",
    description: "Atividades para desenvolver tolerância e regulação sensorial",
    color: "#10B981"
  },
  {
    id: "comportamentos-repetitivos",
    name: "Comportamentos Repetitivos",
    description: "Atividades para canalizar e funcionalizar comportamentos repetitivos",
    color: "#F59E0B"
  },
  {
    id: "regulacao-emocional",
    name: "Regulação Emocional",
    description: "Atividades para desenvolver autorregulação e consciência emocional",
    color: "#EF4444"
  },
  {
    id: "coordenacao-motora",
    name: "Coordenação Motora",
    description: "Atividades para desenvolver habilidades motoras finas e grossas",
    color: "#8B5CF6"
  }
];

// Níveis de suporte
export const supportLevels = [
  {
    level: 1,
    name: "Nível 1 - Suporte Mínimo",
    description: "Necessita suporte para iniciar interações sociais",
    color: "#10B981"
  },
  {
    level: 2,
    name: "Nível 2 - Suporte Substancial",
    description: "Necessita suporte substancial para comunicação social",
    color: "#F59E0B"
  },
  {
    level: 3,
    name: "Nível 3 - Suporte Intenso",
    description: "Necessita suporte muito substancial",
    color: "#EF4444"
  }
];