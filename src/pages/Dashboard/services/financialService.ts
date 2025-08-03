
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FinancialAgendaItem } from "../types/dashboardTypes";

export async function getWeekFinancialRecords(professionalId: string, startDate: Date, endDate: Date) {
  console.log("🔍 Buscando registros financeiros da semana...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar registros financeiros");
      return [];
    }

    console.log("👤 User ID para busca de registros financeiros:", user.id);

    // Tenta primeiro com o professionalId passado como parâmetro
    const { data: financialRecords, error: financialError } = await supabase
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
      .lte('session_date', format(endDate, "yyyy-MM-dd"));

    if (financialError) {
      console.error("❌ Erro ao buscar registros financeiros:", financialError);
      return [];
    } else {
      console.log("✅ Registros financeiros da semana encontrados:", financialRecords?.length || 0);
      return financialRecords || [];
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar registros financeiros:", error);
    return [];
  }
}

export async function getFinancialSchedule(professionalId: string): Promise<FinancialAgendaItem[]> {
  console.log("🔍 Buscando agenda financeira...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar agenda financeira");
      return [];
    }

    console.log("👤 User ID para busca de agenda financeira:", user.id);

    // Tenta primeiro com o professionalId passado como parâmetro
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
      .eq('professional_id', professionalId)
      .gte('session_date', format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))
      .order('session_date', { ascending: false })
      .limit(10);

    if (financialScheduleError) {
      console.error("❌ Erro ao buscar agenda financeira:", financialScheduleError);
      return [];
    } else {
      console.log("✅ Agenda financeira encontrada:", financialScheduleData?.length || 0);
      
      return financialScheduleData?.map(record => ({
        id: record.id,
        amount: record.amount,
        session_date: record.session_date,
        description: record.description,
        patient_name: record.patients?.name || 'Não informado',
        clinic_name: record.clinics?.name || 'Não informado',
        formatted_date: format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR }),
        formatted_amount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(record.amount)
      })) || [];
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar agenda financeira:", error);
    return [];
  }
}
