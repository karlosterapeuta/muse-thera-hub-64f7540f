export type Section = "cordas" | "madeiras" | "metais" | "percussao";

export interface AnimalMusician {
  id: string;
  name: string;
  animalEmoji: string;
  instrument: string;
  instrumentEmoji: string;
  section: Section;
  color: string;
  frequency: number; // base note Hz
  fact: string;
}

export const sectionLabels: Record<Section | "tutti", string> = {
  tutti: "Tutti",
  cordas: "Cordas",
  madeiras: "Madeiras",
  metais: "Metais",
  percussao: "Percussão",
};

export const sectionColors: Record<Section, string> = {
  cordas: "#f59e0b",
  madeiras: "#10b981",
  metais: "#eab308",
  percussao: "#ef4444",
};

// C major chord notes spread across octaves for tutti
export const orchestraAnimals: AnimalMusician[] = [
  {
    id: "lion-tuba",
    name: "Leão",
    animalEmoji: "🦁",
    instrument: "Tuba",
    instrumentEmoji: "🎺",
    section: "metais",
    color: "#eab308",
    frequency: 87.31, // F2
    fact: "A tuba é o instrumento mais grave da orquestra!",
  },
  {
    id: "elephant-trumpet",
    name: "Elefante",
    animalEmoji: "🐘",
    instrument: "Trompete",
    instrumentEmoji: "🎺",
    section: "metais",
    color: "#f59e0b",
    frequency: 523.25, // C5
    fact: "O trompete tem um som brilhante e forte!",
  },
  {
    id: "giraffe-trombone",
    name: "Girafa",
    animalEmoji: "🦒",
    instrument: "Trombone",
    instrumentEmoji: "🎷",
    section: "metais",
    color: "#ca8a04",
    frequency: 174.61, // F3
    fact: "O trombone tem uma vara que desliza para mudar o som!",
  },
  {
    id: "rabbit-flute",
    name: "Coelho",
    animalEmoji: "🐰",
    instrument: "Flauta",
    instrumentEmoji: "🪈",
    section: "madeiras",
    color: "#34d399",
    frequency: 783.99, // G5
    fact: "A flauta canta agudinho como um passarinho!",
  },
  {
    id: "owl-clarinet",
    name: "Coruja",
    animalEmoji: "🦉",
    instrument: "Clarinete",
    instrumentEmoji: "🎶",
    section: "madeiras",
    color: "#10b981",
    frequency: 293.66, // D4
    fact: "O clarinete tem um som doce e misterioso!",
  },
  {
    id: "cat-violin",
    name: "Gato",
    animalEmoji: "🐱",
    instrument: "Violino",
    instrumentEmoji: "🎻",
    section: "cordas",
    color: "#fb923c",
    frequency: 659.25, // E5
    fact: "O violino é o menor da família das cordas!",
  },
  {
    id: "bear-cello",
    name: "Urso",
    animalEmoji: "🐻",
    instrument: "Violoncelo",
    instrumentEmoji: "🎻",
    section: "cordas",
    color: "#d97706",
    frequency: 196.0, // G3
    fact: "O violoncelo tem um som quente e profundo!",
  },
  {
    id: "frog-bass",
    name: "Sapo",
    animalEmoji: "🐸",
    instrument: "Contrabaixo",
    instrumentEmoji: "🎻",
    section: "cordas",
    color: "#65a30d",
    frequency: 98.0, // G2
    fact: "O contrabaixo é o maior e mais grave das cordas!",
  },
  {
    id: "dog-drums",
    name: "Cachorro",
    animalEmoji: "🐶",
    instrument: "Bateria",
    instrumentEmoji: "🥁",
    section: "percussao",
    color: "#ef4444",
    frequency: 80,
    fact: "A bateria marca o ritmo de toda a orquestra!",
  },
  {
    id: "monkey-xylophone",
    name: "Macaco",
    animalEmoji: "🐵",
    instrument: "Xilofone",
    instrumentEmoji: "🎹",
    section: "percussao",
    color: "#f43f5e",
    frequency: 1046.5, // C6
    fact: "O xilofone tem um som cristalino como sininhos!",
  },
];
