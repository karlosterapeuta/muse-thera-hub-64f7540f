import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { ExecutionTip } from "../types";

interface ExecutionTipsPanelProps {
  executionTips: ExecutionTip[];
}

export function ExecutionTipsPanel({ executionTips }: ExecutionTipsPanelProps) {
  const getTipsByStage = (stage: ExecutionTip['stage']) => {
    return executionTips.filter(tip => tip.stage === stage);
  };

  const getTipIcon = (type: ExecutionTip['type']) => {
    switch (type) {
      case 'success_indicator':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning_sign':
        return <AlertTriangle className="h-4 w-4" />;
      case 'adaptation_cue':
        return <Info className="h-4 w-4" />;
      case 'timing_note':
        return <Clock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTipColor = (type: ExecutionTip['type']) => {
    switch (type) {
      case 'success_indicator':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-100';
      case 'warning_sign':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-100';
      case 'adaptation_cue':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100';
      case 'timing_note':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100';
    }
  };

  const getTypeLabel = (type: ExecutionTip['type']) => {
    switch (type) {
      case 'success_indicator':
        return 'Sinal de Sucesso';
      case 'warning_sign':
        return 'Sinal de Alerta';
      case 'adaptation_cue':
        return 'Adaptação';
      case 'timing_note':
        return 'Tempo';
      default:
        return 'Dica';
    }
  };

  const getStageLabel = (stage: ExecutionTip['stage']) => {
    switch (stage) {
      case 'preparation':
        return 'Preparação';
      case 'execution':
        return 'Execução';
      case 'evaluation':
        return 'Avaliação';
      default:
        return 'Geral';
    }
  };

  const getSeverityBadge = (severity?: ExecutionTip['severity']) => {
    if (!severity) return null;
    
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    };

    const labels = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta'
    };

    return (
      <Badge className={`text-xs ${colors[severity]}`}>
        Prioridade {labels[severity]}
      </Badge>
    );
  };

  const stages: ExecutionTip['stage'][] = ['preparation', 'execution', 'evaluation'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Dicas de Execução</h3>
        <p className="text-sm text-muted-foreground">
          Indicadores, alertas e orientações para cada fase da atividade
        </p>
      </div>

      <div className="space-y-6">
        {stages.map(stage => {
          const stageTips = getTipsByStage(stage);
          if (stageTips.length === 0) return null;

          return (
            <Card key={stage}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {getStageLabel(stage)}
                  <Badge variant="outline" className="ml-2">
                    {stageTips.length} dicas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stageTips.map((tip, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${getTipColor(tip.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTipIcon(tip.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {getTypeLabel(tip.type)}
                            </Badge>
                            {getSeverityBadge(tip.severity)}
                          </div>
                          <p className="text-sm">{tip.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {executionTips.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma dica de execução específica disponível para esta atividade.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}