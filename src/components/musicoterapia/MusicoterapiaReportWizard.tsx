import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Wand2, Music, Brain, Heart, Target, Home, Check, Sparkles, Info, BookOpen, MessageSquare, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData, type ReportField } from '@/data/musicoterapiaTemplate';
import { MusicoterapiaFormField } from './MusicoterapiaFormField';
import { MusicoterapiaQuickFill } from './MusicoterapiaQuickFill';
import { FinalReviewSection } from './FinalReviewSection';
import { BasicInformationSection } from './BasicInformationSection';
import { MusicoterapiaGuidance } from './MusicoterapiaGuidance';

interface MusicoterapiaReportWizardProps {
  reportData: Partial<ReportData>;
  onUpdateData: (data: Partial<ReportData>) => void;
  onGenerateWithAI: (keyPoints: string) => void;
  isGeneratingWithAI: boolean;
  patients: any[];
  onSaveReport: () => void;
  isSaving: boolean;
  professionalData?: any;
}

const STEPS = [
  {
    id: 'basic_info',
    title: '1. Informações Básicas',
    description: 'Dados do paciente e profissional',
    icon: Target,
    fields: ['patient_name', 'patient_age', 'patient_diagnosis', 'session_date', 'professional_name', 'professional_registry']
  },
  {
    id: 'therapeutic_objectives',
    title: '2. Objetivos Terapêuticos',
    description: 'Metas e planejamento',
    icon: Target,
    fields: ['therapeutic_objectives', 'specific_goals']
  },
  {
    id: 'session_activities',
    title: '3. Sessão e Atividades',
    description: 'Detalhamento clínico das técnicas',
    icon: Music,
    fields: ['session_setting', 'session_structure', 'session_activities', 'instruments_used', 'musical_techniques', 'musical_genres', 'improvisation_use', 'receptive_techniques', 'recreative_techniques', 'compositional_techniques', 'tempo_dynamics_used', 'vocal_work']
  },
  {
    id: 'communication_language',
    title: '4. Comunicação e Linguagem',
    description: 'Vocalizações, CAA e pragmática',
    icon: Music,
    fields: ['vocalizations_observed', 'verbal_output_during_music', 'echolalia_musical', 'aac_use', 'pragmatic_skills']
  },
  {
    id: 'patient_evolution',
    title: '5. Evolução do Paciente',
    description: 'Comparativos, metas e indicadores',
    icon: Heart,
    fields: ['patient_evolution', 'behavioral_changes', 'skill_improvements', 'evolution_compared_baseline', 'goals_achieved', 'goals_in_progress', 'goals_not_achieved', 'quantitative_indicators']
  },
  {
    id: 'future_plan',
    title: '6. Plano Terapêutico Futuro',
    description: 'Próximos passos e prognóstico',
    icon: Target,
    fields: ['next_objectives_short', 'next_objectives_medium', 'next_objectives_long', 'proposed_interventions', 'expected_outcomes', 'revaluation_date']
  },
  {
    id: 'recommendations',
    title: '7. Encaminhamentos',
    description: 'Família, escola e equipe',
    icon: Home,
    fields: ['recommendations', 'home_activities', 'family_guidance', 'school_recommendations', 'interdisciplinary_team_notes', 'playlist_recommended', 'red_flags_to_monitor']
  },
  {
    id: 'theoretical_foundation',
    title: '8. Fundamentação Teórica',
    description: 'Abordagens e referências',
    icon: Brain,
    fields: ['theoretical_framework', 'assessment_tools_used', 'references_cited']
  },
  {
    id: 'conclusion',
    title: '9. Conclusão',
    description: 'Síntese e resumo',
    icon: Brain,
    fields: ['conclusion', 'treatment_summary']
  },
  {
    id: 'complementary_observations',
    title: '10. Observações Complementares',
    description: 'Notas adicionais',
    icon: Heart,
    fields: ['complementary_observations', 'additional_notes']
  },
  {
    id: 'final_review',
    title: '11. Revisão Final',
    description: 'Verificação e finalização',
    icon: Target,
    fields: ['signature', 'review_notes']
  }
];

const STEP_HINTS: Record<string, { icon: React.ElementType; title: string; description: string }> = {
  basic_info: { icon: Info, title: 'Identificação clínica', description: 'Confirme dados do paciente e do profissional antes de prosseguir. Esses dados aparecem no cabeçalho do relatório final.' },
  therapeutic_objectives: { icon: Target, title: 'Objetivos terapêuticos', description: 'Descreva metas claras, mensuráveis e individualizadas. Quanto mais específicas, mais sólido o relatório.' },
  session_activities: { icon: Music, title: 'Sessão e técnicas', description: 'Detalhe setting, técnicas (receptivas, recriativas, improvisacionais, compositivas) e instrumentos utilizados.' },
  communication_language: { icon: MessageSquare, title: 'Comunicação e linguagem', description: 'Registre vocalizações, ecolalia, CAA e habilidades pragmáticas observadas durante o fazer musical.' },
  patient_evolution: { icon: Heart, title: 'Evolução clínica', description: 'Compare com a linha de base e descreva ganhos observáveis, indicadores quantitativos e metas atingidas.' },
  future_plan: { icon: Target, title: 'Plano futuro', description: 'Estruture objetivos de curto, médio e longo prazo, com prognóstico e data de reavaliação.' },
  recommendations: { icon: Home, title: 'Encaminhamentos', description: 'Oriente família, escola e equipe interdisciplinar com recomendações práticas e sinais de alerta.' },
  theoretical_foundation: { icon: BookOpen, title: 'Fundamentação teórica', description: 'Cite o referencial (Benenzon, Bruscia, Nordoff-Robbins, IMTAP) e ferramentas de avaliação utilizadas.' },
  conclusion: { icon: Sparkles, title: 'Conclusão', description: 'Sintetize achados, ganhos e direção do tratamento de forma clara e objetiva.' },
  complementary_observations: { icon: ClipboardList, title: 'Observações complementares', description: 'Adicione contextos relevantes que não couberam nas seções anteriores.' },
  final_review: { icon: Check, title: 'Revisão final', description: 'Revise todas as seções, organize com IA se desejar e finalize o relatório.' },
};

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  values: Record<string, string>;
}

const STEP_TEMPLATES: Record<string, TemplateOption[]> = {
  communication_language: [
    {
      id: 'verbal_emerging',
      label: 'Comunicação verbal emergente',
      description: 'Paciente com vocalizações e produção verbal em desenvolvimento.',
      values: {
        vocalizations_observed: 'Paciente apresenta vocalizações espontâneas durante atividades musicais, com variação de altura e intensidade, especialmente em resposta a estímulos melódicos preferidos.',
        verbal_output_during_music: 'Observa-se aumento da produção verbal durante o canto e atividades rítmicas, com tentativas de acompanhar trechos de canções familiares.',
        echolalia_musical: 'Ecolalia musical ocasional, com repetição de palavras-chave de canções logo após o terapeuta.',
        aac_use: 'Não utiliza CAA no momento. Comunicação predominantemente verbal e gestual.',
        pragmatic_skills: 'Habilidades pragmáticas em desenvolvimento, com iniciativa comunicativa crescente em contexto musical estruturado e troca de turnos com apoio do terapeuta.'
      }
    },
    {
      id: 'nonverbal_caa',
      label: 'Não-verbal com CAA',
      description: 'Paciente não-verbal que utiliza Comunicação Aumentativa e Alternativa.',
      values: {
        vocalizations_observed: 'Paciente apresenta vocalizações pré-linguísticas (sons vocálicos prolongados, balbucios) durante atividades musicais, em especial diante de estímulos rítmicos preferidos.',
        verbal_output_during_music: 'Sem produção verbal significativa. Comunicação ocorre por meio de gestos, expressões faciais e uso do sistema de CAA.',
        echolalia_musical: 'Ausência de ecolalia verbal; observa-se imitação rítmica e melódica corporal.',
        aac_use: 'Utiliza sistema de Comunicação Aumentativa e Alternativa (pranchas de PCS / aplicativo de CAA) durante a sessão para indicar instrumentos, músicas e estados emocionais.',
        pragmatic_skills: 'Pragmática emergente com apoio de CAA: realiza pedidos, escolhas e protestos por meio dos recursos comunicativos disponíveis durante atividades musicais.'
      }
    },
    {
      id: 'echolalic_functional',
      label: 'Ecolalia funcional',
      description: 'Paciente com ecolalia musical como recurso comunicativo principal.',
      values: {
        vocalizations_observed: 'Vocalizações ricas, com variação prosódica vinculadas a fragmentos melódicos de canções conhecidas.',
        verbal_output_during_music: 'Produção verbal predominantemente vinculada a trechos de canções, jingles e falas de mídia, utilizados de forma contextual.',
        echolalia_musical: 'Ecolalia musical funcional acentuada, com uso de refrões e fragmentos de canções como forma de comunicação, autorregulação e solicitação.',
        aac_use: 'Não utiliza CAA formal; a própria ecolalia musical funciona como recurso comunicativo.',
        pragmatic_skills: 'Pragmática mediada por ecolalia: o paciente utiliza trechos musicais para pedir, comentar e expressar afeto, com gradual ampliação do uso espontâneo e funcional.'
      }
    },
    {
      id: 'minimally_verbal',
      label: 'Minimamente verbal',
      description: 'Paciente com vocabulário restrito e produção verbal limitada.',
      values: {
        vocalizations_observed: 'Vocalizações pontuais com predomínio de vogais abertas e consoantes plosivas, intensificadas em momentos de prazer musical, especialmente diante de instrumentos de percussão e canções com refrões repetitivos.',
        verbal_output_during_music: 'Produção verbal limitada a palavras isoladas (5 a 15 palavras funcionais), com aumento notável de tentativas vocais durante atividades de canto compartilhado e preenchimento de lacunas melódicas (fill-in).',
        echolalia_musical: 'Ecolalia musical imediata observada em refrões repetitivos, funcionando como ponte para ampliação do repertório verbal funcional.',
        aac_use: 'Uso emergente de CAA de baixa tecnologia (pranchas temáticas) como suporte à comunicação durante a sessão, especialmente para escolha de canções e instrumentos.',
        pragmatic_skills: 'Pragmática em construção: realiza pedidos simples por meio de gestos, vocalizações e apontar, com aumento da intenção comunicativa em contexto musical estruturado e previsível.'
      }
    },
    {
      id: 'verbal_fluent_pragmatic',
      label: 'Verbal fluente com dificuldades pragmáticas',
      description: 'Paciente com fala fluente, mas alterações pragmáticas e prosódicas.',
      values: {
        vocalizations_observed: 'Vocalizações ricas e variadas, com boa modulação tonal durante o canto, embora apresente prosódia atípica na fala espontânea (entonação monocórdica ou exagerada).',
        verbal_output_during_music: 'Produção verbal fluente e gramaticalmente adequada, com vocabulário expandido. Canta canções completas com letra preservada e demonstra interesse por temas musicais específicos.',
        echolalia_musical: 'Ecolalia musical diferida presente, com reprodução de trechos de canções e jingles em contextos não relacionados, frequentemente com função autorregulatória.',
        aac_use: 'Não utiliza CAA; comunicação predominantemente oral.',
        pragmatic_skills: 'Dificuldades pragmáticas evidentes: alterações em troca de turnos, manutenção de tópico e leitura de pistas sociais. O contexto musical favorece a regulação destes aspectos por meio de regras claras de turno (pergunta-resposta musical, diálogos instrumentais).'
      }
    },
    {
      id: 'gestural_preverbal',
      label: 'Comunicação gestual e pré-verbal',
      description: 'Paciente em fase pré-linguística com comunicação predominantemente gestual.',
      values: {
        vocalizations_observed: 'Balbucio canônico e vocalizações pré-linguísticas com variação de altura e duração, intensificadas em momentos de afinamento afetivo durante o canto da terapeuta.',
        verbal_output_during_music: 'Ausência de produção verbal convencional. Comunicação ocorre por meio de vocalizações, gestos protodeclarativos e protoimperativos, expressões faciais e movimentos corporais sincrônicos à música.',
        echolalia_musical: 'Sem ecolalia verbal. Observa-se imitação rítmica corporal e tentativas de imitação melódica vocal.',
        aac_use: 'Não utiliza CAA formal. Início de exploração de objetos de referência sonoros como suporte à antecipação de atividades.',
        pragmatic_skills: 'Pragmática emergente em nível pré-verbal: atenção compartilhada em construção, contato ocular sustentado durante o canto e iniciativa de aproximação física para solicitar continuidade da música.'
      }
    },
    {
      id: 'bilingual_context',
      label: 'Contexto bilíngue / multicultural',
      description: 'Paciente exposto a mais de um idioma no contexto familiar.',
      values: {
        vocalizations_observed: 'Vocalizações com variação fonológica influenciada pelos dois idiomas de exposição, com produção sonora ampla durante atividades musicais em ambas as línguas.',
        verbal_output_during_music: 'Produção verbal mista, com alternância entre os idiomas (code-switching) durante o canto. Demonstra preferência por canções no idioma materno, com maior engajamento e produção.',
        echolalia_musical: 'Ecolalia musical funcional em ambos os idiomas, com reprodução de fragmentos de canções familiares como recurso comunicativo e regulatório.',
        aac_use: 'CAA não utilizada. Considera-se a possibilidade de prancha bilíngue caso seja indicada futuramente.',
        pragmatic_skills: 'Pragmática adequada à idade desenvolvimental, com adaptações para o contexto bilíngue. O uso de canções nos dois idiomas favorece a integração identitária e comunicativa.'
      }
    },
    {
      id: 'selective_mutism_music',
      label: 'Mutismo seletivo com expressão musical',
      description: 'Paciente que se comunica preferencialmente por meio musical.',
      values: {
        vocalizations_observed: 'Vocalizações presentes exclusivamente em contexto musical seguro, com qualidade sonora preservada durante o canto e ausentes ou raras em contexto verbal direto.',
        verbal_output_during_music: 'Produção verbal significativamente maior durante atividades musicais do que em contextos comunicativos convencionais. O canto funciona como ponte para a expressão verbal.',
        echolalia_musical: 'Ecolalia musical observada como estratégia segura de expressão, frequentemente utilizando trechos de canções para comunicar estados internos.',
        aac_use: 'Não utiliza CAA. O recurso musical funciona como mediador comunicativo principal.',
        pragmatic_skills: 'Pragmática preservada em contexto musical estruturado, com trocas comunicativas via instrumento e canto. Em contexto verbal direto, observa-se inibição comunicativa significativa.'
      }
    },
    {
      id: 'regression_recovery',
      label: 'Pós-regressão / em recuperação',
      description: 'Paciente em processo de recuperação de habilidades comunicativas.',
      values: {
        vocalizations_observed: 'Vocalizações em processo de reorganização, com retomada gradual de variação prosódica e melódica observada inicialmente em contexto musical.',
        verbal_output_during_music: 'Produção verbal em fase de reconstrução: o contexto musical favorece a retomada de palavras e expressões previamente adquiridas, com canções funcionando como âncoras mnemônicas.',
        echolalia_musical: 'Ecolalia musical funcional intensa, atuando como mecanismo de reapropriação da linguagem e da expressão emocional.',
        aac_use: 'Avaliação contínua sobre a necessidade de introdução de CAA como suporte temporário ou permanente, conforme evolução do quadro.',
        pragmatic_skills: 'Habilidades pragmáticas em recuperação progressiva, com retomada gradual de iniciativa comunicativa, atenção compartilhada e troca de turnos, mediadas pela segurança do setting musical.'
      }
    }
  ],
  future_plan: [
    {
      id: 'initial_stage',
      label: 'Início de tratamento',
      description: 'Foco em vínculo, exploração sonora e regulação básica.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Estabelecer vínculo terapêutico; favorecer exploração livre de instrumentos; ampliar tempo de permanência no setting.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver atenção compartilhada em atividades musicais simples; introduzir rotinas sonoras previsíveis.',
        next_objectives_long: 'Longo prazo (6-12 meses): Consolidar repertório de canções funcionais e iniciar trocas musicais recíprocas com o terapeuta.',
        proposed_interventions: 'Intervenções predominantemente receptivas e exploratórias, com base no ISO de Benenzon e adaptações sensoriais individualizadas.',
        expected_outcomes: 'Espera-se maior tolerância ao setting, ampliação do repertório sonoro aceito e início de respostas comunicativas musicais.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com observação clínica sistemática e registro qualitativo.'
      }
    },
    {
      id: 'consolidation',
      label: 'Fase de consolidação',
      description: 'Ampliação de habilidades e generalização para outros contextos.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Ampliar repertório de canções funcionais; consolidar troca de turnos musicais; aumentar tempo de atenção compartilhada.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Desenvolver autorregulação por meio de improvisações estruturadas; estimular comunicação intencional via instrumentos.',
        next_objectives_long: 'Longo prazo (6-12 meses): Promover generalização das habilidades musicais para contextos familiar e escolar.',
        proposed_interventions: 'Intervenções receptivas, recriativas e improvisacionais conforme modelo de Bruscia, com foco em ISO de Benenzon e adaptações sensoriais.',
        expected_outcomes: 'Espera-se evolução nas dimensões comunicativa, socioemocional e sensório-motora, com generalização para contextos familiar e escolar.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com aplicação de escalas IMTAP e registro qualitativo.'
      }
    },
    {
      id: 'advanced',
      label: 'Fase avançada / preparação para alta',
      description: 'Autonomia musical e preparação para alta terapêutica.',
      values: {
        next_objectives_short: 'Curto prazo (1-3 meses): Estimular autonomia na escolha de atividades musicais; consolidar autorregulação via música.',
        next_objectives_medium: 'Médio prazo (3-6 meses): Promover participação em atividades musicais grupais; transferir estratégias para o cotidiano.',
        next_objectives_long: 'Longo prazo (6-12 meses): Preparar alta terapêutica gradual com orientações de continuidade musical em ambiente familiar e/ou escolar.',
        proposed_interventions: 'Intervenções improvisacionais e compositivas centradas na autonomia do paciente, com orientação familiar e interdisciplinar para sustentação dos ganhos.',
        expected_outcomes: 'Espera-se que o paciente utilize a música como recurso autorregulatório e comunicativo de forma autônoma e generalizada.',
        revaluation_date: 'Reavaliação prevista em 3 meses, com discussão de plano de alta junto à equipe interdisciplinar e família.'
      }
    }
  ],
  theoretical_foundation: [
    {
      id: 'benenzon_iso',
      label: 'Modelo Benenzon (ISO)',
      description: 'Fundamentação centrada no Princípio do ISO de Benenzon.',
      values: {
        theoretical_framework: 'O presente relatório fundamenta-se no Modelo Benenzon de Musicoterapia, com ênfase no Princípio do ISO (Identidade Sonora) — gestacional, universal, cultural, complementar e grupal — articulado às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: observação clínica sistematizada, mapeamento do ISO, registro de respostas sonoro-musicais e diário clínico de sessões.',
        references_cited: 'Benenzon, R. (1985). Manual de Musicoterapia. Petrópolis: Vozes. Benenzon, R. (2007). La nueva musicoterapia. Lumen. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'nordoff_robbins',
      label: 'Nordoff-Robbins Criativa',
      description: 'Musicoterapia Criativa de Nordoff-Robbins.',
      values: {
        theoretical_framework: 'A intervenção fundamenta-se na Musicoterapia Criativa de Nordoff-Robbins, que enfatiza a improvisação clínica e o desenvolvimento do "Music Child", articulada às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: escalas Nordoff-Robbins (Child-Therapist Relationship in Coactive Musical Experience e Musical Communicativeness), observação clínica e registro audiovisual de sessões.',
        references_cited: 'Nordoff, P.; Robbins, C. (2007). Creative Music Therapy: A Guide to Fostering Clinical Musicianship. Barcelona Publishers. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    },
    {
      id: 'bruscia_imtap',
      label: 'Bruscia + IMTAP',
      description: 'Modelo de Bruscia com avaliação clínica IMTAP.',
      values: {
        theoretical_framework: 'A prática fundamenta-se no modelo de Kenneth Bruscia (níveis e métodos de musicoterapia — receptivo, recriativo, improvisacional e compositivo) associado aos domínios clínicos da IMTAP (Individualized Music Therapy Assessment Profile), em consonância com as diretrizes do DSM-5-TR e CID-11 para TEA.',
        assessment_tools_used: 'Instrumentos: IMTAP (Baxter et al., 2007), observação clínica sistematizada e registro qualitativo por método.',
        references_cited: 'Bruscia, K. (2000). Definindo Musicoterapia. Enelivros. Baxter, H. T. et al. (2007). The Individualized Music Therapy Assessment Profile (IMTAP). Jessica Kingsley. APA (2022). DSM-5-TR.'
      }
    },
    {
      id: 'integrative',
      label: 'Abordagem integrativa',
      description: 'Combinação de Benenzon, Bruscia, Nordoff-Robbins e IMTAP.',
      values: {
        theoretical_framework: 'O presente relatório fundamenta-se em abordagem integrativa: Modelo Benenzon (Princípio do ISO), Musicoterapia Criativa de Nordoff-Robbins, modelo de Bruscia (níveis e métodos) e domínios clínicos da IMTAP, associados às diretrizes de intervenção em TEA conforme DSM-5-TR e CID-11.',
        assessment_tools_used: 'Instrumentos: IMTAP (Baxter et al., 2007), Escala MuseTera de avaliação musicoterapêutica, mapeamento do ISO, escalas Nordoff-Robbins, observação clínica sistematizada e Perfil Sensorial de Dunn.',
        references_cited: 'Benenzon, R. (1985). Manual de Musicoterapia. Bruscia, K. (2000). Definindo Musicoterapia. Nordoff, P.; Robbins, C. (2007). Creative Music Therapy. Baxter et al. (2007). The Individualized Music Therapy Assessment Profile. APA (2022). DSM-5-TR. OMS (2022). CID-11.'
      }
    }
  ]
};

export function MusicoterapiaReportWizard({ 
  reportData, 
  onUpdateData, 
  onGenerateWithAI, 
  isGeneratingWithAI,
  patients,
  onSaveReport,
  isSaving,
  professionalData
}: MusicoterapiaReportWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [activeField, setActiveField] = useState<string>('');
  const { toast } = useToast();

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleFieldUpdate = useCallback((fieldId: string, value: any) => {
    onUpdateData({
      ...reportData,
      fieldValues: {
        ...reportData.fieldValues,
        [fieldId]: value
      }
    });
  }, [reportData, onUpdateData]);

  const stepContentRef = useRef<HTMLDivElement>(null);

  const scrollToStepContent = () => {
    setTimeout(() => {
      stepContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToStepContent();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToStepContent();
    }
  };

  const handleQuickFillInsert = (text: string) => {
    if (activeField) {
      const currentValue = reportData.fieldValues?.[activeField] || '';
      const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
      handleFieldUpdate(activeField, newValue);
      toast({
        title: "Texto inserido",
        description: "Frase especializada adicionada ao campo atual.",
      });
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<Record<string, string>>({});

  const applyTemplateOption = useCallback((option: TemplateOption) => {
    onUpdateData({
      ...reportData,
      fieldValues: { ...reportData.fieldValues, ...option.values }
    });
    setSelectedTemplate(prev => ({ ...prev, [currentStepData.id]: option.id }));
    toast({
      title: 'Template aplicado',
      description: `"${option.label}" preencheu os campos desta etapa. Edite livremente.`
    });
  }, [currentStepData.id, reportData, onUpdateData, toast]);

  const validateCurrentStep = () => {
    // Validação especial para a primeira etapa (Informações Básicas)
    if (currentStep === 0) {
      const missingFields = [];
      
      if (!reportData.patientName?.trim()) {
        missingFields.push({ id: 'patient_name', label: 'Nome do Paciente' });
      }
      
      if (!reportData.professionalName?.trim()) {
        missingFields.push({ id: 'professional_name', label: 'Nome do Profissional' });
      }
      
      return missingFields;
    }

    // Validação padrão para outras etapas
    const requiredFields = musicoterapiaTemplate.fields.filter(field => 
      field.required && currentStepData.fields.includes(field.id)
    );

    const missingFields = requiredFields.filter(field => {
      const value = reportData.fieldValues?.[field.id];
      return !value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim());
    });

    return missingFields;
  };

  const canProceed = () => {
    const missingFields = validateCurrentStep();
    return missingFields.length === 0;
  };

  const handleAIGeneration = () => {
    const observations = Object.entries(reportData.fieldValues || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    onGenerateWithAI(observations || 'Sessão de musicoterapia para TEA');
  };

  const renderStepFields = () => {
    // Se for a primeira etapa (Informações Básicas), renderizar o componente especializado
    if (currentStep === 0) {
      return (
        <div className="dark">
          <BasicInformationSection
            reportData={reportData}
            onUpdateData={onUpdateData}
            professionalData={professionalData}
            patients={patients}
          />
        </div>
      );
    }

    // Se for a última etapa (Revisão Final), renderizar o componente especial
    if (currentStep === STEPS.length - 1) {
      return (
        <div className="dark">
          <FinalReviewSection
            reportData={reportData}
            onOrganizeWithAI={handleAIGeneration}
            isGeneratingWithAI={isGeneratingWithAI}
            onSaveReport={onSaveReport}
            isSaving={isSaving}
            professionalData={professionalData}
          />
        </div>
      );
    }

    const stepFields = musicoterapiaTemplate.fields.filter(field =>
      currentStepData.fields.includes(field.id)
    );

    const templateOptions = STEP_TEMPLATES[currentStepData.id];
    const activeTemplateId = selectedTemplate[currentStepData.id];

    const hint = STEP_HINTS[currentStepData.id];
    const HintIcon = hint?.icon || Info;

    return (
      <div className="dark space-y-8">
        {/* Step hint banner */}
        {hint && (
          <div className="relative overflow-hidden rounded-2xl border border-[#c9a84c]/20 bg-gradient-to-br from-[#c9a84c]/[0.06] via-transparent to-transparent p-5 flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
              <HintIcon className="h-5 w-5 text-[#f0d78c]" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">Dica clínica</div>
              <h3 className="text-base text-[#f0d78c] font-semibold" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {hint.title}
              </h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">{hint.description}</p>
            </div>
          </div>
        )}

        {/* Templates profissionais (noir/gold) */}
        {templateOptions && (
          <div className="rounded-2xl border border-[#c9a84c]/15 bg-[#0d0d0d]/40 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/25 flex items-center justify-center shrink-0">
                <Wand2 className="h-4 w-4 text-[#f0d78c]" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">Templates profissionais (opcional)</div>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  Escolha o modelo mais próximo do perfil clínico — os campos serão preenchidos e você poderá editá-los livremente.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templateOptions.map((opt) => {
                const isActive = activeTemplateId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyTemplateOption(opt)}
                    className={`group text-left p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_30px_-10px_rgba(201,168,76,0.5)]'
                        : 'border-white/10 bg-[#1a1a1a]/60 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-semibold text-sm ${isActive ? 'text-[#f0d78c]' : 'text-gray-200 group-hover:text-[#f0d78c]'}`}>
                        {opt.label}
                      </span>
                      {isActive && (
                        <div className="h-5 w-5 rounded-full bg-[#c9a84c] flex items-center justify-center">
                          <Check className="h-3 w-3 text-[#0d0d0d]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form fields — numbered cards */}
        <div className="space-y-5">
          {stepFields.map((field, idx) => {
            const isFilled = (() => {
              const v = reportData.fieldValues?.[field.id];
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === 'string') return v.trim().length > 0;
              return v !== undefined && v !== null && v !== '';
            })();
            return (
              <div
                key={field.id}
                className={`group rounded-2xl border bg-[#0d0d0d]/40 p-5 sm:p-6 transition-all hover:border-[#c9a84c]/40 ${
                  isFilled ? 'border-[#c9a84c]/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors ${
                      isFilled
                        ? 'bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]'
                        : 'bg-transparent text-gray-500 border-white/15 group-hover:text-[#f0d78c] group-hover:border-[#c9a84c]/50'
                    }`}
                  >
                    {isFilled ? <Check className="h-3.5 w-3.5" /> : String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <MusicoterapiaFormField
                      field={field}
                      value={reportData.fieldValues?.[field.id]}
                      onChange={(value) => handleFieldUpdate(field.id, value)}
                      onFocus={() => setActiveField(field.id)}
                    />
                  </div>
                </div>

                {field.guidance && (
                  <div className="pl-10">
                    <MusicoterapiaGuidance text={field.guidance} fieldId={field.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const StepIcon = currentStepData.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16 px-3 sm:px-4 lg:px-0" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {/* Editorial Hero — Monolithic noir & gold */}
      <header className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 text-[#f0d78c] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase">
          Protocolo Clínico · TEA
        </div>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#f0d78c] leading-[1.05] px-2"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Relatório MuseTera TEA
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base lg:text-lg font-light leading-relaxed px-2">
            Estrutura premium para documentação de avaliação, objetivos, técnicas e evolução clínica em musicoterapia.
          </p>
        </div>

        {/* Progresso editorial */}
        <div className="w-full max-w-md pt-2">
          <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            <span>Progresso</span>
            <span className="text-[#c9a84c]">{Math.round(progress)}%</span>
          </div>
          <div className="h-[2px] bg-white/5 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Stepper Indicator — horizontal numbered */}
      {/* Stepper Indicator — compact on mobile, full on desktop */}
      <nav className="relative px-1 sm:px-2">
        {/* Mobile: compact pill view */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              aria-label="Etapa anterior"
              className="h-9 w-9 rounded-full bg-[#1a1a1a] border border-white/10 text-[#f0d78c] disabled:opacity-30 flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
                Etapa {currentStep + 1} de {STEPS.length}
              </div>
              <div className="text-sm text-[#f0d78c] font-semibold truncate" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {currentStepData.title.replace(/^\d+\.\s*/, '')}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStep === STEPS.length - 1 || !canProceed()}
              aria-label="Próxima etapa"
              className="h-9 w-9 rounded-full bg-[#c9a84c] text-[#0d0d0d] disabled:opacity-30 flex items-center justify-center shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => { setCurrentStep(index); scrollToStepContent(); }}
                  aria-label={`Ir para ${step.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent ? 'w-6 bg-[#c9a84c]' : isCompleted ? 'w-3 bg-[#c9a84c]/60' : 'w-3 bg-white/15'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop: full stepper */}
        <div className="hidden sm:block relative">
          <div className="absolute top-5 left-0 w-full h-[1px] bg-white/5" />
          <ul className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <li key={step.id} className="flex flex-col items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black ring-8 ring-[#0d0d0d] transition-all
                      ${isCurrent
                        ? 'bg-[#c9a84c] text-[#0d0d0d] shadow-[0_0_24px_rgba(201,168,76,0.35)] scale-110'
                        : isCompleted
                          ? 'bg-[#1a1a1a] border border-[#c9a84c]/60 text-[#f0d78c]'
                          : 'bg-[#1a1a1a] border border-white/15 text-white/60 hover:border-[#c9a84c]/40'
                      }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, '0')}
                  </button>
                  <span
                    className={`text-[9px] uppercase tracking-widest font-bold text-center transition-colors px-1 leading-tight
                      ${isCurrent ? 'text-[#c9a84c]' : isCompleted ? 'text-[#f0d78c]/70' : 'text-gray-500'}`}
                    style={{ fontFamily: "'Work Sans'" }}
                  >
                    {step.title.replace(/^\d+\.\s*/, '').split(' ').slice(0, 2).join(' ')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Main Wizard Card — Monolithic */}
      <div ref={stepContentRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 bg-[#1a1a1a] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative">
          {/* Premium accent light */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c9a84c]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-10 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
                <StepIcon className="h-3.5 w-3.5" />
                Etapa {String(currentStep + 1).padStart(2, '0')} de {String(STEPS.length).padStart(2, '0')}
              </div>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl text-[#f0d78c] leading-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {currentStepData.title.replace(/^\d+\.\s*/, '')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-light">{currentStepData.description}</p>
            </div>

            <div className="text-foreground">
              {renderStepFields()}
            </div>

            <footer className="pt-6 sm:pt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between border-t border-white/5 gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                  Sincronizado com Nuvem
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="text-gray-400 hover:text-[#f0d78c] hover:bg-white/5 px-3 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === STEPS.length - 1 || !canProceed()}
                  className="group flex items-center justify-center gap-2 sm:gap-3 bg-[#c9a84c] hover:bg-[#f0d78c] disabled:opacity-40 disabled:cursor-not-allowed text-[#0d0d0d] px-5 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base flex-1 sm:flex-none"
                  style={{ fontFamily: "'Work Sans'" }}
                >
                  Próxima Seção
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </footer>

            {!canProceed() && (
              <p className="text-xs text-destructive text-center">
                Preencha os campos obrigatórios para continuar
              </p>
            )}
          </div>
        </section>

        {/* Quick Fill Panel */}
        {showQuickFill && (
          <aside className="space-y-4">
            <MusicoterapiaQuickFill
              activeField={activeField}
              onInsert={handleQuickFillInsert}
              onClose={() => setShowQuickFill(false)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}