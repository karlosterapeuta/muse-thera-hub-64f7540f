import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateInterventionForm } from "@/lib/intervention-utils";
import { TherapyActivity } from "@/types/therapy-activity";

export function useActivityGeneration() {
  const { toast } = useToast();
  const [suggestedActivities, setSuggestedActivities] = useState<TherapyActivity[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");

  const generateActivities = async (
    selectedPatient: string,
    selectedDemands: Record<string, string[]>,
    selectedSubDemands: Record<string, string[]>,
    patients: any[]
  ) => {
    const validation = validateInterventionForm(selectedPatient, selectedDemands, selectedSubDemands);
    
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: validation.error,
        description: "É necessário selecionar um paciente e demandas antes de gerar sugestões.",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress("Consultando dados do paciente...");
    
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      if (!patient) {
        throw new Error("Paciente não encontrado");
      }

      setGenerationProgress("Preparando informações das demandas...");
      
      const demandsInfo: any[] = [];
      Object.entries(selectedDemands).forEach(([disorder, demands]) => {
        demands.forEach(demand => {
          demandsInfo.push({ disorder, demand });
        });
      });

      Object.entries(selectedSubDemands).forEach(([category, subDemands]) => {
        subDemands.forEach(subDemand => {
          demandsInfo.push({ 
            disorder: category.split(' - ')[0] || category,
            demand: subDemand,
            category 
          });
        });
      });

      setGenerationProgress("Gerando atividades personalizadas com IA...");
      
      const { data, error } = await supabase.functions.invoke('generate-therapy-activities', {
        body: {
          patientName: patient.name,
          demands: demandsInfo
        }
      });

      if (error) throw error;

      if (data?.activities && Array.isArray(data.activities)) {
        setSuggestedActivities(data.activities);
        toast({
          title: "Atividades geradas!",
          description: `${data.activities.length} atividades terapêuticas foram criadas com sucesso.`,
        });
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error: any) {
      console.error("Erro ao gerar sugestões:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar atividades",
        description: error.message || "Não foi possível gerar as atividades. Tente novamente.",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress("");
    }
  };

  const toggleActivity = (activityId: string) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const clearActivities = () => {
    setSuggestedActivities([]);
    setExpandedActivities(new Set());
  };

  return {
    suggestedActivities,
    expandedActivities,
    isGenerating,
    generationProgress,
    generateActivities,
    toggleActivity,
    clearActivities,
  };
}
