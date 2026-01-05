export type DisorderType = 'TEA' | 'TDAH' | 'TOD' | 'DI';

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
  | 'autonomia';

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
  autonomia: { name: 'Autonomia', icon: '🌟' }
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
