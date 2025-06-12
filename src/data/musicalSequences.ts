
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

// Sequências musicais autênticas para músicas infantis - VERSÕES COMPLETAS
export const musicalSequences: Record<string, MusicalSequence> = {
  // SINO - FÁCIL (Melodias completas com 2 repetições)
  "twinkle-bell": {
    id: "twinkle-bell",
    name: "Brilha, Brilha Estrelinha",
    bpm: 120,
    timeSignature: "4/4",
    totalDuration: 32000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira parte completa: C-C-G-G-A-A-G
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
      createNote("C", 4, 1000, 7000, "bell"),
      // Terceira parte: G-G-F-F-E-E-D
      createNote("G", 4, 500, 8000, "bell"),
      createNote("G", 4, 500, 8500, "bell"),
      createNote("F", 4, 500, 9000, "bell"),
      createNote("F", 4, 500, 9500, "bell"),
      createNote("E", 4, 500, 10000, "bell"),
      createNote("E", 4, 500, 10500, "bell"),
      createNote("D", 4, 1000, 11000, "bell"),
      // Quarta parte: G-G-F-F-E-E-D
      createNote("G", 4, 500, 12000, "bell"),
      createNote("G", 4, 500, 12500, "bell"),
      createNote("F", 4, 500, 13000, "bell"),
      createNote("F", 4, 500, 13500, "bell"),
      createNote("E", 4, 500, 14000, "bell"),
      createNote("E", 4, 500, 14500, "bell"),
      createNote("D", 4, 1000, 15000, "bell")
    ]
  },

  "mary-lamb-bell": {
    id: "mary-lamb-bell",
    name: "Maria, Maria",
    bpm: 100,
    timeSignature: "4/4",
    totalDuration: 24000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira estrofe: E-D-C-D-E-E-E
      createNote("E", 4, 500, 0, "bell"),
      createNote("D", 4, 500, 600, "bell"),
      createNote("C", 4, 500, 1200, "bell"),
      createNote("D", 4, 500, 1800, "bell"),
      createNote("E", 4, 500, 2400, "bell"),
      createNote("E", 4, 500, 3000, "bell"),
      createNote("E", 4, 1000, 3600, "bell"),
      // Segunda estrofe: D-D-D-E-G-G
      createNote("D", 4, 500, 4800, "bell"),
      createNote("D", 4, 500, 5400, "bell"),
      createNote("D", 4, 1000, 6000, "bell"),
      createNote("E", 4, 500, 7200, "bell"),
      createNote("G", 4, 500, 7800, "bell"),
      createNote("G", 4, 1000, 8400, "bell"),
      // Terceira estrofe: E-D-C-D-E-E-E
      createNote("E", 4, 500, 9600, "bell"),
      createNote("D", 4, 500, 10200, "bell"),
      createNote("C", 4, 500, 10800, "bell"),
      createNote("D", 4, 500, 11400, "bell"),
      createNote("E", 4, 500, 12000, "bell"),
      createNote("E", 4, 500, 12600, "bell"),
      createNote("E", 4, 1000, 13200, "bell")
    ]
  },

  "ciranda-bell": {
    id: "ciranda-bell",
    name: "Ciranda, Cirandinha",
    bpm: 110,
    timeSignature: "4/4",
    totalDuration: 28000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Verso completo: G-G-A-G-F-E-D-C
      createNote("G", 4, 500, 0, "bell"),
      createNote("G", 4, 500, 545, "bell"),
      createNote("A", 4, 500, 1090, "bell"),
      createNote("G", 4, 500, 1635, "bell"),
      createNote("F", 4, 500, 2180, "bell"),
      createNote("E", 4, 500, 2725, "bell"),
      createNote("D", 4, 500, 3270, "bell"),
      createNote("C", 4, 1000, 3815, "bell"),
      // Refrão: C-D-E-F-G-A-G
      createNote("C", 4, 500, 5360, "bell"),
      createNote("D", 4, 500, 5905, "bell"),
      createNote("E", 4, 500, 6450, "bell"),
      createNote("F", 4, 500, 6995, "bell"),
      createNote("G", 4, 500, 7540, "bell"),
      createNote("A", 4, 500, 8085, "bell"),
      createNote("G", 4, 1000, 8630, "bell"),
      // Finalização: F-E-D-C
      createNote("F", 4, 500, 10175, "bell"),
      createNote("E", 4, 500, 10720, "bell"),
      createNote("D", 4, 500, 11265, "bell"),
      createNote("C", 4, 1500, 11810, "bell")
    ]
  },

  "galinha-pintadinha-bell": {
    id: "galinha-pintadinha-bell",
    name: "Galinha Pintadinha",
    bpm: 130,
    timeSignature: "4/4",
    totalDuration: 20000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira parte: E-E-E-E-G-G-G-G-E
      createNote("E", 4, 300, 0, "bell"),
      createNote("E", 4, 300, 460, "bell"),
      createNote("E", 4, 300, 920, "bell"),
      createNote("E", 4, 300, 1380, "bell"),
      createNote("G", 4, 300, 1840, "bell"),
      createNote("G", 4, 300, 2300, "bell"),
      createNote("G", 4, 300, 2760, "bell"),
      createNote("G", 4, 300, 3220, "bell"),
      createNote("E", 4, 600, 3680, "bell"),
      // Segunda parte: D-D-F-F-E-E-C
      createNote("D", 4, 300, 4740, "bell"),
      createNote("D", 4, 300, 5200, "bell"),
      createNote("F", 4, 300, 5660, "bell"),
      createNote("F", 4, 300, 6120, "bell"),
      createNote("E", 4, 300, 6580, "bell"),
      createNote("E", 4, 300, 7040, "bell"),
      createNote("C", 4, 600, 7500, "bell"),
      // Repetição do refrão
      createNote("E", 4, 300, 8560, "bell"),
      createNote("E", 4, 300, 9020, "bell"),
      createNote("G", 4, 300, 9480, "bell"),
      createNote("G", 4, 300, 9940, "bell"),
      createNote("E", 4, 800, 10400, "bell")
    ]
  },

  "borboletinha-bell": {
    id: "borboletinha-bell",
    name: "Borboletinha",
    bpm: 90,
    timeSignature: "4/4",
    totalDuration: 36000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira estrofe completa: C-D-E-F-G-A-G-F-E
      createNote("C", 4, 600, 0, "bell"),
      createNote("D", 4, 600, 666, "bell"),
      createNote("E", 4, 600, 1332, "bell"),
      createNote("F", 4, 600, 1998, "bell"),
      createNote("G", 4, 600, 2664, "bell"),
      createNote("A", 4, 600, 3330, "bell"),
      createNote("G", 4, 600, 3996, "bell"),
      createNote("F", 4, 600, 4662, "bell"),
      createNote("E", 4, 1200, 5328, "bell"),
      // Segunda estrofe: G-A-G-F-E-D-C
      createNote("G", 4, 600, 6996, "bell"),
      createNote("A", 4, 600, 7662, "bell"),
      createNote("G", 4, 600, 8328, "bell"),
      createNote("F", 4, 600, 8994, "bell"),
      createNote("E", 4, 600, 9660, "bell"),
      createNote("D", 4, 600, 10326, "bell"),
      createNote("C", 4, 1200, 10992, "bell"),
      // Refrão: E-F-G-F-E-D-C
      createNote("E", 4, 600, 12660, "bell"),
      createNote("F", 4, 600, 13326, "bell"),
      createNote("G", 4, 600, 13992, "bell"),
      createNote("F", 4, 600, 14658, "bell"),
      createNote("E", 4, 600, 15324, "bell"),
      createNote("D", 4, 600, 15990, "bell"),
      createNote("C", 4, 1200, 16656, "bell")
    ]
  },

  "atirei-pau-bell": {
    id: "atirei-pau-bell",
    name: "Atirei o Pau no Gato",
    bpm: 100,
    timeSignature: "4/4",
    totalDuration: 32000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira parte: G-E-E-F-D-D-C
      createNote("G", 4, 500, 0, "bell"),
      createNote("E", 4, 500, 600, "bell"),
      createNote("E", 4, 500, 1200, "bell"),
      createNote("F", 4, 500, 1800, "bell"),
      createNote("D", 4, 500, 2400, "bell"),
      createNote("D", 4, 500, 3000, "bell"),
      createNote("C", 4, 1000, 3600, "bell"),
      // Segunda parte: E-F-G-G-A-G-F-E
      createNote("E", 4, 500, 5200, "bell"),
      createNote("F", 4, 500, 5800, "bell"),
      createNote("G", 4, 500, 6400, "bell"),
      createNote("G", 4, 500, 7000, "bell"),
      createNote("A", 4, 500, 7600, "bell"),
      createNote("G", 4, 500, 8200, "bell"),
      createNote("F", 4, 500, 8800, "bell"),
      createNote("E", 4, 1000, 9400, "bell"),
      // Terceira parte (repetição): G-E-E-F-D-D-C
      createNote("G", 4, 500, 11000, "bell"),
      createNote("E", 4, 500, 11600, "bell"),
      createNote("E", 4, 500, 12200, "bell"),
      createNote("F", 4, 500, 12800, "bell"),
      createNote("D", 4, 500, 13400, "bell"),
      createNote("D", 4, 500, 14000, "bell"),
      createNote("C", 4, 1000, 14600, "bell")
    ]
  },

  // XILOFONE - FÁCIL (Melodias completas com 2 repetições)
  "happy-birthday-xylophone": {
    id: "happy-birthday-xylophone",
    name: "Parabéns para Você",
    bpm: 100,
    timeSignature: "3/4",
    totalDuration: 40000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira estrofe: C-C-D-C-F-E
      createNote("C", 5, 400, 0, "xylophone"),
      createNote("C", 5, 400, 600, "xylophone"),
      createNote("D", 5, 800, 1200, "xylophone"),
      createNote("C", 5, 800, 2000, "xylophone"),
      createNote("F", 5, 800, 2800, "xylophone"),
      createNote("E", 5, 1200, 3600, "xylophone"),
      // Segunda estrofe: C-C-D-C-G-F
      createNote("C", 5, 400, 5000, "xylophone"),
      createNote("C", 5, 400, 5600, "xylophone"),
      createNote("D", 5, 800, 6200, "xylophone"),
      createNote("C", 5, 800, 7000, "xylophone"),
      createNote("G", 5, 800, 7800, "xylophone"),
      createNote("F", 5, 1200, 8600, "xylophone"),
      // Terceira estrofe: C-C-C-A-F-E-D
      createNote("C", 5, 400, 10000, "xylophone"),
      createNote("C", 5, 400, 10600, "xylophone"),
      createNote("C", 6, 800, 11200, "xylophone"),
      createNote("A", 5, 800, 12000, "xylophone"),
      createNote("F", 5, 800, 12800, "xylophone"),
      createNote("E", 5, 800, 13600, "xylophone"),
      createNote("D", 5, 1200, 14400, "xylophone"),
      // Quarta estrofe: Bb-Bb-A-F-G-F
      createNote("A", 5, 400, 16000, "xylophone"), // Substituting Bb with A
      createNote("A", 5, 400, 16600, "xylophone"),
      createNote("A", 5, 800, 17200, "xylophone"),
      createNote("F", 5, 800, 18000, "xylophone"),
      createNote("G", 5, 800, 18800, "xylophone"),
      createNote("F", 5, 1200, 19600, "xylophone")
    ]
  },

  "xuxa-xylophone": {
    id: "xuxa-xylophone",
    name: "Ilariê (Xuxa)",
    bpm: 140,
    timeSignature: "4/4",
    totalDuration: 24000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Refrão principal: C-D-E-G-A-G-E-C
      createNote("C", 5, 300, 0, "xylophone"),
      createNote("D", 5, 300, 428, "xylophone"),
      createNote("E", 5, 300, 856, "xylophone"),
      createNote("G", 5, 300, 1284, "xylophone"),
      createNote("A", 5, 300, 1712, "xylophone"),
      createNote("G", 5, 300, 2140, "xylophone"),
      createNote("E", 5, 300, 2568, "xylophone"),
      createNote("C", 5, 600, 2996, "xylophone"),
      // Segunda parte: E-G-A-A-G-F-E
      createNote("E", 5, 300, 4280, "xylophone"),
      createNote("G", 5, 300, 4708, "xylophone"),
      createNote("A", 5, 300, 5136, "xylophone"),
      createNote("A", 5, 300, 5564, "xylophone"),
      createNote("G", 5, 300, 5992, "xylophone"),
      createNote("F", 5, 300, 6420, "xylophone"),
      createNote("E", 5, 600, 6848, "xylophone"),
      // Ponte: G-G-A-G-F-E-D-C
      createNote("G", 5, 300, 8132, "xylophone"),
      createNote("G", 5, 300, 8560, "xylophone"),
      createNote("A", 5, 300, 8988, "xylophone"),
      createNote("G", 5, 300, 9416, "xylophone"),
      createNote("F", 5, 300, 9844, "xylophone"),
      createNote("E", 5, 300, 10272, "xylophone"),
      createNote("D", 5, 300, 10700, "xylophone"),
      createNote("C", 5, 600, 11128, "xylophone")
    ]
  },

  "sapo-nao-lava-xylophone": {
    id: "sapo-nao-lava-xylophone",
    name: "O Sapo Não Lava o Pé",
    bpm: 120,
    timeSignature: "4/4",
    totalDuration: 28000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira estrofe: D-D-G-G-A-A-G-F-E-D
      createNote("D", 5, 400, 0, "xylophone"),
      createNote("D", 5, 400, 500, "xylophone"),
      createNote("G", 5, 400, 1000, "xylophone"),
      createNote("G", 5, 400, 1500, "xylophone"),
      createNote("A", 5, 400, 2000, "xylophone"),
      createNote("A", 5, 400, 2500, "xylophone"),
      createNote("G", 5, 400, 3000, "xylophone"),
      createNote("F", 5, 400, 3500, "xylophone"),
      createNote("E", 5, 400, 4000, "xylophone"),
      createNote("D", 5, 800, 4500, "xylophone"),
      // Segunda estrofe: E-E-A-A-B-B-A-G-F-E
      createNote("E", 5, 400, 5800, "xylophone"),
      createNote("E", 5, 400, 6300, "xylophone"),
      createNote("A", 5, 400, 6800, "xylophone"),
      createNote("A", 5, 400, 7300, "xylophone"),
      createNote("B", 5, 400, 7800, "xylophone"),
      createNote("B", 5, 400, 8300, "xylophone"),
      createNote("A", 5, 400, 8800, "xylophone"),
      createNote("G", 5, 400, 9300, "xylophone"),
      createNote("F", 5, 400, 9800, "xylophone"),
      createNote("E", 5, 800, 10300, "xylophone"),
      // Refrão: G-A-G-F-E-F-G-A-G
      createNote("G", 5, 400, 11600, "xylophone"),
      createNote("A", 5, 400, 12100, "xylophone"),
      createNote("G", 5, 400, 12600, "xylophone"),
      createNote("F", 5, 400, 13100, "xylophone"),
      createNote("E", 5, 400, 13600, "xylophone"),
      createNote("F", 5, 400, 14100, "xylophone"),
      createNote("G", 5, 400, 14600, "xylophone"),
      createNote("A", 5, 400, 15100, "xylophone"),
      createNote("G", 5, 800, 15600, "xylophone")
    ]
  },

  // TECLADO - FÁCIL (Melodias completas com 2 repetições)
  "scale-keyboard": {
    id: "scale-keyboard",
    name: "Escala de Dó Maior",
    bpm: 80,
    timeSignature: "4/4",
    totalDuration: 32000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Subida: C-D-E-F-G-A-B-C
      createNote("C", 4, 750, 0, "keyboard"),
      createNote("D", 4, 750, 750, "keyboard"),
      createNote("E", 4, 750, 1500, "keyboard"),
      createNote("F", 4, 750, 2250, "keyboard"),
      createNote("G", 4, 750, 3000, "keyboard"),
      createNote("A", 4, 750, 3750, "keyboard"),
      createNote("B", 4, 750, 4500, "keyboard"),
      createNote("C", 5, 1500, 5250, "keyboard"),
      // Descida: C-B-A-G-F-E-D-C
      createNote("C", 5, 750, 7500, "keyboard"),
      createNote("B", 4, 750, 8250, "keyboard"),
      createNote("A", 4, 750, 9000, "keyboard"),
      createNote("G", 4, 750, 9750, "keyboard"),
      createNote("F", 4, 750, 10500, "keyboard"),
      createNote("E", 4, 750, 11250, "keyboard"),
      createNote("D", 4, 750, 12000, "keyboard"),
      createNote("C", 4, 1500, 12750, "keyboard"),
      // Arpejo: C-E-G-C-G-E-C
      createNote("C", 4, 500, 15000, "keyboard"),
      createNote("E", 4, 500, 15500, "keyboard"),
      createNote("G", 4, 500, 16000, "keyboard"),
      createNote("C", 5, 500, 16500, "keyboard"),
      createNote("G", 4, 500, 17000, "keyboard"),
      createNote("E", 4, 500, 17500, "keyboard"),
      createNote("C", 4, 1000, 18000, "keyboard")
    ]
  },

  "hot-cross-keyboard": {
    id: "hot-cross-keyboard",
    name: "Três Notas Mágicas",
    bpm: 100,
    timeSignature: "4/4",
    totalDuration: 16000, // Dobrado para 2 repetições
    difficulty: "Fácil",
    loops: 2,
    notes: [
      // Primeira sequência: E-D-C (pausa) E-D-C
      createNote("E", 4, 600, 0, "keyboard"),
      createNote("D", 4, 600, 600, "keyboard"),
      createNote("C", 4, 1200, 1200, "keyboard"),
      createNote("E", 4, 600, 3000, "keyboard"),
      createNote("D", 4, 600, 3600, "keyboard"),
      createNote("C", 4, 1200, 4200, "keyboard"),
      // Segunda sequência: C-D-E-E-E
      createNote("C", 4, 400, 6000, "keyboard"),
      createNote("D", 4, 400, 6400, "keyboard"),
      createNote("E", 4, 400, 6800, "keyboard"),
      createNote("E", 4, 400, 7200, "keyboard"),
      createNote("E", 4, 800, 7600, "keyboard")
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

  // Repetir a sequência conforme especificado (sempre 2 vezes agora)
  for (let loop = 0; loop < sequence.loops; loop++) {
    const loopOffset = loop * (sequence.totalDuration / 2); // Divide por 2 porque são 2 loops
    
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
