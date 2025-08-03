
import { supabase } from "@/integrations/supabase/client";

export async function getProfessionalId(): Promise<string | null> {
  console.log("🔍 Iniciando busca de dados do dashboard...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("❌ Erro ao obter usuário:", userError);
      return null;
    }
    
    if (!user) {
      console.log("❌ Usuário não encontrado - sem sessão ativa");
      return null;
    }
    
    console.log("👤 Usuário encontrado:", user.id);

    // First try to get professional profile
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (professional && !professionalError) {
      console.log("👨‍⚕️ Profissional encontrado:", professional.id);
      return professional.id;
    } else {
      console.log("⚠️ Perfil profissional não encontrado, usando user_id diretamente...");
      if (professionalError) {
        console.log("Erro do perfil profissional:", professionalError);
      }
      return user.id;
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar dados do profissional:", error);
    return null;
  }
}
