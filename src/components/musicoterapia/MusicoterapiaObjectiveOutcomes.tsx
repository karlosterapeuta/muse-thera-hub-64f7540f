import React from 'react';
import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';
import {
  objectiveOutcomeOptions, getObjectiveOutcomes, type ObjectiveOutcomes
} from '@/data/musicoterapiaObjectiveOutcomes';

interface Props {
  selectedIds: string[];
  value: unknown;
  onChange: (value: ObjectiveOutcomes) => void;
}

/** Uma única marcação por objetivo. Sem atribuição automática de evolução. */
export function MusicoterapiaObjectiveOutcomes({ selectedIds, value, onChange }: Props) {
  const selected = getSelectedMusicoterapiaObjectives(selectedIds);
  const source: ObjectiveOutcomes = value && typeof value === 'object' && !Array.isArray(value)
    ? value as ObjectiveOutcomes : {};
  const completed = getObjectiveOutcomes(selectedIds, source).length;

  return (
    <section className="space-y-3 rounded-2xl border border-[#c9a84c]/30 bg-[#121212] p-4 sm:p-5">
      <div>
        <h3 className="font-semibold text-[#f0d78c]">Evolução dos objetivos da Etapa 02</h3>
        <p className="text-sm text-gray-300 mt-1">
          Marque a situação de cada objetivo. Os que estiverem evoluindo, sem avanço ou com dificuldade
          aparecerão automaticamente na Etapa 05.
        </p>
        <p className="text-xs text-[#c9a84c] mt-2" aria-live="polite">{completed} de {selected.length} objetivos registrados</p>
      </div>
      {selected.map(item => (
        <div key={item.id} className="rounded-xl border border-white/15 bg-[#1c1c1c] p-3 space-y-2">
          <p className="font-medium text-sm text-gray-100">{item.icon} {item.title}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Evolução: ${item.title}`}>
            {objectiveOutcomeOptions.map(option => {
              const active = source[item.id] === option.id;
              return (
                <button key={option.id} type="button" aria-pressed={active}
                  onClick={() => onChange({ ...source, [item.id]: option.id })}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d78c] ${active
                    ? 'bg-[#c9a84c] text-[#101010] border-[#c9a84c]'
                    : 'bg-[#101010] text-gray-200 border-white/20 hover:border-[#c9a84c]/60'
                  }`}>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400">
        "Não avaliado" não é interpretado como dificuldade ou ausência de evolução.
        As classificações são registros clínicos do profissional, não pontuações de escala validada.
      </p>
    </section>
  );
}
