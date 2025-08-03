
import { supabase } from "@/integrations/supabase/client";

export async function getPatientsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando pacientes...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar pacientes");
      return 0;
    }

    const { count: totalPatients, error: patientsError } = await supabase
      .from("patients")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', user.id);

    if (patientsError) {
      console.error("❌ Erro ao buscar pacientes:", patientsError);
      return 0;
    }

    console.log("✅ Total de pacientes encontrados:", totalPatients);
    return totalPatients || 0;
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar pacientes:", error);
    return 0;
  }
}

export async function getAnamnesisCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando anamneses...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar anamneses");
      return 0;
    }

    const { count: totalAnamnesis, error: anamnesisError } = await supabase
      .from("anamnesis")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', user.id);

    if (anamnesisError) {
      console.error("❌ Erro ao buscar anamneses:", anamnesisError);
      return 0;
    }

    console.log("✅ Total de anamneses encontradas:", totalAnamnesis);
    return totalAnamnesis || 0;
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar anamneses:", error);
    return 0;
  }
}

export async function getReportsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando relatórios...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar relatórios");
      return 0;
    }

    console.log("👤 User ID para busca de relatórios:", user.id);

    // Buscar professional ID através da tabela professionals
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profError) {
      console.error("❌ Erro ao buscar professional:", profError);
      return 0;
    }

    const professionalIdToUse = professional?.id || user.id;
    console.log("🔧 Professional ID para usar:", professionalIdToUse);

    const { count: totalReports, error: reportsError } = await supabase
      .from("reports")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalIdToUse);

    if (reportsError) {
      console.error("❌ Erro ao buscar relatórios:", reportsError);
      return 0;
    }

    console.log("✅ Total de relatórios encontrados:", totalReports);
    return totalReports || 0;
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar relatórios:", error);
    return 0;
  }
}
