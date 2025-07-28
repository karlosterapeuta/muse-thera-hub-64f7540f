import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Wand2, Music, Brain, Heart, Target, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData, type ReportField } from '@/data/musicoterapiaTemplate';
import { MusicoterapiaFormField } from './MusicoterapiaFormField';
import { MusicoterapiaQuickFill } from './MusicoterapiaQuickFill';
import { MusicoterapiaGuidance } from './MusicoterapiaGuidance';

interface MusicoterapiaReportWizardProps {
  reportData: Partial<ReportData>;
  onUpdateData: (data: Partial<ReportData>) => void;
  onGenerateWithAI: (keyPoints: string) => void;
  isGeneratingWithAI: boolean;
  patients: any[];
}

const STEPS = [
  {
    id: 'basic_info',
    title: 'Informações Básicas',
    description: 'Dados do paciente e sessão',
    icon: Target,
    fields: ['patient_info', 'session_date', 'professional_info']
  },
  {
    id: 'objectives_activities',
    title: 'Objetivos e Atividades',
    description: 'Planejamento terapêutico musical',
    icon: Music,
    fields: ['therapeutic_objectives', 'instruments_used', 'musical_techniques', 'session_activities', 'musical_genres']
  },
  {
    id: 'assessment_scales',
    title: 'Escalas de Avaliação',
    description: 'Avaliação quantitativa musical',
    icon: Brain,
    fields: ['musical_response_scale', 'rhythm_coordination', 'musical_communication', 'emotional_regulation', 'social_interaction', 'attention_focus']
  },
  {
    id: 'evolution_response',
    title: 'Evolução e Resposta',
    description: 'Progressos e observações',
    icon: Heart,
    fields: ['patient_evolution', 'sensory_response']
  },
  {
    id: 'recommendations',
    title: 'Recomendações',
    description: 'Continuidade e orientações',
    icon: Home,
    fields: ['recommendations', 'home_activities', 'conclusion']
  }
];

export function MusicoterapiaReportWizard({
  reportData,
  onUpdateData,
  onGenerateWithAI,
  isGeneratingWithAI,
  patients
}: MusicoterapiaReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [activeField, setActiveField] = useState<string>('');
  const { toast } = useToast();

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleFieldUpdate = useCallback((fieldId: string, value: any) => {
    onUpdateData({
      ...reportData,
      fieldValues: {
        ...reportData.fieldValues,
        [fieldId]: value
      }
    });
  }, [reportData, onUpdateData]);

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuickFillInsert = (text: string) => {
    if (activeField) {
      const currentValue = reportData.fieldValues?.[activeField] || '';
      const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
      handleFieldUpdate(activeField, newValue);
      toast({
        title: "Texto inserido",
        description: "Frase especializada adicionada ao campo atual.",
      });
    }
  };

  const validateCurrentStep = () => {
    const requiredFields = musicoterapiaTemplate.fields.filter(field => 
      field.required && currentStepData.fields.includes(field.id)
    );

    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    return missingFields;
  };

  const canProceed = () => {
    const missingFields = validateCurrentStep();
    return missingFields.length === 0;
  };

  const handleAIGeneration = () => {
    const observations = Object.entries(reportData.fieldValues || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    onGenerateWithAI(observations || 'Sessão de musicoterapia para TEA');
  };

  const renderStepFields = () => {
    const stepFields = musicoterapiaTemplate.fields.filter(field =>
      currentStepData.fields.includes(field.id)
    );

    return (
      <div className="space-y-6">
        {stepFields.map((field) => (
          <div key={field.id} className="space-y-3">
            <MusicoterapiaFormField
              field={field}
              value={reportData.fieldValues?.[field.id]}
              onChange={(value) => handleFieldUpdate(field.id, value)}
              onFocus={() => setActiveField(field.id)}
            />
            
            {field.guidance && (
              <MusicoterapiaGuidance
                text={field.guidance}
                fieldId={field.id}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const StepIcon = currentStepData.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <StepIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Etapa {currentStep + 1} de {STEPS.length}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso do relatório</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Music className="h-5 w-5 text-primary" />
                    <span>Relatório de Musicoterapia</span>
                  </CardTitle>
                  <CardDescription>
                    Especializado para Transtorno do Espectro Autista (TEA)
                  </CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickFill(!showQuickFill)}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Quick Fill
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAIGeneration}
                    disabled={isGeneratingWithAI}
                  >
                    {isGeneratingWithAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        IA Assistente
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {renderStepFields()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Fill Panel */}
          {showQuickFill && (
            <MusicoterapiaQuickFill
              activeField={activeField}
              onInsert={handleQuickFillInsert}
              onClose={() => setShowQuickFill(false)}
            />
          )}

          {/* Step Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navegação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-muted hover:bg-muted/80'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <StepIcon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {step.title}
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground">
              {!canProceed() && (
                <span className="text-destructive">
                  Preencha os campos obrigatórios para continuar
                </span>
              )}
            </div>

            <Button
              onClick={handleNextStep}
              disabled={currentStep === STEPS.length - 1 || !canProceed()}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}