
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getCurrentUserId } from "./professionalService";

export async function getWeekSessions(professionalId: string, startDate: Date, endDate: Date) {
  console.log("🔍 Buscando sessões da semana...");
  console.log("📅 Período:", format(startDate, "yyyy-MM-dd"), "até", format(endDate, "yyyy-MM-dd"));
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar sessões");
      return [];
    }

    console.log("👤 User ID para busca de sessões:", userId);

    // Primeira tentativa: buscar sessões usando professional_id diretamente
    const { data: sessionsWithProfessional, error: sessionsError1 } = await supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        notes,
        patient_id
      `)
      .eq('professional_id', userId)
      .gte('date', format(startDate, "yyyy-MM-dd"))
      .lte('date', format(endDate, "yyyy-MM-dd"))
      .order('date');

    if (!sessionsError1 && sessionsWithProfessional && sessionsWithProfessional.length > 0) {
      console.log("✅ Sessões encontradas com professional_id:", sessionsWithProfessional.length);
      
      // Buscar nomes dos pacientes separadamente
      const sessionsWithNames = await Promise.all(
        sessionsWithProfessional.map(async (session) => {
          const { data: patient } = await supabase
            .from("patients")
            .select("name")
            .eq("id", session.patient_id)
            .single();
          
          return {
            ...session,
            patients: { name: patient?.name || "Paciente não encontrado" }
          };
        })
      );
      
      return sessionsWithNames;
    }

    // Segunda tentativa: buscar através da relação com patients
    const { data: sessionsWithJoin, error: sessionsError2 } = await supabase
      .from("sessions")
      .select(`
        id, 
        date, 
        notes,
        patient_id, 
        patients!left (
          id,
          name,
          professional_id
        )
      `)
      .gte('date', format(startDate, "yyyy-MM-dd"))
      .lte('date', format(endDate, "yyyy-MM-dd"))
      .order('date');

    if (sessionsError2) {
      console.error("❌ Erro ao buscar sessões com JOIN:", sessionsError2);
      return [];
    }

    // Filtrar apenas sessões do profissional atual
    const userSessions = sessionsWithJoin?.filter(session => 
      session.patients?.professional_id === userId
    ) || [];

    console.log("✅ Sessões da semana encontradas:", userSessions.length);
    
    // Se ainda não encontrou, buscar todas as sessões e filtrar manualmente
    if (userSessions.length === 0) {
      console.log("🔄 Tentando busca mais ampla...");
      
      const { data: allSessions } = await supabase
        .from("sessions")
        .select(`
          id, 
          date, 
          notes,
          patient_id
        `)
        .gte('date', format(startDate, "yyyy-MM-dd"))
        .lte('date', format(endDate, "yyyy-MM-dd"))
        .order('date');

      if (allSessions) {
        console.log("📊 Total de sessões no período:", allSessions.length);
        
        // Buscar pacientes do profissional
        const { data: userPatients } = await supabase
          .from("patients")
          .select("id, name")
          .eq("professional_id", userId);

        const patientIds = userPatients?.map(p => p.id) || [];
        const patientNames = Object.fromEntries(
          userPatients?.map(p => [p.id, p.name]) || []
        );

        const filteredSessions = allSessions
          .filter(session => patientIds.includes(session.patient_id))
          .map(session => ({
            ...session,
            patients: { name: patientNames[session.patient_id] || "Paciente não encontrado" }
          }));

        console.log("✅ Sessões filtradas para o profissional:", filteredSessions.length);
        return filteredSessions;
      }
    }

    return userSessions;
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar sessões:", error);
    return [];
  }
}
