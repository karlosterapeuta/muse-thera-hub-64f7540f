import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2Icon, Loader2Icon, PaperclipIcon, ReceiptIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useUpdateFinancialRecord } from "@/pages/finance/hooks/useFinancialData";
import type { FinancialRecord } from "@/pages/finance/types";

interface Props {
  open: boolean;
  onClose: () => void;
  record: FinancialRecord | null;
  /** Called after successful confirmation; receives the updated record so the parent can open the receipt dialog. */
  onConfirmed?: (record: FinancialRecord) => void;
}

const schema = z.object({
  amount: z.number().positive("Informe um valor maior que zero").max(999999),
  paid_at: z.string().min(1, "Informe a data do recebimento"),
  payment_method: z.string().min(1, "Selecione a forma de pagamento"),
  payment_notes: z.string().max(500).optional(),
});

const todayISO = () => {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10);
};

export function ConfirmPaymentDialog({ open, onClose, record, onConfirmed }: Props) {
  const updateRecord = useUpdateFinancialRecord();
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    amount: 0,
    paid_at: todayISO(),
    payment_method: "pix",
    payment_notes: "",
  });

  useEffect(() => {
    if (!record) return;
    setForm({
      amount: Number(record.amount || 0),
      paid_at: todayISO(),
      payment_method: record.payment_method || "pix",
      payment_notes: record.payment_notes || "",
    });
    setFile(null);
  }, [record]);

  if (!record) return null;

  const handleSubmit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      // Upload do comprovante (opcional)
      let payment_proof_url: string | undefined;
      if (file) {
        const ext = file.name.split(".").pop() || "bin";
        const path = `${userData.user.id}/${record.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("payment-proofs")
          .upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;
        payment_proof_url = path;
      }

      const updated = await updateRecord.mutateAsync({
        id: record.id,
        amount: form.amount,
        payment_status: "pago",
        paid_at: new Date(`${form.paid_at}T12:00:00`).toISOString(),
        payment_method: form.payment_method,
        payment_notes: form.payment_notes || null,
        ...(payment_proof_url ? { payment_proof_url } : {}),
      } as any);

      toast.success("Pagamento confirmado!");

      const merged: FinancialRecord = {
        ...record,
        ...(updated as any),
        clinic_name: record.clinic_name,
        patient_name: record.patient_name,
        amount: form.amount,
        payment_status: "pago",
        payment_method: form.payment_method,
      };

      onClose();
      onConfirmed?.(merged);
    } catch (e: any) {
      toast.error(e.message || "Erro ao confirmar pagamento");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !submitting && onClose()}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <CheckCircle2Icon className="h-5 w-5 text-white" />
            </div>
            Confirmar Recebimento
          </DialogTitle>
          <DialogDescription>
            Registre o pagamento e o sistema gerará o recibo automaticamente para envio ao cliente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{record.patient_name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Atendimento:</span>
              <span>{new Date(record.session_date + "T00:00:00").toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          <div>
            <Label>Valor recebido (R$) *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data do recebimento *</Label>
              <Input
                type="date"
                value={form.paid_at}
                onChange={(e) => setForm({ ...form, paid_at: e.target.value })}
              />
            </div>
            <div>
              <Label>Forma de pagamento *</Label>
              <Select
                value={form.payment_method}
                onValueChange={(v) => setForm({ ...form, payment_method: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferência">Transferência</SelectItem>
                  <SelectItem value="cartão de crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartão de débito">Cartão de Débito</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Comprovante (opcional)</Label>
            <div className="mt-1">
              {file ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 truncate">
                    <PaperclipIcon className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setFile(null)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/20 px-3 py-3 text-sm text-muted-foreground hover:bg-muted/40 transition-colors">
                  <PaperclipIcon className="h-4 w-4" />
                  Anexar comprovante (PDF ou imagem)
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f && f.size > 5 * 1024 * 1024) {
                        toast.error("Arquivo muito grande (máx. 5MB)");
                        return;
                      }
                      setFile(f || null);
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              rows={2}
              value={form.payment_notes}
              onChange={(e) => setForm({ ...form, payment_notes: e.target.value })}
              placeholder="Ex.: pago via PIX em 2 parcelas"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={submitting} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            >
              {submitting ? (
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ReceiptIcon className="h-4 w-4 mr-2" />
              )}
              Confirmar e gerar recibo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
