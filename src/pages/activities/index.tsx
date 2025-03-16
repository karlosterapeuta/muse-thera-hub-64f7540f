
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Activity, Puzzle, Mic, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Activities() {
  const isMobile = useIsMobile();

  const activities = {
    tea: [
      {
        title: "Improvisação Musical Guiada",
        description: "Utilização de instrumentos musicais simples para desenvolver habilidades de comunicação não-verbal e expressão emocional.",
        target: "Habilidades sociais, expressão emocional, atenção compartilhada",
        adaptations: "Pode ser adaptado com instrumentos coloridos específicos para cada participante, com suporte visual."
      },
      {
        title: "Canções com Estrutura Visual",
        description: "Uso de canções com suportes visuais que ilustram a letra, sequências e instruções.",
        target: "Compreensão verbal, previsibilidade, redução de ansiedade",
        adaptations: "Utilize pictogramas, imagens reais ou objetos concretos dependendo do nível de abstração."
      },
      {
        title: "Musicoterapia Vibro-acústica",
        description: "Exposição a frequências sonoras e vibrações que estimulam o corpo de forma sensorial.",
        target: "Integração sensorial, auto-regulação, consciência corporal",
        adaptations: "Ajuste de frequências e intensidade conforme sensibilidade sensorial do paciente."
      },
      {
        title: "Canções de Rotina",
        description: "Criação de canções personalizadas para momentos de transição e rotinas diárias.",
        target: "Regulação emocional, previsibilidade, independência",
        adaptations: "Pode incluir o nome do paciente e detalhes específicos de sua rotina para maior engajamento."
      },
      {
        title: "Criação Musical com Tecnologia",
        description: "Uso de aplicativos e softwares acessíveis para criar e manipular sons de forma estruturada.",
        target: "Criatividade, habilidades cognitivas, causa e efeito",
        adaptations: "Interfaces táteis ou visuais podem ser escolhidas conforme preferências sensoriais."
      }
    ],
    mental: [
      {
        title: "Técnicas de Relaxamento Musical",
        description: "Prática de respiração consciente com acompanhamento musical específico para redução de ansiedade.",
        target: "Ansiedade, tensão muscular, regulação emocional",
        adaptations: "Pode ser combinada com visualização guiada ou técnicas de aterramento."
      },
      {
        title: "Songwriting Terapêutico",
        description: "Processo de criação de letras e melodias como forma de expressão e processamento emocional.",
        target: "Expressão emocional, insight, autoestima",
        adaptations: "Pode começar com a modificação de canções existentes antes de criar novas."
      },
      {
        title: "Improvisação Reflexiva",
        description: "Improvisação musical seguida de reflexão verbal sobre as emoções e pensamentos evocados.",
        target: "Consciência emocional, expressão, processamento",
        adaptations: "Para pacientes com dificuldade verbal, pode-se usar cartões de emoções ou desenhos."
      },
      {
        title: "Recriação Musical Biográfica",
        description: "Revisitar canções significativas da história de vida do paciente para trabalhar memórias e identidade.",
        target: "Memória autobiográfica, identidade, narração de histórias",
        adaptations: "Pode focar em períodos específicos ou temas relevantes para o tratamento."
      },
      {
        title: "Batidas e Ritmos para Regulação",
        description: "Uso de ritmos específicos para ajudar na regulação do sistema nervoso e estados emocionais.",
        target: "Auto-regulação, atenção, presença",
        adaptations: "A complexidade rítmica pode ser ajustada conforme capacidade de processamento."
      }
    ],
    integrative: [
      {
        title: "Musicoterapia em Movimento",
        description: "Combinação de expressão corporal e música para integração sensório-motora.",
        target: "Coordenação, consciência corporal, expressão",
        adaptations: "Pode ser realizada sentada ou com apoio físico conforme necessário."
      },
      {
        title: "Mandala Musical",
        description: "Criação artística visual enquanto se escuta música específica, integrando estímulos sensoriais.",
        target: "Integração sensorial, foco, expressão não-verbal",
        adaptations: "Materiais artísticos podem ser adaptados para diferentes habilidades motoras."
      },
      {
        title: "Histórias Sonoras",
        description: "Narrativas acompanhadas por paisagens sonoras e efeitos musicais que ilustram os elementos da história.",
        target: "Compreensão narrativa, atenção, imaginação",
        adaptations: "A complexidade da história e sons pode ser ajustada conforme capacidade cognitiva."
      },
      {
        title: "Diálogo de Instrumentos",
        description: "Comunicação não-verbal através de instrumentos, simulando conversas e turnos de fala.",
        target: "Comunicação, escuta ativa, turnos sociais",
        adaptations: "Pode começar com imitação simples e evoluir para diálogos mais complexos."
      },
      {
        title: "Trilha Sonora Terapêutica",
        description: "Criação de uma playlist personalizada para momentos específicos do dia ou desafios emocionais.",
        target: "Auto-regulação, recursos de enfrentamento, autonomia",
        adaptations: "Pode incluir instruções gravadas ou lembretes específicos para cada paciente."
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-primary">
        Atividades de Musicoterapia
      </h1>
      
      <Tabs defaultValue="tea" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tea" className={isMobile ? "text-xs" : ""}>
            TEA
          </TabsTrigger>
          <TabsTrigger value="mental" className={isMobile ? "text-xs" : ""}>
            Transtornos Mentais
          </TabsTrigger>
          <TabsTrigger value="integrative" className={isMobile ? "text-xs" : ""}>
            Integrativas
          </TabsTrigger>
        </TabsList>
        
        {Object.entries(activities).map(([category, activityList]) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activityList.map((activity, index) => (
                <Card key={index} className="p-5 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      {category === "tea" ? (
                        <Puzzle className="h-6 w-6 text-primary" />
                      ) : category === "mental" ? (
                        <Activity className="h-6 w-6 text-primary" />
                      ) : (
                        <Music className="h-6 w-6 text-primary" />
                      )}
                      <h3 className="text-xl font-semibold text-primary">{activity.title}</h3>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <div>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-primary mt-4 mb-1">Objetivos:</h4>
                        <p className="text-sm text-gray-600">{activity.target}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-primary mt-4 mb-1">Adaptações Possíveis:</h4>
                        <p className="text-sm text-gray-600">{activity.adaptations}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
