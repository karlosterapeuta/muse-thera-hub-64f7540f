import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `Você é um musicoterapeuta clínico sênior especializado em planos de tratamento individualizados. 
Sua tarefa é gerar uma sugestão de plano musicoterapêutico completo e profissional em português brasileiro, baseado nos dados do paciente.
Use linguagem clínica, inclusiva (use "paciente", nunca "criança"), e objetiva.
Responda EXCLUSIVAMENTE com JSON válido no schema solicitado, sem texto adicional, sem markdown.`;

const PLAN_TOOL = {
  type: 'function',
  function: {
    name: 'create_treatment_plan',
    description: 'Cria um plano musicoterapêutico estruturado',
    parameters: {
      type: 'object',
      properties: {
        general_objectives: { type: 'array', items: { type: 'string' }, description: '3 a 5 objetivos gerais amplos' },
        specific_objectives: { type: 'array', items: { type: 'string' }, description: '3 a 6 objetivos específicos mensuráveis' },
        clinical_family_history: { type: 'string' },
        physical_cognitive_conditions: { type: 'string' },
        interaction_communication_level: { type: 'string' },
        musical_interests: { type: 'string' },
        observed_behaviors: { type: 'string' },
        musical_instruments: { type: 'array', items: { type: 'string' } },
        technological_resources: { type: 'array', items: { type: 'string' } },
        voice_body_resources: { type: 'array', items: { type: 'string' } },
        complementary_materials: { type: 'array', items: { type: 'string' } },
        musical_improvisation: { type: 'string' },
        musical_recreation: { type: 'string' },
        musical_composition: { type: 'string' },
        receptive_listening: { type: 'string' },
        rhythmic_dynamics: { type: 'string' },
        weekly_sessions: { type: 'number' },
        session_duration_minutes: { type: 'number' },
        estimated_period_months: { type: 'number' },
        evaluation_criteria_list: { type: 'array', items: { type: 'string' } },
        session_structure: { type: 'string' },
        activity_sequence: { type: 'string' },
        flexibility_adjustments: { type: 'string' },
        reevaluation_frequency: { type: 'string' },
        evolution_recording: { type: 'string' },
        necessary_adjustments: { type: 'string' },
      },
      required: ['general_objectives', 'specific_objectives', 'musical_instruments', 'evaluation_criteria_list'],
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { patient_full_name, patient_age, clinical_diagnosis, clinical_notes } = body || {};

    if (!clinical_diagnosis && !clinical_notes) {
      return new Response(JSON.stringify({ error: 'clinical_diagnosis ou clinical_notes obrigatório' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userPrompt = `Gere um plano musicoterapêutico para o paciente abaixo.

Nome: ${patient_full_name || 'Não informado'}
Idade: ${patient_age || 'Não informada'}
Diagnóstico clínico: ${clinical_diagnosis || 'Não informado'}

Notas clínicas adicionais:
${clinical_notes || '(nenhuma)'}

Preencha TODOS os campos do schema com sugestões clínicas adequadas ao diagnóstico e perfil etário.
Os textos devem ser concisos (1-3 frases por campo), profissionais e prontos para uso.`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        tools: [PLAN_TOOL],
        tool_choice: { type: 'function', function: { name: 'create_treatment_plan' } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error('AI gateway error', aiRes.status, txt);
      return new Response(JSON.stringify({ error: `AI gateway ${aiRes.status}` }), {
        status: aiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiRes.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: 'AI did not return structured plan', raw: aiData }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let plan: Record<string, unknown>;
    try {
      plan = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON from AI' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ plan }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-treatment-plan error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
