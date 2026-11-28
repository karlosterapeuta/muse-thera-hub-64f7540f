
import { Clock, CreditCard, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function PendingApprovalScreen() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Falta concluir sua assinatura
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sua conta foi criada. Escolha um plano e conclua o pagamento para liberar as funcionalidades do MuseTera. O acesso é ativado automaticamente após a confirmação do Mercado Pago.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-4 space-y-3 text-left">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Escolha entre os planos de 30 dias, 6 meses ou 12 meses e pague com Pix ou cartão.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <span>As ferramentas clínicas permanecem bloqueadas até a confirmação do pagamento.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate("/plano")} className="gap-2">
            <CreditCard className="w-4 h-4" />
            Escolher plano e pagar
          </Button>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
