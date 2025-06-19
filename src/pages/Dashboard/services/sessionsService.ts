
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export async function getWeekSessions(professionalId: string, startDate: Date, endDate: Date) {
  console.log("🔍 Buscando sessões da semana...");
  const { data: sessions, error: sessionsError } = await supabase
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
    .order('date');

  if (sessionsError) {
    console.error("❌ Erro ao buscar sessões:", sessionsError);
    return [];
  } else {
    console.log("✅ Sessões da semana encontradas:", sessions?.length || 0);
    return sessions || [];
  }
}
