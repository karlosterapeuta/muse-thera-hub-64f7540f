
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Special case for specific email
      if (user?.email === "marcia.jacira@hotmail.com") {
        return true;
      }

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
