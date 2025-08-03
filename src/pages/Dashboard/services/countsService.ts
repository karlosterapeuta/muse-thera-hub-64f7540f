
import { supabase } from "@/integrations/supabase/client";

export async function getPatientsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando pacientes...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("❌ Usuário não encontrado para buscar pacientes");
      return 0;
    }

    console.log("👤 User ID para busca de pacientes:", user.id);

    const { count: totalPatients, error: patientsError } = await supabase
      .from("patients")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', user.id);

    if (patientsError) {
      console.error("❌ Erro ao buscar pacientes:", patientsError);
      return 0;
    } else {
      console.log("✅ Total de pacientes encontrados:", totalPatients);
      return totalPatients || 0;
    }
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

    console.log("👤 User ID para busca de anamneses:", user.id);

    const { count: totalAnamnesis, error: anamnesisError } = await supabase
      .from("anamnesis")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', user.id);

    if (anamnesisError) {
      console.error("❌ Erro ao buscar anamneses:", anamnesisError);
      return 0;
    } else {
      console.log("✅ Total de anamneses encontradas:", totalAnamnesis);
      return totalAnamnesis || 0;
    }
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

    // Primeiro tenta com o professional_id sendo o user.id
    const { count: totalReports, error: reportsError } = await supabase
      .from("reports")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', user.id);

    if (reportsError) {
      console.error("❌ Erro ao buscar relatórios com user_id:", reportsError);
      
      // Se não funcionar, tenta com o professionalId passado como parâmetro
      const { count: totalReportsWithProfId, error: reportsError2 } = await supabase
        .from("reports")
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', professionalId);
      
      if (reportsError2) {
        console.error("❌ Erro ao buscar relatórios com professionalId:", reportsError2);
        return 0;
      } else {
        console.log("✅ Total de relatórios encontrados (com professionalId):", totalReportsWithProfId);
        return totalReportsWithProfId || 0;
      }
    } else {
      console.log("✅ Total de relatórios encontrados:", totalReports);
      return totalReports || 0;
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar relatórios:", error);
    return 0;
  }
}
