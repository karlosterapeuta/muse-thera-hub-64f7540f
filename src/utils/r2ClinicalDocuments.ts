import { supabase } from "@/integrations/supabase/client";

/** A API acessa um bucket R2 PRIVADO no servidor. Nunca use chave de acesso R2 no navegador. */
export type ClinicalDocumentKind = "anamnesis" | "report" | "evaluation" | "treatment-plan" | "intervention" | "session";

export interface ArchivedClinicalDocument {
  id: string;
  patient_id: string | null;
  filename: string;
  document_kind: ClinicalDocumentKind;
  byte_size: number;
  sha256_hex: string;
  created_at: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function readableFunctionError(error: unknown, fallback: string): Promise<Error> {
  const response = (error as { context?: unknown } | null)?.context;
  if (response instanceof Response) {
    try {
      const body = await response.clone().json();
      const reason = typeof body?.error === "string" ? body.error.slice(0, 160) : "Erro HTTP";
      return new Error(`${fallback}: ${reason} (HTTP ${response.status})`);
    } catch {
      return new Error(`${fallback} (HTTP ${response.status})`);
    }
  }
  return new Error(fallback);
}

export async function archiveClinicalPdfInR2(args: {
  pdf: Blob;
  filename: string;
  kind: ClinicalDocumentKind;
  patientId?: string;
}): Promise<{ id: string; filename: string; byteSize: number; sha256: string }> {
  if (!args.pdf.size || args.pdf.size > 20 * 1024 * 1024) {
    throw new Error("O documento deve ter entre 1 byte e 20 MB.");
  }
  if (args.pdf.type !== "application/pdf") {
    throw new Error("Apenas arquivos PDF podem ser arquivados.");
  }
  const { data, error } = await supabase.functions.invoke("clinical-documents", {
    method: "POST",
    body: args.pdf,
    headers: {
      "Content-Type": "application/pdf",
      "x-document-kind": args.kind,
      "x-filename": encodeURIComponent(args.filename),
      ...(args.patientId ? { "x-patient-id": args.patientId } : {}),
    },
  });
  if (error) throw await readableFunctionError(error, "Não foi possível arquivar o PDF no R2");
  if (!data?.id) throw new Error("O R2 não confirmou o arquivamento.");
  return data;
}

export async function listPrivateClinicalDocuments(): Promise<ArchivedClinicalDocument[]> {
  const { data, error } = await supabase.functions.invoke("clinical-documents", {
    method: "GET",
  });
  if (error) throw await readableFunctionError(error, "Não foi possível listar os documentos privados");
  return data?.documents || [];
}

export async function getPrivateClinicalPdf(id: string): Promise<Blob> {
  if (!UUID.test(id)) throw new Error("Documento inválido.");
  const { data, error } = await supabase.functions.invoke("clinical-documents", {
    method: "GET",
    headers: { "x-document-id": id },
  });
  if (error) throw await readableFunctionError(error, "Não foi possível baixar o documento privado");
  if (!(data instanceof Blob) || data.size === 0) {
    throw new Error("O servidor não retornou o arquivo binário esperado.");
  }
  // O SDK Supabase interpreta application/octet-stream como Blob (e application/pdf pode virar texto).
  return new Blob([data], { type: "application/pdf" });
}
