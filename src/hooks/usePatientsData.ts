import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { calculateAgeFromBirthDate } from "@/utils/dateUtils";

export type AnamnesisStatus = "absent" | "draft" | "finalized";
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

/** Query cache must never be reused across accounts sharing the same browser. */
export const usePatientsData = () => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUserId(data.session?.user.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUserId(session?.user.id ?? null);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Patient[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) throw new Error("Sua sessão mudou. Atualize a página.");
      const { data, error } = await supabase
        .from("patients")
        .select("id, created_at, updated_at, name, birth_date, responsible, contact, photo_url, professional_id, anamnesis!left(review_status)")
        .eq("professional_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      return (data ?? []).map(patient => {
        const reviews = Array.isArray(patient.anamnesis) ? patient.anamnesis : [];
        const anamnesis_status: AnamnesisStatus = reviews.some(item => item.review_status === "finalized")
          ? "finalized" : reviews.length ? "draft" : "absent";
        return {
          id: patient.id,
          created_at: patient.created_at,
          updated_at: patient.updated_at,
          name: patient.name,
          birth_date: patient.birth_date,
          responsible: patient.responsible,
          contact: patient.contact,
          photo_url: patient.photo_url,
          professional_id: patient.professional_id,
          age: calculateAgeFromBirthDate(patient.birth_date),
          has_anamnesis: anamnesis_status !== "absent",
          anamnesis_status,
        };
      });
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (patientId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada.");
      const { data, error } = await supabase.from("patients")
        .delete().eq("id", patientId).eq("professional_id", user.id).select("id");
      if (error) throw error;
      if (!data?.length) throw new Error("Paciente não encontrado ou acesso não autorizado.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      toast({ title: "Paciente excluído", description: "O cadastro foi removido." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Não foi possível excluir", description: error.message });
    },
  });
};

/** API kept for compatibility; destructive bulk deletion is deliberately disabled. */
export const useDeleteAllPatients = () => {
  return { mutate: () => { throw new Error("Exclusão em massa desativada por segurança."); } };
};
