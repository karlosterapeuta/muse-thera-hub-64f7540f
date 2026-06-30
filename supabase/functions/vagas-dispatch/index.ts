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
    "🎵✨ *MuseTera Vagas* ✨🎵",
    "_Conectando musicoterapeutas às melhores oportunidades_",
    "",
    `${PERIOD_LABEL[period]}, musicoterapeuta! 💜`,
    "Encontramos uma nova oportunidade pra você:",
    "",
    "━━━━━━━━━━━━━━━",
    `🎯 *${v.title}*`,
  ];
  if (v.company) lines.push(`🏢 ${v.company}`);
  if (v.location) lines.push(`📍 ${v.location}`);
  lines.push("━━━━━━━━━━━━━━━", "");
  lines.push("👉 *Candidate-se aqui:*", `🔗 ${v.url}`);
  if (v.source) lines.push("", `_Fonte: ${v.source}_`);
  lines.push(
    "",
    "✅ Vaga verificada pela equipe MuseTera",
    "🎶 _MuseTera — a plataforma completa do musicoterapeuta_",
    "💜 Bons atendimentos e sucesso na sua jornada!",
  );
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

    const evoUrlBase = Deno.env.get("EVOLUTION_API_URL")?.trim().replace(/\/+$/, "");
    const evoApiKey = Deno.env.get("EVOLUTION_API_KEY")?.trim();
    const configuredInstance = Deno.env.get("EVOLUTION_INSTANCE_NAME")?.trim();

    // Desired sender number (digits only) configured by the admin.
    const { data: settings } = await admin.from("vagas_settings").select("*").limit(1).maybeSingle();
    const senderDigits = (settings?.whatsapp_sender_number ?? "").replace(/\D/g, "");
    const senderTail = senderDigits.slice(-8); // last 8 digits ignore country/9th-digit issues

    // Resolve which Evolution instance to use. Priority:
    // 1) instance whose connected number matches the desired sender (last 8 digits)
    // 2) the configured instance name if it exists
    // 3) any connected instance
    async function resolveInstance(): Promise<string | null> {
      if (!evoUrlBase || !evoApiKey) return null;
      try {
        const resp = await fetch(`${evoUrlBase}/instance/fetchInstances`, {
          headers: { apikey: evoApiKey },
        });
        if (!resp.ok) return configuredInstance ?? null;
        const list = (await resp.json()) as Array<{
          name?: string;
          connectionStatus?: string;
          ownerJid?: string;
        }>;
        if (!Array.isArray(list) || list.length === 0) return configuredInstance ?? null;

        if (senderTail) {
          const byNumber = list.find((i) => {
            const jidDigits = (i.ownerJid ?? "").replace(/\D/g, "");
            return jidDigits.slice(-8) === senderTail;
          });
          if (byNumber?.name) return byNumber.name;
        }

        const byName = configuredInstance && list.find((i) => i.name === configuredInstance);
        if (byName) return byName.name!;

        const open = list.find((i) => i.connectionStatus === "open");
        return (open?.name ?? list[0]?.name) ?? configuredInstance ?? null;
      } catch {
        return configuredInstance ?? null;
      }
    }

    const evoInstanceName = await resolveInstance();





    // Action: list WhatsApp groups so the admin can pick the right group JID.
    if (body.action === "list_groups") {
      if (!evoUrlBase || !evoApiKey || !evoInstanceName) {
        return new Response(JSON.stringify({ error: "Evolution não configurado" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const resp = await fetch(
        `${evoUrlBase}/group/fetchAllGroups/${evoInstanceName}?getParticipants=false`,
        { headers: { apikey: evoApiKey } },
      );
      const text = await resp.text();
      if (!resp.ok) {
        return new Response(JSON.stringify({ error: `Evolution ${resp.status}`, detail: text }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      let parsed: unknown = [];
      try { parsed = JSON.parse(text); } catch { parsed = []; }
      const arr = Array.isArray(parsed) ? parsed : [];
      const groups = arr.map((g: Record<string, unknown>) => ({
        id: g.id as string,
        subject: (g.subject as string) ?? "(sem nome)",
        size: (g.size as number) ?? null,
      }));
      return new Response(JSON.stringify({ groups }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const perPeriod: number = settings?.per_period ?? 2;
    const groupUrl: string | null = settings?.whatsapp_group_url ?? null;

    // Avoid the cron firing twice in quick succession (double-send guard).
    // We only block if a dispatch already ran in the last 2 hours — this way a
    // stray earlier send (manual test / leftover job) never blocks the daily
    // scheduled 20:00 dispatch.
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { count: alreadySent } = await admin
      .from("job_vacancies")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("sent_at", twoHoursAgo);

    if ((alreadySent ?? 0) >= perPeriod && !body.force) {
      return new Response(
        JSON.stringify({ sent: 0, message: `Já enviado nas últimas 2 horas` }),
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

    // Evolution API sends directly to the WhatsApp group.
    const evoUrl = evoUrlBase;
    const evoKey = evoApiKey;
    const evoInstance = evoInstanceName;
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
