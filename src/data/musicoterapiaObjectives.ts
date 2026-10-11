/**
 * Objetivos terapêuticos de musicoterapia, selecionados individualmente.
 *
 * O objetivo descreve uma habilidade a estimular, e não um resultado alcançado.
 * Indicadores são sugestões de registro observacional; não constituem escala validada.
 */
export type MusicoterapiaObjectiveCategoryId = 'fundamentais' | 'emocionais' | 'sociais' | 'motores' | 'pessoais';

export interface MusicoterapiaObjectiveCategory {
  id: MusicoterapiaObjectiveCategoryId;
  icon: string;
  title: string;
  description: string;
}

/** Categorias visuais: não modificam os identificadores dos objetivos já cadastrados. */
export const musicoterapiaObjectiveCategories: MusicoterapiaObjectiveCategory[] = [
  { id: 'fundamentais', icon: '🎵', title: 'Comunicação, cognição e vínculo', description: 'Objetivos comunicativos, atencionais, cognitivos e de interação musicoterapêutica.' },
  { id: 'emocionais', icon: '❤️', title: 'Aspectos emocionais', description: 'Expressão afetiva, autoestima, estratégias de regulação e bem-estar.' },
  { id: 'sociais', icon: '👫', title: 'Aspectos sociais', description: 'Participação, vínculos, cooperação e convivência social.' },
  { id: 'motores', icon: '🦵', title: 'Aspectos motores e físicos', description: 'Coordenação, movimento, percepção corporal, respiração e expressão.' },
  { id: 'pessoais', icon: '🌱', title: 'Desenvolvimento pessoal', description: 'Criatividade, autonomia, identidade e qualidade de vida.' }
];

export interface MusicoterapiaObjective {
  id: string;
  category: MusicoterapiaObjectiveCategoryId;
  icon: string;
  title: string;
  objective: string;
  resources: string;
  indicator: string;
}

export const musicoterapiaObjectives: MusicoterapiaObjective[] = [
  {
    id: 'comunicacao',
    category: 'fundamentais',
    icon: '🗣️',
    title: 'Comunicação',
    objective: 'Estimular a comunicação funcional por meios verbais e/ou não verbais, incluindo gestos, vocalizações, expressão corporal e recursos de comunicação alternativa, durante experiências musicais compartilhadas.',
    resources: 'Canções funcionais, escolhas musicais, pausas intencionais e comunicação aumentativa e alternativa (CAA), quando utilizada.',
    indicator: 'Registrar pedidos, escolhas, respostas e outras funções comunicativas por modalidade e contexto.'
  },
  {
    id: 'imitacao_vocal',
    category: 'fundamentais',
    icon: '👄',
    title: 'Imitação vocal',
    objective: 'Estimular, quando pertinente ao perfil e aos objetivos do paciente, a imitação voluntária de sons vocais, sílabas, entonações e pequenos padrões melódicos.',
    resources: 'Jogos de eco vocal, canto responsivo, vocalizações e alternância de motivos melódicos.',
    indicator: 'Registrar tentativas e reproduções vocais em relação às oportunidades, distinguindo respostas espontâneas e com ajuda.'
  },
  {
    id: 'atencao_concentracao',
    category: 'fundamentais',
    icon: '🎯',
    title: 'Atenção e concentração',
    objective: 'Favorecer a orientação, manutenção e retomada da atenção em atividades musicais adequadas ao interesse, à tolerância sensorial e ao perfil do paciente.',
    resources: 'Jogos de escuta, sequências rítmicas, canções estruturadas e exploração instrumental com adaptação de demanda.',
    indicator: 'Registrar duração do envolvimento, retomadas e necessidade de mediação durante a tarefa.'
  },
  {
    id: 'atencao_compartilhada',
    category: 'fundamentais',
    icon: '👀',
    title: 'Atenção compartilhada',
    objective: 'Favorecer episódios de atenção compartilhada em torno de sons, instrumentos e ações musicais, respeitando diferentes formas de orientar e compartilhar o interesse, sem exigir contato ocular.',
    resources: 'Improvisação conjunta, apontamento e escolhas de instrumentos, gestos e pausas musicais.',
    indicator: 'Registrar episódios de compartilhamento de interesse, iniciativas e respostas de atenção conjunta, independentemente do contato visual.'
  },
  {
    id: 'cognicao',
    category: 'fundamentais',
    icon: '🧠',
    title: 'Cognição',
    objective: 'Estimular memória musical, discriminação, sequenciamento, antecipação, flexibilidade e resolução de problemas por meio de atividades sonoro-musicais individualizadas.',
    resources: 'Sequências de sons, associação musical, músicas com lacunas, variações de padrões e desafios graduados.',
    indicator: 'Registrar sequências realizadas, acertos, estratégias utilizadas e nível de ajuda nas tarefas.'
  },
  {
    id: 'percepcao_auditiva',
    category: 'fundamentais',
    icon: '🎶',
    title: 'Percepção auditiva',
    objective: 'Estimular a identificação e a discriminação de características sonoras, como timbre, duração, intensidade, altura e padrões rítmicos, respeitando a sensibilidade auditiva do paciente.',
    resources: 'Reconhecimento de fontes sonoras, contrastes sonoros graduados, escuta ativa e exploração de instrumentos.',
    indicator: 'Registrar discriminações corretas por oportunidades e sinais de conforto ou desconforto auditivo.'
  },
  {
    id: 'turnos_interacao',
    category: 'fundamentais',
    icon: '🔄',
    title: 'Turnos de interação',
    objective: 'Favorecer a alternância e a reciprocidade de ações sonoro-musicais, com oportunidades de iniciar, responder e sustentar trocas de turnos.',
    resources: 'Pergunta e resposta musical, jogos de eco instrumental, improvisação alternada e canções com pausas.',
    indicator: 'Registrar turnos iniciados e respondidos, duração das sequências e quantidade de apoio necessária.'
  },
  {
    id: 'interacao_social',
    category: 'fundamentais',
    icon: '🤝',
    title: 'Interação social',
    objective: 'Ampliar oportunidades de participação social significativa e reciprocidade durante experiências musicais com o terapeuta, pares ou familiares, respeitando a iniciativa e os limites do paciente.',
    resources: 'Musicoterapia em dupla ou grupo, improvisação compartilhada e jogos musicais cooperativos.',
    indicator: 'Registrar iniciativas, respostas, escolhas compartilhadas e participação espontânea ou mediada.'
  },
  {
    id: 'intencao_comunicativa',
    category: 'fundamentais',
    icon: '💬',
    title: 'Intenção comunicativa',
    objective: 'Favorecer iniciativas comunicativas com finalidade identificável, como pedir, recusar, comentar, compartilhar interesse ou solicitar continuidade, por qualquer modalidade acessível ao paciente.',
    resources: 'Pausas musicais previsíveis, escolha de repertório, jogos de antecipação e canções com respostas abertas.',
    indicator: 'Registrar frequência das iniciativas espontâneas, finalidade comunicativa e modalidade utilizada.'
  },
  {
    id: 'expressao_vocal',
    category: 'fundamentais',
    icon: '🎤',
    title: 'Expressão vocal',
    objective: 'Favorecer a exploração espontânea e intencional da voz para expressão musical, afetiva e comunicativa, sem condicionar a participação à produção de fala.',
    resources: 'Vocalizações livres, canto adaptado, improvisação vocal e diálogo musical com a voz.',
    indicator: 'Registrar variedade de vocalizações, iniciativa, uso expressivo e contexto, sem equiparar vocalização à fala funcional.'
  },
  {
    id: 'imitacao',
    category: 'fundamentais',
    icon: '🧩',
    title: 'Imitação',
    objective: 'Estimular a imitação de gestos, movimentos e padrões rítmicos ou instrumentais como forma de aprendizagem, coordenação e participação musical.',
    resources: 'Espelhamento musical, eco rítmico, gestos com canções e sequências de movimento com instrumentos.',
    indicator: 'Registrar padrões reproduzidos, tentativas, precisão contextual e tipo de mediação.'
  },
  {
    id: 'vinculo_terapeutico',
    category: 'fundamentais',
    icon: '❤️',
    title: 'Vínculo terapêutico',
    objective: 'Favorecer uma relação terapêutica de confiança, segurança, previsibilidade e participação voluntária, com experiências musicais ajustadas às preferências e necessidades do paciente.',
    resources: 'Escuta responsiva, improvisação vincular, repertório significativo e rituais musicais de acolhimento e encerramento.',
    indicator: 'Registrar iniciativas de aproximação, escolha, permanência voluntária, expressão de preferências e busca de interação, sem presumir estado emocional.'
  },
  {
    id: "autoestima_autoconfianca",
    category: "emocionais",
    icon: "💗",
    title: "Autoestima e autoconfiança",
    objective: "Favorecer a valorização das próprias iniciativas, escolhas e produções musicais, ampliando oportunidades de perceber competências pessoais e participar com confiança, sem avaliações comparativas ou exigências de desempenho.",
    resources: "Improvisação com escolha de instrumentos, composição de pequenas canções, apreciação de produções próprias e atividades adaptadas com êxitos graduais.",
    indicator: "Registrar iniciativas voluntárias, escolhas, participação e formas de expressar satisfação com as próprias realizações, considerando o contexto."
  },
  {
    id: "reconhecimento_expressao_emocoes",
    category: "emocionais",
    icon: "🥰",
    title: "Reconhecimento e expressão das emoções",
    objective: "Favorecer o reconhecimento, a nomeação quando possível e a expressão de estados emocionais por diferentes meios comunicativos e experiências sonoro-musicais, respeitando o repertório expressivo de cada paciente.",
    resources: "Canções sobre emoções, improvisações contrastantes, exploração de timbres e intensidades, cartões de emoções e recursos de CAA quando aplicável.",
    indicator: "Registrar formas de identificar, selecionar, comunicar ou representar estados emocionais e o apoio necessário em situações musicais."
  },
  {
    id: "ansiedade_estresse_tensao",
    category: "emocionais",
    icon: "🫶",
    title: "Manejo de ansiedade, estresse e tensão",
    objective: "Favorecer a identificação e a utilização de recursos musicoterapêuticos de autorregulação para lidar com sinais de ansiedade, estresse ou tensão, sem pressupor redução clínica desses sintomas nem substituir acompanhamento especializado.",
    resources: "Escuta musical individualizada, improvisação responsiva, organização de rotinas sonoro-musicais e estratégias de regulação escolhidas com o paciente.",
    indicator: "Registrar sinais observáveis de desconforto e recuperação, estratégias escolhidas, engajamento e percepção relatada pelo paciente quando possível."
  },
  {
    id: "relaxamento_bem_estar",
    category: "emocionais",
    icon: "🌤️",
    title: "Relaxamento e sensação de bem-estar",
    objective: "Promover oportunidades de relaxamento e conforto subjetivo por meio de experiências musicais escolhidas ou aceitas pelo paciente, respeitando suas preferências e sensibilidades sonoras.",
    resources: "Audição de repertório preferido, paisagens sonoras ajustadas, canto acolhedor, respiração acompanhada de música quando apropriado e improvisação de baixa demanda.",
    indicator: "Registrar sinais observáveis de conforto, preferência ou recusa, participação voluntária e relato subjetivo de bem-estar quando disponível."
  },
  {
    id: "vinculos_interpessoais",
    category: "sociais",
    icon: "🧑‍🤝‍🧑",
    title: "Interação e vínculo com outras pessoas",
    objective: "Estimular oportunidades de construção de vínculos interpessoais e interações musicais significativas com pares, familiares e outros participantes, respeitando a autonomia e os modos individuais de aproximação.",
    resources: "Improvisação em dupla, canções compartilhadas, jogos musicais entre familiares e participação mediada em pequenos grupos.",
    indicator: "Registrar iniciativas de aproximação, respostas a convites, escolhas de parceiros e tempo de participação compartilhada."
  },
  {
    id: "cooperacao_grupo",
    category: "sociais",
    icon: "🙌",
    title: "Cooperação e participação em grupo",
    objective: "Favorecer a cooperação e a participação voluntária em atividades musicais coletivas, incluindo negociação de escolhas, divisão de tarefas e contribuições individuais adequadas ao contexto.",
    resources: "Orquestra de percussão adaptada, criação musical coletiva, alternância de papéis e jogos cooperativos em grupo.",
    indicator: "Registrar contribuições individuais, turnos assumidos, tarefas compartilhadas e apoios necessários durante atividades coletivas."
  },
  {
    id: "convivencia_integracao_social",
    category: "sociais",
    icon: "🌍",
    title: "Convivência e integração social",
    objective: "Desenvolver recursos de participação e convivência social em contextos musicais, respeitando diferenças comunicativas, limites sensoriais e preferências de interação do paciente.",
    resources: "Rodas musicais acessíveis, canções de acolhimento, jogos de escolha compartilhada e apresentações participativas opcionais.",
    indicator: "Registrar participação em situações sociais, comunicação de necessidades, resolução mediada de dificuldades e adaptações que favoreceram a inclusão."
  },
  {
    id: "coordenacao_motora",
    category: "motores",
    icon: "🥁",
    title: "Coordenação motora",
    objective: "Estimular coordenação motora fina e ampla, planejamento e ajuste de movimentos durante a execução instrumental e atividades musicais adaptadas às capacidades e necessidades funcionais do paciente.",
    resources: "Percussão com diferentes tamanhos de instrumentos, teclado, movimentos sincronizados à música e jogos de coordenação bilateral.",
    indicator: "Registrar padrões de movimento realizados, precisão funcional, número de tentativas, fadiga e grau de assistência necessário."
  },
  {
    id: "ritmo_movimento_consciencia_corporal",
    category: "motores",
    icon: "💃",
    title: "Ritmo, movimento e percepção corporal",
    objective: "Favorecer a percepção corporal, a organização temporal e a exploração de movimentos por meio de experiências rítmicas, respeitando a segurança postural, a mobilidade e as particularidades sensoriais.",
    resources: "Percussão corporal adaptada, dança e movimento livre, marcha ou movimentos rítmicos assistidos, espelhamento musical.",
    indicator: "Registrar sincronização ou adaptação ao pulso, iniciativas de movimento, organização espaço-temporal e níveis de ajuda."
  },
  {
    id: "reabilitacao_motora_neurologica",
    category: "motores",
    icon: "🦿",
    title: "Apoio à reabilitação de movimentos",
    objective: "Contribuir, quando houver indicação e objetivos funcionais definidos em articulação com a equipe de reabilitação, para a prática de movimentos orientados por estímulos musicais, com adaptações de segurança e sem prometer recuperação neurológica.",
    resources: "Pistas rítmicas individualizadas, prática instrumental terapêutica adaptada e sequências motoras musicais coordenadas com fisioterapia ou terapia ocupacional, quando pertinente.",
    indicator: "Registrar amplitude ou funcionalidade do movimento quando medida por profissional habilitado, execução da tarefa, assistência e tolerância à atividade."
  },
  {
    id: "respiracao_controle_vocal_expressao_corporal",
    category: "motores",
    icon: "🌬️",
    title: "Respiração, controle vocal e expressão corporal",
    objective: "Estimular percepção respiratória, coordenação entre respiração e emissão vocal e possibilidades de expressão corporal em atividades musicais seguras, sem apresentar a intervenção como substituição de tratamento fonoaudiológico ou respiratório.",
    resources: "Canto confortável, fraseado musical com pausas, jogos de sopro apenas quando adequados e seguros, improvisação vocal e gestual.",
    indicator: "Registrar duração confortável de emissões, coordenação do fraseado, modalidades expressivas e sinais de esforço ou desconforto."
  },
  {
    id: "criatividade_imaginacao",
    category: "pessoais",
    icon: "🎨",
    title: "Criatividade e imaginação",
    objective: "Estimular exploração criativa, imaginação e expressão de ideias por meio de improvisação, composição e reinvenção de experiências sonoro-musicais, sem exigir respostas consideradas corretas.",
    resources: "Improvisação livre, histórias sonorizadas, composição de canções e experimentação de timbres, ritmos e objetos sonoros.",
    indicator: "Registrar variedade de ideias musicais, iniciativas criativas, escolhas próprias e participação na construção de propostas sonoras."
  },
  {
    id: "autonomia",
    category: "pessoais",
    icon: "🌿",
    title: "Autonomia",
    objective: "Favorecer autonomia na escolha, organização e realização de experiências musicais, incluindo comunicação de preferências, tomada de decisões e solicitação de apoio quando necessário.",
    resources: "Escolha de repertório e instrumentos, planejamento simples de sequência musical, atividades de montagem e decisões em improvisações.",
    indicator: "Registrar decisões independentes, iniciativas funcionais, pedidos de ajuda e redução de mediação quando observada."
  },
  {
    id: "memorias_afetivas_identidade",
    category: "pessoais",
    icon: "📻",
    title: "Memórias afetivas e identidade",
    objective: "Favorecer a evocação voluntária de lembranças, a expressão de referências afetivas e o reconhecimento da identidade pessoal e cultural por meio de repertórios musicais significativos, respeitando possíveis desconfortos emocionais.",
    resources: "Canções autobiográficas, playlists escolhidas pelo paciente, canto de repertório familiar e composição de histórias musicais.",
    indicator: "Registrar lembranças espontaneamente compartilhadas, escolhas de repertório, significados atribuídos e manifestações de conforto ou desconforto."
  },
  {
    id: "qualidade_vida",
    category: "pessoais",
    icon: "☀️",
    title: "Qualidade de vida",
    objective: "Favorecer participação significativa em experiências musicais prazerosas e acessíveis que contribuam para bem-estar percebido, expressão pessoal e envolvimento em atividades valorizadas pelo paciente e sua rede de apoio.",
    resources: "Projetos musicais de interesse, experiências de lazer musical, produção sonora compartilhada e repertórios pessoais significativos.",
    indicator: "Registrar satisfação autorreferida quando possível, escolhas voluntárias, participação e relatos contextualizados de paciente ou responsáveis."
  }
];

/** Respeita a ordem clínica do catálogo, ignora ids desconhecidos e duplicados. */
export function getSelectedMusicoterapiaObjectives(value: unknown): MusicoterapiaObjective[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set(value.filter((id): id is string => typeof id === 'string'));
  return musicoterapiaObjectives.filter((objective) => ids.has(objective.id));
}
