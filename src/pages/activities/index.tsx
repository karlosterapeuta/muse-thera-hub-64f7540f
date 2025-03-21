
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brain, Users, Heart, Move, MessageSquare, BookOpen, Music, 
  Zap, User, Lightbulb, HelpingHand, Globe, Puzzle, Target, 
  Eye, Flame, Shield, GraduationCap, FlaskConical
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ActivitiesPage() {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const cognitiveActivities = [
    {
      id: 1,
      title: "Sequência Musical",
      description: "Os participantes devem repetir uma sequência de notas tocadas pelo terapeuta, aumentando gradualmente a complexidade. Trabalha memória, atenção e processamento sequencial."
    },
    {
      id: 2,
      title: "Classificação Sonora",
      description: "Apresentar diferentes sons (instrumentos, natureza, cotidiano) e pedir para os participantes classificarem em categorias (alto/baixo, agradável/desagradável, natural/artificial). Estimula categorização e discriminação auditiva."
    },
    {
      id: 3,
      title: "Composição Temática",
      description: "Criar uma música simples sobre um tema específico (estações do ano, emoções). Desenvolve planejamento, organização de ideias e criatividade estruturada."
    },
    {
      id: 4,
      title: "Jogo de Perguntas Musicais",
      description: "Fazer perguntas sobre músicas familiares (quem canta, letra seguinte, etc). Trabalha memória de longo prazo e recuperação de informações."
    },
    {
      id: 5,
      title: "Completar Letras",
      description: "Cantar músicas conhecidas pausando em certos momentos para que os participantes completem. Fortalece a memória de trabalho e atenção sustentada."
    },
    {
      id: 6,
      title: "Histórias Sonorizadas",
      description: "Contar uma história adicionando efeitos sonoros nos momentos apropriados. Melhora a compreensão narrativa e o processamento auditivo."
    },
    {
      id: 7,
      title: "Criação de Mapas Rítmicos",
      description: "Criar representações visuais (desenhos, símbolos) de padrões rítmicos e depois executá-los. Trabalha codificação, decodificação e representação simbólica."
    },
    {
      id: 8,
      title: "Orquestra de Imitação",
      description: "Um participante cria um movimento com som, e os outros devem imitar exatamente. Desenvolve observação detalhada e memória de procedimentos."
    },
    {
      id: 9,
      title: "Resolução Musical de Problemas",
      description: "Apresentar um desafio musical (criar uma melodia com certas notas, expressar uma emoção específica com instrumentos) e trabalhar colaborativamente para resolvê-lo."
    },
    {
      id: 10,
      title: "Músicas com Movimentos Cognitivos",
      description: "Cantar músicas que incorporam comandos cognitivos (troca de direções, contagem regressiva, nomeação de categorias). Fortalece funções executivas e flexibilidade cognitiva."
    }
  ];
  
  const developmentTopics = [
    {
      id: "cognitive",
      title: "1. Desenvolvimento Cognitivo",
      description: "",
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: "social",
      title: "2. Desenvolvimento Social",
      description: "",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "emotional",
      title: "3. Desenvolvimento Emocional",
      description: "",
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: "motor",
      title: "4. Desenvolvimento Motor",
      description: "",
      icon: <Move className="h-5 w-5" />
    },
    {
      id: "language",
      title: "5. Desenvolvimento da Linguagem",
      description: "",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: "moral",
      title: "6. Desenvolvimento Moral",
      description: "",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: "creative",
      title: "7. Desenvolvimento Criativo",
      description: "",
      icon: <Music className="h-5 w-5" />
    },
    {
      id: "psychosexual",
      title: "8. Desenvolvimento Psicossexual",
      description: "",
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "psychosocial",
      title: "9. Desenvolvimento Psicossocial",
      description: "",
      icon: <User className="h-5 w-5" />
    },
    {
      id: "intellectual",
      title: "10. Desenvolvimento Intelectual",
      description: "",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      id: "adaptive",
      title: "11. Desenvolvimento Adaptativo",
      description: "",
      icon: <HelpingHand className="h-5 w-5" />
    },
    {
      id: "spiritual",
      title: "12. Desenvolvimento Espiritual",
      description: "",
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: "sensorial",
      title: "13. Desenvolvimento Sensorial",
      description: "",
      icon: <Eye className="h-5 w-5" />
    },
    {
      id: "self-regulation",
      title: "14. Desenvolvimento da Autorregulação",
      description: "",
      icon: <Flame className="h-5 w-5" />
    },
    {
      id: "identity",
      title: "15. Desenvolvimento da Identidade",
      description: "",
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: "interpersonal",
      title: "16. Desenvolvimento Interpessoal",
      description: "",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "executive",
      title: "17. Desenvolvimento Executivo",
      description: "",
      icon: <Puzzle className="h-5 w-5" />
    },
    {
      id: "cultural",
      title: "18. Desenvolvimento Cultural",
      description: "",
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: "neurological",
      title: "19. Desenvolvimento Neurológico",
      description: "",
      icon: <FlaskConical className="h-5 w-5" />
    },
    {
      id: "vocational",
      title: "20. Desenvolvimento Vocacional",
      description: "",
      icon: <Target className="h-5 w-5" />
    },
  ];

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Atividades Musicoterapeuta</h1>
        <p className="text-muted-foreground">Selecione uma área para explorar atividades e recursos relacionados</p>
      </div>

      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {developmentTopics.map((topic) => (
          <Card 
            key={topic.id} 
            className="transition-all hover:shadow-md cursor-pointer animate-fade-in"
            onClick={() => setSelectedCategory(topic.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {topic.icon}
                </div>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
              </div>
            </CardHeader>
            {topic.description && (
              <CardContent>
                <CardDescription className="text-sm">
                  {topic.description}
                </CardDescription>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Dialog for Cognitive Development Activities */}
      <Dialog open={selectedCategory === 'cognitive'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Brain className="h-5 w-5" />
              Desenvolvimento Cognitivo
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para estimular o desenvolvimento cognitivo
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {cognitiveActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
