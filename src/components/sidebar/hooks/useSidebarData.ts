
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { useProfessionalData } from "@/hooks/useProfessionalData";

export function useSidebarData() {
  const { data: isAdmin } = useAdmin();
  const { data: professional } = useProfessionalData();

  const { data: userEmail } = useQuery({
    queryKey: ["userEmail"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email || null;
    },
    staleTime: 1000 * 60 * 5,
  });

  const getProfessionalInfo = () => {
    if (!professional) {
      return {
        name: "Carregando...",
        role: "Profissional"
      };
    }
    
    return {
      name: professional.name || "Profissional",
      role: professional.specialty || "Musicoterapeuta"
    };
  };

  return {
    userEmail: userEmail ?? null,
    isAdmin: isAdmin ?? false,
    professional,
    professionalInfo: getProfessionalInfo()
  };
}
