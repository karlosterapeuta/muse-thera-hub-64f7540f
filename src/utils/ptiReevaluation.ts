/** Zero is an explicit "not assessed" entry and must not fall back to an older score. */
export function getPtiBaselineValue(
  area: string,
  lastSnapshot?: Record<string, number> | null,
  original?: Record<string, number> | null,
): number {
  const candidate = lastSnapshot?.[area];
  if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
  const starting = original?.[area];
  return typeof starting === "number" && Number.isFinite(starting) ? starting : 0;
}

export function ptiScoreLabel(score: number) {
  return score > 0 ? `${score}/5` : "Não avaliado";
}
