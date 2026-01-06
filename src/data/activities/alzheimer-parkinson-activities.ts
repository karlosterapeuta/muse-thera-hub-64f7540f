import { ProfessionalActivity } from '@/data/activities-by-disorder';

// ==================== ALZHEIMER ACTIVITIES ====================
export const alzheimerActivities: ProfessionalActivity[] = [
  // ALZHEIMER - MEMÓRIA E COGNIÇÃO
  {
    id: 'alz-mem-1',
    title: 'Canções de Reminiscência',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória e Reminiscência',
    generalObjective: 'Ativar memórias autobiográficas através de músicas significativas do passado do paciente',
    specificObjectives: [
      'Estimular a evocação de memórias associadas a músicas',
      'Promover conexão com a identidade pessoal',
      'Facilitar a comunicação através de conteúdos memoráveis'
    ],
    description: 'Utiliza-se repertório musical significativo da vida do paciente (músicas de casamento, época de juventude, cantigas infantis). O terapeuta toca as músicas e observa respostas de reconhecimento, engajamento vocal, movimentos corporais e expressões faciais. Estimula-se a narrativa de memórias associadas através de perguntas abertas.',
    materials: ['Violão ou teclado', 'Playlist personalizada do paciente', 'Álbum de fotos (opcional)', 'Gravador'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Sinais de reconhecimento musical (expressão facial, movimento)',
      'Verbalizações relacionadas a memórias',
      'Engajamento vocal (canto, vocalização)',
      'Nível de participação ativa'
    ],
    adaptations: [
      'Fase inicial: Músicas muito conhecidas e repetitivas',
      'Fase intermediária: Alternar músicas familiares com novas',
      'Fase avançada: Manter apenas canções mais significativas'
    ],
    theoreticalBasis: 'Baseado na Musicoterapia de Reminiscência e estudos sobre memória musical preservada em demências. A música ativa o sistema límbico e pode acessar memórias mesmo quando outras formas de recuperação estão comprometidas.',
    ageRange: 'Adultos e idosos',
    tips: ['Pesquisar previamente o repertório musical da época de juventude do paciente', 'Envolver família na seleção de músicas significativas']
  },
  {
    id: 'alz-mem-2',
    title: 'Completar Letras de Músicas',
    disorder: 'ALZHEIMER',
    demandCategory: 'memoria',
    demandLabel: 'Memória Procedural',
    generalObjective: 'Estimular a memória procedural através do preenchimento de lacunas em letras de músicas conhecidas',
    specificObjectives: [
      'Ativar memória de longo prazo para letras musicais',
      'Promover sensação de competência e autoestima',
      'Estimular processamento linguístico através da música'
    ],
    description: 'O terapeuta canta uma música conhecida e para antes de palavras-chave, aguardando que o paciente complete. Utiliza-se gestos de expectativa e pausas musicais. Reforço positivo para qualquer tentativa de completar. Progressão: palavras finais de versos → palavras do meio → trechos maiores.',
    materials: ['Instrumento harmônico', 'Lista de canções conhecidas pelo paciente', 'Cartões com imagens das músicas (opcional)'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Número de palavras completadas corretamente',
      'Tempo de latência para resposta',
      'Espontaneidade nas respostas',
      'Expressão de satisfação'
    ],
    adaptations: [
      'Usar pistas visuais para ajudar',
      'Reduzir número de pausas se houver frustração',
      'Escolher músicas com refrões muito repetitivos'
    ],
    theoreticalBasis: 'A memória para letras de músicas aprendidas é frequentemente preservada na doença de Alzheimer, pois envolve memória procedural e está associada a forte carga emocional.',
    ageRange: 'Adultos e idosos'
  },
  {
    id: 'alz-ori-1',
    title: 'Canções de Orientação Temporal',
    disorder: 'ALZHEIMER',
    demandCategory: 'orientacao',
    demandLabel: 'Orientação Temporal',
    generalObjective: 'Utilizar música para auxiliar na orientação quanto a dia, data, estação e momento do dia',
    specificObjectives: [
      'Criar âncoras musicais para diferentes momentos do dia',
      'Associar melodias a rotinas diárias',
      'Reduzir desorientação através de estrutura musical previsível'
    ],
    description: 'Criação de canções específicas para diferentes momentos: canção de bom dia, canção do almoço, canção da tarde, canção de boa noite. Cada canção menciona o momento, dia da semana e estação do ano. A mesma melodia é utilizada diariamente para criar previsibilidade e orientação temporal.',
    materials: ['Instrumento harmônico', 'Relógio grande', 'Calendário visual', 'Cartões com estações'],
    estimatedTime: '10-15 minutos por momento',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Antecipação do momento do dia',
      'Participação vocal nas canções',
      'Redução de perguntas repetitivas sobre horário'
    ],
    adaptations: [
      'Usar sempre a mesma melodia para cada momento',
      'Incluir elementos visuais de apoio',
      'Gravar as canções para uso pela família'
    ],
    theoreticalBasis: 'A música fornece estrutura temporal e pode servir como âncora para orientação. Ritmos circadianos podem ser reforçados através de rotinas musicais.',
    ageRange: 'Adultos e idosos',
    tips: ['Treinar cuidadores para usar as mesmas canções', 'Manter consistência absoluta nas melodias']
  },
  {
    id: 'alz-id-1',
    title: 'Playlist Autobiográfica',
    disorder: 'ALZHEIMER',
    demandCategory: 'identidade',
    demandLabel: 'Manutenção de Identidade',
    generalObjective: 'Construir e utilizar uma playlist personalizada que represente a história de vida do paciente',
    specificObjectives: [
      'Documentar preferências musicais do paciente',
      'Criar ferramenta de conexão com identidade pessoal',
      'Promover bem-estar através de música significativa'
    ],
    description: 'Pesquisa detalhada com paciente e família sobre músicas importantes em diferentes fases da vida: infância, adolescência, casamento, nascimento de filhos, trabalho. Criação de playlist organizada cronologicamente. Uso regular para estimular narrativas autobiográficas e manter conexão com história pessoal.',
    materials: ['Dispositivo de som', 'Formulário de história musical', 'Fotos de diferentes épocas', 'Aplicativo de playlist'],
    estimatedTime: '45-60 minutos (inicial) / 30 minutos (uso)',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento durante audição',
      'Verbalizações autobiográficas',
      'Expressões emocionais positivas',
      'Reconhecimento de músicas'
    ],
    adaptations: [
      'Para pacientes não verbais: observar expressões e movimentos',
      'Incluir músicas religiosas se significativas',
      'Adaptar volume conforme sensibilidade auditiva'
    ],
    theoreticalBasis: 'Baseado no Music & Memory e Playlist for Life. Músicas significativas podem reativar senso de identidade e reduzir sintomas comportamentais e psicológicos da demência.',
    ageRange: 'Adultos e idosos',
    tips: ['Documentar reações a cada música', 'Atualizar playlist conforme novas informações']
  },
  {
    id: 'alz-com-1',
    title: 'Comunicação Cantada',
    disorder: 'ALZHEIMER',
    demandCategory: 'comunicacao',
    demandLabel: 'Comunicação Verbal',
    generalObjective: 'Facilitar a comunicação verbal através do canto e melodia',
    specificObjectives: [
      'Utilizar música para estimular produção de palavras',
      'Facilitar expressão de necessidades através de canções',
      'Manter habilidades de comunicação por mais tempo'
    ],
    description: 'Transformar solicitações e perguntas em melodias simples. Cantar instruções e esperar respostas cantadas. Usar melodias familiares com letras adaptadas para comunicação funcional. O ritmo e a melodia funcionam como suporte para a produção de fala.',
    materials: ['Instrumento harmônico', 'Cartões de comunicação', 'Gestos padronizados'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Aumento de verbalizações durante música',
      'Compreensão de instruções cantadas',
      'Tentativas de comunicação espontânea'
    ],
    adaptations: [
      'Para afasia: aceitar vocalizações não verbais',
      'Usar gestos junto com canto',
      'Manter melodias muito simples e repetitivas'
    ],
    theoreticalBasis: 'A música pode facilitar a fala em pessoas com afasia, pois ativa áreas cerebrais bilaterais e a melodia pode compensar déficits de linguagem do hemisfério esquerdo.',
    ageRange: 'Adultos e idosos'
  },
  {
    id: 'alz-comp-1',
    title: 'Música para Agitação',
    disorder: 'ALZHEIMER',
    demandCategory: 'comportamento',
    demandLabel: 'Regulação Comportamental',
    generalObjective: 'Utilizar música para reduzir agitação e comportamentos desafiadores',
    specificObjectives: [
      'Acalmar através de música familiar e tranquila',
      'Redirecionar atenção de estímulos estressores',
      'Promover relaxamento e bem-estar'
    ],
    description: 'Identificação de músicas que acalmam o paciente específico. Uso de tempo musical lento (60-80 bpm) sincronizado com respiração. Cantar suavemente próximo ao paciente. Técnica de "música espelho" - iniciar no estado emocional atual e gradualmente conduzir para calma.',
    materials: ['Instrumento de som suave', 'Playlist de músicas calmas', 'Ambiente com baixa estimulação'],
    estimatedTime: '15-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Redução de comportamentos de agitação',
      'Diminuição de vocalização negativa',
      'Relaxamento corporal visível',
      'Melhora na expressão facial'
    ],
    adaptations: [
      'Evitar músicas com letras tristes ou que evoquem memórias difíceis',
      'Ajustar volume conforme sensibilidade',
      'Usar harpa, flauta ou voz suave'
    ],
    theoreticalBasis: 'Estudos demonstram que música pode reduzir agitação em demência tão efetivamente quanto medicamentos em alguns casos, sem efeitos colaterais.',
    ageRange: 'Adultos e idosos',
    contraindications: ['Evitar em crises de agressividade física grave'],
    tips: ['Manter registro de músicas efetivas para cada paciente', 'Treinar cuidadores no uso da técnica']
  },
  {
    id: 'alz-soc-1',
    title: 'Canto em Grupo',
    disorder: 'ALZHEIMER',
    demandCategory: 'socioemocional',
    demandLabel: 'Interação Social',
    generalObjective: 'Promover interação social e senso de pertencimento através do canto coletivo',
    specificObjectives: [
      'Reduzir isolamento social',
      'Promover experiências de grupo positivas',
      'Manter habilidades sociais através da música'
    ],
    description: 'Sessões de canto em grupo com músicas conhecidas por todos os participantes. Organização em círculo para contato visual. Uso de instrumentos simples de percussão para participação ativa. Momentos de socialização entre as músicas. Canções que promovam interação (canções de roda, cantigas folclóricas).',
    materials: ['Instrumento harmônico', 'Instrumentos de percussão variados', 'Letra das músicas em tamanho grande'],
    estimatedTime: '45-60 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Participação ativa no canto',
      'Interação com outros participantes',
      'Expressões de prazer e conexão',
      'Permanência no grupo'
    ],
    adaptations: [
      'Incluir músicas de diferentes décadas',
      'Permitir participação silenciosa',
      'Adaptar para grupos menores se necessário'
    ],
    theoreticalBasis: 'O canto em grupo promove sincronia social, libera oxitocina e pode compensar déficits sociais causados pela demência.',
    ageRange: 'Adultos e idosos'
  },
  {
    id: 'alz-mot-1',
    title: 'Movimento e Dança Sentada',
    disorder: 'ALZHEIMER',
    demandCategory: 'motor',
    demandLabel: 'Manutenção Motora',
    generalObjective: 'Manter habilidades motoras e mobilidade através de movimentos sincronizados com música',
    specificObjectives: [
      'Estimular movimento de membros superiores e inferiores',
      'Manter amplitude de movimento',
      'Promover prazer através de dança adaptada'
    ],
    description: 'Sequências de movimentos simples sincronizados com músicas animadas. Movimentos de braços, mãos, pés e tronco adaptados para posição sentada. Uso de objetos (lenços, bolas leves) para estimular movimento. Ritmo musical claro e previsível.',
    materials: ['Sistema de som', 'Lenços coloridos', 'Bolas leves', 'Cadeiras seguras'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Amplitude de movimentos',
      'Sincronização com ritmo',
      'Expressão de prazer',
      'Participação espontânea'
    ],
    adaptations: [
      'Reduzir complexidade de movimentos conforme capacidade',
      'Usar músicas mais lentas para maior controle',
      'Permitir participação parcial'
    ],
    theoreticalBasis: 'A música facilita o movimento através de entrainment rítmico e pode estimular áreas motoras preservadas mesmo em demência avançada.',
    ageRange: 'Adultos e idosos'
  }
];

// ==================== PARKINSON ACTIVITIES ====================
export const parkinsonActivities: ProfessionalActivity[] = [
  // PARKINSON - MARCHA E LOCOMOÇÃO
  {
    id: 'park-march-1',
    title: 'RAS - Estimulação Rítmica Auditiva para Marcha',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Marcha e Locomoção',
    generalObjective: 'Melhorar padrão de marcha através de estimulação rítmica auditiva (RAS)',
    specificObjectives: [
      'Aumentar velocidade e comprimento do passo',
      'Melhorar simetria da marcha',
      'Reduzir episódios de congelamento (freezing)'
    ],
    description: 'Técnica de Musicoterapia Neurológica (NMT). O paciente caminha sincronizando seus passos com um ritmo auditivo externo (metrônomo, música com batida marcada). Inicia-se com o ritmo natural do paciente e gradualmente aumenta-se 5-10% para desafiar o sistema motor. A música fornece pista externa para iniciação e manutenção do movimento.',
    materials: ['Metrônomo', 'Sistema de som portátil', 'Playlist com batidas marcadas', 'Corredor livre de obstáculos'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Velocidade da marcha (metros por minuto)',
      'Comprimento do passo',
      'Simetria entre passos',
      'Frequência de episódios de freezing'
    ],
    adaptations: [
      'Usar ritmo mais lento para pacientes mais comprometidos',
      'Adicionar pistas visuais no chão',
      'Utilizar andador se necessário'
    ],
    theoreticalBasis: 'RAS é uma técnica baseada em evidências da Musicoterapia Neurológica (NMT). O ritmo auditivo ativa vias auditivo-motoras que podem compensar déficits dos gânglios da base.',
    ageRange: 'Adultos',
    tips: ['Calcular cadência basal antes de iniciar', 'Progressão gradual de 5-10% do ritmo']
  },
  {
    id: 'park-march-2',
    title: 'Caminhada Musical com Variações',
    disorder: 'PARKINSON',
    demandCategory: 'marcha',
    demandLabel: 'Flexibilidade da Marcha',
    generalObjective: 'Desenvolver flexibilidade e adaptabilidade na marcha através de variações musicais',
    specificObjectives: [
      'Adaptar padrão de marcha a diferentes ritmos',
      'Melhorar resposta a mudanças de velocidade',
      'Trabalhar iniciação e parada do movimento'
    ],
    description: 'Caminhada sincronizada com música que varia em andamento (acelerando, desacelerando, parando). Uso de músicas com mudanças previsíveis de ritmo. Treino de resposta a mudanças musicais: parar quando a música para, mudar direção com mudança de melodia, acelerar/desacelerar com o tempo musical.',
    materials: ['Sistema de som', 'Playlist com variações de tempo', 'Espaço amplo para caminhada'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de resposta a mudanças',
      'Qualidade das transições',
      'Manutenção da sincronização'
    ],
    adaptations: [
      'Avisos verbais antes das mudanças',
      'Transições mais graduais',
      'Reduzir complexidade das variações'
    ],
    theoreticalBasis: 'A variabilidade rítmica desafia o sistema motor de forma controlada, promovendo maior flexibilidade e adaptabilidade.',
    ageRange: 'Adultos'
  },
  {
    id: 'park-voz-1',
    title: 'Exercícios Vocais Cantados',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Voz e Projeção Vocal',
    generalObjective: 'Melhorar volume, projeção e qualidade vocal através do canto',
    specificObjectives: [
      'Aumentar intensidade vocal',
      'Melhorar articulação e inteligibilidade',
      'Expandir extensão vocal e controle respiratório'
    ],
    description: 'Exercícios vocais estruturados utilizando canto. Inclui: vocalizes em vogais sustentadas com aumento gradual de intensidade, canções que exigem projeção vocal, exercícios de articulação com sílabas cantadas, treino de respiração diafragmática com suporte musical. O canto naturalmente induz maior volume vocal.',
    materials: ['Instrumento harmônico', 'Espelho para feedback visual', 'Medidor de decibéis (opcional)', 'Água'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Intensidade vocal (decibéis)',
      'Clareza da articulação',
      'Sustentação de notas',
      'Controle respiratório'
    ],
    adaptations: [
      'Exercícios mais curtos para fadiga vocal',
      'Foco em vogais se articulação muito comprometida',
      'Uso de amplificação se necessário'
    ],
    theoreticalBasis: 'O canto ativa mecanismos de projeção vocal diferentes da fala, podendo compensar a hipofonia característica do Parkinson. Similaridades com LSVT (Lee Silverman Voice Treatment).',
    ageRange: 'Adultos',
    tips: ['Incentivar canto "forte" desde o início', 'Manter postura adequada']
  },
  {
    id: 'park-voz-2',
    title: 'Canto Coral Terapêutico',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Voz e Socialização',
    generalObjective: 'Melhorar função vocal e promover participação social através de canto em grupo',
    specificObjectives: [
      'Estimular projeção vocal em contexto grupal',
      'Promover suporte social entre pacientes',
      'Manter engajamento musical regular'
    ],
    description: 'Grupo de canto regular para pessoas com Parkinson. Repertório escolhido coletivamente. Aquecimento vocal, exercícios respiratórios, prática de canções. Ênfase em volume, articulação e expressividade. Apresentações ocasionais para família e comunidade como motivação.',
    materials: ['Instrumento harmônico', 'Letras em tamanho grande', 'Cadeiras com apoio', 'Sistema de som'],
    estimatedTime: '60-90 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Participação nas sessões',
      'Melhora vocal ao longo do tempo',
      'Satisfação e bem-estar reportados'
    ],
    adaptations: [
      'Aceitar participação em diferentes níveis',
      'Incluir pausas para descanso',
      'Repertório familiar para facilitar'
    ],
    theoreticalBasis: 'Estudos como ParkinSong demonstram benefícios do canto coral para voz, respiração, humor e qualidade de vida em Parkinson.',
    ageRange: 'Adultos'
  },
  {
    id: 'park-coord-1',
    title: 'Padrões Rítmicos de Coordenação',
    disorder: 'PARKINSON',
    demandCategory: 'coordenacao',
    demandLabel: 'Coordenação Motora',
    generalObjective: 'Desenvolver coordenação motora fina e grossa através de padrões rítmicos',
    specificObjectives: [
      'Melhorar coordenação bilateral',
      'Aumentar velocidade de movimentos alternados',
      'Desenvolver destreza manual através de instrumentos'
    ],
    description: 'Execução de padrões rítmicos em instrumentos de percussão (tambor, claves, pandeiro). Progressão de padrões simples (batidas unilaterais) para complexos (alternância, sequências). Sincronização com música. Exercícios de coordenação mão-olho-ouvido.',
    materials: ['Instrumentos de percussão variados', 'Metrônomo', 'Baquetas de diferentes pesos', 'Sistema de som'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão rítmica',
      'Velocidade de alternância',
      'Manutenção de padrões',
      'Coordenação bilateral'
    ],
    adaptations: [
      'Instrumentos adaptados para grip',
      'Padrões mais simples',
      'Tempo musical mais lento'
    ],
    theoreticalBasis: 'TIMP (Therapeutic Instrumental Music Performance) da NMT. A execução instrumental fornece feedback auditivo imediato e promove organização motora.',
    ageRange: 'Adultos'
  },
  {
    id: 'park-trem-1',
    title: 'Música para Relaxamento e Redução de Rigidez',
    disorder: 'PARKINSON',
    demandCategory: 'tremor_rigidez',
    demandLabel: 'Rigidez Muscular',
    generalObjective: 'Promover relaxamento muscular e redução de rigidez através de técnicas musicais',
    specificObjectives: [
      'Induzir relaxamento muscular global',
      'Reduzir tensão associada à rigidez',
      'Melhorar sensação de bem-estar físico'
    ],
    description: 'Sessão de relaxamento guiada com música. Uso de música calma (60-80 bpm) sincronizada com respiração. Técnicas de imaginação guiada com paisagens sonoras. Movimentos suaves e fluidos de alongamento acompanhados de música. Massagem sonora com instrumentos vibratórios.',
    materials: ['Sistema de som de qualidade', 'Colchonete ou cadeira reclinável', 'Instrumentos de som suave (tigela tibetana, pau de chuva)'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Relato subjetivo de relaxamento',
      'Observação de redução de tensão',
      'Qualidade do sono após sessão'
    ],
    adaptations: [
      'Posição sentada se não conseguir deitar',
      'Menor duração se inquietação',
      'Volume baixo se sensibilidade auditiva'
    ],
    theoreticalBasis: 'Música pode modular o sistema nervoso autônomo, promovendo estado parassimpático e redução de tensão muscular.',
    ageRange: 'Adultos'
  },
  {
    id: 'park-rit-1',
    title: 'Dança Terapêutica para Parkinson',
    disorder: 'PARKINSON',
    demandCategory: 'motor',
    demandLabel: 'Movimento Global',
    generalObjective: 'Melhorar mobilidade, equilíbrio e expressividade através da dança terapêutica',
    specificObjectives: [
      'Promover movimentos amplos e fluidos',
      'Melhorar equilíbrio e controle postural',
      'Estimular expressão emocional através do movimento'
    ],
    description: 'Adaptação de técnicas de dança (tango, valsa, dança contemporânea) para pessoas com Parkinson. Movimentos guiados pela música com foco em amplitude, fluidez e expressão. Trabalho em pares para suporte mútuo. Combinação de movimentos livres e coreografados.',
    materials: ['Sistema de som', 'Espaço amplo', 'Barras de apoio (opcional)', 'Músicas com ritmos claros'],
    estimatedTime: '45-60 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Amplitude de movimentos',
      'Equilíbrio durante movimentação',
      'Expressividade corporal',
      'Participação e prazer'
    ],
    adaptations: [
      'Cadeira para movimentos sentados',
      'Apoio de parceiro ou barra',
      'Músicas mais lentas para maior controle'
    ],
    theoreticalBasis: 'Programas como Dance for PD demonstram benefícios da dança para sintomas motores e não-motores do Parkinson.',
    ageRange: 'Adultos',
    tips: ['Programa Dance for PD como referência', 'Variar estilos de dança']
  },
  {
    id: 'park-cog-1',
    title: 'Tarefas Cognitivo-Motoras com Música',
    disorder: 'PARKINSON',
    demandCategory: 'cognitivo',
    demandLabel: 'Cognição e Funções Executivas',
    generalObjective: 'Estimular funções executivas através de tarefas duais cognitivo-motoras musicais',
    specificObjectives: [
      'Melhorar capacidade de dual-task',
      'Estimular atenção dividida',
      'Trabalhar memória de trabalho'
    ],
    description: 'Atividades que combinam demanda cognitiva e motora simultaneamente com suporte musical. Exemplos: tocar ritmo enquanto canta letra diferente, caminhar no ritmo enquanto responde perguntas, sequenciar instrumentos seguindo regras complexas. A música fornece estrutura temporal para as tarefas.',
    materials: ['Instrumentos variados', 'Cartões com tarefas', 'Metrônomo', 'Sistema de som'],
    estimatedTime: '35-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Manutenção de ambas as tarefas',
      'Qualidade de execução em dual-task',
      'Progressão na complexidade tolerada'
    ],
    adaptations: [
      'Iniciar com tarefas mais simples',
      'Aumentar gradualmente a demanda',
      'Pausas frequentes para evitar fadiga'
    ],
    theoreticalBasis: 'Déficits em dual-task são comuns no Parkinson e contribuem para quedas. O treino com música pode melhorar esta capacidade.',
    ageRange: 'Adultos'
  },
  {
    id: 'park-emoc-1',
    title: 'Expressão Emocional Musical',
    disorder: 'PARKINSON',
    demandCategory: 'socioemocional',
    demandLabel: 'Expressão Emocional',
    generalObjective: 'Facilitar expressão e processamento emocional através da música',
    specificObjectives: [
      'Compensar máscara facial através de expressão musical',
      'Processar sentimentos relacionados à doença',
      'Promover bem-estar emocional'
    ],
    description: 'Uso de música para expressão de emoções que podem estar "presas" pela máscara facial. Improvisação musical como canal de expressão. Discussão de letras de músicas que ressoam com a experiência de viver com Parkinson. Criação de canções sobre a jornada com a doença.',
    materials: ['Instrumentos variados', 'Letras de músicas significativas', 'Material para songwriting'],
    estimatedTime: '40-50 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Engajamento na expressão musical',
      'Verbalização de sentimentos',
      'Mudanças no humor reportadas'
    ],
    adaptations: [
      'Foco em audição se expressão difícil',
      'Técnicas não-verbais para menos verbal',
      'Abordagem mais leve se muito difícil'
    ],
    theoreticalBasis: 'Depressão e ansiedade são comuns no Parkinson. A música oferece canal de expressão que transcende limitações motoras da face.',
    ageRange: 'Adultos'
  },
  {
    id: 'park-deg-1',
    title: 'Exercícios Orais Rítmicos',
    disorder: 'PARKINSON',
    demandCategory: 'voz_fala',
    demandLabel: 'Deglutição e Articulação',
    generalObjective: 'Fortalecer musculatura oral e melhorar articulação através de exercícios rítmicos',
    specificObjectives: [
      'Melhorar controle de lábios e língua',
      'Aumentar força e coordenação orofacial',
      'Prevenir deterioração da deglutição'
    ],
    description: 'Exercícios de lábios, língua e mandíbula realizados no ritmo da música. Sequências de movimentos orais sincronizados com batida. Vocalizações específicas para diferentes músculos. Exercícios de sopro com instrumentos de sopro simples (kazoo, flauta de êmbolo).',
    materials: ['Instrumento harmônico', 'Espelho', 'Kazoo ou flauta de êmbolo', 'Canudos de diferentes diâmetros'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão dos movimentos orais',
      'Força de sopro',
      'Clareza na articulação de sílabas'
    ],
    adaptations: [
      'Movimentos mais lentos',
      'Foco em grupos musculares específicos',
      'Intervalos de descanso'
    ],
    theoreticalBasis: 'OMREX (Oral Motor and Respiratory Exercises) da NMT utiliza ritmo para organizar exercícios orofaciais.',
    ageRange: 'Adultos'
  }
];

// Exportar todas as atividades combinadas
export const neurologicalActivities = [...alzheimerActivities, ...parkinsonActivities];

// Categorias de demanda específicas para Alzheimer
export const alzheimerDemandCategories = [
  {
    category: 'Memória e Cognição',
    icon: '🧠',
    subDemands: [
      { id: 'alz-mem-1', label: 'Perda de memória recente' },
      { id: 'alz-mem-2', label: 'Dificuldade em lembrar nomes e rostos' },
      { id: 'alz-mem-3', label: 'Desorientação temporal' },
      { id: 'alz-mem-4', label: 'Desorientação espacial' },
      { id: 'alz-mem-5', label: 'Dificuldade com sequências' }
    ]
  },
  {
    category: 'Comunicação e Linguagem',
    icon: '💬',
    subDemands: [
      { id: 'alz-com-1', label: 'Dificuldade em encontrar palavras' },
      { id: 'alz-com-2', label: 'Perda progressiva de vocabulário' },
      { id: 'alz-com-3', label: 'Dificuldade de compreensão' }
    ]
  },
  {
    category: 'Comportamento e Humor',
    icon: '😊',
    subDemands: [
      { id: 'alz-comp-1', label: 'Agitação e irritabilidade' },
      { id: 'alz-comp-2', label: 'Apatia e isolamento' },
      { id: 'alz-comp-3', label: 'Ansiedade e medo' },
      { id: 'alz-comp-4', label: 'Sundowning (agitação vespertina)' }
    ]
  },
  {
    category: 'Identidade e Reminiscência',
    icon: '📷',
    subDemands: [
      { id: 'alz-id-1', label: 'Perda de identidade pessoal' },
      { id: 'alz-id-2', label: 'Dificuldade em reconhecer familiares' },
      { id: 'alz-id-3', label: 'Perda de história de vida' }
    ]
  }
];

// Categorias de demanda específicas para Parkinson
export const parkinsonDemandCategories = [
  {
    category: 'Motor e Marcha',
    icon: '🚶',
    subDemands: [
      { id: 'park-mot-1', label: 'Bradicinesia (lentidão de movimentos)' },
      { id: 'park-mot-2', label: 'Festinação e congelamento da marcha' },
      { id: 'park-mot-3', label: 'Instabilidade postural' },
      { id: 'park-mot-4', label: 'Dificuldade em iniciar movimentos' }
    ]
  },
  {
    category: 'Tremor e Rigidez',
    icon: '✋',
    subDemands: [
      { id: 'park-trem-1', label: 'Tremor de repouso' },
      { id: 'park-trem-2', label: 'Rigidez muscular' },
      { id: 'park-trem-3', label: 'Dificuldade de relaxamento' }
    ]
  },
  {
    category: 'Voz e Comunicação',
    icon: '🗣️',
    subDemands: [
      { id: 'park-voz-1', label: 'Hipofonia (voz baixa)' },
      { id: 'park-voz-2', label: 'Monotonia vocal' },
      { id: 'park-voz-3', label: 'Disartria' },
      { id: 'park-voz-4', label: 'Dificuldade de projeção vocal' }
    ]
  },
  {
    category: 'Emocional e Social',
    icon: '💞',
    subDemands: [
      { id: 'park-emo-1', label: 'Depressão associada' },
      { id: 'park-emo-2', label: 'Ansiedade e isolamento' },
      { id: 'park-emo-3', label: 'Perda de expressão facial' }
    ]
  }
];
