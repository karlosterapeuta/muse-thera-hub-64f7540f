import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ReceiptIcon, DownloadIcon, SearchIcon, XCircleIcon, Loader2Icon, ShieldCheckIcon } from "lucide-react";
import { usePaymentReceipts, useCancelReceipt } from "@/hooks/usePaymentReceipts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ReceiptsListPage() {
  const navigate = useNavigate();
  const { data: receipts = [], isLoading } = usePaymentReceipts();
  const cancel = useCancelReceipt();
  const [q, setQ] = useState("");

  const filtered = receipts.filter((r) =>
    !q ||
    r.patient_name.toLowerCase().includes(q.toLowerCase()) ||
    String(r.receipt_number).includes(q)
  );

  const handleDownload = async (path?: string | null, number?: number) => {
    if (!path) { toast.error("PDF não disponível"); return; }
    const { data } = await supabase.storage.from("clinical-pdfs").createSignedUrl(path, 60 * 5);
    if (data?.signedUrl) {
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = `recibo-${String(number).padStart(4, "0")}.pdf`;
      a.target = "_blank";
      a.click();
    }
  };

  return (
    <div className="container max-w-5xl py-6 space-y-6 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -z-10" />

      <Button variant="ghost" size="sm" onClick={() => navigate("/finance")} className="gap-2">
        <ArrowLeftIcon className="h-4 w-4" /> Voltar
      </Button>

      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/60 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-amber-400/5 pointer-events-none" />
        <CardContent className="p-6 relative flex items-center gap-4">
          <div className="bg-gradient-to-br from-primary to-amber-500 p-3 rounded-xl">
            <ReceiptIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Recibos Emitidos
            </h1>
            <p className="text-sm text-muted-foreground">Histórico de todos os recibos de pagamento</p>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por paciente ou número..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2Icon className="h-6 w-6 animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card/60 backdrop-blur-xl"><CardContent className="p-12 text-center text-muted-foreground">
          <ReceiptIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          Nenhum recibo emitido ainda.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <Card key={r.id} className="bg-card/60 backdrop-blur-xl border-border/60 hover:border-primary/40 transition">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-gradient-to-br from-primary/20 to-amber-500/20 p-3 rounded-xl">
                    <span className="font-bold text-primary">#{String(r.receipt_number).padStart(4, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{r.patient_name}</span>
                      {r.status === "cancelled" && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Cancelado</span>
                      )}
                      {r.verification_hash && r.status !== "cancelled" && (
                        <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{r.service_description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.payment_date + "T00:00:00").toLocaleDateString("pt-BR")} · {r.payment_method.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(r.amount)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(r.pdf_path, r.receipt_number)}>
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                  {r.status !== "cancelled" && (
                    <Button
                      size="sm" variant="ghost"
                      onClick={() => { if (confirm("Cancelar este recibo?")) cancel.mutate(r.id); }}
                    >
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
