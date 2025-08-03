
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

    // Primeiro, tenta buscar o perfil profissional
    const { data: professional, error: professionalError } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (professional && !professionalError) {
      console.log("👨‍⚕️ Profissional encontrado:", professional.id);
      return professional.id;
    } else {
      console.log("⚠️ Perfil profissional não encontrado, usando user_id diretamente:", user.id);
      if (professionalError) {
        console.log("Erro do perfil profissional:", professionalError);
      }
      // Fallback: retorna sempre o user.id se não encontrar professional
      return user.id;
    }
  } catch (error) {
    console.error("❌ Erro inesperado ao buscar dados do profissional:", error);
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.log("❌ Nenhum usuário logado encontrado");
      return null;
    }
    console.log("✅ User ID atual:", user.id);
    return user.id;
  } catch (error) {
    console.error("❌ Erro ao obter user ID:", error);
    return null;
  }
}
