export type Section = "cordas" | "madeiras" | "metais" | "percussao";

export interface AnimalMusician {
  id: string;
  name: string;
  animalEmoji: string;
  instrument: string;
  instrumentEmoji: string;
  section: Section;
  color: string;
  frequency: number; // base note Hz (fallback synth)
  fact: string;
  /** Real animal sound (Wikimedia Commons, CC-licensed). */
  soundUrl?: string;
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
    frequency: 87.31,
    fact: "A tuba é o instrumento mais grave da orquestra!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Lion_raring-sound1TamilNadu178.ogg",
  },
  {
    id: "elephant-trumpet",
    name: "Elefante",
    animalEmoji: "🐘",
    instrument: "Trompete",
    instrumentEmoji: "🎺",
    section: "metais",
    color: "#f59e0b",
    frequency: 523.25,
    fact: "O trompete tem um som brilhante e forte!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Elephant_voice_-_trumpeting.ogg",
  },
  {
    id: "giraffe-trombone",
    name: "Girafa",
    animalEmoji: "🦒",
    instrument: "Trombone",
    instrumentEmoji: "🎷",
    section: "metais",
    color: "#ca8a04",
    frequency: 174.61,
    fact: "O trombone tem uma vara que desliza para mudar o som!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Giraffe_grunt.oga",
  },
  {
    id: "rabbit-flute",
    name: "Coelho",
    animalEmoji: "🐰",
    instrument: "Flauta",
    instrumentEmoji: "🪈",
    section: "madeiras",
    color: "#34d399",
    frequency: 783.99,
    fact: "A flauta canta agudinho como um passarinho!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/4/49/Rabbit_oinks_and_squeaks.wav",
  },
  {
    id: "owl-clarinet",
    name: "Coruja",
    animalEmoji: "🦉",
    instrument: "Clarinete",
    instrumentEmoji: "🎶",
    section: "madeiras",
    color: "#10b981",
    frequency: 293.66,
    fact: "O clarinete tem um som doce e misterioso!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/Pacific_Pygmy_Owl_call_%28Glaucidium_peruanum%29.ogg",
  },
  {
    id: "cat-violin",
    name: "Gato",
    animalEmoji: "🐱",
    instrument: "Violino",
    instrumentEmoji: "🎻",
    section: "cordas",
    color: "#fb923c",
    frequency: 659.25,
    fact: "O violino é o menor da família das cordas!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Meow_domestic_cat.ogg",
  },
  {
    id: "bear-cello",
    name: "Urso",
    animalEmoji: "🐻",
    instrument: "Violoncelo",
    instrumentEmoji: "🎻",
    section: "cordas",
    color: "#d97706",
    frequency: 196.0,
    fact: "O violoncelo tem um som quente e profundo!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Bear_growl.ogg",
  },
  {
    id: "frog-bass",
    name: "Sapo",
    animalEmoji: "🐸",
    instrument: "Contrabaixo",
    instrumentEmoji: "🎻",
    section: "cordas",
    color: "#65a30d",
    frequency: 98.0,
    fact: "O contrabaixo é o maior e mais grave das cordas!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Single_Frog_Croak.oga",
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
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Barking_of_a_dog.ogg",
  },
  {
    id: "monkey-xylophone",
    name: "Macaco",
    animalEmoji: "🐵",
    instrument: "Xilofone",
    instrumentEmoji: "🎹",
    section: "percussao",
    color: "#f43f5e",
    frequency: 1046.5,
    fact: "O xilofone tem um som cristalino como sininhos!",
    soundUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Dusky-leaf-monkey-call-kaeng-krachan.ogg",
  },
];
