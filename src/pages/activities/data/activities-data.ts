
interface Activity {
  id: number;
  title: string;
  description: string;
}

export const activitiesData: Record<string, Activity[]> = {
  cognitive: [
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
    },
    {
      id: 11,
      title: "Puzzle Musical",
      description: "Reorganizar trechos de uma música familiar que foram embaralhados. Trabalha a memória auditiva, sequenciamento lógico e reconstrução cognitiva."
    },
    {
      id: 12,
      title: "Desafio de Categorização Musical",
      description: "Agrupar instrumentos ou sons por características específicas (família de instrumentos, material, origem cultural). Desenvolve pensamento classificatório e conhecimento musical."
    },
    {
      id: 13,
      title: "Jogo de Memória Sonora",
      description: "Criar pares de sons idênticos que devem ser identificados e pareados sem pistas visuais. Trabalha memória auditiva e discriminação sonora refinada."
    },
    {
      id: 14,
      title: "Análise de Estrutura Musical",
      description: "Identificar padrões, repetições e variações em peças musicais simples. Desenvolve pensamento analítico e reconhecimento de estruturas."
    },
    {
      id: 15,
      title: "Metamorfose Melódica",
      description: "Transformar progressivamente uma melodia seguindo regras específicas. Trabalha manipulação mental de informações sonoras e flexibilidade cognitiva."
    },
    {
      id: 16,
      title: "Narrativa Sonora Sequencial",
      description: "Criar uma história em grupo onde cada elemento novo deve relacionar-se logicamente com o anterior, com suporte sonoro. Desenvolve coesão de pensamento e raciocínio sequencial."
    },
    {
      id: 17,
      title: "Estimativa Temporal Musical",
      description: "Estimar a duração de trechos musicais sem contar ou ver relógio. Trabalha percepção temporal e atenção sustentada."
    },
    {
      id: 18,
      title: "Mosaico Sonoro",
      description: "Reconstruir uma peça musical a partir de fragmentos, como um quebra-cabeça auditivo. Trabalha integração de informações e síntese cognitiva."
    },
    {
      id: 19,
      title: "Jogo da Exclusão Sonora",
      description: "Identificar qual elemento sonoro não pertence a um grupo, baseado em características cognitivas específicas. Trabalha discriminação auditiva analítica."
    },
    {
      id: 20,
      title: "Construção de Algoritmos Musicais",
      description: "Criar e seguir sequências de regras precisas para gerar padrões musicais. Desenvolve pensamento computacional e lógica sequencial."
    }
  ],
  social: [
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
    },
    {
      id: 11,
      title: "Ponte Musical",
      description: "Dois subgrupos criam músicas separadamente e depois encontram formas de integrá-las. Desenvolve negociação, adaptação social e resolução colaborativa de desafios."
    },
    {
      id: 12,
      title: "Histórias Circulares Musicadas",
      description: "Cada participante adiciona um elemento à história e um elemento musical correspondente. Trabalha escuta ativa e construção compartilhada de narrativas."
    },
    {
      id: 13,
      title: "Microfone Aberto Terapêutico",
      description: "Espaço estruturado onde cada participante pode se expressar musicalmente enquanto os outros oferecem suporte. Desenvolve confiança social e aceitação do outro."
    },
    {
      id: 14,
      title: "Dança das Cadeiras Cooperativa",
      description: "Versão modificada onde ninguém é eliminado, e o grupo deve encontrar soluções para que todos permaneçam no jogo. Trabalha cooperação e solução coletiva de problemas."
    },
    {
      id: 15,
      title: "Diálogos Instrumentais",
      description: "Conversas não-verbais usando apenas instrumentos musicais, com foco em turnos de fala, resposta ao outro e comunicação clara. Trabalha habilidades pragmáticas de comunicação."
    },
    {
      id: 16,
      title: "Construção de Comunidade Sonora",
      description: "Criar coletivamente um ambiente sonoro que represente uma comunidade ideal. Trabalha valores sociais, pertencimento e visão compartilhada."
    },
    {
      id: 17,
      title: "Jogos de Confiança Musical",
      description: "Atividades como guiar alguém com olhos vendados usando apenas sinais sonoros. Desenvolve confiança interpessoal e responsabilidade social."
    },
    {
      id: 18,
      title: "Celebração de Conquistas",
      description: "Rituais musicais para reconhecer e celebrar conquistas individuais e coletivas. Trabalha reconhecimento social, gratidão e motivação de grupo."
    },
    {
      id: 19,
      title: "Música para Inclusão",
      description: "Criar adaptações musicais para garantir que participantes com diferentes habilidades possam participar plenamente. Desenvolve empatia e valorização da diversidade."
    },
    {
      id: 20,
      title: "Assembleia Sonora",
      description: "Estrutura para tomada de decisões coletivas sobre um projeto musical compartilhado. Trabalha democracia, escuta de diferentes perspectivas e consenso."
    }
  ],
  emotional: [
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
    },
    {
      id: 11,
      title: "Diálogo com Emoções",
      description: "Personificar diferentes emoções através de instrumentos distintos e criar um diálogo musical entre elas. Trabalha reconhecimento e integração de estados emocionais diversos."
    },
    {
      id: 12,
      title: "Paisagens Emocionais",
      description: "Criar ambientes sonoros que representem diferentes paisagens emocionais internas. Desenvolve vocabulário emocional e consciência das nuances dos sentimentos."
    },
    {
      id: 13,
      title: "Contenção Emocional Sonora",
      description: "Desenvolver estruturas musicais que ajudam a conter emoções intensas, oferecendo limites seguros para expressão. Trabalha regulação emocional e sensação de segurança."
    },
    {
      id: 14,
      title: "Mural das Memórias Emocionais",
      description: "Associar músicas a memórias emocionais significativas, criando um 'mural sonoro' que pode ser revisitado. Trabalha processamento emocional e ressignificação."
    },
    {
      id: 15,
      title: "Caixa de Recursos Emocionais",
      description: "Criar uma 'caixa' de instrumentos, sons ou músicas que servem como recursos para momentos emocionalmente desafiadores. Desenvolve autorregulação e planejamento de enfrentamento."
    },
    {
      id: 16,
      title: "Musicalizando o Corpo Emocional",
      description: "Explorar como diferentes emoções se manifestam fisicamente e representá-las sonoramente. Trabalha integração corpo-mente e consciência somática das emoções."
    },
    {
      id: 17,
      title: "Suporte Musical Mútuo",
      description: "Em pares ou grupos pequenos, criar músicas de apoio emocional uns para os outros. Desenvolve empatia ativa e capacidade de oferecer suporte emocional."
    },
    {
      id: 18,
      title: "Improvisação de Coragem",
      description: "Criar peças musicais que expressam e fortalecem a coragem para enfrentar emoções difíceis. Trabalha resiliência e enfrentamento saudável de desafios emocionais."
    },
    {
      id: 19,
      title: "Melodias de Autoconsciência",
      description: "Acompanhar mudanças emocionais ao longo do tempo através de criações musicais periódicas. Desenvolve automonitoramento emocional e percepção de padrões."
    },
    {
      id: 20,
      title: "Celebração Emocional",
      description: "Criar rituais musicais para honrar toda a gama de experiências emocionais, incluindo as desafiadoras. Trabalha aceitação plena do espectro emocional humano."
    }
  ],
  motor: [
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
    },
    {
      id: 11,
      title: "Dança dos Níveis",
      description: "Explorar movimentos musicais em diferentes níveis espaciais (alto, médio, baixo) com transições fluidas entre eles. Desenvolve consciência espacial e adaptação postural."
    },
    {
      id: 12,
      title: "Ritmo e Respiração",
      description: "Sincronizar movimentos específicos com padrões respiratórios e musicais. Trabalha integração neuromotora e consciência da relação entre respiração e movimento."
    },
    {
      id: 13,
      title: "Orquestra de Movimentos Precisos",
      description: "Realizar pequenos movimentos controlados (como dedilhar instrumentos ou fazer gestos minuciosos) em sincronia com a música. Desenvolve motricidade fina e precisão de movimentos."
    },
    {
      id: 14,
      title: "Coreografias Progressivas",
      description: "Aprender sequências coreográficas simples que vão aumentando gradualmente em complexidade. Trabalha memória motora sequencial e coordenação corpo-espaço."
    },
    {
      id: 15,
      title: "Jogos de Bola Musicais",
      description: "Passar ou quicar uma bola seguindo ritmos específicos, ajustando a força e direção conforme mudanças na música. Desenvolve coordenação óculo-manual e adaptação motora."
    },
    {
      id: 16,
      title: "Cruzamento de Linha Média",
      description: "Realizar movimentos que cruzam o centro do corpo ao som da música, como tocar o joelho direito com a mão esquerda. Trabalha integração hemisférica e esquema corporal."
    },
    {
      id: 17,
      title: "Expressão Motora de Dinâmicas",
      description: "Representar corporalmente as mudanças de dinâmica musical (forte/fraco, rápido/lento). Desenvolve modulação de força e velocidade motora."
    },
    {
      id: 18,
      title: "Dança das Texturas",
      description: "Criar movimentos que representem diferentes texturas sonoras (áspero, suave, pontiagudo), explorando qualidades de movimento. Trabalha expressividade motora e refinamento sensorial."
    },
    {
      id: 19,
      title: "Percussão com Objetos Cotidianos",
      description: "Explorar possibilidades de movimento usando objetos do dia a dia como instrumentos. Desenvolve criatividade motora e manipulação adaptativa de objetos."
    },
    {
      id: 20,
      title: "Desafio de Dissociação Rítmica",
      description: "Realizar diferentes padrões rítmicos simultaneamente com diferentes partes do corpo (por exemplo, pés em um ritmo, mãos em outro). Trabalha independência motora e coordenação complexa."
    }
  ],
  language: [
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
    },
    {
      id: 11,
      title: "Expansão Frasal Melódica",
      description: "Começar com frases musicais simples e gradualmente expandí-las com elementos linguísticos mais complexos. Trabalha estruturação sintática e expansão da complexidade linguística."
    },
    {
      id: 12,
      title: "Canções de Funções Comunicativas",
      description: "Criar músicas específicas para diferentes funções pragmáticas (pedir ajuda, expressar preferências, fazer perguntas). Desenvolve repertório comunicativo funcional."
    },
    {
      id: 13,
      title: "Jogo de Associação Sonora",
      description: "Conectar palavras que compartilham características fonológicas específicas através da música. Trabalha consciência fonológica avançada e discriminação auditiva fina."
    },
    {
      id: 14,
      title: "Narrativas Musicais Temporais",
      description: "Criar histórias cantadas com ênfase em marcadores temporais e sequenciais (depois, antes, durante). Trabalha organização temporal do discurso narrativo."
    },
    {
      id: 15,
      title: "Transformação de Categorias",
      description: "Cantar listas de palavras de uma categoria que, com uma mudança musical, transformam-se em outra categoria relacionada. Trabalha flexibilidade lexical e conexões semânticas."
    },
    {
      id: 16,
      title: "Coro de Perguntas e Respostas",
      description: "Estrutura musical onde um líder faz perguntas cantadas e o grupo responde, trabalhando diferentes tipos de construções interrogativas. Desenvolve compreensão de questões e formulação de respostas."
    },
    {
      id: 17,
      title: "Poesia Rítmica",
      description: "Criar poemas com estruturas rítmicas definidas, explorando sonoridade, rima e padrões métricos. Trabalha consciência metalinguística e sensibilidade prosódica."
    },
    {
      id: 18,
      title: "Descrição Musical Detalhada",
      description: "Descrever objetos ou cenas com detalhes progressivamente mais específicos, acompanhados por estruturas musicais. Desenvolve vocabulário descritivo e precisão linguística."
    },
    {
      id: 19,
      title: "Jogo do Contrário Musical",
      description: "Cantar antônimos quando a música muda de direção melódica ou harmônica. Trabalha relações semânticas de oposição e expansão do vocabulário relacional."
    },
    {
      id: 20,
      title: "Figurativo em Música",
      description: "Explorar expressões idiomáticas e linguagem figurativa através de representações musicais criativas. Desenvolve compreensão de significados não-literais e metafóricos."
    }
  ],
  moral: [
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
    },
    {
      id: 11,
      title: "Música da Reconciliação",
      description: "Criar peças que expressem o processo de reconhecer erros, pedir desculpas e reconstruir relações. Trabalha responsabilidade moral e processos de reparação."
    },
    {
      id: 12,
      title: "Exploração de Virtudes",
      description: "Dedicar sessões musicais à exploração profunda de virtudes específicas (coragem, temperança, prudência), criando representações sonoras de suas manifestações práticas."
    },
    {
      id: 13,
      title: "Valores em Conflito",
      description: "Representar musicalmente situações onde diferentes valores morais entram em conflito, explorando a complexidade das escolhas éticas. Desenvolve pensamento moral nuançado."
    },
    {
      id: 14,
      title: "Canções de Cuidado",
      description: "Compor músicas sobre a responsabilidade de cuidar de si mesmo, dos outros e do ambiente. Trabalha a ética do cuidado como fundamento moral."
    },
    {
      id: 15,
      title: "Fronteiras Morais Sonoras",
      description: "Criar representações sonoras de limites morais e suas consequências quando ultrapassados. Desenvolve compreensão de normas sociais e limites éticos."
    },
    {
      id: 16,
      title: "Ritual de Valores Compartilhados",
      description: "Estabelecer rituais musicais que afirmam e celebram valores morais importantes para o grupo. Trabalha coesão moral e reforço positivo de comportamentos éticos."
    },
    {
      id: 17,
      title: "Improvisação da Integridade",
      description: "Criar situações musicais onde os participantes devem manter sua parte mesmo quando seria mais fácil mudar. Trabalha consistência moral e compromisso com princípios."
    },
    {
      id: 18,
      title: "Metáforas Morais Musicais",
      description: "Desenvolver metáforas sonoras para conceitos morais abstratos (o 'peso' da responsabilidade, a 'luz' da verdade). Facilita a compreensão de conceitos éticos complexos."
    },
    {
      id: 19,
      title: "Canção da Coragem Moral",
      description: "Criar músicas sobre situações que exigem defender o que é certo mesmo quando difícil. Trabalha força moral e resistência à pressão negativa."
    },
    {
      id: 20,
      title: "Harmonia de Princípios",
      description: "Explorar como diferentes princípios morais podem trabalhar juntos, assim como diferentes notas formam acordes harmoniosos. Desenvolve visão integrada da moral."
    }
  ],
  creative: [
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
    },
    {
      id: 11,
      title: "Metamorfose Sonora",
      description: "Transformar progressivamente um som ou melodia em algo completamente diferente através de modificações graduais. Desenvolve flexibilidade criativa e pensamento transformacional."
    },
    {
      id: 12,
      title: "Orquestra de Emoções Incomuns",
      description: "Explorar musicalmente emoções complexas ou pouco nomeadas (como 'saudade', 'hygge', 'mono no aware'). Expande o repertório expressivo e a sutileza criativa."
    },
    {
      id: 13,
      title: "Fusão de Gêneros Improváveis",
      description: "Combinar elementos de estilos musicais muito diferentes para criar algo novo (como ópera com hip-hop, música clássica com sons industriais). Trabalha pensamento combinatório e inovação."
    },
    {
      id: 14,
      title: "Narrativas Não-Lineares",
      description: "Criar histórias musicais que não seguem uma estrutura cronológica tradicional, experimentando com flashbacks, realidades paralelas ou perspectivas múltiplas. Desenvolve estruturação criativa complexa."
    },
    {
      id: 15,
      title: "Sinestesia Musical",
      description: "Explorar conexões entre sons e outras experiências sensoriais (cores, texturas, sabores), criando música que tenta evocar essas conexões. Trabalha associações criativas entre modalidades sensoriais."
    },
    {
      id: 16,
      title: "Desconstrução e Reconstrução",
      description: "Desconstruir completamente uma peça musical conhecida e usar seus elementos como matéria-prima para criar algo inteiramente novo. Desenvolve pensamento analítico-criativo."
    },
    {
      id: 17,
      title: "Música Conceitual",
      description: "Criar peças baseadas em conceitos abstratos ou filosóficos (como 'tempo', 'infinito', 'paradoxo'). Trabalha a tradução de ideias complexas em expressão artística."
    },
    {
      id: 18,
      title: "Laboratório de Hibridização",
      description: "Combinar música com outras formas de arte (pintura em tempo real, movimento, poesia) criando expressões artísticas integradas. Desenvolve criatividade interdisciplinar."
    },
    {
      id: 19,
      title: "Música Generativa",
      description: "Estabelecer sistemas ou regras simples que, quando seguidas, geram composições complexas emergentes. Explora princípios de auto-organização criativa e complexidade."
    },
    {
      id: 20,
      title: "Reimaginação de Possibilidades",
      description: "Criar músicas que representem cenários alternativos ou mundos imaginários. Trabalha pensamento especulativo e expansão dos limites da imaginação criativa."
    }
  ],
  psychosexual: [
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
    },
    {
      id: 11,
      title: "Integração de Polaridades",
      description: "Explorar musicalmente a integração de qualidades tradicionalmente polarizadas (força/sensibilidade, assertividade/receptividade). Trabalha a fluidez e integração de diferentes aspectos da identidade."
    },
    {
      id: 12,
      title: "Canções de Ciclos de Vida",
      description: "Criar músicas que honram as transições naturais do desenvolvimento humano. Trabalha aceitação e celebração das mudanças corporais e emocionais em diferentes fases."
    },
    {
      id: 13,
      title: "Metáforas Musicais de Crescimento",
      description: "Desenvolver metáforas sonoras para processos de desenvolvimento, como a transformação de uma semente em planta. Facilita a compreensão de processos internos de maturação."
    },
    {
      id: 14,
      title: "Expressão de Identidade Não-Verbal",
      description: "Criar formas de expressão musical que representem aspectos da identidade que podem ser difíceis de verbalizar. Oferece canais alternativos para autoexpressão e autoconhecimento."
    },
    {
      id: 15,
      title: "Diálogo Musical sobre Segurança",
      description: "Usar estruturas musicais para explorar temas como segurança pessoal, reconhecimento de situações de risco e busca de ajuda. Desenvolve habilidades de autocuidado e proteção."
    },
    {
      id: 16,
      title: "Sonorização de Fronteiras Pessoais",
      description: "Representar sonoramente diferentes tipos de fronteiras interpessoais e como respeitá-las. Trabalha competências socioemocioanis fundamentais para relações saudáveis."
    },
    {
      id: 17,
      title: "Ritmos de Individuação",
      description: "Explorar através da música o processo de diferenciação do eu em relação aos outros. Trabalha a formação saudável da identidade e autonomia pessoal."
    },
    {
      id: 18,
      title: "Celebração da Diversidade",
      description: "Criar músicas que celebram a diversidade de expressões de identidade. Desenvolve respeito pela pluralidade e reconhecimento da legitimidade de diferentes formas de ser."
    },
    {
      id: 19,
      title: "Histórias de Resiliência",
      description: "Compor narrativas musicais sobre superar desafios relacionados à imagem corporal e autoestima. Trabalha fatores de proteção e recursos internos."
    },
    {
      id: 20,
      title: "Círculo de Segurança Musical",
      description: "Criar um ambiente musical estruturado onde os participantes possam explorar temas sensíveis com apoio e contenção adequados. Desenvolve confiança e segurança emocional."
    }
  ],
  psychosocial: [
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
    },
    {
      id: 11,
      title: "Harmonia de Confiança",
      description: "Exercícios musicais progressivos que desenvolvem confiança interpessoal gradualmente. Trabalha a construção de apego seguro e superação de desconfiança básica (primeiro estágio de Erikson)."
    },
    {
      id: 12,
      title: "Autoria e Direção Musical",
      description: "Oportunidades para os participantes assumirem papéis de liderança criativa progressivamente mais complexos. Desenvolve vontade e iniciativa (segundo e terceiro estágios de Erikson)."
    },
    {
      id: 13,
      title: "Reconhecimento de Virtuosidade",
      description: "Criar estruturas para reconhecimento específico das habilidades únicas que cada participante traz ao grupo musical. Trabalha indústria versus inferioridade (quarto estágio)."
    },
    {
      id: 14,
      title: "Experimentação Musical Segura",
      description: "Oferecer um espaço protegido para experimentação de diferentes estilos, vozes e expressões musicais. Apoia a exploração saudável de identidade (quinto estágio)."
    },
    {
      id: 15,
      title: "Duetos Terapêuticos",
      description: "Criar música em pares com foco na escuta profunda e na resposta autêntica ao outro. Trabalha intimidade versus isolamento (sexto estágio)."
    },
    {
      id: 16,
      title: "Legado Musical Intergeracional",
      description: "Participantes criam peças musicais destinadas a serem ensinadas a gerações mais jovens. Desenvolve generatividade versus estagnação (sétimo estágio)."
    },
    {
      id: 17,
      title: "Composição de História de Vida",
      description: "Criar uma obra musical que integre elementos de toda a trajetória de vida, ressignificando desafios e celebrando conquistas. Trabalha integridade versus desespero (oitavo estágio)."
    },
    {
      id: 18,
      title: "Transições Musicais",
      description: "Explorar musicalmente os momentos de transição entre fases psicossociais, representando tanto os desafios quanto as novas possibilidades. Trabalha adaptação a mudanças desenvolvimentais."
    },
    {
      id: 19,
      title: "Resolução de Crises por Meio da Música",
      description: "Para cada estágio psicossocial, criar peças que representem o conflito central e sua resolução saudável. Desenvolve compreensão dos processos de crescimento psicossocial."
    },
    {
      id: 20,
      title: "Orquestra de Forças do Ego",
      description: "Representar musicalmente as diferentes forças que emergem da resolução positiva de cada estágio de Erikson (esperança, vontade, propósito, competência, fidelidade, amor, cuidado, sabedoria). Integra as conquistas desenvolvimentais."
    }
  ],
  intellectual: [
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
    },
    {
      id: 11,
      title: "Silogismos Musicais",
      description: "Construir argumentos lógicos em formato musical, onde premissas e conclusões são representadas por motivos musicais relacionados. Desenvolve raciocínio dedutivo e estruturação lógica do pensamento."
    },
    {
      id: 12,
      title: "Análise Harmônica Avançada",
      description: "Explorar e analisar progressões harmônicas complexas, identificando funções, substituições e resoluções não convencionais. Trabalha pensamento analítico musical de ordem superior."
    },
    {
      id: 13,
      title: "Música e Geometria Espacial",
      description: "Criar composições baseadas em conceitos geométricos (simetria, fractais, proporção áurea). Desenvolve compreensão da relação entre estruturas matemáticas e expressão musical."
    },
    {
      id: 14,
      title: "Música Algorítmica",
      description: "Desenvolver algoritmos simples que podem gerar composições musicais e explorar suas possibilidades e limitações. Trabalha pensamento computacional e lógica sistemática."
    },
    {
      id: 15,
      title: "Debate Epistemológico Musical",
      description: "Explorar diferentes formas de conhecer e entender a música (análise técnica, resposta emocional, contexto cultural). Desenvolve metacognição e compreensão de diferentes paradigmas de conhecimento."
    },
    {
      id: 16,
      title: "Música e Pensamento Contra-factual",
      description: "Criar composições que exploram cenários históricos alternativos na evolução da música. Desenvolve pensamento especulativo e compreensão de causalidade em sistemas complexos."
    },
    {
      id: 17,
      title: "Análise de Discurso Musical",
      description: "Examinar criticamente o conteúdo semântico e ideológico de diferentes gêneros musicais. Trabalha pensamento crítico e análise cultural sofisticada."
    },
    {
      id: 18,
      title: "Música e Teorias Científicas",
      description: "Representar musicalmente conceitos científicos complexos (relatividade, mecânica quântica, evolução). Desenvolve transposição de conhecimentos abstratos entre diferentes domínios."
    },
    {
      id: 19,
      title: "Hermenêutica Musical",
      description: "Praticar diferentes abordagens interpretativas para uma mesma obra musical. Trabalha compreensão da multiperspectividade e profundidade analítica."
    },
    {
      id: 20,
      title: "Música e Modelagem de Sistemas",
      description: "Criar representações sonoras de sistemas complexos (ecológicos, sociais, econômicos) para compreender suas dinâmicas. Desenvolve pensamento sistêmico e compreensão de interrelações complexas."
    }
  ],
  adaptive: [
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
    },
    {
      id: 11,
      title: "Integração de Dissonâncias",
      description: "Introduzir elementos dissonantes ou inesperados que inicialmente desestabilizam a harmonia musical, trabalhando gradualmente para integrá-los de forma significativa. Desenvolve capacidade de incorporar perturbações em uma nova ordem."
    },
    {
      id: 12,
      title: "Modulação de Intensidade Adaptativa",
      description: "Praticar a modulação consciente da resposta emocional a desafios musicais, aumentando gradualmente a intensidade. Trabalha a calibração da resposta adaptativa conforme a magnitude do desafio."
    },
    {
      id: 13,
      title: "Reconstrução Musical",
      description: "Após uma 'ruptura' intencional na estrutura musical, trabalhar colaborativamente para reconstruir uma nova peça com os 'fragmentos'. Desenvolve capacidade de reconstrução e ressignificação após rupturas."
    },
    {
      id: 14,
      title: "Navegação de Territórios Sonoros",
      description: "Explorar áreas musicais desconhecidas ou desconfortáveis com suporte adequado. Trabalha a expansão da zona de conforto e exploração adaptativa de novos contextos."
    },
    {
      id: 15,
      title: "Improvisação com Retorno Atrasado",
      description: "Criar música com sistemas de delay que requerem ajuste constante ao retorno sonoro não imediato. Desenvolve adaptação a condições de feedback não imediato e planejamento adaptativo."
    },
    {
      id: 16,
      title: "Metamorfose de Limitações",
      description: "Transformar restrições ou limitações (físicas, instrumentais, contextuais) em características distintivas e valorizadas da expressão musical. Trabalha ressignificação adaptativa de condições limitantes."
    },
    {
      id: 17,
      title: "Calibração Social Sonora",
      description: "Ajustar dinamicamente a própria expressão musical em resposta às mudanças na expressão do grupo. Desenvolve sensibilidade interpessoal e adaptação social dinâmica."
    },
    {
      id: 18,
      title: "Plasticidade Estilística",
      description: "Praticar a transição fluida entre diferentes estilos musicais, incorporando elementos de um no outro. Trabalha flexibilidade adaptativa e integração de diversidade."
    },
    {
      id: 19,
      title: "Música de Antecipação",
      description: "Criar peças que exploram a preparação para mudanças ou transições antecipadas. Desenvolve capacidade de previsão adaptativa e preparação para mudanças futuras."
    },
    {
      id: 20,
      title: "Ressonância e Coevolução",
      description: "Praticar adaptação mútua entre participantes, onde cada um responde às mudanças dos outros, criando um sistema musical adaptativo emergente. Trabalha co-regulação e adaptação interpessoal dinâmica."
    }
  ],
  spiritual: [
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
      title: "Canções de Confissão e Perdão",
      description: "Criar ou adaptar músicas que expressem reconhecimento de falhas e busca de perdão. A música oferece uma forma segura e estruturada para explorar temas de arrependimento e graça."
    },
    {
      id: 5,
      title: "Coro de Afirmações Espirituais",
      description: "Em grupo, criar canções que afirmem verdades espirituais importantes para os participantes. O formato coral reforça a dimensão comunitária da espiritualidade."
    },
    {
      id: 6,
      title: "Improvisação Contemplativa",
      description: "Propor momentos de improvisação musical livre após leituras de textos sagrados ou meditação. Permite expressão não-verbal de insights espirituais."
    },
    {
      id: 7,
      title: "Musicoterapia de Devoção",
      description: "Criar estruturas musicais regulares que possam ser incorporadas em práticas devocionais diárias. Desenvolve disciplina espiritual e constância."
    },
    {
      id: 8,
      title: "Canções de Peregrinação",
      description: "Compor músicas que representem a jornada espiritual, com suas etapas, desafios e momentos de crescimento. Contextualiza a espiritualidade como processo contínuo."
    },
    {
      id: 9,
      title: "Círculo de Louvor Intergeracional",
      description: "Reunir pessoas de diferentes idades para compartilhar canções de louvor de suas gerações. Valoriza a tradição espiritual e sua transmissão entre gerações."
    },
    {
      id: 10,
      title: "Escrita de Hinos Contemporâneos",
      description: "Guiar os participantes a comporem hinos que expressem sua fé em linguagem e estilo musical contemporâneos. Conecta tradição espiritual com expressão atual."
    },
    {
      id: 11,
      title: "Música e Liturgia Terapêutica",
      description: "Criar pequenos rituais musicais baseados em práticas litúrgicas tradicionais, adaptados para fins terapêuticos. Trabalha a conexão entre prática espiritual estruturada e bem-estar emocional."
    },
    {
      id: 12,
      title: "Sonorização de Textos Sagrados",
      description: "Transformar passagens bíblicas específicas em paisagens sonoras que capturem sua essência e mensagem. Desenvolve compreensão profunda e encarnada do texto sagrado."
    },
    {
      id: 13,
      title: "Canções de Testemunho",
      description: "Compor músicas que narram experiências de transformação espiritual pessoal. Trabalha a integração da história espiritual na identidade e o compartilhamento de experiências de fé."
    },
    {
      id: 14,
      title: "Parábolas Musicais",
      description: "Criar interpretações musicais de parábolas bíblicas, utilizando instrumentos e sons para representar os diferentes elementos e mensagens. Desenvolve compreensão aplicada dos ensinamentos."
    },
    {
      id: 15,
      title: "Improvisação em Comunhão",
      description: "Praticar improvisação musical em grupo como forma de vivenciar a comunhão espiritual, onde cada participante contribui para um todo maior. Trabalha a experiência de unidade na diversidade."
    },
    {
      id: 16,
      title: "Música de Intercesão",
      description: "Utilizar expressão musical como forma de prática intercessória, criando peças dedicadas ao bem-estar de outros. Desenvolve a dimensão altruísta da espiritualidade."
    },
    {
      id: 17,
      title: "Musicalizando Virtudes Espirituais",
      description: "Explorar musicalmente virtudes como compaixão, mansidão, paciência, gentileza e fidelidade. Trabalha o desenvolvimento do caráter através da expressão artística."
    },
    {
      id: 18,
      title: "Cantando as Estações Espirituais",
      description: "Criar músicas que representam diferentes estações da jornada espiritual (deserto, colheita, inverno, primavera). Desenvolve aceitação dos ciclos naturais da vida espiritual."
    },
    {
      id: 19,
      title: "Lamento Sagrado Musical",
      description: "Baseando-se na tradição dos salmos de lamento, criar expressões musicais autênticas de dor, questionamento e esperança. Legitima a expressão do sofrimento dentro do contexto espiritual."
    },
    {
      id: 20,
      title: "Oração Contemplativa Sonora",
      description: "Utilizar instrumentos e sons específicos como âncoras para prática de oração contemplativa. Desenvolve capacidade de presença espiritual e escuta interior através da música."
    }
  ],
  neurological: [
    {
      id: 1,
      title: "Estimulação Sensorial Rítmica",
      description: "Utilizar estímulos musicais rítmicos para ativar múltiplas áreas cerebrais simultaneamente. Os diferentes ritmos e frequências estimulam conexões neurais e promovem a integração sensorial."
    },
    {
      id: 2,
      title: "Mapeamento Sonoro Cerebral",
      description: "Associar diferentes regiões do cérebro a instrumentos específicos, criando uma 'orquestra cerebral' onde os participantes exploram as funções de cada área através da música."
    },
    {
      id: 3,
      title: "Sequências de Padrões Neurológicos",
      description: "Criar sequências musicais que seguem os padrões de desenvolvimento neurológico típico. Trabalha a maturação de circuitos cerebrais e a integração de reflexos primitivos."
    },
    {
      id: 4,
      title: "Sincronização de Hemisférios",
      description: "Atividades musicais que exigem o uso coordenado dos dois hemisférios cerebrais, como tocar um instrumento com a mão esquerda enquanto segue um ritmo com a direita. Promove a integração inter-hemisférica."
    },
    {
      id: 5,
      title: "Música e Neuroplasticidade",
      description: "Práticas musicais repetitivas e progressivas que exploram o princípio da neuroplasticidade. A repetição estruturada de elementos musicais específicos ajuda a formar novas conexões neurais."
    },
    {
      id: 6,
      title: "Estímulo de Funções Executivas",
      description: "Jogos musicais que trabalham memória operacional, controle inibitório e flexibilidade cognitiva. A improvisação dentro de regras definidas exercita o córtex pré-frontal."
    },
    {
      id: 7,
      title: "Reorganização Neural Sonora",
      description: "Após lesões cerebrais, utilizar música para estimular vias neurais alternativas. A estrutura previsível da música facilita a reorganização de circuitos neurais danificados."
    },
    {
      id: 8,
      title: "Integração Sensório-Motora",
      description: "Atividades que combinam estímulos sonoros com respostas motoras específicas, fortalecendo as conexões entre sistemas sensoriais e motores no cérebro."
    },
    {
      id: 9,
      title: "Fortalecimento de Redes Neurais",
      description: "Introduzir gradualmente complexidade rítmica e melódica nas atividades musicais, promovendo o desenvolvimento e fortalecimento de redes neurais mais sofisticadas."
    },
    {
      id: 10,
      title: "Reabilitação Cognitiva Musical",
      description: "Utilizar elementos musicais para trabalhar aspectos específicos da cognição afetados por condições neurológicas. A música serve como andaime para reconstruir funções cognitivas comprometidas."
    },
    {
      id: 11,
      title: "Estimulação de Nervo Vago",
      description: "Utilizar técnicas vocais específicas e vibrações sonoras que estimulam o nervo vago, promovendo regulação do sistema nervoso autônomo e diminuição da resposta de estresse."
    },
    {
      id: 12,
      title: "Treino de Timing Neural",
      description: "Exercícios musicais que trabalham precisão temporal e sincronia, fortalecendo mecanismos neurais de percepção e produção de timing. Beneficia coordenação motora e processamento temporal."
    },
    {
      id: 13,
      title: "Música e Controle Atencional",
      description: "Atividades que requerem mudanças controladas de foco atencional entre diferentes elementos musicais. Trabalha redes neurais atencionais e capacidade de alternância de foco."
    },
    {
      id: 14,
      title: "Estimulação de Circuitos de Recompensa",
      description: "Utilizar elementos musicais que ativam vias dopaminérgicas de prazer e recompensa, promovendo motivação e facilitando o reforço de comportamentos positivos durante a terapia."
    },
    {
      id: 15,
      title: "Música para Neuromodulação",
      description: "Aplicar estímulos sonoros específicos para modular estados cerebrais particulares (alerta, relaxamento, concentração). Trabalha a capacidade do cérebro de alterar estados funcionais."
    },
    {
      id: 16,
      title: "Treinamento de Memória Procedural",
      description: "Sequências musicais repetitivas que trabalham a memória implícita e habilidades motoras automáticas. Utiliza circuitos de gânglios basais e cerebelo para desenvolver automatismos."
    },
    {
      id: 17,
      title: "Exercícios de Integração Auditiva",
      description: "Atividades que treinam o processamento de diferentes aspectos do som (localização, discriminação, figura-fundo) para melhorar a integração auditiva no cérebro."
    },
    {
      id: 18,
      title: "Protocolos de Dessensibilização Neural",
      description: "Introdução gradual e controlada de estímulos sonoros específicos para diminuir hipersensibilidade ou hiperreatividade neural a certos sons ou frequências."
    },
    {
      id: 19,
      title: "Batimento Binaural Terapêutico",
      description: "Utilizar batimentos binaurais (diferenças sutis de frequência entre os dois ouvidos) para promover estados cerebrais específicos. Trabalha sincronização de ondas cerebrais e estados de consciência."
    },
    {
      id: 20,
      title: "Musicoterapia para Reorganização Cortical",
      description: "Após lesões neurológicas, utilizar música para estimular áreas adjacentes a assumirem funções das regiões afetadas. Explora princípios de vicariância e reorganização cortical."
    }
  ],
  identity: [
    {
      id: 1,
      title: "Sonorização da História Pessoal",
      description: "Criar uma trilha sonora para momentos significativos da história de vida. Instrumentos, ritmos e melodias são escolhidos para representar eventos formadores da identidade."
    },
    {
      id: 2,
      title: "Composição de Canção de Nome",
      description: "Compor uma canção baseada no nome do participante, explorando seu significado, história e como se relaciona com sua identidade."
    },
    {
      id: 3,
      title: "Improvisação de Múltiplos Papéis",
      description: "Através da música, expressar os diferentes papéis sociais que a pessoa desempenha (profissional, familiar, comunitário), ajudando a integrar essas facetas na identidade."
    },
    {
      id: 4,
      title: "Diálogo Musical de Culturas",
      description: "Para pessoas com identidades multiculturais, criar peças que integrem elementos musicais das diferentes culturas que compõem sua experiência."
    },
    {
      id: 5,
      title: "Tema Musical de Autodefinição",
      description: "Criar um 'tema musical pessoal' que represente como a pessoa se vê atualmente, revisitando e modificando essa composição ao longo do tempo, refletindo a evolução da identidade."
    },
    {
      id: 6,
      title: "Canção das Origens",
      description: "Explorar musicalmente as raízes familiares, culturais e geográficas, compondo canções que honrem as origens enquanto afirmam a identidade atual."
    },
    {
      id: 7,
      title: "Coro das Vozes Internas",
      description: "Identificar e expressar musicalmente as diferentes 'vozes internas' (o crítico, o motivador, o cuidador), ajudando a reconhecer a multidimensionalidade da identidade."
    },
    {
      id: 8,
      title: "Musicalizando Valores Centrais",
      description: "Criar expressões musicais dos valores mais importantes para a pessoa, reforçando como esses valores fundamentam sua identidade."
    },
    {
      id: 9,
      title: "Ponte Musical Temporal",
      description: "Compor uma peça que conecte 'quem eu era' com 'quem sou agora' e 'quem desejo me tornar', promovendo continuidade e coerência na narrativa identitária."
    },
    {
      id: 10,
      title: "Grupo Coral de Afirmação",
      description: "Em contexto grupal, cada participante cria uma afirmação de identidade que é transformada em uma linha melódica, criando um coro onde as identidades individuais formam uma harmonia coletiva."
    },
    {
      id: 11,
      title: "Mapeamento Sonoro de Autenticidade",
      description: "Criar paisagens sonoras que representam momentos em que a pessoa se sente mais autenticamente ela mesma. Trabalha reconhecimento de estados de congruência e autenticidade."
    },
    {
      id: 12,
      title: "Recitativos de Autodefinição",
      description: "Utilizando técnicas de spoken word e melodia, criar peças que expressam afirmações positivas de autoidentidade. Trabalha narrativas internas construtivas sobre o self."
    },
    {
      id: 13,
      title: "Transformação de Narrativas Limitantes",
      description: "Identificar narrativas musicais que representam crenças limitantes sobre si mesmo e transformá-las em composições que representam possibilidades mais expansivas. Trabalha reestruturação cognitiva da identidade."
    },
    {
      id: 14,
      title: "Concerto de Partes",
      description: "Representar diferentes aspectos da personalidade como instrumentos distintos, criando uma 'orquestra interna' que pode tocar em harmonia. Trabalha integração de partes psicológicas."
    },
    {
      id: 15,
      title: "Cartografia Musical de Pertencimento",
      description: "Criar um mapa sonoro dos diferentes grupos e comunidades aos quais a pessoa pertence, explorando como cada pertencimento contribui para a identidade. Trabalha integração de identidades sociais."
    },
    {
      id: 16,
      title: "Sonorização de Transições Identitárias",
      description: "Compor peças que representam importantes transições de identidade (adolescência, maternidade/paternidade, aposentadoria, emigração). Trabalha integração de mudanças identitárias significativas."
    },
    {
      id: 17,
      title: "Musicalização de Qualidades Centrais",
      description: "Identificar qualidades pessoais centrais e criar motivos musicais que as representam, integrando-os em uma composição coesa. Trabalha reconhecimento e integração de forças pessoais."
    },
    {
      id: 18,
      title: "Dualidades em Diálogo",
      description: "Criar duetos que expressam polaridades ou aparentes contradições na personalidade, permitindo um 'diálogo' entre elas. Trabalha aceitação e integração de complexidades internas."
    },
    {
      id: 19,
      title: "Canção do Propósito",
      description: "Compor uma peça que expressa o sentido de propósito e direção na vida da pessoa. Trabalha desenvolvimento de identidade teleológica e narrativas de significado."
    },
    {
      id: 20,
      title: "Legacy Work Musical",
      description: "Criar uma obra musical que representa o legado que a pessoa deseja deixar, conectando identidade pessoal com impacto transgeracional. Trabalha continuidade da identidade além das limitações temporais."
    }
  ]
};
