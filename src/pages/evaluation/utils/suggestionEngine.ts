import { SavedEvaluation } from "@/hooks/useEvaluationStorage";

export interface DomainScore {
  domain: string;
  score: number;
  firstScore: number;
  lastScore: number;
  variation: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  targetDomains: string[];
}

export interface Game {
  name: string;
  icon: string;
  path: string;
  benefit: string;
}

export interface TherapeuticObjective {
  objective: string;
  strategies: string[];
}

export interface DomainSuggestion {
  domain: string;
  shortName: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  objectives: TherapeuticObjective[];
  activities: Activity[];
  games: Game[];
}

// Mapeamento de domínios para objetivos terapêuticos
const DOMAIN_OBJECTIVES: Record<string, TherapeuticObjective[]> = {
  "Musical": [
    {
      objective: "Desenvolver percepção e discriminação auditiva",
      strategies: [
        "Atividades de reconhecimento de timbres instrumentais",
        "Exercícios de discriminação de altura (grave/agudo)",
        "Jogos de memória sonora com padrões rítmicos"
      ]
    },
    {
      objective: "Estimular expressão musical espontânea",
      strategies: [
        "Improvisação livre com instrumentos de fácil manuseio",
        "Criação de pequenas melodias ou padrões rítmicos",
        "Vocalização expressiva durante atividades musicais"
      ]
    }
  ],
  "Psicossocial": [
    {
      objective: "Promover interação social através da música",
      strategies: [
        "Atividades musicais em dupla ou pequeno grupo",
        "Jogos de turnos com instrumentos",
        "Compartilhamento de instrumentos durante sessões"
      ]
    },
    {
      objective: "Desenvolver regulação emocional",
      strategies: [
        "Associação música-emoção com diferentes repertórios",
        "Expressão de sentimentos através de improvisação",
        "Atividades de relaxamento com música receptiva"
      ]
    }
  ],
  "Cognitivo": [
    {
      objective: "Estimular funções executivas através da música",
      strategies: [
        "Sequências musicais com complexidade progressiva",
        "Atividades que exigem planejamento e organização",
        "Jogos de atenção sustentada com estímulos sonoros"
      ]
    },
    {
      objective: "Desenvolver memória de trabalho",
      strategies: [
        "Repetição de padrões rítmicos de tamanho crescente",
        "Jogos de memória musical com sequências",
        "Aprendizado de letras e melodias simples"
      ]
    }
  ],
  "Sensório-Motor": [
    {
      objective: "Aprimorar coordenação motora fina e grossa",
      strategies: [
        "Tocar instrumentos com diferentes tamanhos e pesos",
        "Movimentos corporais sincronizados com música",
        "Atividades de percussão com gradação de intensidade"
      ]
    },
    {
      objective: "Integrar processamento sensorial auditivo-motor",
      strategies: [
        "Imitação de padrões rítmicos corporais",
        "Dança e movimento expressivo",
        "Resposta motora a estímulos sonoros específicos"
      ]
    }
  ],
  "Comunicativo-Interativo": [
    {
      objective: "Estimular comunicação verbal através da música",
      strategies: [
        "Canções com espaços para completar palavras",
        "Vocalização melódica de palavras e frases",
        "Diálogos musicais terapeuta-paciente"
      ]
    },
    {
      objective: "Desenvolver pragmática comunicativa",
      strategies: [
        "Turnos de conversação musical",
        "Histórias sonorizadas com participação ativa",
        "Expressão de necessidades através de sons/instrumentos"
      ]
    }
  ],
  "Neurofisiológico": [
    {
      objective: "Regular estados de alerta e atenção",
      strategies: [
        "Uso de música com diferentes andamentos",
        "Transições suaves entre atividades estimulantes e calmantes",
        "Técnicas de respiração com suporte musical"
      ]
    }
  ],
  "Executivo-Adaptativo": [
    {
      objective: "Desenvolver flexibilidade cognitiva",
      strategies: [
        "Improvisação com mudanças de regras",
        "Adaptação a diferentes estilos musicais",
        "Resolução de problemas musicais simples"
      ]
    }
  ]
};

// Mapeamento de domínios para atividades sugeridas
const DOMAIN_ACTIVITIES: Record<string, Activity[]> = {
  "Musical": [
    { id: "1", title: "Sequência Musical", description: "Reproduzir e criar sequências melódicas e rítmicas", targetDomains: ["Musical", "Cognitivo"] },
    { id: "2", title: "Classificação Sonora", description: "Categorizar sons por características (altura, intensidade, timbre)", targetDomains: ["Musical"] },
    { id: "3", title: "Composição Temática", description: "Criar pequenas peças musicais sobre temas específicos", targetDomains: ["Musical", "Comunicativo-Interativo"] }
  ],
  "Psicossocial": [
    { id: "4", title: "Expressão Emocional com Instrumentos", description: "Representar emoções através de improvisação instrumental", targetDomains: ["Psicossocial", "Musical"] },
    { id: "5", title: "Jogos de Turnos Musicais", description: "Atividades de alternância e espera com instrumentos", targetDomains: ["Psicossocial", "Comunicativo-Interativo"] },
    { id: "6", title: "Canção de Boas-Vindas/Despedida", description: "Rituais musicais para estruturar a sessão", targetDomains: ["Psicossocial"] }
  ],
  "Cognitivo": [
    { id: "7", title: "Puzzle Musical", description: "Organizar fragmentos musicais em sequência lógica", targetDomains: ["Cognitivo", "Musical"] },
    { id: "8", title: "Jogo de Memória Sonora", description: "Memorizar e reproduzir padrões sonoros", targetDomains: ["Cognitivo"] },
    { id: "9", title: "Sequências Estruturadas", description: "Seguir sequências musicais com complexidade crescente", targetDomains: ["Cognitivo", "Executivo-Adaptativo"] }
  ],
  "Sensório-Motor": [
    { id: "10", title: "Movimentos e Ações", description: "Coordenar movimentos corporais com estímulos musicais", targetDomains: ["Sensório-Motor"] },
    { id: "11", title: "Imitação Rítmica Estruturada", description: "Reproduzir padrões rítmicos com corpo e instrumentos", targetDomains: ["Sensório-Motor", "Musical"] },
    { id: "12", title: "Gradação Sensorial", description: "Explorar instrumentos com diferentes texturas e pesos", targetDomains: ["Sensório-Motor"] }
  ],
  "Comunicativo-Interativo": [
    { id: "13", title: "Completar Letras", description: "Preencher palavras em canções conhecidas", targetDomains: ["Comunicativo-Interativo", "Cognitivo"] },
    { id: "14", title: "Histórias Sonorizadas", description: "Criar narrativas com sons e instrumentos", targetDomains: ["Comunicativo-Interativo", "Musical"] },
    { id: "15", title: "Diálogos Musicais", description: "Estabelecer conversas usando instrumentos ou voz", targetDomains: ["Comunicativo-Interativo", "Psicossocial"] }
  ],
  "Neurofisiológico": [
    { id: "16", title: "Regulação com Música", description: "Usar música para modular estados de alerta", targetDomains: ["Neurofisiológico"] },
    { id: "17", title: "Respiração Musical", description: "Técnicas de respiração com suporte sonoro", targetDomains: ["Neurofisiológico", "Sensório-Motor"] }
  ],
  "Executivo-Adaptativo": [
    { id: "18", title: "Improvisação Guiada", description: "Criar música dentro de regras específicas", targetDomains: ["Executivo-Adaptativo", "Musical"] },
    { id: "19", title: "Resolução de Problemas Musicais", description: "Encontrar soluções criativas para desafios musicais", targetDomains: ["Executivo-Adaptativo", "Cognitivo"] }
  ]
};

// Mapeamento de domínios para jogos do MuseTera
const DOMAIN_GAMES: Record<string, Game[]> = {
  "Musical": [
    { name: "Guitar Hero", icon: "🎸", path: "/guitar-hero", benefit: "Desenvolve percepção rítmica e coordenação" },
    
    { name: "Musical Bells", icon: "🎵", path: "/musical-bells", benefit: "Estimula criação e exploração melódica" }
  ],
  "Psicossocial": [
    { name: "Music Composer", icon: "🎹", path: "/music-composer", benefit: "Promove expressão criativa e autoestima" },
    { name: "Musicogram", icon: "🎼", path: "/musicogram", benefit: "Facilita comunicação e interação social" }
  ],
  "Cognitivo": [
    { name: "Xylophone Hero", icon: "🎹", path: "/xylophone-hero", benefit: "Desenvolve atenção sustentada e memória de trabalho" },
    { name: "TEA Hero", icon: "🎯", path: "/tea-hero", benefit: "Trabalha sequenciamento e funções executivas" }
  ],
  "Sensório-Motor": [
    { name: "Boomwhacker Hero", icon: "🥁", path: "/boomwhacker-hero", benefit: "Aprimora coordenação motora e integração bilateral" },
    { name: "Bell Hero", icon: "🔔", path: "/bell-hero", benefit: "Desenvolve coordenação fina e timing motor" }
  ],
  "Comunicativo-Interativo": [
    { name: "Musical Bells", icon: "🔔", path: "/musical-bells", benefit: "Estimula vocalização e expressão comunicativa" },
    { name: "Musicogram", icon: "🎼", path: "/musicogram", benefit: "Facilita comunicação não-verbal e turnos" }
  ],
  "Neurofisiológico": [
    { name: "Music Composer", icon: "🎹", path: "/music-composer", benefit: "Auxilia na regulação do estado de alerta" }
  ],
  "Executivo-Adaptativo": [
    { name: "TEA Hero", icon: "🎯", path: "/tea-hero", benefit: "Desenvolve planejamento e flexibilidade" },
    { name: "Music Composer", icon: "🎹", path: "/music-composer", benefit: "Estimula tomada de decisão e organização" }
  ]
};

// Função para calcular tendência entre avaliações
export function calculateTrend(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 2) return 'stable';
  
  const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
  const secondHalf = scores.slice(Math.ceil(scores.length / 2));
  
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const difference = avgSecond - avgFirst;
  
  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

// Função principal para gerar sugestões terapêuticas
export function generateSuggestions(evaluations: SavedEvaluation[]): DomainSuggestion[] {
  if (evaluations.length === 0) return [];
  
  // Ordenar avaliações por data
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstEval = sortedEvaluations[0];
  const lastEval = sortedEvaluations[sortedEvaluations.length - 1];
  
  // Extrair domínios da última avaliação
  const domains = lastEval.content?.domainScores || [];
  
  // Calcular scores e tendências para cada domínio
  const domainAnalysis: DomainScore[] = domains.map(domain => {
    const domainName = domain.domain.replace("Domínio ", "");
    
    // Pegar scores históricos deste domínio
    const historicalScores = sortedEvaluations.map(evaluation => {
      const domainData = evaluation.content?.domainScores?.find(d => 
        d.domain.replace("Domínio ", "") === domainName
      );
      return domainData?.score || 0;
    });
    
    const firstScore = historicalScores[0] || 0;
    const lastScore = historicalScores[historicalScores.length - 1] || 0;
    
    return {
      domain: domain.domain,
      score: lastScore,
      firstScore,
      lastScore,
      variation: lastScore - firstScore,
      trend: calculateTrend(historicalScores)
    };
  });
  
  // Ordenar por pontuação (menor primeiro) para priorizar domínios que precisam de atenção
  const priorityDomains = [...domainAnalysis]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  
  // Gerar sugestões para os 3 domínios prioritários
  return priorityDomains.map(domain => {
    const shortName = domain.domain.replace("Domínio ", "");
    
    return {
      domain: domain.domain,
      shortName,
      score: domain.score,
      trend: domain.trend,
      objectives: DOMAIN_OBJECTIVES[shortName] || DOMAIN_OBJECTIVES["Musical"],
      activities: DOMAIN_ACTIVITIES[shortName] || [],
      games: DOMAIN_GAMES[shortName] || []
    };
  });
}

// Função para analisar áreas de melhora e atenção
export function analyzeAreas(evaluations: SavedEvaluation[]): {
  improved: DomainScore[];
  needsAttention: DomainScore[];
} {
  if (evaluations.length < 2) {
    return { improved: [], needsAttention: [] };
  }
  
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstEval = sortedEvaluations[0];
  const lastEval = sortedEvaluations[sortedEvaluations.length - 1];
  
  const domains = lastEval.content?.domainScores || [];
  
  const improved: DomainScore[] = [];
  const needsAttention: DomainScore[] = [];
  
  domains.forEach(domain => {
    const domainName = domain.domain.replace("Domínio ", "");
    
    const firstDomainData = firstEval.content?.domainScores?.find(d => 
      d.domain.replace("Domínio ", "") === domainName
    );
    
    const historicalScores = sortedEvaluations.map(evaluation => {
      const domainData = evaluation.content?.domainScores?.find(d => 
        d.domain.replace("Domínio ", "") === domainName
      );
      return domainData?.score || 0;
    });
    
    const firstScore = firstDomainData?.score || 0;
    const lastScore = domain.score || 0;
    const variation = lastScore - firstScore;
    
    const domainScore: DomainScore = {
      domain: domain.domain,
      score: lastScore,
      firstScore,
      lastScore,
      variation,
      trend: calculateTrend(historicalScores)
    };
    
    if (variation > 5) {
      improved.push(domainScore);
    } else {
      needsAttention.push(domainScore);
    }
  });
  
  // Ordenar: melhorias por maior variação, atenção por menor variação
  improved.sort((a, b) => b.variation - a.variation);
  needsAttention.sort((a, b) => a.variation - b.variation);
  
  return { improved, needsAttention };
}

// Função para calcular métricas gerais de evolução
export function calculateEvolutionMetrics(evaluations: SavedEvaluation[]): {
  totalEvaluations: number;
  firstDate: Date | null;
  lastDate: Date | null;
  globalProgress: number;
  averageInterval: number;
  nextSuggestedDate: Date | null;
} {
  if (evaluations.length === 0) {
    return {
      totalEvaluations: 0,
      firstDate: null,
      lastDate: null,
      globalProgress: 0,
      averageInterval: 0,
      nextSuggestedDate: null
    };
  }
  
  const sortedEvaluations = [...evaluations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstEval = sortedEvaluations[0];
  const lastEval = sortedEvaluations[sortedEvaluations.length - 1];
  
  const firstScore = firstEval.content?.overallScore?.percentage || 0;
  const lastScore = lastEval.content?.overallScore?.percentage || 0;
  
  const firstDate = new Date(firstEval.date);
  const lastDate = new Date(lastEval.date);
  
  // Calcular intervalo médio entre avaliações (em dias)
  let averageInterval = 90; // Padrão: 3 meses
  if (evaluations.length >= 2) {
    const totalDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    averageInterval = Math.round(totalDays / (evaluations.length - 1));
  }
  
  // Sugerir próxima data baseada no intervalo médio
  const nextSuggestedDate = new Date(lastDate);
  nextSuggestedDate.setDate(nextSuggestedDate.getDate() + averageInterval);
  
  return {
    totalEvaluations: evaluations.length,
    firstDate,
    lastDate,
    globalProgress: lastScore - firstScore,
    averageInterval,
    nextSuggestedDate
  };
}
