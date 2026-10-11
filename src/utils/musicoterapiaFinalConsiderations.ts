import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';
import { getObjectiveOutcomes, getPendingObjectiveInterventions } from '@/data/musicoterapiaObjectiveOutcomes';

/**
 * Síntese descritiva e não causal, baseada somente nas classificações do
 * profissional nas Etapas 02–05. Não inferir eficácia, melhora global, alta,
 * prognóstico ou aplicação de abordagens apenas por terem sido selecionadas.
 */
export interface MusicoterapiaFinalConsiderations {
  paragraphs: string[];
  selectedCount: number;
  evaluatedCount: number;
  pendingCount: number;
  notAssessedCount: number;
}

export function getMusicoterapiaFinalConsiderations(
  rawFields: Record<string, unknown> | null | undefined
): MusicoterapiaFinalConsiderations {
  const fields = rawFields || {};
  const selected = getSelectedMusicoterapiaObjectives(fields.therapeutic_objective_ids);
  const outcomes = getObjectiveOutcomes(fields.therapeutic_objective_ids, fields.objective_outcomes);
  const pending = getPendingObjectiveInterventions(fields.therapeutic_objective_ids, fields.objective_outcomes);
  const evaluated = outcomes.filter(({ status }) => status !== 'not_assessed');
  const notAssessedCount = outcomes.filter(({ status }) => status === 'not_assessed').length;
  const counts = {
    achieved: evaluated.filter(({ status }) => status === 'achieved').length,
    progressing: evaluated.filter(({ status }) => status === 'progressing').length,
    noProgress: evaluated.filter(({ status }) => status === 'no_progress').length,
    difficulty: evaluated.filter(({ status }) => status === 'difficulty').length
  };

  const paragraphs: string[] = [];

  // Classificações por objetivo, sem presumir mudanças além do que foi marcado.
  if (evaluated.length > 0) {
    const summaries = [
      counts.achieved ? `${counts.achieved} alcançado${counts.achieved === 1 ? '' : 's'}` : '',
      counts.progressing ? `${counts.progressing} em evolução` : '',
      counts.noProgress ? `${counts.noProgress} sem avanço observado` : '',
      counts.difficulty ? `${counts.difficulty} com dificuldade` : ''
    ].filter(Boolean);
    paragraphs.push(
      `Conforme os registros do profissional, entre os ${evaluated.length} objetivo${evaluated.length === 1 ? '' : 's'} avaliado${evaluated.length === 1 ? '' : 's'} no período, ${summaries.join(', ')}.`
    );
  }

  if (pending.length > 0) {
    const shortList = pending.slice(0, 3).map(({ objective }) => objective.title).join('; ');
    const remaining = pending.length - Math.min(pending.length, 3);
    const suffix = remaining ? `; além de ${remaining} outra${remaining === 1 ? '' : 's'} demanda${remaining === 1 ? '' : 's'}` : '';
    paragraphs.push(`Demandas identificadas para continuidade: ${shortList}${suffix}.`);
  }

  if (notAssessedCount > 0) {
    paragraphs.push(
      `${notAssessedCount} objetivo${notAssessedCount === 1 ? '' : 's'} permaneceu${notAssessedCount === 1 ? '' : 'ram'} sem avaliação no período; não ${notAssessedCount === 1 ? 'deve' : 'devem'} ser interpretado${notAssessedCount === 1 ? '' : 's'} como dificuldade ou ausência de progresso.`
    );
  }

  // Observação opcional de autoria do profissional, não gerada automaticamente.
  const rawNote = fields.final_considerations;
  const note = (typeof rawNote === 'string'
    ? rawNote
    : Array.isArray(rawNote) ? rawNote.filter((v): v is string => typeof v === 'string').join(' ') : ''
  ).trim();
  if (note) paragraphs.push(note.slice(0, 1500));

  return {
    paragraphs,
    selectedCount: selected.length,
    evaluatedCount: evaluated.length,
    pendingCount: pending.length,
    notAssessedCount
  };
}
