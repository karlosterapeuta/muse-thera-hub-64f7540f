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
      required: false,
      guidance: 'Digite o nome completo do paciente que recebe a musicoterapia'
    },
    {
      id: 'patient_age',
      type: 'text',
      label: 'Idade',
      description: 'Idade atual do paciente',
      placeholder: 'Idade do paciente',
      required: false,
      guidance: 'Informe a idade atual do paciente'
    },
    {
      id: 'patient_diagnosis',
      type: 'text',
      label: 'Diagnóstico',
      description: 'Diagnóstico principal',
      placeholder: 'Diagnóstico principal',
      required: false,
      guidance: 'Informe o diagnóstico principal do paciente'
    },
    {
      id: 'session_date',
      type: 'text',
      label: 'Data da Sessão',
      description: 'Data da sessão avaliada',
      placeholder: 'DD/MM/AAAA',
      required: false,
      guidance: 'Data da sessão que está sendo reportada'
    },
    {
      id: 'professional_name',
      type: 'text',
      label: 'Nome do Profissional',
      description: 'Nome do musicoterapeuta',
      placeholder: 'Seu nome completo',
      required: false,
      guidance: 'Digite seu nome completo como musicoterapeuta responsável'
    },
    {
      id: 'professional_registry',
      type: 'text',
      label: 'Registro Profissional',
      description: 'Registro profissional',
      placeholder: 'CRP, CRFa, CREFITO, etc.',
      required: false,
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
      required: false,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Nenhuma resposta, 10 = Resposta muito engajada'
    },
    {
      id: 'rhythm_coordination',
      type: 'scale',
      label: 'Coordenação Rítmica',
      description: 'Avalie a coordenação motora rítmica (1-10)',
      required: false,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Dificuldade severa, 10 = Coordenação excelente'
    },
    {
      id: 'musical_communication',
      type: 'scale',
      label: 'Comunicação Musical',
      description: 'Uso da música para comunicação (1-10)',
      required: false,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Não utiliza música para comunicar, 10 = Comunica-se fluentemente através da música'
    },
    {
      id: 'emotional_regulation',
      type: 'scale',
      label: 'Autorregulação Emocional',
      description: 'Capacidade de regulação emocional através da música (1-10)',
      required: false,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Não consegue se regular, 10 = Autorregula-se efetivamente com música'
    },
    {
      id: 'patient_evolution',
      type: 'textarea',
      label: 'Evolução do Paciente',
      description: 'Progressos através da música',
      placeholder: 'Ex: Demonstra maior interesse e engajamento com instrumentos melódicos. Melhora significativa na atenção compartilhada...',
      required: false,
      guidance: 'Foque em como a música impacta o desenvolvimento do paciente'
    },
    {
      id: 'social_interaction',
      type: 'scale',
      label: 'Interação Social Musical',
      description: 'Nível de interação social durante atividades musicais (1-10)',
      required: false,
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      guidance: '1 = Isolamento completo, 10 = Interação social fluida através da música'
    },
    {
      id: 'attention_focus',
      type: 'scale',
      label: 'Atenção e Foco Musical',
      description: 'Capacidade de manter atenção durante atividades musicais (1-10)',
      required: false,
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
      required: false,
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
    },

    // ===== IDENTIFICAÇÃO CLÍNICA AMPLIADA =====
    { id: 'cid_code', type: 'text', label: 'CID-11 / DSM-5-TR', description: 'Classificação diagnóstica', placeholder: 'Ex: 6A02.0 (CID-11) / 299.00 (DSM-5-TR)', required: false, guidance: 'CID-11 6A02 ou equivalente DSM-5-TR para TEA' },
    { id: 'support_level', type: 'select', label: 'Nível de Suporte', description: 'Nível de suporte segundo DSM-5-TR', required: false, options: ['Nível 1 - Exigindo apoio', 'Nível 2 - Exigindo apoio substancial', 'Nível 3 - Exigindo apoio muito substancial'], guidance: 'Classifique conforme intensidade de suporte necessário' },
    { id: 'comorbidities', type: 'textarea', label: 'Comorbidades', description: 'Diagnósticos associados', placeholder: 'Ex: TDAH, deficiência intelectual leve, TPS, ansiedade, epilepsia...', required: false, guidance: 'Liste comorbidades relevantes ao plano terapêutico' },
    { id: 'current_medications', type: 'textarea', label: 'Medicações em Uso', description: 'Tratamento medicamentoso atual', placeholder: 'Ex: Risperidona 1mg/dia, Metilfenidato 20mg pela manhã...', required: false, guidance: 'Inclua nome, dose e horário das medicações' },
    { id: 'referral_source', type: 'text', label: 'Encaminhamento', description: 'Quem encaminhou o paciente', placeholder: 'Ex: Neuropediatra Dra. Maria Silva', required: false, guidance: 'Profissional ou instância que encaminhou ao serviço' },
    { id: 'treatment_start_date', type: 'text', label: 'Início do Tratamento', description: 'Data de início das sessões', placeholder: 'DD/MM/AAAA', required: false, guidance: 'Data da primeira sessão de musicoterapia' },
    { id: 'session_count', type: 'text', label: 'Nº de Sessões Realizadas', description: 'Total de sessões até o momento', placeholder: 'Ex: 24', required: false, guidance: 'Quantidade total de sessões realizadas' },
    { id: 'session_frequency', type: 'select', label: 'Frequência das Sessões', description: 'Periodicidade do atendimento', required: false, options: ['Semanal', 'Bissemanal', 'Quinzenal', 'Mensal', 'Outra'], guidance: 'Frequência das sessões no plano atual' },
    { id: 'session_duration', type: 'select', label: 'Duração da Sessão', description: 'Tempo médio por sessão', required: false, options: ['30 minutos', '45 minutos', '50 minutos', '60 minutos', '90 minutos'], guidance: 'Duração padrão de cada sessão' },

    // ===== IDENTIDADE SONORA (ISO de Benenzon) =====
    { id: 'iso_gestational', type: 'textarea', label: 'ISO Gestacional', description: 'Sons e ritmos do período pré-natal', placeholder: 'Ex: Resposta a batimentos cardíacos lentos, sons graves e contínuos remetentes ao ambiente intrauterino...', required: false, guidance: 'Padrões sonoros vinculados à experiência pré-natal e perinatal' },
    { id: 'iso_universal', type: 'textarea', label: 'ISO Universal', description: 'Identidades sonoras comuns à espécie humana', placeholder: 'Ex: Resposta consistente a sons da natureza, voz humana materna, padrões rítmicos universais...', required: false, guidance: 'Sons compartilhados pela experiência humana universal' },
    { id: 'iso_cultural', type: 'textarea', label: 'ISO Cultural', description: 'Repertório musical da cultura do paciente', placeholder: 'Ex: Forte vínculo com canções de roda brasileiras, MPB, música sacra católica...', required: false, guidance: 'Música da cultura familiar e social do paciente' },
    { id: 'iso_complementary', type: 'textarea', label: 'ISO Complementar', description: 'Identidades sonoras pontuais', placeholder: 'Ex: Resposta atípica a sons de desenhos animados específicos (Pocoyo, Bob Esponja)...', required: false, guidance: 'Sons significativos do cotidiano e mídia do paciente' },
    { id: 'iso_group', type: 'textarea', label: 'ISO Grupal', description: 'Sons do grupo familiar/social', placeholder: 'Ex: Repertório musical compartilhado com a família, rituais sonoros domésticos...', required: false, guidance: 'Padrões sonoros do contexto familiar e grupal' },
    { id: 'sound_preferences', type: 'textarea', label: 'Preferências e Aversões Sonoras', description: 'Timbres preferidos e aversivos', placeholder: 'Ex: Preferência: violão e xilofone. Aversão: pratos, apitos e sons agudos súbitos...', required: false, guidance: 'Mapeie timbres, frequências e dinâmicas preferidas/aversivas' },
    { id: 'musical_repertoire_favorites', type: 'textarea', label: 'Repertório Significativo', description: 'Canções de maior impacto terapêutico', placeholder: 'Ex: "Ciranda Cirandinha", "Atirei o Pau no Gato", tema de abertura do desenho favorito...', required: false, guidance: 'Liste canções com forte ressonância emocional' },

    // ===== AVALIAÇÃO SENSÓRIO-MUSICAL =====
    { id: 'auditory_processing', type: 'scale', label: 'Processamento Auditivo', description: 'Capacidade de processar estímulos auditivos (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Processamento prejudicado, 10 = Processamento eficiente' },
    { id: 'sound_tolerance', type: 'scale', label: 'Tolerância a Volume/Timbre', description: 'Tolerância a intensidades sonoras (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Hipersensibilidade severa, 10 = Tolerância plena' },
    { id: 'vestibular_response_music', type: 'scale', label: 'Resposta Vestibular ao Ritmo', description: 'Resposta corporal ao ritmo (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Sem resposta corporal, 10 = Sincronia corporal plena' },
    { id: 'tactile_instrument_response', type: 'scale', label: 'Resposta Tátil a Instrumentos', description: 'Aceitação tátil dos instrumentos (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Esquiva tátil severa, 10 = Exploração tátil rica' },
    { id: 'proprioceptive_response', type: 'scale', label: 'Resposta Proprioceptiva', description: 'Consciência corporal durante a música (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Pouca consciência, 10 = Consciência corporal integrada' },
    { id: 'sensory_seeking_vs_avoiding', type: 'select', label: 'Perfil Sensorial', description: 'Padrão sensorial predominante', required: false, options: ['Predominantemente buscador', 'Predominantemente evitador', 'Misto - buscador e evitador', 'Hipo-responsivo', 'Hiper-responsivo'], guidance: 'Classifique conforme modelo de Dunn (Sensory Profile)' },
    { id: 'sensory_profile_notes', type: 'textarea', label: 'Síntese do Perfil Sensorial', description: 'Observações qualitativas', placeholder: 'Ex: Paciente apresenta hipersensibilidade auditiva a sons agudos, buscando sons graves e vibrações táteis...', required: false, guidance: 'Síntese integrada do perfil sensorial observado' },

    // ===== AVALIAÇÃO IMTAP - DOMÍNIOS CLÍNICOS =====
    { id: 'domain_musicality', type: 'scale', label: 'Musicalidade Geral', description: 'Ritmo, melodia, dinâmica (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Avalie capacidade musical global (IMTAP)' },
    { id: 'domain_communication_verbal', type: 'scale', label: 'Comunicação Verbal Musical', description: 'Verbalização durante a música (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Sem verbalização, 10 = Comunicação verbal fluida' },
    { id: 'domain_communication_nonverbal', type: 'scale', label: 'Comunicação Não-Verbal', description: 'Gestos, mímica e expressões (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Comunicação gestual e expressiva durante atividades musicais' },
    { id: 'domain_social_interaction', type: 'scale', label: 'Interação Social Musical', description: 'Engajamento social via música (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Reciprocidade e iniciativa social em contexto musical' },
    { id: 'domain_emotional', type: 'scale', label: 'Expressão e Regulação Emocional', description: 'Manejo emocional musical (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Capacidade de expressar e regular emoções através da música' },
    { id: 'domain_cognitive', type: 'scale', label: 'Cognição', description: 'Atenção, memória, sequenciamento (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Funções cognitivas mobilizadas pelas atividades musicais' },
    { id: 'domain_motor_gross', type: 'scale', label: 'Motricidade Ampla', description: 'Coordenação motora grossa (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Movimentos amplos, dança e marcha musical' },
    { id: 'domain_motor_fine', type: 'scale', label: 'Motricidade Fina', description: 'Manuseio instrumental (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Precisão no manuseio de instrumentos musicais' },
    { id: 'domain_sensory_integration', type: 'scale', label: 'Integração Sensorial', description: 'Integração multissensorial (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Capacidade de integrar estímulos auditivos, visuais, táteis e proprioceptivos' },
    { id: 'domain_autonomy', type: 'scale', label: 'Autonomia Musical', description: 'Iniciativa e escolha musical (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Capacidade de fazer escolhas musicais independentes' },
    { id: 'domain_evidences', type: 'textarea', label: 'Evidências Clínicas dos Domínios', description: 'Observações que sustentam as escalas', placeholder: 'Ex: Domínio musicalidade: mantém pulso por 4 compassos consecutivos em compasso 4/4. Domínio social: iniciou 3 trocas musicais espontâneas...', required: false, guidance: 'Evidências observacionais que justificam as pontuações dos domínios IMTAP' },

    // ===== SESSÃO ESTRUTURADA - EXPANSÃO =====
    { id: 'session_setting', type: 'select', label: 'Setting Terapêutico', description: 'Configuração do atendimento', required: false, options: ['Individual', 'Dupla', 'Grupo pequeno (3-5)', 'Grupo (6+)', 'Familiar', 'Tele-musicoterapia'], guidance: 'Modalidade do setting clínico utilizado' },
    { id: 'session_structure', type: 'textarea', label: 'Estrutura da Sessão', description: 'Sequência clínica da sessão', placeholder: 'Ex: 1) Hello song (5min) 2) Aquecimento rítmico (10min) 3) Exploração instrumental dirigida (15min) 4) Improvisação clínica (10min) 5) Good-bye song (5min)...', required: false, guidance: 'Descreva a estrutura ritualizada da sessão' },
    { id: 'improvisation_use', type: 'textarea', label: 'Improvisação Clínica (Bruscia)', description: 'Uso clínico da improvisação musical', placeholder: 'Ex: Improvisação referencial com paciente respondendo a propostas melódicas no xilofone pentatônico...', required: false, guidance: 'Modelo Bruscia - improvisação clínica referencial ou não-referencial' },
    { id: 'receptive_techniques', type: 'textarea', label: 'Técnicas Receptivas', description: 'Audição musical dirigida e GIM', placeholder: 'Ex: Audição relaxante com música clássica, GIM adaptado, paisagens sonoras direcionadas...', required: false, guidance: 'Atividades em que o paciente é receptor musical' },
    { id: 'recreative_techniques', type: 'textarea', label: 'Técnicas Recriativas', description: 'Canto, performance e reprodução musical', placeholder: 'Ex: Canto de canções funcionais, reprodução de padrões rítmicos, performance vocal estruturada...', required: false, guidance: 'Atividades de reprodução e execução musical' },
    { id: 'compositional_techniques', type: 'textarea', label: 'Técnicas Composicionais', description: 'Songwriting e criação musical', placeholder: 'Ex: Songwriting terapêutico com adaptação de letras a vivências do paciente, composição coletiva...', required: false, guidance: 'Criação e composição musical com finalidade terapêutica' },
    { id: 'tempo_dynamics_used', type: 'textarea', label: 'Andamentos e Dinâmicas', description: 'Tempi e dinâmicas exploradas', placeholder: 'Ex: Largo (60 bpm) para regulação; Allegro (120 bpm) para ativação; dinâmicas piano-forte para discriminação...', required: false, guidance: 'Andamentos (BPM) e variações dinâmicas trabalhadas' },
    { id: 'vocal_work', type: 'textarea', label: 'Trabalho Vocal', description: 'Vocalizações e canto trabalhados', placeholder: 'Ex: Imitação vocal de glissandos, vocalizes em sílabas funcionais (ma, pa, ba), canto melódico em terça...', required: false, guidance: 'Especifique trabalho vocal/canto na sessão' },

    // ===== ANÁLISE COMPORTAMENTAL =====
    { id: 'eye_contact_quality', type: 'scale', label: 'Qualidade do Contato Visual', description: 'Contato visual durante a música (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Ausente, 10 = Contato visual consistente e funcional' },
    { id: 'joint_attention', type: 'scale', label: 'Atenção Compartilhada', description: 'Atenção conjunta musical (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Ausente, 10 = Atenção compartilhada plena' },
    { id: 'stereotypies_during_music', type: 'textarea', label: 'Estereotipias Durante a Música', description: 'Comportamentos repetitivos observados', placeholder: 'Ex: Balanceio rítmico do tronco sincronizado ao pulso musical (autorregulatório); flapping reduzido durante audição calma...', required: false, guidance: 'Descreva estereotipias e sua relação com os estímulos musicais' },
    { id: 'self_regulation_strategies', type: 'textarea', label: 'Estratégias de Autorregulação', description: 'Recursos musicais de autorregulação', placeholder: 'Ex: Busca espontaneamente o tambor xamânico para autorregulação após momentos de desorganização...', required: false, guidance: 'Estratégias musicais que o paciente utiliza para se regular' },
    { id: 'meltdown_shutdown_episodes', type: 'textarea', label: 'Episódios de Meltdown/Shutdown', description: 'Crises e shutdowns observados', placeholder: 'Ex: Nenhum episódio na sessão. Uso preventivo de música calma evitou desorganização em transição...', required: false, guidance: 'Registre crises e estratégias musicais utilizadas para manejo' },
    { id: 'transitions_response', type: 'textarea', label: 'Resposta a Transições', description: 'Manejo de mudanças e transições', placeholder: 'Ex: Transições facilitadas por canção-ponte. Resistência inicial ao encerramento manejada com good-bye song...', required: false, guidance: 'Como o paciente responde a mudanças mediadas por música' },
    { id: 'imitation_skills', type: 'scale', label: 'Imitação Musical', description: 'Capacidade de imitação (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: 'Imitação de padrões rítmicos, melódicos e gestuais' },
    { id: 'turn_taking_musical', type: 'scale', label: 'Alternância de Turnos Musicais', description: 'Reciprocidade musical (1-10)', required: false, options: ['1','2','3','4','5','6','7','8','9','10'], guidance: '1 = Sem alternância, 10 = Alternância fluida e consistente' },

    // ===== COMUNICAÇÃO E LINGUAGEM =====
    { id: 'vocalizations_observed', type: 'textarea', label: 'Vocalizações Observadas', description: 'Sons vocais produzidos', placeholder: 'Ex: Vocalizes melódicos espontâneos em "lá-lá-lá", emissão de fonemas vocálicos sustentados...', required: false, guidance: 'Descreva vocalizações livres e induzidas' },
    { id: 'verbal_output_during_music', type: 'textarea', label: 'Produção Verbal Durante a Música', description: 'Falas observadas em contexto musical', placeholder: 'Ex: Verbalização espontânea de palavra-chave da canção; pedido funcional "mais" durante atividade preferida...', required: false, guidance: 'Verbalizações funcionais facilitadas pelo contexto musical' },
    { id: 'echolalia_musical', type: 'textarea', label: 'Ecolalia Musical', description: 'Repetições musicais observadas', placeholder: 'Ex: Ecolalia diferida funcional de trecho da música-tema da sessão; ecolalia imediata melódica de frases curtas...', required: false, guidance: 'Distinga ecolalia funcional/comunicativa de não-funcional' },
    { id: 'aac_use', type: 'textarea', label: 'Uso de CAA', description: 'Comunicação aumentativa e alternativa', placeholder: 'Ex: Utiliza PECS com figuras de instrumentos musicais para fazer pedidos; pranchas com canções favoritas...', required: false, guidance: 'CAA integrada ao setting musicoterapêutico' },
    { id: 'pragmatic_skills', type: 'textarea', label: 'Habilidades Pragmáticas', description: 'Funcionalidade comunicativa musical', placeholder: 'Ex: Demonstra função de pedir (instrumento favorito), comentar (apontar para som), recusar (afastar instrumento)...', required: false, guidance: 'Funções pragmáticas comunicativas mobilizadas pela música' },

    // ===== EVOLUÇÃO CLÍNICA - EXPANSÃO =====
    { id: 'evolution_compared_baseline', type: 'textarea', label: 'Comparativo com Linha de Base', description: 'Evolução em relação à avaliação inicial', placeholder: 'Ex: Em relação à avaliação inicial (jan/2025), houve evolução de 3→7 na escala de interação social musical...', required: false, guidance: 'Compare quantitativamente com avaliação inicial' },
    { id: 'goals_achieved', type: 'textarea', label: 'Objetivos Alcançados', description: 'Metas concluídas no período', placeholder: 'Ex: 1) Manter pulso musical por 8 compassos consecutivos; 2) Iniciar trocas musicais espontâneas; 3) Tolerar 30min de sessão...', required: false, guidance: 'Liste objetivos atingidos com evidências' },
    { id: 'goals_in_progress', type: 'textarea', label: 'Objetivos em Progresso', description: 'Metas em andamento', placeholder: 'Ex: 1) Vocalizar fonemas vocálicos em canção (50% das tentativas); 2) Compartilhar instrumento por 1min...', required: false, guidance: 'Objetivos com evolução parcial' },
    { id: 'goals_not_achieved', type: 'textarea', label: 'Objetivos Não Alcançados', description: 'Metas não atingidas e hipóteses', placeholder: 'Ex: Tolerar grupo de 3 pacientes - hipótese: nível de suporte 2 requer adaptação gradual com 1 par antes...', required: false, guidance: 'Inclua hipóteses sobre não atingimento' },
    { id: 'quantitative_indicators', type: 'textarea', label: 'Indicadores Quantitativos', description: 'Dados objetivos do progresso', placeholder: 'Ex: Frequência de iniciativas musicais: 2→8 por sessão. Duração de atenção sustentada: 3→12 min...', required: false, guidance: 'Use métricas objetivas (frequência, duração, latência)' },

    // ===== PLANO TERAPÊUTICO FUTURO =====
    { id: 'next_objectives_short', type: 'textarea', label: 'Objetivos de Curto Prazo (1-3 meses)', description: 'Próximos objetivos imediatos', placeholder: 'Ex: Ampliar repertório de canções funcionais; introduzir improvisação em modo pentatônico...', required: false, guidance: 'Objetivos para os próximos 1-3 meses' },
    { id: 'next_objectives_medium', type: 'textarea', label: 'Objetivos de Médio Prazo (3-6 meses)', description: 'Objetivos de médio prazo', placeholder: 'Ex: Inserção gradual em setting de dupla; desenvolvimento de songwriting terapêutico...', required: false, guidance: 'Metas para o próximo semestre' },
    { id: 'next_objectives_long', type: 'textarea', label: 'Objetivos de Longo Prazo (6-12 meses)', description: 'Objetivos amplos', placeholder: 'Ex: Generalização das habilidades musicais para contexto escolar e familiar; performance em pequeno grupo...', required: false, guidance: 'Metas anuais e ampliadas' },
    { id: 'proposed_interventions', type: 'textarea', label: 'Intervenções Propostas', description: 'Técnicas e abordagens propostas', placeholder: 'Ex: Introduzir Neurologic Music Therapy (NMT) com Auditory Motor Mapping Training (AMMT) para vocalização...', required: false, guidance: 'Intervenções específicas para o próximo período' },
    { id: 'expected_outcomes', type: 'textarea', label: 'Resultados Esperados', description: 'Prognóstico terapêutico', placeholder: 'Ex: Espera-se aumento de 30% no engajamento social musical e ampliação de vocabulário funcional...', required: false, guidance: 'Resultados esperados ao final do próximo ciclo' },
    { id: 'revaluation_date', type: 'text', label: 'Data de Reavaliação', description: 'Próxima reavaliação prevista', placeholder: 'DD/MM/AAAA', required: false, guidance: 'Data prevista para reavaliação formal' },

    // ===== ORIENTAÇÕES AMPLIADAS =====
    { id: 'school_recommendations', type: 'textarea', label: 'Orientações à Escola', description: 'Recomendações para o ambiente escolar', placeholder: 'Ex: Permitir uso de fones com música regulatória em momentos de transição; incluir canções funcionais na rotina...', required: false, guidance: 'Estratégias musicais aplicáveis no contexto escolar' },
    { id: 'interdisciplinary_team_notes', type: 'textarea', label: 'Articulação com Equipe', description: 'Comunicação com equipe interdisciplinar', placeholder: 'Ex: Sugere-se articulação com fonoaudiologia para AMMT; com TO para integração sensorial musical...', required: false, guidance: 'Notas para fonoaudiologia, TO, psicologia, neuropediatria' },
    { id: 'playlist_recommended', type: 'textarea', label: 'Playlist Recomendada', description: 'Sugestão musical para casa', placeholder: 'Ex: Manhã (ativação): canções rítmicas em 100-120 bpm. Noite (regulação): canções de ninar tradicionais...', required: false, guidance: 'Repertório recomendado para uso doméstico' },
    { id: 'red_flags_to_monitor', type: 'textarea', label: 'Sinais de Alerta para Monitorar', description: 'Sinais que requerem atenção', placeholder: 'Ex: Aumento súbito de hipersensibilidade auditiva; recusa total a estímulos musicais por mais de 2 semanas...', required: false, guidance: 'Sinais que devem ser reportados ao musicoterapeuta' },

    // ===== FUNDAMENTAÇÃO TEÓRICA =====
    { id: 'theoretical_framework', type: 'textarea', label: 'Abordagem Teórica', description: 'Modelo(s) teórico(s) adotado(s)', placeholder: 'Ex: Modelo Nordoff-Robbins (Creative Music Therapy) integrado com princípios da Musicoterapia Benenzon e Neurologic Music Therapy...', required: false, guidance: 'Fundamentação teórica que orienta a prática clínica' },
    { id: 'assessment_tools_used', type: 'textarea', label: 'Instrumentos de Avaliação', description: 'Escalas e protocolos aplicados', placeholder: 'Ex: IMTAP (Individualized Music Therapy Assessment Profile), MAKS, Avaliação Benenzon, observação clínica estruturada...', required: false, guidance: 'Liste instrumentos formais e informais utilizados' },
    { id: 'references_cited', type: 'textarea', label: 'Referências Bibliográficas', description: 'Bibliografia consultada', placeholder: 'Ex: Bruscia, K. (2014). Defining Music Therapy. Geretsegger et al. (2014). Music therapy for ASD - Cochrane Review...', required: false, guidance: 'Referências em formato ABNT ou APA' }
  ]
};
/**
 * Estrutura de seções clínicas do relatório.
 * Usada por PDF e Preview para renderizar dinamicamente apenas seções com dados preenchidos.
 */
export interface ReportSection {
  id: string;
  title: string;
  fieldIds: string[];
}

/** Campos de escala (1-10) - usados na tabela resumo quantitativo */
export const scaleFieldIds = [
  'musical_response_scale','rhythm_coordination','musical_communication','emotional_regulation',
  'social_interaction','attention_focus',
  'auditory_processing','sound_tolerance','vestibular_response_music','tactile_instrument_response','proprioceptive_response',
  'domain_musicality','domain_communication_verbal','domain_communication_nonverbal','domain_social_interaction',
  'domain_emotional','domain_cognitive','domain_motor_gross','domain_motor_fine','domain_sensory_integration','domain_autonomy'
];

export const reportSections: ReportSection[] = [
  { id: 'clinical_identification', title: 'Identificação Clínica', fieldIds: ['cid_code','support_level','comorbidities','current_medications','referral_source','treatment_start_date','session_count','session_frequency','session_duration'] },
  { id: 'iso_identity', title: 'Identidade Sonora (ISO de Benenzon)', fieldIds: ['iso_gestational','iso_universal','iso_cultural','iso_complementary','iso_group','sound_preferences','musical_repertoire_favorites'] },
  { id: 'sensory_profile', title: 'Avaliação Sensório-Musical', fieldIds: ['auditory_processing','sound_tolerance','vestibular_response_music','tactile_instrument_response','proprioceptive_response','sensory_seeking_vs_avoiding','sensory_profile_notes'] },
  { id: 'imtap_domains', title: 'Avaliação Clínica - Domínios IMTAP', fieldIds: ['domain_musicality','domain_communication_verbal','domain_communication_nonverbal','domain_social_interaction','domain_emotional','domain_cognitive','domain_motor_gross','domain_motor_fine','domain_sensory_integration','domain_autonomy','domain_evidences'] },
  { id: 'session_details', title: 'Detalhamento Clínico da Sessão', fieldIds: ['session_setting','session_structure','improvisation_use','receptive_techniques','recreative_techniques','compositional_techniques','tempo_dynamics_used','vocal_work'] },
  { id: 'communication_language', title: 'Comunicação e Linguagem', fieldIds: ['vocalizations_observed','verbal_output_during_music','echolalia_musical','aac_use','pragmatic_skills'] },
  { id: 'evolution_detailed', title: 'Evolução Clínica Detalhada', fieldIds: ['evolution_compared_baseline','goals_achieved','goals_in_progress','goals_not_achieved','quantitative_indicators'] },
  { id: 'future_plan', title: 'Plano Terapêutico Futuro', fieldIds: ['next_objectives_short','next_objectives_medium','next_objectives_long','proposed_interventions','expected_outcomes','revaluation_date'] },
  { id: 'extended_guidance', title: 'Orientações Ampliadas', fieldIds: ['school_recommendations','interdisciplinary_team_notes','playlist_recommended','red_flags_to_monitor'] },
  { id: 'theoretical_foundation', title: 'Fundamentação Teórica e Referências', fieldIds: ['theoretical_framework','assessment_tools_used','references_cited'] },
];
