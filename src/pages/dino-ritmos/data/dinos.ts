export type DinoInstrument =
  | "drums"
  | "deepDrum"
  | "xylophone"
  | "piano"
  | "flute"
  | "guitar"
  | "bass"
  | "synthWater";

export interface Dino {
  id: string;
  name: string;
  emoji: string;
  instrument: DinoInstrument;
  instrumentLabel: string;
  personality: string;
  note: string; // base musical note
  // Soft, vibrant colors (Tailwind classes)
  bg: string; // gradient bg for card
  ring: string; // ring color
  shadow: string; // glow
  textColor: string;
}

export const dinos: Dino[] = [
  {
    id: "trex",
    name: "T-Rex",
    emoji: "🦖",
    instrument: "drums",
    instrumentLabel: "Bateria",
    personality: "Forte e animado",
    note: "C3",
    bg: "from-rose-400 to-red-500",
    ring: "ring-red-300",
    shadow: "shadow-red-300/60",
    textColor: "text-red-50",
  },
  {
    id: "triceratops",
    name: "Triceratops",
    emoji: "🦕",
    instrument: "deepDrum",
    instrumentLabel: "Tambor Grave",
    personality: "Calmo e firme",
    note: "A1",
    bg: "from-blue-400 to-blue-600",
    ring: "ring-blue-300",
    shadow: "shadow-blue-300/60",
    textColor: "text-blue-50",
  },
  {
    id: "velociraptor",
    name: "Velociraptor",
    emoji: "🦎",
    instrument: "xylophone",
    instrumentLabel: "Xilofone",
    personality: "Ágil e curioso",
    note: "E5",
    bg: "from-emerald-400 to-green-600",
    ring: "ring-green-300",
    shadow: "shadow-green-300/60",
    textColor: "text-green-50",
  },
  {
    id: "braquio",
    name: "Braquiossauro",
    emoji: "🦒",
    instrument: "piano",
    instrumentLabel: "Piano Suave",
    personality: "Gentil e sonhador",
    note: "C4",
    bg: "from-amber-300 to-yellow-500",
    ring: "ring-yellow-300",
    shadow: "shadow-yellow-300/60",
    textColor: "text-yellow-900",
  },
  {
    id: "ptero",
    name: "Pterodáctilo",
    emoji: "🦅",
    instrument: "flute",
    instrumentLabel: "Flauta",
    personality: "Leve e voador",
    note: "G5",
    bg: "from-purple-400 to-violet-600",
    ring: "ring-purple-300",
    shadow: "shadow-purple-300/60",
    textColor: "text-purple-50",
  },
  {
    id: "stego",
    name: "Estegossauro",
    emoji: "🐲",
    instrument: "guitar",
    instrumentLabel: "Guitarra Infantil",
    personality: "Divertido e ritmado",
    note: "D4",
    bg: "from-orange-400 to-orange-600",
    ring: "ring-orange-300",
    shadow: "shadow-orange-300/60",
    textColor: "text-orange-50",
  },
  {
    id: "anquilo",
    name: "Anquilossauro",
    emoji: "🐢",
    instrument: "bass",
    instrumentLabel: "Baixo Musical",
    personality: "Tranquilo e profundo",
    note: "E2",
    bg: "from-slate-400 to-gray-600",
    ring: "ring-slate-300",
    shadow: "shadow-slate-300/60",
    textColor: "text-slate-50",
  },
  {
    id: "espino",
    name: "Espinossauro",
    emoji: "🐊",
    instrument: "synthWater",
    instrumentLabel: "Sintetizador Aquático",
    personality: "Misterioso e fluido",
    note: "B4",
    bg: "from-cyan-400 to-teal-500",
    ring: "ring-cyan-300",
    shadow: "shadow-cyan-300/60",
    textColor: "text-cyan-50",
  },
];

export const SYLLABLES = ["PA", "MA", "LA", "BA", "TA", "DA", "NA", "GA"] as const;
