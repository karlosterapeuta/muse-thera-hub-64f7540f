
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: hasRole, error } = await supabase.rpc("has_role", {
        role: "admin",
      });

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return hasRole;
    },
  });
}
