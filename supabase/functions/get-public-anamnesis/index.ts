import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let token = new URL(req.url).searchParams.get('token')?.trim()
    if (!token) {
      try {
        const body = await req.json()
        token = (body?.token as string | undefined)?.trim()
      } catch (_) { /* no body */ }
    }

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token não informado.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: invite, error } = await supabase
      .from('anamnesis_invitations')
      .select('id, status, expires_at, professional_id, patient_id')
      .eq('token', token)
      .maybeSingle()

    if (error) throw error

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

    if (new Date(invite.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Este link expirou.', code: 'expired' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const [{ data: patient }, { data: professional }] = await Promise.all([
      supabase.from('patients').select('name').eq('id', invite.patient_id).maybeSingle(),
      supabase.from('professionals').select('name').eq('user_id', invite.professional_id).maybeSingle(),
    ])

    return new Response(
      JSON.stringify({
        patientName: patient?.name ?? 'Paciente',
        professionalName: professional?.name ?? 'Profissional',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('get-public-anamnesis error:', err)
    return new Response(JSON.stringify({ error: 'Erro interno.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
