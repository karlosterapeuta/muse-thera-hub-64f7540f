import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SavedEvaluation {
  id: string;
  patient_id: string;
  date: string;
  type: string;
  content: {
    selections: Record<string, string>;
    observations: Record<string, string>;
    domainScores: Array<{
      domain: string;
      score: number;
      subdomains: Array<{
        name: string;
        score: number;
      }>;
    }>;
    overallScore: {
      percentage: number;
      raw: number;
      max: number;
      evaluatedParameters: number;
      totalParameters: number;
    };
    evaluationType: string;
  };
  created_at: string;
}

export function useEvaluationStorage(patientId: string | null) {
  const [savedEvaluations, setSavedEvaluations] = useState<SavedEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadEvaluations = useCallback(async () => {
    if (!patientId) {
      setSavedEvaluations([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("patient_id", patientId)
        .in("type", ["avaliacao_inicial", "avaliacao_progresso", "avaliacao_periodica", "avaliacao_final", "musetera_evaluation"])
        .order("date", { ascending: false });

      if (error) throw error;
      setSavedEvaluations((data as unknown as SavedEvaluation[]) || []);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      toast.error("Erro ao carregar avaliações salvas");
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  const saveEvaluation = async (
    date: Date,
    evaluationType: string,
    selections: Record<string, string>,
    observations: Record<string, string>,
    domainScores: SavedEvaluation["content"]["domainScores"],
    overallScore: SavedEvaluation["content"]["overallScore"]
  ) => {
    if (!patientId) {
      toast.error("Selecione um paciente antes de salvar");
      return false;
    }

    setIsSaving(true);
    try {
      const evaluationTypeMap: Record<string, string> = {
        "1": "avaliacao_inicial",
        "2": "avaliacao_progresso",
        "3": "avaliacao_periodica",
        "4": "avaliacao_final",
      };

      const type = evaluationTypeMap[evaluationType] || "musetera_evaluation";

      const content = {
        selections,
        observations,
        domainScores,
        overallScore,
        evaluationType,
      };

      const { error } = await supabase.from("assessments").insert({
        patient_id: patientId,
        date: date.toISOString(),
        type,
        content,
      });

      if (error) throw error;

      toast.success("Avaliação salva com sucesso!");
      await loadEvaluations();
      return true;
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast.error("Erro ao salvar avaliação");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEvaluation = async (evaluationId: string) => {
    try {
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", evaluationId);

      if (error) throw error;

      toast.success("Avaliação excluída com sucesso!");
      setSavedEvaluations((prev) => prev.filter((e) => e.id !== evaluationId));
      return true;
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      toast.error("Erro ao excluir avaliação");
      return false;
    }
  };

  return {
    savedEvaluations,
    isLoading,
    isSaving,
    saveEvaluation,
    deleteEvaluation,
    loadEvaluations,
  };
}
