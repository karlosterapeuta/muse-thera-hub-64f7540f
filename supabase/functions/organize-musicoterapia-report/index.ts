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
1. Organize as informações de forma lógica e profissional.
2. Melhore a redação mantendo o conteúdo técnico e especializado.
3. CONSERVE E INCORPORE TODAS AS INFORMAÇÕES PRESENTES NO OBJETO "CAMPOS PREENCHIDOS", inclusive campos adicionais, escalas e seleções.
4. Conecte as diferentes seções de forma coerente, garantindo que o texto flua naturalmente.
5. Foque na evolução terapêutica através da música, evidenciando os ganhos clínicos.
6. Se houver informações ricas em campos específicos (como 'vocalizations_observed', 'behavioral_changes', etc.), elas devem ser integradas na seção de evolução ou atividades correspondente.
7. Para escalas numéricas (scores de 1 a 10), mencione os domínios avaliados e as pontuações no texto da evolução para dar embasamento técnico.

Retorne um objeto JSON com os campos organizados e melhorados.
IMPORTANTE: responda SOMENTE com JSON puro (sem comentários, sem Markdown, sem ```).
O JSON deve conter exatamente os mesmos campos recebidos em "CAMPOS PREENCHIDOS", mas com os textos (especialmente os campos de texto longo) aprimorados e organizados.
NÃO remova nenhum campo do objeto original. Se o campo for uma escala numérica, mantenha o valor numérico original.
As chaves do JSON de retorno devem mapear diretamente para as chaves recebidas.

Exemplo de mapeamento esperado para campos de texto:
{
  "therapeutic_objectives": "texto organizado...",
  "session_activities": "texto organizado...", 
  "patient_evolution": "texto organizado...",
  "recommendations": "texto organizado...",
  "conclusion": "texto organizado...",
  "..." : "outros campos originais mantidos"
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
          temperature: 0.2,
          maxOutputTokens: 4096,
          response_mime_type: "application/json",
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

    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
      console.warn('Resposta da IA truncada por limite de tokens (MAX_TOKENS).');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Texto gerado:', generatedText);

    // Tentar extrair JSON da resposta (robusto e tolerante a markdown)
    let organizedContent;
    try {
      let text = generatedText.trim();

      // Remover cercas de código ```json ... ``` se existirem
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fenced) {
        text = fenced[1];
      } else {
        // Strip defensivo de marcas residuais
        text = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
      }

      // Extrair bloco entre primeira { e última }
      if (!text.startsWith('{')) {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          text = text.slice(start, end + 1);
        }
      }

      organizedContent = JSON.parse(text);
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', parseError, 'Resposta bruta:', generatedText);
      // Fallback: estrutura clara e neutra (sem texto bruto desorganizado)
      organizedContent = {
        therapeutic_objectives: 'Objetivos organizados com IA — revise e ajuste conforme necessário.',
        session_activities: 'Atividades da sessão organizadas — inclua detalhes específicos observados.',
        patient_evolution: 'Síntese da evolução musical e comportamental observada.',
        recommendations: 'Recomendações terapêuticas para continuidade do plano.',
        conclusion: 'Conclusão técnica com foco na evolução e próximos passos.'
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