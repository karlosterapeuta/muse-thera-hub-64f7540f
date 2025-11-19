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
    const { patientName, selectedDemands, selectedSubDemands } = await req.json();
    
    console.log('📋 Gerando atividades para:', { patientName, selectedDemands, selectedSubDemands });

    // Extrair todas as subdemandas específicas selecionadas
    const specificDemands: string[] = [];

    // Iterar pelos transtornos (TEA, TDAH, TOD, DI)
    Object.entries(selectedSubDemands || {}).forEach(([disorder, categoryDemands]) => {
      // categoryDemands é um objeto como { "Comunicação e Linguagem": ["Ausência na fala", ...] }
      Object.entries(categoryDemands as Record<string, string[]>).forEach(([category, subDemands]) => {
        (subDemands as string[]).forEach(subDemand => {
          specificDemands.push(`${disorder} - ${category}: ${subDemand}`);
        });
      });
    });

    console.log('🎯 Demandas específicas selecionadas:', specificDemands);

    // Validar que existem demandas selecionadas
    if (specificDemands.length === 0) {
      throw new Error('Nenhuma demanda específica foi selecionada');
    }
    
    // 3. Buscar chave da API
    const geminiApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GOOGLE_AI_API_KEY não configurada');
    }

    // 4. Construir prompt especializado
    // Construir texto formatado das demandas específicas
    const demandsText = specificDemands
      .map((demand, index) => `${index + 1}. ${demand}`)
      .join('\n');

    const totalDemands = specificDemands.length;

    const prompt = `Você é um especialista em Musicoterapia clínica com amplo conhecimento em transtornos do neurodesenvolvimento.

CONTEXTO DO PACIENTE:
- Nome: ${patientName}
- Total de demandas específicas identificadas: ${totalDemands}
- Demandas selecionadas:
${demandsText}

TAREFA CRÍTICA:
Crie EXATAMENTE ${Math.min(10, totalDemands)} atividades musicoterapêuticas práticas e específicas.

⚠️ REGRA FUNDAMENTAL: Cada atividade deve focar em UMA e APENAS UMA das demandas específicas listadas acima.
⚠️ NÃO crie atividades genéricas ou para outras demandas não listadas.
⚠️ Use a numeração exata das demandas acima para referência.

${totalDemands < 10 ? `
OBSERVAÇÃO: Como apenas ${totalDemands} demandas foram selecionadas, crie ${totalDemands} atividades (uma para cada demanda).
` : `
OBSERVAÇÃO: Como mais de 10 demandas foram selecionadas, priorize as 10 primeiras da lista.
`}

FORMATO PARA CADA ATIVIDADE (responda em JSON válido):
{
  "activities": [
    {
      "id": "ativ-001",
      "disorder": "TEA" | "TDAH" | "TOD" | "DI",
      "demand": "nome EXATO da demanda conforme listado acima (incluindo transtorno e categoria)",
      "demandNumber": 1,
      "specialty": "Musicoterapia",
      "generalObjective": "objetivo terapêutico amplo focado ESPECIFICAMENTE nesta demanda",
      "specificObjective": "comportamento esperado observável e mensurável relacionado à demanda",
      "activityDescription": "descrição detalhada da execução passo a passo, adaptada para esta demanda específica",
      "materials": ["material1", "material2"],
      "estimatedTime": "20-30 minutos",
      "evaluationCriteria": ["critério1 específico para esta demanda", "critério2"],
      "complexityLevel": "Leve" | "Moderado" | "Severo"
    }
  ]
}

IMPORTANTE:
- Retorne EXATAMENTE ${Math.min(10, totalDemands)} atividades
- Cada atividade deve corresponder a UMA demanda específica da lista numerada
- Inclua o campo "demandNumber" com o número da demanda da lista (1, 2, 3, etc.)
- Use linguagem técnica mas clara
- Atividades devem ser práticas, executáveis e ESPECÍFICAS para a demanda indicada
- Varie os níveis de complexidade conforme apropriado para cada demanda
- Cada atividade deve ter ID único (ativ-001 até ativ-0${String(Math.min(10, totalDemands)).padStart(2, '0')})
- NÃO repita demandas - uma atividade por demanda
- Responda APENAS com o JSON, sem texto adicional`;

    const startTime = Date.now();
    console.log(`⏱️ [${new Date().toISOString()}] 🚀 Iniciando geração de atividades...`);

    // 5. ESTRATÉGIA OTIMIZADA: Tentar Lovable AI Gateway PRIMEIRO (rápido: 2-5s)
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (lovableKey) {
      try {
        console.log(`⏱️ [${new Date().toISOString()}] 🌐 Tentando Lovable AI Gateway...`);
        
        // Sem timeout para Lovable AI - deixar a API decidir
        const gatewayResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'Você é um especialista em Musicoterapia clínica. Responda SEMPRE apenas com JSON válido conforme solicitado, sem nenhum texto adicional antes ou depois.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        });

        if (gatewayResp.ok) {
          const gatewayJson = await gatewayResp.json();
          const content = gatewayJson.choices?.[0]?.message?.content ?? '';
          
          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`⏱️ [${new Date().toISOString()}] ⚡ Lovable AI respondeu em ${elapsedTime}s`);

          if (content) {
            // Limpeza do JSON
            let cleaned = String(content).trim();
            
            if (cleaned.includes('```')) {
              const jsonMatch = cleaned.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
              if (jsonMatch) {
                cleaned = jsonMatch[1];
              } else {
                cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
              }
            }
            
            const firstBrace = cleaned.indexOf('{');
            if (firstBrace > 0) {
              cleaned = cleaned.substring(firstBrace);
            }
            
            const lastBrace = cleaned.lastIndexOf('}');
            if (lastBrace !== -1 && lastBrace < cleaned.length - 1) {
              cleaned = cleaned.substring(0, lastBrace + 1);
            }

            const parsed = JSON.parse(cleaned);
            
            if (parsed.activities && Array.isArray(parsed.activities) && parsed.activities.length > 0) {
              console.log(`✅ ${parsed.activities.length} atividades geradas via Lovable AI em ${elapsedTime}s`);
              
              // Validar que cada atividade corresponde a uma demanda selecionada
              const expectedCount = Math.min(10, specificDemands.length);

              if (parsed.activities.length !== expectedCount) {
                console.warn(`⚠️ Esperado ${expectedCount} atividades, recebido ${parsed.activities.length}`);
              }

              // Log de correspondência (para debugging)
              parsed.activities.forEach((activity: any, index: number) => {
                console.log(`✓ Atividade ${index + 1}:`, {
                  id: activity.id,
                  demandNumber: activity.demandNumber,
                  demand: activity.demand?.substring(0, 50) + '...'
                });
              });
              
              return new Response(
                JSON.stringify({ activities: parsed.activities }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
        }
        
        console.warn(`⚠️ Lovable AI falhou ou retornou dados inválidos. Status: ${gatewayResp.status}`);
      } catch (error: any) {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.warn(`⚠️ [${new Date().toISOString()}] Erro no Lovable AI após ${elapsedTime}s:`, error.message);
      }
    }

    // 6. FALLBACK: Google Gemini API (lento: 5-10s)
    console.log(`⏱️ [${new Date().toISOString()}] 🐢 Tentando Google Gemini como fallback...`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout para Gemini
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiApiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4000,
            }
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google Gemini falhou: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        throw new Error('Resposta vazia do Google Gemini');
      }

      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️ [${new Date().toISOString()}] 🎵 Google Gemini respondeu em ${elapsedTime}s`);

      // Parse do JSON
      let cleanedText = generatedText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      const parsedData = JSON.parse(cleanedText);

      if (!parsedData.activities || !Array.isArray(parsedData.activities)) {
        throw new Error('Formato de resposta inválido - activities não é um array');
      }

      if (parsedData.activities.length === 0) {
        throw new Error('Nenhuma atividade retornada');
      }

      console.log(`✅ ${parsedData.activities.length} atividades geradas via Google Gemini em ${elapsedTime}s`);

      // Validar que cada atividade corresponde a uma demanda selecionada
      const expectedCount = Math.min(10, specificDemands.length);

      if (parsedData.activities.length !== expectedCount) {
        console.warn(`⚠️ Esperado ${expectedCount} atividades, recebido ${parsedData.activities.length}`);
      }

      // Log de correspondência (para debugging)
      parsedData.activities.forEach((activity: any, index: number) => {
        console.log(`✓ Atividade ${index + 1}:`, {
          id: activity.id,
          demandNumber: activity.demandNumber,
          demand: activity.demand?.substring(0, 50) + '...'
        });
      });

      return new Response(
        JSON.stringify({ activities: parsedData.activities }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error: any) {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.error(`❌ [${new Date().toISOString()}] Ambas APIs falharam após ${elapsedTime}s:`, error.message);
      throw new Error(`Erro ao gerar atividades: ${error.message}`);
    }

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
