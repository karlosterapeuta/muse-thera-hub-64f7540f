import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData } = await req.json();
    
    const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleAIApiKey) {
      throw new Error('GOOGLE_AI_API_KEY não configurada');
    }

    // Construir prompt para organizar o relatório de musicoterapia
    const prompt = `
Você é um especialista em musicoterapia para TEA (Transtorno do Espectro Autista). 
Organize e estruture o seguinte relatório de musicoterapia de forma profissional e coerente.

DADOS DO RELATÓRIO:
- Paciente: ${reportData.patientName || 'Não informado'}
- Idade: ${reportData.patientAge || 'Não informado'}  
- Diagnóstico: ${reportData.patientDiagnosis || 'Não informado'}
- Profissional: ${reportData.professionalName || 'Não informado'}
- Data da Sessão: ${reportData.sessionDate || 'Não informado'}

CAMPOS PREENCHIDOS:
${JSON.stringify(reportData.fieldValues || {}, null, 2)}

INSTRUÇÕES:
1. Organize as informações de forma lógica e profissional
2. Melhore a redação mantendo o conteúdo técnico
3. Conecte as diferentes seções de forma coerente
4. Mantenha a linguagem científica e especializada
5. Garanta que o texto flua naturalmente
6. Foque na evolução terapêutica através da música

Retorne um objeto JSON com os campos organizados e melhorados:
{
  "therapeutic_objectives": "texto organizado dos objetivos",
  "session_activities": "texto organizado das atividades", 
  "patient_evolution": "texto organizado da evolução",
  "recommendations": "texto organizado das recomendações",
  "conclusion": "texto organizado da conclusão"
}
`;

    console.log('Enviando prompt para Google AI:', prompt.substring(0, 200) + '...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleAIApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API Google AI:', errorText);
      throw new Error(`Erro da API Google AI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Resposta da Google AI:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API Google AI');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Texto gerado:', generatedText);

    // Tentar extrair JSON da resposta
    let organizedContent;
    try {
      // Remover markdown se presente
      const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) || generatedText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : generatedText;
      organizedContent = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError);
      // Fallback: criar estrutura básica
      organizedContent = {
        therapeutic_objectives: "Conteúdo organizado com IA - verifique e ajuste conforme necessário",
        session_activities: generatedText.substring(0, 500) + "...",
        patient_evolution: "Evolução observada durante as sessões de musicoterapia",
        recommendations: "Recomendações para continuidade do tratamento",
        conclusion: "Síntese dos resultados obtidos através da musicoterapia"
      };
    }

    return new Response(JSON.stringify({ 
      success: true,
      organizedContent,
      originalResponse: generatedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na organização com IA:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      fallbackContent: {
        therapeutic_objectives: "Objetivos terapêuticos estruturados - revisar e complementar",
        session_activities: "Atividades de musicoterapia realizadas durante a sessão", 
        patient_evolution: "Evolução observada no paciente através da musicoterapia",
        recommendations: "Recomendações para continuidade e aprofundamento do tratamento",
        conclusion: "A musicoterapia demonstra ser uma ferramenta eficaz para o desenvolvimento do paciente"
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});