import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Wand2, Music, Brain, Heart, Target, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData, type ReportField } from '@/data/musicoterapiaTemplate';
import { MusicoterapiaFormField } from './MusicoterapiaFormField';
import { MusicoterapiaQuickFill } from './MusicoterapiaQuickFill';
import { FinalReviewSection } from './FinalReviewSection';
import { BasicInformationSection } from './BasicInformationSection';
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
    title: '1. Informações Básicas',
    description: 'Dados do paciente e profissional',
    icon: Target,
    fields: ['patient_name', 'patient_age', 'patient_diagnosis', 'session_date', 'professional_name', 'professional_registry']
  },
  {
    id: 'therapeutic_objectives',
    title: '2. Objetivos Terapêuticos',
    description: 'Metas e planejamento terapêutico',
    icon: Target,
    fields: ['therapeutic_objectives', 'specific_goals']
  },
  {
    id: 'session_activities',
    title: '3. Descrição das Sessões/Atividades Realizadas',
    description: 'Detalhamento das atividades musicais',
    icon: Music,
    fields: ['session_activities', 'instruments_used', 'musical_techniques', 'musical_genres']
  },
  {
    id: 'patient_evolution',
    title: '4. Evolução do Paciente',
    description: 'Progressos e desenvolvimentos observados',
    icon: Heart,
    fields: ['patient_evolution', 'behavioral_changes', 'skill_improvements']
  },
  {
    id: 'recommendations',
    title: '5. Encaminhamentos e Recomendações',
    description: 'Orientações e próximos passos',
    icon: Home,
    fields: ['recommendations', 'home_activities', 'family_guidance']
  },
  {
    id: 'conclusion',
    title: '6. Conclusão',
    description: 'Síntese dos resultados',
    icon: Brain,
    fields: ['conclusion', 'treatment_summary']
  },
  {
    id: 'complementary_observations',
    title: '7. Observações Complementares',
    description: 'Informações adicionais relevantes',
    icon: Heart,
    fields: ['complementary_observations', 'additional_notes']
  },
  {
    id: 'final_review',
    title: '8. Revisão Final',
    description: 'Verificação e finalização',
    icon: Target,
    fields: ['signature', 'review_notes']
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
    // Se for a primeira etapa (Informações Básicas), renderizar o componente especializado
    if (currentStep === 0) {
      return (
        <BasicInformationSection
          reportData={reportData}
          onUpdateData={onUpdateData}
        />
      );
    }

    // Se for a última etapa (Revisão Final), renderizar o componente especial
    if (currentStep === STEPS.length - 1) {
      return (
        <FinalReviewSection
          reportData={reportData}
          onOrganizeWithAI={handleAIGeneration}
          isGeneratingWithAI={isGeneratingWithAI}
        />
      );
    }

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
      {/* Header com as 8 etapas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl mb-4">Relatório de Musicoterapia</CardTitle>
          <CardDescription className="mb-6">Dados do paciente e profissional</CardDescription>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Grid das 8 etapas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <Button
                    key={step.id}
                    variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                    size="sm"
                    className="h-auto p-3 text-xs"
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="text-center">
                      <div className="font-medium">{step.title}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
              
              {renderStepFields()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Ações Rápidas */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowQuickFill(!showQuickFill)}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Salvar Rascunho
              </Button>
              
              <Button
                variant="outline" 
                className="w-full justify-start"
                onClick={handleAIGeneration}
                disabled={isGeneratingWithAI}
              >
                {isGeneratingWithAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                    Visualizando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Visualizar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Fill Panel */}
          {showQuickFill && (
            <MusicoterapiaQuickFill
              activeField={activeField}
              onInsert={handleQuickFillInsert}
              onClose={() => setShowQuickFill(false)}
            />
          )}
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