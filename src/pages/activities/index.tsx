
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
      description: "Dividido em: Motor grosso: Coordenação de grandes músculos (correr, pular). Motor fino: Movimentos precisos (escrever, usar tesoura).",
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
      description: "Formação do autoconceito, autoestima e senso de pertencimento.",
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
    </div>
  );
}
