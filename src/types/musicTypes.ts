
export interface Note {
  note: string; // C, D, E, F, G, A, B
  octave: number; // 4, 5, 6 etc
  duration: number; // duração em batidas (0.5 = colcheia, 1 = semínima, 2 = mínima)
  frequency: number; // frequência em Hz
}

export interface NoteSequence {
  notes: Note[];
  bpm: number; // batidas por minuto
  timeSignature: string; // "4/4", "3/4", etc
  key: string; // "C", "G", "F", etc
}

export interface MusicalSong {
  id: string;
  title: string;
  artist: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  instrument: "bell" | "xylophone" | "keyboard";
  color: string;
  category: "infantil" | "clássico" | "brasileiro" | "terapêutico" | "desenhos";
  therapeuticBenefits: string;
  noteSequence: NoteSequence;
}

// Tabela de frequências baseada em A440
export const noteFrequencies: { [key: string]: number } = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00, 'B6': 1975.53
};

export function createNote(note: string, octave: number, duration: number): Note {
  const noteKey = `${note}${octave}`;
  return {
    note,
    octave,
    duration,
    frequency: noteFrequencies[noteKey] || 440
  };
}
