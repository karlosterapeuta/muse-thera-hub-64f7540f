
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "./professionalService";

export async function getPatientsCount(professionalId: string): Promise<number> {
  console.log("🔍 Buscando pacientes...");
  
  try {
    // Use the professionalId parameter directly (which should be user.id)
    console.log("👤 Professional ID para busca de pacientes:", professionalId);

    const { count: totalPatients, error: patientsError } = await supabase
      .from("patients")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId);

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
    // Use the professionalId parameter directly (which should be user.id)
    console.log("👤 Professional ID para busca de anamneses:", professionalId);

    const { count: totalAnamnesis, error: anamnesisError } = await supabase
      .from("anamnesis")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId);

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
    // Use the professionalId parameter directly (which should be user.id)  
    console.log("👤 Professional ID para busca de relatórios:", professionalId);

    // First try to find reports by professional_id (should be user.id)
    const { count: directCount, error: directError } = await supabase
      .from("reports")
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', professionalId)
      .eq('type', 'musicoterapia');

    if (!directError && directCount !== null) {
      console.log("✅ Relatórios encontrados:", directCount);
      return directCount;
    }

    console.log("⚠️ Erro ao buscar relatórios:", directError);
    return 0;
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar relatórios:", error);
    return 0;
  }
}
