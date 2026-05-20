import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

export type PlanTemplate = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  diagnosis: string;
  data: Partial<MusicotherapyTreatmentPlan>;
};

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'tea',
    label: 'TEA — Transtorno do Espectro Autista',
    description: 'Foco em comunicação, interação social, regulação sensorial e flexibilidade.',
    emoji: '🧩',
    diagnosis: 'Transtorno do Espectro Autista (TEA)',
    data: {
      clinical_diagnosis: 'Transtorno do Espectro Autista (TEA)',
      general_objectives: [
        'Promover desenvolvimento da comunicação verbal e não-verbal',
        'Estimular interação social e contato visual através da música',
        'Favorecer regulação sensorial e emocional',
        'Ampliar flexibilidade comportamental e tolerância a mudanças',
      ],
      specific_objectives: [
        'Sustentar atenção compartilhada por ao menos 3 minutos em atividade musical',
        'Imitar padrões rítmicos simples apresentados pelo terapeuta',
        'Vocalizar ou cantar trechos de músicas conhecidas',
        'Participar de turn-taking musical (revezamento) com instrumento',
      ],
      musical_instruments: ['Tambor djembê', 'Xilofone', 'Maracas', 'Pandeiro', 'Teclado'],
      voice_body_resources: ['Canto melódico', 'Vocalizações exploratórias', 'Palmas rítmicas'],
      technological_resources: ['Caixa de som portátil', 'Aplicativos musicais (Garage Band)'],
      complementary_materials: ['Cartões visuais de músicas', 'Lenços coloridos'],
      musical_improvisation: 'Improvisação instrumental livre como ponte de comunicação.',
      musical_recreation: 'Recriação de músicas preferidas do paciente.',
      receptive_listening: 'Escuta receptiva com músicas estruturadas para regulação.',
      rhythmic_dynamics: 'Dinâmicas rítmicas com variação gradual de intensidade.',
      weekly_sessions: 2,
      session_duration_minutes: 45,
      estimated_period_months: 6,
      evaluation_criteria_list: [
        'Tempo de atenção compartilhada em atividade musical',
        'Frequência de iniciativa comunicativa durante a sessão',
        'Qualidade do contato visual e da imitação',
        'Tolerância a mudanças na rotina musical',
      ],
      session_structure: 'Acolhimento musical • Atividade central estruturada • Improvisação dirigida • Música de despedida.',
      reevaluation_frequency: 'mensal',
    },
  },
  {
    id: 'down',
    label: 'Síndrome de Down',
    description: 'Estimulação cognitiva, linguagem, coordenação e socialização.',
    emoji: '💛',
    diagnosis: 'Síndrome de Down',
    data: {
      clinical_diagnosis: 'Síndrome de Down',
      general_objectives: [
        'Estimular desenvolvimento cognitivo e linguagem',
        'Favorecer coordenação motora ampla e fina',
        'Promover autoestima e expressão emocional',
      ],
      specific_objectives: [
        'Cantar músicas com letras curtas e repetitivas',
        'Tocar instrumentos com precisão rítmica básica',
        'Realizar movimentos coordenados ao som da música',
      ],
      musical_instruments: ['Teclado', 'Violão', 'Tambor', 'Sinos', 'Chocalhos'],
      voice_body_resources: ['Canto coletivo', 'Movimentos corporais ritmados'],
      weekly_sessions: 1,
      session_duration_minutes: 45,
      estimated_period_months: 6,
      reevaluation_frequency: 'mensal',
    },
  },
  {
    id: 'alzheimer',
    label: 'Alzheimer / Demências',
    description: 'Estimulação de memória, identidade e regulação emocional.',
    emoji: '🌿',
    diagnosis: 'Doença de Alzheimer',
    data: {
      clinical_diagnosis: 'Doença de Alzheimer',
      general_objectives: [
        'Preservar memória autobiográfica através da música pessoal',
        'Reduzir agitação e sintomas comportamentais',
        'Promover bem-estar emocional e socialização',
      ],
      specific_objectives: [
        'Reconhecer e cantar músicas da juventude do paciente',
        'Manter participação ativa em atividade musical por 20 minutos',
        'Reduzir episódios de agitação após sessões',
      ],
      musical_instruments: ['Violão', 'Teclado', 'Pandeiro', 'Tambor leve'],
      voice_body_resources: ['Canto de músicas do repertório pessoal', 'Movimentos suaves'],
      receptive_listening: 'Playlist personalizada com músicas significativas da história de vida.',
      weekly_sessions: 2,
      session_duration_minutes: 40,
      estimated_period_months: 6,
      reevaluation_frequency: 'mensal',
    },
  },
  {
    id: 'parkinson',
    label: 'Doença de Parkinson',
    description: 'Marcha, ritmo, voz e bem-estar (RAS - Rhythmic Auditory Stimulation).',
    emoji: '🎵',
    diagnosis: 'Doença de Parkinson',
    data: {
      clinical_diagnosis: 'Doença de Parkinson',
      general_objectives: [
        'Melhorar marcha e coordenação através de estimulação rítmica',
        'Fortalecer projeção vocal e respiração',
        'Reduzir sintomas depressivos e ansiosos',
      ],
      specific_objectives: [
        'Caminhar acompanhando pulso musical estável por 5 minutos',
        'Sustentar vocalização contínua por ao menos 10 segundos',
        'Realizar exercícios respiratórios musicalizados',
      ],
      musical_instruments: ['Metrônomo musical', 'Tambor', 'Teclado'],
      voice_body_resources: ['Exercícios vocais (LSVT)', 'Marcha rítmica'],
      rhythmic_dynamics: 'Estimulação Auditiva Rítmica (RAS) com BPM ajustado à marcha.',
      weekly_sessions: 2,
      session_duration_minutes: 45,
      estimated_period_months: 6,
      reevaluation_frequency: 'mensal',
    },
  },
  {
    id: 'ansiedade',
    label: 'Ansiedade / Depressão',
    description: 'Regulação emocional, expressão e relaxamento.',
    emoji: '🌊',
    diagnosis: 'Transtorno de Ansiedade',
    data: {
      clinical_diagnosis: 'Transtorno de Ansiedade / Sintomas Depressivos',
      general_objectives: [
        'Promover regulação emocional e redução da ansiedade',
        'Favorecer expressão de emoções através da música',
        'Estimular autoconhecimento e autoestima',
      ],
      specific_objectives: [
        'Identificar e nomear emoções a partir da escuta musical',
        'Compor pequena canção autobiográfica',
        'Realizar técnicas de respiração com suporte musical',
      ],
      musical_instruments: ['Violão', 'Teclado', 'Tigelas tibetanas', 'Kalimba'],
      voice_body_resources: ['Canto expressivo', 'Respiração rítmica'],
      receptive_listening: 'Escuta receptiva com músicas relaxantes (60-70 BPM).',
      musical_composition: 'Composição de canção pessoal sobre vivências emocionais.',
      weekly_sessions: 1,
      session_duration_minutes: 50,
      estimated_period_months: 4,
      reevaluation_frequency: 'mensal',
    },
  },
  {
    id: 'pc',
    label: 'Paralisia Cerebral',
    description: 'Motricidade, comunicação alternativa e participação.',
    emoji: '🌟',
    diagnosis: 'Paralisia Cerebral',
    data: {
      clinical_diagnosis: 'Paralisia Cerebral',
      general_objectives: [
        'Estimular controle motor através da música',
        'Promover comunicação alternativa musical',
        'Favorecer participação ativa e prazer terapêutico',
      ],
      specific_objectives: [
        'Acionar instrumento adaptado de forma intencional',
        'Vocalizar em resposta a estímulo musical',
        'Sustentar atenção em atividade musical por 10 minutos',
      ],
      musical_instruments: ['Instrumentos adaptados', 'Sinos de mão', 'Big mack musical'],
      voice_body_resources: ['Vocalizações', 'Movimentos intencionais'],
      weekly_sessions: 2,
      session_duration_minutes: 40,
      estimated_period_months: 6,
      reevaluation_frequency: 'mensal',
    },
  },
  {
    id: 'generalista',
    label: 'Plano Generalista',
    description: 'Estrutura base para customização livre.',
    emoji: '📝',
    diagnosis: '',
    data: {
      general_objectives: [
        'Promover bem-estar e qualidade de vida do paciente',
        'Favorecer expressão e comunicação através da música',
      ],
      specific_objectives: [
        'Participar ativamente das atividades musicais propostas',
      ],
      musical_instruments: ['Violão', 'Teclado', 'Percussão variada'],
      weekly_sessions: 1,
      session_duration_minutes: 45,
      estimated_period_months: 3,
      reevaluation_frequency: 'mensal',
    },
  },
];
