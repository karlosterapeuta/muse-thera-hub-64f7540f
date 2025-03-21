import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brain, Users, Heart, Move, MessageSquare, BookOpen, Music, 
  Zap, User, Lightbulb, HelpingHand, Globe, Puzzle, Target, 
  Eye, Flame, Shield, GraduationCap, FlaskConical
} from "lucide-react";

export default function ActivitiesPage() {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const developmentTopics = [
    {
      id: "cognitive",
      title: "Desenvolvimento Cognitivo",
      description: "Foco na aquisição de habilidades de pensamento, memória, resolução de problemas e raciocínio lógico (ex.: teoria de Piaget).",
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: "social",
      title: "Desenvolvimento Social",
      description: "Habilidades para interagir com outros, construir relacionamentos e compreender normas sociais.",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "emotional",
      title: "Desenvolvimento Emocional",
      description: "Capacidade de reconhecer, expressar e regular emoções (ex.: inteligência emocional).",
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: "motor",
      title: "Desenvolvimento Motor",
      description: "Dividido em: Motor grosso: Coordenação de grandes músculos (correr, pular). Motor fino: Movimentos precisos (escrever, usar tesoura).",
      icon: <Move className="h-5 w-5" />
    },
    {
      id: "language",
      title: "Desenvolvimento da Linguagem",
      description: "Aquisição de comunicação verbal e não verbal, vocabulário e gramática.",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: "moral",
      title: "Desenvolvimento Moral",
      description: "Evolução da compreensão de certo/errado e valores éticos (ex.: teoria de Kohlberg).",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: "creative",
      title: "Desenvolvimento Criativo",
      description: "Habilidades para expressar ideias de forma inovadora (arte, música, escrita).",
      icon: <Music className="h-5 w-5" />
    },
    {
      id: "psychosexual",
      title: "Desenvolvimento Psicossexual",
      description: "Estágios relacionados à sexualidade e identidade de gênero (ex.: teoria de Freud).",
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "psychosocial",
      title: "Desenvolvimento Psicossocial",
      description: "Integração de fatores psicológicos e sociais ao longo da vida (ex.: estágios de Erikson).",
      icon: <User className="h-5 w-5" />
    },
    {
      id: "intellectual",
      title: "Desenvolvimento Intelectual",
      description: "Capacidade de aprender, processar informações e aplicar conhecimento (ex.: QI, habilidades acadêmicas).",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      id: "adaptive",
      title: "Desenvolvimento Adaptativo",
      description: "Habilidades práticas para a vida diária (autocuidado, gestão do tempo).",
      icon: <HelpingHand className="h-5 w-5" />
    },
    {
      id: "spiritual",
      title: "Desenvolvimento Espiritual",
      description: "Exploração de significado, propósito e conexão com algo maior (valores, crenças).",
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: "sensorial",
      title: "Desenvolvimento Sensorial",
      description: "Processamento e integração de estímulos sensoriais (visão, audição, tato).",
      icon: <Eye className="h-5 w-5" />
    },
    {
      id: "self-regulation",
      title: "Desenvolvimento da Autorregulação",
      description: "Capacidade de controlar impulsos, emoções e comportamentos.",
      icon: <Flame className="h-5 w-5" />
    },
    {
      id: "identity",
      title: "Desenvolvimento da Identidade",
      description: "Formação do autoconceito, autoestima e senso de pertencimento.",
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: "interpersonal",
      title: "Desenvolvimento Interpessoal",
      description: "Habilidades para construir e manter relacionamentos saudáveis.",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "executive",
      title: "Desenvolvimento Executivo",
      description: "Funções como planejamento, organização e tomada de decisões (ex.: lobo frontal).",
      icon: <Puzzle className="h-5 w-5" />
    },
    {
      id: "cultural",
      title: "Desenvolvimento Cultural",
      description: "Compreensão e adaptação a normas, tradições e valores de um grupo social.",
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: "neurological",
      title: "Desenvolvimento Neurológico",
      description: "Maturação do sistema nervoso e conexões cerebrais.",
      icon: <FlaskConical className="h-5 w-5" />
    },
    {
      id: "vocational",
      title: "Desenvolvimento Vocacional",
      description: "Preparação para escolhas profissionais e desenvolvimento de habilidades laborais.",
      icon: <Target className="h-5 w-5" />
    },
  ];

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Áreas de Desenvolvimento</h1>
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
            <CardContent>
              <CardDescription className="text-sm">
                {topic.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
