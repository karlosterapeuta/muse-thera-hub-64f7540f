
import { supabase } from "@/integrations/supabase/client";

export async function getProfessionalId(): Promise<string | null> {
  console.log("🔍 Iniciando busca de dados do dashboard...");
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("❌ Usuário não encontrado");
    return null;
  }
  
  console.log("👤 Usuário encontrado:", user.id);

  // First try to get professional profile
  const { data: professional, error: professionalError } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (professional) {
    console.log("👨‍⚕️ Profissional encontrado:", professional.id);
    return professional.id;
  } else {
    console.log("⚠️ Perfil profissional não encontrado, usando user_id diretamente...");
    return user.id;
  }
}
