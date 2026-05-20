// Edge function: extract payer data from a payment proof (image/PDF) via Lovable AI Gateway
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um extrator preciso de dados de comprovantes de pagamento brasileiros (PIX, TED, DOC, boleto, dinheiro, cartão).
Sempre identifique quem PAGOU (pagador / origem / quem enviou), NUNCA o beneficiário/recebedor.
Retorne JSON estrito conforme o schema. Use null quando o campo não estiver claramente presente.
- payer_name: nome completo da pessoa/empresa que pagou.
- payer_document: CPF ou CNPJ do pagador, apenas dígitos (sem máscara).
- amount: valor em reais (número, ex: 150.50).
- payment_date: data do pagamento no formato YYYY-MM-DD.
- payment_method: um de "pix", "transferência", "boleto", "dinheiro", "cartão de crédito", "cartão de débito".
- transaction_id: ID/E2E/autenticação da transação, se houver.
- bank_origin: nome do banco/instituição de origem, se houver.
- confidence: confiança geral 0..1 sobre a extração.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { fileBase64, mimeType, fileName } = await req.json();
    if (!fileBase64 || !mimeType) {
      return new Response(JSON.stringify({ error: "Arquivo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upload original to private bucket for audit/visualization later
    let proofPath: string | null = null;
    try {
      const bytes = Uint8Array.from(atob(fileBase64), (c) => c.charCodeAt(0));
      const ext = (fileName?.split(".").pop() || mimeType.split("/")[1] || "bin").toLowerCase();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, bytes, { contentType: mimeType, upsert: false });
      if (!upErr) proofPath = path;
    } catch (e) {
      console.warn("upload proof failed", e);
    }

    // Build message for Gemini via Lovable AI Gateway
    const dataUrl = `data:${mimeType};base64,${fileBase64}`;
    const userContent: any[] = [
      { type: "text", text: "Extraia os dados deste comprovante de pagamento." },
      { type: "image_url", image_url: { url: dataUrl } },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_payment_proof",
              description: "Retorna os dados estruturados do comprovante",
              parameters: {
                type: "object",
                additionalProperties: false,
                properties: {
                  payer_name: { type: ["string", "null"] },
                  payer_document: { type: ["string", "null"] },
                  amount: { type: ["number", "null"] },
                  payment_date: { type: ["string", "null"] },
                  payment_method: { type: ["string", "null"] },
                  transaction_id: { type: ["string", "null"] },
                  bank_origin: { type: ["string", "null"] },
                  confidence: { type: "number" },
                },
                required: [
                  "payer_name","payer_document","amount","payment_date",
                  "payment_method","transaction_id","bank_origin","confidence",
                ],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_payment_proof" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Limite de uso da IA atingido. Tente novamente em instantes." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const errTxt = await aiResp.text();
      console.error("AI gateway error", aiResp.status, errTxt);
      return new Response(JSON.stringify({ error: "Falha ao ler o comprovante" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    let parsed: any = null;
    if (toolCall?.function?.arguments) {
      try { parsed = JSON.parse(toolCall.function.arguments); } catch { /* noop */ }
    }
    if (!parsed) {
      const txt = aiJson?.choices?.[0]?.message?.content ?? "";
      try { parsed = JSON.parse(txt); } catch { /* noop */ }
    }
    if (!parsed) {
      return new Response(JSON.stringify({ error: "Não foi possível extrair dados do comprovante" }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ extracted: parsed, proofPath }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message || "Erro interno" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
