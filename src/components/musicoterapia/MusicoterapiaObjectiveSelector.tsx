import React from 'react';
import { Check, ChevronDown, ClipboardList, Target } from 'lucide-react';
import {
  musicoterapiaObjectives,
  musicoterapiaObjectiveCategories,
  type MusicoterapiaObjectiveCategoryId
} from '@/data/musicoterapiaObjectives';

interface MusicoterapiaObjectiveSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/**
 * Lista de objetivos a trabalhar, não escala de habilidades adquiridas.
 * O profissional seleciona os objetivos aplicáveis ao paciente.
 */
export function MusicoterapiaObjectiveSelector({
  selectedIds,
  onChange
}: MusicoterapiaObjectiveSelectorProps) {
  const selectedSet = new Set(selectedIds);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<MusicoterapiaObjectiveCategoryId>>(
    () => new Set(musicoterapiaObjectiveCategories.map((category) => category.id))
  );
  const toggleCategory = (categoryId: MusicoterapiaObjectiveCategoryId) => {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const toggleObjective = (id: string) => {
    const nextIds = selectedSet.has(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    // Ordem estável e sem valores desconhecidos.
    onChange(musicoterapiaObjectives.filter((item) => nextIds.includes(item.id)).map((item) => item.id));
  };

  return (
    <div className="rounded-2xl border border-teal-600/40 bg-gradient-to-br from-teal-50/70 to-card dark:from-teal-950/20 p-4 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl border border-teal-600/40 bg-teal-600/15">
          <Target className="h-5 w-5 text-teal-800 dark:text-teal-200" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-teal-800 dark:text-teal-200">Objetivos a estimular ou desenvolver</h3>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
            Selecione os objetivos relevantes para o plano musicoterapêutico individualizado.
            Eles serão incluídos no relatório como <strong>objetivos de intervenção</strong>, e não como resultados já alcançados.
          </p>
          <p className="text-xs text-teal-700 dark:text-teal-300 mt-2" aria-live="polite">
            {selectedSet.size} de {musicoterapiaObjectives.length} objetivos selecionados
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {musicoterapiaObjectiveCategories.map((category) => {
          const objectives = musicoterapiaObjectives.filter((objective) => objective.category === category.id);
          const selectedCount = objectives.filter((objective) => selectedSet.has(objective.id)).length;
          const expanded = expandedCategories.has(category.id);
          return (
            <section key={category.id} className="overflow-hidden rounded-xl border border-border/70 bg-muted/40">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`objetivos-grupo-${category.id}`}
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-teal-600/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
              >
                <span className="text-2xl" aria-hidden="true">{category.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm sm:text-base font-bold text-teal-800 dark:text-teal-200">{category.title}</span>
                  <span className="block mt-1 text-xs text-muted-foreground">{category.description}</span>
                </span>
                <span className="shrink-0 text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                  {selectedCount}/{objectives.length}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <div id={`objetivos-grupo-${category.id}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-3 sm:px-4 pb-4">
                  {objectives.map((item) => {
                    const checked = selectedSet.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={checked}
                        aria-label={`${item.title}: ${checked ? 'remover objetivo' : 'selecionar objetivo'}`}
                        onClick={() => toggleObjective(item.id)}
                        className={`text-left rounded-xl border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${checked
                          ? 'border-teal-600 bg-teal-600/15 shadow-sm'
                          : 'border-border/70 bg-card hover:border-teal-600/60 hover:bg-teal-600/[0.07]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                          <span className="flex-1 text-sm sm:text-base font-semibold text-teal-800 dark:text-teal-200">{item.title}</span>
                          <span className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-md border ${checked
                            ? 'bg-teal-700 border-teal-600 text-white'
                            : 'border-border text-transparent'
                          }`}>
                            <Check className="h-4 w-4" />
                          </span>
                        </span>
                        <span className="block text-xs text-foreground/80 mt-3 leading-relaxed">{item.objective}</span>
                        {checked && (
                          <span className="block mt-3 pt-3 border-t border-teal-600/25 space-y-2">
                            <span className="block text-[11px] text-foreground/80">
                              <strong className="text-teal-800 dark:text-teal-200">Recursos possíveis:</strong> {item.resources}
                            </span>
                            <span className="block text-[11px] text-foreground/80">
                              <strong className="text-teal-800 dark:text-teal-200">Como acompanhar:</strong> {item.indicator}
                            </span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground rounded-lg border border-border/60 bg-muted/40 p-3">
        <ClipboardList className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
        <p>
          Os indicadores são sugestões de observação. Defina metas específicas, prazo, contexto e nível de ajuda
          conforme a linha de base do paciente. Nenhuma pontuação ou evolução será presumida pelo sistema.
        </p>
      </div>
    </div>
  );
}
