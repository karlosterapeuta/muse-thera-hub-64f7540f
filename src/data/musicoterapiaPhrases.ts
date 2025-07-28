export interface PhraseBank {
  id: string;
  name: string;
  phrases: string[];
  fieldContext: string[];
}

export const musicoterapiaPhrases: PhraseBank[] = [
  {
    id: 'musical_objectives',
    name: 'Objetivos Musicais',
    phrases: [
      'desenvolver expressão musical como forma de comunicação alternativa',
      'promover autorregulação emocional através de atividades rítmicas estruturadas',
      'estimular interação social por meio de dinâmicas musicais colaborativas',
      'desenvolver coordenação motora fina e grossa através da manipulação de instrumentos',
      'ampliar repertório musical funcional para utilização em rotinas diárias',
      'fortalecer vínculos afetivos através de experiências musicais compartilhadas',
      'promover desenvolvimento da escuta ativa e discriminação auditiva',
      'estimular criatividade e expressão pessoal através da improvisação musical',
      'desenvolver conceitos temporais e espaciais por meio do ritmo e movimento',
      'facilitar processos de comunicação não-verbal através da música'
    ],
    fieldContext: ['therapeutic_objectives']
  },
  {
    id: 'rhythm_objectives',
    name: 'Objetivos Rítmicos',
    phrases: [
      'desenvolver consciência rítmica e temporal através de exercícios progressivos',
      'promover sincronização temporal entre movimentos corporais e estímulos sonoros',
      'estimular coordenação bilateral através de atividades rítmicas simétricas',
      'desenvolver pulso interno e capacidade de manter tempo musical constante',
      'melhorar organização temporal e sequenciamento através de padrões rítmicos',
      'fortalecer integração sensório-motora através de experiências rítmico-corporais',
      'promover antecipação e planejamento motor através de estruturas rítmicas previsíveis',
      'desenvolver capacidade de imitação rítmica como base para interação social',
      'estimular flexibilidade cognitiva através de variações rítmicas graduais',
      'facilitar autorregulação comportamental através de ritmos organizadores'
    ],
    fieldContext: ['therapeutic_objectives']
  },
  {
    id: 'communication_objectives',
    name: 'Objetivos Comunicativos',
    phrases: [
      'desenvolver comunicação intencional através de escolhas musicais dirigidas',
      'promover iniciativa comunicativa através de propostas musicais interativas',
      'estimular turnos conversacionais em contextos musicais estruturados',
      'desenvolver compreensão de causa e efeito através de instrumentos responsivos',
      'ampliar formas de expressão emocional através de recursos musicais variados',
      'fortalecer contato visual durante experiências musicais compartilhadas',
      'promover gestos comunicativos funcionais integrados à prática musical',
      'desenvolver capacidade de seguir instruções simples em contexto musical',
      'estimular vocalização intencional através de estímulos musicais motivadores',
      'facilitar desenvolvimento de joint attention através de atividades musicais'
    ],
    fieldContext: ['therapeutic_objectives']
  },
  {
    id: 'musical_activities',
    name: 'Atividades Musicais',
    phrases: [
      'exploração livre e dirigida de instrumentos de percussão com diferentes texturas',
      'atividades de imitação rítmica utilizando instrumentos diversos e movimento corporal',
      'canto de canções funcionais integradas às rotinas e transições diárias',
      'improvisação musical dirigida com foco em expressão emocional autêntica',
      'jogos musicais interativos que promovem turnos e cooperação social',
      'exercícios de escuta ativa com identificação e discriminação de sons ambientais',
      'atividades de movimento e dança integradas à expressão musical espontânea',
      'criação coletiva de narrativas sonoras utilizando instrumentos variados',
      'experiências de karaokê adaptado com suporte visual e gestual',
      'sessões de relaxamento musical com técnicas de respiração assistida'
    ],
    fieldContext: ['session_activities']
  },
  {
    id: 'instrumental_activities',
    name: 'Atividades Instrumentais',
    phrases: [
      'prática estruturada com instrumentos de percussão de diferentes tamanhos e materiais',
      'exploração sensorial de instrumentos melódicos com foco na descoberta sonora',
      'atividades com instrumentos de sopro adaptados para desenvolvimento respiratório',
      'jogos interativos com instrumentos que estimulam diferentes texturas tácteis',
      'criação de sequências instrumentais simples com apoio visual e auditivo',
      'prática de ensemble musical em pequenos grupos com instrumentos complementares',
      'atividades de construção de instrumentos musicais com materiais reciclados',
      'experiências com instrumentos eletrônicos e tecnologia musical assistiva',
      'exercícios de coordenação bilateral utilizando instrumentos simétricos',
      'improvisação instrumental livre com posterior estruturação dirigida'
    ],
    fieldContext: ['session_activities']
  },
  {
    id: 'vocal_activities',
    name: 'Atividades Vocais',
    phrases: [
      'exercícios de aquecimento vocal adaptados com apoio instrumental constante',
      'canto de canções conhecidas com modificações rítmicas e melódicas graduais',
      'atividades de vocalização espontânea integradas à exploração instrumental',
      'técnicas de respiração musical com suporte de instrumentos de sopro simples',
      'jogos vocais imitativos utilizando diferentes alturas e intensidades sonoras',
      'criação coletiva de canções simples com temas do interesse do paciente',
      'exercícios de articulação vocal através de canções com padrões silábicos claros',
      'atividades de eco vocal com variações dinâmicas e expressivas',
      'integração de vocalização com movimento corporal e gesticulação expressiva',
      'técnicas de relaxamento vocal com foco em autorregulação emocional'
    ],
    fieldContext: ['session_activities']
  },
  {
    id: 'musical_evolution',
    name: 'Evolução Musical',
    phrases: [
      'demonstra resposta musical espontânea e cada vez mais elaborada às propostas apresentadas',
      'apresenta engajamento crescente com atividades rítmicas estruturadas e livres',
      'evidencia expressão emocional mais clara e intencional através de recursos musicais',
      'mostra capacidade aprimorada de imitação de padrões rítmicos simples e complexos',
      'utiliza a música de forma cada vez mais efetiva para processos de autorregulação',
      'demonstra preferências musicais mais definidas e capacidade de escolha dirigida',
      'apresenta melhora significativa na coordenação motora durante atividades instrumentais',
      'evidencia maior tempo de atenção sustentada durante experiências musicais',
      'mostra desenvolvimento na capacidade de antecipar estruturas musicais familiares',
      'demonstra criatividade crescente em propostas de improvisação musical dirigida'
    ],
    fieldContext: ['patient_evolution']
  },
  {
    id: 'communication_evolution',
    name: 'Evolução Comunicativa Musical',
    phrases: [
      'desenvolve comunicação não-verbal mais efetiva através de gestos musicais funcionais',
      'apresenta iniciativa crescente para interações musicais com terapeuta e pares',
      'demonstra expressão clara de preferências musicais através de escolhas dirigidas',
      'evidencia turnos conversacionais mais organizados em atividades musicais estruturadas',
      'utiliza gestos musicais funcionais de forma cada vez mais intencional e efetiva',
      'mostra melhora na capacidade de seguir instruções simples em contexto musical',
      'demonstra desenvolvimento na utilização de instrumentos como extensão comunicativa',
      'apresenta vocalização mais intencional e direcionada durante atividades musicais',
      'evidencia maior reciprocidade social durante experiências musicais compartilhadas',
      'mostra capacidade emergente de liderar iniciativas musicais em grupo'
    ],
    fieldContext: ['patient_evolution']
  },
  {
    id: 'sensory_evolution',
    name: 'Evolução Sensorial Musical',
    phrases: [
      'demonstra maior tolerância e interesse por texturas sonoras anteriormente rejeitadas',
      'apresenta discriminação auditiva mais refinada entre diferentes timbres instrumentais',
      'evidencia autorregulação sensorial mais efetiva através de escolhas musicais apropriadas',
      'mostra capacidade crescente de modular resposta a diferentes intensidades sonoras',
      'demonstra integração sensório-motora aprimorada durante atividades rítmico-corporais',
      'apresenta exploração sensorial mais organizada e direcionada de instrumentos diversos',
      'evidencia preferências sensoriais mais definidas e comunicadas de forma clara',
      'mostra desenvolvimento na capacidade de antecipar mudanças sonoras estruturadas',
      'demonstra maior flexibilidade na aceitação de novos estímulos sonoros apresentados',
      'apresenta utilização funcional de informações sensoriais musicais para autorregulação'
    ],
    fieldContext: ['patient_evolution', 'sensory_response']
  },
  {
    id: 'recommendations_continuity',
    name: 'Recomendações de Continuidade',
    phrases: [
      'manutenção da frequência semanal de sessões com expansão gradual do repertório instrumental',
      'continuidade do trabalho com técnicas de improvisação dirigida para expressão emocional',
      'implementação de atividades musicais estruturadas no ambiente familiar e escolar',
      'desenvolvimento de playlist personalizada para momentos de autorregulação no cotidiano',
      'integração gradual de atividades musicais em grupo para desenvolvimento social',
      'expansão do trabalho com instrumentos melódicos para desenvolvimento cognitivo-musical',
      'implementação de rotinas musicais funcionais para transições e atividades diárias',
      'desenvolvimento de projeto musical de longo prazo com objetivos específicos',
      'articulação com equipe multidisciplinar para integração de estratégias musicoterapêuticas',
      'avaliação periódica de progressos com ajustes no planejamento terapêutico musical'
    ],
    fieldContext: ['recommendations']
  },
  {
    id: 'home_musical_activities',
    name: 'Atividades Musicais para Casa',
    phrases: [
      'escuta diária de playlist terapêutica personalizada em momentos específicos da rotina',
      'momentos estruturados de dança livre com músicas de diferentes gêneros e ritmos',
      'exploração dirigida de objetos sonoros disponíveis no ambiente doméstico',
      'implementação de canções funcionais para facilitar transições entre atividades',
      'criação de momentos musicais familiares com participação ativa de todos os membros',
      'utilização de aplicativos musicais educativos com supervisão e direcionamento adequado',
      'estabelecimento de rituais musicais para momentos de relaxamento e autorregulação',
      'prática de exercícios respiratórios simples com acompanhamento musical suave',
      'atividades de construção de instrumentos simples utilizando materiais domésticos recicláveis',
      'implementação de jogos musicais familiares que promovam interação e diversão compartilhada'
    ],
    fieldContext: ['home_activities']
  },
  {
    id: 'conclusion_statements',
    name: 'Declarações de Conclusão',
    phrases: [
      'a musicoterapia tem se mostrado ferramenta fundamental para o desenvolvimento comunicativo e emocional',
      'os resultados evidenciam potencial significativo da abordagem musical para este perfil específico',
      'o progresso observado justifica a continuidade e intensificação das intervenções musicoterapêuticas',
      'a resposta positiva aos estímulos musicais indica excelente prognóstico para desenvolvimento futuro',
      'a integração da música no processo terapêutico tem facilitado conquistas importantes em múltiplas áreas',
      'os ganhos obtidos através da musicoterapia demonstram efetividade da abordagem para este caso',
      'o engajamento musical crescente sugere potencial para expansão dos objetivos terapêuticos',
      'a evolução apresentada confirma adequação da musicoterapia às necessidades específicas identificadas',
      'os resultados alcançados evidenciam impacto positivo da música no desenvolvimento global',
      'a resposta terapêutica observada recomenda manutenção e aprofundamento da abordagem musical'
    ],
    fieldContext: ['conclusion']
  }
];