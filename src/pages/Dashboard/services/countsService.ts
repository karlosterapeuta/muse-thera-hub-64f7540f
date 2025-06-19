
import { supabase } from "@/integrations/supabase/client";

export async function getPatientsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando pacientes...");
  const { data: patientsData, error: patientsError, count: totalPatients } = await supabase
    .from("patients")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', professionalId);

  if (patientsError) {
    console.error("❌ Erro ao buscar pacientes:", patientsError);
    return 0;
  } else {
    console.log("✅ Total de pacientes encontrados:", totalPatients);
    return totalPatients || 0;
  }
}

export async function getAnamnesisCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando anamneses...");
  
  // Get the current user first
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("❌ Usuário não encontrado para buscar anamneses");
    return 0;
  }

  console.log("👤 User ID para busca de anamneses:", user.id);
  console.log("👨‍⚕️ Professional ID para busca de anamneses:", professionalId);

  // First, let's try to get all anamnesis records to understand the data structure
  const { data: allAnamnesis, error: debugError } = await supabase
    .from("anamnesis")
    .select('id, professional_id')
    .limit(5);

  if (debugError) {
    console.error("❌ Erro ao fazer debug das anamneses:", debugError);
  } else {
    console.log("🔍 Primeiras 5 anamneses para debug:", allAnamnesis);
  }

  // Try with professional_id first
  const { data: anamnesisData, error: anamnesisError, count: totalAnamnesis } = await supabase
    .from("anamnesis")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', professionalId);

  if (anamnesisError) {
    console.error("❌ Erro ao buscar anamneses com professional_id:", anamnesisError);
    console.log("🔄 Tentando busca alternativa de anamneses usando user_id...");
    
    // Fallback: try with user_id directly (in case professional_id doesn't match)
    const { data: anamnesisDataFallback, error: anamnesisErrorFallback, count: totalAnamnesisAlt } = await supabase
      .from("anamnesis")
      .select('id', { count: 'exact', head: true })
      .eq('professional_id', user.id);

    if (anamnesisErrorFallback) {
      console.error("❌ Erro na busca alternativa de anamneses:", anamnesisErrorFallback);
      return 0;
    } else {
      console.log("✅ Total de anamneses encontradas (busca alternativa):", totalAnamnesisAlt);
      return totalAnamnesisAlt || 0;
    }
  } else {
    console.log("✅ Total de anamneses encontradas:", totalAnamnesis);
    return totalAnamnesis || 0;
  }
}

export async function getReportsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando relatórios...");
  const { data: reportsData, error: reportsError, count: totalReports } = await supabase
    .from("reports")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', professionalId);

  if (reportsError) {
    console.error("❌ Erro ao buscar relatórios:", reportsError);
    return 0;
  } else {
    console.log("✅ Total de relatórios encontrados:", totalReports);
    return totalReports || 0;
  }
}
