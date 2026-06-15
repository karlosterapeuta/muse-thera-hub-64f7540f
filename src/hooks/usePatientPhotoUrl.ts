import { useEffect, useState } from "react";
import { getPatientPhotoSignedUrl } from "@/utils/patientPhoto";

/**
 * Resolves a private patient photo (stored path or legacy URL) into a
 * short-lived signed URL that can be used as an <img src>.
 */
export function usePatientPhotoUrl(value?: string | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    if (!value) return;
    getPatientPhotoSignedUrl(value).then((signed) => {
      if (active) setUrl(signed);
    });
    return () => {
      active = false;
    };
  }, [value]);

  return url;
}
