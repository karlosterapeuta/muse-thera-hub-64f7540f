export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: ReportField[];
}

export interface ReportField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'scale' | 'multiselect';
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  guidance?: string;
}

export interface ReportData {
  templateId: string;
  selectedPatientId?: string;
  patientName: string;
  patientAge: string;
  patientDiagnosis: string;
  professionalName: string;
  professionalRegistry: string;
  professionalSpecialty: string;
  sessionDate: string;
  fieldValues: Record<string, any>;
  additionalObservations: string;
  signature: string;
}

export const musicoterapiaTemplate: ReportTemplate = {
  id: 'musicoterapia',
  name: 'Musicoterapia para TEA',
  description: 'Relatório de evolução em musicoterapia especializada para TEA',
  fields: [
    // Campos básicos (Etapa 1)
    {
      id: 'patient_name',
      type: 'text',
      label: 'Nome do Paciente',
      description: 'Nome completo do paciente',
      placeholder: 'Nome completo do paciente',
      required: true,
      guidance: 'Digite o nome completo do paciente que recebe a musicoterapia'
    },
    {
      id: 'patient_age',
      type: 'text',
      label: 'Idade',
      description: 'Idade atual do paciente',
      placeholder: 'Idade do paciente',
      required: true,
      guidance: 'Informe a idade atual do paciente'
    },
    {
      id: 'patient_diagnosis',
      type: 'text',
      label: 'Diagnóstico',
      description: 'Diagnóstico principal',
      placeholder: 'Diagnóstico principal',
      required: true,
      guidance: 'Informe o diagnóstico principal do paciente'
    },
    {
      id: 'session_date',
      type: 'text',
      label: 'Data da Sessão',
      description: 'Data da sessão avaliada',
      placeholder: 'DD/MM/AAAA',
      required: true,
      guidance: 'Data da sessão que está sendo reportada'
    },
    {
      id: 'professional_name',
      type: 'text',
      label: 'Nome do Profissional',
      description: 'Nome do musicoterapeuta',
      placeholder: 'Seu nome completo',
      required: true,
      guidance: 'Digite seu nome completo como musicoterapeuta responsável'
    },
    {
      id: 'professional_registry',
      type: 'text',
      label: 'Registro Profissional',
      description: 'Registro profissional',
      placeholder: 'CRP, CRFa, CREFITO, etc.',
      required: true,
      guidance: 'Informe seu número de registro profissional'
    },
    
    // Objetivos Terapêuticos (Etapa 2)
    {
      id: 'therapeutic_objectives',
      type: 'textarea',
      label: 'Objetivos Terapêuticos',
      description: 'Objetivos específicos através da música',
      placeholder: 'Ex: Desenvolver comunicação não-verbal através da expressão musical, promover autorregulação emocional com atividades rítmicas, estimular interação social em dinâmicas musicais...',
      required: true,
      guidance: 'Objetivos que utilizam a música como ferramenta terapêutica principal'
    },
    {
      id: 'specific_goals',
      type: 'textarea',
      label: 'Metas Específicas',
      description: 'Metas específicas para o período',
      placeholder: 'Ex: Aumentar tempo de atenção durante atividades musicais, desenvolver coordenação motora através do manuseio de instrumentos...',
      required: false,
      guidance: 'Defina metas mensuráveis e específicas para o paciente'
    },
    {
      id: 'instruments_used',
      type: 'multiselect',
      label: 'Instrumentos Utilizados',
      description: 'Instrumentos musicais trabalhados na sessão',
      required: false,
      options: [
        'Piano/Teclado',
        'Violão/Guitarra',
        'Tambores/Percussão',
        'Xilofone/Metalofone',
        'Chocalhos/Maracas',
        'Pandeiro',
        'Flauta doce',
        'Teclado eletrônico',
        'Instrumentos de sopro adaptados',
        'Instrumentos texturizados',
        'Boomwhackers',
        'Outros instrumentos melódicos'
      ],
      guidance: 'Selecione todos os instrumentos utilizados durante a sessão'
    },
    {
      id: 'musical_techniques',
      type: 'multiselect',
      label: 'Técnicas Musicoterapêuticas',
      description: 'Técnicas específicas aplicadas',
      required: true,
      options: [
        'Improvisação musical dirigida',
        'Imitação rítmica',
        'Canções funcionais',
        'Jogos musicais interativos',
        'Expressão corporal musical',
        'Escuta ativa musicoterapêutica',
        'Composição musical assistida',
        'Técnicas vocais terapêuticas',
        'Sincronização rítmica',
        'Movimento e música'
      ],
      guidance: 'Indique as técnicas musicoterapêuticas utilizadas na sessão'
    },
    {
      id: 'session_activities',
      type: 'textarea',
      label: 'Descrição das Sessões/Atividades Realizadas',
      description: 'Atividades musicoterapêuticas implementadas',
      placeholder: 'Ex: Exploração livre de instrumentos de percussão, atividades de imitação rítmica, canto de canções funcionais para rotinas...',
      required: true,
      guidance: 'Descreva técnicas e instrumentos musicais específicos utilizados'
    },
    {
      id: 'musical_response_scale',
      type: 'scale',
      label: 'Nível de Resposta Musical',
      description: 'Avalie a resposta do paciente aos estímulos musicais (1-10)',
      required: true,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Nenhuma resposta, 10 = Resposta muito engajada'
    },
    {
      id: 'rhythm_coordination',
      type: 'scale',
      label: 'Coordenação Rítmica',
      description: 'Avalie a coordenação motora rítmica (1-10)',
      required: true,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Dificuldade severa, 10 = Coordenação excelente'
    },
    {
      id: 'musical_communication',
      type: 'scale',
      label: 'Comunicação Musical',
      description: 'Uso da música para comunicação (1-10)',
      required: true,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Não utiliza música para comunicar, 10 = Comunica-se fluentemente através da música'
    },
    {
      id: 'emotional_regulation',
      type: 'scale',
      label: 'Autorregulação Emocional',
      description: 'Capacidade de regulação emocional através da música (1-10)',
      required: true,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Não consegue se regular, 10 = Autorregula-se efetivamente com música'
    },
    {
      id: 'musical_genres',
      type: 'multiselect',
      label: 'Gêneros Musicais Trabalhados',
      description: 'Estilos musicais utilizados na sessão',
      required: false,
      options: [
        'Música clássica',
        'MPB',
        'Música infantil',
        'Rock',
        'Jazz',
        'Música eletrônica',
        'Música instrumental',
        'Canções populares',
        'Música ambiente',
        'World music'
      ],
      guidance: 'Indique os gêneros musicais que geraram melhor resposta'
    },
    {
      id: 'patient_evolution',
      type: 'textarea',
      label: 'Evolução do Paciente',
      description: 'Progressos através da música',
      placeholder: 'Ex: Demonstra maior interesse e engajamento com instrumentos melódicos. Melhora significativa na atenção compartilhada...',
      required: true,
      guidance: 'Foque em como a música impacta o desenvolvimento do paciente'
    },
    {
      id: 'social_interaction',
      type: 'scale',
      label: 'Interação Social Musical',
      description: 'Nível de interação social durante atividades musicais (1-10)',
      required: true,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Isolamento completo, 10 = Interação social fluida através da música'
    },
    {
      id: 'attention_focus',
      type: 'scale',
      label: 'Atenção e Foco Musical',
      description: 'Capacidade de manter atenção durante atividades musicais (1-10)',
      required: true,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Atenção muito dispersa, 10 = Foco sustentado durante toda a atividade'
    },
    {
      id: 'sensory_response',
      type: 'textarea',
      label: 'Resposta Sensorial Musical',
      description: 'Como o paciente responde aos diferentes estímulos sonoros',
      placeholder: 'Ex: Demonstra preferência por sons graves, sensibilidade a volumes altos, atração por texturas instrumentais específicas...',
      required: false,
      guidance: 'Observe padrões de resposta sensorial aos estímulos musicais'
    },
    {
      id: 'recommendations',
      type: 'textarea',
      label: 'Encaminhamentos e Recomendações',
      description: 'Continuidade musical terapêutica',
      placeholder: 'Ex: Continuidade das sessões semanais com expansão do repertório instrumental...',
      required: true,
      guidance: 'Inclua sugestões de continuidade e uso da música no cotidiano'
    },
    {
      id: 'home_activities',
      type: 'textarea',
      label: 'Atividades para Casa',
      description: 'Sugestões de atividades musicais para o ambiente familiar',
      placeholder: 'Ex: Escuta de playlist específica, momentos de dança livre, exploração de objetos sonoros em casa...',
      required: false,
      guidance: 'Atividades simples que a família pode implementar'
    },
    // Evolução do Paciente (Etapa 4) - continuação
    {
      id: 'behavioral_changes',
      type: 'textarea',
      label: 'Mudanças Comportamentais',
      description: 'Alterações comportamentais observadas',
      placeholder: 'Ex: Redução de comportamentos estereotipados durante atividades musicais, aumento do contato visual...',
      required: false,
      guidance: 'Descreva mudanças comportamentais positivas relacionadas à musicoterapia'
    },
    {
      id: 'skill_improvements',
      type: 'textarea',
      label: 'Melhorias nas Habilidades',
      description: 'Desenvolvimento de habilidades específicas',
      placeholder: 'Ex: Melhoria na coordenação motora fina, desenvolvimento da linguagem através do canto...',
      required: false,
      guidance: 'Habilidades específicas que evoluíram com a musicoterapia'
    },
    
    // Encaminhamentos e Recomendações (Etapa 5) - continuação
    {
      id: 'family_guidance',
      type: 'textarea',
      label: 'Orientações para a Família',
      description: 'Orientações específicas para os familiares',
      placeholder: 'Ex: Incluir música nas rotinas diárias, estimular exploração de instrumentos em casa...',
      required: false,
      guidance: 'Orientações práticas para os familiares sobre o uso da música no cotidiano'
    },
    
    // Conclusão (Etapa 6)
    {
      id: 'conclusion',
      type: 'textarea',
      label: 'Conclusão',
      description: 'Síntese do impacto musical terapêutico',
      placeholder: 'Ex: A musicoterapia tem se mostrado uma ferramenta eficaz para o desenvolvimento comunicativo e emocional...',
      required: true,
      guidance: 'Resumo do papel da música no desenvolvimento do paciente'
    },
    {
      id: 'treatment_summary',
      type: 'textarea',
      label: 'Resumo do Tratamento',
      description: 'Síntese geral do processo terapêutico',
      placeholder: 'Ex: Durante o período avaliado, o paciente apresentou progressos significativos...',
      required: false,
      guidance: 'Resumo geral dos resultados obtidos no período'
    },
    
    // Observações Complementares (Etapa 7)
    {
      id: 'complementary_observations',
      type: 'textarea',
      label: 'Observações Complementares',
      description: 'Informações adicionais relevantes',
      placeholder: 'Ex: Observações sobre preferências musicais específicas, reações a determinados instrumentos...',
      required: false,
      guidance: 'Informações complementares que possam ser úteis para o tratamento'
    },
    {
      id: 'additional_notes',
      type: 'textarea',
      label: 'Anotações Adicionais',
      description: 'Notas complementares',
      placeholder: 'Ex: Observações gerais, sugestões para próximas sessões...',
      required: false,
      guidance: 'Qualquer informação adicional relevante'
    },
    
    // Revisão Final (Etapa 8)
    {
      id: 'signature',
      type: 'text',
      label: 'Assinatura Digital',
      description: 'Assinatura do profissional responsável',
      placeholder: 'Nome completo do profissional',
      required: true,
      guidance: 'Digite seu nome completo como assinatura digital do relatório'
    },
    {
      id: 'review_notes',
      type: 'textarea',
      label: 'Notas de Revisão',
      description: 'Observações finais antes da finalização',
      placeholder: 'Ex: Relatório revisado e aprovado para envio...',
      required: false,
      guidance: 'Notas finais de revisão do relatório'
    }
  ]
};