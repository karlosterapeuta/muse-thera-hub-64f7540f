import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanSection } from '@/pages/musicotherapy-treatment-plan/sections';
import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface PlanSectionNavProps {
  sections: PlanSection[];
  activeId: string;
  planData: Partial<MusicotherapyTreatmentPlan>;
  onSelect: (id: string) => void;
}

export function PlanSectionNav({ sections, activeId, planData, onSelect }: PlanSectionNavProps) {
  return (
    <>
      {/* Desktop: vertical stepper */}
      <nav className="hidden lg:flex flex-col gap-1 sticky top-28">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = section.id === activeId;
          const complete = section.isComplete(planData);
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
                isActive
                  ? 'bg-gradient-to-r from-primary/15 to-purple-500/10 ring-1 ring-primary/30'
                  : 'hover:bg-muted/60',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  complete
                    ? 'bg-emerald-500 text-white'
                    : isActive
                      ? 'bg-gradient-to-br from-primary to-purple-600 text-white'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {complete ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block truncate text-sm font-medium',
                    isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  {section.navLabel}
                </span>
              </span>
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground/60',
                )}
              />
            </button>
          );
        })}
      </nav>

      {/* Mobile/tablet: horizontal scrollable chips */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 w-max">
          {sections.map((section, index) => {
            const isActive = section.id === activeId;
            const complete = section.isComplete(planData);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'border-primary/40 bg-gradient-to-r from-primary to-purple-600 text-white shadow-sm'
                    : 'border-border/60 bg-muted/40 text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-white/25 text-white'
                      : complete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-background text-muted-foreground',
                  )}
                >
                  {complete && !isActive ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                {section.navLabel}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function PlanSectionHeader({ section, index, total }: { section: PlanSection; index: number; total: number }) {
  const Icon = section.icon;
  return (
    <div className="flex items-start gap-4 border-b border-border/60 pb-4 mb-2">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-md">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Seção {index + 1} de {total}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{section.title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
      </div>
    </div>
  );
}
