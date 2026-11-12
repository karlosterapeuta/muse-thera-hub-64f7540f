import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type AnamnesisReviewStatus = "draft" | "finalized" | "registered";
export type AnamnesisItem = {
  id: string;
  patient_id: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  main_clinical_demand?: string;
  filled_by_guardian?: boolean;
  review_status: AnamnesisReviewStatus;
};

export const ANAMNESIS_QUERY_KEY = ["anamnesis"] as const;

/**
 * Queries must be scoped to the authenticated account. Removing the previous
 * account's cache on sign-out/switch avoids briefly rendering its clinical data.
 * Authorization still comes from server-side RLS.
 */
export const useAnamnesisData = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const lastOwner = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const applySession = (id: string | null) => {
      if (!active) return;
      if (lastOwner.current && lastOwner.current !== id) {
        queryClient.removeQueries({ queryKey: ANAMNESIS_QUERY_KEY, exact: false });
      }
      lastOwner.current = id;
      setUserId(id);
      setAuthReady(true);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user?.id ?? null);
    });
    void supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user?.id ?? null);
    }).catch(() => { if (active) setAuthReady(true); });
    return () => { active = false; subscription.unsubscribe(); };
  }, [queryClient]);

  const query = useQuery({
    queryKey: [...ANAMNESIS_QUERY_KEY, userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<AnamnesisItem[]> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.id !== userId) {
        throw new Error("A sessão mudou. Entre novamente para consultar suas anamneses.");
      }
      const { data, error } = await supabase.from("anamnesis")
        .select("id,patient_id,created_at,updated_at,main_clinical_demand,filled_by_guardian,review_status,patients(name)")
        .eq("professional_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        main_clinical_demand: item.main_clinical_demand ?? undefined,
        filled_by_guardian: Boolean(item.filled_by_guardian),
        patient_name: item.patients?.name || "Paciente cadastrado",
        review_status: item.review_status === "finalized" ? "finalized"
          : item.review_status === "draft" ? "draft" : "registered",
      }));
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
  return { ...query, userId, authReady, isLoading: !authReady || query.isLoading };
};

export const useDeleteAnamnesis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (anamnesisId: string) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Sessão expirada. Faça login novamente.");
      const { data, error } = await supabase.from("anamnesis")
        .delete()
        .eq("id", anamnesisId)
        .eq("professional_id", user.id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data?.id) throw new Error("Anamnese não encontrada ou exclusão não autorizada.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANAMNESIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-counts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["patients", "list"] });
      toast({ title: "Anamnese excluída", description: "O banco confirmou a exclusão do documento selecionado." });
    },
    onError: (error: Error) => {
      toast({ title: "Exclusão não realizada", description: error.message, variant: "destructive" });
    },
  });
};
