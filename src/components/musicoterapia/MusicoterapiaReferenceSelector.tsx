import React from 'react';
import { BookOpen, Check, ExternalLink, Info } from 'lucide-react';
import {
  getSelectedMusicoterapiaReferences,
  musicoterapiaReferences
} from '@/data/musicoterapiaReferences';

interface MusicoterapiaReferenceSelectorProps {
  selectedIds: string[];
  selectedApproachIds: string[];
  onChange: (ids: string[]) => void;
}

/**
 * Bibliografia escolhida pelo musicoterapeuta. As sugestões de relação com
 * a abordagem NÃO marcam fontes automaticamente nem atestam uso da obra.
 */
export function MusicoterapiaReferenceSelector({
  selectedIds,
  selectedApproachIds,
  onChange
}: MusicoterapiaReferenceSelectorProps) {
  const selectedSet = new Set(getSelectedMusicoterapiaReferences(selectedIds).map((item) => item.id));
  const approachSet = new Set(selectedApproachIds);

  const toggleReference = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(musicoterapiaReferences.filter((item) => next.has(item.id)).map((item) => item.id));
  };

  return (
    <section className="space-y-5" aria-label="Referências bibliográficas de musicoterapia">
      <div className="flex items-start gap-3 rounded-2xl border border-teal-600/40 bg-teal-600/[0.08] p-4 sm:p-6">
        <BookOpen className="w-7 h-7 shrink-0 text-teal-800 dark:text-teal-200" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200">Selecione as referências do relatório</h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            Escolha apenas os autores e obras que realmente orientaram sua avaliação,
            seu planejamento ou suas intervenções. As referências escolhidas serão
            incluídas automaticamente no documento final.
          </p>
          <p className="text-xs font-semibold text-teal-700 dark:text-teal-300" aria-live="polite">
            {selectedSet.size} de {musicoterapiaReferences.length} referências selecionadas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {musicoterapiaReferences.map((reference, index) => {
          const active = selectedSet.has(reference.id);
          const matchesApproach = reference.relatedApproachIds.some((id) => approachSet.has(id));
          return (
            <div key={reference.id} className={`rounded-xl border p-4 sm:p-5 transition-colors ${active
              ? 'border-teal-600 bg-teal-600/[0.12]'
              : 'border-border/70 bg-card hover:border-teal-600/50'
            }`}>
              <button
                type="button"
                aria-pressed={active}
                aria-label={`${reference.authors}: ${active ? 'remover referência' : 'selecionar referência'}`}
                onClick={() => toggleReference(reference.id)}
                className="flex w-full items-start gap-3 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span aria-hidden="true" className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full border border-teal-600/35 bg-teal-600/15 text-teal-800 dark:text-teal-200 text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm sm:text-base font-bold text-teal-800 dark:text-teal-200">{reference.authors}</span>
                  <span className="block text-xs text-foreground/80 mt-1">{reference.shortName} · {reference.year}</span>
                </span>
                <span className={`flex shrink-0 h-6 w-6 items-center justify-center rounded-md border ${active
                  ? 'border-teal-600 bg-teal-700 text-white'
                  : 'border-border text-transparent'
                }`} aria-hidden="true">
                  <Check className="h-4 w-4" />
                </span>
              </button>
              {matchesApproach && (
                <p className="text-[11px] text-teal-800 dark:text-teal-200 mt-3">
                  Pode dialogar com as abordagens selecionadas na Etapa 03
                </p>
              )}
              <p className="text-xs text-foreground/80 leading-relaxed mt-3">{reference.focus}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">{reference.relevance}</p>
              {active && (
                <div className="mt-3 pt-3 border-t border-teal-600/25">
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    <strong className="text-teal-800 dark:text-teal-200">Citação que aparecerá no relatório:</strong>{' '}
                    {reference.bibliography}
                  </p>
                </div>
              )}
              <a
                href={reference.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex gap-1 items-center text-xs text-teal-800 dark:text-teal-200 hover:underline mt-3"
                aria-label={`Conferir dados bibliográficos de ${reference.authors}`}
              >
                Conferir a obra <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 rounded-lg border border-border/70 bg-background/60 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300 mt-0.5" />
        <p>
          Não é obrigatório selecionar todas as obras. Referências bibliográficas não
          comprovam, por si só, a eficácia de um atendimento ou um resultado individual.
          Confira a pertinência e os dados da edição realmente consultada antes de assinar o relatório.
        </p>
      </div>
    </section>
  );
}
