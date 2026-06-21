import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PtiContent, PtiPlan, createDefaultPtiContent, computePtiProgress } from "@/types/pti";

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

function normalizePlan(row: any): PtiPlan {
  const content = { ...createDefaultPtiContent(), ...(row.content || {}) } as PtiContent;
  return { ...row, content };
}

export function usePtiPlans() {
  return useQuery({
    queryKey: ["pti-plans"],
    queryFn: async (): Promise<PtiPlan[]> => {
      const { data, error } = await supabase
        .from("pti_plans")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(normalizePlan);
    },
  });
}

export function usePtiPlan(id?: string) {
  return useQuery({
    queryKey: ["pti-plan", id],
    enabled: !!id && id !== "novo",
    queryFn: async (): Promise<PtiPlan | null> => {
      const { data, error } = await supabase
        .from("pti_plans")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data ? normalizePlan(data) : null;
    },
  });
}

export function useSavePtiPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id?: string;
      patient_id: string | null;
      title: string;
      status?: string;
      plan_date: string;
      content: PtiContent;
    }) => {
      const professional_id = await getProfessionalId();
      if (!professional_id) throw new Error("Profissional não encontrado");

      const progress = computePtiProgress(payload.content);
      const base = {
        professional_id,
        patient_id: payload.patient_id,
        title: payload.title,
        status: payload.status ?? "rascunho",
        plan_date: payload.plan_date,
        content: payload.content as any,
        progress,
      };

      let savedId = payload.id;
      if (payload.id) {
        const { error } = await supabase.from("pti_plans").update(base).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("pti_plans").insert(base).select("id").single();
        if (error) throw error;
        savedId = data.id;
      }

      // version snapshot
      if (savedId) {
        await supabase.from("pti_versions").insert({
          pti_id: savedId,
          professional_id,
          content: payload.content as any,
        });
      }
      return savedId!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pti-plans"] });
    },
  });
}

export function useDeletePtiPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pti_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pti-plans"] }),
  });
}

export function useDuplicatePtiPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: PtiPlan) => {
      const professional_id = await getProfessionalId();
      if (!professional_id) throw new Error("Profissional não encontrado");
      const { data, error } = await supabase
        .from("pti_plans")
        .insert({
          professional_id,
          patient_id: plan.patient_id,
          title: `${plan.title} (Cópia)`,
          status: "rascunho",
          plan_date: new Date().toISOString().split("T")[0],
          content: plan.content as any,
          progress: plan.progress,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pti-plans"] }),
  });
}

export function usePtiPatients() {
  return useQuery({
    queryKey: ["pti-patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name, birth_date, age, responsible, contact")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });
}
