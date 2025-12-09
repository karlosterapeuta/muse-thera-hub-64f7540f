import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Target, 
  Gamepad2, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  FileText,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { generateSuggestions, DomainSuggestion } from "@/pages/evaluation/utils/suggestionEngine";

interface TherapeuticSuggestionsProps {
  evaluations: SavedEvaluation[];
  patientId: string | null;
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

const PRIORITY_COLORS = [
  { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", text: "text-red-800 dark:text-red-200", badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", text: "text-amber-800 dark:text-amber-200", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-800 dark:text-blue-200", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
];

export function TherapeuticSuggestions({ evaluations, patientId }: TherapeuticSuggestionsProps) {
  const navigate = useNavigate();
  
  const suggestions = useMemo(() => {
    return generateSuggestions(evaluations);
  }, [evaluations]);

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

  const getTrendLabel = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return { text: 'Em progresso', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' };
      case 'declining':
        return { text: 'Em declínio', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      default:
        return { text: 'Estável', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' };
    }
  };

  const handleNavigateToGame = (path: string) => {
    navigate(path);
  };

  const handleGeneratePlan = () => {
    if (patientId) {
      navigate(`/musicotherapy-treatment-plan?patientId=${patientId}`);
    } else {
      navigate('/musicotherapy-treatment-plan');
    }
  };

  if (evaluations.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-0 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">
            Sugestões Terapêuticas
          </h3>
        </div>
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-purple-300 dark:text-purple-600 mx-auto mb-4" />
          <p className="text-purple-700 dark:text-purple-300">
            Realize avaliações para receber sugestões terapêuticas personalizadas.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-0 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">
              Sugestões Terapêuticas
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Baseadas nos domínios prioritários
            </p>
          </div>
        </div>
        <Button
          onClick={handleGeneratePlan}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Gerar Plano de Tratamento
        </Button>
      </div>

      {/* Lista de Sugestões por Domínio */}
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => {
          const colors = PRIORITY_COLORS[index] || PRIORITY_COLORS[2];
          const icon = DOMAIN_ICONS[suggestion.shortName] || "📊";
          const trendLabel = getTrendLabel(suggestion.trend);
          
          return (
            <div
              key={suggestion.domain}
              className={`p-5 rounded-xl border-2 ${colors.bg} ${colors.border}`}
            >
              {/* Header do Domínio */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h4 className={`font-bold ${colors.text}`}>
                      {index + 1}. Domínio {suggestion.shortName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={colors.badge}>
                        {suggestion.score}%
                      </Badge>
                      <Badge className={trendLabel.color}>
                        {getTrendIcon(suggestion.trend)}
                        <span className="ml-1">{trendLabel.text}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objetivos Terapêuticos */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Objetivos Terapêuticos
                  </span>
                </div>
                <div className="space-y-3 pl-6">
                  {suggestion.objectives.map((obj, objIndex) => (
                    <div key={objIndex} className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">
                        • {obj.objective}
                      </p>
                      <ul className="space-y-1 pl-4">
                        {obj.strategies.map((strategy, stratIndex) => (
                          <li key={stratIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                            <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0 text-purple-500" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atividades Sugeridas */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Atividades Sugeridas
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                  {suggestion.activities.slice(0, 4).map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"
                    >
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jogos MuseTera */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                    Jogos MuseTera Recomendados
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {suggestion.games.map((game) => (
                    <Button
                      key={game.path}
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigateToGame(game.path)}
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700"
                    >
                      <span className="mr-1">{game.icon}</span>
                      {game.name}
                      <ExternalLink className="h-3 w-3 ml-1 text-gray-400" />
                    </Button>
                  ))}
                </div>
                {suggestion.games.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-6">
                    💡 {suggestion.games[0].benefit}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer com CTA */}
      <div className="mt-6 p-4 bg-purple-100/50 dark:bg-purple-900/30 rounded-xl text-center">
        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
          💡 Use estas sugestões como base para criar um plano de tratamento personalizado
        </p>
        <Button
          onClick={handleGeneratePlan}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Gerar Plano de Tratamento com Sugestões
        </Button>
      </div>
    </Card>
  );
}
