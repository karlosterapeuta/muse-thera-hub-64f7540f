
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getCurrentUserId } from "./professionalService";

export type SessionData = {
  id: string;
  date: string;
  notes: string | null;
  patient_id: string;
  patients: {
    name: string;
  } | null;
};

export async function getWeekSessions(professionalId: string, startDate: Date, endDate: Date): Promise<SessionData[]> {
  console.log("🔍 Buscando sessões da semana...");
  console.log("📅 Período:", format(startDate, "yyyy-MM-dd"), "até", format(endDate, "yyyy-MM-dd"));
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar sessões");
      return [];
    }

    console.log("👤 User ID para busca de sessões:", userId);

    // Primeiro, buscar todos os pacientes do profissional
    const { data: userPatients, error: patientsError } = await supabase
      .from("patients")
      .select("id")
      .eq("professional_id", userId);

    if (patientsError) {
      console.error("❌ Erro ao buscar pacientes do profissional:", patientsError);
      return [];
    }

    if (!userPatients || userPatients.length === 0) {
      console.log("ℹ️ Nenhum paciente encontrado para este profissional");
      return [];
    }

    const patientIds = userPatients.map(p => p.id);
    console.log("👥 IDs dos pacientes encontrados:", patientIds);

    // Buscar sessões dos pacientes no período especificado
    const { data: sessionsData, error } = await supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        notes,
        patient_id,
        patients!inner (
          name,
          professional_id
        )
      `)
      .in('patient_id', patientIds)
      .gte('date', format(startDate, "yyyy-MM-dd"))
      .lte('date', format(endDate, "yyyy-MM-dd"))
      .order('date');

    if (error) {
      console.error("❌ Erro ao buscar sessões:", error);
      return [];
    }

    if (!sessionsData || sessionsData.length === 0) {
      console.log("ℹ️ Nenhuma sessão encontrada no período especificado");
      return [];
    }

    const formattedSessions = sessionsData.map(session => ({
      id: session.id,
      date: session.date,
      notes: session.notes,
      patient_id: session.patient_id,
      patients: session.patients || { name: "Paciente não encontrado" }
    }));

    console.log("✅ Sessões da semana encontradas:", formattedSessions.length);
    return formattedSessions;

  } catch (error) {
    console.error("❌ Erro inesperado ao buscar sessões:", error);
    return [];
  }
}
