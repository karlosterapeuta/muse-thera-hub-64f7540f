import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';

export const approachResultStatuses = [
  { id: 'not_applied', label: 'Não aplicada' },
  { id: 'insufficient_data', label: 'Em observação' },
  { id: 'with_support', label: 'Com apoio' },
  { id: 'independent', label: 'Espontaneamente' },
  { id: 'progress', label: 'Progresso observado' },
  { id: 'variable', label: 'Respostas variáveis' },
  { id: 'difficulties', label: 'Dificuldades' }
] as const;
export type ApproachResultStatus = (typeof approachResultStatuses)[number]['id'];
export type ApproachResultEntry = { status: ApproachResultStatus; indicators: string[]; note: string };
export type ApproachResultsById = Record<string, ApproachResultEntry>;

export function isApproachResultStatus(value: unknown): value is ApproachResultStatus {
  return typeof value === 'string' && approachResultStatuses.some(item => item.id === value);
}
export function getApproachResultStatusLabel(status: ApproachResultStatus): string {
  return approachResultStatuses.find(item => item.id === status)?.label || status;
}
export function getRecordedApproachResults(approachIds: unknown, rawResults: unknown) {
  const selected = getSelectedMusicoterapiaApproaches(approachIds);
  const data = rawResults && typeof rawResults === 'object' && !Array.isArray(rawResults)
    ? rawResults as Record<string, unknown> : {};
  return selected.flatMap(approach => {
    const raw = data[approach.id];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
    const value = raw as Record<string, unknown>;
    if (!isApproachResultStatus(value.status)) return [];
    return [{
      approach,
      result: {
        status: value.status,
        indicators: value.status === 'not_applied' ? [] : Array.isArray(value.indicators) ? value.indicators.filter((v): v is string => typeof v === 'string').slice(0, 12) : [],
        note: value.status === 'not_applied' ? '' : typeof value.note === 'string' ? value.note.slice(0, 2000) : ''
      } as ApproachResultEntry
    }];
  });
}
export function getApproachResultsValidationIssues(approachIds: unknown, rawResults: unknown): string[] {
  const selected = getSelectedMusicoterapiaApproaches(approachIds);
  if (!selected.length) return [];
  const results = getRecordedApproachResults(approachIds, rawResults);
  const found = new Set(results.map(item => item.approach.id));
  const missing = selected.filter(item => !found.has(item.id));
  const issues = missing.length ? [`Registre uma resposta para as ${missing.length} abordagens pendentes.`] : [];
  for (const { approach, result } of results) {
    if (result.status === 'progress' && !result.indicators.length && !result.note.trim()) {
      issues.push(`Em ${approach.title}, descreva ao menos uma observação que sustente o progresso.`);
    }
  }
  return issues;
}
export function summarizeApproachResult(result: ApproachResultEntry): string {
  const details = [
    result.indicators.length ? `Observado: ${result.indicators.join('; ')}.` : '',
    result.note.trim()
  ].filter(Boolean);
  return [getApproachResultStatusLabel(result.status) + '.', ...details].join(' ');
}
