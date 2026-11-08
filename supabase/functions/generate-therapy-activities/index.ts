import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ACTIVITY_COUNT, allocateDemands, collectDemands, parseActivities } from "./core.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

async function requestWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function tryLovable(prompt: string, key: string): Promise<string> {
  const response = await requestWithTimeout("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Responda somente com um objeto JSON válido, sem markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 12000,
    }),
  });
  if (!response.ok) throw new Error(`Gateway HTTP ${response.status}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("Gateway retornou resposta vazia");
  return content;
}

async function tryGemini(prompt: string, key: string): Promise<string> {
  const response = await requestWithTimeout("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 12000,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("");
  if (!content) throw new Error("Gemini retornou resposta vazia");
  return content;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return json({ error: "Entre novamente para gerar sugestões." }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: "Sessão expirada. Entre novamente no MuseTera." }, 401);

    const body = await req.json();
    if (!body || typeof body !== "object") return json({ error: "Solicitação de intervenção inválida." }, 400);
    const patientId = typeof body.patientId === "string" ? body.patientId : "";
    const legacyPatientName = !patientId && typeof body.patientName === "string" ? body.patientName.trim().slice(0, 200) : "";
    if (!patientId && !legacyPatientName) return json({ error: "Selecione um paciente válido." }, 400);
    // Compatibilidade temporária com a interface publicada anteriormente.
    let patientQuery = supabase.from("patients").select("id").eq("professional_id", user.id);
    patientQuery = patientId ? patientQuery.eq("id", patientId) : patientQuery.eq("name", legacyPatientName);
    const { data: patient, error: patientError } = await patientQuery.limit(1).maybeSingle();
    if (patientError) throw new Error("Não foi possível validar o acesso ao paciente.");
    if (!patient) return json({ error: "Paciente não autorizado ou indisponível." }, 403);

    const demands = collectDemands(body);
    if (!demands.length) return json({ error: "Selecione pelo menos uma demanda clínica." }, 400);
    const allocation = allocateDemands(demands);

    // O prompt não transmite nome, ID ou dados identificáveis do paciente.
    const prompt = `Você é musicoterapeuta clínico. Crie exatamente ${ACTIVITY_COUNT} atividades musicoterapêuticas diferentes e executáveis, em português do Brasil.

Distribua as atividades estritamente por estas demandas, respeitando o número indicado:
${allocation.map(item => `${item.demandNumber}. [${item.disorder}] ${item.category}: ${item.label} => ${item.count} atividades`).join("\n")}

Regras: use SOMENTE as demandas fornecidas; indique o número da demanda em cada atividade; objetivos específicos devem ser observáveis, com critérios verificáveis; detalhe etapas, instrumentos, duração, adaptações para perfil sensorial e segurança; não prometa cura ou resultados garantidos. O plano exige validação profissional.

Retorne um único objeto JSON com "activities" e EXATAMENTE ${ACTIVITY_COUNT} itens. Cada item deve conter:
{"disorder":"TEA|TDAH|TOD|DI", "demand":"transtorno: categoria - subdemanda", "demandNumber":1, "specialty":"Musicoterapia", "generalObjective":"texto", "specificObjective":"texto mensurável", "activityDescription":"passo a passo", "materials":["instrumentos"], "estimatedTime":"20-30 minutos", "evaluationCriteria":["indicador observável"], "complexityLevel":"Leve|Moderado|Severo"}.
Não acrescente comentários ou markdown.`;

    const providers = [
      { name: "Gateway IA", key: Deno.env.get("LOVABLE_API_KEY"), run: tryLovable },
      { name: "Google Gemini", key: Deno.env.get("GOOGLE_AI_API_KEY"), run: tryGemini },
    ].filter(provider => Boolean(provider.key));

    // Um provedor funcionando basta: não exigir chave Google se o gateway está ativo.
    if (!providers.length) {
      return json({ error: "O serviço de IA não está configurado. Solicite uma chave de provedor ao administrador." }, 503);
    }

    for (const provider of providers) {
      try {
        const content = await provider.run(prompt, provider.key!);
        const activities = parseActivities(content);
        const clean = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
        const counts = new Map<number, number>();
        parsed.activities.forEach((activity: { demandNumber?: number }) => {
          counts.set(activity.demandNumber ?? 0, (counts.get(activity.demandNumber ?? 0) ?? 0) + 1);
        });
        if (allocation.some(item => counts.get(item.demandNumber) !== item.count)) {
          throw new Error("Distribuição das demandas incompleta");
        }
        activities.forEach((activity, index) => {
          const expected = allocation[parsed.activities[index].demandNumber - 1];
          if (!expected || activity.disorder !== expected.disorder) throw new Error("Demanda associada ao transtorno incorreto");
          activity.demand = `${expected.disorder}: ${expected.category} - ${expected.label}`;
        });

        console.info(`Intervenção: ${activities.length} atividades geradas por ${provider.name}`);
        return json({ activities, totalDemands: demands.length, consideredDemands: allocation.length });
      } catch (error) {
        console.warn(`Intervenção: ${provider.name} indisponível:`, error instanceof Error ? error.message : "erro desconhecido");
      }
    }

    return json({ error: "A IA não conseguiu produzir as 10 atividades completas. Tente novamente em instantes." }, 502);
  } catch (error) {
    console.error("Intervenção: erro interno:", error instanceof Error ? error.message : "erro desconhecido");
    return json({ error: "Não foi possível gerar o plano agora. Tente novamente ou contate o suporte." }, 500);
  }
});
