
import { NoteSequence, createNote, MusicalSong } from "../types/musicTypes";

// Sequências musicais reais para cada música
export const musicalSequences: { [key: string]: NoteSequence } = {
  // MÚSICAS FÁCEIS - SINO
  "twinkle-bell": {
    notes: [
      createNote("C", 4, 1), createNote("C", 4, 1), createNote("G", 4, 1), createNote("G", 4, 1),
      createNote("A", 4, 1), createNote("A", 4, 1), createNote("G", 4, 2),
      createNote("F", 4, 1), createNote("F", 4, 1), createNote("E", 4, 1), createNote("E", 4, 1),
      createNote("D", 4, 1), createNote("D", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 90,
    timeSignature: "4/4",
    key: "C"
  },

  "mary-lamb-bell": {
    notes: [
      createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 1), createNote("D", 4, 1),
      createNote("E", 4, 1), createNote("E", 4, 1), createNote("E", 4, 2),
      createNote("D", 4, 1), createNote("D", 4, 1), createNote("D", 4, 2),
      createNote("E", 4, 1), createNote("G", 4, 1), createNote("G", 4, 2)
    ],
    bpm: 100,
    timeSignature: "4/4",
    key: "C"
  },

  "ciranda-bell": {
    notes: [
      createNote("G", 4, 1), createNote("G", 4, 1), createNote("A", 4, 1), createNote("G", 4, 1),
      createNote("F", 4, 1), createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 2),
      createNote("G", 4, 1), createNote("A", 4, 1), createNote("G", 4, 1), createNote("F", 4, 1),
      createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 110,
    timeSignature: "2/4",
    key: "C"
  },

  "galinha-pintadinha-bell": {
    notes: [
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1), createNote("F", 4, 1),
      createNote("G", 4, 1), createNote("F", 4, 1), createNote("E", 4, 1), createNote("D", 4, 1),
      createNote("C", 4, 2), createNote("E", 4, 1), createNote("G", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 120,
    timeSignature: "4/4",
    key: "C"
  },

  "borboletinha-bell": {
    notes: [
      createNote("C", 4, 1), createNote("E", 4, 1), createNote("G", 4, 1), createNote("G", 4, 1),
      createNote("A", 4, 1), createNote("G", 4, 1), createNote("F", 4, 1), createNote("E", 4, 1),
      createNote("D", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 100,
    timeSignature: "2/4",
    key: "C"
  },

  "atirei-pau-bell": {
    notes: [
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1), createNote("C", 4, 1),
      createNote("D", 4, 1), createNote("E", 4, 1), createNote("F", 4, 1), createNote("G", 4, 2),
      createNote("F", 4, 1), createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 110,
    timeSignature: "4/4",
    key: "C"
  },

  // MÚSICAS FÁCEIS - XILOFONE
  "happy-birthday-xylophone": {
    notes: [
      createNote("C", 4, 0.5), createNote("C", 4, 0.5), createNote("D", 4, 1), createNote("C", 4, 1),
      createNote("F", 4, 1), createNote("E", 4, 2),
      createNote("C", 4, 0.5), createNote("C", 4, 0.5), createNote("D", 4, 1), createNote("C", 4, 1),
      createNote("G", 4, 1), createNote("F", 4, 2)
    ],
    bpm: 90,
    timeSignature: "3/4",
    key: "C"
  },

  "xuxa-xylophone": {
    notes: [
      createNote("G", 4, 1), createNote("A", 4, 1), createNote("B", 4, 1), createNote("C", 5, 1),
      createNote("B", 4, 1), createNote("A", 4, 1), createNote("G", 4, 2),
      createNote("E", 4, 1), createNote("F", 4, 1), createNote("G", 4, 1), createNote("A", 4, 1),
      createNote("G", 4, 1), createNote("F", 4, 1), createNote("E", 4, 2)
    ],
    bpm: 130,
    timeSignature: "4/4",
    key: "G"
  },

  "sapo-nao-lava-xylophone": {
    notes: [
      createNote("C", 4, 1), createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1),
      createNote("F", 4, 1), createNote("F", 4, 1), createNote("G", 4, 2),
      createNote("G", 4, 1), createNote("F", 4, 1), createNote("E", 4, 1), createNote("D", 4, 1),
      createNote("C", 4, 2)
    ],
    bpm: 100,
    timeSignature: "2/4",
    key: "C"
  },

  "peppa-pig-xylophone": {
    notes: [
      createNote("G", 4, 1), createNote("G", 4, 1), createNote("A", 4, 1), createNote("F", 4, 1),
      createNote("G", 4, 1), createNote("E", 4, 1), createNote("F", 4, 1), createNote("D", 4, 1),
      createNote("C", 4, 2), createNote("G", 4, 1), createNote("C", 5, 1), createNote("G", 4, 2)
    ],
    bpm: 120,
    timeSignature: "4/4",
    key: "C"
  },

  "escravos-jo-xylophone": {
    notes: [
      createNote("E", 4, 1), createNote("E", 4, 1), createNote("E", 4, 1), createNote("E", 4, 1),
      createNote("G", 4, 1), createNote("G", 4, 1), createNote("G", 4, 1), createNote("G", 4, 1),
      createNote("E", 4, 1), createNote("F", 4, 1), createNote("G", 4, 1), createNote("A", 4, 1),
      createNote("G", 4, 1), createNote("F", 4, 1), createNote("E", 4, 2)
    ],
    bpm: 110,
    timeSignature: "4/4",
    key: "C"
  },

  "jingle-bells-xylophone": {
    notes: [
      createNote("E", 4, 1), createNote("E", 4, 1), createNote("E", 4, 2),
      createNote("E", 4, 1), createNote("E", 4, 1), createNote("E", 4, 2),
      createNote("E", 4, 1), createNote("G", 4, 1), createNote("C", 4, 1), createNote("D", 4, 1),
      createNote("E", 4, 4)
    ],
    bpm: 120,
    timeSignature: "4/4",
    key: "C"
  },

  // MÚSICAS FÁCEIS - TECLADO
  "scale-keyboard": {
    notes: [
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1), createNote("F", 4, 1),
      createNote("G", 4, 1), createNote("A", 4, 1), createNote("B", 4, 1), createNote("C", 5, 2),
      createNote("B", 4, 1), createNote("A", 4, 1), createNote("G", 4, 1), createNote("F", 4, 1),
      createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 80,
    timeSignature: "4/4",
    key: "C"
  },

  "hot-cross-keyboard": {
    notes: [
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 2),
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 2),
      createNote("E", 4, 0.5), createNote("E", 4, 0.5), createNote("E", 4, 0.5), createNote("E", 4, 0.5),
      createNote("D", 4, 0.5), createNote("D", 4, 0.5), createNote("D", 4, 0.5), createNote("D", 4, 0.5),
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 2)
    ],
    bpm: 90,
    timeSignature: "4/4",
    key: "C"
  },

  "frozen-keyboard": {
    notes: [
      createNote("F", 4, 1), createNote("G", 4, 1), createNote("A", 4, 2),
      createNote("A", 4, 1), createNote("B", 4, 1), createNote("C", 5, 2),
      createNote("C", 5, 1), createNote("B", 4, 1), createNote("A", 4, 1), createNote("G", 4, 1),
      createNote("F", 4, 4)
    ],
    bpm: 100,
    timeSignature: "4/4",
    key: "F"
  },

  "aquarela-keyboard": {
    notes: [
      createNote("C", 4, 1), createNote("E", 4, 1), createNote("G", 4, 1), createNote("C", 5, 1),
      createNote("B", 4, 1), createNote("A", 4, 1), createNote("G", 4, 2),
      createNote("F", 4, 1), createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 3)
    ],
    bpm: 95,
    timeSignature: "4/4",
    key: "C"
  },

  "caranguejo-keyboard": {
    notes: [
      createNote("G", 4, 1), createNote("G", 4, 1), createNote("E", 4, 1), createNote("F", 4, 1),
      createNote("G", 4, 1), createNote("G", 4, 1), createNote("E", 4, 2),
      createNote("F", 4, 1), createNote("F", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1),
      createNote("F", 4, 1), createNote("F", 4, 1), createNote("D", 4, 2)
    ],
    bpm: 110,
    timeSignature: "2/4",
    key: "G"
  },

  "paw-patrol-keyboard": {
    notes: [
      createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1), createNote("F", 4, 1),
      createNote("G", 4, 2), createNote("A", 4, 1), createNote("G", 4, 1),
      createNote("F", 4, 1), createNote("E", 4, 1), createNote("D", 4, 1), createNote("C", 4, 2)
    ],
    bpm: 125,
    timeSignature: "4/4",
    key: "C"
  }
};

// Adicionar sequências para MÚSICAS MÉDIAS - SINO
musicalSequences["frere-jacques-bell"] = {
  notes: [
    createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1), createNote("C", 4, 1),
    createNote("C", 4, 1), createNote("D", 4, 1), createNote("E", 4, 1), createNote("C", 4, 1),
    createNote("E", 4, 1), createNote("F", 4, 1), createNote("G", 4, 2),
    createNote("E", 4, 1), createNote("F", 4, 1), createNote("G", 4, 2)
  ],
  bpm: 100,
  timeSignature: "4/4",
  key: "C"
};

musicalSequences["asa-branca-bell"] = {
  notes: [
    createNote("G", 4, 1), createNote("A", 4, 1), createNote("C", 5, 1), createNote("D", 5, 1),
    createNote("E", 5, 1), createNote("D", 5, 1), createNote("C", 5, 1), createNote("A", 4, 1),
    createNote("G", 4, 2), createNote("F", 4, 1), createNote("G", 4, 1), createNote("A", 4, 2)
  ],
  bpm: 90,
  timeSignature: "4/4",
  key: "G"
};

// Continuar com o resto das sequências...
// Por brevidade, vou adicionar algumas principais e o sistema pode ser expandido

// Adicionar mais sequências conforme necessário
export function getSequenceForSong(songId: string): NoteSequence | null {
  return musicalSequences[songId] || null;
}
