import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brain, Users, Heart, Move, MessageSquare, BookOpen, Music, 
  Zap, User, Lightbulb, HelpingHand, Globe, Puzzle, Target, 
  Eye, Flame, Shield, GraduationCap, FlaskConical, ShieldCheck,
  Sparkles
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ActivitiesPage() {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const cognitiveActivities = [
    {
      id: 1,
      title: "Sequência Musical",
      description: "Os participantes devem repetir uma sequência de notas tocadas pelo terapeuta, aumentando gradualmente a complexidade. Trabalha memória, atenção e processamento sequencial."
    },
    {
      id: 2,
      title: "Classificação Sonora",
      description: "Apresentar diferentes sons (instrumentos, natureza, cotidiano) e pedir para os participantes classificarem em categorias (alto/baixo, agradável/desagradável, natural/artificial). Estimula categorização e discriminação auditiva."
    },
    {
      id: 3,
      title: "Composição Temática",
      description: "Criar uma música simples sobre um tema específico (estações do ano, emoções). Desenvolve planejamento, organização de ideias e criatividade estruturada."
    },
    {
      id: 4,
      title: "Jogo de Perguntas Musicais",
      description: "Fazer perguntas sobre músicas familiares (quem canta, letra seguinte, etc). Trabalha memória de longo prazo e recuperação de informações."
    },
    {
      id: 5,
 title: "Completar Letras",
      description: "Cantar músicas conhecidas pausando em certos momentos para que os participantes completem. Fortalece a memória de trabalho e atenção sustentada."
    },
    {
      id: 6,
      title: "Histórias Sonorizadas",
      description: "Contar uma história adicionando efeitos sonoros nos momentos apropriados. Melhora a compreensão narrativa e o processamento auditivo."
    },
    {
      id: 7,
      title: "Criação de Mapas Rítmicos",
      description: "Criar representações visuais (desenhos, símbolos) de padrões rítmicos e depois executá-los. Trabalha codificação, decodificação e representação simbólica."
    },
    {
      id: 8,
      title: "Orquestra de Imitação",
      description: "Um participante cria um movimento com som, e os outros devem imitar exatamente. Desenvolve observação detalhada e memória de procedimentos."
    },
    {
      id: 9,
      title: "Resolução Musical de Problemas",
      description: "Apresentar um desafio musical (criar uma melodia com certas notas, expressar uma emoção específica com instrumentos) e trabalhar colaborativamente para resolvê-lo."
    },
    {
      id: 10,
      title: "Músicas com Movimentos Cognitivos",
      description: "Cantar músicas que incorporam comandos cognitivos (troca de direções, contagem regressiva, nomeação de categorias). Fortalece funções executivas e flexibilidade cognitiva."
    }
  ];
  
  const socialActivities = [
    {
      id: 1,
      title: "Improvisação em Grupo",
      description: "Os participantes criam uma música juntos, improvisando melodias e ritmos. Promove a colaboração, a escuta ativa e a expressão em conjunto."
    },
    {
      id: 2,
      title: "Círculo de Canções",
      description: "Cantar músicas conhecidas em grupo, passando a vez para cada participante escolher a próxima canção. Estimula o senso de pertencimento, a participação e o respeito às preferências dos outros."
    },
    {
      id: 3,
      title: "Espelho Musical",
      description: "Em pares, um participante faz movimentos com a música enquanto o outro imita como um espelho. Desenvolve a sintonia social, a atenção ao outro e a coordenação interpessoal."
    },
    {
      id: 4,
      title: "Composição Colaborativa",
      description: "Em pequenos grupos, criar uma música sobre experiências compartilhadas. Trabalha a comunicação, a negociação e a construção de consenso."
    },
    {
      id: 5,
      title: "Bateria Humana",
      description: "Cada participante representa um elemento de bateria e toca apenas quando recebe o sinal. Desenvolve trabalho em equipe, sincronização e compreensão de papéis individuais dentro do grupo."
    },
    {
      id: 6,
      title: "Orquestra de Emoções",
      description: "O grupo expressa coletivamente diferentes emoções através da música, sem usar palavras. Fortalece a inteligência emocional coletiva e a empatia."
    },
    {
      id: 7,
      title: "Canção de Boas-Vindas",
      description: "Criar e cantar uma canção personalizada para receber novos membros ao grupo. Estimula a inclusão, o acolhimento e o sentimento de pertença."
    },
    {
      id: 8,
      title: "Roda de Percussão",
      description: "Os participantes tocam instrumentos de percussão em círculo, seguindo um líder que vai mudando. Desenvolve liderança, seguimento e adaptação social."
    },
    {
      id: 9,
      title: "Canção do Conflito",
      description: "Transformar um desentendimento real ou hipotético em uma canção, explorando diferentes perspectivas. Trabalha resolução de conflitos e empatia."
    },
    {
      id: 10,
      title: "Coral de Identidade",
      description: "Criar um coral onde cada voz representa uma característica do grupo, criando harmonia a partir da diversidade. Valoriza diferenças individuais dentro do contexto social."
    }
  ];

  const emotionalActivities = [
    {
      id: 1,
      title: "Mapa Musical das Emoções",
      description: "Criar uma 'paleta' de sons ou músicas que representem diferentes emoções. Os participantes escolhem instrumentos ou canções para expressar como estão se sentindo, desenvolvendo autoconsciência emocional."
    },
    {
      id: 2,
      title: "Composição de Histórias Emocionais",
      description: "Compor uma pequena peça musical que conte a história de uma experiência emocional significativa. Ajuda na expressão saudável e processamento de emoções complexas."
    },
    {
      id: 3,
      title: "Improviso de Transição Emocional",
      description: "Improvisar uma sequência musical que demonstre a transição entre emoções (ex: da tristeza para a calma). Desenvolve a compreensão da natureza transitória das emoções."
    },
    {
      id: 4,
      title: "Espelhamento Emocional",
      description: "O terapeuta reflete musicalmente o estado emocional do participante, validando seus sentimentos. Desenvolve aceitação emocional e senso de ser compreendido."
    },
    {
      id: 5,
      title: "Canção das Forças Internas",
      description: "Compor uma canção sobre recursos internos para lidar com emoções difíceis. Fortalece resiliência emocional e estratégias de enfrentamento."
    },
    {
      id: 6,
      title: "Dueto de Emoções Contraditórias",
      description: "Explorar musicalmente duas emoções aparentemente opostas que podem ser sentidas simultaneamente. Desenvolve compreensão da complexidade emocional."
    },
    {
      id: 7,
      title: "Ritual de Liberação",
      description: "Criar um breve ritual musical para expressar e liberar emoções \"presas\" ou difíceis de expressar verbalmente. Promove catarse emocional saudável."
    },
    {
      id: 8,
      title: "Reescrever Canções Emocionais",
      description: "Modificar letras de canções conhecidas para refletir experiências emocionais pessoais. Desenvolve apropriação e elaboração emocional."
    },
    {
      id: 9,
      title: "Trilha Sonora da Vida",
      description: "Selecionar ou criar músicas que representem momentos emocionalmente significativos. Desenvolve narrativa emocional e integração de experiências."
    },
    {
      id: 10,
      title: "Canção de Acolhimento",
      description: "Compor uma canção de auto-compaixão, acolhendo partes emocionalmente vulneráveis de si. Desenvolve autocuidado emocional e auto-compaixão."
    }
  ];

  const motorActivities = [
    {
      id: 1,
      title: "Dança Espelhada",
      description: "Em pares ou em grupo, um participante realiza movimentos ao som da música enquanto os outros imitam como espelhos. Trabalha coordenação motora, lateralidade e percepção corporal."
    },
    {
      id: 2,
      title: "Circuito Musical",
      description: "Criar um circuito com diferentes estações onde cada uma requer um movimento específico (pular, rastejar, girar) que deve ser realizado enquanto a música toca e parar quando ela pausa. Desenvolve controle motor e resposta a estímulos auditivos."
    },
    {
      id: 3,
      title: "Regência Corporal",
      description: "Os participantes utilizam todo o corpo para 'reger' uma peça musical, com movimentos amplos que acompanham a dinâmica, velocidade e intensidade da música. Estimula amplitude de movimentos e expressão motora."
    },
    {
      id: 4,
      title: "Percussão Corporal",
      description: "Criar sequências rítmicas utilizando diferentes partes do corpo (palmas, batidas no peito, estalos de dedos, batidas nos joelhos). Melhora a coordenação motora fina e grossa e a consciência corporal."
    },
    {
      id: 5,
      title: "Canções com Movimentos Sequenciais",
      description: "Cantar músicas que incorporam sequências de movimentos cada vez mais complexos, exigindo memória motora e coordenação sequencial."
    },
    {
      id: 6,
      title: "Instrumento Viajante",
      description: "Em círculo, cada participante toca um instrumento de percussão de forma diferente antes de passá-lo ao próximo. Trabalha coordenação óculo-manual, preensão e controle motor ao manipular objetos."
    },
    {
      id: 7,
      title: "Dança das Articulações",
      description: "Com música tocando, focar em mover apenas uma articulação específica por vez (só os pulsos, só os ombros, só os tornozelos), criando consciência articular e controle motor seletivo."
    },
    {
      id: 8,
      title: "Estátua Musical Progressiva",
      description: "Versão do jogo da estátua onde, a cada rodada, os participantes devem manter uma posição mais desafiadora (em um pé só, braços estendidos, agachado). Desenvolve equilíbrio, controle postural e resistência muscular."
    },
    {
      id: 9,
      title: "Banda Elastique",
      description: "Usando elásticos grandes ou faixas elásticas, o grupo cria movimentos coordenados ao som da música, esticando e relaxando o elástico. Desenvolve coordenação grupal, força e consciência de resistência."
    },
    {
      id: 10,
      title: "Condução Musical",
      description: "Um participante com os olhos vendados é guiado pelo espaço através de sinais sonoros (diferentes instrumentos indicam diferentes direções). Trabalha equilíbrio, orientação espacial e confiança motora."
    }
  ];

  const languageActivities = [
    {
      id: 1,
      title: "Canções de Vocabulário",
      description: "Criar ou adaptar canções que introduzam palavras novas relacionadas a um tema específico (animais, cores, emoções). A repetição musical facilita a memorização do vocabulário."
    },
    {
      id: 2,
      title: "Completar Frases Musicais",
      description: "Cantar músicas com pausas estratégicas para que os participantes completem com as palavras adequadas. Desenvolve capacidade de antecipação linguística e reforça estruturas frasais."
    },
    {
      id: 3,
      title: "História Musical Coletiva",
      description: "Cada participante adiciona uma frase à história enquanto um ritmo contínuo é mantido. O suporte musical ajuda na fluidez da expressão verbal e na organização do pensamento."
    },
    {
      id: 4,
      title: "Canções com Movimentos Articulatórios",
      description: "Músicas que enfatizam sons específicos com movimentos labiais, linguais ou palatais exagerados. Ajuda na consciência fonológica e na precisão articulatória."
    },
    {
      id: 5,
      title: "Diálogo Rítmico",
      description: "Criar conversas onde cada frase deve ser falada seguindo um padrão rítmico específico. Trabalha prosódia, ritmo da fala e habilidades pragmáticas da linguagem."
    },
    {
      id: 6,
      title: "Rap Terapêutico",
      description: "Compor raps sobre temas cotidianos ou terapêuticos, enfatizando rimas e ritmo. Desenvolve consciência fonológica, segmentação silábica e fluência verbal."
    },
    {
      id: 7,
      title: "Canção das Instruções",
      description: "Transformar comandos e instruções em canções. Facilita a compreensão e processamento de linguagem receptiva, especialmente para sequências de múltiplos passos."
    },
    {
      id: 8,
      title: "Canto com Sinais",
      description: "Cantar incorporando gestos ou sinais que representem conceitos-chave da música. Integra comunicação não-verbal e reforça o significado semântico das palavras."
    },
    {
      id: 9,
      title: "Improvisação Verbal-Musical",
      description: "Criar improvisações onde a melodia segue o contorno natural da fala. Desenvolve consciência da musicalidade inerente à linguagem e expressividade vocal."
    },
    {
      id: 10,
      title: "Teatro Musical de Conversação",
      description: "Pequenas dramatizações musicais que representam situações sociais comuns. Trabalha habilidades pragmáticas, turnos de fala e compreensão de contextos comunicativos."
    }
  ];

  const moralActivities = [
    {
      id: 1,
      title: "Canções de Valores",
      description: "Criar ou adaptar canções que abordem valores morais específicos (honestidade, respeito, responsabilidade). O formato musical facilita a internalização desses conceitos abstratos."
    },
    {
      id: 2,
      title: "Dilemas Musicais",
      description: "Apresentar situações de dilema moral através de pequenas peças musicais e discutir diferentes resoluções possíveis. Desenvolve raciocínio ético e tomada de decisão moral."
    },
    {
      id: 3,
      title: "Orquestra da Justiça",
      description: "Criar uma experiência musical onde todos tenham papéis equitativos e importantes, ilustrando o conceito de justiça e a valorização das contribuições individuais."
    },
    {
      id: 4,
      title: "Histórias Sonoras de Empatia",
      description: "Contar histórias com trilha sonora sobre situações que requerem empatia, onde os participantes devem criar sons que representem os sentimentos dos personagens."
    },
    {
      id: 5,
      title: "Música da Gratidão",
      description: "Compor canções expressando gratidão a pessoas ou elementos importantes na vida dos participantes. Desenvolve reconhecimento do valor do outro e humildade."
    },
    {
      id: 6,
      title: "Improvisação das Consequências",
      description: "Criar uma improvisação musical que ilustre como pequenas ações podem ter grandes consequências, explorando o conceito de responsabilidade pelas próprias escolhas."
    },
    {
      id: 7,
      title: "Círculo de Confiança Musical",
      description: "Exercícios musicais em que os participantes precisam confiar uns nos outros (como criar música de olhos fechados seguindo apenas pistas sonoras). Desenvolve confiança e integridade."
    },
    {
      id: 8,
      title: "Canção do Compromisso",
      description: "Criar uma música que represente um compromisso moral que o grupo deseja assumir. Desenvolve senso de responsabilidade coletiva e individual."
    },
    {
      id: 9,
      title: "Debate Musical de Perspectivas",
      description: "Usar diferentes estilos musicais para representar diferentes perspectivas sobre uma questão moral. Desenvolve compreensão da relatividade cultural e respeito pela diversidade de valores."
    },
    {
      id: 10,
      title: "Legado Musical",
      description: "Compor uma peça que represente o legado que cada um gostaria de deixar no mundo. Desenvolve pensamento sobre consequências de longo prazo e propósito moral nas ações."
    }
  ];

  const creativeActivities = [
    {
      id: 1,
      title: "Diálogo Instrumental Aberto",
      description: "Oferecer diversos instrumentos musicais e propor um 'diálogo' onde não há regras fixas, apenas a sugestão de que os participantes 'conversem' através dos sons. Estimula a expressão espontânea e a criatividade sem julgamentos."
    },
    {
      id: 2,
      title: "Reinterpretação Musical",
      description: "Apresentar uma música conhecida e pedir aos participantes que a reinterpretem completamente, mudando ritmo, andamento, estilo ou instrumentação. Desenvolve a capacidade de transformar o familiar em algo novo."
    },
    {
      id: 3,
      title: "Sonorização de Imagens",
      description: "Mostrar imagens abstratas ou paisagens e convidar os participantes a criarem uma 'trilha sonora' que represente o que veem ou sentem. Trabalha a tradução entre linguagens artísticas e a expressão multissensorial."
    },
    {
      id: 4,
      title: "Construção de Instrumentos Não-Convencionais",
      description: "Usando materiais recicláveis e objetos do cotidiano, criar instrumentos musicais inusitados. Explora a inventividade, a resolução criativa de problemas e a expansão do conceito de 'musical'."
    },
    {
      id: 5,
      title: "Improvisação com Restrições Criativas",
      description: "Propor improvisações com limitações intencionais (usar apenas três notas, tocar sem usar as mãos, criar música apenas com sons vocais não-verbais). As restrições paradoxalmente expandem a criatividade ao forçar novos caminhos."
    },
    {
      id: 6,
      title: "Musicalizando o Improvável",
      description: "Desafiar os participantes a encontrar musicalidade em objetos ou situações geralmente não considerados musicais (sons de uma cozinha, de uma construção, do trânsito). Expande a percepção do potencial musical do ambiente."
    },
    {
      id: 7,
      title: "Composição por Acaso",
      description: "Usar métodos aleatórios (dados, cartas, sorteios) para determinar elementos musicais como notas, ritmos ou dinâmicas, e criar uma composição a partir desses elementos. Introduz o conceito de serendipidade criativa."
    },
    {
      id: 8,
      title: "Remix Terapêutico",
      description: "Fornecer gravações de sons diversos e permitir que os participantes as combinem, editem e transformem digitalmente. Integra tecnologia à expressão criativa e desenvolve pensamento não-linear."
    },
    {
      id: 9,
      title: "Criação de Linguagem Musical",
      description: "Convidar o grupo a inventar um sistema musical próprio com símbolos, regras e notações criados por eles. Estimula o pensamento divergente e a criação de sistemas simbólicos."
    },
    {
      id: 10,
      title: "Improvisação com Feedback de Loop",
      description: "Usar equipamentos de loop ou gravação para que os participantes criem camadas sonoras sobrepostas, construindo gradualmente uma peça complexa. Desenvolve pensamento arquitetônico musical e criatividade estruturada."
    }
  ];

  const psychosexualActivities = [
    {
      id: 1,
      title: "Expressão de Identidade",
      description: "Criar canções que permitam a expressão segura da identidade pessoal, incluindo temas como autoconhecimento corporal e autocuidado. Utiliza o espaço protegido da música para explorar o desenvolvimento saudável da identidade."
    },
    {
      id: 2,
      title: "Limites e Consentimento Musical",
      description: "Atividades rítmicas em pares onde um participante propõe um ritmo e o outro escolhe acompanhar, modificar ou recusar. Trabalha concretamente conceitos de consentimento, respeito e limites nas interações."
    },
    {
      id: 3,
      title: "Diálogo sobre Mudanças Corporais",
      description: "Utilizar canções que abordam positivamente as mudanças corporais nas diferentes fases do desenvolvimento. A música funciona como facilitadora para conversas sobre puberdade, adolescência e autoestima corporal."
    },
    {
      id: 4,
      title: "Exploração de Emoções Relacionais",
      description: "Criar improvisações musicais que expressem diferentes emoções relacionadas a relacionamentos (amizade, admiração, interesse). Desenvolve vocabulário emocional saudável e diferenciação de sentimentos."
    },
    {
      id: 5,
      title: "Contos Musicais de Desenvolvimento",
      description: "Criar histórias musicadas sobre as diferentes fases do desenvolvimento humano, desde a infância até a vida adulta. Contextualiza o desenvolvimento como processo natural e contínuo."
    },
    {
      id: 6,
      title: "Comunicação Através da Música",
      description: "Exercícios de comunicação não-verbal através da música, onde os participantes expressam necessidades, desejos e limites sem palavras. Desenvolve habilidades de expressão assertiva e respeito mútuo."
    },
    {
      id: 7,
      title: "Ritmos e Papéis Sociais",
      description: "Explorar musicalmente diferentes papéis sociais e como eles se relacionam com expectativas sobre comportamento. Usa a flexibilidade da expressão musical para questionar estereótipos rígidos."
    },
    {
      id: 8,
      title: "Canções de Respeito e Dignidade",
      description: "Compor canções sobre respeito pelo próprio corpo e pelo corpo dos outros. Desenvolve conceitos como dignidade pessoal, privacidade e autoestima de forma adequada à idade."
    },
    {
      id: 9,
      title: "Improvisação de Narrativas Saudáveis",
      description: "Criar improvisações musicais que contam histórias de relações saudáveis, baseadas em reciprocidade e respeito. Oferece modelos positivos de interação através da expressão musical."
    },
    {
      id: 10,
      title: "Afirmação de Autonomia",
      description: "Exercícios musicais onde cada participante tem oportunidade de liderar, fazer escolhas e ser respeitado em suas decisões. Fortalece a autonomia sobre o próprio corpo e escolhas pessoais."
    }
  ];

  const psychosocialActivities = [
    {
      id: 1,
      title: "Trilha Sonora das Fases da Vida",
      description: "Explorar músicas que representam diferentes fases do desenvolvimento psicossocial (infância, adolescência, idade adulta). Os participantes discutem as características, desafios e conquistas de cada fase, criando conexões entre as transições de vida e expressões musicais."
    },
    {
      id: 2,
      title: "Círculo da Confiança Musical",
      description: "Em círculo, cada participante fecha os olhos enquanto os outros criam um ambiente sonoro seguro ao seu redor. Desenvolve confiança básica e senso de segurança em relação ao ambiente social, trabalhando o primeiro estágio psicossocial."
    },
    {
      id: 3,
      title: "Improvisação de Autonomia",
      description: "Oferecer oportunidades para improvisar musicalmente com escolhas progressivamente mais independentes. Começa com opções limitadas e expande gradualmente, fortalecendo o desenvolvimento da autonomia versus vergonha/dúvida."
    },
    {
      id: 4,
      title: "Projeto Musical Coletivo",
      description: "Planejar, criar e apresentar um projeto musical em grupo com etapas definidas. Cada participante assume responsabilidades específicas, promovendo iniciativa e propósito, enquanto evita sentimentos de culpa por desejos ambiciosos."
    },
    {
      id: 5,
      title: "Competência Musical Colaborativa",
      description: "Atividades em que cada participante desenvolve uma habilidade específica (percussão, voz, composição) e depois todos colaboram usando essas habilidades. Aborda o conflito entre competência e inferioridade através da valorização das contribuições únicas."
    },
    {
      id: 6,
      title: "Exploração de Identidade Musical",
      description: "Criar um 'perfil musical' pessoal que represente a identidade atual. Explorar diferentes estilos musicais que ressoam com aspectos da personalidade, ajudando na formação de identidade versus confusão de papéis."
    },
    {
      id: 7,
      title: "Composição de Conexões",
      description: "Em pares ou pequenos grupos, criar músicas que expressem diferentes tipos de conexões interpessoais. Trabalha o estágio de intimidade versus isolamento, promovendo vinculação emocional saudável."
    },
    {
      id: 8,
      title: "Melodias de Mentoria",
      description: "Participantes mais experientes ensinam habilidades musicais aos menos experientes, criando relações de mentoria. Desenvolve o senso de generatividade versus estagnação através da transmissão de conhecimento e cuidado."
    },
    {
      id: 9,
      title: "Narrativas Sonoras de Vida",
      description: "Criar uma 'autobiografia musical' que integre elementos significativos da história pessoal. Promove a integridade versus desespero através da reflexão e aceitação do caminho de vida."
    },
    {
      id: 10,
      title: "Concerto de Gerações",
      description: "Atividade intergeracional onde participantes de diferentes faixas etárias compartilham músicas significativas de suas gerações e criam algo novo juntos. Integra todos os estágios psicossociais em uma única experiência."
    }
  ];

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
      description: "",
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
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      id: "creative",
      title: "7. Desenvolvimento Criativo",
      description: "",
      icon: <Sparkles className="h-5 w-5" />
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
      description: "",
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

      {/* Dialog for Cognitive Development Activities */}
      <Dialog open={selectedCategory === 'cognitive'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Brain className="h-5 w-5" />
              Desenvolvimento Cognitivo
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para estimular o desenvolvimento cognitivo
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {cognitiveActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Social Development Activities */}
      <Dialog open={selectedCategory === 'social'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5" />
              Desenvolvimento Social
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para promover o desenvolvimento social
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {socialActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Emotional Development Activities */}
      <Dialog open={selectedCategory === 'emotional'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="h-5 w-5" />
              Desenvolvimento Emocional
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para desenvolver a inteligência emocional
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {emotionalActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Motor Development Activities */}
      <Dialog open={selectedCategory === 'motor'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Move className="h-5 w-5" />
              Desenvolvimento Motor
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para estimular o desenvolvimento motor
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {motorActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Language Development Activities */}
      <Dialog open={selectedCategory === 'language'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5" />
              Desenvolvimento da Linguagem
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para desenvolver habilidades linguísticas
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {languageActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Moral Development Activities */}
      <Dialog open={selectedCategory === 'moral'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5" />
              Desenvolvimento Moral
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para promover o desenvolvimento de valores morais
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {moralActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Creative Development Activities */}
      <Dialog open={selectedCategory === 'creative'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5" />
              Desenvolvimento Criativo
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para estimular o desenvolvimento criativo
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {creativeActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Psychosexual Development Activities */}
      <Dialog open={selectedCategory === 'psychosexual'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5" />
              Desenvolvimento Psicossexual
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para promover o desenvolvimento psicossexual saudável
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {psychosexualActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Psychosocial Development Activities */}
      <Dialog open={selectedCategory === 'psychosocial'} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5" />
              Desenvolvimento Psicossocial
            </DialogTitle>
            <DialogDescription>
              Atividades de musicoterapia para promover o desenvolvimento psicossocial
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {psychosocialActivities.map((activity) => (
                <AccordionItem key={activity.id} value={`item-${activity.id}`}>
                  <AccordionTrigger className="text-md font-medium">
                    {activity.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

