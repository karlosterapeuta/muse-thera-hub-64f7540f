import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

const calculateAge = (birthDate: string | null): number | null => {
  if (!birthDate) return null;
  
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  
  if (isNaN(birthDateObj.getTime())) return null;
  
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};

export const usePatientsData = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["patients"],
    queryFn: async (): Promise<Patient[]> => {
      const { data: { user } } = await supabase.auth.getUser();
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
        age: patient.age || calculateAge(patient.birth_date),
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
      queryClient.invalidateQueries({ queryKey: ["patients"] });
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
      const { data: { user } } = await supabase.auth.getUser();
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
      queryClient.invalidateQueries({ queryKey: ["patients"] });
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