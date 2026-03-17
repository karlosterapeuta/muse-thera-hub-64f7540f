import { supabase } from "@/integrations/supabase/client";

/**
 * Saves a PDF blob to Supabase Storage (clinical-pdfs bucket).
 * Files are stored under the user's folder: {user_id}/{type}/{filename}
 */
export async function savePDFToStorage(
  pdfBlob: Blob,
  filename: string,
  type: "anamnesis" | "report" | "evaluation" | "treatment-plan" | "intervention" | "session"
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("⚠️ Usuário não autenticado, PDF não será salvo no sistema.");
      return null;
    }

    const path = `${user.id}/${type}/${filename}`;

    const { data, error } = await supabase.storage
      .from("clinical-pdfs")
      .upload(path, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error("❌ Erro ao salvar PDF no storage:", error);
      return null;
    }

    console.log("✅ PDF salvo no sistema:", data.path);
    return data.path;
  } catch (err) {
    console.error("❌ Erro inesperado ao salvar PDF:", err);
    return null;
  }
}
