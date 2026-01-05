import { ProfessionalActivity } from './types';

export const teaActivities: ProfessionalActivity[] = [
  // ==================== COMUNICAÇÃO (15 atividades) ====================
  {
    id: 1,
    title: "Protocolo PECS Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver comunicação funcional através de trocas de figuras associadas a elementos musicais",
    specificObjectives: [
      "Estabelecer troca comunicativa com figuras de instrumentos",
      "Ampliar vocabulário musical receptivo e expressivo",
      "Generalizar pedidos para diferentes contextos musicais",
      "Desenvolver iniciativa comunicativa espontânea"
    ],
    description: "Esta atividade adapta o Sistema de Comunicação por Troca de Figuras (PECS) para o contexto musicoterapêutico. O terapeuta apresenta cartões com imagens de instrumentos musicais, e a criança aprende a trocar o cartão pelo instrumento desejado. Inicia-se com instrumentos de alta preferência, estabelecendo a associação entre figura e objeto. Progressivamente, expande-se para cartões de ações musicais (tocar, parar, forte, fraco) e emoções. A música funciona como reforçador natural imediato, aumentando a motivação para comunicar. O ambiente deve ser estruturado com os instrumentos visíveis mas inacessíveis, incentivando o pedido. Utiliza-se modelagem física inicialmente, com esvanecimento gradual das ajudas.",
    materials: [
      "Cartões PECS de instrumentos musicais",
      "Pasta de comunicação personalizada",
      "Instrumentos correspondentes aos cartões",
      "Quadro de velcro para organização",
      "Timer visual"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Realiza troca física do cartão pelo instrumento",
      "Discrimina entre 3+ cartões diferentes",
      "Inicia comunicação espontaneamente",
      "Generaliza para novos instrumentos"
    ],
    adaptations: {
      level1: "Usar objetos reais miniatura em vez de figuras, com ajuda física total para troca",
      level2: "Figuras grandes e coloridas, distância curta entre criança e terapeuta",
      level3: "Múltiplos cartões em pasta, frases com sujeito-verbo-objeto"
    },
    contraindications: [
      "Não forçar troca se houver recusa persistente",
      "Evitar sobrecarga de opções inicialmente"
    ],
    practicalTips: [
      "Iniciar com instrumento de maior preferência",
      "Reforçar imediatamente cada tentativa",
      "Manter sessões curtas e motivadoras"
    ],
    theoreticalBasis: "Baseado no PECS (Bondy & Frost, 1994) integrado à Musicoterapia. A música oferece reforço intrínseco e previsibilidade, elementos cruciais para o desenvolvimento comunicativo no TEA. Fundamenta-se na análise comportamental aplicada (ABA) e nos princípios de comunicação aumentativa."
  },
  {
    id: 2,
    title: "Expansão Vocabular Cantada",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Ampliar repertório lexical através de canções temáticas estruturadas",
    specificObjectives: [
      "Aumentar vocabulário receptivo em categorias semânticas",
      "Promover nomeação espontânea de objetos e ações",
      "Desenvolver associação palavra-conceito através da melodia",
      "Facilitar memorização de vocabulário funcional"
    ],
    description: "Utiliza-se canções originais ou adaptadas que apresentam vocabulário novo de forma repetitiva e melódica. Cada canção foca em uma categoria semântica específica (alimentos, animais, ações, cores). A estrutura previsível da música facilita a antecipação e participação. O terapeuta apresenta objetos concretos ou imagens durante a canção, pausando estrategicamente para eliciar respostas. A melodia serve como suporte mnemônico, facilitando a retenção. Utiliza-se técnicas de cloze musical (pausar antes da palavra-alvo) para promover produção verbal. A repetição musical reduz a demanda cognitiva, permitindo foco no vocabulário.",
    materials: [
      "Canções temáticas estruturadas",
      "Objetos concretos das categorias trabalhadas",
      "Figuras/cartões de vocabulário",
      "Instrumentos para acompanhamento",
      "Quadro de flanelógrafo"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-8 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Demonstra compreensão de novas palavras",
      "Produz palavras-alvo com apoio musical",
      "Generaliza vocabulário para contextos não-musicais",
      "Aumenta produção espontânea"
    ],
    adaptations: {
      level1: "Focar em palavras funcionais de alta frequência, usar objetos reais",
      level2: "Categorias expandidas, combinação de palavra + gesto",
      level3: "Frases completas, descrições e narrativas simples"
    },
    practicalTips: [
      "Usar melodias simples e repetitivas",
      "Apresentar no máximo 3-5 palavras novas por sessão",
      "Incluir movimento corporal associado"
    ],
    theoreticalBasis: "Fundamenta-se na Musicoterapia Neurológica (Thaut, 2005), especificamente no uso de MIT adaptada. A memória musical é processada em múltiplas áreas cerebrais, facilitando retenção. Integra princípios de ensino incidental e aprendizagem distribuída."
  },
  {
    id: 3,
    title: "Ecolalia Funcional Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Transformar padrões ecolálicos em comunicação funcional contextualizada",
    specificObjectives: [
      "Redirecionar ecolalia imediata para função comunicativa",
      "Desenvolver uso contextual de frases memorizadas",
      "Criar scripts musicais funcionais",
      "Expandir ecolalia diferida para comunicação espontânea"
    ],
    description: "Esta abordagem reconhece a ecolalia como estratégia comunicativa a ser moldada, não eliminada. Identificam-se os padrões ecolálicos mais frequentes da criança e criam-se contextos musicais onde essas frases tenham função comunicativa. Por exemplo, se a criança repete 'quer mais?', cria-se uma canção onde essa frase é resposta apropriada. Utiliza-se scripts musicais para situações sociais comuns, aproveitando a tendência à memorização. A música estrutura o uso contextual, fornecendo pistas para quando usar cada frase. Progressivamente, modifica-se levemente as frases cantadas para promover flexibilidade linguística.",
    materials: [
      "Registro das ecolalias frequentes",
      "Canções adaptadas incorporando ecolalias",
      "Scripts musicais visuais",
      "Instrumentos de preferência",
      "Gravações para prática"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-10 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Usa frases ecolálicas em contexto apropriado",
      "Demonstra compreensão do significado das frases",
      "Generaliza scripts para situações reais",
      "Modifica frases mantendo função comunicativa"
    ],
    adaptations: {
      level1: "Focar em uma única frase funcional, múltiplas repetições",
      level2: "Repertório de 3-5 scripts para situações frequentes",
      level3: "Flexibilização e criação de variações das frases"
    },
    contraindications: [
      "Não punir ou interromper ecolalia bruscamente"
    ],
    practicalTips: [
      "Valorizar a ecolalia como tentativa comunicativa",
      "Criar contextos naturais para uso das frases",
      "Envolver família no uso dos scripts"
    ],
    theoreticalBasis: "Baseado no Gestalt Language Processing (Blanc, 2012) e abordagem naturalística. Reconhece que muitas crianças com TEA processam linguagem em chunks, e a música oferece estrutura ideal para este processamento. Integra princípios do SCERTS e abordagens desenvolvimentais."
  },
  {
    id: 4,
    title: "Narrativa Musical Sequencial",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver habilidades narrativas através de histórias musicadas estruturadas",
    specificObjectives: [
      "Compreender sequência temporal de eventos",
      "Recontar histórias usando suporte musical",
      "Identificar elementos narrativos básicos",
      "Criar narrativas pessoais simples"
    ],
    description: "Apresentam-se histórias curtas através de canções que enfatizam a sequência temporal (primeiro, depois, então, finalmente). Cada parte da história tem melodia distintiva, facilitando a memorização da estrutura. Utilizam-se recursos visuais sequenciais (cartões, flanelógrafo) sincronizados com a música. A criança é incentivada a participar recontando partes, inicialmente com forte suporte musical que é gradualmente esvanecido. Histórias sociais são especialmente úteis, integrando scripts para situações reais. A previsibilidade musical reduz a ansiedade associada a tarefas narrativas complexas.",
    materials: [
      "Histórias musicadas originais",
      "Cartões de sequência ilustrados",
      "Instrumentos para marcação de eventos",
      "Fantoches ou bonecos",
      "Gravações das histórias"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "4-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Ordena eventos na sequência correta",
      "Reconta história com suporte visual/musical",
      "Identifica personagens e ações principais",
      "Responde perguntas sobre a narrativa"
    ],
    adaptations: {
      level1: "Histórias de 2-3 eventos, objetos concretos representando",
      level2: "Histórias de 4-5 eventos com cartões de sequência",
      level3: "Narrativas complexas, criação de histórias pessoais"
    },
    practicalTips: [
      "Usar temas de interesse da criança",
      "Manter consistência na melodia de cada parte",
      "Incluir elementos de suspense musical"
    ],
    theoreticalBasis: "Fundamenta-se na teoria da mente e desenvolvimento de narrativas (Bruner, 1990). A estrutura musical compensa déficits na coerência central, oferecendo organização temporal explícita. Integra princípios do TEACCH e ensino estruturado."
  },
  {
    id: 5,
    title: "Pedidos Melódicos Funcionais",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Estabelecer comportamento de mando através de frases melódicas funcionais",
    specificObjectives: [
      "Desenvolver pedidos verbais espontâneos",
      "Ampliar variedade de mandos funcionais",
      "Generalizar pedidos para diferentes contextos",
      "Reduzir comportamentos inadequados para obter itens"
    ],
    description: "Cria-se um sistema de frases melódicas curtas para pedidos comuns (quero + item, me ajuda, mais música, acabou). Cada pedido tem melodia distintiva, facilitando memorização e produção. O ambiente é estruturado para criar oportunidades naturais de pedido: instrumentos visíveis mas inacessíveis, pausas estratégicas na música preferida, materiais em recipientes fechados. O terapeuta modela a frase melódica e espera, oferecendo níveis decrescentes de ajuda. O item/ação desejado é fornecido imediatamente após o pedido, funcionando como reforço natural. Registra-se a frequência e espontaneidade dos pedidos.",
    materials: [
      "Cartões visuais de pedidos com melodia",
      "Instrumentos de alta preferência",
      "Recipientes transparentes",
      "Quadro de pedidos",
      "Sistema de registro"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-8 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Produz pedidos melódicos com modelo",
      "Inicia pedidos espontaneamente",
      "Usa variedade de mandos",
      "Generaliza para fora do setting terapêutico"
    ],
    adaptations: {
      level1: "Uma palavra + melodia simples, ajuda física",
      level2: "Frases de 2-3 palavras, modelo verbal",
      level3: "Sentenças completas, pedidos elaborados"
    },
    practicalTips: [
      "Criar motivação genuína para o pedido",
      "Reforçar imediatamente qualquer aproximação",
      "Envolver cuidadores no treino"
    ],
    theoreticalBasis: "Baseado no Verbal Behavior (Skinner, 1957) e ABA aplicada à música. O mando é o operante verbal mais básico e funcional. A melodia adiciona suporte prosódico e reduz demanda de planejamento motor da fala."
  },
  {
    id: 6,
    title: "Scripts Sociais Cantados",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Ensinar roteiros verbais para interações sociais através de canções estruturadas",
    specificObjectives: [
      "Memorizar scripts para situações sociais comuns",
      "Executar trocas conversacionais básicas",
      "Responder apropriadamente a saudações e perguntas",
      "Iniciar interações usando scripts aprendidos"
    ],
    description: "Desenvolvem-se canções que incorporam scripts para situações sociais específicas: cumprimentos, despedidas, apresentação pessoal, pedido de ajuda, expressão de necessidades. Cada script tem melodia memorável e é praticado em contexto simulado durante a sessão. Utiliza-se role-play com fantoches ou com o terapeuta representando diferentes interlocutores. A música fornece estrutura e reduz imprevisibilidade das interações sociais. Gradualmente, a melodia é esvanecida mantendo a estrutura verbal. Scripts são selecionados com base nas necessidades comunicativas prioritárias da criança.",
    materials: [
      "Canções de scripts sociais",
      "Fantoches para role-play",
      "Cartões visuais de situações",
      "Espelho para prática",
      "Vídeos de modelagem"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Executa script com apoio musical",
      "Mantém script sem melodia",
      "Adapta script para diferentes pessoas",
      "Usa scripts em situações reais"
    ],
    adaptations: {
      level1: "Scripts de uma frase, prática intensiva de um script",
      level2: "Diálogos de 2-3 turnos, variação de interlocutores",
      level3: "Conversações estendidas, flexibilização dos scripts"
    },
    practicalTips: [
      "Começar por situações de alta frequência",
      "Praticar com diferentes pessoas",
      "Celebrar uso espontâneo"
    ],
    theoreticalBasis: "Baseado em Social Scripts (Krantz & McClannahan) e histórias sociais (Gray). A música oferece estrutura previsível que reduz a ansiedade social e facilita a memorização. Integra princípios do ensino de comportamento verbal e habilidades sociais."
  },
  {
    id: 7,
    title: "Nomeação Melódica de Categorias",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver habilidades de tact e categorização semântica através de canções temáticas",
    specificObjectives: [
      "Nomear objetos dentro de categorias específicas",
      "Compreender relações de categoria e membro",
      "Expandir vocabulário por campos semânticos",
      "Generalizar nomeação para objetos novos"
    ],
    description: "Utilizam-se canções estruturadas que apresentam categorias semânticas (animais, alimentos, transportes, roupas) com seus membros. A melodia cria padrão previsível onde itens são inseridos. Objetos reais ou imagens são apresentados sincronizadamente. A criança é incentivada a nomear itens conhecidos e aprender novos no contexto musical. Pratica-se inclusão (isto é um animal) e exclusão (isto não é um alimento) categórica. Jogos musicais de classificação são incorporados, onde a criança organiza itens enquanto canta. A categorização é fundamental para organização do pensamento e comunicação eficiente.",
    materials: [
      "Canções por categoria semântica",
      "Objetos miniatura de categorias",
      "Cartões de classificação",
      "Cestos/caixas para categorização",
      "Instrumentos diversos"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-10 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Nomeia itens de categorias trabalhadas",
      "Classifica itens corretamente",
      "Identifica categoria de item novo",
      "Explica critério de categorização"
    ],
    adaptations: {
      level1: "Duas categorias contrastantes, objetos concretos",
      level2: "Múltiplas categorias, subcategorias",
      level3: "Categorias abstratas, múltiplos critérios"
    },
    practicalTips: [
      "Usar categorias funcionais para a criança",
      "Incluir itens de interesse restrito",
      "Celebrar descobertas de novos membros"
    ],
    theoreticalBasis: "Fundamenta-se no desenvolvimento semântico típico e teoria das categorias (Rosch). No TEA, há tendência a hiper-especificidade que dificulta generalização. A música oferece estrutura para organização conceitual. Baseado em princípios de ensino de tact (Skinner)."
  },
  {
    id: 8,
    title: "Conversação Estruturada Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver habilidades de conversação recíproca através de estruturas musicais de turno",
    specificObjectives: [
      "Compreender e respeitar turnos conversacionais",
      "Manter tópico por múltiplos turnos",
      "Fazer e responder perguntas",
      "Demonstrar interesse pelo interlocutor"
    ],
    description: "Cria-se estrutura musical que explicita turnos conversacionais: uma melodia para pergunta, outra para resposta, sinais musicais para troca de turno. Inicia-se com tópicos de interesse da criança para maximizar motivação. O terapeuta modela perguntas e aguarda, usando pausa musical como sinal. Pratica-se fazer perguntas ao outro (não apenas responder), comentar sobre o que o outro disse, e manter tópico por ao menos 3 turnos. Utilizam-se apoios visuais (cartões de pergunta, indicador de quem fala) integrados à música. Gradualmente aumenta-se complexidade e naturalidade das trocas.",
    materials: [
      "Estruturas musicais de pergunta-resposta",
      "Cartões de perguntas",
      "Indicador visual de turno",
      "Temas de conversa ilustrados",
      "Instrumentos para sinalização"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Aguarda turno para falar",
      "Responde perguntas sobre o tópico",
      "Faz perguntas ao interlocutor",
      "Mantém tópico por 3+ turnos"
    ],
    adaptations: {
      level1: "Turnos únicos, perguntas de resposta fechada",
      level2: "2-3 turnos, perguntas abertas simples",
      level3: "Conversas flexíveis, troca natural de tópicos"
    },
    practicalTips: [
      "Começar com tópicos de alto interesse",
      "Usar curiosidade genuína nas perguntas",
      "Modelar expressões de interesse"
    ],
    theoreticalBasis: "Baseado em modelos de pragmática e conversação (Grice). O TEA frequentemente envolve dificuldades em reciprocidade conversacional. A estrutura musical explicita regras implícitas da conversa. Integra princípios do SCERTS e intervenções naturalísticas."
  },
  {
    id: 9,
    title: "Pragmática em Canções Sociais",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver aspectos pragmáticos da comunicação através de canções contextualizadas",
    specificObjectives: [
      "Adequar comunicação ao contexto social",
      "Compreender intenções comunicativas",
      "Usar expressões pragmáticas apropriadas",
      "Interpretar linguagem não-literal"
    ],
    description: "Abordam-se aspectos pragmáticos específicos através de canções que ilustram regras sociais da comunicação. Incluem-se canções sobre: quando falar alto/baixo, o que é público/privado, como pedir desculpas, expressões de educação, entender piadas simples. Cada canção apresenta contexto, regra e exemplos. Utiliza-se dramatização das situações com a música como guia. Discutem-se exceções e nuances após prática musical. O humor e expressões idiomáticas são trabalhados literalmente primeiro, depois contextualmente. A música oferece estrutura para conceitos abstratos de pragmática.",
    materials: [
      "Canções sobre regras pragmáticas",
      "Cartões de situações sociais",
      "Termômetro de volume",
      "Escalas visuais de adequação",
      "Vídeos de situações"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "6-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Identifica adequação em situações apresentadas",
      "Modifica comunicação conforme contexto",
      "Usa expressões pragmáticas aprendidas",
      "Reconhece quando aplicar regras"
    ],
    adaptations: {
      level1: "Regras concretas e absolutas, contextos claros",
      level2: "Múltiplos contextos, algumas exceções",
      level3: "Nuances, linguagem figurada, sarcasmo leve"
    },
    contraindications: [
      "Evitar sarcasmo ou ironia pesada que confunda"
    ],
    practicalTips: [
      "Usar situações reais da vida da criança",
      "Validar a dificuldade destas regras 'invisíveis'",
      "Criar cartões de referência rápida"
    ],
    theoreticalBasis: "Baseado na teoria da mente e pragmática (Baron-Cohen). Indivíduos com TEA frequentemente têm dificuldade com regras implícitas da comunicação. A música oferece estrutura explícita para ensino de conceitos abstratos sociais."
  },
  {
    id: 10,
    title: "Vocalizações Melódicas Dirigidas",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Estimular produção vocal intencional em crianças minimamente verbais através de interações musicais",
    specificObjectives: [
      "Aumentar frequência de vocalizações espontâneas",
      "Desenvolver intencionalidade nas produções vocais",
      "Estabelecer vocalizações como forma de comunicação",
      "Expandir repertório de sons produzidos"
    ],
    description: "Para crianças pré-verbais ou minimamente verbais, esta atividade foca em estimular qualquer produção vocal e moldá-la progressivamente. O terapeuta imita musicalmente as vocalizações da criança, validando-as e criando diálogo sonoro. Utilizam-se instrumentos e música para criar expectativa que elicie vocalização: pausas em músicas preferidas, jogos de causa-efeito sonoro, antecipação de eventos musicais. Toda vocalização é reforçada com resposta musical contingente. Gradualmente, modela-se vocalizações mais próximas de sons da fala. O ambiente é rico em estímulos sonoros que convidem à exploração vocal.",
    materials: [
      "Instrumentos de fácil resposta sonora",
      "Músicas preferidas da criança",
      "Microfone com amplificação",
      "Brinquedos de causa-efeito sonoro",
      "Gravações das sessões"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "1-6 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Aumenta frequência de vocalizações",
      "Vocaliza intencionalmente para obter resposta",
      "Imita padrões sonoros simples",
      "Varia produções vocais"
    ],
    adaptations: {
      level1: "Aceitar qualquer som, reforço imediato",
      level2: "Modelar aproximações de sons-alvo",
      level3: "Sílabas e proto-palavras direcionadas"
    },
    practicalTips: [
      "Criar ambiente livre de demandas verbais",
      "Celebrar toda produção vocal",
      "Usar imitação contingente"
    ],
    theoreticalBasis: "Baseado no Modelo Denver de Intervenção Precoce (Rogers & Dawson) e abordagens desenvolvimentais. O engajamento afetivo e a responsividade contingente são fundamentais para desenvolvimento comunicativo. A música oferece contexto motivador e estruturado para exploração vocal."
  },
  {
    id: 11,
    title: "Comunicação Aumentativa Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Integrar sistemas de CAA ao contexto musicoterapêutico para ampliar comunicação funcional",
    specificObjectives: [
      "Usar dispositivo de CAA para fazer escolhas musicais",
      "Ampliar vocabulário no dispositivo com termos musicais",
      "Combinar CAA com expressão musical",
      "Generalizar uso de CAA além do contexto musical"
    ],
    description: "Para crianças que utilizam comunicação aumentativa e alternativa (tablets, pranchas, comunicadores), esta atividade integra esses sistemas ao fazer musical. O dispositivo é programado com vocabulário musical: nomes de instrumentos, ações (tocar, parar, minha vez), qualidades (alto, baixo, rápido, lento), emoções e preferências. Durante a sessão, a criança usa o dispositivo para fazer escolhas, comentar, e participar de canções. O terapeuta modela uso do dispositivo enquanto faz música. A motivação intrínseca da música aumenta engajamento com CAA. Pratica-se também uso para comunicação social durante a atividade musical.",
    materials: [
      "Dispositivo de CAA da criança",
      "Vocabulário musical programado",
      "Símbolos PCS/SymbolStix musicais",
      "Instrumentos variados",
      "Quadro de escolhas físico backup"
    ],
    estimatedTime: "30-45 minutos",
    ageRange: "3-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Usa CAA para escolhas musicais",
      "Combina símbolos para comunicação elaborada",
      "Inicia comunicação via CAA",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "2-4 símbolos, escolha binária, acesso físico adaptado",
      level2: "Página musical completa, combinações simples",
      level3: "Navegação complexa, frases elaboradas"
    },
    practicalTips: [
      "Trabalhar com fonoaudiólogo/equipe de CAA",
      "Posicionar dispositivo para acesso fácil",
      "Celebrar toda comunicação via CAA"
    ],
    theoreticalBasis: "Baseado nos princípios de Comunicação Aumentativa e Alternativa (Beukelman & Mirenda). A integração da CAA em contextos motivadores como a música aumenta o uso funcional. Fundamenta-se em abordagens de comunicação multimodal."
  },
  {
    id: 12,
    title: "Prosódia e Entonação Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver aspectos prosódicos da fala através de modelagem musical",
    specificObjectives: [
      "Variar entonação conforme intenção comunicativa",
      "Reconhecer emoções pela prosódia",
      "Usar ênfase e pausas apropriadamente",
      "Adequar ritmo e velocidade da fala"
    ],
    description: "Muitas crianças com TEA apresentam prosódia atípica: fala monótona, entonação inadequada, ritmo irregular. Esta atividade usa a música para trabalhar esses aspectos explicitamente. Pratica-se contorno melódico de perguntas versus afirmações, emoções expressas através de qualidades vocais, ênfase em palavras importantes. Canções são usadas como modelo, depois fala prosódica é praticada. Utilizam-se visualizações de contorno melódico e gravações para feedback. O terapeuta exagera prosódia inicialmente, depois modela padrão típico. A musicalidade natural da fala é enfatizada.",
    materials: [
      "Canções com prosódia variada",
      "Gravador para feedback",
      "Visualizações de entonação",
      "Cartões de emoções com frases",
      "Instrumentos melódicos"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "6-16 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Diferencia perguntas de afirmações vocalmente",
      "Expressa emoções através da voz",
      "Usa ênfase em palavras-chave",
      "Demonstra variação prosódica natural"
    ],
    adaptations: {
      level1: "Contrastes exagerados, padrões musicais diretos",
      level2: "Gradações sutis, transferência para fala",
      level3: "Prosódia natural em conversação"
    },
    practicalTips: [
      "Usar gravações para auto-monitoramento",
      "Praticar frases de uso diário",
      "Incluir expressão emocional corporal"
    ],
    theoreticalBasis: "Baseado na Musicoterapia Neurológica, especificamente técnicas de MIT e trabalho prosódico. A música compartilha parâmetros acústicos com a prosódia (pitch, duração, intensidade). Estudos mostram melhora prosódica após intervenção musical estruturada."
  },
  {
    id: 13,
    title: "Intenção Comunicativa Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver variedade de funções comunicativas através de interações musicais estruturadas",
    specificObjectives: [
      "Usar comunicação para diferentes funções além de pedidos",
      "Comentar, protestar, compartilhar experiências",
      "Demonstrar atenção compartilhada comunicativa",
      "Expandir repertório de intenções comunicativas"
    ],
    description: "Crianças com TEA frequentemente usam comunicação principalmente para pedir (mando), com menos frequência de outras funções. Esta atividade cria contextos musicais que eliciam diferentes intenções: comentar sobre música surpreendente, protestar contra mudança indesejada, compartilhar prazer musical, chamar atenção para algo interessante. O terapeuta cria oportunidades naturais: eventos inesperados na música, escolhas que podem não agradar, momentos de alegria compartilhada. Modela-se comunicação para cada função, reforçando qualquer expressão de comentário, protesto ou compartilhamento.",
    materials: [
      "Músicas com elementos surpresa",
      "Instrumentos de efeito",
      "Objetos interessantes para comentar",
      "Registro de funções comunicativas",
      "Jogos musicais variados"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "2-10 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Comenta espontaneamente sobre eventos",
      "Protesta apropriadamente",
      "Demonstra alegria compartilhada",
      "Usa comunicação para múltiplas funções"
    ],
    adaptations: {
      level1: "Contextos claros de cada função, reforço imediato",
      level2: "Oportunidades naturais, expansão verbal",
      level3: "Variedade sutil de funções, generalização"
    },
    practicalTips: [
      "Criar eventos genuinamente interessantes",
      "Não antecipar apenas pedidos",
      "Validar emoções expressadas"
    ],
    theoreticalBasis: "Baseado na taxonomia de funções comunicativas (Bruner, Halliday) e modelo SCERTS. A ênfase em regulação conjunta e atenção compartilhada é crucial para desenvolvimento social. A música oferece contexto rico para eliciar múltiplas funções."
  },
  {
    id: 14,
    title: "Iniciação Comunicativa Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Aumentar frequência de iniciações comunicativas espontâneas em contexto musical",
    specificObjectives: [
      "Iniciar interações sem prompt do adulto",
      "Buscar atenção de forma apropriada",
      "Propor atividades ou temas",
      "Manter fluxo interativo iniciando turnos"
    ],
    description: "O déficit em iniciar comunicação é central no TEA. Esta atividade estrutura o ambiente para que a criança precise e queira iniciar interação. Materiais interessantes ficam visíveis mas inacessíveis, criando motivação para iniciação. O terapeuta aguarda atentamente, responsivo mas não intrusivo. Quando a criança inicia (olhar, gesto, vocalização, palavra), responde-se prontamente com música preferida. Pratica-se também iniciar com outros (não só com terapeuta) usando a música como contexto social estruturado. Reduz-se gradualmente estrutura ambiental mantendo iniciações.",
    materials: [
      "Instrumentos de alta preferência",
      "Ambiente estruturado para criar necessidade",
      "Sistema de registro de iniciações",
      "Jogos musicais que requerem pedir",
      "Outros participantes quando possível"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Inicia interação sem prompt verbal",
      "Usa formas variadas de iniciação",
      "Aumenta frequência de iniciações",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "Aceitar qualquer forma de iniciação, ambiente muito estruturado",
      level2: "Formas convencionais de iniciar, estrutura moderada",
      level3: "Iniciações complexas, contextos naturais"
    },
    practicalTips: [
      "Esperar genuinamente antes de antecipar",
      "Evitar perguntas constantes",
      "Criar pausas expectantes"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre motivação social no TEA e intervenções naturalísticas (PRT, JASPER). A música oferece motivação intrínseca que supera déficits em motivação social típica. Baseado em princípios de espera estruturada e ensino incidental."
  },
  {
    id: 15,
    title: "Reparação Comunicativa Musical",
    disorder: "TEA",
    demandCategory: "communication",
    generalObjective: "Desenvolver estratégias de reparo quando a comunicação falha através de contextos musicais",
    specificObjectives: [
      "Reconhecer quando não foi compreendido",
      "Usar estratégias alternativas para comunicar",
      "Persistir na comunicação de forma adaptativa",
      "Pedir esclarecimento quando não entende"
    ],
    description: "Quando a comunicação falha (não ser entendido ou não entender), são necessárias habilidades de reparo. Esta atividade cria situações controladas de mal-entendido no contexto musical, ensinando estratégias de reparo. O terapeuta pode fingir não entender (eticamente e com cuidado), levando a criança a tentar de novo, apontar, mostrar, usar palavras diferentes. Pratica-se também dizer 'não entendi' e pedir repetição ou explicação. A música estrutura estas interações, reduzindo frustração potencial. Celebra-se a persistência e flexibilidade comunicativa.",
    materials: [
      "Situações planejadas de mal-entendido",
      "Cartões de estratégias de reparo",
      "Jogos musicais de comunicação",
      "Scripts de reparação",
      "Instrumentos para contexto"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "5-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Reconhece quando não foi compreendido",
      "Tenta estratégia diferente",
      "Pede esclarecimento",
      "Mantém regulação durante mal-entendidos"
    ],
    adaptations: {
      level1: "Situações claras, estratégias simples (apontar, mostrar)",
      level2: "Reformulação verbal, múltiplas estratégias",
      level3: "Situações sutis, flexibilidade natural"
    },
    contraindications: [
      "Evitar frustração excessiva",
      "Não usar com crianças muito ansiosas sem preparação"
    ],
    practicalTips: [
      "Manter clima lúdico",
      "Reconhecer a frustração válida",
      "Celebrar toda tentativa de reparo"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre breakdown comunicativo e estratégias de reparo. Habilidades de reparo são essenciais para comunicação eficiente e resiliência social. A música oferece contexto de baixa ameaça para praticar situações potencialmente frustrantes."
  },

  // ==================== SENSORIAL (15 atividades) ====================
  {
    id: 16,
    title: "Dieta Sensorial Auditiva Individualizada",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Desenvolver regulação sensorial auditiva através de exposição gradual e controlada a estímulos sonoros",
    specificObjectives: [
      "Aumentar tolerância a sons previamente aversivos",
      "Desenvolver discriminação auditiva funcional",
      "Criar estratégias de autorregulação frente a sons difíceis",
      "Generalizar tolerância para ambientes naturais"
    ],
    description: "Baseada no perfil sensorial individual da criança, cria-se programa de exposição gradual a sons desafiadores. Inicia-se com volume baixo e controle total pela criança, aumentando progressivamente. Associam-se sons aversivos a contextos musicais agradáveis: sons de liquidificador incorporados em música rítmica, buzinas transformadas em elementos de canção. Ensina-se uso de fones, tampões, e estratégias de escape quando necessário. A criança desenvolve previsibilidade sobre os sons, reduzindo resposta de alarme. Monitora-se estresse fisiológico e respeita-se limites.",
    materials: [
      "Perfil sensorial auditivo documentado",
      "Gravações de sons desafiadores",
      "Controle de volume acessível",
      "Fones de proteção",
      "Músicas preferidas para associação"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Tolera sons em volume aumentado",
      "Usa estratégias de regulação apropriadas",
      "Demonstra menor ansiedade antecipatória",
      "Generaliza para ambiente natural"
    ],
    adaptations: {
      level1: "Exposição mínima, controle total da criança",
      level2: "Exposição progressiva com suporte",
      level3: "Exposição naturalística com estratégias"
    },
    contraindications: [
      "Não forçar exposição além da tolerância",
      "Monitorar sinais de estresse"
    ],
    practicalTips: [
      "Sempre dar controle à criança",
      "Progredir muito lentamente",
      "Celebrar toda exposição bem-sucedida"
    ],
    theoreticalBasis: "Baseado na Teoria de Integração Sensorial (Ayres) e dessensibilização sistemática. A exposição gradual com controle reduz resposta de estresse. A música oferece contexto regulador e previsível para trabalho sensorial."
  },
  {
    id: 17,
    title: "Modulação Sensorial Rítmica",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Regular nível de alerta sensorial através de padrões rítmicos específicos",
    specificObjectives: [
      "Aumentar consciência do próprio nível de alerta",
      "Usar ritmo para regular para cima ou para baixo",
      "Desenvolver autorregulação através da música",
      "Generalizar estratégias para vida diária"
    ],
    description: "Ensina-se a criança a reconhecer seu nível de alerta (alto demais/agitado, baixo demais/apático, na medida certa) usando escalas visuais tipo motor de carro. Diferentes ritmos são associados a cada estado e usados para modular: ritmos lentos e previsíveis para acalmar, ritmos organizadores para alertar. A criança aprende a solicitar 'música para acalmar' ou 'música para acordar'. Pratica-se detecção do estado e seleção do ritmo apropriado. Instrumentos de percussão são usados para a criança criar seu próprio ritmo regulador. Desenvolve-se playlist pessoal de regulação.",
    materials: [
      "Escala visual de alerta",
      "Músicas classificadas por efeito regulador",
      "Instrumentos de percussão",
      "Timer/cronômetro",
      "Cartões de escolha de estado"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica próprio nível de alerta",
      "Seleciona ritmo apropriado para regulação",
      "Demonstra mudança após intervenção musical",
      "Solicita música reguladora espontaneamente"
    ],
    adaptations: {
      level1: "Terapeuta identifica estado, escolhas binárias",
      level2: "Auto-identificação com suporte, múltiplas opções",
      level3: "Autorregulação independente, criação de playlists"
    },
    practicalTips: [
      "Validar todos os estados como legítimos",
      "Não julgar 'deveria estar calmo'",
      "Envolver criança na seleção musical"
    ],
    theoreticalBasis: "Fundamenta-se no Programa Alert (Williams & Shellenberger) e Teoria de Integração Sensorial. O ritmo musical afeta diretamente sistema nervoso autônomo e nível de arousal. A música oferece ferramenta de autorregulação acessível e socialmente aceitável."
  },
  {
    id: 18,
    title: "Integração Sensorial Musical",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Promover integração de múltiplos canais sensoriais através de experiências musicais ricas",
    specificObjectives: [
      "Processar informação sensorial de múltiplas modalidades simultaneamente",
      "Melhorar coordenação sensório-motora",
      "Desenvolver respostas adaptativas a input sensorial",
      "Aumentar tolerância a ambientes multissensoriais"
    ],
    description: "Cria-se ambiente multissensorial controlado onde estímulos visuais, auditivos, táteis e proprioceptivos são integrados através da música. Usa-se tecidos de diferentes texturas sincronizados com música, luzes que mudam com o ritmo, vibrações de instrumentos graves no corpo. A criança explora ativamente, com controle sobre intensidade. Gradualmente aumenta-se complexidade sensorial sempre monitorando sinais de sobrecarga. Instrumentos oferecem feedback tátil e auditivo integrado. Movimento corporal adiciona input vestibular e proprioceptivo à experiência musical.",
    materials: [
      "Instrumentos com diferentes propriedades táteis",
      "Tecidos e texturas variadas",
      "Iluminação regulável",
      "Almofadas vibratórias",
      "Bolas e materiais proprioceptivos"
    ],
    estimatedTime: "40-50 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Tolera ambiente multissensorial por tempo aumentado",
      "Demonstra respostas adaptativas organizadas",
      "Explora ativamente diferentes estímulos",
      "Regula-se frente a intensidade aumentada"
    ],
    adaptations: {
      level1: "Um canal sensorial por vez, baixa intensidade",
      level2: "Dois canais integrados, intensidade moderada",
      level3: "Ambiente rico, auto-modulação de intensidade"
    },
    contraindications: [
      "Monitorar sobrecarga sensorial",
      "Disponibilizar escape"
    ],
    practicalTips: [
      "Começar com sensações preferidas",
      "Sempre oferecer controle",
      "Ter área calma disponível"
    ],
    theoreticalBasis: "Baseado na Teoria de Integração Sensorial (Ayres) e abordagens sensoriais em musicoterapia. A música oferece estrutura temporal para integração de múltiplos inputs. A previsibilidade musical reduz demanda de processamento, facilitando integração."
  },
  {
    id: 19,
    title: "Propriocepção Musical Profunda",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Fornecer input proprioceptivo organizador através de atividades musicais de trabalho pesado",
    specificObjectives: [
      "Aumentar consciência corporal e posição no espaço",
      "Fornecer input calmante para sistema nervoso",
      "Desenvolver força e coordenação motora",
      "Estabelecer rotina de autorregulação proprioceptiva"
    ],
    description: "Atividades de 'trabalho pesado' são combinadas com música para organização sensorial. Inclui-se: carregar instrumentos pesados (djembê, surdo), empurrar e puxar ao ritmo, tocar tambores grandes com força, dança com movimentos de pressão e resistência. A música organiza temporalmente o input, aumentando benefício proprioceptivo. Atividades são precedidas e seguidas por observação do estado da criança. Ensina-se a solicitar 'preciso de trabalho pesado'. Cria-se rotina de atividades proprioceptivas musicais para momentos de desregulação.",
    materials: [
      "Instrumentos pesados (djembê, surdo, tambor de chão)",
      "Baquetas pesadas",
      "Almofadas para empurrar",
      "Músicas com batida forte",
      "Lycra ou tecido resistente"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Demonstra regulação após atividade",
      "Busca input proprioceptivo espontaneamente",
      "Aumenta duração de atenção pós-atividade",
      "Usa como estratégia de autorregulação"
    ],
    adaptations: {
      level1: "Atividades curtas, intensidade guiada",
      level2: "Sequência de atividades, auto-regulação inicial",
      level3: "Programa de autorregulação independente"
    },
    practicalTips: [
      "Observar efeito calmante x alertante",
      "Usar antes de tarefas que exigem atenção",
      "Incluir em rotina diária"
    ],
    theoreticalBasis: "Baseado na Teoria de Integração Sensorial (Ayres) e pesquisas sobre input proprioceptivo. O trabalho pesado fornece input calmante para sistema nervoso. A música estrutura temporalmente e aumenta motivação para atividades que poderiam ser percebidas como exercício."
  },
  {
    id: 20,
    title: "Vestibular Rítmico Controlado",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Oferecer estimulação vestibular segura e reguladora através de movimento musical",
    specificObjectives: [
      "Tolerar movimento vestibular progressivamente",
      "Usar movimento para regulação",
      "Desenvolver respostas posturais adequadas",
      "Integrar input vestibular com outros sentidos"
    ],
    description: "Movimento vestibular (girar, balançar, mudar de posição) é oferecido com suporte musical que organiza e modera a experiência. Crianças hipo-responsivas recebem estimulação mais intensa com música ativadora; hiper-responsivas recebem movimento suave com música calma. Balanços são sincronizados com música, giros são contados ritmicamente. A criança controla intensidade sinalizando com gestos ou instrumentos. Pratica-se tolerância progressiva sempre respeitando sinais de desconforto. Atividades são precedidas e seguidas por observação de efeitos.",
    materials: [
      "Balanço ou rede",
      "Prancha de equilíbrio",
      "Bola grande/terapêutica",
      "Músicas com diferentes tempos",
      "Instrumentos para sinalizar parada"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Tolera movimento por tempo aumentado",
      "Usa sinalização para controle",
      "Demonstra respostas posturais melhoradas",
      "Busca movimento como regulação"
    ],
    adaptations: {
      level1: "Movimento mínimo, controle total da criança",
      level2: "Movimento moderado com música organizadora",
      level3: "Movimentos variados, integração complexa"
    },
    contraindications: [
      "Observar náusea ou desconforto",
      "Evitar após alimentação"
    ],
    practicalTips: [
      "Sempre oferecer controle",
      "Observar reações atrasadas",
      "Consultar terapeuta ocupacional"
    ],
    theoreticalBasis: "Fundamenta-se na Teoria de Integração Sensorial (Ayres) e pesquisas sobre sistema vestibular. O input vestibular afeta alerta, atenção e regulação emocional. A música oferece estrutura previsível que reduz ansiedade associada a movimento."
  },
  {
    id: 21,
    title: "Exploração Tátil Musical",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Desenvolver tolerância e discriminação tátil através de instrumentos e materiais musicais variados",
    specificObjectives: [
      "Aumentar tolerância a texturas desafiantes",
      "Discriminar entre diferentes propriedades táteis",
      "Desenvolver preferências táteis conscientes",
      "Reduzir defensividade tátil progressivamente"
    ],
    description: "Instrumentos musicais oferecem rica variedade de texturas: pele de tambor, metal de pratos, madeira de claves, superfície lisa de teclas. Esta atividade usa essa diversidade para trabalho tátil. Inicia-se com texturas preferidas ou neutras, expandindo gradualmente. A música motiva exploração de materiais que seriam evitados. Pratica-se discriminação (qual instrumento estou tocando sem olhar?). Materiais não-instrumentais são incorporados ao fazer musical: tecidos para dançar, areia/arroz em chocalhos caseiros. Sempre há opção de evitar textura sem julgamento.",
    materials: [
      "Instrumentos de texturas variadas",
      "Materiais táteis diversos",
      "Caixa sensorial musical",
      "Tecidos de diferentes texturas",
      "Materiais para instrumentos caseiros"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Explora texturas novas voluntariamente",
      "Discrimina texturas com olhos fechados",
      "Expressa preferências verbalmente",
      "Tolera texturas previamente evitadas"
    ],
    adaptations: {
      level1: "Apenas texturas preferidas, toque breve",
      level2: "Variedade de texturas, exploração guiada",
      level3: "Discriminação avançada, texturas desafiantes"
    },
    practicalTips: [
      "Nunca forçar toque",
      "Oferecer lavagem de mãos disponível",
      "Começar por texturas firmes antes de úmidas"
    ],
    theoreticalBasis: "Baseado na Teoria de Integração Sensorial (Ayres) e abordagens de dessensibilização. Instrumentos musicais oferecem motivação intrínseca para exploração tátil. O engajamento musical pode reduzir defensividade tátil através de atenção dividida."
  },
  {
    id: 22,
    title: "Discriminação Auditiva Funcional",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Desenvolver habilidades de processamento auditivo central através de atividades musicais estruturadas",
    specificObjectives: [
      "Discriminar sons semelhantes em contexto musical",
      "Localizar fonte sonora no espaço",
      "Filtrar som relevante de ruído de fundo",
      "Seguir sequências auditivas complexas"
    ],
    description: "Atividades específicas para habilidades de processamento auditivo: discriminação de timbres semelhantes (qual instrumento?), localização espacial (de onde vem o som?), figura-fundo auditivo (encontrar melodia em ruído), memória sequencial auditiva (repetir ritmo). Exercícios são estruturados musicalmente para máximo engajamento. Inicia-se com contrastes claros, progredindo para discriminações sutis. Usa-se tecnologia quando apropriado (gravações, fones de ouvido para apresentação dicótica). Habilidades são aplicadas a sons ambientais e fala, não apenas música.",
    materials: [
      "Instrumentos de timbres semelhantes",
      "Fontes sonoras móveis",
      "Gravações de figura-fundo",
      "Sequências para repetição",
      "Fones de ouvido"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Discrimina entre instrumentos semelhantes",
      "Localiza sons com precisão",
      "Atende a estímulo em ruído",
      "Repete sequências de 4+ elementos"
    ],
    adaptations: {
      level1: "Contrastes máximos, ambiente silencioso",
      level2: "Contrastes moderados, algum ruído de fundo",
      level3: "Discriminações sutis, ambientes ruidosos"
    },
    practicalTips: [
      "Começar em ambiente acusticamente limpo",
      "Progredir sistematicamente",
      "Generalizar para sons funcionais"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre Transtorno do Processamento Auditivo Central frequentemente comórbido com TEA. A música oferece contexto estruturado para treino de habilidades auditivas. Fundamenta-se em técnicas de terapia auditiva-verbal e treinamento auditivo."
  },
  {
    id: 23,
    title: "Regulação com Música de Pressão",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Usar elementos musicais de pressão e contenção para regulação sensorial",
    specificObjectives: [
      "Experienciar pressão organizadora com suporte musical",
      "Desenvolver consciência de necessidade de input de pressão",
      "Usar pressão como estratégia de autorregulação",
      "Integrar input de pressão na rotina diária"
    ],
    description: "Combinam-se técnicas de pressão profunda (abraço, compressões, cobertor ponderado) com música para maximizar efeito regulador. Durante música calma, oferece-se pressão nas articulações, enrolamento em tecido, ou posição de 'casulo'. A criança aprende a associar música específica com sensação de segurança e contenção. Pratica-se identificar quando precisa de pressão ('preciso de apertão'). Desenvolve-se rotina onde música e pressão são usadas juntas antes de situações desafiadoras ou após desregulação. A música adiciona componente temporal previsível.",
    materials: [
      "Cobertor ponderado",
      "Lycra ou tecido resistente",
      "Almofadas para compressão",
      "Músicas calmas de regulação",
      "Fones de ouvido opcionais"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Aceita input de pressão com música",
      "Demonstra regulação pós-atividade",
      "Solicita pressão quando necessário",
      "Usa como estratégia independente"
    ],
    adaptations: {
      level1: "Pressão mínima, música de preferência",
      level2: "Pressão moderada, sequência estruturada",
      level3: "Autorregulação com pressão e música independentemente"
    },
    contraindications: [
      "Nunca forçar se houver resistência",
      "Atenção a dificuldades respiratórias"
    ],
    practicalTips: [
      "Seguir liderança da criança",
      "Manter música consistente para associação",
      "Treinar família para uso em casa"
    ],
    theoreticalBasis: "Fundamenta-se na Teoria de Integração Sensorial (Ayres) e pesquisas sobre pressão profunda (Temple Grandin, Edelson). Input de pressão ativa sistema parassimpático. A música adiciona estrutura temporal e previsibilidade ao input tátil profundo."
  },
  {
    id: 24,
    title: "Alerta Sensorial Musical",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Aumentar nível de alerta e responsividade em crianças hipo-responsivas através de música estimulante",
    specificObjectives: [
      "Aumentar alerta e engajamento",
      "Melhorar responsividade a estímulos sensoriais",
      "Desenvolver iniciativa e exploração",
      "Generalizar alerta para atividades diárias"
    ],
    description: "Para crianças com perfil hipo-responsivo (baixo registro, parecem 'desligadas'), usa-se música para aumentar alerta. Elementos estimulantes incluem: tempo rápido, dinâmica forte, timbres agudos, ritmos sincopados, pausas inesperadas. Movimentos ativadores são incorporados: pular, bater palmas, girar. Instrumentos que requerem força são priorizados. A sessão inicia com nível baixo, aumentando intensidade gradualmente. Monitora-se para não ultrapassar para sobre-estimulação. Ensina-se a solicitar 'preciso de música animada'.",
    materials: [
      "Instrumentos de som forte",
      "Músicas de tempo rápido",
      "Bolas e materiais de movimento",
      "Luzes dinâmicas",
      "Baquetas para percussão enérgica"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Demonstra aumento de alerta visual",
      "Responde mais rapidamente a estímulos",
      "Inicia atividades espontaneamente",
      "Mantém alerta por período estendido"
    ],
    adaptations: {
      level1: "Estímulos moderados, progressão lenta",
      level2: "Variedade de estímulos ativadores",
      level3: "Alta intensidade, autorregulação de nível"
    },
    contraindications: [
      "Cuidado com história de convulsões",
      "Evitar sobre-estimulação"
    ],
    practicalTips: [
      "Usar antes de atividades que exigem atenção",
      "Observar sinais de sobre-estimulação",
      "Ter atividade calmante disponível após"
    ],
    theoreticalBasis: "Baseado na Teoria de Integração Sensorial (Ayres) e perfis sensoriais. Crianças hipo-responsivas beneficiam-se de input sensorial intensificado. A música oferece estimulação multimodal controlada e motivadora."
  },
  {
    id: 25,
    title: "Transições Sensoriais Musicais",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Facilitar transições entre estados sensoriais e atividades usando música como ponte",
    specificObjectives: [
      "Tolerar mudanças de ambiente sensorial",
      "Usar música como âncora durante transições",
      "Desenvolver flexibilidade sensorial",
      "Generalizar estratégias de transição"
    ],
    description: "Transições são particularmente difíceis para crianças com TEA, especialmente quando envolvem mudança sensorial (de ambiente calmo para barulhento, de textura para outra). Esta atividade usa música como ponte estável durante transições. Cria-se playlist de transição pessoal que a criança ouve em fones durante mudanças. Pratica-se transições graduais na sessão: de atividade calma para estimulante, de iluminação baixa para alta. A música permanece constante enquanto ambiente muda, oferecendo previsibilidade. Desenvolve-se rotina musical para transições desafiadoras específicas.",
    materials: [
      "Playlist de transição personalizada",
      "Fones de ouvido",
      "Recursos para variar ambiente",
      "Timer visual",
      "Objeto transicional musical"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Tolera transições com suporte musical",
      "Solicita música para transições",
      "Demonstra menor ansiedade antecipatória",
      "Generaliza para transições naturais"
    ],
    adaptations: {
      level1: "Transições mínimas, música contínua",
      level2: "Transições graduais, música como apoio",
      level3: "Transições variadas, uso independente de música"
    },
    practicalTips: [
      "Manter consistência na música de transição",
      "Começar transição antes da mudança física",
      "Validar dificuldade das transições"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre dificuldades de transição no TEA e uso de suportes visuais/auditivos. A música oferece consistência sensorial que compensa mudança ambiental. Baseado em princípios de TEACCH e estruturação do ambiente."
  },
  {
    id: 26,
    title: "Sinestesia Musical Estruturada",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Explorar conexões entre modalidades sensoriais através de experiências sinestésicas musicais",
    specificObjectives: [
      "Associar sons a cores e formas",
      "Desenvolver conexões intermodais conscientes",
      "Expressar experiências sensoriais criativamente",
      "Aumentar flexibilidade perceptual"
    ],
    description: "Aproveita-se a tendência de algumas pessoas com TEA a experiências sinestésicas, criando atividades que explicitam conexões entre sentidos. Associam-se sons graves a cores escuras e formas angulares, agudos a cores claras e formas arredondadas. A criança pinta ou desenha enquanto ouve música, ou escolhe cores para representar instrumentos. Explora-se textura do som (áspero, liso), peso (pesado, leve), temperatura (quente, frio). Estas associações são validadas e exploradas criativamente. A atividade é estruturada mas permite expressão individual.",
    materials: [
      "Instrumentos variados",
      "Materiais de arte",
      "Cartões de cores e formas",
      "Tecidos e texturas",
      "Gravações de diferentes qualidades sonoras"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Faz associações entre modalidades",
      "Explica suas escolhas sinestésicas",
      "Demonstra consistência nas associações",
      "Expressa criatividade nas conexões"
    ],
    adaptations: {
      level1: "Associações oferecidas, escolha binária",
      level2: "Criação guiada de associações",
      level3: "Expressão sinestésica livre"
    },
    practicalTips: [
      "Validar experiências perceptuais únicas",
      "Não impor associações convencionais",
      "Documentar associações individuais"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre sinestesia e processamento sensorial atípico no TEA. A música oferece estímulo rico para exploração intermodal. Fundamenta-se em abordagens de arteterapia e expressão criativa."
  },
  {
    id: 27,
    title: "Dessensibilização Auditiva Gradual",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Reduzir hipersensibilidade a sons específicos através de exposição musical gradual e controlada",
    specificObjectives: [
      "Tolerar sons previamente aversivos em volume reduzido",
      "Aumentar progressivamente tolerância",
      "Desenvolver estratégias de coping para sons difíceis",
      "Generalizar tolerância para ambiente natural"
    ],
    description: "Identifica-se som específico que causa desconforto significativo (secador, descarga, palmas). Cria-se hierarquia de exposição começando por versão musical do som ou som em volume mínimo. O som é incorporado em contexto musical agradável, associando-o a experiência positiva. Progride-se muito lentamente, sempre com controle da criança. Ensina-se uso de fones, tampões, e 'pausas' auto-solicitadas. A criança desenvolve sensação de competência ao tolerar o que antes era insuportável. Mantém-se registro de progresso visível.",
    materials: [
      "Gravações de sons-alvo",
      "Controle de volume acessível",
      "Fones de proteção",
      "Músicas para associação positiva",
      "Escala de tolerância visual"
    ],
    estimatedTime: "25-40 minutos",
    ageRange: "4-16 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Tolera som em volume aumentado",
      "Demonstra menor ansiedade antecipatória",
      "Usa estratégias de coping efetivamente",
      "Lida com som em ambiente natural"
    ],
    adaptations: {
      level1: "Volume mínimo, exposição brevíssima",
      level2: "Volume moderado, duração aumentada",
      level3: "Aproximação de volume real"
    },
    contraindications: [
      "Não forçar além da tolerância",
      "Interromper se houver aumento de estresse"
    ],
    practicalTips: [
      "Progredir mais lentamente do que parece necessário",
      "Celebrar cada micro-avanço",
      "Manter controle sempre com a criança"
    ],
    theoreticalBasis: "Baseado em dessensibilização sistemática (Wolpe) adaptada para sensibilidade sensorial. A exposição gradual com relaxamento reduz resposta condicionada de medo. A música oferece contexto relaxante e motivador para exposição."
  },
  {
    id: 28,
    title: "Autorregulação Sensorial com Playlist",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Desenvolver repertório musical pessoal para autorregulação sensorial independente",
    specificObjectives: [
      "Identificar músicas que ajudam em diferentes estados",
      "Criar playlists funcionais de autorregulação",
      "Usar música proativamente para regulação",
      "Generalizar uso para múltiplos contextos"
    ],
    description: "A criança desenvolve consciência de como diferentes músicas afetam seu estado sensorial e emocional. Explora-se sistematicamente: o que acalma, o que energiza, o que ajuda a focar, o que ajuda a dormir. Cria-se playlist pessoal para cada função usando aplicativo ou sistema físico (cartões). Pratica-se uso proativo: colocar música calmante ANTES de situação estressante, não apenas depois. Ensina-se a sequência: (1) perceber estado, (2) escolher música, (3) avaliar efeito. Família é envolvida para suporte em casa.",
    materials: [
      "Biblioteca musical variada",
      "Aplicativo ou sistema de playlists",
      "Cartões de estados sensoriais",
      "Fones de ouvido pessoais",
      "Registro de músicas e efeitos"
    ],
    estimatedTime: "40-50 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica músicas para diferentes estados",
      "Usa playlist independentemente",
      "Demonstra melhora com uso da música",
      "Generaliza para múltiplos contextos"
    ],
    adaptations: {
      level1: "Escolha entre 2-3 músicas pré-selecionadas",
      level2: "Categorias de playlists, uso guiado",
      level3: "Curadoria independente, uso proativo"
    },
    practicalTips: [
      "Incluir preferências musicais da criança",
      "Testar músicas em diferentes contextos",
      "Atualizar playlists regularmente"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre música e regulação emocional (Saarikallio & Erkkilä). A música oferece ferramenta de autorregulação portátil, acessível e socialmente aceitável. Baseado em princípios de psicoeducação e autoconsciência."
  },
  {
    id: 29,
    title: "Processamento Sensorial em Grupo Musical",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Desenvolver tolerância a ambiente sensorial social através de música em grupo estruturado",
    specificObjectives: [
      "Tolerar presença de outros em atividade sensorial",
      "Processar estímulos sensoriais compartilhados",
      "Desenvolver consciência de outros no espaço",
      "Participar de atividade sensorial coletiva"
    ],
    description: "Ambientes sociais são sensorialmente intensos e imprevisíveis. Esta atividade usa grupo musical pequeno e estruturado para desenvolver tolerância gradual. Inicia-se com díade (criança + um colega), expandindo lentamente. Atividades têm estrutura sensorial previsível: cada pessoa toca na sua vez, volume é controlado, espaço físico é definido. Pratica-se compartilhar espaço sonoro, ajustar próprio volume ao grupo, tolerar sons dos outros. A música estrutura o caos sensorial potencial do grupo.",
    materials: [
      "Instrumentos para cada participante",
      "Marcadores de espaço pessoal",
      "Regras visuais do grupo",
      "Timer de turnos",
      "Fones de proteção opcionais"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Permanece em grupo por tempo aumentado",
      "Tolera sons produzidos por outros",
      "Ajusta próprio volume ao grupo",
      "Demonstra consciência espacial dos outros"
    ],
    adaptations: {
      level1: "Díade, tempo curto, muito espaçamento",
      level2: "3-4 pessoas, estrutura moderada",
      level3: "Grupo maior, flexibilidade aumentada"
    },
    contraindications: [
      "Evitar forçar se houver recusa persistente"
    ],
    practicalTips: [
      "Começar com pares compatíveis",
      "Manter alta estrutura inicial",
      "Ter opção de 'pausa' disponível"
    ],
    theoreticalBasis: "Baseado em desafios de processamento sensorial em contextos sociais no TEA. O grupo musical oferece ambiente social controlado para prática. Fundamenta-se em abordagens de dessensibilização e habilidades sociais."
  },
  {
    id: 30,
    title: "Consciência Corporal Musical",
    disorder: "TEA",
    demandCategory: "sensory",
    generalObjective: "Desenvolver consciência corporal e esquema corporal através de música e movimento",
    specificObjectives: [
      "Identificar e nomear partes do corpo",
      "Desenvolver consciência de posição corporal",
      "Melhorar percepção de limites corporais",
      "Integrar esquema corporal com movimento"
    ],
    description: "Muitas crianças com TEA têm consciência corporal reduzida, afetando coordenação e regulação. Usa-se canções que nomeiam partes do corpo com toque correspondente, proporcionando feedback proprioceptivo. Atividades incluem: 'Cabeça, Ombro, Joelho e Pé' com toque firme, dança com espelho, percussão corporal localizada. Explora-se como diferentes partes do corpo podem produzir sons. Pratica-se desenhar o corpo após atividade musical corporal. A música organiza temporalmente o mapeamento do corpo.",
    materials: [
      "Canções de partes do corpo",
      "Espelho grande",
      "Materiais para toque (pincéis, bolas)",
      "Papel para desenho corporal",
      "Instrumentos de percussão corporal"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-10 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Identifica partes do corpo nomeadas",
      "Toca parte correta quando solicitado",
      "Demonstra consciência espacial melhorada",
      "Representa corpo em desenho com partes"
    ],
    adaptations: {
      level1: "Partes grandes, toque firme do terapeuta",
      level2: "Partes menores, auto-toque guiado",
      level3: "Partes detalhadas, representação complexa"
    },
    practicalTips: [
      "Usar toque firme para feedback claro",
      "Incluir partes frequentemente esquecidas",
      "Conectar com atividades de vida diária"
    ],
    theoreticalBasis: "Baseado na Teoria de Integração Sensorial (Ayres) e desenvolvimento do esquema corporal. A música oferece estrutura para exploração corporal organizada. O feedback proprioceptivo combinado com nomeação verbal melhora representação corporal."
  },

  // ==================== SOCIOEMOCIONAL (15 atividades) ====================
  {
    id: 31,
    title: "Reconhecimento de Emoções Musicais",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver habilidade de identificar emoções básicas através de expressões musicais",
    specificObjectives: [
      "Identificar emoções em músicas e faces",
      "Associar características musicais a emoções",
      "Reconhecer emoções em si e nos outros",
      "Expandir vocabulário emocional"
    ],
    description: "Explora-se como a música expressa emoções através de seus elementos: modo maior/menor, tempo, dinâmica, articulação. Apresentam-se trechos musicais representando emoções básicas (alegria, tristeza, raiva, medo), associando a faces, cartões e situações. A criança identifica a emoção e explica as pistas musicais usadas. Pratica-se criar música com emoção específica usando instrumentos. Faz-se ponte entre emoções musicais e emoções em pessoas: 'João está tocando feliz, você consegue ver por quê?'. Desenvolve-se vocabulário emocional através da música.",
    materials: [
      "Trechos musicais emocionais selecionados",
      "Cartões de expressões faciais",
      "Instrumentos para expressão",
      "Escala visual de emoções",
      "Situações ilustradas"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica emoções em músicas apresentadas",
      "Explica pistas musicais de emoção",
      "Cria música com emoção-alvo",
      "Transfere identificação para faces/situações"
    ],
    adaptations: {
      level1: "Emoções básicas contrastantes, feedback imediato",
      level2: "Emoções variadas, nuances",
      level3: "Emoções complexas, situações ambíguas"
    },
    practicalTips: [
      "Começar com emoções de valência clara",
      "Usar emoções relevantes para a criança",
      "Conectar com experiências pessoais"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre alexitimia e dificuldades de reconhecimento emocional no TEA. A música oferece via alternativa para processamento emocional. Baseado em teorias de cognição musical e emoção (Juslin & Sloboda)."
  },
  {
    id: 32,
    title: "Expressão Emocional Musical Segura",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Oferecer meio seguro para expressão de emoções através de instrumentos e improvisação",
    specificObjectives: [
      "Expressar emoções através de instrumentos",
      "Externalizar sentimentos difíceis de forma segura",
      "Desenvolver vocabulário expressivo musical",
      "Usar música como regulação emocional"
    ],
    description: "Cria-se espaço seguro onde qualquer emoção pode ser expressa através da música sem julgamento. A criança escolhe instrumento para representar como se sente e toca livremente. O terapeuta espelha e valida musicalmente, sem interpretar verbalmente inicialmente. Emoções 'proibidas' socialmente (raiva, ciúmes) podem ser expressas no instrumento. Gradualmente, faz-se ponte verbal: 'Parece que essa música estava brava'. Pratica-se modular a expressão: 'Pode tocar a raiva um pouco menos?'. A música oferece continente para emoções intensas.",
    materials: [
      "Variedade de instrumentos",
      "Espaço acusticamente seguro",
      "Caderno de registro opcional",
      "Instrumentos de impacto para raiva",
      "Instrumentos suaves para tristeza"
    ],
    estimatedTime: "30-45 minutos",
    ageRange: "4-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Expressa emoções através de instrumentos",
      "Aceita espelhamento do terapeuta",
      "Faz ponte verbal com expressão musical",
      "Demonstra regulação após expressão"
    ],
    adaptations: {
      level1: "Expressão livre, mínima verbalização",
      level2: "Nomeação de emoções, modulação básica",
      level3: "Discussão aprofundada, estratégias de regulação"
    },
    contraindications: [
      "Cuidado com expressão desregulada",
      "Conter se necessário sem punir"
    ],
    practicalTips: [
      "Nunca julgar a expressão",
      "Validar antes de modular",
      "Ter estratégias de contenção se necessário"
    ],
    theoreticalBasis: "Baseado em abordagens psicodinâmicas em musicoterapia (Priestley) e teoria de regulação emocional. A música oferece via não-verbal para expressão de conteúdos difíceis de verbalizar. O espelhamento musical valida a experiência emocional."
  },
  {
    id: 33,
    title: "Atenção Compartilhada Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver habilidades de atenção conjunta através de experiências musicais compartilhadas",
    specificObjectives: [
      "Compartilhar foco atencional com outra pessoa",
      "Seguir direção de olhar e apontamento",
      "Iniciar atenção compartilhada",
      "Demonstrar prazer em compartilhar experiência"
    ],
    description: "Atenção compartilhada é déficit central no TEA e preditor de linguagem. Usa-se música para criar momentos de atenção conjunta natural. Eventos musicais interessantes (instrumento novo, som surpreendente) são apresentados criando oportunidade para olhar compartilhado. O terapeuta exagera reação emocional, convidando ao compartilhamento. Pratica-se apontar para instrumentos enquanto olha para o outro, verificar se o outro está vendo, comentar. A música oferece 'algo interessante' que vale a pena compartilhar.",
    materials: [
      "Instrumentos novos e interessantes",
      "Elementos de surpresa musical",
      "Espelho para prática de olhar",
      "Objetos musicais de interesse",
      "Sistema de registro de episódios"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-8 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Olha para terapeuta durante evento interessante",
      "Segue apontamento para objeto",
      "Aponta para compartilhar (não só pedir)",
      "Demonstra afeto positivo compartilhado"
    ],
    adaptations: {
      level1: "Aceitar olhar breve, eventos muito interessantes",
      level2: "Apontamento, verificação de olhar",
      level3: "Comentário verbal, iniciação de compartilhamento"
    },
    practicalTips: [
      "Usar interesses intensos da criança",
      "Exagerar próprias reações emocionais",
      "Esperar olhar antes de reagir"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre desenvolvimento de atenção conjunta e seu papel no TEA (Mundy & Newell). A música oferece estímulo intrinsecamente motivador para compartilhamento. Baseado em modelos desenvolvimentais (JASPER, ESDM)."
  },
  {
    id: 34,
    title: "Turnos Sociais Musicais",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver compreensão e prática de turnos sociais através de estruturas musicais",
    specificObjectives: [
      "Compreender conceito de 'minha vez' e 'sua vez'",
      "Esperar turno sem desregulação",
      "Ceder turno ao outro",
      "Generalizar turno para contextos não-musicais"
    ],
    description: "A estrutura musical explicita turnos de forma clara e motivadora. Inicia-se com turnos simples: terapeuta toca, criança toca. Usa-se sinalização visual e auditiva para indicar troca. Gradualmente complexifica-se: esperar enquanto outro toca, parar no meio para passar o turno, múltiplas pessoas. Pratica-se tolerar a espera com música de fundo. Músicas de 'pergunta e resposta' são usadas: eu canto pergunta, você canta resposta. O instrumento serve como objeto transicional de turno. Faz-se ponte para turnos em conversação e brincadeira.",
    materials: [
      "Instrumentos para cada participante",
      "Sinalizadores de turno",
      "Timer visual",
      "Músicas de pergunta-resposta",
      "Objeto de turno (baqueta especial)"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-10 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Espera sua vez sem desregular",
      "Inicia quando sinalizado",
      "Para quando é vez do outro",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "Turnos muito curtos, sinalização clara",
      level2: "Turnos mais longos, múltiplas pessoas",
      level3: "Turnos flexíveis, negociação"
    },
    practicalTips: [
      "Manter turnos inicialmente curtos",
      "Usar interesse como motivador para espera",
      "Ter música de espera disponível"
    ],
    theoreticalBasis: "Baseado em desenvolvimento de intersubjetividade e reciprocidade social. A música oferece estrutura temporal que explicita turnos implícitos. Fundamenta-se em intervenções de habilidades sociais e teoria da mente."
  },
  {
    id: 35,
    title: "Empatia Musical Guiada",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver capacidade empática através de atividades musicais que envolvem perspectiva do outro",
    specificObjectives: [
      "Reconhecer emoções do outro na música",
      "Responder musicalmente a emoções alheias",
      "Considerar preferências musicais do outro",
      "Demonstrar comportamento pró-social musical"
    ],
    description: "A música oferece via única para trabalho empático por sua natureza emocional e interativa. Pratica-se identificar como o terapeuta ou colega está se sentindo pela música que tocam. A criança escolhe música para alegrar/acalmar o outro, considerando preferências alheias. Em díades, pratica-se ajustar própria música ao que o outro precisa (tocar baixo porque o amigo tem dor de cabeça). Discutem-se personagens de canções e suas motivações. A música cria distância segura para explorar emoções alheias.",
    materials: [
      "Instrumentos para interação",
      "Histórias musicadas com personagens",
      "Cartões de situações emocionais",
      "Músicas de diferentes estados",
      "Vídeos de pessoas com música"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Identifica emoção do outro na música",
      "Ajusta própria música ao estado do outro",
      "Escolhe música pensando no outro",
      "Demonstra comportamento pró-social"
    ],
    adaptations: {
      level1: "Emoções básicas claras, feedback imediato",
      level2: "Emoções variadas, resposta musical",
      level3: "Situações complexas, empatia espontânea"
    },
    practicalTips: [
      "Usar situações reais da vida da criança",
      "Modelar respostas empáticas",
      "Celebrar tentativas de considerar o outro"
    ],
    theoreticalBasis: "Fundamenta-se em teoria da mente e desenvolvimento de empatia. A música oferece via alternativa para acesso empático quando linguagem falha. Baseado em abordagens relacionais em musicoterapia (Nordoff-Robbins)."
  },
  {
    id: 36,
    title: "Regulação Emocional Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver estratégias de regulação emocional usando música como ferramenta",
    specificObjectives: [
      "Identificar próprio estado emocional",
      "Selecionar música apropriada para regulação",
      "Usar música proativamente para prevenir desregulação",
      "Modular intensidade emocional através da música"
    ],
    description: "Ensina-se ciclo de autorregulação: (1) perceber estado, (2) escolher estratégia musical, (3) aplicar, (4) avaliar resultado. Crianças aprendem que diferentes músicas têm diferentes efeitos: algumas acalmam, outras energizam. Desenvolve-se repertório pessoal de músicas reguladoras. Pratica-se uso proativo: colocar música calmante ANTES de situação estressante conhecida. Quando desregulado, terapeuta oferece música reguladora, depois ensina auto-aplicação. Cria-se 'kit de regulação' com músicas, fones, e instruções.",
    materials: [
      "Escala de estados emocionais",
      "Biblioteca musical categorizada",
      "Fones de ouvido pessoais",
      "Cartões de estratégias musicais",
      "Registro de uso e efeito"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica próprio estado emocional",
      "Seleciona música apropriada",
      "Demonstra mudança após intervenção musical",
      "Usa música proativamente"
    ],
    adaptations: {
      level1: "Terapeuta identifica e oferece música",
      level2: "Escolha entre opções pré-selecionadas",
      level3: "Autorregulação independente"
    },
    practicalTips: [
      "Começar usando música em momento de regulação",
      "Gradualmente usar em desregulação leve",
      "Envolver família no suporte"
    ],
    theoreticalBasis: "Baseado em modelos de regulação emocional (Gross) e pesquisas sobre música e emoção. A música afeta sistema nervoso autônomo e pode modular arousal. Fundamenta-se em intervenções de DBT adaptadas e abordagens cognitivo-comportamentais."
  },
  {
    id: 37,
    title: "Interação Diádica Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver habilidades de interação um-a-um através de improvisação musical estruturada",
    specificObjectives: [
      "Engajar em interação sustentada com outra pessoa",
      "Responder às iniciativas musicais do outro",
      "Iniciar interações musicais",
      "Demonstrar reciprocidade na interação"
    ],
    description: "A improvisação clínica oferece contexto ideal para prática de interação diádica. Terapeuta e criança improvisam juntos, desenvolvendo diálogo musical. O terapeuta ajusta-se ao nível da criança, criando experiência de sincronia e conexão. Praticam-se padrões básicos: eu proponho/você responde, sincronizar ritmos, criar música juntos. O terapeuta modela responsividade e toma de turno. Gradualmente, a criança assume mais iniciativa. A interação musical é ponte para interação social geral.",
    materials: [
      "Instrumentos variados",
      "Espaço acústico adequado",
      "Gravador para revisão",
      "Instrumentos pares",
      "Sistema de registro de interações"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Mantém interação por período aumentado",
      "Responde a propostas do terapeuta",
      "Inicia propostas musicais",
      "Demonstra reciprocidade"
    ],
    adaptations: {
      level1: "Aceitação de qualquer engajamento, terapeuta lidera",
      level2: "Turnos equilibrados, respostas mais elaboradas",
      level3: "Liderança compartilhada, co-criação"
    },
    practicalTips: [
      "Seguir liderança da criança inicialmente",
      "Usar espelhamento para conexão",
      "Celebrar momentos de sincronia"
    ],
    theoreticalBasis: "Fundamenta-se na abordagem Nordoff-Robbins de musicoterapia criativa. A improvisação oferece interação em tempo real, desenvolvimento. Baseado em teorias de intersubjetividade e relacionamento terapêutico."
  },
  {
    id: 38,
    title: "Habilidades Sociais em Grupo Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver habilidades sociais em contexto de grupo musical estruturado",
    specificObjectives: [
      "Participar de atividade musical em grupo",
      "Cooperar com pares em tarefas musicais",
      "Seguir regras sociais do grupo",
      "Desenvolver pertencimento grupal"
    ],
    description: "Grupo musical pequeno (3-6 participantes) oferece contexto controlado para prática social. Atividades estruturadas incluem: fazer música em conjunto, esperar vez, ajustar volume ao grupo, contribuir para produto coletivo. Regras sociais são explicitadas visualmente e praticadas consistentemente. O terapeuta facilita interações positivas e media conflitos. Celebra-se o resultado grupal (nossa música, nosso ritmo). Gradualmente, aumenta-se complexidade das interações e diminui-se estrutura.",
    materials: [
      "Instrumentos para todos",
      "Regras visuais do grupo",
      "Indicadores de turno",
      "Atividades de grupo estruturadas",
      "Gravador para produto final"
    ],
    estimatedTime: "40-50 minutos",
    ageRange: "5-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Permanece em grupo todo o tempo",
      "Segue regras estabelecidas",
      "Coopera em atividades conjuntas",
      "Interage positivamente com pares"
    ],
    adaptations: {
      level1: "Grupo pequeno, alta estrutura, tarefas paralelas",
      level2: "Grupo médio, cooperação simples",
      level3: "Grupo maior, interações livres dentro da estrutura"
    },
    contraindications: [
      "Formar grupos com cuidado quanto à compatibilidade"
    ],
    practicalTips: [
      "Começar com grupos muito pequenos",
      "Manter alta estrutura inicial",
      "Preparar cada criança individualmente primeiro"
    ],
    theoreticalBasis: "Baseado em intervenções de habilidades sociais em grupo e musicoterapia de grupo. A música oferece objetivo comum que une o grupo e estrutura interações. Fundamenta-se em abordagens de aprendizagem social (Bandura) e teoria do grupo."
  },
  {
    id: 39,
    title: "Ansiedade Social Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Reduzir ansiedade em situações sociais através de estratégias musicais",
    specificObjectives: [
      "Identificar gatilhos de ansiedade social",
      "Usar música como estratégia de coping",
      "Dessensibilizar gradualmente situações sociais",
      "Desenvolver confiança em interações"
    ],
    description: "Muitas crianças com TEA desenvolvem ansiedade social por histórico de interações difíceis. Esta atividade usa música para dessensibilização gradual e como estratégia de coping. Identificam-se situações desafiadoras e cria-se hierarquia de exposição. Pratica-se a situação no contexto musical seguro primeiro. Desenvolve-se playlist de regulação para uso antes/durante situações sociais. Ensina-se respiração rítmica para acalmar. A criança ganha experiências positivas de interação através da música, reconstruindo confiança.",
    materials: [
      "Hierarquia de situações sociais",
      "Músicas de regulação",
      "Fones de ouvido",
      "Exercícios de respiração musical",
      "Registro de exposições"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Identifica gatilhos de ansiedade",
      "Usa estratégias musicais de coping",
      "Tolera situações sociais progressivamente",
      "Demonstra redução de ansiedade"
    ],
    adaptations: {
      level1: "Exposição mínima, música de suporte constante",
      level2: "Exposição gradual, estratégias de coping",
      level3: "Exposição naturalística, coping internalizado"
    },
    contraindications: [
      "Não forçar exposição",
      "Monitorar sinais de estresse"
    ],
    practicalTips: [
      "Validar a ansiedade como real e legítima",
      "Progredir muito gradualmente",
      "Celebrar toda exposição bem-sucedida"
    ],
    theoreticalBasis: "Baseado em modelos de ansiedade social e tratamento cognitivo-comportamental. A música oferece estratégia de regulação e contexto para dessensibilização. Fundamenta-se em técnicas de exposição gradual e relaxamento."
  },
  {
    id: 40,
    title: "Narrativa Emocional Cantada",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver capacidade de processar e narrar experiências emocionais através de canções",
    specificObjectives: [
      "Identificar emoções em experiências pessoais",
      "Narrar eventos emocionais cantando",
      "Processar situações difíceis através de música",
      "Desenvolver insight emocional"
    ],
    description: "Criar canções sobre experiências pessoais oferece via para processamento emocional. A criança relata situação que experimentou (briga com amigo, medo do escuro, alegria de conquista), e terapeuta ajuda a transformar em canção. O ato de cantar distancia e organiza a experiência. A canção pode ser revisitada, modificada, e usada para discussão. Emoções difíceis de verbalizar tornam-se acessíveis quando cantadas. Cria-se repertório pessoal de 'canções de vida' da criança.",
    materials: [
      "Instrumentos de acompanhamento",
      "Caderno de canções pessoais",
      "Gravador para registro",
      "Cartões de situações comuns",
      "Materiais de escrita"
    ],
    estimatedTime: "40-50 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Relata experiências emocionais",
      "Participa de criação de canção",
      "Demonstra processamento através da música",
      "Usa canções para revisitar experiências"
    ],
    adaptations: {
      level1: "Canções pré-escritas sobre temas comuns",
      level2: "Co-criação com forte apoio do terapeuta",
      level3: "Criação independente, discussão aprofundada"
    },
    practicalTips: [
      "Não forçar revelação de experiências",
      "Aceitar metáforas e histórias projetadas",
      "Manter canções em local seguro"
    ],
    theoreticalBasis: "Fundamenta-se em abordagens narrativas em psicoterapia e songwriting terapêutico. A narrativa organiza experiência e cria significado. A música adiciona dimensão emocional à narrativa e oferece distanciamento seguro."
  },
  {
    id: 41,
    title: "Flexibilidade Emocional Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver flexibilidade em respostas emocionais através de variações musicais",
    specificObjectives: [
      "Tolerar mudanças em contexto musical",
      "Adaptar resposta emocional a mudanças",
      "Modular intensidade de resposta",
      "Generalizar flexibilidade para vida diária"
    ],
    description: "Rigidez emocional é comum no TEA, com dificuldade de modular respostas. Usa-se música para praticar flexibilidade de forma segura e gradual. Inicia-se com música preferida, fazendo pequenas modificações: mudar volume, tempo, instrumento. A criança pratica tolerar e adaptar-se a mudanças. Gradualmente, mudanças tornam-se mais significativas. Pratica-se modular própria resposta: 'Agora está alegre, agora está um pouco menos alegre'. Faz-se ponte para situações de vida onde flexibilidade é necessária.",
    materials: [
      "Músicas preferidas",
      "Instrumentos variados",
      "Controladores de parâmetros musicais",
      "Escala de tolerância",
      "Situações de vida para discussão"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Tolera mudanças em música familiar",
      "Adapta resposta a variações",
      "Modula própria intensidade emocional",
      "Transfere flexibilidade para outras situações"
    ],
    adaptations: {
      level1: "Mudanças mínimas, aviso prévio, retorno rápido",
      level2: "Mudanças moderadas, tolerância estendida",
      level3: "Mudanças significativas, adaptação fluida"
    },
    contraindications: [
      "Não forçar mudanças se houver recusa intensa"
    ],
    practicalTips: [
      "Começar com mudanças muito pequenas",
      "Sempre avisar antes de mudar inicialmente",
      "Validar desconforto com mudanças"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre rigidez cognitiva e emocional no TEA. A música oferece contexto seguro para praticar tolerância a mudanças. Fundamenta-se em intervenções de flexibilidade cognitiva e exposição gradual."
  },
  {
    id: 42,
    title: "Vínculo Terapêutico Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Estabelecer e fortalecer vínculo terapêutico como base para desenvolvimento socioemocional",
    specificObjectives: [
      "Desenvolver confiança na relação terapêutica",
      "Experienciar relação de sincronia e atunement",
      "Usar vínculo como base para exploração",
      "Generalizar capacidade de relacionamento"
    ],
    description: "O vínculo terapêutico é base de toda intervenção efetiva. Esta atividade foca explicitamente em estabelecer e nutrir a relação através da música. O terapeuta sintoniza-se com estado da criança, espelhando musicalmente. Cria-se repertório compartilhado de músicas 'nossas'. Pratica-se reparação quando há ruptura na relação. A consistência e previsibilidade do terapeuta através da música cria segurança. A criança experiencia ser compreendida e aceita musicalmente. Esta base permite trabalho mais profundo em outras áreas.",
    materials: [
      "Instrumentos preferidos da criança",
      "Músicas significativas para a díade",
      "Espaço acolhedor",
      "Registro de momentos significativos",
      "Consistência na estrutura da sessão"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "2-18 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Demonstra conforto na sessão",
      "Busca interação com terapeuta",
      "Aceita apoio oferecido",
      "Usa relação como base para exploração"
    ],
    adaptations: {
      level1: "Presença calma, sem demandas, espelhamento",
      level2: "Interação recíproca, repertório compartilhado",
      level3: "Relação como base para trabalho profundo"
    },
    practicalTips: [
      "Priorizar relação sobre objetivos específicos",
      "Ser consistente e previsível",
      "Reparar rupturas com cuidado"
    ],
    theoreticalBasis: "Fundamenta-se em teoria do apego (Bowlby) e importância da relação terapêutica. A música oferece via para conexão quando verbal falha. Baseado em abordagens relacionais e desenvolvimentais (DIR/Floortime, Nordoff-Robbins)."
  },
  {
    id: 43,
    title: "Autoconceito Musical Positivo",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Fortalecer autoconceito e autoestima através de experiências musicais de sucesso",
    specificObjectives: [
      "Identificar forças e qualidades pessoais",
      "Experienciar sucesso e competência musical",
      "Desenvolver narrativa pessoal positiva",
      "Aumentar confiança em habilidades"
    ],
    description: "Muitas crianças com TEA têm autoconceito negativo por histórico de falhas e correções. A música oferece área de competência única. Identificam-se e cultivam-se forças musicais: memória para melodias, senso rítmico preciso, pitch perfeito, criatividade. Cria-se canção pessoal de qualidades ('Eu sou...') que a criança pode cantar. Experiências de sucesso musical são destacadas e celebradas. Portfólio de produções musicais é construído. A criança desenvolve identidade de 'músico' que fortalece autoconceito global.",
    materials: [
      "Instrumentos de domínio da criança",
      "Canções de identidade",
      "Portfólio de produções",
      "Gravador para registro de sucessos",
      "Lista de forças pessoais"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica próprias forças",
      "Demonstra orgulho de produções",
      "Verbaliza qualidades positivas",
      "Demonstra confiança aumentada"
    ],
    adaptations: {
      level1: "Terapeuta identifica e destaca forças",
      level2: "Co-identificação de qualidades",
      level3: "Auto-identificação, narrativa pessoal elaborada"
    },
    practicalTips: [
      "Focar em forças genuínas, não elogios vazios",
      "Documentar produções e progressos",
      "Compartilhar sucessos com família"
    ],
    theoreticalBasis: "Baseado em psicologia positiva e teoria do autoconceito. A música oferece área de competência alternativa a padrões tradicionais. Fundamenta-se em abordagens de forças e resiliência."
  },
  {
    id: 44,
    title: "Coping Musical para Stress",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Desenvolver repertório de estratégias musicais para manejo de stress",
    specificObjectives: [
      "Identificar sinais de stress",
      "Selecionar estratégia musical apropriada",
      "Aplicar estratégia efetivamente",
      "Generalizar para vida diária"
    ],
    description: "Crianças com TEA frequentemente experimentam alto stress por demandas sociais e sensoriais. Esta atividade desenvolve 'caixa de ferramentas' musical para coping. Identificam-se sinais pessoais de stress (tensão, irritação, querer fugir). Várias estratégias são ensinadas: respiração rítmica, música calmante em fones, tocar bateria para descarga, cantar música favorita. Cada estratégia é praticada quando regulado, depois aplicada em estresse leve. Cria-se kit portátil com músicas e estratégias. Família é treinada para suporte.",
    materials: [
      "Kit de coping musical portátil",
      "Fones de ouvido",
      "Playlist de estratégias",
      "Cartões de estratégias visuais",
      "Instrumentos de descarga"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica próprios sinais de stress",
      "Seleciona estratégia apropriada",
      "Aplica estratégia com sucesso",
      "Generaliza para situações reais"
    ],
    adaptations: {
      level1: "Terapeuta identifica stress e oferece estratégia",
      level2: "Escolha entre estratégias pré-selecionadas",
      level3: "Seleção e aplicação independente"
    },
    practicalTips: [
      "Praticar quando calmo primeiro",
      "Ter kit sempre disponível",
      "Envolver todos os contextos de vida"
    ],
    theoreticalBasis: "Baseado em modelos de stress e coping (Lazarus & Folkman). A música oferece estratégias de coping acessíveis e socialmente aceitáveis. Fundamenta-se em intervenções cognitivo-comportamentais e mindfulness."
  },
  {
    id: 45,
    title: "Alegria Compartilhada Musical",
    disorder: "TEA",
    demandCategory: "socioemotional",
    generalObjective: "Aumentar experiências de afeto positivo compartilhado através de música alegre",
    specificObjectives: [
      "Experienciar alegria em contexto social",
      "Compartilhar afeto positivo com outros",
      "Expressar alegria de formas variadas",
      "Desenvolver capacidade de prazer social"
    ],
    description: "Crianças com TEA podem ter menos experiências de alegria compartilhada, afetando motivação social. Esta atividade cria deliberadamente momentos de alegria na interação musical. Utilizam-se músicas energéticas, dança, instrumentos divertidos, surpresas musicais agradáveis. O terapeuta expressa alegria abertamente, convidando ao compartilhamento. Celebram-se momentos de alegria conjunta. A experiência positiva fortalece motivação para interação futura. Fotos e vídeos de momentos alegres são mantidos como registro.",
    materials: [
      "Músicas alegres preferidas",
      "Instrumentos divertidos",
      "Materiais para dança",
      "Elementos de surpresa",
      "Câmera para registro"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-14 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Demonstra afeto positivo em sessão",
      "Busca compartilhar alegria",
      "Expressa alegria variadamente",
      "Desenvolve expectativa positiva para sessões"
    ],
    adaptations: {
      level1: "Músicas preferidas, alegria individual aceita",
      level2: "Alegria compartilhada guiada",
      level3: "Co-criação de momentos alegres"
    },
    practicalTips: [
      "Usar preferências genuínas da criança",
      "Não forçar expressão de alegria",
      "Capturar momentos para revisitar"
    ],
    theoreticalBasis: "Fundamenta-se em teoria de motivação social e desenvolvimento de afeto positivo. A música é intrinsecamente prazerosa e oferece contexto para alegria compartilhada. Baseado em modelo Denver (ESDM) e abordagens desenvolvimentais."
  },

  // ==================== MOTOR (13 atividades) ====================
  {
    id: 46,
    title: "Coordenação Bilateral Rítmica",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver coordenação bilateral através de padrões rítmicos que envolvem ambos os lados do corpo",
    specificObjectives: [
      "Executar movimentos simétricos com ritmo",
      "Desenvolver movimentos alternados bilaterais",
      "Melhorar integração entre hemisférios cerebrais",
      "Transferir coordenação para atividades funcionais"
    ],
    description: "Atividades rítmicas que envolvem uso coordenado de ambos os lados do corpo. Inicia-se com movimentos simétricos (bater palmas, bater baquetas juntas) progredindo para alternados (mão direita-esquerda no tambor). Ritmo musical organiza e facilita o movimento. Padrões são progressivamente complexificados: simétrico, alternado, cruzando linha média. Usa-se espelho para feedback visual. Movimentos são praticados em diferentes posições e com diferentes instrumentos. Faz-se ponte para atividades de vida diária que requerem coordenação bilateral.",
    materials: [
      "Baquetas e tambores",
      "Instrumentos que requerem duas mãos",
      "Espelho grande",
      "Músicas com ritmo claro",
      "Faixas de cor para mãos"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Executa movimentos simétricos no ritmo",
      "Alterna lados ritmicamente",
      "Cruza linha média",
      "Transfere para atividades funcionais"
    ],
    adaptations: {
      level1: "Movimentos simétricos, ritmo lento, mão sobre mão",
      level2: "Alternância básica, ritmo moderado",
      level3: "Padrões complexos, variação de ritmo"
    },
    practicalTips: [
      "Começar lentamente, acelerar gradualmente",
      "Usar cores para diferenciar lados",
      "Conectar com vestir-se, comer, escrever"
    ],
    theoreticalBasis: "Baseado em neurociência do desenvolvimento motor e integração bilateral. O ritmo musical facilita coordenação através de entrainment neural. Fundamenta-se em Teoria de Integração Sensorial e neuroplasticidade."
  },
  {
    id: 47,
    title: "Planejamento Motor Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver praxis e planejamento motor através de sequências instrumentais",
    specificObjectives: [
      "Planejar sequência de ações motoras",
      "Executar ações em ordem correta",
      "Adaptar plano quando necessário",
      "Transferir para atividades funcionais"
    ],
    description: "Dispraxia é comum no TEA, afetando capacidade de planejar e executar sequências motoras novas. Esta atividade usa instrumentos para prática de planejamento motor. Apresenta-se sequência de instrumentos/ações (primeiro bater tambor, depois chacoalhar chocalho, depois tocar sino) e a criança executa. Inicia-se com 2 passos, expandindo progressivamente. Suportes visuais mostram sequência. Pratica-se adaptação quando algo não funciona. A música fornece estrutura temporal para o planejamento. Generaliza-se para sequências de vida diária.",
    materials: [
      "Estações com diferentes instrumentos",
      "Cartões de sequência visual",
      "Músicas de acompanhamento",
      "Timer visual",
      "Registro de sequências dominadas"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Executa sequência de 3+ passos",
      "Segue ordem correta",
      "Adapta quando necessário",
      "Generaliza para outras sequências"
    ],
    adaptations: {
      level1: "2 passos, suporte visual constante, ajuda física",
      level2: "3-4 passos, suporte visual, independência",
      level3: "5+ passos, memorização, flexibilidade"
    },
    practicalTips: [
      "Usar mesma estrutura sempre inicialmente",
      "Adicionar passos um de cada vez",
      "Conectar com rotinas de vida diária"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre dispraxia e planejamento motor no TEA. A música oferece estrutura temporal que apoia planejamento. Fundamenta-se em abordagens de terapia ocupacional e integração sensorial."
  },
  {
    id: 48,
    title: "Motricidade Fina Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver habilidades de motricidade fina através de técnicas instrumentais adaptadas",
    specificObjectives: [
      "Melhorar preensão e manipulação de objetos",
      "Desenvolver dissociação de dedos",
      "Aumentar precisão de movimentos finos",
      "Transferir para atividades de escrita e vida diária"
    ],
    description: "Instrumentos musicais oferecem motivação única para prática de motricidade fina. Teclado desenvolve dissociação de dedos, ukulele trabalha preensão e coordenação, flautas de embolo exercitam movimento fino, chocalhos pequenos praticam manipulação. Cada instrumento é adaptado ao nível da criança. Inicia-se com movimentos grosseiros, refinando progressivamente. A música motivadora sustenta prática repetitiva necessária. Exercícios preparatórios (amassar, beliscar, apertar) são incorporados musicalmente. Faz-se ponte para atividades funcionais.",
    materials: [
      "Instrumentos de diferentes demandas motoras",
      "Massinha e materiais de preparação",
      "Teclado ou piano",
      "Instrumentos de dedo",
      "Atividades de pinça musical"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Demonstra preensão adequada",
      "Executa movimentos finos com precisão",
      "Dissocia dedos para diferentes tarefas",
      "Transfere para atividades funcionais"
    ],
    adaptations: {
      level1: "Preensão palmar, instrumentos grandes",
      level2: "Preensão digital, instrumentos médios",
      level3: "Movimentos finos precisos, técnicas avançadas"
    },
    practicalTips: [
      "Começar com instrumentos de alta preferência",
      "Adaptar tamanho e peso de materiais",
      "Conectar com escrita e autocuidado"
    ],
    theoreticalBasis: "Baseado em desenvolvimento motor fino e abordagens de terapia ocupacional. A motivação musical sustenta prática repetitiva necessária para aquisição de habilidades. Fundamenta-se em neuroplasticidade e aprendizagem motora."
  },
  {
    id: 49,
    title: "Marcha e Locomoção Rítmica",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Melhorar padrões de marcha e locomoção através de pistas rítmicas",
    specificObjectives: [
      "Desenvolver marcha coordenada ao ritmo",
      "Variar velocidade e direção",
      "Melhorar equilíbrio dinâmico",
      "Generalizar para locomoção funcional"
    ],
    description: "Baseado na Musicoterapia Neurológica (RAS - Rhythmic Auditory Stimulation), usa-se ritmo para organizar e melhorar padrões de marcha. Inicia-se com caminhada ao ritmo de música/metrônomo, ajustando tempo ao passo natural da criança. Gradualmente modifica-se velocidade, adiciona-se variações (passos grandes/pequenos, parar/andar, mudar direção). Obstáculos são incorporados. Pratica-se em diferentes superfícies. O ritmo fornece pista temporal externa que organiza o movimento. Faz-se ponte para locomoção em ambientes naturais.",
    materials: [
      "Metrônomo ou música ritmada",
      "Marcadores de piso",
      "Obstáculos adaptados",
      "Diferentes superfícies",
      "Espaço amplo"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Marcha coordenada ao ritmo",
      "Varia velocidade conforme música",
      "Muda direção quando sinalizado",
      "Demonstra melhora em equilíbrio"
    ],
    adaptations: {
      level1: "Ritmo adaptado ao passo natural, apoio físico",
      level2: "Variações de velocidade, independência",
      level3: "Padrões complexos, obstáculos, diferentes superfícies"
    },
    practicalTips: [
      "Começar com ritmo do próprio passo",
      "Aumentar desafio muito gradualmente",
      "Praticar em ambientes variados"
    ],
    theoreticalBasis: "Fundamenta-se na Musicoterapia Neurológica (Thaut), especificamente RAS. O ritmo auditivo fornece pista temporal externa que facilita sincronização motora. Baseado em entrainment rítmico-motor e neuroplasticidade."
  },
  {
    id: 50,
    title: "Tônus e Postura Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Melhorar controle postural e regulação de tônus através de atividades musicais",
    specificObjectives: [
      "Desenvolver consciência postural",
      "Modular tônus conforme demanda",
      "Manter postura adequada durante atividades",
      "Generalizar para vida diária"
    ],
    description: "Crianças com TEA frequentemente apresentam alterações de tônus e postura. A música organiza e motiva trabalho postural. Atividades que requerem extensão (levantar instrumentos, dançar com braços para cima) alternam com flexão (encolher, abaixar). Instrumentos pesados trabalham força, leves trabalham controle. Postura é praticada em diferentes posições: sentado, em pé, no chão. Canções sobre 'ficar grandão' e 'ficar pequeno' desenvolvem consciência. A música sustenta manutenção postural por períodos maiores.",
    materials: [
      "Instrumentos de diferentes pesos",
      "Cadeiras e superfícies adequadas",
      "Espelho para feedback",
      "Canções de postura",
      "Materiais para diferentes posições"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Demonstra consciência postural",
      "Modula tônus conforme atividade",
      "Mantém postura por período aumentado",
      "Transfere para atividades diárias"
    ],
    adaptations: {
      level1: "Suporte externo, atividades curtas",
      level2: "Suporte reduzido, atividades moderadas",
      level3: "Postura independente, atividades prolongadas"
    },
    practicalTips: [
      "Alternar atividades de ativação e relaxamento",
      "Usar espelho para consciência",
      "Conectar com postura em sala de aula"
    ],
    theoreticalBasis: "Baseado em desenvolvimento motor e controle postural. A música oferece motivação para manter posturas e organiza atividades de fortalecimento. Fundamenta-se em abordagens neurodesenvolvimentais e integração sensorial."
  },
  {
    id: 51,
    title: "Coordenação Olho-Mão Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver coordenação viso-motora através de atividades instrumentais que requerem precisão visual",
    specificObjectives: [
      "Coordenar informação visual com ação motora",
      "Desenvolver precisão em movimentos guiados visualmente",
      "Rastrear visualmente enquanto move",
      "Transferir para atividades acadêmicas e funcionais"
    ],
    description: "Tocar instrumentos requer coordenação entre o que se vê e o que se faz. Esta atividade trabalha sistematicamente esta integração. Inicia-se com instrumentos grandes/alvos claros (bater no tambor marcado) progredindo para menores/precisos (tocar tecla específica). Pratica-se rastrear baqueta enquanto move, olhar antes de tocar, ajustar movimento conforme feedback visual. Jogos musicais de precisão são incorporados. Faz-se ponte para escrita, recorte, e outras atividades viso-motoras.",
    materials: [
      "Instrumentos de diferentes tamanhos",
      "Alvos visuais",
      "Teclado com teclas marcadas",
      "Jogos de precisão musical",
      "Materiais de tamanhos progressivos"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Acerta alvos com precisão",
      "Rastreia visualmente durante movimento",
      "Ajusta movimento conforme feedback",
      "Transfere para atividades funcionais"
    ],
    adaptations: {
      level1: "Alvos grandes, movimentos grossos",
      level2: "Alvos médios, precisão moderada",
      level3: "Alvos pequenos, alta precisão"
    },
    practicalTips: [
      "Progredir de grande para pequeno",
      "Usar cores contrastantes",
      "Conectar com atividades escolares"
    ],
    theoreticalBasis: "Baseado em desenvolvimento viso-motor e integração sensório-motora. A música oferece motivação para prática repetitiva de precisão. Fundamenta-se em abordagens de terapia ocupacional e aprendizagem motora."
  },
  {
    id: 52,
    title: "Ritmo e Temporização Motora",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver senso de temporização e timing motor através de atividades rítmicas",
    specificObjectives: [
      "Sincronizar movimento com ritmo externo",
      "Manter batida estável",
      "Antecipar momentos de ação",
      "Transferir timing para atividades funcionais"
    ],
    description: "Timing motor é fundamental para coordenação e afeta desde marcha até fala. Esta atividade desenvolve senso de temporização através de ritmo. Inicia-se com sincronização básica: bater junto com música, manter batida. Pratica-se antecipar quando bater (antes do som, não depois). Atividades de 'esperar o momento certo' desenvolvem timing preditivo. Utiliza-se metrônomo para feedback claro. Timing é praticado em diferentes velocidades e com diferentes movimentos. Faz-se ponte para timing em esportes, conversação, atividades diárias.",
    materials: [
      "Metrônomo",
      "Instrumentos de percussão",
      "Músicas com ritmo claro",
      "Jogos de timing",
      "Feedback visual de sincronização"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Sincroniza com ritmo externo",
      "Mantém batida estável por 30+ segundos",
      "Antecipa momento de ação",
      "Demonstra timing em atividades variadas"
    ],
    adaptations: {
      level1: "Ritmo lento, feedback imediato, ajuda física",
      level2: "Ritmos variados, manutenção independente",
      level3: "Ritmos complexos, timing preditivo"
    },
    practicalTips: [
      "Começar com ritmo do próprio corpo",
      "Usar feedback visual junto com auditivo",
      "Conectar com esportes e jogos"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre timing motor e entrainment rítmico. A música oferece pista temporal externa que organiza movimento. Baseado em Musicoterapia Neurológica e neurociência do ritmo."
  },
  {
    id: 53,
    title: "Força e Controle Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver controle de força e gradação de movimento através de dinâmicas musicais",
    specificObjectives: [
      "Modular força conforme demanda",
      "Desenvolver consciência de gradações de força",
      "Controlar intensidade de movimento",
      "Aplicar controle de força funcionalmente"
    ],
    description: "Crianças com TEA frequentemente têm dificuldade em modular força, sendo muito fortes ou muito fracas. A música oferece contexto natural para trabalho de dinâmica. Pratica-se tocar forte (ff), fraco (pp), e gradações intermediárias. Crescendos e decrescendos desenvolvem modulação gradual. A criança aprende a 'sentir' quanta força está usando. Transfere-se para atividades funcionais: segurar lápis, abraçar, carregar objetos. Usa-se feedback visual (quanto o instrumento vibra) e verbal para consciência.",
    materials: [
      "Instrumentos sensíveis a dinâmica",
      "Escalas visuais de força",
      "Materiais de diferentes resistências",
      "Músicas com dinâmicas variadas",
      "Objetos para gradação de força"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Diferencia entre forte e fraco",
      "Demonstra gradações intermediárias",
      "Controla intensidade conforme demanda",
      "Aplica a atividades funcionais"
    ],
    adaptations: {
      level1: "Contrastes extremos apenas",
      level2: "3-4 níveis de intensidade",
      level3: "Gradações sutis, modulação fluida"
    },
    practicalTips: [
      "Usar instrumentos muito responsivos à dinâmica",
      "Conectar com atividades de vida diária",
      "Praticar em diferentes contextos"
    ],
    theoreticalBasis: "Baseado em controle motor e propriocepção. A música oferece feedback imediato sobre força aplicada. Fundamenta-se em abordagens de integração sensorial e aprendizagem motora."
  },
  {
    id: 54,
    title: "Imitação Motora Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver habilidades de imitação motora através de sequências musicais modeladas",
    specificObjectives: [
      "Imitar movimentos demonstrados",
      "Aumentar complexidade de imitação",
      "Desenvolver imitação diferida",
      "Generalizar para aprendizagem observacional"
    ],
    description: "Imitação é fundamental para aprendizagem e frequentemente alterada no TEA. A música oferece contexto motivador para prática de imitação. O terapeuta demonstra sequência rítmica/movimento e criança imita. Inicia-se com imitação simultânea (fazer junto), progredindo para diferida (fazer depois). Complexidade aumenta gradualmente: um movimento, depois dois, depois sequência. Usa-se espelhamento invertido quando necessário. A música fornece estrutura temporal para a imitação. Faz-se ponte para imitação em aprendizagem geral.",
    materials: [
      "Espelho",
      "Instrumentos variados",
      "Vídeos de modelagem",
      "Sequências progressivas",
      "Registro de padrões dominados"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-10 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Imita movimentos simples",
      "Reproduz sequências de 3+ passos",
      "Demonstra imitação diferida",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "Imitação simultânea, ajuda física, um movimento",
      level2: "Imitação diferida curta, 2-3 movimentos",
      level3: "Imitação diferida longa, sequências complexas"
    },
    practicalTips: [
      "Usar movimentos motivadores",
      "Celebrar toda tentativa",
      "Conectar com aprendizagem acadêmica"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre neurônios-espelho e imitação no TEA. A música oferece motivação e estrutura temporal para imitação. Fundamenta-se em abordagens desenvolvimentais (ESDM) e aprendizagem motora."
  },
  {
    id: 55,
    title: "Cruzamento de Linha Média Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver integração bilateral através de atividades que cruzam a linha média do corpo",
    specificObjectives: [
      "Cruzar linha média espontaneamente",
      "Integrar movimentos de ambos os hemisférios",
      "Desenvolver dominância lateral",
      "Transferir para atividades funcionais"
    ],
    description: "Cruzar linha média é marco desenvolvimental importante para escrita e atividades bilaterais. Esta atividade usa música para motivar cruzamento. Instrumentos são colocados estrategicamente para exigir alcance cruzado. Danças incluem movimentos que cruzam (tocar ombro oposto, bater palmas em diagonal). Padrões rítmicos em xilofone exigem mão cruzar. A criança pode inicialmente virar o corpo para evitar cruzar; isso é gradualmente moldado. A música sustenta repetição necessária para automatização.",
    materials: [
      "Xilofone ou metalofone",
      "Instrumentos posicionados lateralmente",
      "Danças com cruzamento",
      "Faixas de cor para hemisférios",
      "Marcadores de linha média"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-10 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Cruza linha média espontaneamente",
      "Não rota corpo para evitar",
      "Realiza atividades bilaterais fluidas",
      "Transfere para escrita e vida diária"
    ],
    adaptations: {
      level1: "Cruzamento mínimo, posicionamento facilitado",
      level2: "Cruzamento moderado, independência",
      level3: "Cruzamento amplo, padrões complexos"
    },
    practicalTips: [
      "Posicionar objetos para exigir cruzamento",
      "Não forçar se houver resistência forte",
      "Conectar com atividades de escrita"
    ],
    theoreticalBasis: "Baseado em desenvolvimento da lateralidade e integração inter-hemisférica. A música oferece motivação para repetição de cruzamentos. Fundamenta-se em Teoria de Integração Sensorial e desenvolvimento motor."
  },
  {
    id: 56,
    title: "Relaxamento Musical Progressivo",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver capacidade de relaxamento corporal através de técnicas musicais guiadas",
    specificObjectives: [
      "Identificar tensão corporal",
      "Relaxar grupos musculares progressivamente",
      "Usar música para induzir relaxamento",
      "Aplicar em situações de stress"
    ],
    description: "Muitas crianças com TEA vivem em estado de tensão crônica. Esta atividade ensina relaxamento progressivo com suporte musical. Música calma e previsível acompanha a sequência: tensionar e relaxar cada grupo muscular, do rosto aos pés. Imagens musicais guiam o processo ('Suas mãos estão macias como música suave'). A criança desenvolve consciência de tensão versus relaxamento. Pratica-se em ambiente ideal, depois em situações progressivamente mais desafiadoras. Desenvolve-se playlist pessoal de relaxamento para uso independente.",
    materials: [
      "Música calma selecionada",
      "Colchonete confortável",
      "Iluminação suave",
      "Scripts de relaxamento",
      "Fones de ouvido opcionais"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "5-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Identifica tensão em seu corpo",
      "Relaxa músculos quando guiado",
      "Demonstra relaxamento observável",
      "Usa técnica independentemente"
    ],
    adaptations: {
      level1: "Relaxamento passivo, música apenas",
      level2: "Técnica guiada, consciência desenvolvida",
      level3: "Auto-aplicação, situações variadas"
    },
    contraindications: [
      "Não forçar relaxamento em momento de agitação intensa"
    ],
    practicalTips: [
      "Começar em momento já calmo",
      "Usar tom de voz suave",
      "Ter playlist disponível para casa"
    ],
    theoreticalBasis: "Baseado em técnica de Relaxamento Progressivo de Jacobson adaptada. A música adiciona dimensão sensorial que facilita relaxamento. Fundamenta-se em regulação autonômica e mindfulness."
  },
  {
    id: 57,
    title: "Consciência Espacial Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver percepção espacial e navegação através de atividades musicais dinâmicas",
    specificObjectives: [
      "Desenvolver consciência de espaço pessoal",
      "Navegar em espaço de forma organizada",
      "Estimar distâncias e tamanhos",
      "Respeitar espaço de outros"
    ],
    description: "Consciência espacial afeta desde locomoção até interação social. Esta atividade usa música e movimento para desenvolver percepção espacial. Marcadores no chão criam 'estações' musicais para navegação. A criança dança respeitando limites, aproxima-se e afasta-se conforme indicado pela música, estima distâncias para instrumentos. Pratica-se noção de perto/longe, grande/pequeno, em cima/embaixo através de movimento musical. Espaço pessoal é trabalhado através de dança em grupo controlada.",
    materials: [
      "Marcadores de espaço",
      "Instrumentos distribuídos no espaço",
      "Músicas com indicações espaciais",
      "Obstáculos para navegação",
      "Materiais de diferentes tamanhos"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Navega sem esbarrar",
      "Estima distâncias apropriadamente",
      "Respeita espaço pessoal",
      "Segue indicações espaciais na música"
    ],
    adaptations: {
      level1: "Espaço amplo, poucos obstáculos",
      level2: "Espaço moderado, navegação estruturada",
      level3: "Espaço complexo, navegação social"
    },
    practicalTips: [
      "Usar cores para demarcar áreas",
      "Conectar com navegação em escola/casa",
      "Praticar em diferentes ambientes"
    ],
    theoreticalBasis: "Baseado em desenvolvimento de percepção espacial e integração vestibular-proprioceptiva. A música organiza movimento no espaço. Fundamenta-se em Teoria de Integração Sensorial e desenvolvimento motor."
  },
  {
    id: 58,
    title: "Expressão Corporal Musical",
    disorder: "TEA",
    demandCategory: "motor",
    generalObjective: "Desenvolver capacidade de expressão através do corpo com suporte musical",
    specificObjectives: [
      "Expressar emoções através do movimento",
      "Desenvolver repertório de gestos expressivos",
      "Conectar música com expressão corporal",
      "Aumentar consciência de comunicação não-verbal"
    ],
    description: "Expressão corporal é frequentemente limitada no TEA, afetando comunicação não-verbal. Esta atividade usa música para eliciar e desenvolver expressão através do corpo. Diferentes músicas inspiram diferentes movimentos: música lenta para movimentos fluidos, música enérgica para movimentos vigorosos. A criança experimenta mover-se como a música 'pede'. Emparelhamento música-movimento desenvolve repertório expressivo. Pratica-se gestos comunicativos específicos (acenar, encolher ombros). A música oferece estrutura e permissão para movimento expressivo.",
    materials: [
      "Músicas de diferentes qualidades expressivas",
      "Espaço amplo para movimento",
      "Espelho",
      "Vídeos de movimento expressivo",
      "Materiais para ampliar movimento"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Move-se de acordo com caráter da música",
      "Demonstra variedade de qualidades de movimento",
      "Usa gestos expressivos apropriadamente",
      "Transfere para comunicação não-verbal"
    ],
    adaptations: {
      level1: "Imitação de movimentos, gestos básicos",
      level2: "Expressão guiada pela música",
      level3: "Expressão livre, improvisação de movimento"
    },
    practicalTips: [
      "Começar com movimentos estruturados",
      "Usar espelho para consciência",
      "Não julgar qualidade estética"
    ],
    theoreticalBasis: "Baseado em teorias de expressão corporal e comunicação não-verbal. A música oferece 'permissão' para movimento expressivo. Fundamenta-se em abordagens de movimento criativo e DMT (Dança/Movimento Terapia)."
  },

  // ==================== COGNITIVO (12 atividades) ====================
  {
    id: 59,
    title: "Memória Auditiva Sequencial",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver memória de trabalho auditiva através de sequências musicais progressivas",
    specificObjectives: [
      "Reter sequências sonoras de tamanho crescente",
      "Reproduzir padrões rítmicos e melódicos",
      "Desenvolver memória para instruções verbais",
      "Transferir para contextos acadêmicos"
    ],
    description: "Memória auditiva é fundamental para linguagem e aprendizagem. Esta atividade trabalha retenção auditiva através de música. Inicia-se com sequências curtas (2-3 sons/notas) que a criança reproduz. Gradualmente aumenta-se o comprimento. Diferentes tipos de sequências são trabalhados: rítmicas (padrões de batida), melódicas (sequências de notas), verbais (instruções cantadas). Usa-se jogo tipo 'Simon' musical. A criança desenvolve estratégias de memorização. Faz-se ponte para seguir instruções e memória acadêmica.",
    materials: [
      "Instrumentos de diferentes timbres",
      "Jogos de memória sonora",
      "Sequências gravadas",
      "Cartões de apoio visual opcional",
      "Registro de progresso"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Reproduz sequências de 4+ elementos",
      "Retém diferentes tipos de informação auditiva",
      "Segue instruções de múltiplos passos",
      "Demonstra estratégias de memorização"
    ],
    adaptations: {
      level1: "2 elementos, apoio visual, repetição múltipla",
      level2: "3-4 elementos, suporte reduzido",
      level3: "5+ elementos, variação, sem apoio visual"
    },
    practicalTips: [
      "Usar ritmos e melodias motivadoras",
      "Ensinar estratégias de chunking",
      "Conectar com instruções escolares"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre memória de trabalho e processamento auditivo. A música oferece estrutura para retenção e estratégias como chunking musical. Fundamenta-se em neurociência cognitiva e música."
  },
  {
    id: 60,
    title: "Atenção Sustentada Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver capacidade de manter atenção por períodos progressivamente maiores através de engajamento musical",
    specificObjectives: [
      "Aumentar duração de atenção focada",
      "Resistir a distrações durante atividade",
      "Desenvolver auto-monitoramento de atenção",
      "Transferir para contextos acadêmicos"
    ],
    description: "A música oferece engajamento intrínseco que suporta atenção sustentada. Atividades são estruturadas para manter atenção por períodos crescentes. Inicia-se com duração tolerável para a criança, aumentando gradualmente. Introduzem-se distratores progressivamente para desenvolver resistência. A criança é ensinada a perceber quando 'saiu' e retornar. Timer visual mostra progresso. Intervalos estruturados previnem fadiga. A natureza temporal da música mantém fluxo de atenção. Faz-se ponte para atenção em sala de aula.",
    materials: [
      "Atividades musicais de durações progressivas",
      "Timer visual",
      "Distratores controlados",
      "Sistema de reforçamento",
      "Registro de duração"
    ],
    estimatedTime: "25-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Mantém atenção por período-alvo",
      "Resiste a distratores",
      "Auto-monitora e retorna quando desvia",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "Períodos curtos, sem distratores, reforço frequente",
      level2: "Períodos moderados, distratores leves",
      level3: "Períodos longos, distratores naturais"
    },
    practicalTips: [
      "Começar com duração já tolerada",
      "Aumentar muito gradualmente",
      "Celebrar cada aumento de duração"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre atenção e engajamento no TEA. A música oferece motivação intrínseca que suporta atenção. Fundamenta-se em intervenções comportamentais e neurociência da atenção."
  },
  {
    id: 61,
    title: "Flexibilidade Cognitiva Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver flexibilidade mental através de variações e mudanças em estruturas musicais familiares",
    specificObjectives: [
      "Tolerar mudanças em padrões familiares",
      "Adaptar resposta a regras que mudam",
      "Desenvolver set-shifting musical",
      "Generalizar para outras situações de mudança"
    ],
    description: "Rigidez cognitiva é característica central do TEA. Esta atividade usa música para praticar flexibilidade de forma segura e motivadora. Inicia-se com estruturas musicais previsíveis que são gradualmente modificadas. A criança pratica adaptar-se a mudanças: música familiar tocada em velocidade diferente, regra de jogo que muda, instrumento substituído. Mudanças são antecipadas inicialmente, depois introduzidas com menos aviso. A capacidade de 'mudar de marcha' é celebrada. Faz-se ponte para transições e mudanças de rotina.",
    materials: [
      "Músicas familiares para variação",
      "Jogos musicais com regras mutáveis",
      "Sinalizadores de mudança",
      "Escala de flexibilidade",
      "Situações de vida para discussão"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Tolera mudanças em música familiar",
      "Adapta-se a regras novas",
      "Demonstra set-shifting melhorado",
      "Generaliza flexibilidade"
    ],
    adaptations: {
      level1: "Mudanças mínimas, muito aviso, retorno rápido",
      level2: "Mudanças moderadas, aviso reduzido",
      level3: "Mudanças significativas, adaptação fluida"
    },
    contraindications: [
      "Não forçar em momento de rigidez intensa"
    ],
    practicalTips: [
      "Começar com mudanças minúsculas",
      "Validar desconforto com mudanças",
      "Celebrar toda adaptação"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre função executiva e flexibilidade no TEA. A música oferece contexto seguro para prática de adaptação. Baseado em intervenções de função executiva e exposição gradual."
  },
  {
    id: 62,
    title: "Resolução de Problemas Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver habilidades de resolução de problemas através de desafios musicais estruturados",
    specificObjectives: [
      "Identificar problema ou objetivo",
      "Gerar possíveis soluções",
      "Testar e avaliar soluções",
      "Aplicar processo a outros contextos"
    ],
    description: "Resolução de problemas é frequentemente desafiadora no TEA devido à rigidez. Esta atividade cria problemas musicais motivadores. Exemplos: como fazer música suave (experimentar diferentes técnicas), como tocar duas coisas ao mesmo tempo (explorar soluções), como criar o som de trovão. A criança é guiada através do processo: (1) O que queremos? (2) O que podemos tentar? (3) Funcionou? (4) O que mais podemos tentar? A música oferece feedback imediato sobre soluções. Faz-se ponte para problemas de vida diária.",
    materials: [
      "Desafios musicais estruturados",
      "Variedade de instrumentos",
      "Cartões de passos de resolução",
      "Problemas de vida diária para discussão",
      "Registro de soluções encontradas"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "5-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Identifica problema claramente",
      "Gera múltiplas possibilidades",
      "Testa e avalia soluções",
      "Aplica processo a novos problemas"
    ],
    adaptations: {
      level1: "Problemas simples, soluções oferecidas, escolha",
      level2: "Geração guiada de soluções",
      level3: "Resolução independente, problemas complexos"
    },
    practicalTips: [
      "Usar problemas genuinamente interessantes",
      "Celebrar tentativas, não só soluções",
      "Conectar com problemas reais"
    ],
    theoreticalBasis: "Baseado em teorias de resolução de problemas e função executiva. A música oferece problemas motivadores com feedback imediato. Fundamenta-se em abordagens cognitivo-comportamentais e ensino de habilidades."
  },
  {
    id: 63,
    title: "Categorização e Classificação Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver habilidades de categorização através de organização de elementos musicais",
    specificObjectives: [
      "Agrupar sons/instrumentos por atributos",
      "Identificar critérios de classificação",
      "Aplicar múltiplos critérios",
      "Transferir para categorização conceitual"
    ],
    description: "Categorização é habilidade cognitiva fundamental para organização do pensamento. Esta atividade usa instrumentos e sons para prática de classificação. A criança organiza instrumentos por: tamanho (grande/pequeno), material (madeira/metal), som (alto/baixo), forma de tocar (bater/soprar/dedilhar). Múltiplos critérios são explorados: o mesmo instrumento pode estar em diferentes grupos. Pratica-se identificar O QUE faz algo pertencer a um grupo. Faz-se ponte para categorização em contextos acadêmicos e vida diária.",
    materials: [
      "Variedade de instrumentos para classificar",
      "Cestos ou áreas de categorias",
      "Cartões de critérios",
      "Diagramas de Venn musicais",
      "Materiais não-musicais para generalização"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "4-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Agrupa por critério dado",
      "Identifica critério usado",
      "Reclassifica por critério diferente",
      "Aplica a conceitos não-musicais"
    ],
    adaptations: {
      level1: "Dois grupos, critério concreto, apoio visual",
      level2: "Múltiplos grupos, critérios variados",
      level3: "Critérios abstratos, múltipla classificação"
    },
    practicalTips: [
      "Começar com critérios perceptualmente claros",
      "Usar interesses da criança quando possível",
      "Conectar com organização do ambiente"
    ],
    theoreticalBasis: "Baseado em desenvolvimento cognitivo e formação de conceitos. A música oferece material concreto para categorização. Fundamenta-se em teorias de categorização e pensamento abstrato."
  },
  {
    id: 64,
    title: "Sequenciamento e Ordem Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver compreensão de sequências e ordem temporal através de estruturas musicais",
    specificObjectives: [
      "Compreender conceitos de primeiro/depois/último",
      "Ordenar eventos em sequência",
      "Prever o que vem a seguir",
      "Aplicar a rotinas e narrativas"
    ],
    description: "Música é inerentemente temporal e sequencial. Esta atividade usa essa característica para ensinar sequenciamento. Canções estruturadas apresentam sequências claras ('Primeiro a gente bate palmas, depois a gente pula, então a gente gira'). A criança ordena cartões de instrumentos na sequência que tocará. Pratica-se prever o que vem depois em músicas familiares. Histórias musicais desenvolvem sequenciamento narrativo. Faz-se ponte para sequência de rotinas, instruções de múltiplos passos, narrativa.",
    materials: [
      "Canções de sequência",
      "Cartões de ordenação",
      "Instrumentos para sequenciamento",
      "Timer visual",
      "Histórias sequenciais musicadas"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Usa vocabulário temporal (primeiro, depois)",
      "Ordena 3+ eventos corretamente",
      "Prediz próximo passo em sequência",
      "Aplica a rotinas e instruções"
    ],
    adaptations: {
      level1: "2 passos, suporte visual forte",
      level2: "3-4 passos, suporte moderado",
      level3: "5+ passos, sequências complexas"
    },
    practicalTips: [
      "Usar sequências funcionais (rotinas)",
      "Incorporar interesses da criança",
      "Conectar com vida diária"
    ],
    theoreticalBasis: "Fundamenta-se em desenvolvimento de noção temporal e sequenciamento. A música oferece estrutura temporal explícita. Baseado em abordagens de TEACCH e ensino estruturado."
  },
  {
    id: 65,
    title: "Causa e Efeito Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver compreensão de relações causais através de experiências musicais de causa-efeito",
    specificObjectives: [
      "Compreender que ações causam resultados",
      "Prever efeitos de ações",
      "Experimentar para descobrir efeitos",
      "Aplicar raciocínio causal a situações sociais"
    ],
    description: "Compreensão de causa-efeito é fundamental para aprendizagem e interação social. Instrumentos musicais oferecem relação causa-efeito clara e imediata: apertar tecla produz som, bater produz batida, soprar produz nota. Esta atividade explora e explicita essas relações. A criança experimenta diferentes ações e observa resultados. Pratica-se prever: 'O que vai acontecer se eu tocar forte?'. Gradualmente, raciocínio causal é aplicado a situações sociais: 'O que acontece quando você grita com alguém?'.",
    materials: [
      "Instrumentos de causa-efeito claro",
      "Brinquedos musicais de causa-efeito",
      "Cartões de se/então",
      "Situações sociais para discussão",
      "Experimentos musicais"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "2-10 anos",
    complexityLevel: "basic",
    evaluationCriteria: [
      "Demonstra compreensão de causa-efeito",
      "Prediz resultado de ações",
      "Experimenta para descobrir",
      "Aplica a situações sociais básicas"
    ],
    adaptations: {
      level1: "Causa-efeito imediato e direto",
      level2: "Relações menos óbvias, predição",
      level3: "Causa-efeito social, consequências abstratas"
    },
    practicalTips: [
      "Usar instrumentos com resposta imediata",
      "Explicitar verbalmente as relações",
      "Conectar com consequências de comportamento"
    ],
    theoreticalBasis: "Baseado em desenvolvimento cognitivo e aprendizagem operante. A música oferece relação causa-efeito clara e motivadora. Fundamenta-se em teorias de contingência e pensamento lógico."
  },
  {
    id: 66,
    title: "Atenção Conjunta Cognitiva",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver capacidade de compartilhar foco atencional para aprendizagem através da música",
    specificObjectives: [
      "Seguir direcionamento de atenção do outro",
      "Direcionar atenção do outro para objeto de interesse",
      "Manter atenção compartilhada durante atividade",
      "Aprender através de referência social"
    ],
    description: "Atenção conjunta é pré-requisito para aprendizagem social e acadêmica. Esta atividade desenvolve especificamente a capacidade de compartilhar foco cognitivo. Durante atividades musicais, pratica-se: seguir apontamento do terapeuta para instrumento, apontar para compartilhar descoberta, verificar se o outro está olhando antes de mostrar algo, aprender observando. A música cria objetos de atenção intrinsecamente interessantes. O terapeuta modela direcionamento de atenção e responde prontamente às iniciativas da criança.",
    materials: [
      "Instrumentos interessantes",
      "Objetos musicais novos",
      "Atividades que requerem coordenação",
      "Sistema de registro de episódios",
      "Materiais para generalização"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "2-8 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Segue direcionamento de atenção",
      "Direciona atenção do outro",
      "Mantém foco compartilhado",
      "Demonstra aprendizagem observacional"
    ],
    adaptations: {
      level1: "Resposta ao direcionamento, objetos de alto interesse",
      level2: "Iniciação de atenção compartilhada",
      level3: "Aprendizagem através de observação fluida"
    },
    practicalTips: [
      "Usar objetos genuinamente interessantes",
      "Responder imediatamente às iniciativas",
      "Celebrar compartilhamento de atenção"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre atenção conjunta como precursor de linguagem e cognição social. A música oferece objetos de atenção motivadores. Baseado em modelos desenvolvimentais (JASPER, ESDM)."
  },
  {
    id: 67,
    title: "Pensamento Abstrato Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver capacidade de pensamento abstrato através de conceitos musicais",
    specificObjectives: [
      "Compreender conceitos abstratos através de música",
      "Fazer generalizações e transferências",
      "Pensar em termos de categorias e relações",
      "Aplicar pensamento abstrato a novas situações"
    ],
    description: "Pensamento abstrato é frequentemente desafiador no TEA. A música oferece via para abstração através de conceitos como: intensidade (forte/fraco aplicado a emoções), velocidade (rápido/lento aplicado a tempo), altura (alto/baixo aplicado a conceitos espaciais). Pratica-se aplicar conceitos musicais a domínios não-musicais. Metáforas musicais são exploradas. A criança desenvolve capacidade de pensar 'sobre' música (metacognição). Faz-se ponte para pensamento abstrato acadêmico e social.",
    materials: [
      "Instrumentos para demonstrar conceitos",
      "Materiais para transferência",
      "Cartões de conceitos",
      "Situações para aplicação",
      "Exemplos de metáforas"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Compreende conceitos abstratos musicais",
      "Aplica conceitos a novos domínios",
      "Demonstra pensamento metacognitivo",
      "Faz generalizações apropriadas"
    ],
    adaptations: {
      level1: "Conceitos concretos apenas",
      level2: "Transferência guiada para outros domínios",
      level3: "Pensamento abstrato independente"
    },
    practicalTips: [
      "Começar com conceitos com base sensorial",
      "Usar múltiplos exemplos de cada conceito",
      "Conectar com currículo acadêmico"
    ],
    theoreticalBasis: "Baseado em teorias de desenvolvimento cognitivo e abstração. A música oferece via alternativa para pensamento abstrato. Fundamenta-se em abordagens Vygotskyanas e desenvolvimento de conceitos científicos."
  },
  {
    id: 68,
    title: "Inibição e Controle Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver controle inibitório através de jogos musicais de parar/iniciar",
    specificObjectives: [
      "Inibir resposta quando sinalizado",
      "Esperar antes de agir",
      "Parar ação em andamento",
      "Aplicar controle a situações cotidianas"
    ],
    description: "Controle inibitório é função executiva frequentemente alterada no TEA. Jogos musicais de 'estátua' e similares oferecem prática motivadora. A criança toca/dança quando há música, para completamente quando para. Gradualmente aumenta-se desafio: parar mais rápido, parar com menos aviso, parar na posição em que estava. Pratica-se também 'esperar para começar': aguardar o sinal antes de iniciar. A música oferece contraste claro entre 'pode agir' e 'não pode agir'. Faz-se ponte para auto-controle em sala de aula e interações.",
    materials: [
      "Músicas para parar/iniciar",
      "Timer visual",
      "Jogos de estátua musical",
      "Sinalizadores claros",
      "Sistema de pontuação lúdico"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Para quando música para",
      "Espera sinal para iniciar",
      "Demonstra tempo de resposta melhorado",
      "Aplica controle em outras situações"
    ],
    adaptations: {
      level1: "Paradas longas, sinais claros",
      level2: "Paradas rápidas, menos aviso",
      level3: "Paradas súbitas, alto desafio"
    },
    practicalTips: [
      "Tornar lúdico, não punitivo",
      "Celebrar todo sucesso",
      "Conectar com situações reais"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre função executiva e controle inibitório. A música oferece sinais claros e motivação para prática de inibição. Baseado em jogos tradicionais com fundamentação em neurociência."
  },
  {
    id: 69,
    title: "Generalização e Transferência Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver capacidade de generalizar aprendizagens musicais para outros contextos",
    specificObjectives: [
      "Aplicar habilidade aprendida em contexto novo",
      "Reconhecer similaridades entre situações",
      "Transferir estratégia de um domínio para outro",
      "Demonstrar flexibilidade na aplicação"
    ],
    description: "Dificuldade de generalização é característica do TEA. Esta atividade trabalha explicitamente a transferência de aprendizagens. Habilidades são ensinadas no contexto musical e sistematicamente praticadas em outros contextos. Exemplo: esperar turno na música → esperar turno em jogo → esperar turno em conversação. Similaridades entre situações são explicitadas verbalmente. A criança é ensinada a perguntar 'Onde mais posso usar isso?'. Sucessos de generalização são celebrados e documentados.",
    materials: [
      "Atividades musicais de habilidades-alvo",
      "Contextos variados para prática",
      "Cartões de 'onde mais'",
      "Registro de generalização",
      "Situações de vida real"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Aplica habilidade em contexto novo",
      "Identifica similaridades entre situações",
      "Transfere estratégias espontaneamente",
      "Demonstra flexibilidade"
    ],
    adaptations: {
      level1: "Contextos muito similares, muita ajuda",
      level2: "Contextos diferentes, ajuda moderada",
      level3: "Generalização espontânea para contextos distantes"
    },
    practicalTips: [
      "Explicitar sempre a transferência",
      "Praticar em múltiplos contextos desde início",
      "Envolver família e escola"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre dificuldades de generalização no TEA e estratégias para promovê-la. A música oferece contexto motivador de aprendizagem inicial. Fundamenta-se em princípios de ABA e ensino de generalização."
  },
  {
    id: 70,
    title: "Planejamento e Organização Musical",
    disorder: "TEA",
    demandCategory: "cognitive",
    generalObjective: "Desenvolver habilidades de planejamento e organização através de projetos musicais",
    specificObjectives: [
      "Planejar sequência de ações para objetivo",
      "Organizar materiais necessários",
      "Executar plano com monitoramento",
      "Avaliar resultado e ajustar"
    ],
    description: "Planejamento é função executiva crucial para autonomia. Esta atividade usa projetos musicais para desenvolver essas habilidades. Exemplo: planejar uma apresentação simples envolve decidir música, escolher instrumentos, organizar materiais, ensaiar, apresentar, avaliar. Cada projeto é quebrado em passos visíveis. A criança participa de criar o plano, não só seguir. Monitora-se progresso contra o plano. Após execução, avalia-se: o que funcionou? O que fazer diferente? Faz-se ponte para planejamento de tarefas escolares e de vida.",
    materials: [
      "Templates de planejamento visual",
      "Materiais para projeto musical",
      "Checklist de passos",
      "Timer visual",
      "Sistema de avaliação"
    ],
    estimatedTime: "40-50 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Contribui para criação do plano",
      "Segue plano com monitoramento",
      "Identifica quando sair do plano",
      "Avalia resultado e sugere melhorias"
    ],
    adaptations: {
      level1: "Planos de 2-3 passos, alta estrutura",
      level2: "Planos moderados, co-criação",
      level3: "Planejamento independente, projetos complexos"
    },
    practicalTips: [
      "Começar com projetos curtos e garantidos",
      "Visualizar o plano claramente",
      "Celebrar a conclusão de cada passo"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre função executiva e planejamento. A música oferece projetos intrinsecamente motivadores. Baseado em abordagens de auto-regulação e ensino de estratégias metacognitivas."
  },

  // ==================== COMPORTAMENTO (10 atividades) ====================
  {
    id: 71,
    title: "Redução de Estereotipias com Música",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Oferecer alternativa musical funcional para comportamentos estereotipados",
    specificObjectives: [
      "Canalizar movimento estereotipado para função musical",
      "Aumentar comportamentos alternativos incompatíveis",
      "Desenvolver consciência dos comportamentos",
      "Generalizar para outros contextos"
    ],
    description: "Em vez de eliminar estereotipias (que podem ter função reguladora), esta atividade oferece alternativas funcionais. Movimentos repetitivos são direcionados para instrumentos: balanço de corpo para tambor, flapping para chocalho, vocalizações para canto. A música legitima o movimento, transformando-o em contribuição musical. Gradualmente, desenvolve-se flexibilidade: variar o movimento, controlar quando fazê-lo. A criança desenvolve consciência e algum controle sobre comportamentos. Comportamento alternativos incompatíveis são reforçados.",
    materials: [
      "Instrumentos que canalizam movimentos específicos",
      "Músicas estruturadas para incorporação",
      "Estratégias visuais",
      "Objetos sensoriais alternativos",
      "Sistema de registro"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Canaliza movimento para instrumento",
      "Demonstra algum controle sobre comportamento",
      "Usa alternativas em outros contextos",
      "Demonstra consciência do comportamento"
    ],
    adaptations: {
      level1: "Aceitar e canalizar sem demanda de mudança",
      level2: "Introduzir variação e timing",
      level3: "Controle voluntário, alternativas em múltiplos contextos"
    },
    contraindications: [
      "Não punir ou restringir comportamentos autorreguladores"
    ],
    practicalTips: [
      "Respeitar função do comportamento",
      "Oferecer alternativas, não proibir",
      "Trabalhar com, não contra"
    ],
    theoreticalBasis: "Baseado em análise funcional do comportamento e intervenções baseadas em função. A música oferece via socialmente aceita para movimentos repetitivos. Fundamenta-se em ABA contemporânea e abordagens neurodiversas."
  },
  {
    id: 72,
    title: "Transições Comportamentais Musicais",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Facilitar transições comportamentais usando música como ponte e sinalização",
    specificObjectives: [
      "Antecipar transições através de sinais musicais",
      "Completar atividade atual de forma organizada",
      "Iniciar nova atividade sem comportamento problemático",
      "Generalizar para transições naturais"
    ],
    description: "Transições são gatilhos frequentes de comportamento problemático no TEA. Esta atividade cria sistema musical de transição. Música específica sinaliza 'faltam 2 minutos', outra sinaliza 'hora de parar', outra sinaliza 'nova atividade começando'. A previsibilidade musical reduz ansiedade. Pratica-se sequência completa: aviso, término organizado, transição, início de nova atividade. Usa-se música preferida durante transição como regulador. Faz-se ponte para transições em casa, escola, comunidade.",
    materials: [
      "Músicas de transição específicas",
      "Timer visual sincronizado",
      "Roteiro visual de transição",
      "Músicas reguladoras preferidas",
      "Sistema para outros contextos"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Responde a sinais musicais de transição",
      "Conclui atividade quando sinalizado",
      "Transita sem comportamento problemático",
      "Usa sistema em outros contextos"
    ],
    adaptations: {
      level1: "Avisos longos, transição muito estruturada",
      level2: "Avisos moderados, alguma flexibilidade",
      level3: "Transições rápidas, generalização ampla"
    },
    practicalTips: [
      "Manter músicas consistentes",
      "Dar tempo adequado para processar",
      "Treinar todas as pessoas do ambiente"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre dificuldades de transição no TEA e suportes antecipatórios. A música oferece sinalização clara e regulação durante transição. Baseado em TEACCH e análise de antecedentes."
  },
  {
    id: 73,
    title: "Contingência e Consequências Musicais",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Ensinar relação comportamento-consequência através de contingências musicais claras",
    specificObjectives: [
      "Compreender que comportamento produz consequência",
      "Antecipar consequências de ações",
      "Modificar comportamento com base em consequências",
      "Generalizar aprendizagem"
    ],
    description: "A música oferece contingências naturais e imediatas. Tocar instrumento produz som (reforço natural). Esta atividade explicita e ensina relações comportamento-consequência. Se tocar gentilmente → som bonito; se bater forte demais → som desagradável. Se esperar a vez → pode tocar; se não esperar → precisa esperar mais. Consequências são naturais e não punitivas. Gradualmente, faz-se ponte para consequências sociais e de vida: 'Assim como na música, quando você compartilha, o amigo quer brincar mais'.",
    materials: [
      "Instrumentos com feedback claro",
      "Cartões de se/então",
      "Situações de vida para discussão",
      "Sistema de consequências visuais",
      "Histórias de consequências"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-12 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Demonstra compreensão de contingências",
      "Antecipa consequências",
      "Modifica comportamento",
      "Aplica a situações sociais"
    ],
    adaptations: {
      level1: "Consequências imediatas e óbvias",
      level2: "Consequências menos imediatas",
      level3: "Consequências sociais abstratas"
    },
    practicalTips: [
      "Usar consequências naturais, não artificiais",
      "Manter consistência",
      "Conectar com vida real"
    ],
    theoreticalBasis: "Baseado em análise comportamental aplicada e teoria de contingência. A música oferece consequências naturais e imediatas. Fundamenta-se em princípios de reforço e aprendizagem operante."
  },
  {
    id: 74,
    title: "Tolerância à Espera Musical",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Desenvolver capacidade de esperar através de estruturas musicais com atraso de reforçamento",
    specificObjectives: [
      "Tolerar espera por períodos progressivos",
      "Usar estratégias durante a espera",
      "Manter regulação enquanto espera",
      "Generalizar para esperas naturais"
    ],
    description: "Dificuldade em esperar frequentemente causa problemas comportamentais. Esta atividade usa música para ensinar e estruturar a espera. Inicia-se com esperas muito curtas (3 segundos até tocar instrumento) com música de fundo como regulador. Progressivamente, aumenta-se o tempo. Estratégias de espera são ensinadas: respirar com a música, contar compassos, cantar internamente. A música preenche o 'vazio' da espera com estrutura. Timer visual mostra progresso. Generaliza-se para filas, consultórios, transporte.",
    materials: [
      "Timer visual",
      "Músicas de espera",
      "Instrumentos desejados para motivar espera",
      "Cartões de estratégias",
      "Situações para generalização"
    ],
    estimatedTime: "25-35 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Tolera espera pelo tempo-alvo",
      "Usa estratégias de regulação",
      "Mantém comportamento adequado",
      "Generaliza para outras situações"
    ],
    adaptations: {
      level1: "Esperas muito curtas, reforço frequente",
      level2: "Esperas moderadas, estratégias variadas",
      level3: "Esperas naturais, auto-regulação"
    },
    practicalTips: [
      "Começar abaixo da tolerância atual",
      "Aumentar muito gradualmente",
      "Ter música/estratégia sempre disponível"
    ],
    theoreticalBasis: "Fundamenta-se em pesquisas sobre atraso de reforçamento e tolerância à frustração. A música oferece estrutura temporal e regulação durante espera. Baseado em intervenções de função executiva e autocontrole."
  },
  {
    id: 75,
    title: "Comportamentos de Segurança Musical",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Ensinar comportamentos de segurança através de canções e rotinas musicais",
    specificObjectives: [
      "Memorizar regras de segurança em canções",
      "Responder a situações de risco",
      "Generalizar para ambiente natural",
      "Demonstrar comportamentos seguros consistentes"
    ],
    description: "Crianças com TEA podem ter dificuldade em generalizar regras de segurança. Canções estruturadas ensinam e ajudam a memorizar comportamentos seguros: atravessar rua, não ir com estranhos, pedir ajuda, segurança na água, identificar perigos. Cada canção é associada a situação específica e praticada em role-play. A melodia serve como lembrete acessível em situação real. Pratica-se resposta a cenários: 'O que você faz se...?'. Famílias são envolvidas para generalização.",
    materials: [
      "Canções de segurança temáticas",
      "Cenários para role-play",
      "Cartões visuais de regras",
      "Vídeos de situações",
      "Material para família"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Canta/lembra regras de segurança",
      "Responde apropriadamente a cenários",
      "Demonstra generalização",
      "Mantém comportamentos seguros"
    ],
    adaptations: {
      level1: "Regras simples, prática frequente",
      level2: "Regras variadas, cenários diversos",
      level3: "Situações complexas, tomada de decisão"
    },
    practicalTips: [
      "Priorizar riscos reais da criança",
      "Praticar em ambiente real quando seguro",
      "Envolver todos os cuidadores"
    ],
    theoreticalBasis: "Baseado em ensino de habilidades de segurança e generalização. A música facilita memorização de regras e oferece lembrete acessível. Fundamenta-se em ABA e ensino de habilidades de vida."
  },
  {
    id: 76,
    title: "Extinção de Comportamento com Suporte Musical",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Utilizar música como suporte durante procedimentos de extinção de comportamentos problemáticos",
    specificObjectives: [
      "Manter procedimento de extinção com regulação",
      "Oferecer suporte sem reforçar comportamento",
      "Ensinar comportamentos alternativos",
      "Manter ganhos comportamentais"
    ],
    description: "Extinção pode gerar agitação temporária. A música pode servir como regulador sem reforçar o comportamento-alvo. Durante extinção (não atender a comportamento inapropriado de acesso a item), música calma de fundo mantém regulação geral sem contingência com o comportamento. Paralelamente, ensina-se forma apropriada de obter o que quer. Quando comportamento apropriado ocorre, música preferida é contingente. O balanço entre música reguladora (não contingente) e reforçadora (contingente) é cuidadosamente gerenciado.",
    materials: [
      "Música de fundo reguladora",
      "Música preferida para reforçamento",
      "Sistema de análise funcional",
      "Alternativas comportamentais",
      "Registro de comportamentos"
    ],
    estimatedTime: "30-45 minutos",
    ageRange: "3-14 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Redução de comportamento-alvo",
      "Aumento de comportamento alternativo",
      "Manutenção de regulação durante processo",
      "Generalização de ganhos"
    ],
    adaptations: {
      level1: "Extinção muito gradual, muito suporte",
      level2: "Extinção moderada, suporte quando necessário",
      level3: "Procedimento completo, manutenção"
    },
    contraindications: [
      "Apenas com supervisão de analista comportamental",
      "Não usar para comportamentos de auto-lesão"
    ],
    practicalTips: [
      "Realizar análise funcional completa primeiro",
      "Ter comportamento alternativo robusto",
      "Coordenar com equipe comportamental"
    ],
    theoreticalBasis: "Baseado em análise comportamental aplicada e procedimentos de extinção. A música oferece regulação não-contingente durante processo potencialmente aversivo. Fundamenta-se em ética em ABA e abordagens de suporte."
  },
  {
    id: 77,
    title: "Contrato Comportamental Musical",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Estabelecer acordos comportamentais claros com música como reforçador preferencial",
    specificObjectives: [
      "Compreender expectativas comportamentais",
      "Trabalhar em direção a objetivo",
      "Receber reforço por comportamento apropriado",
      "Desenvolver autodisciplina"
    ],
    description: "Contratos comportamentais estabelecem expectativas claras. Esta atividade usa música como reforçador poderoso. Cria-se contrato visual: 'Quando eu [comportamento esperado] X vezes, então eu [atividade musical preferida]'. Comportamento é monitorado com sistema de pontos/fichas. A música preferida é forte motivador que mantém engajamento. Contratos são co-criados com a criança quando possível. Expectativas são realistas e alcançáveis. O sistema ensina trabalhar em direção a objetivo. Gradualmente, exigências aumentam e reforço torna-se mais natural.",
    materials: [
      "Template de contrato visual",
      "Sistema de pontos/fichas",
      "Atividades musicais reforçadoras",
      "Gráfico de progresso",
      "Celebração de conquistas"
    ],
    estimatedTime: "20-30 minutos",
    ageRange: "5-18 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Compreende termos do contrato",
      "Trabalha em direção ao objetivo",
      "Solicita reforço apropriadamente",
      "Demonstra melhora comportamental"
    ],
    adaptations: {
      level1: "Metas curtas, reforço frequente",
      level2: "Metas moderadas, reforço após mais tempo",
      level3: "Metas de longo prazo, auto-monitoramento"
    },
    practicalTips: [
      "Começar com metas muito alcançáveis",
      "Manter consistência absoluta",
      "Envolver criança na criação quando possível"
    ],
    theoreticalBasis: "Fundamenta-se em teoria de reforçamento e contratos comportamentais. A música oferece reforçador de alta potência. Baseado em ABA e sistemas de economia de fichas."
  },
  {
    id: 78,
    title: "Automonitoramento Musical",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Desenvolver capacidade de auto-observar e auto-registrar comportamentos usando música como framework",
    specificObjectives: [
      "Aumentar consciência do próprio comportamento",
      "Registrar ocorrência de comportamentos-alvo",
      "Avaliar próprio desempenho",
      "Desenvolver autorregulação comportamental"
    ],
    description: "Automonitoramento é estratégia poderosa para mudança comportamental. Esta atividade usa música para estruturar a auto-observação. Comportamentos-alvo são definidos claramente. Ao final de cada 'música' ou período, a criança avalia: 'Eu mantive mãos no instrumento?' e registra. Usa-se escala visual simples. Inicialmente, terapeuta co-avalia, desenvolvendo calibragem. Gradualmente, auto-avaliação independente aumenta. Música de 'verificação' sinaliza momentos de auto-avaliação. Gráficos de progresso são revisados musicalmente.",
    materials: [
      "Definições claras de comportamento-alvo",
      "Sistema de registro simples",
      "Música de sinalização de verificação",
      "Gráficos de progresso",
      "Reforço por auto-monitoramento preciso"
    ],
    estimatedTime: "30-40 minutos",
    ageRange: "6-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Auto-avalia comportamento com precisão",
      "Registra consistentemente",
      "Demonstra mudança com base em auto-observação",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "Comportamentos muito simples, co-avaliação",
      level2: "Múltiplos comportamentos, avaliação semi-independente",
      level3: "Auto-avaliação independente, múltiplos contextos"
    },
    practicalTips: [
      "Começar com comportamentos claramente observáveis",
      "Reforçar precisão, não apenas resultados",
      "Usar tecnologia quando útil"
    ],
    theoreticalBasis: "Baseado em pesquisas sobre auto-monitoramento e autorregulação. A música oferece estrutura temporal para verificação. Fundamenta-se em estratégias cognitivo-comportamentais e autogestão."
  },
  {
    id: 79,
    title: "Dessensibilização a Eventos Aversivos",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Reduzir reatividade comportamental a estímulos aversivos através de exposição musical gradual",
    specificObjectives: [
      "Tolerar estímulos previamente aversivos",
      "Manter regulação durante exposição",
      "Desenvolver estratégias de coping",
      "Generalizar tolerância"
    ],
    description: "Alguns comportamentos problemáticos são eliciados por estímulos aversivos (sons específicos, situações, pessoas). Esta atividade usa exposição gradual com música como suporte regulador. Identifica-se o estímulo aversivo e cria-se hierarquia de exposição. Exposição ocorre em contexto musical positivo, começando muito abaixo do limiar de reatividade. Música preferida é pareada com exposição. A criança desenvolve sensação de controle ('posso pedir para parar'). Progressão é muito gradual, nunca forçada.",
    materials: [
      "Hierarquia de exposição documentada",
      "Estímulos em diferentes intensidades",
      "Música preferida reguladora",
      "Sistema de sinalização de parada",
      "Registro de progresso"
    ],
    estimatedTime: "30-45 minutos",
    ageRange: "4-18 anos",
    complexityLevel: "advanced",
    evaluationCriteria: [
      "Tolera exposição em nível aumentado",
      "Mantém regulação durante exposição",
      "Usa estratégias de coping",
      "Generaliza para ambiente natural"
    ],
    adaptations: {
      level1: "Exposição mínima, muito controle",
      level2: "Exposição moderada, suporte disponível",
      level3: "Exposição naturalística"
    },
    contraindications: [
      "Não usar para trauma sem supervisão especializada",
      "Nunca forçar exposição"
    ],
    practicalTips: [
      "Progredir mais lentamente do que parece necessário",
      "Sempre dar controle à criança",
      "Celebrar toda exposição bem-sucedida"
    ],
    theoreticalBasis: "Baseado em dessensibilização sistemática e exposição gradual. A música oferece regulação e contexto positivo para exposição. Fundamenta-se em terapia comportamental e intervenções de ansiedade."
  },
  {
    id: 80,
    title: "Comportamento Pró-Social Musical",
    disorder: "TEA",
    demandCategory: "behavior",
    generalObjective: "Desenvolver e reforçar comportamentos pró-sociais através de atividades musicais colaborativas",
    specificObjectives: [
      "Demonstrar ajuda e cooperação",
      "Compartilhar instrumentos e espaço",
      "Considerar perspectiva do outro",
      "Generalizar para interações naturais"
    ],
    description: "Comportamentos pró-sociais (ajudar, compartilhar, cooperar) são fundamentais para inclusão social. Esta atividade cria oportunidades naturais para esses comportamentos no contexto musical. Atividades são estruturadas para requerer cooperação: um segura instrumento, outro toca; precisam-se duas pessoas para fazer música juntos; instrumentos são compartilhados. Comportamentos pró-sociais são explicitamente notados, nomeados e reforçados. Role-play com música ensina situações específicas. Faz-se ponte para playground, sala de aula, família.",
    materials: [
      "Atividades que requerem cooperação",
      "Instrumentos para compartilhar",
      "Cartões de comportamentos pró-sociais",
      "Sistema de reforçamento",
      "Situações para role-play"
    ],
    estimatedTime: "35-45 minutos",
    ageRange: "4-14 anos",
    complexityLevel: "intermediate",
    evaluationCriteria: [
      "Demonstra comportamentos de ajuda",
      "Compartilha instrumentos voluntariamente",
      "Coopera em atividades de grupo",
      "Generaliza para outros contextos"
    ],
    adaptations: {
      level1: "Situações muito estruturadas, reforço frequente",
      level2: "Situações variadas, generalização guiada",
      level3: "Comportamentos espontâneos, múltiplos contextos"
    },
    practicalTips: [
      "Criar oportunidades naturais, não artificiais",
      "Nomear especificamente o comportamento",
      "Conectar com situações reais de vida"
    ],
    theoreticalBasis: "Fundamenta-se em desenvolvimento de comportamento pró-social e aprendizagem social. A música oferece contexto motivador para cooperação. Baseado em intervenções de habilidades sociais e abordagens naturalísticas."
  }
];
