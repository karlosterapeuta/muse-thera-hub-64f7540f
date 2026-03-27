
import { Clock, LogOut, Mail } from "lucide-react";
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
            Cadastro Pendente de Aprovação
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Seu cadastro foi realizado com sucesso! Porém, o administrador ainda precisa liberar o seu acesso ao sistema.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Você receberá uma notificação quando seu acesso for liberado.</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span>O processo de aprovação pode levar até 24 horas úteis.</span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
