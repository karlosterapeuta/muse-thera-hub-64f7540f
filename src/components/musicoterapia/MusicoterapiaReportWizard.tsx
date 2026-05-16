import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  onSaveReport: () => void;
  isSaving: boolean;
  professionalData?: any;
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
    description: 'Metas e planejamento',
    icon: Target,
    fields: ['therapeutic_objectives', 'specific_goals']
  },
  {
    id: 'session_activities',
    title: '7. Sessão e Atividades',
    description: 'Detalhamento clínico das técnicas',
    icon: Music,
    fields: ['session_setting', 'session_structure', 'session_activities', 'instruments_used', 'musical_techniques', 'musical_genres', 'improvisation_use', 'receptive_techniques', 'recreative_techniques', 'compositional_techniques', 'tempo_dynamics_used', 'vocal_work']
  },
  {
    id: 'behavioral_analysis',
    title: '8. Análise Comportamental',
    description: 'Comportamentos durante a sessão',
    icon: Brain,
    fields: ['eye_contact_quality', 'joint_attention', 'stereotypies_during_music', 'self_regulation_strategies', 'meltdown_shutdown_episodes', 'transitions_response', 'imitation_skills', 'turn_taking_musical']
  },
  {
    id: 'communication_language',
    title: '9. Comunicação e Linguagem',
    description: 'Vocalizações, CAA e pragmática',
    icon: Music,
    fields: ['vocalizations_observed', 'verbal_output_during_music', 'echolalia_musical', 'aac_use', 'pragmatic_skills']
  },
  {
    id: 'patient_evolution',
    title: '10. Evolução do Paciente',
    description: 'Comparativos, metas e indicadores',
    icon: Heart,
    fields: ['patient_evolution', 'behavioral_changes', 'skill_improvements', 'evolution_compared_baseline', 'goals_achieved', 'goals_in_progress', 'goals_not_achieved', 'quantitative_indicators']
  },
  {
    id: 'future_plan',
    title: '11. Plano Terapêutico Futuro',
    description: 'Próximos passos e prognóstico',
    icon: Target,
    fields: ['next_objectives_short', 'next_objectives_medium', 'next_objectives_long', 'proposed_interventions', 'expected_outcomes', 'revaluation_date']
  },
  {
    id: 'recommendations',
    title: '12. Encaminhamentos',
    description: 'Família, escola e equipe',
    icon: Home,
    fields: ['recommendations', 'home_activities', 'family_guidance', 'school_recommendations', 'interdisciplinary_team_notes', 'playlist_recommended', 'red_flags_to_monitor']
  },
  {
    id: 'theoretical_foundation',
    title: '13. Fundamentação Teórica',
    description: 'Abordagens e referências',
    icon: Brain,
    fields: ['theoretical_framework', 'assessment_tools_used', 'references_cited']
  },
  {
    id: 'conclusion',
    title: '14. Conclusão',
    description: 'Síntese e resumo',
    icon: Brain,
    fields: ['conclusion', 'treatment_summary']
  },
  {
    id: 'complementary_observations',
    title: '15. Observações Complementares',
    description: 'Notas adicionais',
    icon: Heart,
    fields: ['complementary_observations', 'additional_notes']
  },
  {
    id: 'final_review',
    title: '16. Revisão Final',
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
  patients,
  onSaveReport,
  isSaving,
  professionalData
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

  const stepContentRef = useRef<HTMLDivElement>(null);

  const scrollToStepContent = () => {
    setTimeout(() => {
      stepContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToStepContent();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToStepContent();
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
          professionalData={professionalData}
          patients={patients}
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
        onSaveReport={onSaveReport}
        isSaving={isSaving}
        professionalData={professionalData}
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
                        ? 'bg-white/25 text-white border-white/40 hover:bg-white/35' 
                        : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-lg
                        ${isCurrent ? 'bg-purple-100' : isCompleted ? 'bg-white/30' : 'bg-white/20'}
                      `}>
                        <Icon className={`h-4 w-4 ${isCurrent ? 'text-purple-700' : 'text-white'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${isCurrent ? 'text-purple-700' : 'text-white drop-shadow-sm'}`}>
                          {step.title}
                        </div>
                        <div className={`text-xs truncate ${isCurrent ? 'text-purple-500' : isCompleted ? 'text-yellow-200' : 'text-pink-200'}`}>
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
      <div ref={stepContentRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden border-0 shadow-lg">
            {/* Step Header with gradient accent */}
            <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-6">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <StepIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentStepData.title}</h2>
                  <p className="text-white/80 text-sm mt-1">{currentStepData.description}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-8">
              
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