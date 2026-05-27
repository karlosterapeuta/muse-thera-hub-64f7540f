export type DisorderType = 'TEA' | 'TDAH' | 'TOD' | 'DI' | 'ALZHEIMER' | 'PARKINSON';

export type DemandCategory = 
  | 'comunicacao' 
  | 'sensorial' 
  | 'socioemocional' 
  | 'motor' 
  | 'cognitivo' 
  | 'comportamento'
  | 'atencao'
  | 'funcoes_executivas'
  | 'controle_emocional'
  | 'autorregulacao'
  | 'autonomia'
  // Alzheimer specific
  | 'memoria'
  | 'orientacao'
  | 'reminiscencia'
  | 'identidade'
  // Parkinson specific
  | 'marcha'
  | 'voz_fala'
  | 'tremor_rigidez'
  | 'coordenacao';

export interface ProfessionalActivity {
  id: string;
  title: string;
  disorder: DisorderType;
  demandCategory: DemandCategory;
  demandLabel: string;
  generalObjective: string;
  specificObjectives: string[];
  description: string;
  materials: string[];
  estimatedTime: string;
  complexityLevel: 'leve' | 'moderado' | 'severo';
  evaluationCriteria: string[];
  adaptations: string[];
  theoreticalBasis: string;
  ageRange: string;
  contraindications?: string[];
  tips?: string[];
}

export const disorderInfo: Record<DisorderType, { name: string; description: string; color: string; icon: string }> = {
  TEA: {
    name: 'Transtorno do Espectro Autista',
    description: 'Atividades focadas em comunicação, interação social, integração sensorial e flexibilidade comportamental.',
    color: 'from-blue-500 to-cyan-600',
    icon: '🧩'
  },
  TDAH: {
    name: 'Transtorno de Déficit de Atenção e Hiperatividade',
    description: 'Atividades que trabalham atenção sustentada, controle inibitório, funções executivas e regulação motora.',
    color: 'from-orange-500 to-amber-600',
    icon: '⚡'
  },
  TOD: {
    name: 'Transtorno Opositivo-Desafiador',
    description: 'Atividades para desenvolver regulação emocional, cooperação, respeito a limites e expressão adequada de emoções.',
    color: 'from-red-500 to-rose-600',
    icon: '🔥'
  },
  DI: {
    name: 'Deficiência Intelectual',
    description: 'Atividades adaptadas para desenvolvimento de autonomia, comunicação funcional, cognição e habilidades sociais.',
    color: 'from-purple-500 to-violet-600',
    icon: '💜'
  },
  ALZHEIMER: {
    name: 'Doença de Alzheimer',
    description: 'Atividades focadas em estimulação cognitiva, memória, reminiscência, manutenção de identidade e comunicação.',
    color: 'from-teal-500 to-cyan-600',
    icon: '🧠'
  },
  PARKINSON: {
    name: 'Doença de Parkinson',
    description: 'Atividades rítmicas para melhora da marcha, coordenação motora, voz, fala e controle de movimentos.',
    color: 'from-green-500 to-emerald-600',
    icon: '🎵'
  }
};

export const demandCategoryInfo: Record<DemandCategory, { name: string; icon: string }> = {
  comunicacao: { name: 'Comunicação e Linguagem', icon: '💬' },
  sensorial: { name: 'Sensorial', icon: '👂' },
  socioemocional: { name: 'Socioemocional', icon: '💞' },
  motor: { name: 'Motor', icon: '🏃' },
  cognitivo: { name: 'Cognitivo', icon: '🧠' },
  comportamento: { name: 'Comportamento', icon: '🎯' },
  atencao: { name: 'Atenção', icon: '👁️' },
  funcoes_executivas: { name: 'Funções Executivas', icon: '📊' },
  controle_emocional: { name: 'Controle Emocional', icon: '❤️‍🔥' },
  autorregulacao: { name: 'Autorregulação', icon: '🧘' },
  autonomia: { name: 'Autonomia', icon: '🌟' },
  // Alzheimer specific
  memoria: { name: 'Memória e Cognição', icon: '🧠' },
  orientacao: { name: 'Orientação', icon: '🧭' },
  reminiscencia: { name: 'Reminiscência', icon: '📷' },
  identidade: { name: 'Identidade', icon: '👤' },
  // Parkinson specific
  marcha: { name: 'Marcha e Locomoção', icon: '🚶' },
  voz_fala: { name: 'Voz e Fala', icon: '🗣️' },
  tremor_rigidez: { name: 'Tremor e Rigidez', icon: '✋' },
  coordenacao: { name: 'Coordenação', icon: '🎯' }
};

export const professionalActivities: ProfessionalActivity[] = [
  // ==================== TEA - COMUNICAÇÃO ====================
  {
    id: 'tea-com-1',
    title: 'Diálogo Musical Cantado',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Verbal/Não-verbal',
    generalObjective: 'Desenvolver habilidades de comunicação verbal e não-verbal através da música',
    specificObjectives: [
      'Aumentar tentativas de vocalização espontânea',
      'Desenvolver turnos comunicativos através de diálogos cantados',
      'Expandir repertório de palavras funcionais'
    ],
    description: 'O terapeuta inicia uma melodia simples com frases curtas, deixando espaços para o paciente completar. Utiliza-se canções com estrutura previsível (pergunta-resposta). Gradualmente, aumenta-se a complexidade das respostas esperadas. O terapeuta modela a resposta quando necessário e reforça qualquer tentativa comunicativa.',
    materials: ['Violão ou teclado', 'Cartões visuais de apoio', 'Instrumentos de percussão leve'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número de vocalizações espontâneas',
      'Tempo de resposta ao estímulo musical',
      'Qualidade da intenção comunicativa',
      'Manutenção do contato visual durante a interação'
    ],
    adaptations: [
      'Nível 1: Aceitar qualquer vocalização como resposta',
      'Nível 2: Esperar aproximações fonéticas',
      'Nível 3: Solicitar palavras completas ou frases'
    ],
    theoreticalBasis: 'Baseado na Musicoterapia Neurológica (NMT) e princípios de Comunicação Aumentativa e Alternativa (CAA). A melodia facilita a produção de fala ao ativar áreas cerebrais bilaterais.',
    ageRange: '3-12 anos',
    tips: ['Use melodias familiares ao paciente', 'Mantenha tempo musical previsível']
  },
  {
    id: 'tea-com-2',
    title: 'Canções de Rotina',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Linguagem Funcional',
    generalObjective: 'Estimular o uso de linguagem funcional no cotidiano através de canções estruturadas',
    specificObjectives: [
      'Associar palavras a ações da rotina diária',
      'Aumentar vocabulário relacionado a AVDs',
      'Promover antecipação de eventos através da música'
    ],
    description: 'Criação de canções personalizadas para cada momento da rotina (lavar mãos, escovar dentes, guardar brinquedos). A música funciona como âncora para a sequência de ações. Cada etapa da atividade é cantada, com pausas para o paciente completar palavras ou ações.',
    materials: ['Instrumento harmônico', 'Pictogramas das rotinas', 'Objetos reais das atividades'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Antecipação da próxima etapa da rotina',
      'Uso espontâneo de palavras da canção',
      'Independência na realização da sequência'
    ],
    adaptations: [
      'Usar gestos junto com as palavras',
      'Incluir suporte visual com pictogramas',
      'Simplificar melodia para 2-3 notas'
    ],
    theoreticalBasis: 'Fundamentado na abordagem TEACCH e princípios de aprendizagem estruturada. A previsibilidade musical reduz ansiedade e facilita a aquisição de rotinas.',
    ageRange: '2-10 anos'
  },
  // ==================== TEA - SENSORIAL ====================
  {
    id: 'tea-sen-1',
    title: 'Exploração Sonora Gradual',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Dessensibilização Auditiva',
    generalObjective: 'Promover dessensibilização auditiva gradual para sons aversivos',
    specificObjectives: [
      'Aumentar tolerância a sons de diferentes intensidades',
      'Desenvolver capacidade de modulação da resposta sensorial',
      'Criar associações positivas com estímulos sonoros'
    ],
    description: 'Inicia-se com sons suaves e agradáveis ao paciente, introduzindo gradualmente variações de timbre, intensidade e duração. Utiliza-se técnicas de pareamento com estímulos prazerosos (música preferida, vibração tátil). O paciente tem controle sobre a intensidade através de gestos ou instrumentos.',
    materials: ['Instrumentos de diferentes timbres', 'Aplicativo de controle de volume', 'Fones com cancelamento de ruído'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Nível de tolerância a decibéis variados',
      'Tempo de exposição sem reações de evitação',
      'Redução de comportamentos de proteção auditiva'
    ],
    adaptations: [
      'Permitir uso de fones como regulador',
      'Oferecer breaks sensoriais quando necessário',
      'Usar alarmes visuais antes de mudanças sonoras'
    ],
    theoreticalBasis: 'Baseado em princípios de Integração Sensorial (Ayres) e dessensibilização sistemática. A música oferece contexto previsível para exposição gradual.',
    ageRange: '4-18 anos',
    contraindications: ['Hiperacusia severa sem acompanhamento de TO']
  },
  {
    id: 'tea-sen-2',
    title: 'Massagem Sonora',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Integração Tátil-Auditiva',
    generalObjective: 'Integrar estímulos táteis e auditivos para modulação sensorial',
    specificObjectives: [
      'Aumentar consciência corporal através de vibração',
      'Promover relaxamento e regulação do sistema nervoso',
      'Desenvolver aceitação de toque combinado com som'
    ],
    description: 'Utiliza-se instrumentos que produzem vibração (tambor oceano, tigela tibetana, pau de chuva) posicionados próximos ou sobre o corpo do paciente. A vibração é sincronizada com respiração e melodias calmas. O terapeuta gradua a intensidade da vibração conforme resposta do paciente.',
    materials: ['Tambor oceano', 'Tigela tibetana', 'Pau de chuva', 'Almofada vibratória'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Nível de relaxamento muscular observado',
      'Aceitação do instrumento próximo ao corpo',
      'Regulação da respiração durante a atividade'
    ],
    adaptations: [
      'Iniciar com vibração distante do corpo',
      'Permitir que o paciente controle o instrumento',
      'Combinar com pressão profunda se preferido'
    ],
    theoreticalBasis: 'Fundamentado na Terapia de Integração Sensorial e Musicoterapia Vibroacústica. A vibração ativa receptores proprioceptivos e promove organização do SNC.',
    ageRange: '3-adultos'
  },
  // ==================== TEA - SOCIOEMOCIONAL ====================
  {
    id: 'tea-soc-1',
    title: 'Espelho Musical',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Atenção Compartilhada',
    generalObjective: 'Desenvolver habilidades de atenção compartilhada e imitação através de jogos musicais',
    specificObjectives: [
      'Aumentar tempo de atenção conjunta com o outro',
      'Desenvolver habilidades de imitação motora e vocal',
      'Promover sincronia interpessoal'
    ],
    description: 'O terapeuta e o paciente sentam-se frente a frente. O terapeuta toca um padrão rítmico simples e aguarda a imitação. Gradualmente, os papéis se alternam, com o paciente liderando e o terapeuta imitando. Utiliza-se reforço musical (continuação da música) para respostas corretas.',
    materials: ['Dois instrumentos iguais (tambores, claves)', 'Espelho grande (opcional)'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão da imitação rítmica',
      'Tempo de latência entre estímulo e resposta',
      'Iniciativa em liderar a interação',
      'Manutenção do engajamento visual'
    ],
    adaptations: [
      'Simplificar padrões para 1-2 batidas',
      'Usar cores diferentes para cada turno',
      'Adicionar pistas visuais de "sua vez"'
    ],
    theoreticalBasis: 'Baseado em pesquisas sobre neurônios-espelho e sincronia interpessoal. A imitação musical ativa circuitos de reconhecimento social e empatia.',
    ageRange: '3-12 anos'
  },
  {
    id: 'tea-soc-2',
    title: 'Orquestra em Dupla',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Reciprocidade Social',
    generalObjective: 'Promover habilidades de reciprocidade e turnos através de improvisação musical conjunta',
    specificObjectives: [
      'Desenvolver capacidade de esperar a vez',
      'Aumentar responsividade às iniciativas do outro',
      'Criar experiências de sucesso compartilhado'
    ],
    description: 'Terapeuta e paciente formam uma "orquestra" onde cada um tem um papel musical específico. Estabelece-se um código visual ou musical para indicar turnos (ex: pausa = sua vez). Gradualmente, reduz-se as pistas estruturadas para interações mais espontâneas.',
    materials: ['Variedade de instrumentos de percussão', 'Cartões de cores para turnos', 'Metrônomo visual'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Respeito aos turnos estabelecidos',
      'Adaptação ao tempo musical do outro',
      'Iniciativas de interação musical espontânea'
    ],
    adaptations: [
      'Usar timer visual para duração de cada turno',
      'Estabelecer número fixo de batidas por vez',
      'Incluir terceira pessoa como modelo'
    ],
    theoreticalBasis: 'Fundamentado na Musicoterapia Improvisacional (Nordoff-Robbins) e teoria da mente. A música oferece estrutura temporal para interações recíprocas.',
    ageRange: '4-15 anos'
  },
  // ==================== TEA - MOTOR ====================
  {
    id: 'tea-mot-1',
    title: 'Ritmos Corporais',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Coordenação e Praxias',
    generalObjective: 'Desenvolver coordenação motora e praxias através de sequências rítmicas corporais',
    specificObjectives: [
      'Melhorar planejamento motor para sequências de movimentos',
      'Aumentar consciência corporal e esquema corporal',
      'Desenvolver coordenação bilateral'
    ],
    description: 'Criação de sequências de movimentos corporais (palmas, batidas nas pernas, estalar dedos) sincronizados com música. Inicia-se com movimentos simples e unilaterais, progredindo para padrões bilaterais alternados. A música fornece a estrutura temporal para o movimento.',
    materials: ['Sistema de som', 'Espelho', 'Marcadores no chão (opcional)'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão na execução das sequências',
      'Fluidez nos movimentos bilaterais',
      'Sincronização com o pulso musical'
    ],
    adaptations: [
      'Usar cores para identificar lados do corpo',
      'Reduzir velocidade da música',
      'Oferecer modelo físico (mão sobre mão)'
    ],
    theoreticalBasis: 'Baseado na Estimulação Rítmica Auditiva (RAS) da Musicoterapia Neurológica. O ritmo externo organiza o sistema motor e facilita o planejamento de ações.',
    ageRange: '5-18 anos'
  },
  {
    id: 'tea-mot-2',
    title: 'Dança Estruturada',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Planejamento Motor',
    generalObjective: 'Promover planejamento motor sequencial através de coreografias estruturadas',
    specificObjectives: [
      'Desenvolver memória motora para sequências',
      'Aumentar capacidade de seguir instruções multietapas',
      'Melhorar orientação espacial'
    ],
    description: 'Ensino de coreografias simples com movimentos previsíveis e repetitivos. Cada movimento é associado a uma parte específica da música. Utiliza-se apoio visual (vídeo, pictogramas) e modelagem. A mesma sequência é repetida ao longo de várias sessões.',
    materials: ['Vídeos de coreografias simples', 'Pictogramas de movimentos', 'Espaço amplo'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número de passos memorizados',
      'Independência na execução',
      'Antecipação de mudanças de movimento'
    ],
    adaptations: [
      'Reduzir número de passos diferentes',
      'Usar mesma música em todas as sessões',
      'Adicionar marcações no chão para posições'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem motora e memória procedural. A repetição musical ancora as sequências motoras na memória de longo prazo.',
    ageRange: '4-15 anos'
  },
  // ==================== TEA - COGNITIVO ====================
  {
    id: 'tea-cog-1',
    title: 'Sequências Musicais',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória e Sequenciação',
    generalObjective: 'Desenvolver memória sequencial e habilidades de ordenação',
    specificObjectives: [
      'Aumentar span de memória de trabalho',
      'Desenvolver capacidade de reproduzir sequências',
      'Melhorar atenção para detalhes em ordem'
    ],
    description: 'O terapeuta apresenta sequências de sons/notas/instrumentos que o paciente deve reproduzir na ordem correta. Inicia-se com 2 elementos, aumentando gradualmente. Pode-se usar cores, números ou figuras associadas a cada som para apoio visual.',
    materials: ['Sinos coloridos', 'Xilofone', 'Cartões de sequência visual'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número máximo de itens na sequência',
      'Precisão na reprodução',
      'Tempo necessário para memorização'
    ],
    adaptations: [
      'Manter apoio visual durante reprodução',
      'Usar apenas 3-4 sons diferentes',
      'Permitir manipulação física dos objetos sonoros'
    ],
    theoreticalBasis: 'Baseado em pesquisas sobre processamento sequencial e memória auditiva. A música ativa redes de memória de trabalho de forma engajadora.',
    ageRange: '4-15 anos'
  },
  {
    id: 'tea-cog-2',
    title: 'Classificação de Instrumentos',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Categorização',
    generalObjective: 'Desenvolver habilidades de categorização e flexibilidade cognitiva',
    specificObjectives: [
      'Classificar instrumentos por diferentes critérios',
      'Desenvolver pensamento flexível para múltiplas categorias',
      'Aumentar vocabulário relacionado a propriedades sonoras'
    ],
    description: 'Apresenta-se diversos instrumentos que devem ser agrupados por critérios variados: tamanho, material, som (grave/agudo), forma de tocar (soprar, percutir, friccionar). O critério muda durante a atividade, exigindo flexibilidade cognitiva.',
    materials: ['Variedade de instrumentos', 'Cestos ou áreas demarcadas', 'Cartões com critérios'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão na classificação',
      'Flexibilidade para mudar de critério',
      'Justificativa verbal das escolhas'
    ],
    adaptations: [
      'Manter um critério por sessão',
      'Usar suporte visual para cada categoria',
      'Reduzir número de instrumentos'
    ],
    theoreticalBasis: 'Fundamentado em teoria das funções executivas e flexibilidade cognitiva. A manipulação concreta facilita a abstração de categorias.',
    ageRange: '5-12 anos'
  },
  // ==================== TEA - COMPORTAMENTO ====================
  {
    id: 'tea-comp-1',
    title: 'Música de Transição',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Transições e Mudanças',
    generalObjective: 'Facilitar transições entre atividades reduzindo comportamentos disruptivos',
    specificObjectives: [
      'Antecipar mudanças através de sinais musicais',
      'Reduzir ansiedade em momentos de transição',
      'Desenvolver flexibilidade para mudanças de rotina'
    ],
    description: 'Cria-se músicas específicas para cada momento de transição (fim de atividade, mudança de ambiente, chegada de pessoa). A música serve como aviso antecipado e estrutura temporal para a mudança. O tempo da música indica quanto falta para a transição.',
    materials: ['Instrumento portátil', 'Timer visual sincronizado', 'Pictogramas da próxima atividade'],
    estimatedTime: '3-5 minutos por transição',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Redução de comportamentos de resistência',
      'Tempo para iniciar a transição',
      'Regulação emocional durante a mudança'
    ],
    adaptations: [
      'Usar a mesma música para todas as transições inicialmente',
      'Combinar com contagem regressiva visual',
      'Permitir que o paciente finalize a música'
    ],
    theoreticalBasis: 'Baseado na necessidade de previsibilidade do TEA e princípios TEACCH. A música oferece estrutura temporal concreta para eventos abstratos.',
    ageRange: '2-18 anos'
  },
  {
    id: 'tea-comp-2',
    title: 'Contador Musical',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Tolerância à Espera',
    generalObjective: 'Desenvolver tolerância à espera e frustração através de estruturas musicais',
    specificObjectives: [
      'Aumentar tempo de espera tolerado',
      'Desenvolver estratégias de autorregulação durante a espera',
      'Criar previsibilidade para situações de espera'
    ],
    description: 'Utiliza-se músicas com estrutura clara de contagem ou repetição para marcar tempos de espera. O paciente sabe exatamente quando a espera termina através da música. Gradualmente, aumenta-se a duração das músicas/esperas.',
    materials: ['Instrumento rítmico', 'Ampulheta musical', 'Canções de contagem'],
    estimatedTime: 'Variável (1-10 minutos)',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Duração máxima de espera tolerada',
      'Nível de regulação durante a espera',
      'Generalização para outros contextos'
    ],
    adaptations: [
      'Iniciar com esperas muito curtas (10 segundos)',
      'Oferecer instrumento para tocar durante espera',
      'Combinar com estratégias visuais'
    ],
    theoreticalBasis: 'Fundamentado em técnicas comportamentais de aumento gradual e no poder estruturante da música. A previsibilidade musical reduz a ansiedade da incerteza.',
    ageRange: '3-15 anos'
  },

  // ==================== TDAH - ATENÇÃO ====================
  {
    id: 'tdah-at-1',
    title: 'Jogo Stop Musical',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada e Controle Inibitório',
    generalObjective: 'Desenvolver atenção sustentada e controle inibitório através de jogos musicais',
    specificObjectives: [
      'Aumentar tempo de atenção focada em estímulo auditivo',
      'Desenvolver capacidade de inibir resposta motora',
      'Melhorar velocidade de processamento para mudanças'
    ],
    description: 'O paciente move-se livremente enquanto a música toca e deve "congelar" instantaneamente quando a música para. Variações: mudar tipo de movimento conforme o ritmo, parar apenas em determinados instrumentos, realizar ação específica ao parar.',
    materials: ['Sistema de som com controle fácil', 'Espaço amplo', 'Cartões de ações'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de reação ao comando de parar',
      'Manutenção da posição durante a pausa',
      'Sustentação da atenção ao longo da atividade'
    ],
    adaptations: [
      'Reduzir velocidade da música',
      'Aumentar duração entre pausas',
      'Usar sinal visual adicional'
    ],
    theoreticalBasis: 'Baseado em treino de controle inibitório e atenção auditiva. O componente lúdico aumenta a motivação para manutenção atencional.',
    ageRange: '4-12 anos'
  },
  {
    id: 'tdah-at-2',
    title: 'Sequência Rítmica Progressiva',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Fortalecer memória de trabalho através de desafios rítmicos progressivos',
    specificObjectives: [
      'Aumentar span de memória de trabalho auditiva',
      'Desenvolver atenção para detalhes sequenciais',
      'Melhorar capacidade de manipular informações mentalmente'
    ],
    description: 'O terapeuta apresenta padrões rítmicos que o paciente deve memorizar e reproduzir. Inicia-se com 2 batidas, adicionando uma a cada acerto. Variações: reproduzir de trás para frente, adicionar um elemento próprio.',
    materials: ['Tambores ou superfícies de percussão', 'Registro visual de progresso'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número máximo de elementos memorizados',
      'Precisão na reprodução',
      'Manutenção do foco durante a apresentação'
    ],
    adaptations: [
      'Usar timbres diferentes para cada batida',
      'Adicionar componente visual',
      'Permitir vocalização junto com batidas'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre memória de trabalho e treinamento cognitivo. O ritmo facilita a codificação e recuperação de informações.',
    ageRange: '6-15 anos'
  },
  // ==================== TDAH - COMPORTAMENTO ====================
  {
    id: 'tdah-comp-1',
    title: 'Ritmos de Modulação',
    disorder: 'TDAH',
    demandCategory: 'comportamento',
    demandLabel: 'Regulação da Agitação',
    generalObjective: 'Regular nível de ativação motora através de modulação rítmica',
    specificObjectives: [
      'Sincronizar nível de atividade com estímulo musical externo',
      'Desenvolver consciência do próprio nível de ativação',
      'Aprender a usar música como ferramenta de autorregulação'
    ],
    description: 'O terapeuta usa a música para espelhar e depois modular o estado de ativação do paciente. Inicia-se com ritmos que correspondem à energia atual, gradualmente diminuindo ou aumentando conforme objetivo. O paciente é convidado a "seguir" a música com seu corpo.',
    materials: ['Instrumento de percussão', 'Escala visual de energia (termômetro)', 'Músicas pré-selecionadas'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Capacidade de sincronizar com o ritmo',
      'Mudança observável no nível de ativação',
      'Consciência verbal do próprio estado'
    ],
    adaptations: [
      'Usar instrumentos de corpo para maior propriocepção',
      'Combinar com movimento amplo no espaço',
      'Incluir respiração consciente'
    ],
    theoreticalBasis: 'Baseado no ISO Principle da musicoterapia e regulação do sistema nervoso autônomo. O ritmo externo pode entrainment do ritmo interno.',
    ageRange: '5-18 anos'
  },
  {
    id: 'tdah-comp-2',
    title: 'Música e Movimento Controlado',
    disorder: 'TDAH',
    demandCategory: 'comportamento',
    demandLabel: 'Autocontrole Corporal',
    generalObjective: 'Desenvolver controle voluntário do movimento através de estruturas musicais',
    specificObjectives: [
      'Modular velocidade e intensidade do movimento',
      'Desenvolver consciência corporal durante o movimento',
      'Praticar contenção e liberação voluntária'
    ],
    description: 'Atividades de movimento onde a música determina a qualidade do movimento: lento/rápido, grande/pequeno, forte/suave. O paciente deve ajustar seu movimento às mudanças musicais. Inclui momentos de movimento livre alternados com movimentos controlados.',
    materials: ['Músicas com dinâmicas variadas', 'Lenços ou fitas para movimento', 'Espaço amplo'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Adequação do movimento às características musicais',
      'Transições suaves entre tipos de movimento',
      'Contenção nos momentos de movimento lento'
    ],
    adaptations: [
      'Usar sinais visuais adicionais',
      'Delimitar espaço físico do movimento',
      'Alternar com momentos sentado'
    ],
    theoreticalBasis: 'Fundamentado na Rítmica Dalcroze e princípios de educação corporal. O controle externo gradualmente se internaliza.',
    ageRange: '4-14 anos'
  },
  // ==================== TDAH - FUNÇÕES EXECUTIVAS ====================
  {
    id: 'tdah-fe-1',
    title: 'Regência Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento e Organização',
    generalObjective: 'Desenvolver habilidades de planejamento e organização através da regência',
    specificObjectives: [
      'Planejar sequências de eventos musicais',
      'Coordenar múltiplos elementos simultaneamente',
      'Antecipar e preparar mudanças'
    ],
    description: 'O paciente assume o papel de "maestro" de uma pequena orquestra (terapeuta + instrumentos ou grupo). Deve decidir quando cada instrumento entra, a intensidade, e as mudanças. Requer planejamento antecipado e monitoramento contínuo.',
    materials: ['Variedade de instrumentos', 'Batuta ou bastão', 'Cartões de símbolos de regência'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Clareza das indicações dadas',
      'Antecipação de mudanças',
      'Manutenção do plano estabelecido'
    ],
    adaptations: [
      'Começar com apenas 2 instrumentos',
      'Usar símbolos visuais para comandos',
      'Planejar a sequência antes de executar'
    ],
    theoreticalBasis: 'Baseado em demandas de funções executivas da regência musical. Requer integração de planejamento, monitoramento e flexibilidade.',
    ageRange: '7-18 anos'
  },
  {
    id: 'tdah-fe-2',
    title: 'Composição Estruturada',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Iniciar e Completar Tarefas',
    generalObjective: 'Desenvolver habilidade de iniciar e completar projetos através de composição musical',
    specificObjectives: [
      'Quebrar tarefa complexa em etapas menores',
      'Manter foco até completar cada etapa',
      'Experimentar satisfação de conclusão'
    ],
    description: 'Criação de uma música em etapas definidas: escolher tema, criar ritmo, adicionar melodia, escolher instrumentos, gravar. Cada sessão foca em uma etapa. Usa-se checklist visual para acompanhar progresso e celebrar cada conclusão.',
    materials: ['Instrumentos variados', 'Gravador', 'Checklist visual de etapas'],
    estimatedTime: 'Projeto de 4-6 sessões (30 min cada)',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Completude de cada etapa',
      'Persistência diante de dificuldades',
      'Satisfação expressa ao concluir'
    ],
    adaptations: [
      'Subdividir etapas ainda mais',
      'Limitar opções de escolha',
      'Oferecer estruturas pré-definidas para completar'
    ],
    theoreticalBasis: 'Fundamentado em estratégias de manejo do TDAH (quebra de tarefas, reforço imediato) aplicadas à criação musical.',
    ageRange: '8-18 anos'
  },
  // ==================== TDAH - SOCIOEMOCIONAL ====================
  {
    id: 'tdah-soc-1',
    title: 'Grupo Musical Cooperativo',
    disorder: 'TDAH',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação e Espera',
    generalObjective: 'Desenvolver habilidades de cooperação e esperar a vez em contexto grupal',
    specificObjectives: [
      'Praticar esperar sua vez de forma regulada',
      'Contribuir para objetivo comum do grupo',
      'Respeitar o espaço musical do outro'
    ],
    description: 'Atividades musicais em grupo onde cada membro tem um papel específico e deve esperar sua entrada. Criação coletiva de ritmos onde cada pessoa adiciona um elemento por vez. Reforço positivo para espera adequada.',
    materials: ['Um instrumento por participante', 'Sinal visual de turnos', 'Metrônomo'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Respeito aos turnos',
      'Contribuição adequada ao grupo',
      'Regulação durante a espera'
    ],
    adaptations: [
      'Reduzir tempo de espera entre turnos',
      'Dar tarefa (escuta ativa) durante espera',
      'Usar timer visual para cada turno'
    ],
    theoreticalBasis: 'Baseado em aprendizagem social e técnicas comportamentais em grupo. A música oferece estrutura natural para turnos.',
    ageRange: '6-15 anos'
  },
  {
    id: 'tdah-soc-2',
    title: 'Música dos Sentimentos',
    disorder: 'TDAH',
    demandCategory: 'socioemocional',
    demandLabel: 'Reconhecimento Emocional',
    generalObjective: 'Desenvolver reconhecimento e expressão adequada de emoções',
    specificObjectives: [
      'Identificar emoções em expressões musicais',
      'Expressar próprias emoções através da música',
      'Ampliar vocabulário emocional'
    ],
    description: 'Escuta de trechos musicais com diferentes "climas" emocionais para identificação. Improvisação musical para expressar como está se sentindo. Conexão entre características musicais (rápido/lento, forte/suave) e estados emocionais.',
    materials: ['Playlist de músicas com diferentes emoções', 'Cartões de emoções', 'Instrumentos expressivos'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Precisão na identificação de emoções',
      'Coerência na expressão musical de emoções',
      'Verbalização sobre próprias emoções'
    ],
    adaptations: [
      'Usar apenas emoções básicas (4-5)',
      'Oferecer opções de escolha forçada',
      'Combinar com expressão facial e corporal'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre música e emoção, e alfabetização emocional. A música é veículo privilegiado para acesso emocional.',
    ageRange: '5-15 anos'
  },
  // ==================== TDAH - MOTOR ====================
  {
    id: 'tdah-mot-1',
    title: 'Circuito Rítmico',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Canalização de Energia',
    generalObjective: 'Canalizar energia motora excessiva de forma funcional e organizada',
    specificObjectives: [
      'Direcionar agitação para atividade estruturada',
      'Desenvolver resistência e regulação do esforço',
      'Integrar movimento amplo com ritmo'
    ],
    description: 'Circuito de atividades motoras (pular, correr, rastejar) sincronizadas com música rítmica. Cada estação tem duração definida pela música. Alternância entre alta e baixa intensidade para treinar modulação.',
    materials: ['Sistema de som', 'Materiais de circuito (cones, colchonetes)', 'Cronômetro visual'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Sincronização com o ritmo da música',
      'Modulação da intensidade conforme demanda',
      'Manutenção de organização no circuito'
    ],
    adaptations: [
      'Reduzir número de estações',
      'Aumentar tempo de recuperação',
      'Simplificar movimentos exigidos'
    ],
    theoreticalBasis: 'Baseado em abordagens de movimento terapêutico e necessidade de descarga motora do TDAH. O ritmo organiza o movimento.',
    ageRange: '5-14 anos'
  },
  {
    id: 'tdah-mot-2',
    title: 'Bateria Corporal',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Bilateral',
    generalObjective: 'Desenvolver coordenação bilateral e integração sensório-motora',
    specificObjectives: [
      'Coordenar movimentos de ambos os lados do corpo',
      'Desenvolver ritmo interno e tempo musical',
      'Melhorar propriocepção e consciência corporal'
    ],
    description: 'Criação de ritmos usando o corpo como instrumento (palmas, batidas no peito, pernas, pés). Inicia-se com padrões simples, progredindo para combinações bilaterais alternadas. Body percussion com música de fundo.',
    materials: ['Espaço para movimento', 'Espelho (opcional)', 'Vídeos de body percussion'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão nas sequências bilaterais',
      'Fluidez nos movimentos',
      'Independência para criar padrões'
    ],
    adaptations: [
      'Usar superfícies externas (mesa) ao invés do corpo',
      'Simplificar para movimento unilateral',
      'Desacelerar o andamento'
    ],
    theoreticalBasis: 'Fundamentado em princípios de integração bilateral e estimulação vestibular. A percussão corporal ativa múltiplos sistemas sensoriais.',
    ageRange: '6-18 anos'
  },

  // ==================== TOD - COMPORTAMENTO ====================
  {
    id: 'tod-comp-1',
    title: 'Negociação Musical',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Aceitação de Regras',
    generalObjective: 'Desenvolver habilidade de negociar e aceitar regras em contexto musical',
    specificObjectives: [
      'Praticar ceder em algumas escolhas',
      'Experimentar consequências de acordos cumpridos',
      'Desenvolver flexibilidade diante de regras'
    ],
    description: 'Atividade estruturada onde paciente e terapeuta negociam aspectos da sessão (qual música, qual instrumento, quanto tempo). O terapeuta modela ceder em alguns pontos e ser firme em outros. Acordos são registrados e consequências naturais aplicadas.',
    materials: ['Quadro de acordos', 'Opções visuais de escolhas', 'Instrumentos variados'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Disposição para negociar',
      'Cumprimento de acordos feitos',
      'Regulação diante de limites mantidos'
    ],
    adaptations: [
      'Oferecer escolhas limitadas (2-3 opções)',
      'Dar mais poder de escolha inicialmente',
      'Usar sistema visual de negociação'
    ],
    theoreticalBasis: 'Baseado em estratégias de manejo do TOD e economia de fichas. A música é contexto motivador para praticar negociação.',
    ageRange: '5-15 anos',
    contraindications: ['Fase aguda de desregulação']
  },
  {
    id: 'tod-comp-2',
    title: 'Líder por um Dia',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Exercício de Autoridade',
    generalObjective: 'Oferecer exercício saudável de autoridade e controle',
    specificObjectives: [
      'Experimentar liderança de forma positiva',
      'Desenvolver responsabilidade com o poder',
      'Praticar dar instruções respeitosas'
    ],
    description: 'O paciente assume papel de "diretor musical", dando instruções ao terapeuta sobre como tocar. Precisa dar instruções claras e respeitosas para ser "obedecido". O terapeuta modela como seguir instruções e também como recusar instruções inadequadas.',
    materials: ['Instrumentos variados', 'Chapéu ou crachá de "líder"', 'Cartões de comandos'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tom respeitoso nas instruções',
      'Aceitação de limites colocados',
      'Satisfação com papel de líder positivo'
    ],
    adaptations: [
      'Definir claramente o que pode e não pode pedir',
      'Alternar papéis na mesma sessão',
      'Usar roteiro parcialmente estruturado'
    ],
    theoreticalBasis: 'Fundamentado na compreensão de que TOD envolve luta por controle. Oferecer controle legítimo reduz necessidade de oposição.',
    ageRange: '6-14 anos'
  },
  // ==================== TOD - CONTROLE EMOCIONAL ====================
  {
    id: 'tod-ce-1',
    title: 'Tambor da Raiva',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Expressão da Raiva',
    generalObjective: 'Oferecer canal seguro e socialmente aceito para expressar raiva',
    specificObjectives: [
      'Liberar tensão através de descarga motora musical',
      'Desenvolver consciência da intensidade da raiva',
      'Aprender modulação gradual da expressão de raiva'
    ],
    description: 'O paciente é convidado a "colocar a raiva no tambor" através de batidas. O terapeuta valida a emoção e acompanha musicalmente. Gradualmente, guia a intensidade: muito forte → forte → médio → suave. Verbalização após a descarga.',
    materials: ['Tambor resistente', 'Baquetas adequadas', 'Espaço seguro'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Capacidade de usar o tambor ao invés de outros comportamentos',
      'Modulação da intensidade conforme orientação',
      'Verbalização sobre a emoção após a atividade'
    ],
    adaptations: [
      'Oferecer outras formas de descarga (almofadas)',
      'Usar proteção auditiva se necessário',
      'Ter objeto de transição para acalmar depois'
    ],
    theoreticalBasis: 'Baseado em princípios de catarse controlada e canalização de emoções. A música contém e valida a expressão emocional.',
    ageRange: '4-18 anos',
    tips: ['Não forçar se o paciente não quiser', 'Estar preparado para aumento inicial de intensidade']
  },
  {
    id: 'tod-ce-2',
    title: 'Música de Descarga',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Canalização de Energia Negativa',
    generalObjective: 'Transformar energia negativa em expressão musical criativa',
    specificObjectives: [
      'Sublimar impulsos agressivos através da música',
      'Desenvolver formas alternativas de expressão',
      'Experienciar que emoções intensas podem ter saída segura'
    ],
    description: 'Criação de música "pesada" ou "barulhenta" que represente o estado emocional negativo. O paciente escolhe instrumentos e toca livremente enquanto o terapeuta acompanha. A intensidade é permitida dentro de limites de segurança. Reflexão posterior sobre a experiência.',
    materials: ['Instrumentos de percussão', 'Guitarra/baixo (se disponível)', 'Amplificador com distorção'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento na atividade expressiva',
      'Respeito aos limites de segurança',
      'Mudança no estado emocional após atividade'
    ],
    adaptations: [
      'Oferecer fones para maior imersão',
      'Limitar tempo de "descarga"',
      'Estruturar mais a forma musical'
    ],
    theoreticalBasis: 'Fundamentado em musicoterapia expressiva e canalização de impulsos. A forma musical dá contorno à energia desorganizada.',
    ageRange: '6-18 anos'
  },
  // ==================== TOD - SOCIOEMOCIONAL ====================
  {
    id: 'tod-soc-1',
    title: 'Orquestra Democrática',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Respeitar Decisões do Grupo',
    generalObjective: 'Desenvolver capacidade de aceitar decisões coletivas',
    specificObjectives: [
      'Participar de processos de votação e escolha grupal',
      'Aceitar quando sua preferência não é escolhida',
      'Contribuir positivamente mesmo discordando'
    ],
    description: 'Em grupo, decisões musicais são tomadas por votação: qual música tocar, qual instrumento usar, quanto tempo para cada parte. O paciente experimenta ganhar e perder votações, e precisa participar mesmo quando sua escolha não vence.',
    materials: ['Sistema de votação visual', 'Instrumentos para o grupo', 'Quadro de decisões'],
    estimatedTime: '35-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Participação no processo de escolha',
      'Regulação quando perde votação',
      'Contribuição positiva mesmo discordando'
    ],
    adaptations: [
      'Garantir algumas vitórias iniciais',
      'Ter papel importante mesmo quando perde',
      'Processar individualmente antes do grupo'
    ],
    theoreticalBasis: 'Baseado em aprendizagem social e desenvolvimento moral. O grupo musical é microcosmo para praticar democracia.',
    ageRange: '7-16 anos'
  },
  {
    id: 'tod-soc-2',
    title: 'Dueto Colaborativo',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação com o Outro',
    generalObjective: 'Desenvolver habilidades de cooperação em díade',
    specificObjectives: [
      'Sincronizar com o outro musicalmente',
      'Alternar entre liderar e seguir',
      'Criar produto conjunto satisfatório para ambos'
    ],
    description: 'Terapeuta e paciente criam uma música juntos onde ambos precisam contribuir. Alternância de quem lidera a direção musical. Negociação de como a música será. O sucesso depende da cooperação.',
    materials: ['Dois instrumentos complementares', 'Gravador', 'Partitura visual simples'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Qualidade da sincronia musical',
      'Disposição para alternar papéis',
      'Satisfação com produto final conjunto'
    ],
    adaptations: [
      'Definir papéis mais claramente',
      'Dar mais liderança inicialmente',
      'Usar estrutura musical mais rígida'
    ],
    theoreticalBasis: 'Fundamentado em musicoterapia improvisacional e teoria do apego. A criação conjunta desenvolve mutualidade.',
    ageRange: '5-18 anos'
  },
  // ==================== TOD - COGNIÇÃO ====================
  {
    id: 'tod-cog-1',
    title: 'Consequências Musicais',
    disorder: 'TOD',
    demandCategory: 'cognitivo',
    demandLabel: 'Causa e Efeito',
    generalObjective: 'Desenvolver compreensão de causa e efeito através de experiências musicais',
    specificObjectives: [
      'Vivenciar consequências naturais de escolhas musicais',
      'Antecipar resultados de ações',
      'Conectar comportamento e consequência'
    ],
    description: 'Atividades onde as escolhas musicais do paciente têm consequências claras: tocar suave = música continua bonita; tocar desorganizado = música fica confusa. O terapeuta espelha musicalmente as escolhas do paciente, mostrando o impacto.',
    materials: ['Instrumentos responsivos', 'Sistema de gravação para playback'],
    estimatedTime: '25-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Compreensão da relação ação-resultado',
      'Mudança de comportamento baseada em feedback',
      'Verbalização sobre consequências'
    ],
    adaptations: [
      'Tornar consequências mais imediatas',
      'Usar sistema visual de causa-efeito',
      'Repetir experiências várias vezes'
    ],
    theoreticalBasis: 'Baseado em aprendizagem por consequências naturais e pensamento causal. A música oferece feedback imediato e não punitivo.',
    ageRange: '5-14 anos'
  },
  {
    id: 'tod-cog-2',
    title: 'Histórias Sonoras Morais',
    disorder: 'TOD',
    demandCategory: 'cognitivo',
    demandLabel: 'Desenvolvimento da Empatia',
    generalObjective: 'Desenvolver empatia e perspectiva do outro através de narrativas musicais',
    specificObjectives: [
      'Representar musicalmente diferentes perspectivas',
      'Reconhecer sentimentos dos personagens',
      'Conectar ações com impacto nos outros'
    ],
    description: 'Criação de histórias sonoras com personagens que enfrentam dilemas morais. Cada personagem tem um tema musical. O paciente ajuda a criar e resolver a história, considerando diferentes pontos de vista. Discussão sobre como cada personagem se sentiu.',
    materials: ['Instrumentos variados para personagens', 'Fantoches ou figuras', 'Roteiro visual da história'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Identificação de emoções dos personagens',
      'Consideração de múltiplas perspectivas',
      'Soluções propostas que consideram o outro'
    ],
    adaptations: [
      'Usar histórias simples e concretas',
      'Focar em apenas dois personagens',
      'Relacionar com situações reais do paciente'
    ],
    theoreticalBasis: 'Fundamentado em desenvolvimento moral (Kohlberg) e teoria da mente. A música facilita entrada empática nos personagens.',
    ageRange: '6-14 anos'
  },
  // ==================== TOD - AUTORREGULAÇÃO ====================
  {
    id: 'tod-ar-1',
    title: 'Termômetro Musical',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Identificar Níveis de Irritação',
    generalObjective: 'Desenvolver consciência dos próprios níveis de irritação',
    specificObjectives: [
      'Identificar sinais corporais de irritação crescente',
      'Usar escala para comunicar nível de raiva',
      'Desenvolver vocabulário emocional graduado'
    ],
    description: 'Criação de uma escala musical de 1-5 representando níveis de irritação (calmo até muito irritado). Cada nível tem uma música/som característico. O paciente usa a escala para comunicar como está se sentindo ao longo da sessão e aprende a identificar quando está subindo.',
    materials: ['Termômetro visual grande', 'Sons gravados para cada nível', 'Instrumento do paciente'],
    estimatedTime: 'Uso contínuo nas sessões (5-10 min por vez)',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Precisão na auto-avaliação',
      'Identificação antes de atingir nível máximo',
      'Uso espontâneo da escala'
    ],
    adaptations: [
      'Reduzir para 3 níveis',
      'Usar cores junto com sons',
      'Terapeuta oferece palpites inicialmente'
    ],
    theoreticalBasis: 'Baseado em técnicas de regulação emocional e consciência interoceptiva. A música concretiza estados internos abstratos.',
    ageRange: '5-15 anos'
  },
  {
    id: 'tod-ar-2',
    title: 'Músicas de Calma',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Estratégias de Auto-acalmar',
    generalObjective: 'Desenvolver e praticar estratégias musicais de autorregulação',
    specificObjectives: [
      'Criar playlist pessoal de músicas calmantes',
      'Usar música de forma autônoma para regular',
      'Associar música com técnicas de respiração'
    ],
    description: 'Construção de um "kit de calma musical" personalizado. Exploração de diferentes músicas e sons para descobrir o que ajuda a acalmar. Prática de usar as músicas em momentos de calma para depois usar em momentos de irritação. Combinação com respiração.',
    materials: ['Player de música portátil', 'Fones de ouvido', 'Diário de regulação'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Construção de repertório pessoal',
      'Uso efetivo em momentos de irritação',
      'Generalização para casa/escola'
    ],
    adaptations: [
      'Criar versão física (CD, playlist)',
      'Envolver família no uso',
      'Incluir músicas preferidas mesmo se não "calmas"'
    ],
    theoreticalBasis: 'Fundamentado em técnicas de coping e regulação emocional. A música escolhida pelo paciente tem maior efetividade.',
    ageRange: '6-18 anos'
  },

  // ==================== DI - COMUNICAÇÃO ====================
  {
    id: 'di-com-1',
    title: 'Canções de AVDs',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Vocabulário Funcional',
    generalObjective: 'Desenvolver vocabulário funcional relacionado a atividades de vida diária',
    specificObjectives: [
      'Associar palavras a objetos e ações do cotidiano',
      'Aumentar repertório de vocabulário útil',
      'Promover uso espontâneo de palavras aprendidas'
    ],
    description: 'Criação de canções simples sobre atividades do dia a dia (comer, vestir, tomar banho) que nomeiam objetos e ações. Cada canção é acompanhada de gestos e objetos reais. Repetição consistente para fixação do vocabulário.',
    materials: ['Objetos reais das AVDs', 'Pictogramas', 'Instrumento acompanhador'],
    estimatedTime: '20-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Número de palavras novas incorporadas',
      'Uso espontâneo do vocabulário',
      'Associação correta objeto-palavra'
    ],
    adaptations: [
      'Usar apenas 2-3 palavras por canção',
      'Repetir mesma canção por várias sessões',
      'Apoio visual constante'
    ],
    theoreticalBasis: 'Baseado em princípios de aquisição de linguagem e aprendizagem significativa. A música facilita memorização através de melodia e repetição.',
    ageRange: '3-adultos'
  },
  {
    id: 'di-com-2',
    title: 'Música de Saudação',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Interações Sociais Básicas',
    generalObjective: 'Desenvolver habilidades de interação social básica através de canções estruturadas',
    specificObjectives: [
      'Aprender scripts de saudação',
      'Responder a cumprimentos de forma adequada',
      'Iniciar interações sociais simples'
    ],
    description: 'Canções de olá e tchau com estrutura previsível que ensinam como cumprimentar, perguntar o nome, dizer como está. O terapeuta modela e espera resposta do paciente. Mesma estrutura usada em todas as sessões para criar rotina.',
    materials: ['Canções de saudação', 'Espelho', 'Fantoches (opcional)'],
    estimatedTime: '10-15 minutos (início e fim de sessão)',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Participação na rotina de saudação',
      'Respostas verbais/gestuais adequadas',
      'Generalização para outros contextos'
    ],
    adaptations: [
      'Aceitar gestos como resposta',
      'Usar apoio visual para respostas',
      'Simplificar melodia e letra'
    ],
    theoreticalBasis: 'Fundamentado em scripts sociais e rotinas estruturadas. A previsibilidade musical facilita a aprendizagem de convenções sociais.',
    ageRange: '3-adultos'
  },
  // ==================== DI - COGNITIVO ====================
  {
    id: 'di-cog-1',
    title: 'Pareamento Sonoro',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Associação e Memória',
    generalObjective: 'Desenvolver habilidades de associação e memória através de jogos sonoros',
    specificObjectives: [
      'Associar sons a objetos ou imagens',
      'Memorizar pares som-figura',
      'Desenvolver atenção auditiva'
    ],
    description: 'Jogo de memória onde o paciente deve encontrar pares combinando sons a figuras ou objetos. Sons de animais, instrumentos ou objetos do cotidiano. Progressão de 2 pares para mais, conforme capacidade.',
    materials: ['Cartões sonoros ou app', 'Cartões de imagens correspondentes', 'Objetos reais'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Número de pares identificados',
      'Tempo para completar pareamento',
      'Memória de pares já encontrados'
    ],
    adaptations: [
      'Manter cartões de imagem visíveis',
      'Usar apenas 2-3 pares',
      'Sons muito distintos entre si'
    ],
    theoreticalBasis: 'Baseado em aprendizagem por associação e memória de trabalho. Modalidade auditiva diversifica vias de aprendizagem.',
    ageRange: '4-adultos'
  },
  {
    id: 'di-cog-2',
    title: 'Sequência de 3 Sons',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória Sequencial',
    generalObjective: 'Desenvolver memória sequencial simples através de padrões sonoros',
    specificObjectives: [
      'Memorizar e reproduzir sequências curtas',
      'Desenvolver atenção para ordem de eventos',
      'Aumentar span de memória auditiva'
    ],
    description: 'O terapeuta apresenta sequências de 2-3 sons que o paciente deve reproduzir na ordem. Usa-se instrumentos de timbres muito diferentes para facilitar discriminação. Pode-se usar apoio visual de cores ou números.',
    materials: ['3 instrumentos de timbres distintos', 'Cartões de cores correspondentes', 'Suporte de sequência'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Precisão na reprodução de ordem',
      'Número máximo de sons na sequência',
      'Necessidade de apoio visual'
    ],
    adaptations: [
      'Manter em 2 sons',
      'Usar sempre apoio visual',
      'Usar sons do cotidiano (mais significativos)'
    ],
    theoreticalBasis: 'Fundamentado em desenvolvimento de memória sequencial e processamento auditivo. Capacidade fundamental para muitas aprendizagens.',
    ageRange: '4-adultos'
  },
  // ==================== DI - AUTONOMIA ====================
  {
    id: 'di-aut-1',
    title: 'Rotinas Musicais',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Independência em AVDs',
    generalObjective: 'Promover independência em atividades de vida diária através de suporte musical',
    specificObjectives: [
      'Completar sequências de atividades com apoio musical',
      'Reduzir necessidade de pistas verbais',
      'Aumentar autonomia em rotinas básicas'
    ],
    description: 'Criação de músicas-guia para rotinas completas (escovar dentes, lavar mãos, vestir-se). Cada etapa da rotina corresponde a uma parte da música. A música funciona como prompt que pode ser gradualmente removido.',
    materials: ['Gravações das músicas de rotina', 'Player portátil para casa', 'Pictogramas da sequência'],
    estimatedTime: 'Integrado em rotinas (5-10 min cada)',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Nível de independência com apoio musical',
      'Número de etapas completadas sem ajuda',
      'Manutenção quando música é removida'
    ],
    adaptations: [
      'Subdividir rotinas em etapas menores',
      'Usar mesma música para várias rotinas',
      'Combinar com apoio físico inicial'
    ],
    theoreticalBasis: 'Baseado em uso de estímulos auditivos como prompts e encadeamento de comportamentos. A música é menos intrusiva que prompt verbal.',
    ageRange: '4-adultos'
  },
  {
    id: 'di-aut-2',
    title: 'Música das Etapas',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Completar Tarefas',
    generalObjective: 'Desenvolver capacidade de completar tarefas com apoio estruturado',
    specificObjectives: [
      'Seguir sequência de etapas até conclusão',
      'Manter motivação ao longo da tarefa',
      'Celebrar conclusão de forma apropriada'
    ],
    description: 'Cada tarefa é dividida em etapas claras, cada uma com sua parte musical. A música só continua quando a etapa é completada. Música de "vitória" ao completar toda a tarefa. Registro visual de progresso.',
    materials: ['Músicas curtas para cada etapa', 'Checklist visual', 'Recompensa musical final'],
    estimatedTime: 'Variável conforme tarefa',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Proporção de tarefas completadas',
      'Necessidade de redirecionamento',
      'Persistência diante de dificuldades'
    ],
    adaptations: [
      'Menos etapas por tarefa',
      'Recompensas musicais mais frequentes',
      'Ajuda física nas etapas difíceis'
    ],
    theoreticalBasis: 'Fundamentado em reforçamento positivo e estruturação de tarefas. A música funciona como reforçador natural e marcador de progresso.',
    ageRange: '4-adultos'
  },
  // ==================== DI - MOTOR ====================
  {
    id: 'di-mot-1',
    title: 'Movimento Simples com Música',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Básica',
    generalObjective: 'Desenvolver coordenação motora básica através de movimentos simples com música',
    specificObjectives: [
      'Sincronizar movimentos simples com pulso musical',
      'Melhorar controle motor grosso',
      'Aumentar consciência corporal'
    ],
    description: 'Movimentos amplos e simples (bater palmas, bater pés, balançar braços) sincronizados com música de pulso claro e andamento lento. Repetição consistente dos mesmos movimentos. Progressão muito gradual de complexidade.',
    materials: ['Músicas de pulso claro', 'Espaço amplo', 'Espelho (opcional)'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Sincronização com o pulso',
      'Qualidade do movimento',
      'Manutenção da atividade no tempo'
    ],
    adaptations: [
      'Desacelerar andamento musical',
      'Oferecer modelo físico',
      'Usar movimento de apenas uma parte do corpo'
    ],
    theoreticalBasis: 'Baseado em Estimulação Rítmica Auditiva e desenvolvimento motor. O ritmo externo organiza e facilita padrões de movimento.',
    ageRange: '3-adultos'
  },
  {
    id: 'di-mot-2',
    title: 'Manipulação de Instrumentos',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Fina',
    generalObjective: 'Desenvolver coordenação motora fina através da manipulação de instrumentos',
    specificObjectives: [
      'Melhorar preensão e manipulação de objetos',
      'Desenvolver controle de força',
      'Aumentar precisão de movimentos'
    ],
    description: 'Exploração de instrumentos que exigem diferentes tipos de preensão e manipulação: guizo (preensão palmar), sino (pinça), reco-reco (deslizamento), castanhola (abertura-fechamento). Cada instrumento é explorado livremente e depois em contexto musical.',
    materials: ['Variedade de instrumentos de fácil manipulação', 'Suporte para instrumentos'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Qualidade da preensão',
      'Controle do instrumento',
      'Produção sonora adequada'
    ],
    adaptations: [
      'Adaptar pegas dos instrumentos',
      'Usar instrumentos maiores',
      'Fixar instrumentos em suporte'
    ],
    theoreticalBasis: 'Fundamentado em desenvolvimento motor fino e motivação intrínseca. O som imediato reforça tentativas de manipulação.',
    ageRange: '3-adultos'
  },
  // ==================== DI - SOCIOEMOCIONAL ====================
  {
    id: 'di-soc-1',
    title: 'Música do Amigo',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Reconhecimento do Outro',
    generalObjective: 'Desenvolver reconhecimento e interesse pelo outro através de canções personalizadas',
    specificObjectives: [
      'Reconhecer nomes de pessoas do convívio',
      'Desenvolver interesse pelo outro',
      'Criar conexões afetivas mediadas pela música'
    ],
    description: 'Criação de canções que mencionam e descrevem pessoas importantes (família, amigos, professores). Uso de fotos durante a música. Canções de "olá" que nomeiam cada pessoa. Música como ponte para relacionamentos.',
    materials: ['Fotos de pessoas significativas', 'Canções personalizadas gravadas', 'Instrumento acompanhador'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Reconhecimento de pessoas por nome/foto',
      'Resposta afetiva às músicas sobre pessoas',
      'Iniciativa em interações sociais'
    ],
    adaptations: [
      'Começar com apenas 2-3 pessoas',
      'Usar mesma melodia para todas as pessoas',
      'Incluir objeto significativo da pessoa'
    ],
    theoreticalBasis: 'Baseado em desenvolvimento de apego e reconhecimento social. A música carrega carga afetiva que facilita conexão.',
    ageRange: '3-adultos'
  },
  {
    id: 'di-soc-2',
    title: 'Celebração Musical',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Autoestima e Pertencimento',
    generalObjective: 'Promover autoestima e senso de pertencimento através de celebrações musicais',
    specificObjectives: [
      'Experienciar sucesso e reconhecimento',
      'Desenvolver autoimagem positiva',
      'Sentir-se parte de um grupo'
    ],
    description: 'Músicas de celebração para conquistas (grandes e pequenas). Canções que falam sobre qualidades do paciente. Rituais musicais de pertencimento ao grupo (música "nossa", hino do grupo). Reconhecimento consistente através da música.',
    materials: ['Músicas de celebração', 'Certificados musicais', 'Símbolos do grupo'],
    estimatedTime: '10-15 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Resposta afetiva às celebrações',
      'Expressões de orgulho e satisfação',
      'Identificação com o grupo'
    ],
    adaptations: [
      'Celebrar progressos muito pequenos',
      'Usar mesma música de celebração',
      'Incluir família nas celebrações'
    ],
    theoreticalBasis: 'Fundamentado em psicologia positiva e necessidade de pertencimento. A música amplifica experiências emocionais positivas.',
    ageRange: '3-adultos'
  },
  {
    id: 'tea-com-3',
    title: 'Pictograma Cantado',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Aumentativa',
    generalObjective: 'Associar pictogramas a melodias para ampliar repertório de pedidos funcionais',
    specificObjectives: [
      'Aumento de pedidos espontâneos',
      'Generalização para outros contextos',
      'Redução de comportamentos disruptivos por frustração'
    ],
    description: 'O terapeuta apresenta um cartão pictográfico (água, brincar, ajuda) e canta uma melodia curta que o representa. O paciente é encorajado a apontar e vocalizar enquanto a melodia toca. Gradualmente, retira-se o apoio melódico mantendo apenas o pictograma.',
    materials: ['Cartões PECS', 'Teclado', 'Quadro de comunicação'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Iniciar com 2 pictogramas',
      'Usar fotos reais no lugar de desenhos',
      'Permitir resposta apenas com o gesto'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-com-4',
    title: 'Canção dos Nomes',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Identificação Pessoal',
    generalObjective: 'Reforçar reconhecimento do próprio nome e dos pares através de canção interativa',
    specificObjectives: [
      'Reconhecimento do próprio nome',
      'Resposta consistente ao ser chamado',
      'Olhar dirigido ao colega nomeado'
    ],
    description: 'O grupo (ou dupla) senta em círculo. Canta-se uma canção simples ("Quem está aqui hoje?") nomeando cada participante por vez, que responde com gesto, som ou palavra. A previsibilidade da estrutura facilita antecipação e participação.',
    materials: ['Violão', 'Espelho', 'Fotos dos participantes'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir grupo a dupla',
      'Usar foto como pista visual',
      'Aceitar qualquer forma de resposta'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-com-5',
    title: 'Histórias Sonorizadas',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Compreensão Narrativa',
    generalObjective: 'Desenvolver compreensão de narrativas curtas com apoio sonoro',
    specificObjectives: [
      'Antecipação dos sons',
      'Atenção sustentada à história',
      'Repetição de palavras-chave'
    ],
    description: 'O terapeuta lê uma história simples acompanhada de efeitos sonoros (instrumentos) para cada elemento. O paciente é convidado a produzir o som no momento certo, antecipando-se à narrativa.',
    materials: ['Livro ilustrado', 'Caixa de efeitos sonoros', 'Instrumentos pequenos'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir história a 3 cenas',
      'Usar apenas 2 instrumentos',
      'Repetir mesma história por sessões'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-com-6',
    title: 'Diálogo Instrumental',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Pragmática Não-Verbal',
    generalObjective: 'Estabelecer turnos comunicativos não-verbais por meio de instrumentos',
    specificObjectives: [
      'Respeito aos turnos',
      'Variação na resposta musical',
      'Iniciativa em propor mudança'
    ],
    description: 'Terapeuta e paciente "conversam" por meio de instrumentos: um toca uma frase rítmica, o outro responde. As pausas marcam os turnos. A intenção comunicativa é valorizada acima da técnica musical.',
    materials: ['Dois tambores', 'Maracás', 'Sinos'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Marcar turnos com cartão visual',
      'Usar metrônomo para ritmo',
      'Modelar respostas com mão sobre mão'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-com-7',
    title: 'Mímica Musical',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Expressão Corporal',
    generalObjective: 'Estimular expressão de necessidades por meio de gestos sincronizados à música',
    specificObjectives: [
      'Associação música-ação',
      'Iniciativa de escolha',
      'Generalização para casa'
    ],
    description: 'Diferentes músicas representam ações (comer, dormir, brincar). O paciente escuta e executa o gesto correspondente, gradualmente passando a escolher a música conforme a necessidade.',
    materials: ['Playlist temática', 'Cartões de ação', 'Espaço amplo'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir a 2 músicas',
      'Mostrar vídeo do gesto',
      'Modelar fisicamente'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-com-8',
    title: 'Karaokê Adaptado',
    disorder: 'TEA',
    demandCategory: 'comunicacao',
    demandLabel: 'Produção Vocal',
    generalObjective: 'Promover produção vocal e prosódia através de canto guiado',
    specificObjectives: [
      'Tentativas vocais espontâneas',
      'Modulação de intensidade vocal',
      'Participação em mais de uma estrofe'
    ],
    description: 'Utiliza-se karaokê com letra grande e apoio visual de pictogramas. As músicas são escolhidas pelo paciente e a velocidade é ajustável. O foco é a participação vocal, não a perfeição.',
    materials: ['Tablet com karaokê', 'Microfone', 'Letras impressas com pictogramas'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Cantar apenas refrão',
      'Reduzir velocidade ao mínimo',
      'Permitir hum sem palavras'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-sen-3',
    title: 'Banho Sonoro Calmante',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Regulação Autonômica',
    generalObjective: 'Promover redução da ativação simpática através de paisagem sonora suave',
    specificObjectives: [
      'Diminuição da frequência respiratória',
      'Relaxamento muscular visível',
      'Tempo até relaxamento'
    ],
    description: 'Paciente deita-se confortavelmente. O terapeuta executa uma paisagem sonora contínua com tigelas, sinos e voz, ajustando intensidade conforme respiração e sinais corporais. Sessão silenciosa do ponto de vista verbal.',
    materials: ['Tigelas tibetanas', 'Sinos koshi', 'Colchonete', 'Cobertor pesado'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Permitir sentar em vez de deitar',
      'Reduzir tempo inicial a 5 minutos',
      'Oferecer fone se preferido'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-sen-4',
    title: 'Caça aos Sons',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Discriminação Auditiva',
    generalObjective: 'Desenvolver atenção e discriminação auditiva fina',
    specificObjectives: [
      'Tempo para localizar',
      'Estratégias de busca utilizadas',
      'Precisão direcional'
    ],
    description: 'Esconde-se uma fonte sonora (caixinha musical) no ambiente. O paciente deve localizá-la apenas pelo som. Aumenta-se gradualmente a complexidade (sons mais baixos, ambientes maiores).',
    materials: ['Caixinha de música', 'Aplicativo de sons', 'Venda (opcional)'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Iniciar com objeto à vista',
      'Aumentar volume',
      'Dar pistas verbais'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-sen-5',
    title: 'Texturas Sonoras',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Integração Tátil-Auditiva',
    generalObjective: 'Integrar estímulos táteis e auditivos por meio de instrumentos com diferentes superfícies',
    specificObjectives: [
      'Tempo de exploração de cada textura',
      'Preferências consistentes',
      'Tolerância a texturas aversivas'
    ],
    description: 'Apresenta-se ao paciente instrumentos com texturas variadas (madeira, metal, pele). Ele explora cada um livremente, sendo encorajado a verbalizar ou apontar preferências.',
    materials: ['Reco-reco', 'Triângulo', 'Tambor de pele', 'Pau de chuva'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Limitar a 2 texturas por vez',
      'Oferecer luva fina se necessário',
      'Demonstrar uso primeiro'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-sen-6',
    title: 'Vibração Direcionada',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Propriocepção',
    generalObjective: 'Aumentar consciência corporal e modulação sensorial via vibração',
    specificObjectives: [
      'Aceitação da vibração',
      'Identificação corporal',
      'Relaxamento pós-atividade'
    ],
    description: 'Tigela tibetana é colocada próxima a diferentes partes do corpo (mãos, pés, costas) com permissão. O paciente identifica onde "sente" o som, mapeando o corpo.',
    materials: ['Tigela tibetana grande', 'Esteira', 'Almofada vibratória'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Manter distância inicial',
      'Permitir que o paciente segure a tigela',
      'Reduzir tempo de exposição'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-sen-7',
    title: 'Música e Movimento Lento',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Modulação Sensorial',
    generalObjective: 'Promover modulação sensorial integrando música lenta e movimento corporal',
    specificObjectives: [
      'Engajamento no movimento',
      'Sincronia gradual',
      'Estado de regulação ao final'
    ],
    description: 'Música instrumental lenta acompanha movimentos amplos e suaves (alongamento, balanço). O terapeuta modela e o paciente segue no próprio ritmo, sem cobrança de sincronia perfeita.',
    materials: ['Playlist instrumental', 'Lenços', 'Espaço amplo'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Sentar em vez de ficar em pé',
      'Reduzir tempo',
      'Permitir movimento livre'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-sen-8',
    title: 'Filtro Sensorial Musical',
    disorder: 'TEA',
    demandCategory: 'sensorial',
    demandLabel: 'Tolerância Auditiva',
    generalObjective: 'Construir tolerância a ambientes sonoros complexos',
    specificObjectives: [
      'Número de camadas toleradas',
      'Uso do cartão de pausa',
      'Generalização a ambientes reais'
    ],
    description: 'Inicia-se com música única e simples. Gradualmente adicionam-se camadas sonoras (segundo instrumento, voz, ruído ambiente) sempre com possibilidade de redução pelo paciente.',
    materials: ['Mixer simples', 'Fones reguláveis', 'Cartão de pausa'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Começar com 1 camada',
      'Permitir fones a qualquer momento',
      'Mapear gatilhos antes'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-soc-3',
    title: 'Roda das Emoções Musicais',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Reconhecimento Emocional',
    generalObjective: 'Associar trechos musicais a emoções básicas',
    specificObjectives: [
      'Acertos na associação',
      'Vocabulário emocional',
      'Expressão facial congruente'
    ],
    description: 'Apresenta-se 4 trechos musicais (alegre, triste, raiva, calma). O paciente associa cada um a cartões de emoção. Gradualmente, é convidado a expressar fisicamente cada emoção ao escutar.',
    materials: ['Cartões de emoção', 'Espelho', 'Caixa de som'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir a 2 emoções',
      'Usar emojis grandes',
      'Modelar a expressão'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-soc-4',
    title: 'Banda Cooperativa',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação',
    generalObjective: 'Desenvolver cooperação grupal por meio de execução musical conjunta',
    specificObjectives: [
      'Engajamento conjunto',
      'Adequação ao tempo do grupo',
      'Iniciativas de ajuda mútua'
    ],
    description: 'Cada participante recebe um instrumento e um papel (ritmo, harmonia, voz). O sucesso depende da contribuição de todos. O terapeuta rege o grupo, ajustando complexidade.',
    materials: ['Variedade de instrumentos', 'Partitura visual com cores', 'Maestro com batuta'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir grupo a 2 pessoas',
      'Simplificar papéis',
      'Usar gravação como suporte'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-soc-5',
    title: 'Canto Compartilhado',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Vínculo Afetivo',
    generalObjective: 'Fortalecer vínculo terapêutico e familiar através de canto conjunto',
    specificObjectives: [
      'Proximidade física aceita',
      'Olhar dirigido ao cuidador',
      'Vocalizações conjuntas'
    ],
    description: 'Sessão com cuidador presente. Canta-se uma música escolhida pela família, com paciente entre os adultos. A música funciona como espaço seguro de proximidade.',
    materials: ['Música pessoal', 'Almofadas', 'Foto da família'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Cuidador atrás se preferido',
      'Cantar em hum',
      'Sessão curta inicial'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-soc-6',
    title: 'Improviso a Dois',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Reciprocidade',
    generalObjective: 'Construir reciprocidade emocional através de improvisação instrumental',
    specificObjectives: [
      'Resposta emocional',
      'Iniciativas musicais',
      'Mudanças de humor'
    ],
    description: 'Terapeuta inicia uma improvisação, refletindo musicalmente o estado do paciente (técnica de matching de Nordoff-Robbins). Gradualmente, propõe pequenas mudanças e observa respostas.',
    materials: ['Piano ou teclado', 'Tambor', 'Instrumento livre escolha'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Sessões curtas',
      'Usar mesma tonalidade',
      'Permitir silêncio prolongado'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-soc-7',
    title: 'Jogo das Estátuas Musicais',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Autocontrole Social',
    generalObjective: 'Trabalhar controle inibitório em contexto social lúdico',
    specificObjectives: [
      'Tempo de inibição',
      'Engajamento social',
      'Tolerância à perda'
    ],
    description: 'Música toca e o paciente dança. Quando para, ele deve "congelar". Ganha pontos quem mantém a posição. Adapta-se complexidade conforme habilidade.',
    materials: ['Caixa de som', 'Marcadores de chão', 'Quadro de pontos'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Aceitar movimentos pequenos',
      'Reduzir tempo da pausa',
      'Premiar tentativa'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-soc-8',
    title: 'Histórias Sociais Cantadas',
    disorder: 'TEA',
    demandCategory: 'socioemocional',
    demandLabel: 'Habilidades Sociais',
    generalObjective: 'Ensinar scripts sociais através de canções estruturadas',
    specificObjectives: [
      'Generalização da resposta',
      'Antecipação da letra',
      'Aplicação em contexto real'
    ],
    description: 'Cria-se canção que narra uma situação social ("Quando chego à escola, digo bom dia"). Repetição da música ancora o comportamento esperado.',
    materials: ['Violão', 'Livro de história social', 'Pictogramas'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir a 2 versos',
      'Usar mesma melodia conhecida',
      'Gravar para casa'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-mot-3',
    title: 'Caminhada Rítmica',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Marcha Coordenada',
    generalObjective: 'Organizar marcha e coordenação por meio de ritmo externo',
    specificObjectives: [
      'Sincronia com o pulso',
      'Estabilidade da marcha',
      'Resposta às mudanças'
    ],
    description: 'Paciente caminha em linha reta no tempo de um tambor. Variam-se velocidades. Inclui-se mudanças de direção sinalizadas musicalmente.',
    materials: ['Tambor', 'Marcadores de chão', 'Espaço amplo'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir velocidade',
      'Usar corredor estreito',
      'Dar mão se necessário'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-mot-4',
    title: 'Tocar e Soltar',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Fina',
    generalObjective: 'Refinar coordenação fina manipulando instrumentos pequenos',
    specificObjectives: [
      'Preensão adequada',
      'Soltar no momento certo',
      'Persistência na tarefa'
    ],
    description: 'Trabalha-se com sinos, triângulo e chocalhos pequenos. O paciente segura, toca e devolve seguindo um padrão musical. Pinça e força são treinadas indiretamente.',
    materials: ['Sinos pequenos', 'Triângulo', 'Bandeja organizadora'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Usar pegadores adaptados',
      'Reduzir número de itens',
      'Permitir uso de duas mãos'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-mot-5',
    title: 'Mãos que Falam',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Bilateral',
    generalObjective: 'Trabalhar coordenação bilateral simétrica e assimétrica',
    specificObjectives: [
      'Coordenação simétrica',
      'Coordenação alternada',
      'Coordenação cruzada'
    ],
    description: 'Exercícios com claves em ambas as mãos: bater simultaneamente, alternado, cruzado. Música marca o tempo. Progressão gradual de complexidade.',
    materials: ['Claves', 'Metrônomo', 'Espelho'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Iniciar com uma mão',
      'Velocidade reduzida',
      'Suporte mão sobre mão'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-mot-6',
    title: 'Pular Conforme o Som',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Grossa',
    generalObjective: 'Desenvolver salto e equilíbrio sincronizados ao som',
    specificObjectives: [
      'Precisão da resposta',
      'Tempo de reação',
      'Resistência'
    ],
    description: 'Sons agudos = pular; sons graves = agachar. Adiciona-se padrões progressivamente. Trabalha discriminação sonora e resposta motora.',
    materials: ['Xilofone', 'Colchonete', 'Marcadores'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Usar apenas pular',
      'Sentar no agachar',
      'Diminuir altura'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-mot-7',
    title: 'Pintura Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Motricidade Fina',
    generalObjective: 'Integrar motricidade fina e expressão musical',
    specificObjectives: [
      'Coordenação pincel-música',
      'Variedade de traços',
      'Tolerância à tinta'
    ],
    description: 'Tocando música, o paciente pinta no ritmo (pinceladas longas para notas longas, pontos para staccato). Resultado é livre e expressivo.',
    materials: ['Tinta lavável', 'Papel grande', 'Pincéis variados', 'Música'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Usar dedos',
      'Papel pequeno',
      'Música muito lenta'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-cog-3',
    title: 'Memória Sonora',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Ampliar capacidade de memória auditiva imediata',
    specificObjectives: [
      'Span máximo',
      'Resistência a distratores',
      'Estratégias de memorização'
    ],
    description: 'Apresenta-se uma sequência de 2-5 sons. Paciente reproduz na ordem. Aumenta-se a sequência gradualmente. Inclui-se distratores.',
    materials: ['Sinos coloridos', 'Cartões de sequência', 'Tablet com sons'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Apoio visual permanente',
      'Sequências curtas',
      'Repetição lenta'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-cog-4',
    title: 'Categorização Musical',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Pensamento Categorial',
    generalObjective: 'Trabalhar categorização e classificação',
    specificObjectives: [
      'Acertos na categorização',
      'Justificativa das escolhas',
      'Generalização'
    ],
    description: 'Conjunto de instrumentos misturados deve ser separado em categorias (percussão, cordas, sopro; agudo/grave; metal/madeira). Música marca tempo da atividade.',
    materials: ['Instrumentos variados', 'Cestos rotulados', 'Cartões de categoria'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir categorias a 2',
      'Mostrar modelo',
      'Permitir tentativa-erro'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-cog-5',
    title: 'Padrões Musicais',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Raciocínio Lógico',
    generalObjective: 'Desenvolver percepção de padrões e antecipação',
    specificObjectives: [
      'Reconhecimento do padrão',
      'Continuidade correta',
      'Criação de padrões próprios'
    ],
    description: 'Apresenta-se padrões ABAB, AABB, ABCABC com instrumentos. Paciente completa o padrão. Inclui-se padrões visuais correspondentes.',
    materials: ['Instrumentos coloridos', 'Cartões de padrão', 'Quadro magnético'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir a ABAB',
      'Apoio visual',
      'Modelar 3 vezes'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-cog-6',
    title: 'Causa e Efeito Sonoro',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Aprendizagem Causal',
    generalObjective: 'Compreender relações de causa e efeito',
    specificObjectives: [
      'Repetição intencional',
      'Variedade de ações',
      'Generalização'
    ],
    description: 'Brinquedos sonoros que produzem sons ao acionar (apertar, soprar, girar). Paciente explora e identifica relação ação-som.',
    materials: ['Brinquedos sonoros', 'Instrumentos eletrônicos', 'Cartões de ação'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Uso de uma só função',
      'Demonstração prévia',
      'Reforço com música preferida'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-cog-7',
    title: 'Tempo e Duração',
    disorder: 'TEA',
    demandCategory: 'cognitivo',
    demandLabel: 'Conceitos Temporais',
    generalObjective: 'Ensinar conceitos de curto/longo, rápido/lento',
    specificObjectives: [
      'Discriminação rápido/lento',
      'Discriminação curto/longo',
      'Aplicação a outras tarefas'
    ],
    description: 'Sons de diferentes durações e velocidades são apresentados. Paciente classifica ou reproduz, associando a cartões de tempo.',
    materials: ['Ampulheta', 'Cartões de tempo', 'Metrônomo', 'Instrumentos sustentáveis'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Contraste extremo',
      'Apoio visual',
      'Movimento corporal associado'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-comp-1',
    title: 'Música para Transição',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Transições',
    generalObjective: 'Reduzir resistência a mudanças de atividade através de música marcadora',
    specificObjectives: [
      'Redução de resistência',
      'Antecipação da transição',
      'Generalização a casa'
    ],
    description: 'Cada transição (entrar, sair, mudar de tarefa) é marcada por uma canção específica curta. Paciente aprende a antecipar e a aceitar a mudança.',
    materials: ['Caixa de som', 'Lista de músicas-marcadoras', 'Cartões visuais'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Iniciar com 1 transição',
      'Avisar antes da música',
      'Permitir tempo extra'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-comp-2',
    title: 'Quebra de Estereotipia',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Flexibilidade',
    generalObjective: 'Promover flexibilidade comportamental usando música como reorientador',
    specificObjectives: [
      'Tempo de estereotipia',
      'Aceitação da alternativa',
      'Redução gradual'
    ],
    description: 'Quando o paciente entra em estereotipia, oferece-se música preferida como alternativa, redirecionando para atividade musical de interesse.',
    materials: ['Playlist preferida', 'Instrumento favorito', 'Caixa de som portátil'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Mapear gatilhos',
      'Oferecer cedo',
      'Não interromper bruscamente'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-comp-3',
    title: 'Contrato Musical',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Combinados',
    generalObjective: 'Estabelecer combinados comportamentais sustentados por reforço musical',
    specificObjectives: [
      'Adesão ao combinado',
      'Auto-regulação crescente',
      'Generalização'
    ],
    description: 'Combinado claro: ao cumprir comportamento alvo, paciente ganha tempo com instrumento preferido. Música é o reforço.',
    materials: ['Quadro de combinados', 'Cronômetro', 'Instrumento preferido'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir critério',
      'Reforço imediato',
      'Apoio visual constante'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-comp-4',
    title: 'Música como Antecipação',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Antecipação',
    generalObjective: 'Usar música para sinalizar próximo evento e reduzir ansiedade',
    specificObjectives: [
      'Redução de ansiedade',
      'Antecipação positiva',
      'Cooperação com a rotina'
    ],
    description: 'Cada momento da sessão é antecedido por sua música. Estrutura temporal previsível diminui ansiedade e oposição.',
    materials: ['Playlist estrutural', 'Quadro de rotina', 'Caixa de som'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir a 3 momentos',
      'Música muito curta',
      'Suporte visual]'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-comp-5',
    title: 'Auto-Avaliação Musical',
    disorder: 'TEA',
    demandCategory: 'comportamento',
    demandLabel: 'Auto-Monitoramento',
    generalObjective: 'Desenvolver consciência do próprio comportamento',
    specificObjectives: [
      'Participação na auto-avaliação',
      'Coerência da escolha',
      'Verbalização'
    ],
    description: 'Ao final da sessão, paciente escolhe um instrumento que represente como se sentiu/comportou. Não há julgamento; apenas registro.',
    materials: ['Variedade de instrumentos', 'Cartão de auto-avaliação', 'Diário visual'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Reduzir a 2 opções',
      'Apoio com pictogramas',
      'Modelar primeiro'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-aut-1',
    title: 'Respiração Sonora',
    disorder: 'TEA',
    demandCategory: 'autorregulacao',
    demandLabel: 'Respiração Consciente',
    generalObjective: 'Ensinar respiração calmante usando som como guia',
    specificObjectives: [
      'Duração da expiração',
      'Uso espontâneo em estresse',
      'Generalização'
    ],
    description: 'Paciente sopra um apito ou flauta longa, observando que respirações longas geram sons longos. Aprende controle respiratório lúdico.',
    materials: ['Apito de respiração', 'Flauta doce', 'Bolinha de sopro'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Bolinha em vez de flauta',
      'Sessão curta',
      'Demonstração contínua'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-aut-2',
    title: 'Cantinho da Calma Musical',
    disorder: 'TEA',
    demandCategory: 'autorregulacao',
    demandLabel: 'Regulação Emocional',
    generalObjective: 'Criar espaço seguro de regulação com recursos musicais',
    specificObjectives: [
      'Uso autônomo',
      'Tempo de regulação',
      'Redução de crises'
    ],
    description: 'Define-se espaço com fones, almofadas e instrumentos calmantes. Paciente pode acessar livremente para se autorregular.',
    materials: ['Fones', 'Almofadas', 'Tigelas', 'Playlist calma'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Acompanhar inicialmente',
      'Quadro de instruções',
      'Reforçar uso adequado'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-aut-3',
    title: 'Termômetro Musical',
    disorder: 'TEA',
    demandCategory: 'autorregulacao',
    demandLabel: 'Identificação de Estado',
    generalObjective: 'Mapear estado interno usando intensidade musical como referência',
    specificObjectives: [
      'Identificação acurada',
      'Uso autônomo',
      'Estratégias eficazes'
    ],
    description: 'Escala visual de 1 a 5 associada a trechos musicais (1=suave, 5=intenso). Paciente identifica seu estado e escolhe música regulatória.',
    materials: ['Cartões de termômetro', 'Tablet com playlist', 'Fones'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento e participação durante a atividade',
      'Progressão observada ao longo das sessões',
      'Generalização a contextos cotidianos'
    ],
    adaptations: [
      'Escala de 3 níveis',
      'Cores como apoio',
      'Modelar uso'
    ],
    theoreticalBasis: 'Fundamentado em Musicoterapia Neurológica, abordagem Nordoff-Robbins e princípios de Integração Sensorial. A música é mediadora central no desenvolvimento socioafetivo e comunicativo de pessoas com TEA.',
    ageRange: '3-15 anos'
  },
  // ====================
  {
    id: 'tea-aut-4',
    title: 'Trilha Sonora Pessoal',
    disorder: 'TEA',
    demandCategory: 'autorregulacao',
    demandLabel: 'Recursos de Regulação',
    generalObjective: 'Construir trilha sonora pessoal de regulação para uso autônomo',
    specificObjectives: [
      'Aumentar autonomia regulatória',
      'Reduzir crises',
      'Generalização a casa e escola'
    ],
    description: 'Junto com o paciente e família, monta-se playlist categorizada: música para acordar, para acalmar, para focar, para dormir. Paciente aprende a acessar conforme necessidade.',
    materials: ['Tablet ou MP3', 'Fones', 'Playlists categorizadas'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Uso autônomo da trilha',
      'Eficácia regulatória relatada',
      'Manutenção do recurso ao longo do tempo'
    ],
    adaptations: [
      'Iniciar com 3 músicas',
      'Apoio visual de seleção',
      'Treino com cuidador'
    ],
    theoreticalBasis: 'Baseado em Musicoterapia Receptiva e princípios de autorregulação. A escolha autônoma de estímulos é fator-chave para generalização.',
    ageRange: '6-18 anos'
  },
  // ====================
  {
    id: 'tea-mot-8',
    title: 'Sinfonia dos Sentidos',
    disorder: 'TEA',
    demandCategory: 'motor',
    demandLabel: 'Integração Multissensorial',
    generalObjective: 'Integrar movimento, som, tato e visão em experiência sensorial organizada',
    specificObjectives: [
      'Tolerar combinação multissensorial',
      'Organizar resposta motora',
      'Aumentar exploração espontânea'
    ],
    description: 'Estação multissensorial: paciente percorre 4 cantos (visual com luzes, tátil com texturas, sonoro com instrumentos, motor com obstáculos). Música contínua organiza o trajeto.',
    materials: ['Luzes coloridas', 'Caixas sensoriais', 'Instrumentos variados', 'Obstáculos macios'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo em cada estação',
      'Variedade de respostas',
      'Estado regulatório ao final'
    ],
    adaptations: [
      'Reduzir a 2 estações',
      'Permitir saída a qualquer momento',
      'Acompanhamento próximo'
    ],
    theoreticalBasis: 'Integração Sensorial de Ayres aliada à Musicoterapia. A organização multissensorial estruturada favorece modulação do SNC.',
    ageRange: '4-12 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-1',
    title: 'Foco no Pulso',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Manter atenção a um pulso regular por períodos crescentes',
    specificObjectives: [
      'Aumentar duração de atenção sustentada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente acompanha um metrônomo com palmas suaves. Inicia-se com 30s e aumenta progressivamente. Distratores controlados são introduzidos. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-2',
    title: 'Caça à Nota Alvo',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Seletiva',
    generalObjective: 'Identificar nota-alvo em meio a outras',
    specificObjectives: [
      'Aumentar duração de atenção seletiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Sequência de notas tocadas; ao surgir a nota-alvo, paciente sinaliza com gesto. Trabalha discriminação e atenção seletiva. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-3',
    title: 'Mudança de Ritmo',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Alternada',
    generalObjective: 'Adaptar movimento a mudanças rítmicas',
    specificObjectives: [
      'Aumentar duração de atenção alternada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música muda de ritmo a cada 20s; paciente adapta movimento corporal correspondente. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-4',
    title: 'Sequência de Comandos',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento',
    generalObjective: 'Executar sequências motoras planejadas',
    specificObjectives: [
      'Aumentar duração de planejamento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica série de ações (pular, girar, sentar). Paciente memoriza e executa ordem completa. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-5',
    title: 'Repetição Crescente',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Repetir padrões de complexidade crescente',
    specificObjectives: [
      'Aumentar duração de memória de trabalho',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Tambor ecoa padrões de 2 a 6 batidas. Paciente reproduz após escutar. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-6',
    title: 'Troca de Instrumento',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Flexibilidade Cognitiva',
    generalObjective: 'Trocar instrumento a cada sinal',
    specificObjectives: [
      'Aumentar duração de flexibilidade cognitiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica troca; paciente alterna entre instrumentos com fluidez. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-7',
    title: 'Música Inacabada',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Tolerância à Frustração',
    generalObjective: 'Tolerar inacabamento e regular frustração',
    specificObjectives: [
      'Aumentar duração de tolerância à frustração',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música é interrompida em momentos inesperados; paciente trabalha tolerância à interrupção. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-8',
    title: 'Solo Esperado',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação Emocional',
    generalObjective: 'Aguardar momento do próprio solo',
    specificObjectives: [
      'Aumentar duração de regulação emocional',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente espera turno musical, sem antecipar. Reforço pelo cumprimento. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-9',
    title: 'Pare-Vai Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Inibitório',
    generalObjective: 'Inibir resposta motora ao sinal',
    specificObjectives: [
      'Aumentar duração de controle inibitório',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música = movimento; pausa = imobilidade. Trabalha inibição. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-10',
    title: 'Diário Sonoro',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Monitoramento',
    generalObjective: 'Auto-monitorar nível de agitação',
    specificObjectives: [
      'Aumentar duração de auto-monitoramento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente escolhe instrumento ao início e fim da sessão para representar estado interno. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-11',
    title: 'Foco no Pulso (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Manter atenção a um pulso regular por períodos crescentes',
    specificObjectives: [
      'Aumentar duração de atenção sustentada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente acompanha um metrônomo com palmas suaves. Inicia-se com 30s e aumenta progressivamente. Distratores controlados são introduzidos. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-12',
    title: 'Caça à Nota Alvo (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Seletiva',
    generalObjective: 'Identificar nota-alvo em meio a outras',
    specificObjectives: [
      'Aumentar duração de atenção seletiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Sequência de notas tocadas; ao surgir a nota-alvo, paciente sinaliza com gesto. Trabalha discriminação e atenção seletiva. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-13',
    title: 'Mudança de Ritmo (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Alternada',
    generalObjective: 'Adaptar movimento a mudanças rítmicas',
    specificObjectives: [
      'Aumentar duração de atenção alternada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música muda de ritmo a cada 20s; paciente adapta movimento corporal correspondente. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-14',
    title: 'Sequência de Comandos (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento',
    generalObjective: 'Executar sequências motoras planejadas',
    specificObjectives: [
      'Aumentar duração de planejamento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica série de ações (pular, girar, sentar). Paciente memoriza e executa ordem completa. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-15',
    title: 'Repetição Crescente (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Repetir padrões de complexidade crescente',
    specificObjectives: [
      'Aumentar duração de memória de trabalho',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Tambor ecoa padrões de 2 a 6 batidas. Paciente reproduz após escutar. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-16',
    title: 'Troca de Instrumento (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Flexibilidade Cognitiva',
    generalObjective: 'Trocar instrumento a cada sinal',
    specificObjectives: [
      'Aumentar duração de flexibilidade cognitiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica troca; paciente alterna entre instrumentos com fluidez. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-17',
    title: 'Música Inacabada (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Tolerância à Frustração',
    generalObjective: 'Tolerar inacabamento e regular frustração',
    specificObjectives: [
      'Aumentar duração de tolerância à frustração',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música é interrompida em momentos inesperados; paciente trabalha tolerância à interrupção. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-18',
    title: 'Solo Esperado (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação Emocional',
    generalObjective: 'Aguardar momento do próprio solo',
    specificObjectives: [
      'Aumentar duração de regulação emocional',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente espera turno musical, sem antecipar. Reforço pelo cumprimento. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-19',
    title: 'Pare-Vai Musical (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Inibitório',
    generalObjective: 'Inibir resposta motora ao sinal',
    specificObjectives: [
      'Aumentar duração de controle inibitório',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música = movimento; pausa = imobilidade. Trabalha inibição. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-20',
    title: 'Diário Sonoro (Nível 2)',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Monitoramento',
    generalObjective: 'Auto-monitorar nível de agitação',
    specificObjectives: [
      'Aumentar duração de auto-monitoramento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente escolhe instrumento ao início e fim da sessão para representar estado interno. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-21',
    title: 'Foco no Pulso (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Manter atenção a um pulso regular por períodos crescentes',
    specificObjectives: [
      'Aumentar duração de atenção sustentada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente acompanha um metrônomo com palmas suaves. Inicia-se com 30s e aumenta progressivamente. Distratores controlados são introduzidos. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-22',
    title: 'Caça à Nota Alvo (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Seletiva',
    generalObjective: 'Identificar nota-alvo em meio a outras',
    specificObjectives: [
      'Aumentar duração de atenção seletiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Sequência de notas tocadas; ao surgir a nota-alvo, paciente sinaliza com gesto. Trabalha discriminação e atenção seletiva. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-23',
    title: 'Mudança de Ritmo (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Alternada',
    generalObjective: 'Adaptar movimento a mudanças rítmicas',
    specificObjectives: [
      'Aumentar duração de atenção alternada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música muda de ritmo a cada 20s; paciente adapta movimento corporal correspondente. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-24',
    title: 'Sequência de Comandos (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento',
    generalObjective: 'Executar sequências motoras planejadas',
    specificObjectives: [
      'Aumentar duração de planejamento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica série de ações (pular, girar, sentar). Paciente memoriza e executa ordem completa. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-25',
    title: 'Repetição Crescente (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Repetir padrões de complexidade crescente',
    specificObjectives: [
      'Aumentar duração de memória de trabalho',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Tambor ecoa padrões de 2 a 6 batidas. Paciente reproduz após escutar. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-26',
    title: 'Troca de Instrumento (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Flexibilidade Cognitiva',
    generalObjective: 'Trocar instrumento a cada sinal',
    specificObjectives: [
      'Aumentar duração de flexibilidade cognitiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica troca; paciente alterna entre instrumentos com fluidez. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-27',
    title: 'Música Inacabada (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Tolerância à Frustração',
    generalObjective: 'Tolerar inacabamento e regular frustração',
    specificObjectives: [
      'Aumentar duração de tolerância à frustração',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música é interrompida em momentos inesperados; paciente trabalha tolerância à interrupção. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-28',
    title: 'Solo Esperado (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação Emocional',
    generalObjective: 'Aguardar momento do próprio solo',
    specificObjectives: [
      'Aumentar duração de regulação emocional',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente espera turno musical, sem antecipar. Reforço pelo cumprimento. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-29',
    title: 'Pare-Vai Musical (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Inibitório',
    generalObjective: 'Inibir resposta motora ao sinal',
    specificObjectives: [
      'Aumentar duração de controle inibitório',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música = movimento; pausa = imobilidade. Trabalha inibição. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-30',
    title: 'Diário Sonoro (Nível 3)',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Monitoramento',
    generalObjective: 'Auto-monitorar nível de agitação',
    specificObjectives: [
      'Aumentar duração de auto-monitoramento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente escolhe instrumento ao início e fim da sessão para representar estado interno. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-31',
    title: 'Foco no Pulso (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Manter atenção a um pulso regular por períodos crescentes',
    specificObjectives: [
      'Aumentar duração de atenção sustentada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente acompanha um metrônomo com palmas suaves. Inicia-se com 30s e aumenta progressivamente. Distratores controlados são introduzidos. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-32',
    title: 'Caça à Nota Alvo (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Seletiva',
    generalObjective: 'Identificar nota-alvo em meio a outras',
    specificObjectives: [
      'Aumentar duração de atenção seletiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Sequência de notas tocadas; ao surgir a nota-alvo, paciente sinaliza com gesto. Trabalha discriminação e atenção seletiva. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-atencao-33',
    title: 'Mudança de Ritmo (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Alternada',
    generalObjective: 'Adaptar movimento a mudanças rítmicas',
    specificObjectives: [
      'Aumentar duração de atenção alternada',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música muda de ritmo a cada 20s; paciente adapta movimento corporal correspondente. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-34',
    title: 'Sequência de Comandos (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento',
    generalObjective: 'Executar sequências motoras planejadas',
    specificObjectives: [
      'Aumentar duração de planejamento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica série de ações (pular, girar, sentar). Paciente memoriza e executa ordem completa. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-35',
    title: 'Repetição Crescente (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Repetir padrões de complexidade crescente',
    specificObjectives: [
      'Aumentar duração de memória de trabalho',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Tambor ecoa padrões de 2 a 6 batidas. Paciente reproduz após escutar. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-funcoes_executivas-36',
    title: 'Troca de Instrumento (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Flexibilidade Cognitiva',
    generalObjective: 'Trocar instrumento a cada sinal',
    specificObjectives: [
      'Aumentar duração de flexibilidade cognitiva',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música indica troca; paciente alterna entre instrumentos com fluidez. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-37',
    title: 'Música Inacabada (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Tolerância à Frustração',
    generalObjective: 'Tolerar inacabamento e regular frustração',
    specificObjectives: [
      'Aumentar duração de tolerância à frustração',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música é interrompida em momentos inesperados; paciente trabalha tolerância à interrupção. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-controle_emocional-38',
    title: 'Solo Esperado (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação Emocional',
    generalObjective: 'Aguardar momento do próprio solo',
    specificObjectives: [
      'Aumentar duração de regulação emocional',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente espera turno musical, sem antecipar. Reforço pelo cumprimento. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-39',
    title: 'Pare-Vai Musical (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Inibitório',
    generalObjective: 'Inibir resposta motora ao sinal',
    specificObjectives: [
      'Aumentar duração de controle inibitório',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Música = movimento; pausa = imobilidade. Trabalha inibição. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tdah-autorregulacao-40',
    title: 'Diário Sonoro (Nível 4)',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Monitoramento',
    generalObjective: 'Auto-monitorar nível de agitação',
    specificObjectives: [
      'Aumentar duração de auto-monitoramento',
      'Reduzir distratibilidade',
      'Melhorar resposta a comandos sequenciais'
    ],
    description: 'Paciente escolhe instrumento ao início e fim da sessão para representar estado interno. A complexidade é ajustada conforme nível do paciente, com reforço positivo a cada acerto.',
    materials: ['Metrônomo', 'Tambor', 'Cartões visuais', 'Cronômetro', 'Instrumentos de percussão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de engajamento',
      'Número de acertos consecutivos',
      'Generalização à sala de aula'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Eliminar distratores ambientais',
      'Oferecer pausa motora a cada 5 minutos'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e princípios da Neuropsicologia Cognitiva aplicada ao TDAH. O ritmo externo regula sistemas atencionais e executivos.',
    ageRange: '6-15 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-1',
    title: 'Tambor da Raiva',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação da Raiva',
    generalObjective: 'Canalizar raiva por meio de percussão estruturada',
    specificObjectives: [
      'Desenvolver regulação da raiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente bate em tambor com intensidade decrescente, descarregando energia e aprendendo gradação. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-2',
    title: 'Letra de Sentimentos',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Expressão Adequada',
    generalObjective: 'Expressar sentimentos compondo letras simples',
    specificObjectives: [
      'Desenvolver expressão adequada',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cria-se letra sobre situação real do paciente. Música torna emoção tangível e nomeável. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-3',
    title: 'Construir Junto',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação',
    generalObjective: 'Construir música em conjunto, dependendo do outro',
    specificObjectives: [
      'Desenvolver cooperação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Grupo cria uma música; cada membro contribui com uma parte. Cooperação é necessária. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-4',
    title: 'Música do Outro',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Empatia',
    generalObjective: 'Tocar a música que o outro escolheu',
    specificObjectives: [
      'Desenvolver empatia',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cada participante escolhe música; outros devem tocar/cantar com respeito. Trabalha empatia. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-5',
    title: 'Regras da Sessão',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Cumprimento de Regras',
    generalObjective: 'Estabelecer e cumprir regras claras',
    specificObjectives: [
      'Desenvolver cumprimento de regras',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Combinados musicais (silêncio quando outro toca, esperar turno). Reforço pelo cumprimento. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-6',
    title: 'Negociação Sonora',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Negociação',
    generalObjective: 'Negociar repertório e tarefas',
    specificObjectives: [
      'Desenvolver negociação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente propõe; terapeuta contra-propõe. Decisão final negociada. Música como objeto. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-7',
    title: 'Pausa Sonora',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Pausa Reflexiva',
    generalObjective: 'Tomar pausa quando emoção sobe',
    specificObjectives: [
      'Desenvolver pausa reflexiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Ao perceber escalada, paciente toca tigela e pausa. Aprende identificar e regular. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-8',
    title: 'Espelho do Comportamento',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Observação',
    generalObjective: 'Observar próprio comportamento via gravação',
    specificObjectives: [
      'Desenvolver auto-observação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Gravar sessão; rever junto, identificando momentos bons e desafiadores. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-9',
    title: 'Dizer Não Cantando',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Assertiva',
    generalObjective: 'Expressar discordância sem agressão',
    specificObjectives: [
      'Desenvolver comunicação assertiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Treinar fórmulas verbais ("não quero, mas posso depois") em formato cantado. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-10',
    title: 'Escutar Antes',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Escuta Ativa',
    generalObjective: 'Escutar até o fim antes de responder',
    specificObjectives: [
      'Desenvolver escuta ativa',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Terapeuta toca/fala; paciente espera silêncio completo para responder. Reforço pela espera. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-11',
    title: 'Tambor da Raiva (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação da Raiva',
    generalObjective: 'Canalizar raiva por meio de percussão estruturada',
    specificObjectives: [
      'Desenvolver regulação da raiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente bate em tambor com intensidade decrescente, descarregando energia e aprendendo gradação. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-12',
    title: 'Letra de Sentimentos (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Expressão Adequada',
    generalObjective: 'Expressar sentimentos compondo letras simples',
    specificObjectives: [
      'Desenvolver expressão adequada',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cria-se letra sobre situação real do paciente. Música torna emoção tangível e nomeável. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-13',
    title: 'Construir Junto (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação',
    generalObjective: 'Construir música em conjunto, dependendo do outro',
    specificObjectives: [
      'Desenvolver cooperação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Grupo cria uma música; cada membro contribui com uma parte. Cooperação é necessária. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-14',
    title: 'Música do Outro (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Empatia',
    generalObjective: 'Tocar a música que o outro escolheu',
    specificObjectives: [
      'Desenvolver empatia',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cada participante escolhe música; outros devem tocar/cantar com respeito. Trabalha empatia. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-15',
    title: 'Regras da Sessão (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Cumprimento de Regras',
    generalObjective: 'Estabelecer e cumprir regras claras',
    specificObjectives: [
      'Desenvolver cumprimento de regras',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Combinados musicais (silêncio quando outro toca, esperar turno). Reforço pelo cumprimento. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-16',
    title: 'Negociação Sonora (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Negociação',
    generalObjective: 'Negociar repertório e tarefas',
    specificObjectives: [
      'Desenvolver negociação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente propõe; terapeuta contra-propõe. Decisão final negociada. Música como objeto. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-17',
    title: 'Pausa Sonora (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Pausa Reflexiva',
    generalObjective: 'Tomar pausa quando emoção sobe',
    specificObjectives: [
      'Desenvolver pausa reflexiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Ao perceber escalada, paciente toca tigela e pausa. Aprende identificar e regular. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-18',
    title: 'Espelho do Comportamento (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Observação',
    generalObjective: 'Observar próprio comportamento via gravação',
    specificObjectives: [
      'Desenvolver auto-observação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Gravar sessão; rever junto, identificando momentos bons e desafiadores. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-19',
    title: 'Dizer Não Cantando (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Assertiva',
    generalObjective: 'Expressar discordância sem agressão',
    specificObjectives: [
      'Desenvolver comunicação assertiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Treinar fórmulas verbais ("não quero, mas posso depois") em formato cantado. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-20',
    title: 'Escutar Antes (Variação 2)',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Escuta Ativa',
    generalObjective: 'Escutar até o fim antes de responder',
    specificObjectives: [
      'Desenvolver escuta ativa',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Terapeuta toca/fala; paciente espera silêncio completo para responder. Reforço pela espera. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-21',
    title: 'Tambor da Raiva (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação da Raiva',
    generalObjective: 'Canalizar raiva por meio de percussão estruturada',
    specificObjectives: [
      'Desenvolver regulação da raiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente bate em tambor com intensidade decrescente, descarregando energia e aprendendo gradação. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-22',
    title: 'Letra de Sentimentos (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Expressão Adequada',
    generalObjective: 'Expressar sentimentos compondo letras simples',
    specificObjectives: [
      'Desenvolver expressão adequada',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cria-se letra sobre situação real do paciente. Música torna emoção tangível e nomeável. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-23',
    title: 'Construir Junto (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação',
    generalObjective: 'Construir música em conjunto, dependendo do outro',
    specificObjectives: [
      'Desenvolver cooperação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Grupo cria uma música; cada membro contribui com uma parte. Cooperação é necessária. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-24',
    title: 'Música do Outro (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Empatia',
    generalObjective: 'Tocar a música que o outro escolheu',
    specificObjectives: [
      'Desenvolver empatia',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cada participante escolhe música; outros devem tocar/cantar com respeito. Trabalha empatia. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-25',
    title: 'Regras da Sessão (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Cumprimento de Regras',
    generalObjective: 'Estabelecer e cumprir regras claras',
    specificObjectives: [
      'Desenvolver cumprimento de regras',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Combinados musicais (silêncio quando outro toca, esperar turno). Reforço pelo cumprimento. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-26',
    title: 'Negociação Sonora (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Negociação',
    generalObjective: 'Negociar repertório e tarefas',
    specificObjectives: [
      'Desenvolver negociação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente propõe; terapeuta contra-propõe. Decisão final negociada. Música como objeto. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-27',
    title: 'Pausa Sonora (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Pausa Reflexiva',
    generalObjective: 'Tomar pausa quando emoção sobe',
    specificObjectives: [
      'Desenvolver pausa reflexiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Ao perceber escalada, paciente toca tigela e pausa. Aprende identificar e regular. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-28',
    title: 'Espelho do Comportamento (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Observação',
    generalObjective: 'Observar próprio comportamento via gravação',
    specificObjectives: [
      'Desenvolver auto-observação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Gravar sessão; rever junto, identificando momentos bons e desafiadores. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-29',
    title: 'Dizer Não Cantando (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Assertiva',
    generalObjective: 'Expressar discordância sem agressão',
    specificObjectives: [
      'Desenvolver comunicação assertiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Treinar fórmulas verbais ("não quero, mas posso depois") em formato cantado. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-30',
    title: 'Escutar Antes (Variação 3)',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Escuta Ativa',
    generalObjective: 'Escutar até o fim antes de responder',
    specificObjectives: [
      'Desenvolver escuta ativa',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Terapeuta toca/fala; paciente espera silêncio completo para responder. Reforço pela espera. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-31',
    title: 'Tambor da Raiva (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Regulação da Raiva',
    generalObjective: 'Canalizar raiva por meio de percussão estruturada',
    specificObjectives: [
      'Desenvolver regulação da raiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente bate em tambor com intensidade decrescente, descarregando energia e aprendendo gradação. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-controle_emocional-32',
    title: 'Letra de Sentimentos (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'controle_emocional',
    demandLabel: 'Expressão Adequada',
    generalObjective: 'Expressar sentimentos compondo letras simples',
    specificObjectives: [
      'Desenvolver expressão adequada',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cria-se letra sobre situação real do paciente. Música torna emoção tangível e nomeável. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-33',
    title: 'Construir Junto (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Cooperação',
    generalObjective: 'Construir música em conjunto, dependendo do outro',
    specificObjectives: [
      'Desenvolver cooperação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Grupo cria uma música; cada membro contribui com uma parte. Cooperação é necessária. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-socioemocional-34',
    title: 'Música do Outro (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'socioemocional',
    demandLabel: 'Empatia',
    generalObjective: 'Tocar a música que o outro escolheu',
    specificObjectives: [
      'Desenvolver empatia',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Cada participante escolhe música; outros devem tocar/cantar com respeito. Trabalha empatia. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-35',
    title: 'Regras da Sessão (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Cumprimento de Regras',
    generalObjective: 'Estabelecer e cumprir regras claras',
    specificObjectives: [
      'Desenvolver cumprimento de regras',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Combinados musicais (silêncio quando outro toca, esperar turno). Reforço pelo cumprimento. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comportamento-36',
    title: 'Negociação Sonora (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'comportamento',
    demandLabel: 'Negociação',
    generalObjective: 'Negociar repertório e tarefas',
    specificObjectives: [
      'Desenvolver negociação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Paciente propõe; terapeuta contra-propõe. Decisão final negociada. Música como objeto. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-37',
    title: 'Pausa Sonora (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Pausa Reflexiva',
    generalObjective: 'Tomar pausa quando emoção sobe',
    specificObjectives: [
      'Desenvolver pausa reflexiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Ao perceber escalada, paciente toca tigela e pausa. Aprende identificar e regular. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-autorregulacao-38',
    title: 'Espelho do Comportamento (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'autorregulacao',
    demandLabel: 'Auto-Observação',
    generalObjective: 'Observar próprio comportamento via gravação',
    specificObjectives: [
      'Desenvolver auto-observação',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Gravar sessão; rever junto, identificando momentos bons e desafiadores. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-39',
    title: 'Dizer Não Cantando (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Assertiva',
    generalObjective: 'Expressar discordância sem agressão',
    specificObjectives: [
      'Desenvolver comunicação assertiva',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Treinar fórmulas verbais ("não quero, mas posso depois") em formato cantado. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'tod-comunicacao-40',
    title: 'Escutar Antes (Variação 4)',
    disorder: 'TOD',
    demandCategory: 'comunicacao',
    demandLabel: 'Escuta Ativa',
    generalObjective: 'Escutar até o fim antes de responder',
    specificObjectives: [
      'Desenvolver escuta ativa',
      'Reduzir episódios de oposição',
      'Aumentar tempo de cooperação'
    ],
    description: 'Terapeuta toca/fala; paciente espera silêncio completo para responder. Reforço pela espera. Toda a atividade é mediada por contrato claro e reforço positivo ao cumprimento de combinados.',
    materials: ['Tambor', 'Violão', 'Quadro de combinados', 'Gravador', 'Cartões de emoção'],
    estimatedTime: '25-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cumprimento dos combinados',
      'Verbalização de emoções',
      'Redução de comportamentos opositores'
    ],
    adaptations: [
      'Reduzir tempo da tarefa',
      'Aumentar reforço positivo',
      'Incluir cuidador como modelo'
    ],
    theoreticalBasis: 'Baseado em Terapia Cognitivo-Comportamental, Treino de Habilidades Sociais e Musicoterapia Comunitária. O fazer musical conjunto reforça normas socioafetivas.',
    ageRange: '6-16 anos'
  },
  // ====================
  {
    id: 'di-cognitivo-1',
    title: 'Aprender Cantando',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Estimulação Cognitiva',
    generalObjective: 'Adquirir conceitos básicos através de canções',
    specificObjectives: [
      'Desenvolver estimulação cognitiva',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção ensina cores, números ou letras de forma repetitiva e divertida. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-2',
    title: 'Quem Sou Eu',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória',
    generalObjective: 'Reconhecer-se e nomear partes do corpo',
    specificObjectives: [
      'Desenvolver memória',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Cabeça, ombro, joelho e pé" com variações; paciente toca cada parte ao ser nomeada. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-3',
    title: 'Pedindo com Música',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Linguagem Funcional',
    generalObjective: 'Solicitar funcionalmente usando canção',
    specificObjectives: [
      'Desenvolver linguagem funcional',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Estrutura ABA: "eu quero __" cantado; paciente preenche lacuna. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-4',
    title: 'Vocabulário do Dia',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Vocabulário Básico',
    generalObjective: 'Ampliar vocabulário a partir de objetos cotidianos',
    specificObjectives: [
      'Desenvolver vocabulário básico',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada objeto recebe uma canção curta; repetição diária consolida o termo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-5',
    title: 'Subir e Descer',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Motora',
    generalObjective: 'Coordenação motora grossa em escada musical',
    specificObjectives: [
      'Desenvolver coordenação motora',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada degrau emite um som; paciente sobe/desce com apoio, fortalecendo coordenação. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-6',
    title: 'Massagem Musical',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Esquema Corporal',
    generalObjective: 'Conhecer o próprio corpo via toque e som',
    specificObjectives: [
      'Desenvolver esquema corporal',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cuidador faz massagem suave acompanhada de canção que nomeia partes do corpo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-7',
    title: 'AVDs Cantadas',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Atividades de Vida Diária',
    generalObjective: 'Aprender sequências de AVDs via canção',
    specificObjectives: [
      'Desenvolver atividades de vida diária',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Como escovar os dentes" guia cada passo. Reforça autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-8',
    title: 'Vestindo a Música',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Auto-Cuidado',
    generalObjective: 'Vestir-se acompanhado de canção sequencial',
    specificObjectives: [
      'Desenvolver auto-cuidado',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção indica próxima peça; trabalha sequência e autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-9',
    title: 'Roda da Amizade',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Interação Social',
    generalObjective: 'Promover interação grupal lúdica',
    specificObjectives: [
      'Desenvolver interação social',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Roda cantada com nomes; paciente entrega objeto ao próximo. Trabalha turnos sociais. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-10',
    title: 'Apresentação Musical',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Auto-Estima',
    generalObjective: 'Aumentar auto-estima por meio de pequena apresentação',
    specificObjectives: [
      'Desenvolver auto-estima',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Paciente prepara música simples; apresenta a colegas/família. Reforço maciço. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-11',
    title: 'Aprender Cantando (Nível 2)',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Estimulação Cognitiva',
    generalObjective: 'Adquirir conceitos básicos através de canções',
    specificObjectives: [
      'Desenvolver estimulação cognitiva',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção ensina cores, números ou letras de forma repetitiva e divertida. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-12',
    title: 'Quem Sou Eu (Nível 2)',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória',
    generalObjective: 'Reconhecer-se e nomear partes do corpo',
    specificObjectives: [
      'Desenvolver memória',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Cabeça, ombro, joelho e pé" com variações; paciente toca cada parte ao ser nomeada. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-13',
    title: 'Pedindo com Música (Nível 2)',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Linguagem Funcional',
    generalObjective: 'Solicitar funcionalmente usando canção',
    specificObjectives: [
      'Desenvolver linguagem funcional',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Estrutura ABA: "eu quero __" cantado; paciente preenche lacuna. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-14',
    title: 'Vocabulário do Dia (Nível 2)',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Vocabulário Básico',
    generalObjective: 'Ampliar vocabulário a partir de objetos cotidianos',
    specificObjectives: [
      'Desenvolver vocabulário básico',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada objeto recebe uma canção curta; repetição diária consolida o termo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-15',
    title: 'Subir e Descer (Nível 2)',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Motora',
    generalObjective: 'Coordenação motora grossa em escada musical',
    specificObjectives: [
      'Desenvolver coordenação motora',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada degrau emite um som; paciente sobe/desce com apoio, fortalecendo coordenação. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-16',
    title: 'Massagem Musical (Nível 2)',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Esquema Corporal',
    generalObjective: 'Conhecer o próprio corpo via toque e som',
    specificObjectives: [
      'Desenvolver esquema corporal',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cuidador faz massagem suave acompanhada de canção que nomeia partes do corpo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-17',
    title: 'AVDs Cantadas (Nível 2)',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Atividades de Vida Diária',
    generalObjective: 'Aprender sequências de AVDs via canção',
    specificObjectives: [
      'Desenvolver atividades de vida diária',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Como escovar os dentes" guia cada passo. Reforça autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-18',
    title: 'Vestindo a Música (Nível 2)',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Auto-Cuidado',
    generalObjective: 'Vestir-se acompanhado de canção sequencial',
    specificObjectives: [
      'Desenvolver auto-cuidado',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção indica próxima peça; trabalha sequência e autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-19',
    title: 'Roda da Amizade (Nível 2)',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Interação Social',
    generalObjective: 'Promover interação grupal lúdica',
    specificObjectives: [
      'Desenvolver interação social',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Roda cantada com nomes; paciente entrega objeto ao próximo. Trabalha turnos sociais. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-20',
    title: 'Apresentação Musical (Nível 2)',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Auto-Estima',
    generalObjective: 'Aumentar auto-estima por meio de pequena apresentação',
    specificObjectives: [
      'Desenvolver auto-estima',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Paciente prepara música simples; apresenta a colegas/família. Reforço maciço. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-21',
    title: 'Aprender Cantando (Nível 3)',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Estimulação Cognitiva',
    generalObjective: 'Adquirir conceitos básicos através de canções',
    specificObjectives: [
      'Desenvolver estimulação cognitiva',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção ensina cores, números ou letras de forma repetitiva e divertida. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-22',
    title: 'Quem Sou Eu (Nível 3)',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória',
    generalObjective: 'Reconhecer-se e nomear partes do corpo',
    specificObjectives: [
      'Desenvolver memória',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Cabeça, ombro, joelho e pé" com variações; paciente toca cada parte ao ser nomeada. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-23',
    title: 'Pedindo com Música (Nível 3)',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Linguagem Funcional',
    generalObjective: 'Solicitar funcionalmente usando canção',
    specificObjectives: [
      'Desenvolver linguagem funcional',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Estrutura ABA: "eu quero __" cantado; paciente preenche lacuna. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-24',
    title: 'Vocabulário do Dia (Nível 3)',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Vocabulário Básico',
    generalObjective: 'Ampliar vocabulário a partir de objetos cotidianos',
    specificObjectives: [
      'Desenvolver vocabulário básico',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada objeto recebe uma canção curta; repetição diária consolida o termo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-25',
    title: 'Subir e Descer (Nível 3)',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Motora',
    generalObjective: 'Coordenação motora grossa em escada musical',
    specificObjectives: [
      'Desenvolver coordenação motora',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada degrau emite um som; paciente sobe/desce com apoio, fortalecendo coordenação. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-26',
    title: 'Massagem Musical (Nível 3)',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Esquema Corporal',
    generalObjective: 'Conhecer o próprio corpo via toque e som',
    specificObjectives: [
      'Desenvolver esquema corporal',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cuidador faz massagem suave acompanhada de canção que nomeia partes do corpo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-27',
    title: 'AVDs Cantadas (Nível 3)',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Atividades de Vida Diária',
    generalObjective: 'Aprender sequências de AVDs via canção',
    specificObjectives: [
      'Desenvolver atividades de vida diária',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Como escovar os dentes" guia cada passo. Reforça autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-28',
    title: 'Vestindo a Música (Nível 3)',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Auto-Cuidado',
    generalObjective: 'Vestir-se acompanhado de canção sequencial',
    specificObjectives: [
      'Desenvolver auto-cuidado',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção indica próxima peça; trabalha sequência e autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-29',
    title: 'Roda da Amizade (Nível 3)',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Interação Social',
    generalObjective: 'Promover interação grupal lúdica',
    specificObjectives: [
      'Desenvolver interação social',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Roda cantada com nomes; paciente entrega objeto ao próximo. Trabalha turnos sociais. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-30',
    title: 'Apresentação Musical (Nível 3)',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Auto-Estima',
    generalObjective: 'Aumentar auto-estima por meio de pequena apresentação',
    specificObjectives: [
      'Desenvolver auto-estima',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Paciente prepara música simples; apresenta a colegas/família. Reforço maciço. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-31',
    title: 'Aprender Cantando (Nível 4)',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Estimulação Cognitiva',
    generalObjective: 'Adquirir conceitos básicos através de canções',
    specificObjectives: [
      'Desenvolver estimulação cognitiva',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção ensina cores, números ou letras de forma repetitiva e divertida. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-cognitivo-32',
    title: 'Quem Sou Eu (Nível 4)',
    disorder: 'DI',
    demandCategory: 'cognitivo',
    demandLabel: 'Memória',
    generalObjective: 'Reconhecer-se e nomear partes do corpo',
    specificObjectives: [
      'Desenvolver memória',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Cabeça, ombro, joelho e pé" com variações; paciente toca cada parte ao ser nomeada. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-33',
    title: 'Pedindo com Música (Nível 4)',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Linguagem Funcional',
    generalObjective: 'Solicitar funcionalmente usando canção',
    specificObjectives: [
      'Desenvolver linguagem funcional',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Estrutura ABA: "eu quero __" cantado; paciente preenche lacuna. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-comunicacao-34',
    title: 'Vocabulário do Dia (Nível 4)',
    disorder: 'DI',
    demandCategory: 'comunicacao',
    demandLabel: 'Vocabulário Básico',
    generalObjective: 'Ampliar vocabulário a partir de objetos cotidianos',
    specificObjectives: [
      'Desenvolver vocabulário básico',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada objeto recebe uma canção curta; repetição diária consolida o termo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-35',
    title: 'Subir e Descer (Nível 4)',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Coordenação Motora',
    generalObjective: 'Coordenação motora grossa em escada musical',
    specificObjectives: [
      'Desenvolver coordenação motora',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cada degrau emite um som; paciente sobe/desce com apoio, fortalecendo coordenação. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-motor-36',
    title: 'Massagem Musical (Nível 4)',
    disorder: 'DI',
    demandCategory: 'motor',
    demandLabel: 'Esquema Corporal',
    generalObjective: 'Conhecer o próprio corpo via toque e som',
    specificObjectives: [
      'Desenvolver esquema corporal',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Cuidador faz massagem suave acompanhada de canção que nomeia partes do corpo. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-37',
    title: 'AVDs Cantadas (Nível 4)',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Atividades de Vida Diária',
    generalObjective: 'Aprender sequências de AVDs via canção',
    specificObjectives: [
      'Desenvolver atividades de vida diária',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção "Como escovar os dentes" guia cada passo. Reforça autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-autonomia-38',
    title: 'Vestindo a Música (Nível 4)',
    disorder: 'DI',
    demandCategory: 'autonomia',
    demandLabel: 'Auto-Cuidado',
    generalObjective: 'Vestir-se acompanhado de canção sequencial',
    specificObjectives: [
      'Desenvolver auto-cuidado',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Canção indica próxima peça; trabalha sequência e autonomia. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-39',
    title: 'Roda da Amizade (Nível 4)',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Interação Social',
    generalObjective: 'Promover interação grupal lúdica',
    specificObjectives: [
      'Desenvolver interação social',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Roda cantada com nomes; paciente entrega objeto ao próximo. Trabalha turnos sociais. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'di-socioemocional-40',
    title: 'Apresentação Musical (Nível 4)',
    disorder: 'DI',
    demandCategory: 'socioemocional',
    demandLabel: 'Auto-Estima',
    generalObjective: 'Aumentar auto-estima por meio de pequena apresentação',
    specificObjectives: [
      'Desenvolver auto-estima',
      'Aumentar funcionalidade no cotidiano',
      'Ampliar repertório comportamental'
    ],
    description: 'Paciente prepara música simples; apresenta a colegas/família. Reforço maciço. Repetição, previsibilidade e reforço positivo são princípios fundamentais. Adaptações conforme funcionalidade do paciente.',
    materials: ['Violão', 'Cartões pictográficos', 'Objetos reais', 'Instrumentos simples', 'Espelho'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Aquisição do conteúdo-alvo',
      'Generalização a outros contextos',
      'Manutenção ao longo das sessões'
    ],
    adaptations: [
      'Reduzir complexidade do conteúdo',
      'Aumentar suporte visual',
      'Sessões mais curtas e frequentes'
    ],
    theoreticalBasis: 'Fundamentado em princípios de aprendizagem estruturada, repetição espaçada e Musicoterapia desenvolvimentista. A música facilita aprendizagem em DI por engajar múltiplos sistemas.',
    ageRange: '4-adultos'
  },
  // ====================
  {
    id: 'alz-memoria-1',
    title: 'Canções da Juventude',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória de Longo Prazo',
    generalObjective: 'Ativar memória autobiográfica através de canções marcantes',
    specificObjectives: [
      'Estimular memória de longo prazo',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Apresentar canções dos 15-25 anos do paciente; conversar sobre memórias evocadas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-memoria-2',
    title: 'O que fizemos hoje',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória Recente',
    generalObjective: 'Recordar eventos recentes com apoio musical',
    specificObjectives: [
      'Estimular memória recente',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Ao final do dia, cantar resumo das atividades em forma de canção simples. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-orientacao-3',
    title: 'Calendário Cantado',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Temporal',
    generalObjective: 'Reforçar orientação temporal',
    specificObjectives: [
      'Estimular orientação temporal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Canção do dia da semana, mês e estação; repetida diariamente. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-orientacao-4',
    title: 'Mapa Sonoro do Lar',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Espacial',
    generalObjective: 'Reforçar orientação espacial via sons',
    specificObjectives: [
      'Estimular orientação espacial',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Cada cômodo tem um som identificador; paciente associa som ao espaço. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-reminiscencia-5',
    title: 'Caixa de Reminiscências',
    disorder: 'ALZHEIMER',
    demandCategory: 'reminiscencia',
    demandLabel: 'Reminiscência',
    generalObjective: 'Evocar memórias com objetos e canções',
    specificObjectives: [
      'Estimular reminiscência',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Objetos antigos + canção da mesma época; estímulo dual evoca memórias profundas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-identidade-6',
    title: 'Minha História em Música',
    disorder: 'ALZHEIMER',
    demandCategory: 'identidade',
    demandLabel: 'Identidade Pessoal',
    generalObjective: 'Reforçar identidade através de playlist pessoal',
    specificObjectives: [
      'Estimular identidade pessoal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Criar playlist da vida do paciente; ouvir juntos comentando. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-comunicacao-7',
    title: 'Cantar para Lembrar',
    disorder: 'ALZHEIMER',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Verbal',
    generalObjective: 'Estimular linguagem via canções familiares',
    specificObjectives: [
      'Estimular comunicação verbal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Cantar canções conhecidas; observar resgate de palavras esquecidas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-socioemocional-8',
    title: 'Música do Conforto',
    disorder: 'ALZHEIMER',
    demandCategory: 'socioemocional',
    demandLabel: 'Bem-Estar Emocional',
    generalObjective: 'Promover bem-estar e reduzir agitação',
    specificObjectives: [
      'Estimular bem-estar emocional',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Música escolhida pela família tocada em momentos de ansiedade. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-memoria-9',
    title: 'Canções da Juventude (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória de Longo Prazo',
    generalObjective: 'Ativar memória autobiográfica através de canções marcantes',
    specificObjectives: [
      'Estimular memória de longo prazo',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Apresentar canções dos 15-25 anos do paciente; conversar sobre memórias evocadas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-memoria-10',
    title: 'O que fizemos hoje (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória Recente',
    generalObjective: 'Recordar eventos recentes com apoio musical',
    specificObjectives: [
      'Estimular memória recente',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Ao final do dia, cantar resumo das atividades em forma de canção simples. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-orientacao-11',
    title: 'Calendário Cantado (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Temporal',
    generalObjective: 'Reforçar orientação temporal',
    specificObjectives: [
      'Estimular orientação temporal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Canção do dia da semana, mês e estação; repetida diariamente. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-orientacao-12',
    title: 'Mapa Sonoro do Lar (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Espacial',
    generalObjective: 'Reforçar orientação espacial via sons',
    specificObjectives: [
      'Estimular orientação espacial',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Cada cômodo tem um som identificador; paciente associa som ao espaço. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-reminiscencia-13',
    title: 'Caixa de Reminiscências (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'reminiscencia',
    demandLabel: 'Reminiscência',
    generalObjective: 'Evocar memórias com objetos e canções',
    specificObjectives: [
      'Estimular reminiscência',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Objetos antigos + canção da mesma época; estímulo dual evoca memórias profundas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-identidade-14',
    title: 'Minha História em Música (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'identidade',
    demandLabel: 'Identidade Pessoal',
    generalObjective: 'Reforçar identidade através de playlist pessoal',
    specificObjectives: [
      'Estimular identidade pessoal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Criar playlist da vida do paciente; ouvir juntos comentando. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-comunicacao-15',
    title: 'Cantar para Lembrar (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Verbal',
    generalObjective: 'Estimular linguagem via canções familiares',
    specificObjectives: [
      'Estimular comunicação verbal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Cantar canções conhecidas; observar resgate de palavras esquecidas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-socioemocional-16',
    title: 'Música do Conforto (Variação 2)',
    disorder: 'ALZHEIMER',
    demandCategory: 'socioemocional',
    demandLabel: 'Bem-Estar Emocional',
    generalObjective: 'Promover bem-estar e reduzir agitação',
    specificObjectives: [
      'Estimular bem-estar emocional',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Música escolhida pela família tocada em momentos de ansiedade. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-memoria-17',
    title: 'Canções da Juventude (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória de Longo Prazo',
    generalObjective: 'Ativar memória autobiográfica através de canções marcantes',
    specificObjectives: [
      'Estimular memória de longo prazo',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Apresentar canções dos 15-25 anos do paciente; conversar sobre memórias evocadas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-memoria-18',
    title: 'O que fizemos hoje (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória Recente',
    generalObjective: 'Recordar eventos recentes com apoio musical',
    specificObjectives: [
      'Estimular memória recente',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Ao final do dia, cantar resumo das atividades em forma de canção simples. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-orientacao-19',
    title: 'Calendário Cantado (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Temporal',
    generalObjective: 'Reforçar orientação temporal',
    specificObjectives: [
      'Estimular orientação temporal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Canção do dia da semana, mês e estação; repetida diariamente. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-orientacao-20',
    title: 'Mapa Sonoro do Lar (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Espacial',
    generalObjective: 'Reforçar orientação espacial via sons',
    specificObjectives: [
      'Estimular orientação espacial',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Cada cômodo tem um som identificador; paciente associa som ao espaço. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-reminiscencia-21',
    title: 'Caixa de Reminiscências (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'reminiscencia',
    demandLabel: 'Reminiscência',
    generalObjective: 'Evocar memórias com objetos e canções',
    specificObjectives: [
      'Estimular reminiscência',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Objetos antigos + canção da mesma época; estímulo dual evoca memórias profundas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-identidade-22',
    title: 'Minha História em Música (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'identidade',
    demandLabel: 'Identidade Pessoal',
    generalObjective: 'Reforçar identidade através de playlist pessoal',
    specificObjectives: [
      'Estimular identidade pessoal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Criar playlist da vida do paciente; ouvir juntos comentando. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-comunicacao-23',
    title: 'Cantar para Lembrar (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Verbal',
    generalObjective: 'Estimular linguagem via canções familiares',
    specificObjectives: [
      'Estimular comunicação verbal',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Cantar canções conhecidas; observar resgate de palavras esquecidas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-socioemocional-24',
    title: 'Música do Conforto (Variação 3)',
    disorder: 'ALZHEIMER',
    demandCategory: 'socioemocional',
    demandLabel: 'Bem-Estar Emocional',
    generalObjective: 'Promover bem-estar e reduzir agitação',
    specificObjectives: [
      'Estimular bem-estar emocional',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Música escolhida pela família tocada em momentos de ansiedade. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'alz-memoria-25',
    title: 'Canções da Juventude (Variação 4)',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória de Longo Prazo',
    generalObjective: 'Ativar memória autobiográfica através de canções marcantes',
    specificObjectives: [
      'Estimular memória de longo prazo',
      'Reduzir sintomas comportamentais',
      'Promover qualidade de vida'
    ],
    description: 'Apresentar canções dos 15-25 anos do paciente; conversar sobre memórias evocadas. Sessões centradas no paciente, respeitando seu tempo. Família é parceira fundamental na escolha do repertório.',
    materials: ['Caixa de som', 'Playlist personalizada', 'Fotos antigas', 'Objetos de reminiscência', 'Caderno de história de vida'],
    estimatedTime: '20-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Engajamento durante a sessão',
      'Resgate de informações pessoais',
      'Estado emocional pós-sessão'
    ],
    adaptations: [
      'Sessões curtas em estágios avançados',
      'Reduzir estímulos competitivos',
      'Adaptar volume conforme audição'
    ],
    theoreticalBasis: 'Fundamentado em pesquisas sobre Memória Musical Preservada na DA e Terapia de Reminiscência. Áreas cerebrais ligadas à música são frequentemente poupadas na progressão da doença.',
    ageRange: 'Idosos',
    tips: ['Envolver a família no levantamento musical', 'Documentar respostas emocionais', 'Evitar canções com conteúdo triste em fase inicial']
  },
  // ====================
  {
    id: 'park-marcha-1',
    title: 'Marcha no Pulso',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Marcha e Cadência',
    generalObjective: 'Regularizar marcha com pulso externo',
    specificObjectives: [
      'Melhorar marcha e cadência',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Paciente caminha sincronizado a metrônomo ou música marcada. Tempo ajustado à cadência ideal. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-marcha-2',
    title: 'Largada Musical',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Iniciação do Movimento',
    generalObjective: 'Facilitar iniciação do movimento',
    specificObjectives: [
      'Melhorar iniciação do movimento',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Sinal musical claro indica início; reduz freezing comum no Parkinson. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-voz_fala-3',
    title: 'Voz Forte',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Projeção Vocal',
    generalObjective: 'Aumentar intensidade vocal',
    specificObjectives: [
      'Melhorar projeção vocal',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Exercícios vocais com feedback de volume (apps de decibelímetro). Foco em projeção. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-voz_fala-4',
    title: 'Trava-Língua Cantado',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Articulação',
    generalObjective: 'Refinar articulação por meio de canto',
    specificObjectives: [
      'Melhorar articulação',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Trava-línguas musicados em diferentes velocidades. Trabalha precisão. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-tremor_rigidez-5',
    title: 'Alongamento Sonoro',
    disorder: 'PARKINSON',
    demandCategory: 'tremor_rigidez',
    demandLabel: 'Redução de Rigidez',
    generalObjective: 'Reduzir rigidez via alongamento guiado por música',
    specificObjectives: [
      'Melhorar redução de rigidez',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Música lenta acompanha alongamentos amplos; respiração coordenada. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-coordenacao-6',
    title: 'Dedilhar Rítmico',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Fina',
    generalObjective: 'Treinar coordenação fina dos dedos',
    specificObjectives: [
      'Melhorar coordenação fina',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Tocar teclado ou violão simples em padrões rítmicos. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-coordenacao-7',
    title: 'Coreografia Adaptada',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Grossa',
    generalObjective: 'Trabalhar coordenação grossa em dança',
    specificObjectives: [
      'Melhorar coordenação grossa',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Movimentos amplos e rítmicos; estabilidade priorizada. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-socioemocional-8',
    title: 'Coral Terapêutico',
    disorder: 'PARKINSON',
    demandCategory: 'socioemocional',
    demandLabel: 'Bem-Estar e Motivação',
    generalObjective: 'Promover bem-estar e socialização',
    specificObjectives: [
      'Melhorar bem-estar e motivação',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Participação em coral; canta reforça respiração, voz e identidade. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-marcha-9',
    title: 'Marcha no Pulso (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Marcha e Cadência',
    generalObjective: 'Regularizar marcha com pulso externo',
    specificObjectives: [
      'Melhorar marcha e cadência',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Paciente caminha sincronizado a metrônomo ou música marcada. Tempo ajustado à cadência ideal. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-marcha-10',
    title: 'Largada Musical (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Iniciação do Movimento',
    generalObjective: 'Facilitar iniciação do movimento',
    specificObjectives: [
      'Melhorar iniciação do movimento',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Sinal musical claro indica início; reduz freezing comum no Parkinson. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-voz_fala-11',
    title: 'Voz Forte (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Projeção Vocal',
    generalObjective: 'Aumentar intensidade vocal',
    specificObjectives: [
      'Melhorar projeção vocal',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Exercícios vocais com feedback de volume (apps de decibelímetro). Foco em projeção. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-voz_fala-12',
    title: 'Trava-Língua Cantado (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Articulação',
    generalObjective: 'Refinar articulação por meio de canto',
    specificObjectives: [
      'Melhorar articulação',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Trava-línguas musicados em diferentes velocidades. Trabalha precisão. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-tremor_rigidez-13',
    title: 'Alongamento Sonoro (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'tremor_rigidez',
    demandLabel: 'Redução de Rigidez',
    generalObjective: 'Reduzir rigidez via alongamento guiado por música',
    specificObjectives: [
      'Melhorar redução de rigidez',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Música lenta acompanha alongamentos amplos; respiração coordenada. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-coordenacao-14',
    title: 'Dedilhar Rítmico (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Fina',
    generalObjective: 'Treinar coordenação fina dos dedos',
    specificObjectives: [
      'Melhorar coordenação fina',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Tocar teclado ou violão simples em padrões rítmicos. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-coordenacao-15',
    title: 'Coreografia Adaptada (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Grossa',
    generalObjective: 'Trabalhar coordenação grossa em dança',
    specificObjectives: [
      'Melhorar coordenação grossa',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Movimentos amplos e rítmicos; estabilidade priorizada. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-socioemocional-16',
    title: 'Coral Terapêutico (Variação 2)',
    disorder: 'PARKINSON',
    demandCategory: 'socioemocional',
    demandLabel: 'Bem-Estar e Motivação',
    generalObjective: 'Promover bem-estar e socialização',
    specificObjectives: [
      'Melhorar bem-estar e motivação',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Participação em coral; canta reforça respiração, voz e identidade. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-marcha-17',
    title: 'Marcha no Pulso (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Marcha e Cadência',
    generalObjective: 'Regularizar marcha com pulso externo',
    specificObjectives: [
      'Melhorar marcha e cadência',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Paciente caminha sincronizado a metrônomo ou música marcada. Tempo ajustado à cadência ideal. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-marcha-18',
    title: 'Largada Musical (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Iniciação do Movimento',
    generalObjective: 'Facilitar iniciação do movimento',
    specificObjectives: [
      'Melhorar iniciação do movimento',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Sinal musical claro indica início; reduz freezing comum no Parkinson. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-voz_fala-19',
    title: 'Voz Forte (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Projeção Vocal',
    generalObjective: 'Aumentar intensidade vocal',
    specificObjectives: [
      'Melhorar projeção vocal',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Exercícios vocais com feedback de volume (apps de decibelímetro). Foco em projeção. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-voz_fala-20',
    title: 'Trava-Língua Cantado (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Articulação',
    generalObjective: 'Refinar articulação por meio de canto',
    specificObjectives: [
      'Melhorar articulação',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Trava-línguas musicados em diferentes velocidades. Trabalha precisão. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-tremor_rigidez-21',
    title: 'Alongamento Sonoro (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'tremor_rigidez',
    demandLabel: 'Redução de Rigidez',
    generalObjective: 'Reduzir rigidez via alongamento guiado por música',
    specificObjectives: [
      'Melhorar redução de rigidez',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Música lenta acompanha alongamentos amplos; respiração coordenada. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-coordenacao-22',
    title: 'Dedilhar Rítmico (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Fina',
    generalObjective: 'Treinar coordenação fina dos dedos',
    specificObjectives: [
      'Melhorar coordenação fina',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Tocar teclado ou violão simples em padrões rítmicos. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-coordenacao-23',
    title: 'Coreografia Adaptada (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Grossa',
    generalObjective: 'Trabalhar coordenação grossa em dança',
    specificObjectives: [
      'Melhorar coordenação grossa',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Movimentos amplos e rítmicos; estabilidade priorizada. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-socioemocional-24',
    title: 'Coral Terapêutico (Variação 3)',
    disorder: 'PARKINSON',
    demandCategory: 'socioemocional',
    demandLabel: 'Bem-Estar e Motivação',
    generalObjective: 'Promover bem-estar e socialização',
    specificObjectives: [
      'Melhorar bem-estar e motivação',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Participação em coral; canta reforça respiração, voz e identidade. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  },
  // ====================
  {
    id: 'park-marcha-25',
    title: 'Marcha no Pulso (Variação 4)',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Marcha e Cadência',
    generalObjective: 'Regularizar marcha com pulso externo',
    specificObjectives: [
      'Melhorar marcha e cadência',
      'Manter funcionalidade motora',
      'Promover qualidade de vida'
    ],
    description: 'Paciente caminha sincronizado a metrônomo ou música marcada. Tempo ajustado à cadência ideal. Sessões priorizam segurança, com cadeira disponível e monitoramento de fadiga.',
    materials: ['Metrônomo', 'Caixa de som', 'Microfone', 'App de decibelímetro', 'Tapete antiderrapante'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Cadência da marcha',
      'Intensidade vocal',
      'Amplitude de movimento'
    ],
    adaptations: [
      'Cadeira sempre disponível',
      'Sessões em janela ON da medicação',
      'Reduzir duração em dias de fadiga'
    ],
    theoreticalBasis: 'Estimulação Rítmica Auditiva (RAS) e LSVT-LOUD adaptada. Evidências consistentes em melhora de marcha, voz e qualidade de vida em pessoas com DP.',
    ageRange: 'Adultos e idosos',
    tips: ['Agendar sessões em janela ON', 'Monitorar quedas', 'Envolver fonoaudiólogo para voz']
  }

];

// Funções auxiliares
export function getActivitiesByDisorder(disorder: DisorderType): ProfessionalActivity[] {
  return professionalActivities.filter(a => a.disorder === disorder);
}

export function getActivitiesByDemand(disorder: DisorderType, demandCategory: DemandCategory): ProfessionalActivity[] {
  return professionalActivities.filter(a => a.disorder === disorder && a.demandCategory === demandCategory);
}

export function getDemandCategoriesForDisorder(disorder: DisorderType): DemandCategory[] {
  const activities = getActivitiesByDisorder(disorder);
  return [...new Set(activities.map(a => a.demandCategory))];
}
