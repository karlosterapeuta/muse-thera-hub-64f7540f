import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY');
    const ASAAS_ENV = Deno.env.get('ASAAS_ENVIRONMENT') || 'sandbox';
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!ASAAS_API_KEY) {
      throw new Error('ASAAS_API_KEY not configured');
    }

    const ASAAS_BASE_URL = ASAAS_ENV === 'production'
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creatorId');

    if (!creatorId) {
      throw new Error('creatorId is required');
    }

    console.log('Getting balance for creator:', creatorId);

    // Buscar dados do criador
    const { data: creator, error: creatorError } = await supabase
      .from('course_creators')
      .select('asaas_wallet_id, asaas_account_status')
      .eq('id', creatorId)
      .single();

    if (creatorError || !creator) {
      console.error('Creator not found:', creatorError);
      throw new Error('Criador não encontrado');
    }

    if (!creator.asaas_wallet_id) {
      return new Response(
        JSON.stringify({
          success: true,
          hasAccount: false,
          message: 'Criador não possui subconta Asaas configurada',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar saldo na API do Asaas
    // Nota: Para subcontas, seria necessário usar a API key da subconta
    // Por enquanto, retornamos dados do banco local
    const { data: purchases, error: purchasesError } = await supabase
      .from('course_purchases')
      .select('creator_amount_cents, payment_status, paid_at')
      .eq('creator_id', creatorId)
      .eq('payment_status', 'paid');

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      throw purchasesError;
    }

    const totalEarnings = purchases?.reduce((sum, p) => sum + p.creator_amount_cents, 0) || 0;
    const totalSales = purchases?.length || 0;

    // Últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEarnings = purchases
      ?.filter(p => new Date(p.paid_at) >= thirtyDaysAgo)
      .reduce((sum, p) => sum + p.creator_amount_cents, 0) || 0;

    return new Response(
      JSON.stringify({
        success: true,
        hasAccount: true,
        accountStatus: creator.asaas_account_status,
        walletId: creator.asaas_wallet_id,
        totalEarningsCents: totalEarnings,
        totalEarningsFormatted: (totalEarnings / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        recentEarningsCents: recentEarnings,
        recentEarningsFormatted: (recentEarnings / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        totalSales,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in asaas-get-balance:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro interno do servidor',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
