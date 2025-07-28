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
    {
      id: 'conclusion',
      type: 'textarea',
      label: 'Conclusão',
      description: 'Síntese do impacto musical terapêutico',
      placeholder: 'Ex: A musicoterapia tem se mostrado uma ferramenta eficaz para o desenvolvimento comunicativo e emocional...',
      required: true,
      guidance: 'Resumo do papel da música no desenvolvimento do paciente'
    }
  ]
};