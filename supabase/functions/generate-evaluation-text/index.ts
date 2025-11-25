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
      patientAge, 
      evaluationDate,
      achievements,
      developmentAreas,
      overallScore,
      evaluatedDomains 
    } = await req.json();

    console.log('Generating evaluation text for:', patientName);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Categorizar conquistas por domínio
    const achievementsByDomain: Record<string, any[]> = {};
    achievements.forEach((item: any) => {
      if (!achievementsByDomain[item.domain]) {
        achievementsByDomain[item.domain] = [];
      }
      achievementsByDomain[item.domain].push(item);
    });

    // Categorizar áreas de desenvolvimento por domínio
    const developmentByDomain: Record<string, any[]> = {};
    developmentAreas.forEach((item: any) => {
      if (!developmentByDomain[item.domain]) {
        developmentByDomain[item.domain] = [];
      }
      developmentByDomain[item.domain].push(item);
    });

    // Construir texto detalhado de conquistas
    let achievementsText = "CONQUISTAS IDENTIFICADAS (Habilidades demonstradas com pontuação ≥ 60):\n\n";
    Object.entries(achievementsByDomain).forEach(([domain, items]) => {
      achievementsText += `\n${domain}:\n`;
      items.forEach((item: any) => {
        achievementsText += `  - ${item.subdomain}: ${item.parameter} (Nível: ${item.level}, Pontuação: ${item.score})\n`;
      });
    });

    // Construir texto detalhado de áreas a desenvolver
    let developmentText = "ÁREAS A DESENVOLVER (Habilidades que necessitam atenção com pontuação < 60):\n\n";
    Object.entries(developmentByDomain).forEach(([domain, items]) => {
      developmentText += `\n${domain}:\n`;
      items.forEach((item: any) => {
        developmentText += `  - ${item.subdomain}: ${item.parameter} (Nível: ${item.level}, Pontuação: ${item.score})\n`;
      });
    });

    const prompt = `Você é um musicoterapeuta especialista certificado pela WFMT (World Federation of Music Therapy). Baseado na avaliação MuseTera do paciente ${patientName} (${patientAge} anos), realizada em ${evaluationDate}, crie um RELATÓRIO TÉCNICO PROFISSIONAL em português brasileiro.

DADOS DA AVALIAÇÃO:
- Pontuação Global: ${overallScore.percentage}% (${overallScore.raw}/${overallScore.max} pontos)
- Domínios Avaliados: ${overallScore.evaluatedDomains}/${overallScore.totalDomains}
- Parâmetros Avaliados: ${overallScore.evaluatedParameters}

${achievementsText}

${developmentText}

INSTRUÇÕES PARA O RELATÓRIO:

1. **Síntese Geral** (2-3 parágrafos):
   - Apresente uma visão holística do perfil musicoterapêutico do paciente
   - Destaque o percentual global e o que isso representa
   - Use terminologia técnica de musicoterapia (ex: "responsividade musical", "integração sensório-motora", "expressividade sonora")

2. **Análise das Conquistas** (1-2 parágrafos por domínio avaliado):
   - Para cada domínio com conquistas, descreva detalhadamente as habilidades demonstradas
   - Explique a importância dessas habilidades no contexto terapêutico
   - Relacione as conquistas entre si quando houver conexões relevantes
   - Use termos técnicos como: "plasticidade neurológica", "sincronização rítmica", "regulação emocional via música", "integração audiovisual"

3. **Áreas Prioritárias para Desenvolvimento** (1-2 parágrafos por domínio):
   - Identifique os pontos que necessitam intervenção musicoterapêutica
   - Explique o impacto dessas limitações no desenvolvimento global
   - Priorize as áreas mais críticas
   - Seja empático mas técnico

4. **Recomendações Terapêuticas** (lista de 5-8 itens):
   - Sugira técnicas musicoterapêuticas específicas (ex: "Improvisação clínica referencial", "Técnicas receptivas de GIM", "Método Nordoff-Robbins")
   - Indique recursos musicais apropriados (instrumentos, repertório, tecnologias)
   - Considere a abordagem multidisciplinar quando relevante
   - Sugira frequência e duração de sessões

5. **Objetivos Terapêuticos Sugeridos** (lista de 5-7 objetivos SMART):
   - Formule objetivos específicos, mensuráveis e temporalmente definidos
   - Organize por domínio (Musical, Cognitivo, Psicossocial, Sensório-Motor, Comunicativo)
   - Use verbos de ação (desenvolver, ampliar, fortalecer, integrar, modular)

IMPORTANTE:
- Use linguagem técnica e profissional de musicoterapia
- Seja empático mas objetivo
- Cite teorias e métodos quando apropriado (ex: ISO de Benenzon, Modelo Bonny, abordagem neurológica)
- Mantenha tom humanizado focado no potencial do paciente
- NÃO invente dados que não foram fornecidos
- Retorne APENAS um objeto JSON válido com esta estrutura:

{
  "sintese_geral": "texto aqui...",
  "conquistas": {
    "introducao": "texto introdutório...",
    "por_dominio": [
      {
        "dominio": "Nome do Domínio",
        "analise": "texto detalhado..."
      }
    ]
  },
  "areas_desenvolvimento": {
    "introducao": "texto introdutório...",
    "por_dominio": [
      {
        "dominio": "Nome do Domínio",
        "analise": "texto detalhado..."
      }
    ]
  },
  "recomendacoes": [
    "Recomendação 1",
    "Recomendação 2",
    ...
  ],
  "objetivos": [
    {
      "dominio": "Domínio",
      "objetivo": "Objetivo SMART"
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um musicoterapeuta especialista com certificação WFMT. Seu objetivo é criar relatórios técnicos profissionais baseados em avaliações estruturadas. Use linguagem técnica, mas humanizada e empática. SEMPRE retorne JSON válido.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requisições excedido. Aguarde alguns instantes e tente novamente.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Créditos insuficientes. Por favor, adicione créditos à sua conta Lovable AI.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated text:', generatedText);

    // Tentar fazer parse do JSON
    let content;
    try {
      // Remover possíveis marcadores de código
      const cleanedText = generatedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      content = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON, returning raw text');
      // Fallback: retornar estrutura básica com texto bruto
      content = {
        sintese_geral: generatedText,
        conquistas: { introducao: '', por_dominio: [] },
        areas_desenvolvimento: { introducao: '', por_dominio: [] },
        recomendacoes: [],
        objetivos: []
      };
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-evaluation-text:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar texto' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
