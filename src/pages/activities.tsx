import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { Music2, Target, Brain, Users, Heart, Lightbulb, UserPlus } from "lucide-react";

export default function Activities() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const activities = {
    "Comunicação e Expressão Verbal/Não Verbal": [
      {
        title: "Canções com Gestos",
        description: "Cantar canções acompanhadas de gestos específicos que representam o significado das palavras.",
        target: ["TEA", "TDAH", "Atraso de desenvolvimento"],
        materials: "Instrumentos harmônicos (violão/teclado), imagens/cartões com gestos",
        icon: Music2,
      },
      {
        title: "Completando Músicas",
        description: "Tocar músicas familiares e parar em momentos específicos para que o paciente complete verbalmente ou com instrumentos.",
        target: ["TEA", "Transtornos de linguagem", "Demência"],
        materials: "Reprodutor de áudio, instrumentos musicais simples",
        icon: Music2,
      },
      {
        title: "Improvisação com Alternância de Turnos",
        description: "Criar diálogos musicais onde o terapeuta e o paciente alternam-se tocando instrumentos.",
        target: ["TEA", "Transtornos de comunicação", "Ansiedade social"],
        materials: "Pares de instrumentos idênticos (tambores, chocalhos)",
        icon: Music2,
      },
      {
        title: "Composição de Histórias Musicais",
        description: "Narrar histórias utilizando sons e instrumentos para representar personagens ou eventos.",
        target: ["TEA", "Dificuldades de expressão emocional", "Transtornos de linguagem"],
        materials: "Diversos instrumentos, cartões com imagens de cenas/personagens",
        icon: Music2,
      },
      {
        title: "Associação Música-Imagem",
        description: "Tocar diferentes estilos musicais e pedir que o paciente associe a imagens ou emoções.",
        target: ["TEA", "Alexitimia", "Transtornos de processamento sensorial"],
        materials: "Reprodutor de áudio, cartões com imagens ou emoticons",
        icon: Music2,
      },
      {
        title: "Música e Palavras",
        description: "Criar músicas simples que incentivam a repetição de palavras ou frases específicas relacionadas a necessidades do paciente.",
        target: ["TEA", "Apraxia de fala", "Deficiência intelectual"],
        materials: "Instrumentos harmônicos, cartões com palavras alvo",
        icon: Music2,
      },
      {
        title: "Narrativa Musical",
        description: "Criar uma sequência musical que segue uma história, incentivando o paciente a narrar ou contribuir com partes da história.",
        target: ["TEA", "Disfluência", "Transtornos de ansiedade"],
        materials: "Instrumentos variados, livros de histórias ilustrados",
        icon: Music2,
      },
      {
        title: "Canto Dirigido com Técnicas Respiratórias",
        description: "Canções específicas com foco em padrões respiratórios que apoiam a vocalização e articulação.",
        target: ["Gagueira", "Disfonia", "Ansiedade"],
        materials: "Guia visual de respiração, instrumento harmônico para acompanhamento",
        icon: Music2,
      },
    ],
    "Interação Social": [
      {
        title: "Círculo de Tambores",
        description: "Atividade em grupo onde cada participante toca um tambor seguindo um ritmo ou criando novos padrões coletivamente.",
        target: ["TEA", "Ansiedade social", "TDAH"],
        materials: "Tambores variados, outros instrumentos de percussão",
        icon: Users,
      },
      {
        title: "Canções de Saudação e Despedida",
        description: "Utilizar músicas que incorporam os nomes dos participantes e incentivam reconhecimento mútuo.",
        target: ["TEA", "Transtorno de ansiedade social", "Timidez"],
        materials: "Instrumentos harmônicos, cartões com nomes e fotos",
        icon: Users,
      },
      {
        title: "Bandinha Rítmica",
        description: "Formar um grupo musical onde cada participante toca um instrumento diferente, seguindo a regência do terapeuta.",
        target: ["TEA", "TDAH", "Transtornos de conduta"],
        materials: "Conjunto de instrumentos variados, cartão visual de regência",
        icon: Users,
      },
      {
        title: "Dança das Cadeiras Musical",
        description: "Adaptação da brincadeira tradicional com foco na interação e menos na competição.",
        target: ["TEA", "Ansiedade", "Transtornos de humor"],
        materials: "Reprodutor de áudio, cadeiras, marcadores de solo",
        icon: Users,
      },
      {
        title: "Jogo Musical de Espelho",
        description: "Um participante cria um padrão rítmico ou movimento que deve ser imitado pelo grupo.",
        target: ["TEA", "Esquizofrenia", "Dificuldades de integração sensorial"],
        materials: "Instrumentos simples e idênticos para todos os participantes",
        icon: Users,
      },
      {
        title: "Orquestra de Sucata",
        description: "Construção coletiva de instrumentos com materiais reciclados, seguida de performance em grupo.",
        target: ["Fobia social", "Baixa autoestima", "TEA"],
        materials: "Materiais recicláveis diversos, ferramentas básicas, decorações",
        icon: Users,
      },
      {
        title: "Coral Terapêutico",
        description: "Grupo de canto com arranjos simplificados e adaptados para diferentes habilidades vocais.",
        target: ["Depressão", "Isolamento social", "TEA", "Trauma"],
        materials: "Partituras adaptadas, instrumentos de acompanhamento, sistema de som",
        icon: Users,
      },
      {
        title: "Karaokê Adaptado",
        description: "Versão modificada do karaokê com suporte visual, opções de duetos e ajuste de complexidade.",
        target: ["Ansiedade social", "TEA", "Mutismo seletivo"],
        materials: "Sistema audiovisual, microfones, letras impressas em grande formato",
        icon: Users,
      },
    ],
    "Regulação Sensorial e Emocional": [
      {
        title: "Relaxamento Musical Guiado",
        description: "Utilizar música de fundo calma enquanto guia o paciente através de exercícios de respiração e relaxamento.",
        target: ["Ansiedade", "TOD", "TDAH", "TEA"],
        materials: "Reprodutor de áudio, colchonetes, almofadas",
        icon: Heart,
      },
      {
        title: "Percussão Corporal Gradual",
        description: "Iniciar com batidas suaves no corpo e gradualmente aumentar ou diminuir a intensidade.",
        target: ["TEA", "Transtornos sensoriais", "TDAH"],
        materials: "Cartões com sequências de percussão corporal",
        icon: Heart,
      },
      {
        title: "Improvisação Emocional",
        description: "Usar instrumentos para expressar emoções específicas e discutir as sensações provocadas.",
        target: ["Transtornos de humor", "Alexitimia", "TEA"],
        materials: "Instrumentos diversos, cartões com emoções",
        icon: Heart,
      },
      {
        title: "Caixinha de Música Terapêutica",
        description: "Utilizar caixas musicais ou instrumentos suaves como parte de um ritual de autorregulação.",
        target: ["TEA", "Ansiedade", "Trauma"],
        materials: "Caixinhas de música, kalimbas, sinos tibetanos",
        icon: Heart,
      },
      {
        title: "Identificação Sonora de Emoções",
        description: "Tocar trechos musicais e pedir para o paciente identificar que emoção a música transmite.",
        target: ["TEA", "Transtornos de humor", "Alexitimia"],
        materials: "Reprodutor de áudio, cartões com expressões emocionais",
        icon: Heart,
      },
      {
        title: "Jornada Sonora",
        description: "Criar uma experiência imersiva com diferentes paisagens sonoras para estimular ou acalmar o sistema sensorial.",
        target: ["Transtornos sensoriais", "TEPT", "TEA"],
        materials: "Sistema de som com boa qualidade, colchonetes, vendas para os olhos",
        icon: Heart,
      },
      {
        title: "Tambor Cardíaco",
        description: "Acompanhar o ritmo cardíaco do paciente com um tambor e gradualmente modificá-lo para mais lento ou mais rápido.",
        target: ["Ansiedade", "Ataques de pânico", "Hipertensão"],
        materials: "Tambor de mão, metrônomo visual",
        icon: Heart,
      },
      {
        title: "Banho Sonoro",
        description: "Envolver o paciente com sons harmônicos contínuos produzidos por instrumentos como tigelas tibetanas ou gongos.",
        target: ["Insônia", "Ansiedade crônica", "Dor crônica", "TEA"],
        materials: "Tigelas tibetanas, gongos, diapasões terapêuticos",
        icon: Heart,
      },
    ],
    "Desenvolvimento Motor": [
      {
        title: "Dança com Fitas Rítmicas",
        description: "Movimentar fitas coloridas ao ritmo da música, explorando diferentes direções e intensidades.",
        target: ["TEA", "Atraso no desenvolvimento motor", "TDAH"],
        materials: "Fitas rítmicas coloridas, reprodutor de áudio",
        icon: Users,
      },
      {
        title: "Bateria Adaptada",
        description: "Utilizar instrumentos de percussão posicionados estrategicamente para promover movimentos específicos.",
        target: ["Paralisia cerebral", "TEA", "Atraso no desenvolvimento motor"],
        materials: "Tambores, pratos, blocos sonoros posicionados em distâncias planejadas",
        icon: Users,
      },
      {
        title: "Estátua Musical Direcionada",
        description: "Versão adaptada da 'estátua musical' com comandos específicos para posicionar partes do corpo.",
        target: ["TEA", "Dispraxia", "TDAH"],
        materials: "Reprodutor de áudio, cartões com posições corporais",
        icon: Users,
      },
      {
        title: "Instrumentos com Cruzamento de Linha Média",
        description: "Tocar instrumentos que exigem movimentos cruzando a linha média do corpo.",
        target: ["TEA", "Déficits de integração bilateral", "Dispraxia"],
        materials: "Xilofone, metalofone, instrumentos que possam ser dispostos horizontalmente",
        icon: Users,
      },
      {
        title: "Marcha Rítmica",
        description: "Caminhar ao ritmo de diferentes padrões musicais, variando velocidade e intensidade.",
        target: ["TEA", "Parkinson", "Dificuldades de coordenação"],
        materials: "Tambor, reprodutor de áudio, marcadores de solo",
        icon: Users,
      },
      {
        title: "Percussão Bilateral Sincronizada",
        description: "Praticar padrões rítmicos que exigem o uso simultâneo e coordenado de ambos os lados do corpo.",
        target: ["Hemiparesia", "Deficiências motoras", "Coordenação bilateral"],
        materials: "Pares de baquetas, tambores posicionados estrategicamente",
        icon: Users,
      },
      {
        title: "Dança das Articulações",
        description: "Sequência de movimentos musicais focados em mobilizar especificamente cada articulação do corpo.",
        target: ["Artrite", "Rigidez muscular", "Limitação de amplitude de movimento"],
        materials: "Ilustrações de movimentos articulares, música com ritmo adaptável",
        icon: Users,
      },
      {
        title: "Circuito Sonoro Motor",
        description: "Percurso com estações que combinam desafios motores com diferentes experiências sonoras.",
        target: ["Ataxia", "Problemas de planejamento motor", "Atraso global do desenvolvimento"],
        materials: "Instrumentos variados, obstáculos seguros, marcadores de solo",
        icon: Users,
      },
    ],
    "Flexibilidade Cognitiva": [
      {
        title: "Mudança de Instrumentos",
        description: "Tocar música que sinaliza quando os participantes devem trocar seus instrumentos entre si.",
        target: ["TEA", "TOD", "TDAH"],
        materials: "Variedade de instrumentos pequenos, sinalizador sonoro",
        icon: Brain,
      },
      {
        title: "Regente Musical",
        description: "Cada participante se torna regente por vez, mudando o ritmo, volume e estilo que os outros devem seguir.",
        target: ["TEA", "TDAH", "Rigidez comportamental"],
        materials: "Instrumentos variados, batuta ou objeto para regência",
        icon: Brain,
      },
      {
        title: "Transformação de Canções",
        description: "Modificar características de músicas conhecidas (ritmo, modo, letra) de forma colaborativa.",
        target: ["TEA", "TOD", "Ansiedade"],
        materials: "Instrumentos harmônicos, quadro para anotações",
        icon: Brain,
      },
      {
        title: "Improvisação com Regras Variáveis",
        description: "Criar música seguindo regras que mudam periodicamente através de cartões sorteados.",
        target: ["TEA", "TDAH", "Esquizofrenia"],
        materials: "Instrumentos diversos, cartões com instruções variadas",
        icon: Brain,
      },
      {
        title: "Jogo Musical de Categorias",
        description: "Criar música inspirada em diferentes categorias sorteadas (animais, estações, emoções, etc).",
        target: ["TEA", "Transtornos de aprendizagem", "Demência"],
        materials: "Instrumentos variados, cartões com categorias",
        icon: Brain,
      },
      {
        title: "Música com Múltiplos Finais",
        description: "Tocar músicas que permitem diferentes finalizações, incentivando o paciente a escolher ou criar alternativas.",
        target: ["TEA", "Transtorno obsessivo-compulsivo", "Ansiedade generalizada"],
        materials: "Partituras com finais alternativos, instrumentos variados",
        icon: Brain,
      },
      {
        title: "Desafio de Adaptação Musical",
        description: "Introduzir mudanças inesperadas durante a execução musical (tempo, volume, tom) às quais o paciente precisa se adaptar.",
        target: ["TEA", "Transtorno de personalidade", "Inflexibilidade cognitiva"],
        materials: "Instrumentos musicais, cartões de mudança, timer",
        icon: Brain,
      },
      {
        title: "Música de Perspectivas Múltiplas",
        description: "Interpretar a mesma música de diferentes pontos de vista emocionais ou contextuais.",
        target: ["TEA", "Transtorno bipolar", "Dificuldades de empatia"],
        materials: "Instrumento harmônico, cartões com contextos emocionais",
        icon: Brain,
      },
    ],
    "Autonomia e Autoestima": [
      {
        title: "Composição Autobiográfica",
        description: "Criar uma música pessoal que conte aspectos da história ou preferências do paciente.",
        target: ["Depressão", "Baixa autoestima", "TEA"],
        materials: "Instrumentos harmônicos, folhas para anotações, gravador",
        icon: Lightbulb,
      },
      {
        title: "Estúdio Musical Terapêutico",
        description: "Gravar músicas criadas ou interpretadas pelo paciente, com possibilidade de compartilhar com pessoas próximas.",
        target: ["Depressão", "TEA", "Ansiedade social"],
        materials: "Equipamento de gravação simples, instrumentos variados",
        icon: Lightbulb,
      },
      {
        title: "Apresentação Musical Guiada",
        description: "Preparar uma pequena apresentação em ambiente seguro, com suporte gradualmente reduzido.",
        target: ["Fobia social", "TEA", "Baixa autoestima"],
        materials: "Instrumentos escolhidos pelo paciente, espaço adequado",
        icon: Lightbulb,
      },
      {
        title: "Musicoterapia de Escolha Progressiva",
        description: "Sessão onde gradualmente o paciente assume mais controle sobre escolhas musicais e atividades.",
        target: ["TEA", "TOD", "Dependência emocional"],
        materials: "Menu visual de opções de atividades e instrumentos",
        icon: Lightbulb,
      },
      {
        title: "Círculo de Elogios Musicais",
        description: "Em grupo, criar canções ou ritmos que expressem qualidades positivas de cada participante.",
        target: ["Depressão", "Baixa autoestima", "TEA"],
        materials: "Instrumentos de fácil manuseio, cartões com características positivas",
        icon: Lightbulb,
      },
      {
        title: "Solos Progressivos",
        description: "Desenvolver pequenos solos musicais de complexidade crescente, celebrando cada avanço.",
        target: ["Baixa autoestima", "Perfeccionismo", "Transtorno de personalidade evitativa"],
        materials: "Instrumento preferido do paciente, gravador para documentar o progresso",
        icon: Lightbulb,
      },
      {
        title: "Projeto de Instrumento Personalizado",
        description: "Criar e personalizar um instrumento musical simples que reflita a identidade do paciente.",
        target: ["Problemas de identidade", "TEA", "Transtornos de personalidade"],
        materials: "Materiais para construção de instrumentos, ferramentas seguras, materiais decorativos",
        icon: Lightbulb,
      },
      {
        title: "Songwritting Terapêutico",
        description: "Escrever canções com foco em temas de autossuperação, forças pessoais e resiliência.",
        target: ["Depressão", "Transtorno de estresse pós-traumático", "Recuperação de vícios"],
        materials: "Instrumentos harmônicos, caderno de composição, exemplos de estruturas de canções",
        icon: Lightbulb,
      },
    ],
    "Vinculação Afetiva": [
      {
        title: "Canções de Ninar Terapêuticas",
        description: "Adaptar ou criar canções de ninar personalizadas, especialmente útil no trabalho com pais/cuidadores.",
        target: ["TEA", "Transtorno de apego", "Trauma"],
        materials: "Instrumentos suaves (kalimba, violão), gravador opcional",
        icon: UserPlus,
      },
      {
        title: "Musicalização da Rotina",
        description: "Criar pequenas canções para momentos importantes da rotina diária com cuidadores.",
        target: ["TEA", "Transtornos de ansiedade", "Dificuldades de vinculação"],
        materials: "Instrumentos portáteis, cartões com rotinas diárias",
        icon: UserPlus,
      },
      {
        title: "Duetos Musicais",
        description: "Tocar instrumentos em dueto com o cuidador ou terapeuta, fortalecendo a sincronia e conexão.",
        target: ["TEA", "Transtorno de apego reativo", "Trauma relacional"],
        materials: "Pares de instrumentos que se complementam (tambores, xilofones)",
        icon: UserPlus,
      },
      {
        title: "História Musical Familiar",
        description: "Explorar e recriar canções significativas da história familiar do paciente.",
        target: ["TEA", "Idosos", "Trabalho familiar"],
        materials: "Instrumentos variados, fotos ou objetos familiares",
        icon: UserPlus,
      },
      {
        title: "Improvisação Empática",
        description: "O terapeuta espelha musicalmente as expressões do paciente, criando uma experiência de sintonia afetiva.",
        target: ["TEA", "Trauma", "Transtornos de personalidade"],
        materials: "Instrumentos idênticos ou similares aos que o paciente utiliza",
        icon: UserPlus,
      },
      {
        title: "Criação de Canção Identitária Familiar",
        description: "Compor colaborativamente uma canção que representa a identidade e valores da família.",
        target: ["Conflitos familiares", "Adoção", "Famílias reconstruídas"],
        materials: "Instrumentos harmônicos, quadro para anotações, gravador",
        icon: UserPlus,
      },
      {
        title: "Canto Sincronizado",
        description: "Técnica de canto onde pais/cuidadores e pacientes cantam juntos com foco na respiração e sintonia.",
        target: ["Dificuldades de vinculação", "TEA", "Transtorno de ansiedade de separação"],
        materials: "Canções simples e significativas, instrumento de acompanhamento suave",
        icon: UserPlus,
      },
      {
        title: "Balanço Musical",
        description: "Movimentos de balanço sincronizados com música, especialmente eficaz para crianças pequenas e pacientes com regressão.",
        target: ["Trauma precoce", "Transtornos de apego", "Autismo severo"],
        materials: "Rede, balanço adaptado ou simplesmente posição de balanço nos braços, música calma",
        icon: UserPlus,
      },
    ],
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      "Comunicação e Expressão Verbal/Não Verbal": Music2,
      "Interação Social": Users,
      "Regulação Sensorial e Emocional": Heart,
      "Desenvolvimento Motor": Users,
      "Flexibilidade Cognitiva": Brain,
      "Autonomia e Autoestima": Lightbulb,
      "Vinculação Afetiva": UserPlus,
    };
    return icons[category as keyof typeof icons] || Music2;
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-b from-background to-background/95">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-primary bg-clip-text animate-fade-in">
        Atividades Musicoterapêuticas
      </h1>
      <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base max-w-3xl mx-auto animate-fade-in">
        Atividades musicoterapêuticas adaptáveis a necessidades específicas, incluindo TEA e diversos 
        transtornos mentais, conforme a demanda do paciente.
      </p>

      <Tabs defaultValue="comunicacao" className="w-full animate-fade-in">
        <TabsList className="mb-4 sm:mb-6 flex flex-wrap h-auto gap-1 sm:gap-2 justify-start overflow-x-auto pb-1 border-b border-muted">
          {isMobile ? (
            // Mobile tabs layout - smaller font and padding
            <>
              <TabsTrigger value="comunicacao" className="px-2 py-1 text-xs rounded-full">
                <Music2 className="h-3 w-3 mr-1" /> Comunicação
              </TabsTrigger>
              <TabsTrigger value="interacao" className="px-2 py-1 text-xs rounded-full">
                <Users className="h-3 w-3 mr-1" /> Interação
              </TabsTrigger>
              <TabsTrigger value="regulacao" className="px-2 py-1 text-xs rounded-full">
                <Heart className="h-3 w-3 mr-1" /> Regulação
              </TabsTrigger>
              <TabsTrigger value="motor" className="px-2 py-1 text-xs rounded-full">
                <Users className="h-3 w-3 mr-1" /> Des. Motor
              </TabsTrigger>
              <TabsTrigger value="flexibilidade" className="px-2 py-1 text-xs rounded-full">
                <Brain className="h-3 w-3 mr-1" /> Flex. Cognitiva
              </TabsTrigger>
              <TabsTrigger value="autonomia" className="px-2 py-1 text-xs rounded-full">
                <Lightbulb className="h-3 w-3 mr-1" /> Autonomia
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="px-2 py-1 text-xs rounded-full">
                <UserPlus className="h-3 w-3 mr-1" /> Vinculação
              </TabsTrigger>
            </>
          ) : isTablet ? (
            // Tablet tabs layout
            <>
              <TabsTrigger value="comunicacao" className="text-sm rounded-full">
                <Music2 className="h-4 w-4 mr-1" /> Comunicação
              </TabsTrigger>
              <TabsTrigger value="interacao" className="text-sm rounded-full">
                <Users className="h-4 w-4 mr-1" /> Interação Social
              </TabsTrigger>
              <TabsTrigger value="regulacao" className="text-sm rounded-full">
                <Heart className="h-4 w-4 mr-1" /> Regulação Sensorial
              </TabsTrigger>
              <TabsTrigger value="motor" className="text-sm rounded-full">
                <Users className="h-4 w-4 mr-1" /> Desenvolvimento Motor
              </TabsTrigger>
              <TabsTrigger value="flexibilidade" className="text-sm rounded-full">
                <Brain className="h-4 w-4 mr-1" /> Flexibilidade Cognitiva
              </TabsTrigger>
              <TabsTrigger value="autonomia" className="text-sm rounded-full">
                <Lightbulb className="h-4 w-4 mr-1" /> Autonomia
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="text-sm rounded-full">
                <UserPlus className="h-4 w-4 mr-1" /> Vinculação Afetiva
              </TabsTrigger>
            </>
          ) : (
            // Desktop tabs layout
            <>
              <TabsTrigger value="comunicacao" className="rounded-full px-4 py-2">
                <Music2 className="h-4 w-4 mr-2" /> Comunicação e Expressão
              </TabsTrigger>
              <TabsTrigger value="interacao" className="rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2" /> Interação Social
              </TabsTrigger>
              <TabsTrigger value="regulacao" className="rounded-full px-4 py-2">
                <Heart className="h-4 w-4 mr-2" /> Regulação Sensorial
              </TabsTrigger>
              <TabsTrigger value="motor" className="rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2" /> Desenvolvimento Motor
              </TabsTrigger>
              <TabsTrigger value="flexibilidade" className="rounded-full px-4 py-2">
                <Brain className="h-4 w-4 mr-2" /> Flexibilidade Cognitiva
              </TabsTrigger>
              <TabsTrigger value="autonomia" className="rounded-full px-4 py-2">
                <Lightbulb className="h-4 w-4 mr-2" /> Autonomia e Autoestima
              </TabsTrigger>
              <TabsTrigger value="vinculacao" className="rounded-full px-4 py-2">
                <UserPlus className="h-4 w-4 mr-2" /> Vinculação Afetiva
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {Object.entries(activities).map(([category, activityList], index) => {
          const CategoryIcon = getCategoryIcon(category);
          const tabValue = [
            "comunicacao", 
            "interacao", 
            "regulacao", 
            "motor", 
            "flexibilidade", 
            "autonomia", 
            "vinculacao"
          ][index];
          
          return (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg mb-4 border border-primary/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-1 sm:mb-2 flex items-center">
                  <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
                  {category}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione uma atividade para ver detalhes e sugestões de aplicação
                </p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {activityList.map((activity, idx) => (
                  <ActivityAccordionItem 
                    key={idx}
                    activity={activity} 
                    itemId={`item-${tabValue}-${idx}`} 
                    isMobile={isMobile}
                  />
                ))}
              </Accordion>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

interface Activity {
  title: string;
  description: string;
  target: string[];
  materials: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ActivityAccordionItemProps {
  activity: Activity;
  itemId: string;
  isMobile?: boolean;
}

function ActivityAccordionItem({ activity, itemId, isMobile }: ActivityAccordionItemProps) {
  const IconComponent = activity.icon || Music2;
  
  return (
    <AccordionItem value={itemId} className="overflow-hidden border rounded-lg mb-3 hover:shadow-md transition-all">
      <AccordionTrigger className="text-left p-4 hover:no-underline hover:bg-accent/40 group">
        <div className="flex flex-col items-start">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-1.5 mr-3">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>
            <span className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} group-hover:text-primary`}>
              {activity.title}
            </span>
          </div>
          {!isMobile && (
            <div className="text-xs text-muted-foreground mt-1 ml-9 line-clamp-1">
              {activity.description.substring(0, 80)}...
            </div>
          )}
        </div>
      </AccordionTrigger>
      
      <AccordionContent>
        <Card className="p-3 sm:p-4 bg-card/30 border-0 shadow-none">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {activity.description}
            </p>
            
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-primary">Indicações:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {activity.target.map((target, idx) => (
                  <Badge key={idx} variant="outline" className={`${isMobile ? "text-xs py-0" : ""} bg-primary/5 hover:bg-primary/10`}>
                    {target}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-primary">Materiais:</h4>
              <p className="text-gray-700 text-sm sm:text-base bg-background/50 p-2 rounded-md">
                {activity.materials}
              </p>
            </div>
          </div>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
