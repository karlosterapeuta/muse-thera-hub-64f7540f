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
  },
  {
    id: 'iso_phrases',
    name: 'Identidade Sonora (ISO)',
    phrases: [
      'apresenta forte ressonância com sons graves e contínuos, sugerindo ISO gestacional preservado',
      'demonstra preferência por timbres da voz humana feminina, evocando vínculo com a figura materna',
      'identifica e responde a repertório musical brasileiro tradicional, evidenciando ISO cultural consolidado',
      'apresenta ISO complementar marcado por trilhas de mídia infantil específicas (desenhos animados)',
      'no contexto familiar, o ISO grupal é mediado por canções religiosas e celebrações musicais',
      'a avaliação revelou aversão sensorial a sons agudos súbitos e preferência por timbres melódicos suaves',
      'o repertório significativo inclui canções de roda da infância e músicas associadas a rotinas domésticas'
    ],
    fieldContext: ['iso_gestational','iso_universal','iso_cultural','iso_complementary','iso_group','sound_preferences','musical_repertoire_favorites']
  },
  {
    id: 'sensory_phrases',
    name: 'Perfil Sensorial',
    phrases: [
      'apresenta hipersensibilidade auditiva a estímulos acima de 75dB, requerendo modulação dinâmica cuidadosa',
      'demonstra busca proprioceptiva ativa, especialmente com instrumentos de percussão grave',
      'mostra-se evitador tátil para instrumentos de superfícies rugosas, com boa aceitação de superfícies lisas',
      'apresenta resposta vestibular organizadora a ritmos lentos e regulares (60-80 bpm)',
      'demonstra processamento auditivo seletivo, com melhor resposta a estímulos isolados que sobrepostos',
      'perfil predominantemente buscador, com fascínio por vibrações e ressonâncias sustentadas',
      'integração sensorial favorecida por atividades multimodais combinando som, movimento e toque'
    ],
    fieldContext: ['sensory_profile_notes','auditory_processing','sound_tolerance','tactile_instrument_response']
  },
  {
    id: 'imtap_phrases',
    name: 'Domínios - Escala MuseTera',
    phrases: [
      'no domínio da musicalidade, demonstra capacidade emergente de manter pulso por períodos curtos',
      'no domínio comunicativo não-verbal, utiliza gestos musicais funcionais para fazer pedidos',
      'no domínio social, inicia trocas musicais espontâneas em pelo menos 30% das oportunidades',
      'no domínio emocional, utiliza atividades musicais como recurso autorregulatório consistente',
      'no domínio cognitivo, demonstra sequenciamento musical de até 4 elementos com modelo',
      'no domínio motor fino, manuseia instrumentos pequenos com preensão funcional',
      'no domínio da autonomia, faz escolhas musicais espontâneas a partir de oferta de 2-3 opções'
    ],
    fieldContext: ['domain_evidences']
  },
  {
    id: 'communication_phrases',
    name: 'Comunicação e Linguagem',
    phrases: [
      'apresenta vocalizações melódicas espontâneas em padrões de glissando ascendente',
      'a produção verbal é facilitada pelo contexto musical, observando-se emergência de palavras-chave de canções',
      'ecolalia musical funcional observada, com repetição diferida de trechos significativos de canções',
      'utiliza pranchas de CAA integradas ao setting musical para fazer pedidos e expressar preferências',
      'demonstra habilidades pragmáticas musicais de pedir, comentar e recusar através de gestos e vocalizações',
      'observa-se aumento progressivo da intencionalidade comunicativa em contextos musicais previsíveis'
    ],
    fieldContext: ['vocalizations_observed','verbal_output_during_music','echolalia_musical','aac_use','pragmatic_skills']
  },
  {
    id: 'future_plan_phrases',
    name: 'Plano Terapêutico Futuro',
    phrases: [
      'a curto prazo, prevê-se ampliação do repertório de canções funcionais aplicáveis a rotinas diárias',
      'a médio prazo, planeja-se introdução gradual em setting de dupla, com par cuidadosamente selecionado',
      'a longo prazo, objetiva-se generalização das habilidades musicais para contextos escolares e familiares',
      'propõe-se introdução de Neurologic Music Therapy (NMT) com técnicas de AMMT para estimulação da fala',
      'recomenda-se inclusão de songwriting terapêutico para favorecer expressão verbal e autoconhecimento',
      'estima-se evolução de 20-30% nas pontuações dos domínios IMTAP ao final do próximo ciclo de 12 sessões'
    ],
    fieldContext: ['next_objectives_short','next_objectives_medium','next_objectives_long','proposed_interventions','expected_outcomes']
  },
  {
    id: 'theoretical_phrases',
    name: 'Fundamentação Teórica',
    phrases: [
      'a prática clínica fundamenta-se no modelo Nordoff-Robbins (Creative Music Therapy), priorizando improvisação clínica',
      'integra-se o referencial Benenzon de Identidade Sonora (ISO) para personalização do repertório terapêutico',
      'adota-se classificação de experiências musicais de Bruscia (2014): improvisação, recriação, composição e receptiva',
      'utiliza-se Neurologic Music Therapy (NMT - Thaut) para intervenções em domínios sensoriomotor e cognitivo-linguístico',
      'instrumento de avaliação aplicado: IMTAP (Individualized Music Therapy Assessment Profile) - Baxter et al. (2007)',
      'fundamentação adicional na Revisão Cochrane de Geretsegger et al. (2014) sobre musicoterapia para TEA'
    ],
    fieldContext: ['theoretical_framework','assessment_tools_used','references_cited']
  },
  {
    id: 'results_positive_phrases',
    name: 'Resultados — Evolução Positiva',
    phrases: [
      'o paciente apresentou evolução significativa no período avaliado, com ganhos consistentes nos domínios trabalhados',
      'observou-se progresso expressivo na interação social, comunicação e participação nas experiências musicais',
      'as metas terapêuticas estabelecidas foram majoritariamente alcançadas, com generalização para outros contextos',
      'houve melhora importante na autorregulação emocional, com redução de comportamentos desorganizados durante as sessões',
      'o paciente ampliou o repertório de iniciativas comunicativas espontâneas, demonstrando maior intencionalidade',
      'as intervenções musicoterapêuticas mostraram-se altamente efetivas para os objetivos propostos no período',
      'verificou-se aumento consistente no tempo de atenção sustentada e no engajamento nas atividades propostas'
    ],
    fieldContext: ['goals_achieved','treatment_summary','quantitative_indicators']
  },
  {
    id: 'results_partial_phrases',
    name: 'Resultados — Evolução Parcial',
    phrases: [
      'o paciente apresentou evolução parcial no período, com avanços em alguns domínios e metas ainda em consolidação',
      'observaram-se progressos pontuais na comunicação e interação, que necessitam de continuidade para consolidação',
      'parte das metas terapêuticas foi alcançada, enquanto outras permanecem em andamento e requerem novo ciclo de intervenções',
      'a evolução foi gradual e oscilante, com avanços dependentes de contextos estruturados e previsíveis',
      'os ganhos observados ainda se restringem ao setting terapêutico, sendo necessária maior generalização',
      'as intervenções mostraram-se parcialmente efetivas, indicando-se ajustes no plano para potencializar os resultados'
    ],
    fieldContext: ['goals_in_progress','goals_achieved','treatment_summary','quantitative_indicators']
  },
  {
    id: 'results_limited_phrases',
    name: 'Resultados — Evolução Limitada',
    phrases: [
      'no período avaliado, o paciente apresentou evolução discreta, com metas terapêuticas ainda não alcançadas',
      'os progressos foram limitados, observando-se necessidade de reformulação dos objetivos e estratégias terapêuticas',
      'as respostas às intervenções foram inconsistentes, indicando-se reavaliação do plano terapêutico',
      'mantêm-se desafios significativos nos domínios de comunicação, interação social e autorregulação',
      'recomenda-se intensificação da frequência dos atendimentos e maior articulação com a equipe multiprofissional',
      'fatores externos (faltas, instabilidade de rotina, intercorrências de saúde) podem ter impactado a evolução no período'
    ],
    fieldContext: ['goals_in_progress','treatment_summary','quantitative_indicators']
  }
];
