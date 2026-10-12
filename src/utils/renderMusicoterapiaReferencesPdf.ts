import { getSelectedMusicoterapiaReferences } from '@/data/musicoterapiaReferences';

/** Monta a bibliografia exclusivamente a partir dos IDs escolhidos na Etapa 06. */
export function renderMusicoterapiaReferencesPdf(
  referenceIds: unknown,
  escapeHtml: (value: string) => string
): string {
  const references = getSelectedMusicoterapiaReferences(referenceIds);
  if (!references.length) return '';

  const entries = references.map((reference) =>
    '<li style="margin:0 0 11px;line-height:1.65;page-break-inside:avoid;overflow-wrap:anywhere;">'
      + escapeHtml(reference.bibliography)
      + '</li>'
  ).join('');

  return '<div class="section-block" style="margin:20px 0;page-break-inside:auto;">'
    + '<h3 style="font-size:14px;color:#0d9488;border-bottom:2px solid #14b8a6;padding-bottom:8px;margin:0 0 12px;">'
    + 'Referências Bibliográficas</h3>'
    + '<ol style="padding-left:22px;margin:0;font-size:11px;color:#1f2937;">'
    + entries + '</ol>'
    + '<p style="font-size:9px;color:#64748b;margin:10px 0 0;">'
    + 'Referências selecionadas pelo profissional; a bibliografia, isoladamente, '
    + 'não comprova a eficácia nem o resultado individual de uma intervenção.</p>'
    + '</div>';
}
