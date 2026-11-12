import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  digital_signature_url?: string;
  digital_stamp_url?: string;
  stamp_photo_url?: string;
}

/** Account-scoped profile cache; never reuse professional identity across logins. */
export function useProfessionalData() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let hasAuthEvent = false;
    let lastOwner: string | null = null;
    const apply = (id: string | null) => {
      if (!active || lastOwner === id) return;
      if (lastOwner) queryClient.removeQueries({ queryKey: ["professional-data"] });
      lastOwner = id;
      setUserId(id);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      hasAuthEvent = true;
      apply(session?.user?.id ?? null);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!hasAuthEvent) apply(data.session?.user?.id ?? null);
    }).catch(() => { if (!hasAuthEvent) apply(null); });
    return () => { active = false; subscription.unsubscribe(); };
  }, [queryClient]);

  const queryResult = useQuery({
    queryKey: ["professional-data", userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ProfessionalData | null> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.id !== userId) {
        throw new Error("Sessão profissional alterada. Faça login novamente.");
      }
      let { data: professional, error } = await supabase
        .from("professionals").select("*").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (!professional) {
        const { data: created, error: insertError } = await supabase
          .from("professionals").upsert({
            user_id: user.id,
            name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
            register: "",
            phone: "",
            email: user.email || "",
            specialty: "Musicoterapeuta",
            association: "",
          }).select().single();
        if (insertError) throw insertError;
        professional = created;
      }
      return professional;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchInterval: false,
  });
  return { ...queryResult, data: queryResult.data ?? null };
}
