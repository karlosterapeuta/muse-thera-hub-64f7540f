import { Activity } from "../types";
import { activitiesData } from "../data/activities-data";

// Utility to convert basic activities to enhanced format
export function migrateBasicActivity(basicActivity: any, category: string): Activity {
  return {
    id: basicActivity.id,
    title: basicActivity.title,
    description: basicActivity.description,
    category: category,
    difficulty: "medium" as const,
    ageGroup: "6-16 anos",
    duration: "15-30 minutos",
    materials: ["Instrumentos musicais básicos", "Materiais de apoio"],
    objectives: [
      "Desenvolver habilidades específicas da categoria",
      "Promover expressão musical",
      "Estimular engajamento terapêutico"
    ],
    therapeuticAreas: getCategoryTherapeuticAreas(category),
    tags: getCategoryTags(category),
    instructions: [
      "Prepare o ambiente e materiais necessários",
      "Apresente a atividade de forma clara",
      "Demonstre o exemplo se necessário",
      "Acompanhe a execução fornecendo suporte",
      "Registre observações e progressos"
    ],
    adaptations: [
      "Para iniciantes: simplificar estrutura",
      "Para avançados: aumentar complexidade",
      "Para grupos: promover interação",
      "Para limitações: adaptar materiais"
    ],
    benefits: getCategoryBenefits(category),
    contraindications: [
      "Fadiga extrema",
      "Estados de agitação severa",
      "Hipersensibilidade não tratada"
    ],
    detailedInstructions: [
      {
        step: 1,
        title: "Preparação",
        description: "Organize o ambiente e materiais necessários para a atividade",
        subSteps: [
          {
            id: "prep-1",
            action: "Verificar disponibilidade de materiais",
            expectedResponse: "Todos os materiais estão disponíveis",
            duration: "2-3 minutos"
          },
          {
            id: "prep-2", 
            action: "Organizar o espaço físico",
            expectedResponse: "Ambiente adequado para a atividade",
            duration: "3-5 minutos"
          }
        ],
        timing: "5-8 minutos",
        observationPoints: [
          "Verificar se o ambiente está propício",
          "Confirmar que todos os materiais estão funcionais"
        ],
        tips: [
          "Prepare materiais extras para imprevistos",
          "Mantenha o ambiente calmo e organizado"
        ]
      },
      {
        step: 2,
        title: "Apresentação",
        description: "Introduza a atividade de forma clara e motivadora",
        subSteps: [
          {
            id: "intro-1",
            action: "Explicar o objetivo da atividade",
            expectedResponse: "Compreensão do propósito",
            duration: "2-3 minutos"
          },
          {
            id: "intro-2",
            action: "Demonstrar exemplo prático",
            expectedResponse: "Interesse e compreensão visual",
            duration: "3-5 minutos"
          }
        ],
        timing: "5-8 minutos",
        observationPoints: [
          "Nível de atenção e interesse",
          "Compreensão das instruções"
        ],
        tips: [
          "Use linguagem adequada à faixa etária",
          "Mantenha energia positiva e motivadora"
        ]
      },
      {
        step: 3,
        title: "Execução",
        description: "Acompanhe a realização da atividade fornecendo suporte",
        subSteps: [
          {
            id: "exec-1",
            action: "Iniciar atividade com participante",
            expectedResponse: "Engajamento ativo",
            duration: "10-15 minutos"
          },
          {
            id: "exec-2",
            action: "Fornecer feedback e orientações",
            expectedResponse: "Ajustes e melhorias na execução",
            duration: "durante toda a atividade"
          }
        ],
        timing: "10-20 minutos",
        observationPoints: [
          "Nível de engajamento",
          "Qualidade da execução",
          "Necessidade de adaptações"
        ],
        tips: [
          "Seja paciente e encorajador",
          "Faça adaptações conforme necessário"
        ]
      }
    ],
    preparationSteps: [
      {
        category: "environment",
        title: "Preparação do Ambiente",
        items: [
          {
            id: "env-1",
            description: "Verificar acústica e iluminação adequadas",
            required: true,
            timeNeeded: "2-3 minutos"
          },
          {
            id: "env-2",
            description: "Organizar disposição de assentos/espaço",
            required: true,
            timeNeeded: "3-5 minutos"
          }
        ]
      },
      {
        category: "materials",
        title: "Preparação de Materiais",
        items: [
          {
            id: "mat-1",
            description: "Verificar funcionamento de instrumentos",
            required: true,
            timeNeeded: "2-3 minutos"
          },
          {
            id: "mat-2",
            description: "Organizar materiais de apoio",
            required: false,
            timeNeeded: "2-3 minutos"
          }
        ]
      }
    ],
    facilitationGuide: {
      introduction: [
        "Cumprimente o participante de forma calorosa",
        "Explique brevemente o que faremos hoje",
        "Verifique o estado emocional/físico atual"
      ],
      keyPhrases: [
        "Vamos explorar juntos...",
        "Que interessante!",
        "Você está indo muito bem!",
        "O que você sente quando..."
      ],
      motivationTechniques: [
        "Reconheça pequenos progressos",
        "Use reforço positivo constante",
        "Permita escolhas quando possível",
        "Conecte com interesses pessoais"
      ],
      redirectionStrategies: [
        "Redirecione suavemente para o foco",
        "Use pausas musicais para reorganizar",
        "Modifique atividade se necessário",
        "Mantenha atmosfera positiva"
      ],
      closingApproach: [
        "Faça um resumo positivo da sessão",
        "Destaque progressos observados",
        "Antecipe próximo encontro",
        "Termine com momento musical relaxante"
      ]
    },
    executionTips: [
      {
        stage: "preparation",
        type: "success_indicator",
        content: "Participante demonstra interesse e curiosidade",
        severity: "low"
      },
      {
        stage: "execution",
        type: "warning_sign",
        content: "Sinais de fadiga ou frustração",
        severity: "medium"
      },
      {
        stage: "evaluation",
        type: "adaptation_cue",
        content: "Necessidade de simplificar ou complexificar",
        severity: "low"
      }
    ]
  };
}

function getCategoryTherapeuticAreas(category: string): string[] {
  const areas: Record<string, string[]> = {
    cognitive: ["Memória", "Atenção", "Funções Executivas", "Processamento"],
    social: ["Habilidades Sociais", "Comunicação", "Empatia", "Cooperação"],
    emotional: ["Regulação Emocional", "Expressão", "Autoconhecimento"],
    motor: ["Coordenação", "Ritmo", "Equilíbrio", "Expressão Corporal"],
    language: ["Comunicação Verbal", "Vocabulário", "Compreensão"],
    moral: ["Valores", "Ética", "Caráter", "Reflexão Moral"],
    creative: ["Criatividade", "Improvisação", "Expressão Artística"],
    psychosexual: ["Identidade", "Limites", "Autoconhecimento"],
    psychosocial: ["Integração Social", "Bem-estar", "Identidade"],
    intellectual: ["Raciocínio", "Análise", "Pensamento Crítico"],
    adaptive: ["Resiliência", "Flexibilidade", "Adaptação"],
    spiritual: ["Espiritualidade", "Transcendência", "Valores"],
    neurological: ["Neuroplasticidade", "Funções Cerebrais"],
    identity: ["Autoconhecimento", "Expressão Autêntica", "Identidade"]
  };
  return areas[category] || ["Desenvolvimento Geral"];
}

function getCategoryTags(category: string): string[] {
  const tags: Record<string, string[]> = {
    cognitive: ["memória", "atenção", "concentração", "sequência"],
    social: ["interação", "grupo", "cooperação", "comunicação"],
    emotional: ["emoções", "expressão", "regulação", "autoconhecimento"],
    motor: ["movimento", "coordenação", "ritmo", "corporal"],
    language: ["fala", "vocabulário", "comunicação", "linguagem"],
    moral: ["valores", "ética", "caráter", "reflexão"],
    creative: ["criatividade", "improvisação", "expressão", "arte"],
    psychosexual: ["identidade", "limites", "desenvolvimento"],
    psychosocial: ["social", "identidade", "bem-estar"],
    intellectual: ["raciocínio", "análise", "pensamento"],
    adaptive: ["adaptação", "resiliência", "flexibilidade"],
    spiritual: ["espiritualidade", "valores", "transcendência"],
    neurological: ["neurológico", "cerebral", "desenvolvimento"],
    identity: ["identidade", "autoconhecimento", "expressão"]
  };
  return tags[category] || ["geral"];
}

function getCategoryBenefits(category: string): string[] {
  const benefits: Record<string, string[]> = {
    cognitive: [
      "Melhora da capacidade de memória",
      "Aumento da concentração e atenção",
      "Desenvolvimento do pensamento sequencial",
      "Fortalecimento das funções executivas"
    ],
    social: [
      "Desenvolvimento de habilidades sociais",
      "Melhora na comunicação interpessoal",
      "Aumento da empatia e cooperação",
      "Fortalecimento de vínculos sociais"
    ],
    emotional: [
      "Maior consciência emocional",
      "Melhora na regulação emocional",
      "Desenvolvimento da expressão emocional",
      "Aumento da autoestima"
    ],
    motor: [
      "Melhora da coordenação motora",
      "Desenvolvimento do senso rítmico",
      "Aumento da consciência corporal",
      "Fortalecimento do equilíbrio"
    ],
    language: [
      "Expansão do vocabulário",
      "Melhora na articulação",
      "Desenvolvimento da comunicação",
      "Fortalecimento da compreensão"
    ]
  };
  return benefits[category] || [
    "Desenvolvimento de habilidades específicas",
    "Melhora no bem-estar geral",
    "Aumento da motivação terapêutica"
  ];
}

// Function to migrate all activities from a category
export function migrateCategory(categoryId: string): Activity[] {
  const basicActivities = activitiesData[categoryId] || [];
  return basicActivities.map(activity => migrateBasicActivity(activity, categoryId));
}

// Function to get combined activities (enhanced + migrated)
export function getCombinedActivities(enhancedData: Record<string, Activity[]>): Record<string, Activity[]> {
  const combined: Record<string, Activity[]> = { ...enhancedData };
  
  // For each category in activitiesData, add migrated activities if not already enhanced
  Object.keys(activitiesData).forEach(categoryId => {
    const enhancedActivities = enhancedData[categoryId] || [];
    const basicActivities = activitiesData[categoryId] || [];
    
    // Get activities that are not yet in enhanced format
    const enhancedIds = new Set(enhancedActivities.map(a => a.id));
    const newActivities = basicActivities
      .filter(activity => !enhancedIds.has(activity.id))
      .map(activity => migrateBasicActivity(activity, categoryId));
    
    combined[categoryId] = [...enhancedActivities, ...newActivities];
  });
  
  return combined;
}