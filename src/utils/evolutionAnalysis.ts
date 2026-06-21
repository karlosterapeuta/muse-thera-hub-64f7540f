// Análise comparativa detalhada entre os tipos de avaliação (Inicial → Final).
// Centraliza o "levantamento de dados" usado tanto na UI (Evolução do Paciente)
// quanto no PDF exportado, garantindo consistência entre as duas visões.

import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { resolveEvaluationMeta, EvaluationTypeMeta } from "@/utils/evaluationTypes";

export interface StageSummary {
  id: string;
  meta: EvaluationTypeMeta;
  date: string;
  score: number;
  evaluatedParameters: number;
  totalParameters: number;
}

export interface StageTransition {
  from: StageSummary;
  to: StageSummary;
  variation: number;
  percentChange: number; // variação relativa (%) ao estágio anterior
  trend: "up" | "down" | "stable";
  daysBetween: number;
}

export interface DomainEvolution {
  domain: string;
  scores: number[];
  initial: number;
  final: number;
  variation: number;
  best: number;
  worst: number;
  trend: "up" | "down" | "stable";
}

export interface EvolutionAnalysis {
  stages: StageSummary[];
  transitions: StageTransition[];
  domains: DomainEvolution[];
  firstScore: number;
  lastScore: number;
  globalVariation: number;
  globalPercentChange: number;
  averageScore: number;
  peakScore: number;
  peakStage?: StageSummary;
  lowestScore: number;
  lowestStage?: StageSummary;
  topGains: DomainEvolution[];
  declines: DomainEvolution[];
  stableDomains: DomainEvolution[];
  periodDays: number;
  periodMonths: number;
  trend: "up" | "down" | "stable";
  trendLabel: string;
  consistency: string; // descrição da consistência da evolução
}

const trendOf = (v: number): "up" | "down" | "stable" =>
  v > 5 ? "up" : v < -5 ? "down" : "stable";

const round = (n: number) => Math.round(n * 10) / 10;

export function buildEvolutionAnalysis(
  evaluationsAsc: SavedEvaluation[]
): EvolutionAnalysis {
  const stages: StageSummary[] = evaluationsAsc.map((e) => ({
    id: e.id,
    meta: resolveEvaluationMeta(e),
    date: e.date,
    score: e.content?.overallScore?.percentage || 0,
    evaluatedParameters: e.content?.overallScore?.evaluatedParameters || 0,
    totalParameters: e.content?.overallScore?.totalParameters || 0,
  }));

  // Transições consecutivas (Inicial→Progresso→Periódica→Final)
  const transitions: StageTransition[] = [];
  for (let i = 1; i < stages.length; i++) {
    const from = stages[i - 1];
    const to = stages[i];
    const variation = round(to.score - from.score);
    const percentChange =
      from.score > 0 ? round(((to.score - from.score) / from.score) * 100) : 0;
    const daysBetween = Math.max(
      0,
      Math.round(
        (new Date(to.date).getTime() - new Date(from.date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    transitions.push({
      from,
      to,
      variation,
      percentChange,
      trend: trendOf(variation),
      daysBetween,
    });
  }

  // Evolução por domínio
  const domainNames =
    evaluationsAsc[0]?.content?.domainScores?.map((d) => d.domain) || [];
  const domains: DomainEvolution[] = domainNames.map((domain) => {
    const scores = evaluationsAsc.map(
      (e) => e.content?.domainScores?.find((x) => x.domain === domain)?.score || 0
    );
    const initial = scores[0] ?? 0;
    const final = scores[scores.length - 1] ?? 0;
    const variation = round(final - initial);
    return {
      domain: domain.replace("Domínio ", ""),
      scores,
      initial,
      final,
      variation,
      best: Math.max(...scores),
      worst: Math.min(...scores),
      trend: trendOf(variation),
    };
  });

  const firstScore = stages[0]?.score || 0;
  const lastScore = stages[stages.length - 1]?.score || 0;
  const globalVariation = round(lastScore - firstScore);
  const globalPercentChange =
    firstScore > 0 ? round(((lastScore - firstScore) / firstScore) * 100) : 0;
  const averageScore = stages.length
    ? round(stages.reduce((s, x) => s + x.score, 0) / stages.length)
    : 0;

  const peakStage = stages.reduce<StageSummary | undefined>(
    (best, s) => (!best || s.score > best.score ? s : best),
    undefined
  );
  const lowestStage = stages.reduce<StageSummary | undefined>(
    (low, s) => (!low || s.score < low.score ? s : low),
    undefined
  );

  const sortedByVar = [...domains].sort((a, b) => b.variation - a.variation);
  const topGains = sortedByVar.filter((d) => d.variation > 5).slice(0, 3);
  const declines = sortedByVar.filter((d) => d.variation < -5).slice(-3).reverse();
  const stableDomains = domains.filter((d) => d.trend === "stable");

  const firstDate = stages[0] ? new Date(stages[0].date) : null;
  const lastDate = stages[stages.length - 1]
    ? new Date(stages[stages.length - 1].date)
    : null;
  const periodDays =
    firstDate && lastDate
      ? Math.max(
          0,
          Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
        )
      : 0;
  const periodMonths = Math.round((periodDays / 30.44) * 10) / 10;

  const trend = trendOf(globalVariation);
  const trendLabel =
    trend === "up"
      ? "Evolução clínica positiva"
      : trend === "down"
      ? "Necessidade de revisão do plano terapêutico"
      : "Estabilidade do quadro clínico";

  // Consistência: avalia se a progressão foi linear/ascendente em cada transição
  const positiveTransitions = transitions.filter((t) => t.trend === "up").length;
  const negativeTransitions = transitions.filter((t) => t.trend === "down").length;
  let consistency = "evolução estável entre as avaliações";
  if (transitions.length > 0) {
    if (positiveTransitions === transitions.length) {
      consistency = "progressão ascendente e consistente em todas as etapas";
    } else if (negativeTransitions === transitions.length) {
      consistency = "tendência de redução em todas as etapas avaliadas";
    } else if (positiveTransitions > negativeTransitions) {
      consistency = "progressão predominantemente positiva, com oscilações pontuais";
    } else if (negativeTransitions > positiveTransitions) {
      consistency = "oscilações com tendência de redução em algumas etapas";
    }
  }

  return {
    stages,
    transitions,
    domains,
    firstScore,
    lastScore,
    globalVariation,
    globalPercentChange,
    averageScore,
    peakScore: peakStage?.score || 0,
    peakStage,
    lowestScore: lowestStage?.score || 0,
    lowestStage,
    topGains,
    declines,
    stableDomains,
    periodDays,
    periodMonths,
    trend,
    trendLabel,
    consistency,
  };
}
