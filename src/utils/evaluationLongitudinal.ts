import { levelScore, summarizeParameters } from "@/utils/museteraScoring";

export type StoredAssessment = {
  date: string;
  content?: {
    selections?: Record<string, string>;
    overallScore?: { percentage?: number; completionPercentage?: number; evaluatedParameters?: number; totalParameters?: number };
    scoringVersion?: string;
  };
};

export const CURRENT_SCORING_VERSION = "musetera-scoring-v2";

export function reportCoverage(selections?: Record<string,string>, allKeys?: string[]) {
  if (!selections || !allKeys?.length) return null;
  return summarizeParameters(allKeys.map(key => selections[key]));
}

/** Compare only parameters scored in BOTH sessions; missing, N/A and unknown levels do not count. */
export function compareMatchedAssessments(first: StoredAssessment, last: StoredAssessment) {
  const a = first.content?.selections || {};
  const b = last.content?.selections || {};
  const shared = Object.keys(a).filter(key => levelScore(a[key]) !== null && levelScore(b[key]) !== null);
  const firstSummary = summarizeParameters(shared.map(key => a[key]));
  const lastSummary = summarizeParameters(shared.map(key => b[key]));
  const firstTotal = Object.keys(a).filter(key => levelScore(a[key]) !== null).length;
  const lastTotal = Object.keys(b).filter(key => levelScore(b[key]) !== null).length;
  return {
    sharedCount: shared.length, firstTotal, lastTotal,
    firstMean: shared.length ? firstSummary.percentage : null,
    lastMean: shared.length ? lastSummary.percentage : null,
    change: shared.length ? lastSummary.percentage - firstSummary.percentage : null,
    comparable: shared.length > 0,
    firstVersion: first.content?.scoringVersion || "não registrada",
    lastVersion: last.content?.scoringVersion || "não registrada",
    versionWarning: !first.content?.scoringVersion || !last.content?.scoringVersion || first.content.scoringVersion !== last.content.scoringVersion,
  };
}
