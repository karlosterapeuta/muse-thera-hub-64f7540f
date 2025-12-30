
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return false;
      }

      const { data: hasRole, error } = await supabase.rpc("has_role", {
        role: "admin",
      });

      if (error) {
        return false;
      }

      return hasRole ?? false;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
