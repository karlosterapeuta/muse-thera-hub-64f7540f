import { useState } from "react";
import { jsPDF } from "jspdf";
import { CheckCircle2, Cloud, FileCheck2, Loader2, ShieldAlert } from "lucide-react";
import { archiveClinicalPdfInR2, getPrivateClinicalPdf, listPrivateClinicalDocuments } from "@/utils/r2ClinicalDocuments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PilotState = "idle" | "working" | "success" | "error";

async function checksum(blob: Blob): Promise<string> {
  const bytes = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function syntheticPdf(): Blob {
  const pdf = new jsPDF({ format: "a4", unit: "mm" });
  pdf.setFontSize(18);
  pdf.text("MuseTera - Teste Sintetico Cloudflare R2", 18, 30);
  pdf.setFontSize(11);
  pdf.text("Este documento e ficticio. Nao contem dados de pacientes.", 18, 45);
  pdf.text("Teste tecnico de armazenamento privado, recuperacao e integridade.", 18, 54);
  return pdf.output("blob");
}

/**
 * Piloto de integração exclusivamente com conteúdo fictício.
 * Renderizar apenas na área administrativa; a Edge Function também valida JWT,
 * RLS e a posse de cada documento no servidor.
 */
export function R2StoragePilot() {
  const [state, setState] = useState<PilotState>("idle");
  const [stage, setStage] = useState("");
  const [message, setMessage] = useState("");
  const [sha, setSha] = useState("");

  const runPilot = async () => {
    if (state === "working") return;
    setState("working");
    setSha("");
    setMessage("");
    try {
      setStage("Gerando PDF fictício localmente...");
      const pdf = syntheticPdf();
      if (pdf.type !== "application/pdf" || !pdf.size) throw new Error("PDF de teste inválido.");
      const localSha = await checksum(pdf);

      setStage("Enviando PDF fictício ao R2 privado...");
      const saved = await archiveClinicalPdfInR2({
        pdf,
        filename: "musetera-r2-teste-sintetico.pdf",
        kind: "report",
        // Sem patientId: arquivo de teste independente de qualquer paciente.
      });
      if (saved.sha256 !== localSha || saved.byteSize !== pdf.size) {
        throw new Error("O servidor não confirmou o mesmo tamanho e SHA-256.");
      }

      setStage("Conferindo metadados protegidos...");
      const documents = await listPrivateClinicalDocuments();
      const exists = documents.some((item) =>
        item.id === saved.id && item.sha256_hex === localSha && item.byte_size === pdf.size
      );
      if (!exists) throw new Error("O registro do arquivo não está visível para seu usuário.");

      setStage("Baixando novamente do R2 privado...");
      const downloaded = await getPrivateClinicalPdf(saved.id);
      if (downloaded.size !== pdf.size || (await checksum(downloaded)) !== localSha) {
        throw new Error("O conteúdo recuperado não corresponde ao PDF enviado.");
      }

      setSha(localSha);
      setStage("Teste concluído.");
      setMessage("Upload, listagem autenticada, download e SHA-256 conferidos. Documento fictício mantido no arquivo privado para auditoria.");
      setState("success");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Falha não identificada.";
      setMessage(detail);
      setStage("Teste interrompido.");
      setState("error");
    }
  };

  return (
    <Card aria-label="Teste de armazenamento privado R2">
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <Cloud className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" />
          <div>
            <h3 className="font-semibold text-lg">Cloudflare R2 — teste de integração privada</h3>
            <p className="text-sm text-muted-foreground">
              Teste reservado à administração. Gera um PDF fictício, envia para o R2,
              confere o registro, faz o download e compara o SHA-256. Nenhum paciente é utilizado.
            </p>
          </div>
        </div>
        <Button type="button" disabled={state === "working"} onClick={() => void runPilot()}>
          {state === "working" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-2 h-4 w-4" />}
          {state === "working" ? "Testando R2..." : "Testar conexão privada do R2"}
        </Button>
        {stage && <p className="text-sm text-muted-foreground" aria-live="polite">{stage}</p>}
        {state === "success" && (
          <div className="space-y-2 rounded-lg border border-green-500/40 bg-green-500/5 p-3" role="status">
            <p className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" /> Integração validada com PDF fictício
            </p>
            <p className="text-sm">{message}</p>
            <p className="text-xs break-all text-muted-foreground">SHA-256: {sha}</p>
          </div>
        )}
        {state === "error" && (
          <div className="space-y-1 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3" role="alert">
            <p className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-4 w-4" /> Teste não concluído</p>
            <p className="text-sm">{message}</p>
            <p className="text-xs text-muted-foreground">
              Não migre arquivos clínicos até resolver a falha. Confirme os Secrets do Supabase e os logs da Edge Function.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
