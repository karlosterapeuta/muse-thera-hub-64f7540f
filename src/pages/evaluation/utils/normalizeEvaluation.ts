import type { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { normalizeSelections, summarizeEvaluation, summarizeDomain, summarizeSubdomain } from "@/utils/museteraScoring";
import { evaluationDomains } from "./domains";

/** Normalize a read snapshot without rewriting the stored assessment. */
export function normalizeEvaluation(evaluation: SavedEvaluation): SavedEvaluation {
  if (!evaluation.content?.selections) return evaluation;
  const selections = normalizeSelections(evaluation.content.selections);
  return {
    ...evaluation,
    content: {
      ...evaluation.content,
      selections,
      overallScore: summarizeEvaluation(selections, evaluationDomains),
      domainScores: evaluationDomains.map(domain => ({
        domain: domain.title,
        score: summarizeDomain(selections, domain).percentage,
        subdomains: domain.subdomains.map(subdomain => ({
          name: subdomain.title,
          score: summarizeSubdomain(selections, domain.title, subdomain.title, subdomain.parameters).percentage,
        })),
      })),
    },
  };
}
