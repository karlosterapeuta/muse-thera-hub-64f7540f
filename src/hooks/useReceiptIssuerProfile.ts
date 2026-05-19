import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReceiptIssuerProfile {
  id?: string;
  user_id?: string;
  document_type: "cpf" | "cnpj";
  document_number: string;
  legal_name: string;
  trade_name?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  phone?: string | null;
  email?: string | null;
  verified?: boolean;
  verified_at?: string | null;
}

export function useReceiptIssuerProfile() {
  return useQuery({
    queryKey: ["receipt-issuer-profile"],
    queryFn: async (): Promise<ReceiptIssuerProfile | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("receipt_issuer_profiles" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as any) ?? null;
    },
  });
}

export function useSaveReceiptIssuerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: ReceiptIssuerProfile) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const payload = { ...profile, user_id: user.id };
      const { data, error } = await supabase
        .from("receipt_issuer_profiles" as any)
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["receipt-issuer-profile"] }),
  });
}
