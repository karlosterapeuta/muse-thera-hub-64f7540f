import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { calculateAgeFromBirthDate } from "@/utils/dateUtils";

export type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  age: number | null;
  has_anamnesis?: boolean;
  professional_id: string;
};

export const PATIENTS_QUERY_KEY = ["patients", "list"] as const;

export const usePatientsData = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: PATIENTS_QUERY_KEY,
    queryFn: async (): Promise<Patient[]> => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Optimized query with LEFT JOIN to get anamnesis count in a single query
      const { data, error } = await supabase
        .from("patients")
        .select(`
          *,
          anamnesis!left(count)
        `)
        .eq('professional_id', user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar pacientes:", error);
        throw error;
      }

      // Transform data to include calculated age and anamnesis status
      const patientsWithData = data?.map(patient => ({
        ...patient,
        age: calculateAgeFromBirthDate(patient.birth_date),
        has_anamnesis: patient.anamnesis && patient.anamnesis.length > 0
      })) || [];

      return patientsWithData;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (patientId: string) => {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq('id', patientId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      toast({
        title: "Sucesso",
        description: "Paciente excluído com sucesso",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir paciente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o paciente",
      });
    }
  });
};

export const useDeleteAllPatients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const { error } = await supabase
        .from("patients")
        .delete()
        .eq('professional_id', user.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      toast({
        title: "Sucesso",
        description: "Todos os pacientes foram excluídos",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir pacientes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir os pacientes",
      });
    }
  });
};