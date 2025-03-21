
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ListChecks, Plus, Trash, Music, Tag, BookOpen, PanelTopOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<{ id: number; text: string; completed: boolean }[]>([
    { id: 1, text: "Preparar material para sessão de grupo", completed: false },
    { id: 2, text: "Revisar avaliações de pacientes", completed: true },
    { id: 3, text: "Organizar instrumentos musicais", completed: false },
  ]);
  
  const [newActivity, setNewActivity] = useState("");

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setActivities([
        ...activities, 
        { 
          id: Date.now(), 
          text: newActivity, 
          completed: false 
        }
      ]);
      setNewActivity("");
    }
  };

  const toggleComplete = (id: number) => {
    setActivities(
      activities.map(activity => 
        activity.id === id 
          ? { ...activity, completed: !activity.completed } 
          : activity
      )
    );
  };

  const deleteActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  // Music therapy activities for autism spectrum disorder
  const teaActivities = [
    {
      title: "Improvisação Musical",
      description: "Permita que o paciente explore instrumentos livremente, apoiando a expressão criativa e a comunicação não-verbal.",
      focus: "Comunicação, Auto-expressão",
      materials: "Diversos instrumentos de fácil manuseio (tambores, maracas, xilofones)",
      instructions: "Comece apresentando cada instrumento. Deixe o paciente explorar livremente e responda musicalmente às suas iniciativas para estabelecer diálogo musical."
    },
    {
      title: "Música e Movimento Estruturado",
      description: "Atividades musicais com movimentos corporais específicos para desenvolver coordenação e sequenciamento.",
      focus: "Coordenação motora, Sequenciamento, Atenção compartilhada",
      materials: "Música gravada ou instrumento rítmico, espaço para movimento",
      instructions: "Crie canções simples com gestos correspondentes (ex: 'Cabeça, Ombro, Joelho e Pé'). Mantenha estrutura e previsibilidade nas atividades."
    },
    {
      title: "Canções de Rotina",
      description: "Músicas específicas para marcar transições e rotinas diárias.",
      focus: "Previsibilidade, Redução de ansiedade, Compreensão de rotinas",
      materials: "Instrumentos simples, cartões visuais com imagens das rotinas",
      instructions: "Crie canções curtas e repetitivas para momentos específicos da sessão (início, transições, despedida). Use sempre as mesmas melodias para cada momento."
    },
    {
      title: "Criação de Histórias Musicais",
      description: "Construção de narrativas através de sons e músicas.",
      focus: "Imaginação, Sequenciamento, Habilidades narrativas",
      materials: "Instrumentos variados, objetos relacionados à história, ilustrações",
      instructions: "Conte uma história simples usando sons e músicas. Encoraje o paciente a participar produzindo sons para diferentes personagens ou eventos da história."
    },
    {
      title: "Diálogo Musical",
      description: "Troca de 'frases musicais' entre terapeuta e paciente.",
      focus: "Comunicação, Tomada de turnos, Imitação",
      materials: "Pares de instrumentos similares (tambores, chocalhos)",
      instructions: "Estabeleça um padrão simples e espere que o paciente responda. Comece com imitação e gradualmente estimule respostas variadas. Respeite o tempo do paciente."
    },
  ];

  // Music therapy activities for mental health disorders
  const mentalHealthActivities = [
    {
      title: "Escrita de Canções",
      description: "Composição colaborativa de letras e melodias expressando sentimentos e experiências.",
      focus: "Expressão emocional, Processamento de traumas, Autoconhecimento",
      materials: "Instrumento harmônico (violão/teclado), papel, caneta, gravador",
      instructions: "Inicie com um tema ou sentimento a explorar. Ajude o paciente a transformar suas palavras em versos e encontrar uma melodia que ressoe com o conteúdo emocional."
    },
    {
      title: "Improvisação com Enfoque Emocional",
      description: "Exploração musical livre focada em emoções específicas.",
      focus: "Regulação emocional, Catarse, Mindfulness",
      materials: "Variedade de instrumentos expressivos (tambores, piano, metalofones)",
      instructions: "Proponha uma emoção como ponto de partida. Explore como essa emoção soa musicalmente e permita que o paciente expresse livremente através dos instrumentos."
    },
    {
      title: "Análise de Letras",
      description: "Discussão do conteúdo lírico de canções significativas para o paciente.",
      focus: "Insight, Normalização de experiências, Identificação de padrões de pensamento",
      materials: "Dispositivo para reprodução musical, letras impressas, material para anotações",
      instructions: "Peça que o paciente escolha canções significativas. Explore juntos as letras, identificando conexões com a vida do paciente e explorando perspectivas alternativas."
    },
    {
      title: "Relaxamento Musical Guiado",
      description: "Indução de estados de relaxamento através de música e visualização.",
      focus: "Redução de ansiedade, Manejo do estresse, Autocuidado",
      materials: "Música calma gravada ou instrumento suave como kalimba ou flauta, ambiente confortável",
      instructions: "Crie um ambiente tranquilo. Guie o paciente através de respiração e relaxamento muscular enquanto a música toca. Incorpore visualizações positivas se apropriado."
    },
    {
      title: "Drumming em Grupo",
      description: "Percussão coletiva com foco no ritmo compartilhado e expressão.",
      focus: "Conexão social, Controle de impulsos, Redução de isolamento",
      materials: "Diferentes instrumentos de percussão, cadeiras em círculo",
      instructions: "Comece com um ritmo simples e peça que os participantes se juntem. Explore variações de intensidade, velocidade e complexidade. Reserve momentos para improvisação individual."
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <ListChecks className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Atividades</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nova Atividade</CardTitle>
          <CardDescription>Adicione uma nova atividade à sua lista</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Digite a atividade..."
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddActivity();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleAddActivity}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Minhas Atividades</TabsTrigger>
          <TabsTrigger value="tea">Atividades para TEA</TabsTrigger>
          <TabsTrigger value="mental">Atividades para Saúde Mental</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <div className="grid gap-4">
            {activities.map((activity) => (
              <Card key={activity.id} className={activity.completed ? "bg-gray-50" : ""}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`activity-${activity.id}`} 
                      checked={activity.completed}
                      onCheckedChange={() => toggleComplete(activity.id)}
                    />
                    <Label 
                      htmlFor={`activity-${activity.id}`}
                      className={`${activity.completed ? "line-through text-gray-500" : ""}`}
                    >
                      {activity.text}
                    </Label>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteActivity(activity.id)}>
                    <Trash className="h-4 w-4 text-gray-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma atividade cadastrada. Adicione uma nova atividade acima.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tea">
          <div className="grid gap-6 md:grid-cols-2">
            {teaActivities.map((activity, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{activity.title}</CardTitle>
                  </div>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-medium">Foco:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{activity.focus}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">Materiais:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{activity.materials}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <PanelTopOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">Instruções:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{activity.instructions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mental">
          <div className="grid gap-6 md:grid-cols-2">
            {mentalHealthActivities.map((activity, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{activity.title}</CardTitle>
                  </div>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-medium">Foco:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{activity.focus}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">Materiais:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{activity.materials}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <PanelTopOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">Instruções:</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{activity.instructions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
