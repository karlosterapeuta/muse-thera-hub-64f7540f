import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { analyzeAreas, DomainScore } from "@/pages/evaluation/utils/suggestionEngine";
import { getRecordedEvaluationScore } from "@/utils/evolutionPresentation";

interface AreasAnalysisProps {
  evaluations: SavedEvaluation[];
}

const DOMAIN_ICONS: Record<string, string> = {
  "Musical": "🎵",
  "Psicossocial": "👥",
  "Cognitivo": "🧠",
  "Sensório-Motor": "🏃",
  "Comunicativo-Interativo": "💬",
  "Neurofisiológico": "🧬",
  "Executivo-Adaptativo": "⚙️",
};

export function AreasAnalysis({ evaluations }: AreasAnalysisProps) {
  const scoredEvaluations = useMemo(
    () => evaluations.filter((evaluation) => getRecordedEvaluationScore(evaluation) !== null),
    [evaluations]
  );
  const { improved, needsAttention } = useMemo(() => {
    return analyzeAreas(scoredEvaluations);
  }, [scoredEvaluations]);

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderDomainCard = (domain: DomainScore, type: 'improved' | 'attention') => {
    const shortName = domain.domain.replace("Domínio ", "");
    const icon = DOMAIN_ICONS[shortName] || "📊";
    const isDecline = domain.variation < 0;
    
    return (
      <div
        key={domain.domain}
        className={`p-4 rounded-xl border-2 transition-colors ${
          type === 'improved'
            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
            : isDecline
              ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-800'
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className={`font-semibold ${
              type === 'improved' 
                ? 'text-emerald-800 dark:text-emerald-200' 
                : isDecline
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-amber-800 dark:text-amber-200'
            }`}>
              {shortName}
            </span>
          </div>
          {getTrendIcon(domain.trend)}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">{domain.firstScore}%</span>
          <ArrowRight className="h-3 w-3 text-gray-400" />
          <span className={`font-bold ${
            type === 'improved' 
              ? 'text-emerald-700 dark:text-emerald-300' 
              : isDecline
                ? 'text-red-700 dark:text-red-300'
                : 'text-amber-700 dark:text-amber-300'
          }`}>
            {domain.lastScore}%
          </span>
          <Badge className={`ml-auto text-xs ${
            domain.variation > 0
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              : domain.variation < 0
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}>
            {domain.variation > 0 ? '+' : ''}{domain.variation}%
          </Badge>
        </div>
      </div>
    );
  };

  if (scoredEvaluations.length < 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              Variações positivas por área
            </h3>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 text-center py-8">
            Registre pontuações em pelo menos 2 avaliações para visualizar as variações por área.
          </p>
        </Card>

        <Card className="p-6 bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" />
            </div>
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
              Áreas a acompanhar
            </h3>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300 text-center py-8">
            Registre pontuações em pelo menos 2 avaliações para identificar áreas a acompanhar.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Variações positivas: descrição, não significância clínica. */}
      <Card className="p-4 sm:p-6 bg-card border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              Variações positivas por área
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Aumento descritivo superior a 5 pontos percentuais
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {improved.length > 0 ? (
            improved.map(domain => renderDomainCard(domain, 'improved'))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Nenhuma área superou esse critério descritivo.
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Confira também as observações clínicas das sessões.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Áreas a acompanhar */}
      <Card className="p-4 sm:p-6 bg-card border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
              Áreas a acompanhar
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Estabilidade ou variação negativa no recorte exibido
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {needsAttention.length > 0 ? (
            needsAttention.map(domain => renderDomainCard(domain, 'attention'))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Nenhuma área se enquadrou neste recorte.
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Revise a comparabilidade das avaliações selecionadas.
              </p>
            </div>
          )}
        </div>
      </Card>
      <p className="col-span-full text-sm text-muted-foreground">
        Estas variações são descritivas e podem refletir diferenças de cobertura entre avaliações. Não indicam, isoladamente, mudança clinicamente significativa. Use a comparação por indicadores equivalentes para a análise longitudinal.
      </p>
    </div>
  );
}
