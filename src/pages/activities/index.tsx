
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Brain, Users, Heart, Hand, Globe, BookOpen, Music, Eye, Zap, Cog, User, MessageSquare, Move } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export default function ActivitiesPage() {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Development categories with icons
  const categories = [
    { id: "all", name: "Todas as Atividades", icon: <ListChecks className="h-4 w-4" /> },
    { id: "cognitive", name: "Desenvolvimento Cognitivo", icon: <Brain className="h-4 w-4" /> },
    { id: "social", name: "Desenvolvimento Social", icon: <Users className="h-4 w-4" /> },
    { id: "emotional", name: "Desenvolvimento Emocional", icon: <Heart className="h-4 w-4" /> },
    { id: "motor", name: "Desenvolvimento Motor", icon: <Move className="h-4 w-4" /> },
    { id: "language", name: "Desenvolvimento da Linguagem", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "moral", name: "Desenvolvimento Moral", icon: <BookOpen className="h-4 w-4" /> },
    { id: "creative", name: "Desenvolvimento Criativo", icon: <Music className="h-4 w-4" /> },
    { id: "sensory", name: "Desenvolvimento Sensorial", icon: <Eye className="h-4 w-4" /> },
    { id: "self-regulation", name: "Desenvolvimento da Autorregulação", icon: <Zap className="h-4 w-4" /> },
    { id: "executive", name: "Desenvolvimento Executivo", icon: <Cog className="h-4 w-4" /> },
    { id: "identity", name: "Desenvolvimento da Identidade", icon: <User className="h-4 w-4" /> },
    { id: "adaptive", name: "Desenvolvimento Adaptativo", icon: <Hand className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <ListChecks className="h-6 w-6 md:h-8 md:w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Atividades</h1>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.filter(cat => cat.id !== "all").map((category) => (
          <Card key={category.id} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <CardTitle className="text-lg md:text-xl">{category.name}</CardTitle>
              </div>
              <CardDescription className="text-sm md:text-base">
                {getCategoryDescription(category.id)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Clique no tópico acima para ver atividades relacionadas a este desenvolvimento.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to get category descriptions
function getCategoryDescription(categoryId: string): string {
  switch (categoryId) {
    case "cognitive":
      return "Foco na aquisição de habilidades de pensamento, memória, resolução de problemas e raciocínio lógico.";
    case "social":
      return "Habilidades para interagir com outros, construir relacionamentos e compreender normas sociais.";
    case "emotional":
      return "Capacidade de reconhecer, expressar e regular emoções (ex.: inteligência emocional).";
    case "motor":
      return "Coordenação de grandes músculos (motor grosso) e movimentos precisos (motor fino).";
    case "language":
      return "Aquisição de comunicação verbal e não verbal, vocabulário e gramática.";
    case "moral":
      return "Evolução da compreensão de certo/errado e valores éticos.";
    case "creative":
      return "Habilidades para expressar ideias de forma inovadora (arte, música, escrita).";
    case "sensory":
      return "Processamento e integração de estímulos sensoriais (visão, audição, tato).";
    case "self-regulation":
      return "Capacidade de controlar impulsos, emoções e comportamentos.";
    case "executive":
      return "Funções como planejamento, organização e tomada de decisões.";
    case "identity":
      return "Formação do autoconceito, autoestima e senso de pertencimento.";
    case "adaptive":
      return "Habilidades práticas para a vida diária (autocuidado, gestão do tempo).";
    default:
      return "";
  }
}
