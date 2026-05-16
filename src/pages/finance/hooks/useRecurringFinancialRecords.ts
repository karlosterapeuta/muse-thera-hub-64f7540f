import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, addMonths, addYears, format } from "date-fns";

interface RecurringRecordData {
  clinic_id: string;
  patient_id?: string;
  amount: number;
  session_date: string;
  description?: string;
  is_recurring: boolean;
  recurrence_type: 'weekly' | 'monthly' | 'yearly';
  recurrence_end_date?: string;
  recurrence_pattern?: Record<string, any>;
}

export function useCreateRecurringRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RecurringRecordData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Create the main recurring record
      const { data: mainRecord, error: mainError } = await supabase
        .from("financial_records")
        .insert({
          professional_id: user.id,
          clinic_id: data.clinic_id,
          patient_id: data.patient_id,
          amount: data.amount,
          session_date: data.session_date,
          description: data.description,
          is_recurring: true,
          recurrence_type: data.recurrence_type,
          recurrence_end_date: data.recurrence_end_date,
          recurrence_pattern: data.recurrence_pattern || {}
        })
        .select()
        .single();

      if (mainError) throw mainError;
      
      // Generate future records based on recurrence pattern
      await generateFutureRecords(mainRecord);
      
      return mainRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
      toast.success("Registro recorrente criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar registro recorrente:", error);
      toast.error("Erro ao criar registro recorrente");
    },
  });
}

export function useUpdateRecurringSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      parentId, 
      updateData, 
      updateAll 
    }: { 
      parentId: string; 
      updateData: Partial<RecurringRecordData>; 
      updateAll: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      if (updateAll) {
        // Update parent record
        const { error: parentError } = await supabase
          .from("financial_records")
          .update(updateData)
          .eq("id", parentId)
          .eq("professional_id", user.id);

        if (parentError) throw parentError;

        // Delete existing child records
        const { error: deleteError } = await supabase
          .from("financial_records")
          .delete()
          .eq("parent_record_id", parentId)
          .eq("professional_id", user.id);

        if (deleteError) throw deleteError;

        // Get updated parent record and regenerate series
        const { data: parentRecord, error: fetchError } = await supabase
          .from("financial_records")
          .select("*")
          .eq("id", parentId)
          .single();

        if (fetchError) throw fetchError;

        await generateFutureRecords(parentRecord);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      queryClient.invalidateQueries({ queryKey: ["finance-dashboard"] });
      toast.success("Série recorrente atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar série recorrente:", error);
      toast.error("Erro ao atualizar série recorrente");
    },
  });
}

export function useDeleteRecurringSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      recordId, 
      deleteAll 
    }: { 
      recordId: string; 
      deleteAll: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      if (deleteAll) {
        // Get the parent record ID
        const { data: record, error: fetchError } = await supabase
          .from("financial_records")
          .select("id, parent_record_id")
          .eq("id", recordId)
          .single();

        if (fetchError) throw fetchError;

        const parentId = record.parent_record_id || record.id;

        // Delete all records in the series
        const { error } = await supabase
          .from("financial_records")
          .delete()
          .or(`id.eq.${parentId},parent_record_id.eq.${parentId}`)
          .eq("professional_id", user.id);

        if (error) throw error;
      } else {
        // Delete only this specific record
        const { error } = await supabase
          .from("financial_records")
          .delete()
          .eq("id", recordId)
          .eq("professional_id", user.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      toast.success("Registro(s) excluído(s) com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir registro:", error);
      toast.error("Erro ao excluir registro");
    },
  });
}

async function generateFutureRecords(parentRecord: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const startDate = new Date(parentRecord.session_date);
  const endDate = parentRecord.recurrence_end_date 
    ? new Date(parentRecord.recurrence_end_date)
    : addMonths(startDate, 3); // Default to 3 months

  const records = [];
  let currentDate = getNextOccurrence(startDate, parentRecord.recurrence_type);

  while (currentDate <= endDate && records.length < 100) { // Limit to 100 records for safety
    records.push({
      professional_id: user.id,
      clinic_id: parentRecord.clinic_id,
      patient_id: parentRecord.patient_id,
      amount: parentRecord.amount,
      session_date: format(currentDate, "yyyy-MM-dd"),
      description: `${parentRecord.description || ''} (Recorrente)`,
      is_recurring: false,
      parent_record_id: parentRecord.id,
      recurrence_pattern: parentRecord.recurrence_pattern
    });

    currentDate = getNextOccurrence(currentDate, parentRecord.recurrence_type);
  }

  if (records.length > 0) {
    const { error } = await supabase
      .from("financial_records")
      .insert(records);

    if (error) throw error;
  }
}

function getNextOccurrence(date: Date, recurrenceType: 'weekly' | 'monthly' | 'yearly'): Date {
  switch (recurrenceType) {
    case 'weekly':
      return addDays(date, 7);
    case 'monthly':
      return addMonths(date, 1);
    case 'yearly':
      return addYears(date, 1);
    default:
      return addDays(date, 7);
  }
}

export function useGenerateRecurringRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('generate_recurring_financial_records');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-records"] });
      toast.success("Registros recorrentes gerados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao gerar registros recorrentes:", error);
      toast.error("Erro ao gerar registros recorrentes");
    },
  });
}