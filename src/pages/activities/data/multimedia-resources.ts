import { MultimediaResource } from '../types/user-data';

export const multimediaResourcesData: MultimediaResource[] = [
  // Instrumentos
  {
    id: 'piano-c4',
    type: 'audio',
    title: 'Piano - Dó Central (C4)',
    url: '/assets/audio/piano-c4.mp3',
    category: 'instrument',
    tags: ['piano', 'nota', 'c4', 'central'],
    description: 'Nota Dó central no piano, fundamental para exercícios de referência tonal'
  },
  {
    id: 'guitar-em-chord',
    type: 'audio',
    title: 'Violão - Acorde Mi Menor',
    url: '/assets/audio/guitar-em-chord.mp3',
    category: 'instrument',
    tags: ['violão', 'acorde', 'mi menor', 'em'],
    description: 'Acorde de Mi menor no violão, ideal para atividades de harmonia'
  },
  {
    id: 'drum-basic-beat',
    type: 'audio',
    title: 'Bateria - Ritmo Básico',
    url: '/assets/audio/drum-basic-beat.mp3',
    duration: 30,
    category: 'instrument',
    tags: ['bateria', 'ritmo', 'básico', '4/4'],
    description: 'Padrão rítmico básico em 4/4, perfeito para exercícios de coordenação motora'
  },
  
  // Sons da Natureza
  {
    id: 'rain-gentle',
    type: 'audio',
    title: 'Chuva Suave',
    url: '/assets/audio/rain-gentle.mp3',
    duration: 300,
    category: 'nature',
    tags: ['chuva', 'relaxamento', 'natureza', 'ambiente'],
    description: 'Som de chuva suave para relaxamento e atividades de mindfulness'
  },
  {
    id: 'birds-morning',
    type: 'audio',
    title: 'Pássaros da Manhã',
    url: '/assets/audio/birds-morning.mp3',
    duration: 240,
    category: 'nature',
    tags: ['pássaros', 'manhã', 'natureza', 'despertar'],
    description: 'Canto de pássaros matinais, ideal para atividades de atenção e foco'
  },
  {
    id: 'ocean-waves',
    type: 'audio',
    title: 'Ondas do Mar',
    url: '/assets/audio/ocean-waves.mp3',
    duration: 600,
    category: 'nature',
    tags: ['mar', 'ondas', 'relaxamento', 'respiração'],
    description: 'Som das ondas do mar, excelente para exercícios de respiração e relaxamento'
  },

  // Ambientes Terapêuticos
  {
    id: 'meditation-bell',
    type: 'audio',
    title: 'Sino Tibetano',
    url: '/assets/audio/meditation-bell.mp3',
    duration: 45,
    category: 'therapy',
    tags: ['sino', 'meditação', 'tibetano', 'mindfulness'],
    description: 'Som de sino tibetano para início e fim de atividades meditativas'
  },
  {
    id: 'white-noise',
    type: 'audio',
    title: 'Ruído Branco',
    url: '/assets/audio/white-noise.mp3',
    duration: 180,
    category: 'ambient',
    tags: ['ruído', 'branco', 'concentração', 'foco'],
    description: 'Ruído branco para melhorar concentração e reduzir distrações'
  },

  // Vozes e Exercícios
  {
    id: 'breathing-guide',
    type: 'audio',
    title: 'Guia de Respiração',
    url: '/assets/audio/breathing-guide.mp3',
    duration: 300,
    category: 'voice',
    tags: ['respiração', 'guiado', 'relaxamento', 'ansiedade'],
    description: 'Exercício guiado de respiração para regulação emocional'
  },
  {
    id: 'vocal-warmup',
    type: 'audio',
    title: 'Aquecimento Vocal',
    url: '/assets/audio/vocal-warmup.mp3',
    duration: 180,
    category: 'voice',
    tags: ['vocal', 'aquecimento', 'voz', 'exercício'],
    description: 'Exercícios de aquecimento vocal para atividades de linguagem'
  },

  // Vídeos Demonstrativos
  {
    id: 'hand-coordination',
    type: 'video',
    title: 'Coordenação de Mãos',
    url: '/assets/video/hand-coordination.mp4',
    thumbnail: '/assets/thumbnails/hand-coordination.jpg',
    duration: 120,
    category: 'therapy',
    tags: ['coordenação', 'mãos', 'motora', 'exercício'],
    description: 'Demonstração de exercícios de coordenação bilateral das mãos'
  },
  {
    id: 'breathing-exercises',
    type: 'video',
    title: 'Exercícios de Respiração',
    url: '/assets/video/breathing-exercises.mp4',
    thumbnail: '/assets/thumbnails/breathing-exercises.jpg',
    duration: 240,
    category: 'therapy',
    tags: ['respiração', 'relaxamento', 'ansiedade', 'demonstração'],
    description: 'Vídeo demonstrativo de técnicas de respiração terapêutica'
  },

  // Imagens de Apoio
  {
    id: 'emotion-cards',
    type: 'image',
    title: 'Cartões de Emoções',
    url: '/assets/images/emotion-cards.jpg',
    category: 'therapy',
    tags: ['emoções', 'cartões', 'identificação', 'visual'],
    description: 'Cartões visuais para identificação e expressão de emoções'
  },
  {
    id: 'musical-notes',
    type: 'image',
    title: 'Notas Musicais Coloridas',
    url: '/assets/images/musical-notes-colored.jpg',
    category: 'instrument',
    tags: ['notas', 'música', 'coloridas', 'educação'],
    description: 'Representação visual colorida das notas musicais'
  }
];