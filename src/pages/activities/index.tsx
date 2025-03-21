
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brain, Users, Heart, Move, MessageSquare, BookOpen, Music, 
  Zap, User, Lightbulb, HelpingHand, Globe, Puzzle, Target, 
  Eye, Flame, Shield, GraduationCap, FlaskConical, ShieldCheck,
  Sparkles, Church, Cross
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
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  
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
      description: "Exercícios musicais em que os participantes precisam confiar uns nos outros (como criar msica de olhos fechados seguindo apenas pistas sonoras). Desenvolve confiança e integridade."
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

  const intellectualActivities = [
    {
      id: 1,
      title: "Análise Musical Comparativa",
      description: "Apresentar duas peças musicais de estilos diferentes e pedir que os participantes identifiquem diferenças estruturais, instrumentação, e elementos teóricos. Desenvolve pensamento analítico, categorização e memória de trabalho."
    },
    {
      id: 2,
      title: "Composição com Padrões Matemáticos",
      description: "Criar composições utilizando sequências matemáticas como Fibonacci ou progressões geométricas como base para ritmos ou melodias. Estabelece conexões entre música e matemática, fortalecendo o pensamento lógico-matemático."
    },
    {
      id: 3,
      title: "Debates Musicais Estruturados",
      description: "Organizar debates sobre temas musicais (como 'Qual o impacto psicológico de determinadas escalas musicais?') seguindo regras de argumentação e contra-argumentação. Estimula raciocínio dedutivo, pensamento crítico e expressão verbal sofisticada."
    },
    {
      id: 4,
      title: "Decodificação Musical",
      description: "Converter mensagens ou conceitos em códigos musicais (usando notas, ritmos ou dinâmicas) e desafiar os outros a decodificá-los. Trabalha raciocínio simbólico e pensamento abstrato."
    },
    {
      id: 5,
      title: "Improvisação com Restrições Lógicas",
      description: "Criar improvisações que devem seguir regras lógicas específicas (ex: 'Se tocar uma nota aguda, deve seguir com duas graves', 'Se usar percussão, não pode usar voz'). Desenvolve raciocínio condicional e flexibilidade cognitiva."
    },
    {
      id: 6,
      title: "Traduão Multimodal",
      description: "Transformar informações de um formato para outro através da música: criar representações sonoras de gráficos, tabelas ou textos científicos. Desenvolve pensamento interdisciplinar e capacidade de transcodificação."
    },
    {
      id: 7,
      title: "Música e História das Ideias",
      description: "Explorar como diferentes períodos musicais refletem correntes filosóficas e intelectuais de suas épocas. Participantes criam peças que representam conceitos filosóficos específicos. Promove compreensão contextual e pensamento integrado."
    },
    {
      id: 8,
      title: "Laboratório Sonoro",
      description: "Conduzir 'experimentos sonoros' com controle de variáveis: testar como diferentes elementos musicais afetam respostas emocionais ou físicas, formulando e testando hipóteses. Desenvolve método científico aplicado à experiência musical."
    },
    {
      id: 9,
      title: "Mapeamento Conceitual Sonoro",
      description: "Criar mapas conceituais interativos onde conceitos são representados por sons ou trechos musicais, e as relações entre eles são exploradas através de transições sonoras. Estimula organização hierárquica de conhecimento."
    },
    {
      id: 10,
      title: "Seminários Musicais",
      description: "Participantes pesquisam aspectos específicos da teoria musical, neurociência da música ou musicoterapia e apresentam seminários interativos combinando explicação verbal com demonstrações práticas. Desenvolve habilidades metacognitivas e de comunicação acadêmica."
    }
  ];

  const adaptiveActivities = [
    {
      id: 1,
      title: "Mudança Musical Fluida",
      description: "Iniciar com um padrão musical estabelecido e gradualmente introduzir mudanças (tempo, ritmo, estilo) que os participantes devem acompanhar sem pausar. Desenvolve flexibilidade cognitiva e capacidade de adaptação a mudanças inesperadas."
    },
    {
      id: 2,
      title: "Solução Musical Criativa",
      description: "Apresentar 'problemas musicais' (como criar música com instrumentos limitados ou adaptar-se a restrições de som) e incentivar soluções criativas. Fortalece resolução de problemas e pensamento alternativo."
    },
    {
      id: 3,
      title: "Improvisação com Obstáculos",
      description: "Durante uma improvisação em grupo, introduzir obstáculos musicais (mudanças de tom, pausas obrigatórias) que exigem que os participantes se adaptem rapidamente. Trabalha adaptabilidade emocional e tolerância à frustração."
    },
    {
      id: 4,
      title: "Transição de Papéis Musicais",
      description: "Em uma atividade musical contínua, os participantes alternam entre diferentes papéis (líder, acompanhante, solista, ouvinte) com base em sinais predefinidos. Desenvolve adaptabilidade social e flexibilidade de papéis."
    },
    {
      id: 5,
      title: "Resiliência Sonora",
      description: "Criar uma composição que representa superação de dificuldades, começando com sons dissonantes ou desafiadores que gradualmente se transformam em harmonia. Trabalha processamento de adversidades e perseverança."
    },
    {
      id: 6,
      title: "Adaptação Ambiental Sonora",
      description: "Os participantes criam música que se adapta a diferentes ambientes imaginados (floresta, cidade, praia, espaço). A cada mudança de cenário, a música deve se transformar adequadamente. Desenvolve consciência contextual e adaptação ambiental."
    },
    {
      id: 7,
      title: "Orquestra de Recursos",
      description: "Cada participante representa um 'recurso adaptativo' (persistência, pensamento positivo, busca de ajuda) através de um instrumento. Juntos, criam uma 'sinfonia de enfrentamento'. Fortalece identificação e integração de recursos adaptativos."
    },
    {
      id: 8,
      title: "Transformação de Emoções",
      description: "Expressar musicalmente uma emoção difícil e gradualmente transformá-la em outra mais positiva ou manejável. Desenvolve regulação emocional e capacidade de transformar experiências internas."
    },
    {
      id: 9,
      title: "Colaboração Adaptativa",
      description: "Atividade em que os recursos musicais (instrumentos, espaço) são intencionalmente limitados, exigindo que o grupo encontre formas criativas de colaborar e compartilhar. Trabalha adaptação social e resolução colaborativa de problemas."
    },
    {
      id: 10,
      title: "Narrativa de Superação",
      description: "Criar coletivamente uma história musical que represente o processo de enfrentar um desafio e adaptar-se a ele. A sequência musical demonstra as fases: problema, tentativas, adaptação e novo equilíbrio. Integra compreensão narrativa da adaptação."
    }
  ];

  const spiritualActivities = [
    {
      id: 1,
      title: "Meditação Bíblica com Música",
      description: "Utilizar música cristã instrumental suave como base para uma meditação guiada em versículos bíblicos selecionados. A música facilita a conexão com o texto sagrado e ajuda a aprofundar a experiência contemplativa da Palavra."
    },
    {
      id: 2,
      title: "Sugestões de Músicas Evangélicas",
      description: "Explorar canções como 'Deus é Deus' (Delino Marçal), 'Nada Além do Sangue' (Fernandinho), 'Oceanos' (Hillsong), 'Grandes Coisas' (Fernandinho) e 'Eu Navegarei' (Ministério Ipiranga). Analisar suas letras, mensagens bíblicas e como podem ser utilizadas terapeuticamente."
    },
    {
      id: 3,
      title: "Composição de Salmos Pessoais",
      description: "Guiar os participantes a comporem seus próprios salmos musicados, inspirados no formato dos Salmos bíblicos, expressando louvor, gratidão, súplica ou lamento. Desenvolve expressão espiritual personalizada dentro da tradição cristã."
    },
    {
      id: 4,
      title: "Canções de Identidade Espiritual",
      description: "Criar canções que expressam a identidade espiritual pessoal, utilizando metáforas, símbolos e linguagem que ressoam com a compreensão espiritual de cada um. Fortalece o senso de propósito e pertencimento espiritual."
    },
    {
      id: 5,
      title: "Música de Adoração Terapêutica",
      description: "Utilizar canções de adoração em contexto terapêutico, focando na experiência de transcendência, conexão e entrega. Desenvolve capacidade de soltar o controle e experimentar confiança em algo maior."
    },
    {
      id: 6,
      title: "Histórias Bíblicas Musicadas",
      description: "Transformar narrativas bíblicas significativas em pequenas peças musicais, onde os participantes podem incorporar personagens ou emoções presentes nas histórias. Facilita a internalização de valores e ensinamentos bíblicos."
    },
    {
      id: 7,
      title: "Círculo de Comunhão Musical",
      description: "Criar experiências musicais que promovam senso de comunidade e pertencimento espiritual, onde cada participante contribui para um todo harmonioso. Trabalha conceitos de corpo espiritual e comunhão."
    },
    {
      id: 8,
      title: "Improvisação Contemplativa",
      description: "Guiar improvisações musicais suaves que facilitam estados contemplativos e meditativos. A música serve como âncora para a atenção plena e abertura à experiência espiritual."
    },
    {
      id: 9,
      title: "Canções de Celebração e Ritual",
      description: "Criar música para marcar momentos de transição, celebração ou ritual dentro da jornada espiritual. Oferece estrutura e expressão para momentos significativos da vida de fé."
    },
    {
      id: 10,
      title: "Harmonização da Palavra",
      description: "Escolher versículos ou passagens bíblicas significativas e criar melodias que ajudem na memorização e internalização da Palavra. A música funciona como veículo que aprofunda o impacto do texto sagrado."
    }
  ];

  // Category mapping for icon display and data access
  const categories = [
    { id: "cognitive", name: "Cognitivas", icon: <Brain className="h-6 w-6 mr-2" />, data: cognitiveActivities },
    { id: "social", name: "Sociais", icon: <Users className="h-6 w-6 mr-2" />, data: socialActivities },
    { id: "emotional", name: "Emocionais", icon: <Heart className="h-6 w-6 mr-2" />, data: emotionalActivities },
    { id: "motor", name: "Motoras", icon: <Move className="h-6 w-6 mr-2" />, data: motorActivities },
    { id: "language", name: "Linguagem", icon: <MessageSquare className="h-6 w-6 mr-2" />, data: languageActivities },
    { id: "moral", name: "Morais", icon: <Shield className="h-6 w-6 mr-2" />, data: moralActivities },
    { id: "creative", name: "Criativas", icon: <Lightbulb className="h-6 w-6 mr-2" />, data: creativeActivities },
    { id: "psychosexual", name: "Psicossexuais", icon: <HelpingHand className="h-6 w-6 mr-2" />, data: psychosexualActivities },
    { id: "psychosocial", name: "Psicossociais", icon: <User className="h-6 w-6 mr-2" />, data: psychosocialActivities },
    { id: "intellectual", name: "Intelectuais", icon: <GraduationCap className="h-6 w-6 mr-2" />, data: intellectualActivities },
    { id: "adaptive", name: "Adaptativas", icon: <Puzzle className="h-6 w-6 mr-2" />, data: adaptiveActivities },
    { id: "spiritual", name: "Espirituais", icon: <Church className="h-6 w-6 mr-2" />, data: spiritualActivities },
  ];

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
  };

  const closeDialog = () => {
    setSelectedActivity(null);
  };

  const getActivitiesForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.data : [];
  };

  const selectedCategoryData = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory) 
    : null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Atividades de Musicoterapia</h1>
      
      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader className="flex flex-row items-center">
                {category.icon}
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {category.data.length} atividades disponíveis
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory(null)}
            >
              Voltar para categorias
            </Button>
            {selectedCategoryData && (
              <h2 className="text-2xl font-semibold flex items-center">
                {selectedCategoryData.icon}
                Atividades {selectedCategoryData.name}
              </h2>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getActivitiesForCategory(selectedCategory).map((activity) => (
              <Card 
                key={activity.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <CardHeader>
                  <CardTitle>{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {activity.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={closeDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedActivity.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-foreground">
              <p className="mt-2 text-base">
                {selectedActivity.description}
              </p>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
