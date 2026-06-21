// Plano Terapêutico Individual (PTI) — types, defaults and option libraries

export interface PtiObjetivoEspecifico {
  id: string;
  descricao: string;
  prazo: string;
  prioridade: "Alta" | "Média" | "Baixa" | "";
  area: string;
}

export interface PtiMeta {
  id: string;
  descricao: string;
  indicador: string;
  percentual: string;
  prazo: string;
  criterio: string;
}

export interface PtiAvaliacaoCategoria {
  opcoes: string[];
  observacoes: string;
}

export interface PtiContent {
  identificacao: {
    nome: string;
    idade: string;
    nascimento: string;
    sexo: string;
    responsavel: string;
    telefone: string;
    diagnostico: string;
    cid: string;
    dsm: string;
    dataPlano: string;
    profissional: string;
    cbo: string;
  };
  queixaPrincipal: string;
  historicoClinico: {
    desenvolvimento: string;
    escolaridade: string;
    comunicacao: string;
    terapiasAnteriores: string;
    historicoMusical: string;
    preferenciasMusicais: string;
    hipersensibilidades: string;
    hipossensibilidades: string;
  };
  avaliacao: {
    comunicacao: PtiAvaliacaoCategoria;
    socializacao: PtiAvaliacaoCategoria;
    cognicao: PtiAvaliacaoCategoria;
    sensorial: PtiAvaliacaoCategoria;
    musicalidade: PtiAvaliacaoCategoria;
  };
  potencialidades: string;
  dificuldades: string;
  objetivoGeral: string;
  objetivosEspecificos: PtiObjetivoEspecifico[];
  metas: PtiMeta[];
  estrategias: string[];
  recursos: string[];
  frequencia: {
    sessoes: string;
    duracao: string;
    atendimento: string;
  };
  criteriosEvolucao: Record<string, number>;
  criteriosAlta: string;
  planoFamiliar: string;
  integracao: {
    profissionais: string[];
    observacoes: string;
  };
  fundamentacao: string;
}

export const PTI_FUNDAMENTACAO_PADRAO =
  "O presente Plano Terapêutico Individual foi elaborado a partir da avaliação musicoterapêutica, considerando as necessidades biopsicossociais do paciente, os princípios da Musicoterapia Clínica, as práticas baseadas em evidências e os objetivos terapêuticos individualizados.";

export const PTI_OPTS = {
  comunicacao: ["Verbal", "Não verbal", "Ecolalia", "Gestual", "PECS", "Comunicação alternativa"],
  socializacao: ["Contato visual", "Interação", "Compartilhamento", "Iniciativa", "Turnos comunicativos"],
  cognicao: ["Atenção", "Memória", "Imitação", "Planejamento motor", "Resolução de problemas"],
  sensorial: ["Auditivo", "Tátil", "Vestibular", "Proprioceptivo", "Visual"],
  musicalidade: ["Ritmo", "Melodia", "Harmonia", "Improvisação", "Canto", "Instrumentação", "Criatividade"],
};

export const PTI_AREAS = [
  "Comunicação",
  "Socialização",
  "Cognição",
  "Motricidade",
  "Sensorial",
  "Emocional",
  "Autonomia",
  "Musicalidade",
  "Linguagem",
  "Funções Executivas",
];

export const PTI_ESTRATEGIAS = [
  "Improvisação",
  "Recriação Musical",
  "Composição",
  "Escuta Musical",
  "Musicoterapia Neurológica",
  "Jogos Musicais",
  "Canções Estruturadas",
  "Histórias Musicais",
  "Percussão Corporal",
  "Vocalização",
  "Canto Responsivo",
  "Improvisação Instrumental",
  "Musicalização Terapêutica",
  "Relaxamento Musical",
  "ISO",
  "Experiências Receptivas",
  "Experiências Ativas",
  "Experiências Recriativas",
  "Experiências Compositivas",
];

export const PTI_RECURSOS = [
  "Teclado",
  "Violão",
  "Ukulele",
  "Bateria",
  "Tambor",
  "Pandeiro",
  "Chocalho",
  "Xilofone",
  "Metalofone",
  "Boomwhackers",
  "Aplicativos",
  "Músicas favoritas",
  "Outros",
];

export const PTI_PROFISSIONAIS = [
  "Psicólogo",
  "Fonoaudiólogo",
  "Terapeuta Ocupacional",
  "Neuropediatra",
  "Psicopedagogo",
  "Escola",
  "Outros",
];

export const PTI_FREQUENCIA = {
  sessoes: ["Semanal", "Quinzenal", "Mensal"],
  duracao: ["30 minutos", "45 minutos", "50 minutos", "60 minutos"],
  atendimento: ["Individual", "Dupla", "Grupo"],
};

export const PTI_CRITERIOS_EVOLUCAO = [
  "Comunicação",
  "Interação",
  "Atenção",
  "Coordenação",
  "Autorregulação",
  "Musicalidade",
  "Autonomia",
  "Cognição",
];

const emptyCategoria = (): PtiAvaliacaoCategoria => ({ opcoes: [], observacoes: "" });

export const createDefaultPtiContent = (): PtiContent => ({
  identificacao: {
    nome: "",
    idade: "",
    nascimento: "",
    sexo: "",
    responsavel: "",
    telefone: "",
    diagnostico: "",
    cid: "",
    dsm: "",
    dataPlano: new Date().toISOString().split("T")[0],
    profissional: "",
    cbo: "",
  },
  queixaPrincipal: "",
  historicoClinico: {
    desenvolvimento: "",
    escolaridade: "",
    comunicacao: "",
    terapiasAnteriores: "",
    historicoMusical: "",
    preferenciasMusicais: "",
    hipersensibilidades: "",
    hipossensibilidades: "",
  },
  avaliacao: {
    comunicacao: emptyCategoria(),
    socializacao: emptyCategoria(),
    cognicao: emptyCategoria(),
    sensorial: emptyCategoria(),
    musicalidade: emptyCategoria(),
  },
  potencialidades: "",
  dificuldades: "",
  objetivoGeral: "",
  objetivosEspecificos: [],
  metas: [],
  estrategias: [],
  recursos: [],
  frequencia: { sessoes: "", duracao: "", atendimento: "" },
  criteriosEvolucao: PTI_CRITERIOS_EVOLUCAO.reduce((acc, k) => ({ ...acc, [k]: 0 }), {}),
  criteriosAlta: "",
  planoFamiliar: "",
  integracao: { profissionais: [], observacoes: "" },
  fundamentacao: PTI_FUNDAMENTACAO_PADRAO,
});

export interface PtiPlan {
  id: string;
  professional_id: string;
  patient_id: string | null;
  title: string;
  status: string;
  plan_date: string;
  content: PtiContent;
  progress: number;
  created_at: string;
  updated_at: string;
}

// Progress: count of "filled" sections out of total
export function computePtiProgress(c: PtiContent): number {
  const checks: boolean[] = [
    !!c.identificacao.nome,
    !!c.queixaPrincipal,
    Object.values(c.historicoClinico).some(Boolean),
    Object.values(c.avaliacao).some((cat) => cat.opcoes.length > 0 || cat.observacoes),
    !!c.potencialidades,
    !!c.dificuldades,
    !!c.objetivoGeral,
    c.objetivosEspecificos.length > 0,
    c.metas.length > 0,
    c.estrategias.length > 0,
    c.recursos.length > 0,
    !!(c.frequencia.sessoes || c.frequencia.duracao || c.frequencia.atendimento),
    Object.values(c.criteriosEvolucao).some((v) => v > 0),
    !!c.criteriosAlta,
    !!c.planoFamiliar,
    c.integracao.profissionais.length > 0,
    !!c.fundamentacao,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}
