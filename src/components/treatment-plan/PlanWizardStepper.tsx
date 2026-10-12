import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanSection } from '@/pages/musicotherapy-treatment-plan/sections';
import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface PlanWizardStepperProps {
  sections: PlanSection[];
  activeIndex: number;
  plan: Partial<MusicotherapyTreatmentPlan>;
  completion: number;
  onSelect: (id: string) => void;
}

/**
 * Compact wizard stepper for the musicotherapy treatment plan.
 * Replaces the overwhelming 10-tab bar with a guided step-by-step progress UI.
 */
export function PlanWizardStepper({
  sections,
  activeIndex,
  plan,
  completion,
  onSelect,
}: PlanWizardStepperProps) {
  const total = sections.length;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm">
      {/* Top row: step counter + completion */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-semibold text-foreground">
          Etapa {activeIndex + 1} <span className="text-muted-foreground font-normal">de {total}</span>
        </span>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {completion}% concluído
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-800 transition-all duration-500 ease-out"
          style={{ width: `${completion}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const complete = section.isComplete(plan);
          const isActive = index === activeIndex;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Etapa ${index + 1}: ${section.navLabel}`}
              className={cn(
                'group flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-medium transition-all',
                isActive
                  ? 'border-transparent bg-gradient-to-br from-teal-700 to-teal-800 text-white shadow-md'
                  : complete
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15'
                    : 'border-border/60 bg-background/40 text-muted-foreground hover:bg-muted/60',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                  isActive ? 'bg-white/20' : complete ? 'bg-emerald-500/20' : 'bg-muted',
                )}
              >
                {complete && !isActive ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="hidden md:inline whitespace-nowrap">{index + 1}. {section.navLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
