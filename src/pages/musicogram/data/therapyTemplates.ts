
import { TherapyTemplate } from "../types";

export const therapyTemplates: TherapyTemplate[] = [
  {
    id: "motor-coordination-1",
    name: "Coordenação Básica",
    category: "motor",
    difficulty: "easy",
    objective: "Desenvolver coordenação bilateral através de sequências rítmicas",
    description: "Atividade para estimular coordenação entre mãos usando padrões visuais simples",
    ageGroup: "3-6 anos",
    duration: "10-15 min",
    icon: "🤸",
    color: "#4CAF50",
    activities: [
      {
        id: "motor-seq-1",
        type: "sequence",
        title: "Padrão Alternado",
        instruction: "Toque na sequência: palma → tambor → palma → tambor",
        soundEnabled: true,
        symbols: [
          { id: "clap", emoji: "👏", name: "Palma", category: "action", color: "#FF5722" },
          { id: "drum", emoji: "🥁", name: "Tambor", category: "instrument", color: "#8BC34A" }
        ],
        correctOrder: [0, 1, 0, 1]
      }
    ]
  },
  {
    id: "emotional-expression-1",
    name: "Expressão Emocional",
    category: "emotional",
    difficulty: "easy",
    objective: "Identificar e expressar emoções através da música",
    description: "Atividade para reconhecimento e expressão de sentimentos",
    ageGroup: "4-8 anos",
    duration: "15-20 min",
    icon: "😊",
    color: "#FF9800",
    activities: [
      {
        id: "emotion-sel-1",
        type: "selection",
        title: "Como você está?",
        instruction: "Escolha o emoji que representa como você se sente agora",
        soundEnabled: true,
        symbols: [
          { id: "happy", emoji: "😊", name: "Feliz", category: "emotion", color: "#FFD54F" },
          { id: "sad", emoji: "😢", name: "Triste", category: "emotion", color: "#9E9E9E" },
          { id: "excited", emoji: "🤩", name: "Animado", category: "emotion", color: "#FF5722" },
          { id: "calm", emoji: "😌", name: "Calmo", category: "emotion", color: "#4CAF50" }
        ]
      }
    ]
  },
  {
    id: "communication-1",
    name: "Diálogo Musical",
    category: "communication",
    difficulty: "medium",
    objective: "Estimular comunicação através de turnos musicais",
    description: "Atividade de pergunta e resposta musical",
    ageGroup: "5-10 anos",
    duration: "20-25 min",
    icon: "💬",
    color: "#2196F3",
    activities: [
      {
        id: "comm-resp-1",
        type: "response",
        title: "Pergunta e Resposta",
        instruction: "Escute o padrão e crie sua resposta musical",
        soundEnabled: true,
        symbols: [
          { id: "note1", emoji: "🎵", name: "Nota", category: "instrument", color: "#2196F3" },
          { id: "question", emoji: "❓", name: "Pergunta", category: "action", color: "#FF9800" },
          { id: "answer", emoji: "❗", name: "Resposta", category: "action", color: "#4CAF50" }
        ]
      }
    ]
  },
  {
    id: "attention-focus-1",
    name: "Foco Seletivo",
    category: "attention",
    difficulty: "hard",
    objective: "Desenvolver atenção seletiva e sustentada",
    description: "Exercícios de concentração com múltiplos estímulos",
    ageGroup: "7-12 anos",
    duration: "25-30 min",
    icon: "🎯",
    color: "#9C27B0",
    activities: [
      {
        id: "attention-sel-1",
        type: "selection",
        title: "Encontre o Alvo",
        instruction: "Concentre-se apenas no tambor, ignore os outros sons",
        soundEnabled: true,
        timeLimit: 60,
        symbols: [
          { id: "target", emoji: "🎯", name: "Alvo", category: "action", color: "#FF5722" },
          { id: "eye", emoji: "👁️", name: "Foco", category: "action", color: "#795548" },
          { id: "music", emoji: "🎼", name: "Música", category: "instrument", color: "#607D8B" }
        ]
      }
    ]
  },
  {
    id: "social-skills-1",
    name: "Tocando Juntos",
    category: "social",
    difficulty: "easy",
    objective: "Promover interação e cooperação musical",
    description: "Atividades em grupo para habilidades sociais",
    ageGroup: "4-8 anos",
    duration: "20-30 min",
    icon: "👥",
    color: "#00BCD4",
    activities: [
      {
        id: "social-coop-1",
        type: "sequence",
        title: "Vez de Cada Um",
        instruction: "Aguarde sua vez e toque junto com o grupo",
        soundEnabled: true,
        symbols: [
          { id: "group", emoji: "👥", name: "Grupo", category: "action", color: "#FF9800" },
          { id: "handshake", emoji: "🤝", name: "Cooperação", category: "action", color: "#4CAF50" },
          { id: "music", emoji: "🎵", name: "Música", category: "instrument", color: "#2196F3" }
        ]
      }
    ]
  },
  {
    id: "memory-patterns-1",
    name: "Sequências Musicais",
    category: "memory",
    difficulty: "medium",
    objective: "Fortalecer memória auditiva e sequencial",
    description: "Jogos de memória com padrões musicais crescentes",
    ageGroup: "5-10 anos",
    duration: "20-25 min",
    icon: "🧠",
    color: "#E91E63",
    activities: [
      {
        id: "memory-seq-1",
        type: "sequence",
        title: "Repita a Sequência",
        instruction: "Memorize e repita a sequência de sons",
        soundEnabled: true,
        symbols: [
          { id: "brain", emoji: "🧠", name: "Memória", category: "action", color: "#FF5722" },
          { id: "repeat", emoji: "🔄", name: "Repetir", category: "action", color: "#009688" },
          { id: "note", emoji: "🎵", name: "Nota", category: "instrument", color: "#2196F3" }
        ],
        correctOrder: [2, 1, 2, 0, 2]
      }
    ]
  }
];
