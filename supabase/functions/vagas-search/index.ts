// Daily job-vacancy discovery for music therapists.
// Uses Firecrawl to search public job boards, an LLM to classify relevance,
// validates the link, deduplicates, and stores new vacancies as "pending".
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface Candidate {
  title: string;
  url: string;
  description: string;
  source: string;
}

/** Simple stable hash for dedup (url + normalized title). */
async function hashKey(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.toLowerCase().trim());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const internalKey = req.headers.get("x-internal-key");
    const authHeader = req.headers.get("Authorization") ?? "";

    // Authorize: internal cron token, service role key, or an admin user.
    const admin = createClient(supabaseUrl, serviceKey);
    let authorized = internalKey === serviceKey;
    if (!authorized && internalKey) {
      const { data: tokenRow } = await admin
        .from("vagas_settings")
        .select("cron_token")
        .limit(1)
        .maybeSingle();
      authorized = !!tokenRow?.cron_token && internalKey === tokenRow.cron_token;
    }
    if (!authorized && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await admin.auth.getUser(token);
      if (userData?.user) {
        const { data: role } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();
        authorized = !!role;
      }
    }
    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlKey) throw new Error("FIRECRAWL_API_KEY not configured");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    const { data: settings } = await admin.from("vagas_settings").select("*").limit(1).maybeSingle();
    const keywords: string[] = settings?.keywords ?? ["musicoterapeuta", "musicoterapia"];

    // --- 1. Search public job boards via Firecrawl ----------------------------
    const queries = [
      `vaga emprego ${keywords[0]} Brasil`,
      `${keywords[0]} contratação clínica hospital`,
    ];

    const candidates: Candidate[] = [];
    for (const q of queries) {
      const res = await fetch(`${FIRECRAWL_V2}/search`, {
        method: "POST",
        headers: { Authorization: `Bearer ${firecrawlKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 10, lang: "pt", country: "br", tbs: "qdr:w" }),
      });
      if (!res.ok) {
        console.error("Firecrawl search failed", res.status, await res.text());
        continue;
      }
      const json = await res.json();
      const results = json.data ?? json.web ?? [];
      for (const r of results) {
        if (!r.url) continue;
        candidates.push({
          title: r.title ?? "Vaga",
          url: r.url,
          description: r.description ?? "",
          source: new URL(r.url).hostname.replace("www.", ""),
        });
      }
    }

    // --- 2. Deduplicate against existing rows ---------------------------------
    const { data: existing } = await admin.from("job_vacancies").select("content_hash");
    const existingHashes = new Set((existing ?? []).map((e: { content_hash: string }) => e.content_hash));

    const fresh: (Candidate & { hash: string })[] = [];
    for (const c of candidates) {
      const hash = await hashKey(c.url);
      if (existingHashes.has(hash) || fresh.some((f) => f.hash === hash)) continue;
      fresh.push({ ...c, hash });
    }

    if (fresh.length === 0) {
      return new Response(JSON.stringify({ inserted: 0, message: "Nenhuma vaga nova" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- 3. Classify relevance with the LLM ----------------------------------
    let classifications: Record<number, { music: boolean; score: number }> = {};
    if (lovableKey) {
      const list = fresh
        .map((c, i) => `${i}. ${c.title} — ${c.description} (${c.url})`)
        .join("\n");
      const prompt = `Você é um classificador de vagas de emprego. Para cada item abaixo, decida se é REALMENTE uma vaga de emprego aberta para MUSICOTERAPEUTA (não curso, não notícia, não artigo). Responda APENAS um JSON array no formato [{"i":0,"music":true,"score":85}], onde music indica se é vaga de musicoterapeuta e score (0-100) a confiança.\n\n${list}`;
      try {
        const aiRes = await fetch(AI_GATEWAY, {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const text: string = aiJson.choices?.[0]?.message?.content ?? "[]";
          const match = text.match(/\[[\s\S]*\]/);
          const arr = match ? JSON.parse(match[0]) : [];
          for (const item of arr) {
            classifications[item.i] = { music: !!item.music, score: Number(item.score) || 0 };
          }
        } else {
          console.error("AI gateway failed", aiRes.status, await aiRes.text());
        }
      } catch (e) {
        console.error("AI classification error", e);
      }
    }

    // --- 4. Link-health check + insert ---------------------------------------
    let inserted = 0;
    for (let i = 0; i < fresh.length; i++) {
      const c = fresh[i];
      const cls = classifications[i] ?? { music: true, score: 50 };
      if (!cls.music || cls.score < 40) continue;

      let linkOk = true;
      try {
        const ping = await fetch(c.url, { method: "GET", redirect: "follow" });
        linkOk = ping.status < 400;
      } catch {
        linkOk = false;
      }
      if (!linkOk) continue;

      const { error } = await admin.from("job_vacancies").insert({
        title: c.title.slice(0, 300),
        url: c.url,
        source: c.source,
        description: c.description.slice(0, 1000),
        content_hash: c.hash,
        is_music_therapy: cls.music,
        relevance_score: cls.score,
        link_ok: linkOk,
        status: "pending",
      });
      if (!error) inserted++;
    }

    return new Response(JSON.stringify({ inserted, candidates: candidates.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("vagas-search error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
