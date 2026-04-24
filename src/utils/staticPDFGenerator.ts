import html2pdf from 'html2pdf.js';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import { savePDFToStorage } from './pdfStorageUtils';

interface PDFOptions {
  filename?: string;
  waitTime?: number;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  /**
   * Quando true (padrão), trata cada filho direto do root como uma página lógica
   * e captura/encaixa cada uma individualmente no A4 — eliminando páginas em
   * branco causadas por `transform: scale`, `pageBreakAfter` residual ou
   * estouros do slicing automático do html2pdf.
   */
  autoFit?: boolean;
}

// A4/Letter em mm
const PAGE_DIMS = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
};

const waitFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Modo profissional: captura cada "página lógica" (filho direto do root) como
 * imagem individual e a encaixa em uma página A4 do jsPDF, dimensionando para
 * caber sem cortes nem páginas em branco.
 */
async function renderSectionedPDF(
  pages: HTMLElement[],
  filename: string,
  format: 'a4' | 'letter',
  orientation: 'portrait' | 'landscape',
  quality: number,
): Promise<Blob> {
  // Importações dinâmicas para evitar custo no bundle inicial
  const [{ jsPDF }, html2canvasMod] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);
  const html2canvas = (html2canvasMod as any).default || html2canvasMod;

  const dims = PAGE_DIMS[format];
  const pageW = orientation === 'portrait' ? dims.w : dims.h;
  const pageH = orientation === 'portrait' ? dims.h : dims.w;

  // Margens dinâmicas: começam em 12mm e podem reduzir até 6mm para conteúdo denso
  const baseMargin = 12;
  const minMargin = 6;

  const pdf = new jsPDF({
    unit: 'mm',
    format: format === 'a4' ? 'a4' : 'letter',
    orientation,
    compress: true,
    putOnlyUsedFonts: true,
  });

  for (let i = 0; i < pages.length; i++) {
    const pageEl = pages[i];

    // Garante fundo branco e remove sombras pesadas que causam halo no canvas
    const prevBg = pageEl.style.backgroundColor;
    if (!prevBg) pageEl.style.backgroundColor = '#ffffff';

    // Remove pageBreakAfter residual que poderia gerar página vazia se algum dia
    // voltarmos para o fluxo do html2pdf
    pageEl.style.pageBreakAfter = 'auto';
    pageEl.style.breakAfter = 'auto';

    const canvas: HTMLCanvasElement = await html2canvas(pageEl, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      letterRendering: true,
      imageTimeout: 20000,
      windowWidth: pageEl.getBoundingClientRect().width,
    });

    const imgWpx = canvas.width;
    const imgHpx = canvas.height;
    const aspect = imgHpx / imgWpx;

    // Tenta encaixar com a margem-base; se a altura resultante não couber,
    // reduz a margem progressivamente até o mínimo seguro.
    let margin = baseMargin;
    let usableW = pageW - margin * 2;
    let usableH = pageH - margin * 2;
    let drawW = usableW;
    let drawH = drawW * aspect;

    if (drawH > usableH) {
      // Reduz margem até caber, ou até atingir o mínimo
      while (margin > minMargin) {
        margin -= 1;
        usableW = pageW - margin * 2;
        usableH = pageH - margin * 2;
        drawW = usableW;
        drawH = drawW * aspect;
        if (drawH <= usableH) break;
      }
      // Se ainda não couber, escala pela altura (preserva proporção)
      if (drawH > usableH) {
        drawH = usableH;
        drawW = drawH / aspect;
      }
    }

    // Centraliza horizontalmente
    const x = (pageW - drawW) / 2;
    const y = margin;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', x, y, drawW, drawH, undefined, 'FAST');

    // Restaura
    pageEl.style.backgroundColor = prevBg;
  }

  pdf.save(filename);
  return pdf.output('blob');
}

export const generateStaticPDF = async (
  component: React.ReactElement,
  options: PDFOptions = {}
): Promise<boolean> => {
  const {
    filename = 'documento.pdf',
    waitTime = 3000,
    quality = 1.6,
    format = 'a4',
    orientation = 'portrait',
    autoFit = true,
  } = options;

  let container: HTMLDivElement | null = null;
  let reactRoot: ReturnType<typeof createRoot> | null = null;

  try {
    console.log('🔄 Iniciando geração de PDF...', { filename, waitTime, quality, autoFit });

    // Container off-screen na largura exata da página
    const dims = PAGE_DIMS[format];
    const pageWmm = orientation === 'portrait' ? dims.w : dims.h;

    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-99999px';
    container.style.top = '0';
    container.style.width = `${pageWmm}mm`;
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Helvetica, Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.5';
    container.style.color = '#0f172a';
    container.style.boxSizing = 'border-box';
    document.body.appendChild(container);

    const root = document.createElement('div');
    root.style.width = '100%';
    container.appendChild(root);

    reactRoot = createRoot(root);
    reactRoot.render(component);

    // Aguarda renderização (gráficos, imagens, fontes)
    await new Promise((r) => setTimeout(r, waitTime));
    await waitFrame();
    if ((document as any).fonts?.ready) {
      try { await (document as any).fonts.ready; } catch {}
    }

    if (root.innerHTML.length < 100) {
      throw new Error('Conteúdo insuficiente para gerar PDF');
    }

    // Pega "páginas lógicas" — cada filho direto do root
    const pages = Array.from(root.children).filter(
      (n) => n instanceof HTMLElement && (n as HTMLElement).offsetHeight > 0,
    ) as HTMLElement[];

    if (autoFit && pages.length > 0) {
      // Modo profissional: 1 filho = 1 página, sem páginas em branco
      const blob = await renderSectionedPDF(pages, filename, format, orientation, quality);
      try { await savePDFToStorage(blob, filename, 'report'); } catch (e) { console.warn(e); }
    } else {
      // Fallback: html2pdf padrão
      const opt = {
        margin: [10, 10, 10, 10],
        filename,
        pagebreak: { mode: ['css', 'legacy'], avoid: '.page-break-avoid' },
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: quality,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          removeContainer: true,
          imageTimeout: 20000,
          windowWidth: container.getBoundingClientRect().width,
        },
        jsPDF: {
          unit: 'mm',
          format,
          orientation,
          compress: true,
          putOnlyUsedFonts: true,
        },
      };
      const pdfInstance = html2pdf().set(opt).from(root);
      await pdfInstance.save();
      try {
        const blob = await pdfInstance.outputPdf('blob');
        await savePDFToStorage(blob, filename, 'report');
      } catch (e) { console.warn(e); }
    }

    console.log('✅ PDF gerado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    console.error('Stack trace:', (error as Error).stack);
    toast.error('Erro ao gerar PDF. Por favor, tente novamente.');
    return false;
  } finally {
    try { reactRoot?.unmount(); } catch {}
    try { if (container && container.parentNode) container.parentNode.removeChild(container); } catch {}
  }
};
