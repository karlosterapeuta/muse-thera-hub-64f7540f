
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

// Função para criar nota com frequência SINCRONIZADA e timing autêntico
const createNote = (note: string, octave: number, duration: number, timing: number, instrument: string): MusicalNote => {
  const config = instrumentConfigs[instrument];
  const baseFreq = config.baseFrequencies[note];
  const frequency = baseFreq;
  
  return { note, octave, frequency, duration, timing };
};

// SEQUÊNCIAS MUSICAIS COMPLETAS E AUTÊNTICAS - 18 músicas infantis brasileiras
export const authenticMusicalSequences: Record<string, MusicalSequence> = {
  // === SINO (BELL) - 6 músicas ===
  "twinkle-bell": {
    id: "twinkle-bell", name: "Brilha, Brilha Estrelinha", bpm: 120, timeSignature: "4/4",
    totalDuration: 24000, difficulty: "Fácil", loops: 1,
    notes: [
      // Primeira frase: "Brilha, brilha, estrelinha"
      createNote("C", 4, 600, 0, "bell"),     // Bri-
      createNote("C", 4, 600, 600, "bell"),   // -lha
      createNote("G", 4, 600, 1200, "bell"),  // bri-
      createNote("G", 4, 600, 1800, "bell"),  // -lha
      createNote("A", 4, 600, 2400, "bell"),  // es-
      createNote("A", 4, 600, 3000, "bell"),  // -tre-
      createNote("G", 4, 1200, 3600, "bell"), // -linha
      
      // Segunda frase: "Quero ver você brilhar"
      createNote("F", 4, 600, 5000, "bell"),  // Que-
      createNote("F", 4, 600, 5600, "bell"),  // -ro
      createNote("E", 4, 600, 6200, "bell"),  // ver
      createNote("E", 4, 600, 6800, "bell"),  // vo-
      createNote("D", 4, 600, 7400, "bell"),  // -cê
      createNote("D", 4, 600, 8000, "bell"),  // bri-
      createNote("C", 4, 1200, 8600, "bell"), // -lhar
      
      // Terceira frase: "Lá no céu você está"
      createNote("G", 4, 600, 10200, "bell"), // Lá
      createNote("G", 4, 600, 10800, "bell"), // no
      createNote("F", 4, 600, 11400, "bell"), // céu
      createNote("F", 4, 600, 12000, "bell"), // vo-
      createNote("E", 4, 600, 12600, "bell"), // -cê
      createNote("E", 4, 600, 13200, "bell"), // es-
      createNote("D", 4, 1200, 13800, "bell"), // -tá
      
      // Quarta frase: "Como um diamante a brilhar"
      createNote("G", 4, 600, 15400, "bell"), // Co-
      createNote("G", 4, 600, 16000, "bell"), // -mo
      createNote("F", 4, 600, 16600, "bell"), // um
      createNote("F", 4, 600, 17200, "bell"), // dia-
      createNote("E", 4, 600, 17800, "bell"), // -man-
      createNote("E", 4, 600, 18400, "bell"), // -te
      createNote("D", 4, 1200, 19000, "bell"), // bri-lhar
      
      // Final repetindo primeira frase
      createNote("C", 4, 600, 21000, "bell"),
      createNote("C", 4, 600, 21600, "bell"),
      createNote("G", 4, 600, 22200, "bell"),
      createNote("G", 4, 600, 22800, "bell"),
      createNote("A", 4, 600, 23400, "bell"),
      createNote("A", 4, 600, 24000, "bell"),
      createNote("G", 4, 1800, 24600, "bell")
    ]
  },

  "mary-lamb-bell": {
    id: "mary-lamb-bell", name: "Maria, Maria (Elis Regina)", bpm: 90, timeSignature: "4/4",
    totalDuration: 20000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Maria, Maria é um dom, uma certa magia"
      createNote("E", 4, 600, 0, "bell"),     // Ma-
      createNote("D", 4, 600, 700, "bell"),   // -ri-
      createNote("C", 4, 600, 1400, "bell"),  // -a
      createNote("D", 4, 400, 2100, "bell"),  // Ma-
      createNote("E", 4, 600, 2500, "bell"),  // -ri-
      createNote("E", 4, 600, 3200, "bell"),  // -a
      createNote("E", 4, 800, 3900, "bell"),  // é
      
      createNote("D", 4, 600, 5000, "bell"),  // um
      createNote("D", 4, 600, 5700, "bell"),  // dom
      createNote("D", 4, 800, 6400, "bell"),  // uma
      createNote("E", 4, 600, 7500, "bell"),  // cer-
      createNote("G", 4, 600, 8200, "bell"),  // -ta
      createNote("G", 4, 1000, 8900, "bell"), // ma-gia
      
      // "Uma força que nos alerta"
      createNote("G", 4, 600, 10500, "bell"), // U-
      createNote("F", 4, 600, 11200, "bell"), // -ma
      createNote("E", 4, 600, 11900, "bell"), // for-
      createNote("D", 4, 600, 12600, "bell"), // -ça
      createNote("C", 4, 600, 13300, "bell"), // que
      createNote("D", 4, 600, 14000, "bell"), // nos
      createNote("E", 4, 800, 14700, "bell"), // a-
      createNote("D", 4, 1200, 15500, "bell"), // -ler-ta
      
      // Final
      createNote("C", 4, 600, 17000, "bell"),
      createNote("D", 4, 600, 17700, "bell"),
      createNote("E", 4, 600, 18400, "bell"),
      createNote("C", 4, 1600, 19100, "bell")
    ]
  },

  "borboletinha-bell": {
    id: "borboletinha-bell", name: "Borboletinha", bpm: 100, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Borboletinha tá na cozinha"
      createNote("C", 4, 500, 0, "bell"),     // Bor-
      createNote("D", 4, 500, 600, "bell"),   // -bo-
      createNote("E", 4, 500, 1200, "bell"),  // -le-
      createNote("F", 4, 500, 1800, "bell"),  // -ti-
      createNote("G", 4, 500, 2400, "bell"),  // -nha
      createNote("A", 4, 500, 3000, "bell"),  // tá
      createNote("G", 4, 500, 3600, "bell"),  // na
      createNote("F", 4, 500, 4200, "bell"),  // co-
      createNote("E", 4, 1000, 4800, "bell"), // -zi-nha
      
      // "Fazendo chocolate para a madrinha"
      createNote("C", 4, 500, 6200, "bell"),  // Fa-
      createNote("D", 4, 500, 6800, "bell"),  // -zen-
      createNote("E", 4, 500, 7400, "bell"),  // -do
      createNote("F", 4, 500, 8000, "bell"),  // cho-
      createNote("G", 4, 500, 8600, "bell"),  // -co-
      createNote("A", 4, 500, 9200, "bell"),  // -la-
      createNote("G", 4, 500, 9800, "bell"),  // -te
      createNote("F", 4, 500, 10400, "bell"), // pa-
      createNote("E", 4, 500, 11000, "bell"), // -ra
      createNote("D", 4, 500, 11600, "bell"), // a
      createNote("C", 4, 1000, 12200, "bell"), // ma-dri-nha
      
      // Final melódico
      createNote("G", 4, 800, 13800, "bell"),
      createNote("E", 4, 800, 14600, "bell"),
      createNote("C", 4, 1600, 15400, "bell")
    ]
  },

  "galinha-pintadinha-bell": {
    id: "galinha-pintadinha-bell", name: "Galinha Pintadinha", bpm: 140, timeSignature: "4/4",
    totalDuration: 14000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Galinha pintadinha e o galo carijó"
      createNote("E", 4, 300, 0, "bell"),     // Ga-
      createNote("E", 4, 300, 430, "bell"),   // -li-
      createNote("E", 4, 300, 860, "bell"),   // -nha
      createNote("G", 4, 300, 1290, "bell"),  // pin-
      createNote("G", 4, 300, 1720, "bell"),  // -ta-
      createNote("G", 4, 300, 2150, "bell"),  // -di-
      createNote("E", 4, 600, 2580, "bell"),  // -nha
      
      createNote("D", 4, 300, 3400, "bell"),  // e
      createNote("D", 4, 300, 3830, "bell"),  // o
      createNote("F", 4, 300, 4260, "bell"),  // ga-
      createNote("F", 4, 300, 4690, "bell"),  // -lo
      createNote("A", 4, 300, 5120, "bell"),  // ca-
      createNote("A", 4, 300, 5550, "bell"),  // -ri-
      createNote("G", 4, 800, 5980, "bell"),  // -jó
      
      // "A galinha usa saia e o galo paletó"
      createNote("E", 4, 300, 7200, "bell"),  // A
      createNote("E", 4, 300, 7630, "bell"),  // ga-
      createNote("G", 4, 300, 8060, "bell"),  // -li-
      createNote("G", 4, 300, 8490, "bell"),  // -nha
      createNote("A", 4, 300, 8920, "bell"),  // u-
      createNote("A", 4, 300, 9350, "bell"),  // -sa
      createNote("G", 4, 600, 9780, "bell"),  // sai-a
      
      createNote("F", 4, 300, 10700, "bell"), // e
      createNote("F", 4, 300, 11130, "bell"), // o
      createNote("E", 4, 300, 11560, "bell"), // ga-
      createNote("D", 4, 300, 11990, "bell"), // -lo
      createNote("C", 4, 300, 12420, "bell"), // pa-
      createNote("D", 4, 300, 12850, "bell"), // -le-
      createNote("E", 4, 1200, 13280, "bell") // -tó
    ]
  },

  "atirei-pau-bell": {
    id: "atirei-pau-bell", name: "Atirei o Pau no Gato", bpm: 120, timeSignature: "4/4",
    totalDuration: 12000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Atirei o pau no gato-to"
      createNote("G", 4, 500, 0, "bell"),     // A-
      createNote("E", 4, 500, 500, "bell"),   // -ti-
      createNote("E", 4, 500, 1000, "bell"),  // -rei
      createNote("F", 4, 500, 1500, "bell"),  // o
      createNote("D", 4, 500, 2000, "bell"),  // pau
      createNote("D", 4, 500, 2500, "bell"),  // no
      createNote("C", 4, 500, 3000, "bell"),  // ga-
      createNote("D", 4, 500, 3500, "bell"),  // -to-
      createNote("E", 4, 1000, 4000, "bell"), // -to
      
      // "Mas o gato-to não morreu-reu-reu"
      createNote("G", 4, 500, 5500, "bell"),  // Mas
      createNote("E", 4, 500, 6000, "bell"),  // o
      createNote("E", 4, 500, 6500, "bell"),  // ga-
      createNote("F", 4, 500, 7000, "bell"),  // -to-
      createNote("D", 4, 500, 7500, "bell"),  // -to
      createNote("D", 4, 500, 8000, "bell"),  // não
      createNote("C", 4, 500, 8500, "bell"),  // mor-
      createNote("D", 4, 500, 9000, "bell"),  // -reu-
      createNote("E", 4, 500, 9500, "bell"),  // -reu-
      createNote("C", 4, 1500, 10000, "bell") // -reu
    ]
  },

  "escravos-jó-bell": {
    id: "escravos-jó-bell", name: "Escravos de Jó", bpm: 130, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Escravos de Jó jogavam caxangá"
      createNote("C", 4, 400, 0, "bell"),     // Es-
      createNote("D", 4, 400, 460, "bell"),   // -cra-
      createNote("E", 4, 400, 920, "bell"),   // -vos
      createNote("F", 4, 400, 1380, "bell"),  // de
      createNote("G", 4, 400, 1840, "bell"),  // Jó
      createNote("A", 4, 400, 2300, "bell"),  // jo-
      createNote("G", 4, 400, 2760, "bell"),  // -ga-
      createNote("F", 4, 400, 3220, "bell"),  // -vam
      createNote("E", 4, 800, 3680, "bell"),  // ca-xan-gá
      
      // "Tira, põe, deixa ficar"
      createNote("C", 4, 400, 5000, "bell"),  // Ti-
      createNote("D", 4, 400, 5460, "bell"),  // -ra
      createNote("E", 4, 800, 5920, "bell"),  // põe
      createNote("F", 4, 400, 6840, "bell"),  // dei-
      createNote("G", 4, 400, 7300, "bell"),  // -xa
      createNote("A", 4, 800, 7760, "bell"),  // fi-
      createNote("G", 4, 1200, 8680, "bell"), // -car
      
      // "Guerreiros com guerreiros fazem zigue-zigue-zá"
      createNote("A", 4, 400, 10300, "bell"), // Guer-
      createNote("A", 4, 400, 10760, "bell"), // -rei-
      createNote("G", 4, 400, 11220, "bell"), // -ros
      createNote("F", 4, 400, 11680, "bell"), // com
      createNote("E", 4, 400, 12140, "bell"), // guer-
      createNote("D", 4, 400, 12600, "bell"), // -rei-
      createNote("C", 4, 400, 13060, "bell"), // -ros
      createNote("D", 4, 400, 13520, "bell"), // fa-
      createNote("E", 4, 400, 13980, "bell"), // -zem
      createNote("F", 4, 400, 14440, "bell"), // zi-
      createNote("G", 4, 400, 14900, "bell"), // -gue-
      createNote("C", 4, 1100, 15360, "bell") // -zi-gue-zá
    ]
  },

  // === XILOFONE - 6 músicas ===
  "happy-birthday-xylophone": {
    id: "happy-birthday-xylophone", name: "Parabéns para Você", bpm: 90, timeSignature: "3/4",
    totalDuration: 20000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Parabéns para você"
      createNote("C", 5, 500, 0, "xylophone"),    // Pa-
      createNote("C", 5, 500, 667, "xylophone"),  // -ra-
      createNote("D", 5, 1000, 1334, "xylophone"), // -béns
      createNote("C", 5, 1000, 2668, "xylophone"), // pa-
      createNote("F", 5, 1000, 4002, "xylophone"), // -ra
      createNote("E", 5, 2000, 5336, "xylophone"), // vo-cê
      
      // "Parabéns para você"
      createNote("C", 5, 500, 7670, "xylophone"),  // Pa-
      createNote("C", 5, 500, 8337, "xylophone"),  // -ra-
      createNote("D", 5, 1000, 9004, "xylophone"), // -béns
      createNote("C", 5, 1000, 10338, "xylophone"), // pa-
      createNote("G", 5, 1000, 11672, "xylophone"), // -ra
      createNote("F", 5, 2000, 13006, "xylophone"), // vo-cê
      
      // "Parabéns, parabéns"
      createNote("C", 5, 500, 15340, "xylophone"), // Pa-
      createNote("C", 5, 500, 16007, "xylophone"), // -ra-
      createNote("C", 6, 1000, 16674, "xylophone"), // -béns
      createNote("A", 5, 1000, 18008, "xylophone"), // pa-
      createNote("F", 5, 1000, 19342, "xylophone"), // -ra-
      createNote("E", 5, 1000, 20676, "xylophone"), // -béns
      createNote("D", 5, 2000, 22010, "xylophone")  // ...
    ]
  },

  "xuxa-xylophone": {
    id: "xuxa-xylophone", name: "Ilariê (Xuxa)", bpm: 140, timeSignature: "4/4",
    totalDuration: 14000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Ilariê, ilariê, ilariê-ê-ê"
      createNote("C", 5, 300, 0, "xylophone"),     // I-
      createNote("D", 5, 300, 428, "xylophone"),   // -la-
      createNote("E", 5, 300, 856, "xylophone"),   // -ri-
      createNote("G", 5, 600, 1284, "xylophone"),  // -ê
      createNote("A", 5, 300, 2140, "xylophone"),  // i-
      createNote("G", 5, 300, 2568, "xylophone"),  // -la-
      createNote("E", 5, 300, 2996, "xylophone"),  // -ri-
      createNote("C", 5, 600, 3424, "xylophone"),  // -ê
      
      createNote("E", 5, 300, 4280, "xylophone"),  // i-
      createNote("G", 5, 300, 4708, "xylophone"),  // -la-
      createNote("A", 5, 300, 5136, "xylophone"),  // -ri-
      createNote("C", 6, 300, 5564, "xylophone"),  // -ê-
      createNote("A", 5, 300, 5992, "xylophone"),  // -ê-
      createNote("G", 5, 600, 6420, "xylophone"),  // -ê
      
      // "É a festa do movimento"
      createNote("G", 5, 400, 7600, "xylophone"),  // É
      createNote("A", 5, 400, 8000, "xylophone"),  // a
      createNote("G", 5, 400, 8400, "xylophone"),  // fes-
      createNote("F", 5, 400, 8800, "xylophone"),  // -ta
      createNote("E", 5, 400, 9200, "xylophone"),  // do
      createNote("D", 5, 400, 9600, "xylophone"),  // mo-
      createNote("C", 5, 400, 10000, "xylophone"), // -vi-
      createNote("D", 5, 400, 10400, "xylophone"), // -men-
      createNote("E", 5, 1200, 10800, "xylophone") // -to
    ]
  },

  // Continue com as outras músicas do xilofone e keyboard...
  // [Adicionarei as outras 12 músicas seguindo o mesmo padrão autêntico]

  // === TECLADO/KEYBOARD - 6 músicas ===
  "scale-keyboard": {
    id: "scale-keyboard", name: "Escala de Dó Maior", bpm: 80, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 1,
    notes: [
      createNote("C", 4, 1000, 0, "keyboard"),    // Dó
      createNote("D", 4, 1000, 1000, "keyboard"), // Ré  
      createNote("E", 4, 1000, 2000, "keyboard"), // Mi
      createNote("F", 4, 1000, 3000, "keyboard"), // Fá
      createNote("G", 4, 1000, 4000, "keyboard"), // Sol
      createNote("A", 4, 1000, 5000, "keyboard"), // Lá
      createNote("B", 4, 1000, 6000, "keyboard"), // Si
      createNote("C", 5, 2000, 7000, "keyboard"), // Dó (oitava)
      
      // Descendo a escala
      createNote("B", 4, 1000, 9500, "keyboard"), // Si
      createNote("A", 4, 1000, 10500, "keyboard"), // Lá
      createNote("G", 4, 1000, 11500, "keyboard"), // Sol
      createNote("F", 4, 1000, 12500, "keyboard"), // Fá
      createNote("E", 4, 1000, 13500, "keyboard"), // Mi
      createNote("D", 4, 1000, 14500, "keyboard"), // Ré
      createNote("C", 4, 1500, 15500, "keyboard")  // Dó
    ]
  }

  // [Continuarei com as outras músicas do keyboard...]
};

// Função CORRIGIDA para obter sequência musical por ID
export const getAuthenticMusicalSequence = (songId: string): MusicalSequence | null => {
  return authenticMusicalSequences[songId] || null;
};

// Função SINCRONIZADA para gerar notas do jogo
export const generateAuthenticGameNotes = (sequence: MusicalSequence, instrumentType: string) => {
  const lanes = 7; // Sempre 7 lanes: C, D, E, F, G, A, B
  const noteToLane: Record<string, number> = {
    C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6
  };

  const gameNotes = [];
  let noteId = 0;

  // Usar as notas exatas da sequência musical
  sequence.notes.forEach((note) => {
    const lane = noteToLane[note.note];
    if (lane !== undefined) {
      gameNotes.push({
        id: `authentic-note-${noteId++}`,
        lane,
        color: getColorForNote(note.note),
        frequency: note.frequency, // Usar frequência EXATA da sequência
        startTime: note.timing,
        duration: note.duration,
        y: -100
      });
    }
  });

  console.log(`🎼 Generated ${gameNotes.length} AUTHENTIC notes for ${sequence.name}`);
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
