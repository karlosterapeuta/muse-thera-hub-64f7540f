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
    const patientDiagnosis = reportData.patientDiagnosis || 'TEA - Transtorno do Espectro Autista';
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
    const fieldValuesJson = JSON.stringify(filledFields, null, 2);

    const systemPrompt =
      "Voce e um(a) musicoterapeuta clinico(a) especialista em Transtorno do Espectro Autista (TEA), " +
      "com profundo dominio da terminologia tecnica e cientifica da Musicoterapia (abordagens de Benenzon, " +
      "Nordoff-Robbins, modelo Bonny/GIM, IMTAP, tecnicas de improvisacao, recriacao, composicao e audicao receptiva). " +
      "Sua tarefa e redigir um RELATORIO PROFISSIONAL DE EVOLUCAO MUSICOTERAPEUTICA (semestral/trimestral) de alto padrao, " +
      "seguindo RIGOROSAMENTE o roteiro/modelo abaixo, a partir EXCLUSIVAMENTE dos dados fornecidos. " +
      "REGRAS OBRIGATORIAS: " +
      "1. Escreva texto corrido, coeso, fluido e profissional, em paragrafos bem estruturados. NUNCA apenas liste respostas cruas. " +
      "2. Use linguagem tecnica, cientifica e etica, adequada para prontuarios, instituicoes, escolas, equipes multiprofissionais e responsaveis. " +
      "3. NAO invente, suponha ou extrapole informacoes que nao estejam respaldadas nos dados fornecidos. " +
      "Se nao houver dados para uma secao, escreva uma redacao tecnica generica e prudente coerente com o quadro, sem inventar fatos especificos. " +
      "4. Evite repeticoes, frases genericas vazias ou roboticas. Personalize para este paciente. " +
      "5. Interprete os dados de forma contextualizada e clinica, relacionando observacoes entre si quando pertinente. " +
      "6. Refira-se ao paciente como 'paciente' (terminologia inclusiva), nunca como 'crianca'. " +
      "Retorne EXCLUSIVAMENTE um JSON valido (sem markdown, sem texto extra) no formato: " +
      '{ "sections": [ { "title": "string", "content": "string com um ou mais paragrafos separados por \\n\\n" } ] }. ' +
      "Gere as secoes NESTA ORDEM EXATA e com ESTES TITULOS EXATOS (nao gere a Identificacao do Paciente nem a Assinatura, pois sao montadas pelo sistema): " +
      "1. 'Motivo do Encaminhamento' - paragrafo descrevendo por que o paciente iniciou a Musicoterapia. " +
      "2. 'Objetivos Terapeuticos Desenvolvidos' - texto que apresenta os objetivos trabalhados no periodo. " +
      "3. 'Metodologia Musicoterapeutica Utilizada' - descreve como ocorreu o tratamento, tecnicas e abordagens. " +
      "4. 'Evolucao Clinica' - PARTE MAIS IMPORTANTE, em texto corrido, organizada internamente com subtitulos em uma linha seguida do paragrafo. " +
      "Use estes subtitulos (omita um subtitulo apenas se nao houver qualquer dado relacionado): Comunicacao; Interacao Social; Atencao Compartilhada; Contato Visual; Regulacao Emocional; Processamento Sensorial; Aspectos Cognitivos; Coordenacao Motora; Respostas Musicais (ritmo, melodia, harmonia, improvisacao, criatividade, memoria musical); Participacao Terapeutica (engajamento, iniciativa, permanencia, motivacao). " +
      "Formate cada subtitulo como o texto do subtitulo seguido de dois pontos no inicio do paragrafo. " +
      "5. 'Resultados Observados' - paragrafo sintetizando os avancos observados no periodo. " +
      "6. 'Aspectos que Ainda Necessitam Intervencao' - aspectos que persistem e precisam de continuidade. " +
      "7. 'Prognostico Terapeutico' - paragrafo de prognostico. " +
      "8. 'Recomendacoes' - recomendacoes para continuidade do acompanhamento. " +
      "9. 'Consideracoes Finais' - resumo tecnico conclusivo.";

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
        temperature: 0.6,
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
