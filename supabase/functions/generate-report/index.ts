
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

const getEnhancedPromptForReportType = (reportType: string, keyPoints: string, patientName: string, evaluationDate?: string) => {
  const baseContext = `Você é um musicoterapeuta experiente e especializado criando um relatório profissional detalhado para o paciente ${patientName}${evaluationDate ? ` em ${evaluationDate}` : ''}. 

INSTRUÇÕES IMPORTANTES:
- Use linguagem técnica em musicoterapia, mas clara e objetiva
- Seja específico e detalhado em cada campo
- Mantenha um tom profissional e empático
- Base-se nas informações fornecidas mas expanda com conhecimento técnico apropriado
- Cada campo deve ter pelo menos 2-3 parágrafos bem estruturados
- Use terminologia técnica de musicoterapia quando apropriado`;
  
  const prompts = {
    individual_session: `${baseContext}

Crie um relatório completo de sessão individual de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos detalhados:

- objectives: Objetivos terapêuticos específicos da sessão (liste 3-5 objetivos detalhados com justificativas técnicas musicoterapêuticas)

- activities: Atividades musicoterapêuticas realizadas (descreva detalhadamente as técnicas utilizadas, instrumentos, metodologia aplicada, duração e sequência das atividades)

- patient_response: Resposta e engajamento do paciente (analise comportamentos observados, níveis de participação, respostas emocionais, interação com instrumentos, comunicação verbal e não-verbal)

- observations: Observações clínicas importantes (progressos técnicos, dificuldades identificadas, insights terapêuticos, aspectos relacionais, preferências musicais observadas)

- next_steps: Planejamento para próximas sessões (estratégias de continuidade, objetivos a serem trabalhados, adaptações necessárias, recomendações específicas)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto estruturado e profissional de pelo menos 150-200 palavras.`,

    monthly_evolution: `${baseContext}

Crie um relatório abrangente de evolução mensal de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos detalhados:

- therapeutic_objectives: Objetivos trabalhados no período (detalhe as metas estabelecidas, metodologia aplicada, cronograma de trabalho e critérios de avaliação)

- achievements: Conquistas e progressos observados (documente desenvolvimentos específicos em diferentes áreas: comunicação, socialização, aspectos motores, expressão emocional, competências musicais)

- challenges: Desafios e dificuldades encontradas (identifique áreas que necessitam atenção especial, fatores limitantes, estratégias de superação implementadas)

- adjustments: Ajustes necessários no plano terapêutico (modificações metodológicas, adaptações de objetivos, mudanças de estratégia, personalização de abordagens)

- next_steps: Próximos passos e objetivos (planejamento para o próximo período, metas específicas, estratégias de continuidade, envolvimento familiar)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto detalhado e técnico de pelo menos 150-200 palavras.`,

    daily_evolution: `${baseContext}

Crie um relatório detalhado de evolução diária de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos detalhados:

- initial_state: Estado inicial do paciente (descreva humor, disposição física e emocional, comunicação, fatores ambientais que podem ter influenciado o estado inicial)

- activities: Atividades realizadas (detalhe a estrutura da sessão, técnicas musicoterapêuticas aplicadas, instrumentos utilizados, metodologia específica, duração e sequência)

- responses: Respostas observadas (analise reações emocionais, comportamentais, comunicativas, motoras, níveis de engajamento, preferências demonstradas)

- observations: Observações importantes (insights clínicos, progressos pontuais, dificuldades observadas, aspectos relacionais, elementos facilitadores ou dificultadores)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto estruturado e profissional de pelo menos 120-150 palavras.`,

    semester_evolution: `${baseContext}

Crie um relatório completo de evolução semestral de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos detalhados:

- initial_evaluation: Avaliação inicial do período (contexto de início, diagnóstico, demandas identificadas, recursos e potencialidades, linha de base estabelecida)

- therapeutic_process: Processo terapêutico desenvolvido (metodologia aplicada, técnicas principais, evolução do plano, marcos significativos, integração interdisciplinar)

- evolution_areas: Áreas de evolução observadas (comunicação, aspectos socioemocionais, habilidades cognitivas, competências musicais, autonomia)

- family_involvement: Envolvimento familiar (participação dos cuidadores, orientações fornecidas, resultados do envolvimento, desafios e superações)

- conclusions: Conclusões do período (análise geral, objetivos alcançados, impacto do processo, fatores de sucesso, aprendizados clínicos)

- recommendations: Recomendações futuras (continuidade, estratégias, orientações específicas, articulação interdisciplinar, perspectivas)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto abrangente e técnico de pelo menos 200-250 palavras.`,

    therapeutic_discharge: `${baseContext}

Crie um relatório completo de alta terapêutica de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos detalhados:

- treatment_summary: Resumo do tratamento (período de acompanhamento, contexto inicial, metodologia empregada, evolução cronológica detalhada do processo)

- achieved_goals: Objetivos alcançados (metas atingidas integralmente, conquistas específicas documentadas por área de desenvolvimento, competências consolidadas)

- recommendations: Recomendações pós-alta (orientações para manutenção, atividades recomendadas, estratégias de generalização, recursos comunitários, sinais de alerta, disponibilidade para seguimento)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto detalhado e profissional de pelo menos 250-300 palavras.`,

    group_session: `${baseContext}

Crie um relatório completo de sessão em grupo de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos detalhados:

- participants: Participantes da sessão (composição do grupo, presença e participação, características individuais relevantes, interações iniciais)

- theme: Tema trabalhado (foco terapêutico principal, objetivos específicos da sessão, metodologia temática aplicada)

- group_dynamics: Dinâmica do grupo (clima grupal observado, padrões de interação, liderança e papéis, momentos significativos, desafios grupais)

- activities: Atividades realizadas (estrutura da sessão grupal, técnicas musicoterapêuticas grupais, instrumentos e recursos utilizados)

- group_response: Resposta do grupo (participação coletiva, expressão musical grupal, comunicação e interação, clima emocional, evolução durante a sessão)

- observations: Observações importantes (progressos grupais, destaques individuais, aspectos técnicos, impacto terapêutico, recomendações, orientações)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto estruturado e técnico de pelo menos 150-200 palavras.`
  };

  return prompts[reportType as keyof typeof prompts] || prompts.individual_session;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reportType, keyPoints, patientName, evaluationDate } = await req.json() as ReportRequest;

    console.log('Received request:', { reportType, patientName, evaluationDate, keyPointsLength: keyPoints?.length });

    // Validar entrada
    if (!reportType || !keyPoints || !patientName) {
      throw new Error('Parâmetros obrigatórios ausentes');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY não encontrada nas variáveis de ambiente');
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const prompt = getEnhancedPromptForReportType(reportType, keyPoints, patientName, evaluationDate);

    console.log('Calling Gemini API with enhanced prompt...');

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
          maxOutputTokens: 4096, // Increased for more detailed content
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error ${response.status}:`, errorText);
      throw new Error(`Erro na API do Gemini: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini API response received');

    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('Resposta vazia da API do Gemini');
      throw new Error('Resposta inválida da API do Gemini');
    }

    // Tentar extrair JSON da resposta com múltiplas estratégias
    let content;
    try {
      // Estratégia 1: Tentar parsear diretamente
      content = JSON.parse(generatedText);
    } catch (e1) {
      try {
        // Estratégia 2: Procurar por JSON entre ```json e ```
        const jsonCodeBlockMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonCodeBlockMatch) {
          content = JSON.parse(jsonCodeBlockMatch[1]);
        } else {
          // Estratégia 3: Procurar por objeto JSON na resposta
          const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            content = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('JSON não encontrado na resposta');
          }
        }
      } catch (e2) {
        console.error('Erro ao parsear JSON:', e2);
        console.log('Texto gerado:', generatedText.substring(0, 500));
        
        // Fallback: criar estrutura básica com o texto gerado
        content = {
          generated_content: generatedText,
          note: "Conteúdo gerado pela IA mas não estruturado em JSON. Revise e reorganize conforme necessário."
        };
      }
    }

    console.log('Successfully processed AI response');

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
      JSON.stringify({ 
        error: error.message,
        details: 'Verifique se a GEMINI_API_KEY está configurada corretamente nos Secrets do Supabase'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
