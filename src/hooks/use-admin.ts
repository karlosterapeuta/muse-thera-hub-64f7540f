import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function useAdmin() {
  const queryClient = useQueryClient();
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsSessionReady(true);
      
      if (session) {
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        console.log("[useAdmin] Auth state changed:", event);
        setIsSessionReady(true);
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log("[useAdmin] No user found");
        return false;
      }

      console.log("[useAdmin] Checking role for:", user.email);

      // Check via RPC
      const { data: hasRole, error } = await supabase.rpc("has_role", {
        role: "admin",
      });

      console.log("[useAdmin] has_role result:", hasRole, "error:", error);

      if (hasRole === true) return true;

      // Fallback: check email
      if (user.email === "musicoterapeutakarlos@gmail.com") {
        console.log("[useAdmin] Admin by email fallback");
        return true;
      }

      return false;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
    enabled: isSessionReady,
  });
}
