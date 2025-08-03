
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { evolutionMuseteraTemplate } from "@/data/evolutionMuseteraTemplate";
import { useProfessionalData } from "./useProfessionalData";

export interface EvolutionReportData {
  templateId: string;
  patientId: string;
  professionalName: string;
  professionalRegister: string;
  date: string;
  content: Record<string, any>;
}

export function useEvolutionReport() {
  const { toast } = useToast();
  const { data: professionalData } = useProfessionalData();
  
  const [reportData, setReportData] = useState<EvolutionReportData>({
    templateId: evolutionMuseteraTemplate.id,
    patientId: "",
    professionalName: "",
    professionalRegister: "",
    date: new Date().toISOString().split('T')[0],
    content: {}
  });

  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [isProfessionalDataInitialized, setIsProfessionalDataInitialized] = useState(false);

  // Auto-populate professional data when available - using useCallback to prevent infinite loops
  const initializeProfessionalData = useCallback(() => {
    if (professionalData?.name && !isProfessionalDataInitialized) {
      setReportData(prev => ({
        ...prev,
        professionalName: professionalData.name,
        professionalRegister: professionalData.register || ""
      }));
      setIsProfessionalDataInitialized(true);
    }
  }, [professionalData?.name, professionalData?.register, isProfessionalDataInitialized]);

  useEffect(() => {
    initializeProfessionalData();
  }, [initializeProfessionalData]);

  const updateReportData = useCallback((updates: Partial<EvolutionReportData>) => {
    setReportData(prev => ({ ...prev, ...updates }));
  }, []);

  const generateWithAI = useCallback(async () => {
    if (!reportData.patientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um paciente antes de gerar com IA"
      });
      return;
    }

    setIsGeneratingWithAI(true);

    try {
      const response = await supabase.functions.invoke('organize-musicoterapia-report', {
        body: {
          reportData: {
            type: 'evolution',
            ...reportData
          }
        }
      });

      if (response.error) throw response.error;

      if (response.data?.success && response.data?.organizedContent) {
        updateReportData({
          content: response.data.organizedContent
        });

        toast({
          title: "Sucesso",
          description: "Relatório organizado com IA com sucesso!"
        });
      } else if (response.data?.fallbackContent) {
        updateReportData({
          content: response.data.fallbackContent
        });

        toast({
          title: "Aviso",
          description: "Utilizando conteúdo de fallback. Revise e ajuste conforme necessário."
        });
      }
    } catch (error) {
      console.error('Erro ao gerar com IA:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao organizar com IA. Tente novamente."
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  }, [reportData, updateReportData, toast]);

  const validateReport = useCallback(() => {
    const missingFields: string[] = [];
    
    // Validate basic fields
    if (!reportData.patientId) missingFields.push("Paciente");
    if (!reportData.professionalName) missingFields.push("Nome do Profissional");
    if (!reportData.date) missingFields.push("Data");

    // Validate required fields from template
    evolutionMuseteraTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !reportData.content[field.id]) {
          missingFields.push(field.label);
        }
      });
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }, [reportData]);

  const memoizedTemplate = useMemo(() => evolutionMuseteraTemplate, []);

  return {
    reportData,
    updateReportData,
    generateWithAI,
    isGeneratingWithAI,
    validateReport,
    evolutionMuseteraTemplate: memoizedTemplate,
    professionalData
  };
}
