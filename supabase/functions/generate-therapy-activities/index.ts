import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Sem autorização');
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // 2. Receber dados
    const { patientName, selectedDemands } = await req.json();
    
    console.log('📋 Gerando atividades para:', { patientName, selectedDemands });
    
    // 3. Buscar chave da API
    const geminiApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GOOGLE_AI_API_KEY não configurada');
    }

    // 4. Construir prompt especializado
    const demandsText = Object.entries(selectedDemands)
      .map(([disorder, demands]) => `${disorder}: ${(demands as string[]).join(', ')}`)
      .join('\n');
    
    const prompt = `Você é um especialista em Musicoterapia clínica com amplo conhecimento em transtornos do neurodesenvolvimento.

CONTEXTO DO PACIENTE:
- Nome: ${patientName}
- Demandas identificadas:
${demandsText}

TAREFA:
Crie EXATAMENTE 10 atividades musicoterapêuticas práticas e específicas, cada uma focada em uma das demandas identificadas.

FORMATO PARA CADA ATIVIDADE (responda em JSON válido):
{
  "activities": [
    {
      "id": "ativ-001",
      "disorder": "TEA" | "TDAH" | "TOD" | "DI",
      "demand": "nome exato da demanda",
      "specialty": "Musicoterapia",
      "generalObjective": "objetivo terapêutico amplo",
      "specificObjective": "comportamento esperado observável e mensurável",
      "activityDescription": "descrição detalhada da execução passo a passo",
      "materials": ["material1", "material2"],
      "estimatedTime": "20-30 minutos",
      "evaluationCriteria": ["critério1", "critério2"],
      "complexityLevel": "Leve" | "Moderado" | "Severo"
    }
  ]
}

IMPORTANTE:
- Retorne EXATAMENTE 10 atividades
- Use linguagem técnica mas clara
- Atividades devem ser práticas e executáveis
- Varie os níveis de complexidade
- Cada atividade deve ter ID único (ativ-001 até ativ-010)
- Responda APENAS com o JSON, sem texto adicional`;

    // 5. Chamar Google Gemini API
    console.log('🎵 Gerando atividades com Gemini API...');
    
    // Tentar múltiplos modelos e versões da API em ordem de preferência
    const apiVersions = ['v1', 'v1beta'];
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-flash-001'];

    let response: Response | undefined;
    let lastError: string | undefined;
    let success = false;

    for (const version of apiVersions) {
      for (const model of models) {
        try {
          console.log(`🔄 Tentando versão/modelo: ${version} / ${model}`);
          response = await fetch(
            `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': geminiApiKey,
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.8,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 8192,
                }
              })
            }
          );

          if (response.ok) {
            console.log(`✅ Sucesso com: ${version} / ${model}`);
            success = true;
            break;
          }

          const errorText = await response.text();
          lastError = `${version}/${model}: ${response.status} - ${errorText}`;
          console.warn(`⚠️ Falha ${version}/${model}:`, errorText);
        } catch (error: any) {
          lastError = `${version}/${model}: ${error.message}`;
          console.warn(`⚠️ Erro ao tentar ${version}/${model}:`, error.message);
        }
      }
      if (success) break;
    }

    if (!success || !response || !response.ok) {
      console.warn('⚠️ Tentativas com Google Gemini falharam. Tentando Lovable AI Gateway...');

      const lovableKey = Deno.env.get('LOVABLE_API_KEY');
      if (!lovableKey) {
        console.error('❌ LOVABLE_API_KEY ausente');
        throw new Error(`Erro na API Gemini. Verifique a chave e o acesso aos modelos. Último erro: ${lastError}`);
      }

      const gatewayResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'Você é um especialista em Musicoterapia clínica. Responda SEMPRE apenas com JSON válido conforme solicitado.' },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!gatewayResp.ok) {
        const t = await gatewayResp.text();
        console.error('❌ Erro Lovable AI Gateway:', gatewayResp.status, t);
        throw new Error(`Erro no Lovable AI Gateway: ${gatewayResp.status}`);
      }

      const gatewayJson = await gatewayResp.json();
      const content = gatewayJson.choices?.[0]?.message?.content ?? '';

      if (!content) {
        throw new Error('Resposta vazia do Lovable AI Gateway');
      }

      let cleaned = String(content).trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/```\n?/g, '');

      try {
        const parsed = JSON.parse(cleaned);
        if (!parsed.activities || !Array.isArray(parsed.activities) || parsed.activities.length !== 10) {
          throw new Error('Formato inválido retornado pelo gateway');
        }
        console.log('✅ 10 atividades geradas via Lovable AI Gateway');
        return new Response(
          JSON.stringify({ activities: parsed.activities }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('❌ Falha ao parsear resposta do gateway:', e);
        throw new Error('Falha ao interpretar resposta do gateway');
      }
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('Resposta vazia da IA');
    }

    console.log('📄 Resposta da IA recebida');

    // 6. Parse do JSON (remover markdown se houver)
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }
    
    const parsedData = JSON.parse(cleanedText);

    // 7. Validação
    if (!parsedData.activities || !Array.isArray(parsedData.activities)) {
      throw new Error('Formato de resposta inválido - activities não é um array');
    }

    if (parsedData.activities.length !== 10) {
      throw new Error(`IA retornou ${parsedData.activities.length} atividades ao invés de 10`);
    }

    console.log('✅ 10 atividades geradas com sucesso');

    return new Response(
      JSON.stringify({ activities: parsedData.activities }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Erro:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
