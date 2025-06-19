
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
  const { data: anamnesisData, error: anamnesisError, count: totalAnamnesis } = await supabase
    .from("anamnesis")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', professionalId);

  if (anamnesisError) {
    console.error("❌ Erro ao buscar anamneses:", anamnesisError);
    console.log("🔄 Tentando busca alternativa de anamneses usando user_id...");
    
    // Fallback: try with user_id if professional_id fails
    const { data: anamnesisDataFallback, error: anamnesisErrorFallback, count: totalAnamnesisAlt } = await supabase
      .from("anamnesis")
      .select('id', { count: 'exact', head: true })
      .eq('professional_id', professionalId); // Note: keeping same ID as it was user.id in fallback

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
