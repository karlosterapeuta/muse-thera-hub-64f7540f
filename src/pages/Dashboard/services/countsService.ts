
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./professionalService";

export async function getPatientsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando pacientes...");
  
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar pacientes");
      return 0;
    }

    console.log("👤 User ID para busca de pacientes:", userId);

    const { count: totalPatients, error: patientsError } = await supabase
      .from("patients")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', userId);

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
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar anamneses");
      return 0;
    }

    const { count: totalAnamnesis, error: anamnesisError } = await supabase
      .from("anamnesis")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', userId);

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
    const userId = await getCurrentUserId();
    if (!userId) {
      console.log("❌ Usuário não encontrado para buscar relatórios");
      return 0;
    }

    console.log("👤 User ID para busca de relatórios:", userId);

    // Primeiro tenta buscar pelo professional_id direto
    const { count: directCount, error: directError } = await supabase
      .from("reports")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', userId);

    if (!directError && directCount > 0) {
      console.log("✅ Relatórios encontrados com professional_id direto:", directCount);
      return directCount;
    }

    // Se não encontrou, busca usando a tabela professionals
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (profError || !professional) {
      console.log("⚠️ Perfil profissional não encontrado para relatórios");
      return 0;
    }

    const { count: totalReports, error: reportsError } = await supabase
      .from("reports")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professional.id);

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
