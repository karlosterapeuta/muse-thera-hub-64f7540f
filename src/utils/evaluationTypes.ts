// Metadados centralizados dos períodos/tipos de avaliação musicoterapêutica.
// Usado para diferenciar, separar e identificar claramente cada tipo de avaliação
// na interface, no histórico, nos relatórios e nos gráficos.

export interface EvaluationTypeMeta {
  /** chave persistida em assessments.type */
  key: string;
  /** valor numérico usado no seletor (selectedEvaluation) */
  value: string;
  label: string;
  shortLabel: string;
  description: string;
  /** cor principal (hex) usada em badges de PDF */
  color: string;
  /** cor de fundo clara (hex) usada em badges de PDF */
  bgColor: string;
  /** classes tailwind para badges na UI */
  badgeClass: string;
}

export const EVALUATION_TYPES: EvaluationTypeMeta[] = [
  {
    key: "avaliacao_inicial",
    value: "1",
    label: "Avaliação Inicial",
    shortLabel: "Inicial",
    description: "Linha de base — primeira avaliação do paciente",
    color: "#2563eb",
    bgColor: "#eff6ff",
    badgeClass:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  },
  {
    key: "avaliacao_progresso",
    value: "2",
    label: "Avaliação de Progresso",
    shortLabel: "Progresso",
    description: "Acompanhamento da evolução entre períodos",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    badgeClass:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800",
  },
  {
    key: "avaliacao_periodica",
    value: "3",
    label: "Avaliação Periódica",
    shortLabel: "Periódica",
    description: "Reavaliação regular (mensal/trimestral/semestral)",
    color: "#0891b2",
    bgColor: "#ecfeff",
    badgeClass:
      "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-800",
  },
  {
    key: "avaliacao_final",
    value: "4",
    label: "Avaliação Final",
    shortLabel: "Final",
    description: "Avaliação de encerramento / alta",
    color: "#059669",
    bgColor: "#ecfdf5",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
  },
  {
    key: "musetera_evaluation",
    value: "0",
    label: "Escala MuseTera",
    shortLabel: "MuseTera",
    description: "Avaliação geral pela escala MuseTera",
    color: "#64748b",
    bgColor: "#f8fafc",
    badgeClass:
      "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  },
];

const FALLBACK: EvaluationTypeMeta = EVALUATION_TYPES[EVALUATION_TYPES.length - 1];

/**
 * Resolve os metadados a partir de qualquer identificador conhecido:
 * a chave persistida (`avaliacao_inicial`), o valor do seletor (`"1"`) ou o label.
 */
export function getEvaluationTypeMeta(
  identifier?: string | null
): EvaluationTypeMeta {
  if (!identifier) return FALLBACK;
  return (
    EVALUATION_TYPES.find(
      (t) =>
        t.key === identifier ||
        t.value === identifier ||
        t.label === identifier ||
        t.shortLabel === identifier
    ) || FALLBACK
  );
}

/** Resolve a partir de uma avaliação salva (prioriza o type persistido). */
export function resolveEvaluationMeta(evaluation: {
  type?: string;
  content?: { evaluationType?: string };
}): EvaluationTypeMeta {
  const byType = evaluation.type
    ? EVALUATION_TYPES.find((t) => t.key === evaluation.type)
    : undefined;
  if (byType) return byType;
  return getEvaluationTypeMeta(evaluation.content?.evaluationType);
}
