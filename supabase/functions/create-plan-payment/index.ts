import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://portal.musetera.com.br",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const plans = {
  "30d": { title: "MuseTera — 30 dias", days: 30, cents: 3490 },
  "6m": { title: "MuseTera — 6 meses", days: 180, cents: 20000 },
  "12m": { title: "MuseTera — 12 meses", days: 365, cents: 40000 },
} as const;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: corsHeaders });

serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    const publicKey = Deno.env.get("MERCADOPAGO_PUBLIC_KEY");
    if (!supabaseUrl || !anonKey || !serviceKey || !accessToken || !publicKey) {
      return json({ error: "Pagamento incorporado ainda não está configurado no servidor." }, 503);
    }
    const authorization = req.headers.get("authorization") || "";
    if (!authorization.startsWith("Bearer ")) return json({ error: "Autenticação necessária." }, 401);
    const authClient = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(authorization.slice(7));
    if (authError || !user?.email) return json({ error: "Sessão inválida." }, 401);

    const body = await req.json();
    if (body?.action === "config") return json({ publicKey });
    if (typeof body?.planCode !== "string" || !(body.planCode in plans)) return json({ error: "Plano inválido." }, 400);
    const plan = plans[body.planCode as keyof typeof plans];
    const form = body.paymentData;
    if (!form || typeof form !== "object" || Array.isArray(form)) return json({ error: "Dados de pagamento inválidos." }, 400);
    const paymentMethodId = typeof form.payment_method_id === "string" ? form.payment_method_id : "";
    if (!paymentMethodId || !/^[a-zA-Z0-9_-]{2,40}$/.test(paymentMethodId)) return json({ error: "Método de pagamento inválido." }, 400);
    if (paymentMethodId !== "pix" && (typeof form.token !== "string" || form.token.length < 8)) return json({ error: "Token do cartão inválido. Confira os dados e tente novamente." }, 400);
    const installments = Number(form.installments || 1);
    if (!Number.isInteger(installments) || installments < 1 || installments > 24) return json({ error: "Quantidade de parcelas inválida." }, 400);

    const db = createClient(supabaseUrl, serviceKey);
    const { data: profile, error: profileError } = await db.from("profiles").select("expires_at").eq("id", user.id).single();
    if (profileError || !profile) return json({ error: "Perfil não encontrado." }, 404);
    if (!profile.expires_at) return json({ error: "Sua conta possui plano ilimitado." }, 400);

    const { data: recent } = await db.from("plan_renewals")
      .select("id, mp_payment_id, mp_payment_status, created_at")
      .eq("user_id", user.id).eq("status", "pending")
      .order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (recent) {
      let currentStatus = String(recent.mp_payment_status || "pending").toLowerCase();
      if (recent.mp_payment_id) {
        const statusResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(recent.mp_payment_id)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!statusResponse.ok) {
          return json({ error: "Estamos confirmando o status da tentativa anterior. Aguarde alguns instantes e tente novamente." }, 409);
        }
        const currentPayment = await statusResponse.json();
        currentStatus = String(currentPayment.status || currentStatus).toLowerCase();
        const terminalStatuses = ["rejected", "cancelled", "refunded"];
        if (terminalStatuses.includes(currentStatus)) {
          const { error: closeError } = await db.from("plan_renewals").update({
            // The production CHECK constraint allows failed/cancelled but not refunded.
            // Preserve the provider's exact status separately for audit/history.
            status: currentStatus === "cancelled" ? "cancelled" : "failed",
            mp_payment_status: currentStatus,
          }).eq("id", recent.id).eq("status", "pending");
          if (closeError) {
            console.error("Could not close terminal renewal:", closeError.message);
            return json({ error: "Não foi possível liberar a nova tentativa com segurança. Tente novamente em instantes." }, 503);
          }
        } else {
          return json({
            error: currentStatus === "approved"
              ? "Seu pagamento foi aprovado e está sendo confirmado. Atualize a página em instantes."
              : "Já existe um pagamento em andamento. Finalize o Pix ou aguarde a análise antes de iniciar outra cobrança.",
            pending: true,
            paymentStatus: currentStatus,
          }, 409);
        }
      } else {
        const ageMs = Date.now() - new Date(recent.created_at).getTime();
        if (ageMs < 15 * 60 * 1000) {
          return json({ error: "Sua solicitação anterior ainda está sendo preparada. Aguarde até 15 minutos antes de tentar novamente." }, 409);
        }
        await db.from("plan_renewals").update({
          status: "failed",
          mp_payment_status: "creation_timeout",
        }).eq("id", recent.id).eq("status", "pending").is("mp_payment_id", null);
      }
    }

    const { data: renewal, error: insertError } = await db.from("plan_renewals")
      .insert({ user_id: user.id, plan_code: body.planCode, duration_days: plan.days, amount_cents: plan.cents })
      .select("id").single();
    if (insertError || !renewal) throw new Error("Falha ao registrar a renovação.");

    const payer = {
      email: user.email,
      ...(form.payer?.identification?.type && form.payer?.identification?.number
        ? { identification: { type: String(form.payer.identification.type), number: String(form.payer.identification.number).replace(/\D/g, "").slice(0, 14) } }
        : {}),
    };
    const paymentPayload: Record<string, unknown> = {
      transaction_amount: plan.cents / 100,
      description: plan.title,
      payment_method_id: paymentMethodId,
      installments: paymentMethodId === "pix" ? 1 : installments,
      payer,
      external_reference: renewal.id,
      notification_url: `${supabaseUrl}/functions/v1/plan-renewal-webhook`,
    };
    if (paymentMethodId !== "pix") {
      paymentPayload.token = form.token;
      if (form.issuer_id) paymentPayload.issuer_id = String(form.issuer_id);
    }
    const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "X-Idempotency-Key": renewal.id },
      body: JSON.stringify(paymentPayload),
    });
    const payment = await mpResponse.json();
    if (!mpResponse.ok || !payment?.id) {
      await db.from("plan_renewals").update({ status: "failed", mp_payment_status: "request_error" }).eq("id", renewal.id);
      console.error("Mercado Pago payment rejected:", mpResponse.status, payment?.message || "unknown");
      return json({ error: "O Mercado Pago não autorizou iniciar esta cobrança. Confira os dados ou tente outro meio de pagamento." }, 402);
    }
    await db.from("plan_renewals").update({
      mp_payment_id: String(payment.id),
      mp_payment_status: String(payment.status || "pending"),
    }).eq("id", renewal.id);
    return json({
      id: String(payment.id),
      status: String(payment.status || "pending"),
      statusDetail: String(payment.status_detail || ""),
      paymentMethodId,
      pointOfInteraction: payment.point_of_interaction?.transaction_data ? {
        qrCode: payment.point_of_interaction.transaction_data.qr_code || null,
        qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64 || null,
        ticketUrl: payment.point_of_interaction.transaction_data.ticket_url || null,
      } : null,
    });
  } catch (error) {
    console.error("create-plan-payment failed:", error instanceof Error ? error.message : "unknown");
    return json({ error: "Não foi possível processar o pagamento agora." }, 500);
  }
});
