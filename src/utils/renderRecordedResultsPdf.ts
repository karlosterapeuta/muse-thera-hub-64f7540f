import { summarizeApproachResult } from '@/data/musicoterapiaApproachResults';
import type { RecordedApproachResult } from '@/data/musicoterapiaApproachResults';

/** Layout compacto, derivado somente dos resultados informados pelo profissional. */
export function renderRecordedResultsPdf(
  records: RecordedApproachResult[],
  escape: (value: string) => string
): string {
  if (!records.length) return '';
  const items = records.map(({ approach, result }) => {
    const name = escape(approach.title);
    const text = escape(summarizeApproachResult(result));
    return '<div style="margin:10px 0;padding:9px 12px;background:#f0fdfa;border-left:3px solid #14b8a6;page-break-inside:avoid;">'
      + '<strong style="color:#0f766e;font-size:11px;">' + name + '</strong>'
      + '<p style="margin:4px 0 0;font-size:11px;white-space:pre-wrap;overflow-wrap:break-word;">'
      + text + '</p></div>';
  }).join('');
  return '<div class="section-block" style="margin-bottom:18px;">'
    + '<h3 style="color:#0d9488;border-bottom:2px solid #14b8a6;padding-bottom:8px;font-size:14px;">'
    + 'Resultados Observados por Abordagem</h3>'
    + '<p style="font-size:10px;color:#64748b;">Registros do musicoterapeuta. '
    + 'As observações não comprovam, isoladamente, causalidade terapêutica.</p>'
    + items + '</div>';
}
