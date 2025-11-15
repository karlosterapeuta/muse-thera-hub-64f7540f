import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "../types";

export function useExpiringUsers(days: number = 7) {
  return useQuery({
    queryKey: ["expiring-users", days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!roles || roles.role !== "admin") {
        return [];
      }

      // Get users expiring in the next X days
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const { data: users, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          avatar_url,
          created_at,
          status,
          expires_at,
          user_roles (role)
        `)
        .not("expires_at", "is", null)
        .gte("expires_at", new Date().toISOString())
        .lte("expires_at", futureDate.toISOString())
        .order("expires_at", { ascending: true });

      if (error) throw error;

      return users as Profile[];
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
