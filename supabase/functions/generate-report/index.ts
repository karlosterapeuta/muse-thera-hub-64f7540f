
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

const getPatientContext = async (supabase: any, patientId: string) => {
  if (!patientId) return null;

  try {
    // Buscar dados básicos do paciente
    const { data: patient } = await supabase
      .from('patients')
      .select('name, birth_date, diagnosis, observations')
      .eq('id', patientId)
      .single();

    // Buscar últimos 3 relatórios para contexto histórico
    const { data: recentReports } = await supabase
      .from('reports')
      .select('type, content, created_at')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(3);

    // Buscar anamnese se existir
    const { data: anamnesis } = await supabase
      .from('anamnesis')
      .select('musical_preferences, behavioral_observations, family_context')
      .eq('patient_id', patientId)
      .maybeSingle();

    return {
      patient,
      recentReports: recentReports || [],
      anamnesis
    };
  } catch (error) {
    console.error('Erro ao buscar contexto do paciente:', error);
    return null;
  }
};

const getEnhancedPromptForReportType = (reportType: string, keyPoints: string, patientName: string, patientContext: any, evaluationDate?: string) => {
  // Construir contexto do paciente
  let contextInfo = `Paciente: ${patientName}`;
  
  if (patientContext?.patient) {
    const { diagnosis, observations } = patientContext.patient;
    if (diagnosis) contextInfo += `\nDiagnóstico: ${diagnosis}`;
    if (observations) contextInfo += `\nObservações clínicas anteriores: ${observations}`;
  }

  if (patientContext?.anamnesis) {
    const { musical_preferences, behavioral_observations, family_context } = patientContext.anamnesis;
    if (musical_preferences) contextInfo += `\nPreferências musicais: ${musical_preferences}`;
    if (behavioral_observations) contextInfo += `\nObservações comportamentais: ${behavioral_observations}`;
    if (family_context) contextInfo += `\nContexto familiar: ${family_context}`;
  }

  if (patientContext?.recentReports?.length > 0) {
    contextInfo += `\nÚltimos relatórios (para contexto de evolução):`;
    patientContext.recentReports.forEach((report: any, index: number) => {
      const reportDate = new Date(report.created_at).toLocaleDateString('pt-BR');
      contextInfo += `\n- ${report.type} (${reportDate}): Principais observações registradas`;
    });
  }

  const baseContext = `Você é um musicoterapeuta experiente criando um relatório profissional detalhado.

${contextInfo}

INSTRUÇÕES CRÍTICAS - ABSOLUTA FIDELIDADE:
- MANTENHA FIDELIDADE TOTAL às observações fornecidas: "${keyPoints}"
- NUNCA contradiga ou altere as informações específicas mencionadas
- Se o profissional disse "estressado", o relatório DEVE refletir estresse
- Se disse "sem interação", o relatório DEVE mencionar ausência de interação
- Use as observações EXATAS como base factual do relatório
- Expanda APENAS com detalhes técnicos coerentes com essas observações
- Use linguagem técnica profissional de musicoterapia
- Seja específico e detalhado, mas sempre fiel ao observado
- Cada campo deve ter entre 200-400 palavras bem estruturadas
- Base-se nas informações do histórico para enriquecer o contexto, mas SEMPRE respeitando as observações atuais

Data da avaliação: ${evaluationDate || new Date().toLocaleDateString('pt-BR')}`;
  
  const prompts = {
    individual_session: `${baseContext}

Crie um relatório de sessão individual baseado FIELMENTE nestas observações específicas: "${keyPoints}"

IMPORTANTE: Use as observações exatas como verdade absoluta. Se mencionaram estresse, ansiedade, falta de interação, etc., o relatório DEVE refletir isso.

Estruture com os campos:
- objectives: Objetivos terapêuticos específicos (considerando o estado observado)
- activities: Atividades realizadas (adaptadas ao estado apresentado)
- patient_response: Resposta do paciente (EXATAMENTE como observado: ${keyPoints})
- observations: Observações clínicas (expandindo as observações fornecidas)
- next_steps: Próximos passos (baseados no que foi observado)

Retorne apenas JSON válido.`,

    monthly_evolution: `${baseContext}

Crie um relatório de evolução mensal baseado FIELMENTE nestas observações: "${keyPoints}"

Estruture com os campos:
- therapeutic_objectives: Objetivos trabalhados no período
- achievements: Conquistas observadas (baseadas no histórico e observações atuais)
- challenges: Desafios encontrados (incluindo os aspectos mencionados: ${keyPoints})
- adjustments: Ajustes realizados no plano
- next_steps: Próximos passos

Retorne apenas JSON válido.`,

    daily_evolution: `${baseContext}

Crie um relatório de evolução diária baseado FIELMENTE nestas observações: "${keyPoints}"

Estruture com os campos:
- initial_state: Estado inicial (EXATAMENTE como descrito: ${keyPoints})
- activities: Atividades realizadas
- responses: Respostas observadas (fiéis às observações fornecidas)
- observations: Observações importantes

Retorne apenas JSON válido.`,

    // ... outras opções de relatório mantendo o mesmo padrão
  };

  return prompts[reportType as keyof typeof prompts] || prompts.individual_session;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reportType, keyPoints, patientName, patientId, evaluationDate } = await req.json() as ReportRequest;

    console.log('Enhanced report generation with patient context:', { reportType, patientName, patientId, keyPointsLength: keyPoints?.length });

    if (!reportType || !keyPoints || !patientName) {
      throw new Error('Parâmetros obrigatórios ausentes');
    }

    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar contexto do paciente se ID fornecido
    const patientContext = patientId ? await getPatientContext(supabase, patientId) : null;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY não encontrada');
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const prompt = getEnhancedPromptForReportType(reportType, keyPoints, patientName, patientContext, evaluationDate);

    console.log('Calling Gemini API with enhanced context-aware prompt...');

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
          temperature: 0.7, // Reduzido para maior consistência
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

    // Validação de fidelidade às observações
    const validateFidelity = (content: any, keyPoints: string) => {
      const keyPointsLower = keyPoints.toLowerCase();
      const contentStr = JSON.stringify(content).toLowerCase();
      
      // Palavras-chave que indicam estados contraditórios
      const contradictions = [
        { observed: ['estressado', 'estresse'], contradicts: ['tranquilo', 'calmo', 'relaxado'] },
        { observed: ['sem interação', 'não interage'], contradicts: ['interativo', 'comunicativo', 'participativo'] },
        { observed: ['agitado'], contradicts: ['tranquilo', 'calmo'] },
        { observed: ['chorando', 'chorou'], contradicts: ['alegre', 'sorrindo'] },
        { observed: ['resistente'], contradicts: ['cooperativo', 'colaborativo'] }
      ];

      for (const rule of contradictions) {
        const hasObserved = rule.observed.some(word => keyPointsLower.includes(word));
        const hasContradiction = rule.contradicts.some(word => contentStr.includes(word));
        
        if (hasObserved && hasContradiction) {
          console.warn(`Contradição detectada: observado ${rule.observed} mas gerado ${rule.contradicts}`);
          return false;
        }
      }
      
      return true;
    };

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
          throw new Error('JSON não encontrado');
        }
      }

      // Validar fidelidade
      if (!validateFidelity(content, keyPoints)) {
        console.warn('Conteúdo não fiel às observações, tentando novamente...');
        throw new Error('Fidelidade insuficiente às observações');
      }

    } catch (error) {
      console.error('Erro ao processar resposta da IA:', error);
      throw new Error('Resposta da IA inválida ou não fiel às observações');
    }

    console.log('Successfully generated faithful AI response');

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
        error: error.message,
        details: 'Verifique se a GEMINI_API_KEY está configurada e se as observações são claras'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
