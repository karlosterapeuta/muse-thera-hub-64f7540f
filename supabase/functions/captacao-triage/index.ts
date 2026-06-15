import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface LeadInput {
  guardian_name?: string;
  patient_name: string;
  patient_age?: number;
  city?: string;
  state?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  diagnosis?: string;
  cid?: string;
  therapeutic_goal?: string;
  insurance?: string;
  mode?: 'online' | 'presencial' | 'ambos';
  notes?: string;
  preferred_profile_id?: string | null;
  lgpd_consent: boolean;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const lead = (await req.json()) as LeadInput;

    if (!lead?.patient_name || !lead?.lgpd_consent) {
      return jsonResponse({ error: 'Nome do paciente e consentimento LGPD são obrigatórios.' }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1. Persist lead
    const { data: insertedLead, error: leadError } = await supabase
      .from('patient_leads')
      .insert({
        guardian_name: lead.guardian_name ?? null,
        patient_name: lead.patient_name,
        patient_age: lead.patient_age ?? null,
        city: lead.city ?? null,
        state: lead.state ?? null,
        phone: lead.phone ?? null,
        whatsapp: lead.whatsapp ?? null,
        email: lead.email ?? null,
        diagnosis: lead.diagnosis ?? null,
        cid: lead.cid ?? null,
        therapeutic_goal: lead.therapeutic_goal ?? null,
        insurance: lead.insurance ?? null,
        mode: lead.mode ?? 'online',
        notes: lead.notes ?? null,
        preferred_profile_id: lead.preferred_profile_id ?? null,
        lgpd_consent: lead.lgpd_consent,
      })
      .select()
      .single();

    if (leadError || !insertedLead) {
      console.error('Lead insert error', leadError);
      return jsonResponse({ error: 'Não foi possível registrar a solicitação.' }, 500);
    }

    // 2. AI triage (best-effort)
    let triage: Record<string, string> | null = null;
    if (LOVABLE_API_KEY) {
      try {
        const prompt = `Você é um musicoterapeuta especialista em triagem clínica. Analise o caso e responda APENAS com um JSON válido com as chaves: case_summary (resumo do caso), identified_needs (necessidades identificadas), therapeutic_area (área terapêutica indicada), priority_level (Baixa, Média ou Alta), recommended_profile (perfil profissional recomendado).
Dados do paciente:
Nome: ${lead.patient_name}
Idade: ${lead.patient_age ?? 'não informado'}
Diagnóstico: ${lead.diagnosis ?? 'não informado'}
CID: ${lead.cid ?? 'não informado'}
Objetivo terapêutico: ${lead.therapeutic_goal ?? 'não informado'}
Modalidade: ${lead.mode ?? 'online'}
Cidade/Estado: ${lead.city ?? '-'}/${lead.state ?? '-'}
Observações: ${lead.notes ?? '-'}`;

        const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Lovable-API-Key': LOVABLE_API_KEY,
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
          }),
        });

        if (aiResp.ok) {
          const aiData = await aiResp.json();
          const content = aiData?.choices?.[0]?.message?.content;
          if (content) {
            triage = JSON.parse(content);
          }
        } else {
          console.error('AI gateway error', aiResp.status, await aiResp.text());
        }
      } catch (e) {
        console.error('Triage failed', e);
      }
    }

    if (triage) {
      await supabase.from('triage_reports').insert({
        lead_id: insertedLead.id,
        case_summary: triage.case_summary ?? null,
        identified_needs: triage.identified_needs ?? null,
        therapeutic_area: triage.therapeutic_area ?? null,
        priority_level: triage.priority_level ?? null,
        recommended_profile: triage.recommended_profile ?? null,
        raw_response: triage,
      });
    }

    // 3. Match published professionals
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('id, city, state, attends_online, attends_in_person, accepts_private, plan, avg_rating, years_experience')
      .eq('is_published', true);

    const matches: { lead_id: string; profile_id: string; score: number }[] = [];
    for (const p of profiles ?? []) {
      let score = 0;
      if (lead.preferred_profile_id && p.id === lead.preferred_profile_id) score += 100;
      if (lead.city && p.city && p.city.toLowerCase() === lead.city.toLowerCase()) score += 30;
      if (lead.state && p.state && p.state.toLowerCase() === lead.state.toLowerCase()) score += 15;
      if (lead.mode === 'online' && p.attends_online) score += 20;
      if (lead.mode === 'presencial' && p.attends_in_person) score += 20;
      if (lead.mode === 'ambos' && (p.attends_online || p.attends_in_person)) score += 20;
      score += Number(p.avg_rating ?? 0) * 4;
      score += Math.min(Number(p.years_experience ?? 0), 10);
      if (p.plan === 'premium') score += 25;
      else if (p.plan === 'profissional') score += 10;
      if (score > 0) matches.push({ lead_id: insertedLead.id, profile_id: p.id, score: Math.round(score * 100) / 100 });
    }

    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 10);

    if (topMatches.length > 0) {
      await supabase.from('lead_matches').upsert(
        topMatches.map((m) => ({ ...m, status: 'novo' })),
        { onConflict: 'lead_id,profile_id' }
      );

      // Notify matched professionals
      const profileIds = topMatches.map((m) => m.profile_id);
      const { data: ownerProfiles } = await supabase
        .from('public_profiles')
        .select('id, user_id')
        .in('id', profileIds);

      const notifications = (ownerProfiles ?? []).map((op) => ({
        user_id: op.user_id,
        title: 'Novo lead recebido 🎯',
        body: `Nova solicitação de atendimento: ${lead.patient_name}${lead.city ? ' • ' + lead.city : ''}`,
        link: '/captacao/leads',
      }));
      if (notifications.length > 0) {
        await supabase.from('captacao_notifications').insert(notifications);
      }
    }

    return jsonResponse({
      success: true,
      lead_id: insertedLead.id,
      matches: topMatches.length,
      triage,
    });
  } catch (e) {
    console.error('Unhandled error', e);
    return jsonResponse({ error: 'Erro inesperado ao processar a solicitação.' }, 500);
  }
});
