
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
  console.log("👤 Professional ID para busca de sessões:", professionalId);
  
  try {
    // Use the professionalId parameter directly (which should be user.id)
    // Buscar sessões através do relacionamento com pacientes
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
      .eq('patients.professional_id', professionalId)
      .gte('date', format(startDate, "yyyy-MM-dd"))
      .lte('date', format(endDate, "yyyy-MM-dd"))
      .order('date');

    if (error) {
      console.error("Erro ao buscar sessões da semana:", error);
      throw error;
    }

    // Sem resultados nesta semana: não buscar registros antigos como substitutos.
    if (!sessionsData || sessionsData.length === 0) return [];

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
