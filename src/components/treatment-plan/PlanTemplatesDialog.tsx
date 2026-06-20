import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Check, Target, Music, Activity, Clock, BarChart } from 'lucide-react';
import {
  PLAN_TEMPLATES,
  CATEGORY_LABELS,
  type PlanTemplate,
  type PlanTemplateCategory,
} from '@/data/treatmentPlanTemplates';
import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { cn } from '@/lib/utils';

export type ApplyMode = 'complete' | 'replace';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (data: Partial<MusicotherapyTreatmentPlan>, mode: ApplyMode) => void;
}

type Filter = 'all' | PlanTemplateCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'neurodesenvolvimento', label: CATEGORY_LABELS.neurodesenvolvimento },
  { id: 'neurologia', label: CATEGORY_LABELS.neurologia },
  { id: 'saude-mental', label: CATEGORY_LABELS['saude-mental'] },
  { id: 'geral', label: CATEGORY_LABELS.geral },
];

/** Mostra um bloco do preview apenas quando há conteúdo. */
const PreviewBlock: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: string[];
}> = ({ icon, title, items }) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <ul className="space-y-1 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1.5 text-xs text-muted-foreground leading-relaxed">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Constrói os blocos de preview a partir do template selecionado. */
const buildPreview = (tpl: PlanTemplate) => {
  const d = tpl.data;
  const resources = [
    ...(d.musical_instruments ?? []),
    ...(d.voice_body_resources ?? []),
    ...(d.technological_resources ?? []),
    ...(d.complementary_materials ?? []),
  ];
  const strategies = [
    d.musical_improvisation,
    d.musical_recreation,
    d.musical_composition,
    d.receptive_listening,
    d.rhythmic_dynamics,
  ].filter((v): v is string => !!v);

  const frequency: string[] = [];
  if (d.weekly_sessions) frequency.push(`${d.weekly_sessions}x por semana`);
  if (d.session_duration_minutes) frequency.push(`${d.session_duration_minutes} min por sessão`);
  if (d.estimated_period_months) frequency.push(`${d.estimated_period_months} meses de duração estimada`);

  return {
    general: d.general_objectives ?? [],
    specific: d.specific_objectives ?? [],
    resources,
    strategies,
    frequency,
    evaluation: d.evaluation_criteria_list ?? [],
  };
};

export const PlanTemplatesDialog: React.FC<Props> = ({ open, onOpenChange, onApply }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<PlanTemplate | null>(null);

  const templates = useMemo(
    () => (filter === 'all' ? PLAN_TEMPLATES : PLAN_TEMPLATES.filter((t) => t.category === filter)),
    [filter],
  );

  const preview = selected ? buildPreview(selected) : null;

  const handleApply = (mode: ApplyMode) => {
    if (!selected) return;
    onApply(selected.data, mode);
    onOpenChange(false);
    setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Modelos prontos de plano musicoterapêutico
          </DialogTitle>
          <DialogDescription>
            Escolha um modelo completo por perfil clínico. Veja o conteúdo ao lado e aplique direto —
            sem precisar preencher nada manualmente.
          </DialogDescription>
        </DialogHeader>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter === f.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid flex-1 min-h-0 grid-cols-1 gap-4 md:grid-cols-[1fr_1.1fr]">
          {/* Lista de templates */}
          <ScrollArea className="h-full max-h-[48vh] pr-2">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1">
              {templates.map((tpl) => {
                const isSel = selected?.id === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelected(tpl)}
                    className={cn(
                      'relative rounded-xl border-2 p-3 text-left transition-all',
                      isSel
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/40 hover:bg-muted/40',
                    )}
                  >
                    {isSel && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl leading-none">{tpl.emoji}</span>
                      <div className="min-w-0">
                        <div className="mb-0.5 text-sm font-semibold leading-tight">{tpl.label}</div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
                          {tpl.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Preview do template selecionado */}
          <div className="rounded-xl border bg-muted/20 p-4">
            {!preview ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <Sparkles className="mb-2 h-8 w-8 opacity-40" />
                Selecione um modelo para visualizar o conteúdo que será aplicado.
              </div>
            ) : (
              <ScrollArea className="h-full max-h-[48vh] pr-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selected?.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{selected?.label}</div>
                      {selected?.diagnosis && (
                        <Badge variant="secondary" className="mt-1 text-[10px]">
                          {selected.diagnosis}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <PreviewBlock
                    icon={<Target className="h-3.5 w-3.5 text-primary" />}
                    title="Objetivos gerais"
                    items={preview.general}
                  />
                  <PreviewBlock
                    icon={<Check className="h-3.5 w-3.5 text-primary" />}
                    title="Objetivos específicos"
                    items={preview.specific}
                  />
                  <PreviewBlock
                    icon={<Music className="h-3.5 w-3.5 text-primary" />}
                    title="Recursos musicoterapêuticos"
                    items={preview.resources}
                  />
                  <PreviewBlock
                    icon={<Activity className="h-3.5 w-3.5 text-primary" />}
                    title="Estratégias e técnicas"
                    items={preview.strategies}
                  />
                  <PreviewBlock
                    icon={<Clock className="h-3.5 w-3.5 text-primary" />}
                    title="Frequência e duração"
                    items={preview.frequency}
                  />
                  <PreviewBlock
                    icon={<BarChart className="h-3.5 w-3.5 text-primary" />}
                    title="Critérios de avaliação"
                    items={preview.evaluation}
                  />
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            <strong>Completar</strong> preenche apenas campos vazios. <strong>Substituir</strong> troca
            todo o conteúdo pelo modelo.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={() => handleApply('complete')} disabled={!selected}>
              Completar campos vazios
            </Button>
            <Button onClick={() => handleApply('replace')} disabled={!selected}>
              <Sparkles className="mr-2 h-4 w-4" />
              Aplicar modelo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
