import { ProfessionalActivity } from './types';

export const teaActivitiesComplete: ProfessionalActivity[] = [
  // ============ COMUNICAÇÃO (15 atividades) ============
  {
    id: 1001,
    title: 'Canção de Escolhas com PECS Musical',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver comunicação funcional através de escolhas musicais com suporte visual',
    specificObjectives: [
      'Utilizar cartões de comunicação para fazer escolhas musicais',
      'Associar imagens a instrumentos e canções',
      'Expandir repertório comunicativo funcional'
    ],
    description: 'O terapeuta apresenta 2-3 cartões PECS representando instrumentos ou canções. O paciente escolhe apontando ou entregando o cartão, e a escolha é imediatamente reforçada com a música/instrumento correspondente. Progressivamente aumenta-se o número de opções e a complexidade das escolhas.',
    materials: ['Cartões PECS musicais', 'Instrumentos variados', 'Quadro de comunicação', 'Músicas preferidas gravadas'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Faz escolhas de forma independente',
      'Associa corretamente cartão ao item',
      'Generaliza uso para novas situações'
    ],
    adaptations: {
      level1: 'Usar apenas 2 opções com objetos concretos junto aos cartões',
      level2: 'Usar 3-4 cartões sem objeto concreto presente',
      level3: 'Usar frase estruturada "Eu quero + instrumento"'
    },
    theoreticalBasis: 'Sistema PECS (Bondy & Frost) combinado com reforçamento musical imediato para comunicação funcional.',
    practicalTips: ['Sempre honrar a escolha feita', 'Manter ritmo rápido para manter engajamento']
  },
  {
    id: 1002,
    title: 'Turnos Musicais Estruturados',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver habilidade de tomada de turnos na comunicação',
    specificObjectives: [
      'Aguardar sua vez de forma regulada',
      'Reconhecer sinais de troca de turno',
      'Manter atenção durante turno do outro'
    ],
    description: 'Atividade de pergunta-resposta musical onde terapeuta canta uma frase e paciente responde. Usa-se suporte visual (bastão de turno) para indicar quem está com a vez. Inicialmente turnos curtos, progressivamente mais longos.',
    materials: ['Bastão de turno colorido', 'Violão ou teclado', 'Timer visual', 'Canções de pergunta-resposta'],
    estimatedTime: '15-25 minutos',
    ageRange: '4-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aguarda turno sem interrupção',
      'Inicia resposta no momento adequado',
      'Mantém atenção no turno do outro'
    ],
    adaptations: {
      level1: 'Turnos de 2-3 segundos com suporte físico total',
      level2: 'Turnos de 5-10 segundos com suporte visual',
      level3: 'Turnos naturais em canção sem suporte visual'
    },
    theoreticalBasis: 'Teoria da Comunicação Aumentativa e Alternativa aplicada à musicoterapia para desenvolvimento pragmático.',
    practicalTips: ['Usar timer visual para previsibilidade', 'Celebrar cada turno bem executado']
  },
  {
    id: 1003,
    title: 'Ecolalia Funcional Cantada',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Transformar ecolalia em comunicação funcional através da música',
    specificObjectives: [
      'Utilizar frases ecolálicas em contexto apropriado',
      'Expandir frases ecolálicas com novos elementos',
      'Generalizar uso funcional para contextos naturais'
    ],
    description: 'Identificar frases ecolálicas preferidas do paciente e criar canções que contextualizem essas frases de forma funcional. Gradualmente modificar melodia e letra para expandir o repertório comunicativo mantendo a estrutura familiar.',
    materials: ['Gravações das frases do paciente', 'Instrumentos melódicos', 'Cartões de contexto', 'Objetos relacionados às frases'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Usa frase em contexto apropriado',
      'Aceita pequenas modificações na frase',
      'Generaliza para outros contextos'
    ],
    adaptations: {
      level1: 'Manter frase exatamente como paciente produz',
      level2: 'Modificar uma palavra mantendo melodia',
      level3: 'Criar variações funcionais da frase original'
    },
    theoreticalBasis: 'Abordagem naturalística de comunicação (Prizant) integrada com ISO musical para aproveitamento de comportamentos existentes.',
    practicalTips: ['Nunca eliminar ecolalia, sempre redirecionar', 'Valorizar qualquer aproximação funcional']
  },
  {
    id: 1004,
    title: 'Scripts Sociais Musicais',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Ensinar scripts sociais através de canções estruturadas',
    specificObjectives: [
      'Memorizar sequências de interação social',
      'Aplicar scripts em role-play musical',
      'Generalizar scripts para situações reais'
    ],
    description: 'Criar canções curtas para situações sociais comuns (cumprimentar, pedir ajuda, agradecer). Praticar com fantoches ou bonecos primeiro, depois em role-play com terapeuta, e finalmente em situações estruturadas reais.',
    materials: ['Fantoches', 'Cenários miniatura', 'Cartões de script', 'Violão', 'Gravador para repetição'],
    estimatedTime: '30-40 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reproduz script com melodia corretamente',
      'Aplica script em situação simulada',
      'Usa script espontaneamente em contexto real'
    ],
    adaptations: {
      level1: 'Script de uma palavra com suporte total',
      level2: 'Script de frase curta com suporte visual',
      level3: 'Script completo com variações situacionais'
    },
    theoreticalBasis: 'Social Stories (Carol Gray) em formato musical para maior retenção e engajamento.',
    practicalTips: ['Usar situações reais do cotidiano do paciente', 'Envolver família na prática']
  },
  {
    id: 1005,
    title: 'Vocalizações Dirigidas com Instrumento',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Estimular produção vocal intencional através de pareamento com instrumentos',
    specificObjectives: [
      'Produzir vocalizações durante atividade musical',
      'Associar vocalizações a ações específicas',
      'Aumentar frequência e variedade de vocalizações'
    ],
    description: 'Parear instrumentos a vocalizações específicas (tambor = "bum", sino = "dim"). Terapeuta modela vocalização ao tocar instrumento. Gradualmente espera vocalização antes de tocar, criando contingência comunicativa.',
    materials: ['Tambor', 'Sino', 'Chocalho', 'Outros instrumentos de percussão', 'Espelho'],
    estimatedTime: '15-25 minutos',
    ageRange: '2-8 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Produz vocalização associada ao instrumento',
      'Vocaliza antecipando o som do instrumento',
      'Varia vocalizações para diferentes instrumentos'
    ],
    adaptations: {
      level1: 'Aceitar qualquer vocalização como resposta',
      level2: 'Esperar vocalização aproximada ao modelo',
      level3: 'Exigir vocalização específica para cada instrumento'
    },
    theoreticalBasis: 'Condicionamento operante com reforçamento musical imediato para desenvolvimento pré-verbal.',
    practicalTips: ['Usar instrumentos favoritos como reforçadores', 'Celebrar todas as tentativas']
  },
  {
    id: 1006,
    title: 'Canção de Nomeação de Objetos',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Expandir vocabulário receptivo e expressivo através de canções de nomeação',
    specificObjectives: [
      'Identificar objetos nomeados na canção',
      'Nomear objetos quando a melodia pausa',
      'Generalizar nomes para contextos não musicais'
    ],
    description: 'Canção estruturada onde terapeuta canta "Onde está o/a [objeto]?" e paciente aponta. Progressão: apontar → nomear com ajuda → nomear independente. Usar categorias (animais, alimentos, brinquedos).',
    materials: ['Objetos ou miniaturas das categorias', 'Cartões de imagem', 'Violão ou teclado', 'Caixa de objetos'],
    estimatedTime: '20-30 minutos',
    ageRange: '2-10 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica objeto correto quando nomeado',
      'Nomeia objeto quando solicitado na canção',
      'Usa nomes espontaneamente fora do contexto musical'
    ],
    adaptations: {
      level1: 'Usar apenas 2-3 objetos de alto interesse',
      level2: 'Usar 5-8 objetos de uma categoria',
      level3: 'Usar múltiplas categorias misturadas'
    },
    theoreticalBasis: 'Treino de tatos e mandos (VB-MAPP) facilitado pela estrutura musical preditiva.',
    practicalTips: ['Começar com objetos de alta preferência', 'Usar objetos reais antes de imagens']
  },
  {
    id: 1007,
    title: 'Canção de Pedidos (Mand Training Musical)',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver habilidade de fazer pedidos funcionais através da música',
    specificObjectives: [
      'Fazer pedidos usando palavras ou aproximações',
      'Usar estrutura "Eu quero..." em contexto musical',
      'Generalizar pedidos para situações cotidianas'
    ],
    description: 'Criar situação de motivação com instrumentos ou brinquedos musicais fora do alcance. Canção estruturada: "O que você quer? Eu quero o/a [item]". Reforçar imediatamente com acesso ao item.',
    materials: ['Instrumentos preferidos', 'Caixa transparente com itens', 'Cartões de comunicação', 'Canção gravada'],
    estimatedTime: '20-30 minutos',
    ageRange: '2-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Faz pedido espontâneo por item desejado',
      'Usa estrutura de frase completa',
      'Mantém contato visual ao fazer pedido'
    ],
    adaptations: {
      level1: 'Aceitar apontar ou aproximação vocal',
      level2: 'Exigir palavra isolada clara',
      level3: 'Exigir frase completa com contato visual'
    },
    theoreticalBasis: 'Análise do Comportamento Verbal (Skinner) com motivação operacional e reforçamento musical.',
    practicalTips: ['Garantir acesso imediato após pedido', 'Variar itens para manter motivação']
  },
  {
    id: 1008,
    title: 'Diálogo Musical Improvisado',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver comunicação recíproca através de improvisação musical',
    specificObjectives: [
      'Responder musicalmente a iniciativas do terapeuta',
      'Iniciar interação musical espontaneamente',
      'Manter diálogo musical por múltiplos turnos'
    ],
    description: 'Terapeuta e paciente em instrumentos de fácil execução. Terapeuta toca frase curta, pausa e espera resposta. Aceita qualquer resposta musical como comunicação válida. Gradualmente desenvolve turnos mais elaborados.',
    materials: ['Xilofone', 'Metalofone', 'Tambores variados', 'Teclado', 'Gravador opcional'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Responde musicalmente dentro de 5 segundos',
      'Inicia interação musical espontaneamente',
      'Mantém diálogo por 4+ turnos'
    ],
    adaptations: {
      level1: 'Aceitar qualquer som como resposta',
      level2: 'Esperar resposta rítmica relacionada',
      level3: 'Desenvolver diálogo com variações temáticas'
    },
    theoreticalBasis: 'Improvisação Clínica (Nordoff-Robbins) para desenvolvimento de comunicação não-verbal.',
    practicalTips: ['Nunca deixar silêncio constrangedor', 'Espelhar e expandir respostas do paciente']
  },
  {
    id: 1009,
    title: 'Canção de Emoções e Expressões',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver vocabulário emocional através de canções expressivas',
    specificObjectives: [
      'Identificar emoções nas expressões faciais',
      'Nomear emoções básicas',
      'Associar emoções a situações e músicas'
    ],
    description: 'Canção que apresenta emoções com expressões faciais correspondentes, sons e situações. "Quando estou feliz, eu faço assim [expressão + som alegre]". Usar espelho para prática de expressões.',
    materials: ['Espelho grande', 'Cartões de emoções', 'Fotografias de expressões', 'Violão', 'Playlist de músicas por emoção'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica emoção básica corretamente',
      'Reproduz expressão facial correspondente',
      'Associa situação à emoção apropriada'
    ],
    adaptations: {
      level1: 'Apenas 2 emoções contrastantes (feliz/triste)',
      level2: '4 emoções básicas',
      level3: 'Emoções complexas e nuances'
    },
    theoreticalBasis: 'Ensino estruturado de reconhecimento emocional (Howlin) com suporte musical para engajamento.',
    practicalTips: ['Usar expressões exageradas inicialmente', 'Relacionar a experiências do paciente']
  },
  {
    id: 1010,
    title: 'Narrativa Musical Sequencial',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver habilidades narrativas através de histórias musicais',
    specificObjectives: [
      'Compreender sequência de eventos em história',
      'Recontar história usando suporte musical',
      'Criar elementos narrativos simples'
    ],
    description: 'Contar história curta com canção, usando imagens sequenciais. Cada parte da história tem melodia específica. Paciente ordena imagens e ajuda a contar/cantar a história.',
    materials: ['Livro ilustrado', 'Cartões de sequência', 'Flanelógrafo', 'Instrumentos para efeitos sonoros', 'Violão'],
    estimatedTime: '30-40 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Ordena sequência corretamente',
      'Reconta história com suporte',
      'Adiciona elementos próprios à narrativa'
    ],
    adaptations: {
      level1: 'Sequência de 3 imagens com história familiar',
      level2: 'Sequência de 5 imagens com história nova',
      level3: 'Criar história original com suporte musical'
    },
    theoreticalBasis: 'Desenvolvimento narrativo (Bruner) facilitado pela estrutura temporal da música.',
    practicalTips: ['Usar histórias de interesse do paciente', 'Permitir recontar de forma não-linear inicialmente']
  },
  {
    id: 1011,
    title: 'Comunicação com Prancha CORE Musical',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Ensinar uso de vocabulário CORE através de atividades musicais',
    specificObjectives: [
      'Usar palavras CORE (eu, quero, mais, acabou) em contexto musical',
      'Combinar símbolos CORE para comunicação',
      'Generalizar uso de CORE para outras situações'
    ],
    description: 'Integrar prancha de comunicação CORE em todas as atividades musicais. Modelar uso consistente: "EU quero MAIS tambor", "ACABOU a música". Criar canções usando apenas vocabulário CORE.',
    materials: ['Prancha CORE adaptada', 'Símbolos AAC', 'Instrumentos variados', 'Canções compostas com CORE'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Usa símbolo CORE apropriado com modelo',
      'Combina 2+ símbolos CORE',
      'Usa CORE espontaneamente na sessão'
    ],
    adaptations: {
      level1: 'Apenas "mais" e "acabou"',
      level2: 'Adicionar "eu quero" e "não"',
      level3: 'Vocabulário CORE expandido com combinações'
    },
    theoreticalBasis: 'Comunicação Aumentativa Alternativa CORE vocabulary approach (Hill & Romski).',
    practicalTips: ['Usar mesma prancha em casa e escola', 'Sempre modelar antes de esperar uso']
  },
  {
    id: 1012,
    title: 'Chamado e Resposta Vocal',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver atenção e resposta ao nome e chamados',
    specificObjectives: [
      'Responder ao próprio nome olhando para quem chama',
      'Responder a chamados com vocalizações',
      'Iniciar chamados dirigidos a outros'
    ],
    description: 'Canção que incorpora nome do paciente em refrão. Cada vez que nome é cantado, espera-se resposta (olhar, vocalização, gesto). Expandir para chamar terapeuta, familiares, colegas.',
    materials: ['Violão ou teclado', 'Fotos de pessoas significativas', 'Fantoches com nomes', 'Gravação com nome do paciente'],
    estimatedTime: '15-25 minutos',
    ageRange: '2-10 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Olha quando nome é cantado',
      'Vocaliza em resposta ao nome',
      'Chama outro pelo nome com intenção'
    ],
    adaptations: {
      level1: 'Aceitar qualquer orientação como resposta',
      level2: 'Esperar olhar + vocalização',
      level3: 'Esperar resposta verbal "eu" ou "aqui"'
    },
    theoreticalBasis: 'Atenção compartilhada e resposta ao nome como marcos do desenvolvimento social.',
    practicalTips: ['Usar tom animado e previsível', 'Reforçar toda resposta mesmo que parcial']
  },
  {
    id: 1013,
    title: 'Expansão de Frases em Canção',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Expandir extensão média de enunciados através de canções estruturadas',
    specificObjectives: [
      'Aumentar número de palavras por enunciado',
      'Usar estruturas gramaticais mais complexas',
      'Generalizar frases expandidas para fala'
    ],
    description: 'Usar técnica de cloze musical (completar lacunas) com frases progressivamente mais longas. "Eu quero o tambor [grande]", "Eu quero o tambor [grande e azul]".',
    materials: ['Cartões de palavras', 'Objetos com atributos variados', 'Violão', 'Quadro de construção de frases'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Produz enunciados com +1 palavra da baseline',
      'Usa adjetivos e advérbios em frases',
      'Mantém expansão em contexto não-musical'
    ],
    adaptations: {
      level1: 'Expandir de 1 para 2 palavras',
      level2: 'Expandir de 2 para 3-4 palavras',
      level3: 'Usar frases complexas com conjunções'
    },
    theoreticalBasis: 'Técnicas de expansão linguística (MacDonald) com suporte melódico para memória.',
    practicalTips: ['Nunca corrigir, apenas expandir', 'Usar melodia como apoio prosódico']
  },
  {
    id: 1014,
    title: 'Comentários Musicais Espontâneos',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver habilidade de fazer comentários espontâneos',
    specificObjectives: [
      'Comentar sobre eventos musicais observados',
      'Compartilhar informações não solicitadas',
      'Fazer comentários relevantes ao contexto'
    ],
    description: 'Criar situações musicais surpreendentes ou interessantes que motivem comentários (instrumento novo, som diferente, "erro" intencional). Modelar e reforçar comentários espontâneos.',
    materials: ['Instrumentos novos e interessantes', 'Objetos surpresa', 'Gravações de sons inusitados', 'Caixa surpresa'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-14 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Faz comentário espontâneo sobre novidade',
      'Comentários são relevantes ao contexto',
      'Frequência de comentários aumenta ao longo das sessões'
    ],
    adaptations: {
      level1: 'Aceitar vocalizações ou gestos como comentário',
      level2: 'Esperar palavra ou frase curta',
      level3: 'Desenvolver comentários elaborados'
    },
    theoreticalBasis: 'Ensino de tactos (Skinner) e desenvolvimento de linguagem espontânea.',
    practicalTips: ['Criar situações naturalmente motivadoras', 'Evitar perguntas diretas que limitam espontaneidade']
  },
  {
    id: 1015,
    title: 'Conversação Musical Estruturada',
    disorder: 'TEA',
    demandCategory: 'communication',
    generalObjective: 'Desenvolver habilidades conversacionais através de estrutura musical',
    specificObjectives: [
      'Manter tópico de conversa por múltiplos turnos',
      'Fazer perguntas relevantes ao tópico',
      'Responder perguntas de forma contingente'
    ],
    description: 'Canção com estrutura de entrevista/conversa: "Você gosta de [tema]? Qual é seu favorito? Por quê?". Usar instrumentos como sinalizadores de turno. Gravar e ouvir para feedback.',
    materials: ['Microfone (real ou de brinquedo)', 'Gravador', 'Cartões de tópicos', 'Bastão de fala', 'Instrumentos sinalizadores'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Mantém tópico por 3+ turnos',
      'Faz perguntas relevantes',
      'Responde contingente ao que foi dito'
    ],
    adaptations: {
      level1: 'Conversação de 2 turnos com suporte total',
      level2: 'Conversação de 4 turnos com suporte visual',
      level3: 'Conversação natural com manutenção de tópico'
    },
    theoreticalBasis: 'Pragmática da comunicação (Prutting) com suporte musical para estrutura e previsibilidade.',
    practicalTips: ['Usar temas de interesse intenso do paciente', 'Aceitar tangentes inicialmente']
  },

  // ============ SENSORIAL (12 atividades) ============
  {
    id: 1016,
    title: 'Exploração Sensorial de Instrumentos',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Promover exploração sensorial controlada através de instrumentos musicais',
    specificObjectives: [
      'Explorar diferentes texturas de instrumentos',
      'Tolerar variedade de estímulos táteis',
      'Regular resposta a estímulos sensoriais'
    ],
    description: 'Apresentar instrumentos com texturas variadas (tambor com pele, chocalho de madeira, pandeiro com metal). Permitir exploração livre inicialmente, depois guiar para tocar de formas diferentes.',
    materials: ['Instrumentos com texturas variadas', 'Luvas sensoriais', 'Tapete sensorial', 'Timer visual'],
    estimatedTime: '20-30 minutos',
    ageRange: '2-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Toca instrumentos de diferentes texturas',
      'Aumenta tempo de tolerância a texturas novas',
      'Explora voluntariamente novas texturas'
    ],
    adaptations: {
      level1: 'Apenas texturas preferidas, exploração livre',
      level2: 'Introduzir texturas neutras gradualmente',
      level3: 'Tocar sequência de texturas variadas'
    },
    theoreticalBasis: 'Integração Sensorial (Ayres) aplicada à musicoterapia para modulação sensorial.',
    practicalTips: ['Nunca forçar contato', 'Respeitar sinais de sobrecarga']
  },
  {
    id: 1017,
    title: 'Dessensibilização Auditiva Gradual',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Reduzir hipersensibilidade auditiva através de exposição graduada',
    specificObjectives: [
      'Tolerar sons de intensidade progressiva',
      'Permanecer regulado durante exposição sonora',
      'Antecipar e preparar-se para sons'
    ],
    description: 'Começar com sons preferidos em volume baixo. Gradualmente aumentar volume e introduzir sons neutros e depois desafiadores. Usar estratégias de coping (abafadores, respiração).',
    materials: ['Sistema de som com controle preciso', 'Abafadores de ouvido', 'Timer visual', 'Playlist hierarquizada', 'Gráfico de volume'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tolera sons no próximo nível da hierarquia',
      'Usa estratégias de coping quando necessário',
      'Generaliza tolerância para ambiente natural'
    ],
    adaptations: {
      level1: 'Paciente controla volume com suporte',
      level2: 'Terapeuta controla com aviso prévio',
      level3: 'Exposição a sons imprevisíveis'
    },
    theoreticalBasis: 'Dessensibilização sistemática adaptada para hipersensibilidade auditiva no TEA.',
    contraindications: ['Não aplicar em momento de desregulação', 'Interromper ao menor sinal de distress'],
    practicalTips: ['Sempre dar controle ao paciente', 'Criar hierarquia individualizada']
  },
  {
    id: 1018,
    title: 'Banho de Sons Calmante',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Promover regulação sensorial através de experiência auditiva imersiva',
    specificObjectives: [
      'Atingir estado de calma através de sons',
      'Reconhecer sons que promovem regulação',
      'Usar música como estratégia de autorregulação'
    ],
    description: 'Ambiente preparado com luz baixa, posição confortável. Paciente deitado ou sentado enquanto terapeuta toca instrumentos ressonantes ao redor (tigelas tibetanas, sinos, kalimba). Sons contínuos e previsíveis.',
    materials: ['Tigelas tibetanas', 'Sinos', 'Kalimba', 'Almofadas confortáveis', 'Luz regulável', 'Cobertor pesado opcional'],
    estimatedTime: '15-25 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Permanece em estado relaxado por 5+ minutos',
      'Demonstra sinais fisiológicos de calma',
      'Solicita experiência voluntariamente'
    ],
    adaptations: {
      level1: 'Sessão breve de 3-5 minutos',
      level2: 'Sessão de 10-15 minutos',
      level3: 'Sessão completa com transição suave'
    },
    theoreticalBasis: 'Musicoterapia receptiva e teoria polivagal para regulação do sistema nervoso.',
    practicalTips: ['Observar respiração e tensão muscular', 'Permitir saída a qualquer momento']
  },
  {
    id: 1019,
    title: 'Ritmo e Movimento Proprioceptivo',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Fornecer input proprioceptivo através de atividades rítmicas',
    specificObjectives: [
      'Integrar ritmo com movimento corporal',
      'Regular sistema nervoso através de input proprioceptivo',
      'Desenvolver consciência corporal'
    ],
    description: 'Atividades de percussão corporal com pressão (bater palmas fortes, marchar pisando firme). Tambores grandes para bater com força. Movimentos de empurrar e puxar no ritmo.',
    materials: ['Tambor grande (djembê, surdo)', 'Baquetas pesadas', 'Colchonete', 'Corda para puxar', 'Bola pesada'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Engaja em atividade proprioceptiva com prazer',
      'Demonstra regulação após atividade',
      'Busca input proprioceptivo de forma funcional'
    ],
    adaptations: {
      level1: 'Atividades livres com instrumentos pesados',
      level2: 'Sequências rítmicas estruturadas',
      level3: 'Coreografias complexas com variação de força'
    },
    theoreticalBasis: 'Dieta sensorial proprioceptiva (Wilbarger) integrada com ritmo musical.',
    practicalTips: ['Observar sinais de sobrecarga', 'Alternar com atividades calmantes']
  },
  {
    id: 1020,
    title: 'Estimulação Vestibular Musical',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Integrar sistema vestibular com experiência musical',
    specificObjectives: [
      'Tolerar movimento vestibular com suporte musical',
      'Associar movimento a ritmos específicos',
      'Regular resposta vestibular'
    ],
    description: 'Balanço suave em rede ou bola grande sincronizado com música lenta. Movimentos de girar e parar sincronizados com mudanças musicais. Sempre previsível e controlado pelo paciente.',
    materials: ['Rede de balanço', 'Bola grande', 'Cadeira giratória', 'Música com ritmo claro', 'Timer visual'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tolera movimento vestibular suave',
      'Antecipa movimento com mudança musical',
      'Mantém regulação durante e após'
    ],
    adaptations: {
      level1: 'Movimento linear lento apenas',
      level2: 'Adicionar movimento rotacional suave',
      level3: 'Variar velocidade e direção com música'
    },
    theoreticalBasis: 'Integração Sensorial vestibular (Ayres) com suporte musical para previsibilidade.',
    contraindications: ['Pacientes com histórico de convulsões', 'Evitar após alimentação'],
    practicalTips: ['Sempre dar controle ao paciente', 'Observar palidez ou náusea']
  },
  {
    id: 1021,
    title: 'Vibração e Ressonância Corporal',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Promover integração sensorial através de vibração musical',
    specificObjectives: [
      'Experimentar vibração de instrumentos no corpo',
      'Tolerar sensação de vibração em diferentes partes',
      'Usar vibração para autorregulação'
    ],
    description: 'Colocar tambores grandes em contato com corpo enquanto são tocados (nas costas, nos pés). Usar instrumentos de vibração (tuning forks, tigelas). Paciente escolhe onde quer sentir vibração.',
    materials: ['Tambor grande (djembê)', 'Tigelas tibetanas', 'Diapasões', 'Almofadas de vibração', 'Violão para vibração'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Aceita vibração em partes preferidas do corpo',
      'Expande áreas de tolerância a vibração',
      'Busca vibração como estratégia de calma'
    ],
    adaptations: {
      level1: 'Vibração apenas em áreas preferidas',
      level2: 'Expandir para áreas neutras',
      level3: 'Aceitar vibração em todo o corpo'
    },
    theoreticalBasis: 'Estimulação vibratória para integração sensorial e regulação do sistema nervoso.',
    practicalTips: ['Começar por extremidades distais', 'Perguntar preferência do paciente']
  },
  {
    id: 1022,
    title: 'Modulação de Alerta com Música',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Ensinar a usar música para modular nível de alerta',
    specificObjectives: [
      'Reconhecer próprio nível de alerta',
      'Escolher música apropriada para regular',
      'Aplicar estratégia independentemente'
    ],
    description: 'Ensinar conceito de "motor interno" (rápido/lento). Associar músicas a diferentes velocidades do motor. Praticar escolher música para acalmar ou energizar conforme necessidade.',
    materials: ['Playlist variada (calma a energética)', 'Gráfico do motor', 'Cartões de música', 'Reprodutor de música'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica próprio nível de alerta',
      'Escolhe música apropriada para regular',
      'Usa estratégia em contexto natural'
    ],
    adaptations: {
      level1: 'Terapeuta identifica e escolhe música',
      level2: 'Paciente identifica, terapeuta oferece opções',
      level3: 'Paciente identifica e escolhe independentemente'
    },
    theoreticalBasis: 'Alert Program (Williams & Shellenberger) adaptado para musicoterapia.',
    practicalTips: ['Criar playlist pessoal do paciente', 'Envolver família na identificação']
  },
  {
    id: 1023,
    title: 'Exploração de Timbres e Texturas Sonoras',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Expandir tolerância a diferentes qualidades sonoras',
    specificObjectives: [
      'Explorar instrumentos com timbres variados',
      'Desenvolver preferências conscientes',
      'Tolerar timbres menos preferidos'
    ],
    description: 'Apresentar instrumentos categorizados por timbre (metálicos, madeira, pele, sintéticos). Explorar qualidades de cada um. Criar "mapa de preferências" sonoras do paciente.',
    materials: ['Instrumentos de diferentes materiais', 'Cartões de categorias', 'Gráfico de preferências', 'Fones de ouvido para sons eletrônicos'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Explora todos os timbres oferecidos',
      'Comunica preferências claramente',
      'Tolera timbres menos preferidos por curto tempo'
    ],
    adaptations: {
      level1: 'Apenas exploração livre de preferidos',
      level2: 'Incluir timbres neutros sistematicamente',
      level3: 'Trabalhar exposição a timbres evitados'
    },
    theoreticalBasis: 'Processamento auditivo e preferências sensoriais no TEA.',
    practicalTips: ['Respeitar preferências enquanto expande', 'Documentar para planejamento futuro']
  },
  {
    id: 1024,
    title: 'Previsibilidade Sonora e Antecipação',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Desenvolver capacidade de antecipar eventos sonoros para reduzir ansiedade',
    specificObjectives: [
      'Antecipar sons através de pistas visuais',
      'Preparar-se para sons menos preferidos',
      'Reduzir resposta de sobressalto'
    ],
    description: 'Usar sinais visuais (luz, cartão) antes de cada som. Começar com sons preferidos, expandir para neutros. Paciente aprende a prever e se preparar, reduzindo resposta de alarme.',
    materials: ['Cartões de aviso', 'Luz de sinalização', 'Instrumentos variados', 'Timer visual', 'Calendário de sons'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Prepara-se adequadamente após sinal visual',
      'Resposta de sobressalto reduzida',
      'Generaliza para sons do ambiente'
    ],
    adaptations: {
      level1: 'Aviso 5 segundos antes, sons suaves',
      level2: 'Aviso 3 segundos, sons moderados',
      level3: 'Aviso mínimo, sons variados'
    },
    theoreticalBasis: 'Condicionamento clássico para redução de respostas de ansiedade auditiva.',
    practicalTips: ['Nunca surpreender com sons', 'Dar controle de volume ao paciente']
  },
  {
    id: 1025,
    title: 'Silêncio Estruturado e Tolerância',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Desenvolver tolerância ao silêncio e pausas musicais',
    specificObjectives: [
      'Tolerar pausas progressivamente mais longas',
      'Permanecer regulado durante silêncio',
      'Usar silêncio como parte da experiência musical'
    ],
    description: 'Música com pausas previsíveis e progressivamente mais longas. Usar sinal visual para pausas. Ensinar que silêncio é parte da música, não ausência dela.',
    materials: ['Música editada com pausas', 'Timer visual', 'Cartão de pausa', 'Instrumento para finalização', 'Atividade para pausa (respiração)'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tolera pausa de X segundos sem desregular',
      'Antecipa fim da pausa',
      'Aceita silêncio como parte natural'
    ],
    adaptations: {
      level1: 'Pausas de 2-3 segundos, muito previsíveis',
      level2: 'Pausas de 5-10 segundos',
      level3: 'Pausas variáveis, parte natural da música'
    },
    theoreticalBasis: 'Musicoterapia e manejo de ansiedade relacionada à imprevisibilidade.',
    practicalTips: ['Ter atividade de preenchimento de pausa', 'Celebrar tolerância a pausas']
  },
  {
    id: 1026,
    title: 'Input Oral-Motor Musical',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Fornecer estimulação oral-motora através de atividades musicais',
    specificObjectives: [
      'Tolerar atividades de sopro em instrumentos',
      'Desenvolver controle oral-motor',
      'Regular através de input oral'
    ],
    description: 'Usar instrumentos de sopro adaptados (flauta de êmbolo, apito, gaita). Associar sopro a melodias conhecidas. Combinar com vibração labial e vocalizações.',
    materials: ['Flauta de êmbolo', 'Apitos variados', 'Gaita', 'Bolhas de sabão', 'Canudos musicais'],
    estimatedTime: '15-25 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Aceita instrumento na boca',
      'Produz som através de sopro',
      'Usa sopro como estratégia de calma'
    ],
    adaptations: {
      level1: 'Apenas exploração tátil do instrumento',
      level2: 'Sopro sem exigência de melodia',
      level3: 'Melodias simples com instrumento de sopro'
    },
    theoreticalBasis: 'Terapia oral-motora integrada com musicoterapia para regulação sensorial.',
    practicalTips: ['Higienizar instrumentos rigorosamente', 'Respeitar recusa de contato oral']
  },
  {
    id: 1027,
    title: 'Integração Multissensorial Musical',
    disorder: 'TEA',
    demandCategory: 'sensory',
    generalObjective: 'Promover integração de múltiplos canais sensoriais simultaneamente',
    specificObjectives: [
      'Processar estímulos visuais e auditivos simultaneamente',
      'Integrar movimento com som',
      'Tolerar experiência multissensorial'
    ],
    description: 'Combinar luz, cor, movimento e som de forma organizada. Instrumentos com feedback visual (luzes). Movimentos sincronizados com música e estímulos visuais.',
    materials: ['Instrumentos luminosos', 'Projetor de cores', 'Tecidos coloridos', 'Bola de espelhos', 'Sistema de som'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Engaja em atividade multissensorial',
      'Processa múltiplos estímulos sem sobrecarga',
      'Solicita experiência multissensorial'
    ],
    adaptations: {
      level1: 'Apenas 2 sentidos por vez',
      level2: '3 sentidos com intensidade controlada',
      level3: 'Experiência multissensorial completa'
    },
    theoreticalBasis: 'Integração Sensorial (Ayres) e processamento multissensorial no TEA.',
    contraindications: ['Risco de sobrecarga sensorial', 'Histórico de convulsões fotossensíveis'],
    practicalTips: ['Ter "cantinho calmo" disponível', 'Observar sinais de sobrecarga']
  },

  // ============ SOCIOEMOCIONAL (18 atividades) ============
  {
    id: 1028,
    title: 'Atenção Compartilhada com Instrumento',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver atenção compartilhada através de experiência musical conjunta',
    specificObjectives: [
      'Compartilhar foco de atenção em instrumento',
      'Alternar olhar entre objeto e pessoa',
      'Iniciar episódios de atenção compartilhada'
    ],
    description: 'Terapeuta e paciente exploram instrumento interessante juntos. Terapeuta usa estratégias de atenção compartilhada: apontar, olhar referencial, comentários entusiasmados. Reforçar qualquer olhar compartilhado.',
    materials: ['Instrumento novo e interessante', 'Brinquedos musicais', 'Caixa surpresa', 'Espelho opcional'],
    estimatedTime: '20-30 minutos',
    ageRange: '2-10 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Segue apontamento do terapeuta',
      'Alterna olhar objeto-pessoa',
      'Inicia compartilhamento apontando ou mostrando'
    ],
    adaptations: {
      level1: 'Aceitar qualquer olhar para terapeuta',
      level2: 'Esperar alternância de olhar',
      level3: 'Paciente inicia e mantém episódio'
    },
    theoreticalBasis: 'Desenvolvimento de atenção compartilhada (Tomasello) como precursor de comunicação.',
    practicalTips: ['Usar objetos de alto interesse', 'Posicionar-se no nível do paciente']
  },
  {
    id: 1029,
    title: 'Sincronia Interpessoal Musical',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver sincronia com outro através de atividade rítmica conjunta',
    specificObjectives: [
      'Sincronizar ritmo com parceiro musical',
      'Ajustar próprio comportamento ao do outro',
      'Experienciar conexão através de sincronia'
    ],
    description: 'Tocar tambores juntos buscando sincronia. Iniciar com espelhamento (terapeuta segue paciente), depois liderança alternada. Usar música gravada como base quando apropriado.',
    materials: ['Dois tambores iguais', 'Metrônomo', 'Música gravada', 'Baquetas', 'Espelho'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Mantém ritmo sincronizado por 30+ segundos',
      'Ajusta quando perde sincronia',
      'Demonstra prazer em sincronia'
    ],
    adaptations: {
      level1: 'Terapeuta segue completamente o paciente',
      level2: 'Alternância de liderança',
      level3: 'Sincronia mútua espontânea'
    },
    theoreticalBasis: 'Sincronia interpessoal como base de conexão social (Feldman).',
    practicalTips: ['Começar sempre com sucesso', 'Celebrar momentos de sincronia']
  },
  {
    id: 1030,
    title: 'Reconhecimento de Emoções em Música',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver reconhecimento emocional através de características musicais',
    specificObjectives: [
      'Identificar emoção transmitida pela música',
      'Associar características musicais a emoções',
      'Transferir para reconhecimento de emoções em pessoas'
    ],
    description: 'Ouvir trechos musicais que expressam emoções claras. Identificar se é feliz, triste, com raiva, medo. Associar a cartões de expressão facial. Discutir pistas musicais (tempo, tom, volume).',
    materials: ['Playlist emocional', 'Cartões de emoções', 'Gráfico de características musicais', 'Espelho'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica emoção na música corretamente',
      'Explica pistas musicais que indicam emoção',
      'Transfere para contexto não-musical'
    ],
    adaptations: {
      level1: 'Apenas feliz vs triste',
      level2: 'Quatro emoções básicas',
      level3: 'Emoções complexas e nuances'
    },
    theoreticalBasis: 'Ensino explícito de reconhecimento emocional através de música como ferramenta concreta.',
    practicalTips: ['Usar músicas muito contrastantes inicialmente', 'Conectar com experiências do paciente']
  },
  {
    id: 1031,
    title: 'Expressão Emocional Através de Improvisação',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Facilitar expressão de emoções através de criação musical',
    specificObjectives: [
      'Expressar emoções através de música',
      'Associar estados internos a expressão externa',
      'Desenvolver vocabulário emocional experiencial'
    ],
    description: 'Convidar paciente a tocar "como está se sentindo". Aceitar qualquer produção como válida. Refletir verbalmente a emoção percebida. Criar diálogo sobre estados emocionais.',
    materials: ['Instrumentos variados de fácil execução', 'Cartões de emoções', 'Gravador', 'Papel para desenho opcional'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Produz música diferenciada para diferentes emoções',
      'Comunica intenção emocional',
      'Relaciona música produzida a estado interno'
    ],
    adaptations: {
      level1: 'Aceitar qualquer produção como expressão',
      level2: 'Solicitar diferenciação entre emoções',
      level3: 'Discutir detalhes da expressão emocional'
    },
    theoreticalBasis: 'Improvisação clínica para expressão e processamento emocional.',
    practicalTips: ['Nunca julgar a produção', 'Refletir emoção sem interpretar demais']
  },
  {
    id: 1032,
    title: 'Teoria da Mente Musical',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver teoria da mente através de histórias musicais',
    specificObjectives: [
      'Inferir emoções de personagens em canções',
      'Prever comportamentos baseado em estados mentais',
      'Compreender perspectivas diferentes'
    ],
    description: 'Usar canções que contam histórias com personagens. Pausar para perguntar: "O que ele está sentindo? O que ele vai fazer? Por quê?". Discutir motivações e perspectivas diferentes.',
    materials: ['Canções narrativas', 'Fantoches', 'Cenários miniatura', 'Cartões de pensamento/fala', 'Imagens de cenas'],
    estimatedTime: '30-40 minutos',
    ageRange: '5-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Infere estados mentais de personagens',
      'Prevê comportamentos corretamente',
      'Compreende diferentes perspectivas'
    ],
    adaptations: {
      level1: 'Emoções óbvias de um personagem',
      level2: 'Comparar emoções de dois personagens',
      level3: 'Crenças falsas e perspectivas complexas'
    },
    theoreticalBasis: 'Ensino de teoria da mente (Baron-Cohen) através de narrativas musicais.',
    practicalTips: ['Usar situações relevantes para o paciente', 'Aceitar respostas parcialmente corretas']
  },
  {
    id: 1033,
    title: 'Cooperação Musical em Dupla',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades de cooperação através de música em parceria',
    specificObjectives: [
      'Trabalhar junto para objetivo musical comum',
      'Ajustar comportamento ao parceiro',
      'Experimentar prazer em atividade cooperativa'
    ],
    description: 'Atividades que requerem dois participantes: tocar instrumento junto, canção de pergunta-resposta, criar música em dupla. Enfatizar que o resultado depende dos dois.',
    materials: ['Instrumentos para dupla (piano, xilofone grande)', 'Baquetas para dois', 'Canções de dupla', 'Partitura visual para dois'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Participa de atividade cooperativa',
      'Ajusta ao ritmo do parceiro',
      'Demonstra prazer na interação'
    ],
    adaptations: {
      level1: 'Roles paralelos (cada um faz sua parte)',
      level2: 'Roles interdependentes simples',
      level3: 'Cooperação criativa com negociação'
    },
    theoreticalBasis: 'Aprendizagem cooperativa aplicada à musicoterapia para desenvolvimento social.',
    practicalTips: ['Começar com tarefas simples', 'Celebrar sucesso conjunto']
  },
  {
    id: 1034,
    title: 'Música em Grupo Estruturado',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades sociais em contexto de grupo musical',
    specificObjectives: [
      'Participar de atividade musical em grupo',
      'Respeitar espaço e vez de outros',
      'Experimentar pertencimento ao grupo'
    ],
    description: 'Grupo pequeno (3-5 participantes) com atividades estruturadas: canção de abertura, turnos de solo, canção coletiva, despedida. Regras claras e visuais. Cada membro tem papel definido.',
    materials: ['Instrumentos para todos', 'Regras visuais', 'Timer', 'Identificação de papéis', 'Canções de grupo'],
    estimatedTime: '40-50 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Permanece no grupo por tempo determinado',
      'Respeita regras do grupo',
      'Demonstra conexão com outros membros'
    ],
    adaptations: {
      level1: 'Grupo de 2-3, estrutura altamente previsível',
      level2: 'Grupo de 4-5, alguma flexibilidade',
      level3: 'Grupo maior com variabilidade'
    },
    theoreticalBasis: 'Musicoterapia de grupo para desenvolvimento de habilidades sociais.',
    practicalTips: ['Ter apoio individual disponível', 'Preparar transições com antecedência']
  },
  {
    id: 1035,
    title: 'Empatia Musical - Espelhamento Emocional',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver empatia através de espelhamento musical',
    specificObjectives: [
      'Reconhecer estado emocional do outro na música',
      'Espelhar musicalmente o que o outro expressa',
      'Demonstrar resposta empática apropriada'
    ],
    description: 'Terapeuta toca expressando emoção clara. Paciente deve reconhecer e espelhar (tocar de forma similar). Depois inverter: paciente expressa, terapeuta espelha e nomeia a emoção.',
    materials: ['Instrumentos para ambos', 'Cartões de emoções', 'Espelho', 'Gravador para feedback'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Reconhece emoção expressa pelo outro',
      'Espelha adequadamente na música',
      'Demonstra resposta empática verbal ou não-verbal'
    ],
    adaptations: {
      level1: 'Emoções muito contrastantes, modelo explícito',
      level2: 'Emoções variadas, espelhamento guiado',
      level3: 'Espelhamento espontâneo e resposta empática'
    },
    theoreticalBasis: 'Neurônios espelho e desenvolvimento de empatia através de experiência musical compartilhada.',
    practicalTips: ['Modelar espelhamento primeiro', 'Nomear emoções consistentemente']
  },
  {
    id: 1036,
    title: 'Regulação Emocional com Playlist Pessoal',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver autorregulação emocional usando música como ferramenta',
    specificObjectives: [
      'Identificar músicas que ajudam em diferentes estados',
      'Criar playlist pessoal de regulação',
      'Usar playlist independentemente para regular'
    ],
    description: 'Explorar músicas que o paciente associa a diferentes estados emocionais. Criar playlist organizada: "para acalmar", "para animar", "para quando estou triste". Praticar uso em situações simuladas.',
    materials: ['Dispositivo de música', 'Cartões de emoções', 'Formulário de playlist', 'Fones de ouvido'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica músicas reguladoras',
      'Usa playlist apropriada para situação',
      'Generaliza uso para contexto natural'
    ],
    adaptations: {
      level1: 'Terapeuta cria playlist baseado em observação',
      level2: 'Paciente escolhe com orientação',
      level3: 'Paciente cria e gerencia independentemente'
    },
    theoreticalBasis: 'Música como ferramenta de autorregulação emocional (Saarikallio & Erkkilä).',
    practicalTips: ['Envolver família na identificação de músicas', 'Atualizar playlist regularmente']
  },
  {
    id: 1037,
    title: 'Resolução de Conflitos Musical',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Ensinar estratégias de resolução de conflitos através de música',
    specificObjectives: [
      'Identificar problema em situação de conflito',
      'Gerar soluções através de role-play musical',
      'Praticar negociação e compromisso'
    ],
    description: 'Usar canções que apresentam dilemas sociais. Pausar e discutir: "O que aconteceu? Como ele se sente? O que ele pode fazer?". Criar canção de solução. Praticar em role-play.',
    materials: ['Canções de situações sociais', 'Fantoches', 'Cartões de solução', 'Cenários miniatura'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Identifica problema no conflito',
      'Gera pelo menos uma solução apropriada',
      'Pratica solução em role-play'
    ],
    adaptations: {
      level1: 'Conflitos simples, solução fornecida',
      level2: 'Conflitos moderados, escolher entre opções',
      level3: 'Conflitos complexos, gerar soluções próprias'
    },
    theoreticalBasis: 'Treino de habilidades sociais para resolução de problemas (Shure & Spivack).',
    practicalTips: ['Usar situações reais do cotidiano', 'Celebrar tentativas de solução']
  },
  {
    id: 1038,
    title: 'Autoestima Musical - Canção de Qualidades',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Fortalecer autoestima através de canções de afirmação',
    specificObjectives: [
      'Identificar próprias qualidades positivas',
      'Expressar orgulho de conquistas',
      'Desenvolver autoconceito positivo'
    ],
    description: 'Criar canção personalizada destacando qualidades, habilidades e conquistas do paciente. Gravar e ouvir repetidamente. Adicionar novas conquistas ao longo do tempo.',
    materials: ['Instrumento harmônico', 'Gravador', 'Lista de qualidades', 'Fotos de conquistas', 'Caderno de conquistas'],
    estimatedTime: '30-40 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Nomeia próprias qualidades',
      'Demonstra orgulho ao ouvir canção',
      'Refere-se a qualidades em outros contextos'
    ],
    adaptations: {
      level1: 'Terapeuta cria canção baseado em observação',
      level2: 'Paciente contribui com ideias',
      level3: 'Paciente cria canção própria'
    },
    theoreticalBasis: 'Psicologia positiva e construção de autoestima através de experiência musical.',
    practicalTips: ['Envolver família para identificar qualidades', 'Atualizar canção com novas conquistas']
  },
  {
    id: 1039,
    title: 'Ansiedade Social - Exposição Musical Gradual',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Reduzir ansiedade social através de exposição gradual em contexto musical',
    specificObjectives: [
      'Participar de atividade musical com outros',
      'Tolerar atenção de outros durante performance',
      'Reduzir evitação de situações sociais'
    ],
    description: 'Hierarquia de exposição: tocar sozinho → com terapeuta → com familiar → pequeno grupo → apresentação. Música como contexto seguro e estruturado para exposição gradual.',
    materials: ['Instrumento preferido do paciente', 'Hierarquia visual', 'Técnicas de relaxamento', 'Reforçadores'],
    estimatedTime: '30-40 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Avança na hierarquia de exposição',
      'Ansiedade reduzida em cada nível',
      'Generaliza para situações sociais naturais'
    ],
    adaptations: {
      level1: 'Níveis mais graduais, muito suporte',
      level2: 'Progressão moderada',
      level3: 'Exposições desafiadoras com independência'
    },
    theoreticalBasis: 'Exposição gradual (TCC) com música como contexto facilitador.',
    contraindications: ['Não forçar além do conforto', 'Monitorar sinais de pânico'],
    practicalTips: ['Sempre ter escape disponível', 'Celebrar cada avanço']
  },
  {
    id: 1040,
    title: 'Flexibilidade Social Musical',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver flexibilidade em interações sociais através de variações musicais',
    specificObjectives: [
      'Aceitar mudanças em rotina musical',
      'Adaptar-se a diferentes parceiros musicais',
      'Tolerar imprevisibilidade social'
    ],
    description: 'Introduzir variações graduais em atividades musicais conhecidas: mudança de instrumento, de música, de parceiro, de local. Preparar com antecedência e celebrar adaptação.',
    materials: ['Instrumentos variados', 'Calendário de mudanças', 'Cartões de aviso', 'Timer visual'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita mudança com preparação',
      'Recupera regulação após mudança',
      'Tolera mudanças com menos preparação ao longo do tempo'
    ],
    adaptations: {
      level1: 'Uma pequena mudança por sessão, muito aviso',
      level2: 'Múltiplas mudanças com aviso moderado',
      level3: 'Mudanças inesperadas toleradas'
    },
    theoreticalBasis: 'Tratamento de rigidez comportamental no TEA através de exposição gradual.',
    practicalTips: ['Sempre validar desconforto com mudança', 'Ter opção de "refúgio" conhecida']
  },
  {
    id: 1041,
    title: 'Habilidades de Amizade Musical',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver habilidades específicas de amizade através de contexto musical',
    specificObjectives: [
      'Iniciar interação musical com par',
      'Compartilhar interesses musicais',
      'Manter interação recíproca'
    ],
    description: 'Em dupla ou pequeno grupo de pares, praticar: convidar para tocar junto, compartilhar músicas favoritas, fazer elogios musicais, planejar atividade musical conjunta.',
    materials: ['Instrumentos para todos', 'Cartões de script social', 'Playlist para compartilhar', 'Planner de atividades'],
    estimatedTime: '35-45 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Inicia interação com par',
      'Compartilha interesse musical apropriadamente',
      'Mantém interação por tempo adequado'
    ],
    adaptations: {
      level1: 'Scripts completos, muito suporte',
      level2: 'Scripts parciais, suporte moderado',
      level3: 'Interação espontânea com suporte mínimo'
    },
    theoreticalBasis: 'Treino de habilidades sociais para amizade (Frankel) em contexto musical.',
    practicalTips: ['Parear com criança neurotípica empática se possível', 'Celebrar qualquer iniciativa']
  },
  {
    id: 1042,
    title: 'Manejo de Frustração com Música',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver tolerância à frustração em contexto musical',
    specificObjectives: [
      'Reconhecer sinais de frustração',
      'Usar estratégias musicais para regular',
      'Continuar tarefa apesar de frustração'
    ],
    description: 'Criar desafios musicais graduais onde frustração é esperada (ritmo difícil, nota errada). Ensinar estratégias: parar e respirar com música calma, tentar de novo, pedir ajuda.',
    materials: ['Instrumentos com níveis de dificuldade', 'Cartões de estratégias', 'Música de calma', 'Termômetro de frustração'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reconhece frustração verbalmente ou com cartão',
      'Usa estratégia de regulação',
      'Retorna à tarefa após regular'
    ],
    adaptations: {
      level1: 'Frustração mínima, muita ajuda',
      level2: 'Frustração moderada, estratégias guiadas',
      level3: 'Frustração significativa, estratégias independentes'
    },
    theoreticalBasis: 'Treino de tolerância à frustração com música como contexto motivador.',
    practicalTips: ['Nunca deixar terminar em frustração', 'Celebrar uso de estratégias']
  },
  {
    id: 1043,
    title: 'Consciência Social em Ensemble',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver consciência do impacto de próprio comportamento em grupo musical',
    specificObjectives: [
      'Perceber efeito de própria música no grupo',
      'Ajustar volume e ritmo ao grupo',
      'Compreender papel individual no coletivo'
    ],
    description: 'Em grupo, explorar como tocar muito alto ou fora do ritmo afeta os outros. Gravar e ouvir diferença entre grupo sincronizado e dessincronizado. Discutir paralelos com vida social.',
    materials: ['Instrumentos para grupo', 'Gravador', 'Gráfico de impacto social', 'Espelho de grupo (vídeo)'],
    estimatedTime: '35-45 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Percebe impacto de próprio comportamento',
      'Ajusta voluntariamente ao grupo',
      'Verbaliza compreensão de impacto social'
    ],
    adaptations: {
      level1: 'Apenas percepção com feedback externo',
      level2: 'Auto-percepção com gravação',
      level3: 'Auto-ajuste espontâneo em tempo real'
    },
    theoreticalBasis: 'Desenvolvimento de autoconsciência social através de experiência musical em grupo.',
    practicalTips: ['Usar feedback visual (vídeo) quando possível', 'Celebrar ajustes ao grupo']
  },
  {
    id: 1044,
    title: 'Ritual de Despedida e Transição',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Facilitar transições e despedidas através de ritual musical',
    specificObjectives: [
      'Participar de ritual de encerramento',
      'Tolerar fim de atividade preferida',
      'Generalizar habilidade de transição'
    ],
    description: 'Criar canção de despedida consistente que marca fim da sessão. Incluir elementos de antecipação positiva (próximo encontro). Expandir ritual para outras transições.',
    materials: ['Canção de despedida', 'Timer visual', 'Calendário visual', 'Objeto transicional se necessário'],
    estimatedTime: '5-10 minutos',
    ageRange: '2-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Participa do ritual de encerramento',
      'Tolera fim da sessão sem desregular',
      'Usa ritual em outras transições'
    ],
    adaptations: {
      level1: 'Ritual longo com muito aviso',
      level2: 'Ritual moderado',
      level3: 'Ritual breve, transição suave'
    },
    theoreticalBasis: 'Musicoterapia para manejo de transições e redução de ansiedade de separação.',
    practicalTips: ['Manter ritual extremamente consistente', 'Incorporar antecipação positiva']
  },
  {
    id: 1045,
    title: 'Aceitação de Ajuda Musical',
    disorder: 'TEA',
    demandCategory: 'socioemotional',
    generalObjective: 'Desenvolver capacidade de aceitar e pedir ajuda em contexto musical',
    specificObjectives: [
      'Aceitar ajuda oferecida',
      'Reconhecer quando precisa de ajuda',
      'Pedir ajuda de forma apropriada'
    ],
    description: 'Criar situações musicais onde ajuda é necessária (instrumento difícil, nota alta). Modelar pedido de ajuda, oferecer ajuda naturalmente. Celebrar aceitação e pedido de ajuda.',
    materials: ['Instrumentos de diferentes dificuldades', 'Cartões de pedido de ajuda', 'Canção de "preciso de ajuda"'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita ajuda quando oferecida',
      'Reconhece quando precisa de ajuda',
      'Pede ajuda usando palavras ou cartão'
    ],
    adaptations: {
      level1: 'Apenas aceitação de ajuda oferecida',
      level2: 'Reconhecer necessidade com suporte',
      level3: 'Pedir ajuda independentemente'
    },
    theoreticalBasis: 'Desenvolvimento de comportamento de busca de ajuda para autonomia.',
    practicalTips: ['Modelar pedido de ajuda do terapeuta', 'Nunca recusar pedido de ajuda']
  },

  // ============ MOTOR (12 atividades) ============
  {
    id: 1046,
    title: 'Coordenação Rítmica Grossa',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver coordenação motora grossa através de movimentos rítmicos',
    specificObjectives: [
      'Sincronizar movimentos amplos com ritmo',
      'Manter padrão motor por tempo determinado',
      'Variar padrões motores conforme música'
    ],
    description: 'Marchar, pular, balançar braços em sincronia com música. Começar com ritmo lento e regular, aumentar complexidade. Usar música de diferentes estilos para variar movimentos.',
    materials: ['Sistema de som', 'Espaço amplo', 'Marcadores de chão', 'Instrumentos de percussão', 'Lenços ou fitas'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Sincroniza movimento com batida',
      'Mantém padrão por 30+ segundos',
      'Muda movimento quando música muda'
    ],
    adaptations: {
      level1: 'Um movimento simples, ritmo lento',
      level2: 'Alternância de movimentos',
      level3: 'Sequências complexas de movimentos'
    },
    theoreticalBasis: 'Rhythmic Auditory Stimulation (RAS) para desenvolvimento motor.',
    practicalTips: ['Usar músicas motivadoras', 'Modelar movimentos claramente']
  },
  {
    id: 1047,
    title: 'Percussão Corporal Sequencial',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver sequenciamento motor através de percussão corporal',
    specificObjectives: [
      'Executar sequências de percussão corporal',
      'Memorizar e reproduzir padrões motores',
      'Criar padrões próprios de percussão'
    ],
    description: 'Ensinar padrões de percussão corporal (palmas, batidas nas pernas, estalar dedos). Começar com 2 movimentos, aumentar para 4-8. Criar "músicas" apenas com corpo.',
    materials: ['Espelho', 'Cartões de sequência visual', 'Metrônomo', 'Vídeos de body percussion'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reproduz sequência de 4+ movimentos',
      'Mantém ritmo constante',
      'Cria padrão próprio de 3+ movimentos'
    ],
    adaptations: {
      level1: 'Sequência de 2 movimentos com modelo contínuo',
      level2: 'Sequência de 4 movimentos com modelo inicial',
      level3: 'Sequências longas e criação própria'
    },
    theoreticalBasis: 'TIMP (Therapeutic Instrumental Music Performance) para sequenciamento motor.',
    practicalTips: ['Usar palavras-chave para cada movimento', 'Filmar para feedback']
  },
  {
    id: 1048,
    title: 'Coordenação Fina com Instrumentos',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver coordenação motora fina através de técnicas instrumentais',
    specificObjectives: [
      'Manipular instrumentos pequenos com precisão',
      'Desenvolver preensão adequada',
      'Executar movimentos finos controlados'
    ],
    description: 'Usar instrumentos que exigem coordenação fina: xilofone com baqueta, piano, flauta, kalimba. Trabalhar precisão gradualmente: tocar qualquer nota → nota específica → sequência.',
    materials: ['Xilofone', 'Metalofone', 'Kalimba', 'Piano/teclado', 'Flauta de êmbolo', 'Baquetas de tamanhos variados'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Segura instrumento/baqueta adequadamente',
      'Toca nota pretendida com precisão',
      'Executa sequência de notas'
    ],
    adaptations: {
      level1: 'Instrumentos grandes, tocar qualquer parte',
      level2: 'Instrumentos médios, tocar área específica',
      level3: 'Precisão em notas específicas, melodias'
    },
    theoreticalBasis: 'TIMP para desenvolvimento de coordenação motora fina.',
    practicalTips: ['Adaptar tamanho de baquetas', 'Usar marcações visuais nas teclas']
  },
  {
    id: 1049,
    title: 'Praxias Orais Musicais',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver praxias orais através de atividades musicais',
    specificObjectives: [
      'Executar movimentos orais intencionais',
      'Sequenciar movimentos para produção de sons',
      'Melhorar controle oral-motor'
    ],
    description: 'Exercícios de praxias integrados com música: soprar em diferentes intensidades, vibrar lábios, mover língua no ritmo. Usar instrumentos de sopro adaptados.',
    materials: ['Flauta de êmbolo', 'Apitos', 'Gaita', 'Bolhas de sabão', 'Espelho', 'Canudos musicais'],
    estimatedTime: '15-25 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Imita movimentos orais',
      'Produz sons com controle oral',
      'Sequencia movimentos para melodia'
    ],
    adaptations: {
      level1: 'Movimentos isolados sem instrumento',
      level2: 'Movimentos com instrumento simples',
      level3: 'Sequências para melodias'
    },
    theoreticalBasis: 'Musicoterapia para desenvolvimento motor oral e fala.',
    practicalTips: ['Usar espelho para feedback visual', 'Tornar exercícios lúdicos']
  },
  {
    id: 1050,
    title: 'Esquema Corporal Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver consciência corporal através de canções e movimentos',
    specificObjectives: [
      'Identificar partes do corpo nomeadas',
      'Executar movimentos em partes específicas',
      'Desenvolver representação corporal integrada'
    ],
    description: 'Canções que nomeiam partes do corpo enquanto movimentam. Tocar instrumento em diferentes partes. Desenhar corpo após atividade musical corporal.',
    materials: ['Canções de corpo', 'Espelho', 'Instrumento de vibração', 'Papel e lápis', 'Boneco articulado'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica partes do corpo nomeadas',
      'Movimenta parte correta quando solicitado',
      'Desenha corpo com principais partes'
    ],
    adaptations: {
      level1: 'Apenas partes grandes (cabeça, braços, pernas)',
      level2: 'Incluir partes menores (dedos, orelhas)',
      level3: 'Partes internas e funções'
    },
    theoreticalBasis: 'Desenvolvimento de esquema corporal através de experiência musical multissensorial.',
    practicalTips: ['Usar espelho grande', 'Relacionar partes do corpo a instrumentos']
  },
  {
    id: 1051,
    title: 'Planejamento Motor Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver planejamento motor através de sequências musicais',
    specificObjectives: [
      'Planejar sequência de ações antes de executar',
      'Executar sequências motoras novas',
      'Adaptar plano motor conforme necessário'
    ],
    description: 'Criar "partituras" visuais simples que indicam sequência de instrumentos ou ações. Paciente deve planejar rota, pegar materiais, executar. Aumentar complexidade gradualmente.',
    materials: ['Partitura visual', 'Instrumentos posicionados em estações', 'Timer', 'Checklist visual'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Planeja sequência antes de iniciar',
      'Executa sequência na ordem correta',
      'Adapta quando encontra obstáculo'
    ],
    adaptations: {
      level1: 'Sequência de 2 passos com guia visual',
      level2: 'Sequência de 4 passos',
      level3: 'Sequências complexas com escolhas'
    },
    theoreticalBasis: 'Praxis e planejamento motor na musicoterapia.',
    practicalTips: ['Verbalizar plano antes de executar', 'Celebrar execução bem-sucedida']
  },
  {
    id: 1052,
    title: 'Imitação Motora Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver habilidades de imitação motora através de música',
    specificObjectives: [
      'Imitar movimentos simples imediatamente',
      'Imitar sequências de movimentos',
      'Imitar com variações criativas'
    ],
    description: 'Jogos de imitação musical: "siga o maestro" com movimentos de regência, espelhar percussão corporal, imitar forma de tocar instrumento. Alternar papéis de modelo e imitador.',
    materials: ['Espelho', 'Instrumentos variados', 'Música de fundo', 'Batuta de maestro', 'Vídeos de movimentos'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Imita movimento único imediatamente',
      'Imita sequência de 3+ movimentos',
      'Assume papel de modelo'
    ],
    adaptations: {
      level1: 'Movimentos únicos, muito tempo de observação',
      level2: 'Sequências curtas',
      level3: 'Sequências longas com variações'
    },
    theoreticalBasis: 'Imitação como fundamento do desenvolvimento motor e social.',
    practicalTips: ['Começar com movimentos que o paciente já faz', 'Usar espelho para feedback']
  },
  {
    id: 1053,
    title: 'Regulação de Força Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver controle de força através de variação dinâmica musical',
    specificObjectives: [
      'Variar força de tocar conforme instrução',
      'Associar dinâmica musical a força motora',
      'Generalizar controle de força'
    ],
    description: 'Tocar instrumentos com variação de força: piano (suave) e forte. Usar gráficos de dinâmica. Associar símbolos musicais a níveis de força. Transferir para atividades funcionais.',
    materials: ['Instrumentos de percussão', 'Gráfico de dinâmica', 'Símbolos p/mp/mf/f/ff', 'Materiais para generalização'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Diferencia piano e forte',
      'Segue 4+ níveis de dinâmica',
      'Aplica controle de força em outros contextos'
    ],
    adaptations: {
      level1: 'Apenas forte vs fraco',
      level2: 'Quatro níveis de dinâmica',
      level3: 'Crescendo e decrescendo graduais'
    },
    theoreticalBasis: 'Controle motor fino e regulação de força através de treino musical.',
    practicalTips: ['Usar feedback visual do som', 'Relacionar a situações cotidianas']
  },
  {
    id: 1054,
    title: 'Bilateral Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver coordenação bilateral através de atividades musicais',
    specificObjectives: [
      'Usar dois lados do corpo simultaneamente',
      'Alternar movimentos entre lados',
      'Executar movimentos assimétricos coordenados'
    ],
    description: 'Tocar tambores com duas mãos, alternando e juntas. Percussão corporal bilateral. Movimentos de dança que cruzam linha média. Piano/xilofone com duas mãos.',
    materials: ['Dois tambores ou bongôs', 'Xilofone grande', 'Claves', 'Música com ritmo claro'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Usa dois lados simultaneamente',
      'Alterna de forma coordenada',
      'Executa padrões assimétricos'
    ],
    adaptations: {
      level1: 'Movimentos simétricos simultâneos',
      level2: 'Alternância simples',
      level3: 'Padrões complexos assimétricos'
    },
    theoreticalBasis: 'Integração bilateral e coordenação interhemisférica.',
    practicalTips: ['Começar com movimentos simétricos', 'Usar cores para diferenciar lados']
  },
  {
    id: 1055,
    title: 'Cruzar Linha Média com Música',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Promover cruzamento de linha média através de movimentos musicais',
    specificObjectives: [
      'Executar movimentos que cruzam linha média',
      'Integrar os dois lados do corpo',
      'Automatizar cruzamento em atividades funcionais'
    ],
    description: 'Tocar instrumentos posicionados no lado oposto. Movimentos de dança que cruzam. Percussão corporal cruzada. "Estátua musical" com poses que cruzam linha média.',
    materials: ['Instrumentos posicionados estrategicamente', 'Fitas coloridas', 'Música de dança', 'Marcadores de chão'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Cruza linha média para alcançar instrumento',
      'Executa movimentos cruzados voluntariamente',
      'Generaliza para atividades cotidianas'
    ],
    adaptations: {
      level1: 'Cruzamento mínimo, muito incentivo',
      level2: 'Cruzamento moderado, coreografias',
      level3: 'Cruzamento amplo, espontâneo'
    },
    theoreticalBasis: 'Desenvolvimento motor e integração interhemisférica.',
    practicalTips: ['Posicionar instrumentos preferidos no lado não dominante', 'Fazer parecer jogo']
  },
  {
    id: 1056,
    title: 'Equilíbrio e Ritmo',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver equilíbrio através de atividades rítmicas',
    specificObjectives: [
      'Manter equilíbrio durante atividade musical',
      'Recuperar equilíbrio com suporte do ritmo',
      'Executar movimentos que desafiam equilíbrio'
    ],
    description: 'Atividades em pé com desafio de equilíbrio: tocar tambor em um pé só, caminhar em linha no ritmo, dança com mudanças de direção. Ritmo fornece previsibilidade e suporte.',
    materials: ['Linha no chão', 'Almofadas de equilíbrio', 'Tambor', 'Música com ritmo claro', 'Espelho'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Mantém equilíbrio por 10+ segundos',
      'Caminha na linha no ritmo',
      'Recupera equilíbrio após perturbação'
    ],
    adaptations: {
      level1: 'Apoio físico disponível, desafio mínimo',
      level2: 'Apoio reduzido, desafio moderado',
      level3: 'Sem apoio, desafios significativos'
    },
    theoreticalBasis: 'Ritmo como suporte para controle postural e equilíbrio.',
    contraindications: ['Avaliar risco de queda', 'Ter superfície segura'],
    practicalTips: ['Sempre ter apoio próximo', 'Tornar lúdico e motivador']
  },
  {
    id: 1057,
    title: 'Velocidade e Tempo de Reação Musical',
    disorder: 'TEA',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver velocidade e tempo de reação através de jogos musicais',
    specificObjectives: [
      'Reagir rapidamente a estímulos musicais',
      'Ajustar velocidade de movimento ao ritmo',
      'Inibir movimento quando música para'
    ],
    description: 'Jogos de "estátua musical" (parar quando música para). Seguir mudanças de ritmo (lento/rápido). Jogos de reação a sons específicos.',
    materials: ['Sistema de som com pause fácil', 'Instrumentos de sinalização', 'Timer', 'Espaço amplo'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Para movimento em 2 segundos quando música para',
      'Ajusta velocidade conforme ritmo',
      'Reage a estímulo sonoro específico'
    ],
    adaptations: {
      level1: 'Aviso antes de parar, tempo de reação maior',
      level2: 'Sem aviso, tempo de reação moderado',
      level3: 'Múltiplos estímulos, reação rápida'
    },
    theoreticalBasis: 'Treino de controle inibitório e velocidade de processamento motor.',
    practicalTips: ['Começar com ritmo lento', 'Celebrar respostas rápidas']
  },

  // ============ COGNITIVO (12 atividades) ============
  {
    id: 1058,
    title: 'Memória de Trabalho Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver memória de trabalho através de tarefas musicais',
    specificObjectives: [
      'Reter informação musical por curto prazo',
      'Manipular informação musical mentalmente',
      'Aumentar capacidade de memória de trabalho'
    ],
    description: 'Repetir sequências rítmicas de complexidade crescente. Tocar padrão, pausar, paciente reproduz. Adicionar elemento a cada tentativa bem-sucedida.',
    materials: ['Tambor', 'Xilofone', 'Gravador', 'Cartões de sequência', 'Metrônomo'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Repete sequência de 3+ elementos',
      'Mantém informação após intervalo de 5s',
      'Manipula sequência (ex: inverter)'
    ],
    adaptations: {
      level1: 'Sequência de 2 elementos, reprodução imediata',
      level2: 'Sequência de 4 elementos, com pausa',
      level3: 'Sequências longas com manipulação'
    },
    theoreticalBasis: 'Treino de memória de trabalho com suporte musical para engajamento.',
    practicalTips: ['Usar ritmos que o paciente gosta', 'Aumentar dificuldade gradualmente']
  },
  {
    id: 1059,
    title: 'Categorização Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidades de categorização através de sons e instrumentos',
    specificObjectives: [
      'Agrupar sons/instrumentos por característica',
      'Identificar critérios de categorização',
      'Criar categorias próprias'
    ],
    description: 'Classificar instrumentos por material (madeira, metal, pele), por som (grave, agudo), por forma de tocar (sopro, percussão, cordas). Discutir por que pertencem à categoria.',
    materials: ['Instrumentos variados', 'Cartões de categoria', 'Caixas organizadoras', 'Sons gravados'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Agrupa corretamente por um critério',
      'Explica critério de agrupamento',
      'Cria categoria própria válida'
    ],
    adaptations: {
      level1: 'Categorias simples, objetos concretos',
      level2: 'Múltiplas categorias, sons gravados',
      level3: 'Categorização flexível, múltiplos critérios'
    },
    theoreticalBasis: 'Desenvolvimento de pensamento categórico com suporte musical concreto.',
    practicalTips: ['Usar instrumentos reais antes de sons gravados', 'Aceitar categorizações criativas válidas']
  },
  {
    id: 1060,
    title: 'Sequenciamento Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver compreensão de sequência e ordem através de música',
    specificObjectives: [
      'Compreender conceito de primeiro/depois/último',
      'Ordenar eventos musicais corretamente',
      'Aplicar sequenciamento a outras áreas'
    ],
    description: 'Canções com sequências claras. Ordenar cartões de história musical. Criar sequência de sons. Relacionar a sequências de rotina diária.',
    materials: ['Canções narrativas', 'Cartões de sequência', 'Instrumentos para "história sonora"', 'Quadro de rotina'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identifica primeiro e último evento',
      'Ordena 4+ eventos corretamente',
      'Aplica conceito a rotina'
    ],
    adaptations: {
      level1: 'Sequência de 2-3 eventos',
      level2: 'Sequência de 4-5 eventos',
      level3: 'Sequências complexas com ramificações'
    },
    theoreticalBasis: 'Desenvolvimento de pensamento sequencial e temporal.',
    practicalTips: ['Usar canções favoritas como base', 'Conectar a rotinas significativas']
  },
  {
    id: 1061,
    title: 'Flexibilidade Cognitiva Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver flexibilidade cognitiva através de variações musicais',
    specificObjectives: [
      'Aceitar mudanças em música conhecida',
      'Alternar entre regras musicais',
      'Adaptar comportamento a novas regras'
    ],
    description: 'Tocar música familiar de forma diferente (mais rápido, mais lento, outro instrumento). Mudar regras de jogo musical (ex: tocar no forte, depois no piano). Aceitar "versões diferentes".',
    materials: ['Músicas conhecidas', 'Instrumentos variados', 'Cartões de regras', 'Timer'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Tolera variação em música conhecida',
      'Muda comportamento com nova regra',
      'Transita entre regras sem dificuldade'
    ],
    adaptations: {
      level1: 'Uma pequena mudança, muito aviso',
      level2: 'Múltiplas mudanças, aviso moderado',
      level3: 'Mudanças frequentes e inesperadas'
    },
    theoreticalBasis: 'Treino de flexibilidade cognitiva para rigidez comportamental no TEA.',
    practicalTips: ['Validar desconforto com mudança', 'Começar com mudanças mínimas']
  },
  {
    id: 1062,
    title: 'Resolução de Problemas Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidades de resolução de problemas em contexto musical',
    specificObjectives: [
      'Identificar problema em situação musical',
      'Gerar soluções possíveis',
      'Implementar e avaliar solução'
    ],
    description: 'Criar "problemas" musicais: instrumento quebrado, falta de material, música não sai certa. Guiar processo: "Qual é o problema? O que podemos fazer? Vamos tentar?".',
    materials: ['Instrumentos', 'Cenários de problema', 'Cartões de solução', 'Materiais de reparo'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Identifica problema corretamente',
      'Gera pelo menos uma solução válida',
      'Implementa solução com sucesso'
    ],
    adaptations: {
      level1: 'Problemas simples, soluções oferecidas',
      level2: 'Problemas moderados, gerar soluções',
      level3: 'Problemas complexos, soluções criativas'
    },
    theoreticalBasis: 'Treino de resolução de problemas adaptado para TEA.',
    practicalTips: ['Celebrar todas as tentativas de solução', 'Nunca dar solução diretamente']
  },
  {
    id: 1063,
    title: 'Atenção Sustentada Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver capacidade de manter atenção em tarefa musical',
    specificObjectives: [
      'Manter atenção por período progressivamente maior',
      'Resistir a distratores durante tarefa',
      'Retornar atenção após distração'
    ],
    description: 'Tarefas musicais de duração crescente. Introduzir distratores gradualmente. Usar músicas de interesse para manter engajamento.',
    materials: ['Timer visual', 'Instrumentos preferidos', 'Sistema de som', 'Registro de tempo', 'Distratores controlados'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Mantém atenção por tempo-alvo',
      'Resiste a distrator',
      'Retorna após perda de atenção'
    ],
    adaptations: {
      level1: 'Tarefas de 2-3 minutos, sem distratores',
      level2: 'Tarefas de 5-10 minutos, distratores leves',
      level3: 'Tarefas longas, ambiente natural'
    },
    theoreticalBasis: 'Treino de atenção sustentada com suporte de interesse musical.',
    practicalTips: ['Usar música de alto interesse', 'Aumentar tempo gradualmente']
  },
  {
    id: 1064,
    title: 'Atenção Seletiva - Discriminação Auditiva',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver atenção seletiva através de discriminação auditiva',
    specificObjectives: [
      'Focar em som específico entre vários',
      'Ignorar sons irrelevantes',
      'Identificar som-alvo em contexto complexo'
    ],
    description: 'Identificar instrumento específico em gravação com vários instrumentos. Responder apenas a som-alvo entre distratores. Aumentar complexidade gradualmente.',
    materials: ['Gravações de múltiplos instrumentos', 'Instrumentos para identificação', 'Sinalização de resposta', 'Fones de ouvido'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identifica instrumento em duo',
      'Identifica instrumento em ensemble',
      'Responde apenas ao som-alvo'
    ],
    adaptations: {
      level1: 'Dois instrumentos muito diferentes',
      level2: 'Múltiplos instrumentos, um bem distinto',
      level3: 'Sons similares, discriminação fina'
    },
    theoreticalBasis: 'Treino de atenção seletiva auditiva para processamento cognitivo.',
    practicalTips: ['Usar instrumentos muito diferentes inicialmente', 'Tornar como jogo de detetive']
  },
  {
    id: 1065,
    title: 'Conceitos Matemáticos Musicais',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver conceitos matemáticos através de elementos musicais',
    specificObjectives: [
      'Compreender conceitos de quantidade em música',
      'Aplicar contagem a elementos musicais',
      'Entender padrões e proporções'
    ],
    description: 'Contar batidas, instrumentos, repetições. Frações musicais (metade da música, 1/4). Padrões de repetição. Relacionar matemática à estrutura musical.',
    materials: ['Instrumentos de percussão', 'Partituras visuais', 'Contadores', 'Gráficos de fração', 'Música gravada'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Conta elementos musicais corretamente',
      'Compreende frações musicais',
      'Identifica padrões de repetição'
    ],
    adaptations: {
      level1: 'Contagem 1-10, conceitos básicos',
      level2: 'Operações simples, padrões',
      level3: 'Frações, proporções, padrões complexos'
    },
    theoreticalBasis: 'Relação entre estrutura musical e pensamento matemático.',
    practicalTips: ['Usar movimento corporal para contagem', 'Fazer concreto antes de abstrato']
  },
  {
    id: 1066,
    title: 'Generalização de Aprendizagens Musicais',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Facilitar generalização de habilidades aprendidas para novos contextos',
    specificObjectives: [
      'Aplicar habilidade musical em novo instrumento',
      'Usar aprendizado musical em contexto não-musical',
      'Reconhecer padrões similares em situações diferentes'
    ],
    description: 'Praticar habilidade com um instrumento, transferir para outro. Usar canção de rotina em casa. Encontrar "ritmo" em atividades cotidianas.',
    materials: ['Múltiplos instrumentos', 'Vídeos de casa/escola', 'Lista de situações de generalização', 'Fotos de contextos diferentes'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Transfere habilidade para novo instrumento',
      'Aplica em contexto fora da sessão',
      'Reconhece padrão em situação diferente'
    ],
    adaptations: {
      level1: 'Generalização para instrumento similar',
      level2: 'Generalização para instrumento diferente',
      level3: 'Generalização para contexto não-musical'
    },
    theoreticalBasis: 'Programação de generalização na ABA aplicada à musicoterapia.',
    practicalTips: ['Planejar generalização desde o início', 'Envolver família e escola']
  },
  {
    id: 1067,
    title: 'Planejamento e Organização Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver habilidades de planejamento e organização através de projetos musicais',
    specificObjectives: [
      'Planejar pequeno projeto musical',
      'Organizar materiais e passos',
      'Executar plano e avaliar resultado'
    ],
    description: 'Criar pequeno "show" ou gravação: escolher músicas, organizar materiais, definir ordem, executar. Usar checklist visual. Avaliar resultado juntos.',
    materials: ['Checklist visual', 'Materiais para projeto', 'Timer', 'Câmera/gravador', 'Quadro de planejamento'],
    estimatedTime: '40-50 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Cria plano antes de executar',
      'Organiza materiais necessários',
      'Segue plano até conclusão'
    ],
    adaptations: {
      level1: 'Projeto de 3 passos, muito suporte',
      level2: 'Projeto de 5 passos, suporte moderado',
      level3: 'Projeto complexo, independente'
    },
    theoreticalBasis: 'Treino de funções executivas através de projeto musical.',
    practicalTips: ['Começar com projetos pequenos e motivadores', 'Celebrar conclusão do projeto']
  },
  {
    id: 1068,
    title: 'Compreensão de Causa e Efeito Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver compreensão de causalidade através de experiências musicais',
    specificObjectives: [
      'Compreender que ação produz resultado musical',
      'Prever resultado de ação musical',
      'Modificar ação para obter resultado diferente'
    ],
    description: 'Explorar relação entre ação e som: tocar forte/fraco, diferentes instrumentos, diferentes formas de tocar. Fazer previsões e testar. Aplicar a outras situações.',
    materials: ['Instrumentos variados', 'Quadro de causa-efeito', 'Cartões de previsão', 'Objetos sonoros diversos'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Demonstra expectativa de resultado',
      'Prevê resultado corretamente',
      'Modifica ação para mudar resultado'
    ],
    adaptations: {
      level1: 'Causa-efeito simples e imediato',
      level2: 'Relações mais sutis',
      level3: 'Causalidade em cadeias'
    },
    theoreticalBasis: 'Desenvolvimento de pensamento causal através de experiência musical concreta.',
    practicalTips: ['Usar instrumentos com feedback claro', 'Verbalizar relação causa-efeito']
  },
  {
    id: 1069,
    title: 'Abstração e Simbolismo Musical',
    disorder: 'TEA',
    demandCategory: 'cognitive',
    generalObjective: 'Desenvolver pensamento abstrato através de simbolismo musical',
    specificObjectives: [
      'Compreender que símbolos representam sons',
      'Criar representações musicais de conceitos',
      'Interpretar música como representação'
    ],
    description: 'Ensinar notação musical básica (símbolos para sons). Criar "histórias sonoras" onde sons representam eventos. Discutir como música pode expressar ideias abstratas.',
    materials: ['Cartões de notação simplificada', 'Instrumentos', 'Materiais para criar símbolos', 'Histórias para sonorizar'],
    estimatedTime: '30-40 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Associa símbolo a som corretamente',
      'Cria representação sonora de conceito',
      'Interpreta música simbolicamente'
    ],
    adaptations: {
      level1: 'Símbolos icônicos (imagem = som)',
      level2: 'Símbolos semi-abstratos',
      level3: 'Notação musical convencional'
    },
    theoreticalBasis: 'Desenvolvimento de representação simbólica através da música.',
    practicalTips: ['Começar com representações concretas', 'Usar interesses do paciente']
  },

  // ============ COMPORTAMENTO (11 atividades) ============
  {
    id: 1070,
    title: 'Transições com Canção de Aviso',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Facilitar transições através de sinais musicais previsíveis',
    specificObjectives: [
      'Responder a canção de aviso de transição',
      'Completar transição sem resistência',
      'Iniciar preparação ao ouvir canção'
    ],
    description: 'Criar canção específica para aviso de transição (5 minutos antes, 2 minutos antes, agora). Usar consistentemente. Ensinar que canção significa mudança chegando.',
    materials: ['Canção de aviso gravada', 'Timer visual', 'Sequência de transição visual', 'Reforçadores para transição'],
    estimatedTime: '10-15 minutos',
    ageRange: '2-15 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Reconhece canção de aviso',
      'Inicia preparação para transição',
      'Completa transição sem meltdown'
    ],
    adaptations: {
      level1: 'Canção muito longa com muito tempo de aviso',
      level2: 'Canção moderada, aviso adequado',
      level3: 'Canção breve, transição fluida'
    },
    theoreticalBasis: 'Uso de pistas musicais para previsibilidade e redução de ansiedade de transição.',
    practicalTips: ['Manter canção sempre igual', 'Usar em casa e escola também']
  },
  {
    id: 1071,
    title: 'Redução de Estereotipias com Música',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Redirecionar comportamentos estereotipados para expressão musical funcional',
    specificObjectives: [
      'Canalizar estereotipia para instrumento',
      'Desenvolver alternativa funcional',
      'Reduzir frequência de estereotipia não-funcional'
    ],
    description: 'Identificar estereotipia (flapping, balanço, vocalização). Encontrar equivalente musical (flapping → agitar chocalho, balanço → tocar no ritmo). Redirecionar gradualmente.',
    materials: ['Instrumentos correspondentes às estereotipias', 'Música rítmica', 'Registro de frequência', 'Reforçadores'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita redirecionamento para instrumento',
      'Usa instrumento espontaneamente como alternativa',
      'Redução mensurável da estereotipia original'
    ],
    adaptations: {
      level1: 'Apenas oferecer alternativa, sem exigência',
      level2: 'Redirecionar gentilmente',
      level3: 'Ensinar auto-redirecionamento'
    },
    theoreticalBasis: 'Redirecionamento funcional de comportamentos estereotipados.',
    contraindications: ['Nunca punir estereotipia', 'Respeitar função reguladora'],
    practicalTips: ['Entender função da estereotipia primeiro', 'Oferecer alternativa, não eliminar']
  },
  {
    id: 1072,
    title: 'Regulação com Música de Rotina',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Criar previsibilidade e regulação através de rotina musical',
    specificObjectives: [
      'Seguir estrutura de sessão previsível',
      'Usar música como marcador de rotina',
      'Generalizar uso de música para rotinas em casa'
    ],
    description: 'Estrutura de sessão consistente com canções específicas: abertura, cada atividade, transições, encerramento. Ensinar que música = segurança e previsibilidade.',
    materials: ['Canções de rotina', 'Quadro de rotina visual', 'Timer', 'Marcadores de atividade'],
    estimatedTime: 'Sessão inteira',
    ageRange: '2-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Antecipa atividade ao ouvir canção',
      'Segue rotina com regulação',
      'Usa músicas de rotina em casa'
    ],
    adaptations: {
      level1: 'Rotina muito rígida, pouca variação',
      level2: 'Rotina com alguma flexibilidade',
      level3: 'Rotina como base, com variações toleradas'
    },
    theoreticalBasis: 'Estrutura TEACCH aplicada à musicoterapia para previsibilidade.',
    practicalTips: ['Manter estrutura por várias sessões antes de variar', 'Enviar músicas para casa']
  },
  {
    id: 1073,
    title: 'Controle de Impulsos Musical',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle inibitório através de jogos musicais',
    specificObjectives: [
      'Esperar sinal para iniciar ação musical',
      'Parar ação quando sinal é dado',
      'Inibir resposta automática'
    ],
    description: 'Jogos de "verde e vermelho" musical: tocar no verde, parar no vermelho. "Estátua musical". Esperar contagem antes de tocar. Aumentar tempo de espera gradualmente.',
    materials: ['Cartões verde/vermelho', 'Instrumentos', 'Timer visual', 'Sistema de som'],
    estimatedTime: '20-30 minutos',
    ageRange: '4-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Espera sinal para iniciar',
      'Para dentro de 3 segundos',
      'Tolera espera de X segundos'
    ],
    adaptations: {
      level1: 'Sinais claros, tempo curto de espera',
      level2: 'Sinais moderados, tempo médio',
      level3: 'Sinais sutis, tempo longo de espera'
    },
    theoreticalBasis: 'Treino de controle inibitório com engajamento musical.',
    practicalTips: ['Celebrar toda tentativa de parar', 'Tornar jogo divertido']
  },
  {
    id: 1074,
    title: 'Tolerância à Espera Musical',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Aumentar tolerância à espera através de atividades musicais',
    specificObjectives: [
      'Esperar por item/atividade desejada',
      'Usar música durante período de espera',
      'Permanecer regulado enquanto espera'
    ],
    description: 'Criar situações de espera breve por instrumento preferido. Usar canção de espera. Aumentar tempo de espera gradualmente. Ensinar que espera termina com recompensa.',
    materials: ['Timer visual com música', 'Canção de espera', 'Instrumentos preferidos', 'Calendário de espera'],
    estimatedTime: '15-25 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Espera tempo-alvo sem desregular',
      'Usa canção/música durante espera',
      'Generaliza para outras situações'
    ],
    adaptations: {
      level1: 'Espera de 10-30 segundos',
      level2: 'Espera de 1-3 minutos',
      level3: 'Espera de 5+ minutos'
    },
    theoreticalBasis: 'Treino de tolerância ao atraso de reforço com suporte musical.',
    practicalTips: ['Sempre cumprir o prometido após espera', 'Aumentar tempo muito gradualmente']
  },
  {
    id: 1075,
    title: 'Seguir Instruções Musicais',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver habilidade de seguir instruções em contexto musical',
    specificObjectives: [
      'Seguir instruções simples de forma imediata',
      'Seguir instruções de múltiplos passos',
      'Generalizar para instruções não-musicais'
    ],
    description: 'Dar instruções musicais simples ("toque o tambor", "pare", "mais forte"). Aumentar complexidade ("toque o tambor três vezes e depois o sino"). Usar reforçamento.',
    materials: ['Instrumentos variados', 'Cartões de instrução', 'Reforçadores', 'Sistema de resposta'],
    estimatedTime: '20-30 minutos',
    ageRange: '3-15 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Segue instrução simples em 3 segundos',
      'Segue instrução de 2+ passos',
      'Segue instruções em outros contextos'
    ],
    adaptations: {
      level1: 'Uma instrução, suporte físico se necessário',
      level2: 'Instruções simples independentes',
      level3: 'Instruções complexas de múltiplos passos'
    },
    theoreticalBasis: 'Ensino de seguir instruções na ABA com contexto musical motivador.',
    practicalTips: ['Dar apenas instruções que pode garantir que serão seguidas', 'Reforçar imediatamente']
  },
  {
    id: 1076,
    title: 'Redução de Comportamentos Desafiadores',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Prevenir e manejar comportamentos desafiadores com estratégias musicais',
    specificObjectives: [
      'Identificar sinais de escalada',
      'Usar música para prevenção e regulação',
      'Desenvolver estratégias de coping musicais'
    ],
    description: 'Identificar gatilhos e sinais de alerta. Criar "playlist de calma" personalizada. Ensinar a pedir música de calma. Usar música contingente a comportamento apropriado.',
    materials: ['Playlist de calma', 'Termômetro emocional', 'Cartão de "preciso de calma"', 'Fones de ouvido'],
    estimatedTime: '25-35 minutos',
    ageRange: '3-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Reconhece sinais de escalada',
      'Usa música para regular',
      'Redução na frequência de comportamentos'
    ],
    adaptations: {
      level1: 'Terapeuta intervém com música',
      level2: 'Paciente sinaliza necessidade',
      level3: 'Paciente se autorregula com música'
    },
    theoreticalBasis: 'Análise funcional e intervenção antecedente com suporte musical.',
    contraindications: ['Não usar música como punição', 'Não retirar música como consequência'],
    practicalTips: ['Ter música sempre disponível', 'Ensinar uso preventivo']
  },
  {
    id: 1077,
    title: 'Comportamento em Grupo Musical',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver comportamentos apropriados em contexto de grupo musical',
    specificObjectives: [
      'Permanecer sentado durante atividade de grupo',
      'Respeitar espaço dos outros',
      'Participar sem interromper'
    ],
    description: 'Grupo com regras claras e visuais. Prática estruturada de comportamentos (sentar, esperar vez, mãos no colo). Reforçamento de comportamento apropriado. Suporte visual constante.',
    materials: ['Regras visuais', 'Marcadores de lugar', 'Sistema de reforço', 'Timer visual', 'Histórias sociais de grupo'],
    estimatedTime: '35-45 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Segue regras do grupo',
      'Permanece no lugar designado',
      'Participa apropriadamente'
    ],
    adaptations: {
      level1: 'Grupo de 2-3, muito suporte',
      level2: 'Grupo de 4-5, suporte moderado',
      level3: 'Grupo maior, suporte mínimo'
    },
    theoreticalBasis: 'Ensino de comportamentos sociais em ambiente estruturado de grupo.',
    practicalTips: ['Ter 1:1 disponível se necessário', 'Preparar com história social antes']
  },
  {
    id: 1078,
    title: 'Finalizações e Encerramentos',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver capacidade de finalizar atividades preferidas',
    specificObjectives: [
      'Aceitar fim de atividade preferida',
      'Participar de ritual de encerramento',
      'Guardar materiais de forma organizada'
    ],
    description: 'Criar ritual consistente de encerramento para cada atividade. Canção de "acabou" específica. Envolver paciente em guardar materiais. Antecipação positiva do próximo encontro.',
    materials: ['Canção de encerramento', 'Caixas organizadoras', 'Timer visual', 'Calendário de sessões'],
    estimatedTime: '10-15 minutos',
    ageRange: '2-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Aceita canção de "acabou"',
      'Ajuda a guardar materiais',
      'Transita para próxima atividade'
    ],
    adaptations: {
      level1: 'Encerramento muito gradual',
      level2: 'Encerramento com aviso moderado',
      level3: 'Encerramento fluido'
    },
    theoreticalBasis: 'Rituais de encerramento para previsibilidade e redução de ansiedade.',
    practicalTips: ['Nunca terminar abruptamente', 'Incluir antecipação positiva']
  },
  {
    id: 1079,
    title: 'Flexibilidade Comportamental Musical',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Aumentar flexibilidade comportamental através de variações musicais',
    specificObjectives: [
      'Aceitar pequenas mudanças em atividade musical',
      'Experimentar novas formas de fazer mesma atividade',
      'Manter regulação durante mudanças'
    ],
    description: 'Introduzir variações graduais em atividades conhecidas: instrumento diferente, música em outro tom, ordem diferente. Preparar com antecedência. Celebrar flexibilidade.',
    materials: ['Múltiplas versões de atividades', 'Cartões de "diferente"', 'Escala de flexibilidade', 'Reforçadores'],
    estimatedTime: '25-35 minutos',
    ageRange: '4-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aceita uma variação com preparação',
      'Experimenta algo novo voluntariamente',
      'Mantém regulação durante mudança'
    ],
    adaptations: {
      level1: 'Variações mínimas, muito aviso',
      level2: 'Variações moderadas, aviso médio',
      level3: 'Variações significativas toleradas'
    },
    theoreticalBasis: 'Tratamento de rigidez comportamental no TEA.',
    practicalTips: ['Validar desconforto', 'Nunca forçar mudança']
  },
  {
    id: 1080,
    title: 'Automonitoramento Musical',
    disorder: 'TEA',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver habilidades de automonitoramento em contexto musical',
    specificObjectives: [
      'Avaliar próprio comportamento/produção musical',
      'Identificar quando precisa de ajuste',
      'Fazer ajustes independentemente'
    ],
    description: 'Gravar e ouvir própria produção musical. Auto-avaliar usando escala visual. Identificar aspectos a melhorar. Tentar novamente com ajustes. Aplicar a automonitoramento comportamental.',
    materials: ['Gravador', 'Escala de auto-avaliação', 'Espelho', 'Checklist visual', 'Gráfico de progresso'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Avalia próprio desempenho com precisão',
      'Identifica aspecto a melhorar',
      'Faz ajuste baseado em auto-avaliação'
    ],
    adaptations: {
      level1: 'Auto-avaliação simples (bom/precisa melhorar)',
      level2: 'Auto-avaliação com escala',
      level3: 'Auto-avaliação detalhada e plano de ajuste'
    },
    theoreticalBasis: 'Estratégias de automonitoramento aplicadas à musicoterapia.',
    practicalTips: ['Começar com aspectos fáceis de avaliar', 'Usar feedback de gravação']
  }
];

export default teaActivitiesComplete;
