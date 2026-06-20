// Sends approved music-therapy vacancies to the WhatsApp group.
// Scheduled 3x/day (morning/afternoon/evening), 2 vacancies each by default.
// Delivery goes through an outbound WhatsApp endpoint (WHATSAPP_OUTBOUND_URL).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

type Period = "manha" | "tarde" | "noite";

function currentPeriod(): Period {
  // America/Sao_Paulo (UTC-3)
  const hour = (new Date().getUTCHours() - 3 + 24) % 24;
  if (hour < 12) return "manha";
  if (hour < 18) return "tarde";
  return "noite";
}

const PERIOD_LABEL: Record<Period, string> = {
  manha: "🌅 Bom dia",
  tarde: "☀️ Boa tarde",
  noite: "🌙 Boa noite",
};

interface Vacancy {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  url: string;
  source: string | null;
}

function buildMessage(v: Vacancy, period: Period): string {
  const lines = [
    `${PERIOD_LABEL[period]}! 🎵 *Nova vaga para Musicoterapeutas*`,
    "",
    `📌 *${v.title}*`,
  ];
  if (v.company) lines.push(`🏢 ${v.company}`);
  if (v.location) lines.push(`📍 ${v.location}`);
  lines.push("", `🔗 ${v.url}`);
  if (v.source) lines.push(`_Fonte: ${v.source}_`);
  lines.push("", "✅ Vaga verificada — MuseTera Vagas");
  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const internalKey = req.headers.get("x-internal-key");
    const authHeader = req.headers.get("Authorization") ?? "";
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

    const body = await req.json().catch(() => ({}));
    const period: Period = body.period ?? currentPeriod();

    const { data: settings } = await admin.from("vagas_settings").select("*").limit(1).maybeSingle();
    const perPeriod: number = settings?.per_period ?? 2;
    const groupUrl: string | null = settings?.whatsapp_group_url ?? null;

    // Avoid double-sending in the same period today.
    const today = new Date().toISOString().slice(0, 10);
    const { count: alreadySent } = await admin
      .from("job_vacancies")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent")
      .eq("sent_period", period)
      .gte("sent_at", `${today}T00:00:00Z`);

    if ((alreadySent ?? 0) >= perPeriod && !body.force) {
      return new Response(
        JSON.stringify({ sent: 0, message: `Período ${period} já enviado hoje` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Pick approved, link-ok, music-therapy vacancies not yet sent.
    const { data: vacancies } = await admin
      .from("job_vacancies")
      .select("id, title, company, location, url, source")
      .eq("status", "approved")
      .eq("is_music_therapy", true)
      .order("relevance_score", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: true })
      .limit(perPeriod);

    if (!vacancies || vacancies.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: "Sem vagas aprovadas disponíveis" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Evolution API config — sends directly to the WhatsApp group.
    const evoUrl = Deno.env.get("EVOLUTION_API_URL")?.replace(/\/+$/, "");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");
    const evoInstance = Deno.env.get("EVOLUTION_INSTANCE_NAME");
    // The group JID (e.g. 1203...@g.us) is stored in settings.whatsapp_group_url.
    const groupJid: string | null = groupUrl;
    const outboundConfigured = !!(evoUrl && evoKey && evoInstance && groupJid);

    let sent = 0;
    const results: unknown[] = [];
    for (const v of vacancies as Vacancy[]) {
      const message = buildMessage(v, period);
      let delivered = false;

      if (outboundConfigured) {
        try {
          const resp = await fetch(`${evoUrl}/message/sendText/${evoInstance}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: evoKey!,
            },
            body: JSON.stringify({ number: groupJid, text: message }),
          });
          delivered = resp.ok;
          if (!resp.ok) console.error("Evolution send failed", resp.status, await resp.text());
        } catch (e) {
          console.error("Evolution send error", e);
        }
      }

      if (delivered) {
        await admin
          .from("job_vacancies")
          .update({ status: "sent", sent_at: new Date().toISOString(), sent_period: period })
          .eq("id", v.id);
        sent++;
      }
      results.push({ id: v.id, delivered, message });
    }

    return new Response(
      JSON.stringify({
        sent,
        period,
        outbound_configured: outboundConfigured,
        group_configured: !!groupJid,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("vagas-dispatch error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
