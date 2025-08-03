import React, { useState } from "react";
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

  const sections = evolutionMuseteraTemplate.sections;
  const currentSection = sections[currentStep];
  const progress = ((currentStep + 1) / sections.length) * 100;

  const handleNextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldUpdate = (fieldId: string, value: any) => {
    onUpdateReportData({
      content: {
        ...reportData.content,
        [fieldId]: value
      }
    });
  };

  const validateCurrentStep = () => {
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
  };

  const canProceed = () => {
    return validateCurrentStep();
  };

  const handleAIGeneration = () => {
    if (!reportData.patientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um paciente antes de gerar com IA"
      });
      return;
    }
    onGenerateWithAI();
  };

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
          onClick={handleNextStep}
          disabled={currentStep === sections.length - 1 || !canProceed()}
          className="gap-2"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}