import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentReceipt {
  id: string;
  user_id: string;
  receipt_number: number;
  financial_record_id?: string | null;
  patient_id?: string | null;
  patient_name: string;
  patient_document?: string | null;
  amount: number;
  service_description: string;
  payment_method: string;
  payment_date: string;
  issued_at: string;
  pdf_path?: string | null;
  verification_hash?: string | null;
  status: "issued" | "cancelled";
  issuer_snapshot?: any;
  city?: string | null;
  observations?: string | null;
  unique_code?: string | null;
  template_id?: string | null;
  client_id?: string | null;
}

export function usePaymentReceipts() {
  return useQuery({
    queryKey: ["payment-receipts"],
    queryFn: async (): Promise<PaymentReceipt[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("payment_receipts" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return (data as any) ?? [];
    },
  });
}

export function useCreatePaymentReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PaymentReceipt>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const { data, error } = await supabase
        .from("payment_receipts" as any)
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-receipts"] }),
  });
}

export function useCancelReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_receipts" as any)
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-receipts"] }),
  });
}
