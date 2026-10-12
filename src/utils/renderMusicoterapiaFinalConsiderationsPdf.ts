import { getMusicoterapiaFinalConsiderations } from '@/utils/musicoterapiaFinalConsiderations';

/**
 * Renderização idêntica à síntese exibida ao profissional na Etapa 08.
 * Converte somente as marcações e a nota registrada; todo texto é escapado.
 */
export function renderMusicoterapiaFinalConsiderationsPdf(
  fields: Record<string, unknown> | undefined,
  escapeHtml: (value: string) => string
): string {
  const result = getMusicoterapiaFinalConsiderations(fields);
  if (!result.paragraphs.length) return '';

  const paragraphs = result.paragraphs.map((text) =>
    '<p style="margin:0 0 9px;font-size:11px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;">'
    + escapeHtml(text)
    + '</p>'
  ).join('');

  return '<div class="section-block" style="margin-bottom:20px;page-break-inside:auto;">'
    + '<h3 style="color:#0d9488;border-bottom:2px solid #14b8a6;padding-bottom:8px;margin:0 0 12px;font-size:14px;">'
    + 'Considerações Finais</h3>'
    + paragraphs + '</div>';
}
