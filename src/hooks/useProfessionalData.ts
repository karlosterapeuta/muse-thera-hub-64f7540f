
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProfessionalData {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  phone?: string;
  register?: string;
  license_number?: string;
  association?: string;
  avatar_url?: string;
}

export function useProfessionalData() {
  return useQuery({
    queryKey: ["professional-data"],
    queryFn: async (): Promise<ProfessionalData | null> => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Erro ao obter usuário:', userError);
          return null;
        }
        
        if (!user) {
          console.log('Nenhum usuário logado encontrado');
          return null;
        }

        const { data: professional, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching professional data:', error);
          return null;
        }

        if (!professional) {
          // If no professional profile exists, create one from user data
          console.log('Nenhum perfil profissional encontrado, usando dados do usuário');
          return {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            email: user.email || '',
            specialty: 'Musicoterapeuta'
          };
        }

        return professional;
      } catch (error) {
        console.error('Erro inesperado ao buscar dados profissionais:', error);
        return null;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
