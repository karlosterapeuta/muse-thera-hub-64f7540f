import { Activity } from "../types";

// Exemplo de atividade com dados detalhados para demonstrar as novas funcionalidades
export const sampleDetailedActivity: Activity = {
  id: 999,
  title: "Sequência Musical Interativa com Boomwhackers",
  description: "Atividade terapêutica que combina música, movimento e cognição usando tubos musicais coloridos para desenvolver múltiplas habilidades de forma lúdica e estruturada.",
  category: "cognitive",
  difficulty: "medium",
  ageGroup: "8-14 anos",
  duration: "30-40 minutos",
  materials: [
    "Set completo de Boomwhackers (8 tubos coloridos)",
    "Tapete ou demarcação do espaço",
    "Sistema de som para playback",
    "Cartões com códigos de cores",
    "Cronômetro",
    "Caderno para anotações"
  ],
  objectives: [
    "Desenvolver coordenação motora grossa e fina",
    "Fortalecer memória sequencial auditiva e visual",
    "Estimular atenção sustentada e dividida",
    "Promover interação social e trabalho em equipe",
    "Aprimorar processamento temporal e rítmico"
  ],
  therapeuticAreas: ["Cognição", "Motricidade", "Socialização", "Atenção"],
  tags: ["boomwhackers", "sequência", "cores", "ritmo", "grupo", "coordenação"],

  // NOVOS DADOS DETALHADOS

  preparationSteps: [
    {
      category: "environment",
      title: "Preparação do Ambiente",
      items: [
        {
          id: "env_1",
          description: "Delimitar área de atividade (mínimo 3x3 metros)",
          required: true,
          timeNeeded: "3 min",
          notes: "Espaço deve permitir movimento livre dos participantes"
        },
        {
          id: "env_2", 
          description: "Posicionar sistema de som com volume testado",
          required: true,
          timeNeeded: "2 min"
        },
        {
          id: "env_3",
          description: "Organizar assentos em semicírculo para observação",
          required: false,
          timeNeeded: "2 min",
          notes: "Para momentos de explicação e descanso"
        },
        {
          id: "env_4",
          description: "Verificar iluminação adequada para distinção de cores",
          required: true,
          timeNeeded: "1 min"
        }
      ]
    },
    {
      category: "materials",
      title: "Preparação dos Materiais",
      items: [
        {
          id: "mat_1",
          description: "Organizar Boomwhackers por ordem cromática",
          required: true,
          timeNeeded: "3 min",
          notes: "Sequência: C-D-E-F-G-A-B-C (Dó-Ré-Mi-Fá-Sol-Lá-Si-Dó)"
        },
        {
          id: "mat_2",
          description: "Preparar cartões de sequência colorida",
          required: true,
          timeNeeded: "2 min"
        },
        {
          id: "mat_3",
          description: "Testar cada tubo individualmente",
          required: true,
          timeNeeded: "2 min",
          notes: "Verificar se todos produzem som claro"
        },
        {
          id: "mat_4",
          description: "Organizar material de registro",
          required: false,
          timeNeeded: "1 min"
        }
      ]
    },
    {
      category: "therapist",
      title: "Preparação do Terapeuta",
      items: [
        {
          id: "ther_1",
          description: "Revisar sequências musicais planejadas",
          required: true,
          timeNeeded: "5 min"
        },
        {
          id: "ther_2",
          description: "Praticar demonstração da atividade",
          required: true,
          timeNeeded: "3 min",
          notes: "Executar ao menos uma sequência completa"
        },
        {
          id: "ther_3",
          description: "Preparar adaptações para diferentes níveis",
          required: true,
          timeNeeded: "2 min"
        }
      ]
    },
    {
      category: "participants", 
      title: "Preparação dos Participantes",
      items: [
        {
          id: "part_1",
          description: "Verificar condições físicas dos participantes",
          required: true,
          timeNeeded: "2 min",
          notes: "Observar limitações motoras ou auditivas"
        },
        {
          id: "part_2",
          description: "Explicar regras básicas de segurança",
          required: true,
          timeNeeded: "2 min"
        },
        {
          id: "part_3",
          description: "Distribuir participantes no espaço",
          required: true,
          timeNeeded: "1 min"
        }
      ]
    }
  ],

  detailedInstructions: [
    {
      step: 1,
      title: "Aquecimento e Familiarização",
      description: "Introdução aos instrumentos e conceitos básicos da atividade",
      timing: "8-10 min",
      subSteps: [
        {
          id: "step1_1",
          action: "Apresentar os Boomwhackers individualmente",
          expectedResponse: "Participantes demonstram atenção e curiosidade",
          duration: "2 min",
          notes: "Permitir que toquem e explorem livremente"
        },
        {
          id: "step1_2", 
          action: "Demonstrar a produção de som (batida no chão vs no corpo)",
          expectedResponse: "Compreensão das diferentes técnicas",
          duration: "2 min"
        },
        {
          id: "step1_3",
          action: "Associar cada cor à sua nota musical",
          expectedResponse: "Reconhecimento visual-auditivo das correspondências",
          duration: "3 min",
          notes: "Usar mnemônicos se necessário"
        },
        {
          id: "step1_4",
          action: "Executar escala cromática em grupo",
          expectedResponse: "Participação coordenada na sequência",
          duration: "2 min"
        }
      ],
      observationPoints: [
        "Nível de atenção e engajamento de cada participante",
        "Capacidade de produzir som consistente",
        "Compreensão da associação cor-som",
        "Coordenação motora inicial"
      ],
      tips: [
        "Use entusiasmo vocal para manter energia alta",
        "Permita exploração livre antes de estruturar",
        "Identifique rapidamente participantes com dificuldades motoras"
      ],
      commonIssues: [
        "Participante muito tímido: ofereça tubo favorito e encoraje gentilmente",
        "Dificuldade motora: adapte técnica de percussão ou ofereça apoio",
        "Dispersão: use contato visual direto e chamada pelo nome"
      ]
    },
    {
      step: 2,
      title: "Sequências Simples Guiadas",
      description: "Prática de sequências básicas com suporte visual e auditivo",
      timing: "10-12 min",
      subSteps: [
        {
          id: "step2_1",
          action: "Demonstrar sequência de 3 notas (ex: C-E-G)",
          expectedResponse: "Atenção focada na demonstração",
          duration: "1 min"
        },
        {
          id: "step2_2",
          action: "Repetir a sequência pedindo imitação em grupo",
          expectedResponse: "Tentativa de imitação, mesmo que imperfeita",
          duration: "3 min"
        },
        {
          id: "step2_3",
          action: "Dividir grupo e alternar execução da sequência",
          expectedResponse: "Colaboração e escuta ativa entre subgrupos",
          duration: "4 min",
          notes: "Grupo A toca, Grupo B escuta e vice-versa"
        },
        {
          id: "step2_4",
          action: "Introduzir sequência de 4 notas (ex: C-D-E-F)",
          expectedResponse: "Adaptação ao aumento de complexidade",
          duration: "3 min"
        }
      ],
      observationPoints: [
        "Precisão na reprodução das sequências",
        "Capacidade de memória auditiva",
        "Coordenação temporal com outros participantes",
        "Sinais de frustração ou fadiga"
      ],
      tips: [
        "Mantenha ritmo constante e previsível",
        "Use contagem verbal clara (1-2-3-4)",
        "Celebre acertos parciais para manter motivação",
        "Repita sequências problemáticas sem criticar"
      ],
      commonIssues: [
        "Dessincronia no grupo: reduza velocidade e use contagem mais marcada",
        "Esquecimento da sequência: volte para sequências mais simples",
        "Competição negativa: enfatize colaboração ao invés de perfeição"
      ]
    },
    {
      step: 3,
      title: "Criação Colaborativa",
      description: "Participantes criam suas próprias sequências musicais em grupo",
      timing: "8-10 min",
      subSteps: [
        {
          id: "step3_1",
          action: "Convidar um participante para criar sequência de 3 notas",
          expectedResponse: "Iniciativa criativa e experimentação",
          duration: "2 min"
        },
        {
          id: "step3_2",
          action: "Grupo repete a sequência criada",
          expectedResponse: "Valorização e imitação da criação do colega",
          duration: "2 min"
        },
        {
          id: "step3_3",
          action: "Cada participante adiciona uma nota à sequência",
          expectedResponse: "Construção colaborativa e criatividade",
          duration: "4 min",
          notes: "Sequência cresce progressivamente"
        },
        {
          id: "step3_4",
          action: "Executar a sequência final completa",
          expectedResponse: "Orgulho e satisfação com criação coletiva",
          duration: "2 min"
        }
      ],
      observationPoints: [
        "Criatividade e iniciativa individual",
        "Resposta às criações dos colegas",
        "Capacidade de lembrar sequências mais longas",
        "Dinâmica de grupo e liderança"
      ],
      tips: [
        "Encoraje todas as tentativas, mesmo as 'diferentes'",
        "Use linguagem positiva para todas as contribuições",
        "Ajude participantes mais tímidos oferecendo apoio",
        "Documente sequências interessantes para revisitar"
      ]
    },
    {
      step: 4,
      title: "Desafio Final e Encerramento",
      description: "Consolidação das aprendizagens através de desafio estruturado",
      timing: "8-10 min",
      subSteps: [
        {
          id: "step4_1",
          action: "Propor execução da sequência mais complexa criada",
          expectedResponse: "Engajamento no desafio final",
          duration: "3 min"
        },
        {
          id: "step4_2",
          action: "Realizar reflexão em grupo sobre a experiência",
          expectedResponse: "Verbalização de aprendizados e sentimentos",
          duration: "3 min",
          notes: "Perguntas: O que foi mais difícil? O que mais gostaram?"
        },
        {
          id: "step4_3",
          action: "Executar encerramento musical colaborativo",
          expectedResponse: "Sensação de conclusão e accomplishment",
          duration: "2 min",
          notes: "Pode ser improvisação livre ou sequência favorita"
        }
      ],
      observationPoints: [
        "Capacidade de executar sequências complexas",
        "Qualidade da reflexão e autoavaliação",
        "Estado emocional ao final da atividade",
        "Indicações de transferência de aprendizado"
      ],
      tips: [
        "Mantenha energia positiva mesmo se houver erros",
        "Facilite reflexão sem forçar verbalizações",
        "Termine sempre em nota alta e celebrativa"
      ]
    }
  ],

  facilitationGuide: {
    introduction: [
      "Olá pessoal! Hoje vamos fazer música de uma forma muito especial usando estes tubos coloridos mágicos!",
      "Cada cor vai produzir um som diferente, e juntos vamos criar nossa própria orquestra!",
      "Lembrem-se: não existe certo ou errado aqui, só existe nossa criatividade e diversão!"
    ],
    keyPhrases: [
      "Muito bem! Vocês estão criando música de verdade!",
      "Vamos tentar juntos, no nosso tempo!",
      "Que som interessante! Como vocês fizeram isso?",
      "Agora vamos escutar o que nossos colegas criaram!",
      "Vocês perceberam como cada cor tem sua personalidade musical?"
    ],
    motivationTechniques: [
      "Usar linguagem musical: 'Que melodia linda!', 'Vocês são verdadeiros compositores!'",
      "Criar momentos de liderança individual: cada um dirige a orquestra por alguns momentos",
      "Celebrar descobertas: 'Vocês descobriram uma nova maneira de fazer música!'",
      "Conectar com experiências pesicais: 'Isso me lembra uma música que vocês conhecem?'"
    ],
    redirectionStrategies: [
      "Se houver dispersão: 'Vamos dar uma chance para este som especial que [nome] descobriu!'",
      "Para resistência: 'Que tal você ser nosso maestro e conduzir os outros?'",
      "Quando há competição: 'Nossa orquestra fica mais bonita quando todos tocam juntos!'",
      "Para timidez excessiva: 'Você pode começar bem baixinho, só para a gente escutar...'"
    ],
    closingApproach: [
      "Vamos fazer nosso grande finale! Todos juntos, com energia!",
      "Que música incrível criamos hoje! Vocês são artistas de verdade!",
      "Vamos guardar essa música especial no nosso coração até a próxima vez!"
    ]
  },

  executionTips: [
    {
      stage: "preparation",
      type: "success_indicator",
      content: "Ambiente organizado permite fluidez e reduz distrações durante a atividade",
      severity: "medium"
    },
    {
      stage: "preparation", 
      type: "warning_sign",
      content: "Ruídos externos podem interferir na percepção auditiva - procure ambiente mais silencioso",
      severity: "high"
    },
    {
      stage: "execution",
      type: "success_indicator", 
      content: "Participantes sorriem, fazem contato visual e experimentam espontaneamente - ótimo engajamento!",
      severity: "low"
    },
    {
      stage: "execution",
      type: "warning_sign",
      content: "Mais de 2 participantes dispersos ou frustrados - reduza complexidade imediatamente",
      severity: "high"
    },
    {
      stage: "execution",
      type: "adaptation_cue",
      content: "Se grupo domina rapidamente, introduza variações rítmicas ou dinâmicas (forte/suave)",
      severity: "medium"
    },
    {
      stage: "execution",
      type: "timing_note",
      content: "Cada sequência deve ser repetida pelo menos 3 vezes antes de avançar",
      severity: "medium"
    },
    {
      stage: "evaluation",
      type: "success_indicator",
      content: "Participantes pedem para repetir ou sugerem variações - aprendizado consolidado",
      severity: "low"
    },
    {
      stage: "evaluation",
      type: "adaptation_cue",
      content: "Se houver fadiga, encurte reflexão final e foque em encerramento positivo",
      severity: "medium"
    }
  ],

  instructions: [
    "Organize os Boomwhackers em sequência cromática visível",
    "Demonstre a técnica básica de percussão",
    "Inicie com sequências de 3 notas simples",
    "Permita exploração livre antes de estruturar",
    "Introduza complexidade gradualmente",
    "Promova momentos de criação individual e coletiva",
    "Finalize com reflexão sobre a experiência musical"
  ],
  
  adaptations: [
    "Para limitações motoras: usar suporte ou técnica de percussão adaptada",
    "Para deficiência auditiva: enfatizar vibração tátil e pistas visuais",
    "Para grupos menores: cada participante usa múltiplos tubos",
    "Para idades menores: usar apenas 4-5 tubos e sequências mais simples",
    "Para dificuldades cognitivas: manter sequências de máximo 3 notas"
  ],
  
  benefits: [
    "Desenvolvimento da coordenação bilateral",
    "Fortalecimento da memória sequencial",
    "Estímulo da criatividade musical",
    "Melhora da atenção sustentada",
    "Promoção da interação social positiva",
    "Integração sensorial múltipla"
  ],
  
  contraindications: [
    "Hipersensibilidade auditiva severa não tratada",
    "Limitações motoras que impeçam percussão segura",
    "Episódios agudos de ansiedade ou agitação"
  ],

  evaluationCriteria: [
    "Capacidade de reproduzir sequências de 3-4 notas",
    "Coordenação temporal com o grupo",
    "Iniciativa criativa na proposição de sequências",
    "Qualidade da interação social durante a atividade",
    "Manutenção da atenção durante toda a sessão",
    "Expressão de prazer e satisfação"
  ],

  sessionPlan: {
    warmUp: "Familiarização com os instrumentos e exploração livre dos sons (8 min)",
    mainActivity: "Sequências guiadas progressivas e criação colaborativa (18 min)",
    coolDown: "Reflexão em grupo e encerramento musical celebrativo (8 min)",
    variations: [
      "Usar backing tracks para acompanhamento",
      "Introduzir movimentos corporais com as sequências",
      "Criar 'conversas musicais' entre duplas",
      "Desenvolver sequências temáticas (ex: música para chuva, para alegria)"
    ],
    progressionSteps: [
      "Nível 1: Sequências de 3 notas com apoio visual",
      "Nível 2: Sequências de 4-5 notas sem apoio", 
      "Nível 3: Criação de sequências individuais",
      "Nível 4: Harmonização com múltiplas vozes",
      "Nível 5: Improvisação livre estruturada"
    ]
  }
};