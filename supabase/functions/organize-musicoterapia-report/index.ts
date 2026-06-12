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
      throw new Error('GOOGLE_AI_API_KEY nao configurada');
    }

    const prompt = \`
Voce e um especialista em musicoterapia para TEA. 
Organize e estruture o seguinte relatorio de musicoterapia.

DADOS DO RELATORIO:
- Paciente: \${reportData.patientName || 'Nao informado'}
- Idade: \${reportData.patientAge || 'Nao informado'}  
- Diagnostico: \${reportData.patientDiagnosis || 'Nao informado'}
- Profissional: \${reportData.professionalName || 'Nao informado'}
- Data da Sessao: \${reportData.sessionDate || 'Nao informado'}

CAMPOS PREENCHIDOS:
\${JSON.stringify(reportData.fieldValues || {}, null, 2)}

INSTRUCOES:
1. Melhore a redacao tecnica.
2. CONSERVE TODAS AS INFORMACOES do objeto "CAMPOS PREENCHIDOS".
3. Mantenha as mesmas chaves do JSON original.
4. Para escalas numericas, mantenha o valor original.

Retorne um objeto JSON puro.
\`;

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
