
import { supabase } from "@/integrations/supabase/client";

export async function getPatientsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando pacientes...");
  
  // Get the current user first
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("❌ Usuário não encontrado para buscar pacientes");
    return 0;
  }

  console.log("👤 User ID para busca de pacientes:", user.id);
  console.log("👨‍⚕️ Professional ID para busca de pacientes:", professionalId);

  // Based on the pattern from anamneses, patients are likely associated with user.id
  // So we'll search using the user.id directly
  const { data: patientsData, error: patientsError, count: totalPatients } = await supabase
    .from("patients")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', user.id);

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

  // Based on the debug logs, anamneses are associated with user.id, not professionalId
  // So we'll search using the user.id directly
  const { data: anamnesisData, error: anamnesisError, count: totalAnamnesis } = await supabase
    .from("anamnesis")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', user.id);

  if (anamnesisError) {
    console.error("❌ Erro ao buscar anamneses:", anamnesisError);
    return 0;
  } else {
    console.log("✅ Total de anamneses encontradas:", totalAnamnesis);
    return totalAnamnesis || 0;
  }
}

export async function getReportsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando relatórios...");
  
  // Get the current user first
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("❌ Usuário não encontrado para buscar relatórios");
    return 0;
  }

  console.log("👤 User ID para busca de relatórios:", user.id);
  console.log("👨‍⚕️ Professional ID para busca de relatórios:", professionalId);

  // Based on the pattern from anamneses and patients, reports are likely associated with user.id
  // So we'll search using the user.id directly
  const { data: reportsData, error: reportsError, count: totalReports } = await supabase
    .from("reports")
    .select('id', { count: 'exact', head: true })
    .eq('professional_id', user.id);

  if (reportsError) {
    console.error("❌ Erro ao buscar relatórios:", reportsError);
    return 0;
  } else {
    console.log("✅ Total de relatórios encontrados:", totalReports);
    return totalReports || 0;
  }
}
