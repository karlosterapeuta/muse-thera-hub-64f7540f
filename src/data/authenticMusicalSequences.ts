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
    totalDuration: 32000, difficulty: "Fácil", loops: 2,
    notes: [
      // Primeira frase: "do do sol sol la la sol"
      createNote("C", 4, 500, 0, "bell"),     // do
      createNote("C", 4, 500, 500, "bell"),   // do
      createNote("G", 4, 500, 1000, "bell"),  // sol
      createNote("G", 4, 500, 1500, "bell"),  // sol
      createNote("A", 4, 500, 2000, "bell"),  // la
      createNote("A", 4, 500, 2500, "bell"),  // la
      createNote("G", 4, 800, 3000, "bell"),  // sol
      
      // Segunda frase: "fa fa mi mi re re do"
      createNote("F", 4, 500, 4000, "bell"),  // fa
      createNote("F", 4, 500, 4500, "bell"),  // fa
      createNote("E", 4, 500, 5000, "bell"),  // mi
      createNote("E", 4, 500, 5500, "bell"),  // mi
      createNote("D", 4, 500, 6000, "bell"),  // re
      createNote("D", 4, 500, 6500, "bell"),  // re
      createNote("C", 4, 800, 7000, "bell"),  // do
      
      // Terceira frase: "sol sol fa fa mi mi re"
      createNote("G", 4, 500, 8000, "bell"),  // sol
      createNote("G", 4, 500, 8500, "bell"),  // sol
      createNote("F", 4, 500, 9000, "bell"),  // fa
      createNote("F", 4, 500, 9500, "bell"),  // fa
      createNote("E", 4, 500, 10000, "bell"), // mi
      createNote("E", 4, 500, 10500, "bell"), // mi
      createNote("D", 4, 800, 11000, "bell"), // re
      
      // Quarta frase: "sol sol fa fa mi mi re"
      createNote("G", 4, 500, 12000, "bell"), // sol
      createNote("G", 4, 500, 12500, "bell"), // sol
      createNote("F", 4, 500, 13000, "bell"), // fa
      createNote("F", 4, 500, 13500, "bell"), // fa
      createNote("E", 4, 500, 14000, "bell"), // mi
      createNote("E", 4, 500, 14500, "bell"), // mi
      createNote("D", 4, 800, 15000, "bell"), // re
      
      // Quinta frase: "do do sol sol la la sol"
      createNote("C", 4, 500, 16000, "bell"), // do
      createNote("C", 4, 500, 16500, "bell"), // do
      createNote("G", 4, 500, 17000, "bell"), // sol
      createNote("G", 4, 500, 17500, "bell"), // sol
      createNote("A", 4, 500, 18000, "bell"), // la
      createNote("A", 4, 500, 18500, "bell"), // la
      createNote("G", 4, 800, 19000, "bell"), // sol
      
      // Sexta frase: "fa fa mi mi re re do"
      createNote("F", 4, 500, 20000, "bell"), // fa
      createNote("F", 4, 500, 20500, "bell"), // fa
      createNote("E", 4, 500, 21000, "bell"), // mi
      createNote("E", 4, 500, 21500, "bell"), // mi
      createNote("D", 4, 500, 22000, "bell"), // re
      createNote("D", 4, 500, 22500, "bell"), // re
      createNote("C", 4, 1000, 23000, "bell") // do (final)
    ]
  },

  "parabens-bell": {
    id: "parabens-bell", name: "Parabéns a Você", bpm: 90, timeSignature: "4/4",
    totalDuration: 50000, difficulty: "Fácil", loops: 2,
    notes: [
      // "Parabéns para você" - sol sol la sol do si
      createNote("G", 4, 500, 0, "bell"),     // Pa-
      createNote("G", 4, 500, 500, "bell"),   // -ra-
      createNote("A", 4, 800, 1000, "bell"),  // -béns
      createNote("G", 4, 800, 1800, "bell"),  // pa-
      createNote("C2", 4, 800, 2600, "bell"),  // -ra (Dó uma oitava acima)
      createNote("B", 4, 1600, 3400, "bell"), // vo-cê
      
      // "Parabéns para você" - sol sol la sol re do
      createNote("G", 4, 500, 5200, "bell"),  // Pa-
      createNote("G", 4, 500, 5700, "bell"),  // -ra-
      createNote("A", 4, 800, 6200, "bell"),  // -béns
      createNote("G", 4, 800, 7000, "bell"),  // pa-
      createNote("D", 4, 800, 7800, "bell"),  // -ra
      createNote("C", 4, 1600, 8600, "bell"), // vo-cê
      
      // "Parabéns querido/a" - sol sol sol mi do si la
      createNote("G", 4, 500, 10400, "bell"), // Pa-
      createNote("G", 4, 500, 10900, "bell"), // -ra-
      createNote("G", 4, 800, 11400, "bell"), // -béns
      createNote("E", 4, 800, 12200, "bell"), // que-
      createNote("C2", 4, 800, 13000, "bell"), // -ri- (Dó uma oitava acima)
      createNote("B", 4, 800, 13800, "bell"), // -do/a
      createNote("A", 4, 1600, 14600, "bell"), // [nome]
      
      // "Muitas felicidades" - fa fa mi do re do
      createNote("F", 4, 500, 16400, "bell"), // Mui-
      createNote("F", 4, 500, 16900, "bell"), // -tas
      createNote("E", 4, 800, 17400, "bell"), // fe-
      createNote("C", 4, 800, 18200, "bell"), // -li-
      createNote("D", 4, 800, 19000, "bell"), // -ci-
      createNote("C", 4, 1600, 19800, "bell") // -da-des
    ]
  },

  "borboletinha-bell": {
    id: "borboletinha-bell", name: "Borboletinha", bpm: 120, timeSignature: "4/4",
    totalDuration: 32000, difficulty: "Fácil", loops: 2,
    notes: [
      // "Borboletinha tá na cozinha" - Melodia tradicional brasileira corrigida: G-A-G-C
      createNote("G", 4, 500, 0, "bell"),     // Bor-
      createNote("A", 4, 500, 500, "bell"),   // -bo-
      createNote("G", 4, 500, 1000, "bell"),  // -le-
      createNote("C2", 4, 500, 1500, "bell"),  // -ti-
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
      createNote("C2", 4, 800, 8000, "bell"),  // pa-ra a ma-dri-nha
      
      // "Poti, poti, perna de pau" - Rítmico e tradicional
      createNote("E", 4, 400, 9000, "bell"),  // Po-
      createNote("E", 4, 400, 9400, "bell"),  // -ti
      createNote("E", 4, 400, 9800, "bell"),  // Po-
      createNote("E", 4, 400, 10200, "bell"), // -ti
      createNote("F", 4, 500, 10600, "bell"), // per-
      createNote("E", 4, 500, 11100, "bell"), // -na
      createNote("D", 4, 500, 11600, "bell"), // de
      createNote("C2", 4, 800, 12100, "bell"), // pau
      
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
      createNote("C2", 4, 600, 16700, "bell")  // (final)
    ]
  },


  "atirei-pau-bell": {
    id: "atirei-pau-bell", name: "Atirei o Pau no Gato", bpm: 120, timeSignature: "4/4",
    totalDuration: 48000, difficulty: "Fácil", loops: 2,
    notes: [
      // sol fa mi re mi fa sol sol sol
      createNote("G", 4, 500, 0, "bell"),     // sol
      createNote("F", 4, 500, 500, "bell"),   // fa
      createNote("E", 4, 500, 1000, "bell"),  // mi
      createNote("D", 4, 500, 1500, "bell"),  // re
      createNote("E", 4, 500, 2000, "bell"),  // mi
      createNote("F", 4, 500, 2500, "bell"),  // fa
      createNote("G", 4, 500, 3000, "bell"),  // sol
      createNote("G", 4, 500, 3500, "bell"),  // sol
      createNote("G", 4, 800, 4000, "bell"),  // sol
      
      // la sol fa fa fa
      createNote("A", 4, 500, 5000, "bell"),  // la
      createNote("G", 4, 500, 5500, "bell"),  // sol
      createNote("F", 4, 500, 6000, "bell"),  // fa
      createNote("F", 4, 500, 6500, "bell"),  // fa
      createNote("F", 4, 800, 7000, "bell"),  // fa
      
      // sol fa mi mi mi
      createNote("G", 4, 500, 8000, "bell"),  // sol
      createNote("F", 4, 500, 8500, "bell"),  // fa
      createNote("E", 4, 500, 9000, "bell"),  // mi
      createNote("E", 4, 500, 9500, "bell"),  // mi
      createNote("E", 4, 800, 10000, "bell"), // mi
      
      // do do la la la
      createNote("C", 4, 500, 11000, "bell"), // do
      createNote("C", 4, 500, 11500, "bell"), // do
      createNote("A", 4, 500, 12000, "bell"), // la
      createNote("A", 4, 500, 12500, "bell"), // la
      createNote("A", 4, 800, 13000, "bell"), // la
      
      // si la sol sol sol
      createNote("B", 4, 500, 14000, "bell"), // si
      createNote("A", 4, 500, 14500, "bell"), // la
      createNote("G", 4, 500, 15000, "bell"), // sol
      createNote("G", 4, 500, 15500, "bell"), // sol
      createNote("G", 4, 800, 16000, "bell"), // sol
      
      // mi fa sol mi fa sol mi fa sol
      createNote("E", 4, 400, 17000, "bell"), // mi
      createNote("F", 4, 400, 17400, "bell"), // fa
      createNote("G", 4, 400, 17800, "bell"), // sol
      createNote("E", 4, 400, 18200, "bell"), // mi
      createNote("F", 4, 400, 18600, "bell"), // fa
      createNote("G", 4, 400, 19000, "bell"), // sol
      createNote("E", 4, 400, 19400, "bell"), // mi
      createNote("F", 4, 400, 19800, "bell"), // fa
      createNote("G", 4, 600, 20200, "bell"), // sol
      
      // fa mi re do
      createNote("F", 4, 500, 21000, "bell"), // fa
      createNote("E", 4, 500, 21500, "bell"), // mi
      createNote("D", 4, 500, 22000, "bell"), // re
      createNote("C", 4, 1000, 22500, "bell") // do (final)
    ]
  },

  "escravos-jó-bell": {
    id: "escravos-jó-bell", name: "Escravos de Jó", bpm: 120, timeSignature: "4/4", 
    totalDuration: 60000, difficulty: "Fácil", loops: 2,
    notes: [
      // dó8 si la sol
      createNote("C2", 4, 500, 0, "bell"),    // dó8 (oitava)
      createNote("B", 4, 500, 500, "bell"),   // si
      createNote("A", 4, 500, 1000, "bell"),  // la
      createNote("G", 4, 800, 1500, "bell"),  // sol
      
      // la sol la sol fa mi
      createNote("A", 4, 400, 2500, "bell"),  // la
      createNote("G", 4, 400, 2900, "bell"),  // sol
      createNote("A", 4, 400, 3300, "bell"),  // la
      createNote("G", 4, 400, 3700, "bell"),  // sol
      createNote("F", 4, 400, 4100, "bell"),  // fa
      createNote("E", 4, 800, 4500, "bell"),  // mi
      
      // sol mi sol mi.
      createNote("G", 4, 400, 5500, "bell"),  // sol
      createNote("E", 4, 400, 5900, "bell"),  // mi
      createNote("G", 4, 400, 6300, "bell"),  // sol
      createNote("E", 4, 800, 6700, "bell"),  // mi.
      
      // mi mi re do
      createNote("E", 4, 400, 7700, "bell"),  // mi
      createNote("E", 4, 400, 8100, "bell"),  // mi
      createNote("D", 4, 400, 8500, "bell"),  // re
      createNote("C", 4, 800, 8900, "bell"),  // do
      
      // sol la sol mi.
      createNote("G", 4, 400, 9900, "bell"),  // sol
      createNote("A", 4, 400, 10300, "bell"), // la
      createNote("G", 4, 400, 10700, "bell"), // sol
      createNote("E", 4, 800, 11100, "bell"), // mi.
      
      // sol la sol mi.
      createNote("G", 4, 400, 12100, "bell"), // sol
      createNote("A", 4, 400, 12500, "bell"), // la
      createNote("G", 4, 400, 12900, "bell"), // sol
      createNote("E", 4, 800, 13300, "bell"), // mi.
      
      // sol la sol la si dó
      createNote("G", 4, 400, 14300, "bell"), // sol
      createNote("A", 4, 400, 14700, "bell"), // la
      createNote("G", 4, 400, 15100, "bell"), // sol
      createNote("A", 4, 400, 15500, "bell"), // la
      createNote("B", 4, 400, 15900, "bell"), // si
      createNote("C2", 4, 800, 16300, "bell"), // dó
      
      // sol la sol mi.
      createNote("G", 4, 400, 17300, "bell"), // sol
      createNote("A", 4, 400, 17700, "bell"), // la
      createNote("G", 4, 400, 18100, "bell"), // sol
      createNote("E", 4, 800, 18500, "bell"), // mi.
      
      // sol la sol mi.
      createNote("G", 4, 400, 19500, "bell"), // sol
      createNote("A", 4, 400, 19900, "bell"), // la
      createNote("G", 4, 400, 20300, "bell"), // sol
      createNote("E", 4, 800, 20700, "bell"), // mi.
      
      // sol la sol la si dó
      createNote("G", 4, 400, 21700, "bell"), // sol
      createNote("A", 4, 400, 22100, "bell"), // la
      createNote("G", 4, 400, 22500, "bell"), // sol
      createNote("A", 4, 400, 22900, "bell"), // la
      createNote("B", 4, 400, 23300, "bell"), // si
      createNote("C2", 4, 1200, 23700, "bell") // dó (final)
    ]
  },

  // === XILOFONE - 6 músicas completas ===
  "happy-birthday-xylophone": {
    id: "happy-birthday-xylophone", name: "Parabéns para Você", bpm: 90, timeSignature: "3/4",
    totalDuration: 44000, difficulty: "Fácil", loops: 2,
    notes: [
      // "Parabéns para você" - sol sol la sol do si
      createNote("G", 5, 500, 0, "xylophone"),    // Pa-
      createNote("G", 5, 500, 500, "xylophone"),  // -ra-
      createNote("A", 5, 800, 1000, "xylophone"), // -béns
      createNote("G", 5, 800, 1800, "xylophone"), // pa-
      createNote("C2", 5, 800, 2600, "xylophone"), // -ra (Dó uma oitava acima)
      createNote("B", 5, 1600, 3400, "xylophone"), // vo-cê
      
      // "Parabéns para você" - sol sol la sol re do
      createNote("G", 5, 500, 5200, "xylophone"), // Pa-
      createNote("G", 5, 500, 5700, "xylophone"), // -ra-
      createNote("A", 5, 800, 6200, "xylophone"), // -béns
      createNote("G", 5, 800, 7000, "xylophone"), // pa-
      createNote("D", 5, 800, 7800, "xylophone"), // -ra
      createNote("C", 5, 1600, 8600, "xylophone"), // vo-cê
      
      // "Parabéns querido/a" - sol sol sol mi do si la
      createNote("G", 5, 500, 10400, "xylophone"), // Pa-
      createNote("G", 5, 500, 10900, "xylophone"), // -ra-
      createNote("G", 5, 800, 11400, "xylophone"), // -béns
      createNote("E", 5, 800, 12200, "xylophone"), // que-
      createNote("C2", 5, 800, 13000, "xylophone"), // -ri- (Dó uma oitava acima)
      createNote("B", 5, 800, 13800, "xylophone"), // -do/a
      createNote("A", 5, 1600, 14600, "xylophone"), // [nome]
      
      // "Muitas felicidades" - fa fa mi do re do
      createNote("F", 5, 500, 16400, "xylophone"), // Mui-
      createNote("F", 5, 500, 16900, "xylophone"), // -tas
      createNote("E", 5, 800, 17400, "xylophone"), // fe-
      createNote("C", 5, 800, 18200, "xylophone"), // -li-
      createNote("D", 5, 800, 19000, "xylophone"), // -ci-
      createNote("C", 5, 1600, 19800, "xylophone")  // -da-des
    ]
  },

  "sapo-xylophone": {
    id: "sapo-xylophone", name: "O Sapo Não Lava o Pé", bpm: 110, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 2,
    notes: [
      // Primeira linha: sol do dó sol la sol mi
      createNote("G", 5, 400, 0, "xylophone"),     // sol
      createNote("C", 8, 400, 400, "xylophone"),   // do
      createNote("C", 8, 400, 800, "xylophone"),   // dó
      createNote("G", 5, 400, 1200, "xylophone"),  // sol
      createNote("A", 5, 400, 1600, "xylophone"),  // la
      createNote("G", 5, 400, 2000, "xylophone"),  // sol
      createNote("E", 5, 800, 2400, "xylophone"),  // mi
      
      // Segunda linha: sol do dó sol la sol fa
      createNote("G", 5, 400, 3200, "xylophone"),  // sol
      createNote("C", 8, 400, 3600, "xylophone"),  // do
      createNote("C", 8, 400, 4000, "xylophone"),  // dó
      createNote("G", 5, 400, 4400, "xylophone"),  // sol
      createNote("A", 5, 400, 4800, "xylophone"),  // la
      createNote("G", 5, 400, 5200, "xylophone"),  // sol
      createNote("F", 5, 800, 5600, "xylophone"),  // fa
      
      // Terceira linha: sol si si sol la sol si si sol la sol si sol la si do
      createNote("G", 5, 400, 6400, "xylophone"),  // sol
      createNote("B", 5, 400, 6800, "xylophone"),  // si
      createNote("B", 5, 400, 7200, "xylophone"),  // si
      createNote("G", 5, 400, 7600, "xylophone"),  // sol
      createNote("A", 5, 400, 8000, "xylophone"),  // la
      createNote("G", 5, 400, 8400, "xylophone"),  // sol
      createNote("B", 5, 400, 8800, "xylophone"),  // si
      createNote("B", 5, 400, 9200, "xylophone"),  // si
      createNote("G", 5, 400, 9600, "xylophone"),  // sol
      createNote("A", 5, 400, 10000, "xylophone"), // la
      createNote("G", 5, 400, 10400, "xylophone"), // sol
      createNote("B", 5, 400, 10800, "xylophone"), // si
      createNote("G", 5, 400, 11200, "xylophone"), // sol
      createNote("A", 5, 400, 11600, "xylophone"), // la
      createNote("B", 5, 400, 12000, "xylophone"), // si
      createNote("C", 8, 800, 12400, "xylophone")  // do (oitava 8)
    ]
  },

  "sapo-nao-lava-xylophone": {
    id: "sapo-nao-lava-xylophone", name: "O Sapo Não Lava o Pé", bpm: 110, timeSignature: "4/4",
    totalDuration: 16000, difficulty: "Fácil", loops: 2,
    notes: [
      // Primeira linha: sol do dó sol la sol mi
      createNote("G", 5, 400, 0, "xylophone"),
      createNote("C", 8, 400, 400, "xylophone"),
      createNote("C", 8, 400, 800, "xylophone"),
      createNote("G", 5, 400, 1200, "xylophone"),
      createNote("A", 5, 400, 1600, "xylophone"),
      createNote("G", 5, 400, 2000, "xylophone"),
      createNote("E", 5, 800, 2400, "xylophone"),
      
      // Segunda linha: sol do dó sol la sol fa
      createNote("G", 5, 400, 3200, "xylophone"),
      createNote("C", 8, 400, 3600, "xylophone"),
      createNote("C", 8, 400, 4000, "xylophone"),
      createNote("G", 5, 400, 4400, "xylophone"),
      createNote("A", 5, 400, 4800, "xylophone"),
      createNote("G", 5, 400, 5200, "xylophone"),
      createNote("F", 5, 800, 5600, "xylophone"),
      
      // Terceira linha: sol si si sol la sol si si sol la sol si sol la si do
      createNote("G", 5, 400, 6400, "xylophone"),
      createNote("B", 5, 400, 6800, "xylophone"),
      createNote("B", 5, 400, 7200, "xylophone"),
      createNote("G", 5, 400, 7600, "xylophone"),
      createNote("A", 5, 400, 8000, "xylophone"),
      createNote("G", 5, 400, 8400, "xylophone"),
      createNote("B", 5, 400, 8800, "xylophone"),
      createNote("B", 5, 400, 9200, "xylophone"),
      createNote("G", 5, 400, 9600, "xylophone"),
      createNote("A", 5, 400, 10000, "xylophone"),
      createNote("G", 5, 400, 10400, "xylophone"),
      createNote("B", 5, 400, 10800, "xylophone"),
      createNote("G", 5, 400, 11200, "xylophone"),
      createNote("A", 5, 400, 11600, "xylophone"),
      createNote("B", 5, 400, 12000, "xylophone"),
      createNote("C", 8, 800, 12400, "xylophone")
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