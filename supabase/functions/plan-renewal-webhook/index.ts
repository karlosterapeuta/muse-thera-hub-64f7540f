import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const unauthorized = () => new Response('Unauthorized', { status: 401 });

async function validSignature(req: Request, paymentId: string, secret: string): Promise<boolean> {
  const signature = req.headers.get('x-signature') || '';
  const requestId = req.headers.get('x-request-id') || '';
  const ts = signature.match(/(?:^|,)ts=([^,]+)/)?.[1];
  const v1 = signature.match(/(?:^|,)v1=([a-f0-9]+)/i)?.[1];
  if (!ts || !v1 || !requestId || !/^\d+$/.test(ts)) return false;
  if (Math.abs(Date.now() - Number(ts)) > 10 * 60 * 1000) return false;
  const manifest = `id:${paymentId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest)));
  const calculated = Array.from(mac).map((b) => b.toString(16).padStart(2, '0')).join('');
  if (v1.length !== calculated.length) return false;
  let mismatch = 0;
  for (let i = 0; i < v1.length; i++) mismatch |= v1.charCodeAt(i) ^ calculated.charCodeAt(i);
  return mismatch === 0;
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
  const secret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET');
  if (!accessToken || !secret) return new Response('Webhook not configured', { status: 503 });
  try {
    const body = await req.json();
    if (body.type !== 'payment' || !body.data?.id) return new Response('Ignored', { status: 200 });
    const id = String(body.data.id);
    const urlId = new URL(req.url).searchParams.get('data.id');
    if (urlId && urlId !== id) return unauthorized();
    if (!(await validSignature(req, urlId || id, secret))) return unauthorized();

    // Never trust the webhook body as proof of payment: retrieve the payment
    // using our private access token, then match the internal order and amount.
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return new Response('Payment lookup failed', { status: 503 });
    const payment = await response.json();
    if (payment.currency_id !== 'BRL' || typeof payment.external_reference !== 'string') {
      return new Response('Unmatched payment', { status: 200 });
    }
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: renewal } = await db.from('plan_renewals')
      .select('id, amount_cents, status').eq('id', payment.external_reference).maybeSingle();
    if (!renewal || Math.round(Number(payment.transaction_amount) * 100) !== renewal.amount_cents) {
      return new Response('Unmatched payment', { status: 200 });
    }

    const paymentStatus = String(payment.status || '').toLowerCase();
    if (paymentStatus === 'approved') {
      const { data: applied, error } = await db.rpc('apply_paid_plan_renewal', { p_renewal_id: renewal.id });
      if (error || !applied) {
        console.error('Renewal apply failed', error?.message || 'not applied');
        return new Response('Retry later', { status: 500 });
      }
      return new Response('OK');
    }

    // Keep genuinely in-flight payments locked, but release terminal failures so the
    // customer can safely start a new attempt. The provider status is fetched above,
    // never trusted from the webhook payload.
    const terminal = {
      rejected: 'failed',
      cancelled: 'cancelled',
      refunded: 'refunded',
    } as Record<string, string>;
    const terminalStatus = terminal[paymentStatus];
    if (terminalStatus) {
      const { error } = await db.from('plan_renewals').update({
        status: terminalStatus,
        mp_payment_status: paymentStatus,
      }).eq('id', renewal.id).eq('status', 'pending');
      if (error) {
        console.error('Could not close failed renewal', error.message);
        return new Response('Retry later', { status: 500 });
      }
      return new Response('Terminal payment recorded');
    }

    await db.from('plan_renewals').update({
      mp_payment_status: paymentStatus || 'pending',
    }).eq('id', renewal.id).eq('status', 'pending');
    return new Response('Payment still processing');
  } catch (error) {
    console.error('Mercado Pago webhook error', error instanceof Error ? error.message : 'unknown');
    return new Response('Retry later', { status: 500 });
  }
});
