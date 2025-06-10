
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  reportType: string;
  keyPoints: string;
  patientName: string;
  evaluationDate?: string;
}

const getPromptForReportType = (reportType: string, keyPoints: string, patientName: string) => {
  const baseContext = `Você é um musicoterapeuta experiente criando um relatório profissional para o paciente ${patientName}. Use linguagem técnica apropriada, seja objetivo e mantenha um tom profissional.`;
  
  const prompts = {
    individual_session: `${baseContext}

Crie um relatório de sessão individual de musicoterapia com base nestes pontos principais: ${keyPoints}

Estruture o conteúdo nos seguintes campos:
- objectives: Objetivos terapêuticos específicos da sessão (lista detalhada)
- activities: Atividades musicoterapêuticas realizadas (técnicas, instrumentos, abordagens)
- patient_response: Resposta e engajamento do paciente (comportamentos observados)
- observations: Observações clínicas importantes (progressos, dificuldades)
- next_steps: Planejamento para próximas sessões (continuidade terapêutica)

Retorne apenas um JSON válido com estes campos, sem explicações adicionais.`,

    monthly_evolution: `${baseContext}

Crie um relatório de evolução mensal de musicoterapia com base nestes pontos principais: ${keyPoints}

Estruture o conteúdo nos seguintes campos:
- therapeutic_objectives: Objetivos trabalhados no período (metas estabelecidas)
- achievements: Conquistas e progressos observados (desenvolvimentos positivos)
- challenges: Desafios e dificuldades encontradas (áreas de atenção)
- adjustments: Ajustes necessários no plano terapêutico (modificações propostas)
- next_steps: Próximos passos e objetivos (planejamento futuro)

Retorne apenas um JSON válido com estes campos, sem explicações adicionais.`,

    daily_evolution: `${baseContext}

Crie um relatório de evolução diária de musicoterapia com base nestes pontos principais: ${keyPoints}

Estruture o conteúdo nos seguintes campos:
- initial_state: Estado inicial do paciente (humor, disposição, condições)
- activities: Atividades realizadas (intervenções específicas)
- responses: Respostas observadas (reações e comportamentos)
- observations: Observações importantes (aspectos relevantes da sessão)

Retorne apenas um JSON válido com estes campos, sem explicações adicionais.`,

    semester_evolution: `${baseContext}

Crie um relatório de evolução semestral de musicoterapia com base nestes pontos principais: ${keyPoints}

Estruture o conteúdo nos seguintes campos:
- initial_evaluation: Avaliação inicial do período (estado de partida)
- therapeutic_process: Processo terapêutico desenvolvido (metodologias aplicadas)
- evolution_areas: Áreas de evolução observadas (progressos significativos)
- family_involvement: Envolvimento familiar (participação e apoio)
- conclusions: Conclusões do período (análise geral)
- recommendations: Recomendações futuras (direcionamentos terapêuticos)

Retorne apenas um JSON válido com estes campos, sem explicações adicionais.`,

    therapeutic_discharge: `${baseContext}

Crie um relatório de alta terapêutica de musicoterapia com base nestes pontos principais: ${keyPoints}

Estruture o conteúdo nos seguintes campos:
- treatment_summary: Resumo do tratamento (histórico terapêutico)
- achieved_goals: Objetivos alcançados (metas atingidas)
- recommendations: Recomendações pós-alta (continuidade e cuidados)

Retorne apenas um JSON válido com estes campos, sem explicações adicionais.`,

    group_session: `${baseContext}

Crie um relatório de sessão em grupo de musicoterapia com base nestes pontos principais: ${keyPoints}

Estruture o conteúdo nos seguintes campos:
- participants: Participantes da sessão (membros do grupo)
- theme: Tema trabalhado (foco terapêutico)
- group_dynamics: Dinâmica do grupo (interações observadas)
- activities: Atividades realizadas (intervenções grupais)
- group_response: Resposta do grupo (engajamento coletivo)
- observations: Observações importantes (aspectos relevantes)

Retorne apenas um JSON válido com estes campos, sem explicações adicionais.`
  };

  return prompts[reportType as keyof typeof prompts] || prompts.individual_session;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reportType, keyPoints, patientName, evaluationDate } = await req.json() as ReportRequest;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const prompt = getPromptForReportType(reportType, keyPoints, patientName);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Gemini: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Resposta inválida da API do Gemini');
    }

    // Tentar extrair JSON da resposta
    let content;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON não encontrado na resposta');
      }
    } catch (e) {
      // Fallback: criar estrutura básica se não conseguir parsear
      content = {
        generated_content: generatedText
      };
    }

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro na geração do relatório:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
