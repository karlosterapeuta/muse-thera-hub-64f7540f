import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3'

const BodySchema = z.object({
  token: z.string().min(1),
  content: z.record(z.any()),
})

// Fields that must never be overwritten by the public submission
const PROTECTED = new Set([
  'id', 'patient_id', 'professional_id', 'created_at', 'updated_at', 'filled_by_guardian',
])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Dados inválidos.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { token, content } = parsed.data

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: invite, error: inviteErr } = await supabase
      .from('anamnesis_invitations')
      .select('id, status, expires_at, professional_id, patient_id, anamnesis_id')
      .eq('token', token.trim())
      .maybeSingle()

    if (inviteErr) throw inviteErr

    if (!invite) {
      return new Response(JSON.stringify({ error: 'Link inválido.', code: 'invalid' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (invite.status === 'completed') {
      return new Response(JSON.stringify({ error: 'Esta anamnese já foi preenchida.', code: 'completed' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Este link expirou.', code: 'expired' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Discover valid anamnesis columns to avoid invalid-column errors
    const { data: sample } = await supabase.from('anamnesis').select('*').limit(1)
    const validColumns = sample && sample.length > 0
      ? new Set(Object.keys(sample[0]))
      : null

    const cleaned: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(content)) {
      const k = key.toLowerCase()
      if (PROTECTED.has(k)) continue
      if (validColumns && !validColumns.has(k)) continue
      cleaned[k] = value
    }

    const record = {
      ...cleaned,
      patient_id: invite.patient_id,
      professional_id: invite.professional_id,
      filled_by_guardian: true,
    }

    let anamnesisId = invite.anamnesis_id as string | null

    if (anamnesisId) {
      const { error } = await supabase.from('anamnesis').update(record).eq('id', anamnesisId)
      if (error) throw error
    } else {
      const { data, error } = await supabase.from('anamnesis').insert(record).select('id').single()
      if (error) throw error
      anamnesisId = data.id
    }

    const { error: updErr } = await supabase
      .from('anamnesis_invitations')
      .update({ status: 'completed', completed_at: new Date().toISOString(), anamnesis_id: anamnesisId })
      .eq('id', invite.id)
    if (updErr) throw updErr

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('submit-public-anamnesis error:', err)
    return new Response(JSON.stringify({ error: 'Erro ao salvar a anamnese.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
