import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_INSTRUCTION =
  "Você é um musicoterapeuta clínico experiente, especialista em documentação clínica e relatórios de reavaliação baseados em evidências.";

const GEMINI_MODEL = "gemini-2.5-flash";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GOOGLE_AI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { paciente, anterior, atual, objetivos, observacoes } = await req.json();

    const prev = anterior || {};
    const cur = atual || {};
    const areas = Array.from(new Set([...Object.keys(prev), ...Object.keys(cur)]));
    const comparacao = areas
      .map((a) => `- ${a}: anterior ${prev[a] ?? "—"} → atual ${cur[a] ?? "—"}`)
      .join("\n");

    const userPrompt = `
Gere um RELATÓRIO DE REAVALIAÇÃO musicoterapêutica comparando a evolução do paciente entre a avaliação anterior e a atual.

Paciente: ${paciente?.nome || "—"} | Diagnóstico: ${paciente?.diagnostico || "—"}

Critérios de evolução (escala 1 a 5):
${comparacao || "—"}

Objetivos do plano:
${(objetivos || []).map((o: string) => `- ${o}`).join("\n") || "—"}

Observações do profissional:
${observacoes || "—"}

Estruture a resposta em:
1. Síntese da evolução (parágrafo)
2. Avanços observados (tópicos)
3. Áreas que ainda requerem atenção (tópicos)
4. Recomendações e ajustes terapêuticos (tópicos)
Use português do Brasil, terminologia inclusiva ('paciente'), tom técnico e baseado em evidências.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        }),
      },
    );

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      return new Response(JSON.stringify({ error: "Falha na IA", detail: t }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const report =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
