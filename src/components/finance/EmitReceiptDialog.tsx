import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReceiptIcon, DownloadIcon, MessageCircleIcon, MailIcon, Loader2Icon, AlertCircleIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";
import { useCreatePaymentReceipt } from "@/hooks/usePaymentReceipts";
import { generateReceiptPDF } from "@/utils/receiptPDFGenerator";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import { supabase } from "@/integrations/supabase/client";
import type { FinancialRecord } from "@/pages/finance/types";

interface Props {
  open: boolean;
  onClose: () => void;
  record: FinancialRecord | null;
}

export function EmitReceiptDialog({ open, onClose, record }: Props) {
  const navigate = useNavigate();
  const { data: issuer, isLoading: loadingIssuer } = useReceiptIssuerProfile();
  const createReceipt = useCreatePaymentReceipt();
  const [generating, setGenerating] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<{ id: string; number: number; blob: Blob; publicUrl?: string } | null>(null);

  const [form, setForm] = useState({
    patient_name: "",
    patient_document: "",
    service_description: "Sessão de Musicoterapia",
    payment_method: "pix",
  });

  useEffect(() => {
    if (record) {
      setForm({
        patient_name: record.patient_name || "",
        patient_document: "",
        service_description: record.description || "Sessão de Musicoterapia",
        payment_method: "pix",
      });
      setLastReceipt(null);
    }
  }, [record]);

  if (!record) return null;

  const missingProfile = !loadingIssuer && (!issuer || !issuer.legal_name || !issuer.document_number);

  const handleGenerate = async () => {
    if (!issuer) return;
    setGenerating(true);
    try {
      // Pre-cria registro para ter ID e número sequencial
      const created = await createReceipt.mutateAsync({
        financial_record_id: record.id,
        patient_id: record.patient_id || null,
        patient_name: form.patient_name,
        patient_document: form.patient_document || null,
        amount: record.amount,
        service_description: form.service_description,
        payment_method: form.payment_method,
        payment_date: record.session_date,
        issuer_snapshot: issuer,
      });

      const { blob, hash } = await generateReceiptPDF({
        receiptNumber: created.receipt_number,
        amount: record.amount,
        patientName: form.patient_name,
        patientDocument: form.patient_document,
        serviceDescription: form.service_description,
        paymentDate: record.session_date,
        paymentMethod: form.payment_method,
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
      toast.success(`Recibo Nº ${String(created.receipt_number).padStart(4, "0")} emitido!`);
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
      <DialogContent className="max-w-xl bg-card/95 backdrop-blur-xl">
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
                  Para emitir recibos válidos, configure seu CPF/CNPJ, razão social e endereço. CNPJ é validado automaticamente na Receita Federal via BrasilAPI (gratuito).
                </p>
              </div>
            </div>
            <Button
              onClick={() => { onClose(); navigate("/finance/receipt-profile"); }}
              className="w-full bg-gradient-to-r from-primary to-amber-500 text-white"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Configurar Perfil de Emissor
            </Button>
          </div>
        ) : !lastReceipt ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Valor:</span><span className="font-bold text-primary">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(record.amount)}
              </span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data:</span><span>{new Date(record.session_date + "T00:00:00").toLocaleDateString("pt-BR")}</span></div>
            </div>

            <div>
              <Label>Nome do Pagador *</Label>
              <Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} />
            </div>
            <div>
              <Label>CPF/CNPJ do Pagador (opcional)</Label>
              <Input value={form.patient_document} onChange={(e) => setForm({ ...form, patient_document: e.target.value })} />
            </div>
            <div>
              <Label>Descrição do Serviço</Label>
              <Textarea rows={2} value={form.service_description} onChange={(e) => setForm({ ...form, service_description: e.target.value })} />
            </div>
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

            <Button
              onClick={handleGenerate}
              disabled={generating || !form.patient_name.trim()}
              className="w-full bg-gradient-to-r from-primary to-amber-500 text-white"
              size="lg"
            >
              {generating ? <Loader2Icon className="h-4 w-4 mr-2 animate-spin" /> : <ReceiptIcon className="h-4 w-4 mr-2" />}
              Gerar Recibo em PDF
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
              <ShieldCheckIcon className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Recibo Nº {String(lastReceipt.number).padStart(4, "0")} emitido!</h3>
              <p className="text-sm text-muted-foreground">Salvo automaticamente no sistema com hash de autenticidade.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button onClick={handleDownload} className="bg-gradient-to-r from-primary to-amber-500 text-white">
                <DownloadIcon className="h-4 w-4 mr-2" /> Baixar
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
