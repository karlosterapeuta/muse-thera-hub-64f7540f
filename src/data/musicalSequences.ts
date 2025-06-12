
import { MusicalSequence, MusicalNote, InstrumentConfig } from "@/types/musicTypes";

// Configurações base de frequências para cada instrumento
export const instrumentConfigs: Record<string, InstrumentConfig> = {
  bell: {
    baseFrequencies: {
      C: 261.63,
      D: 293.66,
      E: 329.63,
      F: 349.23,
      G: 392.00,
      A: 440.00,
      B: 493.88
    },
    octaveMultiplier: 1
  },
  xylophone: {
    baseFrequencies: {
      C: 523.25,
      D: 587.33,
      E: 659.25,
      F: 698.46,
      G: 783.99,
      A: 880.00,
      B: 987.77
    },
    octaveMultiplier: 2
  },
  keyboard: {
    baseFrequencies: {
      C: 261.63,
      D: 293.66,
      E: 329.63,
      F: 349.23,
      G: 392.00,
      A: 440.00,
      B: 493.88
    },
    octaveMultiplier: 1
  }
};

// Função para criar nota com frequência correta
const createNote = (note: string, octave: number, duration: number, timing: number, instrument: string): MusicalNote => {
  const config = instrumentConfigs[instrument];
  const baseFreq = config.baseFrequencies[note];
  const frequency = baseFreq * Math.pow(2, octave - 4); // A4 = 440Hz como referência
  
  return {
    note,
    octave,
    frequency,
    duration,
    timing
  };
};

// Sequências musicais autênticas para músicas infantis
export const musicalSequences: Record<string, MusicalSequence> = {
  // SINO - FÁCIL
  "twinkle-bell": {
    id: "twinkle-bell",
    name: "Brilha, Brilha Estrelinha",
    bpm: 120,
    timeSignature: "4/4",
    totalDuration: 16000,
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira parte: C-C-G-G-A-A-G
      createNote("C", 4, 500, 0, "bell"),
      createNote("C", 4, 500, 500, "bell"),
      createNote("G", 4, 500, 1000, "bell"),
      createNote("G", 4, 500, 1500, "bell"),
      createNote("A", 4, 500, 2000, "bell"),
      createNote("A", 4, 500, 2500, "bell"),
      createNote("G", 4, 1000, 3000, "bell"),
      // Segunda parte: F-F-E-E-D-D-C
      createNote("F", 4, 500, 4000, "bell"),
      createNote("F", 4, 500, 4500, "bell"),
      createNote("E", 4, 500, 5000, "bell"),
      createNote("E", 4, 500, 5500, "bell"),
      createNote("D", 4, 500, 6000, "bell"),
      createNote("D", 4, 500, 6500, "bell"),
      createNote("C", 4, 1000, 7000, "bell")
    ]
  },

  "mary-lamb-bell": {
    id: "mary-lamb-bell",
    name: "Maria, Maria",
    bpm: 100,
    timeSignature: "4/4",
    totalDuration: 12000,
    difficulty: "Fácil",
    loops: 3,
    notes: [
      // E-D-C-D-E-E-E
      createNote("E", 4, 500, 0, "bell"),
      createNote("D", 4, 500, 600, "bell"),
      createNote("C", 4, 500, 1200, "bell"),
      createNote("D", 4, 500, 1800, "bell"),
      createNote("E", 4, 500, 2400, "bell"),
      createNote("E", 4, 500, 3000, "bell"),
      createNote("E", 4, 1000, 3600, "bell")
    ]
  },

  "ciranda-bell": {
    id: "ciranda-bell",
    name: "Ciranda, Cirandinha",
    bpm: 110,
    timeSignature: "4/4",
    totalDuration: 14000,
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // G-G-A-G-F-E-D-C
      createNote("G", 4, 500, 0, "bell"),
      createNote("G", 4, 500, 545, "bell"),
      createNote("A", 4, 500, 1090, "bell"),
      createNote("G", 4, 500, 1635, "bell"),
      createNote("F", 4, 500, 2180, "bell"),
      createNote("E", 4, 500, 2725, "bell"),
      createNote("D", 4, 500, 3270, "bell"),
      createNote("C", 4, 1000, 3815, "bell")
    ]
  },

  "galinha-pintadinha-bell": {
    id: "galinha-pintadinha-bell",
    name: "Galinha Pintadinha",
    bpm: 130,
    timeSignature: "4/4",
    totalDuration: 10000,
    difficulty: "Fácil",
    loops: 4,
    notes: [
      // E-E-E-E-G-G-G-G-E
      createNote("E", 4, 300, 0, "bell"),
      createNote("E", 4, 300, 460, "bell"),
      createNote("E", 4, 300, 920, "bell"),
      createNote("E", 4, 300, 1380, "bell"),
      createNote("G", 4, 300, 1840, "bell"),
      createNote("G", 4, 300, 2300, "bell"),
      createNote("G", 4, 300, 2760, "bell"),
      createNote("G", 4, 300, 3220, "bell"),
      createNote("E", 4, 600, 3680, "bell")
    ]
  },

  "borboletinha-bell": {
    id: "borboletinha-bell",
    name: "Borboletinha",
    bpm: 90,
    timeSignature: "4/4",
    totalDuration: 18000,
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // C-D-E-F-G-A-G-F-E
      createNote("C", 4, 600, 0, "bell"),
      createNote("D", 4, 600, 666, "bell"),
      createNote("E", 4, 600, 1332, "bell"),
      createNote("F", 4, 600, 1998, "bell"),
      createNote("G", 4, 600, 2664, "bell"),
      createNote("A", 4, 600, 3330, "bell"),
      createNote("G", 4, 600, 3996, "bell"),
      createNote("F", 4, 600, 4662, "bell"),
      createNote("E", 4, 1200, 5328, "bell")
    ]
  },

  "atirei-pau-bell": {
    id: "atirei-pau-bell",
    name: "Atirei o Pau no Gato",
    bpm: 100,
    timeSignature: "4/4",
    totalDuration: 16000,
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // G-E-E-F-D-D-C
      createNote("G", 4, 500, 0, "bell"),
      createNote("E", 4, 500, 600, "bell"),
      createNote("E", 4, 500, 1200, "bell"),
      createNote("F", 4, 500, 1800, "bell"),
      createNote("D", 4, 500, 2400, "bell"),
      createNote("D", 4, 500, 3000, "bell"),
      createNote("C", 4, 1000, 3600, "bell")
    ]
  },

  // XILOFONE - FÁCIL
  "happy-birthday-xylophone": {
    id: "happy-birthday-xylophone",
    name: "Parabéns para Você",
    bpm: 100,
    timeSignature: "3/4",
    totalDuration: 20000,
    difficulty: "Fácil",
    loops: 1,
    notes: [
      // C-C-D-C-F-E
      createNote("C", 5, 400, 0, "xylophone"),
      createNote("C", 5, 400, 600, "xylophone"),
      createNote("D", 5, 800, 1200, "xylophone"),
      createNote("C", 5, 800, 2000, "xylophone"),
      createNote("F", 5, 800, 2800, "xylophone"),
      createNote("E", 5, 1200, 3600, "xylophone"),
      // C-C-D-C-G-F
      createNote("C", 5, 400, 5000, "xylophone"),
      createNote("C", 5, 400, 5600, "xylophone"),
      createNote("D", 5, 800, 6200, "xylophone"),
      createNote("C", 5, 800, 7000, "xylophone"),
      createNote("G", 5, 800, 7800, "xylophone"),
      createNote("F", 5, 1200, 8600, "xylophone")
    ]
  },

  "xuxa-xylophone": {
    id: "xuxa-xylophone",
    name: "Ilariê (Xuxa)",
    bpm: 140,
    timeSignature: "4/4",
    totalDuration: 12000,
    difficulty: "Fácil",
    loops: 3,
    notes: [
      // C-D-E-G-A-G-E-C
      createNote("C", 5, 300, 0, "xylophone"),
      createNote("D", 5, 300, 428, "xylophone"),
      createNote("E", 5, 300, 856, "xylophone"),
      createNote("G", 5, 300, 1284, "xylophone"),
      createNote("A", 5, 300, 1712, "xylophone"),
      createNote("G", 5, 300, 2140, "xylophone"),
      createNote("E", 5, 300, 2568, "xylophone"),
      createNote("C", 5, 600, 2996, "xylophone")
    ]
  },

  "sapo-nao-lava-xylophone": {
    id: "sapo-nao-lava-xylophone",
    name: "O Sapo Não Lava o Pé",
    bpm: 120,
    timeSignature: "4/4",
    totalDuration: 14000,
    difficulty: "Fácil",
    loops: 3,
    notes: [
      // D-D-G-G-A-A-G-F-E-D
      createNote("D", 5, 400, 0, "xylophone"),
      createNote("D", 5, 400, 500, "xylophone"),
      createNote("G", 5, 400, 1000, "xylophone"),
      createNote("G", 5, 400, 1500, "xylophone"),
      createNote("A", 5, 400, 2000, "xylophone"),
      createNote("A", 5, 400, 2500, "xylophone"),
      createNote("G", 5, 400, 3000, "xylophone"),
      createNote("F", 5, 400, 3500, "xylophone"),
      createNote("E", 5, 400, 4000, "xylophone"),
      createNote("D", 5, 800, 4500, "xylophone")
    ]
  },

  // TECLADO - FÁCIL  
  "scale-keyboard": {
    id: "scale-keyboard",
    name: "Escala de Dó Maior",
    bpm: 80,
    timeSignature: "4/4",
    totalDuration: 16000,
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // C-D-E-F-G-A-B-C
      createNote("C", 4, 750, 0, "keyboard"),
      createNote("D", 4, 750, 750, "keyboard"),
      createNote("E", 4, 750, 1500, "keyboard"),
      createNote("F", 4, 750, 2250, "keyboard"),
      createNote("G", 4, 750, 3000, "keyboard"),
      createNote("A", 4, 750, 3750, "keyboard"),
      createNote("B", 4, 750, 4500, "keyboard"),
      createNote("C", 5, 1500, 5250, "keyboard")
    ]
  },

  "hot-cross-keyboard": {
    id: "hot-cross-keyboard",
    name: "Três Notas Mágicas",
    bpm: 100,
    timeSignature: "4/4",
    totalDuration: 8000,
    difficulty: "Fácil",
    loops: 4,
    notes: [
      // E-D-C (pausa) E-D-C
      createNote("E", 4, 600, 0, "keyboard"),
      createNote("D", 4, 600, 600, "keyboard"),
      createNote("C", 4, 1200, 1200, "keyboard")
    ]
  }
};

// Função para obter sequência musical por ID
export const getMusicalSequence = (songId: string): MusicalSequence | null => {
  return musicalSequences[songId] || null;
};

// Função para gerar notas para o jogo baseadas na sequência musical
export const generateGameNotes = (sequence: MusicalSequence, instrumentType: string) => {
  const lanes = instrumentType === "bell" ? 7 : instrumentType === "xylophone" ? 7 : 7;
  const noteToLane: Record<string, number> = {
    C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6
  };

  const gameNotes = [];
  let noteId = 0;

  // Repetir a sequência conforme especificado
  for (let loop = 0; loop < sequence.loops; loop++) {
    const loopOffset = loop * sequence.totalDuration;
    
    sequence.notes.forEach((note) => {
      const lane = noteToLane[note.note];
      if (lane !== undefined) {
        gameNotes.push({
          id: `note-${noteId++}`,
          lane,
          color: getColorForNote(note.note),
          frequency: note.frequency,
          startTime: note.timing + loopOffset,
          duration: note.duration,
          y: -100 // Começar acima da tela
        });
      }
    });
  }

  return gameNotes;
};

// Função para obter cor baseada na nota
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
