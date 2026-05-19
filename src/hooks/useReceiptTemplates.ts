import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReceiptTemplate {
  id: string;
  user_id?: string;
  title: string;
  description?: string | null;
  suggested_amount?: number | null;
  payment_method?: string | null;
  created_at?: string;
}

export function useReceiptTemplates() {
  return useQuery({
    queryKey: ["receipt-templates"],
    queryFn: async (): Promise<ReceiptTemplate[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("receipt_templates" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("title");
      if (error) throw error;
      return (data as any) ?? [];
    },
  });
}

export function useSaveReceiptTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tpl: Partial<ReceiptTemplate>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const payload = { ...tpl, user_id: user.id };
      const { data, error } = tpl.id
        ? await supabase.from("receipt_templates" as any).update(payload).eq("id", tpl.id).select().single()
        : await supabase.from("receipt_templates" as any).insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["receipt-templates"] }),
  });
}

export function useDeleteReceiptTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("receipt_templates" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["receipt-templates"] }),
  });
}
