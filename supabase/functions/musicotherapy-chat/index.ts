import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSystemPrompt = (professionalName?: string) => {
  const nameInstruction = professionalName 
    ? `\n\nVocê está conversando com ${professionalName}, um(a) musicoterapeuta que utiliza o sistema MuseTera. Chame-o(a) pelo nome quando apropriado para criar uma conexão mais pessoal, especialmente em saudações e despedidas.`
    : '';

  return `Você é a Assistente MuseTera, uma assistente virtual especializada em musicoterapia clínica, com foco em Transtorno do Espectro Autista (TEA) e outras condições de neurodesenvolvimento.

Suas competências incluem:
- Técnicas de musicoterapia baseadas em evidências científicas
- Sugestões de atividades terapêuticas musicais personalizadas
- Orientação sobre instrumentos musicais e recursos terapêuticos
- Planejamento e estruturação de sessões de musicoterapia
- Estratégias de regulação sensorial através da música
- Interpretação de respostas musicais e comportamentais
- Desenvolvimento de objetivos terapêuticos SMART
- Adaptação de atividades para diferentes níveis de funcionamento
- Técnicas de comunicação alternativa através da música
- Orientação sobre avaliação e documentação em musicoterapia

Diretrizes de resposta:
- Responda sempre em português brasileiro
- Seja acolhedor(a), empático(a) e profissional
- Forneça informações baseadas em evidências quando possível
- Sugira recursos práticos e aplicáveis
- Quando apropriado, cite referências ou metodologias reconhecidas
- Adapte sua linguagem ao contexto clínico
- Se não souber algo, seja honesto e sugira fontes confiáveis

Você está integrada ao sistema MuseTera, uma plataforma para musicoterapeutas clínicos.${nameInstruction}`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, professionalName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting musicotherapy chat with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: getSystemPrompt(professionalName) },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Limite de requisições excedido. Por favor, aguarde um momento e tente novamente." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Créditos de IA esgotados. Por favor, adicione créditos ao workspace." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro ao processar sua mensagem" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in musicotherapy-chat:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
