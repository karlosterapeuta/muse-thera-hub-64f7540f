
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

INSTRUÇÕES CRÍTICAS:
- Use linguagem técnica profissional de musicoterapia
- Seja específico, detalhado e abrangente em cada campo
- Mantenha um tom profissional, empático e cientificamente fundamentado
- Base-se nas informações fornecidas mas expanda com conhecimento técnico especializado
- Cada campo deve ter entre 200-400 palavras bem estruturadas
- Use terminologia técnica musicoterapêutica apropriada
- Inclua observações clínicas detalhadas e fundamentadas
- Mencione técnicas específicas, metodologias e abordagens teóricas
- Seja preciso em descrições comportamentais e evolutivas`;
  
  const prompts = {
    individual_session: `${baseContext}

Crie um relatório EXTREMAMENTE detalhado de sessão individual de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos EXTENSIVAMENTE detalhados:

- objectives: Objetivos terapêuticos específicos da sessão (detalhe 4-6 objetivos com fundamentação teórica musicoterapêutica, metodologia aplicada, critérios de avaliação, conexão com o plano terapêutico geral)

- activities: Atividades musicoterapêuticas realizadas (descreva minuciosamente as técnicas utilizadas, instrumentos específicos, metodologia passo-a-passo, duração detalhada, sequência estruturada, adaptações realizadas, fundamentação teórica das escolhas)

- patient_response: Resposta e engajamento do paciente (análise comportamental detalhada, níveis de participação por atividade, respostas emocionais específicas, interação com instrumentos, comunicação verbal e não-verbal, linguagem corporal, preferências demonstradas, resistências observadas)

- observations: Observações clínicas importantes (progressos técnicos específicos, dificuldades identificadas com análise, insights terapêuticos fundamentados, aspectos relacionais detalhados, preferências musicais, competências emergentes, áreas de desenvolvimento)

- next_steps: Planejamento detalhado para próximas sessões (estratégias de continuidade específicas, objetivos progressivos, adaptações metodológicas necessárias, recomendações técnicas, cronograma de evolução, integração com outras terapias)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto estruturado e profissional de 250-400 palavras com detalhamento técnico especializado.`,

    monthly_evolution: `${baseContext}

Crie um relatório ABRANGENTE de evolução mensal de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos EXTENSIVAMENTE detalhados:

- therapeutic_objectives: Objetivos trabalhados no período (detalhe minuciosamente as metas estabelecidas, metodologia aplicada com fundamentação teórica, cronograma detalhado de trabalho, critérios específicos de avaliação, ajustes realizados, integração interdisciplinar)

- achievements: Conquistas e progressos observados (documente desenvolvimentos específicos por área: comunicação verbal/não-verbal, socialização e interação, aspectos motores finos/grossos, expressão emocional, competências musicais técnicas, autonomia funcional, com exemplos concretos e mensuráveis)

- challenges: Desafios e dificuldades encontradas (identifique áreas que necessitam atenção especial com análise detalhada, fatores limitantes específicos, estratégias de superação implementadas, resistências encontradas, análise de causas, abordagens alternativas testadas)

- adjustments: Ajustes realizados no plano terapêutico (modificações metodológicas específicas com justificativas, adaptações de objetivos fundamentadas, mudanças de estratégia com análise de resultados, personalização de abordagens, integração de novas técnicas)

- next_steps: Próximos passos e objetivos (planejamento detalhado para o próximo período, metas específicas mensuráveis, estratégias de continuidade fundamentadas, envolvimento familiar estruturado, coordenação interdisciplinar)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto detalhado e técnico de 300-450 palavras com análise clínica aprofundada.`,

    daily_evolution: `${baseContext}

Crie um relatório DETALHADO de evolução diária de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos MINUCIOSAMENTE detalhados:

- initial_state: Estado inicial do paciente (descreva humor específico, disposição física detalhada, estado emocional observado, comunicação inicial, fatores ambientais influenciadores, condições contextuais, preparação para a sessão, receptividade inicial)

- activities: Atividades realizadas (detalhe estrutura completa da sessão, técnicas musicoterapêuticas específicas aplicadas, instrumentos utilizados com justificativas, metodologia passo-a-passo detalhada, duração precisa, sequência fundamentada, adaptações em tempo real, transições entre atividades)

- responses: Respostas observadas (analise reações emocionais específicas, comportamentais detalhadas, comunicativas verbais/não-verbais, motoras finas/grossas, níveis de engajamento por atividade, preferências demonstradas, resistências manifestadas, evolução durante a sessão)

- observations: Observações importantes (insights clínicos fundamentados, progressos pontuais específicos, dificuldades observadas com análise, aspectos relacionais detalhados, elementos facilitadores identificados, fatores dificultadores, competências emergentes, necessidades identificadas)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto estruturado e profissional de 200-300 palavras com observação clínica detalhada.`,

    semester_evolution: `${baseContext}

Crie um relatório COMPLETO de evolução semestral de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos EXTENSIVAMENTE detalhados:

- initial_evaluation: Avaliação inicial do período (contexto de início detalhado, diagnóstico específico, demandas identificadas com análise, recursos e potencialidades mapeados, linha de base estabelecida com critérios, histórico relevante, condições iniciais)

- therapeutic_process: Processo terapêutico desenvolvido (metodologia aplicada com fundamentação teórica, técnicas principais utilizadas, evolução cronológica do plano, marcos significativos identificados, integração interdisciplinar detalhada, adaptações realizadas, progressão metodológica)

- evolution_areas: Áreas de evolução observadas (comunicação verbal/não-verbal com exemplos, aspectos socioemocionais específicos, habilidades cognitivas desenvolvidas, competências musicais adquiridas, autonomia funcional conquistada, integração sensorial, aspectos motores)

- family_involvement: Envolvimento familiar (participação detalhada dos cuidadores, orientações específicas fornecidas, resultados mensuráveis do envolvimento, desafios familiares enfrentados, superações conquistadas, dinâmica familiar observada, recomendações implementadas)

- conclusions: Conclusões do período (análise geral fundamentada, objetivos alcançados com evidências, impacto terapêutico mensurado, fatores de sucesso identificados, aprendizados clínicos específicos, evolução global do paciente)

- recommendations: Recomendações futuras (continuidade terapêutica fundamentada, estratégias específicas, orientações detalhadas, articulação interdisciplinar necessária, perspectivas de desenvolvimento, metas futuras, cronograma sugerido)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto abrangente e técnico de 350-500 palavras com análise clínica aprofundada.`,

    therapeutic_discharge: `${baseContext}

Crie um relatório COMPLETO de alta terapêutica de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos EXTENSIVAMENTE detalhados:

- treatment_summary: Resumo do tratamento (período detalhado de acompanhamento, contexto inicial específico, metodologia empregada com fundamentação, evolução cronológica minuciosa do processo, marcos terapêuticos alcançados, técnicas predominantes utilizadas, adaptações realizadas)

- achieved_goals: Objetivos alcançados (metas atingidas integralmente com evidências, conquistas específicas documentadas por área de desenvolvimento, competências consolidadas mensuravelmente, habilidades desenvolvidas, autonomia conquistada, integração de aprendizados, transferência para contextos cotidianos)

- recommendations: Recomendações pós-alta (orientações detalhadas para manutenção, atividades específicas recomendadas, estratégias de generalização fundamentadas, recursos comunitários identificados, sinais de alerta específicos, disponibilidade para seguimento, cronograma de reavaliações, articulação com outros profissionais)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto detalhado e profissional de 400-600 palavras com análise clínica completa.`,

    group_session: `${baseContext}

Crie um relatório COMPLETO de sessão em grupo de musicoterapia baseado nestas informações: ${keyPoints}

Estruture o relatório com os seguintes campos EXTENSIVAMENTE detalhados:

- participants: Participantes da sessão (composição detalhada do grupo, presença e participação individual, características relevantes de cada membro, interações iniciais observadas, dinâmicas emergentes, níveis diferenciados de engajamento)

- theme: Tema trabalhado (foco terapêutico principal fundamentado, objetivos específicos da sessão por participante, metodologia temática aplicada detalhadamente, conexão com planos individuais, relevância grupal, adaptações necessárias)

- group_dynamics: Dinâmica do grupo (clima grupal observado minuciosamente, padrões de interação específicos, liderança e papéis emergentes, momentos significativos detalhados, desafios grupais identificados, facilitadores da coesão, conflitos e resoluções)

- activities: Atividades realizadas (estrutura completa da sessão grupal, técnicas musicoterapêuticas grupais específicas, instrumentos e recursos utilizados com justificativas, metodologia passo-a-passo, participação diferenciada, adaptações individuais dentro do grupo)

- group_response: Resposta do grupo (participação coletiva detalhada, expressão musical grupal observada, comunicação e interação específicas, clima emocional evolutivo, transformações durante a sessão, sinergia grupal, momentos de conexão)

- observations: Observações importantes (progressos grupais específicos, destaques individuais dentro do contexto grupal, aspectos técnicos relevantes, impacto terapêutico mensurado, recomendações específicas, orientações para continuidade, necessidades identificadas)

Retorne apenas um JSON válido com estes campos, sendo cada campo um texto estruturado e técnico de 250-400 palavras com análise grupal aprofundada.`
  };

  return prompts[reportType as keyof typeof prompts] || prompts.individual_session;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reportType, keyPoints, patientName, evaluationDate } = await req.json() as ReportRequest;

    console.log('Enhanced report generation request:', { reportType, patientName, evaluationDate, keyPointsLength: keyPoints?.length });

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

    console.log('Calling Gemini API with enhanced detailed prompt...');

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
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192, // Aumentado para permitir relatórios mais extensos
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

    // Validar qualidade do conteúdo gerado
    const validateContentQuality = (content: any, reportType: string) => {
      const expectedFields = {
        individual_session: ['objectives', 'activities', 'patient_response', 'observations', 'next_steps'],
        monthly_evolution: ['therapeutic_objectives', 'achievements', 'challenges', 'adjustments', 'next_steps'],
        daily_evolution: ['initial_state', 'activities', 'responses', 'observations'],
        semester_evolution: ['initial_evaluation', 'therapeutic_process', 'evolution_areas', 'family_involvement', 'conclusions', 'recommendations'],
        therapeutic_discharge: ['treatment_summary', 'achieved_goals', 'recommendations'],
        group_session: ['participants', 'theme', 'group_dynamics', 'activities', 'group_response', 'observations']
      };

      const fields = expectedFields[reportType as keyof typeof expectedFields] || [];
      const missingFields = fields.filter(field => !content[field] || content[field].length < 100);
      
      return {
        isValid: missingFields.length === 0,
        missingFields,
        totalFields: fields.length,
        validFields: fields.length - missingFields.length
      };
    };

    const qualityCheck = validateContentQuality(content, reportType);
    console.log('Content quality check:', qualityCheck);

    if (!qualityCheck.isValid && qualityCheck.validFields < qualityCheck.totalFields * 0.7) {
      console.warn('Conteúdo gerado não atende aos critérios de qualidade, usando fallback aprimorado');
      throw new Error('Qualidade insuficiente, forçando fallback');
    }

    console.log('Successfully processed high-quality AI response');

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
