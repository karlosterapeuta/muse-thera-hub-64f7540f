export interface PhraseCategory {
  id: string;
  title: string;
  phrases: string[];
  icon: string;
}

export const devolutivaPhrases: PhraseCategory[] = [
  {
    id: 'communication',
    title: 'Comunicação e Interação',
    icon: '💬',
    phrases: [
      'Manteve contato visual durante as atividades musicais',
      'Iniciou interações espontâneas através de gestos musicais',
      'Respondeu a chamados pelo nome com maior frequência',
      'Demonstrou preferências musicais de forma clara',
      'Comunicou necessidades através de escolhas de instrumentos',
      'Participou de turnos comunicativos com apoio musical',
      'Expressou-se através de vocalizações sincronizadas com a música',
      'Apontou para instrumentos desejados, demonstrando intencionalidade comunicativa',
      'Evitou contato visual mesmo durante atividades de seu interesse, mantendo-se isolado',
      'Não respondeu a tentativas de interação, demonstrando alheamento às propostas comunicativas',
      'Apresentou regressão na comunicação, reduzindo vocalizações e gestos intencionais',
      'Demonstrou dificuldade em compreender e responder a comandos simples, mesmo com suporte musical'
    ]
  },
  {
    id: 'emotional_regulation',
    title: 'Regulação Emocional',
    icon: '❤️',
    phrases: [
      'Utilizou a música para se acalmar em momentos de frustração',
      'Expressou emoções de forma mais clara através da música',
      'Demonstrou maior tolerância a mudanças nas atividades',
      'Apresentou autorregulação emocional com suporte rítmico',
      'Reduziu comportamentos de agitação com atividades musicais estruturadas',
      'Manteve-se organizado emocionalmente durante toda a sessão',
      'Aceitou transições entre atividades com maior flexibilidade',
      'Apresentou crises frequentes de desregulação que não responderam às intervenções musicais habituais',
      'Demonstrou baixa tolerância a frustrações, com reações intensas a pequenas mudanças',
      'Manteve-se em estado de agitação constante, sem responder aos estímulos calmantes oferecidos',
      'Não conseguiu organizar-se emocionalmente, necessitando interrupção precoce da sessão'
    ]
  },
  {
    id: 'motor_development',
    title: 'Desenvolvimento Motor',
    icon: '🤸',
    phrases: [
      'Explorou instrumentos com coordenação motora fina aprimorada',
      'Demonstrou sincronização rítmica com movimentos corporais',
      'Apresentou melhora na coordenação bilateral ao tocar instrumentos',
      'Participou de atividades de dança com maior organização corporal',
      'Explorou diferentes texturas instrumentais com curiosidade',
      'Realizou movimentos amplos coordenados com a música',
      'Demonstrou controle de força ao manusear instrumentos delicados',
      'Apresentou dificuldade motora maior que o esperado, com descoordenação ao manusear instrumentos',
      'Demonstrou regressão na coordenação motora fina, evitando exploração de instrumentos delicados',
      'Manteve movimentos estereotipados, resistindo a propostas de ampliação do repertório motor',
      'Não conseguiu sincronizar movimentos com a música, mantendo descoordenação persistente'
    ]
  },
  {
    id: 'sensory_aspects',
    title: 'Aspectos Sensoriais',
    icon: '🎵',
    phrases: [
      'Demonstrou maior tolerância a diferentes intensidades sonoras',
      'Explorou texturas instrumentais variadas de forma organizada',
      'Reagiu positivamente a estímulos musicais estruturados',
      'Apresentou preferências sensoriais claras por instrumentos específicos',
      'Demonstrou integração sensorial através de atividades rítmico-corporais',
      'Aceitou experimentar novos timbres e texturas sonoras',
      'Mostrou conforto com diferentes volumes e intensidades musicais',
      'Apresentou hipersensibilidade aumentada, demonstrando desconforto com sons previamente tolerados',
      'Recusou exploração de texturas instrumentais, limitando-se a um único instrumento familiar',
      'Demonstrou sobrecarga sensorial, necessitando pausas frequentes e redução drástica de estímulos',
      'Manteve padrões de busca ou evitação sensorial rígidos, sem responder às tentativas de modulação'
    ]
  },
  {
    id: 'musical_participation',
    title: 'Participação Musical',
    icon: '🎼',
    phrases: [
      'Participou ativamente de todas as atividades propostas',
      'Demonstrou iniciativa para explorar novos instrumentos',
      'Manteve atenção sustentada durante toda a sessão',
      'Apresentou criatividade na improvisação musical',
      'Seguiu estruturas musicais com maior autonomia',
      'Engajou-se em atividades de escuta musical com interesse',
      'Contribuiu com ideias musicais próprias durante as atividades',
      'Recusou-se a participar das atividades propostas, demonstrando desinteresse persistente',
      'Apresentou regressão no engajamento, participando apenas de forma passiva ou recusando-se',
      'Manteve atenção dispersa durante toda a sessão, não conseguindo focar em nenhuma atividade',
      'Demonstrou resistência ativa às propostas, afastando instrumentos e evitando participação'
    ]
  },
  {
    id: 'achievements',
    title: 'Conquistas da Sessão',
    icon: '🎯',
    phrases: [
      'Conseguiu manter foco por períodos mais longos',
      'Iniciou comunicação de forma independente',
      'Demonstrou repertório musical ampliado',
      'Aceitou mudanças nas atividades com maior flexibilidade',
      'Expressou preferências de forma clara e direcionada',
      'Participou de atividades em grupo com maior engajamento',
      'Completou toda a sessão de forma organizada e tranquila',
      'Demonstrou evolução significativa em relação às sessões anteriores',
      'Não foi possível identificar conquistas significativas nesta sessão devido ao estado de desregulação',
      'Apresentou retrocesso em habilidades anteriormente adquiridas, demandando revisão de estratégias',
      'Manteve-se no mesmo nível de desempenho, sem novos avanços observáveis nesta sessão',
      'As dificuldades superaram as possibilidades de conquistas, indicando necessidade de ajustes terapêuticos'
    ]
  },
  {
    id: 'family_guidelines',
    title: 'Orientações para Família',
    icon: '👨‍👩‍👧‍👦',
    phrases: [
      'Utilize músicas familiares para facilitar transições em casa',
      'Crie momentos musicais diários para autorregulação emocional',
      'Explore objetos sonoros disponíveis no ambiente doméstico',
      'Mantenha rotinas musicais para organização temporal',
      'Incentive escolhas musicais para desenvolver autonomia',
      'Compartilhe momentos musicais em família regularmente',
      'Use canções para facilitar atividades da rotina diária',
      'Observe e respeite as preferências musicais demonstradas',
      'Utilize música calma antes de momentos de descanso',
      'Observe sinais de sobrecarga sensorial e reduza estímulos musicais quando necessário',
      'Respeite momentos de recusa e evite forçar participação em atividades musicais',
      'Mantenha contato com a equipe terapêutica sobre mudanças comportamentais observadas em casa',
      'Procure identificar gatilhos de desregulação para evitar situações desafiadoras com música'
    ]
  },
  {
    id: 'next_steps',
    title: 'Próximos Passos',
    icon: '🔜',
    phrases: [
      'Continuaremos trabalhando comunicação através da música',
      'Expandiremos o repertório instrumental nas próximas sessões',
      'Introduziremos atividades musicais em grupo gradualmente',
      'Focaremos em desenvolvimento de habilidades sociais musicais',
      'Aprofundaremos trabalho de regulação emocional com música',
      'Integraremos a família em atividades musicoterapêuticas',
      'Ampliaremos desafios motores com novos instrumentos',
      'Trabalharemos tolerância sensorial de forma progressiva',
      'Reavaliaremos estratégias terapêuticas para melhor atender as necessidades atuais',
      'Reduziremos complexidade das atividades para facilitar engajamento e reduzir frustrações',
      'Discutiremos em equipe multidisciplinar ajustes no plano terapêutico',
      'Focaremos em consolidação de conquistas anteriores antes de introduzir novos desafios'
    ]
  },
  {
    id: 'general_observations',
    title: 'Observações Gerais',
    icon: '📝',
    phrases: [
      'A música tem sido ferramenta fundamental para seu desenvolvimento',
      'Observamos evolução consistente em todas as áreas trabalhadas',
      'O engajamento musical demonstra excelente potencial terapêutico',
      'A parceria com a família é parte essencial deste processo terapêutico',
      'Os progressos são significativos e devem ser celebrados',
      'O ambiente musical proporciona segurança e conforto',
      'A continuidade do processo é fundamental para consolidação dos ganhos',
      'O processo terapêutico passa por momento de desafios que exigem ajustes nas estratégias',
      'A evolução não é linear e momentos de dificuldade são parte natural do desenvolvimento',
      'É importante manter comunicação constante com a equipe sobre dificuldades observadas',
      'O acompanhamento será ajustado conforme necessidades específicas do momento atual'
    ]
  },
  {
    id: 'challenges_resistance',
    title: 'Desafios e Resistências',
    icon: '⚠️',
    phrases: [
      'Apresenta resistência significativa às propostas terapêuticas, necessitando abordagens alternativas',
      'Demonstra baixa tolerância ao setting terapêutico, com dificuldades de permanência na sala',
      'Mantém padrões de comportamento disruptivo que comprometem o aproveitamento das sessões',
      'Apresenta dificuldades de vinculação com o terapeuta, limitando as possibilidades de intervenção',
      'Demonstra hipersensibilidade sensorial que restringe significativamente as atividades possíveis',
      'Mantém rigidez comportamental intensa, com baixa flexibilidade para adaptações',
      'Apresenta oscilações significativas de humor que dificultam previsibilidade das sessões',
      'Demonstra necessidade de reavaliação multidisciplinar para ajustes no plano terapêutico global'
    ]
  }
];
