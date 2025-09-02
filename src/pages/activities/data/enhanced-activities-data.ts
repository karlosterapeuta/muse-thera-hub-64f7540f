import { Activity } from "../types";

export const enhancedActivitiesData: Record<string, Activity[]> = {
  cognitive: [
    {
      id: 1,
      title: "Sequência Musical Progressiva",
      description: "Os participantes devem repetir e expandir sequências de notas tocadas pelo terapeuta, aumentando gradualmente a complexidade. Trabalha memória, atenção e processamento sequencial.",
      category: "cognitive",
      difficulty: "medium",
      ageGroup: "6-16 anos",
      duration: "15-25 minutos",
      materials: ["Piano ou teclado", "Instrumentos de percussão variados", "Cartões com símbolos musicais"],
      objectives: [
        "Desenvolver memória auditiva sequencial",
        "Fortalecer atenção sustentada",
        "Aprimorar processamento temporal"
      ],
      therapeuticAreas: ["Memória", "Atenção", "Funções Executivas"],
      tags: ["memória", "sequência", "atenção", "progressão", "instrumental"],
      instructions: [
        "Inicie com sequência de 3 notas simples",
        "Peça ao participante para repetir exatamente",
        "Adicione uma nota a cada acerto",
        "Introduza variações rítmicas gradualmente",
        "Registre o nível máximo alcançado"
      ],
      adaptations: [
        "Para iniciantes: usar apenas 2 notas",
        "Para avançados: incluir dinâmicas (forte/piano)",
        "Para grupos: criar competição amigável",
        "Para limitações motoras: usar apenas escuta"
      ],
      benefits: [
        "Melhora da memória de trabalho",
        "Desenvolvimento da discriminação auditiva",
        "Fortalecimento da concentração",
        "Estímulo da neuroplasticidade"
      ],
      contraindications: [
        "Fadiga extrema",
        "Crises de ansiedade severa",
        "Hipersensibilidade auditiva não tratada"
      ],
      resourceLinks: [
        {
          type: "image",
          title: "Setup da Atividade",
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
          description: "Disposição ideal dos instrumentos no espaço terapêutico"
        },
        {
          type: "image",
          title: "Posicionamento dos Participantes",
          url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
          description: "Como organizar o grupo para otimizar a escuta e participação"
        },
        {
          type: "image",
          title: "Cartões de Símbolos Musicais",
          url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
          description: "Exemplos de cartões visuais para apoiar a memorização"
        },
        {
          type: "image",
          title: "Sequência Visual - Exemplo",
          url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
          description: "Demonstração visual de como executar uma sequência de 4 notas"
        },
        {
          type: "audio",
          title: "Sequências Exemplo - Nível Iniciante",
          url: "/assets/audio/sequencias-iniciante.mp3",
          description: "Exemplos de sequências simples para começar"
        },
        {
          type: "document",
          title: "Protocolo de Progressão",
          url: "/assets/docs/protocolo-sequencias.pdf",
          description: "Diretrizes detalhadas para progressão de dificuldade"
        }
      ],
      evaluationCriteria: [
        "Número máximo de elementos na sequência",
        "Precisão na reprodução",
        "Tempo de resposta",
        "Capacidade de manter foco durante a atividade"
      ],
      sessionPlan: {
        warmUp: "Exercícios de escuta ativa com sons simples",
        mainActivity: "Sequências progressivas conforme protocolo",
        coolDown: "Improvisação livre com instrumentos utilizados",
        variations: [
          "Sequências melódicas",
          "Sequências rítmicas",
          "Sequências mistas (melodia + ritmo)"
        ],
        progressionSteps: [
          "Nível 1: 2-3 elementos",
          "Nível 2: 4-5 elementos",
          "Nível 3: 6-7 elementos",
          "Nível 4: 8+ elementos com variações"
        ]
      }
    },
    {
      id: 2,
      title: "Laboratório de Classificação Sonora",
      description: "Atividade estruturada de categorização onde participantes classificam diversos sons em múltiplas dimensões, desenvolvendo pensamento analítico e discriminação auditiva refinada.",
      category: "cognitive",
      difficulty: "medium",
      ageGroup: "8-18 anos",
      duration: "20-30 minutos",
      materials: ["Biblioteca de sons diversos", "Cartões de categorização", "Sistema de áudio", "Fichas de registro"],
      objectives: [
        "Desenvolver capacidades de classificação",
        "Aprimorar discriminação auditiva",
        "Fortalecer pensamento analítico",
        "Expandir vocabulário descritivo"
      ],
      therapeuticAreas: ["Cognição", "Linguagem", "Processamento Auditivo"],
      tags: ["classificação", "análise", "discriminação", "categorização", "vocabulário"],
      instructions: [
        "Apresente conjunto variado de sons",
        "Introduza critérios de classificação gradualmente",
        "Permita discussão sobre escolhas",
        "Explore múltiplas categorizações do mesmo som",
        "Registre evolução na complexidade das análises"
      ],
      adaptations: [
        "Visuais: adicionar representações gráficas",
        "Grupos: discussões colaborativas",
        "Individual: tempo estendido para análise",
        "Avançado: criar próprios critérios de classificação"
      ],
      benefits: [
        "Desenvolvimento do pensamento crítico",
        "Melhora na organização mental",
        "Expansão do vocabulário especializado",
        "Fortalecimento da atenção aos detalhes"
      ],
      resourceLinks: [
        {
          type: "image",
          title: "Estação de Classificação",
          url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
          description: "Setup da mesa de trabalho com cartões de categorização"
        },
        {
          type: "image",
          title: "Cartões de Categorização",
          url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
          description: "Exemplos de cartões organizados por critérios"
        },
        {
          type: "image",
          title: "Biblioteca de Sons Visual",
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
          description: "Representação visual dos diferentes tipos de sons utilizados"
        },
        {
          type: "image",
          title: "Processo de Classificação",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
          description: "Participante executando a atividade de classificação"
        }
      ],
      sessionPlan: {
        warmUp: "Escuta livre de sons variados",
        mainActivity: "Classificação sistemática seguindo protocolo",
        coolDown: "Criação de som que combine múltiplas categorias",
        variations: [
          "Classificação por fonte sonora",
          "Classificação por características acústicas",
          "Classificação emocional",
          "Classificação funcional"
        ]
      }
    }
  ],
  social: [
    {
      id: 1,
      title: "Círculo Harmônico de Integração",
      description: "Atividade estruturada de improvisação coletiva onde cada participante contribui para uma criação musical compartilhada, desenvolvendo habilidades de escuta, cooperação e expressão social.",
      category: "social",
      difficulty: "easy",
      ageGroup: "5-adult",
      duration: "25-40 minutos",
      materials: ["Instrumentos variados", "Gravador", "Metrônomo", "Caderno de registro grupal"],
      objectives: [
        "Desenvolver escuta ativa interpessoal",
        "Fortalecer habilidades de cooperação",
        "Promover expressão individual respeitosa",
        "Construir senso de pertencimento grupal"
      ],
      therapeuticAreas: ["Habilidades Sociais", "Comunicação", "Autoestima", "Integração Grupal"],
      tags: ["cooperação", "escuta", "improvisação", "grupo", "expressão"],
      instructions: [
        "Formar círculo com instrumentos no centro",
        "Estabelecer regras de participação respeitosa",
        "Iniciar com líder oferecendo tema musical",
        "Cada pessoa adiciona elemento quando se sentir pronta",
        "Gravar resultado final para escuta reflexiva"
      ],
      adaptations: [
        "Tímidos: começar apenas escutando",
        "Ansiosos: papéis pré-definidos inicialmente",
        "Conflituosos: mediação ativa do terapeuta",
        "Diversos níveis: instrumentos de diferentes complexidades"
      ],
      benefits: [
        "Melhora na comunicação não-verbal",
        "Desenvolvimento da empatia musical",
        "Fortalecimento da autoconfiança social",
        "Redução de ansiedade social"
      ],
      sessionPlan: {
        warmUp: "Círculo de nomes cantados",
        mainActivity: "Improvisação coletiva estruturada",
        coolDown: "Escuta reflexiva da gravação",
        variations: [
          "Tema livre",
          "Tema emocional específico",
          "Narrativa musical colaborativa",
          "Diálogo instrumental"
        ]
      }
    }
  ],
  emotional: [
    {
      id: 1,
      title: "Cartografia Emocional Sonora",
      description: "Criação de um 'mapa' pessoal de emoções utilizando diferentes sons, instrumentos e elementos musicais, desenvolvendo autoconsciência emocional e vocabulário afetivo.",
      category: "emotional",
      difficulty: "medium",
      ageGroup: "8-adult",
      duration: "30-45 minutos",
      materials: ["Instrumentos diversos", "Papel grande", "Marcadores coloridos", "Gravador", "Biblioteca de sons"],
      objectives: [
        "Desenvolver autoconsciência emocional",
        "Expandir vocabulário emocional",
        "Criar ferramentas de autorregulação",
        "Integrar expressão musical e emocional"
      ],
      therapeuticAreas: ["Regulação Emocional", "Autoconhecimento", "Expressão", "Mindfulness"],
      tags: ["emoções", "autoconsciência", "mapeamento", "expressão", "regulação"],
      instructions: [
        "Explorar diferentes instrumentos livremente",
        "Associar sons a estados emocionais",
        "Criar representação visual do mapa emocional",
        "Gravar 'trilha sonora' de diferentes emoções",
        "Praticar navegação consciente pelo mapa"
      ],
      adaptations: [
        "Crianças: usar emoções básicas inicialmente",
        "Adolescentes: incluir emoções complexas",
        "Adultos: integrar história emocional pessoal",
        "Grupos: mapas coletivos e individuais"
      ],
      benefits: [
        "Maior clareza sobre estados emocionais",
        "Desenvolvimento de estratégias de regulação",
        "Melhora na comunicação emocional",
        "Redução de reatividade emocional"
      ],
      sessionPlan: {
        warmUp: "Check-in emocional musical",
        mainActivity: "Construção do mapa emocional",
        coolDown: "Momento de gratidão musical",
        progressionSteps: [
          "Sessão 1: Emoções básicas",
          "Sessão 2: Nuances e intensidades",
          "Sessão 3: Transições emocionais",
          "Sessão 4: Integração e revisão"
        ]
      }
    }
  ],
  motor: [
    {
      id: 1,
      title: "Dança Sincronizada Progressiva",
      description: "Atividade de movimento coordenado que integra música, dança e exercícios motores específicos, desenvolvendo coordenação, ritmo corporal e consciência espacial.",
      category: "motor",
      difficulty: "medium",
      ageGroup: "4-16 anos",
      duration: "20-35 minutos",
      materials: ["Sistema de som", "Espelhos", "Fitas coloridas", "Marcadores de chão", "Músicas com BPM variado"],
      objectives: [
        "Desenvolver coordenação motora global",
        "Fortalecer ritmo e timing corporal",
        "Aprimorar consciência espacial",
        "Integrar audição e movimento"
      ],
      therapeuticAreas: ["Coordenação Motora", "Ritmo", "Propriocepção", "Integração Sensorial"],
      tags: ["movimento", "coordenação", "ritmo", "dança", "espacial"],
      instructions: [
        "Começar com movimentos simples no tempo da música",
        "Adicionar elementos de coordenação gradualmente",
        "Incorporar mudanças de direção e nível",
        "Praticar sincronização com parceiros",
        "Registrar evolução na complexidade dos movimentos"
      ],
      adaptations: [
        "Limitações físicas: movimentos adaptativos",
        "Cadeirantes: foco em membros superiores",
        "Hiperatividade: estrutura mais definida",
        "Timidez: começar com movimentos pequenos"
      ],
      benefits: [
        "Melhora na coordenação bilateral",
        "Desenvolvimento do senso rítmico",
        "Fortalecimento muscular funcional",
        "Aumento da autoconfiança corporal"
      ],
      sessionPlan: {
        warmUp: "Alongamento musical suave",
        mainActivity: "Sequência de movimentos progressivos",
        coolDown: "Relaxamento com música calma",
        progressionSteps: [
          "Nível 1: Movimentos simples unilaterais",
          "Nível 2: Coordenação bilateral básica",
          "Nível 3: Padrões complexos e mudanças de ritmo",
          "Nível 4: Criação coreográfica própria"
        ]
      }
    }
  ],
  language: [
    {
      id: 1,
      title: "Teatro Musical Comunicativo",
      description: "Dramatizações musicais estruturadas que integram narrativa, diálogo, canto e expressão corporal para desenvolver habilidades comunicativas globais.",
      category: "language",
      difficulty: "medium",
      ageGroup: "6-16 anos",
      duration: "35-50 minutos",
      materials: ["Instrumentos simples", "Adereços básicos", "Roteiros adaptáveis", "Gravador", "Cenários móveis"],
      objectives: [
        "Desenvolver expressão verbal e não-verbal",
        "Fortalecer habilidades narrativas",
        "Aprimorar prosódia e entonação",
        "Integrar comunicação multimodal"
      ],
      therapeuticAreas: ["Linguagem Expressiva", "Comunicação", "Narrativa", "Prosódia"],
      tags: ["teatro", "narrativa", "expressão", "comunicação", "dramatização"],
      instructions: [
        "Escolher narrativa adequada ao grupo",
        "Distribuir papéis considerando habilidades individuais",
        "Ensaiar diálogos com suporte musical",
        "Incorporar improvisação controlada",
        "Apresentar e refletir sobre a experiência"
      ],
      adaptations: [
        "Não-verbais: papéis com expressão corporal",
        "Tímidos: papéis menores inicialmente",
        "Dificuldades articulatórias: canções com apoio",
        "Grupos pequenos: múltiplos papéis por pessoa"
      ],
      benefits: [
        "Melhora na fluência verbal",
        "Desenvolvimento da expressividade",
        "Fortalecimento da autoconfiança comunicativa",
        "Integração de habilidades comunicativas"
      ],
      sessionPlan: {
        warmUp: "Exercícios vocais e corporais",
        mainActivity: "Ensaio e apresentação teatral",
        coolDown: "Reflexão sobre a experiência",
        variations: [
          "Contos clássicos musicalizados",
          "Situações cotidianas dramatizadas",
          "Histórias criadas pelo grupo",
          "Improvisações temáticas"
        ]
      }
    }
  ]
};