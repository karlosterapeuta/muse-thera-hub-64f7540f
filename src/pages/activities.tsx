
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

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
      },
      {
        title: "Completando Músicas",
        description: "Tocar músicas familiares e parar em momentos específicos para que o paciente complete verbalmente ou com instrumentos.",
        target: ["TEA", "Transtornos de linguagem", "Demência"],
        materials: "Reprodutor de áudio, instrumentos musicais simples",
      },
      {
        title: "Improvisação com Alternância de Turnos",
        description: "Criar diálogos musicais onde o terapeuta e o paciente alternam-se tocando instrumentos.",
        target: ["TEA", "Transtornos de comunicação", "Ansiedade social"],
        materials: "Pares de instrumentos idênticos (tambores, chocalhos)",
      },
      {
        title: "Composição de Histórias Musicais",
        description: "Narrar histórias utilizando sons e instrumentos para representar personagens ou eventos.",
        target: ["TEA", "Dificuldades de expressão emocional", "Transtornos de linguagem"],
        materials: "Diversos instrumentos, cartões com imagens de cenas/personagens",
      },
      {
        title: "Associação Música-Imagem",
        description: "Tocar diferentes estilos musicais e pedir que o paciente associe a imagens ou emoções.",
        target: ["TEA", "Alexitimia", "Transtornos de processamento sensorial"],
        materials: "Reprodutor de áudio, cartões com imagens ou emoticons",
      },
      {
        title: "Música e Palavras",
        description: "Criar músicas simples que incentivam a repetição de palavras ou frases específicas relacionadas a necessidades do paciente.",
        target: ["TEA", "Apraxia de fala", "Deficiência intelectual"],
        materials: "Instrumentos harmônicos, cartões com palavras alvo",
      },
      {
        title: "Narrativa Musical",
        description: "Criar uma sequência musical que segue uma história, incentivando o paciente a narrar ou contribuir com partes da história.",
        target: ["TEA", "Disfluência", "Transtornos de ansiedade"],
        materials: "Instrumentos variados, livros de histórias ilustrados",
      },
      {
        title: "Canto Dirigido com Técnicas Respiratórias",
        description: "Canções específicas com foco em padrões respiratórios que apoiam a vocalização e articulação.",
        target: ["Gagueira", "Disfonia", "Ansiedade"],
        materials: "Guia visual de respiração, instrumento harmônico para acompanhamento",
      },
    ],
    "Interação Social": [
      {
        title: "Círculo de Tambores",
        description: "Atividade em grupo onde cada participante toca um tambor seguindo um ritmo ou criando novos padrões coletivamente.",
        target: ["TEA", "Ansiedade social", "TDAH"],
        materials: "Tambores variados, outros instrumentos de percussão",
      },
      {
        title: "Canções de Saudação e Despedida",
        description: "Utilizar músicas que incorporam os nomes dos participantes e incentivam reconhecimento mútuo.",
        target: ["TEA", "Transtorno de ansiedade social", "Timidez"],
        materials: "Instrumentos harmônicos, cartões com nomes e fotos",
      },
      {
        title: "Bandinha Rítmica",
        description: "Formar um grupo musical onde cada participante toca um instrumento diferente, seguindo a regência do terapeuta.",
        target: ["TEA", "TDAH", "Transtornos de conduta"],
        materials: "Conjunto de instrumentos variados, cartão visual de regência",
      },
      {
        title: "Dança das Cadeiras Musical",
        description: "Adaptação da brincadeira tradicional com foco na interação e menos na competição.",
        target: ["TEA", "Ansiedade", "Transtornos de humor"],
        materials: "Reprodutor de áudio, cadeiras, marcadores de solo",
      },
      {
        title: "Jogo Musical de Espelho",
        description: "Um participante cria um padrão rítmico ou movimento que deve ser imitado pelo grupo.",
        target: ["TEA", "Esquizofrenia", "Dificuldades de integração sensorial"],
        materials: "Instrumentos simples e idênticos para todos os participantes",
      },
      {
        title: "Orquestra de Sucata",
        description: "Construção coletiva de instrumentos com materiais reciclados, seguida de performance em grupo.",
        target: ["Fobia social", "Baixa autoestima", "TEA"],
        materials: "Materiais recicláveis diversos, ferramentas básicas, decorações",
      },
      {
        title: "Coral Terapêutico",
        description: "Grupo de canto com arranjos simplificados e adaptados para diferentes habilidades vocais.",
        target: ["Depressão", "Isolamento social", "TEA", "Trauma"],
        materials: "Partituras adaptadas, instrumentos de acompanhamento, sistema de som",
      },
      {
        title: "Karaokê Adaptado",
        description: "Versão modificada do karaokê com suporte visual, opções de duetos e ajuste de complexidade.",
        target: ["Ansiedade social", "TEA", "Mutismo seletivo"],
        materials: "Sistema audiovisual, microfones, letras impressas em grande formato",
      },
    ],
    "Regulação Sensorial e Emocional": [
      {
        title: "Relaxamento Musical Guiado",
        description: "Utilizar música de fundo calma enquanto guia o paciente através de exercícios de respiração e relaxamento.",
        target: ["Ansiedade", "TOD", "TDAH", "TEA"],
        materials: "Reprodutor de áudio, colchonetes, almofadas",
      },
      {
        title: "Percussão Corporal Gradual",
        description: "Iniciar com batidas suaves no corpo e gradualmente aumentar ou diminuir a intensidade.",
        target: ["TEA", "Transtornos sensoriais", "TDAH"],
        materials: "Cartões com sequências de percussão corporal",
      },
      {
        title: "Improvisação Emocional",
        description: "Usar instrumentos para expressar emoções específicas e discutir as sensações provocadas.",
        target: ["Transtornos de humor", "Alexitimia", "TEA"],
        materials: "Instrumentos diversos, cartões com emoções",
      },
      {
        title: "Caixinha de Música Terapêutica",
        description: "Utilizar caixas musicais ou instrumentos suaves como parte de um ritual de autorregulação.",
        target: ["TEA", "Ansiedade", "Trauma"],
        materials: "Caixinhas de música, kalimbas, sinos tibetanos",
      },
      {
        title: "Identificação Sonora de Emoções",
        description: "Tocar trechos musicais e pedir para o paciente identificar que emoção a música transmite.",
        target: ["TEA", "Transtornos de humor", "Alexitimia"],
        materials: "Reprodutor de áudio, cartões com expressões emocionais",
      },
      {
        title: "Jornada Sonora",
        description: "Criar uma experiência imersiva com diferentes paisagens sonoras para estimular ou acalmar o sistema sensorial.",
        target: ["Transtornos sensoriais", "TEPT", "TEA"],
        materials: "Sistema de som com boa qualidade, colchonetes, vendas para os olhos",
      },
      {
        title: "Tambor Cardíaco",
        description: "Acompanhar o ritmo cardíaco do paciente com um tambor e gradualmente modificá-lo para mais lento ou mais rápido.",
        target: ["Ansiedade", "Ataques de pânico", "Hipertensão"],
        materials: "Tambor de mão, metrônomo visual",
      },
      {
        title: "Banho Sonoro",
        description: "Envolver o paciente com sons harmônicos contínuos produzidos por instrumentos como tigelas tibetanas ou gongos.",
        target: ["Insônia", "Ansiedade crônica", "Dor crônica", "TEA"],
        materials: "Tigelas tibetanas, gongos, diapasões terapêuticos",
      },
    ],
    "Desenvolvimento Motor": [
      {
        title: "Dança com Fitas Rítmicas",
        description: "Movimentar fitas coloridas ao ritmo da música, explorando diferentes direções e intensidades.",
        target: ["TEA", "Atraso no desenvolvimento motor", "TDAH"],
        materials: "Fitas rítmicas coloridas, reprodutor de áudio",
      },
      {
        title: "Bateria Adaptada",
        description: "Utilizar instrumentos de percussão posicionados estrategicamente para promover movimentos específicos.",
        target: ["Paralisia cerebral", "TEA", "Atraso no desenvolvimento motor"],
        materials: "Tambores, pratos, blocos sonoros posicionados em distâncias planejadas",
      },
      {
        title: "Estátua Musical Direcionada",
        description: "Versão adaptada da 'estátua musical' com comandos específicos para posicionar partes do corpo.",
        target: ["TEA", "Dispraxia", "TDAH"],
        materials: "Reprodutor de áudio, cartões com posições corporais",
      },
      {
        title: "Instrumentos com Cruzamento de Linha Média",
        description: "Tocar instrumentos que exigem movimentos cruzando a linha média do corpo.",
        target: ["TEA", "Déficits de integração bilateral", "Dispraxia"],
        materials: "Xilofone, metalofone, instrumentos que possam ser dispostos horizontalmente",
      },
      {
        title: "Marcha Rítmica",
        description: "Caminhar ao ritmo de diferentes padrões musicais, variando velocidade e intensidade.",
        target: ["TEA", "Parkinson", "Dificuldades de coordenação"],
        materials: "Tambor, reprodutor de áudio, marcadores de solo",
      },
      {
        title: "Percussão Bilateral Sincronizada",
        description: "Praticar padrões rítmicos que exigem o uso simultâneo e coordenado de ambos os lados do corpo.",
        target: ["Hemiparesia", "Deficiências motoras", "Coordenação bilateral"],
        materials: "Pares de baquetas, tambores posicionados estrategicamente",
      },
      {
        title: "Dança das Articulações",
        description: "Sequência de movimentos musicais focados em mobilizar especificamente cada articulação do corpo.",
        target: ["Artrite", "Rigidez muscular", "Limitação de amplitude de movimento"],
        materials: "Ilustrações de movimentos articulares, música com ritmo adaptável",
      },
      {
        title: "Circuito Sonoro Motor",
        description: "Percurso com estações que combinam desafios motores com diferentes experiências sonoras.",
        target: ["Ataxia", "Problemas de planejamento motor", "Atraso global do desenvolvimento"],
        materials: "Instrumentos variados, obstáculos seguros, marcadores de solo",
      },
    ],
    "Flexibilidade Cognitiva": [
      {
        title: "Mudança de Instrumentos",
        description: "Tocar música que sinaliza quando os participantes devem trocar seus instrumentos entre si.",
        target: ["TEA", "TOD", "TDAH"],
        materials: "Variedade de instrumentos pequenos, sinalizador sonoro",
      },
      {
        title: "Regente Musical",
        description: "Cada participante se torna regente por vez, mudando o ritmo, volume e estilo que os outros devem seguir.",
        target: ["TEA", "TDAH", "Rigidez comportamental"],
        materials: "Instrumentos variados, batuta ou objeto para regência",
      },
      {
        title: "Transformação de Canções",
        description: "Modificar características de músicas conhecidas (ritmo, modo, letra) de forma colaborativa.",
        target: ["TEA", "TOD", "Ansiedade"],
        materials: "Instrumentos harmônicos, quadro para anotações",
      },
      {
        title: "Improvisação com Regras Variáveis",
        description: "Criar música seguindo regras que mudam periodicamente através de cartões sorteados.",
        target: ["TEA", "TDAH", "Esquizofrenia"],
        materials: "Instrumentos diversos, cartões com instruções variadas",
      },
      {
        title: "Jogo Musical de Categorias",
        description: "Criar música inspirada em diferentes categorias sorteadas (animais, estações, emoções, etc).",
        target: ["TEA", "Transtornos de aprendizagem", "Demência"],
        materials: "Instrumentos variados, cartões com categorias",
      },
      {
        title: "Música com Múltiplos Finais",
        description: "Tocar músicas que permitem diferentes finalizações, incentivando o paciente a escolher ou criar alternativas.",
        target: ["TEA", "Transtorno obsessivo-compulsivo", "Ansiedade generalizada"],
        materials: "Partituras com finais alternativos, instrumentos variados",
      },
      {
        title: "Desafio de Adaptação Musical",
        description: "Introduzir mudanças inesperadas durante a execução musical (tempo, volume, tom) às quais o paciente precisa se adaptar.",
        target: ["TEA", "Transtorno de personalidade", "Inflexibilidade cognitiva"],
        materials: "Instrumentos musicais, cartões de mudança, timer",
      },
      {
        title: "Música de Perspectivas Múltiplas",
        description: "Interpretar a mesma música de diferentes pontos de vista emocionais ou contextuais.",
        target: ["TEA", "Transtorno bipolar", "Dificuldades de empatia"],
        materials: "Instrumento harmônico, cartões com contextos emocionais",
      },
    ],
    "Autonomia e Autoestima": [
      {
        title: "Composição Autobiográfica",
        description: "Criar uma música pessoal que conte aspectos da história ou preferências do paciente.",
        target: ["Depressão", "Baixa autoestima", "TEA"],
        materials: "Instrumentos harmônicos, folhas para anotações, gravador",
      },
      {
        title: "Estúdio Musical Terapêutico",
        description: "Gravar músicas criadas ou interpretadas pelo paciente, com possibilidade de compartilhar com pessoas próximas.",
        target: ["Depressão", "TEA", "Ansiedade social"],
        materials: "Equipamento de gravação simples, instrumentos variados",
      },
      {
        title: "Apresentação Musical Guiada",
        description: "Preparar uma pequena apresentação em ambiente seguro, com suporte gradualmente reduzido.",
        target: ["Fobia social", "TEA", "Baixa autoestima"],
        materials: "Instrumentos escolhidos pelo paciente, espaço adequado",
      },
      {
        title: "Musicoterapia de Escolha Progressiva",
        description: "Sessão onde gradualmente o paciente assume mais controle sobre escolhas musicais e atividades.",
        target: ["TEA", "TOD", "Dependência emocional"],
        materials: "Menu visual de opções de atividades e instrumentos",
      },
      {
        title: "Círculo de Elogios Musicais",
        description: "Em grupo, criar canções ou ritmos que expressem qualidades positivas de cada participante.",
        target: ["Depressão", "Baixa autoestima", "TEA"],
        materials: "Instrumentos de fácil manuseio, cartões com características positivas",
      },
      {
        title: "Solos Progressivos",
        description: "Desenvolver pequenos solos musicais de complexidade crescente, celebrando cada avanço.",
        target: ["Baixa autoestima", "Perfeccionismo", "Transtorno de personalidade evitativa"],
        materials: "Instrumento preferido do paciente, gravador para documentar o progresso",
      },
      {
        title: "Projeto de Instrumento Personalizado",
        description: "Criar e personalizar um instrumento musical simples que reflita a identidade do paciente.",
        target: ["Problemas de identidade", "TEA", "Transtornos de personalidade"],
        materials: "Materiais para construção de instrumentos, ferramentas seguras, materiais decorativos",
      },
      {
        title: "Songwritting Terapêutico",
        description: "Escrever canções com foco em temas de autossuperação, forças pessoais e resiliência.",
        target: ["Depressão", "Transtorno de estresse pós-traumático", "Recuperação de vícios"],
        materials: "Instrumentos harmônicos, caderno de composição, exemplos de estruturas de canções",
      },
    ],
    "Vinculação Afetiva": [
      {
        title: "Canções de Ninar Terapêuticas",
        description: "Adaptar ou criar canções de ninar personalizadas, especialmente útil no trabalho com pais/cuidadores.",
        target: ["TEA", "Transtorno de apego", "Trauma"],
        materials: "Instrumentos suaves (kalimba, violão), gravador opcional",
      },
      {
        title: "Musicalização da Rotina",
        description: "Criar pequenas canções para momentos importantes da rotina diária com cuidadores.",
        target: ["TEA", "Transtornos de ansiedade", "Dificuldades de vinculação"],
        materials: "Instrumentos portáteis, cartões com rotinas diárias",
      },
      {
        title: "Duetos Musicais",
        description: "Tocar instrumentos em dueto com o cuidador ou terapeuta, fortalecendo a sincronia e conexão.",
        target: ["TEA", "Transtorno de apego reativo", "Trauma relacional"],
        materials: "Pares de instrumentos que se complementam (tambores, xilofones)",
      },
      {
        title: "História Musical Familiar",
        description: "Explorar e recriar canções significativas da história familiar do paciente.",
        target: ["TEA", "Idosos", "Trabalho familiar"],
        materials: "Instrumentos variados, fotos ou objetos familiares",
      },
      {
        title: "Improvisação Empática",
        description: "O terapeuta espelha musicalmente as expressões do paciente, criando uma experiência de sintonia afetiva.",
        target: ["TEA", "Trauma", "Transtornos de personalidade"],
        materials: "Instrumentos idênticos ou similares aos que o paciente utiliza",
      },
      {
        title: "Criação de Canção Identitária Familiar",
        description: "Compor colaborativamente uma canção que representa a identidade e valores da família.",
        target: ["Conflitos familiares", "Adoção", "Famílias reconstruídas"],
        materials: "Instrumentos harmônicos, quadro para anotações, gravador",
      },
      {
        title: "Canto Sincronizado",
        description: "Técnica de canto onde pais/cuidadores e pacientes cantam juntos com foco na respiração e sintonia.",
        target: ["Dificuldades de vinculação", "TEA", "Transtorno de ansiedade de separação"],
        materials: "Canções simples e significativas, instrumento de acompanhamento suave",
      },
      {
        title: "Balanço Musical",
        description: "Movimentos de balanço sincronizados com música, especialmente eficaz para crianças pequenas e pacientes com regressão.",
        target: ["Trauma precoce", "Transtornos de apego", "Autismo severo"],
        materials: "Rede, balanço adaptado ou simplesmente posição de balanço nos braços, música calma",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-primary">
        Atividades Musicoterapêuticas
      </h1>
      <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
        Atividades musicoterapêuticas adaptáveis a necessidades específicas, incluindo TEA e diversos 
        transtornos mentais, conforme a demanda do paciente.
      </p>

      <Tabs defaultValue="comunicacao" className="w-full">
        <TabsList className="mb-4 sm:mb-6 flex flex-wrap h-auto gap-1 sm:gap-2 justify-start">
          {isMobile ? (
            // Mobile tabs layout - smaller font and padding
            <>
              <TabsTrigger value="comunicacao" className="px-2 py-1 text-xs">Comunicação</TabsTrigger>
              <TabsTrigger value="interacao" className="px-2 py-1 text-xs">Interação</TabsTrigger>
              <TabsTrigger value="regulacao" className="px-2 py-1 text-xs">Regulação</TabsTrigger>
              <TabsTrigger value="motor" className="px-2 py-1 text-xs">Des. Motor</TabsTrigger>
              <TabsTrigger value="flexibilidade" className="px-2 py-1 text-xs">Flex. Cognitiva</TabsTrigger>
              <TabsTrigger value="autonomia" className="px-2 py-1 text-xs">Autonomia</TabsTrigger>
              <TabsTrigger value="vinculacao" className="px-2 py-1 text-xs">Vinculação</TabsTrigger>
            </>
          ) : isTablet ? (
            // Tablet tabs layout
            <>
              <TabsTrigger value="comunicacao" className="text-sm">Comunicação</TabsTrigger>
              <TabsTrigger value="interacao" className="text-sm">Interação Social</TabsTrigger>
              <TabsTrigger value="regulacao" className="text-sm">Regulação Sensorial</TabsTrigger>
              <TabsTrigger value="motor" className="text-sm">Desenvolvimento Motor</TabsTrigger>
              <TabsTrigger value="flexibilidade" className="text-sm">Flexibilidade Cognitiva</TabsTrigger>
              <TabsTrigger value="autonomia" className="text-sm">Autonomia</TabsTrigger>
              <TabsTrigger value="vinculacao" className="text-sm">Vinculação Afetiva</TabsTrigger>
            </>
          ) : (
            // Desktop tabs layout
            <>
              <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
              <TabsTrigger value="interacao">Interação Social</TabsTrigger>
              <TabsTrigger value="regulacao">Regulação Sensorial</TabsTrigger>
              <TabsTrigger value="motor">Desenvolvimento Motor</TabsTrigger>
              <TabsTrigger value="flexibilidade">Flexibilidade Cognitiva</TabsTrigger>
              <TabsTrigger value="autonomia">Autonomia</TabsTrigger>
              <TabsTrigger value="vinculacao">Vinculação Afetiva</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="comunicacao" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Comunicação e Expressão Verbal/Não Verbal</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Comunicação e Expressão Verbal/Não Verbal"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index}
                activity={activity} 
                itemId={`item-comunicacao-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="interacao" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Interação Social</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Interação Social"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-interacao-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="regulacao" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Regulação Sensorial e Emocional</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Regulação Sensorial e Emocional"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-regulacao-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="motor" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Desenvolvimento Motor</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Desenvolvimento Motor"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-motor-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="flexibilidade" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Flexibilidade Cognitiva</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Flexibilidade Cognitiva"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-flexibilidade-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="autonomia" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Autonomia e Autoestima</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Autonomia e Autoestima"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-autonomia-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="vinculacao" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Vinculação Afetiva</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Vinculação Afetiva"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-vinculacao-${index}`} 
                isMobile={isMobile}
              />
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface Activity {
  title: string;
  description: string;
  target: string[];
  materials: string;
}

interface ActivityAccordionItemProps {
  activity: Activity;
  itemId: string;
  isMobile?: boolean;
}

function ActivityAccordionItem({ activity, itemId, isMobile }: ActivityAccordionItemProps) {
  return (
    <AccordionItem value={itemId}>
      <AccordionTrigger className="text-left">
        <div className="flex flex-col items-start">
          <span className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>{activity.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <p className="text-gray-700 text-sm sm:text-base">{activity.description}</p>
            
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-gray-600">Indicações:</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {activity.target.map((target, idx) => (
                  <Badge key={idx} variant="secondary" className={isMobile ? "text-xs py-0" : ""}>
                    {target}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 text-gray-600">Materiais:</h4>
              <p className="text-gray-700 text-sm sm:text-base">{activity.materials}</p>
            </div>
          </div>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
