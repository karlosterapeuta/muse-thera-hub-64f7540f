
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FinancialAgendaItem } from "../types/dashboardTypes";
import { getCurrentUserId } from "./professionalService";

export async function getWeekFinancialRecords(professionalId: string, startDate: Date, endDate: Date) {
  console.log("🔍 Buscando registros financeiros da semana...");
  console.log("📅 Período:", format(startDate, "yyyy-MM-dd"), "até", format(endDate, "yyyy-MM-dd"));
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar registros financeiros");
      return [];
    }

    console.log("👤 User ID para busca financeira:", userId);

    const { data: financialRecords, error: financialError } = await supabase
      .from("financial_records")
      .select(`
        id, 
        amount, 
        session_date, 
        description,
        professional_id
      `)
      .eq('professional_id', userId)
      .gte('session_date', format(startDate, "yyyy-MM-dd"))
      .lte('session_date', format(endDate, "yyyy-MM-dd"))
      .order('session_date', { ascending: false });

    if (financialError) {
      console.error("❌ Erro ao buscar registros financeiros:", financialError);
      return [];
    }

    const records = financialRecords || [];
    console.log("✅ Registros financeiros da semana encontrados:", records.length);
    return records;
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar registros financeiros:", error);
    return [];
  }
}

export async function getFinancialSchedule(professionalId: string): Promise<FinancialAgendaItem[]> {
  console.log("🔍 Buscando agenda financeira...");
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar agenda financeira");
      return [];
    }

    // Buscar registros dos últimos 30 dias para ter mais dados
    const thirtyDaysAgo = subDays(new Date(), 30);

    const { data: financialScheduleData, error: financialScheduleError } = await supabase
      .from("financial_records")
      .select(`
        id,
        amount,
        session_date,
        description,
        professional_id,
        patients:patient_id (name),
        clinics:clinic_id (name)
      `)
      .eq('professional_id', userId)
      .gte('session_date', format(thirtyDaysAgo, "yyyy-MM-dd"))
      .order('session_date', { ascending: false })
      .limit(10);

    if (financialScheduleError) {
      console.error("❌ Erro ao buscar agenda financeira:", financialScheduleError);
      return [];
    }

    const scheduleData = financialScheduleData || [];
    console.log("✅ Agenda financeira encontrada:", scheduleData.length);
    
    return scheduleData.map(record => ({
      id: record.id,
      amount: record.amount,
      session_date: record.session_date,
      description: record.description || '',
      patient_name: record.patients?.name || 'Paciente não informado',
      clinic_name: record.clinics?.name || 'Clínica não informada',
      formatted_date: format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR }),
      formatted_amount: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(record.amount)
    }));
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar agenda financeira:", error);
    return [];
  }
}
