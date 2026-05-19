import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheckIcon, XCircleIcon, Loader2Icon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function VerifyReceiptPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("payment_receipts" as any)
        .select("receipt_number,amount,patient_name,payment_date,service_description,issued_at,status,verification_hash,issuer_snapshot")
        .eq("id", id)
        .maybeSingle();
      setReceipt(data);
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-amber-500/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card/80 backdrop-blur-xl border-border/60 shadow-2xl">
        <CardContent className="p-8 text-center space-y-4">
          {loading ? (
            <Loader2Icon className="h-10 w-10 animate-spin mx-auto" />
          ) : !receipt ? (
            <>
              <XCircleIcon className="h-14 w-14 text-destructive mx-auto" />
              <h1 className="text-xl font-bold">Recibo não encontrado</h1>
            </>
          ) : (
            <>
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${receipt.status === "cancelled" ? "bg-destructive/10" : "bg-emerald-500/10"}`}>
                {receipt.status === "cancelled" ? (
                  <XCircleIcon className="h-9 w-9 text-destructive" />
                ) : (
                  <ShieldCheckIcon className="h-9 w-9 text-emerald-600" />
                )}
              </div>
              <h1 className="text-xl font-bold">
                {receipt.status === "cancelled" ? "Recibo Cancelado" : "Recibo Autêntico"}
              </h1>
              <div className="text-left space-y-1 text-sm bg-muted/40 p-4 rounded-lg">
                <div><strong>Nº:</strong> {String(receipt.receipt_number).padStart(4, "0")}</div>
                <div><strong>Pagador:</strong> {receipt.patient_name}</div>
                <div><strong>Valor:</strong> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(receipt.amount)}</div>
                <div><strong>Data:</strong> {new Date(receipt.payment_date + "T00:00:00").toLocaleDateString("pt-BR")}</div>
                <div><strong>Emissor:</strong> {receipt.issuer_snapshot?.legal_name}</div>
                <div className="text-xs text-muted-foreground break-all pt-2"><strong>Hash:</strong> {receipt.verification_hash}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
