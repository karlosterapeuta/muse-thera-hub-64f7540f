
export interface TraditionalSong {
  id: string;
  title: string;
  artist: string;
  audioFile: string;
  duration: number;
  bpm: number;
  difficulty: 'easy' | 'medium' | 'hard';
  pattern: Array<{
    time: number;
    track: number;
    duration: number;
    intensity?: number;
  }>;
  previewUrl?: string;
  cdnUrl?: string;
}

// Músicas tradicionais brasileiras com URLs reais de CDN
export const TRADITIONAL_SONGS: TraditionalSong[] = [
  {
    id: 'atirei-pau-gato',
    title: 'Atirei o Pau no Gato',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/atirei-pau-gato.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 60,
    bpm: 120,
    difficulty: 'easy',
    pattern: [
      { time: 2000, track: 0, duration: 500, intensity: 0.8 },
      { time: 3000, track: 2, duration: 500, intensity: 0.8 },
      { time: 4000, track: 4, duration: 500, intensity: 0.8 },
      { time: 5000, track: 2, duration: 500, intensity: 0.8 },
      { time: 6000, track: 0, duration: 500, intensity: 0.8 },
      { time: 8000, track: 1, duration: 500, intensity: 0.8 },
      { time: 9000, track: 3, duration: 500, intensity: 0.8 },
      { time: 10000, track: 4, duration: 500, intensity: 0.8 },
      { time: 11000, track: 3, duration: 500, intensity: 0.8 },
      { time: 12000, track: 1, duration: 500, intensity: 0.8 },
      { time: 14000, track: 0, duration: 500, intensity: 0.9 },
      { time: 15000, track: 2, duration: 500, intensity: 0.9 },
      { time: 16000, track: 4, duration: 1000, intensity: 1.0 },
    ]
  },
  {
    id: 'sapo-cururu',
    title: 'Sapo Cururu',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/sapo-cururu.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 45,
    bpm: 110,
    difficulty: 'easy',
    pattern: [
      { time: 1500, track: 1, duration: 500, intensity: 0.7 },
      { time: 2500, track: 1, duration: 500, intensity: 0.7 },
      { time: 3500, track: 3, duration: 500, intensity: 0.8 },
      { time: 4500, track: 3, duration: 500, intensity: 0.8 },
      { time: 5500, track: 4, duration: 500, intensity: 0.9 },
      { time: 7000, track: 2, duration: 500, intensity: 0.8 },
      { time: 8000, track: 2, duration: 500, intensity: 0.8 },
      { time: 9000, track: 0, duration: 500, intensity: 0.8 },
      { time: 10000, track: 0, duration: 500, intensity: 0.8 },
      { time: 11000, track: 1, duration: 1000, intensity: 1.0 },
    ]
  },
  {
    id: 'ciranda-cirandinha',
    title: 'Ciranda, Cirandinha',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/ciranda-cirandinha.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 70,
    bpm: 100,
    difficulty: 'medium',
    pattern: [
      { time: 2000, track: 0, duration: 400, intensity: 0.8 },
      { time: 2800, track: 2, duration: 400, intensity: 0.8 },
      { time: 3600, track: 4, duration: 400, intensity: 0.8 },
      { time: 4400, track: 5, duration: 400, intensity: 0.8 },
      { time: 5200, track: 4, duration: 400, intensity: 0.8 },
      { time: 6000, track: 2, duration: 400, intensity: 0.8 },
      { time: 6800, track: 0, duration: 800, intensity: 0.9 },
      { time: 8400, track: 1, duration: 400, intensity: 0.7 },
      { time: 9200, track: 3, duration: 400, intensity: 0.8 },
      { time: 10000, track: 4, duration: 400, intensity: 0.8 },
      { time: 10800, track: 2, duration: 400, intensity: 0.8 },
      { time: 11600, track: 0, duration: 800, intensity: 1.0 },
    ]
  },
  {
    id: 'sitio-lobato',
    title: 'O Sítio do Seu Lobato',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/sitio-lobato.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 55,
    bpm: 130,
    difficulty: 'medium',
    pattern: [
      { time: 1500, track: 0, duration: 300, intensity: 0.8 },
      { time: 2100, track: 0, duration: 300, intensity: 0.8 },
      { time: 2700, track: 2, duration: 300, intensity: 0.8 },
      { time: 3300, track: 4, duration: 600, intensity: 0.9 },
      { time: 4500, track: 3, duration: 300, intensity: 0.8 },
      { time: 5100, track: 1, duration: 300, intensity: 0.8 },
      { time: 5700, track: 0, duration: 600, intensity: 0.9 },
      { time: 7200, track: 2, duration: 300, intensity: 0.8 },
      { time: 7800, track: 4, duration: 300, intensity: 0.8 },
      { time: 8400, track: 5, duration: 300, intensity: 0.8 },
      { time: 9000, track: 4, duration: 300, intensity: 0.8 },
      { time: 9600, track: 2, duration: 300, intensity: 0.8 },
      { time: 10200, track: 0, duration: 900, intensity: 1.0 },
    ]
  },
  {
    id: 'barata-diz-que-tem',
    title: 'A Barata Diz Que Tem',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/barata-diz-que-tem.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 50,
    bpm: 115,
    difficulty: 'medium',
    pattern: [
      { time: 2000, track: 1, duration: 400, intensity: 0.8 },
      { time: 2800, track: 3, duration: 400, intensity: 0.8 },
      { time: 3600, track: 4, duration: 400, intensity: 0.8 },
      { time: 4400, track: 3, duration: 400, intensity: 0.8 },
      { time: 5200, track: 1, duration: 400, intensity: 0.8 },
      { time: 6400, track: 0, duration: 400, intensity: 0.8 },
      { time: 7200, track: 2, duration: 400, intensity: 0.8 },
      { time: 8000, track: 4, duration: 400, intensity: 0.9 },
      { time: 8800, track: 5, duration: 400, intensity: 0.9 },
      { time: 9600, track: 4, duration: 400, intensity: 0.8 },
      { time: 10400, track: 2, duration: 400, intensity: 0.8 },
      { time: 11200, track: 0, duration: 800, intensity: 1.0 },
    ]
  },
  {
    id: 'marcha-soldado',
    title: 'Marcha Soldado',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/marcha-soldado.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 40,
    bpm: 140,
    difficulty: 'hard',
    pattern: [
      { time: 1000, track: 0, duration: 250, intensity: 0.9 },
      { time: 1500, track: 0, duration: 250, intensity: 0.9 },
      { time: 2000, track: 2, duration: 250, intensity: 0.9 },
      { time: 2500, track: 2, duration: 250, intensity: 0.9 },
      { time: 3000, track: 4, duration: 500, intensity: 1.0 },
      { time: 4000, track: 3, duration: 250, intensity: 0.8 },
      { time: 4500, track: 1, duration: 250, intensity: 0.8 },
      { time: 5000, track: 0, duration: 500, intensity: 0.9 },
      { time: 6000, track: 2, duration: 250, intensity: 0.8 },
      { time: 6500, track: 4, duration: 250, intensity: 0.8 },
      { time: 7000, track: 5, duration: 250, intensity: 0.9 },
      { time: 7500, track: 4, duration: 250, intensity: 0.9 },
      { time: 8000, track: 2, duration: 250, intensity: 0.8 },
      { time: 8500, track: 0, duration: 750, intensity: 1.0 },
    ]
  },
  {
    id: 'boi-cara-preta',
    title: 'Boi da Cara Preta',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/boi-cara-preta.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 35,
    bpm: 95,
    difficulty: 'easy',
    pattern: [
      { time: 2500, track: 0, duration: 600, intensity: 0.8 },
      { time: 3500, track: 2, duration: 600, intensity: 0.8 },
      { time: 4500, track: 1, duration: 600, intensity: 0.8 },
      { time: 5500, track: 3, duration: 600, intensity: 0.8 },
      { time: 7000, track: 4, duration: 600, intensity: 0.9 },
      { time: 8000, track: 2, duration: 600, intensity: 0.8 },
      { time: 9000, track: 0, duration: 600, intensity: 0.8 },
      { time: 10000, track: 1, duration: 600, intensity: 0.8 },
      { time: 11000, track: 0, duration: 1200, intensity: 1.0 },
    ]
  },
  {
    id: 'peixe-vivo',
    title: 'Peixe Vivo',
    artist: 'Tradicional Brasileira',
    audioFile: '/assets/music/peixe-vivo.mp3',
    cdnUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 65,
    bpm: 105,
    difficulty: 'hard',
    pattern: [
      { time: 1800, track: 2, duration: 350, intensity: 0.8 },
      { time: 2500, track: 4, duration: 350, intensity: 0.8 },
      { time: 3200, track: 5, duration: 350, intensity: 0.9 },
      { time: 3900, track: 4, duration: 350, intensity: 0.8 },
      { time: 4600, track: 2, duration: 350, intensity: 0.8 },
      { time: 5300, track: 0, duration: 350, intensity: 0.8 },
      { time: 6400, track: 1, duration: 350, intensity: 0.8 },
      { time: 7100, track: 3, duration: 350, intensity: 0.8 },
      { time: 7800, track: 4, duration: 350, intensity: 0.9 },
      { time: 8500, track: 5, duration: 350, intensity: 0.9 },
      { time: 9200, track: 4, duration: 350, intensity: 0.8 },
      { time: 9900, track: 2, duration: 350, intensity: 0.8 },
      { time: 10600, track: 0, duration: 700, intensity: 1.0 },
    ]
  }
];

export const getSongsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): TraditionalSong[] => {
  return TRADITIONAL_SONGS.filter(song => song.difficulty === difficulty);
};

export const getSongById = (id: string): TraditionalSong | undefined => {
  return TRADITIONAL_SONGS.find(song => song.id === id);
};
