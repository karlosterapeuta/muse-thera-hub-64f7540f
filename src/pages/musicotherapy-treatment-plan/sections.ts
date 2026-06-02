import {
  User,
  FileText,
  Target,
  CheckCircle,
  Music,
  Activity,
  Clock,
  BarChart,
  Users,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

export interface PlanSection {
  id: string;
  /** Numbered short label used in the navigation */
  navLabel: string;
  /** Full title used in the section header */
  title: string;
  /** Short clinical guidance shown under the title */
  description: string;
  icon: LucideIcon;
  /** Returns true when the section has enough data to be considered complete */
  isComplete: (plan: Partial<MusicotherapyTreatmentPlan>) => boolean;
}

const has = (v?: string | null) => !!v && v.trim().length > 0;
const hasItems = (arr?: unknown[]) => Array.isArray(arr) && arr.length > 0;

export const planSections: PlanSection[] = [
  {
    id: 'identification',
    navLabel: 'Identificação',
    title: 'Identificação do Paciente',
    description: 'Dados básicos, diagnóstico clínico e responsável pelo acompanhamento.',
    icon: User,
    isComplete: (p) => has(p.patient_full_name) && has(p.clinical_diagnosis) && has(p.plan_start_date),
  },
  {
    id: 'assessment',
    navLabel: 'Avaliação',
    title: 'Avaliação Inicial',
    description: 'Histórico, condições atuais, comunicação e comportamentos observados.',
    icon: FileText,
    isComplete: (p) =>
      has(p.clinical_family_history) &&
      has(p.physical_cognitive_conditions) &&
      has(p.interaction_communication_level),
  },
  {
    id: 'general-objectives',
    navLabel: 'Obj. Gerais',
    title: 'Objetivos Gerais',
    description: 'Propósitos amplos que orientam o tratamento musicoterapêutico.',
    icon: Target,
    isComplete: (p) => hasItems(p.general_objectives),
  },
  {
    id: 'specific-objectives',
    navLabel: 'Obj. Específicos',
    title: 'Objetivos Específicos',
    description: 'Metas mensuráveis e observáveis para cada eixo de intervenção.',
    icon: CheckCircle,
    isComplete: (p) => hasItems(p.specific_objectives),
  },
  {
    id: 'resources',
    navLabel: 'Recursos',
    title: 'Recursos Musicoterapêuticos',
    description: 'Instrumentos, recursos tecnológicos, voz/corpo e materiais complementares.',
    icon: Music,
    isComplete: (p) =>
      hasItems(p.musical_instruments) ||
      hasItems(p.technological_resources) ||
      hasItems(p.voice_body_resources) ||
      hasItems(p.complementary_materials),
  },
  {
    id: 'strategies',
    navLabel: 'Estratégias',
    title: 'Estratégias e Técnicas',
    description: 'Improvisação, recriação, composição e escuta receptiva aplicadas.',
    icon: Activity,
    isComplete: (p) =>
      has(p.musical_improvisation) ||
      has(p.musical_recreation) ||
      has(p.musical_composition) ||
      has(p.receptive_listening) ||
      has(p.rhythmic_dynamics),
  },
  {
    id: 'frequency',
    navLabel: 'Frequência',
    title: 'Frequência e Duração',
    description: 'Periodicidade das sessões, duração e período estimado de intervenção.',
    icon: Clock,
    isComplete: (p) => !!p.weekly_sessions && !!p.session_duration_minutes,
  },
  {
    id: 'evaluation',
    navLabel: 'Avaliação',
    title: 'Critérios de Avaliação',
    description: 'Indicadores que evidenciam progresso e alcance dos objetivos.',
    icon: BarChart,
    isComplete: (p) => hasItems(p.evaluation_criteria_list),
  },
  {
    id: 'action-plan',
    navLabel: 'Plano em Ação',
    title: 'Plano Terapêutico em Ação',
    description: 'Estrutura das sessões, sequência de atividades e flexibilidade.',
    icon: Users,
    isComplete: (p) => has(p.session_structure) || has(p.activity_sequence),
  },
  {
    id: 're-evaluation',
    navLabel: 'Reavaliação',
    title: 'Reavaliação e Evolução',
    description: 'Periodicidade de reavaliação, registro da evolução e ajustes.',
    icon: RefreshCw,
    isComplete: (p) => has(p.reevaluation_frequency) && (has(p.evolution_recording) || has(p.necessary_adjustments)),
  },
];

export const getCompletion = (plan: Partial<MusicotherapyTreatmentPlan>) => {
  const done = planSections.filter((s) => s.isComplete(plan)).length;
  return Math.round((done / planSections.length) * 100);
};
