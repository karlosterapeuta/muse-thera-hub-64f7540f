import { MusicalSequence, MusicalNote, InstrumentConfig } from "@/types/musicTypes";
import { TEA_MASTER_FREQUENCIES, getFrequencyByNote } from "@/constants/teaFrequencies";

// CONFIGURAÇÕES SINCRONIZADAS COM A MASTER TABLE
export const instrumentConfigs: Record<string, InstrumentConfig> = {
  bell: {
    baseFrequencies: Object.fromEntries(
      TEA_MASTER_FREQUENCIES.bell.map(config => [config.note, config.frequency])
    ),
    octaveMultiplier: 1
  },
  xylophone: {
    baseFrequencies: Object.fromEntries(
      TEA_MASTER_FREQUENCIES.xylophone.map(config => [config.note, config.frequency])
    ),
    octaveMultiplier: 2
  },
  keyboard: {
    baseFrequencies: Object.fromEntries(
      TEA_MASTER_FREQUENCIES.keyboard.map(config => [config.note, config.frequency])
    ),
    octaveMultiplier: 1
  }
};

// Função SINCRONIZADA para criar nota com frequência EXATA da master table
const createNote = (note: string, octave: number, duration: number, timing: number, instrument: string): MusicalNote => {
  const frequency = getFrequencyByNote(instrument as "bell" | "xylophone" | "keyboard", note);
  console.log(`🎼 Creating note ${note} for ${instrument}: ${frequency}Hz`);
  return { note, octave, frequency, duration, timing };
};

// SEQUÊNCIAS MUSICAIS COMPLETAS E AUTÊNTICAS - 18 músicas infantis brasileiras CORRIGIDAS
export const authenticMusicalSequences: Record<string, MusicalSequence> = {
  // === SINO (BELL) - 6 músicas CORRIGIDAS ===
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

  "parabens-bell": {
    id: "parabens-bell", name: "Parabéns a Você", bpm: 90, timeSignature: "4/4",
    totalDuration: 25000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Parabéns para você"
      createNote("C", 4, 500, 0, "bell"),     // Pa-
      createNote("C", 4, 500, 667, "bell"),   // -ra-
      createNote("D", 4, 1000, 1334, "bell"), // -béns
      createNote("C", 4, 1000, 2668, "bell"), // pa-
      createNote("F", 4, 1000, 4002, "bell"), // -ra
      createNote("E", 4, 2000, 5336, "bell"), // vo-cê
      
      // "Parabéns para você" 
      createNote("C", 4, 500, 7670, "bell"),  // Pa-
      createNote("C", 4, 500, 8337, "bell"),  // -ra-
      createNote("D", 4, 1000, 9004, "bell"), // -béns
      createNote("C", 4, 1000, 10338, "bell"), // pa-
      createNote("G", 4, 1000, 11672, "bell"), // -ra
      createNote("F", 4, 2000, 13006, "bell"), // vo-cê
      
      // "Parabéns querido/a [nome]"
      createNote("C", 4, 500, 15340, "bell"), // Pa-
      createNote("C", 4, 500, 16007, "bell"), // -ra-
      createNote("A", 4, 1000, 16674, "bell"), // -béns
      createNote("F", 4, 1000, 18008, "bell"), // que-
      createNote("E", 4, 1000, 19342, "bell"), // -ri-
      createNote("D", 4, 1000, 20676, "bell"), // -do/a
      
      // "Muitas felicidades"
      createNote("B", 4, 500, 22010, "bell"), // Mui-
      createNote("B", 4, 500, 22677, "bell"), // -tas
      createNote("A", 4, 1000, 23344, "bell"), // fe-
      createNote("G", 4, 1000, 24678, "bell"), // -li-
      createNote("C", 4, 2000, 26012, "bell")  // -ci-da-des
    ]
  },

  "borboletinha-bell": {
    id: "borboletinha-bell", name: "Borboletinha", bpm: 120, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Borboletinha tá na cozinha" - Melodia tradicional brasileira corrigida: G-A-G-C
      createNote("G", 4, 500, 0, "bell"),     // Bor-
      createNote("A", 4, 500, 500, "bell"),   // -bo-
      createNote("G", 4, 500, 1000, "bell"),  // -le-
      createNote("C", 4, 500, 1500, "bell"),  // -ti-
      createNote("G", 4, 500, 2000, "bell"),  // -nha
      createNote("A", 4, 500, 2500, "bell"),  // tá
      createNote("G", 4, 500, 3000, "bell"),  // na
      createNote("B", 4, 800, 3500, "bell"),  // co-zi-nha
      
      // "Fazendo chocolate para a madrinha" - Continuação: G-A-G-B-G-A-B-C
      createNote("G", 4, 500, 4500, "bell"),  // Fa-
      createNote("A", 4, 500, 5000, "bell"),  // -zen-
      createNote("G", 4, 500, 5500, "bell"),  // -do
      createNote("B", 4, 500, 6000, "bell"),  // cho-
      createNote("G", 4, 500, 6500, "bell"),  // -co-
      createNote("A", 4, 500, 7000, "bell"),  // -la-
      createNote("B", 4, 500, 7500, "bell"),  // -te
      createNote("C", 4, 800, 8000, "bell"),  // pa-ra a ma-dri-nha
      
      // "Poti, poti, perna de pau" - Rítmico e tradicional
      createNote("E", 4, 400, 9000, "bell"),  // Po-
      createNote("E", 4, 400, 9400, "bell"),  // -ti
      createNote("E", 4, 400, 9800, "bell"),  // Po-
      createNote("E", 4, 400, 10200, "bell"), // -ti
      createNote("F", 4, 500, 10600, "bell"), // per-
      createNote("E", 4, 500, 11100, "bell"), // -na
      createNote("D", 4, 500, 11600, "bell"), // de
      createNote("C", 4, 800, 12100, "bell"), // pau
      
      // "Olho de vidro e nariz de pica-pau" - Finalização tradicional
      createNote("G", 4, 300, 13100, "bell"), // O-
      createNote("A", 4, 300, 13400, "bell"), // -lho
      createNote("G", 4, 300, 13700, "bell"), // de
      createNote("F", 4, 300, 14000, "bell"), // vi-
      createNote("E", 4, 300, 14300, "bell"), // -dro
      createNote("F", 4, 300, 14600, "bell"), // e
      createNote("G", 4, 300, 14900, "bell"), // na-
      createNote("A", 4, 300, 15200, "bell"), // -riz
      createNote("G", 4, 300, 15500, "bell"), // de
      createNote("F", 4, 300, 15800, "bell"), // pi-
      createNote("E", 4, 300, 16100, "bell"), // -ca-
      createNote("D", 4, 300, 16400, "bell"), // -pau
      createNote("C", 4, 600, 16700, "bell")  // (final)
    ]
  },

  "galinha-pintadinha-bell": {
    id: "galinha-pintadinha-bell", name: "Galinha Pintadinha", bpm: 140, timeSignature: "4/4",
    totalDuration: 18000, difficulty: "Fácil", loops: 1,
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
      createNote("E", 4, 600, 13280, "bell"), // -tó
      
      // Refrão: "Pó pó pó pó pó pó pó pó"
      createNote("C", 4, 200, 14200, "bell"), // Pó
      createNote("D", 4, 200, 14400, "bell"), // pó
      createNote("E", 4, 200, 14600, "bell"), // pó
      createNote("F", 4, 200, 14800, "bell"), // pó
      createNote("G", 4, 200, 15000, "bell"), // pó
      createNote("A", 4, 200, 15200, "bell"), // pó
      createNote("G", 4, 200, 15400, "bell"), // pó
      createNote("E", 4, 800, 15600, "bell")  // pó (final)
    ]
  },

  "atirei-pau-bell": {
    id: "atirei-pau-bell", name: "Atirei o Pau no Gato", bpm: 120, timeSignature: "4/4",
    totalDuration: 20000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Atirei o pau no gato-to" - Melodia tradicional completa G-F-E-D-E-F-G-G-G
      createNote("G", 4, 500, 0, "bell"),     // A-
      createNote("F", 4, 500, 500, "bell"),   // -ti-
      createNote("E", 4, 500, 1000, "bell"),  // -rei
      createNote("D", 4, 500, 1500, "bell"),  // o
      createNote("E", 4, 500, 2000, "bell"),  // pau
      createNote("F", 4, 500, 2500, "bell"),  // no
      createNote("G", 4, 500, 3000, "bell"),  // ga-
      createNote("G", 4, 500, 3500, "bell"),  // -to-
      createNote("G", 4, 800, 4000, "bell"),  // -to
      
      // "Mas o gato-to não morreu-reu-reu" - Continuação A-G-F-F-F-G-F-E-E-E-D-C
      createNote("A", 4, 500, 5200, "bell"),  // Mas
      createNote("G", 4, 500, 5700, "bell"),  // o
      createNote("F", 4, 800, 6200, "bell"),  // ga-to-to
      
      createNote("F", 4, 500, 7200, "bell"),  // não
      createNote("F", 4, 500, 7700, "bell"),  // mor-
      createNote("G", 4, 500, 8200, "bell"),  // -reu-
      createNote("F", 4, 500, 8700, "bell"),  // -reu-
      createNote("E", 4, 800, 9200, "bell"),  // -reu
      
      // "Dona Chica admirou-se" - Terceira parte E-E-G-E-G-E-E-E-D-C
      createNote("E", 4, 500, 10400, "bell"), // Do-
      createNote("E", 4, 500, 10900, "bell"), // -na
      createNote("G", 4, 500, 11400, "bell"), // Chi-
      createNote("E", 4, 500, 11900, "bell"), // -ca
      createNote("G", 4, 500, 12400, "bell"), // ad-
      createNote("E", 4, 500, 12900, "bell"), // -mi-
      createNote("E", 4, 500, 13400, "bell"), // -rou-
      createNote("E", 4, 500, 13900, "bell"), // -se
      createNote("D", 4, 500, 14400, "bell"), // (se)
      createNote("C", 4, 600, 14900, "bell"), // (final)
      
      // "Do berro que o gato deu" - Estrofe final completa
      createNote("G", 4, 500, 16000, "bell"), // Do
      createNote("F", 4, 500, 16500, "bell"), // ber-
      createNote("E", 4, 500, 17000, "bell"), // -ro
      createNote("D", 4, 500, 17500, "bell"), // que
      createNote("E", 4, 500, 18000, "bell"), // o
      createNote("F", 4, 500, 18500, "bell"), // ga-
      createNote("G", 4, 500, 19000, "bell"), // -to
      createNote("A", 4, 500, 19500, "bell"), // deu
      createNote("G", 4, 1000, 20000, "bell") // (final)
    ]
  },

  "escravos-jó-bell": {
    id: "escravos-jó-bell", name: "Escravos de Jó", bpm: 120, timeSignature: "4/4", 
    totalDuration: 18000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Escravos de Jó jogavam caxangá" - Melodia tradicional: C-B-A-G-A-G-A-G-F-E
      createNote("C", 4, 400, 0, "bell"),     // Es-
      createNote("B", 4, 400, 400, "bell"),   // -cra-
      createNote("A", 4, 400, 800, "bell"),   // -vos
      createNote("G", 4, 400, 1200, "bell"),  // de
      createNote("A", 4, 400, 1600, "bell"),  // Jó
      createNote("G", 4, 400, 2000, "bell"),  // jo-
      createNote("A", 4, 400, 2400, "bell"),  // -ga-
      createNote("G", 4, 400, 2800, "bell"),  // -vam
      createNote("F", 4, 400, 3200, "bell"),  // ca-
      createNote("E", 4, 800, 3600, "bell"),  // -xan-gá
      
      // "Tira, põe, deixa ficar" - Continuação rítmica: G-E-G-E-E-E-D-C
      createNote("G", 4, 400, 4800, "bell"),  // Ti-
      createNote("E", 4, 400, 5200, "bell"),  // -ra
      createNote("G", 4, 600, 5600, "bell"),  // põe
      createNote("E", 4, 400, 6400, "bell"),  // dei-
      createNote("E", 4, 400, 6800, "bell"),  // -xa
      createNote("E", 4, 400, 7200, "bell"),  // fi-
      createNote("D", 4, 400, 7600, "bell"),  // -
      createNote("C", 4, 1200, 8000, "bell"), // -car
      
      // "Guerreiros com guerreiros fazem zigue-zigue-zá" - Parte rápida e rítmica
      createNote("C", 4, 300, 9600, "bell"),  // Guer-
      createNote("C", 4, 300, 9900, "bell"),  // -rei-
      createNote("D", 4, 300, 10200, "bell"), // -ros
      createNote("E", 4, 300, 10500, "bell"), // com
      createNote("F", 4, 300, 10800, "bell"), // guer-
      createNote("G", 4, 300, 11100, "bell"), // -rei-
      createNote("A", 4, 300, 11400, "bell"), // -ros
      createNote("G", 4, 300, 11700, "bell"), // fa-
      createNote("F", 4, 300, 12000, "bell"), // -zem
      
      // "zigue-zigue-zá" - Finalização característica
      createNote("E", 4, 300, 12600, "bell"), // zi-
      createNote("F", 4, 300, 12900, "bell"), // -gue-
      createNote("G", 4, 300, 13200, "bell"), // zi-
      createNote("A", 4, 300, 13500, "bell"), // -gue-
      createNote("G", 4, 600, 13800, "bell"), // -zá
      
      // Repetição final do refrão
      createNote("C", 4, 400, 14800, "bell"), // (Es-
      createNote("B", 4, 400, 15200, "bell"), // cra-
      createNote("A", 4, 400, 15600, "bell"), // vos
      createNote("G", 4, 400, 16000, "bell"), // de
      createNote("F", 4, 400, 16400, "bell"), // Jó)
      createNote("E", 4, 400, 16800, "bell"), 
      createNote("C", 4, 1200, 17200, "bell") // (final)
    ]
  },

  // === XILOFONE - 6 músicas completas ===
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

  "sapo-xylophone": {
    id: "sapo-xylophone", name: "O Sapo Não Lava o Pé", bpm: 120, timeSignature: "4/4",
    totalDuration: 15000, difficulty: "Fácil", loops: 1,
    notes: [
      // "O sapo não lava o pé"
      createNote("C", 5, 500, 0, "xylophone"),    // O
      createNote("D", 5, 500, 500, "xylophone"),  // sa-
      createNote("E", 5, 500, 1000, "xylophone"), // -po
      createNote("F", 5, 500, 1500, "xylophone"), // não
      createNote("G", 5, 500, 2000, "xylophone"), // la-
      createNote("A", 5, 500, 2500, "xylophone"), // -va
      createNote("G", 5, 500, 3000, "xylophone"), // o
      createNote("F", 5, 1000, 3500, "xylophone"), // pé
      
      // "Não lava porque não quer"
      createNote("E", 5, 500, 5000, "xylophone"), // Não
      createNote("F", 5, 500, 5500, "xylophone"), // la-
      createNote("G", 5, 500, 6000, "xylophone"), // -va
      createNote("A", 5, 500, 6500, "xylophone"), // por-
      createNote("G", 5, 500, 7000, "xylophone"), // -que
      createNote("F", 5, 500, 7500, "xylophone"), // não
      createNote("E", 5, 500, 8000, "xylophone"), // quer
      createNote("D", 5, 1000, 8500, "xylophone"), // (quer)
      
      // "Ele mora lá na lagoa"
      createNote("C", 5, 400, 10000, "xylophone"), // E-
      createNote("D", 5, 400, 10400, "xylophone"), // -le
      createNote("E", 5, 400, 10800, "xylophone"), // mo-
      createNote("F", 5, 400, 11200, "xylophone"), // -ra
      createNote("G", 5, 400, 11600, "xylophone"), // lá
      createNote("A", 5, 400, 12000, "xylophone"), // na
      createNote("G", 5, 400, 12400, "xylophone"), // la-
      createNote("F", 5, 400, 12800, "xylophone"), // -go-
      createNote("E", 5, 400, 13200, "xylophone"), // -a
      createNote("C", 5, 1800, 13600, "xylophone") // (final)
    ]
  },

  "letitgo-xylophone": {
    id: "letitgo-xylophone", name: "Let It Go (Frozen)", bpm: 130, timeSignature: "4/4",
    totalDuration: 20000, difficulty: "Médio", loops: 1,
    notes: [
      // "Let it go, let it go" - Versão simplificada infantil
      createNote("G", 5, 600, 0, "xylophone"),    // Let
      createNote("A", 5, 600, 692, "xylophone"),  // it
      createNote("G", 5, 1200, 1384, "xylophone"), // go
      createNote("F", 5, 600, 3076, "xylophone"), // let
      createNote("G", 5, 600, 3768, "xylophone"), // it
      createNote("F", 5, 1200, 4460, "xylophone"), // go
      
      // "Can't hold back anymore"
      createNote("E", 5, 500, 6152, "xylophone"), // Can't
      createNote("F", 5, 500, 6652, "xylophone"), // hold
      createNote("G", 5, 500, 7152, "xylophone"), // back
      createNote("A", 5, 500, 7652, "xylophone"), // any-
      createNote("B", 5, 1000, 8152, "xylophone"), // -more
      
      // "Let it go, let it go" - Repetição mais intensa
      createNote("A", 5, 600, 9652, "xylophone"), // Let
      createNote("B", 5, 600, 10344, "xylophone"), // it
      createNote("A", 5, 1200, 11036, "xylophone"), // go
      createNote("G", 5, 600, 12728, "xylophone"), // let
      createNote("A", 5, 600, 13420, "xylophone"), // it
      createNote("G", 5, 1200, 14112, "xylophone"), // go
      
      // "Turn away and slam the door" - Final
      createNote("F", 5, 400, 15804, "xylophone"), // Turn
      createNote("G", 5, 400, 16204, "xylophone"), // a-
      createNote("A", 5, 400, 16604, "xylophone"), // -way
      createNote("B", 5, 400, 17004, "xylophone"), // and
      createNote("A", 5, 400, 17404, "xylophone"), // slam
      createNote("G", 5, 400, 17804, "xylophone"), // the
      createNote("F", 5, 1200, 18204, "xylophone"), // door
      createNote("C", 5, 1800, 19804, "xylophone") // (final)
    ]
  },

  "peppa-xylophone": {
    id: "peppa-xylophone", name: "Peppa Pig Theme", bpm: 120, timeSignature: "4/4",
    totalDuration: 12000, difficulty: "Fácil", loops: 1,
    notes: [
      // Tema principal alegre e reconhecível
      createNote("G", 5, 400, 0, "xylophone"),    // Pep-
      createNote("G", 5, 400, 400, "xylophone"),  // -pa
      createNote("A", 5, 400, 800, "xylophone"),  // Pig
      createNote("G", 5, 400, 1200, "xylophone"), // (oink)
      createNote("E", 5, 800, 1600, "xylophone"), // 
      
      createNote("G", 5, 400, 2800, "xylophone"), // Pep-
      createNote("G", 5, 400, 3200, "xylophone"), // -pa
      createNote("A", 5, 400, 3600, "xylophone"), // Pig
      createNote("B", 5, 400, 4000, "xylophone"), // (oink)
      createNote("C", 6, 800, 4400, "xylophone"), // 
      
      // Melodia saltitante
      createNote("E", 5, 300, 5600, "xylophone"), // Jump-
      createNote("F", 5, 300, 5900, "xylophone"), // -ing
      createNote("G", 5, 300, 6200, "xylophone"), // up
      createNote("A", 5, 300, 6500, "xylophone"), // and
      createNote("B", 5, 300, 6800, "xylophone"), // down
      createNote("A", 5, 300, 7100, "xylophone"), // in
      createNote("G", 5, 300, 7400, "xylophone"), // mud-
      createNote("F", 5, 300, 7700, "xylophone"), // -dy
      createNote("E", 5, 600, 8000, "xylophone"), // pud-
      createNote("D", 5, 600, 8600, "xylophone"), // -dles
      
      // Final alegre
      createNote("G", 5, 400, 9600, "xylophone"), 
      createNote("A", 5, 400, 10000, "xylophone"),
      createNote("B", 5, 400, 10400, "xylophone"),
      createNote("C", 6, 1600, 10800, "xylophone") // Final
    ]
  },

  "patrulha-xylophone": {
    id: "patrulha-xylophone", name: "Patrulha Canina", bpm: 140, timeSignature: "4/4",
    totalDuration: 15000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Patrulha Canina ao resgate!"
      createNote("C", 5, 300, 0, "xylophone"),    // Pa-
      createNote("D", 5, 300, 428, "xylophone"),  // -tru-
      createNote("E", 5, 300, 856, "xylophone"),  // -lha
      createNote("G", 5, 600, 1284, "xylophone"), // Ca-
      createNote("F", 5, 300, 2140, "xylophone"), // -ni-
      createNote("E", 5, 300, 2568, "xylophone"), // -na
      createNote("D", 5, 600, 2996, "xylophone"), // 
      
      createNote("E", 5, 300, 4280, "xylophone"), // ao
      createNote("F", 5, 300, 4708, "xylophone"), // res-
      createNote("G", 5, 300, 5136, "xylophone"), // -ga-
      createNote("A", 5, 600, 5564, "xylophone"), // -te!
      
      // "Sempre alerta, sempre pronta"
      createNote("G", 5, 400, 6848, "xylophone"), // Sem-
      createNote("A", 5, 400, 7248, "xylophone"), // -pre
      createNote("G", 5, 400, 7648, "xylophone"), // a-
      createNote("F", 5, 400, 8048, "xylophone"), // -ler-
      createNote("E", 5, 800, 8448, "xylophone"), // -ta
      
      createNote("G", 5, 400, 9648, "xylophone"), // sem-
      createNote("A", 5, 400, 10048, "xylophone"), // -pre
      createNote("B", 5, 400, 10448, "xylophone"), // pron-
      createNote("A", 5, 400, 10848, "xylophone"), // -ta
      createNote("G", 5, 800, 11248, "xylophone"), // 
      
      // "Patrulha Canina!"
      createNote("C", 6, 400, 12448, "xylophone"), // Pa-
      createNote("B", 5, 400, 12848, "xylophone"), // -tru-
      createNote("A", 5, 400, 13248, "xylophone"), // -lha
      createNote("G", 5, 400, 13648, "xylophone"), // Ca-
      createNote("F", 5, 400, 14048, "xylophone"), // -ni-
      createNote("E", 5, 400, 14448, "xylophone"), // -na!
      createNote("C", 5, 1000, 14848, "xylophone") // (final)
    ]
  },

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
  },

  "tres-notas-keyboard": {
    id: "tres-notas-keyboard", name: "Três Notas Mágicas", bpm: 90, timeSignature: "4/4",
    totalDuration: 10000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Hot Cross Buns" tradicional - B-A-G pattern
      createNote("B", 4, 1000, 0, "keyboard"),    // Hot
      createNote("A", 4, 1000, 1333, "keyboard"), // Cross
      createNote("G", 4, 2000, 2666, "keyboard"), // Buns
      
      createNote("B", 4, 1000, 5332, "keyboard"), // Hot
      createNote("A", 4, 1000, 6665, "keyboard"), // Cross
      createNote("G", 4, 2000, 7998, "keyboard"), // Buns
      
      // Variação melódica
      createNote("G", 4, 500, 10664, "keyboard"), 
      createNote("G", 4, 500, 11164, "keyboard"),
      createNote("G", 4, 500, 11664, "keyboard"),
      createNote("G", 4, 500, 12164, "keyboard"),
      createNote("A", 4, 500, 12664, "keyboard"),
      createNote("A", 4, 500, 13164, "keyboard"),
      createNote("A", 4, 500, 13664, "keyboard"),
      createNote("A", 4, 500, 14164, "keyboard"),
      
      // Final
      createNote("B", 4, 1000, 14997, "keyboard"),
      createNote("A", 4, 1000, 16330, "keyboard"),
      createNote("G", 4, 2000, 17663, "keyboard")
    ]
  },

  "aquarela-keyboard": {
    id: "aquarela-keyboard", name: "Aquarela (Toquinho)", bpm: 100, timeSignature: "4/4",
    totalDuration: 25000, difficulty: "Médio", loops: 1,
    notes: [
      // "Numa folha qualquer eu desenho um sol amarelo"
      createNote("C", 4, 400, 0, "keyboard"),     // Nu-
      createNote("D", 4, 400, 600, "keyboard"),   // -ma
      createNote("E", 4, 400, 1200, "keyboard"),  // fo-
      createNote("F", 4, 400, 1800, "keyboard"),  // -lha
      createNote("G", 4, 400, 2400, "keyboard"),  // qual-
      createNote("A", 4, 400, 3000, "keyboard"),  // -quer
      createNote("G", 4, 400, 3600, "keyboard"),  // eu
      createNote("F", 4, 400, 4200, "keyboard"),  // de-
      createNote("E", 4, 400, 4800, "keyboard"),  // -se-
      createNote("D", 4, 400, 5400, "keyboard"),  // -nho
      
      createNote("E", 4, 400, 6600, "keyboard"),  // um
      createNote("F", 4, 400, 7200, "keyboard"),  // sol
      createNote("G", 4, 400, 7800, "keyboard"),  // a-
      createNote("A", 4, 400, 8400, "keyboard"),  // -ma-
      createNote("G", 4, 800, 9000, "keyboard"),  // -re-lo
      
      // "E com cinco ou seis retas é fácil fazer um castelo"
      createNote("C", 4, 300, 10800, "keyboard"), // E
      createNote("D", 4, 300, 11100, "keyboard"), // com
      createNote("E", 4, 300, 11400, "keyboard"), // cin-
      createNote("F", 4, 300, 11700, "keyboard"), // -co
      createNote("G", 4, 300, 12000, "keyboard"), // ou
      createNote("A", 4, 300, 12300, "keyboard"), // seis
      createNote("B", 4, 300, 12600, "keyboard"), // re-
      createNote("A", 4, 300, 12900, "keyboard"), // -tas
      
      createNote("G", 4, 400, 13800, "keyboard"), // é
      createNote("F", 4, 400, 14200, "keyboard"), // fá-
      createNote("E", 4, 400, 14600, "keyboard"), // -cil
      createNote("F", 4, 400, 15000, "keyboard"), // fa-
      createNote("G", 4, 400, 15400, "keyboard"), // -zer
      createNote("A", 4, 400, 15800, "keyboard"), // um
      createNote("G", 4, 400, 16200, "keyboard"), // cas-
      createNote("F", 4, 400, 16600, "keyboard"), // -te-
      createNote("E", 4, 800, 17000, "keyboard"), // -lo
      
      // "Corro o lápis em torno da mão"
      createNote("D", 4, 400, 18600, "keyboard"), // Cor-
      createNote("E", 4, 400, 19000, "keyboard"), // -ro
      createNote("F", 4, 400, 19400, "keyboard"), // o
      createNote("G", 4, 400, 19800, "keyboard"), // lá-
      createNote("A", 4, 400, 20200, "keyboard"), // -pis
      createNote("G", 4, 400, 20600, "keyboard"), // em
      createNote("F", 4, 400, 21000, "keyboard"), // tor-
      createNote("E", 4, 400, 21400, "keyboard"), // -no
      createNote("D", 4, 400, 21800, "keyboard"), // da
      createNote("C", 4, 1200, 22200, "keyboard") // mão
    ]
  },

  "caranguejo-keyboard": {
    id: "caranguejo-keyboard", name: "Caranguejo", bpm: 120, timeSignature: "4/4",
    totalDuration: 18000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Caranguejo não é peixe"
      createNote("G", 4, 500, 0, "keyboard"),     // Ca-
      createNote("G", 4, 500, 500, "keyboard"),   // -ran-
      createNote("A", 4, 500, 1000, "keyboard"),  // -gue-
      createNote("B", 4, 500, 1500, "keyboard"),  // -jo
      createNote("A", 4, 500, 2000, "keyboard"),  // não
      createNote("G", 4, 500, 2500, "keyboard"),  // é
      createNote("F", 4, 500, 3000, "keyboard"),  // pei-
      createNote("E", 4, 1000, 3500, "keyboard"), // -xe
      
      // "Caranguejo peixe é"
      createNote("G", 4, 500, 5000, "keyboard"),  // Ca-
      createNote("G", 4, 500, 5500, "keyboard"),  // -ran-
      createNote("A", 4, 500, 6000, "keyboard"),  // -gue-
      createNote("B", 4, 500, 6500, "keyboard"),  // -jo
      createNote("A", 4, 500, 7000, "keyboard"),  // pei-
      createNote("G", 4, 500, 7500, "keyboard"),  // -xe
      createNote("F", 4, 1000, 8000, "keyboard"), // é
      
      // "Caranguejo só é peixe na enchente da maré"
      createNote("C", 5, 400, 9500, "keyboard"),  // Ca-
      createNote("B", 4, 400, 9900, "keyboard"),  // -ran-
      createNote("A", 4, 400, 10300, "keyboard"), // -gue-
      createNote("G", 4, 400, 10700, "keyboard"), // -jo
      createNote("A", 4, 400, 11100, "keyboard"), // só
      createNote("B", 4, 400, 11500, "keyboard"), // é
      createNote("C", 5, 400, 11900, "keyboard"), // pei-
      createNote("B", 4, 400, 12300, "keyboard"), // -xe
      
      createNote("A", 4, 400, 13100, "keyboard"), // na
      createNote("G", 4, 400, 13500, "keyboard"), // en-
      createNote("F", 4, 400, 13900, "keyboard"), // -chen-
      createNote("E", 4, 400, 14300, "keyboard"), // -te
      createNote("F", 4, 400, 14700, "keyboard"), // da
      createNote("G", 4, 400, 15100, "keyboard"), // ma-
      createNote("A", 4, 400, 15500, "keyboard"), // -ré
      createNote("G", 4, 2500, 15900, "keyboard") // (final)
    ]
  },

  "ciranda-keyboard": {
    id: "ciranda-keyboard", name: "Ciranda, Cirandinha", bpm: 110, timeSignature: "4/4",
    totalDuration: 20000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Ciranda, cirandinha, vamos todos cirandar"
      createNote("C", 4, 400, 0, "keyboard"),     // Ci-
      createNote("D", 4, 400, 545, "keyboard"),   // -ran-
      createNote("E", 4, 400, 1090, "keyboard"),  // -da
      createNote("F", 4, 400, 1635, "keyboard"),  // ci-
      createNote("E", 4, 400, 2180, "keyboard"),  // -ran-
      createNote("D", 4, 400, 2725, "keyboard"),  // -di-
      createNote("C", 4, 800, 3270, "keyboard"),  // -nha
      
      createNote("E", 4, 400, 4620, "keyboard"),  // va-
      createNote("F", 4, 400, 5165, "keyboard"),  // -mos
      createNote("G", 4, 400, 5710, "keyboard"),  // to-
      createNote("A", 4, 400, 6255, "keyboard"),  // -dos
      createNote("G", 4, 400, 6800, "keyboard"),  // ci-
      createNote("F", 4, 400, 7345, "keyboard"),  // -ran-
      createNote("E", 4, 800, 7890, "keyboard"),  // -dar
      
      // "Vamos dar a meia volta, volta e meia vamos dar"
      createNote("G", 4, 400, 9240, "keyboard"),  // Va-
      createNote("A", 4, 400, 9785, "keyboard"),  // -mos
      createNote("G", 4, 400, 10330, "keyboard"), // dar
      createNote("F", 4, 400, 10875, "keyboard"), // a
      createNote("E", 4, 400, 11420, "keyboard"), // mei-
      createNote("D", 4, 400, 11965, "keyboard"), // -a
      createNote("C", 4, 800, 12510, "keyboard"), // vol-ta
      
      createNote("E", 4, 400, 13860, "keyboard"), // vol-
      createNote("F", 4, 400, 14405, "keyboard"), // -ta
      createNote("G", 4, 400, 14950, "keyboard"), // e
      createNote("A", 4, 400, 15495, "keyboard"), // mei-
      createNote("G", 4, 400, 16040, "keyboard"), // -a
      createNote("F", 4, 400, 16585, "keyboard"), // va-
      createNote("E", 4, 400, 17130, "keyboard"), // -mos
      createNote("D", 4, 400, 17675, "keyboard"), // dar
      createNote("C", 4, 2325, 18220, "keyboard") // (final)
    ]
  },

  "boi-cara-preta-keyboard": {
    id: "boi-cara-preta-keyboard", name: "Boi da Cara Preta", bpm: 100, timeSignature: "4/4",
    totalDuration: 15000, difficulty: "Fácil", loops: 1,
    notes: [
      // "Boi, boi, boi, boi da cara preta"
      createNote("E", 4, 400, 0, "keyboard"),     // Boi
      createNote("E", 4, 400, 600, "keyboard"),   // boi
      createNote("E", 4, 400, 1200, "keyboard"),  // boi
      createNote("G", 4, 400, 1800, "keyboard"),  // boi
      createNote("A", 4, 400, 2400, "keyboard"),  // da
      createNote("G", 4, 400, 3000, "keyboard"),  // ca-
      createNote("F", 4, 400, 3600, "keyboard"),  // -ra
      createNote("E", 4, 800, 4200, "keyboard"),  // pre-ta
      
      // "Pega essa menina que tem medo de careta"
      createNote("G", 4, 300, 5400, "keyboard"),  // Pe-
      createNote("A", 4, 300, 5700, "keyboard"),  // -ga
      createNote("G", 4, 300, 6000, "keyboard"),  // es-
      createNote("F", 4, 300, 6300, "keyboard"),  // -sa
      createNote("E", 4, 300, 6600, "keyboard"),  // me-
      createNote("F", 4, 300, 6900, "keyboard"),  // -ni-
      createNote("G", 4, 600, 7200, "keyboard"),  // -na
      
      createNote("A", 4, 300, 8100, "keyboard"),  // que
      createNote("B", 4, 300, 8400, "keyboard"),  // tem
      createNote("A", 4, 300, 8700, "keyboard"),  // me-
      createNote("G", 4, 300, 9000, "keyboard"),  // -do
      createNote("F", 4, 300, 9300, "keyboard"),  // de
      createNote("G", 4, 300, 9600, "keyboard"),  // ca-
      createNote("A", 4, 300, 9900, "keyboard"),  // -re-
      createNote("G", 4, 600, 10200, "keyboard"), // -ta
      
      // "Não, não, não, não pega não"
      createNote("C", 5, 400, 11400, "keyboard"), // Não
      createNote("B", 4, 400, 11800, "keyboard"), // não
      createNote("A", 4, 400, 12200, "keyboard"), // não
      createNote("G", 4, 400, 12600, "keyboard"), // não
      createNote("F", 4, 400, 13000, "keyboard"), // pe-
      createNote("E", 4, 400, 13400, "keyboard"), // -ga
      createNote("D", 4, 400, 13800, "keyboard"), // não
      createNote("C", 4, 1200, 14200, "keyboard") // (final)
    ]
  }
};

// Função CORRIGIDA para obter sequência musical por ID
export const getAuthenticMusicalSequence = (songId: string): MusicalSequence | null => {
  return authenticMusicalSequences[songId] || null;
};

// Função SINCRONIZADA para gerar notas do jogo com SINCRONIZAÇÃO GARANTIDA
export const generateAuthenticGameNotes = (sequence: MusicalSequence, instrumentType: string) => {
  const lanes = 7; // Sempre 7 lanes: C, D, E, F, G, A, B
  const noteToLane: Record<string, number> = {
    C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6
  };

  const gameNotes = [];
  let noteId = 0;

  // Usar as notas exatas da sequência musical COM VALIDAÇÃO
  sequence.notes.forEach((note) => {
    const lane = noteToLane[note.note];
    if (lane !== undefined) {
      // VALIDAÇÃO: verificar se a frequência da sequência = frequência da lane
      const expectedFrequency = getFrequencyByNote(instrumentType as "bell" | "xylophone" | "keyboard", note.note);
      
      if (Math.abs(note.frequency - expectedFrequency) > 0.1) {
        console.warn(`⚠️ FREQUENCY MISMATCH: ${note.note} sequence=${note.frequency}Hz, expected=${expectedFrequency}Hz`);
      }
      
      const laneConfig = TEA_MASTER_FREQUENCIES[instrumentType as keyof typeof TEA_MASTER_FREQUENCIES][lane];
      
      gameNotes.push({
        id: `authentic-note-${noteId++}`,
        lane,
        color: laneConfig.color,
        frequency: laneConfig.frequency, // USAR SEMPRE FREQUÊNCIA DA MASTER TABLE
        startTime: note.timing,
        duration: note.duration,
        y: -100
      });
      
      console.log(`✅ Game note: lane=${lane}, note=${note.note}, freq=${laneConfig.frequency}Hz, color=${laneConfig.color}`);
    }
  });

  return gameNotes.sort((a, b) => a.startTime - b.startTime);
};

// Função para obter cor baseada na nota musical
export const getColorForNote = (note: string): string => {
  const noteColors: Record<string, string> = {
    C: "#ff4444", // Vermelho
    D: "#ff8844", // Laranja  
    E: "#ffff44", // Amarelo
    F: "#44ff44", // Verde
    G: "#4444ff", // Azul
    A: "#8844ff", // Roxo
    B: "#ff44ff"  // Rosa
  };
  return noteColors[note] || "#888888";
};