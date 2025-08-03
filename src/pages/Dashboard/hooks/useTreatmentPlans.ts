import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  professional_id: string;
  therapeutic_focus: string | null;
  approach_type: string | null;
  intervention_frequency: string | null;
  session_duration: string | null;
  treatment_model: string | null;
  musical_methods: string | null;
  musical_resources: string | null;
  intervention_strategies: string | null;
  expected_outcomes: string | null;
  evaluation_criteria: string | null;
  status: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useTreatmentPlans() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["treatment-plans"],
    queryFn: async (): Promise<TreatmentPlan[]> => {
      try {
        console.log("🔍 Buscando planos terapêuticos...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.log("❌ Usuário não encontrado para buscar planos terapêuticos");
          return [];
        }

        console.log("👤 User ID para busca de planos terapêuticos:", user.id);

        const { data: treatmentPlans, error } = await supabase
          .from("treatment_plans")
          .select("*")
          .eq("professional_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Erro ao buscar planos terapêuticos:", error);
          throw error;
        }

        console.log("✅ Planos terapêuticos encontrados:", treatmentPlans?.length || 0);
        return treatmentPlans || [];
      } catch (error: any) {
        console.error("❌ Erro inesperado ao buscar planos terapêuticos:", error);
        toast({
          title: "Erro ao carregar planos terapêuticos",
          description: error.message || "Ocorreu um erro inesperado",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTreatmentPlansCount() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["treatment-plans-count"],
    queryFn: async (): Promise<number> => {
      try {
        console.log("🔍 Contando planos terapêuticos...");
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.log("❌ Usuário não encontrado para contar planos terapêuticos");
          return 0;
        }

        console.log("👤 User ID para contagem de planos terapêuticos:", user.id);

        const { count, error } = await supabase
          .from("treatment_plans")
          .select("*", { count: "exact", head: true })
          .eq("professional_id", user.id);

        if (error) {
          console.error("❌ Erro ao contar planos terapêuticos:", error);
          throw error;
        }

        console.log("✅ Total de planos terapêuticos:", count);
        return count || 0;
      } catch (error: any) {
        console.error("❌ Erro inesperado ao contar planos terapêuticos:", error);
        return 0;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}