import { ProfessionalActivity } from './types';

export const todActivities: ProfessionalActivity[] = [
  // ==================== REGULAÇÃO EMOCIONAL (3001-3020) ====================
  {
    id: 3001,
    title: 'Vulcão Musical da Raiva',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver consciência sobre os níveis de intensidade da raiva e estratégias de modulação através da representação musical.',
    specificObjectives: [
      'Identificar diferentes níveis de intensidade da raiva (leve, moderada, intensa)',
      'Representar cada nível através de variações de volume e intensidade musical',
      'Reconhecer sinais corporais associados a cada nível de raiva',
      'Praticar a redução gradual da intensidade emocional através da música'
    ],
    description: 'A atividade utiliza a metáfora do vulcão para representar os níveis de raiva. O paciente explora instrumentos de percussão, começando com toques suaves (raiva leve - base do vulcão), aumentando gradualmente a intensidade (raiva moderada - meio) até toques fortes (raiva intensa - erupção). O terapeuta guia a descida gradual, ensinando que assim como o vulcão pode esfriar, a raiva também pode diminuir. Cartões visuais com cores (verde, amarelo, vermelho) apoiam a identificação dos níveis.',
    materials: ['Tambor ou bateria', 'Cartões coloridos (verde, amarelo, vermelho)', 'Imagem de vulcão', 'Baquetas de diferentes tamanhos'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica corretamente os três níveis de intensidade da raiva',
      'Consegue variar a intensidade musical de acordo com o nível',
      'Demonstra capacidade de reduzir a intensidade gradualmente',
      'Relaciona sinais corporais aos níveis de raiva',
      'Aplica a estratégia em situações simuladas'
    ],
    adaptations: {
      level1: 'Usar apenas dois níveis (calmo/bravo) com apoio visual constante e instrumentos de fácil manuseio como chocalhos.',
      level2: 'Trabalhar os três níveis com apoio visual parcial, introduzindo instrumentos variados e narrativas simples.',
      level3: 'Expandir para cinco níveis de intensidade, criar composições próprias representando a escalada e descida da raiva.'
    },
    theoreticalBasis: 'Baseada no Modelo de Regulação Emocional de Gross, a atividade trabalha a conscientização emocional (identificação) e modulação da resposta (modificação). A metáfora do vulcão facilita a compreensão concreta de estados emocionais abstratos.',
    practicalTips: [
      'Validar a raiva como emoção legítima antes de trabalhar sua regulação',
      'Evitar julgamentos sobre a intensidade expressada',
      'Usar a própria energia do paciente como ponto de partida',
      'Celebrar pequenas reduções de intensidade'
    ]
  },
  {
    id: 3002,
    title: 'Termômetro da Raiva Musical',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver a capacidade de graduar e monitorar a intensidade da raiva usando escalas musicais como referência.',
    specificObjectives: [
      'Associar níveis numéricos (0-10) a intensidades emocionais',
      'Reproduzir cada nível através de características musicais específicas',
      'Identificar em que nível se encontra em diferentes momentos',
      'Praticar estratégias para descer níveis no termômetro'
    ],
    description: 'Um termômetro visual grande (0-10) é apresentado ao paciente, com cada nível associado a uma característica musical: 0 (silêncio), 1-3 (sons suaves, lentos), 4-6 (sons moderados, ritmo médio), 7-9 (sons fortes, ritmo acelerado), 10 (máxima intensidade). O paciente aprende a identificar seu nível atual e pratica subir e descer no termômetro através da música, desenvolvendo controle sobre sua regulação emocional.',
    materials: ['Termômetro visual grande (cartolina)', 'Teclado ou xilofone', 'Marcadores coloridos', 'Fichas numéricas'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Utiliza corretamente a escala 0-10 para graduar intensidade',
      'Reproduz características musicais correspondentes a cada faixa',
      'Consegue identificar seu nível atual com precisão',
      'Demonstra estratégias para reduzir níveis',
      'Generaliza o uso do termômetro para situações do cotidiano'
    ],
    adaptations: {
      level1: 'Reduzir para escala 0-5 com cores e emojis, usar apenas percussão corporal.',
      level2: 'Usar escala 0-10 com apoio visual, introduzir instrumentos melódicos simples.',
      level3: 'Trabalhar com escalas personalizadas, criar composições para cada nível, usar em tempo real durante discussões.'
    },
    theoreticalBasis: 'Fundamentada na Terapia Cognitivo-Comportamental, a graduação numérica da emoção facilita a metacognição e o automonitoramento. A associação com elementos musicais concretos torna o processo mais acessível.',
    practicalTips: [
      'Personalizar o termômetro com situações relevantes para o paciente',
      'Praticar a identificação em momentos calmos antes de usar em crises',
      'Envolver a família para uso consistente em casa'
    ]
  },
  {
    id: 3003,
    title: 'Transformando a Raiva em Música',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Canalizar a energia da raiva para expressão musical construtiva, transformando emoção destrutiva em criação artística.',
    specificObjectives: [
      'Expressar a raiva de forma segura através de instrumentos',
      'Transformar gradualmente a expressão intensa em melodias mais calmas',
      'Desenvolver repertório de canalizações saudáveis da raiva',
      'Reconhecer a raiva como energia que pode ser redirecionada'
    ],
    description: 'O paciente é convidado a expressar sua raiva livremente através de instrumentos de percussão (fase de descarga). Gradualmente, o terapeuta introduz estrutura rítmica, melodia e harmonia, transformando o caos inicial em música organizada. O processo demonstra concretamente que a raiva não precisa ser suprimida, mas pode ser transformada em algo construtivo e até belo.',
    materials: ['Kit de percussão variado', 'Instrumentos melódicos', 'Gravador', 'Papel para registro'],
    estimatedTime: '40-50 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Consegue expressar raiva através dos instrumentos sem agressividade',
      'Aceita a introdução gradual de estrutura',
      'Participa da transformação da expressão inicial',
      'Reconhece o produto final como resultado positivo',
      'Aplica o conceito de transformação em outras situações'
    ],
    adaptations: {
      level1: 'Focar apenas na descarga segura com instrumentos resistentes, sem exigência de transformação.',
      level2: 'Trabalhar a transformação com apoio do terapeuta, usando estruturas simples e previsíveis.',
      level3: 'Paciente lidera a transformação, cria composições completas a partir da raiva inicial.'
    },
    theoreticalBasis: 'Baseada nos princípios de sublimação da psicanálise e no conceito de canalização da Musicoterapia, a atividade permite expressão catártica seguida de reorganização construtiva.',
    practicalTips: [
      'Garantir ambiente seguro para expressão intensa',
      'Não interromper a fase de descarga prematuramente',
      'Gravar e comparar o antes e depois como evidência da transformação'
    ]
  },
  {
    id: 3004,
    title: 'Sopro Musical da Calma',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Utilizar instrumentos de sopro para desenvolver técnicas de respiração que promovam regulação emocional e redução da raiva.',
    specificObjectives: [
      'Aprender técnicas de respiração diafragmática através do sopro',
      'Associar a expiração prolongada com redução da ativação fisiológica',
      'Desenvolver controle respiratório em momentos de raiva',
      'Criar uma âncora sensorial de calma através do som produzido'
    ],
    description: 'A atividade utiliza instrumentos de sopro simples (flauta doce, gaita, apitos) para ensinar respiração reguladora. O paciente aprende que para produzir sons longos e bonitos precisa de respirações profundas e expirações controladas - exatamente as técnicas que reduzem a ativação do sistema nervoso simpático. Cada sessão aumenta a duração das notas e a complexidade das melodias, fortalecendo o controle respiratório.',
    materials: ['Flauta doce', 'Gaita de boca', 'Apitos musicais', 'Bolhas de sabão (para prática)', 'Metrônomo'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Demonstra respiração diafragmática correta',
      'Mantém notas longas por tempo crescente',
      'Utiliza a respiração quando identifica sinais de raiva',
      'Relata redução da intensidade emocional após o sopro',
      'Pratica autonomamente em casa'
    ],
    adaptations: {
      level1: 'Usar bolhas de sabão e apitos simples, focar apenas na expiração prolongada.',
      level2: 'Introduzir flauta doce com melodias simples, trabalhar ritmo respiratório.',
      level3: 'Tocar músicas completas, criar composições próprias, usar em situações de estresse real.'
    },
    theoreticalBasis: 'Fundamentada na fisiologia do sistema nervoso autônomo, a expiração prolongada ativa o sistema parassimpático, reduzindo cortisol e promovendo calma. A música torna o treino respiratório mais engajador.',
    practicalTips: [
      'Higienizar instrumentos adequadamente',
      'Começar com instrumentos que exigem pouco sopro',
      'Criar "música de emergência" para momentos de crise'
    ]
  },
  {
    id: 3005,
    title: 'Bateria da Frustração Controlada',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Proporcionar descarga física segura da frustração através da bateria enquanto desenvolve controle sobre a intensidade da expressão.',
    specificObjectives: [
      'Expressar frustração de forma física segura',
      'Desenvolver controle sobre a força e velocidade dos movimentos',
      'Aprender a parar quando solicitado mesmo em alta intensidade',
      'Transformar descarga caótica em padrões rítmicos estruturados'
    ],
    description: 'O paciente utiliza bateria ou kit de percussão para descarga física da frustração. Inicialmente, é permitida expressão livre e intensa. Gradualmente, o terapeuta introduz comandos de parada (freeze), variações de intensidade e padrões rítmicos. O paciente aprende que pode expressar emoções intensas mantendo controle, respondendo a limites e estruturando sua expressão.',
    materials: ['Bateria ou kit de percussão', 'Baquetas', 'Protetor auricular', 'Sinalizadores visuais de comando'],
    estimatedTime: '30-40 minutos',
    ageRange: '7-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Expressa frustração sem comportamentos destrutivos',
      'Responde aos comandos de parada em até 3 segundos',
      'Varia intensidade conforme solicitado',
      'Mantém padrões rítmicos por tempo crescente',
      'Reporta alívio após a atividade'
    ],
    adaptations: {
      level1: 'Usar almofadas ou caixas como percussão improvisada, comandos simples apenas de começar/parar.',
      level2: 'Bateria real com comandos de intensidade, introdução de padrões simples.',
      level3: 'Padrões complexos, improvisação estruturada, tocar junto com músicas.'
    },
    theoreticalBasis: 'Combina princípios de descarga catártica com treinamento de controle inibitório. A estrutura rítmica exige atenção e controle executivo, desenvolvendo habilidades deficitárias no TOD.',
    practicalTips: [
      'Estabelecer regras claras antes de começar',
      'Usar protetores auriculares para ambos',
      'Elogiar especificamente os momentos de controle'
    ]
  },
  {
    id: 3006,
    title: 'Playlist da Autorregulação',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Criar repertório musical personalizado para diferentes estados emocionais, desenvolvendo estratégias autônomas de regulação.',
    specificObjectives: [
      'Identificar músicas que provocam diferentes estados emocionais',
      'Criar playlists para calma, energia positiva e foco',
      'Aprender a usar música proativamente para regulação',
      'Desenvolver consciência do impacto da música no humor'
    ],
    description: 'O paciente explora diferentes gêneros e músicas, identificando como cada uma afeta seu estado emocional. Juntos, terapeuta e paciente criam playlists categorizadas: "Para me acalmar", "Para descarregar", "Para focar", "Para animar". O paciente aprende a escolher músicas estrategicamente antes ou durante momentos difíceis, desenvolvendo autonomia na autorregulação.',
    materials: ['Dispositivo de música', 'Plataforma de streaming', 'Fichas de categorização', 'Diário musical'],
    estimatedTime: '40-50 minutos',
    ageRange: '10-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica corretamente o efeito de diferentes músicas',
      'Cria playlists funcionais para diferentes estados',
      'Usa as playlists autonomamente em casa',
      'Reporta eficácia da estratégia em situações reais',
      'Atualiza e refina suas seleções ao longo do tempo'
    ],
    adaptations: {
      level1: 'Terapeuta pré-seleciona músicas, paciente escolhe entre opções limitadas.',
      level2: 'Paciente sugere músicas com orientação do terapeuta, cria playlists colaborativamente.',
      level3: 'Paciente assume total autonomia, analisa criticamente suas escolhas, expande para podcasts e sons ambientes.'
    },
    theoreticalBasis: 'Fundamentada na Musicoterapia Receptiva e no princípio ISO (usar música que combine com o estado atual e gradualmente modificar), a atividade desenvolve metacognição emocional e estratégias ativas de coping.',
    practicalTips: [
      'Respeitar preferências musicais do paciente',
      'Incluir a família na criação das playlists',
      'Atualizar regularmente conforme mudanças de gosto'
    ]
  },
  {
    id: 3007,
    title: 'Ponte Musical de Transição Emocional',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver habilidade de transitar entre estados emocionais intensos e estados de calma através de sequências musicais graduais.',
    specificObjectives: [
      'Reconhecer que transições emocionais são possíveis e graduais',
      'Experimentar a transição de forma concreta através da música',
      'Desenvolver paciência com o processo de regulação',
      'Criar pontes musicais personalizadas para diferentes emoções'
    ],
    description: 'A metáfora da ponte é usada para ensinar que podemos ir de um estado emocional a outro, mas precisamos atravessar uma ponte - não é instantâneo. Musicalmente, o terapeuta cria sequências que começam com música intensa e gradualmente transitam para música calma. O paciente aprende a acompanhar e eventualmente conduzir essas transições.',
    materials: ['Instrumentos variados', 'Imagens de pontes', 'Sequências musicais pré-gravadas', 'Timer visual'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Compreende a metáfora da ponte/transição',
      'Acompanha transições musicais de 5+ minutos',
      'Tolera o tempo necessário para a transição',
      'Cria suas próprias pontes musicais',
      'Aplica o conceito em situações cotidianas'
    ],
    adaptations: {
      level1: 'Transições curtas (2 min) com apoio visual constante e música pré-gravada.',
      level2: 'Transições médias (5 min) com participação ativa do paciente.',
      level3: 'Transições longas e complexas, paciente conduz o processo, múltiplas emoções.'
    },
    theoreticalBasis: 'Baseada no conceito de que a regulação emocional é um processo e não um evento, a atividade desenvolve tolerância ao tempo necessário para a mudança de estado, combatendo a impulsividade característica do TOD.',
    practicalTips: [
      'Usar timer visual para mostrar progresso',
      'Celebrar cada etapa da ponte atravessada',
      'Praticar em momentos calmos antes de usar em crises'
    ]
  },
  {
    id: 3008,
    title: 'Espelho Sonoro das Emoções',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver consciência emocional através do espelhamento musical, onde o terapeuta reflete sonoramente o estado do paciente.',
    specificObjectives: [
      'Reconhecer como suas emoções soam quando refletidas',
      'Desenvolver consciência do próprio estado emocional',
      'Aceitar feedback não-verbal sobre intensidade emocional',
      'Modular expressão a partir do espelhamento recebido'
    ],
    description: 'O terapeuta atua como espelho sonoro, reproduzindo musicalmente a energia, intensidade e qualidade emocional que percebe no paciente. Esta técnica de espelhamento permite que o paciente ouça de fora como está se sentindo, desenvolvendo consciência e frequentemente motivando modulação espontânea da intensidade.',
    materials: ['Instrumentos de fácil resposta', 'Espelho real (opcional)', 'Gravador para playback'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Reconhece quando o espelhamento reflete seu estado',
      'Aceita o feedback sem reatividade',
      'Demonstra mudança espontânea após espelhamento intenso',
      'Consegue espelhar o terapeuta em retorno',
      'Verbaliza insights sobre seu estado emocional'
    ],
    adaptations: {
      level1: 'Espelhamento simples focado em intensidade (forte/fraco) apenas.',
      level2: 'Espelhamento de qualidade emocional, introdução de diálogo musical.',
      level3: 'Espelhamento recíproco, análise conjunta das expressões, gravação e discussão.'
    },
    theoreticalBasis: 'Técnica central da Musicoterapia Improvisacional (Bruscia), o espelhamento promove sintonização afetiva e desenvolvimento da consciência emocional sem necessidade de verbalização.',
    practicalTips: [
      'Manter espelhamento genuíno, não exagerado',
      'Estar atento a reações negativas ao feedback',
      'Usar gravação para revisão conjunta'
    ]
  },
  {
    id: 3009,
    title: 'História Musical da Irritação',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Narrar musicalmente situações que provocam irritação, desenvolvendo consciência sobre gatilhos e padrões de resposta.',
    specificObjectives: [
      'Identificar situações específicas que provocam irritação',
      'Representar a sequência de eventos sonoramente',
      'Reconhecer padrões pessoais de escalada',
      'Explorar finais alternativos para as histórias de irritação'
    ],
    description: 'O paciente escolhe uma situação recente que provocou irritação e, junto com o terapeuta, cria uma narrativa sonora: o que aconteceu (introdução), como se sentiu (desenvolvimento), como reagiu (clímax) e o que aconteceu depois (conclusão). Depois, exploram finais alternativos - como a história poderia ter sido diferente musicalmente.',
    materials: ['Instrumentos variados', 'Cartões de sequência', 'Gravador', 'Papel para roteiro'],
    estimatedTime: '40-50 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Narra situação com início, meio e fim',
      'Escolhe sons apropriados para cada parte',
      'Identifica o momento de escalada na história',
      'Cria pelo menos um final alternativo',
      'Relaciona a atividade com situações futuras'
    ],
    adaptations: {
      level1: 'Histórias simples com três partes, terapeuta ajuda com sons.',
      level2: 'Histórias completas, paciente escolhe sons, um final alternativo.',
      level3: 'Múltiplas histórias, análise de padrões, vários finais alternativos, role-play musical.'
    },
    theoreticalBasis: 'Combina narrativa terapêutica com externalização do problema, permitindo distanciamento e análise. A criação de finais alternativos trabalha flexibilidade cognitiva e planejamento de resposta.',
    practicalTips: [
      'Começar com situações menos intensas',
      'Manter tom exploratório, não punitivo',
      'Gravar para revisão posterior'
    ]
  },
  {
    id: 3010,
    title: 'Caixa de Ferramentas Musical',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Construir repertório diversificado de estratégias musicais de regulação emocional, organizadas em uma caixa de ferramentas pessoal.',
    specificObjectives: [
      'Aprender múltiplas estratégias musicais de regulação',
      'Identificar qual ferramenta usar em cada situação',
      'Organizar as estratégias em formato acessível',
      'Praticar o uso das ferramentas em simulações'
    ],
    description: 'O paciente constrói uma caixa de ferramentas (física ou digital) contendo diferentes estratégias musicais de regulação: respiração com sopro, descarga na bateria, playlist de calma, cantarolar uma melodia âncora, etc. Cada ferramenta é praticada e associada a situações específicas. A caixa serve como recurso tangível para momentos de crise.',
    materials: ['Caixa decorável', 'Cartões de estratégias', 'Objetos simbólicos', 'Miniaturas de instrumentos'],
    estimatedTime: '45-60 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Conhece pelo menos 5 ferramentas diferentes',
      'Identifica quando usar cada ferramenta',
      'Usa a caixa espontaneamente em sessão',
      'Reporta uso em casa',
      'Adiciona novas ferramentas ao longo do tempo'
    ],
    adaptations: {
      level1: 'Caixa com 3 ferramentas simples, apoio visual constante.',
      level2: 'Caixa com 5-7 ferramentas, cartões de situação-ferramenta.',
      level3: 'Caixa expandida, ferramentas complexas, paciente treina outros a usar.'
    },
    theoreticalBasis: 'Baseada no conceito de coping ativo e autorregulação, a materialização das estratégias em objetos concretos facilita o acesso e uso em momentos de alta ativação emocional.',
    practicalTips: [
      'Incluir a família na construção e uso',
      'Manter a caixa em local acessível',
      'Revisar e atualizar regularmente'
    ]
  },
  {
    id: 3011,
    title: 'Alarme Musical de Alerta',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver sistema de alerta precoce para identificar sinais iniciais de raiva antes da escalada completa.',
    specificObjectives: [
      'Identificar sinais corporais e emocionais iniciais de raiva',
      'Associar cada sinal a um som específico',
      'Reconhecer os sinais em tempo real',
      'Ativar estratégias de regulação precocemente'
    ],
    description: 'Paciente e terapeuta mapeiam os sinais precoces de raiva (tensão muscular, respiração alterada, pensamentos negativos) e criam sons de alerta para cada um. Quando o paciente identifica um sinal, toca o som correspondente, sinalizando necessidade de intervenção. O sistema de alarme musical torna concreto o automonitoramento.',
    materials: ['Instrumentos pequenos variados', 'Cartões de sinais corporais', 'Diagrama do corpo', 'Aplicativo de sons'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica pelo menos 3 sinais precoces pessoais',
      'Associa sons específicos a cada sinal',
      'Usa o sistema durante as sessões',
      'Reporta identificação de sinais no cotidiano',
      'Ativa estratégias antes da escalada completa'
    ],
    adaptations: {
      level1: 'Focar em 1-2 sinais óbvios, sons simples, alta frequência de lembretes.',
      level2: 'Sistema com 3-4 sinais, sons diferenciados, prática em simulações.',
      level3: 'Sistema completo personalizado, uso autônomo, refinamento contínuo.'
    },
    theoreticalBasis: 'Baseado em modelos de prevenção de recaída e intervenção precoce, o reconhecimento de sinais prodrômicos permite intervenção antes do ponto de não-retorno.',
    practicalTips: [
      'Envolver a família como apoio no reconhecimento',
      'Usar o alarme sem julgamento',
      'Celebrar cada identificação precoce'
    ]
  },
  {
    id: 3012,
    title: 'Respiração Rítmica para Calma',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver técnica de respiração guiada por padrões rítmicos para redução rápida da ativação fisiológica.',
    specificObjectives: [
      'Aprender padrão respiratório 4-7-8 com suporte rítmico',
      'Associar ritmos específicos a estados de calma',
      'Usar a técnica autonomamente em momentos de estresse',
      'Desenvolver memória muscular do padrão respiratório'
    ],
    description: 'Usando metrônomo ou batidas constantes, o paciente aprende padrões respiratórios reguladores: inspirar em 4 tempos, segurar em 7, expirar em 8. O suporte rítmico da música facilita a manutenção do padrão e torna a prática mais engajadora. Gradualmente, o paciente internaliza o ritmo.',
    materials: ['Metrônomo ou aplicativo', 'Instrumentos de percussão suave', 'Cartão com padrão visual', 'Timer'],
    estimatedTime: '20-30 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Executa o padrão 4-7-8 corretamente',
      'Mantém o ritmo por pelo menos 5 ciclos',
      'Relata redução da tensão após prática',
      'Usa a técnica fora das sessões',
      'Adapta para diferentes situações'
    ],
    adaptations: {
      level1: 'Padrão simplificado 2-2-4 com batidas fortes e constantes.',
      level2: 'Padrão 4-4-6 com metrônomo, prática regular.',
      level3: 'Padrão completo 4-7-8, variações de ritmo, uso em situações de alto estresse.'
    },
    theoreticalBasis: 'Técnica baseada em pranayama adaptada pela ciência ocidental, a expiração prolongada ativa o nervo vago e o sistema parassimpático, promovendo relaxamento fisiológico mensurável.',
    practicalTips: [
      'Praticar diariamente em momentos calmos',
      'Usar como rotina antes de dormir',
      'Criar versão portátil para uso discreto'
    ]
  },
  {
    id: 3013,
    title: 'Melodia da Raiva Transformada',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Compor melodias que representem a transformação da raiva em emoções mais manejáveis.',
    specificObjectives: [
      'Criar melodia inicial representando raiva',
      'Desenvolver variações progressivamente mais calmas',
      'Tocar a sequência completa de transformação',
      'Usar a melodia como recurso de autorregulação'
    ],
    description: 'O paciente compõe uma pequena melodia que representa como sua raiva soa. Então, com ajuda do terapeuta, cria variações dessa melodia que vão progressivamente suavizando - mudando de modo menor para maior, de tempo rápido para lento, de dinâmica forte para suave. A melodia final representa calma. Tocar a sequência completa simboliza e facilita a transformação emocional.',
    materials: ['Teclado ou xilofone', 'Papel de partitura simples', 'Gravador', 'Lápis de cores'],
    estimatedTime: '45-60 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Cria melodia inicial expressiva',
      'Desenvolve pelo menos 3 variações progressivas',
      'Toca a sequência completa',
      'Memoriza sua melodia',
      'Usa em situações de regulação'
    ],
    adaptations: {
      level1: 'Terapeuta cria melodia, paciente escolhe modificações simples.',
      level2: 'Paciente cria melodia com ajuda, desenvolve 2 variações.',
      level3: 'Composição autônoma, múltiplas variações, harmonização complexa.'
    },
    theoreticalBasis: 'Combina técnicas de composição terapêutica com o conceito de modulação emocional gradual, criando recurso personalizado e significativo para o paciente.',
    practicalTips: [
      'Gravar e disponibilizar para uso em casa',
      'Respeitar o estilo musical do paciente',
      'Pode ser expandida ao longo do tratamento'
    ]
  },
  {
    id: 3014,
    title: 'Diálogo Musical com a Raiva',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Estabelecer diálogo musical com a raiva personificada, desenvolvendo relação mais saudável com essa emoção.',
    specificObjectives: [
      'Personificar a raiva como entidade separada',
      'Comunicar-se musicalmente com essa parte',
      'Negociar limites e expressões adequadas',
      'Integrar a raiva como parte legítima da experiência'
    ],
    description: 'A raiva é externalizada e personificada - pode ganhar nome, características. Paciente e terapeuta representam musicalmente um diálogo: o paciente toca como si mesmo, o terapeuta (ou segundo instrumento) representa a raiva respondendo. O diálogo evolui de confronto para negociação e eventual integração.',
    materials: ['Dois conjuntos de instrumentos', 'Fantoche ou objeto representando raiva', 'Gravador'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-14 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Consegue personificar a raiva',
      'Mantém diálogo musical por tempo adequado',
      'Demonstra mudança no relacionamento com a raiva',
      'Verbaliza insights sobre a função da raiva',
      'Aplica perspectiva em situações reais'
    ],
    adaptations: {
      level1: 'Personificação simples, diálogo breve, terapeuta guia maior parte.',
      level2: 'Diálogo desenvolvido, paciente mais autônomo, reflexão guiada.',
      level3: 'Diálogos complexos, múltiplas perspectivas, integração simbólica.'
    },
    theoreticalBasis: 'Baseada em técnicas de externalização da Terapia Narrativa e Parts Work, permite distanciamento da emoção enquanto mantém conexão e trabalha integração.',
    practicalTips: [
      'Manter tom respeitoso com a raiva',
      'Evitar demonização da emoção',
      'Buscar função adaptativa da raiva'
    ]
  },
  {
    id: 3015,
    title: 'Escudo Sonoro de Proteção',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Criar recurso musical de proteção para momentos em que estímulos externos ameaçam provocar raiva.',
    specificObjectives: [
      'Identificar situações que tipicamente provocam raiva',
      'Criar sequência musical que funcione como escudo mental',
      'Praticar ativação do escudo antes de situações desafiadoras',
      'Usar o escudo em tempo real em momentos difíceis'
    ],
    description: 'O paciente cria uma música, melodia ou sequência sonora que representa proteção e força interior. Este escudo sonoro pode ser tocado, cantarolado mentalmente ou ouvido antes de situações que tipicamente provocam raiva. Funciona como preparação psicológica e âncora de estado regulado.',
    materials: ['Instrumentos preferidos do paciente', 'Gravador', 'Fones de ouvido', 'Objeto símbolo do escudo'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Cria seu escudo sonoro personalizado',
      'Memoriza ou tem acesso ao escudo',
      'Usa proativamente antes de situações',
      'Reporta eficácia em situações reais',
      'Refina o escudo conforme necessário'
    ],
    adaptations: {
      level1: 'Escudo simples (uma nota ou batida), uso com ajuda do adulto.',
      level2: 'Escudo melódico, prática de ativação, uso semi-autônomo.',
      level3: 'Escudo complexo, múltiplos contextos, uso totalmente autônomo.'
    },
    theoreticalBasis: 'Combina princípios de âncoras da PNL com preparação cognitiva, criando recurso de coping antecipado que fortalece a sensação de controle.',
    practicalTips: [
      'Testar em situações de baixo risco primeiro',
      'Criar versão silenciosa para uso discreto',
      'Envolver família para lembretes de uso'
    ]
  },
  {
    id: 3016,
    title: 'Música do Perdão',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Trabalhar liberação de ressentimentos através da criação musical que simbolize o processo de perdão.',
    specificObjectives: [
      'Identificar ressentimentos que alimentam raiva crônica',
      'Expressar musicalmente a mágoa guardada',
      'Criar música que simbolize libertação',
      'Desenvolver perspectiva mais flexível sobre ofensas'
    ],
    description: 'O paciente explora musicalmente mágoas e ressentimentos que mantém - muitas vezes combustível para raiva recorrente. A atividade progride de expressão da dor, para reconhecimento do peso de carregar ressentimento, até criação de música que simbolize soltar, liberar, seguir em frente. Não significa aprovar o que aconteceu, mas liberar-se do peso.',
    materials: ['Instrumentos variados', 'Papel para escrever', 'Objetos simbólicos para ritual de liberação'],
    estimatedTime: '45-60 minutos',
    ageRange: '11-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Identifica ressentimentos significativos',
      'Expressa mágoa de forma segura',
      'Cria música de liberação',
      'Verbaliza mudança de perspectiva',
      'Reporta redução de pensamentos ruminativos'
    ],
    adaptations: {
      level1: 'Focar em mágoas pequenas e recentes, processo guiado.',
      level2: 'Trabalhar ressentimentos moderados, processo colaborativo.',
      level3: 'Abordar mágoas profundas, processo com maior autonomia, rituais elaborados.'
    },
    theoreticalBasis: 'Baseada em estudos sobre perdão e saúde mental, que mostram que liberar ressentimentos reduz estresse crônico e reatividade emocional.',
    practicalTips: [
      'Não forçar perdão prematuro',
      'Validar a dor antes de trabalhar liberação',
      'Respeitar tempo do processo'
    ]
  },
  {
    id: 3017,
    title: 'Contagem Musical Regressiva',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Desenvolver técnica de contagem regressiva musical para criar pausa entre gatilho e resposta.',
    specificObjectives: [
      'Aprender a pausar antes de reagir',
      'Usar contagem regressiva musical em momentos de raiva',
      'Desenvolver hábito de pausa automática',
      'Expandir tempo de pausa gradualmente'
    ],
    description: 'O paciente aprende uma contagem regressiva musical (10-1 ou 5-1) com melodia específica. Quando sentir raiva crescendo, deve cantarolar ou tocar mentalmente a contagem antes de reagir. A estrutura musical torna a contagem mais memorável e a melodia ajuda na regulação. Pratica-se em simulações até automatização.',
    materials: ['Teclado ou xilofone', 'Cartão visual da contagem', 'Timer', 'Gravação da melodia'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Memoriza a melodia de contagem',
      'Usa em simulações consistentemente',
      'Reporta uso em situações reais',
      'Demonstra aumento do tempo de pausa',
      'Verbaliza benefícios da estratégia'
    ],
    adaptations: {
      level1: 'Contagem 5-1 com melodia simples e muito repetitiva.',
      level2: 'Contagem 10-1 com melodia mais elaborada.',
      level3: 'Contagem personalizada, múltiplas versões para diferentes situações.'
    },
    theoreticalBasis: 'A pausa antes da reação permite que o córtex pré-frontal se engaje, reduzindo respostas impulsivas mediadas pela amígdala. A música facilita a memorização e execução da estratégia.',
    practicalTips: [
      'Praticar centenas de vezes em situações calmas',
      'Usar versão mental para situações públicas',
      'Celebrar cada uso, independente do resultado'
    ]
  },
  {
    id: 3018,
    title: 'Jardim Musical das Emoções',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Criar representação musical de jardim interno onde diferentes emoções têm seu lugar e são cultivadas adequadamente.',
    specificObjectives: [
      'Reconhecer variedade de emoções além da raiva',
      'Criar sons representando diferentes emoções',
      'Desenvolver metáfora de cultivo emocional',
      'Escolher quais emoções cultivar e quais podar'
    ],
    description: 'O paciente cria um jardim musical imaginário onde cada emoção é representada por um som, instrumento ou melodia. A raiva pode ser erva daninha que precisa ser controlada, ou pode ter seu canteiro próprio mas limitado. Emoções positivas são flores a cultivar. A metáfora do jardim ensina que temos escolha sobre o que cresce em nós.',
    materials: ['Instrumentos variados', 'Imagens de jardins', 'Materiais para desenhar jardim', 'Vasos pequenos simbólicos'],
    estimatedTime: '40-50 minutos',
    ageRange: '7-13 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Cria sons para pelo menos 5 emoções',
      'Desenvolve metáfora pessoal do jardim',
      'Identifica o que quer cultivar e controlar',
      'Usa a metáfora em discussões sobre emoções',
      'Demonstra consciência de escolha emocional'
    ],
    adaptations: {
      level1: 'Jardim simples com 3 emoções, metáfora concreta com materiais físicos.',
      level2: 'Jardim com 5-6 emoções, sons mais elaborados, reflexão guiada.',
      level3: 'Jardim complexo, composição do jardim, aplicação a situações de vida.'
    },
    theoreticalBasis: 'Combina terapia metafórica com psicoeducação emocional e conceito de agência sobre estados internos. A metáfora do cultivo enfatiza processo e cuidado contínuo.',
    practicalTips: [
      'Respeitar a representação que o paciente faz da raiva',
      'Evitar eliminar a raiva, apenas dar lugar adequado',
      'Revisitar o jardim ao longo do tratamento'
    ]
  },
  {
    id: 3019,
    title: 'Canção de Ninar para a Raiva',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Criar canção de ninar personalizada que acalme a raiva como se fosse uma criança agitada.',
    specificObjectives: [
      'Desenvolver atitude compassiva em relação à própria raiva',
      'Criar melodia suave e calmante',
      'Usar a canção como ferramenta de autorregulação',
      'Transformar relação com a raiva de luta para cuidado'
    ],
    description: 'A raiva é personificada como uma parte interior que está agitada e precisa de cuidado, não de combate. O paciente cria uma canção de ninar suave para acalmar essa parte, desenvolvendo autocompaixão e uma abordagem gentil de autorregulação. Cantarolar a canção em momentos de raiva pode ativar estados de calma.',
    materials: ['Instrumentos suaves (kalimba, violão, teclado)', 'Gravador', 'Papel para letra'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita a personificação da raiva como parte a cuidar',
      'Cria melodia genuinamente suave',
      'Memoriza sua canção',
      'Usa em momentos de agitação',
      'Demonstra mudança de atitude com a raiva'
    ],
    adaptations: {
      level1: 'Adaptar canção de ninar conhecida, processo altamente guiado.',
      level2: 'Criar melodia original simples com ajuda, letra colaborativa.',
      level3: 'Composição autônoma, múltiplas versões, uso consistente.'
    },
    theoreticalBasis: 'Baseada em Terapia Focada na Compaixão e conceito de reparenting, oferece alternativa à luta contra emoções, promovendo aceitação e cuidado.',
    practicalTips: [
      'Verificar receptividade à metáfora',
      'Pode não funcionar para todos os pacientes',
      'Alternativa para quem resiste a abordagens confrontativas'
    ]
  },
  {
    id: 3020,
    title: 'Orquestra da Regulação Emocional',
    disorder: 'TOD',
    demandCategory: 'emotional_control',
    generalObjective: 'Integrar múltiplas estratégias de regulação emocional em uma performance orquestrada que demonstra maestria sobre as emoções.',
    specificObjectives: [
      'Revisar e integrar todas as estratégias aprendidas',
      'Demonstrar flexibilidade no uso de diferentes ferramentas',
      'Desenvolver senso de competência e controle',
      'Criar performance que celebre o progresso'
    ],
    description: 'Atividade de culminância onde o paciente demonstra domínio sobre diferentes estratégias de regulação, como um maestro conduzindo sua orquestra interior. Cada instrumento representa uma ferramenta: tambor para descarga, flauta para respiração, teclado para transformação. O paciente conduz uma apresentação que conta sua jornada de aprender a regular emoções.',
    materials: ['Múltiplos instrumentos', 'Batuta de maestro', 'Espaço amplo', 'Plateia (família, se possível)'],
    estimatedTime: '50-60 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Demonstra conhecimento de múltiplas estratégias',
      'Transita entre ferramentas fluidamente',
      'Expressa narrativa de progresso',
      'Demonstra confiança e competência',
      'Família reconhece mudanças positivas'
    ],
    adaptations: {
      level1: 'Performance simples com 3 estratégias, alta estrutura e apoio.',
      level2: 'Performance com 5 estratégias, narrativa guiada, alguma improvisação.',
      level3: 'Performance elaborada totalmente conduzida pelo paciente, múltiplas estratégias, narrativa própria.'
    },
    theoreticalBasis: 'Atividade de consolidação baseada em princípios de autoeficácia de Bandura, permitindo experiência de maestria que fortalece a crença na própria capacidade de regulação.',
    practicalTips: [
      'Usar como marco de progresso no tratamento',
      'Envolver família como plateia',
      'Gravar como recordação e recurso futuro'
    ]
  },

  // ==================== COMPORTAMENTO (3021-3038) ====================
  {
    id: 3021,
    title: 'Contrato Musical de Regras',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Negociar e estabelecer regras de convivência através da criação musical colaborativa, desenvolvendo respeito a acordos.',
    specificObjectives: [
      'Participar ativamente da criação de regras',
      'Expressar necessidades e limites através da música',
      'Aceitar regras quando participa de sua criação',
      'Comprometer-se com acordos musicalmente selados'
    ],
    description: 'Terapeuta e paciente negociam regras para a sessão (ou para casa) através de um processo musical. Cada regra acordada é transformada em frase musical ou verso de canção. O contrato musical é gravado e pode ser tocado como lembrete. O processo de criação conjunta aumenta o senso de propriedade e adesão às regras.',
    materials: ['Instrumentos para composição', 'Papel para regras', 'Gravador', 'Decoração para contrato'],
    estimatedTime: '40-50 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Participa da negociação sem oposição extrema',
      'Contribui com ideias para as regras',
      'Memoriza a música do contrato',
      'Refere-se ao contrato em situações relevantes',
      'Cumpre regras acordadas consistentemente'
    ],
    adaptations: {
      level1: 'Poucas regras simples, melodia repetitiva, alta participação do terapeuta.',
      level2: 'Mais regras, melodia elaborada, negociação genuína.',
      level3: 'Regras complexas, música sofisticada, paciente lidera negociação.'
    },
    theoreticalBasis: 'Baseado em princípios de economia de fichas e contratos comportamentais, com adição do elemento musical que aumenta memorabilidade e engajamento emocional.',
    practicalTips: [
      'Incluir regras que beneficiem o paciente também',
      'Ser genuíno na negociação',
      'Revisar contrato periodicamente'
    ]
  },
  {
    id: 3022,
    title: 'Jogo das Instruções Sonoras',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver habilidade de seguir instruções através de jogos musicais que reforçam obediência a comandos.',
    specificObjectives: [
      'Ouvir instruções musicais atentamente',
      'Responder corretamente a comandos sonoros',
      'Tolerar frustração de errar e continuar',
      'Generalizar obediência para contextos não-musicais'
    ],
    description: 'Jogo estruturado onde o paciente deve seguir instruções dadas através da música: tocar quando ouve determinado som, parar com outro, mudar de instrumento, etc. Começa simples e aumenta complexidade. O formato de jogo torna seguir regras divertido, e a prática repetida fortalece o hábito de obedecer instruções.',
    materials: ['Instrumentos variados', 'Sinais sonoros distintos', 'Sistema de pontos', 'Prêmios simbólicos'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Segue instruções simples corretamente',
      'Responde a comandos com latência adequada',
      'Tolera erros sem desistir',
      'Aumenta complexidade ao longo das sessões',
      'Transfere habilidade para outros contextos'
    ],
    adaptations: {
      level1: 'Uma instrução por vez, sinais muito claros, recompensas frequentes.',
      level2: 'Duas instruções simultâneas, sinais variados, pontuação acumulativa.',
      level3: 'Múltiplas instruções complexas, sinais sutis, desafios de memória.'
    },
    theoreticalBasis: 'Combina treinamento de obediência comportamental com gamificação, usando a música como veículo motivador que reduz resistência natural do TOD a comandos.',
    practicalTips: [
      'Começar extremamente fácil para garantir sucesso',
      'Celebrar cada instrução seguida',
      'Aumentar dificuldade muito gradualmente'
    ]
  },
  {
    id: 3023,
    title: 'Banda Cooperativa',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver habilidades de cooperação e trabalho em equipe através da experiência de tocar em conjunto.',
    specificObjectives: [
      'Coordenar ações com outros músicos',
      'Ceder e adaptar para bem do grupo',
      'Respeitar papéis e turnos dentro da banda',
      'Experienciar sucesso coletivo'
    ],
    description: 'O paciente participa de uma banda musical (com terapeuta, familiares ou grupo) onde precisa coordenar sua performance com outros. A experiência de fazer música junto exige escuta, adaptação, respeito ao papel de cada um e valorização do resultado coletivo sobre o individual. Oferece experiência concreta de que cooperação gera resultados melhores.',
    materials: ['Instrumentos para todos os participantes', 'Partituras simples ou visuais', 'Espaço amplo'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Toca em sincroniza com o grupo',
      'Aceita feedback dos colegas',
      'Cede quando necessário para harmonia',
      'Celebra sucesso coletivo',
      'Transfere cooperação para outros contextos'
    ],
    adaptations: {
      level1: 'Dupla com terapeuta apenas, partes muito simples, alta estrutura.',
      level2: 'Trio ou quarteto, partes diferenciadas, alguma improvisação coletiva.',
      level3: 'Banda completa, peças complexas, apresentações para público.'
    },
    theoreticalBasis: 'A música de conjunto exige intrínsecamente cooperação, oferecendo laboratório natural para prática de habilidades sociais com feedback imediato e concreto.',
    practicalTips: [
      'Escolher músicas que todos gostem',
      'Atribuir papéis que destaquem cada membro',
      'Gravar para demonstrar resultado da cooperação'
    ]
  },
  {
    id: 3024,
    title: 'Limites Musicais',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Praticar respeito a limites através de jogos musicais com regras claras sobre volume, tempo e espaço.',
    specificObjectives: [
      'Reconhecer limites estabelecidos',
      'Respeitar limites mesmo quando quer ultrapassar',
      'Aceitar consequências de ultrapassar limites',
      'Desenvolver autocontrole dentro de estruturas'
    ],
    description: 'Atividades musicais com limites claros: tocar apenas até certo volume, apenas por determinado tempo, apenas em certas teclas. O paciente pratica respeitar esses limites, experienciando a estrutura como algo que permite e não apenas proíbe. Consequências naturais (música fica feia, jogo acaba) reforçam a função dos limites.',
    materials: ['Instrumentos variados', 'Medidor de volume', 'Timer visual', 'Marcações de espaço'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica os limites estabelecidos',
      'Mantém-se dentro dos limites por tempo crescente',
      'Aceita consequências naturais',
      'Reconhece função protetora dos limites',
      'Transfere respeito a limites para outros contextos'
    ],
    adaptations: {
      level1: 'Um limite por vez, muito concreto e visual, consequências imediatas e claras.',
      level2: 'Múltiplos limites simultâneos, negociação de alguns parâmetros.',
      level3: 'Limites sutis, autorregulação com verificação posterior, criação de próprios limites.'
    },
    theoreticalBasis: 'Baseado em princípios comportamentais de estabelecimento de limites, a música oferece consequências naturais e imediatas que tornam a aprendizagem mais concreta.',
    practicalTips: [
      'Começar com limites que provavelmente serão respeitados',
      'Evitar limites que pareçam arbitrários',
      'Conectar limites musicais a limites da vida real'
    ]
  },
  {
    id: 3025,
    title: 'Turno Respeitado Musical',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver capacidade de esperar sua vez e respeitar o espaço de expressão dos outros através de jogos musicais de turno.',
    specificObjectives: [
      'Esperar o próprio turno para tocar',
      'Ouvir ativamente enquanto outro toca',
      'Sinalizar apropriadamente quando quer sua vez',
      'Valorizar a contribuição dos outros'
    ],
    description: 'Jogos musicais de turno onde cada participante tem momento específico para tocar e deve esperar sua vez. Varia de simples (alternar solos) a complexo (respeitar sequências e tempos). Pratica-se a espera ativa, a escuta do outro e a sinalização adequada, habilidades centrais para interações sociais.',
    materials: ['Instrumentos para todos', 'Sinalizador de turno (bastão, luz)', 'Timer visual'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Espera seu turno sem interromper',
      'Presta atenção enquanto outro toca',
      'Usa sinais adequados para pedir vez',
      'Aumenta tempo de espera tolerado',
      'Aplica espera em conversas e jogos'
    ],
    adaptations: {
      level1: 'Turnos curtos (10-15 seg), sinalizador visual claro, dois participantes.',
      level2: 'Turnos médios (30 seg), múltiplos participantes, sequências.',
      level3: 'Turnos longos, improvisos, sem sinalizador externo.'
    },
    theoreticalBasis: 'A música de turno oferece estrutura clara e feedback imediato para prática de alternância, habilidade deficitária em crianças com TOD.',
    practicalTips: [
      'Começar com turnos muito curtos',
      'Elogiar específicamente a espera',
      'Tornar a espera ativa, não passiva'
    ]
  },
  {
    id: 3026,
    title: 'Maestro das Regras',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Exercitar liderança responsável onde o paciente conduz a banda respeitando regras musicais e do grupo.',
    specificObjectives: [
      'Experimentar papel de autoridade com responsabilidade',
      'Conduzir outros respeitando estrutura',
      'Entender perspectiva de quem estabelece regras',
      'Equilibrar controle pessoal com bem do grupo'
    ],
    description: 'O paciente assume o papel de maestro, conduzindo a banda (terapeuta e outros). Entretanto, deve seguir a partitura e as regras musicais - não pode simplesmente fazer o que quer. A experiência de liderar dentro de estrutura desenvolve respeito por autoridade ao entender sua complexidade e responsabilidade.',
    materials: ['Batuta de maestro', 'Partitura visual', 'Instrumentos para banda', 'Figurino de maestro (opcional)'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Conduz respeitando a partitura',
      'Dá comandos claros e adequados',
      'Aceita limites do papel',
      'Demonstra compreensão da perspectiva de autoridade',
      'Equilibra controle e flexibilidade'
    ],
    adaptations: {
      level1: 'Partitura muito simples, banda pequena, alta estrutura.',
      level2: 'Partitura moderada, banda maior, algumas decisões do maestro.',
      level3: 'Partitura complexa, banda completa, improvisações estruturadas.'
    },
    theoreticalBasis: 'A inversão de papéis permite experienciar a perspectiva da autoridade, desenvolvendo empatia e compreensão da função das regras.',
    practicalTips: [
      'Preparar bem para evitar frustração',
      'Debriefing sobre a experiência de liderar',
      'Conectar com situações em que adultos precisam impor regras'
    ]
  },
  {
    id: 3027,
    title: 'Negociação Rítmica',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver habilidades de negociação através de exercícios onde ritmos diferentes precisam se harmonizar.',
    specificObjectives: [
      'Reconhecer necessidade de negociação para harmonia',
      'Ceder parcialmente para alcançar acordo',
      'Propor soluções que beneficiem ambos',
      'Aceitar que nem sempre terá exatamente o que quer'
    ],
    description: 'Terapeuta e paciente começam com ritmos diferentes e incompatíveis. Precisam negociar - musicalmente e verbalmente - para encontrar um ritmo comum que funcione para ambos. O processo exige escuta, propostas, concessões e eventualmente acordo. Demonstra concretamente que negociação gera resultados melhores que imposição.',
    materials: ['Instrumentos de percussão', 'Lousa para anotar propostas', 'Metrônomo (opcional)'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Escuta a proposta do outro',
      'Faz propostas alternativas',
      'Aceita compromissos',
      'Celebra acordos alcançados',
      'Transfere habilidade para negociações da vida real'
    ],
    adaptations: {
      level1: 'Diferenças pequenas entre ritmos, terapeuta modela negociação.',
      level2: 'Diferenças maiores, negociação mais genuína, registro de propostas.',
      level3: 'Diferenças significativas, múltiplos aspectos a negociar, soluções criativas.'
    },
    theoreticalBasis: 'Treino de resolução de conflitos através de situação concreta e com baixa carga emocional, facilitando generalização para conflitos reais.',
    practicalTips: [
      'Modelar boa negociação',
      'Evitar sempre ceder - negociação genuína',
      'Celebrar o processo, não só o resultado'
    ]
  },
  {
    id: 3028,
    title: 'Consequências Sonoras',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver compreensão de causa e efeito através de jogos musicais onde ações têm consequências claras.',
    specificObjectives: [
      'Conectar ações a consequências',
      'Prever resultados de escolhas',
      'Aceitar consequências de próprias ações',
      'Modificar comportamento baseado em consequências'
    ],
    description: 'Sistema de jogo musical onde cada ação tem consequência clara: tocar forte demais faz a música parar, respeitar regras ganha pontos para escolher próxima música, etc. As consequências são naturais e previsíveis, ensinando a conexão ação-resultado de forma concreta e menos ameaçadora que situações reais.',
    materials: ['Instrumentos variados', 'Sistema de pontos visual', 'Cartões de consequências', 'Timer'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica consequências de ações',
      'Prevê consequências antes de agir',
      'Aceita consequências sem explosão',
      'Modifica comportamento para melhores consequências',
      'Aplica pensamento consequencial fora da música'
    ],
    adaptations: {
      level1: 'Consequências imediatas e óbvias, uma variável por vez.',
      level2: 'Consequências com pequeno delay, múltiplas variáveis.',
      level3: 'Consequências cumulativas, sistema complexo, análise reflexiva.'
    },
    theoreticalBasis: 'Baseado em princípios de análise comportamental, a música oferece ambiente seguro para experimentar consequências sem as repercussões sérias do mundo real.',
    practicalTips: [
      'Consequências sempre previsíveis e justas',
      'Evitar consequências punitivas',
      'Processar verbalmente a conexão ação-consequência'
    ]
  },
  {
    id: 3029,
    title: 'Escolhas Musicais Responsáveis',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Praticar tomada de decisão responsável oferecendo escolhas limitadas dentro de estrutura segura.',
    specificObjectives: [
      'Exercitar poder de escolha apropriado',
      'Decidir entre opções aceitáveis',
      'Assumir responsabilidade pelas escolhas',
      'Desenvolver senso de agência dentro de limites'
    ],
    description: 'O paciente recebe escolhas limitadas em vários aspectos da sessão musical: qual instrumento tocar (entre 3), qual música (entre 2), quanto tempo (15 ou 20 min), etc. Todas as opções são aceitáveis, mas a escolha é real. Desenvolve senso de controle e agência sem permitir escolhas inadequadas.',
    materials: ['Cartões de escolha', 'Instrumentos variados', 'Repertório musical', 'Timer'],
    estimatedTime: 'Sessão inteira (25-35 minutos)',
    ageRange: '5-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Faz escolhas dentro das opções oferecidas',
      'Não tenta criar novas opções fora do oferecido',
      'Assume responsabilidade pela escolha',
      'Satisfaz-se com ter poder de escolha limitado',
      'Generaliza para escolhas em casa/escola'
    ],
    adaptations: {
      level1: 'Apenas 2 opções por vez, opções muito diferentes, alta frequência de escolhas.',
      level2: 'Até 3 opções, opções mais sutis, algumas consequências das escolhas.',
      level3: 'Múltiplas opções, escolhas encadeadas, análise de padrões de escolha.'
    },
    theoreticalBasis: 'Baseado no conceito de escolhas limitadas da Disciplina Positiva, oferece sensação de controle (reduzindo oposição) dentro de estrutura segura.',
    practicalTips: [
      'Todas as opções devem ser genuinamente aceitáveis',
      'Evitar oferecer como opção algo que não é permitido',
      'Manter palavra após escolha feita'
    ]
  },
  {
    id: 3030,
    title: 'Flexibilidade nas Regras Musicais',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver flexibilidade cognitiva praticando adaptação a mudanças de regras no contexto musical.',
    specificObjectives: [
      'Adaptar-se a mudanças de regras sem explosão',
      'Entender que regras podem mudar por boas razões',
      'Manter engajamento apesar de mudanças',
      'Desenvolver repertório de adaptação'
    ],
    description: 'Durante jogos musicais, as regras mudam periodicamente (anunciadas de forma justa). O paciente pratica adaptar-se: o jogo que era de volume agora é de ritmo, o instrumento muda, a sequência altera. Desenvolve tolerância a mudanças e flexibilidade, características tipicamente difíceis no TOD.',
    materials: ['Instrumentos variados', 'Cartões de regras', 'Dado ou roleta de mudanças', 'Timer'],
    estimatedTime: '30-40 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita mudanças sem explosão',
      'Adapta comportamento às novas regras',
      'Tolera incerteza sobre próximas mudanças',
      'Mantém-se engajado apesar de frustrações',
      'Aplica flexibilidade a mudanças na vida real'
    ],
    adaptations: {
      level1: 'Mudanças pequenas e anunciadas com antecedência, poucas por sessão.',
      level2: 'Mudanças maiores, menor tempo de aviso, mais frequentes.',
      level3: 'Mudanças significativas e pouco previsíveis, alta frequência, múltiplas variáveis.'
    },
    theoreticalBasis: 'Treino de flexibilidade cognitiva, habilidade central das funções executivas e tipicamente deficitária no TOD, através de contexto lúdico e motivador.',
    practicalTips: [
      'Começar com mudanças positivas ou neutras',
      'Aumentar gradualmente a imprevisibilidade',
      'Processar estratégias de adaptação utilizadas'
    ]
  },
  {
    id: 3031,
    title: 'Reparação Musical após Erro',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver habilidade de reparar relacionamentos após comportamentos inadequados através de rituais musicais.',
    specificObjectives: [
      'Reconhecer quando causou dano',
      'Assumir responsabilidade por ações',
      'Fazer reparação significativa',
      'Restaurar harmonia após conflito'
    ],
    description: 'Quando o paciente tem comportamento inadequado (na sessão ou relatado de fora), trabalha-se a reparação através da música. Pode criar canção de desculpas, tocar algo que o outro gosta, oferecer um solo. O processo musical de reparação é menos ameaçador que pedidos verbais de desculpa.',
    materials: ['Instrumentos preferidos', 'Gravador', 'Materiais para criar cartão musical'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reconhece o comportamento inadequado',
      'Aceita necessidade de reparação',
      'Cria reparação musical significativa',
      'Entrega a reparação de forma genuína',
      'Demonstra mudança de comportamento posterior'
    ],
    adaptations: {
      level1: 'Terapeuta ajuda a identificar o problema e criar reparação simples.',
      level2: 'Paciente identifica problema com ajuda, cria reparação mais elaborada.',
      level3: 'Paciente reconhece, planeja e executa reparação autonomamente.'
    },
    theoreticalBasis: 'Baseado no conceito de justiça restaurativa e reparação relacional, oferece caminho concreto para restaurar relacionamentos danificados.',
    practicalTips: [
      'Não forçar desculpas vazias',
      'Reparação deve ser genuína, não humilhante',
      'Conectar com valores do paciente'
    ]
  },
  {
    id: 3032,
    title: 'Rotina Musical Estruturada',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Estabelecer rotina previsível na sessão musical que generalize para valorização de estrutura no cotidiano.',
    specificObjectives: [
      'Apreciar benefícios da previsibilidade',
      'Seguir rotina estabelecida sem oposição',
      'Antecipar e preparar-se para próximas etapas',
      'Transferir aceitação de rotina para vida diária'
    ],
    description: 'A sessão segue estrutura consistente e previsível: música de chegada, aquecimento, atividade principal, música de despedida. A mesma estrutura repetida semanalmente desenvolve conforto com rotina e previsibilidade, características que crianças com TOD frequentemente resistem mas das quais se beneficiam.',
    materials: ['Agenda visual', 'Músicas marcadoras de cada fase', 'Timer', 'Quadro de rotina'],
    estimatedTime: 'Estrutura aplicada a todas as sessões',
    ageRange: '5-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Segue a rotina sem resistência',
      'Antecipa próximas etapas',
      'Demonstra conforto com previsibilidade',
      'Aceita variações planejadas',
      'Aplica rotinas em casa'
    ],
    adaptations: {
      level1: 'Rotina muito curta e simples, muitas repetições por sessão.',
      level2: 'Rotina completa da sessão, algumas variações planejadas.',
      level3: 'Rotina flexível com negociação, generalizações amplas.'
    },
    theoreticalBasis: 'Estrutura e previsibilidade reduzem ansiedade e necessidade de controle opositor, além de desenvolver funções executivas de planejamento.',
    practicalTips: [
      'Manter consistência por várias sessões',
      'Avisar mudanças com antecedência',
      'Conectar rotina da sessão com rotinas de casa'
    ]
  },
  {
    id: 3033,
    title: 'Parar Musical - Controle Inibitório',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle inibitório através de jogos musicais que exigem parar ações prazerosas.',
    specificObjectives: [
      'Parar atividade prazerosa quando solicitado',
      'Reduzir tempo de latência para parar',
      'Tolerar frustração de interrupção',
      'Generalizar controle inibitório'
    ],
    description: 'Jogos estilo "estátua musical" onde o paciente deve parar imediatamente de tocar quando a música para ou quando ouve determinado sinal. Pratica-se a inibição de resposta, habilidade central das funções executivas e tipicamente deficitária no TOD. Começa fácil e aumenta dificuldade.',
    materials: ['Instrumentos variados', 'Músicas com pausas', 'Sinais sonoros de parada', 'Timer'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Para dentro de tempo adequado',
      'Reduz tempo de latência ao longo das sessões',
      'Mantém parada pelo tempo necessário',
      'Tolera frustração da interrupção',
      'Aplica controle inibitório em outras situações'
    ],
    adaptations: {
      level1: 'Sinais claros e antecipados, tempo tolerante de resposta, alta recompensa.',
      level2: 'Sinais variados, tempo de resposta moderado, jogos competitivos.',
      level3: 'Sinais sutis, resposta rápida exigida, paradas prolongadas.'
    },
    theoreticalBasis: 'Treino direto de controle inibitório, função executiva deficitária no TOD e associada a impulsividade e dificuldade em seguir regras.',
    practicalTips: [
      'Tornar o jogo divertido, não punitivo',
      'Celebrar cada parada bem-sucedida',
      'Aumentar dificuldade muito gradualmente'
    ]
  },
  {
    id: 3034,
    title: 'Aceitar Não Musical',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver tolerância a respostas negativas através de situações musicais onde nem sempre se consegue o que quer.',
    specificObjectives: [
      'Aceitar "não" sem explosão',
      'Manter engajamento após recusa',
      'Propor alternativas aceitáveis',
      'Desenvolver resiliência a frustrações'
    ],
    description: 'Situações estruturadas onde o paciente não consegue exatamente o que quer: o instrumento desejado não está disponível, a música escolhida é muito longa, etc. Pratica-se aceitar a negativa e encontrar alternativas. O contexto musical reduz a intensidade emocional das recusas.',
    materials: ['Instrumentos variados', 'Situações planejadas de "não"', 'Cartões de alternativas'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita "não" sem explosão',
      'Propõe alternativas',
      'Recupera-se rapidamente da frustração',
      'Mantém engajamento na atividade',
      'Generaliza aceitação de negativas'
    ],
    adaptations: {
      level1: '"Não" para coisas menos importantes, alternativas imediatas óbvias.',
      level2: '"Não" para preferências moderadas, negociação de alternativas.',
      level3: '"Não" para coisas importantes, delay antes de alternativas, múltiplas negativas.'
    },
    theoreticalBasis: 'Exposição gradual a frustrações em ambiente seguro desenvolve tolerância e habilidades de coping, reduzindo explosões em situações reais.',
    practicalTips: [
      'Balancear "nãos" com muitos "sins"',
      'Processar estratégias após cada situação',
      'Celebrar aceitações bem-sucedidas'
    ]
  },
  {
    id: 3035,
    title: 'Música do Bom Comportamento',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Reforçar comportamentos positivos através de composição musical que celebra conquistas e boas escolhas.',
    specificObjectives: [
      'Identificar próprios comportamentos positivos',
      'Celebrar conquistas através da música',
      'Desenvolver autoimagem positiva',
      'Motivar-se para mais comportamentos adequados'
    ],
    description: 'O paciente cria músicas sobre seus comportamentos positivos: momentos em que controlou a raiva, seguiu regras, cooperou. A composição serve para reforçar, celebrar e lembrar de capacidades positivas, contrastando com foco típico em comportamentos problemáticos.',
    materials: ['Instrumentos para composição', 'Gravador', 'Ilustrações de comportamentos', 'Papel para letra'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica comportamentos positivos próprios',
      'Cria música celebratória genuína',
      'Demonstra orgulho das conquistas',
      'Usa a música como motivação',
      'Aumenta frequência de comportamentos positivos'
    ],
    adaptations: {
      level1: 'Terapeuta ajuda a identificar comportamentos, música simples e repetitiva.',
      level2: 'Paciente identifica comportamentos, composição mais elaborada.',
      level3: 'Repertório de músicas de conquistas, performances, atualização contínua.'
    },
    theoreticalBasis: 'Baseado em reforço positivo e foco em forças, a celebração musical de comportamentos adequados fortalece autoestima e motivação.',
    practicalTips: [
      'Começar com qualquer comportamento minimamente positivo',
      'Evitar "mas..." que diminuam conquistas',
      'Incluir família para reconhecimento'
    ]
  },
  {
    id: 3036,
    title: 'Obediência Alegre Musical',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Transformar obediência de experiência negativa em experiência positiva através de jogos musicais divertidos.',
    specificObjectives: [
      'Associar seguir instruções com prazer',
      'Obedecer prontamente em contexto lúdico',
      'Reduzir resistência automática a comandos',
      'Transferir obediência positiva para outros contextos'
    ],
    description: 'Jogos altamente divertidos que exigem seguir muitas instruções rapidamente: Simon musical, karaokê com gestos, dança com comandos. A diversão é condicionada a obedecer, e a experiência positiva começa a mudar a associação automática de resistência.',
    materials: ['Instrumentos variados', 'Sistema de jogo', 'Músicas animadas', 'Prêmios'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Obedece prontamente no contexto do jogo',
      'Demonstra prazer ao seguir instruções',
      'Reduz latência de resposta a comandos',
      'Pede para jogar novamente',
      'Mostra melhora em obediência fora da sessão'
    ],
    adaptations: {
      level1: 'Instruções muito simples, alta taxa de diversão, máximo reforço.',
      level2: 'Instruções moderadas, diversão condicionada a obediência.',
      level3: 'Instruções complexas, diversão como consequência natural.'
    },
    theoreticalBasis: 'Condicionamento clássico: pareamento de obediência com experiência positiva muda a valência emocional associada a seguir instruções.',
    practicalTips: [
      'Garantir que seja genuinamente divertido',
      'Manter alta taxa de sucesso',
      'Generalizar gradualmente para comandos menos divertidos'
    ]
  },
  {
    id: 3037,
    title: 'Feedback Musical Construtivo',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver capacidade de receber feedback sem reatividade defensiva através de feedback musical estruturado.',
    specificObjectives: [
      'Ouvir feedback sem interromper',
      'Aceitar críticas construtivas',
      'Usar feedback para melhorar',
      'Manter autoestima apesar de críticas'
    ],
    description: 'O terapeuta oferece feedback sobre a performance musical do paciente de forma estruturada: primeiro aspectos positivos, depois sugestões de melhoria, com oportunidade de nova tentativa. Pratica-se receber feedback em contexto de baixa ameaça, desenvolvendo habilidade para contextos mais desafiadores.',
    materials: ['Instrumentos', 'Estrutura visual de feedback (sanduíche)', 'Gravador para demonstração'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Ouve feedback completamente',
      'Não reage defensivamente',
      'Tenta incorporar sugestões',
      'Pede esclarecimentos apropriadamente',
      'Aceita feedback em outros contextos'
    ],
    adaptations: {
      level1: 'Feedback quase todo positivo, sugestões mínimas, alta estrutura.',
      level2: 'Feedback equilibrado, sugestões práticas, processamento guiado.',
      level3: 'Feedback direto, múltiplas sugestões, autorreflexão.'
    },
    theoreticalBasis: 'Dessensibilização a feedback através de exposição gradual em contexto seguro, desenvolvendo tolerância a críticas construtivas.',
    practicalTips: [
      'Sempre começar com genuíno positivo',
      'Sugestões devem ser alcançáveis',
      'Demonstrar incorporação do próprio feedback'
    ]
  },
  {
    id: 3038,
    title: 'Autoridade Musical Justa',
    disorder: 'TOD',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver distinção entre autoridade justa e injusta, promovendo respeito a autoridades legítimas.',
    specificObjectives: [
      'Reconhecer características de autoridade justa',
      'Aceitar orientação de autoridades justas',
      'Questionar apropriadamente autoridade injusta',
      'Cooperar com estruturas de poder legítimas'
    ],
    description: 'Através de role-plays musicais, o paciente experimenta diferentes estilos de liderança: autoritário, permissivo, autoritativo. Discute-se como cada um afeta a experiência e os resultados. Desenvolve-se capacidade de distinguir autoridade legítima de abuso de poder, promovendo respeito sem submissão cega.',
    materials: ['Instrumentos para banda', 'Cenários de liderança', 'Quadro comparativo'],
    estimatedTime: '40-50 minutos',
    ageRange: '10-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Diferencia estilos de autoridade',
      'Aceita autoridade autoritativa',
      'Questiona apropriadamente excessos',
      'Demonstra respeito por autoridades justas',
      'Aplica distinção em situações reais'
    ],
    adaptations: {
      level1: 'Contrastes claros entre justo e injusto, discussão guiada.',
      level2: 'Nuances de autoridade, role-plays variados, reflexão.',
      level3: 'Situações complexas e ambíguas, análise crítica, aplicação pessoal.'
    },
    theoreticalBasis: 'Baseado em pesquisas sobre estilos parentais e desenvolvimento moral, promove aceitação de autoridade legítima sem eliminar pensamento crítico.',
    practicalTips: [
      'Evitar demonizar toda autoridade',
      'Validar frustrações legítimas com autoridades',
      'Desenvolver critérios de justiça'
    ]
  },

  // ==================== HABILIDADES SOCIAIS (3039-3056) ====================
  {
    id: 3039,
    title: 'Perspectiva Musical do Outro',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver capacidade de considerar perspectivas alheias através de exercícios musicais de tomada de perspectiva.',
    specificObjectives: [
      'Tocar música do jeito que outro gostaria',
      'Imaginar como o outro se sente com determinada música',
      'Antecipar reações dos outros',
      'Considerar perspectivas diferentes da própria'
    ],
    description: 'O paciente é desafiado a tocar não como ele gosta, mas como outra pessoa (mãe, professor, amigo) gostaria. Precisa imaginar as preferências do outro e adaptar sua performance. O exercício desenvolve teoria da mente e empatia cognitiva de forma concreta.',
    materials: ['Instrumentos variados', 'Fotos de pessoas conhecidas', 'Quadro de preferências'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica preferências prováveis de outros',
      'Adapta performance baseado em perspectiva alheia',
      'Verifica se acertou (quando possível)',
      'Demonstra interesse pela perspectiva do outro',
      'Aplica tomada de perspectiva em situações sociais'
    ],
    adaptations: {
      level1: 'Contrastes óbvios (adulto vs. criança), alta estrutura.',
      level2: 'Nuances mais sutis, verificação posterior, reflexão.',
      level3: 'Perspectivas complexas, múltiplas pessoas, situações desafiadoras.'
    },
    theoreticalBasis: 'Treino de teoria da mente e empatia cognitiva, habilidades frequentemente deficitárias em crianças com TOD e associadas a conflitos interpessoais.',
    practicalTips: [
      'Usar pessoas reais da vida do paciente',
      'Verificar hipóteses quando possível',
      'Conectar com conflitos reais'
    ]
  },
  {
    id: 3040,
    title: 'Empatia Sonora',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver empatia emocional através da reprodução musical de estados emocionais de outras pessoas.',
    specificObjectives: [
      'Identificar emoções em outros através de pistas',
      'Reproduzir musicalmente o que o outro sente',
      'Conectar-se emocionalmente com experiência alheia',
      'Responder de forma empática a estados emocionais'
    ],
    description: 'O paciente observa expressões emocionais (fotos, vídeos, terapeuta) e tenta reproduzir musicalmente o que a pessoa está sentindo. O exercício exige identificação emocional, sintonia afetiva e expressão. Desenvolve tanto reconhecimento emocional quanto ressonância empática.',
    materials: ['Instrumentos expressivos', 'Fotos de expressões emocionais', 'Vídeos de situações', 'Cartões de emoções'],
    estimatedTime: '30-40 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica corretamente emoções em outros',
      'Reproduz musicalmente de forma congruente',
      'Demonstra sintonia emocional',
      'Verbaliza compreensão da experiência alheia',
      'Mostra respostas empáticas espontâneas'
    ],
    adaptations: {
      level1: 'Emoções básicas e claras, alta correspondência exigida, feedback imediato.',
      level2: 'Emoções mais sutis, situações contextualizadas, discussão.',
      level3: 'Emoções complexas e mistas, situações ambíguas, reflexão profunda.'
    },
    theoreticalBasis: 'Treino de empatia afetiva através da música, que por sua natureza emocional facilita ressonância e conexão empática.',
    practicalTips: [
      'Começar com emoções positivas',
      'Usar situações relevantes para o paciente',
      'Modelar respostas empáticas'
    ]
  },
  {
    id: 3041,
    title: 'Resolução de Conflitos Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades de resolução de conflitos através de situações musicais que exigem negociação e acordo.',
    specificObjectives: [
      'Identificar conflitos de interesse',
      'Propor soluções mutuamente aceitáveis',
      'Negociar sem agressão',
      'Alcançar acordos funcionais'
    ],
    description: 'Situações musicais são criadas onde há conflito de interesses: dois querem o mesmo instrumento, preferências musicais diferentes, desacordo sobre como tocar. O paciente pratica resolver esses conflitos usando comunicação, negociação e compromisso, com o terapeuta modelando e facilitando.',
    materials: ['Recursos limitados (instrumentos disputados)', 'Cenários de conflito', 'Passos de resolução visual'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Mantém-se calmo durante conflito',
      'Expressa necessidades sem agressão',
      'Ouve perspectiva do outro',
      'Propõe soluções de compromisso',
      'Aplica estratégias em conflitos reais'
    ],
    adaptations: {
      level1: 'Conflitos simples e artificiais, alta estrutura, solução guiada.',
      level2: 'Conflitos mais reais, negociação genuína, múltiplas opções.',
      level3: 'Conflitos complexos, pouca estrutura, generalizações amplas.'
    },
    theoreticalBasis: 'Treino de habilidades sociais de resolução de conflitos em contexto de baixa ameaça, permitindo prática segura antes de situações reais.',
    practicalTips: [
      'Modelar processo completo de resolução',
      'Celebrar acordos alcançados',
      'Conectar com conflitos reais do paciente'
    ]
  },
  {
    id: 3042,
    title: 'Escuta Ativa Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades de escuta ativa através de exercícios musicais que exigem atenção e resposta ao outro.',
    specificObjectives: [
      'Ouvir atentamente o que outro toca',
      'Responder de forma relacionada ao que ouviu',
      'Demonstrar compreensão através da resposta musical',
      'Manter diálogo musical sustentado'
    ],
    description: 'Em diálogos musicais, o paciente deve ouvir o que o terapeuta toca e responder de forma relacionada - não apenas tocar o que quer, mas responder ao que ouviu. Pratica-se a escuta que é base de toda comunicação efetiva, em formato mais acessível que conversas verbais.',
    materials: ['Instrumentos para diálogo', 'Estrutura visual de conversa', 'Gravador'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Ouve até o fim antes de responder',
      'Responde de forma relacionada',
      'Mantém tema do diálogo',
      'Demonstra compreensão musical',
      'Transfere escuta para conversas verbais'
    ],
    adaptations: {
      level1: 'Frases curtas, respostas de imitação, alta estrutura.',
      level2: 'Frases médias, respostas variadas, diálogo sustentado.',
      level3: 'Improvisações longas, respostas criativas, múltiplos participantes.'
    },
    theoreticalBasis: 'A escuta ativa é fundamento de comunicação efetiva. O formato musical remove barreiras verbais e torna a prática mais engajadora.',
    practicalTips: [
      'Modelar escuta ativa ao paciente',
      'Reforçar qualquer resposta relacionada',
      'Gravar e analisar diálogos'
    ]
  },
  {
    id: 3043,
    title: 'Comunicação Assertiva Cantada',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver comunicação assertiva através de exercícios de canto que expressam necessidades sem agressão.',
    specificObjectives: [
      'Expressar necessidades de forma clara',
      'Comunicar sem agressão ou passividade',
      'Usar "eu" em vez de acusações',
      'Manter tom firme mas respeitoso'
    ],
    description: 'O paciente pratica expressar necessidades, frustrações e pedidos através do canto, usando estrutura assertiva: "Eu sinto... quando... porque... e gostaria...". Cantar reduz intensidade emocional e a estrutura garante comunicação assertiva, não agressiva.',
    materials: ['Microfone (real ou simbólico)', 'Frases estruturadas', 'Cenários de comunicação', 'Gravador'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Usa estrutura assertiva corretamente',
      'Mantém tom não-agressivo',
      'Expressa necessidades claramente',
      'Pratica em múltiplos cenários',
      'Aplica em situações reais'
    ],
    adaptations: {
      level1: 'Frases simples, alta estrutura, cenários de baixa carga.',
      level2: 'Frases completas, cenários variados, feedback detalhado.',
      level3: 'Situações reais e desafiadoras, improviso, autoanálise.'
    },
    theoreticalBasis: 'Treino de assertividade em formato musical que reduz defensividade e facilita prática de comunicação efetiva.',
    practicalTips: [
      'Modelar comunicação assertiva',
      'Contrastar com agressiva e passiva',
      'Praticar situações reais do paciente'
    ]
  },
  {
    id: 3044,
    title: 'Pedido Musical (Pedir vs Exigir)',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidade de fazer pedidos em vez de exigências através de exercícios musicais contrastantes.',
    specificObjectives: [
      'Distinguir pedido de exigência',
      'Praticar tom e palavras de pedido',
      'Aceitar "não" como resposta possível',
      'Aumentar taxa de sucesso em conseguir o que precisa'
    ],
    description: 'O paciente pratica fazer pedidos através da música, contrastando o som da exigência (tom duro, imperativo) com o som do pedido (tom suave, interrogativo). Experimenta como cada um soa e como as pessoas respondem diferentemente. Pratica pedidos em cenários variados.',
    materials: ['Instrumentos contrastantes', 'Cenários de pedido', 'Quadro de comparação', 'Role-plays'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Distingue pedido de exigência',
      'Produz tom de pedido consistentemente',
      'Aceita respostas negativas',
      'Reformula exigências em pedidos',
      'Usa pedidos em situações reais'
    ],
    adaptations: {
      level1: 'Contraste muito claro, cenários simples, reforço intenso.',
      level2: 'Nuances de tom, cenários variados, prática de reformulação.',
      level3: 'Situações desafiadoras, análise de padrões, autorreflexão.'
    },
    theoreticalBasis: 'Crianças com TOD frequentemente exigem em vez de pedir, gerando resistência. Treinar a forma de pedir aumenta cooperação dos outros.',
    practicalTips: [
      'Demonstrar que pedidos funcionam melhor',
      'Não ceder a exigências',
      'Reforçar pedidos bem formulados'
    ]
  },
  {
    id: 3045,
    title: 'Desculpas Musicais Genuínas',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidade de pedir desculpas genuínas através de composição e performance musical.',
    specificObjectives: [
      'Reconhecer quando desculpas são necessárias',
      'Expressar arrependimento genuíno',
      'Evitar justificativas que minimizam',
      'Reparar relacionamentos através de desculpas'
    ],
    description: 'O paciente cria canções de desculpas que expressam genuíno reconhecimento do erro, impacto no outro e intenção de mudança. Contrasta-se com falsas desculpas ("desculpa, mas..."). O formato musical facilita expressão emocional que desculpas verbais muitas vezes não alcançam.',
    materials: ['Instrumentos para composição', 'Estrutura de desculpa genuína', 'Gravador', 'Cenários'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reconhece necessidade de desculpa',
      'Cria desculpa sem justificativas',
      'Expressa impacto no outro',
      'Demonstra intenção de mudança',
      'Oferece desculpas em situações reais'
    ],
    adaptations: {
      level1: 'Situações simples, alta estrutura, foco no reconhecimento.',
      level2: 'Situações moderadas, composição mais livre, elementos de reparação.',
      level3: 'Situações reais e complexas, desculpas elaboradas, follow-up.'
    },
    theoreticalBasis: 'Desculpas genuínas são centrais para manutenção de relacionamentos. O formato musical facilita a expressão emocional necessária.',
    practicalTips: [
      'Não forçar desculpas não sentidas',
      'Modelar desculpas genuínas',
      'Distinguir de falsas desculpas'
    ]
  },
  {
    id: 3046,
    title: 'Colaboração Criativa Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades de colaboração através de criação musical conjunta que exige respeito a ideias alheias.',
    specificObjectives: [
      'Contribuir para criação coletiva',
      'Valorizar contribuições dos outros',
      'Ceder em prol do resultado conjunto',
      'Experienciar satisfação de sucesso coletivo'
    ],
    description: 'Terapeuta e paciente (ou grupo) criam música juntos - uma canção, uma peça instrumental. Cada um contribui com ideias, e o processo exige negociação, valorização mútua e compromisso. O produto final pertence a todos, demonstrando benefícios da colaboração.',
    materials: ['Instrumentos variados', 'Materiais de composição', 'Gravador', 'Partituras'],
    estimatedTime: '40-50 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Contribui com ideias próprias',
      'Aceita ideias dos outros',
      'Negocia diferenças construtivamente',
      'Celebra resultado coletivo',
      'Aplica colaboração em outros contextos'
    ],
    adaptations: {
      level1: 'Criação altamente estruturada, papéis definidos, alta orientação.',
      level2: 'Criação moderadamente livre, negociação genuína, múltiplas contribuições.',
      level3: 'Criação livre, liderança compartilhada, projetos complexos.'
    },
    theoreticalBasis: 'A criação musical conjunta é laboratório natural para habilidades de colaboração, com feedback imediato no resultado sonoro.',
    practicalTips: [
      'Garantir que todos contribuam',
      'Valorizar todas as contribuições',
      'Documentar o processo e produto'
    ]
  },
  {
    id: 3047,
    title: 'Leitura de Sinais Musicais',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidade de interpretar sinais não-verbais através da leitura de intenções musicais.',
    specificObjectives: [
      'Identificar intenções através da música',
      'Reconhecer sinais de que algo está errado',
      'Antecipar reações baseado em pistas',
      'Responder apropriadamente a sinais sutis'
    ],
    description: 'O terapeuta comunica intenções através da música sem palavras: convite para tocar junto, pedido de pausa, sugestão de mudança, sinal de problema. O paciente aprende a "ler" essas comunicações não-verbais, habilidade transferível para leitura de expressões faciais e corporais.',
    materials: ['Instrumentos para comunicação', 'Cartões de intenções', 'Gravador para análise'],
    estimatedTime: '30-40 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica intenções musicais corretamente',
      'Responde apropriadamente aos sinais',
      'Desenvolve sensibilidade a nuances',
      'Transfere para leitura não-verbal geral',
      'Usa para guiar próprio comportamento'
    ],
    adaptations: {
      level1: 'Sinais claros e exagerados, feedback imediato, poucas opções.',
      level2: 'Sinais moderados, múltiplas intenções, discussão de pistas.',
      level3: 'Sinais sutis, contextos complexos, análise detalhada.'
    },
    theoreticalBasis: 'Treino de leitura de comunicação não-verbal em formato musical mais acessível, desenvolvendo habilidade social fundamental.',
    practicalTips: [
      'Começar com sinais muito claros',
      'Verificar interpretações',
      'Conectar com sinais da vida real'
    ]
  },
  {
    id: 3048,
    title: 'Amizade Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades de construção e manutenção de amizades através de atividades musicais compartilhadas.',
    specificObjectives: [
      'Identificar qualidades de boas amizades',
      'Praticar comportamentos de amizade',
      'Compartilhar experiências musicais positivas',
      'Desenvolver vínculo através da música'
    ],
    description: 'Atividades que exploram e praticam elementos de amizade: compartilhar interesses musicais, tocar junto, ensinar e aprender um do outro, celebrar sucessos mútuos. A música serve como atividade compartilhada que naturalmente desenvolve habilidades de amizade.',
    materials: ['Instrumentos para compartilhar', 'Repertório mútuo', 'Materiais sobre amizade'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica qualidades de amizade',
      'Demonstra comportamentos de amizade',
      'Compartilha positivamente',
      'Mostra interesse genuíno pelo outro',
      'Desenvolve/melhora amizades reais'
    ],
    adaptations: {
      level1: 'Foco em comportamentos específicos, alta estrutura, dupla apenas.',
      level2: 'Habilidades variadas, menos estrutura, grupos pequenos.',
      level3: 'Amizades complexas, situações desafiadoras, aplicação direta.'
    },
    theoreticalBasis: 'Crianças com TOD frequentemente têm dificuldades em amizades. A música oferece atividade compartilhada que facilita conexão e prática de habilidades.',
    practicalTips: [
      'Usar música como interesse comum',
      'Celebrar conexões genuínas',
      'Trabalhar com amigos reais quando possível'
    ]
  },
  {
    id: 3049,
    title: 'Expressão Emocional Apropriada',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver formas socialmente apropriadas de expressar emoções negativas através da música.',
    specificObjectives: [
      'Reconhecer que pode expressar emoções',
      'Diferenciar formas apropriadas e inapropriadas',
      'Praticar expressão que não prejudica relações',
      'Desenvolver repertório de expressão saudável'
    ],
    description: 'O paciente aprende que emoções negativas são válidas e precisam ser expressas, mas de formas que não prejudiquem relacionamentos. Através da música, pratica expressar raiva, frustração e tristeza de maneiras que comunicam sem agredir. Contrasta formas efetivas e inefetivas de expressão.',
    materials: ['Instrumentos variados', 'Cartões de emoções', 'Cenários', 'Quadro de comparação'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reconhece validade de emoções negativas',
      'Diferencia expressões apropriadas e não',
      'Pratica expressões saudáveis',
      'Consegue comunicar sem agredir',
      'Aplica em situações reais'
    ],
    adaptations: {
      level1: 'Foco em uma emoção, contrastes claros, alta orientação.',
      level2: 'Múltiplas emoções, nuances de apropriado, cenários variados.',
      level3: 'Situações complexas, expressão espontânea, autoanálise.'
    },
    theoreticalBasis: 'A supressão emocional é tão problemática quanto a expressão destrutiva. Desenvolver formas saudáveis de expressão protege relacionamentos e saúde mental.',
    practicalTips: [
      'Validar a emoção enquanto redireciona expressão',
      'Modelar expressão apropriada',
      'Celebrar comunicação efetiva'
    ]
  },
  {
    id: 3050,
    title: 'Música da Gratidão',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver expressão de gratidão e apreciação através da criação musical dedicada a pessoas importantes.',
    specificObjectives: [
      'Reconhecer coisas pelas quais é grato',
      'Expressar gratidão de forma tangível',
      'Valorizar contribuições dos outros',
      'Desenvolver perspectiva mais positiva'
    ],
    description: 'O paciente cria músicas de agradecimento para pessoas importantes em sua vida: familiares, professores, amigos. O processo de pensar no que agradecer e expressar musicalmente desenvolve gratidão e melhora perspectiva sobre relacionamentos que podem ser fonte de conflito.',
    materials: ['Instrumentos para composição', 'Gravador', 'Papel para letra', 'Materiais para presente'],
    estimatedTime: '40-50 minutos',
    ageRange: '7-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica motivos de gratidão',
      'Cria música de agradecimento genuína',
      'Expressa gratidão a destinatários',
      'Demonstra mudança de perspectiva',
      'Pratica gratidão regularmente'
    ],
    adaptations: {
      level1: 'Gratidão por coisas simples, música muito estruturada, destinatário próximo.',
      level2: 'Gratidão por pessoas específicas, composição mais livre, entrega real.',
      level3: 'Gratidão profunda, composições elaboradas, apresentações, reflexão ampla.'
    },
    theoreticalBasis: 'Práticas de gratidão têm evidência sólida de benefícios para bem-estar. A expressão musical torna a gratidão mais tangível e significativa.',
    practicalTips: [
      'Começar com gratidões fáceis',
      'Entregar músicas a destinatários',
      'Estabelecer prática regular'
    ]
  },
  {
    id: 3051,
    title: 'Círculo de Apreciação Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidade de dar e receber elogios através de círculos musicais de apreciação.',
    specificObjectives: [
      'Identificar qualidades positivas em outros',
      'Expressar apreciação musicalmente',
      'Receber elogios graciosamente',
      'Desenvolver cultura de apreciação'
    ],
    description: 'Em grupo (ou dupla com terapeuta), cada pessoa cria breve expressão musical que representa algo que aprecia em outro participante. A pessoa recebe e responde à apreciação. Pratica-se tanto dar quanto receber elogios, habilidades sociais importantes.',
    materials: ['Instrumentos acessíveis', 'Estrutura do círculo', 'Tempo para cada pessoa'],
    estimatedTime: '30-40 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica qualidades genuínas em outros',
      'Expressa apreciação musicalmente',
      'Recebe elogios sem rejeitar',
      'Demonstra conforto crescente com apreciação',
      'Pratica elogios no cotidiano'
    ],
    adaptations: {
      level1: 'Dupla apenas, apreciações simples, alta estrutura.',
      level2: 'Grupo pequeno, apreciações variadas, reflexão.',
      level3: 'Grupo maior, apreciações profundas, liderança rotativa.'
    },
    theoreticalBasis: 'Dar e receber apreciação fortalece relacionamentos e autoestima. Muitos com TOD têm dificuldade em ambos os lados dessa equação.',
    practicalTips: [
      'Garantir que todos recebam apreciação',
      'Modelar aceitação de elogios',
      'Criar ambiente seguro e genuíno'
    ]
  },
  {
    id: 3052,
    title: 'Música para Confortar',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidade de oferecer conforto a outros através da música quando estão tristes ou em dificuldade.',
    specificObjectives: [
      'Reconhecer quando outros precisam de conforto',
      'Oferecer presença e apoio musicalmente',
      'Adaptar resposta às necessidades do outro',
      'Desenvolver empatia ativa'
    ],
    description: 'O paciente pratica responder com música quando o terapeuta (ou outro) demonstra tristeza, dificuldade ou necessidade de apoio. Aprende que às vezes a melhor resposta não é solução, mas presença. A música oferece forma de confortar que não exige palavras certas.',
    materials: ['Instrumentos suaves', 'Cenários de necessidade', 'Recursos sobre conforto'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reconhece sinais de necessidade de conforto',
      'Oferece resposta musical apropriada',
      'Adapta a intensidade e tipo de música',
      'Demonstra presença genuína',
      'Oferece conforto em situações reais'
    ],
    adaptations: {
      level1: 'Sinais claros, resposta estruturada, feedback imediato.',
      level2: 'Sinais variados, respostas mais livres, discussão.',
      level3: 'Situações complexas, respostas espontâneas, múltiplos contextos.'
    },
    theoreticalBasis: 'Oferecer conforto é habilidade social e de empatia crucial. A música oferece caminho não-verbal para expressar cuidado.',
    practicalTips: [
      'Modelar conforto apropriado',
      'Evitar minimização da dor',
      'Valorizar tentativas de conforto'
    ]
  },
  {
    id: 3053,
    title: 'Diálogo Musical de Conflito',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver comunicação durante conflito através de diálogos musicais que representam desacordos.',
    specificObjectives: [
      'Expressar desacordo sem agressão',
      'Ouvir perspectiva oposta',
      'Manter comunicação durante tensão',
      'Buscar resolução ou acordo'
    ],
    description: 'Terapeuta e paciente representam um conflito musicalmente - cada um expressando sua "posição" através do instrumento. Pratica-se manter diálogo (não monólogo ou abandono), ouvir o outro e buscar pontos de encontro, tudo sem palavras, o que pode ser mais acessível durante alta tensão.',
    materials: ['Instrumentos para diálogo', 'Cenários de conflito', 'Gravador para análise'],
    estimatedTime: '35-45 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Mantém diálogo durante desacordo',
      'Expressa sem dominar',
      'Ouve resposta do outro',
      'Adapta posição quando apropriado',
      'Aplica em conflitos verbais reais'
    ],
    adaptations: {
      level1: 'Conflitos leves, alta estrutura, resolução garantida.',
      level2: 'Conflitos moderados, diálogo genuíno, busca de compromisso.',
      level3: 'Conflitos intensos, pouca estrutura, análise detalhada.'
    },
    theoreticalBasis: 'Praticar comunicação durante conflito em formato não-verbal de menor intensidade prepara para conflitos verbais reais.',
    practicalTips: [
      'Manter segurança emocional',
      'Parar se muito intenso',
      'Processar verbalmente após'
    ]
  },
  {
    id: 3054,
    title: 'Música de Pertencimento',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver senso de pertencimento e conexão com grupos através de experiências musicais compartilhadas.',
    specificObjectives: [
      'Experienciar fazer parte de algo maior',
      'Contribuir para resultado coletivo',
      'Sentir-se aceito e valorizado no grupo',
      'Desenvolver identidade grupal positiva'
    ],
    description: 'O paciente participa de experiências musicais grupais (banda, coro, jam session) onde faz parte de algo maior que si mesmo. A experiência de pertencer, contribuir e ser valorizado em grupo pode ser reparadora para quem frequentemente se sente excluído ou em conflito.',
    materials: ['Instrumentos para todos', 'Repertório grupal', 'Uniforme ou símbolo do grupo (opcional)'],
    estimatedTime: '40-50 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Participa ativamente do grupo musical',
      'Contribui para resultado coletivo',
      'Demonstra pertencimento',
      'Verbaliza valorização do grupo',
      'Generaliza para outros grupos'
    ],
    adaptations: {
      level1: 'Dupla evoluindo para trio, papéis claros, alta valorização.',
      level2: 'Grupos pequenos, papéis variados, repertório escolhido junto.',
      level3: 'Grupos maiores, liderança compartilhada, identidade grupal forte.'
    },
    theoreticalBasis: 'Senso de pertencimento é necessidade psicológica básica. Crianças com TOD podem ter experiências negativas de grupo; experiências positivas são reparadoras.',
    practicalTips: [
      'Garantir que todos sejam incluídos',
      'Criar identidade grupal positiva',
      'Celebrar conquistas coletivas'
    ]
  },
  {
    id: 3055,
    title: 'Respeito às Diferenças Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver respeito às diferenças através de exploração de diversos estilos e preferências musicais.',
    specificObjectives: [
      'Reconhecer que diferenças são naturais',
      'Apreciar contribuição da diversidade',
      'Tolerar preferências diferentes das próprias',
      'Desenvolver curiosidade em vez de julgamento'
    ],
    description: 'O paciente é exposto a estilos musicais muito diferentes dos seus preferidos e pratica responder com curiosidade em vez de rejeição. A diversidade musical serve como metáfora para diversidade em geral. Pratica-se tolerar e até apreciar diferenças.',
    materials: ['Música de diversos estilos e culturas', 'Materiais sobre culturas musicais', 'Instrumentos diversos'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Ouve músicas diferentes sem rejeição imediata',
      'Identifica aspectos interessantes em estilos diversos',
      'Demonstra curiosidade sobre diferenças',
      'Respeita preferências alheias',
      'Aplica respeito a diferenças em geral'
    ],
    adaptations: {
      level1: 'Diferenças pequenas, foco em aspectos comuns, alta orientação.',
      level2: 'Diferenças maiores, exploração guiada, discussão de reações.',
      level3: 'Diferenças significativas, exploração autônoma, reflexão profunda.'
    },
    theoreticalBasis: 'Exposição à diversidade desenvolve tolerância e reduz rigidez cognitiva, característica frequente no TOD.',
    practicalTips: [
      'Modelar abertura a diferenças',
      'Evitar forçar apreciação',
      'Conectar com respeito a pessoas diferentes'
    ]
  },
  {
    id: 3056,
    title: 'Liderança Positiva Musical',
    disorder: 'TOD',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades de liderança positiva através de oportunidades de liderar atividades musicais.',
    specificObjectives: [
      'Experienciar liderança construtiva',
      'Influenciar outros positivamente',
      'Equilibrar controle e colaboração',
      'Desenvolver responsabilidade social'
    ],
    description: 'O paciente assume papel de líder em atividades musicais - conduzindo banda, ensinando instrumento, organizando apresentação. A experiência de liderança positiva canaliza necessidade de controle para fins construtivos e desenvolve responsabilidade.',
    materials: ['Instrumentos para grupo', 'Estrutura de liderança', 'Feedback estruturado'],
    estimatedTime: '40-50 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Lidera de forma respeitosa',
      'Considera necessidades do grupo',
      'Equilibra direção e colaboração',
      'Aceita feedback sobre liderança',
      'Aplica liderança positiva em outros contextos'
    ],
    adaptations: {
      level1: 'Liderança de tarefas simples, alta estrutura, dupla.',
      level2: 'Liderança de atividades completas, grupo pequeno, feedback.',
      level3: 'Liderança de projetos, grupos maiores, autoanálise.'
    },
    theoreticalBasis: 'Crianças com TOD frequentemente buscam controle de formas negativas. Canalizar essa energia para liderança positiva é terapêutico e desenvolve habilidades.',
    practicalTips: [
      'Preparar bem para liderança',
      'Oferecer feedback construtivo',
      'Celebrar liderança efetiva'
    ]
  },

  // ==================== AUTORREGULAÇÃO (3057-3070) ====================
  {
    id: 3057,
    title: 'Mapa dos Gatilhos Musicais',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Identificar e mapear gatilhos pessoais de raiva e oposição através de representação musical.',
    specificObjectives: [
      'Identificar situações que tipicamente provocam raiva',
      'Representar cada gatilho com um som específico',
      'Reconhecer gatilhos em tempo real',
      'Antecipar e preparar-se para situações gatilho'
    ],
    description: 'O paciente mapeia suas situações-gatilho e cria sons representativos para cada uma. Este mapa musical ajuda na conscientização e reconhecimento de padrões. Quando souber que enfrentará um gatilho, pode preparar-se. O mapa é atualizado ao longo do tratamento.',
    materials: ['Instrumentos variados', 'Mapa visual grande', 'Adesivos/marcadores', 'Gravador'],
    estimatedTime: '40-50 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica pelo menos 5 gatilhos pessoais',
      'Cria sons representativos',
      'Reconhece gatilhos no cotidiano',
      'Usa mapa para preparação',
      'Atualiza mapa com novos insights'
    ],
    adaptations: {
      level1: 'Poucos gatilhos óbvios, alta estrutura, mapa simples.',
      level2: 'Múltiplos gatilhos, sons diferenciados, análise de padrões.',
      level3: 'Mapa complexo, hierarquia de gatilhos, estratégias vinculadas.'
    },
    theoreticalBasis: 'Autoconhecimento de gatilhos é primeiro passo para autorregulação. A representação musical torna o abstrato concreto e memorável.',
    practicalTips: [
      'Atualizar mapa continuamente',
      'Incluir gatilhos de todos os contextos',
      'Vincular a estratégias de coping'
    ]
  },
  {
    id: 3058,
    title: 'Sinais de Alerta Sonoros',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver reconhecimento precoce de escalada emocional através de sinais de alerta representados sonoramente.',
    specificObjectives: [
      'Identificar sinais corporais de escalada',
      'Criar sons de alerta para cada sinal',
      'Reconhecer sinais antes de explosão',
      'Ativar estratégias preventivamente'
    ],
    description: 'O paciente identifica seus sinais precoces de que está escalando (tensão, respiração alterada, pensamentos negativos) e cria sons de alerta para cada um. Pratica-se reconhecer os sinais e "tocar o alarme" antes da explosão, permitindo intervenção precoce.',
    materials: ['Instrumentos de alerta (sino, apito)', 'Diagrama corporal', 'Cartões de sinais', 'Sistema de monitoramento'],
    estimatedTime: '35-45 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica sinais precoces pessoais',
      'Usa sistema de alerta em sessão',
      'Reconhece sinais no cotidiano',
      'Ativa estratégias antes de explosão',
      'Reduz frequência de explosões'
    ],
    adaptations: {
      level1: 'Sinais óbvios, alertas claros, alta frequência de verificação.',
      level2: 'Sinais variados, alertas diferenciados, automonitoramento.',
      level3: 'Sinais sutis, sistema integrado, prevenção consistente.'
    },
    theoreticalBasis: 'Intervenção precoce na escalada é mais efetiva que manejo de crise. Reconhecer sinais prodrômicos é habilidade treinável.',
    practicalTips: [
      'Treinar em momentos calmos',
      'Celebrar cada alerta ativado',
      'Envolver apoio externo'
    ]
  },
  {
    id: 3059,
    title: 'Plano de Escape Musical',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Criar plano de escape para situações de alto risco usando música como estratégia de distanciamento seguro.',
    specificObjectives: [
      'Identificar situações que requerem escape',
      'Desenvolver estratégias de saída segura',
      'Criar playlist ou música para acalmar durante escape',
      'Praticar plano em simulações'
    ],
    description: 'O paciente desenvolve um plano de escape para quando a situação está muito intensa - como sair de forma segura, para onde ir, o que fazer. A música é parte central: uma playlist ou música específica para ouvir durante o escape, ajudando a acalmar e prevenir escalada.',
    materials: ['Dispositivo de música', 'Fones de ouvido', 'Mapa do ambiente', 'Plano escrito'],
    estimatedTime: '40-50 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica quando precisa escapar',
      'Conhece rotas de saída segura',
      'Tem música acessível para usar',
      'Executa plano em simulações',
      'Usa plano em situações reais'
    ],
    adaptations: {
      level1: 'Plano simples, um ambiente, adulto acompanha.',
      level2: 'Planos para múltiplos ambientes, alguma autonomia.',
      level3: 'Plano complexo, autonomia total, múltiplas estratégias.'
    },
    theoreticalBasis: 'Prevenção de resposta através de distanciamento seguro é estratégia válida quando regulação in loco não é possível.',
    practicalTips: [
      'Envolver família e escola no plano',
      'Testar equipamentos regularmente',
      'Revisar e atualizar planos'
    ]
  },
  {
    id: 3060,
    title: 'Âncora Sonora de Calma',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Criar âncora sensorial sonora que ative rapidamente estado de calma através de condicionamento.',
    specificObjectives: [
      'Associar som específico com estado de calma',
      'Praticar ativação da âncora repetidamente',
      'Usar âncora em momentos de estresse',
      'Desenvolver acesso rápido a estado regulado'
    ],
    description: 'Durante estados de calma profunda (após relaxamento), um som específico é introduzido repetidamente. Com prática, o som passa a evocar automaticamente sensação de calma. Esta âncora pode ser ativada em momentos de estresse para acesso rápido a regulação.',
    materials: ['Instrumento ou som para âncora', 'Técnicas de relaxamento', 'Gravação do som', 'Diário de prática'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Alcança estados de calma em sessão',
      'Associa som com calma',
      'Ativa âncora de forma efetiva',
      'Usa âncora em situações de estresse',
      'Relata eficácia do recurso'
    ],
    adaptations: {
      level1: 'Som simples, relaxamento guiado, muitas repetições.',
      level2: 'Som escolhido pelo paciente, relaxamento semi-autônomo.',
      level3: 'Múltiplas âncoras, relaxamento autônomo, uso sofisticado.'
    },
    theoreticalBasis: 'Baseado em condicionamento clássico, âncoras criam atalho neurológico para estados emocionais, permitindo acesso rápido à regulação.',
    practicalTips: [
      'Criar âncora em estado genuinamente calmo',
      'Repetir muitas vezes para fortalecer',
      'Escolher som discreto para uso público'
    ]
  },
  {
    id: 3061,
    title: 'Pausas Musicais Estratégicas',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver habilidade de fazer pausas estratégicas usando a música como marcador e facilitador.',
    specificObjectives: [
      'Reconhecer quando precisa de pausa',
      'Sinalizar necessidade apropriadamente',
      'Usar tempo de pausa efetivamente',
      'Retornar à situação mais regulado'
    ],
    description: 'O paciente aprende a reconhecer quando precisa de pausa antes de explodir. Uma música específica serve como sinal de pausa e acompanha o tempo de intervalo. Pratica-se pedir pausa, usar o tempo efetivamente e retornar.',
    materials: ['Música de pausa', 'Timer musical', 'Espaço de pausa', 'Cartão de sinalização'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Reconhece necessidade de pausa',
      'Sinaliza apropriadamente',
      'Usa pausa para acalmar',
      'Retorna mais regulado',
      'Usa pausas em escola e casa'
    ],
    adaptations: {
      level1: 'Pausas sugeridas pelo adulto, música automática, tempo definido.',
      level2: 'Pausas auto-identificadas, escolha de música, tempo flexível.',
      level3: 'Sistema autônomo, pausas preventivas, múltiplos contextos.'
    },
    theoreticalBasis: 'Pausas estratégicas previnem escalada e permitem que córtex pré-frontal se reconecte, interrompendo sequestro amigdalar.',
    practicalTips: [
      'Ensinar pausa como força, não fraqueza',
      'Criar espaço de pausa em casa e escola',
      'Celebrar uso de pausas'
    ]
  },
  {
    id: 3062,
    title: 'Monitoramento Musical do Humor',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver hábito de automonitoramento do humor através de check-ins musicais regulares.',
    specificObjectives: [
      'Avaliar próprio estado emocional regularmente',
      'Expressar estado através de escolhas musicais',
      'Identificar padrões de humor',
      'Antecipar e preparar-se para estados difíceis'
    ],
    description: 'O paciente faz check-ins regulares de humor usando música: que música representa como está se sentindo? Ao longo do tempo, desenvolve consciência de padrões e aprende a antecipar estados difíceis. O monitoramento é base para autorregulação ativa.',
    materials: ['Dispositivo de música', 'Diário musical de humor', 'Gráficos de padrões', 'Alarmes para check-in'],
    estimatedTime: '20-30 minutos por check-in',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Faz check-ins regularmente',
      'Escolhe músicas congruentes com estado',
      'Identifica padrões ao longo do tempo',
      'Usa insights para prevenção',
      'Mantém prática autonomamente'
    ],
    adaptations: {
      level1: 'Check-ins com ajuda, opções limitadas, sem análise de padrões.',
      level2: 'Check-ins semi-autônomos, análise básica de padrões.',
      level3: 'Sistema autônomo, análise sofisticada, intervenções baseadas em dados.'
    },
    theoreticalBasis: 'Automonitoramento é componente central de autorregulação. A música oferece linguagem alternativa para estados internos difíceis de verbalizar.',
    practicalTips: [
      'Estabelecer horários fixos de check-in',
      'Usar aplicativo para registro',
      'Revisar padrões semanalmente'
    ]
  },
  {
    id: 3063,
    title: 'Escala Musical de Intensidade',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver habilidade de graduar intensidade emocional usando escala musical como referência.',
    specificObjectives: [
      'Identificar nível atual de intensidade',
      'Usar escala consistentemente',
      'Reconhecer quando está escalando',
      'Comunicar nível para outros'
    ],
    description: 'O paciente aprende escala de intensidade emocional (0-10) associada a características musicais: 0 = silêncio, 10 = máxima intensidade. Pratica-se identificar o próprio nível e comunicar para outros. A escala torna-se linguagem comum para discussão de estados emocionais.',
    materials: ['Escala visual', 'Exemplos musicais para cada nível', 'Cartões de autoavaliação'],
    estimatedTime: '25-35 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Usa escala corretamente',
      'Avalia próprio nível com precisão',
      'Comunica nível para outros',
      'Reconhece escaladas',
      'Usa escala para orientar ações'
    ],
    adaptations: {
      level1: 'Escala 0-5 com apoio visual, avaliação com ajuda.',
      level2: 'Escala 0-10, autoavaliação, verificação.',
      level3: 'Escala internalizada, uso autônomo, comunicação sofisticada.'
    },
    theoreticalBasis: 'Graduação numérica de estados emocionais facilita metacognição e comunicação, fundamentais para regulação e busca de ajuda.',
    practicalTips: [
      'Usar consistentemente em casa e escola',
      'Criar linguagem comum com família',
      'Conectar níveis a ações apropriadas'
    ]
  },
  {
    id: 3064,
    title: 'Previsão de Consequências Musical',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver pensamento antecipatório sobre consequências de ações através de narrativas musicais.',
    specificObjectives: [
      'Parar antes de agir para pensar',
      'Imaginar consequências possíveis',
      'Escolher ação baseado em consequências previstas',
      'Reduzir comportamentos impulsivos'
    ],
    description: 'Através de histórias musicais, o paciente pratica prever consequências: o que acontece se o personagem fizer X? E se fizer Y? A música ilustra diferentes desfechos. Gradualmente, aplica-se o pensamento a situações pessoais.',
    materials: ['Instrumentos para narrativa', 'Histórias de escolhas', 'Quadro de consequências', 'Cenários pessoais'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Pausa para pensar antes de agir',
      'Gera múltiplas consequências possíveis',
      'Escolhe baseado em previsão',
      'Demonstra redução de impulsividade',
      'Aplica em situações reais'
    ],
    adaptations: {
      level1: 'Histórias simples, duas opções, consequências óbvias.',
      level2: 'Histórias complexas, múltiplas opções, consequências em cadeia.',
      level3: 'Situações pessoais, análise detalhada, planejamento de resposta.'
    },
    theoreticalBasis: 'Pensamento consequencial é componente de funções executivas frequentemente deficitário em TOD. Treino em formato narrativo é mais acessível.',
    practicalTips: [
      'Usar histórias relevantes para o paciente',
      'Explorar consequências sociais',
      'Conectar com situações recentes'
    ]
  },
  {
    id: 3065,
    title: 'Estratégias de Coping Musical',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver repertório diversificado de estratégias de coping acessíveis através da música.',
    specificObjectives: [
      'Aprender múltiplas estratégias de coping',
      'Associar cada estratégia a uma música/som',
      'Identificar qual usar em cada situação',
      'Ter arsenal disponível para diferentes desafios'
    ],
    description: 'O paciente aprende várias estratégias de coping (respiração, distração, buscar ajuda, exercício, etc.) e associa cada uma a uma música ou som específico. O arsenal musical de coping fica disponível para diferentes situações. Pratica-se escolher e usar estratégias apropriadas.',
    materials: ['Playlist de estratégias', 'Cartões de coping', 'Situações para prática', 'Sistema de organização'],
    estimatedTime: '40-50 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Conhece múltiplas estratégias',
      'Associa a músicas específicas',
      'Escolhe apropriadamente para situação',
      'Usa efetivamente',
      'Mantém arsenal atualizado'
    ],
    adaptations: {
      level1: 'Poucas estratégias simples, alta estrutura, escolha guiada.',
      level2: 'Repertório maior, escolha semi-autônoma, análise de eficácia.',
      level3: 'Arsenal completo, escolha autônoma, refinamento contínuo.'
    },
    theoreticalBasis: 'Diversidade de estratégias de coping é protetora, pois diferentes situações exigem diferentes abordagens. A associação musical facilita acesso rápido.',
    practicalTips: [
      'Incluir estratégias de todos os tipos',
      'Testar em situações de baixo risco',
      'Revisar e atualizar regularmente'
    ]
  },
  {
    id: 3066,
    title: 'Autoavaliação Musical Pós-Situação',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver hábito de autoavaliação após situações desafiadoras usando música para processar.',
    specificObjectives: [
      'Refletir sobre comportamento após situação',
      'Identificar o que funcionou e o que não',
      'Planejar diferente para próxima vez',
      'Usar música para processamento emocional'
    ],
    description: 'Após situações difíceis, o paciente usa música para processar: cria ou escolhe música que representa o que aconteceu, como se sentiu, o que faria diferente. A autoavaliação musical é menos ameaçadora que verbal e facilita aprendizagem.',
    materials: ['Instrumentos ou playlist', 'Estrutura de autoavaliação', 'Diário musical', 'Perguntas guia'],
    estimatedTime: '25-35 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reflete após situações difíceis',
      'Identifica aspectos positivos e negativos',
      'Gera alternativas para futuro',
      'Usa música para processar',
      'Demonstra aprendizagem ao longo do tempo'
    ],
    adaptations: {
      level1: 'Avaliação altamente guiada, perguntas simples, foco no positivo.',
      level2: 'Avaliação semi-autônoma, análise equilibrada, planejamento.',
      level3: 'Autoavaliação autônoma, análise profunda, mudança comportamental.'
    },
    theoreticalBasis: 'Reflexão sobre experiência é base para aprendizagem e mudança. O formato musical reduz defensividade e facilita processamento.',
    practicalTips: [
      'Fazer logo após situação quando possível',
      'Manter tom de curiosidade, não julgamento',
      'Celebrar insights e aprendizagens'
    ]
  },
  {
    id: 3067,
    title: 'Ritual de Transição Musical',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Criar rituais musicais para facilitar transições difíceis que tipicamente provocam resistência.',
    specificObjectives: [
      'Identificar transições problemáticas',
      'Criar rituais musicais para cada uma',
      'Praticar rituais até automatização',
      'Reduzir conflitos em transições'
    ],
    description: 'Muitas crianças com TOD têm dificuldade com transições (sair de casa, terminar atividades, etc.). O paciente cria rituais musicais para suas transições mais difíceis - músicas específicas que marcam e facilitam a mudança. A música serve como ponte previsível.',
    materials: ['Playlist de transições', 'Timer musical', 'Cronograma com músicas', 'Rotinas visuais'],
    estimatedTime: '35-45 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica transições difíceis',
      'Cria rituais musicais apropriados',
      'Usa consistentemente',
      'Demonstra melhora em transições',
      'Generaliza para novas transições'
    ],
    adaptations: {
      level1: 'Uma transição, ritual simples, adulto gerencia.',
      level2: 'Múltiplas transições, rituais personalizados, semi-autonomia.',
      level3: 'Sistema completo, criação de novos rituais, autonomia total.'
    },
    theoreticalBasis: 'Rituais reduzem incerteza e exigência de tomada de decisão, facilitando transições que normalmente provocam resistência.',
    practicalTips: [
      'Manter músicas consistentes',
      'Iniciar ritual com antecedência',
      'Envolver família na implementação'
    ]
  },
  {
    id: 3068,
    title: 'Autorregulação Proativa Musical',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver autorregulação proativa através de preparação musical antes de situações desafiadoras.',
    specificObjectives: [
      'Antecipar situações difíceis',
      'Preparar-se mentalmente através da música',
      'Ativar estado regulado antes de desafio',
      'Reduzir reatividade em situações previstas'
    ],
    description: 'Em vez de esperar a crise, o paciente aprende a se preparar musicalmente antes de situações que sabe serem difíceis: ouvir música calmante antes da escola, tocar bateria antes de visita difícil, etc. A regulação proativa previne escaladas.',
    materials: ['Calendário de situações', 'Playlist de preparação', 'Alarmes lembretes', 'Plano de preparação'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Antecipa situações desafiadoras',
      'Prepara-se musicalmente antes',
      'Chega mais regulado em situações',
      'Demonstra melhor performance',
      'Mantém hábito de preparação'
    ],
    adaptations: {
      level1: 'Uma situação recorrente, preparação guiada por adulto.',
      level2: 'Múltiplas situações, preparação semi-autônoma.',
      level3: 'Qualquer situação, preparação totalmente autônoma.'
    },
    theoreticalBasis: 'Regulação proativa é mais efetiva que reativa. Preparar o sistema nervoso antes de desafios melhora performance e reduz risco de explosões.',
    practicalTips: [
      'Identificar situações recorrentes primeiro',
      'Testar diferentes formas de preparação',
      'Criar rotina de preparação'
    ]
  },
  {
    id: 3069,
    title: 'Diário Musical de Progressos',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Documentar progressos em autorregulação através de diário musical que celebra conquistas.',
    specificObjectives: [
      'Registrar momentos de autorregulação bem-sucedida',
      'Celebrar progressos através da música',
      'Manter motivação para continuar esforço',
      'Desenvolver autoeficácia em regulação'
    ],
    description: 'O paciente mantém diário musical de suas conquistas em autorregulação: momentos em que conseguiu se controlar, usar estratégias, evitar explosões. Cada conquista é registrada e pode virar música ou entrada em playlist de vitórias. Foco no positivo fortalece autoeficácia.',
    materials: ['Diário ou aplicativo', 'Playlist de conquistas', 'Sistema de celebração', 'Gráficos de progresso'],
    estimatedTime: '20-30 minutos por registro',
    ageRange: '8-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Registra conquistas regularmente',
      'Reconhece próprios progressos',
      'Usa diário para motivação',
      'Demonstra autoeficácia crescente',
      'Mantém prática de registro'
    ],
    adaptations: {
      level1: 'Registro com ajuda, qualquer conquista conta, alta celebração.',
      level2: 'Registro semi-autônomo, diferenciação de conquistas, análise.',
      level3: 'Registro autônomo, autoavaliação refinada, planejamento.'
    },
    theoreticalBasis: 'Foco em forças e progressos fortalece autoeficácia, que por sua vez facilita futuros esforços de autorregulação.',
    practicalTips: [
      'Baixar critério para o que conta como conquista',
      'Celebrar genuinamente cada registro',
      'Revisar progressos regularmente'
    ]
  },
  {
    id: 3070,
    title: 'Mentor Musical de Autorregulação',
    disorder: 'TOD',
    demandCategory: 'self_regulation',
    generalObjective: 'Consolidar habilidades de autorregulação através de experiência de ensinar outros usando música.',
    specificObjectives: [
      'Dominar estratégias suficientemente para ensinar',
      'Explicar e demonstrar técnicas a outros',
      'Fortalecer própria prática através do ensino',
      'Desenvolver identidade de pessoa que se regula'
    ],
    description: 'O paciente que desenvolveu habilidades de autorregulação tem oportunidade de ensinar outros (irmãos, colegas em grupo). O ato de ensinar fortalece seu próprio domínio e muda sua identidade de "criança descontrolada" para "pessoa que sabe se regular e ajuda outros".',
    materials: ['Materiais de ensino', 'Espaço para ensinar', 'Alunos (outros pacientes, irmãos)', 'Supervisão do terapeuta'],
    estimatedTime: '40-50 minutos',
    ageRange: '10-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Explica estratégias claramente',
      'Demonstra técnicas efetivamente',
      'Adapta ensino ao aluno',
      'Fortalece própria prática',
      'Demonstra mudança de identidade'
    ],
    adaptations: {
      level1: 'Ensinar uma estratégia simples, alta supervisão, aluno fácil.',
      level2: 'Múltiplas estratégias, supervisão moderada, desafios.',
      level3: 'Programa de mentoria, autonomia alta, liderança.'
    },
    theoreticalBasis: 'Ensinar consolida aprendizagem e muda narrativa pessoal. A experiência de mentor promove identidade positiva e responsabilidade social.',
    practicalTips: [
      'Preparar bem antes de ensinar',
      'Escolher primeiro aluno receptivo',
      'Celebrar papel de mentor'
    ]
  },

  // ==================== COGNITIVO (3071-3080) ====================
  {
    id: 3071,
    title: 'Resolução de Problemas Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidades de resolução de problemas através de desafios musicais que exigem pensamento estratégico.',
    specificObjectives: [
      'Identificar problema claramente',
      'Gerar múltiplas soluções possíveis',
      'Avaliar prós e contras',
      'Implementar solução escolhida'
    ],
    description: 'Desafios musicais são apresentados (como tocar uma melodia sem determinada tecla, criar música com limitações) que exigem resolução de problemas. O paciente pratica o processo completo: definir problema, brainstorm de soluções, avaliar, tentar, ajustar. Habilidades transferem-se para problemas da vida.',
    materials: ['Instrumentos variados', 'Cartões de desafio', 'Quadro de resolução', 'Timer'],
    estimatedTime: '35-45 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Define problemas claramente',
      'Gera múltiplas soluções',
      'Avalia opções sistematicamente',
      'Implementa e ajusta',
      'Aplica processo a problemas reais'
    ],
    adaptations: {
      level1: 'Problemas simples, duas opções, alta orientação.',
      level2: 'Problemas moderados, múltiplas soluções, orientação parcial.',
      level3: 'Problemas complexos, processo autônomo, problemas reais.'
    },
    theoreticalBasis: 'Resolução de problemas é habilidade executiva fundamental. Contexto musical reduz ansiedade e aumenta engajamento no processo.',
    practicalTips: [
      'Modelar processo completo',
      'Celebrar o processo, não só soluções',
      'Transferir para problemas cotidianos'
    ]
  },
  {
    id: 3072,
    title: 'Flexibilidade Cognitiva Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver flexibilidade cognitiva através de exercícios musicais que exigem mudança de estratégia.',
    specificObjectives: [
      'Mudar de abordagem quando necessário',
      'Aceitar que primeira ideia nem sempre é melhor',
      'Adaptar-se a mudanças de regras',
      'Considerar alternativas antes de insistir'
    ],
    description: 'Exercícios musicais onde o paciente precisa mudar de estratégia: o ritmo muda e precisa adaptar, o instrumento é trocado e precisa ajustar, a música pede algo diferente do planejado. Pratica-se a flexibilidade em contexto de baixo risco.',
    materials: ['Instrumentos variados', 'Músicas com mudanças', 'Sinais de troca', 'Timer'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Muda de abordagem quando necessário',
      'Não fica preso a primeira ideia',
      'Adapta-se rapidamente a mudanças',
      'Demonstra menos rigidez',
      'Aplica flexibilidade em vida real'
    ],
    adaptations: {
      level1: 'Mudanças pequenas e anunciadas, tempo para adaptar.',
      level2: 'Mudanças maiores, menos aviso, múltiplas adaptações.',
      level3: 'Mudanças frequentes e significativas, adaptação rápida.'
    },
    theoreticalBasis: 'Rigidez cognitiva é característica comum no TOD. Treino de flexibilidade em contexto lúdico desenvolve habilidade transferível.',
    practicalTips: [
      'Começar com flexibilidade em coisas que gosta',
      'Aumentar gradualmente demanda',
      'Celebrar cada adaptação'
    ]
  },
  {
    id: 3073,
    title: 'Cadeia de Consequências Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver pensamento em cadeia de consequências através de narrativas musicais que mostram efeitos em sequência.',
    specificObjectives: [
      'Prever consequências imediatas',
      'Antecipar consequências de segundo e terceiro grau',
      'Conectar ações atuais a resultados futuros',
      'Tomar decisões considerando cadeia completa'
    ],
    description: 'Histórias musicais onde uma ação leva a consequência que leva a outra consequência, em cadeia. O paciente pratica prever não só o efeito imediato, mas os efeitos em cascata. Desenvolve visão de longo prazo que crianças com TOD frequentemente não consideram.',
    materials: ['Instrumentos para narrativa', 'Quadro de consequências em cadeia', 'Histórias estruturadas', 'Fichas de cenário'],
    estimatedTime: '40-50 minutos',
    ageRange: '10-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Prevê consequências imediatas',
      'Antecipa efeitos secundários',
      'Considera consequências a longo prazo',
      'Usa para orientar decisões',
      'Aplica pensamento em situações reais'
    ],
    adaptations: {
      level1: 'Cadeias curtas (2 passos), consequências óbvias.',
      level2: 'Cadeias médias (3-4 passos), algumas surpresas.',
      level3: 'Cadeias longas, consequências sutis, múltiplas ramificações.'
    },
    theoreticalBasis: 'Pensamento consequencial expandido combate a miopia temporal típica da impulsividade, mostrando impactos a longo prazo.',
    practicalTips: [
      'Usar situações relevantes para o paciente',
      'Incluir consequências sociais e emocionais',
      'Conectar com decisões reais pendentes'
    ]
  },
  {
    id: 3074,
    title: 'Múltiplas Perspectivas Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver capacidade de considerar múltiplas perspectivas sobre situações através de exercícios musicais.',
    specificObjectives: [
      'Reconhecer que situações têm múltiplas perspectivas',
      'Imaginar como diferentes pessoas veriam',
      'Considerar perspectivas antes de julgar',
      'Desenvolver pensamento mais flexível e empático'
    ],
    description: 'O paciente representa musicalmente como diferentes pessoas perceberiam a mesma situação: como o professor vê a briga, como a mãe, como o colega, como ele mesmo. O exercício de criar música de múltiplas perspectivas desenvolve descentração cognitiva.',
    materials: ['Instrumentos variados', 'Cenários de perspectiva', 'Cartões de personagens', 'Gravador'],
    estimatedTime: '40-50 minutos',
    ageRange: '10-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Reconhece existência de outras perspectivas',
      'Representa perspectivas musicalmente',
      'Demonstra compreensão genuína do outro',
      'Considera perspectivas em julgamentos',
      'Aplica em conflitos reais'
    ],
    adaptations: {
      level1: 'Duas perspectivas contrastantes, alta orientação.',
      level2: 'Múltiplas perspectivas, nuances, menos orientação.',
      level3: 'Perspectivas sutis e complexas, análise autônoma.'
    },
    theoreticalBasis: 'Capacidade de considerar múltiplas perspectivas é base para empatia e resolução de conflitos, frequentemente deficitária no TOD.',
    practicalTips: [
      'Usar situações reais do paciente',
      'Incluir perspectiva do paciente também',
      'Evitar julgar quem está "certo"'
    ]
  },
  {
    id: 3075,
    title: 'Tomada de Decisão Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidades de tomada de decisão sistemática através de exercícios musicais de escolha.',
    specificObjectives: [
      'Identificar decisões a tomar',
      'Listar opções disponíveis',
      'Avaliar prós e contras de cada',
      'Fazer escolha informada'
    ],
    description: 'Decisões musicais (qual música tocar, que instrumento usar, como arranjar) são usadas para praticar processo de tomada de decisão sistemático. O paciente aprende a não escolher impulsivamente, mas avaliar opções antes de decidir.',
    materials: ['Opções musicais', 'Quadro de decisão', 'Critérios de avaliação', 'Timer'],
    estimatedTime: '30-40 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica decisões claramente',
      'Lista opções antes de escolher',
      'Avalia prós e contras',
      'Faz escolhas informadas',
      'Aplica processo em vida real'
    ],
    adaptations: {
      level1: 'Decisões simples, duas opções, processo guiado.',
      level2: 'Decisões moderadas, múltiplas opções, processo semi-autônomo.',
      level3: 'Decisões complexas, muitas variáveis, processo autônomo.'
    },
    theoreticalBasis: 'Tomada de decisão sistemática combate impulsividade característica do TOD, desenvolvendo função executiva de planejamento.',
    practicalTips: [
      'Modelar processo de decisão',
      'Celebrar o processo, não só resultado',
      'Transferir para decisões cotidianas'
    ]
  },
  {
    id: 3076,
    title: 'Análise de Situação Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidade de analisar situações antes de reagir através de exercícios musicais de análise.',
    specificObjectives: [
      'Parar para analisar antes de reagir',
      'Identificar elementos da situação',
      'Considerar contexto e nuances',
      'Responder baseado em análise'
    ],
    description: 'Situações musicais são apresentadas e o paciente pratica analisar antes de responder: o que está acontecendo? Quem está envolvido? Qual é o contexto? O que realmente está sendo pedido? A prática de análise combate reações automáticas.',
    materials: ['Cenários musicais', 'Perguntas de análise', 'Quadro de situação', 'Timer'],
    estimatedTime: '30-40 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Pausa antes de reagir',
      'Analisa elementos da situação',
      'Considera contexto',
      'Responde de forma ponderada',
      'Aplica análise em situações reais'
    ],
    adaptations: {
      level1: 'Situações simples, perguntas guiadas, tempo amplo.',
      level2: 'Situações moderadas, análise semi-autônoma.',
      level3: 'Situações complexas, análise rápida e autônoma.'
    },
    theoreticalBasis: 'Análise situacional combate reatividade automática, inserindo etapa de processamento entre estímulo e resposta.',
    practicalTips: [
      'Usar situações que tipicamente provocam reação',
      'Criar hábito de perguntas de análise',
      'Celebrar pausas para análise'
    ]
  },
  {
    id: 3077,
    title: 'Geração de Alternativas Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidade de gerar múltiplas alternativas antes de agir através de brainstorm musical.',
    specificObjectives: [
      'Resistir à primeira resposta automática',
      'Gerar múltiplas opções de resposta',
      'Avaliar alternativas geradas',
      'Escolher melhor opção'
    ],
    description: 'Desafios musicais onde o paciente deve gerar múltiplas soluções antes de escolher uma: 5 formas de tocar essa melodia, 3 maneiras de resolver esse problema musical. Pratica-se o brainstorm que combate a impulsividade da primeira resposta.',
    materials: ['Desafios musicais', 'Quadro de alternativas', 'Timer', 'Sistema de avaliação'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Resiste à primeira resposta',
      'Gera múltiplas alternativas',
      'Avalia qualidade das opções',
      'Escolhe baseado em avaliação',
      'Aplica em situações de conflito'
    ],
    adaptations: {
      level1: 'Exigir 2 alternativas, ajuda na geração.',
      level2: 'Exigir 3-4 alternativas, geração mais autônoma.',
      level3: 'Exigir 5+ alternativas, avaliação sofisticada.'
    },
    theoreticalBasis: 'Geração de alternativas combate rigidez e impulsividade, desenvolvendo flexibilidade cognitiva e autocontrole.',
    practicalTips: [
      'Reforçar quantidade primeiro, qualidade depois',
      'Aceitar todas as ideias no brainstorm',
      'Conectar com situações de conflito'
    ]
  },
  {
    id: 3078,
    title: 'Reestruturação Cognitiva Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidade de reestruturar pensamentos distorcidos através de exercícios musicais.',
    specificObjectives: [
      'Identificar pensamentos automáticos negativos',
      'Reconhecer distorções cognitivas',
      'Gerar pensamentos alternativos',
      'Substituir pensamentos disfuncionais'
    ],
    description: 'Pensamentos automáticos negativos são identificados e representados musicalmente. Depois, versões alternativas mais realistas são criadas e também representadas. O contraste musical entre pensamento distorcido e reestruturado torna o processo concreto.',
    materials: ['Instrumentos contrastantes', 'Lista de distorções cognitivas', 'Quadro de reestruturação', 'Gravador'],
    estimatedTime: '40-50 minutos',
    ageRange: '11-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Identifica pensamentos automáticos',
      'Reconhece distorções',
      'Gera alternativas realistas',
      'Representa musicalmente a mudança',
      'Aplica reestruturação no cotidiano'
    ],
    adaptations: {
      level1: 'Distorções óbvias, reestruturação guiada.',
      level2: 'Distorções variadas, reestruturação colaborativa.',
      level3: 'Distorções sutis, reestruturação autônoma.'
    },
    theoreticalBasis: 'Reestruturação cognitiva é técnica central da TCC. O formato musical torna o processo abstrato mais concreto e acessível.',
    practicalTips: [
      'Usar pensamentos reais do paciente',
      'Evitar invalidar sentimentos',
      'Praticar fora da sessão'
    ]
  },
  {
    id: 3079,
    title: 'Planejamento de Resposta Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidade de planejar respostas antecipadamente através de ensaios musicais.',
    specificObjectives: [
      'Antecipar situações desafiadoras',
      'Planejar respostas adequadas',
      'Ensaiar respostas através da música',
      'Executar planos em situações reais'
    ],
    description: 'Situações desafiadoras previsíveis são identificadas e respostas adequadas são planejadas e ensaiadas musicalmente. O paciente pratica o que vai fazer/dizer, representando através da música. O ensaio aumenta probabilidade de execução.',
    materials: ['Cenários previsíveis', 'Planos de resposta', 'Instrumentos para ensaio', 'Checklist de situações'],
    estimatedTime: '35-45 minutos',
    ageRange: '9-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Antecipa situações desafiadoras',
      'Cria planos de resposta',
      'Ensaia musicalmente',
      'Executa planos em situações reais',
      'Refina planos baseado em experiência'
    ],
    adaptations: {
      level1: 'Uma situação, resposta simples, muito ensaio.',
      level2: 'Múltiplas situações, respostas variadas, ensaio moderado.',
      level3: 'Muitas situações, respostas flexíveis, ensaio eficiente.'
    },
    theoreticalBasis: 'Preparação e ensaio aumentam probabilidade de execução de comportamentos desejados, substituindo respostas automáticas.',
    practicalTips: [
      'Usar situações reais iminentes',
      'Ensaiar até fluência',
      'Revisar e ajustar após situação real'
    ]
  },
  {
    id: 3080,
    title: 'Metacognição Musical',
    disorder: 'TOD',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver metacognição (pensar sobre o próprio pensamento) através de reflexão sobre processos musicais.',
    specificObjectives: [
      'Observar próprios processos de pensamento',
      'Identificar padrões de pensamento',
      'Avaliar eficácia de estratégias mentais',
      'Modificar processos cognitivos ineficazes'
    ],
    description: 'O paciente reflete sobre como pensou durante atividades musicais: como decidiu o que tocar? Por que ficou frustrado? Que pensamentos teve? A reflexão sobre processos cognitivos em contexto musical desenvolve metacognição aplicável a outras áreas.',
    materials: ['Perguntas metacognitivas', 'Diário de reflexão', 'Gravações para análise', 'Quadro de processos'],
    estimatedTime: '35-45 minutos',
    ageRange: '11-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Observa próprios pensamentos',
      'Identifica padrões cognitivos',
      'Avalia estratégias usadas',
      'Modifica processos ineficazes',
      'Aplica metacognição amplamente'
    ],
    adaptations: {
      level1: 'Perguntas simples, reflexão guiada, foco em comportamento.',
      level2: 'Reflexão mais profunda, foco em pensamento, padrões básicos.',
      level3: 'Análise sofisticada, modificação de processos, aplicação ampla.'
    },
    theoreticalBasis: 'Metacognição é habilidade executiva de ordem superior que permite monitoramento e modificação de próprios processos cognitivos.',
    practicalTips: [
      'Modelar pensamento em voz alta',
      'Usar perguntas abertas',
      'Celebrar insights metacognitivos'
    ]
  }
];

export default todActivities;
