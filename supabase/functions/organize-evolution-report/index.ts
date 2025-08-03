
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
    
    const googleAIApiKey = 'AIzaSyB3Z2qvtj8kxfo9rqnvXfwL0M_a3PY5iVA';

    // Construir prompt para organizar o relatório de evolução
    const prompt = `
Você é um especialista em musicoterapia para TEA (Transtorno do Espectro Autista). 
Organize e estruture o seguinte relatório de evolução em musicoterapia de forma profissional e coerente.

DADOS DO RELATÓRIO:
- Paciente: ${reportData.patientName || 'Não informado'}
- Data da Sessão: ${reportData.sessionDate || 'Não informado'}

CAMPOS PREENCHIDOS:
${JSON.stringify(reportData.formData || {}, null, 2)}

INSTRUÇÕES:
1. Organize as informações de forma lógica e profissional
2. Melhore a redação mantendo o conteúdo técnico específico da musicoterapia
3. Conecte as diferentes seções de forma coerente
4. Mantenha a linguagem científica e especializada em musicoterapia
5. Garanta que o texto flua naturalmente entre as seções
6. Foque na evolução terapêutica através da música e instrumentos musicais
7. Use terminologia específica da musicoterapia quando apropriado

Retorne um objeto JSON com os campos organizados e melhorados:
{
  "arrival_state": "texto organizado do estado de chegada",
  "resources_used": "texto organizado dos recursos utilizados", 
  "session_development": "texto organizado do desenvolvimento da sessão",
  "patient_response": "texto organizado da resposta do paciente",
  "session_exit": "texto organizado do estado de saída",
  "observations": "texto organizado das observações gerais"
}
`;

    console.log('Enviando prompt para Google AI...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleAIApiKey}`, {
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
        arrival_state: "Estado de chegada organizado com IA - verifique e ajuste conforme necessário",
        resources_used: "Recursos musicoterapêuticos utilizados durante a sessão",
        session_development: "Desenvolvimento da sessão de musicoterapia",
        patient_response: "Resposta e participação do paciente",
        session_exit: "Estado de saída e encerramento da sessão", 
        observations: "Observações gerais sobre a evolução musicoterapêutica"
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
        arrival_state: "Estado de chegada - revisar e complementar com observações específicas",
        resources_used: "Recursos e instrumentos de musicoterapia utilizados na sessão", 
        session_development: "Desenvolvimento e atividades realizadas durante a sessão",
        patient_response: "Resposta, participação e engajamento do paciente",
        session_exit: "Estado de saída e conclusão da sessão de musicoterapia",
        observations: "A musicoterapia demonstra ser uma ferramenta eficaz para o desenvolvimento do paciente"
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
