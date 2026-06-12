import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData } = await req.json();
    
    const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleAIApiKey) {
      throw new Error('GOOGLE_AI_API_KEY não configurada');
    }

    const prompt = `
Você é um especialista em musicoterapia para TEA. 
Organize e estruture o seguinte relatório de musicoterapia.

DADOS DO RELATÓRIO:
- Paciente: ${reportData.patientName || 'Não informado'}
- Idade: ${reportData.patientAge || 'Não informado'}  
- Diagnóstico: ${reportData.patientDiagnosis || 'Não informado'}
- Profissional: ${reportData.professionalName || 'Não informado'}
- Data da Sessão: ${reportData.sessionDate || 'Não informado'}

CAMPOS PREENCHIDOS:
${JSON.stringify(reportData.fieldValues || {}, null, 2)}

INSTRUÇÕES:
1. Melhore a redação técnica.
2. CONSERVE TODAS AS INFORMAÇÕES do objeto "CAMPOS PREENCHIDOS".
3. Mantenha as mesmas chaves do JSON original.
4. Para escalas numéricas, mantenha o valor original.

Retorne um objeto JSON puro.
`;

    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${googleAIApiKey}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
          response_mime_type: "application/json",
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`Erro da API Google AI: \${response.status}\`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    let organizedContent;
    try {
      organizedContent = JSON.parse(generatedText.trim());
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError);
      organizedContent = reportData.fieldValues;
    }

    return new Response(JSON.stringify({ 
      success: true,
      organizedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});