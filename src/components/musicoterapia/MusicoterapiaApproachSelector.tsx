import React from 'react';
import { Check, Info, Music2 } from 'lucide-react';
import {
  getSelectedMusicoterapiaApproaches,
  musicoterapiaApproaches
} from '@/data/musicoterapiaApproaches';

interface MusicoterapiaApproachSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** Seleção de abordagens, com IDs estáveis para preservar os registros clínicos. */
export function MusicoterapiaApproachSelector({
  selectedIds,
  onChange
}: MusicoterapiaApproachSelectorProps) {
  const selectedSet = new Set(getSelectedMusicoterapiaApproaches(selectedIds).map((item) => item.id));

  const toggle = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(musicoterapiaApproaches.filter((item) => next.has(item.id)).map((item) => item.id));
  };

  return (
    <section className="space-y-5" aria-label="Abordagens musicoterapêuticas">
      <div className="flex gap-3 rounded-2xl border border-teal-600/40 bg-gradient-to-br from-teal-600/10 to-background p-4 sm:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-600/40 bg-teal-600/15">
          <Music2 className="h-5 w-5 text-teal-800 dark:text-teal-200" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200">Selecione a abordagem musicoterapêutica</h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            Escolha uma ou mais abordagens que orientarão o atendimento. Cada opção descreve como a música é utilizada
            e quais dimensões podem ser estimuladas. A seleção deve corresponder à prática ou ao planejamento do profissional.
          </p>
          <p className="text-xs font-medium text-teal-700 dark:text-teal-300" aria-live="polite">
            {selectedSet.size} de {musicoterapiaApproaches.length} abordagens selecionadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {musicoterapiaApproaches.map((approach, index) => {
          const checked = selectedSet.has(approach.id);
          return (
            <button
              type="button"
              key={approach.id}
              aria-pressed={checked}
              onClick={() => toggle(approach.id)}
              className={`rounded-xl border p-4 sm:p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${checked
                ? 'border-teal-600 bg-teal-600/15'
                : 'border-border/70 bg-card hover:border-teal-600/60 hover:bg-teal-600/[0.06]'
              }`}
            >
              <span className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600/15 border border-teal-600/35 text-sm font-semibold text-teal-800 dark:text-teal-200">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm sm:text-base font-bold text-teal-800 dark:text-teal-200 leading-snug">
                  {approach.title}
                </span>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${checked
                  ? 'border-teal-600 bg-teal-700 text-white'
                  : 'border-border text-transparent'
                }`}>
                  <Check className="h-4 w-4" />
                </span>
              </span>
              <span className="block text-xs sm:text-sm text-foreground/80 leading-relaxed mt-3">
                {approach.description}
              </span>
              <span className="block text-xs sm:text-sm text-foreground/80 leading-relaxed mt-2">
                <strong className="text-teal-800 dark:text-teal-200">Objetivo:</strong> {approach.goals}
              </span>
              {approach.clinicalNote && (
                <span className="mt-3 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-200/90 border-t border-teal-600/20 pt-3">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>{approach.clinicalNote}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground rounded-lg border border-border/60 bg-background/60 p-3">
        Métodos como NMT, Musicoterapia Analítica e GIM demandam capacitação e indicação apropriadas.
        Selecionar uma abordagem não comprova sua aplicação nem representa resultado clínico garantido.
      </p>
    </section>
  );
}
