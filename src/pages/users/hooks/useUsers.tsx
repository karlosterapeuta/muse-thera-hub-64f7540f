
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "../types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          avatar_url,
          created_at,
          status,
          user_roles (
            role
          )
        `);

      if (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }

      return profiles as Profile[];
    },
  });
}
