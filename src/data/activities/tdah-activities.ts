import { ProfessionalActivity } from './types';

export const tdahActivities: ProfessionalActivity[] = [
  // ==================== ATENÇÃO (20 atividades) ====================
  {
    id: 2001,
    title: 'Caça ao Tesouro Sonoro',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver a capacidade de manter o foco atencional por períodos progressivamente maiores através de pistas auditivas sequenciais',
    specificObjectives: [
      'Seguir sequências de 5-10 pistas sonoras sem perder a ordem',
      'Manter engajamento por pelo menos 10 minutos contínuos',
      'Identificar corretamente 80% das pistas apresentadas',
      'Reduzir comportamentos de distração durante a atividade'
    ],
    description: 'Crie um mapa sonoro onde cada instrumento ou som representa uma pista para encontrar o "tesouro". O paciente deve seguir a sequência de sons na ordem correta, movendo-se pelo espaço ou apontando no mapa visual. Comece com 3 pistas e aumente progressivamente. Cada som tem um significado (sino = virar direita, tambor = andar reto, triângulo = virar esquerda). O "tesouro" pode ser um instrumento especial ou uma música favorita como recompensa.',
    materials: ['Instrumentos variados (sino, tambor, triângulo, chocalho)', 'Mapa visual do percurso', 'Objeto "tesouro"', 'Vendas (opcional)'],
    estimatedTime: '15-25 minutos',
    ageRange: '6-12 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Número de pistas seguidas corretamente em sequência',
      'Tempo de manutenção do foco sem distração',
      'Necessidade de repetições das pistas',
      'Nível de independência na execução',
      'Comportamentos de distração observados'
    ],
    adaptations: {
      level1: '3-4 pistas com apoio visual constante e pausas entre pistas',
      level2: '5-7 pistas com apoio visual parcial',
      level3: '8-10 pistas apenas auditivas, com distratores sonoros'
    },
    theoreticalBasis: 'Baseado no modelo de Barkley sobre déficit de inibição e sua relação com atenção sustentada. Utiliza reforçamento imediato para manter engajamento.',
    practicalTips: ['Use sons bem distintos entre si', 'Ofereça feedback imediato a cada pista correta', 'Reduza distratores ambientais no início']
  },
  {
    id: 2002,
    title: 'Maestro Atento',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção sustentada e dividida através do papel de maestro que precisa monitorar múltiplos instrumentos',
    specificObjectives: [
      'Manter controle visual sobre todos os músicos por períodos de 5+ minutos',
      'Identificar quando um instrumento está fora do tempo',
      'Dar comandos claros de mudança de dinâmica',
      'Alternar foco entre diferentes seções da orquestra'
    ],
    description: 'O paciente assume o papel de maestro de uma pequena orquestra. Deve usar gestos para indicar quando cada instrumento toca, controlar volume e tempo. Introduza erros propositais para o maestro identificar. Progrida de reger um instrumento por vez até múltiplos simultaneamente.',
    materials: ['Batuta ou bastão', 'Instrumentos variados', 'Cartões de comando visual', 'Metrônomo', 'Música gravada (opcional)'],
    estimatedTime: '20-30 minutos',
    ageRange: '7-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tempo de manutenção do papel de maestro',
      'Precisão na identificação de erros',
      'Clareza dos comandos gestuais',
      'Capacidade de dividir atenção entre músicos',
      'Nível de frustração tolerado'
    ],
    adaptations: {
      level1: 'Reger apenas 1-2 instrumentos com música simples',
      level2: 'Reger 3-4 instrumentos com mudanças de dinâmica',
      level3: 'Reger grupo completo com mudanças complexas e identificar erros'
    },
    theoreticalBasis: 'Fundamentado no conceito de funções executivas de Barkley, especificamente working memory e atenção dividida.',
    practicalTips: ['Comece com músicas conhecidas', 'Use reforço social imediato', 'Faça pausas estratégicas']
  },
  {
    id: 2003,
    title: 'Radar Sonoro',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção seletiva através da identificação de sons-alvo em meio a distratores auditivos',
    specificObjectives: [
      'Identificar som-alvo em 80% das apresentações',
      'Filtrar distratores sonoros progressivamente mais complexos',
      'Responder ao estímulo-alvo em tempo adequado',
      'Manter vigilância por períodos crescentes'
    ],
    description: 'Apresente uma paisagem sonora com múltiplos sons simultâneos. O paciente deve identificar apenas o som-alvo levantando a mão ou tocando um instrumento. Comece com fundo silencioso e adicione progressivamente ruído branco, conversas, música de fundo.',
    materials: ['Gravações de paisagens sonoras', 'Caixa de som', 'Instrumento-resposta para o paciente', 'Cronômetro', 'Registro de acertos'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Taxa de acertos (identificações corretas)',
      'Taxa de falsos positivos',
      'Tempo de reação ao som-alvo',
      'Tolerância a distratores',
      'Manutenção da atenção ao longo do tempo'
    ],
    adaptations: {
      level1: 'Som-alvo muito distinto, poucos distratores, apresentações frequentes',
      level2: 'Som-alvo moderadamente distinto, distratores médios',
      level3: 'Som-alvo sutil, muitos distratores, apresentações espaçadas'
    },
    theoreticalBasis: 'Baseado em paradigmas de atenção seletiva e vigilância da neuropsicologia cognitiva.',
    practicalTips: ['Comece com sessões curtas (3-5 minutos)', 'Ofereça feedback visual imediato', 'Use sons-alvo interessantes']
  },
  {
    id: 2004,
    title: 'Detetive dos Sons',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção a detalhes através da identificação de diferenças sutis entre melodias ou padrões rítmicos',
    specificObjectives: [
      'Identificar diferenças em 7 de cada 10 pares apresentados',
      'Especificar qual elemento mudou (nota, ritmo, instrumento)',
      'Aumentar tempo de escuta analítica',
      'Desenvolver vocabulário para descrever diferenças musicais'
    ],
    description: 'Apresente dois trechos musicais aparentemente idênticos. O paciente-detetive deve descobrir as diferenças. Comece com diferenças óbvias e evolua para sutis. Use lupa de brinquedo como objeto simbólico.',
    materials: ['Gravações pareadas com diferenças', 'Lupa de brinquedo', 'Ficha de detetive', 'Distintivo', 'Quadro de casos resolvidos'],
    estimatedTime: '15-25 minutos',
    ageRange: '7-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Porcentagem de diferenças identificadas',
      'Capacidade de especificar a diferença',
      'Número de escutas necessárias',
      'Persistência diante de dificuldade',
      'Estratégias de escuta utilizadas'
    ],
    adaptations: {
      level1: 'Diferenças muito óbvias (instrumento diferente, pausa longa)',
      level2: 'Diferenças médias (notas diferentes, ritmo alterado)',
      level3: 'Diferenças sutis (timbre, dinâmica, articulação)'
    },
    theoreticalBasis: 'Baseado na dificuldade de atenção a detalhes característica do TDAH, conforme critérios do DSM-5.',
    practicalTips: ['Permita escutar múltiplas vezes', 'Use histórias para contextualizar', 'Comemore cada caso resolvido']
  },
  {
    id: 2005,
    title: 'Foco no Ritmo',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver capacidade de manter padrão rítmico estável mesmo na presença de distratores',
    specificObjectives: [
      'Manter padrão rítmico por 2+ minutos sem erro',
      'Ignorar distratores auditivos mantendo o padrão',
      'Recuperar padrão rapidamente após distração',
      'Aumentar complexidade do padrão mantido'
    ],
    description: 'O paciente aprende um padrão rítmico simples e deve mantê-lo enquanto distratores são introduzidos progressivamente: outro ritmo tocando, perguntas verbais, estímulos visuais. Use metrônomo como âncora inicial.',
    materials: ['Instrumento de percussão', 'Metrônomo', 'Gravações de ritmos distratores', 'Cronômetro', 'Ficha de registro'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tempo total de manutenção do padrão',
      'Número de interrupções',
      'Velocidade de recuperação após perda',
      'Tolerância a distratores cada vez mais fortes',
      'Capacidade de manter padrões mais complexos'
    ],
    adaptations: {
      level1: 'Padrão simples (pulso), poucos distratores, metrônomo constante',
      level2: 'Padrão médio (2-3 elementos), distratores moderados',
      level3: 'Padrão complexo, múltiplos distratores simultâneos, sem metrônomo'
    },
    theoreticalBasis: 'Fundamentado na teoria de que o ritmo externo pode servir como organizador da atenção (RAS).',
    practicalTips: ['Comece com ritmos que o paciente goste', 'Introduza distratores gradualmente', 'Celebre cada recorde de tempo']
  },
  {
    id: 2006,
    title: 'Atenção Dividida Musical',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver capacidade de dividir atenção entre duas tarefas musicais simultâneas',
    specificObjectives: [
      'Executar duas tarefas simples simultaneamente',
      'Alternar foco entre tarefas sem perder desempenho',
      'Manter qualidade em ambas as tarefas',
      'Aumentar complexidade das tarefas combinadas'
    ],
    description: 'Combine duas tarefas musicais: tocar um ritmo enquanto canta, andar no pulso enquanto toca instrumento. Comece com tarefas muito simples e automatizadas, aumentando complexidade gradualmente.',
    materials: ['Instrumentos de percussão', 'Canções conhecidas', 'Espaço para movimento', 'Gravador para feedback'],
    estimatedTime: '20-25 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Qualidade de execução de cada tarefa isolada vs. combinada',
      'Tempo de manutenção da dupla tarefa',
      'Erros em cada componente',
      'Estratégias de gerenciamento utilizadas',
      'Frustração observada'
    ],
    adaptations: {
      level1: 'Uma tarefa muito simples + uma automática',
      level2: 'Duas tarefas de complexidade média',
      level3: 'Duas tarefas complexas com alternância de foco'
    },
    theoreticalBasis: 'Baseado no modelo de recursos atencionais limitados. O treino gradual pode melhorar essa habilidade.',
    practicalTips: ['Garanta domínio individual antes de combinar', 'Comece com combinações naturais', 'Use humor quando ocorrerem erros']
  },
  {
    id: 2007,
    title: 'Sequência Crescente',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Expandir span de memória de trabalho auditiva através de sequências sonoras progressivamente maiores',
    specificObjectives: [
      'Reproduzir sequências de 4-7 elementos',
      'Manter informação auditiva ativa por períodos crescentes',
      'Desenvolver estratégias de memorização',
      'Transferir habilidade para contextos cotidianos'
    ],
    description: 'Apresente sequências de sons que o paciente deve reproduzir. Comece com 2 elementos e adicione um a cada rodada bem-sucedida. Use o formato Simon musical. Introduza estratégias de chunking.',
    materials: ['Instrumentos variados ou teclado', 'Registro de spans', 'Cartões visuais de apoio (opcional)'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Span máximo atingido',
      'Consistência entre sessões',
      'Uso de estratégias de memorização',
      'Tolerância à frustração em caso de erro',
      'Generalização para outros contextos'
    ],
    adaptations: {
      level1: 'Sequências curtas (2-3), com apoio visual, ritmo lento',
      level2: 'Sequências médias (4-5), apoio visual parcial',
      level3: 'Sequências longas (6+), apenas auditivo, ritmo rápido'
    },
    theoreticalBasis: 'Déficit de memória de trabalho é central no modelo de Barkley para TDAH.',
    practicalTips: ['Ensine estratégias explicitamente', 'Celebre cada elemento adicional', 'Compare com recorde pessoal']
  },
  {
    id: 2008,
    title: 'Escuta Seletiva em Camadas',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver capacidade de focar em uma camada sonora específica em meio a múltiplas camadas',
    specificObjectives: [
      'Identificar melodia principal em arranjo com 3+ instrumentos',
      'Seguir linha de baixo ignorando outras vozes',
      'Alternar foco entre camadas quando solicitado',
      'Descrever o que cada camada está fazendo'
    ],
    description: 'Use músicas com arranjos claros. Peça ao paciente para focar em apenas um instrumento por vez. Aumente complexidade com mais instrumentos. Use equalizador para destacar camadas como apoio inicial.',
    materials: ['Músicas com arranjos multi-instrumentais', 'Equalizador ou software de áudio', 'Fones de ouvido', 'Ficha de registro'],
    estimatedTime: '20-30 minutos',
    ageRange: '10-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Precisão na descrição de cada camada',
      'Capacidade de alternar foco entre camadas',
      'Redução de confusão entre instrumentos',
      'Tempo de foco em cada camada',
      'Satisfação com a atividade'
    ],
    adaptations: {
      level1: 'Apenas 2 camadas muito distintas, destaque eletrônico do alvo',
      level2: '3-4 camadas, destaque parcial',
      level3: 'Múltiplas camadas, sem destaque, alternância rápida'
    },
    theoreticalBasis: 'Baseado em estudos de atenção auditiva seletiva que mostram déficits específicos no TDAH.',
    practicalTips: ['Use músicas que o paciente conhece', 'Comece com timbres muito diferentes', 'Faça pausas frequentes']
  },
  {
    id: 2009,
    title: 'Mapa Musical Navegável',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção sustentada através de navegação guiada por comandos sonoros em sequência',
    specificObjectives: [
      'Seguir 10+ comandos sonoros consecutivos',
      'Manter orientação espacial durante toda navegação',
      'Responder corretamente a 90% dos comandos',
      'Aumentar velocidade de resposta mantendo precisão'
    ],
    description: 'Crie um mapa no chão ou mesa com diferentes zonas. Cada som representa um comando de movimento. O paciente navega seguindo sequências de sons. Adicione obstáculos e coletáveis.',
    materials: ['Mapa grande no chão', 'Marcadores de zona', 'Instrumentos para comandos', 'Objetos coletáveis', 'Cronômetro'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-12 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Porcentagem de comandos seguidos corretamente',
      'Tempo total de navegação',
      'Número de vezes que perdeu orientação',
      'Capacidade de corrigir erros',
      'Engajamento durante a atividade'
    ],
    adaptations: {
      level1: 'Mapa simples, 4 direções, comandos lentos',
      level2: 'Mapa médio, 6 direções, comandos moderados',
      level3: 'Mapa complexo, múltiplas ações, comandos rápidos'
    },
    theoreticalBasis: 'Integração de atenção sustentada com orientação espacial e memória de trabalho.',
    practicalTips: ['Use mapas temáticos (piratas, espaço)', 'Adicione recompensas coletáveis', 'Permita movimento físico']
  },
  {
    id: 2010,
    title: 'Cronômetro Musical',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver senso de tempo e atenção temporal através de estimativas musicais',
    specificObjectives: [
      'Estimar duração de trechos musicais com precisão crescente',
      'Manter atenção em música por tempo pré-determinado',
      'Desenvolver senso interno de passagem do tempo',
      'Reduzir distorção temporal característica do TDAH'
    ],
    description: 'Ouça trechos musicais e estime quanto tempo durou. Compare estimativa com tempo real. Pratique manter atenção por tempos específicos usando música como marcador.',
    materials: ['Cronômetro', 'Músicas de diferentes durações', 'Gráfico de registro', 'Timer visual'],
    estimatedTime: '15-20 minutos',
    ageRange: '7-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão das estimativas temporais',
      'Redução de distorção temporal ao longo das sessões',
      'Capacidade de usar música como marcador de tempo',
      'Generalização para contextos não musicais',
      'Consciência metacognitiva sobre tempo'
    ],
    adaptations: {
      level1: 'Durações curtas (15-30s), feedback imediato',
      level2: 'Durações médias (1-2min), feedback parcial',
      level3: 'Durações longas (3-5min), auto-avaliação'
    },
    theoreticalBasis: 'Baseado na dificuldade de percepção temporal documentada no TDAH (Barkley, 1997).',
    practicalTips: ['Use músicas conhecidas inicialmente', 'Celebre aproximações', 'Relacione com atividades cotidianas']
  },
  {
    id: 2011,
    title: 'Vigilância Sonora Prolongada',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Aumentar capacidade de manter vigilância atencional por períodos prolongados',
    specificObjectives: [
      'Manter atenção vigilante por 10+ minutos',
      'Identificar estímulos-alvo raros em sequência longa',
      'Reduzir erros de omissão ao longo do tempo',
      'Desenvolver estratégias para manter alerta'
    ],
    description: 'Tarefa de vigilância musical onde o paciente ouve longa sequência de sons e deve responder apenas a combinações específicas. Comece com alvos frequentes e reduza progressivamente.',
    materials: ['Gravação de sequência sonora longa', 'Botão ou instrumento de resposta', 'Registro de acertos/erros', 'Timer'],
    estimatedTime: '15-25 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Taxa de acertos ao longo do tempo',
      'Curva de fadiga atencional',
      'Tempo de reação médio',
      'Erros de omissão vs. comissão',
      'Uso de estratégias de manutenção'
    ],
    adaptations: {
      level1: 'Sessões curtas (5min), alvos frequentes (30%)',
      level2: 'Sessões médias (10min), alvos moderados (20%)',
      level3: 'Sessões longas (15min), alvos raros (10%)'
    },
    theoreticalBasis: 'Paradigma de vigilância sustentada adaptado para contexto musical com maior engajamento.',
    practicalTips: ['Faça pausas se necessário', 'Use alvos interessantes', 'Monitore sinais de fadiga']
  },
  {
    id: 2012,
    title: 'Alternância de Foco Musical',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver flexibilidade atencional através de trocas rápidas de foco entre estímulos musicais',
    specificObjectives: [
      'Alternar foco entre dois estímulos em menos de 2 segundos',
      'Manter precisão durante alternância',
      'Aumentar velocidade de alternância',
      'Reduzir erros de perseveração'
    ],
    description: 'Dois estímulos musicais simultâneos. Sinal indica qual focar. Alternar rapidamente entre eles, respondendo a características específicas de cada um.',
    materials: ['Duas fontes sonoras separadas', 'Sinal de alternância', 'Registro de respostas', 'Fones de ouvido estéreo'],
    estimatedTime: '15-20 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Tempo de alternância entre focos',
      'Precisão de resposta em cada foco',
      'Erros de perseveração',
      'Capacidade de manter ritmo de alternância',
      'Frustração observada'
    ],
    adaptations: {
      level1: 'Alternância lenta (cada 10s), estímulos muito distintos',
      level2: 'Alternância média (cada 5s), estímulos moderados',
      level3: 'Alternância rápida (cada 2s), estímulos similares'
    },
    theoreticalBasis: 'Flexibilidade cognitiva e set-shifting, frequentemente deficitários no TDAH.',
    practicalTips: ['Comece com ritmo confortável', 'Use sinais claros de alternância', 'Não exija perfeição inicial']
  },
  {
    id: 2013,
    title: 'Contagem Musical Paralela',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção dividida através de contagem simultânea de elementos musicais',
    specificObjectives: [
      'Contar ocorrências de dois sons diferentes simultaneamente',
      'Manter contagens precisas por períodos crescentes',
      'Desenvolver estratégias de gerenciamento atencional',
      'Transferir habilidade para situações cotidianas'
    ],
    description: 'Ouça música e conte quantas vezes dois instrumentos diferentes aparecem. Comece contando um, depois adicione o segundo. Registre contagens e compare com gabarito.',
    materials: ['Músicas com instrumentos claros', 'Papel e lápis', 'Contadores manuais', 'Gravações com gabarito'],
    estimatedTime: '15-25 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Precisão das contagens',
      'Capacidade de manter duas contagens simultâneas',
      'Estratégias utilizadas',
      'Melhora ao longo das sessões',
      'Generalização para outras tarefas'
    ],
    adaptations: {
      level1: 'Contar apenas um instrumento',
      level2: 'Contar dois instrumentos muito distintos',
      level3: 'Contar dois instrumentos similares'
    },
    theoreticalBasis: 'Treino de atenção dividida baseado em paradigmas de dupla tarefa.',
    practicalTips: ['Ensine estratégia de dedos', 'Use instrumentos de preferência', 'Não puna erros']
  },
  {
    id: 2014,
    title: 'Atenção Antecipatória Musical',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção preparatória através de antecipação de eventos musicais',
    specificObjectives: [
      'Antecipar eventos musicais previsíveis',
      'Preparar resposta antes do evento',
      'Reduzir tempo de reação através de antecipação',
      'Desenvolver previsibilidade temporal'
    ],
    description: 'Use músicas com padrões previsíveis. O paciente deve antecipar quando eventos específicos ocorrerão e preparar resposta. Comece com padrões óbvios e aumente sutileza.',
    materials: ['Músicas com padrões claros', 'Instrumento de resposta', 'Timer visual', 'Registro de antecipações'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão das antecipações',
      'Redução de tempo de reação',
      'Capacidade de prever eventos sutis',
      'Preparação motora observável',
      'Generalização para outros contextos'
    ],
    adaptations: {
      level1: 'Padrões muito previsíveis, dica visual adicional',
      level2: 'Padrões moderados, sem dica visual',
      level3: 'Padrões sutis, variações inesperadas ocasionais'
    },
    theoreticalBasis: 'Déficit de antecipação temporal no TDAH e seu impacto no tempo de reação.',
    practicalTips: ['Use músicas favoritas', 'Celebre antecipações corretas', 'Adicione elemento motor']
  },
  {
    id: 2015,
    title: 'Filtro de Distratores Progressivo',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver resistência a distratores através de exposição gradual controlada',
    specificObjectives: [
      'Manter tarefa principal sob distração leve',
      'Tolerar distratores de intensidade crescente',
      'Desenvolver estratégias de filtragem',
      'Generalizar resistência para ambiente natural'
    ],
    description: 'Execute tarefa musical simples enquanto distratores são adicionados gradualmente: ruído, música competidora, estímulos visuais. Registre impacto de cada tipo de distrator.',
    materials: ['Instrumento para tarefa principal', 'Fontes de distração controladas', 'Escala de dificuldade', 'Registro de desempenho'],
    estimatedTime: '20-30 minutos',
    ageRange: '7-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Nível de distração tolerado',
      'Impacto no desempenho da tarefa principal',
      'Estratégias de filtragem utilizadas',
      'Recuperação após distração',
      'Generalização para vida diária'
    ],
    adaptations: {
      level1: 'Distratores leves, introdução muito gradual',
      level2: 'Distratores moderados, introdução gradual',
      level3: 'Distratores intensos, ambiente naturalístico'
    },
    theoreticalBasis: 'Dessensibilização sistemática aplicada a déficits de filtragem atencional.',
    practicalTips: ['Avance apenas quando estável', 'Use distratores relevantes para o paciente', 'Celebre cada nível superado']
  },
  {
    id: 2016,
    title: 'Monitoramento de Erros Musical',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver auto-monitoramento através da identificação de próprios erros musicais',
    specificObjectives: [
      'Identificar próprios erros durante execução',
      'Parar e corrigir erros identificados',
      'Reduzir erros através de monitoramento ativo',
      'Desenvolver metacognição sobre desempenho'
    ],
    description: 'Execute padrão musical conhecido. Pare quando perceber erro e indique. Use gravação para comparar percepção com realidade. Desenvolva checklist de monitoramento.',
    materials: ['Instrumento', 'Gravador', 'Checklist de erros', 'Espelho (opcional)', 'Cartões de auto-correção'],
    estimatedTime: '20-25 minutos',
    ageRange: '7-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Porcentagem de erros identificados',
      'Velocidade de identificação',
      'Capacidade de auto-correção',
      'Desenvolvimento de metacognição',
      'Generalização para outras atividades'
    ],
    adaptations: {
      level1: 'Erros óbvios, pausa após cada tentativa',
      level2: 'Erros moderados, monitoramento em tempo real',
      level3: 'Erros sutis, auto-avaliação sem pausa'
    },
    theoreticalBasis: 'Déficit de auto-monitoramento no TDAH e sua relação com funções executivas.',
    practicalTips: ['Não puna erros', 'Use gravação para feedback objetivo', 'Celebre identificação de erros']
  },
  {
    id: 2017,
    title: 'Atenção Sustentada com Movimento',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Utilizar movimento controlado como facilitador de atenção sustentada',
    specificObjectives: [
      'Manter atenção em tarefa auditiva enquanto se move',
      'Canalizar energia motora de forma produtiva',
      'Aumentar tempo de foco através de movimento',
      'Desenvolver consciência corpo-mente'
    ],
    description: 'Execute tarefa de atenção auditiva enquanto realiza movimento rítmico (andar, balançar). O movimento serve como regulador energético que facilita atenção. Compare desempenho com e sem movimento.',
    materials: ['Espaço para movimento', 'Música ou sequência sonora', 'Registro de desempenho', 'Opções de movimento (bola, almofada)'],
    estimatedTime: '20-25 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Comparação desempenho com/sem movimento',
      'Tipo de movimento mais efetivo',
      'Tempo de atenção sustentada',
      'Regulação energética observada',
      'Preferência do paciente'
    ],
    adaptations: {
      level1: 'Movimento livre, tarefa muito simples',
      level2: 'Movimento semi-estruturado, tarefa média',
      level3: 'Movimento estruturado sincronizado com tarefa'
    },
    theoreticalBasis: 'Pesquisas sobre benefícios do movimento para atenção no TDAH (fidgeting funcional).',
    practicalTips: ['Permita escolha de movimento', 'Não force imobilidade', 'Observe qual movimento funciona melhor']
  },
  {
    id: 2018,
    title: 'Busca Sonora Sistemática',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver estratégia de busca sistemática através de exploração sonora organizada',
    specificObjectives: [
      'Aplicar estratégia sistemática de busca',
      'Evitar busca aleatória e impulsiva',
      'Cobrir todo campo sonoro sem omissões',
      'Transferir estratégia para outras buscas'
    ],
    description: 'Sons escondidos no espaço ou em sequência. O paciente deve encontrar todos usando estratégia sistemática (esquerda-direita, início-fim). Discutir e treinar estratégias explicitamente.',
    materials: ['Múltiplas fontes sonoras', 'Mapa de busca', 'Checklist de estratégias', 'Cronômetro'],
    estimatedTime: '20-25 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Uso de estratégia sistemática',
      'Cobertura completa sem omissões',
      'Tempo de busca',
      'Redução de impulsividade na busca',
      'Verbalização de estratégia'
    ],
    adaptations: {
      level1: 'Poucos sons, estratégia dada explicitamente',
      level2: 'Mais sons, estratégia semi-guiada',
      level3: 'Muitos sons, estratégia auto-gerada'
    },
    theoreticalBasis: 'Déficit de estratégias organizacionais no TDAH e treino de compensação.',
    practicalTips: ['Modele estratégia explicitamente', 'Use mapa visual de apoio', 'Celebre uso de estratégia']
  },
  {
    id: 2019,
    title: 'Conexão de Padrões Sonoros',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção relacional através da identificação de conexões entre padrões sonoros',
    specificObjectives: [
      'Identificar padrões similares em diferentes contextos',
      'Conectar sons relacionados conceitualmente',
      'Desenvolver pensamento relacional auditivo',
      'Transferir padrões entre domínios'
    ],
    description: 'Apresente sons que têm algo em comum (todos são graves, todos têm ritmo similar, todos são de metal). O paciente deve identificar a conexão. Aumente abstração das conexões.',
    materials: ['Banco de sons categorizados', 'Cartões de categorias', 'Diagrama de conexões', 'Registro de insights'],
    estimatedTime: '20-25 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Identificação correta de conexões',
      'Velocidade de insight',
      'Capacidade de explicar conexão',
      'Criação de novas categorias',
      'Pensamento abstrato observado'
    ],
    adaptations: {
      level1: 'Conexões óbvias e concretas',
      level2: 'Conexões moderadamente abstratas',
      level3: 'Conexões abstratas e múltiplas'
    },
    theoreticalBasis: 'Treino de atenção a relações como base para raciocínio analógico.',
    practicalTips: ['Aceite conexões criativas', 'Comece com categorias familiares', 'Discuta diferentes perspectivas']
  },
  {
    id: 2020,
    title: 'Completar a Música',
    disorder: 'TDAH',
    demandCategory: 'attention',
    generalObjective: 'Desenvolver atenção preditiva através do preenchimento de partes faltantes em músicas',
    specificObjectives: [
      'Antecipar notas ou ritmos faltantes',
      'Manter representação mental de padrão completo',
      'Desenvolver previsão musical',
      'Fortalecer memória de trabalho auditiva'
    ],
    description: 'Músicas conhecidas com partes removidas. O paciente deve completar cantando, tocando ou verbalizando o que falta. Comece com finais de frases e progrida para partes do meio.',
    materials: ['Músicas editadas com partes removidas', 'Instrumento para completar', 'Gravador', 'Repertório conhecido do paciente'],
    estimatedTime: '15-25 minutos',
    ageRange: '5-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão do preenchimento',
      'Tempo de resposta',
      'Manutenção do pulso durante lacuna',
      'Capacidade de preencher partes maiores',
      'Generalização para músicas novas'
    ],
    adaptations: {
      level1: 'Finais de frases muito previsíveis',
      level2: 'Partes do meio de frases conhecidas',
      level3: 'Partes variadas de músicas menos familiares'
    },
    theoreticalBasis: 'Closure auditivo e sua relação com memória de trabalho e previsão.',
    practicalTips: ['Use músicas muito conhecidas', 'Comece com lacunas curtas', 'Celebre tentativas aproximadas']
  },
  
  // ==================== FUNÇÕES EXECUTIVAS (20 atividades) ====================
  {
    id: 2021,
    title: 'Compositor Organizador',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver habilidades de planejamento através da organização estrutural de composição musical',
    specificObjectives: [
      'Planejar estrutura musical antes de executar',
      'Organizar elementos em sequência lógica',
      'Manter plano durante execução',
      'Avaliar resultado em relação ao plano'
    ],
    description: 'O paciente planeja uma composição simples: decide quantas partes terá, quais instrumentos, que ordem. Escreve ou desenha plano antes de executar. Compara execução com plano original.',
    materials: ['Papel para planejamento', 'Símbolos musicais visuais', 'Instrumentos variados', 'Gravador', 'Template de estrutura'],
    estimatedTime: '30-40 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Qualidade do plano inicial',
      'Aderência ao plano durante execução',
      'Capacidade de ajustar plano se necessário',
      'Satisfação com produto final',
      'Verbalização do processo'
    ],
    adaptations: {
      level1: 'Estrutura dada, apenas escolher elementos',
      level2: 'Estrutura parcial, completar planejamento',
      level3: 'Planejamento completo independente'
    },
    theoreticalBasis: 'Déficit de planejamento no TDAH e uso de suportes externos para compensação.',
    practicalTips: ['Use templates visuais', 'Divida em passos pequenos', 'Não exija perfeição na execução']
  },
  {
    id: 2022,
    title: 'Maestro do Tempo',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver gerenciamento de tempo através de atividade musical com limites temporais',
    specificObjectives: [
      'Estimar tempo necessário para tarefas',
      'Monitorar passagem do tempo durante atividade',
      'Ajustar ritmo para cumprir prazo',
      'Desenvolver senso interno de tempo'
    ],
    description: 'Atividades musicais com tempo limitado. Antes de começar, estima quanto tempo levará. Timer visual mostra passagem do tempo. Ao final, compara estimativa com realidade. Ajusta estratégia.',
    materials: ['Timer visual', 'Tarefas musicais de duração variada', 'Registro de estimativas', 'Gráfico de progresso'],
    estimatedTime: '25-30 minutos',
    ageRange: '7-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão das estimativas temporais',
      'Monitoramento ativo do tempo',
      'Ajuste de ritmo quando necessário',
      'Redução de distorção temporal',
      'Generalização para tarefas escolares'
    ],
    adaptations: {
      level1: 'Tarefas curtas, timer muito visível, lembretes frequentes',
      level2: 'Tarefas médias, timer parcialmente visível',
      level3: 'Tarefas longas, timer oculto, auto-monitoramento'
    },
    theoreticalBasis: 'Time blindness no TDAH e estratégias de compensação com suporte externo.',
    practicalTips: ['Use timer visual sempre', 'Celebre estimativas aproximadas', 'Não puna atrasos']
  },
  {
    id: 2023,
    title: 'Banda Planejada',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver organização e delegação através do planejamento de performance em grupo',
    specificObjectives: [
      'Atribuir papéis apropriados para cada membro',
      'Organizar sequência de performance',
      'Coordenar múltiplos elementos simultaneamente',
      'Resolver problemas de organização'
    ],
    description: 'Planejar performance de banda imaginária ou real. Decidir quem toca o quê, quando cada um entra, como será o arranjo. Usar quadro visual para organização. Executar e avaliar.',
    materials: ['Quadro de planejamento', 'Cartões de instrumentos/funções', 'Linha do tempo visual', 'Instrumentos para execução'],
    estimatedTime: '35-45 minutos',
    ageRange: '8-15 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Qualidade do plano organizacional',
      'Clareza na atribuição de papéis',
      'Resolução de conflitos no planejamento',
      'Execução conforme planejado',
      'Ajustes necessários identificados'
    ],
    adaptations: {
      level1: 'Banda de 2 pessoas, estrutura dada',
      level2: 'Banda de 3-4, estrutura parcial',
      level3: 'Banda grande, planejamento completo'
    },
    theoreticalBasis: 'Funções executivas de planejamento e organização aplicadas a contexto social e criativo.',
    practicalTips: ['Use quadro visual', 'Comece com formações simples', 'Permita ajustes no plano']
  },
  {
    id: 2024,
    title: 'Memória de Trabalho Rítmica',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Fortalecer memória de trabalho através de manipulação mental de padrões rítmicos',
    specificObjectives: [
      'Manter padrão rítmico na mente',
      'Manipular padrão mentalmente (inverter, modificar)',
      'Reproduzir versão modificada',
      'Aumentar complexidade das manipulações'
    ],
    description: 'Ouça padrão rítmico e reproduza modificado: de trás para frente, dobrando tempo, mudando acentuação. Requer manter representação mental enquanto aplica transformação.',
    materials: ['Instrumento de percussão', 'Gravador', 'Cartões de transformação', 'Metrônomo'],
    estimatedTime: '20-30 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Precisão das reproduções modificadas',
      'Complexidade de padrões manipulados',
      'Velocidade de processamento',
      'Estratégias de manipulação utilizadas',
      'Transferência para outros domínios'
    ],
    adaptations: {
      level1: 'Padrões curtos (2-3 elementos), manipulação simples',
      level2: 'Padrões médios (4-5 elementos), manipulação moderada',
      level3: 'Padrões longos, manipulações complexas'
    },
    theoreticalBasis: 'Working memory como função executiva central e seu treino através de música.',
    practicalTips: ['Comece com transformações simples', 'Use apoio visual se necessário', 'Celebre aproximações']
  },
  {
    id: 2025,
    title: 'Flexibilidade Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver flexibilidade cognitiva através de mudanças de regras durante atividade musical',
    specificObjectives: [
      'Adaptar-se rapidamente a mudanças de regras',
      'Inibir resposta anterior quando regra muda',
      'Manter desempenho durante transições',
      'Reduzir erros de perseveração'
    ],
    description: 'Atividade musical com regras que mudam. Exemplo: quando terapeuta levanta mão direita, toque forte; esquerda, toque fraco. Inverta regras sem aviso. Aumente frequência de mudanças.',
    materials: ['Instrumentos', 'Cartões de regras', 'Sinalizadores de mudança', 'Registro de erros de perseveração'],
    estimatedTime: '20-25 minutos',
    ageRange: '6-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Velocidade de adaptação a novas regras',
      'Erros de perseveração',
      'Manutenção de desempenho sob mudança',
      'Frustração diante de mudanças',
      'Antecipação de possíveis mudanças'
    ],
    adaptations: {
      level1: 'Duas regras simples, mudanças avisadas',
      level2: 'Três regras, mudanças parcialmente avisadas',
      level3: 'Múltiplas regras, mudanças sem aviso'
    },
    theoreticalBasis: 'Inflexibilidade cognitiva no TDAH e treino de set-shifting.',
    practicalTips: ['Comece com mudanças avisadas', 'Use humor para erros', 'Celebre adaptações rápidas']
  },
  {
    id: 2026,
    title: 'Organizador de Instrumentos',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver habilidades de categorização e organização através de instrumentos musicais',
    specificObjectives: [
      'Categorizar instrumentos por diferentes critérios',
      'Organizar materiais de forma sistemática',
      'Criar e seguir sistema organizacional',
      'Generalizar habilidade para outros contextos'
    ],
    description: 'Organize coleção de instrumentos por diferentes critérios: tamanho, material, som, família. Crie sistema de organização, etiquete, arrume. Discuta transferência para organização de materiais escolares.',
    materials: ['Coleção variada de instrumentos', 'Etiquetas', 'Caixas organizadoras', 'Categorias visuais', 'Checklist'],
    estimatedTime: '25-35 minutos',
    ageRange: '6-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Capacidade de categorizar por diferentes critérios',
      'Consistência do sistema criado',
      'Manutenção da organização',
      'Criação de categorias próprias',
      'Transferência para vida diária'
    ],
    adaptations: {
      level1: 'Categorias dadas, poucos instrumentos',
      level2: 'Algumas categorias dadas, mais instrumentos',
      level3: 'Criar próprias categorias, muitos instrumentos'
    },
    theoreticalBasis: 'Déficits organizacionais no TDAH e estratégias compensatórias concretas.',
    practicalTips: ['Use categorias visuais claras', 'Fotografe resultado', 'Conecte com organização do quarto']
  },
  {
    id: 2027,
    title: 'Agenda Musical da Sessão',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver planejamento de curto prazo através de agenda visual da sessão',
    specificObjectives: [
      'Planejar sequência de atividades',
      'Estimar duração de cada atividade',
      'Seguir agenda planejada',
      'Fazer ajustes quando necessário'
    ],
    description: 'No início da sessão, paciente ajuda a planejar o que será feito, em que ordem, e quanto tempo para cada. Agenda visual é criada. Referir-se a ela durante sessão. Ao final, avaliar aderência.',
    materials: ['Quadro de agenda visual', 'Cartões de atividades', 'Timer', 'Marcadores de conclusão'],
    estimatedTime: '5 min planejamento + sessão + 5 min avaliação',
    ageRange: '6-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Participação no planejamento',
      'Realismo das estimativas',
      'Consulta à agenda durante sessão',
      'Flexibilidade quando necessário ajuste',
      'Auto-avaliação ao final'
    ],
    adaptations: {
      level1: 'Apenas escolher entre 2-3 atividades pré-selecionadas',
      level2: 'Ordenar atividades e estimar tempos',
      level3: 'Planejamento completo com alternativas'
    },
    theoreticalBasis: 'Externalização de funções executivas como compensação para déficits internos.',
    practicalTips: ['Use mesma agenda todas as sessões', 'Permita ajustes sem julgamento', 'Fotografe para referência']
  },
  {
    id: 2028,
    title: 'Resolução de Problemas Sonoros',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver resolução sistemática de problemas através de desafios musicais',
    specificObjectives: [
      'Identificar problema claramente',
      'Gerar múltiplas soluções possíveis',
      'Avaliar prós e contras de cada solução',
      'Implementar e avaliar solução escolhida'
    ],
    description: 'Presente problemas musicais: instrumento não soa bem, como fazer música feliz, como tocar sem acordar bebê. Use modelo de resolução de problemas: definir, gerar opções, escolher, testar, avaliar.',
    materials: ['Cartões de problema', 'Quadro de soluções', 'Instrumentos variados', 'Matriz de avaliação'],
    estimatedTime: '25-35 minutos',
    ageRange: '7-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Clareza na definição do problema',
      'Número de soluções geradas',
      'Qualidade da avaliação de opções',
      'Persistência na implementação',
      'Capacidade de ajustar abordagem'
    ],
    adaptations: {
      level1: 'Problema simples, opções dadas, escolher uma',
      level2: 'Problema médio, gerar opções com ajuda',
      level3: 'Problema complexo, processo independente'
    },
    theoreticalBasis: 'Déficit de resolução de problemas no TDAH por impulsividade e baixa geração de alternativas.',
    practicalTips: ['Use problemas divertidos', 'Modele processo de pensamento', 'Celebre qualquer solução tentada']
  },
  {
    id: 2029,
    title: 'Multitarefa Musical Gradual',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver gerenciamento de múltiplas demandas através de aumento gradual de complexidade',
    specificObjectives: [
      'Gerenciar duas tarefas simples simultaneamente',
      'Priorizar entre demandas competidoras',
      'Alternar eficientemente entre tarefas',
      'Manter qualidade sob pressão'
    ],
    description: 'Adicione demandas gradualmente: tocar ritmo + responder perguntas, cantar + tocar + andar. Comece com tarefas automatizadas, adicione uma nova. Discuta estratégias de gerenciamento.',
    materials: ['Instrumentos', 'Lista de tarefas graduadas', 'Cronômetro', 'Escala de desempenho'],
    estimatedTime: '25-30 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Número de tarefas gerenciadas simultaneamente',
      'Qualidade de cada tarefa',
      'Estratégias de priorização',
      'Recuperação após sobrecarga',
      'Autoconhecimento de limites'
    ],
    adaptations: {
      level1: 'Uma tarefa automatizada + uma muito simples',
      level2: 'Duas tarefas de complexidade média',
      level3: 'Múltiplas tarefas com demandas variáveis'
    },
    theoreticalBasis: 'Sobrecarga executiva no TDAH e treino de estratégias de gerenciamento.',
    practicalTips: ['Nunca sobrecarregue a ponto de frustração', 'Identifique limites individuais', 'Ensine a pedir pausa']
  },
  {
    id: 2030,
    title: 'Transição Planejada Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Facilitar transições através de rituais musicais e preparação antecipada',
    specificObjectives: [
      'Preparar-se para transições com antecedência',
      'Usar sinais musicais como facilitadores',
      'Reduzir resistência a transições',
      'Generalizar estratégias para vida diária'
    ],
    description: 'Crie músicas ou sinais sonoros para transições: música de guardar instrumentos, música de encerramento, contagem musical. Use consistentemente. Avise transições com antecedência usando música.',
    materials: ['Músicas de transição gravadas', 'Instrumentos para sinais', 'Timer musical', 'Sequência visual'],
    estimatedTime: 'Integrado em toda sessão',
    ageRange: '4-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Resposta às músicas de transição',
      'Redução de resistência',
      'Preparação antecipada',
      'Generalização para casa/escola',
      'Uso independente de estratégias'
    ],
    adaptations: {
      level1: 'Transições longas com muito aviso e apoio',
      level2: 'Transições moderadas com aviso musical',
      level3: 'Transições breves com sinal musical apenas'
    },
    theoreticalBasis: 'Dificuldade de transição no TDAH e uso de estrutura externa como compensação.',
    practicalTips: ['Seja consistente com músicas', 'Comece aviso cedo', 'Crie músicas com o paciente']
  },
  {
    id: 2031,
    title: 'Sequenciamento Musical Visual',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver sequenciamento através de organização visual de etapas musicais',
    specificObjectives: [
      'Ordenar etapas de tarefa em sequência correta',
      'Seguir sequência planejada',
      'Identificar etapas faltantes',
      'Criar sequências próprias'
    ],
    description: 'Use cartões visuais representando etapas de atividades musicais. Paciente ordena cartões antes de executar. Segue sequência visual durante atividade. Ao final, avalia se seguiu.',
    materials: ['Cartões de etapas visuais', 'Trilho de sequência', 'Marcador de progresso', 'Atividades músico-segmentadas'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Ordenação correta de etapas',
      'Aderência à sequência durante execução',
      'Identificação de etapas puladas',
      'Criação de sequências para novas tarefas',
      'Uso independente de suporte visual'
    ],
    adaptations: {
      level1: 'Sequências curtas (3-4 etapas) com muitas dicas',
      level2: 'Sequências médias (5-6 etapas) com dicas parciais',
      level3: 'Sequências longas, criação independente'
    },
    theoreticalBasis: 'Déficit de sequenciamento no TDAH e estratégias visuais de compensação.',
    practicalTips: ['Use fotos reais quando possível', 'Marque progresso visivelmente', 'Transfira para rotinas diárias']
  },
  {
    id: 2032,
    title: 'Controle de Impulso na Improvisação',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver controle inibitório durante improvisação musical com regras',
    specificObjectives: [
      'Seguir regras durante improvisação livre',
      'Inibir resposta quando regra exige',
      'Equilibrar criatividade com limites',
      'Autorregular intensidade e volume'
    ],
    description: 'Improvisação com restrições: não tocar nota X, parar quando terapeuta para, tocar só quando é sua vez. Requer equilibrar impulso criativo com regras. Aumente complexidade das regras.',
    materials: ['Instrumentos de fácil improvisação', 'Cartões de regras', 'Sinalizador de parada', 'Gravador'],
    estimatedTime: '20-25 minutos',
    ageRange: '6-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Aderência às regras',
      'Qualidade criativa mantida',
      'Tempo de parada após sinal',
      'Autocorreção após violação',
      'Equilíbrio expressão/controle'
    ],
    adaptations: {
      level1: 'Uma regra simples, sinais claros',
      level2: 'Duas regras, sinais moderados',
      level3: 'Múltiplas regras, sinais sutis'
    },
    theoreticalBasis: 'Déficit de inibição como núcleo do TDAH (Barkley) aplicado a contexto criativo.',
    practicalTips: ['Valorize criatividade tanto quanto controle', 'Não puna violações severamente', 'Celebre autocorreções']
  },
  {
    id: 2033,
    title: 'Meta-cognição Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver consciência metacognitiva através de reflexão sobre processo musical',
    specificObjectives: [
      'Refletir sobre próprio processo de aprendizagem',
      'Identificar pontos fortes e fracos',
      'Ajustar estratégias com base em reflexão',
      'Desenvolver autoconhecimento'
    ],
    description: 'Após atividades musicais, perguntar: O que foi fácil/difícil? Que estratégia usou? O que faria diferente? Criar diário musical de reflexões. Revisar padrões ao longo do tempo.',
    materials: ['Diário de reflexão', 'Perguntas guia', 'Escala visual de dificuldade', 'Gravações para revisão'],
    estimatedTime: '10-15 min por sessão',
    ageRange: '8-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Qualidade das reflexões',
      'Consciência de processos próprios',
      'Ajuste de estratégias baseado em reflexão',
      'Autoconhecimento demonstrado',
      'Aplicação de insights'
    ],
    adaptations: {
      level1: 'Perguntas fechadas, opções de resposta',
      level2: 'Perguntas semi-abertas, alguma elaboração',
      level3: 'Reflexão livre e elaborada'
    },
    theoreticalBasis: 'Déficit metacognitivo no TDAH e treino de auto-reflexão.',
    practicalTips: ['Faça perguntas específicas', 'Não julgue respostas', 'Celebre qualquer insight']
  },
  {
    id: 2034,
    title: 'Priorização de Tarefas Musicais',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver habilidade de priorização através de escolhas musicais com trade-offs',
    specificObjectives: [
      'Identificar tarefas mais importantes',
      'Fazer escolhas entre opções competidoras',
      'Justificar prioridades escolhidas',
      'Aceitar que nem tudo pode ser feito'
    ],
    description: 'Apresente mais atividades musicais do que tempo permite. Paciente deve priorizar o que fazer primeiro, o que pode esperar, o que não fará. Discuta critérios de priorização.',
    materials: ['Lista de atividades possíveis', 'Quadro de priorização', 'Timer', 'Critérios visuais'],
    estimatedTime: '20-30 minutos',
    ageRange: '8-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Capacidade de escolher prioridades',
      'Justificativa para escolhas',
      'Aceitação de limitações',
      'Efetividade das priorizações',
      'Transferência para vida diária'
    ],
    adaptations: {
      level1: 'Escolher 1 entre 2 opções',
      level2: 'Priorizar 3 entre 5 opções',
      level3: 'Priorizar lista longa com critérios complexos'
    },
    theoreticalBasis: 'Dificuldade de priorização no TDAH e treino de tomada de decisão.',
    practicalTips: ['Use situações reais do cotidiano', 'Discuta diferentes critérios', 'Não há resposta errada']
  },
  {
    id: 2035,
    title: 'Checklist Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver uso de checklists como ferramenta de organização através de contexto musical',
    specificObjectives: [
      'Criar checklists para atividades',
      'Usar checklist durante execução',
      'Verificar completude de tarefas',
      'Generalizar para tarefas escolares/domésticas'
    ],
    description: 'Antes de atividade musical, criar checklist do que precisa: preparar instrumentos, afinar, seguir partitura, guardar. Marcar cada item ao completar. Transferir para outras atividades.',
    materials: ['Templates de checklist', 'Canetas marcadoras', 'Quadro de verificação', 'Exemplos de checklists da vida real'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Criação de checklists funcionais',
      'Uso consistente durante atividade',
      'Verificação de todos os itens',
      'Criação espontânea de checklists',
      'Uso em outros contextos'
    ],
    adaptations: {
      level1: 'Checklist dada, apenas marcar',
      level2: 'Completar checklist parcial',
      level3: 'Criar checklist do zero'
    },
    theoreticalBasis: 'Externalização de memória prospectiva como compensação para déficits executivos.',
    practicalTips: ['Mantenha checklists visíveis', 'Comemore conclusão de lista', 'Conecte com lição de casa']
  },
  {
    id: 2036,
    title: 'Iniciação de Tarefas Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Facilitar iniciação de tarefas através de rituais musicais de arranque',
    specificObjectives: [
      'Reduzir procrastinação para iniciar',
      'Criar ritual de iniciação efetivo',
      'Começar tarefas sem estímulo externo',
      'Generalizar para tarefas escolares'
    ],
    description: 'Crie música ou ritual sonoro pessoal de iniciação. Quando tocar, é hora de começar. Pratique começar imediatamente após sinal. Transfira para alarmes e rituais de estudo.',
    materials: ['Instrumento para ritual', 'Gravação do ritual', 'Timer', 'Tarefas para praticar iniciação'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Tempo entre sinal e início da tarefa',
      'Uso consistente do ritual',
      'Redução de procrastinação',
      'Iniciação independente',
      'Transferência para outras situações'
    ],
    adaptations: {
      level1: 'Ritual com muito suporte e tarefa curta',
      level2: 'Ritual com suporte moderado',
      level3: 'Ritual internalizado, tarefas variadas'
    },
    theoreticalBasis: 'Déficit de iniciação no TDAH e uso de gatilhos externos.',
    practicalTips: ['Crie ritual junto com paciente', 'Mantenha consistência', 'Use para lição de casa']
  },
  {
    id: 2037,
    title: 'Monitoramento de Progresso Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver auto-monitoramento através de acompanhamento visual de progresso musical',
    specificObjectives: [
      'Registrar próprio progresso visualmente',
      'Identificar padrões de desempenho',
      'Ajustar esforço baseado em feedback',
      'Desenvolver motivação através de visualização'
    ],
    description: 'Crie gráficos de progresso para habilidades musicais: precisão rítmica, tempo de foco, músicas aprendidas. Atualizar a cada sessão. Discutir padrões e celebrar progresso.',
    materials: ['Gráficos de progresso', 'Adesivos/marcadores', 'Métricas definidas', 'Pasta de acompanhamento'],
    estimatedTime: '5-10 min por sessão',
    ageRange: '6-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Participação no registro',
      'Precisão do auto-registro',
      'Identificação de padrões',
      'Motivação gerada pela visualização',
      'Transferência para outras áreas'
    ],
    adaptations: {
      level1: 'Terapeuta registra, paciente observa',
      level2: 'Registro conjunto',
      level3: 'Auto-registro independente'
    },
    theoreticalBasis: 'Déficit de auto-monitoramento no TDAH e benefícios de feedback visual.',
    practicalTips: ['Use cores e visual atraente', 'Celebre qualquer progresso', 'Foque em esforço, não só resultado']
  },
  {
    id: 2038,
    title: 'Conclusão de Tarefas Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver persistência até conclusão através de atividades musicais com fechamento claro',
    specificObjectives: [
      'Completar atividades até o fim',
      'Resistir a abandonar antes da conclusão',
      'Reconhecer momento de término',
      'Celebrar conclusões adequadamente'
    ],
    description: 'Atividades com início, meio e fim claros. Música tem que terminar para contar como completa. Discutir sensação de conclusão. Criar ritual de fechamento. Registrar tarefas concluídas.',
    materials: ['Músicas com estrutura clara', 'Marcador de conclusão', 'Quadro de tarefas concluídas', 'Ritual de celebração'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-15 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Porcentagem de tarefas concluídas',
      'Resistência à distração próximo ao fim',
      'Reconhecimento do término',
      'Satisfação com conclusão',
      'Transferência para outras tarefas'
    ],
    adaptations: {
      level1: 'Tarefas muito curtas, feedback imediato',
      level2: 'Tarefas médias, checkpoints intermediários',
      level3: 'Tarefas longas, auto-monitoramento'
    },
    theoreticalBasis: 'Dificuldade de persistência e conclusão no TDAH.',
    practicalTips: ['Comece com tarefas curtas garantindo sucesso', 'Celebre conclusões', 'Use visual de progresso']
  },
  {
    id: 2039,
    title: 'Planejamento Reverso Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver planejamento reverso partindo do objetivo final para etapas iniciais',
    specificObjectives: [
      'Definir objetivo final claramente',
      'Identificar etapas necessárias de trás para frente',
      'Organizar etapas em sequência viável',
      'Executar plano e avaliar resultado'
    ],
    description: 'Comece com objetivo musical final (tocar música X). Pergunte: o que preciso saber antes? E antes disso? Construa caminho reverso até o ponto de partida. Execute plano.',
    materials: ['Quadro de planejamento reverso', 'Post-its', 'Linha do tempo invertida', 'Objetivos musicais claros'],
    estimatedTime: '25-35 minutos',
    ageRange: '9-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Clareza do objetivo definido',
      'Qualidade das etapas identificadas',
      'Sequenciamento lógico',
      'Execução conforme plano',
      'Ajustes necessários identificados'
    ],
    adaptations: {
      level1: 'Objetivo simples, etapas guiadas',
      level2: 'Objetivo médio, algumas etapas dadas',
      level3: 'Objetivo complexo, planejamento independente'
    },
    theoreticalBasis: 'Planejamento reverso como estratégia compensatória para déficits prospectivos.',
    practicalTips: ['Use visual de escada/caminho', 'Comece com objetivos motivadores', 'Celebre cada etapa']
  },
  {
    id: 2040,
    title: 'Gerenciamento de Materiais Musical',
    disorder: 'TDAH',
    demandCategory: 'executive_functions',
    generalObjective: 'Desenvolver organização de materiais através de rotina de cuidado com instrumentos',
    specificObjectives: [
      'Manter instrumentos organizados e em bom estado',
      'Desenvolver rotina de organização',
      'Encontrar materiais quando necessário',
      'Generalizar para materiais escolares'
    ],
    description: 'Crie sistema de organização para instrumentos da sessão: lugar para cada coisa, rotina de guardar, checklist de verificação. Pratique consistentemente. Transfira para mochila escolar.',
    materials: ['Instrumentos com lugares definidos', 'Etiquetas', 'Fotos de organização correta', 'Checklist de materiais'],
    estimatedTime: '15-20 minutos iniciais + rotina',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Manutenção da organização ao longo do tempo',
      'Encontrar materiais rapidamente',
      'Guardar materiais corretamente',
      'Criação de sistemas próprios',
      'Transferência para vida diária'
    ],
    adaptations: {
      level1: 'Poucos materiais, sistema dado',
      level2: 'Mais materiais, sistema co-criado',
      level3: 'Muitos materiais, sistema criado pelo paciente'
    },
    theoreticalBasis: 'Déficits organizacionais no TDAH e externalização de sistemas.',
    practicalTips: ['Use fotos de referência', 'Mantenha sistema simples', 'Conecte com organização da mochila']
  },
  
  // ==================== CONTROLE INIBITÓRIO (15 atividades) ====================
  {
    id: 2041,
    title: 'Estátua Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle inibitório motor através de paradas abruptas quando a música para',
    specificObjectives: [
      'Parar movimento imediatamente quando música para',
      'Manter imobilidade por períodos crescentes',
      'Reduzir tempo de reação para parada',
      'Controlar impulso de movimento'
    ],
    description: 'Dança ou movimento livre enquanto música toca. Quando para, congelar imediatamente como estátua. Manter posição por tempo determinado. Aumentar imprevisibilidade e duração.',
    materials: ['Música animada', 'Controle de pausa', 'Timer', 'Espaço para movimento'],
    estimatedTime: '15-20 minutos',
    ageRange: '4-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Tempo de reação para parada',
      'Duração da imobilidade mantida',
      'Qualidade da parada (completa vs parcial)',
      'Melhora ao longo da sessão',
      'Diversão e engajamento'
    ],
    adaptations: {
      level1: 'Pausas previsíveis, imobilidade curta (3s)',
      level2: 'Pausas semi-previsíveis, imobilidade média (5-7s)',
      level3: 'Pausas imprevisíveis, imobilidade longa (10s+)'
    },
    theoreticalBasis: 'Déficit de inibição motora no TDAH e treino através de jogos estruturados.',
    practicalTips: ['Use músicas preferidas', 'Participe junto', 'Celebre cada estátua bem feita']
  },
  {
    id: 2042,
    title: 'Semáforo Sonoro',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle de impulso através de sistema de sinais sonoros graduados',
    specificObjectives: [
      'Responder apropriadamente a cada sinal',
      'Modular intensidade de ação conforme sinal',
      'Inibir ação quando sinal vermelho',
      'Transferir sistema para autorregulação'
    ],
    description: 'Sons diferentes representam verde (ação livre), amarelo (diminuir/preparar parada), vermelho (parar). Pratique respostas a cada sinal. Aumente velocidade de transições. Internalize sistema para auto-uso.',
    materials: ['Instrumentos para sinais (diferentes timbres)', 'Cartões visuais de cores', 'Espaço para ação', 'Gravação de sinais'],
    estimatedTime: '15-25 minutos',
    ageRange: '4-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Precisão de resposta a cada cor',
      'Modulação adequada no amarelo',
      'Parada completa no vermelho',
      'Velocidade de resposta',
      'Internalização do sistema'
    ],
    adaptations: {
      level1: 'Apenas verde e vermelho, sinais longos',
      level2: 'Três cores, sinais moderados',
      level3: 'Transições rápidas, sinais sutis'
    },
    theoreticalBasis: 'Modelo de semáforo como apoio visual-auditivo para inibição de resposta.',
    practicalTips: ['Use em transições da sessão', 'Transfira para casa', 'Crie versão portátil']
  },
  {
    id: 2043,
    title: 'Não Vale Esse Som',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver inibição seletiva através de não-resposta a estímulo específico',
    specificObjectives: [
      'Inibir resposta a estímulo proibido',
      'Manter resposta a outros estímulos',
      'Reduzir erros de comissão',
      'Aumentar tolerância a tentação'
    ],
    description: 'Jogo tipo Go/No-Go musical. Bater palma para todos os sons EXCETO um específico. Aumentar semelhança entre sons permitidos e proibido. Variar frequência do som proibido.',
    materials: ['Instrumentos variados', 'Gravações de sons', 'Registro de erros', 'Cronômetro'],
    estimatedTime: '15-20 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Taxa de erros de comissão (responder ao proibido)',
      'Taxa de erros de omissão (não responder ao permitido)',
      'Consistência ao longo do tempo',
      'Resposta a sons similares ao proibido',
      'Auto-correção após erro'
    ],
    adaptations: {
      level1: 'Som proibido muito distinto, frequência baixa',
      level2: 'Som proibido moderadamente distinto',
      level3: 'Som proibido similar aos permitidos, frequência alta'
    },
    theoreticalBasis: 'Paradigma Go/No-Go como medida e treino de controle inibitório.',
    practicalTips: ['Comece devagar', 'Use som proibido interessante', 'Não puna erros, discuta-os']
  },
  {
    id: 2044,
    title: 'Espera Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver capacidade de espera através de adiamento de resposta reforçada',
    specificObjectives: [
      'Aguardar tempo crescente antes de responder',
      'Tolerar adiamento de reforço',
      'Usar estratégias durante espera',
      'Reduzir impulsividade de resposta'
    ],
    description: 'Instrumento preferido disponível, mas deve esperar sinal (contagem musical, melodia completa) para tocar. Aumentar tempo de espera gradualmente. Ensinar estratégias para aguardar.',
    materials: ['Instrumento motivador', 'Timer visual/musical', 'Registro de tempos', 'Estratégias visuais de espera'],
    estimatedTime: '15-25 minutos',
    ageRange: '4-12 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Tempo máximo de espera tolerado',
      'Uso de estratégias durante espera',
      'Redução de tentativas de antecipar',
      'Melhora ao longo das sessões',
      'Generalização para outras situações'
    ],
    adaptations: {
      level1: 'Espera de 3-5 segundos com apoio',
      level2: 'Espera de 10-15 segundos',
      level3: 'Espera de 30+ segundos com distratores'
    },
    theoreticalBasis: 'Treino de adiamento de gratificação, frequentemente deficitário no TDAH.',
    practicalTips: ['Comece com esperas muito curtas', 'Ensine o que fazer enquanto espera', 'Sempre honre promessa de acesso']
  },
  {
    id: 2045,
    title: 'Contagem Regressiva Rítmica',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle inibitório através de preparação para ação com contagem',
    specificObjectives: [
      'Aguardar toda contagem antes de agir',
      'Usar contagem como regulador interno',
      'Reduzir antecipações impulsivas',
      'Internalizar estratégia de contagem'
    ],
    description: 'Antes de qualquer ação musical, fazer contagem rítmica (1-2-3-4-VAI). Deve esperar o VAI para agir. Aumentar duração da contagem. Transferir para outras situações de impulso.',
    materials: ['Metrônomo', 'Instrumentos', 'Contagem visual', 'Registro de antecipações'],
    estimatedTime: '15-20 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Completar contagem sem antecipar',
      'Precisão do timing do VAI',
      'Uso espontâneo de contagem',
      'Redução de impulsividade',
      'Internalização da estratégia'
    ],
    adaptations: {
      level1: 'Contagem curta (3), voz alta',
      level2: 'Contagem média (5), voz normal',
      level3: 'Contagem longa (8), mentalização'
    },
    theoreticalBasis: 'Estratégias de autocontrole baseadas em pausa reflexiva.',
    practicalTips: ['Use em toda transição', 'Faça junto inicialmente', 'Crie contagem pessoal do paciente']
  },
  {
    id: 2046,
    title: 'Pare e Pense Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver pausa reflexiva antes de ações através de protocolo musical',
    specificObjectives: [
      'Parar antes de agir impulsivamente',
      'Pensar nas opções disponíveis',
      'Escolher melhor opção conscientemente',
      'Agir de forma planejada'
    ],
    description: 'Quando sinal toca (sino especial), pausar atividade. Durante pausa, pensar: O que estou fazendo? O que devo fazer? Qual melhor escolha? Depois agir. Usar para decisões musicais e comportamentais.',
    materials: ['Sino de pausa', 'Cartões de perguntas', 'Quadro de opções', 'Registro de uso'],
    estimatedTime: '15-25 minutos',
    ageRange: '6-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Resposta ao sinal de pausa',
      'Qualidade da reflexão',
      'Melhoria nas escolhas',
      'Uso espontâneo da estratégia',
      'Generalização para vida diária'
    ],
    adaptations: {
      level1: 'Terapeuta guia todas as perguntas',
      level2: 'Cartões visuais de apoio, semi-independente',
      level3: 'Reflexão independente internalizada'
    },
    theoreticalBasis: 'Treino de parada-reflexão-ação como compensação para impulsividade.',
    practicalTips: ['Use sino distintivo', 'Comece em momentos sem pressão', 'Pratique com dilemas musicais simples']
  },
  {
    id: 2047,
    title: 'Controle de Volume Gradual',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver modulação de intensidade através de controle fino de volume',
    specificObjectives: [
      'Tocar em intensidades específicas solicitadas',
      'Fazer transições graduais de volume',
      'Manter volume estável quando pedido',
      'Inibir explosões de intensidade'
    ],
    description: 'Escala visual de volume (1-10). Tocar instrumento no nível indicado. Fazer transições suaves entre níveis. Manter nível específico por tempo determinado. Evitar picos não solicitados.',
    materials: ['Escala visual de volume', 'Instrumentos de fácil modulação', 'Medidor de volume (app)', 'Registro de consistência'],
    estimatedTime: '15-20 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão do volume solicitado',
      'Suavidade das transições',
      'Estabilidade quando mantendo nível',
      'Controle de picos impulsivos',
      'Auto-monitoramento de volume'
    ],
    adaptations: {
      level1: 'Apenas 3 níveis (baixo, médio, alto)',
      level2: '5 níveis com transições',
      level3: '10 níveis com modulação fina'
    },
    theoreticalBasis: 'Treino de modulação como generalização de controle inibitório.',
    practicalTips: ['Use visual claro de níveis', 'Evite instrumentos difíceis de modular', 'Relacione com volume de voz']
  },
  {
    id: 2048,
    title: 'Turno Silencioso',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver inibição de resposta durante espera de vez em atividade social',
    specificObjectives: [
      'Aguardar silenciosamente sua vez',
      'Manter atenção no turno do outro',
      'Não interromper ou antecipar',
      'Entrar no momento exato de sua vez'
    ],
    description: 'Atividade musical em turnos. Durante vez do outro, deve permanecer silencioso e atento. Marcar turno com bastão visual. Aumentar duração do turno do outro. Discutir dificuldades.',
    materials: ['Bastão de turno', 'Timer visual', 'Instrumentos para cada pessoa', 'Registro de antecipações'],
    estimatedTime: '20-25 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Manutenção do silêncio durante turno do outro',
      'Qualidade da atenção ao turno do outro',
      'Entrada no momento correto',
      'Redução de interrupções',
      'Transferência para conversas'
    ],
    adaptations: {
      level1: 'Turnos muito curtos (5s), bastão visível',
      level2: 'Turnos médios (15s), visual parcial',
      level3: 'Turnos longos (30s+), transição natural'
    },
    theoreticalBasis: 'Inibição social e sua relação com controle de impulso verbal.',
    practicalTips: ['Modele atenção durante turno do outro', 'Celebre entradas bem cronometradas', 'Discuta paralelos com conversas']
  },
  {
    id: 2049,
    title: 'Impulso Canalizado',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Redirecionar impulsos motores para expressão musical controlada',
    specificObjectives: [
      'Reconhecer impulso motor crescente',
      'Canalizar energia para instrumento',
      'Expressar impulso de forma socialmente aceitável',
      'Desenvolver autoconsciência de estados energéticos'
    ],
    description: 'Identificar quando energia está subindo. Em vez de comportamento desorganizado, canalizar para bateria, tambor ou movimento rítmico estruturado. Criar ritual de descarga energética.',
    materials: ['Tambores ou bateria', 'Espaço para movimento', 'Escala de energia visual', 'Rituais de descarga definidos'],
    estimatedTime: '15-25 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Reconhecimento de estados de alta energia',
      'Uso apropriado de canais de descarga',
      'Redução de comportamentos desorganizados',
      'Iniciativa de uso das estratégias',
      'Autorregulação melhorada'
    ],
    adaptations: {
      level1: 'Terapeuta identifica e oferece instrumento',
      level2: 'Paciente identifica com ajuda',
      level3: 'Identificação e canalização independentes'
    },
    theoreticalBasis: 'Sublimação de impulsos e uso de movimento como regulação.',
    practicalTips: ['Tenha sempre instrumento de descarga disponível', 'Valide necessidade de movimento', 'Crie ritual pessoal']
  },
  {
    id: 2050,
    title: 'Câmera Lenta Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle motor fino através de execução em velocidade muito reduzida',
    specificObjectives: [
      'Executar movimentos em câmera lenta',
      'Manter precisão durante desaceleração',
      'Controlar impulso de acelerar',
      'Transferir controle para ações cotidianas'
    ],
    description: 'Execute movimentos musicais (tocar instrumento, dançar) em velocidade muito lenta. Use música lenta como guia. Mantenha qualidade apesar da lentidão. Discuta impulso de acelerar.',
    materials: ['Músicas em diferentes velocidades', 'Metrônomo lento', 'Espelho', 'Gravador para review'],
    estimatedTime: '15-20 minutos',
    ageRange: '5-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Manutenção de velocidade lenta',
      'Qualidade do movimento desacelerado',
      'Controle de impulso de acelerar',
      'Progressão para velocidades cada vez mais lentas',
      'Transferência para ações cotidianas'
    ],
    adaptations: {
      level1: 'Velocidade moderadamente lenta',
      level2: 'Velocidade bem lenta',
      level3: 'Velocidade muito lenta com precisão'
    },
    theoreticalBasis: 'Treino de inibição motora através de controle de velocidade.',
    practicalTips: ['Faça junto', 'Use música como guia de velocidade', 'Comece apenas um pouco mais lento']
  },
  {
    id: 2051,
    title: 'Palavra Proibida Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver inibição verbal através de jogo musical com palavras proibidas',
    specificObjectives: [
      'Cantar evitando palavra específica',
      'Substituir palavra proibida por outra',
      'Manter fluxo da canção apesar da inibição',
      'Generalizar controle verbal'
    ],
    description: 'Cante música conhecida, mas uma palavra é proibida (ex: nunca dizer cores). Deve substituir por hum ou outra palavra. Aumente número de palavras proibidas. Discuta dificuldade.',
    materials: ['Músicas conhecidas', 'Lista de palavras proibidas', 'Sinalizador de erro', 'Registro de desempenho'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-15 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Taxa de evitação da palavra proibida',
      'Qualidade das substituições',
      'Manutenção do fluxo da música',
      'Melhora com prática',
      'Generalização para contexto verbal'
    ],
    adaptations: {
      level1: 'Uma palavra óbvia e fácil de antecipar',
      level2: 'Duas palavras de categorias diferentes',
      level3: 'Múltiplas palavras, categoria inteira'
    },
    theoreticalBasis: 'Treino de inibição de resposta verbal pré-potente.',
    practicalTips: ['Comece com músicas muito conhecidas', 'Use palavras frequentes mas não essenciais', 'Ria junto dos erros']
  },
  {
    id: 2052,
    title: 'Resposta Incompatível Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver inibição através de resposta oposta à tendência natural',
    specificObjectives: [
      'Executar resposta contrária ao impulso',
      'Inibir resposta prepotente',
      'Manter regra inversa ativa',
      'Reduzir erros com prática'
    ],
    description: 'Quando ouvir som agudo, fazer movimento de agachar (não de subir). Quando som forte, tocar fraco. Resposta sempre contrária à tendência natural. Aumentar complexidade das inversões.',
    materials: ['Instrumentos variados', 'Cartões de regras inversas', 'Registro de erros', 'Espaço para movimento'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-15 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Taxa de respostas corretas (inversas)',
      'Tempo de reação',
      'Manutenção da regra ao longo do tempo',
      'Redução de erros automáticos',
      'Generalização do controle'
    ],
    adaptations: {
      level1: 'Uma inversão simples, ritmo lento',
      level2: 'Duas inversões, ritmo moderado',
      level3: 'Múltiplas inversões, ritmo rápido'
    },
    theoreticalBasis: 'Paradigma de resposta incompatível para treino de inibição.',
    practicalTips: ['Pratique regra normal antes de inverter', 'Dê tempo para processar', 'Use humor para erros']
  },
  {
    id: 2053,
    title: 'Inibição de Eco',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver controle sobre resposta automática de imitação',
    specificObjectives: [
      'Ouvir sem imitar automaticamente',
      'Processar antes de responder',
      'Responder de forma diferente ao modelo',
      'Reduzir impulsividade de eco'
    ],
    description: 'Terapeuta toca padrão. Paciente deve esperar, processar e tocar algo DIFERENTE (não eco). Aumentar tentação de eco com padrões interessantes ou repetitivos.',
    materials: ['Instrumentos', 'Timer de espera', 'Registro de ecos involuntários', 'Padrões progressivamente tentadores'],
    estimatedTime: '15-20 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Frequência de ecos involuntários',
      'Qualidade de respostas diferentes',
      'Tempo de processamento adequado',
      'Redução de ecos ao longo da sessão',
      'Criatividade nas respostas'
    ],
    adaptations: {
      level1: 'Padrões simples, tempo longo de processamento',
      level2: 'Padrões médios, tempo moderado',
      level3: 'Padrões tentadores, resposta rápida diferente'
    },
    theoreticalBasis: 'Inibição de resposta imitativa automática como treino de controle.',
    practicalTips: ['Valorize respostas criativas', 'Não puna ecos, apenas note', 'Use como jogo divertido']
  },
  {
    id: 2054,
    title: 'Congelamento Seletivo',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver inibição parcial através de congelamento de partes específicas do corpo',
    specificObjectives: [
      'Congelar parte específica enquanto resto move',
      'Seguir instruções de congelamento seletivo',
      'Manter inibição parcial por tempo determinado',
      'Aumentar precisão do controle corporal'
    ],
    description: 'Dance, mas quando sinal, congele apenas parte específica (mãos, pés, cabeça). Resto continua. Aumentar dificuldade com partes menores ou múltiplas. Combinar com música.',
    materials: ['Música dançante', 'Cartões de partes do corpo', 'Sinalizador', 'Espaço para movimento'],
    estimatedTime: '15-25 minutos',
    ageRange: '5-12 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão do congelamento seletivo',
      'Manutenção do movimento no resto',
      'Tempo de resposta',
      'Duração do congelamento mantido',
      'Divertimento e engajamento'
    ],
    adaptations: {
      level1: 'Partes grandes (pernas, braços), tempo curto',
      level2: 'Partes médias, tempo moderado',
      level3: 'Partes pequenas, tempo longo, múltiplas'
    },
    theoreticalBasis: 'Inibição motora seletiva como forma avançada de controle.',
    practicalTips: ['Comece com partes fáceis de isolar', 'Use visual de apoio', 'Faça junto demonstrando']
  },
  {
    id: 2055,
    title: 'Resistência à Tentação Musical',
    disorder: 'TDAH',
    demandCategory: 'behavior',
    generalObjective: 'Desenvolver resistência a impulsos através de exposição gradual a tentações',
    specificObjectives: [
      'Resistir a tocar instrumento tentador',
      'Manter foco em tarefa designada',
      'Usar estratégias de autorregulação',
      'Aumentar tolerância a frustração'
    ],
    description: 'Instrumento muito desejado visível mas proibido temporariamente. Complete outra tarefa antes de acessar. Aumente tempo de espera e proximidade do objeto tentador.',
    materials: ['Instrumento altamente preferido', 'Tarefa intermediária', 'Timer', 'Estratégias visuais de resistência'],
    estimatedTime: '20-25 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tempo de resistência antes de ceder',
      'Conclusão da tarefa intermediária',
      'Uso de estratégias de resistência',
      'Melhora ao longo das sessões',
      'Generalização para outras situações'
    ],
    adaptations: {
      level1: 'Objeto distante, espera curta, tarefa fácil',
      level2: 'Objeto próximo, espera média, tarefa moderada',
      level3: 'Objeto à mão, espera longa, tarefa exigente'
    },
    theoreticalBasis: 'Treino de adiamento de gratificação em contexto motivador.',
    practicalTips: ['Sempre permita acesso após completar', 'Ensine estratégias de desvio de atenção', 'Celebre cada resistência bem-sucedida']
  },
  
  // ==================== AUTORREGULAÇÃO (15 atividades) ====================
  {
    id: 2056,
    title: 'Termômetro Emocional Musical',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver consciência de estados emocionais através de associação com música',
    specificObjectives: [
      'Identificar próprio nível de energia/emoção',
      'Expressar estado através de escolha musical',
      'Monitorar mudanças de estado',
      'Comunicar estados de forma aceitável'
    ],
    description: 'Termômetro visual com níveis de energia/emoção. Em cada nível, músicas associadas. Paciente identifica onde está e escolhe música correspondente. Monitorar ao longo da sessão.',
    materials: ['Termômetro visual grande', 'Playlist por nível', 'Marcador móvel', 'Registro de estados'],
    estimatedTime: '10-15 min por sessão (integrado)',
    ageRange: '5-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Precisão na identificação do estado',
      'Uso consistente do termômetro',
      'Comunicação de estados',
      'Consciência de mudanças',
      'Generalização para vida diária'
    ],
    adaptations: {
      level1: 'Apenas 3 níveis (baixo, médio, alto)',
      level2: '5 níveis com nuances',
      level3: 'Escala contínua com descrições'
    },
    theoreticalBasis: 'Consciência interoceptiva como base para regulação emocional.',
    practicalTips: ['Use em início e fim de cada sessão', 'Crie versão portátil', 'Não julgue estados, apenas observe']
  },
  {
    id: 2057,
    title: 'Música para Acalmar',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver estratégias de redução de ativação através de música calmante personalizada',
    specificObjectives: [
      'Identificar quando está superativado',
      'Escolher música apropriada para acalmar',
      'Usar música ativamente para reduzir ativação',
      'Criar playlist pessoal de calma'
    ],
    description: 'Explore diferentes músicas e seu efeito calmante. Identifique quais funcionam para este paciente específico. Crie playlist personalizada. Pratique uso quando ativação está alta.',
    materials: ['Biblioteca musical variada', 'Escala de ativação', 'Fones de ouvido', 'Espaço confortável', 'Registro de eficácia'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identificação de músicas efetivas',
      'Uso apropriado quando superativado',
      'Redução mensurável de ativação',
      'Criação de repertório pessoal',
      'Uso espontâneo em casa/escola'
    ],
    adaptations: {
      level1: 'Terapeuta oferece opções, paciente escolhe',
      level2: 'Paciente explora biblioteca com guia',
      level3: 'Paciente busca e cria próprio repertório'
    },
    theoreticalBasis: 'Uso de música como ferramenta de regulação autonômica e emocional.',
    practicalTips: ['Músicas efetivas são individuais', 'Teste em momentos calmos primeiro', 'Crie playlist acessível sempre']
  },
  {
    id: 2058,
    title: 'Música para Energizar',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver ativação controlada para momentos de baixa energia ou foco',
    specificObjectives: [
      'Identificar estados de baixa energia',
      'Usar música para aumentar ativação de forma controlada',
      'Encontrar nível ótimo de ativação',
      'Evitar superativação'
    ],
    description: 'Para momentos de apatia, sonolência ou desmotivação. Encontre músicas que aumentem energia sem superativar. Pratique regulação ascendente controlada. Crie playlist de ativação.',
    materials: ['Músicas de diferentes níveis de energia', 'Escala de ativação', 'Timer', 'Registro de efeitos'],
    estimatedTime: '20-30 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identificação de músicas ativadoras efetivas',
      'Controle do nível de ativação',
      'Evitação de superativação',
      'Uso apropriado para tarefas',
      'Transferência para estudo/trabalho'
    ],
    adaptations: {
      level1: 'Ativação leve com supervisão',
      level2: 'Ativação moderada semi-independente',
      level3: 'Ativação flexível auto-gerenciada'
    },
    theoreticalBasis: 'Modelo de ativação ótima e uso de música para regulação energética.',
    practicalTips: ['Cuidado com superativação', 'Teste antes de momentos importantes', 'Observe efeito individual']
  },
  {
    id: 2059,
    title: 'Respiração Rítmica Musical',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver regulação fisiológica através de sincronização respiratória com música',
    specificObjectives: [
      'Sincronizar respiração com ritmo musical',
      'Usar respiração como ferramenta de regulação',
      'Desenvolver padrões respiratórios saudáveis',
      'Aplicar em momentos de desregulação'
    ],
    description: 'Música com tempo apropriado para guiar respiração (inspirar 4 tempos, expirar 6). Pratique sincronização. Use em momentos de ansiedade ou superativação. Crie ritual pessoal.',
    materials: ['Músicas com tempos específicos', 'Visual de respiração', 'Metrônomo', 'Espaço confortável'],
    estimatedTime: '15-20 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Sincronização respiração-música',
      'Efeito calmante observado',
      'Uso espontâneo da técnica',
      'Generalização para vida diária',
      'Redução de sintomas de ansiedade'
    ],
    adaptations: {
      level1: 'Respiração simples com contagem audível',
      level2: 'Respiração com música, guia parcial',
      level3: 'Respiração internalizada com música de fundo'
    },
    theoreticalBasis: 'Regulação vagal através de respiração e seu efeito no sistema nervoso autônomo.',
    practicalTips: ['Comece com proporções simples', 'Use antes de tarefas desafiadoras', 'Pratique quando calmo para usar quando ansioso']
  },
  {
    id: 2060,
    title: 'Zonas de Regulação Sonoras',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Integrar programa Zonas de Regulação com suporte musical para cada estado',
    specificObjectives: [
      'Identificar em qual zona está (azul, verde, amarelo, vermelho)',
      'Associar músicas a cada zona',
      'Usar música para transitar entre zonas',
      'Desenvolver repertório de estratégias por zona'
    ],
    description: 'Cada zona tem músicas associadas: azul (energizantes suaves), verde (manutenção), amarelo (calmantes leves), vermelho (calmantes intensos). Identifique zona, escolha música, use para regular.',
    materials: ['Quadro de zonas', 'Playlists por zona', 'Cartões de estratégias', 'Registro de transições'],
    estimatedTime: '25-35 minutos para setup + uso contínuo',
    ageRange: '5-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Identificação correta de zonas',
      'Escolha apropriada de músicas',
      'Transições bem-sucedidas entre zonas',
      'Uso independente do sistema',
      'Generalização para ambiente natural'
    ],
    adaptations: {
      level1: 'Apenas zonas extremas (azul e vermelho)',
      level2: 'Quatro zonas com apoio',
      level3: 'Sistema completo independente'
    },
    theoreticalBasis: 'Programa Zones of Regulation (Kuypers) integrado com musicoterapia.',
    practicalTips: ['Use cores consistentes', 'Crie versão portátil', 'Envolva família no uso']
  },
  {
    id: 2061,
    title: 'Transição Emocional Musical',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver habilidade de mudar estados emocionais utilizando música como veículo',
    specificObjectives: [
      'Reconhecer necessidade de mudança de estado',
      'Usar música para facilitar transição',
      'Completar transição de forma controlada',
      'Chegar a estado desejado'
    ],
    description: 'Quando em estado indesejado (muito agitado, muito triste), usar sequência de músicas que gradualmente leva ao estado desejado. Não pular diretamente, fazer transição gradual.',
    materials: ['Sequências de músicas de transição', 'Mapa de transições', 'Escala de estados', 'Timer'],
    estimatedTime: '20-30 minutos',
    ageRange: '7-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Reconhecimento de estado atual',
      'Definição de estado desejado',
      'Uso de sequência de transição',
      'Chegada ao estado desejado',
      'Uso independente da estratégia'
    ],
    adaptations: {
      level1: 'Transições simples (agitado→calmo) com muita ajuda',
      level2: 'Transições variadas com ajuda parcial',
      level3: 'Transições complexas independentes'
    },
    theoreticalBasis: 'ISO musical e princípio de matching-leading para mudança de estados.',
    practicalTips: ['Crie mapas de transição personalizados', 'Nunca force transição muito rápida', 'Respeite tempo individual']
  },
  {
    id: 2062,
    title: 'Diário Musical de Humor',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver autoconsciência emocional através de registro musical de estados',
    specificObjectives: [
      'Registrar estados emocionais regularmente',
      'Associar músicas a estados específicos',
      'Identificar padrões ao longo do tempo',
      'Usar padrões para prevenção e regulação'
    ],
    description: 'Diário onde registra como está se sentindo e que música representa esse sentimento. Ao longo do tempo, identificar padrões: que dias são mais difíceis, que músicas ajudam mais.',
    materials: ['Caderno de diário', 'Adesivos de humor', 'Acesso a músicas', 'Gráficos de padrões'],
    estimatedTime: '5-10 min por sessão + revisão periódica',
    ageRange: '8-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Consistência do registro',
      'Qualidade das associações música-estado',
      'Identificação de padrões',
      'Uso de insights para regulação',
      'Engajamento com a atividade'
    ],
    adaptations: {
      level1: 'Registro visual simples com ajuda',
      level2: 'Registro escrito semi-independente',
      level3: 'Registro e análise independentes'
    },
    theoreticalBasis: 'Auto-monitoramento como base para regulação emocional e metacognição.',
    practicalTips: ['Mantenha simples', 'Revise padrões regularmente', 'Conecte com eventos da vida']
  },
  {
    id: 2063,
    title: 'Ritual de Foco Musical',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Criar ritual musical de preparação para atividades que exigem foco',
    specificObjectives: [
      'Desenvolver ritual pessoal de preparação',
      'Usar ritual antes de tarefas desafiadoras',
      'Atingir estado de foco mais rapidamente',
      'Generalizar para estudo e trabalho'
    ],
    description: 'Crie sequência musical curta (2-3 min) que prepara mente para foco: música específica, movimentos de centramento, respiração. Usar sempre antes de tarefas que exigem concentração.',
    materials: ['Música de ritual', 'Sequência de movimentos', 'Timer', 'Ambiente preparado'],
    estimatedTime: '15-20 min para criar + uso contínuo',
    ageRange: '6-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Criação de ritual personalizado',
      'Uso consistente antes de tarefas',
      'Efeito no foco e desempenho',
      'Manutenção do ritual ao longo do tempo',
      'Generalização para escola/casa'
    ],
    adaptations: {
      level1: 'Ritual dado, praticar uso',
      level2: 'Ritual co-criado',
      level3: 'Ritual criado independentemente'
    },
    theoreticalBasis: 'Condicionamento clássico e estabelecimento de rotinas preparatórias.',
    practicalTips: ['Mantenha curto (2-3 min)', 'Seja consistente', 'Use mesma música sempre']
  },
  {
    id: 2064,
    title: 'Descompressão Musical Pós-Atividade',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver ritual de descompressão após atividades intensas',
    specificObjectives: [
      'Reconhecer necessidade de descompressão',
      'Usar música para transição de alta para baixa ativação',
      'Completar descompressão antes de próxima atividade',
      'Prevenir acúmulo de tensão'
    ],
    description: 'Após atividades intensas (escola, esporte, conflito), usar sequência musical para descomprimir. Música começa matching energia alta e gradualmente reduz. Criar ritual de fim de dia.',
    materials: ['Sequências de descompressão', 'Espaço confortável', 'Timer', 'Escala de tensão'],
    estimatedTime: '10-15 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Reconhecimento de necessidade',
      'Uso consistente após eventos intensos',
      'Redução de tensão observada',
      'Prevenção de explosões',
      'Incorporação na rotina'
    ],
    adaptations: {
      level1: 'Terapeuta inicia e guia',
      level2: 'Paciente reconhece necessidade com ajuda',
      level3: 'Uso independente e proativo'
    },
    theoreticalBasis: 'Regulação do sistema nervoso e prevenção de sobrecarga autonômica.',
    practicalTips: ['Ensine a reconhecer sinais de sobrecarga', 'Integre na rotina diária', 'Use após escola/atividades']
  },
  {
    id: 2065,
    title: 'Ancoragem Sonora de Estados',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Criar associações condicionadas entre músicas e estados desejados',
    specificObjectives: [
      'Parear música específica com estado desejado',
      'Fortalecer associação através de repetição',
      'Usar música como gatilho de estado',
      'Acessar estado rapidamente quando necessário'
    ],
    description: 'Quando em estado desejado (calmo, focado, confiante), sempre ouvir mesma música. Com repetição, música se torna gatilho para esse estado. Criar âncoras para estados úteis.',
    materials: ['Músicas de âncora selecionadas', 'Protocolo de pareamento', 'Registro de uso', 'Acesso fácil às músicas'],
    estimatedTime: 'Múltiplas sessões curtas + uso contínuo',
    ageRange: '7-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Força da associação criada',
      'Efetividade do gatilho',
      'Uso apropriado da âncora',
      'Manutenção da associação',
      'Aplicação em situações reais'
    ],
    adaptations: {
      level1: 'Uma âncora simples (calma)',
      level2: '2-3 âncoras diferentes',
      level3: 'Sistema completo de âncoras'
    },
    theoreticalBasis: 'Condicionamento clássico aplicado a estados emocionais e fisiológicos.',
    practicalTips: ['Escolha músicas que já têm associação positiva', 'Pratique em estado real, não simulado', 'Mantenha música exclusiva para esse fim']
  },
  {
    id: 2066,
    title: 'Regulação através de Composição',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Usar processo criativo de composição para processar e regular emoções',
    specificObjectives: [
      'Expressar emoções através de criação musical',
      'Processar experiências difíceis criativamente',
      'Transformar emoções negativas em produto criativo',
      'Desenvolver estratégia de coping criativo'
    ],
    description: 'Quando em estado emocional intenso, canalizar para composição musical. Não precisa ser sofisticado - sons, ritmos, melodias que expressem o sentimento. Guardar e revisar depois.',
    materials: ['Instrumentos de fácil expressão', 'Gravador', 'Caderno de composições', 'Espaço privado'],
    estimatedTime: '20-30 minutos',
    ageRange: '8-18 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Uso da composição como regulação',
      'Qualidade da expressão emocional',
      'Efeito regulatório observado',
      'Uso espontâneo da estratégia',
      'Desenvolvimento criativo'
    ],
    adaptations: {
      level1: 'Composição muito livre e simples',
      level2: 'Composição semi-estruturada',
      level3: 'Composição elaborada e intencional'
    },
    theoreticalBasis: 'Arteterapia e sublimação como mecanismos de regulação emocional.',
    practicalTips: ['Não julgue qualidade musical', 'Grave para processar depois', 'Valorize qualquer expressão']
  },
  {
    id: 2067,
    title: 'Modulação de Energia Corporal',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver consciência e controle da energia corporal através de movimento musical',
    specificObjectives: [
      'Perceber nível de energia corporal',
      'Modular energia através de movimento',
      'Chegar a nível adequado para contexto',
      'Usar corpo como ferramenta de regulação'
    ],
    description: 'Movimento com música em diferentes intensidades. Praticar aumentar e diminuir energia corporalmente. Reconhecer sensações de cada nível. Usar para se preparar para diferentes contextos.',
    materials: ['Músicas de diferentes energias', 'Espaço para movimento', 'Escala corporal de energia', 'Espelho opcional'],
    estimatedTime: '20-25 minutos',
    ageRange: '5-16 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Consciência de energia corporal',
      'Capacidade de modular através de movimento',
      'Precisão no nível desejado',
      'Uso para preparação de atividades',
      'Consciência corpo-mente'
    ],
    adaptations: {
      level1: 'Apenas alto e baixo, guiado',
      level2: 'Três níveis, semi-independente',
      level3: 'Escala contínua, auto-regulação'
    },
    theoreticalBasis: 'Embodied cognition e regulação bottom-up através do corpo.',
    practicalTips: ['Faça junto', 'Use antes de atividades que exigem energia específica', 'Conecte com esportes/escola']
  },
  {
    id: 2068,
    title: 'Autofalas Musicais',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver autoinstruções positivas através de canções personalizadas',
    specificObjectives: [
      'Criar frases de autoinstrução positiva',
      'Colocar em formato musical memorável',
      'Usar em momentos de dificuldade',
      'Internalizar autofala positiva'
    ],
    description: 'Crie canções curtas com mensagens de autocontrole: "Posso esperar", "Calma, respira", "Pensa primeiro". Pratique cantar em momentos calmos. Use mentalização em momentos difíceis.',
    materials: ['Letras de autoinstrução', 'Melodias simples', 'Gravações', 'Cartões com letras'],
    estimatedTime: '20-25 minutos para criar + uso contínuo',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Criação de canções efetivas',
      'Memorização das letras',
      'Uso em momentos difíceis',
      'Internalização das mensagens',
      'Impacto no comportamento'
    ],
    adaptations: {
      level1: 'Canções dadas, praticar uso',
      level2: 'Canções co-criadas',
      level3: 'Canções criadas pelo paciente'
    },
    theoreticalBasis: 'Autoinstrução de Meichenbaum adaptada para formato musical.',
    practicalTips: ['Use melodias conhecidas', 'Mantenha frases curtas', 'Pratique quando calmo para usar quando estressado']
  },
  {
    id: 2069,
    title: 'Check-in/Check-out Musical',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Implementar rotina de check-in e check-out com suporte musical',
    specificObjectives: [
      'Iniciar dia/atividade com avaliação de estado',
      'Definir objetivo de regulação',
      'Encerrar com reflexão sobre regulação',
      'Desenvolver rotina consistente'
    ],
    description: 'Início: música de abertura + avaliação de estado + definição de meta. Final: música de fechamento + avaliação de como foi + celebração ou ajuste. Usar em cada sessão e transferir para dia a dia.',
    materials: ['Músicas de abertura e fechamento', 'Escala de estados', 'Registro de metas', 'Ritual definido'],
    estimatedTime: '5 min início + 5 min fim (integrado)',
    ageRange: '5-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Consistência do uso',
      'Qualidade das avaliações',
      'Definição de metas realistas',
      'Reflexão honesta ao final',
      'Transferência para vida diária'
    ],
    adaptations: {
      level1: 'Ritual muito simples e guiado',
      level2: 'Ritual moderado semi-independente',
      level3: 'Ritual elaborado independente'
    },
    theoreticalBasis: 'Check-in/Check-out como intervenção PBIS adaptada.',
    practicalTips: ['Mantenha consistência', 'Use mesmas músicas', 'Envolva família na implementação']
  },
  {
    id: 2070,
    title: 'Previsão e Preparação Musical',
    disorder: 'TDAH',
    demandCategory: 'self_regulation',
    generalObjective: 'Desenvolver habilidade de antecipar desafios e preparar estratégias de regulação',
    specificObjectives: [
      'Identificar situações desafiadoras futuras',
      'Prever reações emocionais/comportamentais',
      'Preparar estratégias musicais de enfrentamento',
      'Executar plano quando situação ocorrer'
    ],
    description: 'Antes de eventos desafiadores (prova, festa, viagem), discutir possíveis dificuldades e preparar estratégias musicais. Criar kit de regulação portátil. Revisar após o evento.',
    materials: ['Calendário de eventos', 'Mapa de desafios e estratégias', 'Kit portátil de músicas', 'Registro de uso'],
    estimatedTime: '25-35 minutos por evento',
    ageRange: '8-18 anos',
    complexityLevel: 'advanced',
    evaluationCriteria: [
      'Identificação de desafios futuros',
      'Qualidade das previsões',
      'Preparação de estratégias adequadas',
      'Uso do plano na situação real',
      'Ajuste baseado em experiência'
    ],
    adaptations: {
      level1: 'Eventos próximos e concretos, estratégias dadas',
      level2: 'Eventos moderados, estratégias co-criadas',
      level3: 'Eventos variados, estratégias independentes'
    },
    theoreticalBasis: 'Regulação proativa vs. reativa e desenvolvimento de planejamento futuro.',
    practicalTips: ['Comece com eventos previsíveis', 'Crie ritual de preparação', 'Revise sempre após o evento']
  },

  // ==================== MOTOR (10 atividades) ====================
  {
    id: 2071,
    title: 'Circuito Rítmico Motor',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Canalizar energia motora através de exercícios físicos sincronizados com música',
    specificObjectives: [
      'Executar movimentos sincronizados com ritmo',
      'Completar circuito de atividades físicas',
      'Manter ritmo durante esforço',
      'Descarregar energia de forma organizada'
    ],
    description: 'Circuito de estações físicas (pular, agachar, correr no lugar, polichinelo) com música que guia ritmo. Cada estação dura uma frase musical. Transição entre estações no refrão.',
    materials: ['Música rítmica animada', 'Marcadores de estação', 'Timer musical', 'Espaço amplo'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Sincronização com ritmo',
      'Completude do circuito',
      'Regulação durante esforço',
      'Estado após atividade',
      'Engajamento e diversão'
    ],
    adaptations: {
      level1: 'Poucas estações, ritmo lento',
      level2: 'Estações moderadas, ritmo médio',
      level3: 'Muitas estações, ritmo rápido'
    },
    theoreticalBasis: 'Benefícios do exercício para TDAH e uso do ritmo como organizador motor.',
    practicalTips: ['Use músicas favoritas', 'Ajuste intensidade', 'Termine com regulação']
  },
  {
    id: 2072,
    title: 'Bateria Corporal Estruturada',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver coordenação e canalizar energia através de percussão no próprio corpo',
    specificObjectives: [
      'Executar padrões rítmicos no corpo',
      'Coordenar diferentes partes do corpo',
      'Manter padrão por tempo determinado',
      'Criar sequências próprias'
    ],
    description: 'Criar ritmos usando palmas, batidas no peito, coxas, pés. Aprender sequências progressivamente mais complexas. Canalizar energia para expressão corporal organizada.',
    materials: ['Nenhum material necessário', 'Espaço mínimo', 'Vídeos de referência opcional'],
    estimatedTime: '15-20 minutos',
    ageRange: '5-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Precisão dos padrões',
      'Coordenação de partes do corpo',
      'Complexidade de sequências',
      'Criatividade',
      'Efeito regulatório'
    ],
    adaptations: {
      level1: 'Padrões simples, uma parte por vez',
      level2: 'Padrões médios, duas partes',
      level3: 'Padrões complexos, múltiplas partes'
    },
    theoreticalBasis: 'Body percussion como ferramenta de integração sensório-motora.',
    practicalTips: ['Comece com palmas simples', 'Adicione partes gradualmente', 'Crie sequências com o paciente']
  },
  {
    id: 2073,
    title: 'Dança com Paradas Súbitas',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver controle motor e inibição através de dança livre com freezes',
    specificObjectives: [
      'Mover-se livremente com a música',
      'Congelar imediatamente quando música para',
      'Manter posição estática',
      'Controlar transição movimento-parada'
    ],
    description: 'Dança livre com música. Quando música para, congela na posição. Aumentar imprevisibilidade e duração do freeze. Adicionar desafios (freeze em pose específica).',
    materials: ['Música dançante', 'Controle de pausa', 'Espaço para dança', 'Opcional: cartões de poses'],
    estimatedTime: '15-25 minutos',
    ageRange: '4-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Qualidade da dança (engajamento)',
      'Velocidade do freeze',
      'Estabilidade na posição',
      'Diversão e expressão',
      'Controle motor geral'
    ],
    adaptations: {
      level1: 'Paradas previsíveis, freezes curtos',
      level2: 'Paradas semi-previsíveis, freezes médios',
      level3: 'Paradas imprevisíveis, freezes com poses'
    },
    theoreticalBasis: 'Treino de inibição motora através de jogo estruturado.',
    practicalTips: ['Participe junto', 'Use músicas preferidas', 'Celebre bons freezes']
  },
  {
    id: 2074,
    title: 'Descarga Energética no Tambor',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Proporcionar canal aceitável para descarga de energia através de percussão',
    specificObjectives: [
      'Canalizar excesso de energia para instrumento',
      'Expressar tensão de forma construtiva',
      'Desenvolver controle de intensidade',
      'Terminar em estado mais regulado'
    ],
    description: 'Quando energia muito alta, usar tambor ou bateria para descarregar. Começar com intensidade que match o estado, gradualmente modular para mais calmo. Terminar com padrão tranquilo.',
    materials: ['Tambores variados', 'Baquetas', 'Protetor de ouvido opcional', 'Escala de energia'],
    estimatedTime: '10-20 minutos conforme necessidade',
    ageRange: '4-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Uso apropriado quando necessário',
      'Modulação de intensidade',
      'Estado ao final',
      'Redução de comportamentos desorganizados',
      'Iniciativa de uso'
    ],
    adaptations: {
      level1: 'Terapeuta guia toda a atividade',
      level2: 'Paciente inicia, terapeuta guia modulação',
      level3: 'Auto-regulação independente'
    },
    theoreticalBasis: 'Catarse controlada e sublimação de energia motora.',
    practicalTips: ['Tenha sempre disponível', 'Não limite no início', 'Guie para fechamento calmo']
  },
  {
    id: 2075,
    title: 'Coordenação Bilateral Musical',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver coordenação bilateral através de atividades musicais que cruzam linha média',
    specificObjectives: [
      'Executar movimentos bilaterais coordenados',
      'Cruzar linha média do corpo',
      'Sincronizar hemisférios através de música',
      'Melhorar integração motora geral'
    ],
    description: 'Atividades que requerem uso coordenado de ambos os lados: tocar tambores alternados, movimentos cruzados com música, canções com gestos bilaterais.',
    materials: ['Dois tambores ou instrumentos', 'Músicas com movimentos específicos', 'Espaço para movimentos amplos'],
    estimatedTime: '20-25 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Fluidez da coordenação bilateral',
      'Capacidade de cruzar linha média',
      'Sincronização com música',
      'Melhora ao longo do tempo',
      'Transferência para outras atividades'
    ],
    adaptations: {
      level1: 'Movimentos simétricos primeiro',
      level2: 'Movimentos alternados',
      level3: 'Movimentos cruzados complexos'
    },
    theoreticalBasis: 'Integração hemisférica e seu papel no controle motor e atenção.',
    practicalTips: ['Comece com movimentos simétricos', 'Adicione cruzamento gradualmente', 'Use músicas que facilitam ritmo']
  },
  {
    id: 2076,
    title: 'Ritmo e Equilíbrio',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver controle postural e equilíbrio através de atividades rítmicas',
    specificObjectives: [
      'Manter equilíbrio durante atividade musical',
      'Executar movimentos equilibrados com ritmo',
      'Desenvolver consciência corporal',
      'Melhorar estabilidade postural'
    ],
    description: 'Atividades de equilíbrio com suporte musical: andar em linha com ritmo, ficar em um pé durante frase musical, movimentos de yoga com música, posturas estáticas com manutenção.',
    materials: ['Linha no chão', 'Almofadas de equilíbrio', 'Música calma e rítmica', 'Espelho opcional'],
    estimatedTime: '20-25 minutos',
    ageRange: '5-14 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Tempo de manutenção de equilíbrio',
      'Qualidade postural',
      'Sincronização com música',
      'Consciência corporal demonstrada',
      'Melhora ao longo das sessões'
    ],
    adaptations: {
      level1: 'Base ampla, apoio disponível',
      level2: 'Base média, desafios moderados',
      level3: 'Base estreita, olhos fechados opcional'
    },
    theoreticalBasis: 'Integração vestibular-proprioceptiva facilitada por ritmo externo.',
    practicalTips: ['Segurança primeiro', 'Use música para foco externo', 'Celebre pequenas conquistas']
  },
  {
    id: 2077,
    title: 'Sequência Motora Coreografada',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver memória motora e sequenciamento através de coreografias musicais simples',
    specificObjectives: [
      'Aprender sequência de movimentos',
      'Memorizar ordem de passos',
      'Executar sequência com música',
      'Adicionar novos elementos progressivamente'
    ],
    description: 'Criar coreografia simples para música. Ensinar passo a passo, adicionar elementos gradualmente. Praticar até dominar. Usar como aquecimento regular.',
    materials: ['Música para coreografia', 'Espaço amplo', 'Espelho opcional', 'Vídeo de referência opcional'],
    estimatedTime: '25-35 minutos',
    ageRange: '5-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Memorização da sequência',
      'Precisão dos movimentos',
      'Sincronização com música',
      'Fluência e naturalidade',
      'Prazer na execução'
    ],
    adaptations: {
      level1: '4-6 movimentos simples',
      level2: '8-12 movimentos moderados',
      level3: 'Coreografia completa elaborada'
    },
    theoreticalBasis: 'Memória procedural e aprendizagem motora através de prática estruturada.',
    practicalTips: ['Use músicas favoritas', 'Ensine em pequenos chunks', 'Grave para referência']
  },
  {
    id: 2078,
    title: 'Relaxamento Muscular Progressivo Musical',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver consciência de tensão muscular e relaxamento através de protocolo com música',
    specificObjectives: [
      'Identificar tensão em diferentes grupos musculares',
      'Executar tensão e relaxamento controlados',
      'Usar música como guia de ritmo',
      'Atingir estado de relaxamento'
    ],
    description: 'Tensionar e relaxar grupos musculares sistematicamente, guiado por música calma. Tensão durante uma frase, relaxamento na seguinte. Percorrer todo corpo.',
    materials: ['Música calma e previsível', 'Colchonete', 'Ambiente tranquilo', 'Script de grupos musculares'],
    estimatedTime: '15-25 minutos',
    ageRange: '6-18 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Identificação de tensão',
      'Qualidade do relaxamento',
      'Sincronização com música',
      'Estado final atingido',
      'Uso independente da técnica'
    ],
    adaptations: {
      level1: 'Poucos grupos, terapeuta guia',
      level2: 'Mais grupos, guia parcial',
      level3: 'Corpo todo, auto-guiado'
    },
    theoreticalBasis: 'Relaxamento progressivo de Jacobson adaptado com suporte musical.',
    practicalTips: ['Ambiente calmo essencial', 'Não force profundidade', 'Transfira para hora de dormir']
  },
  {
    id: 2079,
    title: 'Yoga Musical para Crianças',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Integrar posturas de yoga com música para regulação corporal e mental',
    specificObjectives: [
      'Executar posturas básicas de yoga',
      'Sincronizar respiração com movimento e música',
      'Desenvolver consciência corporal',
      'Atingir estado de calma e foco'
    ],
    description: 'Sequência de posturas de yoga com música apropriada. Cada postura mantida por uma frase musical. Respiração sincronizada. Usar nomes de animais para posturas.',
    materials: ['Colchonete de yoga', 'Música calma', 'Cartões de posturas', 'Espaço tranquilo'],
    estimatedTime: '20-30 minutos',
    ageRange: '5-16 anos',
    complexityLevel: 'intermediate',
    evaluationCriteria: [
      'Execução das posturas',
      'Sincronização respiratória',
      'Manutenção de foco',
      'Estado ao final',
      'Engajamento com prática'
    ],
    adaptations: {
      level1: 'Poucas posturas simples, tempo curto',
      level2: 'Mais posturas, tempo médio',
      level3: 'Sequência completa, tempo padrão'
    },
    theoreticalBasis: 'Yoga como intervenção para TDAH com benefícios em atenção e regulação.',
    practicalTips: ['Use nomes divertidos para posturas', 'Não exija perfeição', 'Termine sempre em relaxamento']
  },
  {
    id: 2080,
    title: 'Caminhada Rítmica Regulada',
    disorder: 'TDAH',
    demandCategory: 'motor',
    generalObjective: 'Desenvolver controle de velocidade e direção através de caminhada sincronizada com música',
    specificObjectives: [
      'Caminhar no ritmo da música',
      'Ajustar velocidade conforme tempo musical muda',
      'Manter direção enquanto segue ritmo',
      'Desenvolver consciência de ritmo corporal'
    ],
    description: 'Caminhar ao ritmo de diferentes músicas. Quando música acelera, caminhar mais rápido. Quando desacelera, caminhar mais devagar. Parar quando música para. Adicionar mudanças de direção.',
    materials: ['Músicas de diferentes tempos', 'Espaço para caminhar', 'Marcadores de direção', 'Metrônomo opcional'],
    estimatedTime: '15-20 minutos',
    ageRange: '4-14 anos',
    complexityLevel: 'basic',
    evaluationCriteria: [
      'Sincronização passo-ritmo',
      'Ajuste a mudanças de tempo',
      'Controle de velocidade',
      'Resposta a paradas',
      'Prazer na atividade'
    ],
    adaptations: {
      level1: 'Tempo constante, sem mudanças',
      level2: 'Mudanças graduais de tempo',
      level3: 'Mudanças abruptas, múltiplas direções'
    },
    theoreticalBasis: 'RAS (Rhythmic Auditory Stimulation) aplicada ao desenvolvimento motor.',
    practicalTips: ['Comece com tempo confortável', 'Adicione variações gradualmente', 'Use como aquecimento']
  }
];
