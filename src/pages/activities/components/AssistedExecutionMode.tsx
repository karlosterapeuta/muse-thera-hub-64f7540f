import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, DetailedInstruction } from "../types";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  Bell,
  Eye,
  Target
} from "lucide-react";

interface AssistedExecutionProps {
  activity: Activity;
  onComplete: () => void;
  onUpdateProgress: (progress: ExecutionProgress) => void;
}

export interface ExecutionProgress {
  currentStep: number;
  currentSubStep: number;
  completedSteps: boolean[];
  startTime: Date;
  elapsedTime: number;
  observations: string[];
  adaptationsMade: string[];
}

export function AssistedExecutionMode({ 
  activity, 
  onComplete, 
  onUpdateProgress 
}: AssistedExecutionProps) {
  const [progress, setProgress] = useState<ExecutionProgress>({
    currentStep: 0,
    currentSubStep: 0,
    completedSteps: activity.detailedInstructions?.map(() => false) || [],
    startTime: new Date(),
    elapsedTime: 0,
    observations: [],
    adaptationsMade: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [stepTimer, setStepTimer] = useState(0);
  const [showAlert, setShowAlert] = useState<string | null>(null);

  const detailedInstructions = activity.detailedInstructions || [];
  const currentInstruction = detailedInstructions[progress.currentStep];
  const currentSubStep = currentInstruction?.subSteps[progress.currentSubStep];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        }));
        setStepTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-alerts based on timing
  useEffect(() => {
    if (currentInstruction && stepTimer > 0) {
      const expectedTime = parseStepTime(currentInstruction.timing);
      if (stepTimer >= expectedTime * 60) {
        setShowAlert(`Tempo previsto para esta etapa foi ultrapassado (${currentInstruction.timing})`);
      }
    }
  }, [stepTimer, currentInstruction]);

  const parseStepTime = (timing: string): number => {
    const match = timing.match(/(\d+)-?(\d+)?\s*minutos?/);
    if (match) {
      return parseInt(match[2] || match[1]);
    }
    return 5; // default
  };

  const startExecution = () => {
    setIsRunning(true);
    setProgress(prev => ({ ...prev, startTime: new Date() }));
  };

  const pauseExecution = () => {
    setIsRunning(false);
  };

  const nextStep = () => {
    if (progress.currentStep < detailedInstructions.length - 1) {
      const newCompletedSteps = [...progress.completedSteps];
      newCompletedSteps[progress.currentStep] = true;
      
      setProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        currentSubStep: 0,
        completedSteps: newCompletedSteps
      }));
      setStepTimer(0);
      setShowAlert(null);
    } else {
      // Complete activity
      const newCompletedSteps = [...progress.completedSteps];
      newCompletedSteps[progress.currentStep] = true;
      setProgress(prev => ({ ...prev, completedSteps: newCompletedSteps }));
      onComplete();
    }
  };

  const previousStep = () => {
    if (progress.currentStep > 0) {
      setProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        currentSubStep: 0
      }));
      setStepTimer(0);
      setShowAlert(null);
    }
  };

  const nextSubStep = () => {
    if (currentInstruction && progress.currentSubStep < currentInstruction.subSteps.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentSubStep: prev.currentSubStep + 1
      }));
    }
  };

  const previousSubStep = () => {
    if (progress.currentSubStep > 0) {
      setProgress(prev => ({
        ...prev,
        currentSubStep: prev.currentSubStep - 1
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverallProgress = (): number => {
    const completedCount = progress.completedSteps.filter(Boolean).length;
    const currentProgress = progress.currentStep / detailedInstructions.length;
    return ((completedCount + currentProgress) / detailedInstructions.length) * 100;
  };

  // Update parent component
  useEffect(() => {
    onUpdateProgress(progress);
  }, [progress, onUpdateProgress]);

  if (!currentInstruction) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Nenhuma instrução detalhada disponível para esta atividade.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Execução Assistida: {activity.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(progress.elapsedTime)}
              </Badge>
              <Badge variant="secondary">
                Etapa {progress.currentStep + 1} de {detailedInstructions.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={getOverallProgress()} className="w-full" />
            
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <Button onClick={startExecution} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {progress.elapsedTime > 0 ? 'Continuar' : 'Iniciar'}
                </Button>
              ) : (
                <Button onClick={pauseExecution} variant="outline" className="flex items-center gap-2">
                  <Pause className="h-4 w-4" />
                  Pausar
                </Button>
              )}
              
              <Button onClick={previousStep} disabled={progress.currentStep === 0} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button onClick={nextStep} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert */}
      {showAlert && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Bell className="h-4 w-4" />
              <span className="text-sm">{showAlert}</span>
              <Button size="sm" variant="ghost" onClick={() => setShowAlert(null)}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Etapa Atual</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="observations">Observações</TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        </TabsList>

        {/* Current Step */}
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {currentInstruction.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{currentInstruction.description}</p>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Tempo previsto: {currentInstruction.timing}
                </Badge>
                <Badge variant="outline">
                  <Timer className="h-3 w-3 mr-1" />
                  Tempo atual: {formatTime(stepTimer)}
                </Badge>
              </div>

              {/* Current Sub-step */}
              {currentSubStep && (
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Sub-etapa {progress.currentSubStep + 1}</h4>
                      <div className="flex gap-1">
                        <Button 
                          onClick={previousSubStep} 
                          disabled={progress.currentSubStep === 0}
                          variant="ghost" 
                          size="sm"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button 
                          onClick={nextSubStep} 
                          disabled={progress.currentSubStep >= currentInstruction.subSteps.length - 1}
                          variant="ghost" 
                          size="sm"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">{currentSubStep.action}</p>
                    
                    {currentSubStep.expectedResponse && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Resposta esperada:</strong> {currentSubStep.expectedResponse}
                      </div>
                    )}
                    
                    {currentSubStep.duration && (
                      <Badge variant="secondary" className="mt-2">
                        Duração: {currentSubStep.duration}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tips and Observation Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentInstruction.tips && currentInstruction.tips.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <h4 className="text-sm font-medium">💡 Dicas</h4>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {currentInstruction.tips.map((tip, index) => (
                          <li key={index} className="text-muted-foreground">• {tip}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {currentInstruction.observationPoints && currentInstruction.observationPoints.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Pontos de Observação
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {currentInstruction.observationPoints.map((point, index) => (
                          <li key={index} className="text-muted-foreground">• {point}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactive Checklist */}
        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Checklist de Execução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {detailedInstructions.map((instruction, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-3">
                    <Checkbox
                      checked={progress.completedSteps[stepIndex]}
                      onCheckedChange={(checked) => {
                        const newCompletedSteps = [...progress.completedSteps];
                        newCompletedSteps[stepIndex] = checked as boolean;
                        setProgress(prev => ({ ...prev, completedSteps: newCompletedSteps }));
                      }}
                    />
                    <div className="flex-1">
                      <div className={`font-medium ${stepIndex === progress.currentStep ? 'text-primary' : ''}`}>
                        {instruction.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {instruction.description}
                      </div>
                      {stepIndex === progress.currentStep && (
                        <Badge variant="outline" className="mt-1">Atual</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Observations Tab */}
        <TabsContent value="observations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Observações e Adaptações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use esta seção para registrar observações importantes e adaptações feitas durante a execução.
              </p>
              {/* This would include textarea components for notes */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral da Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{detailedInstructions.length}</div>
                  <div className="text-sm text-muted-foreground">Etapas Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{progress.completedSteps.filter(Boolean).length}</div>
                  <div className="text-sm text-muted-foreground">Concluídas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{formatTime(progress.elapsedTime)}</div>
                  <div className="text-sm text-muted-foreground">Tempo Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}