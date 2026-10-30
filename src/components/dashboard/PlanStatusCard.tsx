import { Calendar, Clock, Infinity, AlertCircle, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export function PlanStatusCard() {
  const [renewOpen, setRenewOpen] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const renew = async (planCode: string) => {
    setProcessingPlan(planCode);
    try {
      const { data, error } = await supabase.functions.invoke('create-plan-renewal', {
        body: { planCode },
      });
      if (error || !data?.checkoutUrl) throw new Error(data?.error || 'Não foi possível iniciar o pagamento.');
      const checkoutUrl = new URL(data.checkoutUrl);
      if (checkoutUrl.protocol !== 'https:' || !['mercadopago.com.br', 'www.mercadopago.com.br', 'mercadopago.com', 'www.mercadopago.com'].includes(checkoutUrl.hostname)) {
        throw new Error('Endereço de pagamento inválido');
      }
      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao iniciar renovação.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const { data: planData, isLoading } = useQuery({
    queryKey: ["user-plan-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("created_at, expires_at, plan_start_date")
        .eq("id", user.id)
        .single();

      if (!profile) return null;

      // Use plan_start_date if available, otherwise fallback to created_at
      const planStartDate = profile.plan_start_date 
        ? new Date(profile.plan_start_date) 
        : new Date(profile.created_at);
      const expiresAt = profile.expires_at ? new Date(profile.expires_at) : null;
      
      let daysRemaining: number | null = null;
      if (expiresAt) {
        const now = new Date();
        const diffTime = expiresAt.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        planStartDate,
        expiresAt,
        daysRemaining,
        isUnlimited: !expiresAt,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });


  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (!planData) return null;
    
    if (planData.isUnlimited) {
      return (
        <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
          <Infinity className="h-3 w-3 mr-1" />
          Ilimitado
        </Badge>
      );
    }

    const days = planData.daysRemaining ?? 0;

    if (days <= 0) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expirado
        </Badge>
      );
    }

    if (days <= 3) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expira em {days} {days === 1 ? "dia" : "dias"}
        </Badge>
      );
    }

    if (days <= 7) {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
          <Clock className="h-3 w-3 mr-1" />
          {days} dias restantes
        </Badge>
      );
    }

    if (days <= 30) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          {days} dias restantes
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        <Clock className="h-3 w-3 mr-1" />
        {days} dias restantes
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Status do Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (!planData) return null;

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 dark:from-teal-900 dark:via-teal-800 dark:to-emerald-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
      </div>
      <CardContent className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-white shrink-0" />
          </div>
          <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap drop-shadow-sm">Status do Plano</span>
          {getStatusBadge()}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-white/80 whitespace-nowrap">Adesão:</span>
            <span className="font-semibold text-white">{formatDate(planData.planStartDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-white/80 whitespace-nowrap">Término:</span>
            <span className="font-semibold">
              {planData.isUnlimited ? (
                <span className="flex items-center gap-1 text-yellow-200">
                  <Infinity className="h-4 w-4" />
                  Sem limite
                </span>
              ) : (
                <span className="text-white">{formatDate(planData.expiresAt!)}</span>
              )}
            </span>
          </div>
          {!planData.isUnlimited && planData.daysRemaining !== null && planData.daysRemaining > 0 && (
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/90">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">
                Restam <strong className="text-yellow-200">{planData.daysRemaining}</strong> {planData.daysRemaining === 1 ? "dia" : "dias"}
              </span>
            </div>
          )}
          {!planData.isUnlimited && (
            <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
              <DialogTrigger asChild>
                <Button
                  className="min-h-14 w-full sm:w-auto gap-3 rounded-xl border-2 border-white/80 bg-amber-300 px-5 py-3 text-slate-950 shadow-lg shadow-black/25 transition-colors hover:bg-amber-200 hover:text-slate-950 focus-visible:ring-4 focus-visible:ring-amber-100 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
                  type="button"
                  aria-label="Renovar meu plano MuseTera com Pix ou cartão"
                >
                  <CreditCard className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-base font-extrabold">Renovar meu plano</span>
                    <span className="text-xs font-semibold">Pague com Pix ou cartão</span>
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Renovar meu plano MuseTera</DialogTitle>
                  <DialogDescription>Escolha o período e pague com Pix ou cartão no ambiente seguro do Mercado Pago. Seu acesso será atualizado após a confirmação.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {([
                    { code: '30d', title: '30 dias', price: 'R$ 34,90' },
                    { code: '6m', title: '6 meses', price: 'R$ 200,00' },
                    { code: '12m', title: '12 meses', price: 'R$ 400,00' },
                  ] as const).map((plan) => (
                    <div key={plan.code} className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 p-3 dark:border-emerald-800">
                      <div>
                        <p className="font-semibold">{plan.title}</p>
                        <p className="text-sm text-muted-foreground">{plan.price} · Pix ou cartão</p>
                      </div>
                      <Button type="button" disabled={processingPlan !== null} onClick={() => renew(plan.code)}>
                        {processingPlan === plan.code ? 'Aguarde…' : 'Escolher'}
                      </Button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">A conclusão do checkout não confirma o pagamento. O novo prazo será aplicado após a confirmação do Mercado Pago, preservando os dias ainda disponíveis.</p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
