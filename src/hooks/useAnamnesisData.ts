import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type AnamnesisItem = {
  id: string;
  patient_id: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  main_clinical_demand?: string;
  filled_by_guardian?: boolean;
};

const ANAMNESIS_QUERY_KEY = ["anamnesis"];

export const useAnamnesisData = () => {
  return useQuery({
    queryKey: ANAMNESIS_QUERY_KEY,
    queryFn: async (): Promise<AnamnesisItem[]> => {
      let { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        await new Promise((r) => setTimeout(r, 600));
        ({ data: { session } } = await supabase.auth.getSession());
      }
      const user = session?.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("anamnesis")
        .select(`
          id,
          patient_id,
          created_at,
          updated_at,
          main_clinical_demand,
          filled_by_guardian,
          patients(name)
        `)
        .eq("professional_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        main_clinical_demand: item.main_clinical_demand,
        filled_by_guardian: (item as any).filled_by_guardian,
        patient_name: item.patients?.name
      })) || [];
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useDeleteAnamnesis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (anamnesisId: string) => {
      const { error } = await supabase
        .from("anamnesis")
        .delete()
        .eq("id", anamnesisId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANAMNESIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-counts"] });
      toast({
        title: "Sucesso",
        description: "Anamnese excluída com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir anamnese:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a anamnese.",
        variant: "destructive",
      });
    },
  });
};