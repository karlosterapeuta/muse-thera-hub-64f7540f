
export interface MusicalNote {
  note: string; // C, D, E, F, G, A, B
  octave: number;
  frequency: number;
  duration: number; // em milissegundos
  timing: number; // quando a nota deve aparecer
}

export interface MusicalSequence {
  id: string;
  name: string;
  notes: MusicalNote[];
  bpm: number;
  timeSignature: string; // "4/4", "3/4", etc.
  totalDuration: number; // duração total em ms
  difficulty: "Fácil" | "Médio" | "Difícil";
  loops: number; // quantas vezes a sequência se repete
}

export interface InstrumentConfig {
  baseFrequencies: Record<string, number>;
  octaveMultiplier: number;
}
