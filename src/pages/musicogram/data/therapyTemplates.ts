
import { TherapyTemplate } from "../types";

export const therapyTemplates: TherapyTemplate[] = [
  {
    id: "sequence-1",
    name: "Sequência de Instrumentos Básica",
    category: "motor",
    difficulty: "easy",
    objective: "Desenvolver coordenação motora e memória sequencial",
    description: "O paciente deve reproduzir uma sequência de instrumentos musicais na ordem correta",
    ageGroup: "4-12 anos",
    duration: "5-10 min",
    icon: "🥁",
    color: "#3B82F6",
    activities: [
      {
        id: "seq-activity-1",
        type: "sequence",
        title: "Siga a Sequência Musical",
        instruction: "Ouça a sequência e depois toque os instrumentos na mesma ordem",
        correctOrder: [0, 1, 2],
        timeLimit: 30,
        soundEnabled: true,
        symbols: [
          {
            id: "drum",
            emoji: "🥁",
            name: "Tambor",
            category: "instrument",
            color: "#EF4444"
          },
          {
            id: "piano",
            emoji: "🎹",
            name: "Piano",
            category: "instrument",
            color: "#8B5CF6"
          },
          {
            id: "guitar",
            emoji: "🎸",
            name: "Violão",
            category: "instrument",
            color: "#F59E0B"
          }
        ]
      }
    ]
  },
  {
    id: "emotion-1",
    name: "Expressão Emocional",
    category: "emotional",
    difficulty: "medium",
    objective: "Reconhecer e expressar diferentes emoções através da música",
    description: "Atividades focadas no desenvolvimento emocional usando símbolos musicais",
    ageGroup: "5-15 anos",
    duration: "10-15 min",
    icon: "😊",
    color: "#10B981",
    activities: [
      {
        id: "emotion-activity-1",
        type: "selection",
        title: "Como você se sente?",
        instruction: "Escolha o símbolo que representa como a música te faz sentir",
        soundEnabled: true,
        symbols: [
          {
            id: "happy",
            emoji: "😊",
            name: "Feliz",
            category: "emotion",
            color: "#FDE047"
          },
          {
            id: "calm",
            emoji: "😌",
            name: "Calmo",
            category: "emotion",
            color: "#34D399"
          },
          {
            id: "excited",
            emoji: "🤗",
            name: "Animado",
            category: "emotion",
            color: "#F87171"
          },
          {
            id: "peaceful",
            emoji: "🕊️",
            name: "Tranquilo",
            category: "emotion",
            color: "#60A5FA"
          }
        ]
      }
    ]
  },
  {
    id: "movement-1",
    name: "Movimentos e Ações",
    category: "motor",
    difficulty: "easy",
    objective: "Coordenar movimentos corporais com estímulos musicais",
    description: "Desenvolve coordenação motora através de ações musicais",
    ageGroup: "3-10 anos",
    duration: "8-12 min",
    icon: "👏",
    color: "#F59E0B",
    activities: [
      {
        id: "movement-activity-1",
        type: "response",
        title: "Faça o Movimento!",
        instruction: "Quando ouvir o som, faça o movimento correspondente",
        soundEnabled: true,
        symbols: [
          {
            id: "clap",
            emoji: "👏",
            name: "Palma",
            category: "action",
            color: "#EF4444"
          },
          {
            id: "stomp",
            emoji: "🦶",
            name: "Pisada",
            category: "action",
            color: "#8B5CF6"
          },
          {
            id: "wave",
            emoji: "👋",
            name: "Acenar",
            category: "action",
            color: "#10B981"
          },
          {
            id: "jump",
            emoji: "🤸",
            name: "Pular",
            category: "action",
            color: "#F59E0B"
          }
        ]
      }
    ]
  },
  {
    id: "attention-1",
    name: "Foco e Atenção",
    category: "attention",
    difficulty: "medium",
    objective: "Melhorar capacidade de concentração e atenção sustentada",
    description: "Exercícios de atenção usando elementos musicais",
    ageGroup: "6-16 anos",
    duration: "10-15 min",
    icon: "🎯",
    color: "#8B5CF6",
    activities: [
      {
        id: "attention-activity-1",
        type: "sequence",
        title: "Concentre-se na Sequência",
        instruction: "Preste atenção na sequência de sons e repita exatamente",
        correctOrder: [0, 2, 1, 3],
        timeLimit: 45,
        soundEnabled: true,
        symbols: [
          {
            id: "high-note",
            emoji: "🎵",
            name: "Nota Aguda",
            category: "dynamic",
            color: "#F87171"
          },
          {
            id: "low-note",
            emoji: "🎶",
            name: "Nota Grave",
            category: "dynamic",
            color: "#3B82F6"
          },
          {
            id: "medium-note",
            emoji: "♪",
            name: "Nota Média",
            category: "dynamic",
            color: "#10B981"
          },
          {
            id: "silence",
            emoji: "🔇",
            name: "Silêncio",
            category: "dynamic",
            color: "#6B7280"
          }
        ]
      }
    ]
  },
  {
    id: "nature-sounds",
    name: "Sons da Natureza",
    category: "emotional",
    difficulty: "easy",
    objective: "Relaxamento e conexão com elementos naturais",
    description: "Atividade calmante usando sons da natureza",
    ageGroup: "3-18 anos",
    duration: "5-10 min",
    icon: "🌿",
    color: "#059669",
    activities: [
      {
        id: "nature-activity-1",
        type: "selection",
        title: "Escolha seu Som Favorito",
        instruction: "Toque no som da natureza que mais te relaxa",
        soundEnabled: true,
        symbols: [
          {
            id: "rain",
            emoji: "🌧️",
            name: "Chuva",
            category: "nature",
            color: "#3B82F6"
          },
          {
            id: "birds",
            emoji: "🐦",
            name: "Pássaros",
            category: "nature",
            color: "#10B981"
          },
          {
            id: "ocean",
            emoji: "🌊",
            name: "Oceano",
            category: "nature",
            color: "#06B6D4"
          },
          {
            id: "wind",
            emoji: "💨",
            name: "Vento",
            category: "nature",
            color: "#8B5CF6"
          }
        ]
      }
    ]
  }
];
