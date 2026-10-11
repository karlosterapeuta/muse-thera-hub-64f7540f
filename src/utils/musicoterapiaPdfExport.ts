import html2pdf from 'html2pdf.js';

/**
 * Estilos exclusivos do PDF (não modificam o sistema). A página A4 possui
 * 210 mm; com 12 mm de margem lateral a área útil é 186 mm.
 * Evitar "section-block" como um bloco indivisível: pode ocupar várias
 * páginas e, quando for maior do que uma folha, cortar linhas no renderizador.
 */
export const museteraPdfStyles = `
<style>
  .pdf-document, .pdf-document * { box-sizing: border-box; }
  .pdf-document { width: 186mm; max-width: 186mm; margin: 0; padding: 0; background: #fff; color: #233349; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.55; }
  .pdf-document .section-block { page-break-inside: auto !important; break-inside: auto !important; max-width: 100%; }
  .pdf-document p, .pdf-document li, .pdf-document h2, .pdf-document h3, .pdf-document h4 {
    overflow-wrap: anywhere; word-wrap: break-word; hyphens: auto;
    page-break-inside: avoid; break-inside: avoid;
  }
  .pdf-document p { orphans: 3; widows: 3; }
  .pdf-document li { margin-bottom: 5px; }
  .pdf-document ul, .pdf-document ol { padding-left: 18px; margin: 8px 0 12px; }
  .pdf-document .pdf-keep { page-break-inside: avoid !important; break-inside: avoid !important; }
  .pdf-document img, .pdf-document svg { max-width: 100%; object-fit: contain; }
  .pdf-document h2, .pdf-document h3, .pdf-document h4 { page-break-after: avoid; break-after: avoid; }
  .pdf-document h3 { letter-spacing: .05px; }
  .pdf-document strong { font-weight: 700; }
  .pdf-document .pdf-masthead {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 17px 18px 14px; border-radius: 10px;
    background: #f0fdfa; border: 1px solid #99f6e4;
    border-left: 5px solid #0f766e; margin-bottom: 16px;
  }
  .pdf-document .pdf-masthead-copy { flex: 1; min-width: 0; }
  .pdf-document .pdf-kicker { font-size: 8.5px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.7px; color: #0f766e; }
  .pdf-document .pdf-masthead h1 { color: #134e4a; font-size: 21px; margin: 6px 0 3px; line-height: 1.15; font-weight: 700; }
  .pdf-document .pdf-masthead p { color: #475569; font-size: 10.5px; margin: 0; }
  .pdf-document .pdf-header-art { flex-shrink: 0; display: block; width: 143px; height: 78px; }
  .pdf-document .pdf-document-logo { display: block; max-height: 44px; max-width: 132px; margin-bottom: 8px; object-fit: contain; }
  .pdf-document .pdf-overview { font-size: 10.5px; color: #475569; margin: 0 0 14px; }
  .pdf-document .pdf-section-heading { display: flex; align-items: center; gap: 9px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 12px; }
  .pdf-document .pdf-section-index { background: #0f766e; color: #fff; border-radius: 6px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; font-size: 11px; font-weight: 700; width: 29px; height: 29px; }
  .pdf-document .pdf-section-heading h2 { color: #0f766e; font-size: 13.5px; margin: 0; border: 0; padding: 0; }
  .pdf-document .pdf-section-heading p { color: #64748b; font-size: 9.5px; margin: 2px 0 0; }
  .pdf-document .pdf-dashboard { margin: 15px 0 22px; page-break-inside: auto !important; }
  .pdf-document .pdf-stat-row { display: flex; gap: 9px; margin: 11px 0 15px; }
  .pdf-document .pdf-stat { flex: 1; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 11px 10px; }
  .pdf-document .pdf-stat strong { display: block; font-size: 19px; font-weight: 700; color: #0f766e; line-height: 1.1; margin-bottom: 4px; }
  .pdf-document .pdf-stat span { display: block; font-size: 9.2px; color: #475569; }
  .pdf-document .pdf-chart-grid { display: flex; gap: 13px; align-items: flex-start; }
  .pdf-document .pdf-chart { flex: 1; min-width: 0; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; padding: 12px 10px; }
  .pdf-document .pdf-chart-title { font-size: 11px; font-weight: 700; color: #334155; margin: 0 0 11px; }
  .pdf-document .pdf-chart-row { display: flex; align-items: center; gap: 6px; margin: 6px 0; min-height: 15px; }
  .pdf-document .pdf-chart-label { color: #475569; font-size: 8.4px; width: 32%; line-height: 1.15; overflow-wrap: break-word; }
  .pdf-document .pdf-chart-track { flex: 1; height: 8px; background: #edf2f7; border-radius: 10px; overflow: hidden; }
  .pdf-document .pdf-chart-fill { height: 8px; display: block; border-radius: 10px; }
  .pdf-document .pdf-chart-number { min-width: 12px; text-align: right; font-size: 9px; color: #334155; }
  .pdf-document .pdf-chart-source { margin-top: 9px; color: #64748b; font-size: 8px; }
  .pdf-document .pdf-context-note { color: #64748b; font-size: 9px; margin: 9px 0 0; }
  .pdf-document .section-block:not(.pdf-dashboard) { margin-top: 12px; }
  .pdf-document .section-block:not(.pdf-dashboard) > h3 { border-bottom: 1px solid #99f6e4; padding: 0 0 7px; margin: 0 0 10px; color: #0f766e; font-size: 13px; }
  .pdf-document .section-block:not(.pdf-dashboard) p, .pdf-document .section-block:not(.pdf-dashboard) li { line-height: 1.6; }
  .pdf-document .pdf-identity { margin: 0 0 17px; border: 1px solid #d7e8e6; background: #f8fdfc; padding: 12px 14px; border-radius: 8px; }
  .pdf-document .pdf-identity h2 { font-size: 13.5px; color: #0f766e; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid #c5e7df; }
  .pdf-document .pdf-identity-grid { display: flex; gap: 16px; align-items: flex-start; }
  .pdf-document .pdf-identity-grid > div { flex: 1; min-width: 0; }
  .pdf-document .pdf-identity-grid p { margin: 3px 0; font-size: 10px; line-height: 1.5; overflow-wrap: anywhere; }
  .pdf-document .pdf-identity-grid > div + div { border-left: 1px solid #c5e7df; padding-left: 14px; }
  @media print { .pdf-document { width: 186mm; } }
</style>`;

/**
 * Gera uma cópia em A4 paginada, com margens reais e rodapé por página.
 * html2pdf.js usa html2canvas, portanto "seções" longas precisam poder fluir
 * entre páginas; evitar SOMENTE parágrafos, listas e cartões pequenos.
 */
export async function exportMusicoterapiaHtmlPdf(
  html: string,
  filename: string
): Promise<Blob> {
  const element = document.createElement('div');
  element.style.width = '186mm';
  element.style.maxWidth = '186mm';
  element.style.fontFamily = 'Arial, sans-serif';
  element.style.color = '#233349';
  element.style.background = '#fff';
  element.style.boxSizing = 'border-box';
  element.innerHTML = museteraPdfStyles + html;

  // Corrige as regras "avoid" herdadas dos relatórios antigos: as seções
  // grandes precisam ser divisíveis; parágrafos e cartões continuam protegidos.
  element.querySelectorAll<HTMLElement>('.section-block').forEach(section => {
    section.style.pageBreakInside = 'auto';
    section.style.breakInside = 'auto';
  });
  document.body.appendChild(element);
  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const options = {
      margin: [14, 12, 17, 12],
      filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['.pdf-keep', '.pdf-stat', '.pdf-chart-row', 'p', 'li', 'h2', 'h3', 'h4']
      }
    };
    const pdf: any = await html2pdf().set(options).from(element).toPdf().get('pdf');
    const pages = pdf.internal.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      pdf.setPage(page);
      pdf.setDrawColor(185, 207, 207);
      pdf.setLineWidth(0.2);
      pdf.line(12, 283.5, 198, 283.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(90, 109, 122);
      pdf.text('MUSETERA  |  Relatório de Musicoterapia  |  Documento confidencial', 12, 289);
      pdf.text(`Página ${page} de ${pages}`, 198, 289, { align: 'right' });
    }
    const blob = pdf.output('blob') as Blob;
    await pdf.save(filename);
    return blob;
  } finally {
    element.remove();
  }
}
