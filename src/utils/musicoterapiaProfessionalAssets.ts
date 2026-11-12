import { supabase } from "@/integrations/supabase/client";
import { imageUrlToBase64 } from "@/utils/imageToBase64";

type ImageProfile = { digital_signature_url?: string | null; digital_stamp_url?: string | null };
type ProfessionalImages = { signature: string | null; stamp: string | null };

const readBlob = (blob: Blob): Promise<string | null> => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
  reader.onerror = () => resolve(null);
  reader.readAsDataURL(blob);
});

/** Download only images belonging to the authenticated professional. No URLs or tokens logged. */
export async function resolveMusicoterapiaProfessionalAssets(
  profile: ImageProfile | null | undefined,
  expectedUserId: string | null,
): Promise<ProfessionalImages> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !expectedUserId || user.id !== expectedUserId) {
    throw new Error("Sessão do profissional não confirmada para o documento clínico.");
  }

  const fromOwnStorage = async (prefix: "signature_" | "stamp_"): Promise<string | null> => {
    const { data: files, error: listingError } = await supabase.storage
      .from("digital-signatures")
      .list(user.id, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    if (listingError || !files) return null;
    const latest = files.filter(file => file.name.startsWith(prefix) &&
        file.name.endsWith(".png") && !file.name.includes("/") && !file.name.includes("\\"))
      .sort((a,b) => (b.created_at || "").localeCompare(a.created_at || ""))[0];
    if (!latest) return null;
    const { data: blob, error: downloadError } = await supabase.storage
      .from("digital-signatures").download(`${user.id}/${latest.name}`);
    return downloadError || !blob ? null : readBlob(blob);
  };
  const fromProfile = async (url?: string | null) => {
    try { return url ? await imageUrlToBase64(url) : null; }
    catch { return null; }
  };
  const [signature, stamp] = await Promise.all([
    (async () => await fromProfile(profile?.digital_signature_url) || await fromOwnStorage("signature_"))(),
    (async () => await fromProfile(profile?.digital_stamp_url) || await fromOwnStorage("stamp_"))(),
  ]);
  return { signature, stamp };
}
