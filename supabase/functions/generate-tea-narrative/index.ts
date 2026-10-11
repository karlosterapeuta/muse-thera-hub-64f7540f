import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let reportData: any = {};

  try {
    const body = await req.json();
    reportData = body?.reportData || {};

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY nao configurada');
      return new Response(JSON.stringify({ success: false, error: 'AI_NOT_CONFIGURED' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const patientName = reportData.patientName || 'o(a) paciente';
    const patientAge = reportData.patientAge || 'Nao informado';
    const patientDiagnosis = reportData.patientDiagnosis || 'Nao informado';
    const professionalName = reportData.professionalName || 'o(a) musicoterapeuta';
    const sessionDate = reportData.sessionDate || new Date().toLocaleDateString('pt-BR');

    // Remover campos vazios para nao induzir a IA a inventar
    const rawFields = reportData.fieldValues || {};
    const filledFields: Record<string, any> = {};
    Object.entries(rawFields).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (typeof v === 'string' && v.trim() === '') return;
      if (Array.isArray(v) && v.length === 0) return;
      filledFields[k] = v;
    });
    const additionalObservations = typeof reportData.additionalObservations === 'string'
      ? reportData.additionalObservations.trim() : '';
    if (Object.keys(filledFields).length === 0 && !additionalObservations) {
      return new Response(JSON.stringify({ success: false, error: 'INSUFFICIENT_CLINICAL_DATA' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const fieldValuesJson = JSON.stringify({
      ...filledFields,
      ...(additionalObservations ? { additional_observations: additionalObservations } : {}),
    }, null, 2);

    const systemPrompt = [
      "Atue como assistente de redacao clinica em Musicoterapia, em portugues brasileiro.",
      "Produza texto dissertativo, tecnico, preciso e legivel, com paragrafos que articulem objetivo terapeutico, procedimento REALMENTE registrado, resposta observada e interpretacao cautelosa.",
      "REGRAS DE FIDELIDADE CLINICA OBRIGATORIAS:",
      "Use EXCLUSIVAMENTE fatos presentes nos dados fornecidos. Nenhuma caracteristica, tecnica, instrumento, duracao, frequencia, escore, mudanca ou progresso pode ser presumido.",
      "Informacoes sobre diagnostico, medicacoes ou nivel de suporte sao dados informados e nao conclusoes diagnosticas do musicoterapeuta.",
      "NAO transforme objetivos planejados, textos de modelos ou possibilidades terapeuticas em procedimentos que de fato aconteceram.",
      "Se o registro nao sustentar uma secao, omita-a; nao complete com narrativa generica, prognostico, analise de eficácia ou resultados ficticios.",
      "Diferencie cuidadosamente: 'registrou-se' para fatos observados, 'pode indicar' para interpretacoes prudentes e 'recomenda-se' para propostas futuras.",
      "Nao confunda 'sem avanco observado' com incapacidade definitiva ou regressao. Nao declare efeito causal, eficacia ou generalizacao sem avaliacao comparativa.",
      "Apenas descreva evolucao temporal quando existirem avaliacoes com datas distintas e parametros comparaveis. Caso contrario, descreva o estado documentado no periodo, sem afirmar melhora ou piora.",
      "Nao crie bibliografia ou citas cientificas. Nomeie abordagem, metodo, escala ou referencia somente quando constar como efetivamente selecionada/utilizada nos registros.",
      "Empregue terminologia musicoterapeutica pertinente, como responsividade sonoro-musical, reciprocidade musical, intencionalidade comunicativa e expressao vocal, APENAS quando sustentada pelas observacoes.",
      "Evite repetir listas de metas nos resultados e nas consideracoes finais. Redija um texto individualizado, objetivo, coeso, sem exageros e sem julgamentos estigmatizantes.",
      "As secoes geradas sao RASCUNHOS e exigem revisao e aprovacao do musicoterapeuta antes da emissao.",
      "Retorne APENAS JSON valido no formato { \"sections\": [{ \"title\": \"string\", \"content\": \"string\" }] }.",
      "Use os seguintes titulos, nesta ordem, APENAS quando houver fundamento documental: 'Motivo do Encaminhamento'; 'Objetivos Terapêuticos'; 'Procedimentos e Abordagens Registrados'; 'Análise Clínica Musicoterapêutica'; 'Resultados Observados'; 'Recomendações'; 'Considerações Finais'.",
      "A secao 'Análise Clínica Musicoterapêutica' e central: conecte observacoes, procedimentos aplicados e respostas, sem inventar comparacoes.",
      "Em 'Resultados Observados', apresente claramente dificuldades, registros em observacao e eventuais avancos apenas se registrados.",
      "Em 'Considerações Finais', sintetize os limites dos dados e a necessidade de reavaliacao, sem repetir contagens ou atribuir resultados nao demonstrados."
    ].join(" ");

    const userPrompt =
      "DADOS DO PACIENTE\nNome: " + patientName + "\nIdade: " + patientAge +
      "\nDiagnostico: " + patientDiagnosis + "\nProfissional responsavel: " + professionalName +
      "\nData da sessao: " + sessionDate +
      "\n\nDADOS CLINICOS PREENCHIDOS NO QUESTIONARIO (interprete e transforme em narrativa, sem inventar nada):\n" +
      fieldValuesJson;

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
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Erro do AI Gateway:', response.status, errText);
      let error = 'SERVICE_UNAVAILABLE';
      if (response.status === 429) error = 'RATE_LIMITED';
      if (response.status === 402) error = 'CREDITS_EXHAUSTED';
      return new Response(JSON.stringify({ success: false, error }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content || '';

    let parsed: any;
    try {
      parsed = JSON.parse(generatedText.trim());
    } catch (_e) {
      console.warn('Falha ao parsear JSON da IA narrativa.');
      return new Response(JSON.stringify({ success: false, error: 'PARSE_FAILED' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sections = Array.isArray(parsed?.sections)
      ? parsed.sections.filter((s: any) => s && s.title && s.content && String(s.content).trim())
      : [];

    if (sections.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'EMPTY_NARRATIVE' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, sections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return new Response(JSON.stringify({ success: false, error: 'SERVICE_FAILED' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
