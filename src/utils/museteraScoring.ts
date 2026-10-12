/** Fonte única de pontuação para a Escala MuseTera.
 * "Não observado" é uma pontuação válida de 0 pontos.
 * Não preenchido ou "não aplicável" não entram na média.
 */
export const SCORE_BY_LEVEL = {
  nao_observado: 0,
  emergente: 20,
  inconsistente: 40,
  moderado: 60,
  consistente: 80,
  excepcional: 100,
} as const;

export type ScoreLevel = keyof typeof SCORE_BY_LEVEL;
export interface EvaluationDomain {
  title: string;
  subdomains: Array<{ title: string; parameters: string[] }>;
}
export interface ScoreSummary {
  raw: number;
  max: number;
  percentage: number;
  evaluatedParameters: number;
  totalParameters: number;
  notApplicableParameters: number;
  pendingParameters: number;
  completionPercentage: number;
}
export const parameterKey = (domain: string, subdomain: string, parameter: string) =>
  `${domain}-${subdomain}-${parameter}`;

export function levelScore(level: string | undefined | null): number | null {
  return level != null && Object.prototype.hasOwnProperty.call(SCORE_BY_LEVEL, level)
    ? SCORE_BY_LEVEL[level as ScoreLevel]
    : null;
}

export function isScored(level: string | undefined | null): boolean {
  return levelScore(level) !== null;
}

export function summarizeParameters(levels: Array<string | undefined | null>): ScoreSummary {
  const valid = levels.map(levelScore);
  const evaluatedParameters = valid.filter((score): score is number => score !== null).length;
  const raw = valid.reduce<number>((sum, score) => sum + (score ?? 0), 0);
  const max = evaluatedParameters * 100;
  const notApplicableParameters = levels.filter(level => level === "nao_aplicavel").length;
  const totalParameters = levels.length - notApplicableParameters;
  return {
    raw, max,
    percentage: max > 0 ? Math.round((raw / max) * 100) : 0,
    evaluatedParameters, totalParameters, notApplicableParameters,
    pendingParameters: totalParameters - evaluatedParameters,
    completionPercentage: totalParameters ? Math.round(100 * evaluatedParameters / totalParameters) : 0,
  };
}

export function summarizeSubdomain(
  selections: Record<string, string>,
  domain: string,
  subdomain: string,
  parameters: string[],
): ScoreSummary {
  return summarizeParameters(parameters.map(parameter => selections[parameterKey(domain, subdomain, parameter)]));
}

export function summarizeDomain(
  selections: Record<string, string>,
  domain: EvaluationDomain,
): ScoreSummary {
  return summarizeParameters(domain.subdomains.flatMap(subdomain =>
    subdomain.parameters.map(parameter => selections[parameterKey(domain.title, subdomain.title, parameter)])
  ));
}

export function summarizeEvaluation(
  selections: Record<string, string>,
  domains: EvaluationDomain[],
): ScoreSummary & { evaluatedDomains: number; totalDomains: number } {
  const summary = summarizeParameters(domains.flatMap(domain =>
    domain.subdomains.flatMap(subdomain =>
      subdomain.parameters.map(parameter => selections[parameterKey(domain.title, subdomain.title, parameter)])
    )
  ));
  return {
    ...summary,
    evaluatedDomains: domains.filter(domain => summarizeDomain(selections, domain).evaluatedParameters > 0).length,
    totalDomains: domains.length,
  };
}
