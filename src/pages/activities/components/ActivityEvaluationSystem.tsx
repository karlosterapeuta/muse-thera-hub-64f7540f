import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Activity } from "../types";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Target, 
  Star, 
  AlertCircle,
  TrendingUp,
  FileText,
  Timer,
  Activity as ActivityIcon
} from "lucide-react";

interface ActivityEvaluationProps {
  activity: Activity;
  patientId?: string;
  sessionId?: string;
  onSaveEvaluation: (evaluation: ActivityEvaluation) => void;
  previousEvaluations?: ActivityEvaluation[];
}

export interface ActivityEvaluation {
  id: string;
  activityId: number;
  patientId?: string;
  sessionId?: string;
  timestamp: Date;
  duration: number; // in minutes
  overallEngagement: number; // 1-10 scale
  objectivesMet: boolean[];
  observationNotes: string;
  adaptationsMade: string[];
  challengesEncountered: string[];
  successIndicators: string[];
  nextSessionRecommendations: string;
  therapeuticOutcomes: {
    area: string;
    progress: number; // 1-5 scale
    notes: string;
  }[];
}

export function ActivityEvaluationSystem({ 
  activity, 
  patientId, 
  sessionId, 
  onSaveEvaluation,
  previousEvaluations = []
}: ActivityEvaluationProps) {
  const [evaluation, setEvaluation] = useState<Partial<ActivityEvaluation>>({
    activityId: activity.id,
    patientId,
    sessionId,
    timestamp: new Date(),
    duration: 0,
    overallEngagement: 5,
    objectivesMet: activity.objectives?.map(() => false) || [],
    observationNotes: "",
    adaptationsMade: [],
    challengesEncountered: [],
    successIndicators: [],
    nextSessionRecommendations: "",
    therapeuticOutcomes: activity.therapeuticAreas?.map(area => ({
      area,
      progress: 3,
      notes: ""
    })) || []
  });

  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const startSession = () => {
    setSessionStartTime(new Date());
    setIsSessionActive(true);
  };

  const endSession = () => {
    if (sessionStartTime) {
      const duration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
      setEvaluation(prev => ({ ...prev, duration }));
    }
    setIsSessionActive(false);
  };

  const handleObjectiveMet = (index: number, met: boolean) => {
    const newObjectivesMet = [...(evaluation.objectivesMet || [])];
    newObjectivesMet[index] = met;
    setEvaluation(prev => ({ ...prev, objectivesMet: newObjectivesMet }));
  };

  const handleTherapeuticOutcome = (index: number, field: 'progress' | 'notes', value: number | string) => {
    const newOutcomes = [...(evaluation.therapeuticOutcomes || [])];
    newOutcomes[index] = { ...newOutcomes[index], [field]: value };
    setEvaluation(prev => ({ ...prev, therapeuticOutcomes: newOutcomes }));
  };

  const saveEvaluation = () => {
    const completeEvaluation: ActivityEvaluation = {
      id: `eval-${Date.now()}`,
      activityId: activity.id,
      patientId: patientId || '',
      sessionId: sessionId || '',
      timestamp: new Date(),
      duration: evaluation.duration || 0,
      overallEngagement: evaluation.overallEngagement || 5,
      objectivesMet: evaluation.objectivesMet || [],
      observationNotes: evaluation.observationNotes || '',
      adaptationsMade: evaluation.adaptationsMade || [],
      challengesEncountered: evaluation.challengesEncountered || [],
      successIndicators: evaluation.successIndicators || [],
      nextSessionRecommendations: evaluation.nextSessionRecommendations || '',
      therapeuticOutcomes: evaluation.therapeuticOutcomes || []
    };

    onSaveEvaluation(completeEvaluation);
  };

  const getProgressTrend = (area: string) => {
    const areaEvaluations = previousEvaluations
      .flatMap(evaluation => evaluation.therapeuticOutcomes)
      .filter(outcome => outcome.area === area);
    
    if (areaEvaluations.length < 2) return null;
    
    const recent = areaEvaluations.slice(-3).map(outcome => outcome.progress);
    const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    
    return average;
  };

  return (
    <div className="space-y-6">
      {/* Session Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Controle de Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {!isSessionActive ? (
              <Button onClick={startSession} className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Iniciar Sessão
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <ActivityIcon className="h-3 w-3 mr-1" />
                  Sessão Ativa
                </Badge>
                <Button onClick={endSession} variant="outline">
                  Finalizar Sessão
                </Button>
              </div>
            )}
            
            {evaluation.duration && evaluation.duration > 0 && (
              <Badge variant="secondary">
                Duração: {evaluation.duration} minutos
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
          <TabsTrigger value="objectives">Objetivos</TabsTrigger>
          <TabsTrigger value="outcomes">Resultados</TabsTrigger>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
        </TabsList>

        {/* Real-time Evaluation */}
        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avaliação em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nível de Engajamento (1-10)
                </label>
                <Slider
                  value={[evaluation.overallEngagement || 5]}
                  onValueChange={(value) => setEvaluation(prev => ({ ...prev, overallEngagement: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Baixo</span>
                  <span>Médio</span>
                  <span>Alto</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Observações da Sessão
                </label>
                <Textarea
                  placeholder="Registre observações importantes sobre comportamento, reações, progressos..."
                  value={evaluation.observationNotes}
                  onChange={(e) => setEvaluation(prev => ({ ...prev, observationNotes: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Adaptações Realizadas
                </label>
                <Textarea
                  placeholder="Descreva adaptações feitas durante a atividade..."
                  value={evaluation.adaptationsMade?.join('\n')}
                  onChange={(e) => setEvaluation(prev => ({ 
                    ...prev, 
                    adaptationsMade: e.target.value.split('\n').filter(line => line.trim()) 
                  }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectives Evaluation */}
        <TabsContent value="objectives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Avaliação de Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={evaluation.objectivesMet?.[index] || false}
                      onCheckedChange={(checked) => handleObjectiveMet(index, checked as boolean)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{objective}</p>
                      {evaluation.objectivesMet?.[index] && (
                        <Badge variant="secondary" className="mt-1 text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Alcançado
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Progresso dos Objetivos</span>
                </div>
                <Progress 
                  value={((evaluation.objectivesMet?.filter(Boolean).length || 0) / (activity.objectives?.length || 1)) * 100} 
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {evaluation.objectivesMet?.filter(Boolean).length || 0} de {activity.objectives?.length || 0} objetivos alcançados
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Therapeutic Outcomes */}
        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Terapêuticos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluation.therapeuticOutcomes?.map((outcome, index) => {
                const previousTrend = getProgressTrend(outcome.area);
                return (
                  <div key={index} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{outcome.area}</h4>
                      {previousTrend && (
                        <Badge variant="outline" className="text-xs">
                          Média anterior: {previousTrend.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Progresso (1-5): {outcome.progress}
                      </label>
                      <Slider
                        value={[outcome.progress]}
                        onValueChange={(value) => handleTherapeuticOutcome(index, 'progress', value[0])}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full mt-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Regrediu</span>
                        <span>Manteve</span>
                        <span>Progrediu</span>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Notas específicas sobre este aspecto terapêutico..."
                      value={outcome.notes}
                      onChange={(e) => handleTherapeuticOutcome(index, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumo da Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {evaluation.overallEngagement}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Engajamento</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {evaluation.objectivesMet?.filter(Boolean).length || 0}/{activity.objectives?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Objetivos</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {evaluation.duration || 0}min
                  </div>
                  <div className="text-sm text-muted-foreground">Duração</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Recomendações para Próxima Sessão
                </label>
                <Textarea
                  placeholder="Sugestões para continuidade, adaptações necessárias, objetivos para próxima sessão..."
                  value={evaluation.nextSessionRecommendations}
                  onChange={(e) => setEvaluation(prev => ({ ...prev, nextSessionRecommendations: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Salvar Rascunho</Button>
                <Button onClick={saveEvaluation}>
                  Salvar Avaliação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}