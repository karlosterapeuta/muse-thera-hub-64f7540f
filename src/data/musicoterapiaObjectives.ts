/**
 * Objetivos terapêuticos de musicoterapia, selecionados individualmente.
 *
 * O objetivo descreve uma habilidade a estimular, e não um resultado alcançado.
 * Indicadores são sugestões de registro observacional; não constituem escala validada.
 */
export interface MusicoterapiaObjective {
  id: string;
  icon: string;
  title: string;
  objective: string;
  resources: string;
  indicator: string;
}

export const musicoterapiaObjectives: MusicoterapiaObjective[] = [
  {
    id: 'comunicacao',
    icon: '🗣️',
    title: 'Comunicação',
    objective: 'Estimular a comunicação funcional por meios verbais e/ou não verbais, incluindo gestos, vocalizações, expressão corporal e recursos de comunicação alternativa, durante experiências musicais compartilhadas.',
    resources: 'Canções funcionais, escolhas musicais, pausas intencionais e comunicação aumentativa e alternativa (CAA), quando utilizada.',
    indicator: 'Registrar pedidos, escolhas, respostas e outras funções comunicativas por modalidade e contexto.'
  },
  {
    id: 'imitacao_vocal',
    icon: '👄',
    title: 'Imitação vocal',
    objective: 'Estimular, quando pertinente ao perfil e aos objetivos do paciente, a imitação voluntária de sons vocais, sílabas, entonações e pequenos padrões melódicos.',
    resources: 'Jogos de eco vocal, canto responsivo, vocalizações e alternância de motivos melódicos.',
    indicator: 'Registrar tentativas e reproduções vocais em relação às oportunidades, distinguindo respostas espontâneas e com ajuda.'
  },
  {
    id: 'atencao_concentracao',
    icon: '🎯',
    title: 'Atenção e concentração',
    objective: 'Favorecer a orientação, manutenção e retomada da atenção em atividades musicais adequadas ao interesse, à tolerância sensorial e ao perfil do paciente.',
    resources: 'Jogos de escuta, sequências rítmicas, canções estruturadas e exploração instrumental com adaptação de demanda.',
    indicator: 'Registrar duração do envolvimento, retomadas e necessidade de mediação durante a tarefa.'
  },
  {
    id: 'atencao_compartilhada',
    icon: '👀',
    title: 'Atenção compartilhada',
    objective: 'Favorecer episódios de atenção compartilhada em torno de sons, instrumentos e ações musicais, respeitando diferentes formas de orientar e compartilhar o interesse, sem exigir contato ocular.',
    resources: 'Improvisação conjunta, apontamento e escolhas de instrumentos, gestos e pausas musicais.',
    indicator: 'Registrar episódios de compartilhamento de interesse, iniciativas e respostas de atenção conjunta, independentemente do contato visual.'
  },
  {
    id: 'cognicao',
    icon: '🧠',
    title: 'Cognição',
    objective: 'Estimular memória musical, discriminação, sequenciamento, antecipação, flexibilidade e resolução de problemas por meio de atividades sonoro-musicais individualizadas.',
    resources: 'Sequências de sons, associação musical, músicas com lacunas, variações de padrões e desafios graduados.',
    indicator: 'Registrar sequências realizadas, acertos, estratégias utilizadas e nível de ajuda nas tarefas.'
  },
  {
    id: 'percepcao_auditiva',
    icon: '🎶',
    title: 'Percepção auditiva',
    objective: 'Estimular a identificação e a discriminação de características sonoras, como timbre, duração, intensidade, altura e padrões rítmicos, respeitando a sensibilidade auditiva do paciente.',
    resources: 'Reconhecimento de fontes sonoras, contrastes sonoros graduados, escuta ativa e exploração de instrumentos.',
    indicator: 'Registrar discriminações corretas por oportunidades e sinais de conforto ou desconforto auditivo.'
  },
  {
    id: 'turnos_interacao',
    icon: '🔄',
    title: 'Turnos de interação',
    objective: 'Favorecer a alternância e a reciprocidade de ações sonoro-musicais, com oportunidades de iniciar, responder e sustentar trocas de turnos.',
    resources: 'Pergunta e resposta musical, jogos de eco instrumental, improvisação alternada e canções com pausas.',
    indicator: 'Registrar turnos iniciados e respondidos, duração das sequências e quantidade de apoio necessária.'
  },
  {
    id: 'interacao_social',
    icon: '🤝',
    title: 'Interação social',
    objective: 'Ampliar oportunidades de participação social significativa e reciprocidade durante experiências musicais com o terapeuta, pares ou familiares, respeitando a iniciativa e os limites do paciente.',
    resources: 'Musicoterapia em dupla ou grupo, improvisação compartilhada e jogos musicais cooperativos.',
    indicator: 'Registrar iniciativas, respostas, escolhas compartilhadas e participação espontânea ou mediada.'
  },
  {
    id: 'intencao_comunicativa',
    icon: '💬',
    title: 'Intenção comunicativa',
    objective: 'Favorecer iniciativas comunicativas com finalidade identificável, como pedir, recusar, comentar, compartilhar interesse ou solicitar continuidade, por qualquer modalidade acessível ao paciente.',
    resources: 'Pausas musicais previsíveis, escolha de repertório, jogos de antecipação e canções com respostas abertas.',
    indicator: 'Registrar frequência das iniciativas espontâneas, finalidade comunicativa e modalidade utilizada.'
  },
  {
    id: 'expressao_vocal',
    icon: '🎤',
    title: 'Expressão vocal',
    objective: 'Favorecer a exploração espontânea e intencional da voz para expressão musical, afetiva e comunicativa, sem condicionar a participação à produção de fala.',
    resources: 'Vocalizações livres, canto adaptado, improvisação vocal e diálogo musical com a voz.',
    indicator: 'Registrar variedade de vocalizações, iniciativa, uso expressivo e contexto, sem equiparar vocalização à fala funcional.'
  },
  {
    id: 'imitacao',
    icon: '🧩',
    title: 'Imitação',
    objective: 'Estimular a imitação de gestos, movimentos e padrões rítmicos ou instrumentais como forma de aprendizagem, coordenação e participação musical.',
    resources: 'Espelhamento musical, eco rítmico, gestos com canções e sequências de movimento com instrumentos.',
    indicator: 'Registrar padrões reproduzidos, tentativas, precisão contextual e tipo de mediação.'
  },
  {
    id: 'vinculo_terapeutico',
    icon: '❤️',
    title: 'Vínculo terapêutico',
    objective: 'Favorecer uma relação terapêutica de confiança, segurança, previsibilidade e participação voluntária, com experiências musicais ajustadas às preferências e necessidades do paciente.',
    resources: 'Escuta responsiva, improvisação vincular, repertório significativo e rituais musicais de acolhimento e encerramento.',
    indicator: 'Registrar iniciativas de aproximação, escolha, permanência voluntária, expressão de preferências e busca de interação, sem presumir estado emocional.'
  }
];

/** Respeita a ordem clínica do catálogo, ignora ids desconhecidos e duplicados. */
export function getSelectedMusicoterapiaObjectives(value: unknown): MusicoterapiaObjective[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set(value.filter((id): id is string => typeof id === 'string'));
  return musicoterapiaObjectives.filter((objective) => ids.has(objective.id));
}
