
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export async function getWeekSessions(professionalId: string, startDate: Date, endDate: Date) {
  console.log("🔍 Buscando sessões da semana...");
  
  try {
    // Get the current user first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar sessões");
      return [];
    }

    console.log("👤 User ID para busca de sessões:", user.id);
    console.log("👨‍⚕️ Professional ID para busca de sessões:", professionalId);

    // Based on the pattern from other services, sessions are likely associated with user.id through patients
    // So we'll search using the user.id directly for the professional_id in patients
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
      .eq('patients.professional_id', user.id)
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
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar sessões:", error);
    return [];
  }
}
