import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Wand2, Music, Brain, Heart, Target, Home, Check, X, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { musicoterapiaTemplate, type ReportData } from '@/data/musicoterapiaTemplate';
import { MusicoterapiaFormField } from './MusicoterapiaFormField';
import { MusicoterapiaQuickFill } from './MusicoterapiaQuickFill';
import { FinalReviewSection } from './FinalReviewSection';
import { BasicInformationSection } from './BasicInformationSection';
import { MusicoterapiaGuidance } from './MusicoterapiaGuidance';
import { WizardStepper, type WizardStep } from './WizardStepper';
import { WizardStepHeader } from './WizardStepHeader';
import { WizardFieldGroup } from './WizardFieldGroup';

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

const STEPS: WizardStep[] = [
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

// Agrupamento de campos por etapa (apresentação visual)
const STEP_FIELD_GROUPS: Record<string, { title: string; fields: string[]; description?: string }[]> = {
  therapeutic_objectives: [
    { title: 'Objetivos gerais', fields: ['therapeutic_objectives'] },
    { title: 'Metas específicas', fields: ['specific_goals'] },
  ],
  session_activities: [
    { title: 'Setting & estrutura', fields: ['session_setting', 'session_structure'] },
    { title: 'Atividades & técnicas', fields: ['session_activities', 'musical_techniques', 'improvisation_use', 'receptive_techniques', 'recreative_techniques', 'compositional_techniques'] },
    { title: 'Recursos sonoros', fields: ['instruments_used', 'musical_genres', 'tempo_dynamics_used', 'vocal_work'] },
  ],
  communication_language: [
    { title: 'Vocalizações & fala', fields: ['vocalizations_observed', 'verbal_output_during_music', 'echolalia_musical'] },
    { title: 'CAA & pragmática', fields: ['aac_use', 'pragmatic_skills'] },
  ],
  patient_evolution: [
    { title: 'Comparativo & mudanças', fields: ['patient_evolution', 'behavioral_changes', 'skill_improvements', 'evolution_compared_baseline'] },
    { title: 'Metas & indicadores', fields: ['goals_achieved', 'goals_in_progress', 'goals_not_achieved', 'quantitative_indicators'] },
  ],
  future_plan: [
    { title: 'Próximos objetivos', description: 'Curto, médio e longo prazo', fields: ['next_objectives_short', 'next_objectives_medium', 'next_objectives_long'] },
    { title: 'Intervenções & prognóstico', fields: ['proposed_interventions', 'expected_outcomes', 'revaluation_date'] },
  ],
  recommendations: [
    { title: 'Família & casa', fields: ['recommendations', 'home_activities', 'family_guidance', 'playlist_recommended'] },
    { title: 'Escola & equipe', fields: ['school_recommendations', 'interdisciplinary_team_notes'] },
    { title: 'Atenção clínica', fields: ['red_flags_to_monitor'] },
  ],
  theoretical_foundation: [
    { title: 'Abordagem', fields: ['theoretical_framework'] },
    { title: 'Avaliação & referências', fields: ['assessment_tools_used', 'references_cited'] },
  ],
  conclusion: [
    { title: 'Síntese clínica', fields: ['conclusion', 'treatment_summary'] },
  ],
  complementary_observations: [
    { title: 'Notas adicionais', fields: ['complementary_observations', 'additional_notes'] },
  ],
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

  const goToStep = (index: number) => {
    setCurrentStep(index);
    scrollToStepContent();
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) goToStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  };

  const handleQuickFillInsert = (text: string) => {
    if (activeField) {
      const currentValue = reportData.fieldValues?.[activeField] || '';
      const newValue = currentValue ? `${currentValue}\n\n${text}` : text;
      handleFieldUpdate(activeField, newValue);
      toast({
        title: 'Texto inserido',
        description: 'Frase especializada adicionada ao campo atual.'
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

  const clearTemplate = () => {
    setSelectedTemplate(prev => {
      const { [currentStepData.id]: _, ...rest } = prev;
      return rest;
    });
  };

  // Validação e helpers de campos
  const isFieldFilled = (fieldId: string) => {
    if (currentStep === 0) {
      if (fieldId === 'patient_name') return !!reportData.patientName?.trim();
      if (fieldId === 'professional_name') return !!reportData.professionalName?.trim();
    }
    const value = reportData.fieldValues?.[fieldId];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'number') return true;
    if (typeof value === 'string') return value.trim().length > 0;
    return !!value;
  };

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      const missingFields: { id: string; label: string }[] = [];
      if (!reportData.patientName?.trim()) missingFields.push({ id: 'patient_name', label: 'Nome do Paciente' });
      if (!reportData.professionalName?.trim()) missingFields.push({ id: 'professional_name', label: 'Nome do Profissional' });
      return missingFields;
    }

    const requiredFields = musicoterapiaTemplate.fields.filter(field =>
      field.required && currentStepData.fields.includes(field.id)
    );

    return requiredFields
      .filter(field => !isFieldFilled(field.id))
      .map(field => ({ id: field.id, label: field.label }));
  };

  const missingFields = validateCurrentStep();
  const canProceed = missingFields.length === 0;

  // Stats da etapa atual
  const stepFieldDefs = musicoterapiaTemplate.fields.filter(f => currentStepData.fields.includes(f.id));
  const requiredCount = currentStep === 0
    ? 2
    : stepFieldDefs.filter(f => f.required).length;
  const totalFields = currentStep === 0
    ? currentStepData.fields.length
    : stepFieldDefs.length;
  const filledCount = currentStepData.fields.filter(isFieldFilled).length;

  const handleAIGeneration = () => {
    const observations = Object.entries(reportData.fieldValues || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    onGenerateWithAI(observations || 'Sessão de musicoterapia para TEA');
  };

  const renderStepFields = () => {
    if (currentStep === 0) {
      return (
        <BasicInformationSection
          reportData={reportData}
          onUpdateData={onUpdateData}
          professionalData={professionalData}
          patients={patients}
        />
      );
    }

    if (currentStep === STEPS.length - 1) {
      return (
        <FinalReviewSection
          reportData={reportData}
          onOrganizeWithAI={handleAIGeneration}
          isGeneratingWithAI={isGeneratingWithAI}
          onSaveReport={onSaveReport}
          isSaving={isSaving}
          professionalData={professionalData}
        />
      );
    }

    const templateOptions = STEP_TEMPLATES[currentStepData.id];
    const activeTemplateId = selectedTemplate[currentStepData.id];
    const groups = STEP_FIELD_GROUPS[currentStepData.id];

    const renderFieldById = (fieldId: string) => {
      const field = musicoterapiaTemplate.fields.find(f => f.id === fieldId);
      if (!field) return null;
      return (
        <div key={field.id} className="space-y-2">
          <MusicoterapiaFormField
            field={field}
            value={reportData.fieldValues?.[field.id]}
            onChange={(value) => handleFieldUpdate(field.id, value)}
            onFocus={() => setActiveField(field.id)}
          />
          {field.guidance && (
            <div className="pl-3 -ml-3">
              <MusicoterapiaGuidance text={field.guidance} fieldId={field.id} />
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-10">
        {templateOptions && (
          <div className="p-5 rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/[0.03] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5">
                <Wand2 className="h-4 w-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold mb-1">
                    Templates profissionais
                  </div>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    Escolha o modelo mais próximo do perfil clínico — os campos serão preenchidos e você poderá editar livremente.
                  </p>
                </div>
              </div>
              {activeTemplateId && (
                <button
                  type="button"
                  onClick={clearTemplate}
                  className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#c9a84c] flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Limpar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {templateOptions.map((opt) => {
                const isActive = activeTemplateId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyTemplateOption(opt)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_24px_rgba(201,168,76,0.15)]'
                        : 'border-white/5 bg-black/20 hover:border-[#c9a84c]/40 hover:bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs font-bold ${isActive ? 'text-[#f0d78c]' : 'text-gray-200'}`}>
                        {opt.label}
                      </span>
                      {isActive && <Check className="h-3.5 w-3.5 text-[#c9a84c] flex-shrink-0" />}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {groups ? (
          groups.map((group) => (
            <WizardFieldGroup
              key={group.title}
              title={group.title}
              description={group.description}
            >
              {group.fields.map(renderFieldById)}
            </WizardFieldGroup>
          ))
        ) : (
          <div className="space-y-6">
            {currentStepData.fields.map(renderFieldById)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {/* Hero compacto */}
      <header className="space-y-4 sm:space-y-5 pt-2 pb-8 sm:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5 text-[#f0d78c] text-[9px] font-bold tracking-[0.2em] uppercase">
              Protocolo Clínico · TEA
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[#f0d78c] leading-[1.05]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Relatório MuseTera TEA
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
            <Cloud className="h-3 w-3 text-[#c9a84c]/70" />
            <span>Sincronizado</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
          </div>
        </div>

        {/* Barra de progresso fina */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            <span>Progresso geral</span>
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

      {/* Mobile stepper */}
      <div ref={stepContentRef} className="lg:hidden mb-6">
        <WizardStepper steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
      </div>

      {/* Layout principal: sidebar + card */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pb-12">
        {/* Sidebar stepper (desktop) */}
        <div className="hidden lg:block">
          <WizardStepper steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
        </div>

        {/* Card principal */}
        <section className="bg-[#1a1a1a] rounded-[1.75rem] sm:rounded-[2rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c9a84c]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="p-6 sm:p-10 space-y-8 relative z-10">
            <WizardStepHeader
              icon={currentStepData.icon}
              currentStep={currentStep}
              totalSteps={STEPS.length}
              title={currentStepData.title.replace(/^\d+\.\s*/, '')}
              description={currentStepData.description}
              totalFields={totalFields}
              requiredCount={requiredCount}
              filledCount={filledCount}
            />

            <div className="text-foreground">
              {renderStepFields()}
            </div>

            {/* Avisos de campos faltando */}
            {!canProceed && missingFields.length > 0 && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-destructive font-bold">
                  Campos obrigatórios pendentes
                </div>
                <ul className="flex flex-wrap gap-2">
                  {missingFields.map(f => (
                    <li
                      key={f.id}
                      className="text-[11px] px-2 py-1 rounded-md bg-destructive/10 text-destructive font-medium"
                    >
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer simplificado */}
            <footer className="pt-6 border-t border-white/5 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="text-gray-400 hover:text-[#f0d78c] hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold tabular-nums">
                {String(currentStep + 1).padStart(2, '0')} <span className="text-white/20 mx-1">/</span> {String(STEPS.length).padStart(2, '0')}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={currentStep === STEPS.length - 1 || !canProceed}
                className="group flex items-center gap-2 sm:gap-3 bg-[#c9a84c] hover:bg-[#f0d78c] disabled:opacity-30 disabled:cursor-not-allowed text-[#0d0d0d] px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <span className="hidden sm:inline">Próxima Seção</span>
                <span className="sm:hidden">Próxima</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </footer>
          </div>
        </section>
      </div>

      {/* Quick Fill flutuante (mantido caso seja ativado) */}
      {showQuickFill && (
        <aside className="fixed bottom-4 right-4 z-40 w-[340px] max-w-[calc(100vw-2rem)]">
          <MusicoterapiaQuickFill
            activeField={activeField}
            onInsert={handleQuickFillInsert}
            onClose={() => setShowQuickFill(false)}
          />
        </aside>
      )}
    </div>
  );
}
