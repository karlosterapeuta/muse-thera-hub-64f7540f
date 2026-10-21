import { supabase } from "@/integrations/supabase/client";

/**
 * Arquivamento no Storage é EXPLÍCITO, não um efeito colateral do botão Baixar PDF.
 *
 * Os dados estruturados do relatório continuam sendo salvos pelos respectivos
 * formulários no banco. Os PDFs existentes no Storage não são modificados.
 *
 * Uso em fluxos com consentimento/necessidade de arquivo:
 * savePDFToStorage(blob, nome, "report", { archive: true });
 */
export async function savePDFToStorage(
  pdfBlob: Blob,
  filename: string,
  type: "anamnesis" | "report" | "evaluation" | "treatment-plan" | "intervention" | "session",
  options: { archive: true } | { archive?: false } = {},
): Promise<string | null> {
  // Nunca efetuar upload só porque o usuário gerou ou baixou um PDF.
  if (options.archive !== true) {
    return null;
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn("Usuário não autenticado; PDF não arquivado.");
      return null;
    }

    if (pdfBlob.type !== "application/pdf" || pdfBlob.size === 0) {
      console.warn("Arquivo inválido; PDF não arquivado.");
      return null;
    }

    const safeName = filename.split(/[\\/]/).pop()?.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!safeName || !safeName.toLowerCase().endsWith(".pdf")) {
      console.warn("Nome de PDF inválido; arquivo não arquivado.");
      return null;
    }

    const path = `${user.id}/${type}/${safeName}`;
    const { data, error } = await supabase.storage
      .from("clinical-pdfs")
      .upload(path, pdfBlob, { contentType: "application/pdf", upsert: false });

    if (error) {
      console.error("Erro ao arquivar PDF no Storage:", error);
      return null;
    }
    return data.path;
  } catch (err) {
    console.error("Erro inesperado ao arquivar PDF:", err);
    return null;
  }
}
