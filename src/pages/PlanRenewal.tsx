import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CalendarClock, CheckCircle2, Clock3, CreditCard, ExternalLink, Infinity, Loader2, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PlanCode = "30d" | "6m" | "12m";
type Plan = { code: PlanCode; title: string; price: string; amount: number; detail: string; featured?: boolean };
type BrickController = { unmount: () => void };
type PaymentResponse = {
  id: string;
  status: string;
  statusDetail: string;
  paymentMethodId: string;
  pointOfInteraction?: { qrCode?: string | null; qrCodeBase64?: string | null; ticketUrl?: string | null } | null;
};
type MercadoPagoInstance = {
  bricks: () => {
    create: (type: string, container: string, settings: Record<string, unknown>) => Promise<BrickController>;
  };
};
declare global {
  interface Window { MercadoPago?: new (key: string, options?: Record<string, unknown>) => MercadoPagoInstance }
}

const plans: Plan[] = [
  { code: "30d", title: "30 dias", price: "R$ 34,90", amount: 34.9, detail: "Flexibilidade para renovar mês a mês" },
  { code: "6m", title: "6 meses", price: "R$ 200,00", amount: 200, detail: "Praticidade para o semestre", featured: true },
  { code: "12m", title: "12 meses", price: "R$ 400,00", amount: 400, detail: "Mais tranquilidade durante o ano" },
];

function loadMercadoPagoSdk() {
  if (window.MercadoPago) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mp-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Não foi possível carregar o Mercado Pago.")), { once: true });
      if (window.MercadoPago) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.dataset.mpSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Não foi possível carregar o Mercado Pago."));
    document.head.appendChild(script);
  });
}

export default function PlanRenewalPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [brickLoading, setBrickLoading] = useState(false);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [resumingPayment, setResumingPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const brickRef = useRef<BrickController | null>(null);
  const selected = useMemo(() => plans.find((plan) => plan.code === selectedPlan) || null, [selectedPlan]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["plan-renewal-page-profile"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Faça login para consultar seu plano.");
      const [{ data: profile, error }, { data: renewals, error: renewalError }] = await Promise.all([
        supabase.from("profiles").select("created_at, expires_at, plan_start_date, status, is_unlimited").eq("id", user.id).single(),
        supabase.from("plan_renewals").select("id, plan_code, amount_cents, status, created_at, paid_at, mp_payment_id, mp_payment_status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      if (error) throw error;
      if (renewalError) throw renewalError;
      return { user, profile, renewals: renewals || [] };
    },
    staleTime: 30_000,
    // While a first payment is pending, keep checking until the webhook activates the profile.
    refetchInterval: (query) => query.state.data?.profile.status === "pending" ? 5_000 : false,
  });

  const expiresAt = userData?.profile.expires_at ? new Date(userData.profile.expires_at) : null;
  const daysRemaining = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / 86400000) : null;
  const isUnlimited = Boolean(userData?.profile.is_unlimited);
  const pendingRenewal = userData?.renewals.find((renewal) => renewal.status === "pending" && ["pending", "in_process", "authorized"].includes(String(renewal.mp_payment_status || "pending").toLowerCase())) || null;
  const hasPendingRenewal = Boolean(pendingRenewal);

  useEffect(() => {
    if (!selected || !userData?.user.email || !publicKey) return;
    let cancelled = false;
    const mountBrick = async () => {
      setBrickLoading(true);
      setPayment(null);
      try {
        await loadMercadoPagoSdk();
        if (cancelled || !window.MercadoPago) return;
        brickRef.current?.unmount();
        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        const controller = await mp.bricks().create("payment", "musetera-payment-brick", {
          initialization: { amount: selected.amount, payer: { email: userData.user.email } },
          customization: {
            paymentMethods: { creditCard: "all", debitCard: "all", bankTransfer: ["pix"], ticket: [] },
            visual: { style: { theme: "default" } },
          },
          callbacks: {
            onReady: () => { if (!cancelled) setBrickLoading(false); },
            onError: (error: unknown) => {
              console.error("Mercado Pago Brick error:", error);
              if (!cancelled) {
                setBrickLoading(false);
                toast.error("Não foi possível carregar o formulário de pagamento.");
              }
            },
            onSubmit: async ({ formData }: { formData: Record<string, unknown> }) => {
              const { data, error } = await supabase.functions.invoke("create-plan-payment", {
                body: { planCode: selected.code, paymentData: formData },
              });
              if (error || data?.error) throw new Error(data?.error || "Não foi possível processar o pagamento.");
              const result = data as PaymentResponse;
              setPayment(result);
              if (result.status === "approved") {
                toast.success("Pagamento aprovado! Seu plano será atualizado automaticamente.");
                await queryClient.invalidateQueries({ queryKey: ["plan-renewal-page-profile"] });
                await queryClient.invalidateQueries({ queryKey: ["user-plan-status"] });
              } else if (result.status === "pending" || result.status === "in_process") {
                toast.info("Pagamento recebido e aguardando confirmação.");
              } else {
                toast.error("O pagamento não foi aprovado. Você pode tentar novamente.");
              }
              return result;
            },
          },
        });
        if (cancelled) controller.unmount();
        else brickRef.current = controller;
      } catch (error) {
        if (!cancelled) {
          setBrickLoading(false);
          toast.error(error instanceof Error ? error.message : "Falha ao preparar o pagamento.");
        }
      }
    };
    void mountBrick();
    return () => {
      cancelled = true;
      brickRef.current?.unmount();
      brickRef.current = null;
    };
  }, [selected, publicKey, userData?.user.email, queryClient]);

  const resumePendingPayment = useCallback(async (): Promise<PaymentResponse | null> => {
    if (!pendingRenewal || resumingPayment) return null;
    setResumingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-plan-payment", { body: { action: "resume" } });
      if (error || data?.error) throw new Error(data?.error || "Não foi possível recuperar o pagamento.");
      if (data?.terminal) {
        await queryClient.invalidateQueries({ queryKey: ["plan-renewal-page-profile"] });
        toast.info("A tentativa anterior foi encerrada. Agora você pode escolher um plano.");
        return null;
      }
      setSelectedPlan(null);
      setPayment(data.payment as PaymentResponse);
      toast.success(data.payment?.paymentMethodId === "pix" ? "Seu Pix anterior foi recuperado." : "Status do pagamento anterior atualizado.");
      return data.payment as PaymentResponse;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível recuperar o pagamento.");
      return null;
    } finally {
      setResumingPayment(false);
    }
  }, [pendingRenewal, resumingPayment, queryClient]);

  const choosePlan = useCallback(async (code: PlanCode) => {
    if (pendingRenewal) {
      const samePlan = pendingRenewal.plan_code === code;
      if (samePlan) {
        const resumed = await resumePendingPayment();
        if (!resumed || resumed.paymentMethodId === "pix" || resumed.status === "approved") return;
      }
      const previousLabel = pendingRenewal.plan_code === "30d" ? "30 dias" : pendingRenewal.plan_code === "6m" ? "6 meses" : "12 meses";
      const nextLabel = plans.find((plan) => plan.code === code)?.title || code;
      const confirmed = window.confirm(
        samePlan
          ? `O pagamento anterior por cartão está em análise e não pode ser retomado como uma nova tentativa. Para pagar novamente o plano ${nextLabel}, será necessário cancelar a tentativa anterior no Mercado Pago. Deseja cancelar e iniciar outra cobrança?`
          : `Existe um pagamento de ${previousLabel} ainda pendente. Para escolher ${nextLabel}, será necessário cancelar a cobrança anterior no Mercado Pago. Se ela já tiver sido aprovada, não será possível continuar. Deseja cancelar e escolher outro plano?`
      );
      if (!confirmed) return;
      const { data, error } = await supabase.functions.invoke("create-plan-payment", { body: { action: "cancel-pending" } });
      if (error || data?.error) {
        toast.error(data?.error || "Não foi possível cancelar a tentativa anterior.");
        await queryClient.invalidateQueries({ queryKey: ["plan-renewal-page-profile"] });
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["plan-renewal-page-profile"] });
      setPayment(null);
      toast.success("Cobrança anterior cancelada. Você já pode escolher o novo plano.");
    }
    setSelectedPlan(code);
    setPayment(null);
    if (!publicKey) {
      const { data, error } = await supabase.functions.invoke("create-plan-payment", { body: { action: "config" } });
      if (error || !data?.publicKey) {
        toast.error(data?.error || "A chave pública do Mercado Pago não está configurada.");
        return;
      }
      setPublicKey(data.publicKey);
    }
  }, [pendingRenewal, resumePendingPayment, publicKey, queryClient]);

  const copyPix = async () => {
    const code = payment?.pointOfInteraction?.qrCode;
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código Pix copiado.");
  };

  const formatDate = (value: string | Date) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const statusLabel = (status: string) => ({
    pending: "Aguardando pagamento",
    in_process: "Em análise",
    approved: "Aprovado",
    paid: "Pago",
    failed: "Não aprovado",
    rejected: "Recusado",
    cancelled: "Cancelado",
  }[status] || status);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} aria-label="Voltar ao painel"><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">MuseTera · Assinatura</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{userData?.profile.status === "pending" ? "Escolha seu plano" : "Meu plano e renovação"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{userData?.profile.status === "pending" ? "Conclua o pagamento para liberar automaticamente as funcionalidades do MuseTera." : "Consulte sua assinatura e renove com Pix ou cartão sem sair do portal."}</p>
        </div>
      </div>

      {isLoading ? <Card><CardContent className="space-y-3 p-6"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64" /><Skeleton className="h-10 w-full" /></CardContent></Card> : userData && (
        <Card className="overflow-hidden border-teal-700/20">
          <div className="bg-gradient-to-r from-teal-800 to-emerald-700 px-5 py-5 text-white sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2"><CalendarClock className="h-5 w-5" /><span className="font-semibold">Situação da assinatura</span></div>
              <Badge className={isUnlimited ? "bg-white/20 text-white" : daysRemaining !== null && daysRemaining <= 0 ? "bg-red-100 text-red-800" : "bg-white/20 text-white"}>
                {isUnlimited ? "Ilimitado" : userData.profile.status === "pending" ? "Aguardando pagamento" : daysRemaining !== null && daysRemaining <= 0 ? "Expirado" : "Ativo"}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div><p className="text-xs text-white/70">Adesão</p><p className="mt-1 font-semibold">{formatDate(userData.profile.plan_start_date || userData.profile.created_at)}</p></div>
              <div><p className="text-xs text-white/70">Vencimento</p><p className="mt-1 font-semibold">{expiresAt ? formatDate(expiresAt) : isUnlimited ? "Sem vencimento" : "Após ativação"}</p></div>
              <div><p className="text-xs text-white/70">Prazo restante</p><p className="mt-1 font-semibold">{isUnlimited ? "Ilimitado" : userData.profile.status === "pending" ? "Aguardando pagamento" : daysRemaining !== null && daysRemaining > 0 ? `${daysRemaining} dias` : "Plano vencido"}</p></div>
            </div>
          </div>
          <CardContent className="p-5 sm:p-6">
            {isUnlimited ? (
              <Alert><Infinity className="h-4 w-4" /><AlertDescription>Sua conta possui acesso ilimitado. Não é necessário renovar.</AlertDescription></Alert>
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl border-2 border-teal-600/30 bg-teal-50/70 p-4 dark:bg-teal-950/20">
                  <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200">
                    <CreditCard className="h-5 w-5" />
                    <h2 className="text-lg font-extrabold">1. {userData.profile.status === "pending" ? "Escolha seu plano para ativar a conta" : "Escolha um plano para renovar"}</h2>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">Clique em uma das opções abaixo. Depois que você selecionar o plano, o formulário para pagar com Pix ou cartão aparecerá nesta página.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Seu prazo atual será preservado: os novos dias serão acrescentados ao vencimento vigente.</p>
                </div>
                {hasPendingRenewal && <Alert className="border-amber-500/40"><Clock3 className="h-4 w-4 text-amber-600" /><AlertDescription><div className="space-y-2"><p>Existe uma tentativa de pagamento de {pendingRenewal.plan_code === "30d" ? "30 dias" : pendingRenewal.plan_code === "6m" ? "6 meses" : "12 meses"} ainda em aberto. Você pode recuperar o Pix anterior ou escolher outro plano; nesse caso, a cobrança pendente será cancelada primeiro para evitar duplicidade.</p><Button type="button" size="sm" variant="outline" onClick={() => void resumePendingPayment()} disabled={resumingPayment}>{resumingPayment ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Consultando pagamento…</> : <><Wallet className="mr-2 h-4 w-4" /> Continuar pagamento anterior</>}</Button></div></AlertDescription></Alert>}{userData.renewals.some((renewal) => ["failed", "cancelled", "refunded"].includes(renewal.status) || ["rejected", "cancelled", "refunded"].includes(String(renewal.mp_payment_status || "").toLowerCase())) && !hasPendingRenewal && <Alert className="border-emerald-500/30"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><AlertDescription>A tentativa anterior não foi concluída. Você já pode escolher um plano e tentar novamente com Pix ou cartão.</AlertDescription></Alert>}
                <div className="grid gap-3 md:grid-cols-3">
                  {plans.map((plan) => (
                    <button key={plan.code} type="button" aria-pressed={selectedPlan === plan.code} onClick={() => void choosePlan(plan.code)} className={`relative flex min-h-48 flex-col rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30 disabled:cursor-not-allowed disabled:opacity-50 ${selectedPlan === plan.code ? "border-teal-700 bg-teal-50 ring-2 ring-teal-700 shadow-md dark:bg-teal-950/40" : "border-border bg-card"}`}>
                      {plan.featured && <span className="absolute -top-2.5 right-3 rounded-full bg-teal-700 px-2.5 py-1 text-[10px] font-bold text-white">MAIS ESCOLHIDO</span>}
                      <div className="flex w-full items-center justify-between gap-2"><p className="text-base font-extrabold">{plan.title}</p><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selectedPlan === plan.code ? "border-teal-700 bg-teal-700 text-white" : "border-muted-foreground/50"}`}>{selectedPlan === plan.code && <CheckCircle2 className="h-4 w-4" />}</span></div>
                      <p className="mt-3 text-3xl font-extrabold tracking-tight">{plan.price}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{plan.detail}</p>
                      <span className={`mt-auto flex w-full items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-extrabold ${selectedPlan === plan.code ? "bg-teal-800 text-white" : "bg-teal-700 text-white"}`}>
                        {selectedPlan === plan.code ? <><CheckCircle2 className="h-4 w-4" /> Plano selecionado</> : <>{userData.profile.status === "pending" ? "ESCOLHER ESTE PLANO" : "CLIQUE AQUI PARA RENOVAR"} <span aria-hidden="true">→</span></>}
                      </span>
                    </button>
                  ))}
                </div>
                {payment && !selected && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 p-4 dark:bg-amber-950/10">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div><p className="font-semibold">Pagamento anterior · {payment.paymentMethodId === "pix" ? "Pix" : "Cartão"}</p><p className="text-sm text-muted-foreground">Status: {statusLabel(payment.status)}</p></div>
                      <Badge variant={payment.status === "approved" ? "default" : "secondary"}>{statusLabel(payment.status)}</Badge>
                    </div>
                    {(payment.status === "pending" || payment.status === "in_process") && payment.paymentMethodId === "pix" && (
                      <div className="mt-3 space-y-3 rounded-lg border bg-background p-3">
                        <p className="font-semibold">Continue o pagamento usando este mesmo Pix</p>
                        {payment.pointOfInteraction?.qrCodeBase64 && <img alt="QR Code Pix para pagamento" className="mx-auto h-52 w-52" src={`data:image/png;base64,${payment.pointOfInteraction.qrCodeBase64}`} />}
                        {payment.pointOfInteraction?.qrCode && <Button className="w-full" onClick={() => void copyPix()}><Wallet className="mr-2 h-4 w-4" />{copied ? "Código copiado" : "Copiar código Pix"}</Button>}
                        {payment.pointOfInteraction?.ticketUrl && <a className="inline-flex items-center gap-1 text-sm text-teal-700 underline" href={payment.pointOfInteraction.ticketUrl} target="_blank" rel="noreferrer">Abrir instruções Pix <ExternalLink className="h-3 w-3" /></a>}
                      </div>
                    )}
                    {payment.status === "approved" && <Alert className="mt-3 border-emerald-500/40"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><AlertDescription>Pagamento aprovado. Aguarde a confirmação automática do seu plano.</AlertDescription></Alert>}
                    {payment.paymentMethodId !== "pix" && ["pending", "in_process", "authorized"].includes(payment.status) && <p className="mt-2 text-sm text-muted-foreground">O pagamento com cartão está em análise. Você pode aguardar ou selecionar outro plano; a tentativa anterior será cancelada somente após confirmação do Mercado Pago.</p>}
                  </div>
                )}
                {selected && (
                  <div className="rounded-xl border border-teal-700/20 bg-muted/20 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div><p className="font-semibold">Pagamento seguro · {selected.title}</p><p className="text-sm text-muted-foreground">{selected.price} · Pix ou cartão de crédito</p></div>
                      <div className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-300"><ShieldCheck className="h-4 w-4" /> Mercado Pago</div>
                    </div>
                    {brickLoading && <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Carregando opções de pagamento…</div>}
                    <div id="musetera-payment-brick" className="min-h-8" />
                    {payment?.status === "approved" && <Alert className="mt-4 border-emerald-500/40"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><AlertDescription>Pagamento aprovado. A atualização do plano é confirmada pelo servidor.</AlertDescription></Alert>}
                    {(payment?.status === "pending" || payment?.status === "in_process") && payment.paymentMethodId === "pix" && (
                      <div className="mt-4 space-y-3 rounded-lg border bg-background p-3">
                        <p className="font-semibold">Pix aguardando pagamento</p>
                        {payment.pointOfInteraction?.qrCodeBase64 && <img alt="QR Code Pix para pagamento" className="mx-auto h-52 w-52" src={`data:image/png;base64,${payment.pointOfInteraction.qrCodeBase64}`} />}
                        {payment.pointOfInteraction?.qrCode && <Button className="w-full" onClick={() => void copyPix()}><Wallet className="mr-2 h-4 w-4" />{copied ? "Código copiado" : "Copiar código Pix"}</Button>}
                        {payment.pointOfInteraction?.ticketUrl && <a className="inline-flex items-center gap-1 text-sm text-teal-700 underline" href={payment.pointOfInteraction.ticketUrl} target="_blank" rel="noreferrer">Abrir instruções Pix <ExternalLink className="h-3 w-3" /></a>}
                      </div>
                    )}
                    {payment && !["approved", "pending", "in_process"].includes(payment.status) && <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>O pagamento não foi aprovado. Confira os dados e tente novamente.</AlertDescription></Alert>}
                  </div>
                )}
                <div className="flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><p>O MuseTera não armazena os dados do seu cartão. A cobrança é processada pelo Mercado Pago e a validade só muda após confirmação do pagamento pelo servidor.</p></div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock3 className="h-5 w-5" /> Histórico de renovações</CardTitle><CardDescription>Últimas solicitações de pagamento vinculadas à sua conta.</CardDescription></CardHeader>
        <CardContent>
          {!userData ? <Skeleton className="h-12 w-full" /> : userData.renewals.length === 0 ? <p className="py-5 text-sm text-muted-foreground">Nenhuma renovação registrada até o momento.</p> : (
            <div className="space-y-3">
              {userData.renewals.map((renewal) => (
                <div key={renewal.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                  <div><p className="font-medium">{renewal.plan_code === "30d" ? "30 dias" : renewal.plan_code === "6m" ? "6 meses" : "12 meses"}</p><p className="text-xs text-muted-foreground">{formatDate(renewal.created_at)}</p></div>
                  <div className="text-right"><p className="font-semibold">{(renewal.amount_cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p><Badge variant={["paid", "approved"].includes(renewal.status) ? "default" : renewal.status === "failed" ? "destructive" : "secondary"}>{statusLabel(renewal.status === "pending" && renewal.mp_payment_status ? renewal.mp_payment_status : renewal.status)}</Badge></div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><CreditCard className="h-4 w-4" /><Smartphone className="h-4 w-4" /> Pagamento disponível em computador e celular</div>
    </main>
  );
}
