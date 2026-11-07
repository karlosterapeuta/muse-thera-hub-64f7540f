import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, LineChart as LineChartIcon } from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { calculateTrend } from "@/pages/evaluation/utils/suggestionEngine";
import { getRecordedEvaluationScore } from "@/utils/evolutionPresentation";

interface EvolutionTimelineProps {
  evaluations: SavedEvaluation[];
  patientName: string;
}

const DOMAIN_COLORS: Record<string, string> = {
  "Musical": "#8b5cf6",
  "Psicossocial": "#10b981",
  "Cognitivo": "#f59e0b",
  "Sensório-Motor": "#ef4444",
  "Comunicativo-Interativo": "#6366f1",
  "Neurofisiológico": "#14b8a6",
  "Executivo-Adaptativo": "#ec4899",
};

export function EvolutionTimeline({ evaluations, patientName }: EvolutionTimelineProps) {
  const [displayMode, setDisplayMode] = useState("global");
  // Ordenar avaliações por data
  const sortedEvaluations = useMemo(() => {
    return [...evaluations].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [evaluations]);

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    return sortedEvaluations.map((evaluation) => {
      const dataPoint: Record<string, string | number | null> = {
        date: format(new Date(evaluation.date), "dd/MM/yy", { locale: ptBR }),
        fullDate: evaluation.date,
        "Score Global": getRecordedEvaluationScore(evaluation),
      };

      // Não cria pontos de domínio a partir de uma avaliação sem indicadores pontuados.
      if (getRecordedEvaluationScore(evaluation) !== null) evaluation.content?.domainScores?.forEach((domain) => {
        const shortName = domain.domain.replace("Domínio ", "");
        dataPoint[shortName] = domain.score;
      });

      return dataPoint;
    });
  }, [sortedEvaluations]);

  // Calcular tendência global
  const recordedScores = useMemo(() => {
    return sortedEvaluations
      .map(getRecordedEvaluationScore)
      .filter((score): score is number => score !== null);
  }, [sortedEvaluations]);
  const globalTrend = recordedScores.length >= 2 ? calculateTrend(recordedScores) : null;

  // Calcular progresso total
  const progressData = useMemo(() => {
    if (recordedScores.length < 2) return null;
    const firstScore = recordedScores[0];
    const lastScore = recordedScores[recordedScores.length - 1];
    
    return {
      first: firstScore,
      last: lastScore,
      change: lastScore - firstScore,
    };
  }, [recordedScores]);

  const getTrendIcon = () => {
    switch (globalTrend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-emerald-600" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendLabel = () => {
    if (globalTrend === null) {
      return { text: 'Dados insuficientes', color: 'bg-secondary text-secondary-foreground' };
    }
    switch (globalTrend) {
      case 'improving':
        return { text: 'Tendência de alta', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' };
      case 'declining':
        return { text: 'Tendência de baixa', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      default:
        return { text: 'Sem tendência definida', color: 'bg-secondary text-secondary-foreground' };
    }
  };

  // Extrair domínios disponíveis
  const availableDomains = useMemo(() => {
    return [...new Set(sortedEvaluations.flatMap((evaluation) =>
      getRecordedEvaluationScore(evaluation) === null
        ? []
        : (evaluation.content?.domainScores || []).map((domain) => domain.domain.replace("Domínio ", ""))
    ))];
  }, [sortedEvaluations]);
  const displayedDomains = displayMode === "all"
    ? availableDomains
    : displayMode === "global" ? [] : availableDomains.filter((domain) => domain === displayMode);

  if (evaluations.length === 0) {
    return (
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <LineChartIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Sem dados de evolução
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Realize avaliações para visualizar a linha do tempo de evolução do paciente.
          </p>
        </div>
      </Card>
    );
  }

  const trendLabel = getTrendLabel();

  return (
    <Card className="border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <LineChartIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
              <h3 className="text-lg font-bold text-foreground">
              Linha do Tempo de Evolução
            </h3>
              <p className="text-sm text-muted-foreground">
              {patientName} • {evaluations.length} avaliação(ões)
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getTrendIcon()}
          <Badge className={trendLabel.color}>
            {trendLabel.text}
          </Badge>
        </div>
      </div>

      {/* Progresso Global */}
      {progressData && (
        <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Primeira Avaliação</p>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{progressData.first}%</p>
            </div>
            <div className="flex items-center gap-2 px-4">
              <div className="hidden h-1 w-8 rounded-full bg-border sm:block" />
              {getTrendIcon()}
              <div className="hidden h-1 w-8 rounded-full bg-primary sm:block" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Última Avaliação</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{progressData.last}%</p>
            </div>
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Variação Total</p>
              <p className={`text-2xl font-bold ${progressData.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {progressData.change > 0 ? '+' : ''}{progressData.change}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="evolution-domain-view" className="text-sm font-medium text-foreground">Séries exibidas no gráfico</label>
        <Select value={displayMode} onValueChange={setDisplayMode}>
          <SelectTrigger id="evolution-domain-view" aria-label="Séries exibidas no gráfico" className="min-h-11 w-full bg-background sm:w-[260px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Somente pontuação global</SelectItem>
            {availableDomains.map((domain) => <SelectItem key={domain} value={domain}>{domain} + global</SelectItem>)}
            {availableDomains.length > 1 && <SelectItem value="all">Todos os domínios</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {/* Gráfico: por padrão mostra só a série global, permitindo selecionar domínios. */}
      {recordedScores.length === 0 ? (
        <p role="status" className="rounded-lg bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          Ainda não há pontuação registrada para compor o gráfico.
        </p>
      ) : <div className="h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 12, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              minTickGap={24}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            {displayMode === "all" && <Legend />}
            
            {/* Linha principal - Score Global */}
            <Line
              type="monotone"
              dataKey="Score Global"
              name="Score Global"
              stroke="#059669"
              strokeWidth={3}
              dot={{ fill: "#059669", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#059669", strokeWidth: 2 }}
            />
            
            {/* Linhas dos domínios */}
            {displayedDomains.map((domain) => (
              <Line
                key={domain}
                type="monotone"
                dataKey={domain}
                name={domain}
                stroke={DOMAIN_COLORS[domain] || "#6b7280"}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: DOMAIN_COLORS[domain] || "#6b7280", strokeWidth: 1, r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>}

      {/* Legenda com explicação */}
      <div className="mt-4 p-3 bg-white/40 dark:bg-gray-800/40 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          <strong>Linha sólida:</strong> pontuação global • <strong>Linhas tracejadas:</strong> domínios selecionados. As variações são descritivas; para comparação clínica use apenas indicadores equivalentes entre avaliações.
        </p>
      </div>
    </Card>
  );
}
