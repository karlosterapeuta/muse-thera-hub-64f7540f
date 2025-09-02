
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clinic, FinancialRecord, PeriodFilter } from "../types";

export const useFinancialRecords = (filter?: PeriodFilter) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["financial-records", filter],
    queryFn: async () => {
      let query = supabase
        .from("financial_records")
        .select(`
          *,
          clinics:clinic_id (name),
          patients:patient_id (name)
        `)
        .order("session_date", { ascending: false });
        
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
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
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
      const { data, error } = await supabase
        .from("financial_records")
        .update({
          clinic_id: record.clinic_id,
          patient_id: record.patient_id,
          amount: record.amount,
          session_date: record.session_date,
          description: record.description,
        })
        .eq("id", record.id)
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
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
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
      // Optimize query invalidation - only invalidate essential queries
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      
      // Invalidate dashboard separately with a slight delay to prevent race conditions
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
      }, 100);
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
      
      // Delete only records where professional_id matches the current user's ID
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
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
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

