import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Isola o cache por usuário; autorização efetiva permanece sob RLS. */
export function useDashboardIdentity() {
  const [identity, setIdentity] = useState<{ userId: string | null; ready: boolean }>({ userId: null, ready: false });
  useEffect(() => {
    let active = true;
    let authRevision = 0;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event === "TOKEN_REFRESHED") return;
      authRevision += 1;
      setIdentity({ userId: session?.user?.id ?? null, ready: true });
    });
    const requestedAtRevision = authRevision;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (active && authRevision === requestedAtRevision) setIdentity({ userId: error ? null : (data.user?.id ?? null), ready: true });
    }).catch(() => {
      if (active && authRevision === requestedAtRevision) setIdentity({ userId: null, ready: true });
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  return identity;
}
