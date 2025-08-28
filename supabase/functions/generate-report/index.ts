import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  reportType: string;
  keyPoints: string;
  patientName: string;
  patientId?: string;
  evaluationDate?: string;
}

// Input sanitization function to prevent XSS
const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (char) => { // Escape dangerous characters
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char] || char;
    })
    .trim();
};

// Validate input length and format
const validateInput = (input: string, maxLength = 10000): boolean => {
  if (!input || typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

const getPatientContext = async (supabase: any, patientId: string, userId: string) => {
  if (!patientId) return null;

  try {
    // First verify the patient belongs to the authenticated user
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('name, birth_date, age, contact, responsible')
      .eq('id', patientId)
      .eq('professional_id', userId) // CRITICAL: Ensure RLS compliance
      .single();

    if (patientError || !patient) {
      console.error('Patient access denied or not found:', patientError);
      throw new Error('Acesso negado: paciente não encontrado ou não autorizado');
    }

    // Fetch recent reports with RLS enforced
    const { data: recentReports } = await supabase
      .from('reports')
      .select('type, content, created_at')
      .eq('patient_id', patientId)
      // RLS will automatically filter by professional_id
      .order('created_at', { ascending: false })
      .limit(3);

    // Fetch anamnesis with RLS enforced
    const { data: anamnesis } = await supabase
      .from('anamnesis')
      .select('therapeutic_goals, treatment_approach, main_clinical_demand')
      .eq('patient_id', patientId)
      // RLS will automatically filter by professional_id
      .maybeSingle();

    return {
      patient,
      recentReports: recentReports || [],
      anamnesis
    };
  } catch (error) {
    console.error('Erro ao buscar contexto do paciente:', error);
    throw error; // Re-throw to maintain security
  }
};

const getEnhancedPromptForReportType = (reportType: string, keyPoints: string, patientName: string, patientContext: any, evaluationDate?: string) => {
  // All inputs are already sanitized at this point
  let contextInfo = `Paciente: ${patientName}`;
  
  if (patientContext?.patient) {
    const { age, responsible } = patientContext.patient;
    if (age) contextInfo += `\nIdade: ${age} anos`;
    if (responsible) contextInfo += `\nResponsável: ${responsible}`;
  }

  if (patientContext?.anamnesis) {
    const { therapeutic_goals, treatment_approach, main_clinical_demand } = patientContext.anamnesis;
    if (therapeutic_goals) contextInfo += `\nObjetivos terapêuticos: ${therapeutic_goals}`;
    if (treatment_approach) contextInfo += `\nAbordagem de tratamento: ${treatment_approach}`;
    if (main_clinical_demand) contextInfo += `\nDemanda clínica principal: ${main_clinical_demand}`;
  }

  if (patientContext?.recentReports?.length > 0) {
    contextInfo += `\nÚltimos relatórios (para contexto de evolução):`;
    patientContext.recentReports.forEach((report: any, index: number) => {
      const reportDate = new Date(report.created_at).toLocaleDateString('pt-BR');
      contextInfo += `\n- ${report.type} (${reportDate})`;
    });
  }

  const baseContext = `Você é um musicoterapeuta experiente criando um relatório profissional detalhado.

${contextInfo}

INSTRUÇÕES CRÍTICAS - ABSOLUTA FIDELIDADE:
- MANTENHA FIDELIDADE TOTAL às observações fornecidas: "${keyPoints}"
- NUNCA contradiga ou altere as informações específicas mencionadas
- Use as observações EXATAS como base factual do relatório
- Expanda APENAS com detalhes técnicos coerentes com essas observações
- Use linguagem técnica profissional de musicoterapia
- Seja específico e detalhado, mas sempre fiel ao observado
- Cada campo deve ter entre 200-400 palavras bem estruturadas

Data da avaliação: ${evaluationDate || new Date().toLocaleDateString('pt-BR')}`;
  
  const prompts = {
    individual_session: `${baseContext}

Crie um relatório de sessão individual baseado FIELMENTE nestas observações específicas: "${keyPoints}"

Estruture com os campos:
- objectives: Objetivos terapêuticos específicos
- activities: Atividades realizadas
- patient_response: Resposta do paciente (EXATAMENTE como observado)
- observations: Observações clínicas
- next_steps: Próximos passos

Retorne apenas JSON válido.`,

    monthly_evolution: `${baseContext}

Crie um relatório de evolução mensal baseado FIELMENTE nestas observações: "${keyPoints}"

Estruture com os campos:
- therapeutic_objectives: Objetivos trabalhados no período
- achievements: Conquistas observadas
- challenges: Desafios encontrados
- adjustments: Ajustes realizados no plano
- next_steps: Próximos passos

Retorne apenas JSON válido.`,

    daily_evolution: `${baseContext}

Crie um relatório de evolução diária baseado FIELMENTE nestas observações: "${keyPoints}"

Estruture com os campos:
- initial_state: Estado inicial
- activities: Atividades realizadas
- responses: Respostas observadas
- observations: Observações importantes

Retorne apenas JSON válido.`
  };

  return prompts[reportType as keyof typeof prompts] || prompts.individual_session;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Token de autorização obrigatório');
    }

    // Initialize Supabase client with user context (not service role!)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Usuário não autenticado');
    }

    const { reportType, keyPoints, patientName, patientId, evaluationDate } = await req.json() as ReportRequest;

    console.log('Authenticated report generation for user:', user.id);

    // Validate required fields
    if (!reportType || !keyPoints || !patientName) {
      throw new Error('Parâmetros obrigatórios ausentes');
    }

    // Sanitize and validate all inputs
    const sanitizedKeyPoints = sanitizeInput(keyPoints);
    const sanitizedPatientName = sanitizeInput(patientName);
    const sanitizedReportType = sanitizeInput(reportType);
    const sanitizedEvaluationDate = evaluationDate ? sanitizeInput(evaluationDate) : undefined;

    if (!validateInput(sanitizedKeyPoints, 5000)) {
      throw new Error('Observações contêm conteúdo inválido ou são muito longas');
    }

    if (!validateInput(sanitizedPatientName, 200)) {
      throw new Error('Nome do paciente inválido');
    }

    // Verify patient access if patientId provided
    const patientContext = patientId ? await getPatientContext(supabase, patientId, user.id) : null;

    const geminiApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!geminiApiKey) {
      console.error('GOOGLE_AI_API_KEY não encontrada');
      throw new Error('Configuração da API não encontrada');
    }

    const prompt = getEnhancedPromptForReportType(
      sanitizedReportType, 
      sanitizedKeyPoints, 
      sanitizedPatientName, 
      patientContext, 
      sanitizedEvaluationDate
    );

    console.log('Calling Gemini API with secure, authenticated context...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error ${response.status}:`, errorText);
      throw new Error(`Erro na API do Gemini: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Resposta vazia da API do Gemini');
    }

    let content;
    try {
      const jsonCodeBlockMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonCodeBlockMatch) {
        content = JSON.parse(jsonCodeBlockMatch[1]);
      } else {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      }

    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      throw new Error('Resposta da IA inválida');
    }

    console.log('Successfully generated secure AI response for user:', user.id);

    return new Response(
      JSON.stringify({ content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro na geração do relatório:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('autenticado') || error.message.includes('autorizado') ? 401 : 500
      }
    );
  }
})