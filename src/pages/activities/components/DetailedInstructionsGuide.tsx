import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, Clock, Eye, Lightbulb, AlertTriangle, ChevronDown, ChevronRight, Play } from "lucide-react";
import { DetailedInstruction, SubStep } from "../types";

interface DetailedInstructionsGuideProps {
  instructions: DetailedInstruction[];
  onStartExecution?: () => void;
}

export function DetailedInstructionsGuide({ instructions, onStartExecution }: DetailedInstructionsGuideProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [completedSubSteps, setCompletedSubSteps] = useState<string[]>([]);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const toggleSubStep = (subStepId: string) => {
    setCompletedSubSteps(prev => 
      prev.includes(subStepId)
        ? prev.filter(id => id !== subStepId)
        : [...prev, subStepId]
    );
  };

  const getTotalDuration = () => {
    const totalMinutes = instructions.reduce((total, instruction) => {
      const timing = instruction.timing.match(/(\d+)/);
      return total + (timing ? parseInt(timing[1]) : 0);
    }, 0);
    return `${totalMinutes} min`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Guia Passo a Passo Detalhado</h3>
          <p className="text-sm text-muted-foreground">
            {instructions.length} etapas • Duração total: {getTotalDuration()}
          </p>
        </div>
        {onStartExecution && (
          <Button onClick={onStartExecution} className="gap-2">
            <Play className="h-4 w-4" />
            Modo Execução
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {instructions.map((instruction) => (
          <Card key={instruction.step} className="border-l-4 border-l-primary/20">
            <Collapsible
              open={expandedSteps.includes(instruction.step)}
              onOpenChange={() => toggleStep(instruction.step)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {instruction.step}
                      </div>
                      <div>
                        <CardTitle className="text-base">{instruction.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {instruction.timing}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {instruction.subSteps.length} sub-etapas
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedSteps.includes(instruction.step) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">{instruction.description}</p>

                  <div className="space-y-4">
                    {/* Sub-etapas */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Sub-etapas
                      </h4>
                      <div className="space-y-2">
                        {instruction.subSteps.map((subStep) => (
                          <div
                            key={subStep.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                              completedSubSteps.includes(subStep.id)
                                ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                                : 'bg-muted/30 border-border'
                            }`}
                          >
                            <button
                              onClick={() => toggleSubStep(subStep.id)}
                              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                completedSubSteps.includes(subStep.id)
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-muted-foreground hover:border-primary'
                              }`}
                            >
                              {completedSubSteps.includes(subStep.id) && (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p className={`text-sm ${
                                completedSubSteps.includes(subStep.id) ? 'line-through text-muted-foreground' : ''
                              }`}>
                                {subStep.action}
                              </p>
                              {subStep.expectedResponse && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <strong>Resposta esperada:</strong> {subStep.expectedResponse}
                                </p>
                              )}
                              {subStep.duration && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {subStep.duration}
                                </Badge>
                              )}
                              {subStep.notes && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  {subStep.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Pontos de Observação */}
                    {instruction.observationPoints.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          O que observar
                        </h4>
                        <ul className="space-y-1">
                          {instruction.observationPoints.map((point, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Dicas */}
                    {instruction.tips.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Dicas importantes
                        </h4>
                        <div className="space-y-2">
                          {instruction.tips.map((tip, index) => (
                            <div key={index} className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <p className="text-sm text-blue-900 dark:text-blue-100">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Problemas Comuns */}
                    {instruction.commonIssues && instruction.commonIssues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Problemas comuns e soluções
                        </h4>
                        <div className="space-y-2">
                          {instruction.commonIssues.map((issue, index) => (
                            <div key={index} className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                              <p className="text-sm text-orange-900 dark:text-orange-100">{issue}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}