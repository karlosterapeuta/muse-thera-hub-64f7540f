
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "../types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("🔍 Starting user query...");
      
      // Check if current user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("👤 Current user:", user?.id, user?.email);
      
      if (authError) {
        console.error("❌ Auth error:", authError);
        return [];
      }
      
      if (!user) {
        console.log("❌ No authenticated user");
        return [];
      }

      // Check if user is admin
      const { data: adminRoles, error: adminError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      console.log("🔑 Admin roles check:", { 
        adminRoles, 
        adminError, 
        isAdmin: adminRoles && adminRoles.length > 0 
      });

      if (adminError) {
        console.error("❌ Error checking admin status:", adminError);
        return [];
      }

      if (!adminRoles || adminRoles.length === 0) {
        console.log("❌ User is not an admin");
        return [];
      }

      // Query all profiles with their roles
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          avatar_url,
          created_at,
          status,
          expires_at,
          user_roles (
            role
          )
        `)
        .order('created_at', { ascending: false });

      console.log("📊 Profiles query result:", {
        count: profiles?.length || 0,
        error: error,
        firstFewProfiles: profiles?.slice(0, 5)?.map(p => ({ 
          id: p.id, 
          name: p.name, 
          status: p.status,
          expires_at: p.expires_at,
          roles: p.user_roles?.length || 0,
          role_list: p.user_roles?.map(r => r.role) || []
        }))
      });

      if (error) {
        console.error('❌ Error fetching profiles:', error);
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      // Log specific search for teste1 user
      const teste1User = profiles?.find(p => 
        p.name?.toLowerCase().includes('teste') && 
        p.id === '84310732-0428-40de-8298-108bcc67e099'
      );
      
      console.log("🔍 Found teste1 user:", teste1User);

      return profiles as Profile[];
    },
    retry: false, // Don't retry on error to see issues clearly
    refetchOnWindowFocus: false, // Prevent constant refetching
  });
}
