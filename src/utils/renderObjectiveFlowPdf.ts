import {
  getObjectiveOutcomes,
  getPendingObjectiveInterventions,
  getObjectiveOutcomeLabel
} from '@/data/musicoterapiaObjectiveOutcomes';

/** Respostas e continuidade clínica geradas exclusivamente dos registros do profissional. */
export function renderObjectiveFlowPdf(
  objectiveIds: unknown,
  outcomes: unknown,
  escape: (value: string) => string
): string {
  const recorded = getObjectiveOutcomes(objectiveIds, outcomes);
  if (!recorded.length) return '';
  const pending = getPendingObjectiveInterventions(objectiveIds, outcomes);
  const unassessed = recorded.filter(item => item.status === 'not_assessed');

  const rows = recorded.map(({ objective, status }) =>
    '<li style="padding:3px 0;page-break-inside:avoid;">'
      + '<strong>' + escape(objective.title) + ':</strong> '
      + escape(getObjectiveOutcomeLabel(status)) + '</li>'
  ).join('');

  const pendingRows = pending.map(({ objective, status }) =>
    '<li style="padding:4px 0;page-break-inside:avoid;">'
      + '<strong>' + escape(objective.title) + '</strong> — '
      + escape(getObjectiveOutcomeLabel(status)) + '</li>'
  ).join('');

  const emptyMessage = unassessed.length
    ? 'Nenhuma pendência pode ser inferida dos objetivos avaliados; os objetivos não avaliados exigem acompanhamento.'
    : 'Não foram identificadas demandas de continuidade entre os objetivos registrados.';

  const unassessedNotice = unassessed.length
    ? '<p style="font-size:10px;color:#64748b;margin-top:8px;">'
      + '<strong>Não avaliados:</strong> '
      + escape(unassessed.map(item => item.objective.title).join('; '))
      + '. Não equivalem a dificuldades.</p>'
    : '';

  return '<div class="section-block" style="margin-bottom:18px;">'
    + '<h3 style="color:#0d9488;border-bottom:2px solid #14b8a6;padding-bottom:8px;font-size:14px;">Resultados por Objetivo — Etapa 04</h3>'
    + '<ul style="font-size:11px;padding-left:18px;margin:8px 0;">' + rows + '</ul></div>'
    + '<div class="section-block" style="margin-bottom:18px;">'
    + '<h3 style="color:#0d9488;border-bottom:2px solid #14b8a6;padding-bottom:8px;font-size:14px;">Aspectos a Intervir — Etapa 05</h3>'
    + (pending.length
      ? '<p style="font-size:10px;color:#64748b;">Demandas para continuidade derivadas das respostas clínicas por objetivo.</p>'
        + '<ul style="font-size:11px;padding-left:18px;margin:8px 0;">' + pendingRows + '</ul>'
      : '<p style="font-size:11px;">' + emptyMessage + '</p>')
    + unassessedNotice + '</div>';
}
