import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, DownloadIcon, ReceiptIcon, XCircleIcon, Loader2Icon, ShieldCheckIcon, PrinterIcon, CopyIcon } from "lucide-react";
import { usePaymentReceipts, useCancelReceipt, useCreatePaymentReceipt, type PaymentReceipt } from "@/hooks/usePaymentReceipts";
import { useReceiptIssuerProfile } from "@/hooks/useReceiptIssuerProfile";
import { supabase } from "@/integrations/supabase/client";
import { onlyDigits } from "@/utils/cpfCnpjUtils";
import { generateReceiptPDF } from "@/utils/receiptPDFGenerator";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import { generateUniqueReceiptCode } from "@/utils/uniqueCodeGenerator";
import { toast } from "sonner";

const fmtBRL = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export function ReceiptsHistory() {
  const { data: receipts = [], isLoading } = usePaymentReceipts();
  const { data: issuer } = useReceiptIssuerProfile();
  const cancel = useCancelReceipt();
  const create = useCreatePaymentReceipt();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [method, setMethod] = useState<string>("all");
  const [period, setPeriod] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = receipts.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (method !== "all" && r.payment_method !== method) return false;
    if (period !== "all") {
      const now = new Date();
      const d = new Date(r.payment_date + "T00:00:00");
      if (period === "month" && (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear())) return false;
      if (period === "year" && d.getFullYear() !== now.getFullYear()) return false;
      if (period === "week") {
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > 7) return false;
      }
    }
    if (q) {
      const qq = q.toLowerCase();
      const digits = onlyDigits(q);
      const hit =
        r.patient_name.toLowerCase().includes(qq) ||
        String(r.receipt_number).includes(q) ||
        (r.unique_code || "").toLowerCase().includes(qq) ||
        (digits && (r.patient_document || "").includes(digits)) ||
        String(r.amount).includes(q) ||
        r.payment_date.includes(q);
      if (!hit) return false;
    }
    return true;
  });

  const getBlob = async (r: PaymentReceipt): Promise<Blob | null> => {
    if (r.pdf_path) {
      const { data } = await supabase.storage.from("clinical-pdfs").createSignedUrl(r.pdf_path, 60 * 5);
      if (data?.signedUrl) {
        const res = await fetch(data.signedUrl);
        return await res.blob();
      }
    }
    return null;
  };

  const handleDownload = async (r: PaymentReceipt) => {
    setBusy(r.id);
    try {
      const blob = await getBlob(r);
      if (!blob) { toast.error("PDF não disponível"); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `recibo-${String(r.receipt_number).padStart(4, "0")}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } finally { setBusy(null); }
  };

  const handlePrint = async (r: PaymentReceipt) => {
    setBusy(r.id);
    try {
      const blob = await getBlob(r);
      if (!blob) { toast.error("PDF não disponível"); return; }
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      iframe.onload = () => {
        try { iframe.contentWindow?.print(); } catch {}
      };
      document.body.appendChild(iframe);
      setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 60000);
    } finally { setBusy(null); }
  };

  const handleDuplicate = async (r: PaymentReceipt) => {
    if (!issuer) { toast.error("Configure o perfil de emissor"); return; }
    setBusy(r.id);
    try {
      const uniqueCode = await generateUniqueReceiptCode();
      const today = new Date().toISOString().slice(0, 10);
      const created = await create.mutateAsync({
        financial_record_id: null,
        patient_id: r.patient_id || null,
        patient_name: r.patient_name,
        patient_document: r.patient_document,
        amount: Number(r.amount),
        service_description: r.service_description,
        payment_method: r.payment_method,
        payment_date: today,
        city: r.city,
        observations: r.observations,
        unique_code: uniqueCode,
        issuer_snapshot: issuer,
      });
      const { blob, hash } = await generateReceiptPDF({
        receiptNumber: created.receipt_number,
        amount: Number(r.amount),
        patientName: r.patient_name,
        patientDocument: r.patient_document || undefined,
        serviceDescription: r.service_description,
        paymentDate: today,
        paymentMethod: r.payment_method,
        city: r.city || undefined,
        observations: r.observations || undefined,
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
      if (path) {
        await supabase.from("payment_receipts" as any).update({ pdf_path: path, verification_hash: hash }).eq("id", created.id);
      }
      toast.success(`Recibo duplicado: Nº ${String(created.receipt_number).padStart(4, "0")}`);
    } catch (e: any) {
      toast.error(e.message || "Erro ao duplicar");
    } finally { setBusy(null); }
  };

  return (
    <div className="space-y-3">
      <Card className="bg-card/60 backdrop-blur-xl">
        <CardContent className="p-3 grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Nome, CPF, valor, data, código..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="issued">Emitidos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Sempre</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês atual</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos métodos</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="cartão de crédito">Crédito</SelectItem>
              <SelectItem value="cartão de débito">Débito</SelectItem>
              <SelectItem value="transferência">Transferência</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12"><Loader2Icon className="h-6 w-6 animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">
          <ReceiptIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          Nenhum recibo encontrado.
        </CardContent></Card>
      ) : (
        <div className="grid gap-2">
          {filtered.map((r) => (
            <Card key={r.id} className="bg-card/60 backdrop-blur-xl hover:border-primary/40 transition">
              <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-gradient-to-br from-primary/20 to-amber-500/20 px-3 py-2 rounded-xl text-center">
                    <div className="text-[10px] text-muted-foreground">Nº</div>
                    <div className="font-bold text-primary text-sm">#{String(r.receipt_number).padStart(4, "0")}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{r.patient_name}</span>
                      {r.status === "cancelled" && <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Cancelado</span>}
                      {r.verification_hash && r.status !== "cancelled" && <ShieldCheckIcon className="h-3 w-3 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{r.service_description}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(r.payment_date + "T00:00:00").toLocaleDateString("pt-BR")} · {r.payment_method.toUpperCase()}
                      {r.unique_code && ` · ${r.unique_code}`}
                    </p>
                  </div>
                  <div className="font-bold text-primary shrink-0">{fmtBRL(Number(r.amount))}</div>
                </div>
                <div className="flex gap-1 justify-end shrink-0">
                  <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => handleDownload(r)} title="Baixar">
                    {busy === r.id ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => handlePrint(r)} title="Imprimir">
                    <PrinterIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => handleDuplicate(r)} title="Duplicar">
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                  {r.status !== "cancelled" && (
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("Cancelar este recibo?")) cancel.mutate(r.id); }} title="Cancelar">
                      <XCircleIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
