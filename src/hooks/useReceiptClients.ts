import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReceiptClient {
  id: string;
  user_id?: string;
  name: string;
  document_type?: "cpf" | "cnpj" | null;
  document_number?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  created_at?: string;
}

export function useReceiptClients() {
  return useQuery({
    queryKey: ["receipt-clients"],
    queryFn: async (): Promise<ReceiptClient[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("receipt_clients" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("name");
      if (error) throw error;
      return (data as any) ?? [];
    },
  });
}

export function useSaveReceiptClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (client: Partial<ReceiptClient>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");
      const payload = { ...client, user_id: user.id };
      const { data, error } = client.id
        ? await supabase.from("receipt_clients" as any).update(payload).eq("id", client.id).select().single()
        : await supabase.from("receipt_clients" as any).insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["receipt-clients"] }),
  });
}

export function useDeleteReceiptClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("receipt_clients" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["receipt-clients"] }),
  });
}
