
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
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

      return professional;
    },
  });
}
