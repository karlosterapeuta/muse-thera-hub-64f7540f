
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

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
  digital_signature_url?: string;
  digital_stamp_url?: string;
}

export function useProfessionalData() {
  const queryResult = useQuery({
    queryKey: ["professional-data"],
    queryFn: async (): Promise<ProfessionalData | null> => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Erro ao obter usuário:', userError);
          throw userError;
        }
        
        if (!user) {
          console.log('Nenhum usuário logado encontrado');
          return null;
        }

        let { data: professional, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching professional data:', error);
          throw error;
        }

        if (!professional) {
          // Create professional profile if it doesn't exist
          console.log('Criando perfil profissional...');
          const { data: newProfile, error: insertError } = await supabase
            .from('professionals')
            .upsert({
              user_id: user.id,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
              register: '',
              phone: '',
              email: user.email || '',
              specialty: 'Musicoterapeuta',
              association: ''
            })
            .select()
            .single();

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
            throw insertError;
          }

          professional = newProfile;
        }

        return professional;
      } catch (error) {
        console.error('Erro inesperado ao buscar dados profissionais:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 15 * 60 * 1000, // 15 minutes (increased)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Changed to false to reduce initial requests
    refetchInterval: false,
  });

  // Memoize the result to prevent unnecessary re-renders
  return useMemo(() => queryResult, [queryResult.data, queryResult.isLoading, queryResult.error]);
}
