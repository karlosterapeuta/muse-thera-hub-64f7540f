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

    // selectedSubDemands vem do frontend como: { "Categoria": ["subdemanda1", "subdemanda2"] }
    Object.entries(selectedSubDemands || {}).forEach(([category, subDemands]) => {
      // Verificar se subDemands é um array com elementos
      if (Array.isArray(subDemands) && subDemands.length > 0) {
        subDemands.forEach(subDemand => {
          // Tentar determinar o transtorno pela categoria ou usar "Geral"
          const disorder = determineDisorderFromCategory(category);
          specificDemands.push(`${disorder} - ${category}: ${subDemand}`);
        });
      }
    });

    // Função auxiliar para determinar transtorno pela categoria
    function determineDisorderFromCategory(category: string): string {
      // Categorias conhecidas por transtorno
      const teaCategories = ["Comunicação e Linguagem", "Interação Social", "Comportamento e Sensorial"];
      const tdahCategories = ["Atenção e Concentração", "Hiperatividade e Impulsividade", "Funções Executivas"];
      const todCategories = ["Controle de Raiva e Irritabilidade", "Comportamento Opositor", "Regulação Emocional"];
      const diCategories = ["Cognitivo e Aprendizagem", "Sensorial e Motor", "Autonomia e Vida Diária"];
      
      if (teaCategories.includes(category)) return "TEA";
      if (tdahCategories.includes(category)) return "TDAH";
      if (todCategories.includes(category)) return "TOD";
      if (diCategories.includes(category)) return "DI";
      
      // Se não identificar, usar os transtornos selecionados ou "Geral"
      const selectedDisorders = Object.keys(selectedDemands).filter(d => selectedDemands[d]?.length > 0);
      return selectedDisorders.length > 0 ? selectedDisorders[0] : "Geral";
    }

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
    const totalDemands = specificDemands.length;

    // SEMPRE gerar 10 atividades no total
    const TOTAL_ACTIVITIES = 10;

    // Calcular quantas atividades por demanda
    let activitiesPerDemand: number[];
    let demandsToUse: string[];

    if (totalDemands === 1) {
      // Se apenas 1 demanda: todas as 10 atividades para ela
      activitiesPerDemand = [10];
      demandsToUse = specificDemands;
    } else if (totalDemands <= 10) {
      // Se 2-10 demandas: dividir as 10 atividades entre elas
      const baseCount = Math.floor(TOTAL_ACTIVITIES / totalDemands);
      const remainder = TOTAL_ACTIVITIES % totalDemands;
      
      activitiesPerDemand = specificDemands.map((_, index) => 
        baseCount + (index < remainder ? 1 : 0)
      );
      demandsToUse = specificDemands;
    } else {
      // Se mais de 10 demandas: usar apenas as 10 primeiras (1 atividade cada)
      activitiesPerDemand = Array(10).fill(1);
      demandsToUse = specificDemands.slice(0, 10);
    }

    console.log('📊 Distribuição de atividades:', {
      totalDemands,
      demandsToUse: demandsToUse.length,
      activitiesPerDemand,
      totalActivities: activitiesPerDemand.reduce((sum, count) => sum + count, 0)
    });

    // Construir texto formatado das demandas específicas com distribuição
    const demandsText = demandsToUse
      .map((demand, index) => {
        const count = activitiesPerDemand[index];
        return `${index + 1}. ${demand} (${count} ${count === 1 ? 'atividade' : 'atividades'})`;
      })
      .join('\n');

    const prompt = `Você é um especialista em Musicoterapia clínica com amplo conhecimento em transtornos do neurodesenvolvimento.

CONTEXTO DO PACIENTE:
- Nome: ${patientName}
- Total de demandas específicas selecionadas: ${totalDemands}
- Demandas para gerar atividades: ${demandsToUse.length}

LISTA DE DEMANDAS E QUANTIDADE DE ATIVIDADES:
${demandsText}

TAREFA CRÍTICA:
Crie EXATAMENTE ${TOTAL_ACTIVITIES} atividades musicoterapêuticas práticas e específicas.

⚠️ REGRA FUNDAMENTAL DE DISTRIBUIÇÃO:
${demandsToUse.length === 1 ? `
- Como apenas 1 demanda foi selecionada, crie 10 atividades DIFERENTES focadas nesta mesma demanda
- Varie as técnicas, instrumentos, abordagens e objetivos específicos
- Cada atividade deve ser única e complementar às outras
` : `
- Respeite EXATAMENTE a quantidade de atividades indicada para cada demanda
- Demanda 1: ${activitiesPerDemand[0]} ${activitiesPerDemand[0] === 1 ? 'atividade' : 'atividades'}
${demandsToUse.length > 1 ? `- Demanda 2: ${activitiesPerDemand[1]} ${activitiesPerDemand[1] === 1 ? 'atividade' : 'atividades'}` : ''}
${demandsToUse.length > 2 ? `- Demanda 3: ${activitiesPerDemand[2]} ${activitiesPerDemand[2] === 1 ? 'atividade' : 'atividades'}` : ''}
${demandsToUse.length > 3 ? `- E assim por diante para todas as ${demandsToUse.length} demandas` : ''}
- Total: ${TOTAL_ACTIVITIES} atividades
`}

⚠️ IMPORTANTE:
- NÃO crie atividades genéricas ou para demandas não listadas
- Use a numeração exata das demandas acima para referência
- Cada atividade deve ter foco claro e específico

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

CHECKLIST FINAL:
✓ Total de ${TOTAL_ACTIVITIES} atividades
✓ Distribuição correta: ${activitiesPerDemand.join(' + ')} = ${TOTAL_ACTIVITIES}
✓ Cada atividade focada especificamente em sua demanda
✓ IDs sequenciais de ativ-001 até ativ-010
✓ Campo "demandNumber" preenchido corretamente
✓ Linguagem técnica mas clara
✓ Atividades práticas e executáveis

Responda APENAS com o JSON, sem texto adicional.`;

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
              
              // Validar que temos exatamente 10 atividades
              if (parsed.activities.length !== TOTAL_ACTIVITIES) {
                console.warn(`⚠️ Esperado ${TOTAL_ACTIVITIES} atividades, recebido ${parsed.activities.length}`);
              }

              // Validar distribuição por demanda
              const activitiesByDemand = new Map<number, number>();
              parsed.activities.forEach((activity: any) => {
                const demandNum = activity.demandNumber;
                activitiesByDemand.set(demandNum, (activitiesByDemand.get(demandNum) || 0) + 1);
              });

              console.log('📊 Atividades geradas por demanda:');
              demandsToUse.forEach((demand, index) => {
                const demandNum = index + 1;
                const expected = activitiesPerDemand[index];
                const actual = activitiesByDemand.get(demandNum) || 0;
                const status = expected === actual ? '✓' : '✗';
                console.log(`${status} Demanda ${demandNum}: ${actual}/${expected} atividades - ${demand.substring(0, 50)}...`);
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

      // Validar que temos exatamente 10 atividades
      if (parsedData.activities.length !== TOTAL_ACTIVITIES) {
        console.warn(`⚠️ Esperado ${TOTAL_ACTIVITIES} atividades, recebido ${parsedData.activities.length}`);
      }

      // Validar distribuição por demanda
      const activitiesByDemand = new Map<number, number>();
      parsedData.activities.forEach((activity: any) => {
        const demandNum = activity.demandNumber;
        activitiesByDemand.set(demandNum, (activitiesByDemand.get(demandNum) || 0) + 1);
      });

      console.log('📊 Atividades geradas por demanda:');
      demandsToUse.forEach((demand, index) => {
        const demandNum = index + 1;
        const expected = activitiesPerDemand[index];
        const actual = activitiesByDemand.get(demandNum) || 0;
        const status = expected === actual ? '✓' : '✗';
        console.log(`${status} Demanda ${demandNum}: ${actual}/${expected} atividades - ${demand.substring(0, 50)}...`);
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
