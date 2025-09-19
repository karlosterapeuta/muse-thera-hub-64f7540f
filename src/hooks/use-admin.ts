
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAdmin() {
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      console.log("🔍 Checking admin status...");
      
      // First check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("👤 Current authenticated user:", {
        id: user?.id,
        email: user?.email,
        authError: authError
      });
      
      if (authError || !user) {
        console.log("❌ No authenticated user or auth error");
        return false;
      }

      // Check admin role using RPC function
      const { data: hasRole, error } = await supabase.rpc("has_role", {
        role: "admin",
      });

      console.log("🔑 Admin role check result:", {
        hasRole,
        error: error ? error.message : null
      });

      if (error) {
        console.error("❌ Error checking admin role:", error);
        return false;
      }

      console.log("✅ Final admin status:", hasRole);
      return hasRole;
    },
    retry: false, // Don't retry to see errors clearly
    refetchOnWindowFocus: false,
  });
}
