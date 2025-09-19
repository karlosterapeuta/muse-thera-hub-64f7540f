import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePatientsCount = () => {
  return useQuery({
    queryKey: ["patients-count"],
    queryFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const { count, error } = await supabase
        .from("patients")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', user.id);

      if (error) {       
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAnamnesisCount = () => {
  return useQuery({
    queryKey: ["anamnesis-count"],
    queryFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const { count, error } = await supabase
        .from("anamnesis")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', user.id);

      if (error) {
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useReportsCount = () => {
  return useQuery({
    queryKey: ["reports-count"],
    queryFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const { count, error } = await supabase
        .from("reports")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', user.id);

      if (error) {
        throw error;
      }

      return count || 0;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};