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
    const { 
      patientName, 
      sessionDate, 
      sessionNumber,
      positives = [], 
      challenges = [],
      familyGuidelines = []
    } = await req.json();

    console.log('📝 Gerando texto de devolutiva para:', patientName);
    console.log('✅ Aspectos Positivos:', positives.length);
    console.log('⚠️ Áreas de Atenção:', challenges.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Formatar positivos e desafios
    const positivesText = positives.length > 0 
      ? positives.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')
      : 'Nenhum aspecto positivo específico foi selecionado.';

    const challengesText = challenges.length > 0
      ? challenges.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')
      : 'Nenhuma área de atenção específica foi identificada.';

    const familyText = familyGuidelines.length > 0
      ? familyGuidelines.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')
      : 'Nenhuma orientação familiar específica foi selecionada.';

    const systemPrompt = `Você é um musicoterapeuta especialista em Transtorno do Espectro Autista (TEA), certificado pela WFMT (World Federation of Music Therapy).

Sua tarefa é criar um RELATÓRIO PROFISSIONAL em português brasileiro para a família de um paciente, baseado nas observações da sessão de musicoterapia.

DIRETRIZES:
- Use linguagem técnica quando apropriado (ex: "responsividade musical", "regulação sensorial através da música", "comunicação não-verbal musical")
- Seja empático e respeitoso ao abordar áreas de atenção
- Destaque conquistas de forma específica e técnica
- Forneça recomendações práticas e realizáveis
- Expanda as orientações familiares com contexto terapêutico`;

    const userPrompt = `DADOS DA SESSÃO:
Paciente: ${patientName}
Data: ${sessionDate}
Sessão: ${sessionNumber}

ASPECTOS POSITIVOS OBSERVADOS (Conquistas e Avanços):
${positivesText}

ÁREAS QUE NECESSITAM ATENÇÃO (Pontos para desenvolvimento):
${challengesText}

ORIENTAÇÕES SELECIONADAS PARA A FAMÍLIA:
${familyText}

---

Crie um relatório profissional estruturado em JSON com as seguintes seções:

{
  "synthesis": "Resumo executivo de 3-4 parágrafos sobre o desempenho geral do paciente na sessão, integrando aspectos positivos e áreas de atenção de forma equilibrada",
  "achievements": "Análise detalhada das conquistas em 3-4 parágrafos, usando linguagem técnica de musicoterapia para TEA. Descreva COMO as conquistas se manifestaram musicalmente",
  "attentionAreas": "Análise empática das áreas que necessitam atenção em 3-4 parágrafos, explicando o PORQUÊ são importantes e COMO podem ser trabalhadas",
  "recommendations": "Recomendações terapêuticas específicas em 3-4 parágrafos, incluindo estratégias musicais concretas",
  "familyGuidelines": "Orientações ampliadas para a família em 4-5 parágrafos, expandindo as orientações selecionadas com contexto, exemplos práticos e justificativas terapêuticas"
}

IMPORTANTE: 
- Cada seção deve ter 3-5 parágrafos bem desenvolvidos
- Use terminologia técnica quando apropriado
- Seja específico sobre técnicas musicoterapêuticas
- Mantenha tom profissional mas acolhedor
- RETORNE APENAS O JSON, sem markdown ou formatação extra`;

    console.log('🤖 Enviando para Lovable AI Gateway...');

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('❌ Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit excedido. Por favor, aguarde alguns instantes e tente novamente.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('❌ Insufficient credits');
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos à sua conta Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('❌ AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Resposta recebida da IA');

    const generatedText = data.choices[0].message.content;
    
    // Parse JSON response
    let parsedContent;
    try {
      // Remove markdown code blocks if present
      const cleanText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      parsedContent = JSON.parse(cleanText);
    } catch (e) {
      console.error('⚠️ Failed to parse JSON, returning raw text');
      parsedContent = {
        synthesis: generatedText,
        achievements: '',
        attentionAreas: '',
        recommendations: '',
        familyGuidelines: ''
      };
    }

    console.log('✅ Texto profissional gerado com sucesso');

    return new Response(
      JSON.stringify({ 
        content: parsedContent,
        metadata: {
          patientName,
          sessionDate,
          sessionNumber,
          positivesCount: positives.length,
          challengesCount: challenges.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in generate-devolutiva-text:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar texto',
        details: 'Verifique os logs para mais informações'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
