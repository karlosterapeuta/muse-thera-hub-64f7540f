
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function Activities() {
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
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary">
        Atividades Musicoterapêuticas
      </h1>
      <p className="text-gray-700 mb-8">
        Atividades musicoterapêuticas adaptáveis a necessidades específicas, incluindo TEA e diversos 
        transtornos mentais, conforme a demanda do paciente.
      </p>

      <Tabs defaultValue="comunicacao" className="w-full">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
          <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
          <TabsTrigger value="interacao">Interação Social</TabsTrigger>
          <TabsTrigger value="regulacao">Regulação Sensorial</TabsTrigger>
          <TabsTrigger value="motor">Desenvolvimento Motor</TabsTrigger>
          <TabsTrigger value="flexibilidade">Flexibilidade Cognitiva</TabsTrigger>
          <TabsTrigger value="autonomia">Autonomia</TabsTrigger>
          <TabsTrigger value="vinculacao">Vinculação Afetiva</TabsTrigger>
        </TabsList>

        <TabsContent value="comunicacao" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Comunicação e Expressão Verbal/Não Verbal</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Comunicação e Expressão Verbal/Não Verbal"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index}
                activity={activity} 
                itemId={`item-comunicacao-${index}`} 
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="interacao" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Interação Social</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Interação Social"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-interacao-${index}`} 
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="regulacao" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Regulação Sensorial e Emocional</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Regulação Sensorial e Emocional"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-regulacao-${index}`} 
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="motor" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Desenvolvimento Motor</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Desenvolvimento Motor"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-motor-${index}`} 
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="flexibilidade" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Flexibilidade Cognitiva</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Flexibilidade Cognitiva"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-flexibilidade-${index}`} 
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="autonomia" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Autonomia e Autoestima</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Autonomia e Autoestima"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-autonomia-${index}`} 
              />
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="vinculacao" className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Vinculação Afetiva</h2>
          <Accordion type="single" collapsible className="w-full">
            {activities["Vinculação Afetiva"].map((activity, index) => (
              <ActivityAccordionItem 
                key={index} 
                activity={activity} 
                itemId={`item-vinculacao-${index}`} 
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

function ActivityAccordionItem({ activity, itemId }: { activity: Activity; itemId: string }) {
  return (
    <AccordionItem value={itemId}>
      <AccordionTrigger className="text-left">
        <div className="flex flex-col items-start">
          <span className="font-medium text-lg">{activity.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="p-4">
          <div className="space-y-3">
            <p className="text-gray-700">{activity.description}</p>
            
            <div>
              <h4 className="text-sm font-semibold mb-1 text-gray-600">Indicações:</h4>
              <div className="flex flex-wrap gap-2">
                {activity.target.map((target, idx) => (
                  <Badge key={idx} variant="secondary">{target}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1 text-gray-600">Materiais:</h4>
              <p className="text-gray-700">{activity.materials}</p>
            </div>
          </div>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
