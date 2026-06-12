import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportData } = await req.json();
    
    const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!googleAIApiKey) {
      throw new Error('GOOGLE_AI_API_KEY nao configurada');
    }

    const patientName = reportData.patientName || 'Nao informado';
    const patientAge = reportData.patientAge || 'Nao informado';
    const patientDiagnosis = reportData.patientDiagnosis || 'Nao informado';
    const professionalName = reportData.professionalName || 'Nao informado';
    const sessionDate = reportData.sessionDate || 'Nao informado';
    const fieldValuesJson = JSON.stringify(reportData.fieldValues || {}, null, 2);

    const prompt = "Voce e um especialista em musicoterapia para TEA. Organize o seguinte relatorio: " + 
      "Paciente: " + patientName + ", " +
      "Idade: " + patientAge + ", " +
      "Diagnostico: " + patientDiagnosis + ", " +
      "Profissional: " + professionalName + ", " +
      "Data: " + sessionDate + ". " +
      "CAMPOS: " + fieldValuesJson + ". " +
      "Instrucoes: 1. Melhore a redacao tecnica. 2. MANTENHA TODOS OS CAMPOS ORIGINAIS. 3. Retorne JSON puro.";

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + googleAIApiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
          response_mime_type: "application/json",
        }
      }),
    });

    if (!response.ok) {
      throw new Error("Erro da API Google AI");
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    let organizedContent;
    try {
      organizedContent = JSON.parse(generatedText.trim());
    } catch (parseError) {
      organizedContent = reportData.fieldValues;
    }

    return new Response(JSON.stringify({ 
      success: true,
      organizedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});