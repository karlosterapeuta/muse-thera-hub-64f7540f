
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getCurrentUserId } from "./professionalService";

type SessionData = {
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

    // Buscar sessões usando LEFT JOIN para ser menos restritivo
    const { data: sessionsData, error } = await supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        notes,
        patient_id,
        patients!left (
          name
        )
      `)
      .gte('date', format(startDate, "yyyy-MM-dd"))
      .lte('date', format(endDate, "yyyy-MM-dd"))
      .order('date');

    if (error) {
      console.error("❌ Erro ao buscar sessões:", error);
      return [];
    }

    if (!sessionsData || sessionsData.length === 0) {
      console.log("ℹ️ Nenhuma sessão encontrada no período");
      return [];
    }

    // Filtrar sessões que pertencem aos pacientes do profissional
    const { data: userPatients } = await supabase
      .from("patients")
      .select("id")
      .eq("professional_id", userId);

    const patientIds = userPatients?.map(p => p.id) || [];
    
    const filteredSessions = sessionsData
      .filter(session => patientIds.includes(session.patient_id))
      .map(session => ({
        id: session.id,
        date: session.date,
        notes: session.notes,
        patient_id: session.patient_id,
        patients: session.patients || { name: "Paciente não encontrado" }
      }));

    console.log("✅ Sessões da semana encontradas:", filteredSessions.length);
    return filteredSessions;

  } catch (error) {
    console.error("❌ Erro inesperado ao buscar sessões:", error);
    return [];
  }
}
