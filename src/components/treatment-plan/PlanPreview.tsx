import { Card, CardContent } from '@/components/ui/card';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { formatDateLocal } from '@/lib/utils';
import {
  User,
  FileText,
  Target,
  CheckCircle,
  Music,
  Activity,
  Clock,
  BarChart,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface PlanPreviewProps {
  planData: Partial<MusicotherapyTreatmentPlan>;
}

type FieldValue = string | string[] | number | null | undefined;

interface PreviewField {
  label: string;
  value: FieldValue;
}

interface PreviewSection {
  title: string;
  icon: typeof User;
  fields: PreviewField[];
}

/** Normalizes any field into a printable string, ignoring empty values. */
const renderValue = (value: FieldValue): string | null => {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) {
    const items = value.filter(Boolean);
    return items.length ? items.join(' • ') : null;
  }
  const text = String(value).trim();
  return text.length ? text : null;
};

/**
 * Read-only preview of the musicotherapy treatment plan, mirroring the
 * 10 clinical sections used in the form. Empty fields are omitted so the
 * preview always reflects the current completion state.
 */
export function PlanPreview({ planData }: PlanPreviewProps) {
  const sections: PreviewSection[] = [
    {
      title: 'Identificação do Paciente',
      icon: User,
      fields: [
        { label: 'Nome completo', value: planData.patient_full_name },
        { label: 'Idade', value: planData.patient_age },
        {
          label: 'Data de nascimento',
          value: planData.patient_birth_date ? formatDateLocal(planData.patient_birth_date) : null,
        },
        { label: 'Diagnóstico clínico', value: planData.clinical_diagnosis },
        { label: 'Responsável', value: planData.responsible_person },
        {
          label: 'Início do plano',
          value: planData.plan_start_date ? formatDateLocal(planData.plan_start_date) : null,
        },
      ],
    },
    {
      title: 'Avaliação Inicial',
      icon: FileText,
      fields: [
        { label: 'Histórico clínico e familiar', value: planData.clinical_family_history },
        { label: 'Condições atuais', value: planData.physical_cognitive_conditions },
        { label: 'Interação e comunicação', value: planData.interaction_communication_level },
        { label: 'Interesses musicais', value: planData.musical_interests },
        { label: 'Comportamentos observados', value: planData.observed_behaviors },
      ],
    },
    {
      title: 'Objetivos Gerais',
      icon: Target,
      fields: [{ label: 'Propósitos amplos', value: planData.general_objectives }],
    },
    {
      title: 'Objetivos Específicos',
      icon: CheckCircle,
      fields: [{ label: 'Objetivos mensuráveis', value: planData.specific_objectives }],
    },
    {
      title: 'Recursos Musicoterapêuticos',
      icon: Music,
      fields: [
        { label: 'Instrumentos musicais', value: planData.musical_instruments },
        { label: 'Recursos tecnológicos', value: planData.technological_resources },
        { label: 'Voz e corpo', value: planData.voice_body_resources },
        { label: 'Materiais complementares', value: planData.complementary_materials },
      ],
    },
    {
      title: 'Estratégias e Técnicas',
      icon: Activity,
      fields: [
        { label: 'Improvisação musical', value: planData.musical_improvisation },
        { label: 'Recriação musical', value: planData.musical_recreation },
        { label: 'Composição', value: planData.musical_composition },
        { label: 'Escuta receptiva', value: planData.receptive_listening },
        { label: 'Dinâmicas rítmicas', value: planData.rhythmic_dynamics },
      ],
    },
    {
      title: 'Frequência e Duração',
      icon: Clock,
      fields: [
        {
          label: 'Sessões semanais',
          value: planData.weekly_sessions ? `${planData.weekly_sessions}x por semana` : null,
        },
        {
          label: 'Duração da sessão',
          value: planData.session_duration_minutes ? `${planData.session_duration_minutes} minutos` : null,
        },
        {
          label: 'Período estimado',
          value: planData.estimated_period_months ? `${planData.estimated_period_months} meses` : null,
        },
      ],
    },
    {
      title: 'Critérios de Avaliação',
      icon: BarChart,
      fields: [{ label: 'Indicadores de progresso', value: planData.evaluation_criteria_list }],
    },
    {
      title: 'Plano Terapêutico em Ação',
      icon: Sparkles,
      fields: [
        { label: 'Estrutura das sessões', value: planData.session_structure },
        { label: 'Sequência de atividades', value: planData.activities_sequence },
      ],
    },
    {
      title: 'Reavaliação',
      icon: RefreshCw,
      fields: [
        { label: 'Frequência da reavaliação', value: planData.reevaluation_frequency },
        { label: 'Registro da evolução', value: planData.evolution_recording },
        { label: 'Ajustes necessários', value: planData.necessary_adjustments },
      ],
    },
  ];

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/60 shadow-xl">
      <CardContent className="pt-6 space-y-8">
        {sections.map((section) => {
          const visibleFields = section.fields
            .map((field) => ({ ...field, rendered: renderValue(field.value) }))
            .filter((field) => field.rendered !== null);

          const Icon = section.icon;

          return (
            <section key={section.title} className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-amber-500 text-white shadow">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{section.title}</h3>
              </div>

              {visibleFields.length ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  {visibleFields.map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl border border-border/60 bg-background/40 p-3 backdrop-blur"
                    >
                      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{field.label}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {field.rendered}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Seção ainda não preenchida.</p>
              )}
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}
