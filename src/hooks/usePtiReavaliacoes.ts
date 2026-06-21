import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PtiReavaliacao {
  id: string;
  pti_id: string;
  professional_id: string;
  snapshot: any;
  report: any;
  created_at: string;
}

async function getProfessionalId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  const { data } = await supabase
    .from("professionals")
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle();
  return data?.id ?? null;
}

export function usePtiReavaliacoes(ptiId?: string) {
  return useQuery({
    queryKey: ["pti-reavaliacoes", ptiId],
    enabled: !!ptiId,
    queryFn: async (): Promise<PtiReavaliacao[]> => {
      const { data, error } = await supabase
        .from("pti_reavaliacoes")
        .select("*")
        .eq("pti_id", ptiId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as PtiReavaliacao[];
    },
  });
}

export function useSavePtiReavaliacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      pti_id: string;
      snapshot: any;
      report: any;
    }) => {
      const professional_id = await getProfessionalId();
      if (!professional_id) throw new Error("Profissional não encontrado");
      const { data, error } = await supabase
        .from("pti_reavaliacoes")
        .insert({
          pti_id: payload.pti_id,
          professional_id,
          snapshot: payload.snapshot,
          report: payload.report,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (_id, vars) =>
      queryClient.invalidateQueries({ queryKey: ["pti-reavaliacoes", vars.pti_id] }),
  });
}
