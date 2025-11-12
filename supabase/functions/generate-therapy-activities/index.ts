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
    
    // Tentar múltiplos modelos em ordem de preferência
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro'];
    let response;
    let lastError;
    
    for (const model of models) {
      try {
        console.log(`🔄 Tentando modelo: ${model}`);
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          console.log(`✅ Sucesso com modelo: ${model}`);
          break;
        }
        
        const errorText = await response.text();
        lastError = `${model}: ${response.status} - ${errorText}`;
        console.warn(`⚠️ Modelo ${model} falhou:`, errorText);
      } catch (error) {
        lastError = `${model}: ${error.message}`;
        console.warn(`⚠️ Erro ao tentar ${model}:`, error.message);
      }
    }

    if (!response || !response.ok) {
      console.error('❌ Todos os modelos falharam. Último erro:', lastError);
      throw new Error(`Erro na API Gemini. Verifique se a chave API está correta e tem acesso aos modelos Gemini. Último erro: ${lastError}`);
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
