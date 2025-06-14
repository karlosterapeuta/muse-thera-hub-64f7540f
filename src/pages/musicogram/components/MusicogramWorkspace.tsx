import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TherapyTemplate, TherapySession, ProgressData } from "../types";
import TherapyTemplateSelector from "./TherapyTemplateSelector";
import InteractiveCanvas from "./InteractiveCanvas";
import ProgressTracker from "./ProgressTracker";
import { Play, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MusicogramWorkspaceProps {
  templates: TherapyTemplate[];
  patientId?: string;
}

const MusicogramWorkspace: React.FC<MusicogramWorkspaceProps> = ({
  templates,
  patientId
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<TherapySession | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const { toast } = useToast();

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const startSession = () => {
    if (!selectedTemplate || !selectedTemplateData) return;

    const session: TherapySession = {
      id: `session-${Date.now()}`,
      patientId,
      templateId: selectedTemplate,
      startTime: new Date().toISOString(),
      progress: 0,
      completedActivities: []
    };

    setCurrentSession(session);
    setCurrentActivityIndex(0);
    
    toast({
      title: "Sessão Iniciada",
      description: `Começando atividade: ${selectedTemplateData.name}`,
    });
  };

  const endSession = () => {
    if (!currentSession) return;

    const endTime = new Date().toISOString();
    const finalSession = {
      ...currentSession,
      endTime,
      progress: (currentSession.completedActivities.length / selectedTemplateData!.activities.length) * 100
    };

    // Aqui você salvaria a sessão no banco de dados
    console.log("Sessão finalizada:", finalSession);

    setCurrentSession(null);
    setCurrentActivityIndex(0);
    
    toast({
      title: "Sessão Concluída",
      description: `${finalSession.completedActivities.length} atividades realizadas com sucesso!`,
    });
  };

  const handleActivityComplete = (success: boolean, timeElapsed: number) => {
    if (!currentSession || !selectedTemplateData) return;

    const currentActivity = selectedTemplateData.activities[currentActivityIndex];
    
    if (success) {
      // Atualizar progresso da sessão
      const updatedSession = {
        ...currentSession,
        completedActivities: [...currentSession.completedActivities, currentActivity.id],
        progress: ((currentSession.completedActivities.length + 1) / selectedTemplateData.activities.length) * 100
      };
      setCurrentSession(updatedSession);

      // Atualizar dados de progresso
      const existingProgress = progressData.find(p => p.activityId === currentActivity.id);
      if (existingProgress) {
        const updatedProgress: ProgressData = {
          ...existingProgress,
          attempts: existingProgress.attempts + 1,
          completions: existingProgress.completions + 1,
          averageTime: (existingProgress.averageTime + timeElapsed) / 2,
          lastAttempt: new Date().toISOString(),
          accuracy: (existingProgress.completions + 1) / (existingProgress.attempts + 1) * 100
        };
        setProgressData(prev => prev.map(p => p.activityId === currentActivity.id ? updatedProgress : p));
      } else {
        const newProgress: ProgressData = {
          activityId: currentActivity.id,
          attempts: 1,
          completions: 1,
          averageTime: timeElapsed,
          lastAttempt: new Date().toISOString(),
          accuracy: 100
        };
        setProgressData(prev => [...prev, newProgress]);
      }

      toast({
        title: "Atividade Concluída! 🎉",
        description: `Tempo: ${Math.round(timeElapsed / 1000)}s`,
      });

      // Avançar para próxima atividade ou finalizar
      if (currentActivityIndex < selectedTemplateData.activities.length - 1) {
        setTimeout(() => {
          setCurrentActivityIndex(prev => prev + 1);
        }, 2000);
      } else {
        setTimeout(() => {
          endSession();
        }, 2000);
      }
    } else {
      toast({
        title: "Tente novamente",
        description: "Não foi dessa vez, mas você consegue!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Musicograma Terapêutico
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistema inovador para musicoterapia interativa
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {patientId && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Paciente: {patientId}
                </span>
              </div>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seletor de Templates */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🎯</span>
                  Selecionar Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!currentSession ? (
                  <TherapyTemplateSelector
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                  />
                ) : (
                  selectedTemplateData && (
                    <InteractiveCanvas
                      activity={selectedTemplateData.activities[currentActivityIndex]}
                      onActivityComplete={handleActivityComplete}
                      soundEnabled={soundEnabled}
                      onToggleSound={() => setSoundEnabled(!soundEnabled)}
                    />
                  )
                )}
              </CardContent>
            </Card>

            {/* Botão de Iniciar */}
            {selectedTemplate && !currentSession && (
              <div className="mt-4 text-center">
                <Button
                  onClick={startSession}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Sessão Terapêutica
                </Button>
              </div>
            )}
          </div>

          {/* Painel Lateral */}
          <div className="space-y-4">
            {/* Progress Tracker */}
            <ProgressTracker
              currentSession={currentSession}
              progressData={progressData}
              onEndSession={endSession}
              selectedTemplateData={selectedTemplateData}
            />

            {/* Informações da Atividade */}
            {selectedTemplateData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>{selectedTemplateData.icon}</span>
                    Detalhes da Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Objetivo:</div>
                    <div className="text-sm font-medium">{selectedTemplateData.objective}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Idade:</div>
                      <div className="font-medium">{selectedTemplateData.ageGroup}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Duração:</div>
                      <div className="font-medium">{selectedTemplateData.duration}</div>
                    </div>
                  </div>

                  {currentSession && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Atividade Atual:</div>
                      <div className="text-sm font-medium">
                        {currentActivityIndex + 1}/{selectedTemplateData.activities.length} - {selectedTemplateData.activities[currentActivityIndex]?.title}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicogramWorkspace;
