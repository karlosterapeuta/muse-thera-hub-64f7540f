import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Music, Tag, BookOpen, PanelTopOpen, Brain, Users, Heart, Hand, Globe, Puzzle, Eye, Target, Dna, User, Cog, MessageSquare, Move, Flower, Zap } from "lucide-react";
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

  // Music therapy activities for autism spectrum disorder with development categories
  const teaActivities = [
    {
      title: "Improvisação Musical",
      description: "Permita que o paciente explore instrumentos livremente, apoiando a expressão criativa e a comunicação não-verbal.",
      focus: "Comunicação, Auto-expressão",
      materials: "Diversos instrumentos de fácil manuseio (tambores, maracas, xilofones)",
      instructions: "Comece apresentando cada instrumento. Deixe o paciente explorar livremente e responda musicalmente às suas iniciativas para estabelecer diálogo musical.",
      categories: ["creative", "emotional", "self-regulation"]
    },
    {
      title: "Música e Movimento Estruturado",
      description: "Atividades musicais com movimentos corporais específicos para desenvolver coordenação e sequenciamento.",
      focus: "Coordenação motora, Sequenciamento, Atenção compartilhada",
      materials: "Música gravada ou instrumento rítmico, espaço para movimento",
      instructions: "Crie canções simples com gestos correspondentes (ex: 'Cabeça, Ombro, Joelho e Pé'). Mantenha estrutura e previsibilidade nas atividades.",
      categories: ["motor", "cognitive", "social"]
    },
    {
      title: "Canções de Rotina",
      description: "Músicas específicas para marcar transições e rotinas diárias.",
      focus: "Previsibilidade, Redução de ansiedade, Compreensão de rotinas",
      materials: "Instrumentos simples, cartões visuais com imagens das rotinas",
      instructions: "Crie canções curtas e repetitivas para momentos específicos da sessão (início, transições, despedida). Use sempre as mesmas melodias para cada momento.",
      categories: ["adaptive", "self-regulation", "executive"]
    },
    {
      title: "Criação de Histórias Musicais",
      description: "Construção de narrativas através de sons e músicas.",
      focus: "Imaginação, Sequenciamento, Habilidades narrativas",
      materials: "Instrumentos variados, objetos relacionados à história, ilustrações",
      instructions: "Conte uma história simples usando sons e músicas. Encoraje o paciente a participar produzindo sons para diferentes personagens ou eventos da história.",
      categories: ["language", "cognitive", "creative"]
    },
    {
      title: "Diálogo Musical",
      description: "Troca de 'frases musicais' entre terapeuta e paciente.",
      focus: "Comunicação, Tomada de turnos, Imitação",
      materials: "Pares de instrumentos similares (tambores, chocalhos)",
      instructions: "Estabeleça um padrão simples e espere que o paciente responda. Comece com imitação e gradualmente estimule respostas variadas. Respeite o tempo do paciente.",
      categories: ["social", "language", "emotional"]
    },
    {
      title: "Jogos de Sino Musical",
      description: "Utilização de sinos coloridos para desenvolver habilidades de discriminação auditiva e visual.",
      focus: "Percepção auditiva, Discriminação visual, Atenção",
      materials: "Conjunto de sinos musicais coloridos, cartões coloridos correspondentes",
      instructions: "Toque um sino e peça ao paciente para identificar a cor ou tocar o mesmo sino. Aumente gradualmente a complexidade com sequências de cores/sons.",
      categories: ["sensory", "cognitive", "language"]
    },
    {
      title: "Musicoterapia com Instrumentos de Percussão",
      description: "Uso de instrumentos de percussão para trabalhar controle de impulsos e coordenação.",
      focus: "Controle de impulsos, Coordenação, Expressão emocional",
      materials: "Variedade de instrumentos de percussão (tambores, pandeiros, clavas)",
      instructions: "Estabeleça ritmos simples e peça ao paciente para seguir. Trabalhe conceitos como 'rápido/devagar', 'forte/fraco' e explore diferentes emoções através dos sons.",
      categories: ["motor", "self-regulation", "emotional"]
    },
    {
      title: "Jogos de Escuta Ativa",
      description: "Atividades para desenvolver a capacidade de escuta e atenção através da música.",
      focus: "Atenção auditiva, Processamento sensorial, Foco",
      materials: "Sistema de som, músicas variadas, instrumentos para acompanhamento",
      instructions: "Toque músicas que alternam momentos de silêncio e som. O paciente deve responder de formas específicas aos estímulos sonoros (ex: parar/movimentar, levantar mão).",
      categories: ["sensory", "cognitive", "executive"]
    },
    {
      title: "Painel Sonoro",
      description: "Criação de um painel com diferentes texturas e sons para exploração sensorial.",
      focus: "Integração sensorial, Exploração tátil, Causa e efeito",
      materials: "Painel com diferentes materiais sonoros fixados (guizos, chocalhos, papéis)",
      instructions: "Permita a exploração livre do painel. Observe as preferências sensoriais e reações. Comente sobre os sons produzidos e incentive a exploração de todos os elementos.",
      categories: ["sensory", "motor", "cognitive"]
    },
    {
      title: "Canções com Suporte Visual",
      description: "Uso de canções com apoio de imagens ou objetos para facilitar a compreensão.",
      focus: "Compreensão verbal, Associação visual-auditiva, Vocabulário",
      materials: "Objetos ou imagens relacionados às canções, instrumento para acompanhamento",
      instructions: "Selecione canções que mencionam objetos concretos. Apresente os objetos ou imagens durante a música. Incentive o paciente a manipular os objetos no momento apropriado da canção.",
      categories: ["language", "cognitive", "sensory"]
    },
    {
      title: "Composição Musical Estruturada",
      description: "Criação musical dentro de estrutura predefinida para desenvolver flexibilidade cognitiva.",
      focus: "Flexibilidade, Criatividade dentro de limites, Organização",
      materials: "Instrumentos de fácil execução, cartões com estruturas musicais simples",
      instructions: "Ofereça uma estrutura clara (ex: AABA) representada visualmente. Ajude o paciente a criar partes musicais distintas para cada seção da estrutura.",
      categories: ["cognitive", "creative", "executive"]
    },
    {
      title: "Musicoterapia com Instrumento Adaptado",
      description: "Utilização de instrumentos adaptados às necessidades motoras específicas.",
      focus: "Habilidades motoras, Autoeficácia, Participação musical",
      materials: "Instrumentos adaptados (com alças, suportes, cores), materiais para adaptação",
      instructions: "Avalie as habilidades motoras e crie adaptações específicas. Facilite a exploração bem-sucedida do instrumento, celebrando as conquistas.",
      categories: ["motor", "adaptive", "identity"]
    },
    {
      title: "Espelhamento Musical",
      description: "Imitação mútua de movimentos e sons para desenvolver consciência corporal e conexão social.",
      focus: "Imitação, Consciência corporal, Conexão interpessoal",
      materials: "Instrumentos de percussão, espelho grande (opcional)",
      instructions: "Sente-se de frente para o paciente. Faça um movimento simples com som e peça que ele imite. Gradualmente, troque os papéis permitindo que o paciente lidere a atividade.",
      categories: ["social", "motor", "identity"]
    },
    {
      title: "Jogo Musical de Reconhecimento Emocional",
      description: "Associação de músicas a diferentes emoções para desenvolver inteligência emocional.",
      focus: "Identificação emocional, Expressão de sentimentos, Empatia",
      materials: "Cartões com expressões emocionais, seleção de músicas que evocam diferentes emoções",
      instructions: "Apresente cartões com expressões emocionais básicas. Toque trechos musicais e peça que o paciente identifique qual emoção a música representa, associando ao cartão correspondente.",
      categories: ["emotional", "social", "cognitive"]
    },
    {
      title: "Construção de Instrumentos Musicais",
      description: "Criação de instrumentos simples utilizando materiais recicláveis.",
      focus: "Criatividade, Habilidades motoras finas, Conceitos científicos",
      materials: "Materiais recicláveis, fitas, elásticos, sementes, tampas",
      instructions: "Planeje a construção de um instrumento simples como chocalho ou tambor. Guie o paciente pelos passos da montagem, explorando os sons produzidos pelos diferentes materiais.",
      categories: ["motor", "creative", "cognitive"]
    },
    {
      title: "Musicalização de Regras Sociais",
      description: "Criação de canções para ensinar e reforçar regras sociais e comportamentos esperados.",
      focus: "Habilidades sociais, Compreensão de regras, Autorregulação",
      materials: "Instrumento harmônico, cartões ilustrativos de regras sociais",
      instructions: "Identifique uma regra social a ser trabalhada. Componha uma canção simples e repetitiva que descreva a regra e as etapas para cumpri-la. Use refrões memorizáveis.",
      categories: ["social", "moral", "language"]
    },
    {
      title: "Orquestra de Boomwhackers",
      description: "Utilização de tubos sonoros coloridos para atividades de coordenação em grupo.",
      focus: "Coordenação, Cooperação, Percepção de cores e sons",
      materials: "Conjunto de tubos Boomwhackers, cartões coloridos correspondentes",
      instructions: "Distribua tubos de diferentes cores. Apresente códigos visuais (cartões coloridos) e ensine o paciente a tocar seu tubo quando seu código aparecer. Crie sequências musicais colaborativas.",
      categories: ["motor", "social", "sensory"]
    },
    {
      title: "Mapa Musical de Emoções",
      description: "Criação de um mapa personalizado que associa músicas a estados emocionais.",
      focus: "Autorregulação emocional, Autoconhecimento, Estratégias de enfrentamento",
      materials: "Papel grande, marcadores, dispositivo para reproduzir músicas",
      instructions: "Crie um mapa visual com diferentes zonas emocionais. Ajude o paciente a identificar músicas que o acalmam, animam ou ajudam em diferentes estados emocionais, adicionando-as ao mapa.",
      categories: ["emotional", "self-regulation", "identity"]
    },
    {
      title: "Desafio Rítmico Progressivo",
      description: "Sequência de atividades rítmicas com dificuldade crescente para desenvolver funções executivas.",
      focus: "Memória de trabalho, Atenção sustentada, Controle inibitório",
      materials: "Instrumentos de percussão, metrônomo ou app de ritmo",
      instructions: "Comece com padrões rítmicos simples para imitação. Aumente gradualmente a complexidade, incluindo pausas e variações de intensidade. Introduza o conceito de 'sinal de parada' para trabalhar controle inibitório.",
      categories: ["executive", "cognitive", "motor"]
    },
    {
      title: "História Sonora Pessoal",
      description: "Criação de um 'livro sonoro' que representa elementos importantes da história de vida do paciente.",
      focus: "Identidade, Narrativa pessoal, Memória autobiográfica",
      materials: "Álbum ou caixa para colagem, gravador, fotos, instrumentos variados",
      instructions: "Ajude o paciente a selecionar eventos significativos de sua vida. Para cada evento, crie ou selecione um som ou música representativa. Monte um 'livro' que conta sua história em sons.",
      categories: ["identity", "emotional", "language"]
    }
  ];

  // Filter activities based on selected category
  const filteredActivities = selectedCategory === "all" 
    ? teaActivities 
    : teaActivities.filter(activity => activity.categories && activity.categories.includes(selectedCategory));

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
        {filteredActivities.map((activity, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-lg md:text-xl">{activity.title}</CardTitle>
              </div>
              <CardDescription className="text-sm md:text-base">{activity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {activity.categories && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {activity.categories.map(catId => {
                      const category = categories.find(c => c.id === catId);
                      return category ? (
                        <span 
                          key={catId} 
                          className="inline-flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded text-xs"
                        >
                          {category.icon}
                          <span>{category.name.replace('Desenvolvimento ', '')}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">Foco:</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 ml-6">{activity.focus}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">Materiais:</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 ml-6">{activity.materials}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PanelTopOpen className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">Instruções:</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 ml-6">{activity.instructions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
