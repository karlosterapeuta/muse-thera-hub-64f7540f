
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clinic, FinancialRecord, PeriodFilter } from "../types";

const invalidateFinance = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["financial-records"] });
  queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
};

export const useFinancialRecords = (filter?: PeriodFilter) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["financial-records", filter],
    queryFn: async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error("Usuário não autenticado");

      let query = supabase
        .from("financial_records")
        .select(`
          *,
          clinics:clinic_id (name),
          patients:patient_id (name)
        `)
        .eq("professional_id", userData.user.id)
        .order("session_date", { ascending: false })
        .range(0, 4999);
        
      if (filter?.start_date && filter?.end_date) {
        query = query.gte("session_date", filter.start_date).lte("session_date", filter.end_date);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Erro ao carregar registros financeiros",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data.map(record => ({
        ...record,
        clinic_name: record.clinics?.name,
        patient_name: record.patients?.name,
      })) as FinancialRecord[];
    },
  });
};

export const useAddFinancialRecord = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Omit<FinancialRecord, "id" | "created_at" | "updated_at" | "professional_id" | "clinic_name" | "patient_name">) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from("financial_records")
        .insert({
          ...record,
          professional_id: userData.user.id,
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Registro adicionado",
        description: "Registro financeiro adicionado com sucesso.",
      });
      invalidateFinance(queryClient);
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFinancialRecord = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Partial<FinancialRecord> & { id: string }) => {
      const { id, clinic_name, patient_name, created_at, updated_at, professional_id, ...rest } = record;

      // Apenas campos definidos são enviados — preserva session_status, is_recurring, etc.
      const payload = Object.fromEntries(
        Object.entries(rest).filter(([, v]) => v !== undefined)
      );

      const { data, error } = await supabase
        .from("financial_records")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Registro atualizado",
        description: "Registro financeiro atualizado com sucesso.",
      });
      invalidateFinance(queryClient);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar registro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFinancialRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("financial_records")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      invalidateFinance(queryClient);
    }
  });
};

export const useClearAllFinancialRecords = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { error } = await supabase
        .from("financial_records")
        .delete()
        .eq("professional_id", userData.user.id);
        
      if (error) {
        throw error;
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Registros excluídos",
        description: "Todos os registros financeiros foram excluídos com sucesso.",
      });
      invalidateFinance(queryClient);
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir registros",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
