
import { MusicalSequence, MusicalNote, InstrumentConfig } from "@/types/musicTypes";

// Configurações CORRIGIDAS e SINCRONIZADAS para cada instrumento
export const instrumentConfigs: Record<string, InstrumentConfig> = {
  bell: {
    baseFrequencies: {
      C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.00, A: 440.00, B: 493.88
    },
    octaveMultiplier: 1
  },
  xylophone: {
    baseFrequencies: {
      C: 523.25, D: 587.33, E: 659.25, F: 698.46, G: 783.99, A: 880.00, B: 987.77
    },
    octaveMultiplier: 2
  },
  keyboard: {
    baseFrequencies: {
      C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.00, A: 440.00, B: 493.88
    },
    octaveMultiplier: 1
  }
};

// Função para criar nota com frequência SINCRONIZADA
const createNote = (note: string, octave: number, duration: number, timing: number, instrument: string): MusicalNote => {
  const config = instrumentConfigs[instrument];
  const baseFreq = config.baseFrequencies[note];
  const frequency = baseFreq; // Usar frequência exata do instrumento
  
  return { note, octave, frequency, duration, timing };
};

// SEQUÊNCIAS MUSICAIS COMPLETAS - 18 músicas infantis TEA-optimized
export const musicalSequences: Record<string, MusicalSequence> = {
  // === SINO (BELL) - 6 músicas ===
  "twinkle-bell": {
    id: "twinkle-bell", name: "Brilha, Brilha Estrelinha", bpm: 120, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("C", 4, 500, 0, "bell"), createNote("C", 4, 500, 500, "bell"),
      createNote("G", 4, 500, 1000, "bell"), createNote("G", 4, 500, 1500, "bell"),
      createNote("A", 4, 500, 2000, "bell"), createNote("A", 4, 500, 2500, "bell"),
      createNote("G", 4, 1000, 3000, "bell"),
      createNote("F", 4, 500, 4000, "bell"), createNote("F", 4, 500, 4500, "bell"),
      createNote("E", 4, 500, 5000, "bell"), createNote("E", 4, 500, 5500, "bell"),
      createNote("D", 4, 500, 6000, "bell"), createNote("D", 4, 500, 6500, "bell"),
      createNote("C", 4, 1000, 7000, "bell")
    ]
  },

  "mary-lamb-bell": {
    id: "mary-lamb-bell", name: "Maria, Maria", bpm: 100, timeSignature: "4/4",
    totalDuration: 12000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("E", 4, 500, 0, "bell"), createNote("D", 4, 500, 600, "bell"),
      createNote("C", 4, 500, 1200, "bell"), createNote("D", 4, 500, 1800, "bell"),
      createNote("E", 4, 500, 2400, "bell"), createNote("E", 4, 500, 3000, "bell"),
      createNote("E", 4, 1000, 3600, "bell"),
      createNote("D", 4, 500, 4800, "bell"), createNote("D", 4, 500, 5400, "bell"),
      createNote("D", 4, 1000, 6000, "bell")
    ]
  },

  "borboletinha-bell": {
    id: "borboletinha-bell", name: "Borboletinha", bpm: 90, timeSignature: "4/4",
    totalDuration: 18000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("C", 4, 600, 0, "bell"), createNote("D", 4, 600, 666, "bell"),
      createNote("E", 4, 600, 1332, "bell"), createNote("F", 4, 600, 1998, "bell"),
      createNote("G", 4, 600, 2664, "bell"), createNote("A", 4, 600, 3330, "bell"),
      createNote("G", 4, 600, 3996, "bell"), createNote("F", 4, 600, 4662, "bell"),
      createNote("E", 4, 1200, 5328, "bell")
    ]
  },


  "atirei-pau-bell": {
    id: "atirei-pau-bell", name: "Atirei o Pau no Gato", bpm: 100, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("G", 4, 500, 0, "bell"), createNote("E", 4, 500, 600, "bell"),
      createNote("E", 4, 500, 1200, "bell"), createNote("F", 4, 500, 1800, "bell"),
      createNote("D", 4, 500, 2400, "bell"), createNote("D", 4, 500, 3000, "bell"),
      createNote("C", 4, 1000, 3600, "bell")
    ]
  },

  "escravos-jó-bell": {
    id: "escravos-jó-bell", name: "Escravos de Jó", bpm: 120, timeSignature: "4/4",
    totalDuration: 14000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("C", 4, 400, 0, "bell"), createNote("D", 4, 400, 500, "bell"),
      createNote("E", 4, 400, 1000, "bell"), createNote("F", 4, 400, 1500, "bell"),
      createNote("G", 4, 400, 2000, "bell"), createNote("G", 4, 400, 2500, "bell"),
      createNote("A", 4, 400, 3000, "bell"), createNote("A", 4, 400, 3500, "bell"),
      createNote("G", 4, 800, 4000, "bell")
    ]
  },

  // === XILOFONE - 6 músicas ===
  "happy-birthday-xylophone": {
    id: "happy-birthday-xylophone", name: "Parabéns para Você", bpm: 100, timeSignature: "3/4",
    totalDuration: 20000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("C", 5, 400, 0, "xylophone"), createNote("C", 5, 400, 600, "xylophone"),
      createNote("D", 5, 800, 1200, "xylophone"), createNote("C", 5, 800, 2000, "xylophone"),
      createNote("F", 5, 800, 2800, "xylophone"), createNote("E", 5, 1200, 3600, "xylophone"),
      createNote("C", 5, 400, 5000, "xylophone"), createNote("C", 5, 400, 5600, "xylophone"),
      createNote("D", 5, 800, 6200, "xylophone"), createNote("C", 5, 800, 7000, "xylophone"),
      createNote("G", 5, 800, 7800, "xylophone"), createNote("F", 5, 1200, 8600, "xylophone")
    ]
  },

  "sapo-nao-lava-xylophone": {
    id: "sapo-nao-lava-xylophone", name: "O Sapo Não Lava o Pé", bpm: 120, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 2,
    notes: [
      // Primeira linha: sol do dó sol la sol mi
      createNote("G", 5, 400, 0, "xylophone"), createNote("C", 8, 400, 400, "xylophone"),
      createNote("C", 8, 400, 800, "xylophone"), createNote("G", 5, 400, 1200, "xylophone"),
      createNote("A", 5, 400, 1600, "xylophone"), createNote("G", 5, 400, 2000, "xylophone"),
      createNote("E", 5, 800, 2400, "xylophone"),
      
      // Segunda linha: sol do dó sol la sol fa
      createNote("G", 5, 400, 3200, "xylophone"), createNote("C", 8, 400, 3600, "xylophone"),
      createNote("C", 8, 400, 4000, "xylophone"), createNote("G", 5, 400, 4400, "xylophone"),
      createNote("A", 5, 400, 4800, "xylophone"), createNote("G", 5, 400, 5200, "xylophone"),
      createNote("F", 5, 800, 5600, "xylophone"),
      
      // Terceira linha: sol si si sol la sol si si sol la sol si sol la si do
      createNote("G", 5, 400, 6400, "xylophone"), createNote("B", 5, 400, 6800, "xylophone"),
      createNote("B", 5, 400, 7200, "xylophone"), createNote("G", 5, 400, 7600, "xylophone"),
      createNote("A", 5, 400, 8000, "xylophone"), createNote("G", 5, 400, 8400, "xylophone"),
      createNote("B", 5, 400, 8800, "xylophone"), createNote("B", 5, 400, 9200, "xylophone"),
      createNote("G", 5, 400, 9600, "xylophone"), createNote("A", 5, 400, 10000, "xylophone"),
      createNote("G", 5, 400, 10400, "xylophone"), createNote("B", 5, 400, 10800, "xylophone"),
      createNote("G", 5, 400, 11200, "xylophone"), createNote("A", 5, 400, 11600, "xylophone"),
      createNote("B", 5, 400, 12000, "xylophone"), createNote("C", 8, 800, 12400, "xylophone")
    ]
  },

  // === TECLADO/KEYBOARD - 6 músicas ===
  "scale-keyboard": {
    id: "scale-keyboard", name: "Escala de Dó Maior", bpm: 80, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("C", 4, 400, 0, "keyboard"), createNote("D", 4, 400, 400, "keyboard"),
      createNote("E", 4, 400, 800, "keyboard"), createNote("F", 4, 400, 1200, "keyboard"),
      createNote("G", 4, 400, 1600, "keyboard"), createNote("A", 4, 400, 2000, "keyboard"),
      createNote("B", 4, 400, 2400, "keyboard"), createNote("C", 5, 400, 2800, "keyboard"),
      createNote("B", 4, 400, 3200, "keyboard"), createNote("A", 4, 400, 3600, "keyboard"),
      createNote("G", 4, 400, 4000, "keyboard"), createNote("F", 4, 400, 4400, "keyboard"),
      createNote("E", 4, 400, 4800, "keyboard"), createNote("D", 4, 400, 5200, "keyboard"),
      createNote("C", 4, 800, 5600, "keyboard")
    ]
  },

  "hot-cross-keyboard": {
    id: "hot-cross-keyboard", name: "Três Notas Mágicas", bpm: 100, timeSignature: "4/4",
    totalDuration: 8000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("E", 4, 600, 0, "keyboard"), createNote("D", 4, 600, 600, "keyboard"),
      createNote("C", 4, 1200, 1200, "keyboard"), createNote("E", 4, 600, 3000, "keyboard"),
      createNote("D", 4, 600, 3600, "keyboard"), createNote("C", 4, 1200, 4200, "keyboard")
    ]
  },

  "ciranda-keyboard": {
    id: "ciranda-keyboard", name: "Ciranda, Cirandinha", bpm: 110, timeSignature: "4/4",
    totalDuration: 14000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("G", 4, 500, 0, "keyboard"), createNote("G", 4, 500, 545, "keyboard"),
      createNote("A", 4, 500, 1090, "keyboard"), createNote("G", 4, 500, 1635, "keyboard"),
      createNote("F", 4, 500, 2180, "keyboard"), createNote("E", 4, 500, 2725, "keyboard"),
      createNote("D", 4, 500, 3270, "keyboard"), createNote("C", 4, 1000, 3815, "keyboard")
    ]
  },

  "boi-da-cara-preta-keyboard": {
    id: "boi-da-cara-preta-keyboard", name: "Boi da Cara Preta", bpm: 100, timeSignature: "4/4",
    totalDuration: 12000, difficulty: "Fácil", loops: 2,
    notes: [
      createNote("E", 4, 500, 0, "keyboard"), createNote("E", 4, 500, 600, "keyboard"),
      createNote("G", 4, 500, 1200, "keyboard"), createNote("G", 4, 500, 1800, "keyboard"),
      createNote("A", 4, 500, 2400, "keyboard"), createNote("G", 4, 500, 3000, "keyboard"),
      createNote("F", 4, 500, 3600, "keyboard"), createNote("E", 4, 1000, 4200, "keyboard")
    ]
  }
};

// Função CORRIGIDA para obter sequência musical por ID
export const getMusicalSequence = (songId: string): MusicalSequence | null => {
  return musicalSequences[songId] || null;
};

// Função SINCRONIZADA para gerar notas do jogo
export const generateGameNotes = (sequence: MusicalSequence, instrumentType: string) => {
  const lanes = 7; // Sempre 7 lanes: C, D, E, F, G, A, B
  const noteToLane: Record<string, number> = {
    C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6
  };

  const gameNotes = [];
  let noteId = 0;

  // Repetir conforme especificado no loops
  for (let loop = 0; loop < sequence.loops; loop++) {
    const loopOffset = loop * (sequence.totalDuration / sequence.loops);
    
    sequence.notes.forEach((note) => {
      const lane = noteToLane[note.note];
      if (lane !== undefined) {
        gameNotes.push({
          id: `note-${noteId++}`,
          lane,
          color: getColorForNote(note.note),
          frequency: note.frequency, // Usar frequência EXATA da sequência
          startTime: note.timing + loopOffset,
          duration: note.duration,
          y: -100
        });
      }
    });
  }

  return gameNotes;
};

// Cores SINCRONIZADAS por nota
const getColorForNote = (note: string): string => {
  const colors: Record<string, string> = {
    C: "#FF0000", // Vermelho
    D: "#FF9933", // Laranja  
    E: "#FFFF00", // Amarelo
    F: "#33CC33", // Verde
    G: "#33CCFF", // Azul claro
    A: "#000080", // Azul escuro
    B: "#800080"  // Roxo
  };
  return colors[note] || "#000000";
};
