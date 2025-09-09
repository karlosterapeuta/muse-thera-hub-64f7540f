
// FONTE ÚNICA DE FREQUÊNCIAS TEA-HERO - MASTER TABLE
// Todas as frequências do sistema devem referenciar APENAS esta tabela

export interface TEAFrequencyConfig {
  note: string;
  frequency: number;
  color: string;
  name: string;
  symbol: string;
}

// FREQUÊNCIAS MASTER UNIFICADAS - C4 a C5 para Bell/Keyboard, C5 a C6 para Xylophone
export const TEA_MASTER_FREQUENCIES = {
  bell: [
    { note: "C", frequency: 261.63, color: "#FF0000", name: "Dó", symbol: "🔔" },
    { note: "D", frequency: 293.66, color: "#FF6600", name: "Ré", symbol: "🔔" },
    { note: "E", frequency: 329.63, color: "#FFFF00", name: "Mi", symbol: "🔔" },
    { note: "F", frequency: 349.23, color: "#00CC00", name: "Fá", symbol: "🔔" },
    { note: "G", frequency: 392.00, color: "#0099FF", name: "Sol", symbol: "🔔" },
    { note: "A", frequency: 440.00, color: "#000080", name: "Lá", symbol: "🔔" },
    { note: "B", frequency: 493.88, color: "#800080", name: "Si", symbol: "🔔" },
    { note: "C2", frequency: 523.25, color: "#FF4444", name: "Dó⁸", symbol: "🔔" }
  ] as TEAFrequencyConfig[],
  
  xylophone: [
    { note: "C", frequency: 523.25, color: "#E53935", name: "Dó", symbol: "🎵" },
    { note: "D", frequency: 587.33, color: "#FF9800", name: "Ré", symbol: "🎵" },
    { note: "E", frequency: 659.25, color: "#FFEB3B", name: "Mi", symbol: "🎵" },
    { note: "F", frequency: 698.46, color: "#4CAF50", name: "Fá", symbol: "🎵" },
    { note: "G", frequency: 783.99, color: "#2196F3", name: "Sol", symbol: "🎵" },
    { note: "A", frequency: 880.00, color: "#000080", name: "Lá", symbol: "🎵" },
    { note: "B", frequency: 987.77, color: "#800080", name: "Si", symbol: "🎵" },
    { note: "C2", frequency: 1046.50, color: "#E57373", name: "Dó⁸", symbol: "🎵" }
  ] as TEAFrequencyConfig[],
  
  keyboard: [
    { note: "C", frequency: 261.63, color: "#FF0000", name: "Dó", symbol: "♩" },
    { note: "D", frequency: 293.66, color: "#FF9933", name: "Ré", symbol: "♪" },
    { note: "E", frequency: 329.63, color: "#FFFF00", name: "Mi", symbol: "♫" },
    { note: "F", frequency: 349.23, color: "#33CC33", name: "Fá", symbol: "♬" },
    { note: "G", frequency: 392.00, color: "#33CCFF", name: "Sol", symbol: "♩" },
    { note: "A", frequency: 440.00, color: "#000080", name: "Lá", symbol: "♪" },
    { note: "B", frequency: 493.88, color: "#800080", name: "Si", symbol: "♫" },
    { note: "C2", frequency: 523.25, color: "#FF4444", name: "Dó⁸", symbol: "♩" }
  ] as TEAFrequencyConfig[]
};

// MAPEAMENTO NOTA → LANE (0-7)
export const NOTE_TO_LANE_MAP: Record<string, number> = {
  C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6, C2: 7
};

// MAPEAMENTO REVERSO LANE → NOTA
export const LANE_TO_NOTE_MAP: Record<number, string> = {
  0: "C", 1: "D", 2: "E", 3: "F", 4: "G", 5: "A", 6: "B", 7: "C2"
};

// FUNÇÃO PARA OBTER CONFIGURAÇÃO DE LANE POR INSTRUMENTO
export const getLaneConfig = (instrument: "bell" | "xylophone" | "keyboard", laneIndex: number): TEAFrequencyConfig => {
  const config = TEA_MASTER_FREQUENCIES[instrument][laneIndex];
  if (!config) {
    throw new Error(`Invalid lane ${laneIndex} for instrument ${instrument}`);
  }
  return config;
};

// FUNÇÃO PARA OBTER FREQUÊNCIA POR NOTA E INSTRUMENTO
export const getFrequencyByNote = (instrument: "bell" | "xylophone" | "keyboard", note: string): number => {
  const config = TEA_MASTER_FREQUENCIES[instrument].find(c => c.note === note);
  if (!config) {
    throw new Error(`Note ${note} not found for instrument ${instrument}`);
  }
  return config.frequency;
};

// FUNÇÃO PARA VALIDAR SINCRONIZAÇÃO
export const validateSynchronization = (instrument: "bell" | "xylophone" | "keyboard"): boolean => {
  const lanes = TEA_MASTER_FREQUENCIES[instrument];
  
  // Verificar se todas as 8 notas estão presentes
  const expectedNotes = ["C", "D", "E", "F", "G", "A", "B", "C2"];
  const actualNotes = lanes.map(l => l.note);
  
  const allNotesPresent = expectedNotes.every(note => actualNotes.includes(note));
  const correctOrder = actualNotes.join("") === expectedNotes.join("");
  
  console.log(`🔍 TEA Validation ${instrument}:`, {
    allNotesPresent,
    correctOrder,
    lanes: lanes.length,
    frequencies: lanes.map(l => `${l.note}:${l.frequency}Hz`)
  });
  
  return allNotesPresent && correctOrder && lanes.length === 8;
};
