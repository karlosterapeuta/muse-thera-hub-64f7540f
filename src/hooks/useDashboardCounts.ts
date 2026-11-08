import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePatientsCount = (userId: string | null) => {
  return useQuery({
    queryKey: ["patients-count", userId],
    queryFn: async (): Promise<number> => {
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      const { count, error } = await supabase
        .from("patients")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', userId);

      if (error) {       
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAnamnesisCount = (userId: string | null) => {
  return useQuery({
    queryKey: ["anamnesis-count", userId],
    queryFn: async (): Promise<number> => {
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      const { count, error } = await supabase
        .from("anamnesis")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', userId);

      if (error) {
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useReportsCount = (userId: string | null) => {
  return useQuery({
    queryKey: ["reports-count", "musicoterapia", userId],
    queryFn: async (): Promise<number> => {
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      // Primeiro buscar o professional_id baseado no user_id
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (profError) {
        throw profError;
      }

      if (!professional) {
        return 0;
      }

      const { count, error } = await supabase
        .from("reports")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', professional.id)
        .eq('type', 'musicoterapia');

      if (error) {
        console.error("Erro ao contar relatórios:", error);
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    enabled: Boolean(userId),
    staleTime: 30 * 1000, // Reduzido para 30 segundos para forçar atualização
    refetchOnWindowFocus: true, // Ativado para recarregar ao focar na janela
  });
};

export const useInterventionsCount = (userId: string | null) => {
  return useQuery({
    queryKey: ["interventions-count", userId],
    queryFn: async (): Promise<number> => {
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      // Primeiro buscar o professional_id baseado no user_id
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (profError) {
        throw profError;
      }

      if (!professional) {
        return 0;
      }

      const { count, error } = await supabase
        .from("treatment_plans")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', professional.id);

      if (error) {
        console.error("Erro ao contar intervenções:", error);
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    enabled: Boolean(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
