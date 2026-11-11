import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { calculateAgeFromBirthDate } from "@/utils/dateUtils";

export type AnamnesisStatus = "none" | "draft" | "registered" | "finalized";

export type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  photo_url?: string | null;
  age: number | null;
  has_anamnesis?: boolean;
  anamnesis_status?: AnamnesisStatus;
  professional_id: string;
};

export const PATIENTS_QUERY_KEY = ["patients", "list"] as const;

// A cache key must contain the authenticated account ID. Never reuse a prior
// professional's records when switching sessions in the same browser.
export const usePatientsData = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let active = true;
    const applySession = (nextId: string | null) => {
      if (!active) return;
      setUserId(previous => {
        if (previous && previous !== nextId) {
          queryClient.removeQueries({ queryKey: PATIENTS_QUERY_KEY, exact: false });
        }
        return nextId;
      });
      setAuthReady(true);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user?.id || null);
    });
    void supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user?.id || null);
    }).catch(() => {
      if (active) setAuthReady(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [queryClient]);

  const query = useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, userId],
    enabled: !!userId,
    queryFn: async (): Promise<Patient[]> => {
      if (!userId) throw new Error("Sessão não identificada.");
      // Read only the columns needed to distinguish a draft, finalized
      // anamnesis and legacy records without a review_status.
      const { data, error } = await supabase
        .from("patients")
        .select("*, anamnesis!left(review_status)")
        .eq("professional_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(patient => {
        const anamneses = Array.isArray(patient.anamnesis) ? patient.anamnesis : [];
        const status: AnamnesisStatus =
          anamneses.some(a => a.review_status === "finalized") ? "finalized" :
          anamneses.some(a => a.review_status === "draft") ? "draft" :
          anamneses.length > 0 ? "registered" : "none";
        return {
          ...patient,
          age: calculateAgeFromBirthDate(patient.birth_date),
          has_anamnesis: status !== "none",
          anamnesis_status: status,
          anamnesis: undefined,
        } as Patient;
      });
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return { ...query, userId, authReady, isLoading: !authReady || query.isLoading };
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (patientId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Faça login novamente.");
      const { data, error } = await supabase
        .from("patients")
        .delete()
        .eq("id", patientId)
        .eq("professional_id", user.id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Paciente não encontrado ou acesso não autorizado.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      toast({ title: "Paciente excluído", description: "O registro selecionado foi excluído." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Falha ao excluir paciente", description: error.message });
    },
  });
};

// Deliberately unavailable in the everyday clinical interface. Never execute
// a mass deletion of linked medical histories through a generic patients list.
export const useDeleteAllPatients = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      throw new Error("Exclusão em massa desativada. Utilize o fluxo administrativo de retenção e auditoria.");
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Ação não permitida", description: error.message });
    },
  });
};
