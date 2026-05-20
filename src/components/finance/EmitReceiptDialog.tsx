import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ReceiptIcon, DownloadIcon, MessageCircleIcon, MailIcon, Loader2Icon,
  AlertCircleIcon, ShieldCheckIcon, PrinterIcon, EyeIcon, EyeOffIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";
import { useCreatePaymentReceipt, usePaymentReceipts } from "@/hooks/usePaymentReceipts";
import { generateReceiptPDF } from "@/utils/receiptPDFGenerator";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import { supabase } from "@/integrations/supabase/client";
import { ReceiptLivePreview } from "@/components/finance/receipts/ReceiptLivePreview";
import { valorPorExtenso } from "@/utils/numberToWords";
import { maskCPF, maskCNPJ, onlyDigits } from "@/utils/cpfCnpjUtils";
import type { FinancialRecord } from "@/pages/finance/types";

interface Props {
  open: boolean;
  onClose: () => void;
  record: FinancialRecord | null;
}

const draftKey = (id: string) => `receipt-draft:${id}`;

export function EmitReceiptDialog({ open, onClose, record }: Props) {
  const navigate = useNavigate();
  const { data: issuer, isLoading: loadingIssuer } = useReceiptIssuerProfile();
  const { data: clients = [] } = useReceiptClients();
  const { data: templates = [] } = useReceiptTemplates();
  const { data: existingReceipts = [] } = usePaymentReceipts();
  const createReceipt = useCreatePaymentReceipt();
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [clientPopOpen, setClientPopOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{ id: string; number: number; blob: Blob; publicUrl?: string } | null>(null);

  const [form, setForm] = useState({
    patient_name: "",
    patient_document: "",
    service_description: "Sessão de Musicoterapia",
    payment_method: "pix",
    city: "",
    observations: "",
  });

  useEffect(() => {
    if (!record) return;
    const draftRaw = sessionStorage.getItem(draftKey(record.id));
    if (draftRaw) {
      try { setForm(JSON.parse(draftRaw)); } catch { /* noop */ }
    } else {
      // Optional hint left by ImportProofDialog (extracted by AI)
      let hint: { patient_document?: string; payment_method?: string; proof_path?: string | null } = {};
      try {
        const raw = sessionStorage.getItem(`receipt-import:${record.id}`);
        if (raw) hint = JSON.parse(raw);
      } catch { /* noop */ }
      setForm({
        patient_name: record.patient_name || "",
        patient_document: hint.patient_document
          ? (onlyDigits(hint.patient_document).length > 11
              ? maskCNPJ(hint.patient_document)
              : maskCPF(hint.patient_document))
          : "",
        service_description: record.description || "Sessão de Musicoterapia",
        payment_method: hint.payment_method || (record as any).payment_method || "pix",
        city: issuer?.city || "",
        observations: "",
      });
    }
    setLastReceipt(null);
  }, [record, issuer?.city]);

  const isVirtualRecord = !!record && record.id.startsWith("virtual-");
  const proofPath: string | null = (() => {
    if (!record) return null;
    try {
      const raw = sessionStorage.getItem(`receipt-import:${record.id}`);
      return raw ? (JSON.parse(raw).proof_path ?? null) : null;
    } catch { return null; }
  })();

  useEffect(() => {
    if (record && !lastReceipt) {
      sessionStorage.setItem(draftKey(record.id), JSON.stringify(form));
    }
  }, [form, record, lastReceipt]);

  // Anti-duplicidade: já existe recibo emitido nas últimas 24h para esse financial_record?
  const duplicateWarning = useMemo(() => {
    if (!record) return null;
    const recent = existingReceipts.find(
      (r) => r.financial_record_id === record.id && r.status === "issued"
    );
    return recent
      ? `Já existe um recibo Nº ${String(recent.receipt_number).padStart(4, "0")} emitido para este lançamento.`
      : null;
  }, [existingReceipts, record]);

  if (!record) return null;

  const missingProfile = !loadingIssuer && (!issuer || !issuer.legal_name || !issuer.document_number);

  const handleSelectClient = (clientId: string) => {
    const c = clients.find((x) => x.id === clientId);
    if (!c) return;
    const doc = c.document_number ? (c.document_type === "cnpj" ? maskCNPJ(c.document_number) : maskCPF(c.document_number)) : "";
    setForm((f) => ({
      ...f,
      patient_name: c.name,
      patient_document: doc,
      city: c.city || f.city,
    }));
    setClientPopOpen(false);
  };

  const handleSelectTemplate = (tplId: string) => {
    const t = templates.find((x) => x.id === tplId);
    if (!t) return;
    setForm((f) => ({
      ...f,
      service_description: t.description || t.title,
      payment_method: t.payment_method || f.payment_method,
    }));
  };

  const doGenerate = async (alsoPrint: boolean) => {
    if (!issuer) return;
    setGenerating(true);
    try {
      const { generateUniqueReceiptCode } = await import("@/utils/uniqueCodeGenerator");
      const uniqueCode = await generateUniqueReceiptCode();
      const created = await createReceipt.mutateAsync({
        financial_record_id: isVirtualRecord ? null : record.id,
        patient_id: record.patient_id || null,
        patient_name: form.patient_name,
        patient_document: form.patient_document ? onlyDigits(form.patient_document) : null,
        amount: record.amount,
        service_description: form.service_description,
        payment_method: form.payment_method,
        payment_date: record.session_date,
        city: form.city || null,
        observations: form.observations || null,
        unique_code: uniqueCode,
        issuer_snapshot: issuer,
        ...(proofPath ? { payment_proof_path: proofPath } : {}),
      } as any);

      const { blob, hash } = await generateReceiptPDF({
        receiptNumber: created.receipt_number,
        amount: record.amount,
        patientName: form.patient_name,
        patientDocument: form.patient_document,
        serviceDescription: form.service_description,
        paymentDate: record.session_date,
        paymentMethod: form.payment_method,
        city: form.city || undefined,
        observations: form.observations || undefined,
        uniqueCode,
        issuer: {
          documentType: issuer.document_type,
          documentNumber: issuer.document_number,
          legalName: issuer.legal_name,
          tradeName: issuer.trade_name,
          address: issuer.address,
          city: issuer.city,
          state: issuer.state,
          phone: issuer.phone,
          email: issuer.email,
          signatureUrl: issuer.signature_url,
        },
        verificationId: created.id,
      });

      const filename = `recibo-${String(created.receipt_number).padStart(4, "0")}.pdf`;
      const path = await savePDFToStorage(blob, filename, "receipt" as any);

      let publicUrl: string | undefined;
      if (path) {
        const { data: signed } = await supabase.storage
          .from("clinical-pdfs")
          .createSignedUrl(path, 60 * 60 * 24 * 365);
        publicUrl = signed?.signedUrl;
        await supabase
          .from("payment_receipts" as any)
          .update({ pdf_path: path, verification_hash: hash })
          .eq("id", created.id);
      }

      setLastReceipt({ id: created.id, number: created.receipt_number, blob, publicUrl });
      sessionStorage.removeItem(draftKey(record.id));

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Impressão opcional
      if (alsoPrint) {
        const w = window.open(url, "_blank");
        if (w) {
          w.addEventListener("load", () => { try { w.print(); } catch { /* noop */ } });
        }
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);

      toast.success(`Recibo Nº ${String(created.receipt_number).padStart(4, "0")} emitido e baixado!`);
    } catch (e: any) {
      toast.error(e.message || "Erro ao gerar recibo");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!lastReceipt) return;
    const url = URL.createObjectURL(lastReceipt.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recibo-${String(lastReceipt.number).padStart(4, "0")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!lastReceipt) return;
    const url = URL.createObjectURL(lastReceipt.blob);
    const w = window.open(url, "_blank");
    if (w) w.addEventListener("load", () => { try { w.print(); } catch { /* noop */ } });
  };

  const handleWhatsApp = () => {
    if (!lastReceipt) return;
    const msg = `Olá, ${form.patient_name}! Segue seu recibo de pagamento Nº ${String(lastReceipt.number).padStart(4, "0")}.\n\n${lastReceipt.publicUrl || "Recibo em anexo"}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleEmail = () => {
    if (!lastReceipt) return;
    const subject = `Recibo de Pagamento Nº ${String(lastReceipt.number).padStart(4, "0")}`;
    const body = `Olá ${form.patient_name},%0D%0A%0D%0ASegue seu recibo de pagamento.%0D%0A%0D%0A${lastReceipt.publicUrl || ""}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl bg-card/95 backdrop-blur-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-gradient-to-br from-primary to-amber-500 p-2 rounded-lg">
              <ReceiptIcon className="h-5 w-5 text-white" />
            </div>
            Emitir Recibo de Pagamento
          </DialogTitle>
          <DialogDescription>
            Gere um recibo profissional em PDF com autenticidade verificável por QR Code.
          </DialogDescription>
        </DialogHeader>

        {loadingIssuer ? (
          <div className="py-8 text-center"><Loader2Icon className="h-6 w-6 animate-spin mx-auto" /></div>
        ) : missingProfile ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircleIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Complete seu perfil de emissor</h4>
                <p className="text-sm text-muted-foreground">
                  Configure CPF/CNPJ, razão social, endereço e assinatura digital antes de emitir.
                </p>
              </div>
            </div>
            <Button
              onClick={() => { onClose(); navigate("/finance/receipts?tab=emissor"); }}
              className="w-full bg-gradient-to-r from-primary to-amber-500 text-white"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Configurar Perfil de Emissor
            </Button>
          </div>
        ) : !lastReceipt ? (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Valor:</span><span className="font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(record.amount)}
                </span></div>
                <div className="text-[11px] text-muted-foreground italic mt-0.5">
                  ({valorPorExtenso(record.amount)})
                </div>
                <div className="flex justify-between mt-1"><span className="text-muted-foreground">Data:</span><span>{new Date(record.session_date + "T00:00:00").toLocaleDateString("pt-BR")}</span></div>
              </div>

              {duplicateWarning && (
                <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300 flex gap-2">
                  <AlertCircleIcon className="h-4 w-4 shrink-0" />
                  <span>{duplicateWarning} Você pode emitir mesmo assim ou cancelar o anterior na aba Recibos.</span>
                </div>
              )}

              <div>
                <Label>Nome do Pagador *</Label>
                <Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} />
              </div>
              <div>
                <Label>CPF/CNPJ do Pagador (opcional)</Label>
                <Input
                  value={form.patient_document}
                  onChange={(e) => {
                    const d = onlyDigits(e.target.value);
                    const masked = d.length > 11 ? maskCNPJ(e.target.value) : maskCPF(e.target.value);
                    setForm({ ...form, patient_document: masked });
                  }}
                />
              </div>
              <div>
                <Label>Descrição do Serviço</Label>
                <Textarea rows={2} value={form.service_description} onChange={(e) => setForm({ ...form, service_description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartão de crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartão de débito">Cartão de Débito</SelectItem>
                      <SelectItem value="transferência">Transferência Bancária</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Local de emissão" />
                </div>
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea rows={2} value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} placeholder="Informações adicionais (opcional)" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => doGenerate(false)}
                  disabled={generating || !form.patient_name.trim()}
                  className="flex-1 bg-gradient-to-r from-primary to-amber-500 text-white"
                  size="lg"
                >
                  {generating ? <Loader2Icon className="h-4 w-4 mr-2 animate-spin" /> : <ReceiptIcon className="h-4 w-4 mr-2" />}
                  Gerar PDF
                </Button>
                <Button
                  onClick={() => doGenerate(true)}
                  disabled={generating || !form.patient_name.trim()}
                  variant="outline"
                  size="lg"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" /> Emitir e Imprimir
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview((s) => !s)} className="w-full md:hidden">
                {showPreview ? <EyeOffIcon className="h-3 w-3 mr-1" /> : <EyeIcon className="h-3 w-3 mr-1" />}
                {showPreview ? "Ocultar pré-visualização" : "Mostrar pré-visualização"}
              </Button>
            </div>

            <div className={`${showPreview ? "block" : "hidden"} md:block`}>
              <ReceiptLivePreview
                amount={record.amount}
                patientName={form.patient_name}
                patientDocument={form.patient_document}
                serviceDescription={form.service_description}
                paymentDate={record.session_date}
                paymentMethod={form.payment_method}
                city={form.city}
                observations={form.observations}
                issuer={issuer}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
              <ShieldCheckIcon className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Recibo Nº {String(lastReceipt.number).padStart(4, "0")} emitido!</h3>
              <p className="text-sm text-muted-foreground">Salvo automaticamente no sistema com hash de autenticidade.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button onClick={handleDownload} className="bg-gradient-to-r from-primary to-amber-500 text-white">
                <DownloadIcon className="h-4 w-4 mr-2" /> Baixar
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <PrinterIcon className="h-4 w-4 mr-2" /> Imprimir
              </Button>
              <Button onClick={handleWhatsApp} variant="outline" className="border-green-500/50">
                <MessageCircleIcon className="h-4 w-4 mr-2 text-green-600" /> WhatsApp
              </Button>
              <Button onClick={handleEmail} variant="outline">
                <MailIcon className="h-4 w-4 mr-2" /> E-mail
              </Button>
            </div>
            <Button variant="ghost" onClick={onClose} className="w-full">Fechar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
