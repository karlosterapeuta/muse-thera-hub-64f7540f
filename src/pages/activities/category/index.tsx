
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Brain, Users, Heart, Move, MessageSquare, BookOpen, Music, 
  Zap, User, Lightbulb, HelpingHand, Globe, Puzzle, Target, 
  Eye, Flame, Shield, GraduationCap, FlaskConical, ShieldCheck,
  Sparkles, Church, Cross, Network, ArrowLeft, Fingerprint
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { enhancedActivitiesData } from "../data/enhanced-activities-data";
import { getCombinedActivities } from "../utils/activityMigrator";
import { Activity } from "../types";

// Using Activity type from types.ts

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<{name: string, label: string, icon: JSX.Element} | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories = [
    { name: "cognitive", label: "Cognitivas", icon: <Brain className="h-5 w-5" /> },
    { name: "social", label: "Sociais", icon: <Users className="h-5 w-5" /> },
    { name: "emotional", label: "Emocionais", icon: <Heart className="h-5 w-5" /> },
    { name: "motor", label: "Motoras", icon: <Move className="h-5 w-5" /> },
    { name: "language", label: "Linguagem", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "moral", label: "Morais", icon: <Shield className="h-5 w-5" /> },
    { name: "creative", label: "Criativas", icon: <Lightbulb className="h-5 w-5" /> },
    { name: "psychosexual", label: "Psicossexuais", icon: <User className="h-5 w-5" /> },
    { name: "psychosocial", label: "Psicossociais", icon: <Users className="h-5 w-5" /> },
    { name: "intellectual", label: "Intelectuais", icon: <GraduationCap className="h-5 w-5" /> },
    { name: "adaptive", label: "Adaptativas", icon: <Puzzle className="h-5 w-5" /> },
    { name: "spiritual", label: "Espirituais", icon: <Church className="h-5 w-5" /> },
    { name: "neurological", label: "Desenvolvimento Neurológico", icon: <Network className="h-5 w-5" /> },
    { name: "identity", label: "Identidade", icon: <Fingerprint className="h-5 w-5" /> }
  ];

  useEffect(() => {
    // Find the category info
    const category = categories.find(cat => cat.name === categoryId);
    if (category) {
      setCategoryInfo(category);
    }

    // Set the activities for this category (combined enhanced + migrated)
    if (categoryId) {
      const combinedData = getCombinedActivities(enhancedActivitiesData);
      setActivities(combinedData[categoryId] || []);
    } else {
      // If category not found, go back to activities page
      navigate('/activities');
    }
  }, [categoryId, navigate]);

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleBackClick = () => {
    navigate('/activities');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 p-0 h-auto" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
        </Button>
        {categoryInfo && (
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
              {categoryInfo.icon}
            </div>
            <h1 className="text-3xl font-bold">Atividades {categoryInfo.label}</h1>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Descrição da Categoria</h2>
          <p className="text-muted-foreground">
            {categoryId === "cognitive" && "Atividades focadas no desenvolvimento de habilidades cognitivas como memória, atenção, resolução de problemas e processamento de informações. Estas atividades estimulam o pensamento lógico e as funções executivas."}
            {categoryId === "social" && "Atividades que promovem interação, cooperação e desenvolvimento de habilidades sociais. Focadas na construção de relacionamentos saudáveis, empatia e comunicação interpessoal."}
            {categoryId === "emotional" && "Atividades para reconhecimento, expressão e regulação de emoções. Ajudam a desenvolver inteligência emocional e estratégias para lidar com diferentes estados emocionais."}
            {categoryId === "motor" && "Atividades que trabalham coordenação motora, equilíbrio, ritmo corporal e expressão física. Integram música e movimento para desenvolvimento motor global."}
            {categoryId === "language" && "Atividades voltadas para o desenvolvimento da comunicação verbal e não-verbal, vocabulário, estruturação frasal e compreensão linguística através da música."}
            {categoryId === "moral" && "Atividades que exploram valores éticos, princípios morais e desenvolvimento do caráter, utilizando a música como veículo para reflexão sobre questões morais."}
            {categoryId === "creative" && "Atividades que estimulam a criatividade, improvisação e expressão artística livre. Focadas no desenvolvimento do pensamento divergente e na exploração de novas possibilidades."}
            {categoryId === "psychosexual" && "Atividades que abordam o desenvolvimento saudável da identidade, autoconhecimento corporal e estabelecimento de limites saudáveis nas relações, de forma adequada a cada faixa etária."}
            {categoryId === "psychosocial" && "Atividades baseadas nos estágios de desenvolvimento psicossocial, promovendo integração social, formação de identidade e bem-estar em diferentes fases da vida."}
            {categoryId === "intellectual" && "Atividades que estimulam o raciocínio abstrato, análise crítica e habilidades intelectuais superiores, integrando música com outros domínios de conhecimento."}
            {categoryId === "adaptive" && "Atividades que desenvolvem resiliência, flexibilidade e capacidade de adaptação a mudanças e desafios, fortalecendo recursos internos através da expressão musical."}
            {categoryId === "spiritual" && "Atividades que exploram a dimensão espiritual e transcendente da experiência humana, utilizando música como meio de conexão com valores e princípios cristãos."}
            {categoryId === "neurological" && "Atividades especificamente desenhadas para estimular diferentes regiões e funções cerebrais, promovendo neuroplasticidade e desenvolvimento neurológico saudável."}
            {categoryId === "identity" && "Atividades focadas no fortalecimento da identidade pessoal, autoconhecimento e expressão autêntica do eu. Estas atividades ajudam o paciente a explorar, reconhecer e consolidar aspectos de sua identidade através da expressão musical."}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Atividades</h2>
        <p className="text-sm text-muted-foreground">Total: {activities.length} atividades</p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {activities.map((activity) => (
          <AccordionItem key={activity.id} value={`item-${activity.id}`}>
            <AccordionTrigger className="hover:text-primary transition-colors">
              {activity.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-3">
                {activity.description}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleActivityClick(activity)}>
                Ver Detalhes
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedActivity && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedActivity.title}</DialogTitle>
                <DialogDescription>
                  Detalhes completos da atividade
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-1">Descrição</h3>
                <p className="text-muted-foreground mb-4">{selectedActivity.description}</p>
                
                <h3 className="text-lg font-medium mb-1">Benefícios</h3>
                <ul className="list-disc list-inside text-muted-foreground mb-4">
                  <li>Desenvolvimento de habilidades específicas relacionadas à categoria</li>
                  <li>Promoção da expressão musical e integração sensorial</li>
                  <li>Fortalecimento da motivação e engajamento terapêutico</li>
                </ul>
                
                <h3 className="text-lg font-medium mb-1">Adaptações Possíveis</h3>
                <p className="text-muted-foreground">
                  Esta atividade pode ser adaptada para diferentes faixas etárias, níveis de habilidade e contextos terapêuticos.
                  Considere ajustar a complexidade, duração e materiais utilizados conforme as necessidades específicas.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
