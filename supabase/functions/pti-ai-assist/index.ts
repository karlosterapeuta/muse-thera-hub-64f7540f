import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SECTION_PROMPTS: Record<string, string> = {
  queixaPrincipal: "Escreva a Queixa Principal do paciente em musicoterapia, em um parágrafo técnico e objetivo.",
  potencialidades: "Liste as principais potencialidades do paciente relevantes para a musicoterapia, em tópicos curtos.",
  dificuldades: "Liste as principais dificuldades do paciente relevantes para a musicoterapia, em tópicos curtos.",
  objetivoGeral: "Escreva o Objetivo Geral do Plano Terapêutico Individual de musicoterapia, em um parágrafo técnico.",
  objetivosEspecificos: "Sugira de 4 a 6 objetivos específicos de musicoterapia, cada um em uma linha iniciada por '-'.",
  metas: "Sugira de 3 a 5 metas terapêuticas mensuráveis de musicoterapia, cada uma em uma linha iniciada por '-'.",
  criteriosAlta: "Escreva os critérios para alta terapêutica em musicoterapia, em tópicos.",
  planoFamiliar: "Escreva orientações de plano familiar para os responsáveis, em musicoterapia, em parágrafo acolhedor e técnico.",
  fundamentacao: "Escreva a fundamentação técnica do plano terapêutico de musicoterapia, baseada em evidências.",
  historicoClinico: "Escreva um resumo de histórico clínico relevante para o plano de musicoterapia.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { section, context, customPrompt } = await req.json();

    const sectionInstruction =
      customPrompt || SECTION_PROMPTS[section] ||
      "Gere uma sugestão de texto técnico para a seção do plano terapêutico de musicoterapia.";

    const ctx = context || {};
    const contextText = `
Dados do paciente e do plano (use apenas o que for relevante):
- Nome: ${ctx.nome || "—"}
- Idade: ${ctx.idade || "—"}
- Diagnóstico: ${ctx.diagnostico || "—"}
- CID/DSM: ${ctx.cid || "—"} / ${ctx.dsm || "—"}
- Queixa principal: ${ctx.queixaPrincipal || "—"}
- Histórico clínico: ${ctx.historicoClinico || "—"}
- Avaliação: ${ctx.avaliacao || "—"}
- Potencialidades: ${ctx.potencialidades || "—"}
- Dificuldades: ${ctx.dificuldades || "—"}
- Objetivos anteriores: ${ctx.objetivosAnteriores || "—"}
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Você é um musicoterapeuta clínico experiente. Gere textos técnicos, claros, em português do Brasil, baseados em práticas baseadas em evidências da Musicoterapia Clínica. Use terminologia inclusiva ('paciente'). Seja conciso e profissional.",
          },
          { role: "user", content: `${sectionInstruction}\n\n${contextText}` },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos para continuar." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      return new Response(JSON.stringify({ error: "Falha na IA", detail: t }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
