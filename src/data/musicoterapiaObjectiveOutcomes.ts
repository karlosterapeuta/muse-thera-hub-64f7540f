import { getSelectedMusicoterapiaObjectives } from '@/data/musicoterapiaObjectives';

export const objectiveOutcomeOptions = [
  { id: 'achieved', label: 'Alcançado' },
  { id: 'progressing', label: 'Evoluindo' },
  { id: 'no_progress', label: 'Sem avanço observado' },
  { id: 'difficulty', label: 'Com dificuldade' },
  { id: 'not_assessed', label: 'Não avaliado' }
] as const;

export type ObjectiveOutcomeStatus = (typeof objectiveOutcomeOptions)[number]['id'];
export type ObjectiveOutcomes = Record<string, ObjectiveOutcomeStatus>;

export function isObjectiveOutcomeStatus(value: unknown): value is ObjectiveOutcomeStatus {
  return typeof value === 'string' && objectiveOutcomeOptions.some(option => option.id === value);
}

export function getObjectiveOutcomes(selectedIds: unknown, raw: unknown) {
  const selected = getSelectedMusicoterapiaObjectives(selectedIds);
  const source = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? raw as Record<string, unknown> : {};
  return selected.flatMap(objective => {
    const status = source[objective.id];
    return isObjectiveOutcomeStatus(status) ? [{ objective, status }] : [];
  });
}

/**
 * Estas necessidades são derivadas EXCLUSIVAMENTE da resposta individual
 * a cada objetivo, nunca inferidas da abordagem escolhida ou de um status global.
 */
export function getPendingObjectiveInterventions(selectedIds: unknown, outcomes: unknown) {
  return getObjectiveOutcomes(selectedIds, outcomes).filter(
    item => item.status === 'progressing' || item.status === 'no_progress' || item.status === 'difficulty'
  );
}

export function getObjectiveOutcomeLabel(status: ObjectiveOutcomeStatus): string {
  return objectiveOutcomeOptions.find(item => item.id === status)?.label || status;
}

export function getObjectiveOutcomesValidationIssues(selectedIds: unknown, raw: unknown): string[] {
  const total = getSelectedMusicoterapiaObjectives(selectedIds).length;
  const recorded = getObjectiveOutcomes(selectedIds, raw).length;
  if (!total || recorded === total) return [];
  const missing = total - recorded;
  return [`Informe a evolução dos ${missing} objetivo${missing === 1 ? '' : 's'} pendente${missing === 1 ? '' : 's'} para definir a continuidade na Etapa 06.`];
}
