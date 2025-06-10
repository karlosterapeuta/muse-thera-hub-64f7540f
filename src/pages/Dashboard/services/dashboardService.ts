
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { SupabaseSession, FinancialRecord } from "../types/dashboard";

export async function fetchProfessionalProfile(userId: string) {
  const { data: professional, error } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error || !professional) {
    throw new Error("Perfil profissional não encontrado");
  }

  return professional;
}

export async function fetchSessionsAndFinancials(
  professionalId: string,
  startDate: Date,
  endDate: Date
) {
  const [sessionsResponse, financialResponse] = await Promise.all([
    supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        notes,
        patient_id, 
        patients!inner (
          id,
          name,
          professional_id
        )
      `)
      .eq('patients.professional_id', professionalId)
      .gte('date', format(startDate, "yyyy-MM-dd"))
      .lte('date', format(endDate, "yyyy-MM-dd"))
      .order('date'),
    
    supabase
      .from("financial_records")
      .select(`
        id, 
        amount, 
        session_date, 
        description,
        professional_id
      `)
      .eq('professional_id', professionalId)
      .gte('session_date', format(startDate, "yyyy-MM-dd"))
      .lte('session_date', format(endDate, "yyyy-MM-dd"))
  ]);

  if (sessionsResponse.error || financialResponse.error) {
    throw new Error("Erro ao carregar dados");
  }

  return {
    sessions: (sessionsResponse.data || []) as SupabaseSession[],
    financialRecords: (financialResponse.data || []) as FinancialRecord[]
  };
}

export async function fetchMonthlyData(
  professionalId: string,
  monthStartDate: Date,
  monthEndDate: Date
) {
  const [monthSessionsResponse, monthFinancialResponse] = await Promise.all([
    supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        notes,
        patient_id, 
        patients!inner (
          id,
          name,
          professional_id
        )
      `)
      .eq('patients.professional_id', professionalId)
      .gte('date', format(monthStartDate, "yyyy-MM-dd"))
      .lte('date', format(monthEndDate, "yyyy-MM-dd"))
      .order('date'),

    supabase
      .from("financial_records")
      .select(`
        id, 
        amount, 
        session_date, 
        description,
        professional_id
      `)
      .eq('professional_id', professionalId)
      .gte('session_date', format(monthStartDate, "yyyy-MM-dd"))
      .lte('session_date', format(monthEndDate, "yyyy-MM-dd"))
  ]);

  return {
    monthlySessions: (monthSessionsResponse.data || []) as SupabaseSession[],
    monthlyFinancialRecords: (monthFinancialResponse.data || []) as FinancialRecord[]
  };
}
