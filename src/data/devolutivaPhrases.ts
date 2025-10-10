export interface PhraseCategory {
  id: string;
  title: string;
  phrases: string[];
  icon: string;
}

export const devolutivaPhrases: PhraseCategory[] = [
  {
    id: 'arrival_state',
    title: 'Estado de Chegada',
    icon: '👋',
    phrases: [
      'Chegou tranquilo e receptivo à sessão',
      'Apresentou ansiedade inicial que foi acolhida com música suave',
      'Demonstrou entusiasmo ao reconhecer o ambiente terapêutico',
      'Necessitou de tempo extra para adaptação ao espaço',
      'Chegou agitado, mas se acalmou gradualmente com atividades rítmicas',
      'Mostrou-se confortável e familiarizado com o setting terapêutico',
      'Apresentou resistência inicial que foi trabalhada musicalmente'
    ]
  },
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
      'Apontou para instrumentos desejados, demonstrando intencionalidade comunicativa'
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
      'Aceitou transições entre atividades com maior flexibilidade'
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
      'Demonstrou controle de força ao manusear instrumentos delicados'
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
      'Mostrou conforto com diferentes volumes e intensidades musicais'
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
      'Contribuiu com ideias musicais próprias durante as atividades'
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
      'Demonstrou evolução significativa em relação às sessões anteriores'
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
      'Utilize música calma antes de momentos de descanso'
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
      'Trabalharemos tolerância sensorial de forma progressiva'
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
      'A continuidade do processo é fundamental para consolidação dos ganhos'
    ]
  }
];
