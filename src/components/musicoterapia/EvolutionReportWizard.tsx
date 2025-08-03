
import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { EvolutionFormField } from "./EvolutionFormField";
import { EvolutionReportData } from "@/hooks/useEvolutionReport";
import { evolutionMuseteraTemplate } from "@/data/evolutionMuseteraTemplate";
import { useToast } from "@/hooks/use-toast";

interface EvolutionReportWizardProps {
  reportData: EvolutionReportData;
  onUpdateReportData: (updates: Partial<EvolutionReportData>) => void;
  onGenerateWithAI: () => void;
  isGeneratingWithAI: boolean;
  control: any;
}

export function EvolutionReportWizard({
  reportData,
  onUpdateReportData,
  onGenerateWithAI,
  isGeneratingWithAI,
  control
}: EvolutionReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const sections = useMemo(() => evolutionMuseteraTemplate.sections, []);
  const currentSection = useMemo(() => sections[currentStep], [sections, currentStep]);
  const progress = useMemo(() => ((currentStep + 1) / sections.length) * 100, [currentStep, sections.length]);

  const handleNextStep = useCallback(() => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, sections.length]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleFieldUpdate = useCallback((fieldId: string, value: any) => {
    onUpdateReportData({
      content: {
        ...reportData.content,
        [fieldId]: value
      }
    });
  }, [reportData.content, onUpdateReportData]);

  const validateCurrentStep = useCallback(() => {
    const requiredFields = currentSection.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = reportData.content[field.id];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Preencha todos os campos obrigatórios antes de continuar.`
      });
      return false;
    }
    return true;
  }, [currentSection.fields, reportData.content, toast]);

  const canProceed = useMemo(() => {
    const requiredFields = currentSection.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => {
      const value = reportData.content[field.id];
      return !value || (Array.isArray(value) && value.length === 0);
    });
    return missingFields.length === 0;
  }, [currentSection.fields, reportData.content]);

  const handleAIGeneration = useCallback(() => {
    if (!reportData.patientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um paciente antes de gerar com IA"
      });
      return;
    }
    onGenerateWithAI();
  }, [reportData.patientId, onGenerateWithAI, toast]);

  const handleNextClick = useCallback(() => {
    if (validateCurrentStep()) {
      handleNextStep();
    }
  }, [validateCurrentStep, handleNextStep]);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Seção {currentStep + 1} de {sections.length}
          </h3>
          <Button
            onClick={handleAIGeneration}
            disabled={isGeneratingWithAI || !reportData.patientId}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingWithAI ? "Gerando..." : "Gerar com IA"}
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {Math.round(progress)}% concluído
        </p>
      </div>

      {/* Current Section */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSection.title}</CardTitle>
          <CardDescription>{currentSection.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSection.fields.map((field) => (
            <EvolutionFormField
              key={field.id}
              field={field}
              control={control}
              value={reportData.content[field.id]}
              onChange={(value) => handleFieldUpdate(field.id, value)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <span className="text-sm text-muted-foreground">
          {currentSection.title}
        </span>

        <Button
          onClick={handleNextClick}
          disabled={currentStep === sections.length - 1 || !canProceed}
          className="gap-2"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
