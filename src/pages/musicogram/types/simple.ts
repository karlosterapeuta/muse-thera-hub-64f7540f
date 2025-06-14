
export interface SimpleInstrument {
  id: string;
  name: string;
  emoji: string;
  color: string;
  frequency: number;
  waveType: OscillatorType;
}

export interface GridCell {
  id: string;
  instrumentId: string | null;
  position: { row: number; col: number };
}

export interface Composition {
  id: string;
  name: string;
  grid: GridCell[][];
  tempo: number;
  createdAt: string;
}
