import { supabase } from "@/integrations/supabase/client";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I

function randomBlock(n = 6): string {
  let out = "";
  for (let i = 0; i < n; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

export async function generateUniqueReceiptCode(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = `REC-${year}-${randomBlock(6)}`;
    const { data, error } = await supabase
      .from("payment_receipts" as any)
      .select("id")
      .eq("unique_code", code)
      .maybeSingle();
    if (error && error.code !== "PGRST116") continue;
    if (!data) return code;
  }
  // fallback altamente único
  return `REC-${year}-${randomBlock(8)}`;
}
