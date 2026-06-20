import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

/**
 * Categorias clínicas para filtrar templates rapidamente.
 */
export type PlanTemplateCategory =
  | 'neurodesenvolvimento'
  | 'neurologia'
  | 'saude-mental'
  | 'geral';

export const CATEGORY_LABELS: Record<PlanTemplateCategory, string> = {
  neurodesenvolvimento: 'Neurodesenvolvimento',
  neurologia: 'Neurologia',
  'saude-mental': 'Saúde Mental',
  geral: 'Geral',
};

export type PlanTemplate = {
  id: string;
  label: string;
  description: string;
  emoji: string;
  category: PlanTemplateCategory;
  diagnosis: string;
  /**
   * Conteúdo clínico completo e pronto para uso. Todos os campos relevantes
   * são preenchidos para que o profissional possa aplicar sem editar nada.
   */
  data: Partial<MusicotherapyTreatmentPlan>;
};

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'tea',
    label: 'TEA — Transtorno do Espectro Autista',
    description: 'Comunicação, interação social, regulação sensorial e flexibilidade.',
    emoji: '🧩',
    category: 'neurodesenvolvimento',
    diagnosis: 'Transtorno do Espectro Autista (TEA)',
    data: {
      clinical_diagnosis: 'Transtorno do Espectro Autista (TEA)',
      interaction_communication_level:
        'Comunicação predominantemente não-verbal, com uso emergente de gestos e vocalizações. Contato visual breve e intermitente.',
      physical_cognitive_conditions:
        'Hipersensibilidade sensorial (auditiva e tátil). Boa coordenação motora ampla; atenção sustentada reduzida.',
      observed_behaviors:
        'Movimentos repetitivos (stimming) em momentos de desregulação. Maior engajamento diante de estímulos musicais rítmicos.',
      musical_interests:
        'Canções infantis repetitivas, sons graves de percussão e melodias previsíveis.',
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
      musical_improvisation: 'Improvisação instrumental livre como ponte de comunicação e expressão.',
      musical_recreation: 'Recriação de músicas preferidas do paciente para gerar previsibilidade e prazer.',
      receptive_listening: 'Escuta receptiva com músicas estruturadas para regulação sensorial.',
      rhythmic_dynamics: 'Dinâmicas rítmicas com variação gradual de intensidade, respeitando o limiar sensorial.',
      weekly_sessions: 2,
      session_duration_minutes: 45,
      estimated_period_months: 6,
      evaluation_criteria_list: [
        'Tempo de atenção compartilhada em atividade musical',
        'Frequência de iniciativa comunicativa durante a sessão',
        'Qualidade do contato visual e da imitação',
        'Tolerância a mudanças na rotina musical',
      ],
      session_structure:
        'Acolhimento musical • Atividade central estruturada • Improvisação dirigida • Música de despedida.',
      activity_sequence:
        '1) Canção de boas-vindas fixa; 2) Exploração de instrumento; 3) Turn-taking rítmico; 4) Escuta receptiva; 5) Canção de despedida.',
      flexibility_adjustments:
        'Reduzir estímulos sonoros e prolongar atividades preferidas em sinais de desregulação.',
      reevaluation_frequency: 'mensal',
      evolution_recording: 'Registro descritivo por sessão com indicadores de comunicação e regulação.',
      necessary_adjustments: 'Ajustar repertório e duração conforme tolerância e engajamento observados.',
    },
  },
  {
    id: 'down',
    label: 'Síndrome de Down',
    description: 'Estimulação cognitiva, linguagem, coordenação e socialização.',
    emoji: '💛',
    category: 'neurodesenvolvimento',
    diagnosis: 'Síndrome de Down',
    data: {
      clinical_diagnosis: 'Síndrome de Down',
      interaction_communication_level:
        'Comunicação verbal em desenvolvimento, vocabulário funcional limitado e boa intenção comunicativa.',
      physical_cognitive_conditions:
        'Hipotonia muscular, coordenação motora em desenvolvimento e ritmo de aprendizagem próprio.',
      observed_behaviors: 'Sociável e afetivo, responde bem a reforço positivo e atividades em grupo.',
      musical_interests: 'Músicas cantadas, palmas e canções com gestos.',
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
      complementary_materials: ['Cartões com letras de músicas', 'Fitas e lenços'],
      musical_recreation: 'Recriação de canções com gestos para estimular linguagem e memória.',
      rhythmic_dynamics: 'Atividades rítmicas progressivas para fortalecer coordenação e tônus.',
      weekly_sessions: 1,
      session_duration_minutes: 45,
      estimated_period_months: 6,
      evaluation_criteria_list: [
        'Precisão rítmica ao tocar instrumentos',
        'Ampliação do vocabulário cantado',
        'Coordenação motora em movimentos musicais',
      ],
      session_structure: 'Acolhimento • Canto com gestos • Atividade rítmica • Relaxamento musical.',
      reevaluation_frequency: 'mensal',
      evolution_recording: 'Registro de marcos de linguagem e coordenação por sessão.',
    },
  },
  {
    id: 'alzheimer',
    label: 'Alzheimer / Demências',
    description: 'Memória, identidade e regulação emocional.',
    emoji: '🌿',
    category: 'neurologia',
    diagnosis: 'Doença de Alzheimer',
    data: {
      clinical_diagnosis: 'Doença de Alzheimer',
      interaction_communication_level:
        'Comunicação verbal preservada para conteúdos antigos; dificuldade em memória recente.',
      physical_cognitive_conditions:
        'Declínio cognitivo progressivo, episódios de agitação e desorientação temporal.',
      observed_behaviors: 'Reconhece e responde positivamente a músicas da própria história de vida.',
      musical_interests: 'Repertório da juventude e músicas afetivamente significativas.',
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
      musical_recreation: 'Recriação de canções autobiográficas para evocar memórias afetivas.',
      weekly_sessions: 2,
      session_duration_minutes: 40,
      estimated_period_months: 6,
      evaluation_criteria_list: [
        'Reconhecimento de músicas significativas',
        'Tempo de participação ativa',
        'Frequência de episódios de agitação',
      ],
      session_structure: 'Acolhimento • Escuta afetiva • Canto compartilhado • Encerramento calmo.',
      flexibility_adjustments: 'Adaptar repertório e ritmo conforme estado emocional do dia.',
      reevaluation_frequency: 'mensal',
      evolution_recording: 'Registro do humor, agitação e evocação de memórias por sessão.',
    },
  },
  {
    id: 'parkinson',
    label: 'Doença de Parkinson',
    description: 'Marcha, ritmo, voz e bem-estar (RAS).',
    emoji: '🎵',
    category: 'neurologia',
    diagnosis: 'Doença de Parkinson',
    data: {
      clinical_diagnosis: 'Doença de Parkinson',
      interaction_communication_level: 'Comunicação preservada, com redução de volume e projeção vocal.',
      physical_cognitive_conditions:
        'Bradicinesia, rigidez muscular e alterações de marcha e equilíbrio.',
      observed_behaviors: 'Melhora da marcha quando guiada por estímulo rítmico externo.',
      musical_interests: 'Músicas com pulso marcado e andamento estável.',
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
      rhythmic_dynamics: 'Estimulação Auditiva Rítmica (RAS) com BPM ajustado à marcha do paciente.',
      receptive_listening: 'Escuta de músicas com pulso estável para preparação da marcha.',
      weekly_sessions: 2,
      session_duration_minutes: 45,
      estimated_period_months: 6,
      evaluation_criteria_list: [
        'Estabilidade da marcha com estímulo rítmico',
        'Tempo de sustentação vocal',
        'Adesão aos exercícios respiratórios',
      ],
      session_structure: 'Aquecimento vocal • Exercícios respiratórios • Marcha rítmica (RAS) • Relaxamento.',
      flexibility_adjustments: 'Ajustar BPM e duração conforme fadiga e fase medicamentosa (on/off).',
      reevaluation_frequency: 'mensal',
      evolution_recording: 'Registro de marcha, projeção vocal e disposição por sessão.',
    },
  },
  {
    id: 'ansiedade',
    label: 'Ansiedade / Depressão',
    description: 'Regulação emocional, expressão e relaxamento.',
    emoji: '🌊',
    category: 'saude-mental',
    diagnosis: 'Transtorno de Ansiedade',
    data: {
      clinical_diagnosis: 'Transtorno de Ansiedade / Sintomas Depressivos',
      interaction_communication_level: 'Comunicação verbal preservada, por vezes retraída em momentos de ansiedade.',
      physical_cognitive_conditions: 'Tensão muscular, alterações de sono e oscilações de humor.',
      observed_behaviors: 'Relaxamento perceptível durante escuta e composição musical.',
      musical_interests: 'Músicas calmas, instrumentais e canções de identificação pessoal.',
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
      musical_improvisation: 'Improvisação livre para expressão e descarga emocional.',
      weekly_sessions: 1,
      session_duration_minutes: 50,
      estimated_period_months: 4,
      evaluation_criteria_list: [
        'Capacidade de identificar e nomear emoções',
        'Nível de relaxamento após escuta musical',
        'Engajamento na composição pessoal',
      ],
      session_structure: 'Acolhimento • Escuta receptiva • Expressão/composição • Relaxamento final.',
      flexibility_adjustments: 'Adaptar técnicas conforme nível de ansiedade e disponibilidade emocional.',
      reevaluation_frequency: 'mensal',
      evolution_recording: 'Registro do humor, ansiedade e expressão emocional por sessão.',
    },
  },
  {
    id: 'pc',
    label: 'Paralisia Cerebral',
    description: 'Motricidade, comunicação alternativa e participação.',
    emoji: '🌟',
    category: 'neurodesenvolvimento',
    diagnosis: 'Paralisia Cerebral',
    data: {
      clinical_diagnosis: 'Paralisia Cerebral',
      interaction_communication_level:
        'Comunicação por meios alternativos; intenção comunicativa presente através de olhar e vocalizações.',
      physical_cognitive_conditions:
        'Comprometimento motor variável, necessidade de instrumentos e posicionamento adaptados.',
      observed_behaviors: 'Demonstra prazer e intencionalidade ao acionar instrumentos adaptados.',
      musical_interests: 'Sons vibrantes, instrumentos de fácil acionamento e estímulos sensoriais.',
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
      technological_resources: ['Switches musicais', 'Aplicativos de causa-efeito sonoro'],
      complementary_materials: ['Suportes e posicionadores', 'Superfícies vibratórias'],
      musical_improvisation: 'Improvisação por causa-efeito para estimular intencionalidade.',
      receptive_listening: 'Escuta com estímulos vibrotáteis associados à música.',
      weekly_sessions: 2,
      session_duration_minutes: 40,
      estimated_period_months: 6,
      evaluation_criteria_list: [
        'Intencionalidade ao acionar instrumentos',
        'Respostas vocais a estímulos musicais',
        'Tempo de atenção sustentada',
      ],
      session_structure: 'Posicionamento • Estímulo sensorial • Atividade de causa-efeito • Relaxamento.',
      flexibility_adjustments: 'Adaptar instrumentos e posicionamento conforme tônus e fadiga.',
      reevaluation_frequency: 'mensal',
      evolution_recording: 'Registro de respostas motoras e comunicativas por sessão.',
    },
  },
  {
    id: 'generalista',
    label: 'Plano Generalista',
    description: 'Estrutura base completa para personalização livre.',
    emoji: '📝',
    category: 'geral',
    diagnosis: '',
    data: {
      general_objectives: [
        'Promover bem-estar e qualidade de vida do paciente',
        'Favorecer expressão e comunicação através da música',
        'Estimular socialização e engajamento terapêutico',
      ],
      specific_objectives: [
        'Participar ativamente das atividades musicais propostas',
        'Demonstrar preferências musicais durante as sessões',
      ],
      musical_instruments: ['Violão', 'Teclado', 'Percussão variada'],
      voice_body_resources: ['Canto', 'Movimentos corporais'],
      receptive_listening: 'Escuta de repertório significativo para o paciente.',
      weekly_sessions: 1,
      session_duration_minutes: 45,
      estimated_period_months: 3,
      evaluation_criteria_list: [
        'Nível de engajamento nas atividades',
        'Expressão de preferências musicais',
      ],
      session_structure: 'Acolhimento • Atividade central • Encerramento musical.',
      reevaluation_frequency: 'mensal',
    },
  },
];
