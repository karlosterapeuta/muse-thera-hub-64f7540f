import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Wand2, Music, Brain, Heart, Target, Home, Check } from 'lucide-react';
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
    // Validação especial para a primeira etapa (Informações Básicas)
    if (currentStep === 0) {
      const missingFields = [];
      
      if (!reportData.patientName?.trim()) {
        missingFields.push({ id: 'patient_name', label: 'Nome do Paciente' });
      }
      
      if (!reportData.professionalName?.trim()) {
        missingFields.push({ id: 'professional_name', label: 'Nome do Profissional' });
      }
      
      return missingFields;
    }

    // Validação padrão para outras etapas
    const requiredFields = musicoterapiaTemplate.fields.filter(field => 
      field.required && currentStepData.fields.includes(field.id)
    );

    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim());
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <div className="relative p-8 lg:p-12">
          {/* Title Section */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Relatório de Musicoterapia
              </h1>
              <p className="text-lg text-white/90">
                Especializado para Transtorno do Espectro Autista (TEA)
              </p>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-medium">Progresso do Relatório</span>
              <span className="text-white text-lg font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-white to-yellow-200 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Step Navigation Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const Icon = step.icon;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`
                      relative p-4 rounded-xl text-left transition-all duration-300 border-2
                      ${isCurrent 
                        ? 'bg-white text-purple-700 border-white shadow-lg scale-105' 
                        : isCompleted 
                        ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' 
                        : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-lg
                        ${isCurrent ? 'bg-purple-100' : 'bg-white/20'}
                      `}>
                        <Icon className={`h-4 w-4 ${isCurrent ? 'text-purple-700' : 'text-white'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${isCurrent ? 'text-purple-700' : 'text-white'}`}>
                          {step.title}
                        </div>
                        <div className={`text-xs truncate ${isCurrent ? 'text-purple-500' : 'text-white/70'}`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Completion indicator */}
                    {isCompleted && !isCurrent && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

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

        {/* Quick Fill Panel */}
        <div className="space-y-4">
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