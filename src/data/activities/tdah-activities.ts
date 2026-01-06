import { ProfessionalActivity } from './types';

export const tdahActivities: ProfessionalActivity[] = [
  // ==================== ATENÇÃO (20 atividades) ====================
  {
    id: 'tdah-at-1',
    title: 'Caça ao Tesouro Sonoro',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Desenvolver a capacidade de manter o foco atencional por períodos progressivamente maiores através de pistas auditivas sequenciais',
    specificObjectives: [
      'Seguir sequências de 5-10 pistas sonoras sem perder a ordem',
      'Manter engajamento por pelo menos 10 minutos contínuos',
      'Identificar corretamente 80% das pistas apresentadas',
      'Reduzir comportamentos de distração durante a atividade'
    ],
    description: 'Crie um mapa sonoro onde cada instrumento ou som representa uma pista para encontrar o "tesouro". O paciente deve seguir a sequência de sons na ordem correta, movendo-se pelo espaço ou apontando no mapa visual. Comece com 3 pistas e aumente progressivamente. Cada som tem um significado (sino = virar direita, tambor = andar reto, triângulo = virar esquerda). O "tesouro" pode ser um instrumento especial ou uma música favorita como recompensa. A atividade trabalha atenção sustentada com reforçamento imediato.',
    materials: ['Instrumentos variados (sino, tambor, triângulo, chocalho)', 'Mapa visual do percurso', 'Objeto "tesouro"', 'Vendas (opcional)'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número de pistas seguidas corretamente em sequência',
      'Tempo de manutenção do foco sem distração',
      'Necessidade de repetições das pistas',
      'Nível de independência na execução',
      'Comportamentos de distração observados'
    ],
    adaptations: [
      'Nível leve: 3-4 pistas com apoio visual constante e pausas entre pistas',
      'Nível moderado: 5-7 pistas com apoio visual parcial',
      'Nível severo: 8-10 pistas apenas auditivas, com distratores sonoros'
    ],
    theoreticalBasis: 'Baseado no modelo de Barkley sobre déficit de inibição e sua relação com atenção sustentada. Utiliza reforçamento imediato (encontrar o tesouro) para manter engajamento, considerando a sensibilidade do TDAH a atrasos no reforço.',
    ageRange: '6-12 anos',
    tips: [
      'Use sons bem distintos entre si para facilitar discriminação',
      'Ofereça feedback imediato a cada pista correta',
      'Reduza distratores ambientais no início',
      'Permita movimento - crianças com TDAH aprendem melhor em movimento'
    ]
  },
  {
    id: 'tdah-at-2',
    title: 'Maestro Atento',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Desenvolver atenção sustentada e dividida através do papel de maestro que precisa monitorar múltiplos instrumentos',
    specificObjectives: [
      'Manter controle visual sobre todos os músicos por períodos de 5+ minutos',
      'Identificar quando um instrumento está fora do tempo',
      'Dar comandos claros de mudança de dinâmica',
      'Alternar foco entre diferentes seções da "orquestra"'
    ],
    description: 'O paciente assume o papel de maestro de uma pequena orquestra (real ou imaginária com participantes). Deve usar gestos para indicar quando cada instrumento toca, controlar volume (gestos amplos = forte, pequenos = suave) e tempo. Introduza "erros" propositais para o maestro identificar. Progrida de reger um instrumento por vez até múltiplos simultaneamente. Use cartões visuais para apoiar os comandos inicialmente.',
    materials: ['Batuta ou bastão', 'Instrumentos variados', 'Cartões de comando visual', 'Metrônomo', 'Música gravada (opcional)'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de manutenção do papel de maestro',
      'Precisão na identificação de erros',
      'Clareza dos comandos gestuais',
      'Capacidade de dividir atenção entre músicos',
      'Nível de frustração tolerado'
    ],
    adaptations: [
      'Nível leve: Reger apenas 1-2 instrumentos com música simples',
      'Nível moderado: Reger 3-4 instrumentos com mudanças de dinâmica',
      'Nível severo: Reger grupo completo com mudanças complexas e identificar erros'
    ],
    theoreticalBasis: 'Fundamentado no conceito de funções executivas de Barkley, especificamente working memory e atenção dividida. O papel de maestro exige monitoramento contínuo, uma habilidade frequentemente deficitária no TDAH.',
    ageRange: '7-15 anos',
    tips: [
      'Comece com músicas conhecidas e previsíveis',
      'Use reforço social imediato ("Excelente comando!")',
      'Faça pausas estratégicas para manter engajamento',
      'Grave a performance para revisão e feedback'
    ]
  },
  {
    id: 'tdah-at-3',
    title: 'Radar Sonoro',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Seletiva',
    generalObjective: 'Desenvolver atenção seletiva através da identificação de sons-alvo em meio a distratores auditivos',
    specificObjectives: [
      'Identificar som-alvo em 80% das apresentações',
      'Filtrar distratores sonoros progressivamente mais complexos',
      'Responder ao estímulo-alvo em tempo adequado',
      'Manter vigilância por períodos crescentes'
    ],
    description: 'Apresente uma paisagem sonora com múltiplos sons simultâneos. O paciente deve identificar apenas o som-alvo (ex: sino) levantando a mão ou tocando um instrumento. Comece com fundo silencioso e adicione progressivamente ruído branco, conversas, música de fundo. Varie a frequência do som-alvo para manter vigilância. Use diferentes níveis de volume para o alvo.',
    materials: ['Gravações de paisagens sonoras', 'Caixa de som', 'Instrumento-resposta para o paciente', 'Cronômetro', 'Registro de acertos'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Taxa de acertos (identificações corretas)',
      'Taxa de falsos positivos',
      'Tempo de reação ao som-alvo',
      'Tolerância a distratores',
      'Manutenção da atenção ao longo do tempo'
    ],
    adaptations: [
      'Nível leve: Som-alvo muito distinto, poucos distratores, apresentações frequentes',
      'Nível moderado: Som-alvo moderadamente distinto, distratores médios',
      'Nível severo: Som-alvo sutil, muitos distratores, apresentações espaçadas'
    ],
    theoreticalBasis: 'Baseado em paradigmas de atenção seletiva e vigilância da neuropsicologia cognitiva. O TDAH apresenta dificuldades específicas em filtrar informação irrelevante, habilidade trabalhada diretamente nesta atividade.',
    ageRange: '6-14 anos',
    tips: [
      'Comece com sessões curtas (3-5 minutos) e aumente gradualmente',
      'Ofereça feedback visual imediato (luz verde para acerto)',
      'Use sons-alvo que o paciente considere interessantes',
      'Faça gráficos de progresso para motivação'
    ]
  },
  {
    id: 'tdah-at-4',
    title: 'Detetive dos Sons',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção aos Detalhes',
    generalObjective: 'Desenvolver atenção a detalhes através da identificação de diferenças sutis entre melodias ou padrões rítmicos',
    specificObjectives: [
      'Identificar diferenças em 7 de cada 10 pares apresentados',
      'Especificar qual elemento mudou (nota, ritmo, instrumento)',
      'Aumentar tempo de escuta analítica',
      'Desenvolver vocabulário para descrever diferenças musicais'
    ],
    description: 'Apresente dois trechos musicais aparentemente idênticos. O paciente-detetive deve descobrir as diferenças. Comece com diferenças óbvias (instrumento diferente) e evolua para sutis (uma nota, tempo ligeiramente diferente). Use lupa de brinquedo como objeto simbólico. Crie "casos" temáticos (O Caso da Nota Perdida, O Mistério do Ritmo Trocado).',
    materials: ['Gravações pareadas com diferenças', 'Lupa de brinquedo', 'Ficha de detetive', 'Distintivo', 'Quadro de casos resolvidos'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Porcentagem de diferenças identificadas',
      'Capacidade de especificar a diferença',
      'Número de escutas necessárias',
      'Persistência diante de dificuldade',
      'Estratégias de escuta utilizadas'
    ],
    adaptations: [
      'Nível leve: Diferenças muito óbvias (instrumento diferente, pausa longa)',
      'Nível moderado: Diferenças médias (notas diferentes, ritmo alterado)',
      'Nível severo: Diferenças sutis (timbre, dinâmica, articulação)'
    ],
    theoreticalBasis: 'Baseado na dificuldade de atenção a detalhes característica do TDAH, conforme critérios do DSM-5. A gamificação (ser detetive) aumenta motivação intrínseca e engajamento.',
    ageRange: '7-14 anos',
    tips: [
      'Permita escutar cada trecho múltiplas vezes',
      'Use histórias para contextualizar cada "caso"',
      'Comemore cada "caso resolvido" efusivamente',
      'Crie arquivo de casos para mostrar progresso'
    ]
  },
  {
    id: 'tdah-at-5',
    title: 'Foco no Ritmo',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Desenvolver capacidade de manter padrão rítmico estável mesmo na presença de distratores',
    specificObjectives: [
      'Manter padrão rítmico por 2+ minutos sem erro',
      'Ignorar distratores auditivos mantendo o padrão',
      'Recuperar padrão rapidamente após distração',
      'Aumentar complexidade do padrão mantido'
    ],
    description: 'O paciente aprende um padrão rítmico simples e deve mantê-lo enquanto distratores são introduzidos progressivamente: outro ritmo tocando, perguntas verbais, estímulos visuais. Se perder o ritmo, deve retomar rapidamente. Use metrônomo como âncora inicial que vai sendo retirado. Registre tempo de manutenção e número de "perdas".',
    materials: ['Instrumento de percussão', 'Metrônomo', 'Gravações de ritmos distratores', 'Cronômetro', 'Ficha de registro'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo total de manutenção do padrão',
      'Número de interrupções',
      'Velocidade de recuperação após perda',
      'Tolerância a distratores cada vez mais fortes',
      'Capacidade de manter padrões mais complexos'
    ],
    adaptations: [
      'Nível leve: Padrão simples (pulso), poucos distratores, metrônomo constante',
      'Nível moderado: Padrão médio (2-3 elementos), distratores moderados',
      'Nível severo: Padrão complexo, múltiplos distratores simultâneos, sem metrônomo'
    ],
    theoreticalBasis: 'Fundamentado na teoria de que o ritmo externo pode servir como organizador da atenção (RAS). O treino de manutenção de padrão sob distração trabalha diretamente o déficit atencional do TDAH.',
    ageRange: '6-15 anos',
    tips: [
      'Comece com ritmos que o paciente goste',
      'Introduza distratores gradualmente',
      'Celebre cada recorde de tempo',
      'Use competição consigo mesmo (bater próprio recorde)'
    ]
  },
  {
    id: 'tdah-at-6',
    title: 'Atenção Dividida Musical',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Dividida',
    generalObjective: 'Desenvolver capacidade de dividir atenção entre duas tarefas musicais simultâneas',
    specificObjectives: [
      'Executar duas tarefas simples simultaneamente',
      'Alternar foco entre tarefas sem perder desempenho',
      'Manter qualidade em ambas as tarefas',
      'Aumentar complexidade das tarefas combinadas'
    ],
    description: 'Combine duas tarefas musicais: tocar um ritmo enquanto canta, andar no pulso enquanto toca instrumento, identificar sons enquanto mantém padrão. Comece com tarefas muito simples e automatizadas, aumentando complexidade gradualmente. Use tarefas já dominadas individualmente antes de combinar.',
    materials: ['Instrumentos de percussão', 'Canções conhecidas', 'Espaço para movimento', 'Gravador para feedback'],
    estimatedTime: '20-25 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Qualidade de execução de cada tarefa isolada vs. combinada',
      'Tempo de manutenção da dupla tarefa',
      'Erros em cada componente',
      'Estratégias de gerenciamento utilizadas',
      'Frustração observada'
    ],
    adaptations: [
      'Nível leve: Uma tarefa muito simples + uma automática',
      'Nível moderado: Duas tarefas de complexidade média',
      'Nível severo: Duas tarefas complexas com alternância de foco'
    ],
    theoreticalBasis: 'Baseado no modelo de recursos atencionais limitados. O TDAH apresenta dificuldade específica em alocar recursos para múltiplas tarefas. O treino gradual pode melhorar essa habilidade.',
    ageRange: '8-16 anos',
    tips: [
      'Garanta domínio individual de cada tarefa antes de combinar',
      'Comece com combinações naturais (cantar e bater palmas)',
      'Não exija perfeição inicial - valorize qualquer manutenção',
      'Use humor quando ocorrerem erros'
    ]
  },
  {
    id: 'tdah-at-7',
    title: 'Sequência Crescente',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Memória de Trabalho Auditiva',
    generalObjective: 'Expandir span de memória de trabalho auditiva através de sequências sonoras progressivamente maiores',
    specificObjectives: [
      'Reproduzir sequências de 4-7 elementos',
      'Manter informação auditiva ativa por períodos crescentes',
      'Desenvolver estratégias de memorização',
      'Transferir habilidade para contextos cotidianos'
    ],
    description: 'Apresente sequências de sons (instrumentos, notas, ritmos) que o paciente deve reproduzir. Comece com 2 elementos e adicione um a cada rodada bem-sucedida. Use o formato "Simon" musical. Registre span máximo. Introduza estratégias de chunking e ensaio subvocal.',
    materials: ['Instrumentos variados ou teclado', 'Registro de spans', 'Cartões visuais de apoio (opcional)'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Span máximo atingido',
      'Consistência entre sessões',
      'Uso de estratégias de memorização',
      'Tolerância à frustração em caso de erro',
      'Generalização para outros contextos'
    ],
    adaptations: [
      'Nível leve: Sequências curtas (2-3), com apoio visual, ritmo lento',
      'Nível moderado: Sequências médias (4-5), apoio visual parcial',
      'Nível severo: Sequências longas (6+), apenas auditivo, ritmo rápido'
    ],
    theoreticalBasis: 'Déficit de memória de trabalho é central no modelo de Barkley para TDAH. O treino de span auditivo tem evidências de transferência para funcionamento executivo geral.',
    ageRange: '6-14 anos',
    tips: [
      'Ensine estratégias explicitamente (agrupar, repetir mentalmente)',
      'Celebre cada elemento adicional lembrado',
      'Use sons interessantes para o paciente',
      'Compare com recorde pessoal, não com normas'
    ]
  },
  {
    id: 'tdah-at-8',
    title: 'Escuta Seletiva em Camadas',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Seletiva',
    generalObjective: 'Desenvolver capacidade de focar em uma camada sonora específica em meio a múltiplas camadas',
    specificObjectives: [
      'Identificar melodia principal em arranjo com 3+ instrumentos',
      'Seguir linha de baixo ignorando outras vozes',
      'Alternar foco entre camadas quando solicitado',
      'Descrever o que cada camada está fazendo'
    ],
    description: 'Use músicas com arranjos claros (voz, guitarra, baixo, bateria). Peça ao paciente para focar em apenas um instrumento por vez, descrevendo o que ele faz. Aumente complexidade com mais instrumentos e camadas menos distintas. Use equalizador para destacar/esconder camadas como apoio inicial.',
    materials: ['Músicas com arranjos multi-instrumentais', 'Equalizador ou software de áudio', 'Fones de ouvido', 'Ficha de registro'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Precisão na descrição de cada camada',
      'Capacidade de alternar foco entre camadas',
      'Redução de confusão entre instrumentos',
      'Tempo de foco em cada camada',
      'Satisfação com a atividade'
    ],
    adaptations: [
      'Nível leve: Apenas 2 camadas muito distintas, destaque eletrônico do alvo',
      'Nível moderado: 3-4 camadas, destaque parcial',
      'Nível severo: Múltiplas camadas, sem destaque, alternância rápida'
    ],
    theoreticalBasis: 'Baseado em estudos de atenção auditiva seletiva que mostram déficits específicos no TDAH para filtrar informação irrelevante. O treino sistemático pode melhorar essa habilidade.',
    ageRange: '10-18 anos',
    tips: [
      'Use músicas que o paciente conhece e gosta',
      'Comece com instrumentos de timbre muito diferente',
      'Faça pausas frequentes - é cognitivamente exigente',
      'Relacione com situações cotidianas (ouvir professor com barulho)'
    ]
  },
  {
    id: 'tdah-at-9',
    title: 'Mapa Musical Navegável',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Sustentada',
    generalObjective: 'Desenvolver atenção sustentada através de navegação guiada por comandos sonoros em sequência',
    specificObjectives: [
      'Seguir 10+ comandos sonoros consecutivos',
      'Manter orientação espacial durante toda navegação',
      'Responder corretamente a 90% dos comandos',
      'Aumentar velocidade de resposta mantendo precisão'
    ],
    description: 'Crie um "mapa" no chão ou mesa com diferentes zonas. Cada som representa um comando de movimento (agudo = norte, grave = sul, rápido = leste, lento = oeste). O paciente navega seguindo sequências de sons. Adicione obstáculos e coletáveis para aumentar engajamento. Registre percurso e erros.',
    materials: ['Mapa grande no chão ou tabuleiro', 'Instrumentos para comandos', 'Marcadores de posição', 'Obstáculos e recompensas'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número de comandos seguidos corretamente',
      'Erros de direção',
      'Tempo para completar percursos',
      'Manutenção do engajamento',
      'Estratégias de orientação utilizadas'
    ],
    adaptations: [
      'Nível leve: 4 direções básicas, comandos lentos e claros, apoio visual',
      'Nível moderado: 6-8 comandos diferentes, velocidade média',
      'Nível severo: Comandos complexos, velocidade rápida, distratores'
    ],
    theoreticalBasis: 'Combina atenção sustentada com memória de trabalho espacial, ambas áreas de dificuldade no TDAH. O movimento físico aumenta engajamento e facilita processamento.',
    ageRange: '5-12 anos',
    tips: [
      'Faça do mapa algo visualmente interessante',
      'Inclua personagem que o paciente "é" durante navegação',
      'Celebre chegada ao destino',
      'Permita que paciente crie mapas também'
    ]
  },
  {
    id: 'tdah-at-10',
    title: 'Memória Musical de Trabalho',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Fortalecer memória de trabalho através de manipulação ativa de informação musical',
    specificObjectives: [
      'Reproduzir melodias em ordem inversa',
      'Transpor padrões rítmicos para outros instrumentos',
      'Manter informação enquanto realiza operação mental',
      'Aumentar quantidade de informação manipulada'
    ],
    description: 'Apresente sequências musicais que devem ser manipuladas mentalmente: tocar de trás para frente, adicionar um elemento, trocar dois elementos de lugar. Diferente de simples repetição, exige manter e manipular informação. Progrida de operações simples para complexas.',
    materials: ['Instrumentos melódicos', 'Gravador para comparação', 'Cartões com operações', 'Registro de desempenho'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Precisão na manipulação',
      'Complexidade da operação realizada',
      'Número de elementos manipulados',
      'Velocidade de processamento',
      'Estratégias verbais ou visuais utilizadas'
    ],
    adaptations: [
      'Nível leve: Sequências de 2-3 elementos, operações simples (repetir último)',
      'Nível moderado: Sequências de 4-5 elementos, inversão parcial',
      'Nível severo: Sequências longas, operações complexas (inverter e transpor)'
    ],
    theoreticalBasis: 'A memória de trabalho é o executivo central no modelo de Baddeley, consistentemente deficitária no TDAH. Treino de manipulação ativa fortalece mais que simples armazenamento.',
    ageRange: '8-16 anos',
    tips: [
      'Ensine estratégias de visualização',
      'Permita verbalizações durante processamento',
      'Comece com operações muito simples',
      'Não apresse - dê tempo para processamento'
    ]
  },
  {
    id: 'tdah-at-11',
    title: 'Cronômetro Musical',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Percepção Temporal',
    generalObjective: 'Desenvolver percepção temporal e estimativa de duração através de atividades musicais cronometradas',
    specificObjectives: [
      'Estimar durações de 10-60 segundos com precisão de ±20%',
      'Tocar por tempo solicitado sem olhar relógio',
      'Identificar quando passou tempo determinado',
      'Melhorar consciência do tempo durante atividades'
    ],
    description: 'Trabalhe percepção temporal usando música: "Toque até achar que passou 30 segundos", "Cante uma música que dure exatamente 1 minuto", "Avise quando achar que passou o tempo combinado". Compare estimativas com tempo real. Use metrônomo como âncora inicial.',
    materials: ['Cronômetro', 'Instrumentos variados', 'Metrônomo', 'Registro de estimativas'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão das estimativas temporais',
      'Melhora ao longo das sessões',
      'Uso de estratégias internas (contagem, pulso)',
      'Transferência para consciência temporal diária',
      'Tolerância a feedback de erro'
    ],
    adaptations: [
      'Nível leve: Durações curtas (10-20s), feedback imediato, metrônomo',
      'Nível moderado: Durações médias (30-60s), feedback atrasado',
      'Nível severo: Durações longas (2-5min), sem apoios, durante atividade'
    ],
    theoreticalBasis: 'A discronia (dificuldade de percepção temporal) é característica do TDAH no modelo de Barkley. O ritmo musical pode servir como organizador temporal externo que vai sendo internalizado.',
    ageRange: '7-16 anos',
    tips: [
      'Comece com durações muito curtas',
      'Use humor quando estimativas estiverem muito erradas',
      'Relacione com situações problemáticas (atrasos)',
      'Ensine estratégias de monitoramento temporal'
    ]
  },
  {
    id: 'tdah-at-12',
    title: 'Vigilância Sonora',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Vigilante',
    generalObjective: 'Desenvolver capacidade de manter estado de alerta para detectar eventos raros e imprevisíveis',
    specificObjectives: [
      'Manter vigilância por 5+ minutos com detecção precisa',
      'Responder rapidamente a eventos-alvo',
      'Minimizar falsas detecções',
      'Manter desempenho ao longo do tempo'
    ],
    description: 'Durante uma música ou paisagem sonora contínua, o paciente deve detectar eventos raros (um sino tocando brevemente, uma pausa súbita). Os eventos são imprevisíveis em timing. Registre tempo de reação e falsas detecções. Aumente duração gradualmente.',
    materials: ['Gravações longas com eventos inseridos', 'Botão ou instrumento para resposta', 'Cronômetro', 'Registro de detecções'],
    estimatedTime: '10-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Taxa de detecção de eventos',
      'Tempo de reação médio',
      'Taxa de falsos positivos',
      'Declínio de desempenho ao longo do tempo',
      'Estratégias de manutenção de alerta'
    ],
    adaptations: [
      'Nível leve: Eventos frequentes (a cada 30s), muito salientes',
      'Nível moderado: Eventos espaçados (1-2min), moderadamente salientes',
      'Nível severo: Eventos raros e sutis, duração longa'
    ],
    theoreticalBasis: 'Tarefas de vigilância são especialmente difíceis para TDAH devido ao déficit de ativação sustentada. O treino gradual pode melhorar essa capacidade com transferência para contextos escolares.',
    ageRange: '8-16 anos',
    tips: [
      'Use eventos interessantes (som de videogame favorito)',
      'Faça sessões curtas inicialmente',
      'Forneça feedback sobre desempenho',
      'Relacione com situações reais (prestar atenção em sala)'
    ]
  },
  {
    id: 'tdah-at-13',
    title: 'Alternância de Foco Musical',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Alternada',
    generalObjective: 'Desenvolver capacidade de alternar foco atencional entre diferentes tarefas musicais de forma eficiente',
    specificObjectives: [
      'Alternar entre tarefas com mínimo tempo de transição',
      'Manter qualidade em ambas as tarefas após alternância',
      'Reduzir erros de perseveração',
      'Responder flexivelmente a sinais de mudança'
    ],
    description: 'O paciente alterna entre duas tarefas musicais diferentes quando um sinal é dado: tocar ritmo A / tocar ritmo B; cantar melodia / tocar instrumento; escutar e responder / tocar sem parar. Meça tempo de transição e erros. Aumente frequência de alternâncias.',
    materials: ['Dois instrumentos diferentes', 'Sinal sonoro para alternância', 'Cronômetro', 'Registro de desempenho'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de transição entre tarefas',
      'Erros de perseveração (continuar tarefa anterior)',
      'Qualidade de execução em cada tarefa',
      'Capacidade de aumentar frequência de alternâncias',
      'Flexibilidade diante de mudanças imprevistas'
    ],
    adaptations: [
      'Nível leve: Duas tarefas muito diferentes, alternâncias previsíveis e lentas',
      'Nível moderado: Tarefas relacionadas, alternâncias semi-previsíveis',
      'Nível severo: Tarefas similares, alternâncias rápidas e imprevisíveis'
    ],
    theoreticalBasis: 'Déficit de flexibilidade cognitiva é comum no TDAH. A alternância de set atencional requer desengajar de uma tarefa e engajar em outra, habilidade frequentemente comprometida.',
    ageRange: '7-16 anos',
    tips: [
      'Comece com tarefas muito distintas',
      'Use sinais claros e consistentes para alternância',
      'Não critique perseveração - é esperada inicialmente',
      'Celebre alternâncias rápidas e limpas'
    ]
  },
  {
    id: 'tdah-at-14',
    title: 'Atenção Flutuante',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Monitoramento Atencional',
    generalObjective: 'Desenvolver consciência metacognitiva do próprio estado atencional e estratégias de recuperação',
    specificObjectives: [
      'Identificar quando atenção está dispersando',
      'Nomear gatilhos de distração pessoais',
      'Aplicar estratégia de refocalização',
      'Aumentar tempo até primeira distração'
    ],
    description: 'Durante atividade musical contínua, o paciente monitora seu próprio estado atencional. Ao perceber distração, sinaliza (levanta mão) e aplica estratégia combinada (respirar, olhar para instrumento, contar até 3). Terapeuta também pode sinalizar quando percebe distração. Discuta gatilhos e estratégias.',
    materials: ['Instrumento para atividade contínua', 'Sinalizador para distrações', 'Cartões de estratégias', 'Diário atencional'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão na auto-detecção de distração',
      'Tempo entre distração e auto-sinalização',
      'Efetividade das estratégias de recuperação',
      'Aumento do tempo até primeira distração',
      'Identificação de gatilhos pessoais'
    ],
    adaptations: [
      'Nível leve: Terapeuta sinaliza distrações, paciente aprende a reconhecer',
      'Nível moderado: Paciente e terapeuta sinalizam, comparam percepções',
      'Nível severo: Apenas paciente sinaliza, múltiplas estratégias de recuperação'
    ],
    theoreticalBasis: 'Baseado em abordagens metacognitivas para TDAH. Desenvolver consciência do próprio estado atencional é passo fundamental para autorregulação.',
    ageRange: '8-18 anos',
    tips: [
      'Normalize distração como parte do processo',
      'Celebre auto-detecções, não critique distrações',
      'Ajude a identificar padrões pessoais',
      'Transfira estratégias para sala de aula'
    ]
  },
  {
    id: 'tdah-at-15',
    title: 'Multitarefa Musical Estruturada',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Atenção Dividida',
    generalObjective: 'Desenvolver capacidade de gerenciar múltiplas demandas atencionais simultâneas de forma estruturada',
    specificObjectives: [
      'Manter desempenho em 3 tarefas simples simultâneas',
      'Priorizar tarefas quando necessário',
      'Recuperar rapidamente de sobrecarga',
      'Desenvolver estratégias pessoais de gerenciamento'
    ],
    description: 'Estruture ambiente com múltiplas demandas: tocar ritmo, responder a perguntas ocasionais, monitorar tempo. O paciente deve gerenciar todas simultaneamente. Quando sobrecarga acontece, discuta estratégias (temporizar uma tarefa, simplificar outra). Progrida de 2 para 3+ tarefas.',
    materials: ['Múltiplos instrumentos', 'Timer visual', 'Cartões de perguntas', 'Sinalizadores de prioridade'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Número de tarefas gerenciadas simultaneamente',
      'Qualidade de desempenho em cada tarefa',
      'Estratégias de priorização utilizadas',
      'Recuperação após sobrecarga',
      'Frustra vs. persistência'
    ],
    adaptations: [
      'Nível leve: 2 tarefas simples, uma automatizada, sem pressão de tempo',
      'Nível moderado: 2-3 tarefas, alguma pressão temporal',
      'Nível severo: 3+ tarefas, demandas imprevisíveis, pressão temporal'
    ],
    theoreticalBasis: 'O TDAH impacta especialmente situações de alta demanda executiva. Treinar gerenciamento de múltiplas tarefas em ambiente controlado pode desenvolver estratégias transferíveis.',
    ageRange: '10-18 anos',
    tips: [
      'Comece muito simples - sucesso inicial é crucial',
      'Ensine explicitamente estratégias de priorização',
      'Use humor quando sobrecarga acontecer',
      'Relacione com desafios do cotidiano'
    ]
  },
  {
    id: 'tdah-at-16',
    title: 'Pausas Atentas',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Recuperação Atencional',
    generalObjective: 'Desenvolver capacidade de fazer pausas restauradoras que efetivamente recuperem recursos atencionais',
    specificObjectives: [
      'Identificar sinais de fadiga atencional',
      'Implementar pausas musicais restauradoras',
      'Retornar a tarefas com atenção renovada',
      'Internalizar ciclos atenção-pausa-atenção'
    ],
    description: 'Estruture atividade em ciclos: tarefa atencional exigente + pausa musical restauradora (escuta passiva, movimento livre, improvação sem regras). Ensine a identificar quando pausa é necessária. Compare desempenho com e sem pausas estratégicas. Individualize tipo de pausa mais efetivo.',
    materials: ['Instrumentos para tarefa', 'Músicas relaxantes', 'Timer', 'Espaço para movimento', 'Diário de pausas'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Auto-identificação de necessidade de pausa',
      'Efetividade da pausa na recuperação',
      'Melhora de desempenho pós-pausa',
      'Duração ideal de pausa identificada',
      'Tipo de pausa mais efetivo para o paciente'
    ],
    adaptations: [
      'Nível leve: Pausas estruturadas pelo terapeuta, curtas e frequentes',
      'Nível moderado: Pausas semi-estruturadas, paciente escolhe timing',
      'Nível severo: Pausas auto-gerenciadas, paciente identifica necessidade'
    ],
    theoreticalBasis: 'Baseado na teoria de recursos atencionais limitados e necessidade de restauração. Pessoas com TDAH frequentemente não reconhecem fadiga atencional ou usam pausas ineficazes.',
    ageRange: '8-18 anos',
    tips: [
      'Experimente diferentes tipos de pausas (ativa vs. passiva)',
      'Não julgue a necessidade de pausas frequentes',
      'Ajude a transferir para contexto escolar',
      'Ensine diferença entre pausa e evasão de tarefa'
    ]
  },
  {
    id: 'tdah-at-17',
    title: 'Resistência a Distratores',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Controle Atencional',
    generalObjective: 'Desenvolver resistência progressiva a distratores através de exposição gradual e estratégias ativas',
    specificObjectives: [
      'Manter tarefa com distratores leves por 5+ minutos',
      'Identificar distratores mais problemáticos pessoalmente',
      'Aplicar estratégias de bloqueio atencional',
      'Aumentar tolerância a ambientes não controlados'
    ],
    description: 'Durante tarefa musical, introduza distratores graduais: ruído de fundo, música concorrente, estímulos visuais, interrupções verbais. Ensine estratégias: foco no instrumento, subvocalização, ignorar ativamente. Registre tolerância e estratégias efetivas. Personalize hierarquia de distratores.',
    materials: ['Instrumentos', 'Fontes de distração controladas', 'Fones (para bloquear)', 'Registro de tolerância'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Nível de distração tolerado mantendo tarefa',
      'Efetividade das estratégias de bloqueio',
      'Identificação de distratores pessoais',
      'Progresso na hierarquia de distratores',
      'Transferência para ambientes naturais'
    ],
    adaptations: [
      'Nível leve: Distratores muito sutis, ambiente controlado',
      'Nível moderado: Distratores moderados, algumas estratégias',
      'Nível severo: Múltiplos distratores fortes, apenas estratégias internas'
    ],
    theoreticalBasis: 'Exposição gradual a distratores com ensino de estratégias é mais eficaz que simples evitação. Desenvolve habilidades transferíveis para ambientes escolares e profissionais.',
    ageRange: '8-18 anos',
    tips: [
      'Construa hierarquia individual de distratores',
      'Comece muito abaixo do limiar de falha',
      'Celebre cada avanço na hierarquia',
      'Pratique em ambientes cada vez mais naturais'
    ]
  },
  {
    id: 'tdah-at-18',
    title: 'Rotina Atencional Musical',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Preparação Atencional',
    generalObjective: 'Desenvolver rotina de preparação atencional que facilite entrada em estado de foco',
    specificObjectives: [
      'Criar ritual pessoal de preparação para foco',
      'Reduzir tempo para entrar em estado atencional',
      'Identificar condições ótimas pessoais de atenção',
      'Transferir rotina para outros contextos'
    ],
    description: 'Crie um ritual consistente de preparação antes de tarefas que exigem atenção: música específica, respiração com ritmo, organização do espaço, movimentos preparatórios. Pratique até automatizar. Personalize elementos mais efetivos. Ensine a aplicar antes de deveres, provas.',
    materials: ['Playlist de preparação', 'Objetos de ritual', 'Checklist de preparação', 'Espaço organizado'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Consistência na execução do ritual',
      'Tempo para entrar em estado de foco',
      'Qualidade da atenção subsequente',
      'Personalização efetiva dos elementos',
      'Transferência para outros contextos'
    ],
    adaptations: [
      'Nível leve: Ritual longo e completo, ambiente ideal',
      'Nível moderado: Ritual condensado, ambiente variado',
      'Nível severo: Micro-ritual portátil, qualquer ambiente'
    ],
    theoreticalBasis: 'Rituais de preparação criam previsibilidade e organizam transição para estado de trabalho, especialmente importante para TDAH que tem dificuldade em auto-iniciar.',
    ageRange: '6-18 anos',
    tips: [
      'Comece com ritual elaborado, depois condense',
      'Inclua elementos sensoriais agradáveis',
      'Pratique consistentemente antes de atividades',
      'Ajude a criar versão portátil para escola'
    ]
  },
  {
    id: 'tdah-at-19',
    title: 'Zoom Atencional',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Controle Atencional',
    generalObjective: 'Desenvolver capacidade de ajustar foco atencional (amplo vs. estreito) conforme demanda da tarefa',
    specificObjectives: [
      'Alternar entre foco amplo e estreito sob comando',
      'Identificar qual foco é necessário para cada tarefa',
      'Manter foco no modo adequado',
      'Ajustar espontaneamente quando necessário'
    ],
    description: 'Use metáfora de lente de câmera: foco amplo (ouvir toda a música, todos os instrumentos) vs. foco estreito (apenas um instrumento, um compasso). Pratique alternar entre modos. Aplique a diferentes tarefas, identificando qual modo é necessário. Use gestos (mãos abertas vs. fechadas) para sinalizar.',
    materials: ['Músicas variadas', 'Gestos de sinalização', 'Cartões de modo atencional', 'Registro de adequação'],
    estimatedTime: '20-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão na alternância de modos',
      'Identificação espontânea do modo necessário',
      'Manutenção do modo adequado',
      'Flexibilidade de ajuste',
      'Transferência para tarefas não-musicais'
    ],
    adaptations: [
      'Nível leve: Apenas dois modos muito distintos, terapeuta indica modo',
      'Nível moderado: Paciente identifica modo necessário, apoio parcial',
      'Nível severo: Múltiplos níveis de zoom, auto-gerenciado'
    ],
    theoreticalBasis: 'Controle do foco atencional (spotlight vs. lanterna) é habilidade executiva frequentemente deficitária no TDAH. A metáfora visual facilita compreensão e transferência.',
    ageRange: '8-16 anos',
    tips: [
      'Use metáfora concreta (câmera, lanterna)',
      'Pratique em músicas conhecidas primeiro',
      'Relacione com situações escolares',
      'Faça gestos para externalizar modo'
    ]
  },
  {
    id: 'tdah-at-20',
    title: 'Maratona Atencional Musical',
    disorder: 'TDAH',
    demandCategory: 'atencao',
    demandLabel: 'Resistência Atencional',
    generalObjective: 'Desenvolver resistência atencional para tarefas de longa duração através de treino progressivo',
    specificObjectives: [
      'Aumentar tempo de atenção sustentada em 50%',
      'Manter qualidade ao longo de tarefas longas',
      'Desenvolver estratégias de manutenção de energia',
      'Identificar padrões pessoais de declínio'
    ],
    description: 'Estruture atividades musicais progressivamente mais longas, monitorando qualidade ao longo do tempo. Identifique quando declínio começa, ensine estratégias de revitalização (mudança de postura, micro-pausa, variação). Registre curva atencional pessoal. Trabalhe para achatar declínio.',
    materials: ['Atividades de durações variadas', 'Timer', 'Gráfico de desempenho', 'Cartões de estratégias'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Duração máxima com qualidade mantida',
      'Padrão de declínio (quando começa)',
      'Efetividade das estratégias de manutenção',
      'Progresso ao longo das sessões',
      'Transferência para atividades escolares longas'
    ],
    adaptations: [
      'Nível leve: Sessões curtas (10-15min), muitos intervalos, tarefa interessante',
      'Nível moderado: Sessões médias (20-30min), intervalos estratégicos',
      'Nível severo: Sessões longas (40+min), mínimos intervalos, variação interna'
    ],
    theoreticalBasis: 'A resistência atencional pode ser desenvolvida como músculo. Treino progressivo com monitoramento permite identificar limites e estratégias pessoais de extensão.',
    ageRange: '10-18 anos',
    tips: [
      'Aumente duração muito gradualmente',
      'Monitore qualidade, não apenas duração',
      'Ensine a reconhecer sinais de fadiga',
      'Relacione com provas e tarefas longas'
    ]
  },

  // ==================== FUNÇÕES EXECUTIVAS (20 atividades) ====================
  {
    id: 'tdah-fe-1',
    title: 'Compositor Organizador',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento',
    generalObjective: 'Desenvolver habilidades de planejamento através da estruturação de uma composição musical',
    specificObjectives: [
      'Planejar estrutura completa antes de executar',
      'Organizar seções em ordem lógica',
      'Antecipar materiais e tempo necessários',
      'Seguir plano estabelecido até conclusão'
    ],
    description: 'O paciente planeja uma composição musical completa antes de tocar: quantas partes terá, que instrumentos em cada parte, quanto tempo cada seção, qual a ordem. Usa mapa visual da estrutura. Só executa após plano completo. Compare resultado com plano original.',
    materials: ['Papel grande para mapa', 'Marcadores coloridos', 'Instrumentos variados', 'Timer', 'Gravador'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Completude do plano antes de iniciar',
      'Adequação do plano (realista, organizado)',
      'Fidelidade ao plano durante execução',
      'Ajustes necessários durante execução',
      'Satisfação com resultado final'
    ],
    adaptations: [
      'Nível leve: Estrutura simples (3 partes), muito apoio visual, terapeuta co-planeja',
      'Nível moderado: Estrutura média (5 partes), apoio visual parcial',
      'Nível severo: Estrutura complexa, planejamento independente'
    ],
    theoreticalBasis: 'Déficit de planejamento é central no TDAH segundo modelo de Barkley. A composição musical oferece contexto motivador para treinar antecipação e organização.',
    ageRange: '8-16 anos',
    tips: [
      'Valorize o plano tanto quanto a execução',
      'Não permita começar sem plano',
      'Use cores para diferentes seções',
      'Fotografe plano para comparação futura'
    ]
  },
  {
    id: 'tdah-fe-2',
    title: 'Maestro do Tempo',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Gerenciamento Temporal',
    generalObjective: 'Desenvolver habilidades de gerenciamento de tempo através de atividade musical estruturada',
    specificObjectives: [
      'Estimar tempo necessário para atividades musicais',
      'Monitorar tempo durante execução',
      'Ajustar ritmo para cumprir prazo',
      'Melhorar precisão de estimativas temporais'
    ],
    description: 'O paciente deve completar tarefas musicais em tempo determinado: "Você tem 5 minutos para criar uma música com 3 partes", "Ensaie até conseguir tocar sem erro - quanto tempo acha que vai precisar?". Compare estimativas com tempo real. Desenvolva consciência temporal.',
    materials: ['Timer visual', 'Instrumentos', 'Registro de estimativas vs. real', 'Relógio analógico grande'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão das estimativas temporais',
      'Monitoramento ativo do tempo',
      'Ajustes de ritmo para cumprir prazo',
      'Melhora de estimativas ao longo do tempo',
      'Ansiedade vs. tranquilidade com prazos'
    ],
    adaptations: [
      'Nível leve: Prazos generosos, timer muito visível, avisos frequentes',
      'Nível moderado: Prazos moderados, timer disponível, poucos avisos',
      'Nível severo: Prazos justos, auto-monitoramento'
    ],
    theoreticalBasis: 'A "miopia temporal" do TDAH dificulta estimar e gerenciar tempo. Treino com feedback imediato melhora gradualmente esta habilidade.',
    ageRange: '7-16 anos',
    tips: [
      'Use timer visual (Time Timer)',
      'Comece com estimativas explícitas antes de cada tarefa',
      'Não puna erro de estimativa - use para aprendizado',
      'Relacione com situações problemáticas reais'
    ]
  },
  {
    id: 'tdah-fe-3',
    title: 'Banda Planejada',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Organização',
    generalObjective: 'Desenvolver habilidades organizacionais através do planejamento e execução de performance em grupo',
    specificObjectives: [
      'Atribuir funções a cada participante',
      'Organizar sequência de entrada dos instrumentos',
      'Preparar materiais necessários antecipadamente',
      'Coordenar ensaio e performance'
    ],
    description: 'O paciente é "produtor" de uma banda: deve decidir quem toca o quê, qual a ordem das músicas, quanto tempo de ensaio para cada, quando fazer pausa. Usa checklist de produção. Pode ser com participantes reais ou simulados. Avalie organização do processo.',
    materials: ['Checklist de produção', 'Quadro de organização', 'Instrumentos variados', 'Cronograma visual'],
    estimatedTime: '30-45 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Completude do planejamento',
      'Organização dos materiais',
      'Cumprimento do cronograma',
      'Flexibilidade diante de imprevistos',
      'Resultado da performance'
    ],
    adaptations: [
      'Nível leve: Organizar apenas 1 música, com template pronto',
      'Nível moderado: Organizar mini-show (3 músicas), apoio parcial',
      'Nível severo: Organizar apresentação completa independentemente'
    ],
    theoreticalBasis: 'Dificuldades organizacionais são queixa frequente no TDAH. O contexto musical motivador pode facilitar desenvolvimento de habilidades transferíveis.',
    ageRange: '9-18 anos',
    tips: [
      'Use checklists visuais',
      'Permita erros de organização como aprendizado',
      'Celebre organização, não apenas resultado',
      'Fotografe processo para revisão'
    ]
  },
  {
    id: 'tdah-fe-4',
    title: 'Memória de Trabalho Rítmica',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Memória de Trabalho',
    generalObjective: 'Fortalecer memória de trabalho através de manipulação de padrões rítmicos',
    specificObjectives: [
      'Manter padrão em mente enquanto executa variação',
      'Manipular 2-3 elementos simultaneamente',
      'Aumentar span de manipulação gradualmente',
      'Transferir habilidade para contextos não-musicais'
    ],
    description: 'Apresente um padrão rítmico e peça transformações: dobrar velocidade, adicionar pausa, inverter ordem, combinar com outro padrão. O paciente deve manter original em mente enquanto cria versão transformada. Comece com transformações simples.',
    materials: ['Instrumentos de percussão', 'Cartões de transformação', 'Gravador para comparação', 'Registro de complexidade'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Manutenção do padrão original em mente',
      'Precisão das transformações',
      'Número de elementos manipulados',
      'Velocidade de processamento',
      'Uso de estratégias verbais/visuais'
    ],
    adaptations: [
      'Nível leve: Padrões curtos (2 elementos), transformação única e simples',
      'Nível moderado: Padrões médios (3-4 elementos), transformação moderada',
      'Nível severo: Padrões longos, transformações complexas ou múltiplas'
    ],
    theoreticalBasis: 'Memória de trabalho é componente central do executivo no modelo de Baddeley e deficitário no TDAH. Manipulação ativa fortalece mais que simples armazenamento.',
    ageRange: '8-16 anos',
    tips: [
      'Permita verbalização durante processamento',
      'Comece com transformações muito simples',
      'Use analogias visuais quando possível',
      'Celebre tentativas, não apenas acertos'
    ]
  },
  {
    id: 'tdah-fe-5',
    title: 'Flexibilidade Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Flexibilidade Cognitiva',
    generalObjective: 'Desenvolver flexibilidade cognitiva através de mudanças de regras e adaptações durante atividades musicais',
    specificObjectives: [
      'Adaptar-se rapidamente a mudanças de regras',
      'Reduzir erros de perseveração',
      'Gerar soluções alternativas',
      'Manter desempenho apesar de mudanças'
    ],
    description: 'Durante uma atividade musical, mude as regras periodicamente: "Agora o grave vira agudo", "Agora rápido vira lento", "Agora silêncio vira som". O paciente deve adaptar-se rapidamente. Comece com uma mudança, evolua para múltiplas. Meça tempo de adaptação.',
    materials: ['Instrumentos variados', 'Cartões de regras', 'Sinalizador de mudança', 'Registro de adaptações'],
    estimatedTime: '20-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo para adaptar-se à nova regra',
      'Erros de perseveração (usar regra antiga)',
      'Capacidade de gerenciar múltiplas mudanças',
      'Frustração vs. flexibilidade observada',
      'Transferência para situações cotidianas'
    ],
    adaptations: [
      'Nível leve: Uma mudança por vez, previsível, muito tempo para adaptar',
      'Nível moderado: Mudanças mais frequentes, semi-previsíveis',
      'Nível severo: Múltiplas mudanças, imprevisíveis, adaptação rápida'
    ],
    theoreticalBasis: 'Rigidez cognitiva é comum no TDAH, com dificuldade de desengajar de set mental. Treino de flexibilidade melhora adaptação a mudanças.',
    ageRange: '6-16 anos',
    tips: [
      'Normalize erros iniciais de perseveração',
      'Use humor quando regra antiga escapar',
      'Comece com mudanças opostas (mais fáceis)',
      'Relacione com situações de mudança de planos'
    ]
  },
  {
    id: 'tdah-fe-6',
    title: 'Resolução de Problemas Musicais',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Resolução de Problemas',
    generalObjective: 'Desenvolver habilidades de resolução de problemas através de desafios musicais estruturados',
    specificObjectives: [
      'Identificar o problema claramente antes de agir',
      'Gerar múltiplas soluções possíveis',
      'Avaliar prós e contras de cada solução',
      'Implementar e ajustar solução escolhida'
    ],
    description: 'Apresente problemas musicais: instrumento "quebrado" (falta uma nota), ritmo que não encaixa, volume inadequado. O paciente deve identificar o problema, pensar em soluções, escolher uma e implementar. Use protocolo PARE: Problema, Alternativas, Resultado esperado, Executar.',
    materials: ['Instrumentos com "problemas"', 'Protocolo PARE visual', 'Situações-problema preparadas', 'Registro de soluções'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Identificação clara do problema',
      'Número de alternativas geradas',
      'Qualidade da avaliação das opções',
      'Eficácia da solução implementada',
      'Ajuste diante de solução inadequada'
    ],
    adaptations: [
      'Nível leve: Problemas simples e óbvios, alternativas sugeridas',
      'Nível moderado: Problemas moderados, geração parcialmente guiada',
      'Nível severo: Problemas complexos, geração e avaliação independentes'
    ],
    theoreticalBasis: 'O TDAH impacta todas as etapas de resolução de problemas, desde identificação até implementação. Treino estruturado desenvolve hábitos de processamento.',
    ageRange: '8-16 anos',
    tips: [
      'Não resolva pelo paciente',
      'Valorize o processo tanto quanto a solução',
      'Use o protocolo PARE consistentemente',
      'Crie arquivo de problemas resolvidos'
    ]
  },
  {
    id: 'tdah-fe-7',
    title: 'Sequenciamento Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Sequenciamento',
    generalObjective: 'Desenvolver capacidade de organizar e seguir sequências através de atividades musicais estruturadas',
    specificObjectives: [
      'Ordenar etapas de uma atividade corretamente',
      'Seguir sequências de 5+ passos',
      'Identificar e corrigir erros de ordem',
      'Criar sequências próprias lógicas'
    ],
    description: 'Trabalhe sequenciamento: ordenar cartões com etapas de uma música, seguir receita musical (passo a passo), identificar o que está fora de ordem em uma sequência. Progrida de ordenar sequências prontas para criar próprias.',
    materials: ['Cartões de etapas', 'Receitas musicais', 'Sequências com erros', 'Quadro de sequenciamento'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão na ordenação de sequências',
      'Número de passos gerenciados',
      'Identificação de erros de ordem',
      'Qualidade de sequências criadas',
      'Transferência para rotinas diárias'
    ],
    adaptations: [
      'Nível leve: Sequências curtas (3 passos), muito visuais, ordenação simples',
      'Nível moderado: Sequências médias (5 passos), criação parcial',
      'Nível severo: Sequências longas, criação independente, abstração'
    ],
    theoreticalBasis: 'Dificuldade de sequenciamento afeta rotinas e procedimentos no TDAH. Treino explícito melhora organização temporal de ações.',
    ageRange: '6-14 anos',
    tips: [
      'Use sequências visuais coloridas',
      'Conecte com rotinas problemáticas (se arrumar)',
      'Comemore sequências corretas',
      'Permita erro e autocorreção'
    ]
  },
  {
    id: 'tdah-fe-8',
    title: 'Priorização Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Priorização',
    generalObjective: 'Desenvolver capacidade de priorizar tarefas e informações através de contexto musical',
    specificObjectives: [
      'Identificar o que é mais importante em situação',
      'Ordenar tarefas por urgência/importância',
      'Manter foco no prioritário',
      'Adiar gratificação para completar importante primeiro'
    ],
    description: 'Apresente múltiplas demandas musicais e peça priorização: "Qual instrumento precisa de mais atenção agora?", "O que devemos ensaiar primeiro?", "Qual problema resolver antes?". Use matriz de prioridade visual. Pratique escolhas e justificativas.',
    materials: ['Matriz de priorização', 'Múltiplas tarefas musicais', 'Cartões de urgência/importância', 'Registro de decisões'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Capacidade de identificar prioridades',
      'Justificativas para escolhas',
      'Manutenção de foco no prioritário',
      'Resistência a distrações interessantes',
      'Transferência para tarefas escolares'
    ],
    adaptations: [
      'Nível leve: 2-3 opções claras, critério único de prioridade',
      'Nível moderado: 4-5 opções, múltiplos critérios',
      'Nível severo: Muitas opções, critérios conflitantes, pressão temporal'
    ],
    theoreticalBasis: 'TDAH dificulta hierarquização de importância, tratando tudo como igualmente urgente ou atraente. Treino explícito desenvolve hábito de priorizar.',
    ageRange: '9-18 anos',
    tips: [
      'Use matriz visual de Eisenhower adaptada',
      'Pratique justificar escolhas',
      'Conecte com deveres e compromissos',
      'Não julgue prioridades erradas - discuta'
    ]
  },
  {
    id: 'tdah-fe-9',
    title: 'Monitoramento de Meta',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Monitoramento',
    generalObjective: 'Desenvolver capacidade de monitorar progresso em direção a metas durante atividades musicais',
    specificObjectives: [
      'Estabelecer meta clara antes de iniciar',
      'Verificar progresso periodicamente',
      'Ajustar estratégia quando necessário',
      'Reconhecer quando meta foi atingida'
    ],
    description: 'Estabeleça metas musicais claras (aprender música em 10 minutos, tocar sem erro 3 vezes). Durante trabalho, pause periodicamente para check-in: "Quanto falta?", "Está funcionando?", "Precisa mudar algo?". Use termômetro visual de progresso.',
    materials: ['Quadro de meta', 'Termômetro de progresso', 'Timer para check-ins', 'Registro de ajustes'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Clareza da meta estabelecida',
      'Frequência de auto-check-ins',
      'Precisão da auto-avaliação de progresso',
      'Ajustes estratégicos realizados',
      'Reconhecimento de atingimento de meta'
    ],
    adaptations: [
      'Nível leve: Metas simples, check-ins externos frequentes, muito visual',
      'Nível moderado: Metas moderadas, check-ins semi-guiados',
      'Nível severo: Metas complexas, auto-monitoramento, ajustes independentes'
    ],
    theoreticalBasis: 'Déficit de auto-monitoramento é central no TDAH. Externalizar o processo através de check-ins e visual aids pode desenvolver hábito interno.',
    ageRange: '8-18 anos',
    tips: [
      'Use timer para lembrar check-ins',
      'Faça termômetro ou gráfico visual',
      'Celebre reconhecimento de meta atingida',
      'Normalize ajustes como parte do processo'
    ]
  },
  {
    id: 'tdah-fe-10',
    title: 'Iniciação de Tarefas',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Iniciação',
    generalObjective: 'Desenvolver estratégias para iniciar tarefas musicais superando inércia inicial',
    specificObjectives: [
      'Reduzir tempo para iniciar atividades',
      'Criar rituais de iniciação efetivos',
      'Superar evitação de início',
      'Começar mesmo sem motivação completa'
    ],
    description: 'Trabalhe o momento de começar: cronometre quanto demora para iniciar, use "contagem regressiva de lançamento", crie ritual de início (3 respirações + primeira nota), pratique começos rápidos. Identifique o que bloqueia início e desenvolva contra-estratégias.',
    materials: ['Cronômetro', 'Ritual de início personalizado', 'Cartões de início rápido', 'Registro de tempo de iniciação'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo para iniciar atividades',
      'Uso de estratégias de iniciação',
      'Redução de evitação',
      'Início mesmo sem motivação ideal',
      'Transferência para deveres escolares'
    ],
    adaptations: [
      'Nível leve: Atividades muito atraentes, muito apoio para iniciar',
      'Nível moderado: Atividades neutras, apoio moderado',
      'Nível severo: Atividades menos preferidas, auto-iniciação'
    ],
    theoreticalBasis: 'A dificuldade de iniciar tarefas no TDAH relaciona-se com déficit de ativação e aversão a esforço. Estratégias compensatórias podem reduzir barreiras.',
    ageRange: '7-18 anos',
    tips: [
      'Use contagem regressiva de foguete',
      'Crie rituais de início personalizados',
      'Comece com primeiros 2 minutos apenas',
      'Conecte com procrastinação de deveres'
    ]
  },
  {
    id: 'tdah-fe-11',
    title: 'Conclusão de Projetos',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Conclusão',
    generalObjective: 'Desenvolver capacidade de concluir projetos musicais superando dificuldades de finalização',
    specificObjectives: [
      'Identificar quando projeto está próximo do fim',
      'Manter energia e foco até conclusão',
      'Resistir à tentação de abandonar ou começar novo',
      'Celebrar e documentar conclusões'
    ],
    description: 'Trabalhe projetos musicais com fases claras e foco na conclusão: composição de música completa, aprendizagem de repertório, criação de apresentação. Use termômetro de conclusão, comemore cada finalização. Identifique padrões de abandono.',
    materials: ['Projetos com fases definidas', 'Termômetro de conclusão', 'Álbum de projetos concluídos', 'Certificados de conclusão'],
    estimatedTime: '30-45 minutos (múltiplas sessões)',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Taxa de projetos concluídos',
      'Manutenção de energia nas fases finais',
      'Resistência a novos projetos antes de concluir',
      'Satisfação com conclusões',
      'Transferência para projetos escolares'
    ],
    adaptations: [
      'Nível leve: Projetos curtíssimos (1 sessão), muito apoio para finalizar',
      'Nível moderado: Projetos curtos (2-3 sessões), apoio moderado',
      'Nível severo: Projetos longos, auto-gerenciados'
    ],
    theoreticalBasis: 'TDAH é caracterizado por dificuldade de conclusão, com perda de interesse após fase inicial. Treino de finalização desenvolve hábito de completar.',
    ageRange: '8-18 anos',
    tips: [
      'Comece com projetos pequenos garantindo sucesso',
      'Faça álbum de "projetos concluídos"',
      'Celebre cada conclusão efusivamente',
      'Discuta padrão de abandonar perto do fim'
    ]
  },
  {
    id: 'tdah-fe-12',
    title: 'Transições Executivas',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Transição',
    generalObjective: 'Desenvolver capacidade de realizar transições suaves entre atividades musicais',
    specificObjectives: [
      'Concluir atividade atual adequadamente',
      'Fazer transição sem resistência excessiva',
      'Iniciar nova atividade sem demora',
      'Manter regulação emocional durante mudanças'
    ],
    description: 'Estruture sessão com múltiplas atividades e transições planejadas. Use avisos prévios (5 minutos, 2 minutos, última vez), ritual de transição (guardar instrumento, respirar, pegar próximo), músicas de transição. Meça tempo e qualidade de transições.',
    materials: ['Timer visual', 'Músicas de transição', 'Ritual visual de transição', 'Cronograma de atividades'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Tempo de transição entre atividades',
      'Resistência durante transições',
      'Uso de estratégias de transição',
      'Regulação emocional mantida',
      'Transferência para transições escolares'
    ],
    adaptations: [
      'Nível leve: Transições longas, muito aviso, ritual completo',
      'Nível moderado: Transições médias, avisos padrão',
      'Nível severo: Transições rápidas, mínimo aviso, auto-gerenciadas'
    ],
    theoreticalBasis: 'Dificuldade de transição no TDAH relaciona-se com hiperfoco e inércia cognitiva. Rituais e previsibilidade facilitam mudanças.',
    ageRange: '5-14 anos',
    tips: [
      'Sempre avise transições com antecedência',
      'Use música específica para transição',
      'Crie ritual consistente de mudança',
      'Conecte com dificuldades de transição em casa'
    ]
  },
  {
    id: 'tdah-fe-13',
    title: 'Controle de Impulso Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Inibição',
    generalObjective: 'Desenvolver controle inibitório através de atividades musicais que exigem espera e contenção',
    specificObjectives: [
      'Aguardar sinal antes de agir',
      'Interromper ação iniciada quando solicitado',
      'Resistir a tocar instrumento fora da hora',
      'Pensar antes de agir musicalmente'
    ],
    description: 'Estruture atividades que exijam inibição: esperar deixa para entrar, parar imediatamente em sinal, resistir a tocar instrumento visível até momento certo. Use hierarquia de dificuldade. Celebre inibições bem-sucedidas.',
    materials: ['Instrumentos atrativos', 'Sinais claros de início/parada', 'Timer visual', 'Registro de inibições'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Taxa de inibições bem-sucedidas',
      'Tempo de latência antes de agir',
      'Capacidade de parar ação iniciada',
      'Resistência a tentações',
      'Estratégias de autocontrole utilizadas'
    ],
    adaptations: [
      'Nível leve: Esperas curtas, instrumentos menos atrativos, muitos sinais',
      'Nível moderado: Esperas médias, instrumentos atrativos',
      'Nível severo: Esperas longas, instrumentos muito atrativos, poucos sinais'
    ],
    theoreticalBasis: 'Déficit de inibição é núcleo do TDAH no modelo de Barkley. Treino comportamental pode desenvolver controle inibitório.',
    ageRange: '5-15 anos',
    tips: [
      'Comece com esperas muito curtas',
      'Use sinais visuais além de verbais',
      'Celebre cada inibição bem-sucedida',
      'Ensine estratégias (mãos no colo, contar)'
    ]
  },
  {
    id: 'tdah-fe-14',
    title: 'Regulação de Esforço',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Regulação de Esforço',
    generalObjective: 'Desenvolver capacidade de modular esforço conforme demanda da tarefa musical',
    specificObjectives: [
      'Identificar nível de esforço necessário para cada tarefa',
      'Ajustar esforço durante execução',
      'Manter esforço adequado por períodos',
      'Evitar sub ou sobre-esforço'
    ],
    description: 'Trabalhe consciência de esforço: tarefas que exigem mais concentração vs. mais relaxamento, peças difíceis vs. fáceis, momentos intensos vs. calmos. Use termômetro de esforço visual. Pratique modular esforço conscientemente.',
    materials: ['Tarefas de dificuldades variadas', 'Termômetro de esforço', 'Registro de adequação de esforço'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Identificação correta de esforço necessário',
      'Ajuste apropriado durante tarefa',
      'Manutenção de esforço adequado',
      'Consciência de sub/sobre-esforço',
      'Transferência para tarefas escolares'
    ],
    adaptations: [
      'Nível leve: Apenas dois níveis (fácil/difícil), feedback constante',
      'Nível moderado: Múltiplos níveis, feedback moderado',
      'Nível severo: Gradações sutis, auto-regulação'
    ],
    theoreticalBasis: 'Regulação de esforço é função executiva frequentemente comprometida no TDAH, com tendência a pouco esforço ou esforço excessivo inconsistente.',
    ageRange: '8-18 anos',
    tips: [
      'Use metáfora de marcha de carro',
      'Faça termômetro visual de esforço',
      'Discuta quando usar qual nível',
      'Conecte com distribuição de esforço em provas'
    ]
  },
  {
    id: 'tdah-fe-15',
    title: 'Planejamento Reverso',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Planejamento',
    generalObjective: 'Desenvolver habilidade de planejamento reverso (do fim para o início) através de projeto musical',
    specificObjectives: [
      'Definir claramente o resultado final desejado',
      'Identificar etapas necessárias de trás para frente',
      'Estimar tempo para cada etapa',
      'Criar cronograma realista'
    ],
    description: 'Comece definindo como será a apresentação final (meta), depois trabalhe para trás: "O que precisa estar pronto antes?", "E antes disso?". Crie timeline visual do fim para o início. Use para planejar apresentação, gravação ou composição.',
    materials: ['Timeline visual reverso', 'Cartões de etapas', 'Calendário', 'Registro de planejamento'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Clareza da meta final',
      'Identificação de etapas precedentes',
      'Realismo das estimativas temporais',
      'Cumprimento do plano reverso',
      'Transferência para trabalhos escolares'
    ],
    adaptations: [
      'Nível leve: Projeto curto, poucas etapas, muito apoio visual',
      'Nível moderado: Projeto médio, apoio parcial',
      'Nível severo: Projeto longo, planejamento independente'
    ],
    theoreticalBasis: 'Planejamento reverso é estratégia executiva avançada especialmente útil para TDAH que tem dificuldade em "ver" o caminho até a meta.',
    ageRange: '10-18 anos',
    tips: [
      'Use linha do tempo visual',
      'Comece com projetos curtos',
      'Conecte com trabalhos escolares',
      'Fotografe planejamentos para referência'
    ]
  },
  {
    id: 'tdah-fe-16',
    title: 'Gerenciamento de Materiais',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Organização Material',
    generalObjective: 'Desenvolver habilidades de organização e gerenciamento de materiais musicais',
    specificObjectives: [
      'Organizar materiais antes de começar',
      'Manter espaço de trabalho organizado durante atividade',
      'Guardar materiais adequadamente após uso',
      'Saber onde cada coisa está'
    ],
    description: 'Estruture organização do espaço musical: cada instrumento tem lugar, materiais preparados antes, espaço limpo depois. Use etiquetas, fotos, checklist. O paciente é responsável por preparar e guardar. Avalie estado de organização.',
    materials: ['Sistema de organização visual', 'Etiquetas', 'Fotos de organização', 'Checklist de preparação/guarda'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Preparação adequada de materiais',
      'Manutenção de organização durante atividade',
      'Guarda adequada após uso',
      'Saber localizar materiais',
      'Transferência para organização escolar'
    ],
    adaptations: [
      'Nível leve: Poucos materiais, lugares muito definidos, checklist visual',
      'Nível moderado: Mais materiais, organização parcialmente autônoma',
      'Nível severo: Muitos materiais, criação e manutenção de sistema próprio'
    ],
    theoreticalBasis: 'Desorganização material é queixa frequente no TDAH, impactando funcionamento diário. Sistemas externos consistentes podem compensar déficit interno.',
    ageRange: '6-18 anos',
    tips: [
      'Use fotos de como deve ficar',
      'Faça checklist visual de preparação',
      'Inclua guarda no tempo da atividade',
      'Conecte com organização de mochila'
    ]
  },
  {
    id: 'tdah-fe-17',
    title: 'Automonitoramento de Desempenho',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Automonitoramento',
    generalObjective: 'Desenvolver capacidade de auto-avaliar desempenho musical de forma precisa e contínua',
    specificObjectives: [
      'Avaliar próprio desempenho durante execução',
      'Identificar erros em tempo real',
      'Comparar autoavaliação com avaliação externa',
      'Usar feedback para ajustar comportamento'
    ],
    description: 'Após cada execução musical, paciente avalia próprio desempenho antes de feedback externo. Compare avaliações. Grave e revise para calibrar auto-percepção. Desenvolva critérios claros de avaliação. Use escala visual simples.',
    materials: ['Gravador', 'Escala de autoavaliação', 'Critérios de desempenho', 'Registro de calibração'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão da autoavaliação',
      'Identificação de pontos fortes e fracos',
      'Calibração ao longo do tempo',
      'Uso de feedback para ajuste',
      'Metacognição desenvolvida'
    ],
    adaptations: [
      'Nível leve: Critérios simples, escala de 3 pontos, muito feedback',
      'Nível moderado: Critérios moderados, escala de 5 pontos',
      'Nível severo: Critérios detalhados, auto-avaliação antes de feedback'
    ],
    theoreticalBasis: 'TDAH frequentemente apresenta déficit de automonitoramento, com sub ou superestimação de desempenho. Calibração explícita melhora metacognição.',
    ageRange: '8-18 anos',
    tips: [
      'Use gravação para evidência objetiva',
      'Não julgue autoavaliações erradas',
      'Celebre autoavaliações precisas',
      'Discuta discrepâncias com curiosidade'
    ]
  },
  {
    id: 'tdah-fe-18',
    title: 'Gestão de Erros',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Gestão de Erros',
    generalObjective: 'Desenvolver capacidade de identificar, analisar e aprender com erros musicais de forma construtiva',
    specificObjectives: [
      'Identificar erros sem reação emocional excessiva',
      'Analisar causa do erro',
      'Gerar estratégia para evitar repetição',
      'Manter motivação apesar de erros'
    ],
    description: 'Trabalhe relação saudável com erros: identificar sem frustrar, analisar causa, planejar correção. Use protocolo "ECA" (Erro → Causa → Ação). Celebre erros como oportunidade de aprendizado. Crie arquivo de "erros que viraram aprendizado".',
    materials: ['Protocolo ECA visual', 'Arquivo de aprendizados', 'Registro de erros e soluções'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Reação emocional a erros',
      'Uso do protocolo ECA',
      'Qualidade da análise de causa',
      'Implementação de estratégia corretiva',
      'Manutenção de motivação'
    ],
    adaptations: [
      'Nível leve: Erros simples, muito apoio emocional, análise guiada',
      'Nível moderado: Erros variados, apoio moderado',
      'Nível severo: Erros complexos, auto-análise, auto-regulação emocional'
    ],
    theoreticalBasis: 'TDAH frequentemente associa-se com reação emocional excessiva a erros ou negação de erros. Desenvolver relação saudável com falhas é crucial.',
    ageRange: '7-18 anos',
    tips: [
      'Normalize erros como parte do aprendizado',
      'Comemore erros descobertos pelo próprio paciente',
      'Modele reação saudável a seus próprios erros',
      'Use humor quando apropriado'
    ]
  },
  {
    id: 'tdah-fe-19',
    title: 'Tomada de Decisão Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Tomada de Decisão',
    generalObjective: 'Desenvolver processo de tomada de decisão estruturada em contexto musical',
    specificObjectives: [
      'Identificar decisão a ser tomada',
      'Gerar opções viáveis',
      'Avaliar prós e contras de cada opção',
      'Escolher e implementar decisão'
    ],
    description: 'Crie situações de decisão musical: qual música tocar, qual instrumento usar, como resolver problema técnico. Use matriz de decisão visual. Pratique não decidir por impulso. Revise decisões e resultados.',
    materials: ['Matriz de decisão', 'Opções claras', 'Registro de decisões e resultados'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Uso de processo estruturado',
      'Geração de opções',
      'Qualidade da avaliação',
      'Satisfação com decisões tomadas',
      'Aprendizado com decisões passadas'
    ],
    adaptations: [
      'Nível leve: 2-3 opções claras, consequências óbvias',
      'Nível moderado: Mais opções, consequências menos claras',
      'Nível severo: Múltiplas opções, trade-offs complexos'
    ],
    theoreticalBasis: 'Tomada de decisão impulsiva ou paralisada é comum no TDAH. Processos estruturados compensam déficit de ponderação interna.',
    ageRange: '9-18 anos',
    tips: [
      'Use matriz visual de decisão',
      'Não apresse decisões',
      'Revise decisões passadas sem julgamento',
      'Conecte com decisões do cotidiano'
    ]
  },
  {
    id: 'tdah-fe-20',
    title: 'Metacognição Musical',
    disorder: 'TDAH',
    demandCategory: 'funcoes_executivas',
    demandLabel: 'Metacognição',
    generalObjective: 'Desenvolver consciência metacognitiva sobre próprio funcionamento executivo através da música',
    specificObjectives: [
      'Identificar padrões pessoais de funcionamento',
      'Reconhecer pontos fortes e desafios executivos',
      'Desenvolver estratégias personalizadas',
      'Aumentar autoconhecimento funcional'
    ],
    description: 'Através de reflexão guiada sobre atividades musicais, explore padrões pessoais: quando foca melhor, o que distrai mais, como se organiza, quando desiste. Crie "mapa de funcionamento" pessoal. Desenvolva estratégias individualizadas.',
    materials: ['Diário de reflexão', 'Mapa de funcionamento', 'Cartões de estratégias pessoais'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Precisão do autoconhecimento',
      'Identificação de padrões',
      'Qualidade das estratégias desenvolvidas',
      'Uso de estratégias personalizadas',
      'Transferência para vida diária'
    ],
    adaptations: [
      'Nível leve: Reflexões simples, muito guiadas, foco em 1-2 áreas',
      'Nível moderado: Reflexões moderadas, múltiplas áreas',
      'Nível severo: Reflexão profunda, auto-guiada, integração ampla'
    ],
    theoreticalBasis: 'Metacognição - pensar sobre o próprio pensamento - é frequentemente deficitária no TDAH. Desenvolver autoconhecimento é base para autorregulação.',
    ageRange: '10-18 anos',
    tips: [
      'Use perguntas abertas e reflexivas',
      'Não tenha pressa - metacognição requer tempo',
      'Valide descobertas sobre si mesmo',
      'Crie registro escrito de insights'
    ]
  },

  // ==================== CONTROLE INIBITÓRIO (15 atividades) ====================
  {
    id: 'tdah-ci-1',
    title: 'Estátua Musical Avançada',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Inibitório',
    generalObjective: 'Desenvolver controle inibitório motor através de paradas súbitas durante atividade musical',
    specificObjectives: [
      'Parar movimento imediatamente quando música para',
      'Manter posição estática por períodos crescentes',
      'Inibir movimento apesar de vontade de mexer',
      'Reiniciar suavemente quando música retorna'
    ],
    description: 'Versão avançada do jogo de estátua com níveis de dificuldade: parar em diferentes momentos da frase musical, parar em posições específicas, parar quando ouvir instrumento específico. Aumente tempo de permanência imóvel gradualmente. Adicione distratores nas fases avançadas.',
    materials: ['Músicas variadas', 'Timer visual', 'Cartões de regras especiais', 'Registro de desempenho'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Velocidade de inibição do movimento',
      'Duração da manutenção da posição',
      'Resistência a distratores',
      'Qualidade do reinício',
      'Diversão mantida durante atividade'
    ],
    adaptations: [
      'Nível leve: Paradas previsíveis, curtas, sem distratores',
      'Nível moderado: Paradas semi-previsíveis, médias',
      'Nível severo: Paradas imprevisíveis, longas, com distratores'
    ],
    theoreticalBasis: 'Inibição motora é forma fundamental de controle inibitório. Jogos de estátua treinam a capacidade de frear respostas pré-potentes.',
    ageRange: '5-14 anos',
    tips: [
      'Comece com paradas curtas e previsíveis',
      'Use músicas que a criança gosta',
      'Celebre cada parada bem-sucedida',
      'Mantenha clima divertido, não punitivo'
    ]
  },
  {
    id: 'tdah-ci-2',
    title: 'Semáforo Sonoro',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Inibitório',
    generalObjective: 'Desenvolver controle inibitório através de respostas diferenciadas a estímulos sonoros (verde/amarelo/vermelho)',
    specificObjectives: [
      'Responder corretamente a cada cor/som',
      'Inibir resposta no vermelho',
      'Modular resposta no amarelo',
      'Manter precisão com velocidade crescente'
    ],
    description: 'Três sons representam cores do semáforo: verde = toque livremente, amarelo = toque devagar/suave, vermelho = pare imediatamente. Varie a sequência e velocidade. Adicione pegadinhas (falso vermelho). Registre acertos e erros de cada cor.',
    materials: ['Três sons distintos', 'Instrumento do paciente', 'Cartões de cores visuais (apoio)', 'Registro de respostas'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Taxa de acerto em cada cor',
      'Velocidade de resposta',
      'Erros de comissão (agir no vermelho)',
      'Qualidade da modulação no amarelo',
      'Desempenho sob velocidade'
    ],
    adaptations: [
      'Nível leve: Apenas verde e vermelho, lento, apoio visual',
      'Nível moderado: Três cores, velocidade média',
      'Nível severo: Três cores, rápido, sem apoio visual, pegadinhas'
    ],
    theoreticalBasis: 'Paradigma Go/No-Go com modulação, desenvolvendo não apenas inibição total mas também controle graduado de resposta.',
    ageRange: '5-12 anos',
    tips: [
      'Use sons muito distintos para cada cor',
      'Comece lento e aumente velocidade gradualmente',
      'Celebre especialmente inibições no vermelho',
      'Use humor com pegadinhas'
    ]
  },
  {
    id: 'tdah-ci-3',
    title: 'Não Vale Esse',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Inibição de Resposta',
    generalObjective: 'Desenvolver capacidade de inibir resposta a estímulo específico enquanto responde a outros',
    specificObjectives: [
      'Responder a estímulos permitidos',
      'Inibir resposta ao estímulo proibido',
      'Manter desempenho com múltiplos proibidos',
      'Reduzir erros de comissão'
    ],
    description: 'Defina um som/instrumento "proibido" ao qual não deve responder. Toque vários sons e paciente responde a todos exceto o proibido. Aumente velocidade e número de proibidos. Use sons cada vez mais semelhantes para aumentar dificuldade de discriminação.',
    materials: ['Vários instrumentos/sons', 'Cartão de "proibido"', 'Registro de erros de comissão'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Erros de comissão (resposta ao proibido)',
      'Erros de omissão (não resposta ao permitido)',
      'Velocidade mantida com precisão',
      'Desempenho com múltiplos proibidos',
      'Uso de estratégias de inibição'
    ],
    adaptations: [
      'Nível leve: Um proibido muito distinto, ritmo lento',
      'Nível moderado: 2-3 proibidos, ritmo médio',
      'Nível severo: Múltiplos proibidos similares aos permitidos, ritmo rápido'
    ],
    theoreticalBasis: 'Tarefa tipo Go/No-Go clássica, treinando inibição de resposta pré-potente a estímulo específico.',
    ageRange: '6-14 anos',
    tips: [
      'Comece com proibido muito óbvio',
      'Adicione proibidos gradualmente',
      'Registre progresso visualmente',
      'Use contexto de jogo (não alimentar o monstro)'
    ]
  },
  {
    id: 'tdah-ci-4',
    title: 'Espera Musical Cronometrada',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle de Impulso',
    generalObjective: 'Desenvolver capacidade de aguardar tempo determinado antes de agir musicalmente',
    specificObjectives: [
      'Aguardar sinal sem antecipar',
      'Tolerar esperas progressivamente maiores',
      'Manter prontidão durante espera',
      'Agir precisamente no momento certo'
    ],
    description: 'Paciente deve aguardar tempo específico (cronometrado visivelmente) antes de tocar. Comece com 5 segundos, aumente gradualmente. O desafio é não antecipar mas também não atrasar. Use contagem regressiva visual. Registre antecipações e atrasos.',
    materials: ['Timer visual (Time Timer)', 'Instrumento', 'Registro de precisão', 'Sinalizador de início'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número de antecipações',
      'Precisão no tempo de início',
      'Tolerância a esperas crescentes',
      'Estratégias de espera utilizadas',
      'Regulação durante espera'
    ],
    adaptations: [
      'Nível leve: Esperas curtas (5-10s), timer muito visível',
      'Nível moderado: Esperas médias (15-30s), timer disponível',
      'Nível severo: Esperas longas (45s+), estimativa interna'
    ],
    theoreticalBasis: 'Aversão a atraso é central no TDAH. Treino de tolerância a espera desenvolve capacidade de adiar gratificação.',
    ageRange: '6-15 anos',
    tips: [
      'Use timer visual tipo Time Timer',
      'Ensine estratégias de espera (contar, respirar)',
      'Celebre esperas bem-sucedidas',
      'Aumente tempo muito gradualmente'
    ]
  },
  {
    id: 'tdah-ci-5',
    title: 'Pare no Meio',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Inibição de Resposta em Curso',
    generalObjective: 'Desenvolver capacidade de interromper ação já iniciada quando sinal é dado',
    specificObjectives: [
      'Parar ação em andamento imediatamente',
      'Responder a sinais de parada em diferentes momentos',
      'Retomar após parada sem perder qualidade',
      'Aumentar velocidade de parada'
    ],
    description: 'Diferente de não iniciar, aqui o desafio é parar algo já iniciado. Durante execução musical (tocar, cantar, dançar), sinais aleatórios de STOP exigem interrupção imediata. Meça tempo de latência para parar. Trabalhe paradas em diferentes pontos da ação.',
    materials: ['Instrumento ou atividade contínua', 'Sinal de STOP claro', 'Cronômetro de latência'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Latência de parada (tempo para parar)',
      'Qualidade da parada (total vs. gradual)',
      'Variação conforme ponto da ação',
      'Retomada após parada',
      'Progresso ao longo das sessões'
    ],
    adaptations: [
      'Nível leve: Ações simples, sinais previsíveis, tolerância a parada gradual',
      'Nível moderado: Ações mais engajantes, sinais imprevisíveis',
      'Nível severo: Ações muito engajantes (música favorita), parada instantânea exigida'
    ],
    theoreticalBasis: 'Inibir resposta em curso é mais difícil que não iniciar. Treina especificamente a capacidade de "frear" comportamento já ativado.',
    ageRange: '6-16 anos',
    tips: [
      'Comece com ações fáceis de parar',
      'Use sinal muito claro e consistente',
      'Não exija perfeição inicial',
      'Progressão gradual é chave'
    ]
  },
  {
    id: 'tdah-ci-6',
    title: 'Contagem Regressiva Rítmica',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Adiamento de Gratificação',
    generalObjective: 'Desenvolver capacidade de adiar gratificação musical através de contagem regressiva estruturada',
    specificObjectives: [
      'Aguardar contagem completa antes da recompensa musical',
      'Tolerar contagens progressivamente maiores',
      'Manter regulação durante espera',
      'Internalizar estratégia de adiamento'
    ],
    description: 'Antes de tocar instrumento desejado ou música favorita, fazer contagem regressiva rítmica (10, 9, 8...). Aumente gradualmente o número. A contagem é ativa (batendo pulso), não passiva. A música/instrumento é a recompensa por completar. Trabalhe conceito de "vale a pena esperar".',
    materials: ['Instrumento de contagem (tambor)', 'Recompensa musical atraente', 'Registro de contagens completadas'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Maior contagem tolerada',
      'Qualidade da espera (ativa vs. agitada)',
      'Regulação emocional durante espera',
      'Satisfação com recompensa',
      'Transferência para outras situações de espera'
    ],
    adaptations: [
      'Nível leve: Contagem curta (5), recompensa muito atraente',
      'Nível moderado: Contagem média (10-20), recompensa atraente',
      'Nível severo: Contagem longa (30+), recompensa moderada'
    ],
    theoreticalBasis: 'Baseado em paradigmas de adiamento de gratificação. A contagem ativa preenche o tempo de espera, facilitando tolerância.',
    ageRange: '5-14 anos',
    tips: [
      'Faça contagem rítmica e musical',
      'Use recompensas que realmente motivem',
      'Aumente números gradualmente',
      'Celebre contagens completadas'
    ]
  },
  {
    id: 'tdah-ci-7',
    title: 'Turno Silencioso Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Espera de Turno',
    generalObjective: 'Desenvolver capacidade de aguardar sua vez em contexto musical grupal ou diádico',
    specificObjectives: [
      'Aguardar turno do outro sem antecipar',
      'Manter atenção ao outro durante espera',
      'Entrar precisamente no seu turno',
      'Tolerar turnos de outros cada vez mais longos'
    ],
    description: 'Em formato de conversa musical ou improvisação em turnos, cada um toca em sua vez. Paciente deve aguardar em silêncio enquanto outro toca, sem antecipar. Aumente duração dos turnos do outro gradualmente. Trabalhe também respeitar quando outro ainda não terminou.',
    materials: ['Instrumentos para cada participante', 'Sinalizador de turno visual', 'Timer de turno'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Antecipações durante turno do outro',
      'Atenção mantida ao outro',
      'Entrada precisa no próprio turno',
      'Tolerância a turnos longos',
      'Frustração observada'
    ],
    adaptations: [
      'Nível leve: Turnos curtos do outro, sinalizador claro, feedback imediato',
      'Nível moderado: Turnos médios, sinalizador presente',
      'Nível severo: Turnos longos, sem sinalizador, auto-monitoramento'
    ],
    theoreticalBasis: 'Dificuldade de esperar vez é manifestação social do controle inibitório deficitário. Contexto musical torna prática mais motivadora.',
    ageRange: '5-14 anos',
    tips: [
      'Comece com turnos curtos do outro',
      'Use objeto sinalizador de quem é a vez',
      'Pratique em díade antes de grupo',
      'Conecte com situações de interrupção'
    ]
  },
  {
    id: 'tdah-ci-8',
    title: 'Controle de Volume Gradual',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle Motor Fino',
    generalObjective: 'Desenvolver controle inibitório motor fino através de modulação gradual de volume',
    specificObjectives: [
      'Controlar intensidade de toque suavemente',
      'Fazer crescendos e decrescendos graduais',
      'Manter volume estável quando solicitado',
      'Inibir tendência a tocar forte demais'
    ],
    description: 'Trabalhe controle de volume: seguir régua visual de volume, fazer crescendo muito lento, manter pianíssimo por período. O desafio é inibir a tendência natural de tocar forte. Use feedback visual de volume (app de medidor). Pratique moderação gradual.',
    materials: ['Instrumento', 'Régua visual de volume', 'App medidor de volume', 'Registro de controle'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Controle de volume conforme solicitado',
      'Suavidade de mudanças',
      'Capacidade de manter volume baixo',
      'Inibição de explosões de volume',
      'Transferência para controle de voz'
    ],
    adaptations: [
      'Nível leve: Apenas forte vs. fraco, tolerância a variações',
      'Nível moderado: 3-4 níveis, crescendos/decrescendos',
      'Nível severo: Gradações finas, manutenção prolongada de volume específico'
    ],
    theoreticalBasis: 'Controle motor fino de intensidade requer inibição constante da resposta máxima, trabalhando autorregulação motora.',
    ageRange: '6-16 anos',
    tips: [
      'Use feedback visual de volume',
      'Comece com extremos antes de gradações',
      'Conecte com volume de voz em sala de aula',
      'Faça jogos de "quem consegue mais baixo"'
    ]
  },
  {
    id: 'tdah-ci-9',
    title: 'Câmera Lenta Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Controle de Velocidade',
    generalObjective: 'Desenvolver controle inibitório através da execução musical em velocidade muito lenta',
    specificObjectives: [
      'Executar movimentos em câmera lenta',
      'Inibir tendência a acelerar',
      'Manter qualidade em velocidade reduzida',
      'Controlar impulso de apressar'
    ],
    description: 'Toque músicas ou padrões em câmera lenta - muito mais lento que natural. O desafio é inibir a aceleração automática. Use metrônomo em velocidade muito baixa como guia. Faça competições de "quem consegue mais lento mantendo a música reconhecível".',
    materials: ['Instrumento', 'Metrônomo', 'Músicas conhecidas', 'Timer'],
    estimatedTime: '15-20 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Manutenção de velocidade lenta',
      'Resistência a acelerar',
      'Qualidade mantida em lento',
      'Velocidade mínima alcançada',
      'Frustração vs. controle'
    ],
    adaptations: [
      'Nível leve: Velocidade apenas moderadamente lenta, apoio de metrônomo',
      'Nível moderado: Velocidade bem lenta, metrônomo disponível',
      'Nível severo: Velocidade muito lenta, sem metrônomo, peças longas'
    ],
    theoreticalBasis: 'Tendência a velocidade excessiva é comum no TDAH. Treinar desaceleração deliberada trabalha inibição de resposta predominante.',
    ageRange: '6-16 anos',
    tips: [
      'Use músicas conhecidas e amadas',
      'Faça competição de lentidão',
      'Use metrônomo como apoio inicial',
      'Conecte com fala rápida demais'
    ]
  },
  {
    id: 'tdah-ci-10',
    title: 'Resistindo à Tentação Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Resistência à Tentação',
    generalObjective: 'Desenvolver capacidade de resistir a tentações musicais imediatas em favor de recompensa maior posterior',
    specificObjectives: [
      'Resistir a instrumento atraente visível',
      'Escolher esperar por recompensa maior',
      'Desenvolver estratégias de resistência',
      'Internalizar conceito de gratificação adiada'
    ],
    description: 'Inspirado no teste do marshmallow: instrumento muito atraente está visível mas não pode ser tocado por tempo determinado. Se conseguir esperar, ganha tempo extra com ele ou algo ainda melhor. Ensine estratégias de resistência (olhar para outro lado, pensar em outra coisa).',
    materials: ['Instrumento muito atraente', 'Timer visual', 'Recompensa maior para quem esperar', 'Cartões de estratégias'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Tempo de resistência',
      'Uso de estratégias de distração',
      'Escolha de esperar ou não',
      'Satisfação com resultado',
      'Internalização do conceito'
    ],
    adaptations: [
      'Nível leve: Tentação moderada, tempo curto, estratégias dadas',
      'Nível moderado: Tentação alta, tempo médio, algumas estratégias',
      'Nível severo: Tentação muito alta, tempo longo, criar próprias estratégias'
    ],
    theoreticalBasis: 'Paradigma de adiamento de gratificação de Mischel. TDAH tem dificuldade específica em resistir a recompensas imediatas.',
    ageRange: '5-14 anos',
    tips: [
      'Não julgue se não conseguir resistir',
      'Ensine estratégias de distração',
      'Celebre escolhas de esperar',
      'Discuta o que funcionou/não funcionou'
    ]
  },
  {
    id: 'tdah-ci-11',
    title: 'Inibição de Hábitos Musicais',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Inibição de Hábitos',
    generalObjective: 'Desenvolver capacidade de inibir respostas habituais ou automáticas em contexto musical',
    specificObjectives: [
      'Identificar respostas automáticas',
      'Inibir resposta habitual quando inadequada',
      'Substituir por resposta alternativa',
      'Manter nova resposta consistentemente'
    ],
    description: 'Identifique uma resposta habitual do paciente (sempre começa forte, sempre acelera, sempre repete) e trabalhe inibição: cada vez que perceber o hábito, parar e fazer diferente. Use sinal combinado para quando hábito aparecer. Registre ocorrências e inibições.',
    materials: ['Identificação de hábitos', 'Sinal combinado', 'Alternativa planejada', 'Registro de monitoramento'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Consciência do hábito',
      'Taxa de inibição quando percebido',
      'Implementação da alternativa',
      'Redução gradual do hábito',
      'Transferência para hábitos fora da sessão'
    ],
    adaptations: [
      'Nível leve: Hábito óbvio, terapeuta sinaliza, alternativa simples',
      'Nível moderado: Hábito moderado, auto-monitoramento parcial',
      'Nível severo: Hábito sutil, auto-monitoramento, múltiplos hábitos'
    ],
    theoreticalBasis: 'Inibir respostas habituais requer controle executivo ativo para suprimir resposta automática em favor de resposta intencional.',
    ageRange: '8-18 anos',
    tips: [
      'Comece com hábito óbvio e fácil de mudar',
      'Use humor ao notar hábito',
      'Celebre cada inibição bem-sucedida',
      'Conecte com hábitos problemáticos reais'
    ]
  },
  {
    id: 'tdah-ci-12',
    title: 'Pausa Reflexiva Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Pensar Antes de Agir',
    generalObjective: 'Desenvolver hábito de pausar e refletir antes de responder musicalmente',
    specificObjectives: [
      'Inserir pausa antes de respostas',
      'Usar pausa para planejar resposta',
      'Melhorar qualidade de respostas após pausa',
      'Internalizar hábito de pausar'
    ],
    description: 'Antes de responder a qualquer solicitação musical, paciente deve pausar (contagem de 3-5), pensar no que vai fazer, depois agir. Compare qualidade de respostas com e sem pausa. Use sinal visual ou ritual de pausa. Progrida de pausa externa para interna.',
    materials: ['Ritual de pausa', 'Timer de pausa', 'Registro de qualidade de respostas'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Implementação consistente da pausa',
      'Uso produtivo do tempo de pausa',
      'Qualidade de resposta após pausa',
      'Internalização gradual',
      'Transferência para outros contextos'
    ],
    adaptations: [
      'Nível leve: Pausa longa e explícita, lembrete constante',
      'Nível moderado: Pausa média, lembrete parcial',
      'Nível severo: Pausa breve e interna, auto-gerenciada'
    ],
    theoreticalBasis: 'Inserir intervalo entre estímulo e resposta permite ativação de controle executivo, frequentemente bypassed no TDAH.',
    ageRange: '7-18 anos',
    tips: [
      'Comece com pausa explícita e ritualizada',
      'Mostre diferença de qualidade com pausa',
      'Gradualmente internalize a pausa',
      'Conecte com "pensar antes de falar"'
    ]
  },
  {
    id: 'tdah-ci-13',
    title: 'Resistência a Interrupção',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Inibição de Interrupção',
    generalObjective: 'Desenvolver capacidade de inibir impulso de interromper durante atividade musical colaborativa',
    specificObjectives: [
      'Aguardar outro terminar antes de contribuir',
      'Inibir verbalizações durante música do outro',
      'Manter pensamentos para depois sem esquecer',
      'Contribuir no momento adequado'
    ],
    description: 'Durante atividades colaborativas, trabalhe especificamente não interromper: quando tiver ideia ou comentário, anotar ou sinalizar mas não verbalizar até momento adequado. Use sinal de "tenho algo para dizer" que não interrompe. Pratique guardar pensamento.',
    materials: ['Atividade colaborativa', 'Cartão de "tenho algo"', 'Bloco de anotações rápidas', 'Momento planejado para contribuições'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Frequência de interrupções',
      'Uso de estratégias alternativas',
      'Retenção do pensamento até momento adequado',
      'Qualidade das contribuições no momento certo',
      'Transferência para conversas'
    ],
    adaptations: [
      'Nível leve: Muitos momentos para contribuir, cartão visual, atividades curtas',
      'Nível moderado: Momentos moderados para contribuir',
      'Nível severo: Poucos momentos, atividades longas, auto-gerenciamento'
    ],
    theoreticalBasis: 'Interrupção é manifestação comum de déficit inibitório no TDAH, impactando funcionamento social. Treino em contexto motivador facilita aprendizado.',
    ageRange: '6-18 anos',
    tips: [
      'Crie forma aceitável de sinalizar que tem algo',
      'Ensine a anotar rapidamente para não esquecer',
      'Não puna interrupções - redirecione',
      'Conecte com queixas de interrupção em outros contextos'
    ]
  },
  {
    id: 'tdah-ci-14',
    title: 'Inibição Seletiva',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Inibição Complexa',
    generalObjective: 'Desenvolver capacidade de inibir seletivamente apenas parte da resposta mantendo outras',
    specificObjectives: [
      'Inibir um componente enquanto mantém outros',
      'Discriminar o que inibir e o que manter',
      'Aumentar precisão da inibição seletiva',
      'Manter desempenho sob regras complexas'
    ],
    description: 'Regras complexas de inibição: "Toque o ritmo mas não cante", "Mova os braços mas não as pernas", "Responda a graves mas não agudos enquanto mantém o pulso". Inibição parcial é mais difícil que total. Aumente complexidade das combinações.',
    materials: ['Atividades com componentes separáveis', 'Cartões de regras', 'Registro de precisão'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Precisão na inibição seletiva',
      'Manutenção dos componentes não-inibidos',
      'Gerenciamento de regras complexas',
      'Flexibilidade com mudanças de regras',
      'Estratégias utilizadas'
    ],
    adaptations: [
      'Nível leve: Componentes muito distintos, uma regra simples',
      'Nível moderado: Componentes relacionados, regras moderadas',
      'Nível severo: Componentes integrados, regras complexas e mutáveis'
    ],
    theoreticalBasis: 'Inibição seletiva requer controle executivo mais sofisticado que inibição total, trabalhando modulação fina de resposta.',
    ageRange: '9-18 anos',
    tips: [
      'Comece com componentes muito distintos',
      'Use cores ou símbolos para diferentes regras',
      'Não exija perfeição - celebre tentativas',
      'Humor ajuda quando regras se misturam'
    ]
  },
  {
    id: 'tdah-ci-15',
    title: 'Autocontrole Progressivo',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Autocontrole',
    generalObjective: 'Desenvolver autocontrole progressivo através de desafios inibitórios de dificuldade crescente',
    specificObjectives: [
      'Completar hierarquia de desafios inibitórios',
      'Identificar nível atual de autocontrole',
      'Desenvolver estratégias personalizadas',
      'Generalizar autocontrole para vida diária'
    ],
    description: 'Crie hierarquia personalizada de desafios inibitórios, do mais fácil ao mais difícil para o paciente específico. Trabalhe progressivamente, consolidando cada nível antes de avançar. Identifique estratégias mais efetivas para cada tipo de desafio. Crie "diploma de autocontrole" para níveis alcançados.',
    materials: ['Hierarquia personalizada', 'Registro de conquistas', 'Cartões de estratégias', 'Diplomas de níveis'],
    estimatedTime: '30-40 minutos (múltiplas sessões)',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Progresso na hierarquia',
      'Consolidação de níveis anteriores',
      'Desenvolvimento de estratégias pessoais',
      'Generalização para outros contextos',
      'Autoeficácia percebida'
    ],
    adaptations: [
      'Nível leve: Hierarquia com muitos níveis intermediários, muito apoio',
      'Nível moderado: Hierarquia moderada, apoio parcial',
      'Nível severo: Hierarquia desafiadora, auto-progressão'
    ],
    theoreticalBasis: 'Exposição gradual a desafios inibitórios, com consolidação de sucesso em cada nível, desenvolve autocontrole de forma sustentável.',
    ageRange: '8-18 anos',
    tips: [
      'Personalize hierarquia para o paciente',
      'Não pule níveis - consolide cada um',
      'Celebre cada nível alcançado',
      'Revise estratégias que funcionaram'
    ]
  },

  // ==================== AUTORREGULAÇÃO (15 atividades) ====================
  {
    id: 'tdah-ar-1',
    title: 'Termômetro Emocional Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Consciência Emocional',
    generalObjective: 'Desenvolver consciência do próprio estado emocional e de energia através de representação musical',
    specificObjectives: [
      'Identificar estado emocional atual',
      'Representar estado através de música',
      'Reconhecer mudanças de estado',
      'Associar estados a expressões musicais específicas'
    ],
    description: 'Use instrumento ou voz para representar estado emocional/energético atual: intensidade, velocidade, altura representam diferentes aspectos. Crie escala visual de referência. Pratique check-ins regulares representando musicalmente "como estou agora". Compare auto-percepção com observação externa.',
    materials: ['Instrumento ou voz', 'Termômetro visual', 'Escala de referência', 'Diário musical de estados'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Precisão da auto-percepção',
      'Consistência da representação musical',
      'Consciência de mudanças',
      'Vocabulário emocional desenvolvido',
      'Generalização para fora da sessão'
    ],
    adaptations: [
      'Nível leve: Apenas 3 níveis (baixo/médio/alto), representação simples',
      'Nível moderado: 5 níveis, diferenciação emoção vs. energia',
      'Nível severo: Gradações finas, múltiplas dimensões, auto-monitoramento'
    ],
    theoreticalBasis: 'Consciência interoceptiva e emocional é frequentemente reduzida no TDAH. Externalizar através de música facilita reconhecimento.',
    ageRange: '6-18 anos',
    tips: [
      'Faça check-ins no início e fim de cada sessão',
      'Use visual concreto de referência',
      'Não julgue estados - apenas identifique',
      'Conecte com situações de desregulação'
    ]
  },
  {
    id: 'tdah-ar-2',
    title: 'Música para Acalmar',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Regulação para Baixo',
    generalObjective: 'Desenvolver estratégias musicais para reduzir ativação quando estado está elevado demais',
    specificObjectives: [
      'Reconhecer quando ativação está alta demais',
      'Aplicar técnicas musicais de redução',
      'Monitorar efeito das técnicas',
      'Internalizar repertório de estratégias calmantes'
    ],
    description: 'Crie repertório de estratégias musicais para acalmar: músicas lentas, respiração com ritmo lento, instrumentos de som suave, movimento lento. Pratique em estados neutros primeiro, depois quando levemente ativado. Identifique o que funciona melhor individualmente.',
    materials: ['Playlist calmante', 'Instrumentos suaves', 'Técnicas de respiração rítmica', 'Registro de efetividade'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Reconhecimento de alta ativação',
      'Aplicação de técnicas adequadas',
      'Redução observável de ativação',
      'Preferências identificadas',
      'Uso fora da sessão'
    ],
    adaptations: [
      'Nível leve: Prática em estado neutro, técnicas guiadas',
      'Nível moderado: Prática em estado levemente elevado, escolha de técnicas',
      'Nível severo: Prática em estados mais ativados, auto-aplicação'
    ],
    theoreticalBasis: 'Música com características específicas (andamento lento, dinâmica suave) pode induzir estados mais calmos através de entrainment.',
    ageRange: '5-18 anos',
    tips: [
      'Identifique preferências individuais',
      'Pratique quando calmo, não apenas em crise',
      'Crie playlist portátil para uso diário',
      'Ensine respiração sincronizada com música'
    ]
  },
  {
    id: 'tdah-ar-3',
    title: 'Música para Energizar',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Regulação para Cima',
    generalObjective: 'Desenvolver estratégias musicais para aumentar ativação quando estado está baixo demais',
    specificObjectives: [
      'Reconhecer quando ativação está baixa demais',
      'Aplicar técnicas musicais de ativação',
      'Controlar nível de ativação (não exagerar)',
      'Internalizar repertório de estratégias energizantes'
    ],
    description: 'Crie repertório de estratégias musicais para energizar: músicas rápidas, percussão ativa, movimento amplo, canto vigoroso. Pratique ativar energia de forma controlada - sem passar do ponto. Identifique nível ótimo pessoal de ativação.',
    materials: ['Playlist energizante', 'Instrumentos de percussão', 'Espaço para movimento', 'Registro de níveis de energia'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Reconhecimento de baixa ativação',
      'Aplicação de técnicas adequadas',
      'Controle do nível de ativação',
      'Identificação do ponto ótimo',
      'Uso antes de atividades que exigem foco'
    ],
    adaptations: [
      'Nível leve: Ativação moderada com apoio, feedback constante',
      'Nível moderado: Ativação mais intensa, auto-monitoramento parcial',
      'Nível severo: Calibração fina, auto-gerenciamento'
    ],
    theoreticalBasis: 'Muitas pessoas com TDAH apresentam hipoativação basal, precisando de estratégias para atingir nível ótimo de arousal.',
    ageRange: '5-18 anos',
    tips: [
      'Ensine que há nível ótimo - nem baixo, nem alto demais',
      'Use antes de deveres/atividades exigentes',
      'Movimento físico potencializa efeito',
      'Cuidado para não superativar'
    ]
  },
  {
    id: 'tdah-ar-4',
    title: 'Respiração Rítmica Reguladora',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Regulação Fisiológica',
    generalObjective: 'Desenvolver técnica de respiração sincronizada com ritmo para regulação do sistema nervoso',
    specificObjectives: [
      'Sincronizar respiração com ritmo musical',
      'Usar respiração para regular ativação',
      'Identificar padrões respiratórios associados a estados',
      'Aplicar técnica independentemente em momentos de necessidade'
    ],
    description: 'Ensine padrões respiratórios sincronizados com ritmo: inspirar em 4 tempos, segurar em 4, expirar em 6-8. Use instrumento ou música como guia. Pratique padrões diferentes para acalmar (expiração longa) e ativar (inspiração ativa). Crie música de respiração pessoal.',
    materials: ['Metrônomo ou música guia', 'Visual de padrão respiratório', 'Registro de prática'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Sincronização respiração-ritmo',
      'Efetividade na mudança de estado',
      'Lembrança de usar quando necessário',
      'Aplicação independente',
      'Internalização do ritmo'
    ],
    adaptations: [
      'Nível leve: Padrão simples, muito apoio visual/auditivo',
      'Nível moderado: Padrões variados, apoio moderado',
      'Nível severo: Escolha de padrão conforme necessidade, auto-guiado'
    ],
    theoreticalBasis: 'Respiração é via de acesso ao sistema nervoso autônomo. Sincronização com ritmo externo facilita regularidade e profundidade.',
    ageRange: '6-18 anos',
    tips: [
      'Comece com padrões simples',
      'Use visual de onda ou bola subindo/descendo',
      'Pratique quando calmo para automatizar',
      'Crie lembrete para usar em situações-chave'
    ]
  },
  {
    id: 'tdah-ar-5',
    title: 'Zonas de Regulação Sonoras',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Consciência de Estados',
    generalObjective: 'Desenvolver consciência e vocabulário de estados regulatórios usando metáfora de zonas coloridas com música',
    specificObjectives: [
      'Identificar zona atual (verde/azul/amarelo/vermelho)',
      'Associar cada zona a características musicais',
      'Reconhecer transições entre zonas',
      'Desenvolver estratégias musicais para cada zona'
    ],
    description: 'Baseado no programa Zonas de Regulação, associe cada zona a características musicais: verde (regulado) = música equilibrada; azul (baixa energia) = música lenta/triste; amarelo (perdendo controle) = música acelerada/tensa; vermelho (fora de controle) = música caótica. Crie playlist de cada zona e playlist para voltar ao verde.',
    materials: ['Cartões de zonas', 'Playlists por zona', 'Registro de zonas durante a sessão'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Identificação precisa de zona',
      'Associação música-zona estabelecida',
      'Reconhecimento de transições',
      'Uso de estratégias para retornar ao verde',
      'Generalização para fora da sessão'
    ],
    adaptations: [
      'Nível leve: Apenas verde e vermelho, músicas muito distintas',
      'Nível moderado: 4 zonas, estratégias básicas para cada',
      'Nível severo: Gradações dentro de zonas, estratégias sofisticadas'
    ],
    theoreticalBasis: 'O programa Zonas de Regulação de Leah Kuypers fornece estrutura concreta para autorregulação, adaptado aqui com música.',
    ageRange: '5-14 anos',
    tips: [
      'Use cores consistentes com programa original',
      'Crie gestos musicais para cada zona',
      'Check-in de zona em cada sessão',
      'Envolva família no vocabulário de zonas'
    ]
  },
  {
    id: 'tdah-ar-6',
    title: 'Transição Emocional Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Mudança de Estado',
    generalObjective: 'Desenvolver capacidade de mudar estado emocional/regulatório intencionalmente através de música',
    specificObjectives: [
      'Identificar estado atual e estado desejado',
      'Selecionar música/técnica para transição',
      'Executar transição gradual',
      'Atingir estado alvo de forma controlada'
    ],
    description: 'Pratique transições intencionais: de agitado para calmo, de apático para energizado, de irritado para neutro. Use música como veículo de mudança - comece com música que reflete estado atual, gradualmente mude para música do estado desejado. O paciente escolhe e implementa.',
    materials: ['Músicas de diferentes estados', 'Mapa de transições', 'Registro de transições realizadas'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão na identificação de estados',
      'Adequação da seleção musical',
      'Suavidade da transição',
      'Atingimento do estado alvo',
      'Aplicação em situações reais'
    ],
    adaptations: [
      'Nível leve: Transições simples (calmo-energizado), terapeuta seleciona músicas',
      'Nível moderado: Transições variadas, paciente ajuda na seleção',
      'Nível severo: Qualquer transição, paciente planeja e executa'
    ],
    theoreticalBasis: 'O princípio ISO em musicoterapia propõe começar com música que espelha o estado atual e gradualmente mudar para estado desejado.',
    ageRange: '8-18 anos',
    tips: [
      'Não pule diretamente de um extremo ao outro',
      'Respeite ritmo pessoal de transição',
      'Crie repertório de transições bem-sucedidas',
      'Aplique antes de situações desafiadoras'
    ]
  },
  {
    id: 'tdah-ar-7',
    title: 'Diário Musical de Humor',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Monitoramento Emocional',
    generalObjective: 'Desenvolver hábito de monitorar e registrar estados emocionais através de expressão musical',
    specificObjectives: [
      'Fazer check-ins emocionais regulares',
      'Expressar estados através de música',
      'Identificar padrões ao longo do tempo',
      'Relacionar estados com situações e estratégias'
    ],
    description: 'Crie formato de diário musical: breve improvisação ou seleção musical que representa o estado atual, registro de situações relevantes, estratégias usadas. Pode ser gravado ou anotado com símbolos musicais. Revise semanalmente para identificar padrões.',
    materials: ['Instrumento ou voz', 'Gravador', 'Formato de diário visual', 'Calendário de humor musical'],
    estimatedTime: '10-15 minutos por entrada',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Regularidade das entradas',
      'Expressividade das representações',
      'Consciência de padrões',
      'Relação estado-situação identificada',
      'Uso de informações para autorregulação'
    ],
    adaptations: [
      'Nível leve: Uma entrada por sessão, formato muito estruturado',
      'Nível moderado: Entradas diárias, formato semi-estruturado',
      'Nível severo: Múltiplas entradas, formato livre, análise de padrões'
    ],
    theoreticalBasis: 'Auto-monitoramento regular aumenta consciência emocional, permitindo intervenção mais precoce em padrões problemáticos.',
    ageRange: '8-18 anos',
    tips: [
      'Mantenha simples para garantir adesão',
      'Use emojis ou símbolos se preferir não gravar',
      'Revise semanalmente para insights',
      'Celebre consistência do registro'
    ]
  },
  {
    id: 'tdah-ar-8',
    title: 'Ritual de Foco Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Preparação para Foco',
    generalObjective: 'Desenvolver ritual musical de preparação que facilite entrada em estado de foco',
    specificObjectives: [
      'Criar sequência de preparação personalizada',
      'Automatizar ritual através de repetição',
      'Associar ritual a estado de foco',
      'Aplicar antes de atividades que exigem atenção'
    ],
    description: 'Crie ritual consistente antes de tarefas de foco: música específica, respiração rítmica, organização do espaço, movimento preparatório. Sempre na mesma sequência. Pratique até ficar automático. A música de ritual se torna "gatilho" de estado focado.',
    materials: ['Música de ritual', 'Sequência visual', 'Elementos do ritual', 'Registro de uso'],
    estimatedTime: '5-10 minutos (ritual) + prática',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Consistência do ritual',
      'Tempo para entrar em foco após ritual',
      'Associação música-foco estabelecida',
      'Uso fora das sessões',
      'Efetividade percebida'
    ],
    adaptations: [
      'Nível leve: Ritual longo (10min) com muitos elementos, ambiente ideal',
      'Nível moderado: Ritual médio (5min), ambiente variado',
      'Nível severo: Micro-ritual (2min) portátil para qualquer ambiente'
    ],
    theoreticalBasis: 'Condicionamento clássico pode criar associação entre ritual e estado de foco. A consistência é chave para formação do hábito.',
    ageRange: '6-18 anos',
    tips: [
      'A consistência é mais importante que complexidade',
      'Use mesma música sempre para condicionamento',
      'Pratique em condições ideais primeiro',
      'Gradualmente aplique em situações reais'
    ]
  },
  {
    id: 'tdah-ar-9',
    title: 'Descompressão Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Recuperação',
    generalObjective: 'Desenvolver estratégias musicais de descompressão após atividades intensas ou estressantes',
    specificObjectives: [
      'Reconhecer necessidade de descompressão',
      'Aplicar técnicas musicais de relaxamento',
      'Completar ciclo de ativação-desativação',
      'Prevenir acúmulo de estresse'
    ],
    description: 'Após atividades intensas (escolares, sociais, físicas), use música para descomprimir: escuta passiva relaxante, improvisação livre sem objetivo, movimento fluido com música suave. Crie rotina de descompressão para fim de dia ou transições difíceis.',
    materials: ['Playlist de descompressão', 'Espaço confortável', 'Instrumentos de som suave'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Reconhecimento de necessidade',
      'Implementação regular',
      'Efetividade na redução de tensão',
      'Prevenção de colapsos',
      'Rotina estabelecida'
    ],
    adaptations: [
      'Nível leve: Descompressão guiada, ambiente ideal, após atividades leves',
      'Nível moderado: Descompressão semi-guiada, ambiente variado',
      'Nível severo: Auto-aplicação após atividades muito intensas'
    ],
    theoreticalBasis: 'O sistema nervoso precisa de recuperação ativa após ativação intensa. Música pode facilitar transição para estado parassimpático.',
    ageRange: '5-18 anos',
    tips: [
      'Não pule descompressão por falta de tempo',
      'Crie rotina de fim de dia',
      'Ajuste duração conforme intensidade da atividade',
      'Inclua elementos sensoriais prazerosos'
    ]
  },
  {
    id: 'tdah-ar-10',
    title: 'Ancoragem Sonora',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Condicionamento Regulatório',
    generalObjective: 'Criar associações condicionadas entre sons/músicas específicos e estados regulatórios desejados',
    specificObjectives: [
      'Associar música específica a estado de calma',
      'Associar música específica a estado de foco',
      'Usar âncora para acessar estado rapidamente',
      'Desenvolver repertório de âncoras pessoais'
    ],
    description: 'Crie âncoras sonoras: durante estados desejados (muito calmo, muito focado), exponha a música específica repetidamente. Depois, a música pode evocar o estado. Funciona como condicionamento. Crie âncoras para diferentes estados úteis.',
    materials: ['Músicas selecionadas para âncora', 'Registro de emparelhamentos', 'Práticas de condicionamento'],
    estimatedTime: '20-30 minutos (múltiplas sessões)',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Força da associação música-estado',
      'Velocidade de evocação do estado',
      'Durabilidade da âncora',
      'Generalização para fora da sessão',
      'Repertório desenvolvido'
    ],
    adaptations: [
      'Nível leve: Uma âncora simples (calma), muitas repetições',
      'Nível moderado: 2-3 âncoras, prática regular',
      'Nível severo: Múltiplas âncoras, uso estratégico em situações'
    ],
    theoreticalBasis: 'Baseado em princípios de condicionamento clássico. A música repetidamente pareada com estado pode eventualmente evocar o estado.',
    ageRange: '8-18 anos',
    tips: [
      'Escolha músicas que já têm associações positivas',
      'Repita emparelhamento muitas vezes',
      'Use âncora em momentos de necessidade real',
      'Mantenha âncoras em playlist acessível'
    ]
  },
  {
    id: 'tdah-ar-11',
    title: 'Regulação do Nível de Energia',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Modulação de Arousal',
    generalObjective: 'Desenvolver capacidade de modular nível de energia/arousal para adequar-se a demandas situacionais',
    specificObjectives: [
      'Identificar nível de energia atual vs. necessário',
      'Ajustar energia para cima ou para baixo',
      'Manter nível adequado durante atividade',
      'Prevenir oscilações extremas'
    ],
    description: 'Use metáfora de "tanque de energia" ou "medidor de velocidade". Identifique nível atual e nível necessário para atividade. Use música para ajustar: ativadora para subir, calmante para descer. Pratique calibração para diferentes demandas (escola, esporte, descanso).',
    materials: ['Medidor visual de energia', 'Músicas para ajuste', 'Cartões de demandas situacionais'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão da identificação de níveis',
      'Capacidade de ajuste intencional',
      'Adequação às demandas situacionais',
      'Estabilidade do nível atingido',
      'Aplicação em situações reais'
    ],
    adaptations: [
      'Nível leve: Apenas alto/baixo/médio, situações simples',
      'Nível moderado: Gradações finas, situações variadas',
      'Nível severo: Auto-monitoramento contínuo, ajuste dinâmico'
    ],
    theoreticalBasis: 'O modelo de regulação de arousal propõe nível ótimo de ativação para cada tarefa. TDAH tem dificuldade de modular arousal conforme demanda.',
    ageRange: '7-18 anos',
    tips: [
      'Use metáfora concreta (velocímetro)',
      'Mapeie demandas de energia de diferentes atividades',
      'Pratique ajustes antes de transições',
      'Celebre calibrações bem-sucedidas'
    ]
  },
  {
    id: 'tdah-ar-12',
    title: 'Prevenção de Explosão Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Prevenção de Crise',
    generalObjective: 'Desenvolver capacidade de reconhecer sinais precoces de desregulação e intervir antes de explosão',
    specificObjectives: [
      'Identificar sinais pessoais de escalada',
      'Intervir musicalmente nos sinais iniciais',
      'Prevenir progressão para descontrole',
      'Desenvolver repertório de intervenções precoces'
    ],
    description: 'Mapeie sinais pessoais de escalada (tensão muscular, agitação, irritabilidade). Crie intervenções musicais para cada nível da escalada. Pratique identificar e intervir cedo - quanto antes, mais fácil. Use música como "extintor de incêndio" emocional.',
    materials: ['Mapa de sinais pessoais', 'Termômetro de escalada', 'Intervenções musicais por nível', 'Registro de prevenções'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Reconhecimento de sinais precoces',
      'Intervenção em níveis iniciais',
      'Prevenção de escalada completa',
      'Efetividade das intervenções',
      'Redução de episódios de descontrole'
    ],
    adaptations: [
      'Nível leve: Sinais óbvios, intervenção guiada por terapeuta',
      'Nível moderado: Sinais moderados, intervenção semi-independente',
      'Nível severo: Sinais sutis, auto-intervenção precoce'
    ],
    theoreticalBasis: 'Intervenção precoce na curva de escalada é mais efetiva que tentar regular após descontrole. Consciência dos sinais é primeiro passo.',
    ageRange: '6-18 anos',
    tips: [
      'Personalize sinais para cada pessoa',
      'Intervenção precoce é chave',
      'Pratique quando regulado, não em crise',
      'Envolva família no reconhecimento de sinais'
    ]
  },
  {
    id: 'tdah-ar-13',
    title: 'Regulação Social Musical',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Regulação em Contexto Social',
    generalObjective: 'Desenvolver capacidade de regular-se musicalmente em contextos sociais e interpessoais',
    specificObjectives: [
      'Reconhecer quando interação está gerando desregulação',
      'Aplicar técnicas sutis de autorregulação',
      'Manter engajamento social enquanto regula',
      'Usar música interna (imaginada) como recurso'
    ],
    description: 'Pratique cenários sociais desafiadores com apoio musical. Desenvolva técnicas sutis de regulação usáveis em público: ritmo mental, respiração discreta, movimento pequeno. Ensaie aplicar durante interações simuladas. Crie "música interna" calmante acessível a qualquer momento.',
    materials: ['Cenários sociais simulados', 'Técnicas sutis de regulação', 'Prática de música interna'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Reconhecimento de desregulação social',
      'Aplicação de técnicas sutis',
      'Manutenção de engajamento',
      'Efetividade em situações reais',
      'Uso de música interna'
    ],
    adaptations: [
      'Nível leve: Situações simples, técnicas óbvias permitidas, muito ensaio',
      'Nível moderado: Situações moderadas, técnicas mais sutis',
      'Nível severo: Situações complexas, técnicas invisíveis, tempo real'
    ],
    theoreticalBasis: 'Regulação em contexto social requer técnicas que não interfiram na interação. Música internalizada pode servir como recurso portátil.',
    ageRange: '10-18 anos',
    tips: [
      'Pratique técnicas sutis até ficarem automáticas',
      'Desenvolva música interna calmante pessoal',
      'Ensaie em role-plays antes de situações reais',
      'Debriefe situações reais para aprendizado'
    ]
  },
  {
    id: 'tdah-ar-14',
    title: 'Autorregulação na Frustração',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Tolerância à Frustração',
    generalObjective: 'Desenvolver capacidade de regular-se musicalmente diante de frustrações e dificuldades',
    specificObjectives: [
      'Reconhecer frustração sem reagir impulsivamente',
      'Aplicar técnicas musicais de regulação',
      'Manter engajamento apesar de dificuldade',
      'Desenvolver tolerância progressiva'
    ],
    description: 'Crie situações controladas de frustração musical (peça difícil, erro proposital, perda em jogo). Ensine a reconhecer frustração emergente e aplicar técnicas: pausa musical, respiração, expressar frustração no instrumento depois regular. Aumente gradualmente tolerância.',
    materials: ['Atividades levemente frustrantes', 'Técnicas de regulação', 'Termômetro de frustração', 'Registro de tolerância'],
    estimatedTime: '25-35 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Reconhecimento de frustração',
      'Regulação antes de reação explosiva',
      'Persistência em tarefa difícil',
      'Aumento gradual de tolerância',
      'Transferência para situações fora da sessão'
    ],
    adaptations: [
      'Nível leve: Frustrações mínimas, muito apoio para regular',
      'Nível moderado: Frustrações moderadas, apoio parcial',
      'Nível severo: Frustrações significativas, autorregulação'
    ],
    theoreticalBasis: 'Baixa tolerância à frustração é comum no TDAH e impacta funcionamento. Exposição gradual com ensino de regulação aumenta tolerância.',
    ageRange: '6-18 anos',
    tips: [
      'Não evite frustração - ensine a regular',
      'Comece com frustrações muito leves',
      'Normalize frustração como parte do processo',
      'Celebre regulações bem-sucedidas'
    ]
  },
  {
    id: 'tdah-ar-15',
    title: 'Autorregulação Autônoma',
    disorder: 'TDAH',
    demandCategory: 'autorregulacao',
    demandLabel: 'Independência Regulatória',
    generalObjective: 'Desenvolver capacidade de auto-gerenciar estados regulatórios com independência usando recursos musicais',
    specificObjectives: [
      'Monitorar próprio estado continuamente',
      'Identificar necessidade de regulação sem aviso externo',
      'Selecionar e aplicar estratégia adequada',
      'Avaliar efetividade e ajustar se necessário'
    ],
    description: 'Compile todo o aprendizado regulatório em kit de autorregulação pessoal: playlist de regulação, técnicas favoritas, sinais de alerta, mapa de estados. Pratique ciclo completo: monitorar → detectar necessidade → escolher estratégia → aplicar → avaliar. Gradualmente retire apoio externo.',
    materials: ['Kit pessoal de autorregulação', 'Playlist portátil', 'Cartões de técnicas', 'Registro de autogerenciamento'],
    estimatedTime: '30-40 minutos',
    complexityLevel: 'severo',
    evaluationCriteria: [
      'Frequência de automonitoramento',
      'Detecção autônoma de necessidade',
      'Adequação de escolha de estratégias',
      'Efetividade de auto-intervenções',
      'Independência progressiva'
    ],
    adaptations: [
      'Nível leve: Apoio externo frequente, opções limitadas de estratégias',
      'Nível moderado: Apoio ocasional, múltiplas estratégias',
      'Nível severo: Total independência, repertório completo'
    ],
    theoreticalBasis: 'O objetivo final da intervenção é independência regulatória. Todas as habilidades trabalhadas convergem para auto-gerenciamento autônomo.',
    ageRange: '10-18 anos',
    tips: [
      'Construa kit pessoal portátil',
      'Pratique em situações reais gradualmente',
      'Debriefe sucessos e desafios',
      'Continue refinando estratégias pessoais'
    ]
  },

  // ==================== MOTOR (10 atividades) ====================
  {
    id: 'tdah-mo-1',
    title: 'Circuito Rítmico Motor',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Canalização de Energia',
    generalObjective: 'Canalizar excesso de energia motora através de circuito de exercícios sincronizados com ritmo',
    specificObjectives: [
      'Executar movimentos no ritmo da música',
      'Manter sequência de exercícios',
      'Regular intensidade conforme ritmo',
      'Descarregar energia de forma organizada'
    ],
    description: 'Monte circuito com estações de movimento (pular, correr no lugar, agachar, girar) sincronizadas com música. O ritmo da música dita intensidade e mudanças. Permite descarga motora de forma estruturada. Use músicas de diferentes andamentos.',
    materials: ['Espaço amplo', 'Marcações de estações', 'Músicas variadas', 'Timer'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Sincronização movimento-ritmo',
      'Manutenção da sequência',
      'Regulação de intensidade',
      'Estado após circuito',
      'Engajamento mantido'
    ],
    adaptations: [
      'Nível leve: Movimentos simples, ritmo estável, poucas estações',
      'Nível moderado: Movimentos variados, ritmo mutável',
      'Nível severo: Movimentos complexos, mudanças rápidas, muitas estações'
    ],
    theoreticalBasis: 'Movimento rítmico organizado pode canalizar hiperatividade de forma produtiva, satisfazendo necessidade de movimento enquanto desenvolve controle.',
    ageRange: '5-14 anos',
    tips: [
      'Use músicas que a criança gosta',
      'Permita escolha de algumas estações',
      'Faça junto para modelar',
      'Use como preparação para atividades de foco'
    ]
  },
  {
    id: 'tdah-mo-2',
    title: 'Bateria Corporal Estruturada',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Percussão Corporal',
    generalObjective: 'Desenvolver controle motor e canalização de energia através de percussão corporal estruturada',
    specificObjectives: [
      'Executar padrões rítmicos no corpo',
      'Coordenar diferentes partes do corpo',
      'Manter padrão por períodos',
      'Expressar-se ritmicamente de forma organizada'
    ],
    description: 'Use o corpo como instrumento de percussão: palmas, batidas no peito, coxa, pés. Crie padrões rítmicos envolvendo diferentes partes. Comece simples e aumente complexidade. Permite expressão física intensa de forma canalizada.',
    materials: ['Corpo', 'Espaço confortável', 'Músicas de apoio', 'Cartões de padrões'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Precisão dos padrões',
      'Coordenação de partes do corpo',
      'Manutenção de padrão',
      'Criatividade nas variações',
      'Canalização de energia'
    ],
    adaptations: [
      'Nível leve: Uma ou duas partes do corpo, padrão simples',
      'Nível moderado: Múltiplas partes, padrões moderados',
      'Nível severo: Padrões complexos, polirritmia, criação'
    ],
    theoreticalBasis: 'Percussão corporal engaja propriocepção, coordenação e ritmo simultaneamente, organizando sistema motor de forma integrada.',
    ageRange: '5-16 anos',
    tips: [
      'Comece com movimentos naturais (palmas)',
      'Adicione partes do corpo gradualmente',
      'Permita intensidade se for rítmica',
      'Conecte com músicas populares'
    ]
  },
  {
    id: 'tdah-mo-3',
    title: 'Dança Estruturada com Freezes',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Movimento com Controle',
    generalObjective: 'Desenvolver controle motor através de dança livre alternada com momentos de freeze (estátua)',
    specificObjectives: [
      'Mover-se livremente no ritmo',
      'Parar imediatamente no freeze',
      'Manter posição por tempo determinado',
      'Alternar movimento e controle'
    ],
    description: 'Alterne momentos de dança livre intensa com freezes súbitos quando música para. Trabalha expressão e controle alternados. Aumente duração dos freezes e diminua previsibilidade. Permita movimento expressivo quando permitido.',
    materials: ['Músicas dançantes', 'Espaço para movimento', 'Timer visual para freezes'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Expressividade na dança',
      'Velocidade de freeze',
      'Manutenção da posição',
      'Retomada suave após freeze',
      'Diversão mantida'
    ],
    adaptations: [
      'Nível leve: Freezes previsíveis, curtos, tolerância a ajustes',
      'Nível moderado: Freezes semi-previsíveis, médios',
      'Nível severo: Freezes imprevisíveis, longos, posições difíceis'
    ],
    theoreticalBasis: 'A alternância de movimento livre e controle desenvolve capacidade de modular output motor, essencial para TDAH.',
    ageRange: '4-14 anos',
    tips: [
      'Valorize expressão na dança',
      'Aumente dificuldade dos freezes gradualmente',
      'Use músicas favoritas',
      'Celebre freezes bem-sucedidos'
    ]
  },
  {
    id: 'tdah-mo-4',
    title: 'Tambores para Descarga',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Descarga Motora',
    generalObjective: 'Oferecer canal de descarga motora intensa através de percussão em tambores',
    specificObjectives: [
      'Expressar energia física através da percussão',
      'Manter intensidade dentro de estrutura rítmica',
      'Regular intensidade conforme sinalização',
      'Terminar sessão em estado regulado'
    ],
    description: 'Use tambores ou superfícies de percussão para descarga motora intensa. Começa livre, depois estrutura gradualmente. Termine com decrescendo para voltar a estado regulado. Permite expressão física sem perder estrutura.',
    materials: ['Tambores ou almofadas grandes', 'Baquetas', 'Espaço apropriado para som'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Satisfação da necessidade de descarga',
      'Manutenção de alguma estrutura',
      'Resposta a sinais de regulação',
      'Estado ao final',
      'Ausência de agressividade'
    ],
    adaptations: [
      'Nível leve: Descarga livre seguida de estrutura leve',
      'Nível moderado: Descarga dentro de estrutura moderada',
      'Nível severo: Descarga intensa com controle de início/fim preciso'
    ],
    theoreticalBasis: 'Percussão oferece canal socialmente aceitável para descarga de energia/tensão, regulando sistema nervoso através de atividade intensa.',
    ageRange: '4-18 anos',
    tips: [
      'Não limite intensidade inicialmente',
      'Estruture gradualmente',
      'Sempre termine com regulação',
      'Use como preparação para atividades exigentes'
    ]
  },
  {
    id: 'tdah-mo-5',
    title: 'Coordenação Bilateral Musical',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Coordenação',
    generalObjective: 'Desenvolver coordenação bilateral e cruzamento de linha média através de atividades musicais',
    specificObjectives: [
      'Executar movimentos bilaterais simultâneos',
      'Cruzar linha média do corpo com ritmo',
      'Coordenar braços e pernas em padrões',
      'Manter padrão enquanto cruza'
    ],
    description: 'Atividades que exigem uso dos dois lados do corpo e cruzamento de linha média: tocar tambor com mãos alternadas, bater palmas em diferentes posições, movimentos que cruzam o corpo. Use ritmo como organizador.',
    materials: ['Instrumentos para dois lados', 'Espaço para movimento', 'Marcações de linha média'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Qualidade de movimentos bilaterais',
      'Fluidez no cruzamento de linha média',
      'Coordenação mãos-pés',
      'Manutenção de padrão',
      'Progresso ao longo das sessões'
    ],
    adaptations: [
      'Nível leve: Movimentos simétricos, sem cruzamento',
      'Nível moderado: Alternância, cruzamento simples',
      'Nível severo: Padrões complexos com cruzamento contínuo'
    ],
    theoreticalBasis: 'Coordenação bilateral e integração hemisférica podem ser deficitárias no TDAH. Atividades musicais bilaterais promovem integração.',
    ageRange: '5-14 anos',
    tips: [
      'Comece com movimentos simétricos',
      'Adicione alternância gradualmente',
      'Use ritmo lento no início',
      'Faça jogos de cruzamento divertidos'
    ]
  },
  {
    id: 'tdah-mo-6',
    title: 'Ritmo e Equilíbrio',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Equilíbrio',
    generalObjective: 'Desenvolver equilíbrio e estabilidade postural através de atividades musicais',
    specificObjectives: [
      'Manter equilíbrio em diferentes posições',
      'Usar ritmo como âncora para estabilidade',
      'Realizar movimentos mantendo centro de gravidade',
      'Integrar ritmo com controle postural'
    ],
    description: 'Combine desafios de equilíbrio com ritmo: ficar em um pé enquanto bate palmas, andar em linha reta no pulso, manter posição de ioga com música. O ritmo ajuda a organizar e manter estabilidade. Progrida para desafios mais complexos.',
    materials: ['Linha no chão', 'Música com pulso claro', 'Almofadas de equilíbrio (opcional)'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Estabilidade em diferentes posições',
      'Uso do ritmo para equilíbrio',
      'Duração de manutenção de posições',
      'Qualidade de movimentos enquanto equilibra',
      'Progresso em desafios mais difíceis'
    ],
    adaptations: [
      'Nível leve: Posições simples, base ampla, muito apoio rítmico',
      'Nível moderado: Posições desafiantes, base reduzida',
      'Nível severo: Posições complexas, movimento durante equilíbrio'
    ],
    theoreticalBasis: 'Ritmo externo pode servir como organizador para controle postural, integrando sistemas vestibular, proprioceptivo e auditivo.',
    ageRange: '5-16 anos',
    tips: [
      'Use ritmo forte e claro como âncora',
      'Permita estratégias de compensação',
      'Faça desafios divertidos, não frustrantes',
      'Relacione com esportes e atividades que goste'
    ]
  },
  {
    id: 'tdah-mo-7',
    title: 'Sequência Motora Musical',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Memória Motora',
    generalObjective: 'Desenvolver memória motora sequencial através de coreografias musicais progressivas',
    specificObjectives: [
      'Aprender sequências de movimentos',
      'Lembrar e executar sequências crescentes',
      'Sincronizar sequência com música',
      'Manter sequência ao longo do tempo'
    ],
    description: 'Ensine coreografias simples que vão aumentando: 4 movimentos, depois 6, depois 8. Use música como mnemônico. Pratique até automatizar. Crie coreografias de músicas favoritas. Adicione desafio de ensinar para outro.',
    materials: ['Músicas estruturadas', 'Vídeo de referência (opcional)', 'Espelho', 'Cartões de sequência'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Número de movimentos na sequência',
      'Precisão da execução',
      'Sincronização com música',
      'Retenção entre sessões',
      'Capacidade de ensinar outro'
    ],
    adaptations: [
      'Nível leve: Sequências curtas (4 movimentos), muito repetitivas',
      'Nível moderado: Sequências médias (6-8), com variações',
      'Nível severo: Sequências longas, criação de próprias coreografias'
    ],
    theoreticalBasis: 'Memória procedural/motora pode ser uma força no TDAH quando adequadamente estruturada. A música serve como mnemônico e motivador.',
    ageRange: '6-16 anos',
    tips: [
      'Use músicas muito familiares',
      'Ensine em pedaços pequenos',
      'Pratique até ficar automático',
      'Permita personalização da coreografia'
    ]
  },
  {
    id: 'tdah-mo-8',
    title: 'Relaxamento Muscular Progressivo Musical',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Relaxamento',
    generalObjective: 'Desenvolver consciência corporal e capacidade de relaxamento através de técnica musical de tensão-relaxamento',
    specificObjectives: [
      'Identificar tensão em grupos musculares',
      'Tensionar e relaxar sistematicamente',
      'Sincronizar tensão-relaxamento com música',
      'Atingir estado de relaxamento físico'
    ],
    description: 'Adaptação musical da técnica de Jacobson: tensionar grupo muscular com música tensa, relaxar com música suave. Percorra todo o corpo sistematicamente. Use contraste musical para facilitar transição tensão-relaxamento. Termine em estado relaxado.',
    materials: ['Músicas contrastantes', 'Colchonete', 'Script guiado', 'Ambiente confortável'],
    estimatedTime: '20-30 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Identificação de tensão',
      'Contraste tensão-relaxamento',
      'Sincronização com música',
      'Estado ao final',
      'Capacidade de aplicar sozinho'
    ],
    adaptations: [
      'Nível leve: Grupos musculares grandes, muito guiado',
      'Nível moderado: Grupos musculares menores, semi-guiado',
      'Nível severo: Discriminação fina, auto-guiado'
    ],
    theoreticalBasis: 'Relaxamento Muscular Progressivo de Jacobson adaptado com música, facilitando transições tensão-relaxamento através de contraste auditivo.',
    ageRange: '7-18 anos',
    tips: [
      'Use contrastes musicais fortes',
      'Faça em ambiente confortável',
      'Ensine versão curta para uso diário',
      'Aplique antes de dormir ou após estresse'
    ]
  },
  {
    id: 'tdah-mo-9',
    title: 'Yoga Musical para TDAH',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Controle Corporal',
    generalObjective: 'Desenvolver controle corporal, consciência postural e autorregulação através de yoga adaptada com música',
    specificObjectives: [
      'Executar posturas de yoga com apoio musical',
      'Manter posturas por períodos progressivos',
      'Integrar respiração com movimento e música',
      'Desenvolver consciência corporal'
    ],
    description: 'Sequência de yoga adaptada para TDAH: posturas mais curtas, transições mais frequentes, música como âncora. Use músicas que correspondem à energia de cada postura. Inclua posturas ativadoras e calmantes. Termine sempre com relaxamento.',
    materials: ['Colchonete', 'Playlist de yoga TDAH', 'Cartões de posturas', 'Ambiente tranquilo'],
    estimatedTime: '20-35 minutos',
    complexityLevel: 'moderado',
    evaluationCriteria: [
      'Execução de posturas',
      'Tempo de manutenção',
      'Integração respiração-movimento',
      'Estado ao final',
      'Engajamento mantido'
    ],
    adaptations: [
      'Nível leve: Posturas simples, manutenção curta, muito movimento',
      'Nível moderado: Posturas moderadas, manutenção média',
      'Nível severo: Posturas desafiantes, manutenção longa, sequência fluida'
    ],
    theoreticalBasis: 'Yoga adaptada para TDAH mantém engajamento através de variedade enquanto desenvolve controle corporal e autorregulação.',
    ageRange: '6-18 anos',
    tips: [
      'Não exija perfeição nas posturas',
      'Mantenha variedade para engajamento',
      'Use músicas que facilitem cada fase',
      'Inclua posturas divertidas e desafiantes'
    ]
  },
  {
    id: 'tdah-mo-10',
    title: 'Caminhada Rítmica Controlada',
    disorder: 'TDAH',
    demandCategory: 'motor',
    demandLabel: 'Controle Locomotor',
    generalObjective: 'Desenvolver controle locomotor através de caminhada sincronizada com diferentes ritmos',
    specificObjectives: [
      'Sincronizar passos com pulso musical',
      'Adaptar velocidade a diferentes ritmos',
      'Manter sincronização durante períodos',
      'Controlar impulso de acelerar ou parar'
    ],
    description: 'Caminhar em sincronia com diferentes ritmos musicais: lento, moderado, rápido. O desafio é adaptar-se ao ritmo externo, não ao impulso interno. Use metrônomo visual ou musical. Pratique mudanças de velocidade sem perder sincronização.',
    materials: ['Espaço para caminhar', 'Músicas de diferentes andamentos', 'Metrônomo visual', 'Fones (opcional)'],
    estimatedTime: '15-25 minutos',
    complexityLevel: 'leve',
    evaluationCriteria: [
      'Sincronização passo-pulso',
      'Adaptação a diferentes velocidades',
      'Manutenção de sincronização',
      'Controle de aceleração espontânea',
      'Fluência nas transições'
    ],
    adaptations: [
      'Nível leve: Ritmo único e confortável, muito apoio auditivo',
      'Nível moderado: Mudanças de ritmo, apoio moderado',
      'Nível severo: Mudanças frequentes, ritmos extremos (muito lento/rápido)'
    ],
    theoreticalBasis: 'Baseado em RAS (Rhythmic Auditory Stimulation), o ritmo externo pode organizar e regular output motor locomotor.',
    ageRange: '5-18 anos',
    tips: [
      'Comece com ritmo natural de caminhada',
      'Adicione extremos gradualmente',
      'Use metrônomo forte e claro',
      'Conecte com situações de andar muito rápido/lento'
    ]
  }
];
