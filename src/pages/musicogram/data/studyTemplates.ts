
import { StudyTemplate } from "../types";

export const musicStudyTemplates: StudyTemplate[] = [
  // COORDENAÇÃO MOTORA - Nível Fácil
  {
    id: "coordenacao-1",
    name: "Coordenação Básica",
    category: "Coordenação Motora",
    difficulty: "Fácil",
    objective: "Desenvolver coordenação bilateral básica",
    description: "Exercícios simples de batidas alternadas para estimular coordenação entre mãos",
    ageGroup: "3-6 anos",
    duration: "10-15 min",
    materials: ["Tambor", "Baquetas"],
    instructions: [
      "Posicione o tambor na frente da criança",
      "Demonstre batidas alternadas simples",
      "Acompanhe o ritmo lentamente",
      "Celebre cada acerto"
    ],
    rows: 6,
    columns: 6,
    gridLayout: {
      rows: 6,
      cols: 6,
      cellSize: 80
    },
    backgroundColor: "#f0f9ff",
    previewContent: "👏🥁👏🥁",
    elements: [
      { id: "1", type: "element", x: 80, y: 80, color: "#FF5722", size: 60, shape: "circle", iconType: "symbol", iconContent: "👏", position: { x: 80, y: 80 }, rotation: 0 },
      { id: "2", type: "element", x: 240, y: 80, color: "#8BC34A", size: 60, shape: "circle", iconType: "instrument", iconContent: "🥁", position: { x: 240, y: 80 }, rotation: 0 },
      { id: "3", type: "element", x: 400, y: 80, color: "#FF5722", size: 60, shape: "circle", iconType: "symbol", iconContent: "👏", position: { x: 400, y: 80 }, rotation: 0 },
      { id: "4", type: "element", x: 560, y: 80, color: "#8BC34A", size: 60, shape: "circle", iconType: "instrument", iconContent: "🥁", position: { x: 560, y: 80 }, rotation: 0 }
    ]
  },

  // EXPRESSÃO EMOCIONAL - Nível Fácil
  {
    id: "emocoes-1",
    name: "Expressando Alegria",
    category: "Expressão Emocional",
    difficulty: "Fácil",
    objective: "Identificar e expressar emoções através da música",
    description: "Atividade para trabalhar reconhecimento e expressão da alegria",
    ageGroup: "4-8 anos",
    duration: "15-20 min",
    materials: ["Chocalho", "Sino", "Pandeiro"],
    instructions: [
      "Mostre diferentes expressões faciais",
      "Associe cada emoção a um instrumento",
      "Pratique a sequência feliz",
      "Encoraje a expressão facial"
    ],
    rows: 5,
    columns: 7,
    gridLayout: {
      rows: 5,
      cols: 7,
      cellSize: 70
    },
    backgroundColor: "#fff3e0",
    previewContent: "😊🔔😊🔔",
    elements: [
      { id: "1", type: "element", x: 70, y: 70, color: "#FFD54F", size: 65, shape: "circle", iconType: "symbol", iconContent: "😊", position: { x: 70, y: 70 }, rotation: 0 },
      { id: "2", type: "element", x: 210, y: 70, color: "#4FC3F7", size: 65, shape: "circle", iconType: "instrument", iconContent: "🔔", position: { x: 210, y: 70 }, rotation: 0 },
      { id: "3", type: "element", x: 350, y: 70, color: "#FFD54F", size: 65, shape: "circle", iconType: "symbol", iconContent: "😊", position: { x: 350, y: 70 }, rotation: 0 },
      { id: "4", type: "element", x: 490, y: 70, color: "#4FC3F7", size: 65, shape: "circle", iconType: "instrument", iconContent: "🔔", position: { x: 490, y: 70 }, rotation: 0 }
    ]
  },

  // COMUNICAÇÃO - Nível Médio
  {
    id: "comunicacao-1",
    name: "Diálogo Musical",
    category: "Comunicação",
    difficulty: "Médio",
    objective: "Estimular comunicação através de turnos musicais",
    description: "Atividade de pergunta e resposta musical para desenvolver comunicação",
    ageGroup: "5-10 anos",
    duration: "20-25 min",
    materials: ["Xilofone", "Metalofone", "Baquetas"],
    instructions: [
      "Demonstre o conceito de pergunta musical",
      "Toque uma frase, espere a resposta",
      "Varie a dinâmica e altura",
      "Encoraje a criatividade"
    ],
    rows: 4,
    columns: 8,
    gridLayout: {
      rows: 4,
      cols: 8,
      cellSize: 75
    },
    backgroundColor: "#e8f5e8",
    previewContent: "🎵❓🎵❗",
    elements: [
      { id: "1", type: "element", x: 75, y: 75, color: "#2196F3", size: 70, shape: "circle", iconType: "symbol", iconContent: "🎵", position: { x: 75, y: 75 }, rotation: 0 },
      { id: "2", type: "element", x: 225, y: 75, color: "#FF9800", size: 70, shape: "circle", iconType: "symbol", iconContent: "❓", position: { x: 225, y: 75 }, rotation: 0 },
      { id: "3", type: "element", x: 375, y: 75, color: "#4CAF50", size: 70, shape: "circle", iconType: "symbol", iconContent: "🎵", position: { x: 375, y: 75 }, rotation: 0 },
      { id: "4", type: "element", x: 525, y: 75, color: "#F44336", size: 70, shape: "circle", iconType: "symbol", iconContent: "❗", position: { x: 525, y: 75 }, rotation: 0 }
    ]
  },

  // INTEGRAÇÃO SENSORIAL - Nível Médio
  {
    id: "sensorial-1",
    name: "Texturas Sonoras",
    category: "Integração Sensorial",
    difficulty: "Médio",
    objective: "Integrar estímulos táteis e auditivos",
    description: "Combinar diferentes texturas com sons específicos",
    ageGroup: "4-9 anos",
    duration: "15-25 min",
    materials: ["Instrumentos de texturas variadas", "Tecidos", "Objetos táteis"],
    instructions: [
      "Apresente cada textura separadamente",
      "Associe som a cada textura",
      "Pratique com olhos fechados",
      "Varie a intensidade"
    ],
    rows: 6,
    columns: 5,
    gridLayout: {
      rows: 6,
      cols: 5,
      cellSize: 85
    },
    backgroundColor: "#f3e5f5",
    previewContent: "✋🎶👂🎵",
    elements: [
      { id: "1", type: "element", x: 85, y: 85, color: "#9C27B0", size: 75, shape: "circle", iconType: "symbol", iconContent: "✋", position: { x: 85, y: 85 }, rotation: 0 },
      { id: "2", type: "element", x: 255, y: 85, color: "#673AB7", size: 75, shape: "circle", iconType: "symbol", iconContent: "🎶", position: { x: 255, y: 85 }, rotation: 0 },
      { id: "3", type: "element", x: 425, y: 85, color: "#3F51B5", size: 75, shape: "circle", iconType: "symbol", iconContent: "👂", position: { x: 425, y: 85 }, rotation: 0 },
      { id: "4", type: "element", x: 170, y: 170, color: "#2196F3", size: 75, shape: "circle", iconType: "symbol", iconContent: "🎵", position: { x: 170, y: 170 }, rotation: 0 }
    ]
  },

  // ATENÇÃO E CONCENTRAÇÃO - Nível Difícil
  {
    id: "atencao-1",
    name: "Foco Seletivo",
    category: "Atenção e Concentração",
    difficulty: "Difícil",
    objective: "Desenvolver atenção seletiva e sustentada",
    description: "Exercícios complexos de atenção auditiva com múltiplos estímulos",
    ageGroup: "7-12 anos",
    duration: "25-30 min",
    materials: ["Múltiplos instrumentos", "Metrônomo", "Cartões visuais"],
    instructions: [
      "Identifique o instrumento alvo",
      "Ignore os distratores",
      "Mantenha o foco por períodos crescentes",
      "Aumente gradualmente a complexidade"
    ],
    rows: 7,
    columns: 7,
    gridLayout: {
      rows: 7,
      cols: 7,
      cellSize: 65
    },
    backgroundColor: "#fff8e1",
    previewContent: "🎯👁️🎼🔍",
    elements: [
      { id: "1", type: "element", x: 65, y: 65, color: "#FF5722", size: 60, shape: "circle", iconType: "symbol", iconContent: "🎯", position: { x: 65, y: 65 }, rotation: 0 },
      { id: "2", type: "element", x: 195, y: 65, color: "#795548", size: 60, shape: "circle", iconType: "symbol", iconContent: "👁️", position: { x: 195, y: 65 }, rotation: 0 },
      { id: "3", type: "element", x: 325, y: 65, color: "#607D8B", size: 60, shape: "circle", iconType: "symbol", iconContent: "🎼", position: { x: 325, y: 65 }, rotation: 0 },
      { id: "4", type: "element", x: 455, y: 65, color: "#9E9E9E", size: 60, shape: "circle", iconType: "symbol", iconContent: "🔍", position: { x: 455, y: 65 }, rotation: 0 }
    ]
  },

  // HABILIDADES SOCIAIS - Nível Fácil
  {
    id: "social-1",
    name: "Tocando Juntos",
    category: "Habilidades Sociais",
    difficulty: "Fácil",
    objective: "Promover interação e cooperação musical",
    description: "Atividades em grupo para desenvolver habilidades sociais",
    ageGroup: "4-8 anos",
    duration: "20-30 min",
    materials: ["Instrumentos diversos", "Cartões de turno"],
    instructions: [
      "Estabeleça regras claras de turno",
      "Pratique esperar a vez",
      "Celebre as conquistas do grupo",
      "Encoraje a colaboração"
    ],
    rows: 5,
    columns: 6,
    gridLayout: {
      rows: 5,
      cols: 6,
      cellSize: 80
    },
    backgroundColor: "#e1f5fe",
    previewContent: "👥🤝🎵👏",
    elements: [
      { id: "1", type: "element", x: 80, y: 80, color: "#FF9800", size: 70, shape: "circle", iconType: "symbol", iconContent: "👥", position: { x: 80, y: 80 }, rotation: 0 },
      { id: "2", type: "element", x: 240, y: 80, color: "#4CAF50", size: 70, shape: "circle", iconType: "symbol", iconContent: "🤝", position: { x: 240, y: 80 }, rotation: 0 },
      { id: "3", type: "element", x: 400, y: 80, color: "#2196F3", size: 70, shape: "circle", iconType: "symbol", iconContent: "🎵", position: { x: 400, y: 80 }, rotation: 0 },
      { id: "4", type: "element", x: 320, y: 160, color: "#FF5722", size: 70, shape: "circle", iconType: "symbol", iconContent: "👏", position: { x: 320, y: 160 }, rotation: 0 }
    ]
  },

  // AUTORREGULAÇÃO - Nível Médio
  {
    id: "autoregulacao-1",
    name: "Controle do Ritmo",
    category: "Autorregulação",
    difficulty: "Médio",
    objective: "Desenvolver autocontrole através do ritmo",
    description: "Exercícios de aceleração e desaceleração consciente",
    ageGroup: "6-11 anos",
    duration: "20-25 min",
    materials: ["Metrônomo", "Tambor", "Cartões de velocidade"],
    instructions: [
      "Comece em ritmo lento",
      "Acelere gradualmente",
      "Pratique parar no comando",
      "Trabalhe respiração e ritmo"
    ],
    rows: 6,
    columns: 6,
    gridLayout: {
      rows: 6,
      cols: 6,
      cellSize: 75
    },
    backgroundColor: "#f1f8e9",
    previewContent: "🐌➡️🐇⏸️",
    elements: [
      { id: "1", type: "element", x: 75, y: 75, color: "#8BC34A", size: 65, shape: "circle", iconType: "symbol", iconContent: "🐌", position: { x: 75, y: 75 }, rotation: 0 },
      { id: "2", type: "element", x: 225, y: 75, color: "#FFC107", size: 65, shape: "circle", iconType: "symbol", iconContent: "➡️", position: { x: 225, y: 75 }, rotation: 0 },
      { id: "3", type: "element", x: 375, y: 75, color: "#FF5722", size: 65, shape: "circle", iconType: "symbol", iconContent: "🐇", position: { x: 375, y: 75 }, rotation: 0 },
      { id: "4", type: "element", x: 525, y: 75, color: "#9E9E9E", size: 65, shape: "circle", iconType: "symbol", iconContent: "⏸️", position: { x: 525, y: 75 }, rotation: 0 }
    ]
  },

  // CRIATIVIDADE - Nível Difícil
  {
    id: "criatividade-1",
    name: "Composição Livre",
    category: "Criatividade",
    difficulty: "Difícil",
    objective: "Estimular expressão criativa e improvisação",
    description: "Espaço aberto para criação musical individual",
    ageGroup: "8-15 anos",
    duration: "25-35 min",
    materials: ["Diversos instrumentos", "Papel pautado", "Gravador"],
    instructions: [
      "Ofereça liberdade total de criação",
      "Grave as criações",
      "Discuta as escolhas musicais",
      "Celebre a originalidade"
    ],
    rows: 8,
    columns: 8,
    gridLayout: {
      rows: 8,
      cols: 8,
      cellSize: 60
    },
    backgroundColor: "#fce4ec",
    previewContent: "🎨🎼✨💡",
    elements: [
      { id: "1", type: "element", x: 60, y: 60, color: "#E91E63", size: 55, shape: "circle", iconType: "symbol", iconContent: "🎨", position: { x: 60, y: 60 }, rotation: 0 },
      { id: "2", type: "element", x: 180, y: 60, color: "#9C27B0", size: 55, shape: "circle", iconType: "symbol", iconContent: "🎼", position: { x: 180, y: 60 }, rotation: 0 },
      { id: "3", type: "element", x: 300, y: 60, color: "#673AB7", size: 55, shape: "circle", iconType: "symbol", iconContent: "✨", position: { x: 300, y: 60 }, rotation: 0 },
      { id: "4", type: "element", x: 420, y: 60, color: "#FF9800", size: 55, shape: "circle", iconType: "symbol", iconContent: "💡", position: { x: 420, y: 60 }, rotation: 0 }
    ]
  },

  // RELAXAMENTO - Nível Fácil
  {
    id: "relaxamento-1",
    name: "Sons da Natureza",
    category: "Relaxamento",
    difficulty: "Fácil",
    objective: "Promover relaxamento e bem-estar",
    description: "Atividade com sons naturais para relaxamento profundo",
    ageGroup: "3-12 anos",
    duration: "15-30 min",
    materials: ["Instrumentos suaves", "Almofadas", "Música ambiente"],
    instructions: [
      "Crie ambiente calmo",
      "Use sons suaves e contínuos",
      "Pratique respiração profunda",
      "Termine gradualmente"
    ],
    rows: 4,
    columns: 5,
    gridLayout: {
      rows: 4,
      cols: 5,
      cellSize: 90
    },
    backgroundColor: "#e0f2f1",
    previewContent: "🌊🍃💤🧘",
    elements: [
      { id: "1", type: "element", x: 90, y: 90, color: "#00BCD4", size: 80, shape: "circle", iconType: "symbol", iconContent: "🌊", position: { x: 90, y: 90 }, rotation: 0 },
      { id: "2", type: "element", x: 270, y: 90, color: "#4CAF50", size: 80, shape: "circle", iconType: "symbol", iconContent: "🍃", position: { x: 270, y: 90 }, rotation: 0 },
      { id: "3", type: "element", x: 450, y: 90, color: "#9C27B0", size: 80, shape: "circle", iconType: "symbol", iconContent: "💤", position: { x: 450, y: 90 }, rotation: 0 },
      { id: "4", type: "element", x: 180, y: 180, color: "#FF9800", size: 80, shape: "circle", iconType: "symbol", iconContent: "🧘", position: { x: 180, y: 180 }, rotation: 0 }
    ]
  },

  // MEMÓRIA - Nível Médio
  {
    id: "memoria-1",
    name: "Sequências Musicais",
    category: "Memória",
    difficulty: "Médio",
    objective: "Fortalecer memória auditiva e sequencial",
    description: "Jogos de memória com padrões musicais crescentes",
    ageGroup: "5-10 anos",
    duration: "20-25 min",
    materials: ["Xilofone colorido", "Cartões de sequência"],
    instructions: [
      "Comece com sequências curtas",
      "Aumente progressivamente",
      "Use apoio visual inicialmente",
      "Pratique repetição ativa"
    ],
    rows: 5,
    columns: 7,
    gridLayout: {
      rows: 5,
      cols: 7,
      cellSize: 70
    },
    backgroundColor: "#fff3e0",
    previewContent: "🧠🔄🎵📝",
    elements: [
      { id: "1", type: "element", x: 70, y: 70, color: "#FF5722", size: 65, shape: "circle", iconType: "symbol", iconContent: "🧠", position: { x: 70, y: 70 }, rotation: 0 },
      { id: "2", type: "element", x: 210, y: 70, color: "#009688", size: 65, shape: "circle", iconType: "symbol", iconContent: "🔄", position: { x: 210, y: 70 }, rotation: 0 },
      { id: "3", type: "element", x: 350, y: 70, color: "#2196F3", size: 65, shape: "circle", iconType: "symbol", iconContent: "🎵", position: { x: 350, y: 70 }, rotation: 0 },
      { id: "4", type: "element", x: 490, y: 70, color: "#FFC107", size: 65, shape: "circle", iconType: "symbol", iconContent: "📝", position: { x: 490, y: 70 }, rotation: 0 }
    ]
  }
];
