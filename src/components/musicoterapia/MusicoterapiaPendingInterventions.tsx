import React from 'react';
import { AlertCircle, CheckCircle2, ClipboardList } from 'lucide-react';
import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import {
  getPendingObjectiveInterventions, getObjectiveOutcomes,
  getObjectiveOutcomeLabel
} from '@/data/musicoterapiaObjectiveOutcomes';

/**
 * Etapa 06 derivada das classificações feitas na Etapa 05.
 * A associação entre uma abordagem e o resultado de cada objetivo não é inferida.
 */
interface Props {
  selectedObjectiveIds: unknown;
  selectedApproachIds: unknown;
  objectiveOutcomes: unknown;
}

export function MusicoterapiaPendingInterventions({
  selectedObjectiveIds, selectedApproachIds, objectiveOutcomes
}: Props) {
  const objectives = getSelectedMusicoterapiaObjectives(selectedObjectiveIds);
  const outcomes = getObjectiveOutcomes(selectedObjectiveIds, objectiveOutcomes);
  const pending = getPendingObjectiveInterventions(selectedObjectiveIds, objectiveOutcomes);
  const notAssessed = outcomes.filter(item => item.status === 'not_assessed');
  const completed = outcomes.filter(item => item.status === 'achieved');
  const approaches = getSelectedMusicoterapiaApproaches(selectedApproachIds);
  const missing = objectives.length - outcomes.length;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[#c9a84c]/40 bg-[#c9a84c]/[0.08] p-4 sm:p-5 flex gap-3">
        <ClipboardList className="h-6 w-6 shrink-0 text-[#f0d78c]" />
        <div>
          <h3 className="font-semibold text-[#f0d78c]">Demandas que precisam continuar em intervenção</h3>
          <p className="text-sm text-gray-300 mt-1">
            Esta etapa é preenchida automaticamente conforme os objetivos escolhidos na Etapa 03
            e suas respostas registradas na Etapa 05. Não há textos prontos para selecionar.
          </p>
          {approaches.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Abordagens selecionadas na Etapa 04: {approaches.map(item => item.title).join('; ')}.
            </p>
          )}
        </div>
      </div>

      {missing > 0 && (
        <div role="status" className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-3 text-sm text-amber-200">
          <AlertCircle className="h-4 w-4 inline-block mr-2" />
          Ainda há {missing} objetivo{missing === 1 ? '' : 's'} sem avaliação registrada. Volte à Etapa 05 para completar.
        </div>
      )}

      {pending.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#f0d78c]">
            {pending.length} demanda{pending.length === 1 ? '' : 's'} para continuar trabalhando
          </p>
          {pending.map(({ objective, status }) => (
            <div key={objective.id} className="rounded-xl border border-amber-400/30 bg-[#1a1a1a] p-4 flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">{objective.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-100 text-sm">{objective.title}</p>
                <p className="text-xs text-amber-200 mt-1">Resultado informado: {getObjectiveOutcomeLabel(status)}</p>

              </div>
            </div>
          ))}
        </div>
      ) : missing === 0 && notAssessed.length === 0 && completed.length === objectives.length && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-2 text-sm text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Nenhuma demanda pendente foi identificada a partir dos objetivos classificados como
          alcançados. Reavalie periodicamente e registre novas necessidades se surgirem.
        </div>
      )}

      {notAssessed.length > 0 && (
        <div className="rounded-xl border border-white/15 p-4">
          <h4 className="text-sm font-semibold text-gray-200">Objetivos ainda não avaliados</h4>
          <p className="text-xs text-gray-400 mt-1">Não são classificados automaticamente como dificuldade ou ausência de progresso.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {notAssessed.map(({ objective }) => (
              <span key={objective.id} className="rounded-full border border-white/20 px-3 py-1 text-xs text-gray-300">
                {objective.icon} {objective.title}
              </span>
            ))}
          </div>
        </div>
      )}
      {completed.length > 0 && (
        <p className="text-xs text-gray-400">
          {completed.length} objetivo{completed.length === 1 ? '' : 's'} classificado{completed.length === 1 ? '' : 's'} como alcançado{completed.length === 1 ? '' : 's'}, sem inclusão automática nas demandas pendentes.
        </p>
      )}
    </section>
  );
}
