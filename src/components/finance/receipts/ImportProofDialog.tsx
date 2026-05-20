import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloudIcon, Loader2Icon, FileTextIcon, ImageIcon, SparklesIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmitReceiptDialog } from "@/components/finance/EmitReceiptDialog";
import type { FinancialRecord } from "@/pages/finance/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || "");
      const i = s.indexOf(",");
      resolve(i >= 0 ? s.slice(i + 1) : s);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function ImportProofDialog({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedRecord, setExtractedRecord] = useState<(FinancialRecord & { _proofPath?: string }) | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setLoading(false);
    setExtractedRecord(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = (f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Formato não suportado. Use JPG, PNG, WEBP ou PDF.");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("Arquivo muito grande (máx. 10 MB).");
      return;
    }
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f.type.startsWith("image/") ? URL.createObjectURL(f) : null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fileBase64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("parse-payment-proof", {
        body: { fileBase64, mimeType: file.type, fileName: file.name },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      const ext = (data as any).extracted as {
        payer_name: string | null;
        payer_document: string | null;
        amount: number | null;
        payment_date: string | null;
        payment_method: string | null;
        confidence: number;
      };

      if (!ext.amount || !ext.payment_date) {
        toast.warning("IA não encontrou valor ou data. Preencha manualmente.");
      }

      const methodMap: Record<string, string> = {
        "pix": "pix",
        "transferência": "transferência",
        "transferencia": "transferência",
        "boleto": "boleto",
        "dinheiro": "dinheiro",
        "cartão de crédito": "cartão de crédito",
        "cartao de credito": "cartão de crédito",
        "cartão de débito": "cartão de débito",
        "cartao de debito": "cartão de débito",
      };
      const method = ext.payment_method
        ? (methodMap[ext.payment_method.toLowerCase()] || "pix")
        : "pix";

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Build virtual record (id prefixed so EmitReceiptDialog skips FK link)
      const virtual: FinancialRecord & { _proofPath?: string } = {
        id: `virtual-${crypto.randomUUID()}`,
        professional_id: "",
        clinic_id: "",
        amount: Number(ext.amount || 0),
        session_date: ext.payment_date || todayStr,
        description: "Sessão de Musicoterapia",
        patient_name: ext.payer_name || "",
        payment_method: method,
        _proofPath: (data as any).proofPath || undefined,
      } as any;

      // Stash hint for EmitReceiptDialog via sessionStorage (document + method)
      sessionStorage.setItem(
        `receipt-import:${virtual.id}`,
        JSON.stringify({
          patient_document: ext.payer_document || "",
          payment_method: method,
          proof_path: (data as any).proofPath || null,
        })
      );

      setExtractedRecord(virtual);
      toast.success(`Dados extraídos${ext.confidence ? ` (${Math.round(ext.confidence * 100)}% confiança)` : ""}`);
    } catch (e: any) {
      toast.error(e?.message || "Falha ao processar comprovante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open && !extractedRecord} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary to-amber-500 p-2 rounded-lg">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              Importar Comprovante
            </DialogTitle>
            <DialogDescription>
              Envie o comprovante (PIX, TED, boleto) e a IA preencherá o recibo automaticamente.
            </DialogDescription>
          </DialogHeader>

          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition ${
                dragOver ? "border-primary bg-primary/10" : "border-border bg-background/40 hover:border-primary/50"
              }`}
            >
              <UploadCloudIcon className="h-10 w-10 mx-auto text-primary mb-2" />
              <p className="font-medium">Clique ou arraste o comprovante</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP ou PDF — até 10 MB</p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60 border">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded" />
                ) : (
                  <div className="w-20 h-20 rounded bg-primary/10 flex items-center justify-center">
                    {file.type === "application/pdf" ? (
                      <FileTextIcon className="h-8 w-8 text-primary" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-primary" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · {file.type}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={reset} disabled={loading}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleProcess}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-amber-500 text-white"
                size="lg"
              >
                {loading ? (
                  <><Loader2Icon className="h-4 w-4 mr-2 animate-spin" /> Lendo comprovante...</>
                ) : (
                  <><SparklesIcon className="h-4 w-4 mr-2" /> Extrair dados com IA</>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {extractedRecord && (
        <EmitReceiptDialog
          open={!!extractedRecord}
          onClose={() => { sessionStorage.removeItem(`receipt-import:${extractedRecord.id}`); handleClose(); }}
          record={extractedRecord}
        />
      )}
    </>
  );
}
