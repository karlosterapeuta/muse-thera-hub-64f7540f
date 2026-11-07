import { compareMatchedAssessments } from "@/utils/evaluationLongitudinal";
import { summarizeParameters, levelScore } from "@/utils/museteraScoring";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, BarChart3, ArrowRight, Activity, Target, Award, Gauge } from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { getEvaluationTypeMeta } from "@/utils/evaluationTypes";
import { buildEvolutionAnalysis } from "@/utils/evolutionAnalysis";
import { getEvolutionStageKey, getRecordedEvaluationScore } from "@/utils/evolutionPresentation";

interface EvaluationComparisonProps {
  evaluations: SavedEvaluation[];
  selectedIds: string[];
}

const COMPARISON_COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const DOMAIN_COLORS: Record<string, string> = {
  "Musical": "#8b5cf6",
  "Psicossocial": "#10b981",
  "Cognitivo": "#f59e0b",
  "Sensório-Motor": "#ef4444",
  "Comunicativo-Interativo": "#6366f1",
  "Neurofisiológico": "#14b8a6",
  "Executivo-Adaptativo": "#ec4899",
};

export function EvaluationComparison({ evaluations, selectedIds }: EvaluationComparisonProps) {
  const selectedEvaluations = useMemo(() => {
    const selected = evaluations.filter(e => selectedIds.includes(e.id));
    const patientId = selected[0]?.patient_id;
    return selected
      .filter(e => e.patient_id === patientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [evaluations, selectedIds]);

  const radarData = useMemo(() => {
    if (selectedEvaluations.length === 0) return [];

    const domains = selectedEvaluations[0]?.content?.domainScores?.map((d) => d.domain) || [];

    return domains.map((domain) => {
      const dataPoint: Record<string, string | number | null> = {
        domain: domain.replace("Domínio ", ""),
        fullMark: 100,
      };

      selectedEvaluations.forEach((evaluation, index) => {
        const domainScore = evaluation.content?.domainScores?.find((d) => d.domain === domain);
        dataPoint[`eval_${index}`] = getRecordedEvaluationScore(evaluation) === null
          ? null : domainScore?.score ?? null;
        dataPoint[`date_${index}`] = format(new Date(evaluation.date), "dd/MM", { locale: ptBR });
      });

      return dataPoint;
    });
  }, [selectedEvaluations]);

  const evolutionData = useMemo(() => {
    return selectedEvaluations.map((evaluation) => {
      const dataPoint: Record<string, string | number | null> = {
        date: format(new Date(evaluation.date), "dd/MM/yy", { locale: ptBR }),
        fullDate: evaluation.date,
        overall: getRecordedEvaluationScore(evaluation),
      };

      if (getRecordedEvaluationScore(evaluation) !== null) evaluation.content?.domainScores?.forEach((domain) => {
        const shortName = domain.domain.replace("Domínio ", "");
        dataPoint[shortName] = domain.score;
      });

      return dataPoint;
    });
  }, [selectedEvaluations]);

  // Comparação entre avaliações (Inicial → Final) pelo Score Global
  const stageData = useMemo(() => {
    return selectedEvaluations.map((evaluation) => {
      const meta = getEvaluationTypeMeta(getEvolutionStageKey(evaluation));
      return {
        stage: meta.shortLabel,
        label: meta.label,
        color: meta.color,
        date: format(new Date(evaluation.date), "dd/MM/yy", { locale: ptBR }),
        score: getRecordedEvaluationScore(evaluation),
      };
    });
  }, [selectedEvaluations]);

  const stageVariation = useMemo(() => {
    if (stageData.length < 2) return null;
    const first = stageData[0].score;
    const last = stageData[stageData.length - 1].score;
    return first === null || last === null ? null : last - first;
  }, [stageData]);

  // Levantamento de dados / análise detalhada entre as avaliações
  const analysis = useMemo(
    () => buildEvolutionAnalysis(selectedEvaluations.filter((evaluation) => getRecordedEvaluationScore(evaluation) !== null)),
    [selectedEvaluations]
  );

  const comparisonTableData = useMemo(() => {
    if (selectedEvaluations.length < 2) return [];

    const domains = selectedEvaluations[0]?.content?.domainScores?.map((d) => d.domain) || [];


    return domains.map((domain) => {
      const scores = selectedEvaluations.map((evaluation) => {
        const domainScore = evaluation.content?.domainScores?.find((d) => d.domain === domain);
        return getRecordedEvaluationScore(evaluation) === null ? null : domainScore?.score ?? null;
      });

      const firstScore = scores[0];
      const lastScore = scores[scores.length - 1];
      const variation = firstScore === null || lastScore === null ? null : lastScore - firstScore;

      return {
        domain: domain.replace("Domínio ", ""),
        scores,
        variation,
      };
    });
  }, [selectedEvaluations]);

  // Pontos comparáveis: apenas indicadores pontuados em todas as sessões selecionadas.
  const commonKeys = selectedEvaluations.length >= 2
    ? Object.keys(selectedEvaluations[0]?.content?.selections || {}).filter(key =>
        selectedEvaluations.every(evaluation =>
          levelScore(evaluation.content?.selections?.[key]) !== null
        ))
    : [];
  const comparableStageData = selectedEvaluations.map((evaluation) => ({
    date: format(new Date(evaluation.date), "dd/MM/yy", { locale: ptBR }),
    score: commonKeys.length
      ? summarizeParameters(commonKeys.map(key => evaluation.content?.selections?.[key])).percentage
      : null,
  }));

  const matchedComparison = selectedEvaluations.length >= 2
    ? compareMatchedAssessments(selectedEvaluations[0], selectedEvaluations[selectedEvaluations.length - 1])
    : null;

  const getVariationIcon = (variation: number) => {
    if (variation > 5) return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (variation < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 5) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    if (variation < -5) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  if (selectedIds.length === 0) {
    return (
      <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Selecione avaliações para comparar
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Marque até 4 avaliações na lista à esquerda para visualizar gráficos comparativos e
            análise evolutiva detalhada.
          </p>
        </div>
      </Card>
    );
  }

  if (selectedEvaluations.length === 1) {
    const evaluation = selectedEvaluations[0];
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            Avaliação de {format(new Date(evaluation.date), "dd/MM/yyyy", { locale: ptBR })}
          </h3>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Pontuação global: {getRecordedEvaluationScore(evaluation) === null ? "Sem dados" : `${getRecordedEvaluationScore(evaluation)}%`}
          </Badge>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0e7ff" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name={format(new Date(evaluation.date), "dd/MM/yyyy")}
                dataKey="eval_0"
                stroke={COMPARISON_COLORS[0]}
                fill={COMPARISON_COLORS[0]}
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          Apenas a avaliação inicial foi realizada. O sistema aguardará a próxima
          etapa (Progresso) para iniciar a comparação evolutiva.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {matchedComparison && (
        <Card className="mb-5 border-2 border-teal-300 bg-card p-4 text-sm text-foreground dark:border-teal-700">
          <h3 className="text-base font-bold text-teal-900 dark:text-teal-100">Comparação com indicadores equivalentes</h3>
          {matchedComparison.comparable ? (
            <p className="mt-2">Indicadores pontuados nas duas avaliações: <strong>{matchedComparison.sharedCount}</strong>. Primeira média: <strong>{matchedComparison.firstMean}%</strong>; última média: <strong>{matchedComparison.lastMean}%</strong>; diferença descritiva: <strong>{matchedComparison.change! > 0 ? "+" : ""}{matchedComparison.change} pontos percentuais</strong>.</p>
          ) : <p className="mt-2">Não há indicadores pontuados em ambas as avaliações. Não é possível calcular uma variação comparável.</p>}
          <p className="mt-2 text-foreground/85">Cobertura original: {matchedComparison.firstTotal} itens pontuados na primeira avaliação e {matchedComparison.lastTotal} na última. Os gráficos históricos de percentuais globais são descritivos e podem incluir conjuntos diferentes de indicadores; não demonstram evolução isoladamente.</p>
          {matchedComparison.versionWarning && <p className="mt-2 font-medium text-amber-800 dark:text-amber-200">Versão de pontuação não registrada ou diferente em pelo menos uma avaliação. Interprete a comparação com cautela.</p>}
        </Card>
      )}
      <Card className="border border-teal-300 bg-card p-4 dark:border-teal-700">
        <h3 className="text-base font-bold text-foreground">Série longitudinal com conjunto fixo</h3>
        {commonKeys.length ? (
          <>
            <p className="mt-2 text-sm text-foreground/85">As {selectedEvaluations.length} sessões selecionadas compartilham <strong>{commonKeys.length}</strong> indicadores pontuados. Somente esses indicadores entram na série abaixo.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {comparableStageData.map((item, idx) => (
                <div key={selectedEvaluations[idx].id} className="rounded-lg border border-teal-200 px-3 py-2 text-sm dark:border-teal-800">
                  <span className="block text-foreground/80">{item.date}</span>
                  <strong>{item.score}%</strong>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-foreground/75">As diferenças são descritivas e não comprovam eficácia ou mudança clinicamente significativa.</p>
          </>
        ) : <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">Não há indicadores pontuados em todas as sessões escolhidas. Não calcule evolução comparável.</p>}
      </Card>
      {/* Comparação entre Avaliações: Inicial → Final */}
      <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-lg font-bold text-foreground text-center">
            Comparação entre Avaliações
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Médias brutas armazenadas (podem conter indicadores diferentes)
          </p>
          {stageData.length >= 2 && (
            <Badge
              className={`mt-2 ${stageVariation === null ? "bg-secondary text-secondary-foreground" : getVariationColor(stageVariation)} flex items-center gap-1`}
            >
              {stageVariation !== null && getVariationIcon(stageVariation)}
              {stageVariation === null
                ? "Médias brutas indisponíveis para comparação"
                : `Diferença entre médias brutas (não ajustadas): ${stageVariation > 0 ? "+" : ""}${stageVariation} p.p.`}
            </Badge>
          )}
        </div>
        <div className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} margin={{ top: 30, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Score Global"]}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload
                    ? `${payload[0].payload.label} • ${payload[0].payload.date}`
                    : label
                }
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={56}>
                {stageData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="score"
                  position="top"
                  formatter={(v: number) => `${v}%`}
                  style={{ fontSize: 12, fontWeight: 700, fill: "hsl(var(--foreground))" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Levantamento de Dados — Indicadores Gerais */}
      {analysis.stages.length < 2 && (
        <Card role="status" className="border-border bg-muted/30 p-4 text-sm text-muted-foreground sm:p-6">
          Registre pontuações em pelo menos 2 avaliações para visualizar médias, variações e síntese descritiva. Avaliações sem pontuação não são consideradas zero.
        </Card>
      )}
      {analysis.stages.length >= 2 && (
      <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 text-center flex items-center justify-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          Levantamento de Dados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
              <Gauge className="h-4 w-4" /> Score Médio
            </div>
            <div className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
              {analysis.averageScore}%
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
              <Award className="h-4 w-4" /> Pico
            </div>
            <div className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
              {analysis.peakScore}%
            </div>
            <div className="text-xs text-muted-foreground">
              {analysis.peakStage?.meta.shortLabel}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
              <TrendingUp className="h-4 w-4" /> Variação bruta
            </div>
            <div className={`text-2xl font-extrabold ${analysis.globalVariation > 5 ? "text-emerald-600" : analysis.globalVariation < -5 ? "text-red-600" : "text-gray-600"}`}>
              {analysis.globalVariation > 0 ? `+${analysis.globalVariation}` : analysis.globalVariation} p.p.
            </div>
            <div className="text-xs text-muted-foreground">
              {analysis.globalPercentChange > 0 ? `+${analysis.globalPercentChange}` : analysis.globalPercentChange}% relativo
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
              <Target className="h-4 w-4" /> Período
            </div>
            <div className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
              {analysis.periodMonths}<span className="text-sm font-semibold"> {analysis.periodMonths === 1 ? "mês" : "meses"}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {analysis.stages.length} avaliações
            </div>
          </div>
        </div>
      </Card>
      )}

      {/* Comparação etapa a etapa (Inicial → Final) */}
      {analysis.transitions.length > 0 && (
        <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 text-center">
            Comparação Detalhada entre Etapas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
            Variação do Score Global entre cada avaliação consecutiva
          </p>
          <div className="space-y-3">
            {analysis.transitions.map((t, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold" style={{ color: t.from.meta.color }}>
                      {t.from.meta.shortLabel}
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{t.from.score}%</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold" style={{ color: t.to.meta.color }}>
                      {t.to.meta.shortLabel}
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{t.to.score}%</span>
                  </div>
                </div>
                <div className="text-center hidden sm:block">
                  <span className="text-sm text-muted-foreground">{t.daysBetween} dias</span>
                </div>
                <Badge className={`${getVariationColor(t.variation)} flex items-center gap-1 text-sm px-3 py-1`}>
                  {getVariationIcon(t.variation)}
                  {t.variation > 0 ? `+${t.variation}` : t.variation}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Síntese descritiva apenas com pelo menos dois registros pontuados. */}
      {analysis.stages.length >= 2 && (
      <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-foreground mb-3 text-center">
          Síntese descritiva
        </h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 text-justify">
          O paciente foi acompanhado por meio de <strong>{analysis.stages.length} avaliações</strong>
          {analysis.periodMonths ? <> ao longo de aproximadamente <strong>{analysis.periodMonths} {analysis.periodMonths === 1 ? "mês" : "meses"}</strong></> : null}.
          A pontuação global registrada passou de <strong>{analysis.firstScore}%</strong> (primeiro registro pontuado) para{" "}
          <strong>{analysis.lastScore}%</strong> (último registro pontuado), uma diferença descritiva de{" "}
          <strong className={analysis.globalVariation > 5 ? "text-emerald-600" : analysis.globalVariation < -5 ? "text-red-600" : "text-gray-600"}>
            {analysis.globalVariation > 0 ? `+${analysis.globalVariation}` : analysis.globalVariation}
          </strong> pontos percentuais. A comparação clínica deve considerar os indicadores equivalentes, a cobertura e as condições de aplicação de cada sessão.
          {analysis.topGains.length > 0 && (
            <> Os domínios com maiores variações positivas foram <strong>{analysis.topGains.map((d) => `${d.domain} (+${d.variation} p.p.)`).join(", ")}</strong>.</>
          )}
          {analysis.declines.length > 0 && (
            <> Variações negativas foram observadas nos domínios <strong>{analysis.declines.map((d) => `${d.domain} (${d.variation} p.p.)`).join(", ")}</strong>.</>
          )}
        </p>
      </Card>
      )}


      <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-4 text-center">
          Evolução ao Longo do Tempo
        </h3>
        <div className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="overall"
                name="Score Global"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#059669", strokeWidth: 2 }}
              />
              {Object.entries(DOMAIN_COLORS).slice(0, 4).map(([domain, color]) => (
                <Line
                  key={domain}
                  type="monotone"
                  dataKey={domain}
                  name={domain}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: color, strokeWidth: 1, r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tabela Comparativa */}
      <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4 text-center">
          Análise Comparativa Detalhada
        </h3>
        <div className="overflow-x-auto rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/50 dark:bg-gray-800/50">
                <TableHead className="font-bold text-gray-800 dark:text-gray-200">Domínio</TableHead>
                {selectedEvaluations.map((evaluation, index) => (
                  <TableHead key={evaluation.id} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COMPARISON_COLORS[index] }}
                      />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {format(new Date(evaluation.date), "dd/MM/yy")}
                      </span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center font-bold text-gray-800 dark:text-gray-200">
                  Variação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTableData.map((row) => (
                <TableRow key={row.domain} className="hover:bg-white/50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                    {row.domain}
                  </TableCell>
                  {row.scores.map((score, index) => (
                    <TableCell key={index} className="text-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {score === null ? "Sem dados" : `${score}%`}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Badge className={`${getVariationColor(row.variation ?? 0)} flex items-center gap-1 justify-center`}>
                      {getVariationIcon(row.variation ?? 0)}
                      {row.variation === null ? "Não comparável" : row.variation > 0 ? `+${row.variation} p.p.` : `${row.variation} p.p.`}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha do Score Global */}
              <TableRow className="bg-secondary/50 font-bold">
                <TableCell className="font-bold text-foreground">
                  PONTUAÇÃO GLOBAL
                </TableCell>
                {selectedEvaluations.map((evaluation) => (
                  <TableCell key={evaluation.id} className="text-center">
                    <span className="font-bold text-foreground tabular-nums">
                      {getRecordedEvaluationScore(evaluation) === null ? "Sem dados" : `${getRecordedEvaluationScore(evaluation)}%`}
                    </span>
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {selectedEvaluations.length >= 2 && (
                    <Badge
                      className={`${stageVariation === null ? "bg-secondary text-secondary-foreground" : getVariationColor(stageVariation)} flex items-center gap-1 justify-center`}
                    >
                      {stageVariation !== null && getVariationIcon(stageVariation)}
                      {stageVariation === null ? "Não comparável" : `${stageVariation > 0 ? "+" : ""}${stageVariation} p.p.`}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
