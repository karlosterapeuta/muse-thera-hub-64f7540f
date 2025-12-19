import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateSubaccountRequest {
  creatorId: string;
  cpfCnpj: string;
  birthDate?: string;
  companyType?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
  postalCode?: string;
}

serve(async (req) => {
  // Handle CORS preflight
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

    const body: CreateSubaccountRequest = await req.json();
    console.log('Creating subaccount for creator:', body.creatorId);

    // Buscar dados do criador
    const { data: creator, error: creatorError } = await supabase
      .from('course_creators')
      .select('*')
      .eq('id', body.creatorId)
      .single();

    if (creatorError || !creator) {
      console.error('Creator not found:', creatorError);
      throw new Error('Criador não encontrado');
    }

    // Verificar se já tem subconta
    if (creator.asaas_wallet_id) {
      console.log('Creator already has Asaas account:', creator.asaas_wallet_id);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Subconta já existe',
          walletId: creator.asaas_wallet_id,
          status: creator.asaas_account_status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar subconta no Asaas
    const accountPayload = {
      name: creator.name,
      email: creator.email,
      cpfCnpj: body.cpfCnpj.replace(/\D/g, ''),
      birthDate: body.birthDate,
      companyType: body.companyType || 'MEI',
      phone: body.phone || creator.phone,
      mobilePhone: body.mobilePhone || creator.phone,
      address: body.address || 'Não informado',
      addressNumber: body.addressNumber || 'S/N',
      province: body.province || 'Centro',
      postalCode: body.postalCode || '00000000',
    };

    console.log('Creating Asaas account with payload:', JSON.stringify(accountPayload));

    const asaasResponse = await fetch(`${ASAAS_BASE_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(accountPayload),
    });

    const asaasResult = await asaasResponse.json();
    console.log('Asaas response:', JSON.stringify(asaasResult));

    if (!asaasResponse.ok) {
      console.error('Asaas error:', asaasResult);
      throw new Error(asaasResult.errors?.[0]?.description || 'Erro ao criar subconta no Asaas');
    }

    // Atualizar criador com dados do Asaas
    const { error: updateError } = await supabase
      .from('course_creators')
      .update({
        asaas_customer_id: asaasResult.id,
        asaas_wallet_id: asaasResult.walletId,
        asaas_account_status: 'active',
        cpf_cnpj: body.cpfCnpj,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.creatorId);

    if (updateError) {
      console.error('Error updating creator:', updateError);
      throw new Error('Erro ao atualizar dados do criador');
    }

    console.log('Subaccount created successfully:', asaasResult.walletId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subconta criada com sucesso',
        walletId: asaasResult.walletId,
        accountId: asaasResult.id,
        apiKey: asaasResult.apiKey,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in asaas-create-subaccount:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
