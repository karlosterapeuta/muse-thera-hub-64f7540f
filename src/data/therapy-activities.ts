import { TherapyActivity } from '@/types/therapy-activity';

export const therapyActivities: TherapyActivity[] = [
  // TEA - Comunicação
  {
    id: 'tea-comunicacao-1',
    disorder: 'TEA',
    demand: 'Comunicação e Linguagem',
    specialty: 'Musicoterapia',
    generalObjective: 'Promover o desenvolvimento da comunicação verbal e não-verbal através de experiências musicais estruturadas',
    specificObjective: 'O paciente será capaz de iniciar e responder a trocas comunicativas utilizando vocalizações, gestos ou palavras durante atividades musicais em pelo menos 3 ocasiões por sessão',
    activityDescription: 'Diálogo Musical Cantado: O terapeuta inicia uma conversa musical simples com perguntas melódicas ("Como você está hoje?") e espera pela resposta vocal, gestual ou instrumental do paciente. Utiliza-se o eco musical, onde o terapeuta canta uma frase e o paciente repete ou responde com seu instrumento. Gradualmente, introduz-se turnos de conversação musical com pausas intencionais para estimular a iniciativa comunicativa.',
    materials: [
      'Violão ou teclado',
      'Instrumentos de percussão simples (pandeiro, chocalho)',
      'Figuras de comunicação alternativa (PECS)',
      'Cartões com expressões faciais',
      'Gravador para registro'
    ],
    estimatedTime: '30-45 minutos',
    evaluationCriteria: [
      'Frequência de iniciativas comunicativas espontâneas',
      'Qualidade das respostas às perguntas musicais',
      'Uso de vocalizações, palavras ou gestos comunicativos',
      'Tempo de latência entre estímulo e resposta',
      'Capacidade de manter turnos de interação musical'
    ],
    complexityLevel: 'Moderado'
  },

  // TEA - Sensorial
  {
    id: 'tea-sensorial-1',
    disorder: 'TEA',
    demand: 'Sensorial e Motor',
    specialty: 'Musicoterapia',
    generalObjective: 'Desenvolver a integração sensorial e regulação através de experiências musicais multissensoriais',
    specificObjective: 'O paciente demonstrará maior tolerância a estímulos sonoros variados, permanecendo engajado em atividades com diferentes texturas sonoras por pelo menos 10 minutos consecutivos',
    activityDescription: 'Exploração Sonora Multissensorial: Apresentação gradual de instrumentos com diferentes texturas sonoras (suaves, ásperos, metálicos, madeira). Inicia-se com sons familiares e confortáveis, progredindo para novos timbres. Inclui experiências táteis com vibração de instrumentos (tambor oceânico, metalofone), associando som e sensação. Utiliza recursos visuais (luzes, cores) sincronizados com ritmos musicais para integração sensorial.',
    materials: [
      'Instrumentos de diferentes texturas (tambor oceânico, rain stick, metalofone)',
      'Tecidos de texturas variadas',
      'Bolas sensoriais',
      'Sistema de som com controle de volume',
      'Luzes LED coloridas',
      'Almofadas vibratórias'
    ],
    estimatedTime: '25-40 minutos',
    evaluationCriteria: [
      'Tempo de permanência na atividade',
      'Sinais de desconforto ou sobrecarga sensorial (redução)',
      'Variedade de timbres tolerados',
      'Iniciativa na exploração de novos instrumentos',
      'Capacidade de autorregulação durante estímulos intensos'
    ],
    complexityLevel: 'Leve'
  },

  // TDAH - Atenção
  {
    id: 'tdah-atencao-1',
    disorder: 'TDAH',
    demand: 'Atenção e Funções Executivas',
    specialty: 'Musicoterapia',
    generalObjective: 'Ampliar a capacidade de sustentação da atenção e controle inibitório através de tarefas musicais estruturadas',
    specificObjective: 'O paciente será capaz de manter foco em uma tarefa musical estruturada por períodos progressivamente maiores, iniciando com 5 minutos e atingindo 15 minutos de atenção sustentada',
    activityDescription: 'Jogo Musical de Atenção Seletiva: Atividade em etapas com complexidade crescente. Fase 1: Tocar instrumento apenas quando ouvir determinado som/ritmo. Fase 2: Executar padrões rítmicos seguindo sequências apresentadas. Fase 3: Jogo de "stop musical" onde deve parar/continuar conforme sinais sonoros. Inclui reforço positivo imediato e registro visual de progressos. Pausas programadas para evitar fadiga atencional.',
    materials: [
      'Metrônomo',
      'Instrumentos de percussão variados',
      'Cartões com símbolos rítmicos',
      'Cronômetro visível',
      'Sistema de pontuação visual',
      'Caderno de registro de progressos'
    ],
    estimatedTime: '30-45 minutos',
    evaluationCriteria: [
      'Tempo de atenção sustentada em cada fase',
      'Número de respostas corretas aos estímulos',
      'Frequência de impulsividade (tocar fora da hora)',
      'Capacidade de retomar foco após distração',
      'Progressão na complexidade das tarefas'
    ],
    complexityLevel: 'Moderado'
  },

  // TDAH - Comportamento
  {
    id: 'tdah-comportamento-1',
    disorder: 'TDAH',
    demand: 'Comportamento',
    specialty: 'Musicoterapia',
    generalObjective: 'Desenvolver autorregulação comportamental e controle motor através de atividades rítmicas estruturadas',
    specificObjective: 'O paciente demonstrará redução de movimentos impulsivos em 50%, conseguindo seguir padrões rítmicos com movimentos controlados durante 10 minutos',
    activityDescription: 'Ritmo e Controle Corporal: Sequências de movimentos sincronizados com música em diferentes andamentos. Inicia-se com ritmos rápidos (descarregar energia) e gradualmente reduz o tempo para ritmos lentos (controle). Inclui exercícios de "congelamento" (parar movimento ao cessar música), dança com mudança de velocidade, e imitação de movimentos do terapeuta seguindo padrões rítmicos. Reforça-se o automonitoramento através de espelho ou vídeo.',
    materials: [
      'Sistema de som com músicas em diferentes andamentos',
      'Tambor ou pandeiro para marcação',
      'Espelho grande ou tablet para gravação',
      'Tapete demarcado com espaços',
      'Fitas coloridas para movimentos',
      'Bola terapêutica'
    ],
    estimatedTime: '35-50 minutos',
    evaluationCriteria: [
      'Precisão na sincronia entre movimento e música',
      'Capacidade de modular velocidade dos movimentos',
      'Tempo de permanência em posição estática (congelamento)',
      'Frequência de movimentos impulsivos não solicitados',
      'Consciência corporal durante a atividade'
    ],
    complexityLevel: 'Moderado'
  },

  // TOD - Socioemocional
  {
    id: 'tod-socioemocional-1',
    disorder: 'TOD',
    demand: 'Socioemocional',
    specialty: 'Musicoterapia',
    generalObjective: 'Promover o reconhecimento e expressão adequada de emoções através de experiências musicais expressivas',
    specificObjective: 'O paciente identificará e nomeará pelo menos 4 emoções diferentes através de improvisações musicais, expressando sentimentos de forma não-destrutiva em 80% das ocasiões',
    activityDescription: 'Improvisação Emocional Guiada: Apresentação de diferentes emoções através de cartões ilustrados. Para cada emoção, o paciente escolhe um instrumento e cria uma improvisação sonora que represente aquele sentimento. O terapeuta valida e reflete a expressão musical, nomeando a emoção. Progressivamente, trabalha-se situações do cotidiano que geram frustração, permitindo expressão musical ao invés de comportamento opositor. Inclui técnica de "transformação musical" onde sons agressivos gradualmente se tornam harmoniosos.',
    materials: [
      'Cartões com faces emocionais',
      'Tambores e instrumentos de percussão',
      'Teclado ou metalofone',
      'Gravador para registro das improvisações',
      'Diário emocional ilustrado',
      'Almofada de desabafo'
    ],
    estimatedTime: '40-50 minutos',
    evaluationCriteria: [
      'Variedade de emoções expressas musicalmente',
      'Adequação da expressão musical à emoção',
      'Capacidade de verbalizar sentimentos após improvisação',
      'Redução de comportamentos destrutivos',
      'Uso espontâneo da música como canal de expressão emocional'
    ],
    complexityLevel: 'Severo'
  },

  // TOD - Comportamento
  {
    id: 'tod-comportamento-1',
    disorder: 'TOD',
    demand: 'Comportamento',
    specialty: 'Musicoterapia',
    generalObjective: 'Desenvolver habilidades de cooperação, aceitação de regras e tolerância à frustração através de jogos musicais estruturados',
    specificObjective: 'O paciente participará de atividades cooperativas seguindo regras estabelecidas em pelo menos 70% das tentativas, aceitando perder sem comportamento opositor em 3 de 5 jogos',
    activityDescription: 'Jogos Musicais Cooperativos: Atividades em que o sucesso depende de cooperação e seguimento de regras. Inclui: 1) Orquestra musical onde cada um toca sua parte seguindo regência; 2) Jogo de "passe o som" onde padrão rítmico deve ser mantido em grupo; 3) Composição coletiva onde cada um contribui com ideias respeitando turnos; 4) Desafios musicais com vitória e derrota, trabalhando frustração. Reforço positivo para cooperação e aceitação de limites.',
    materials: [
      'Instrumentos suficientes para todos',
      'Cartões com regras ilustradas',
      'Batuta de regência',
      'Cronômetro',
      'Sistema de pontuação justo e visível',
      'Certificados de participação'
    ],
    estimatedTime: '45-60 minutos',
    evaluationCriteria: [
      'Frequência de seguimento espontâneo de regras',
      'Reações emocionais ao perder (escala 1-5)',
      'Número de conflitos durante atividades cooperativas',
      'Qualidade das contribuições para trabalho em grupo',
      'Capacidade de negociar ao invés de impor'
    ],
    complexityLevel: 'Severo'
  },

  // DI - Cognição
  {
    id: 'di-cognicao-1',
    disorder: 'DI',
    demand: 'Cognição e Aprendizagem',
    specialty: 'Musicoterapia',
    generalObjective: 'Estimular funções cognitivas básicas (memória, atenção, sequenciação) através de atividades musicais adaptadas',
    specificObjective: 'O paciente reproduzirá sequências rítmicas simples de 3 elementos com 80% de acerto, demonstrando evolução na memória de trabalho e sequenciação',
    activityDescription: 'Sequências Musicais Progressivas: Atividades de repetição e criação de padrões sonoros com complexidade crescente. Inicia-se com 2 sons (palma-palma), progride para 3 sons (palma-pé-palma), até sequências de 5 elementos. Utiliza recursos visuais associados (cores, símbolos) para suporte à memória. Inclui canções com estruturas repetitivas, jogos de memória sonora, e atividades de ordenação temporal com música. Respeita ritmo individual de aprendizagem com muita repetição e reforço.',
    materials: [
      'Cartões com símbolos musicais coloridos e grandes',
      'Instrumentos simples (pandeiro, tambor, guizo)',
      'Sequenciador visual',
      'Músicas infantis com estrutura clara',
      'Objetos do cotidiano como recursos sonoros',
      'Aplicativo de sequências musicais adaptadas'
    ],
    estimatedTime: '30-40 minutos',
    evaluationCriteria: [
      'Número de elementos sequenciados corretamente',
      'Necessidade de apoio visual para execução',
      'Tempo necessário para memorizar sequências',
      'Transferência de aprendizagem para novos padrões',
      'Autonomia na execução das tarefas'
    ],
    complexityLevel: 'Leve'
  },

  // DI - Comunicação
  {
    id: 'di-comunicacao-1',
    disorder: 'DI',
    demand: 'Comunicação e Linguagem',
    specialty: 'Musicoterapia',
    generalObjective: 'Ampliar o repertório comunicativo funcional através de canções temáticas e comunicação alternativa musical',
    specificObjective: 'O paciente utilizará pelo menos 10 palavras ou sinais funcionais em contextos musicais para expressar necessidades e preferências em 90% das oportunidades',
    activityDescription: 'Canções Funcionais com CAA: Utilização de canções simples do cotidiano (cumprimentos, pedidos, escolhas) associadas a comunicação alternativa. Cada música trabalha vocabulário funcional específico com gestos, figuras ou aplicativos. Estrutura: 1) Canção de cumprimento (olá, tchau); 2) Canção de escolhas (quero mais, não quero); 3) Canções de necessidades básicas; 4) Canções de emoções. Repetição sistemática com generalização para diferentes contextos. Inclui família no processo para extensão domiciliar.',
    materials: [
      'Pranchas de comunicação alternativa temáticas',
      'Aplicativo de CAA com sons',
      'Violão para acompanhamento',
      'Figuras grandes e coloridas',
      'Objetos reais para contextualização',
      'Manual de canções para família'
    ],
    estimatedTime: '35-45 minutos',
    evaluationCriteria: [
      'Número de palavras/sinais utilizados espontaneamente',
      'Funcionalidade da comunicação (obter o desejado)',
      'Generalização para diferentes contextos',
      'Iniciativa comunicativa sem modelo',
      'Compreensão de vocabulário receptivo'
    ],
    complexityLevel: 'Leve'
  },

  // DI - Autonomia
  {
    id: 'di-autonomia-1',
    disorder: 'DI',
    demand: 'Autonomia',
    specialty: 'Musicoterapia',
    generalObjective: 'Desenvolver habilidades de autonomia e independência nas atividades de vida diária através de rotinas musicais estruturadas',
    specificObjective: 'O paciente executará pelo menos 5 etapas de rotinas de autocuidado de forma independente, utilizando canções como apoio mnemônico, em 4 de 5 tentativas',
    activityDescription: 'Rotinas Musicais de AVDs: Criação de canções personalizadas para rotinas diárias (escovar dentes, vestir-se, organizar materiais). Cada canção descreve passo-a-passo a atividade com melodia simples e repetitiva. Prática das rotinas durante sessão com música ao vivo, depois gravada para uso em casa. Inclui pictogramas sequenciais associados à música. Gradual retirada de apoios conforme aquisição de independência. Trabalho integrado com família e escola.',
    materials: [
      'Materiais reais de AVDs (escova, roupa, materiais escolares)',
      'Gravador para músicas das rotinas',
      'Pictogramas sequenciais plastificados',
      'Relógio visual com música',
      'Checklist visual e musical',
      'Violão ou teclado'
    ],
    estimatedTime: '40-50 minutos',
    evaluationCriteria: [
      'Número de etapas executadas sem apoio',
      'Qualidade da execução de cada etapa',
      'Generalização das rotinas para casa/escola',
      'Redução gradual da necessidade de música',
      'Iniciativa para começar rotinas'
    ],
    complexityLevel: 'Moderado'
  },

  // TEA - Socioemocional
  {
    id: 'tea-socioemocional-1',
    disorder: 'TEA',
    demand: 'Socioemocional',
    specialty: 'Musicoterapia',
    generalObjective: 'Promover habilidades de interação social recíproca e reconhecimento de emoções através de experiências musicais compartilhadas',
    specificObjective: 'O paciente iniciará e manterá interações sociais recíprocas com terapeuta ou par por pelo menos 5 minutos, demonstrando turnos de atenção compartilhada em atividades musicais',
    activityDescription: 'Diálogo Musical Interativo: Atividades de improvisação musical em dupla onde cada participante deve responder musicalmente ao outro. Inicia-se com imitação simples (eu toco, você repete), progride para turnos (eu toco, você responde diferente), e evolui para criação musical conjunta. Inclui jogos de "pergunta e resposta musical", histórias sonoras cooperativas, e reconhecimento de emoções através de expressões musicais. Uso de espelho e vídeo feedback para consciência social.',
    materials: [
      'Par de instrumentos iguais (dois tambores, dois metalofones)',
      'Espelho grande',
      'Cartões de emoções musicais',
      'Gravador para replay',
      'Boneco/fantoche como mediador',
      'Jogos de turnos musicais'
    ],
    estimatedTime: '30-45 minutos',
    evaluationCriteria: [
      'Duração da interação recíproca',
      'Qualidade dos turnos de atenção compartilhada',
      'Iniciativas de interação espontânea',
      'Reconhecimento de emoções expressas musicalmente',
      'Ajuste social às respostas do outro'
    ],
    complexityLevel: 'Severo'
  }
];

export const teaDemandCategories = [
  {
    category: 'Comunicação e Linguagem',
    icon: '💬',
    subDemands: [
      {
        id: 'tea-com-1',
        label: 'Ausência ou atraso na fala',
        associatedConditions: ['Transtorno de linguagem receptivo-expressivo', 'Apraxia de fala infantil']
      },
      {
        id: 'tea-com-2',
        label: 'Dificuldade em manter turnos de conversação',
      },
      {
        id: 'tea-com-3',
        label: 'Ecolalia (repetição de palavras ou frases)',
      },
      {
        id: 'tea-com-4',
        label: 'Uso inadequado da entonação ou do olhar',
      },
      {
        id: 'tea-com-5',
        label: 'Dificuldade em compreender linguagem figurada',
      },
      {
        id: 'tea-com-6',
        label: 'Pouca intenção comunicativa',
        associatedConditions: ['Mutismo seletivo', 'Transtorno fonológico']
      }
    ]
  },
  {
    category: 'Cognição e Aprendizagem',
    icon: '🧠',
    subDemands: [
      {
        id: 'tea-cog-1',
        label: 'Dificuldade em generalizar o aprendizado',
      },
      {
        id: 'tea-cog-2',
        label: 'Pensamento concreto e literal',
      },
      {
        id: 'tea-cog-3',
        label: 'Hiperfoco em temas de interesse restrito',
      },
      {
        id: 'tea-cog-4',
        label: 'Desempenho irregular',
        associatedConditions: ['Dislexia', 'Disortografia', 'Discalculia']
      },
      {
        id: 'tea-cog-5',
        label: 'Lentidão no processamento das informações',
        associatedConditions: ['TDAH associado', 'Transtorno de aprendizagem não verbal']
      }
    ]
  },
  {
    category: 'Socioemocional',
    icon: '💞',
    subDemands: [
      {
        id: 'tea-soc-1',
        label: 'Dificuldade em reconhecer e expressar emoções',
        associatedConditions: ['Transtorno de regulação emocional']
      },
      {
        id: 'tea-soc-2',
        label: 'Pouco interesse em interações sociais',
        associatedConditions: ['Transtorno de ansiedade social']
      },
      {
        id: 'tea-soc-3',
        label: 'Crises de ansiedade frente a mudanças',
        associatedConditions: ['Transtorno obsessivo-compulsivo (TOC)']
      },
      {
        id: 'tea-soc-4',
        label: 'Dificuldade com frustrações ou espera',
      },
      {
        id: 'tea-soc-5',
        label: 'Apegos excessivos a objetos ou rotinas',
        associatedConditions: ['Depressão infantil']
      }
    ]
  },
  {
    category: 'Sensorial e Motor',
    icon: '👂',
    subDemands: [
      {
        id: 'tea-sen-1',
        label: 'Hipersensibilidade sensorial',
        associatedConditions: ['Transtorno do Processamento Sensorial (TPS)']
      },
      {
        id: 'tea-sen-2',
        label: 'Hipossensibilidade (busca de estímulos)',
      },
      {
        id: 'tea-sen-3',
        label: 'Estereotipias motoras',
      },
      {
        id: 'tea-sen-4',
        label: 'Dificuldades em coordenação motora',
        associatedConditions: ['Dispraxia motora']
      },
      {
        id: 'tea-sen-5',
        label: 'Preferência por atividades repetitivas',
        associatedConditions: ['Transtorno do sono associado']
      }
    ]
  }
];

export const disorderOptions = [
  {
    disorder: 'TEA',
    label: 'TEA – Transtorno do Espectro Autista',
    icon: '🧩',
    color: 'from-green-500 to-green-600',
    demands: [
      'Comunicação e Linguagem',
      'Cognição e Aprendizagem',
      'Socioemocional',
      'Sensorial e Motor'
    ]
  },
  {
    disorder: 'TDAH',
    label: 'TDAH – Transtorno de Déficit de Atenção e Hiperatividade',
    icon: '⚡',
    color: 'from-yellow-500 to-yellow-600',
    demands: [
      'Atenção e Funções Executivas',
      'Comportamento',
      'Socioemocional'
    ]
  },
  {
    disorder: 'TOD',
    label: 'TOD – Transtorno Opositivo-Desafiador',
    icon: '😤',
    color: 'from-red-500 to-red-600',
    demands: [
      'Comportamento',
      'Socioemocional'
    ]
  },
  {
    disorder: 'DI',
    label: 'DI – Deficiência Intelectual',
    icon: '🌱',
    color: 'from-blue-500 to-blue-600',
    demands: [
      'Cognição e Aprendizagem',
      'Comunicação e Linguagem',
      'Autonomia'
    ]
  }
] as const;
