import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePatientsCount = () => {
  return useQuery({
    queryKey: ["patients-count"],
    queryFn: async (): Promise<number> => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
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
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
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
    queryKey: ["reports-count", "musicoterapia"],
    queryFn: async (): Promise<number> => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Primeiro buscar o professional_id baseado no user_id
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profError) {
        console.error("Erro ao buscar profissional:", profError);
        return 0;
      }

      if (!professional) {
        console.log("Nenhum profissional encontrado para user_id:", user.id);
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

      console.log("✅ Total de relatórios encontrados:", count);
      return count || 0;
    },
    retry: 1,
    staleTime: 30 * 1000, // Reduzido para 30 segundos para forçar atualização
    refetchOnWindowFocus: true, // Ativado para recarregar ao focar na janela
  });
};

export const useInterventionsCount = () => {
  return useQuery({
    queryKey: ["interventions-count"],
    queryFn: async (): Promise<number> => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Primeiro buscar o professional_id baseado no user_id
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profError) {
        console.error("Erro ao buscar profissional:", profError);
        return 0;
      }

      if (!professional) {
        console.log("Nenhum profissional encontrado para user_id:", user.id);
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

      console.log("✅ Total de intervenções encontradas:", count);
      return count || 0;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};