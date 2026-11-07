import type { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { getEvaluationTypeMeta, resolveEvaluationMeta } from "@/utils/evaluationTypes";

export const EVOLUTION_STAGE_KEYS = [
  "avaliacao_inicial",
  "avaliacao_progresso",
  "avaliacao_periodica",
  "avaliacao_final",
] as const;

/** The persisted type is a key, while older form content often stores "1"–"4". */
export function getEvolutionStageKey(evaluation: SavedEvaluation): string {
  const persisted = resolveEvaluationMeta(evaluation);
  if (persisted.key !== "musetera_evaluation") return persisted.key;
  return getEvaluationTypeMeta(evaluation.content?.evaluationType).key;
}

/** An unfilled evaluation is not a measured score of zero. Zero itself is valid. */
export function getRecordedEvaluationScore(evaluation: SavedEvaluation): number | null {
  const score = evaluation.content?.overallScore;
  if (!score || typeof score.percentage !== "number" || !Number.isFinite(score.percentage)) {
    return null;
  }
  if (typeof score.evaluatedParameters === "number" && score.evaluatedParameters <= 0) {
    return null;
  }
  return score.percentage;
}

/** Choose the latest saved evaluation for each completed stage, preserving legacy fallback. */
export function selectEvaluationsForEvolution(
  evaluations: SavedEvaluation[],
  maxComparisons = 4
): SavedEvaluation[] {
  const newestFirst = [...evaluations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const selected = EVOLUTION_STAGE_KEYS.flatMap((stage) => {
    const match = newestFirst.find((evaluation) => getEvolutionStageKey(evaluation) === stage);
    return match ? [match] : [];
  });
  return selected.length > 0
    ? selected.slice(0, maxComparisons)
    : newestFirst.slice(-maxComparisons).reverse();
}
