
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressData, TherapySession, TherapyTemplate } from "../types";

interface ProgressTrackerProps {
  currentSession: TherapySession | null;
  progressData: ProgressData[];
  onEndSession: () => void;
  // Novo prop para trazer template selecionado
  selectedTemplateData?: TherapyTemplate | null;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentSession,
  progressData,
  onEndSession,
  selectedTemplateData
}) => {
  if (!currentSession || !selectedTemplateData) return null;

  // Corrigir cálculo do total de atividades com base no template
  const totalActivities = selectedTemplateData.activities.length;
  const sessionProgress = (currentSession.completedActivities.length / totalActivities) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Progresso da Sessão</h3>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Em andamento
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Atividades Concluídas</span>
          <span>{currentSession.completedActivities.length}/{totalActivities}</span>
        </div>
        <Progress value={sessionProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-gray-600 dark:text-gray-400">Tempo de Sessão</div>
          <div className="font-medium">
            {Math.floor((Date.now() - new Date(currentSession.startTime).getTime()) / 60000)} min
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-gray-600 dark:text-gray-400">Progresso Geral</div>
          <div className="font-medium">{Math.round(currentSession.progress)}%</div>
        </div>
      </div>

      {currentSession.completedActivities.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Atividades Realizadas:</div>
          <div className="flex flex-wrap gap-1">
            {currentSession.completedActivities.map((activityId, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                ✓ Atividade {index + 1}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t">
        <button
          onClick={onEndSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium"
        >
          Finalizar Sessão
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      {progressData.length > 0 && (
        <div className="pt-4 border-t space-y-2">
          <div className="text-sm font-medium">Estatísticas Recentes:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-600 dark:text-gray-400">Precisão Média</div>
              <div className="font-medium">
                {Math.round(progressData.reduce((acc, p) => acc + p.accuracy, 0) / progressData.length)}%
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Tempo Médio</div>
              <div className="font-medium">
                {Math.round(progressData.reduce((acc, p) => acc + p.averageTime, 0) / progressData.length / 1000)}s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
