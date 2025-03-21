
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Music, Tag, BookOpen, PanelTopOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivitiesPage() {
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
    {
      title: "Jogos de Sino Musical",
      description: "Utilização de sinos coloridos para desenvolver habilidades de discriminação auditiva e visual.",
      focus: "Percepção auditiva, Discriminação visual, Atenção",
      materials: "Conjunto de sinos musicais coloridos, cartões coloridos correspondentes",
      instructions: "Toque um sino e peça ao paciente para identificar a cor ou tocar o mesmo sino. Aumente gradualmente a complexidade com sequências de cores/sons."
    },
    {
      title: "Musicoterapia com Instrumentos de Percussão",
      description: "Uso de instrumentos de percussão para trabalhar controle de impulsos e coordenação.",
      focus: "Controle de impulsos, Coordenação, Expressão emocional",
      materials: "Variedade de instrumentos de percussão (tambores, pandeiros, clavas)",
      instructions: "Estabeleça ritmos simples e peça ao paciente para seguir. Trabalhe conceitos como 'rápido/devagar', 'forte/fraco' e explore diferentes emoções através dos sons."
    },
    {
      title: "Jogos de Escuta Ativa",
      description: "Atividades para desenvolver a capacidade de escuta e atenção através da música.",
      focus: "Atenção auditiva, Processamento sensorial, Foco",
      materials: "Sistema de som, músicas variadas, instrumentos para acompanhamento",
      instructions: "Toque músicas que alternam momentos de silêncio e som. O paciente deve responder de formas específicas aos estímulos sonoros (ex: parar/movimentar, levantar mão)."
    },
    {
      title: "Painel Sonoro",
      description: "Criação de um painel com diferentes texturas e sons para exploração sensorial.",
      focus: "Integração sensorial, Exploração tátil, Causa e efeito",
      materials: "Painel com diferentes materiais sonoros fixados (guizos, chocalhos, papéis)",
      instructions: "Permita a exploração livre do painel. Observe as preferências sensoriais e reações. Comente sobre os sons produzidos e incentive a exploração de todos os elementos."
    },
    {
      title: "Canções com Suporte Visual",
      description: "Uso de canções com apoio de imagens ou objetos para facilitar a compreensão.",
      focus: "Compreensão verbal, Associação visual-auditiva, Vocabulário",
      materials: "Objetos ou imagens relacionados às canções, instrumento para acompanhamento",
      instructions: "Selecione canções que mencionam objetos concretos. Apresente os objetos ou imagens durante a música. Incentive o paciente a manipular os objetos no momento apropriado da canção."
    },
    {
      title: "Composição Musical Estruturada",
      description: "Criação musical dentro de estrutura predefinida para desenvolver flexibilidade cognitiva.",
      focus: "Flexibilidade, Criatividade dentro de limites, Organização",
      materials: "Instrumentos de fácil execução, cartões com estruturas musicais simples",
      instructions: "Ofereça uma estrutura clara (ex: AABA) representada visualmente. Ajude o paciente a criar partes musicais distintas para cada seção da estrutura."
    },
    {
      title: "Musicoterapia com Instrumento Adaptado",
      description: "Utilização de instrumentos adaptados às necessidades motoras específicas.",
      focus: "Habilidades motoras, Autoeficácia, Participação musical",
      materials: "Instrumentos adaptados (com alças, suportes, cores), materiais para adaptação",
      instructions: "Avalie as habilidades motoras e crie adaptações específicas. Facilite a exploração bem-sucedida do instrumento, celebrando as conquistas."
    }
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

      <Tabs defaultValue="tea" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="tea">Atividades para TEA</TabsTrigger>
          <TabsTrigger value="mental">Atividades para Saúde Mental</TabsTrigger>
        </TabsList>
        
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
