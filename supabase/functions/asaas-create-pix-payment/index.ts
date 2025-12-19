import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePixPaymentRequest {
  courseId: string;
  userId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerCpfCnpj?: string;
}

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
    const body: CreatePixPaymentRequest = await req.json();

    console.log('Creating PIX payment for course:', body.courseId, 'user:', body.userId);

    // Buscar curso
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*, course_creators(*)')
      .eq('id', body.courseId)
      .single();

    if (courseError || !course) {
      console.error('Course not found:', courseError);
      throw new Error('Curso não encontrado');
    }

    // Se curso é gratuito, liberar acesso direto
    if (!course.price_cents || course.price_cents === 0) {
      const { error: accessError } = await supabase
        .from('course_access')
        .insert({
          course_id: body.courseId,
          user_id: body.userId,
          is_active: true,
        });

      if (accessError) {
        console.error('Error granting access:', accessError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          isFree: true,
          message: 'Acesso liberado - curso gratuito',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const creator = course.course_creators;
    const amountCents = course.price_cents;
    const amountReais = amountCents / 100;
    const commissionPercentage = creator?.commission_percentage || 70;
    const creatorAmountCents = Math.floor(amountCents * commissionPercentage / 100);
    const platformAmountCents = amountCents - creatorAmountCents;

    // Verificar compra pendente existente
    const { data: existingPurchase } = await supabase
      .from('course_purchases')
      .select('*')
      .eq('course_id', body.courseId)
      .eq('user_id', body.userId)
      .eq('payment_status', 'pending')
      .gte('pix_expiration', new Date().toISOString())
      .maybeSingle();

    if (existingPurchase?.asaas_pix_qr_code) {
      console.log('Returning existing pending purchase:', existingPurchase.id);
      return new Response(
        JSON.stringify({
          success: true,
          purchase: existingPurchase,
          pixCode: existingPurchase.asaas_pix_copy_paste,
          pixQrCode: existingPurchase.asaas_pix_qr_code,
          expiresAt: existingPurchase.pix_expiration,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar ou buscar cliente no Asaas
    let customerId: string;
    const customerEmail = body.buyerEmail || `user_${body.userId}@temp.com`;
    const customerName = body.buyerName || 'Cliente';

    // Buscar cliente existente por email
    const searchResponse = await fetch(
      `${ASAAS_BASE_URL}/customers?email=${encodeURIComponent(customerEmail)}`,
      {
        headers: { 'access_token': ASAAS_API_KEY },
      }
    );
    const searchResult = await searchResponse.json();

    if (searchResult.data && searchResult.data.length > 0) {
      customerId = searchResult.data[0].id;
      console.log('Found existing customer:', customerId);
      
      // Atualizar cliente existente com CPF se não tiver
      const existingCustomer = searchResult.data[0];
      if (!existingCustomer.cpfCnpj && body.buyerCpfCnpj) {
        console.log('Updating existing customer with CPF');
        const updateResponse = await fetch(`${ASAAS_BASE_URL}/customers/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
          },
          body: JSON.stringify({
            cpfCnpj: body.buyerCpfCnpj.replace(/\D/g, ''),
            name: body.buyerName || existingCustomer.name,
          }),
        });
        
        if (!updateResponse.ok) {
          const updateError = await updateResponse.json();
          console.error('Error updating customer:', updateError);
          throw new Error(updateError.errors?.[0]?.description || 'Erro ao atualizar cliente com CPF');
        }
        console.log('Customer updated with CPF');
      }
    } else {
      // Criar novo cliente
      const cpfCnpj = body.buyerCpfCnpj?.replace(/\D/g, '');
      if (!cpfCnpj) {
        throw new Error('CPF é obrigatório para pagamento PIX');
      }
      
      const customerPayload = {
        name: customerName,
        email: customerEmail,
        cpfCnpj: cpfCnpj,
      };

      const createCustomerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_API_KEY,
        },
        body: JSON.stringify(customerPayload),
      });

      const customerResult = await createCustomerResponse.json();
      
      if (!createCustomerResponse.ok) {
        console.error('Error creating customer:', customerResult);
        throw new Error(customerResult.errors?.[0]?.description || 'Erro ao criar cliente');
      }

      customerId = customerResult.id;
      console.log('Created new customer:', customerId);
    }

    // Calcular data de vencimento (24 horas)
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + 24);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Criar cobrança PIX com split
    const paymentPayload: any = {
      customer: customerId,
      billingType: 'PIX',
      value: amountReais,
      dueDate: dueDateStr,
      description: `Curso: ${course.title}`,
      externalReference: `course_${body.courseId}_user_${body.userId}_${Date.now()}`,
    };

    // Adicionar split se criador tem wallet
    if (creator?.asaas_wallet_id) {
      paymentPayload.split = [
        {
          walletId: creator.asaas_wallet_id,
          percentualValue: commissionPercentage,
        },
      ];
      console.log('Adding split:', commissionPercentage, '% to wallet:', creator.asaas_wallet_id);
    }

    console.log('Creating payment:', JSON.stringify(paymentPayload));

    const paymentResponse = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('Error creating payment:', paymentResult);
      throw new Error(paymentResult.errors?.[0]?.description || 'Erro ao criar cobrança');
    }

    console.log('Payment created:', paymentResult.id);

    // Buscar QR Code PIX
    const qrCodeResponse = await fetch(
      `${ASAAS_BASE_URL}/payments/${paymentResult.id}/pixQrCode`,
      {
        headers: { 'access_token': ASAAS_API_KEY },
      }
    );

    const qrCodeResult = await qrCodeResponse.json();

    if (!qrCodeResponse.ok) {
      console.error('Error getting QR code:', qrCodeResult);
      throw new Error('Erro ao gerar QR Code PIX');
    }

    console.log('QR Code generated successfully');

    // Criar registro de compra
    const pixExpiration = new Date();
    pixExpiration.setHours(pixExpiration.getHours() + 24);

    const { data: purchase, error: purchaseError } = await supabase
      .from('course_purchases')
      .insert({
        course_id: body.courseId,
        user_id: body.userId,
        creator_id: creator?.id,
        amount_cents: amountCents,
        creator_amount_cents: creatorAmountCents,
        platform_amount_cents: platformAmountCents,
        payment_method: 'pix',
        payment_status: 'pending',
        buyer_name: customerName,
        buyer_email: customerEmail,
        asaas_payment_id: paymentResult.id,
        asaas_pix_qr_code: qrCodeResult.encodedImage,
        asaas_pix_copy_paste: qrCodeResult.payload,
        pix_expiration: pixExpiration.toISOString(),
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError);
      throw new Error('Erro ao registrar compra');
    }

    console.log('Purchase created:', purchase.id);

    return new Response(
      JSON.stringify({
        success: true,
        purchase,
        pixCode: qrCodeResult.payload,
        pixQrCode: qrCodeResult.encodedImage,
        expiresAt: pixExpiration.toISOString(),
        asaasPaymentId: paymentResult.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in asaas-create-pix-payment:', error);
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
