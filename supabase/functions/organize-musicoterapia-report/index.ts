import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let reportData: any = {};

  try {
    const body = await req.json();
    reportData = body?.reportData || {};

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY nao configurada');
      return new Response(JSON.stringify({
        success: false,
        fallbackContent: reportData.fieldValues || {},
        error: 'AI_NOT_CONFIGURED',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const patientName = reportData.patientName || 'Nao informado';
    const patientAge = reportData.patientAge || 'Nao informado';
    const patientDiagnosis = reportData.patientDiagnosis || 'Nao informado';
    const professionalName = reportData.professionalName || 'Nao informado';
    const sessionDate = reportData.sessionDate || 'Nao informado';
    const fieldValuesJson = JSON.stringify(reportData.fieldValues || {}, null, 2);

    const systemPrompt =
      "Voce e um especialista em musicoterapia para TEA (Transtorno do Espectro Autista). " +
      "Sua tarefa e organizar e melhorar a redacao tecnica de um relatorio clinico. " +
      "REGRAS OBRIGATORIAS: " +
      "1. MANTENHA TODAS as chaves (campos) originais do objeto JSON recebido, sem remover nenhuma. " +
      "2. NAO invente informacoes novas; apenas melhore a redacao do conteudo existente. " +
      "3. Para campos que sao arrays, retorne arrays. Para campos de texto, retorne texto. " +
      "4. Mantenha valores numericos (escalas) exatamente como recebidos. " +
      "5. Retorne EXCLUSIVAMENTE um JSON valido com a mesma estrutura de chaves recebida, sem texto extra, sem markdown.";

    const userPrompt =
      "Dados do paciente: Nome: " + patientName + ", Idade: " + patientAge +
      ", Diagnostico: " + patientDiagnosis + ". " +
      "Profissional: " + professionalName + ". Data: " + sessionDate + ". " +
      "Campos do relatorio (JSON a ser organizado e devolvido com as mesmas chaves):\n" + fieldValuesJson;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro do AI Gateway:', response.status, errText);

      let error = 'SERVICE_UNAVAILABLE';
      if (response.status === 429) error = 'RATE_LIMITED';
      if (response.status === 402) error = 'CREDITS_EXHAUSTED';

      return new Response(JSON.stringify({
        success: false,
        fallbackContent: reportData.fieldValues || {},
        error,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content || '';

    let organizedContent;
    try {
      organizedContent = JSON.parse(generatedText.trim());
    } catch (_parseError) {
      console.warn('Falha ao parsear JSON da IA, usando fallback.');
      return new Response(JSON.stringify({
        success: false,
        fallbackContent: reportData.fieldValues || {},
        error: 'PARSE_FAILED',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Garantir que nenhum campo original seja perdido
    const merged = { ...(reportData.fieldValues || {}), ...organizedContent };

    return new Response(JSON.stringify({
      success: true,
      organizedContent: merged,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return new Response(JSON.stringify({
      success: false,
      fallbackContent: reportData.fieldValues || {},
      error: 'SERVICE_FAILED',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
