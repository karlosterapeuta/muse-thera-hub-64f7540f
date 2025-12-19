import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-access-token',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = await req.json();
    console.log('Webhook received:', JSON.stringify(payload));

    const event = payload.event;
    const payment = payload.payment;

    if (!payment) {
      console.log('No payment data in webhook');
      return new Response(
        JSON.stringify({ received: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing event:', event, 'for payment:', payment.id);

    // Buscar compra pelo asaas_payment_id
    const { data: purchase, error: purchaseError } = await supabase
      .from('course_purchases')
      .select('*')
      .eq('asaas_payment_id', payment.id)
      .maybeSingle();

    if (purchaseError) {
      console.error('Error finding purchase:', purchaseError);
      return new Response(
        JSON.stringify({ received: true, error: 'Purchase lookup failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!purchase) {
      console.log('Purchase not found for payment:', payment.id);
      return new Response(
        JSON.stringify({ received: true, message: 'Purchase not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found purchase:', purchase.id, 'current status:', purchase.payment_status);

    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        if (purchase.payment_status !== 'paid') {
          // Atualizar status para pago
          const { error: updateError } = await supabase
            .from('course_purchases')
            .update({
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', purchase.id);

          if (updateError) {
            console.error('Error updating purchase:', updateError);
            throw updateError;
          }

          console.log('Purchase updated to paid');

          // Liberar acesso ao curso
          const { data: existingAccess } = await supabase
            .from('course_access')
            .select('id')
            .eq('course_id', purchase.course_id)
            .eq('user_id', purchase.user_id)
            .maybeSingle();

          if (!existingAccess) {
            const { error: accessError } = await supabase
              .from('course_access')
              .insert({
                course_id: purchase.course_id,
                user_id: purchase.user_id,
                purchase_id: purchase.id,
                is_active: true,
              });

            if (accessError) {
              console.error('Error granting access:', accessError);
            } else {
              console.log('Course access granted for user:', purchase.user_id);
            }
          } else {
            console.log('User already has access');
          }
        }
        break;

      case 'PAYMENT_OVERDUE':
        if (purchase.payment_status === 'pending') {
          const { error: overdueError } = await supabase
            .from('course_purchases')
            .update({
              payment_status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('id', purchase.id);

          if (overdueError) {
            console.error('Error updating to expired:', overdueError);
          } else {
            console.log('Purchase marked as expired');
          }
        }
        break;

      case 'PAYMENT_DELETED':
      case 'PAYMENT_REFUNDED':
        const { error: cancelError } = await supabase
          .from('course_purchases')
          .update({
            payment_status: event === 'PAYMENT_REFUNDED' ? 'refunded' : 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', purchase.id);

        if (cancelError) {
          console.error('Error cancelling purchase:', cancelError);
        }

        // Remover acesso ao curso
        const { error: revokeError } = await supabase
          .from('course_access')
          .update({ is_active: false })
          .eq('purchase_id', purchase.id);

        if (revokeError) {
          console.error('Error revoking access:', revokeError);
        } else {
          console.log('Course access revoked');
        }
        break;

      default:
        console.log('Unhandled event:', event);
    }

    return new Response(
      JSON.stringify({ received: true, processed: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in asaas-webhook:', error);
    return new Response(
      JSON.stringify({ received: true, error: error.message }),
      {
        status: 200, // Always return 200 to Asaas
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
