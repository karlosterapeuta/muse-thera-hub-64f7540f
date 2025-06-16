
export interface TraditionalSong {
  id: string;
  title: string;
  artist: string;
  audioFile: string;
  bpm: number;
  duration: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  pattern: {
    time: number; // milliseconds from start
    track: number; // 0-5 for boomwhacker notes
    duration: number; // note duration
    intensity?: number; // 0-1 for visual effects
  }[];
}

// Traditional Brazilian songs with complete note patterns
export const TRADITIONAL_SONGS: TraditionalSong[] = [
  {
    id: 'atirei-pau-gato',
    title: 'Atirei o Pau no Gato',
    artist: 'Tradicional',
    audioFile: '/assets/music/atirei-pau-gato.mp3',
    bpm: 120,
    duration: 45,
    difficulty: 'easy',
    pattern: [
      // "Atirei o pau no gato-to"
      { time: 2000, track: 4, duration: 500, intensity: 0.8 }, // G - "A"
      { time: 2500, track: 2, duration: 500, intensity: 0.6 }, // E - "ti"
      { time: 3000, track: 2, duration: 500, intensity: 0.6 }, // E - "rei"
      { time: 3500, track: 3, duration: 500, intensity: 0.7 }, // F - "o"
      { time: 4000, track: 1, duration: 500, intensity: 0.6 }, // D - "pau"
      { time: 4500, track: 1, duration: 500, intensity: 0.6 }, // D - "no"
      { time: 5000, track: 0, duration: 1000, intensity: 1.0 }, // C - "gato"
      
      // "Mas o gato-to"
      { time: 6500, track: 2, duration: 500, intensity: 0.6 }, // E - "Mas"
      { time: 7000, track: 3, duration: 500, intensity: 0.6 }, // F - "o"
      { time: 7500, track: 4, duration: 500, intensity: 0.8 }, // G - "ga"
      { time: 8000, track: 4, duration: 500, intensity: 0.8 }, // G - "to"
      { time: 8500, track: 5, duration: 500, intensity: 0.9 }, // A - "to"
      { time: 9000, track: 4, duration: 500, intensity: 0.8 }, // G - (pausa)
      { time: 9500, track: 3, duration: 500, intensity: 0.7 }, // F
      { time: 10000, track: 2, duration: 1000, intensity: 0.8 }, // E
      
      // "Não morreu-eu"
      { time: 12000, track: 4, duration: 500, intensity: 0.8 }, // G - "Não"
      { time: 12500, track: 2, duration: 500, intensity: 0.6 }, // E - "mor"
      { time: 13000, track: 2, duration: 500, intensity: 0.6 }, // E - "reu"
      { time: 13500, track: 3, duration: 500, intensity: 0.7 }, // F - "eu"
      { time: 14000, track: 1, duration: 500, intensity: 0.6 }, // D
      { time: 14500, track: 1, duration: 500, intensity: 0.6 }, // D
      { time: 15000, track: 0, duration: 1000, intensity: 1.0 }, // C
      
      // Segunda estrofe - repetição com variações
      { time: 18000, track: 4, duration: 500, intensity: 0.8 },
      { time: 18500, track: 2, duration: 500, intensity: 0.6 },
      { time: 19000, track: 2, duration: 500, intensity: 0.6 },
      { time: 19500, track: 3, duration: 500, intensity: 0.7 },
      { time: 20000, track: 1, duration: 500, intensity: 0.6 },
      { time: 20500, track: 1, duration: 500, intensity: 0.6 },
      { time: 21000, track: 0, duration: 1000, intensity: 1.0 },
      
      { time: 23000, track: 2, duration: 500, intensity: 0.6 },
      { time: 23500, track: 3, duration: 500, intensity: 0.7 },
      { time: 24000, track: 4, duration: 500, intensity: 0.8 },
      { time: 24500, track: 4, duration: 500, intensity: 0.8 },
      { time: 25000, track: 5, duration: 500, intensity: 0.9 },
      { time: 25500, track: 4, duration: 500, intensity: 0.8 },
      { time: 26000, track: 3, duration: 500, intensity: 0.7 },
      { time: 26500, track: 2, duration: 1000, intensity: 0.8 }
    ]
  },
  
  {
    id: 'sapo-cururu',
    title: 'Sapo Cururu',
    artist: 'Tradicional',
    audioFile: '/assets/music/sapo-cururu.mp3',
    bpm: 100,
    duration: 40,
    difficulty: 'easy',
    pattern: [
      // "Sapo cururu na beira do rio"
      { time: 2000, track: 1, duration: 400, intensity: 0.7 }, // D - "Sa"
      { time: 2400, track: 1, duration: 400, intensity: 0.7 }, // D - "po"
      { time: 2800, track: 4, duration: 400, intensity: 0.8 }, // G - "cu"
      { time: 3200, track: 4, duration: 400, intensity: 0.8 }, // G - "ru"
      { time: 3600, track: 5, duration: 400, intensity: 0.9 }, // A - "ru"
      { time: 4000, track: 5, duration: 400, intensity: 0.9 }, // A - "na"
      { time: 4400, track: 4, duration: 400, intensity: 0.8 }, // G - "bei"
      { time: 4800, track: 3, duration: 400, intensity: 0.7 }, // F - "ra"
      { time: 5200, track: 2, duration: 400, intensity: 0.6 }, // E - "do"
      { time: 5600, track: 1, duration: 800, intensity: 0.8 }, // D - "rio"
      
      // "Quando o sapo grita"
      { time: 7200, track: 2, duration: 400, intensity: 0.6 }, // E - "Quan"
      { time: 7600, track: 2, duration: 400, intensity: 0.6 }, // E - "do"
      { time: 8000, track: 5, duration: 400, intensity: 0.9 }, // A - "o"
      { time: 8400, track: 5, duration: 400, intensity: 0.9 }, // A - "sa"
      { time: 8800, track: 5, duration: 400, intensity: 0.9 }, // A - "po"
      { time: 9200, track: 5, duration: 400, intensity: 0.9 }, // A - "gri"
      { time: 9600, track: 4, duration: 400, intensity: 0.8 }, // G - "ta"
      { time: 10000, track: 4, duration: 400, intensity: 0.8 }, // G
      { time: 10400, track: 3, duration: 400, intensity: 0.7 }, // F
      { time: 10800, track: 2, duration: 800, intensity: 0.8 }, // E
      
      // "Oh maninha"
      { time: 12400, track: 4, duration: 400, intensity: 0.8 }, // G - "Oh"
      { time: 12800, track: 5, duration: 400, intensity: 0.9 }, // A - "ma"
      { time: 13200, track: 4, duration: 400, intensity: 0.8 }, // G - "ni"
      { time: 13600, track: 3, duration: 400, intensity: 0.7 }, // F - "nha"
      { time: 14000, track: 2, duration: 400, intensity: 0.6 }, // E
      { time: 14400, track: 3, duration: 400, intensity: 0.7 }, // F
      { time: 14800, track: 4, duration: 400, intensity: 0.8 }, // G
      { time: 15200, track: 5, duration: 400, intensity: 0.9 }, // A
      { time: 15600, track: 4, duration: 800, intensity: 1.0 } // G
    ]
  },
  
  {
    id: 'ciranda-cirandinha',
    title: 'Ciranda, Cirandinha',
    artist: 'Tradicional',
    audioFile: '/assets/music/ciranda-cirandinha.mp3',
    bpm: 110,
    duration: 50,
    difficulty: 'medium',
    pattern: [
      // "Ciranda, cirandinha"
      { time: 1500, track: 4, duration: 450, intensity: 0.8 }, // G - "Ci"
      { time: 1950, track: 4, duration: 450, intensity: 0.8 }, // G - "ran"
      { time: 2400, track: 5, duration: 450, intensity: 0.9 }, // A - "da"
      { time: 2850, track: 4, duration: 450, intensity: 0.8 }, // G - "ci"
      { time: 3300, track: 3, duration: 450, intensity: 0.7 }, // F - "ran"
      { time: 3750, track: 2, duration: 450, intensity: 0.6 }, // E - "di"
      { time: 4200, track: 1, duration: 450, intensity: 0.6 }, // D - "nha"
      { time: 4650, track: 0, duration: 900, intensity: 1.0 }, // C
      
      // "Vamos todos cirandar"
      { time: 6000, track: 0, duration: 450, intensity: 0.5 }, // C - "Va"
      { time: 6450, track: 1, duration: 450, intensity: 0.6 }, // D - "mos"
      { time: 6900, track: 2, duration: 450, intensity: 0.6 }, // E - "to"
      { time: 7350, track: 3, duration: 450, intensity: 0.7 }, // F - "dos"
      { time: 7800, track: 4, duration: 450, intensity: 0.8 }, // G - "ci"
      { time: 8250, track: 5, duration: 450, intensity: 0.9 }, // A - "ran"
      { time: 8700, track: 4, duration: 900, intensity: 1.0 }, // G - "dar"
      
      // "Vamos dar a meia volta"
      { time: 10200, track: 3, duration: 450, intensity: 0.7 }, // F - "Va"
      { time: 10650, track: 3, duration: 450, intensity: 0.7 }, // F - "mos"
      { time: 11100, track: 4, duration: 450, intensity: 0.8 }, // G - "dar"
      { time: 11550, track: 4, duration: 450, intensity: 0.8 }, // G - "a"
      { time: 12000, track: 5, duration: 450, intensity: 0.9 }, // A - "mei"
      { time: 12450, track: 4, duration: 450, intensity: 0.8 }, // G - "a"
      { time: 12900, track: 3, duration: 450, intensity: 0.7 }, // F - "vol"
      { time: 13350, track: 2, duration: 900, intensity: 0.8 }, // E - "ta"
      
      // "Volta e meia vamos dar"
      { time: 14850, track: 4, duration: 450, intensity: 0.8 }, // G - "Vol"
      { time: 15300, track: 4, duration: 450, intensity: 0.8 }, // G - "ta"
      { time: 15750, track: 5, duration: 450, intensity: 0.9 }, // A - "e"
      { time: 16200, track: 4, duration: 450, intensity: 0.8 }, // G - "mei"
      { time: 16650, track: 3, duration: 450, intensity: 0.7 }, // F - "a"
      { time: 17100, track: 2, duration: 450, intensity: 0.6 }, // E - "va"
      { time: 17550, track: 1, duration: 450, intensity: 0.6 }, // D - "mos"
      { time: 18000, track: 0, duration: 900, intensity: 1.0 }  // C - "dar"
    ]
  },
  
  {
    id: 'sitio-lobato',
    title: 'O Sítio do Seu Lobato',
    artist: 'Tradicional',
    audioFile: '/assets/music/sitio-lobato.mp3',
    bpm: 130,
    duration: 55,
    difficulty: 'medium',
    pattern: [
      // "Seu Lobato tinha um sítio"
      { time: 1800, track: 0, duration: 350, intensity: 0.7 }, // C - "Seu"
      { time: 2150, track: 1, duration: 350, intensity: 0.7 }, // D - "Lo"
      { time: 2500, track: 2, duration: 350, intensity: 0.8 }, // E - "ba"
      { time: 2850, track: 3, duration: 350, intensity: 0.8 }, // F - "to"
      { time: 3200, track: 4, duration: 350, intensity: 0.9 }, // G - "ti"
      { time: 3550, track: 5, duration: 350, intensity: 0.9 }, // A - "nha"
      { time: 3900, track: 4, duration: 350, intensity: 0.8 }, // G - "um"
      { time: 4250, track: 3, duration: 700, intensity: 1.0 }, // F - "sítio"
      
      // "I-a-i-a-ô"
      { time: 5300, track: 2, duration: 350, intensity: 0.6 }, // E - "I"
      { time: 5650, track: 5, duration: 350, intensity: 0.9 }, // A - "a"
      { time: 6000, track: 2, duration: 350, intensity: 0.6 }, // E - "i"
      { time: 6350, track: 5, duration: 350, intensity: 0.9 }, // A - "a"
      { time: 6700, track: 4, duration: 700, intensity: 1.0 }, // G - "ô"
      
      // "E neste sítio tinha uma vaca"
      { time: 8100, track: 2, duration: 300, intensity: 0.6 }, // E - "E"
      { time: 8400, track: 2, duration: 300, intensity: 0.6 }, // E - "nes"
      { time: 8700, track: 2, duration: 300, intensity: 0.6 }, // E - "te"
      { time: 9000, track: 4, duration: 300, intensity: 0.8 }, // G - "sí"
      { time: 9300, track: 4, duration: 300, intensity: 0.8 }, // G - "tio"
      { time: 9600, track: 5, duration: 300, intensity: 0.9 }, // A - "ti"
      { time: 9900, track: 5, duration: 300, intensity: 0.9 }, // A - "nha"
      { time: 10200, track: 4, duration: 300, intensity: 0.8 }, // G - "u"
      { time: 10500, track: 3, duration: 300, intensity: 0.7 }, // F - "ma"
      { time: 10800, track: 2, duration: 600, intensity: 0.8 }, // E - "vaca"
      
      // Sons de animais intercalados
      { time: 12000, track: 1, duration: 200, intensity: 0.5 }, // D - "mu"
      { time: 12200, track: 1, duration: 200, intensity: 0.5 }, // D - "mu"
      { time: 12600, track: 1, duration: 200, intensity: 0.5 }, // D - "mu"
      { time: 12800, track: 1, duration: 200, intensity: 0.5 }, // D - "mu"
      
      // Repetição do refrão
      { time: 13500, track: 2, duration: 350, intensity: 0.6 },
      { time: 13850, track: 5, duration: 350, intensity: 0.9 },
      { time: 14200, track: 2, duration: 350, intensity: 0.6 },
      { time: 14550, track: 5, duration: 350, intensity: 0.9 },
      { time: 14900, track: 4, duration: 700, intensity: 1.0 }
    ]
  },
  
  {
    id: 'barata-diz-tem',
    title: 'A Barata Diz Que Tem',
    artist: 'Tradicional',
    audioFile: '/assets/music/barata-diz-tem.mp3',
    bpm: 120,
    duration: 48,
    difficulty: 'medium',
    pattern: [
      // "A barata diz que tem"
      { time: 2000, track: 5, duration: 400, intensity: 0.9 }, // A - "A"
      { time: 2400, track: 1, duration: 400, intensity: 0.6 }, // D - "ba"
      { time: 2800, track: 1, duration: 400, intensity: 0.6 }, // D - "ra"
      { time: 3200, track: 3, duration: 400, intensity: 0.7 }, // F - "ta"
      { time: 3600, track: 1, duration: 400, intensity: 0.6 }, // D - "diz"
      { time: 4000, track: 1, duration: 400, intensity: 0.6 }, // D - "que"
      { time: 4400, track: 0, duration: 800, intensity: 1.0 }, // C - "tem"
      
      // "Sete saias de filó"
      { time: 5600, track: 2, duration: 400, intensity: 0.6 }, // E - "Se"
      { time: 6000, track: 2, duration: 400, intensity: 0.6 }, // E - "te"
      { time: 6400, track: 5, duration: 400, intensity: 0.9 }, // A - "sai"
      { time: 6800, track: 5, duration: 400, intensity: 0.9 }, // A - "as"
      { time: 7200, track: 5, duration: 400, intensity: 0.9 }, // A - "de"
      { time: 7600, track: 5, duration: 400, intensity: 0.9 }, // A - "fi"
      { time: 8000, track: 4, duration: 400, intensity: 0.8 }, // G - "ló"
      { time: 8400, track: 4, duration: 400, intensity: 0.8 }, // G
      { time: 8800, track: 3, duration: 400, intensity: 0.7 }, // F
      { time: 9200, track: 2, duration: 800, intensity: 0.8 }, // E
      
      // "É mentira da barata"
      { time: 10400, track: 4, duration: 400, intensity: 0.8 }, // G - "É"
      { time: 10800, track: 5, duration: 400, intensity: 0.9 }, // A - "men"
      { time: 11200, track: 4, duration: 400, intensity: 0.8 }, // G - "ti"
      { time: 11600, track: 3, duration: 400, intensity: 0.7 }, // F - "ra"
      { time: 12000, track: 2, duration: 400, intensity: 0.6 }, // E - "da"
      { time: 12400, track: 3, duration: 400, intensity: 0.7 }, // F - "ba"
      { time: 12800, track: 4, duration: 400, intensity: 0.8 }, // G - "ra"
      { time: 13200, track: 5, duration: 400, intensity: 0.9 }, // A - "ta"
      { time: 13600, track: 4, duration: 800, intensity: 1.0 }, // G
      
      // "Ela tem é rabo de rato"
      { time: 15000, track: 2, duration: 400, intensity: 0.6 }, // E - "E"
      { time: 15400, track: 2, duration: 400, intensity: 0.6 }, // E - "la"
      { time: 15800, track: 2, duration: 400, intensity: 0.6 }, // E - "tem"
      { time: 16200, track: 2, duration: 400, intensity: 0.6 }, // E - "é"
      { time: 16600, track: 1, duration: 400, intensity: 0.6 }, // D - "ra"
      { time: 17000, track: 1, duration: 400, intensity: 0.6 }, // D - "bo"
      { time: 17400, track: 1, duration: 400, intensity: 0.6 }, // D - "de"
      { time: 17800, track: 1, duration: 400, intensity: 0.6 }, // D - "ra"
      { time: 18200, track: 0, duration: 800, intensity: 1.0 }  // C - "to"
    ]
  },
  
  {
    id: 'marcha-soldado',
    title: 'Marcha Soldado',
    artist: 'Tradicional',
    audioFile: '/assets/music/marcha-soldado.mp3',
    bpm: 110,
    duration: 35,
    difficulty: 'easy',
    pattern: [
      // "Marcha soldado"
      { time: 1500, track: 4, duration: 500, intensity: 0.8 }, // G - "Mar"
      { time: 2000, track: 4, duration: 500, intensity: 0.8 }, // G - "cha"
      { time: 2500, track: 4, duration: 500, intensity: 0.8 }, // G - "sol"
      { time: 3000, track: 4, duration: 1000, intensity: 1.0 }, // G - "dado"
      
      // "Cabeça de papel"
      { time: 4500, track: 3, duration: 500, intensity: 0.7 }, // F - "Ca"
      { time: 5000, track: 3, duration: 500, intensity: 0.7 }, // F - "be"
      { time: 5500, track: 3, duration: 500, intensity: 0.7 }, // F - "ça"
      { time: 6000, track: 3, duration: 500, intensity: 0.7 }, // F - "de"
      { time: 6500, track: 2, duration: 500, intensity: 0.6 }, // E - "pa"
      { time: 7000, track: 2, duration: 1000, intensity: 0.8 }, // E - "pel"
      
      // "Se não marchar direito"
      { time: 8500, track: 2, duration: 400, intensity: 0.6 }, // E - "Se"
      { time: 8900, track: 2, duration: 400, intensity: 0.6 }, // E - "não"
      { time: 9300, track: 4, duration: 400, intensity: 0.8 }, // G - "mar"
      { time: 9700, track: 4, duration: 400, intensity: 0.8 }, // G - "char"
      { time: 10100, track: 5, duration: 400, intensity: 0.9 }, // A - "di"
      { time: 10500, track: 5, duration: 400, intensity: 0.9 }, // A - "rei"
      { time: 10900, track: 4, duration: 800, intensity: 1.0 }, // G - "to"
      
      // "Vai preso no quartel"
      { time: 12200, track: 3, duration: 400, intensity: 0.7 }, // F - "Vai"
      { time: 12600, track: 3, duration: 400, intensity: 0.7 }, // F - "pre"
      { time: 13000, track: 3, duration: 400, intensity: 0.7 }, // F - "so"
      { time: 13400, track: 3, duration: 400, intensity: 0.7 }, // F - "no"
      { time: 13800, track: 2, duration: 400, intensity: 0.6 }, // E - "quar"
      { time: 14200, track: 1, duration: 400, intensity: 0.6 }, // D - "tel"
      { time: 14600, track: 0, duration: 1000, intensity: 1.0 } // C
    ]
  },
  
  {
    id: 'boi-cara-preta',
    title: 'Boi da Cara Preta',
    artist: 'Tradicional',
    audioFile: '/assets/music/boi-cara-preta.mp3',
    bpm: 90,
    duration: 42,
    difficulty: 'hard',
    pattern: [
      // "Boi, boi, boi"
      { time: 2000, track: 1, duration: 600, intensity: 0.8 }, // D - "Boi"
      { time: 2800, track: 1, duration: 600, intensity: 0.8 }, // D - "boi"
      { time: 3600, track: 1, duration: 1200, intensity: 1.0 }, // D - "boi"
      
      // "Boi da cara preta"
      { time: 5200, track: 1, duration: 500, intensity: 0.6 }, // D - "Boi"
      { time: 5700, track: 1, duration: 500, intensity: 0.6 }, // D - "da"
      { time: 6200, track: 0, duration: 500, intensity: 0.5 }, // C - "ca"
      { time: 6700, track: 0, duration: 500, intensity: 0.5 }, // C - "ra"
      { time: 7200, track: 4, duration: 1000, intensity: 1.0 }, // G - "preta"
      
      // "Pega essa criança"
      { time: 8700, track: 4, duration: 500, intensity: 0.8 }, // G - "Pe"
      { time: 9200, track: 4, duration: 500, intensity: 0.8 }, // G - "ga"
      { time: 9700, track: 2, duration: 500, intensity: 0.6 }, // E - "es"
      { time: 10200, track: 2, duration: 500, intensity: 0.6 }, // E - "sa"
      { time: 10700, track: 0, duration: 500, intensity: 0.5 }, // C - "cri"
      { time: 11200, track: 0, duration: 500, intensity: 0.5 }, // C - "an"
      { time: 11700, track: 1, duration: 1000, intensity: 0.8 }, // D - "ça"
      
      // "Que tem medo de careta"
      { time: 13200, track: 2, duration: 400, intensity: 0.6 }, // E - "Que"
      { time: 13600, track: 2, duration: 400, intensity: 0.6 }, // E - "tem"
      { time: 14000, track: 3, duration: 400, intensity: 0.7 }, // F - "me"
      { time: 14400, track: 3, duration: 400, intensity: 0.7 }, // F - "do"
      { time: 14800, track: 1, duration: 400, intensity: 0.6 }, // D - "de"
      { time: 15200, track: 1, duration: 400, intensity: 0.6 }, // D - "ca"
      { time: 15600, track: 4, duration: 400, intensity: 0.8 }, // G - "re"
      { time: 16000, track: 4, duration: 800, intensity: 1.0 }, // G - "ta"
      
      // Repetição mais intensa
      { time: 17500, track: 1, duration: 400, intensity: 0.9 },
      { time: 17900, track: 1, duration: 400, intensity: 0.9 },
      { time: 18300, track: 1, duration: 800, intensity: 1.0 },
      { time: 19500, track: 4, duration: 600, intensity: 1.0 },
      { time: 20400, track: 2, duration: 600, intensity: 0.8 },
      { time: 21300, track: 0, duration: 1200, intensity: 1.0 }
    ]
  },
  
  {
    id: 'peixe-vivo',
    title: 'Peixe Vivo',
    artist: 'Tradicional',
    audioFile: '/assets/music/peixe-vivo.mp3',
    bpm: 100,
    duration: 52,
    difficulty: 'hard',
    pattern: [
      // "Como pode um peixe vivo"
      { time: 2000, track: 0, duration: 400, intensity: 0.7 }, // C - "Co"
      { time: 2400, track: 0, duration: 400, intensity: 0.7 }, // C - "mo"
      { time: 2800, track: 1, duration: 400, intensity: 0.7 }, // D - "po"
      { time: 3200, track: 1, duration: 400, intensity: 0.7 }, // D - "de"
      { time: 3600, track: 2, duration: 400, intensity: 0.8 }, // E - "um"
      { time: 4000, track: 3, duration: 400, intensity: 0.8 }, // F - "pei"
      { time: 4400, track: 4, duration: 400, intensity: 0.9 }, // G - "xe"
      { time: 4800, track: 4, duration: 800, intensity: 1.0 }, // G - "vivo"
      
      // "Viver fora da água fria"
      { time: 6000, track: 4, duration: 400, intensity: 0.8 }, // G - "Vi"
      { time: 6400, track: 4, duration: 400, intensity: 0.8 }, // G - "ver"
      { time: 6800, track: 3, duration: 400, intensity: 0.7 }, // F - "fo"
      { time: 7200, track: 3, duration: 400, intensity: 0.7 }, // F - "ra"
      { time: 7600, track: 2, duration: 400, intensity: 0.6 }, // E - "da"
      { time: 8000, track: 2, duration: 400, intensity: 0.6 }, // E - "á"
      { time: 8400, track: 1, duration: 400, intensity: 0.6 }, // D - "gua"
      { time: 8800, track: 0, duration: 800, intensity: 0.8 }, // C - "fria"
      
      // "Como poderei viver"
      { time: 10200, track: 0, duration: 400, intensity: 0.7 }, // C - "Co"
      { time: 10600, track: 0, duration: 400, intensity: 0.7 }, // C - "mo"
      { time: 11000, track: 1, duration: 400, intensity: 0.7 }, // D - "po"
      { time: 11400, track: 1, duration: 400, intensity: 0.7 }, // D - "de"
      { time: 11800, track: 2, duration: 400, intensity: 0.8 }, // E - "rei"
      { time: 12200, track: 3, duration: 400, intensity: 0.8 }, // F - "vi"
      { time: 12600, track: 4, duration: 800, intensity: 1.0 }, // G - "ver"
      
      // "Sem a tua companhia"
      { time: 13800, track: 4, duration: 400, intensity: 0.8 }, // G - "Sem"
      { time: 14200, track: 4, duration: 400, intensity: 0.8 }, // G - "a"
      { time: 14600, track: 5, duration: 400, intensity: 0.9 }, // A - "tu"
      { time: 15000, track: 5, duration: 400, intensity: 0.9 }, // A - "a"
      { time: 15400, track: 4, duration: 400, intensity: 0.8 }, // G - "com"
      { time: 15800, track: 3, duration: 400, intensity: 0.7 }, // F - "pa"
      { time: 16200, track: 2, duration: 400, intensity: 0.6 }, // E - "nhi"
      { time: 16600, track: 1, duration: 400, intensity: 0.6 }, // D - "a"
      { time: 17000, track: 0, duration: 800, intensity: 1.0 }, // C
      
      // Segunda estrofe com harmonias mais complexas
      { time: 19000, track: 2, duration: 300, intensity: 0.8 },
      { time: 19300, track: 4, duration: 300, intensity: 0.9 },
      { time: 19600, track: 2, duration: 300, intensity: 0.8 },
      { time: 19900, track: 4, duration: 300, intensity: 0.9 },
      { time: 20200, track: 5, duration: 600, intensity: 1.0 },
      
      { time: 21200, track: 3, duration: 300, intensity: 0.7 },
      { time: 21500, track: 5, duration: 300, intensity: 0.9 },
      { time: 21800, track: 3, duration: 300, intensity: 0.7 },
      { time: 22100, track: 5, duration: 300, intensity: 0.9 },
      { time: 22400, track: 4, duration: 600, intensity: 1.0 },
      
      // Finale com todas as notas
      { time: 24000, track: 0, duration: 200, intensity: 1.0 },
      { time: 24200, track: 1, duration: 200, intensity: 1.0 },
      { time: 24400, track: 2, duration: 200, intensity: 1.0 },
      { time: 24600, track: 3, duration: 200, intensity: 1.0 },
      { time: 24800, track: 4, duration: 200, intensity: 1.0 },
      { time: 25000, track: 5, duration: 200, intensity: 1.0 },
      { time: 25200, track: 4, duration: 1000, intensity: 1.0 }
    ]
  }
];

// Função para obter música por ID
export const getTraditionalSong = (id: string): TraditionalSong | null => {
  return TRADITIONAL_SONGS.find(song => song.id === id) || null;
};

// Função para obter todas as músicas por dificuldade
export const getSongsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): TraditionalSong[] => {
  return TRADITIONAL_SONGS.filter(song => song.difficulty === difficulty);
};
