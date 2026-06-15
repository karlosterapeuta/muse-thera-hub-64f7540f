import { supabase } from "@/integrations/supabase/client";

const BUCKET = "patients";

/**
 * Extracts the storage object path from a stored value.
 * Accepts either a raw storage path (preferred) or a legacy full public URL.
 */
export function extractPatientPhotoPath(value?: string | null): string | null {
  if (!value) return null;
  const marker = `/${BUCKET}/`;
  const idx = value.indexOf(marker);
  if (idx !== -1) {
    // Strip a possible query string from legacy signed/public URLs
    return value.substring(idx + marker.length).split("?")[0];
  }
  return value;
}

/**
 * Generates a short-lived signed URL for a patient photo stored in the
 * (private) "patients" bucket. Returns null when no photo is available
 * or the current user is not allowed to read it.
 */
export async function getPatientPhotoSignedUrl(
  value?: string | null,
  expiresIn = 3600
): Promise<string | null> {
  const path = extractPatientPhotoPath(value);
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
