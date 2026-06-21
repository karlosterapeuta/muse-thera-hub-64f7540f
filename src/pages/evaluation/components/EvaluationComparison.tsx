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
import { resolveEvaluationMeta } from "@/utils/evaluationTypes";
import { buildEvolutionAnalysis } from "@/utils/evolutionAnalysis";

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
    return evaluations
      .filter((e) => selectedIds.includes(e.id))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [evaluations, selectedIds]);

  const radarData = useMemo(() => {
    if (selectedEvaluations.length === 0) return [];

    const domains = selectedEvaluations[0]?.content?.domainScores?.map((d) => d.domain) || [];

    return domains.map((domain) => {
      const dataPoint: Record<string, any> = {
        domain: domain.replace("Domínio ", ""),
        fullMark: 100,
      };

      selectedEvaluations.forEach((evaluation, index) => {
        const domainScore = evaluation.content?.domainScores?.find((d) => d.domain === domain);
        dataPoint[`eval_${index}`] = domainScore?.score || 0;
        dataPoint[`date_${index}`] = format(new Date(evaluation.date), "dd/MM", { locale: ptBR });
      });

      return dataPoint;
    });
  }, [selectedEvaluations]);

  const evolutionData = useMemo(() => {
    return selectedEvaluations.map((evaluation) => {
      const dataPoint: Record<string, any> = {
        date: format(new Date(evaluation.date), "dd/MM/yy", { locale: ptBR }),
        fullDate: evaluation.date,
        overall: evaluation.content?.overallScore?.percentage || 0,
      };

      evaluation.content?.domainScores?.forEach((domain) => {
        const shortName = domain.domain.replace("Domínio ", "");
        dataPoint[shortName] = domain.score;
      });

      return dataPoint;
    });
  }, [selectedEvaluations]);

  // Comparação entre avaliações (Inicial → Final) pelo Score Global
  const stageData = useMemo(() => {
    return selectedEvaluations.map((evaluation) => {
      const meta = resolveEvaluationMeta(evaluation);
      return {
        stage: meta.shortLabel,
        label: meta.label,
        color: meta.color,
        date: format(new Date(evaluation.date), "dd/MM/yy", { locale: ptBR }),
        score: evaluation.content?.overallScore?.percentage || 0,
      };
    });
  }, [selectedEvaluations]);

  const stageVariation = useMemo(() => {
    if (stageData.length < 2) return 0;
    return stageData[stageData.length - 1].score - stageData[0].score;
  }, [stageData]);

  const comparisonTableData = useMemo(() => {
    if (selectedEvaluations.length < 2) return [];

    const domains = selectedEvaluations[0]?.content?.domainScores?.map((d) => d.domain) || [];


    return domains.map((domain) => {
      const scores = selectedEvaluations.map((evaluation) => {
        const domainScore = evaluation.content?.domainScores?.find((d) => d.domain === domain);
        return domainScore?.score || 0;
      });

      const firstScore = scores[0];
      const lastScore = scores[scores.length - 1];
      const variation = lastScore - firstScore;

      return {
        domain: domain.replace("Domínio ", ""),
        scores,
        variation,
      };
    });
  }, [selectedEvaluations]);

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

  if (selectedIds.length === 1) {
    const evaluation = selectedEvaluations[0];
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            Avaliação de {format(new Date(evaluation.date), "dd/MM/yyyy", { locale: ptBR })}
          </h3>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Score Global: {evaluation.content?.overallScore?.percentage || 0}%
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
          Selecione mais avaliações para comparar a evolução
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparação entre Avaliações: Inicial → Final */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-0 shadow-xl">
        <div className="flex flex-col items-center mb-4">
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 text-center">
            Comparação entre Avaliações
          </h3>
          <p className="text-sm text-purple-600/80 dark:text-purple-300/80 text-center">
            Score Global da Avaliação Inicial até a Final
          </p>
          {stageData.length >= 2 && (
            <Badge
              className={`mt-2 ${getVariationColor(stageVariation)} flex items-center gap-1`}
            >
              {getVariationIcon(stageVariation)}
              Evolução total: {stageVariation > 0 ? `+${stageVariation}%` : `${stageVariation}%`}
            </Badge>
          )}
        </div>
        <div className="h-[400px]">
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
                  style={{ fontSize: 12, fontWeight: 700, fill: "#4338ca" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>


      {/* Gráfico de Evolução Temporal */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-0 shadow-xl">
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-4 text-center">
          Evolução ao Longo do Tempo
        </h3>
        <div className="h-[350px]">
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
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-0 shadow-xl">
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
                        {score}%
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Badge className={`${getVariationColor(row.variation)} flex items-center gap-1 justify-center`}>
                      {getVariationIcon(row.variation)}
                      {row.variation > 0 ? `+${row.variation}%` : `${row.variation}%`}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha do Score Global */}
              <TableRow className="bg-purple-50/50 dark:bg-purple-950/30 font-bold">
                <TableCell className="font-bold text-purple-800 dark:text-purple-200">
                  SCORE GLOBAL
                </TableCell>
                {selectedEvaluations.map((evaluation) => (
                  <TableCell key={evaluation.id} className="text-center">
                    <span className="font-bold text-purple-700 dark:text-purple-300">
                      {evaluation.content?.overallScore?.percentage || 0}%
                    </span>
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {selectedEvaluations.length >= 2 && (
                    <Badge
                      className={`${getVariationColor(
                        (selectedEvaluations[selectedEvaluations.length - 1]?.content?.overallScore?.percentage || 0) -
                          (selectedEvaluations[0]?.content?.overallScore?.percentage || 0)
                      )} flex items-center gap-1 justify-center`}
                    >
                      {getVariationIcon(
                        (selectedEvaluations[selectedEvaluations.length - 1]?.content?.overallScore?.percentage || 0) -
                          (selectedEvaluations[0]?.content?.overallScore?.percentage || 0)
                      )}
                      {(() => {
                        const variation =
                          (selectedEvaluations[selectedEvaluations.length - 1]?.content?.overallScore?.percentage || 0) -
                          (selectedEvaluations[0]?.content?.overallScore?.percentage || 0);
                        return variation > 0 ? `+${variation}%` : `${variation}%`;
                      })()}
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
