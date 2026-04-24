
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
   * Quando true, mede o conteúdo renderizado e ajusta automaticamente margens,
   * tamanho de fonte base e escala dos elementos (incluindo gráficos SVG/canvas)
   * para garantir que cada "página lógica" caiba na folha A4 sem cortes.
   */
  autoFit?: boolean;
}

export const generateStaticPDF = async (
  component: React.ReactElement,
  options: PDFOptions = {}
): Promise<boolean> => {
  const {
    filename = 'documento.pdf',
    waitTime = 3000,
    quality = 1.2,
    format = 'a4',
    orientation = 'portrait',
    autoFit = true,
  } = options;

  try {
    console.log('🔄 Iniciando geração de PDF...', { filename, waitTime, quality });
    
    // Criar container temporário com estilos específicos para PDF
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm'; // A4 width
    container.style.minHeight = '297mm'; // A4 height
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Times New Roman, serif';
    container.style.fontSize = '12px';
    container.style.lineHeight = '1.6';
    container.style.color = '#000000';
    container.style.padding = '20mm';
    container.style.boxSizing = 'border-box';
    document.body.appendChild(container);

    const root = document.createElement('div');
    root.style.width = '100%';
    root.style.minHeight = '100%';
    container.appendChild(root);

    // Renderizar componente com React 18
    const reactRoot = createRoot(root);
    reactRoot.render(component);

    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Aguardar um frame adicional para garantir renderização
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
    
    // Verificar se o conteúdo foi renderizado
    console.log('📄 Conteúdo renderizado:', root.innerHTML.length, 'caracteres');
    if (root.innerHTML.length < 100) {
      throw new Error('Conteúdo insuficiente para gerar PDF');
    }

    // ====== AUTO-FIT: medir conteúdo e ajustar para caber em A4 ======
    // A4 em mm: 210 x 297 (portrait) | 297 x 210 (landscape)
    const pageWmm = orientation === 'portrait'
      ? (format === 'a4' ? 210 : 215.9)
      : (format === 'a4' ? 297 : 279.4);
    const pageHmm = orientation === 'portrait'
      ? (format === 'a4' ? 297 : 279.4)
      : (format === 'a4' ? 210 : 215.9);

    // Margens dinâmicas — começam confortáveis e podem ser reduzidas se o conteúdo for denso
    let marginMm = 15;

    if (autoFit) {
      // Cada filho direto do root é tratado como uma "página lógica" (padrão usado pelos PDFs do projeto)
      const pages = Array.from(root.children) as HTMLElement[];
      // px por mm: container tem 210mm de largura, então usamos sua largura real
      const pxPerMm = container.getBoundingClientRect().width / 210;

      // Mede a página mais alta para decidir o fator de escala global
      let worstRatio = 1;
      for (const pageEl of pages) {
        const rect = pageEl.getBoundingClientRect();
        const heightMm = rect.height / pxPerMm;
        // espaço útil = altura A4 - 2*margem
        const usableMm = pageHmm - marginMm * 2;
        const ratio = heightMm / usableMm;
        if (ratio > worstRatio) worstRatio = ratio;
      }

      // Se alguma página estoura, reduzimos margens primeiro e depois aplicamos transform: scale
      if (worstRatio > 1) {
        // Tenta reduzir margens até o mínimo seguro de 6mm
        const minMargin = 6;
        const usableAtMin = pageHmm - minMargin * 2;
        // Recalcula a pior razão considerando margem mínima
        let worstAtMin = 1;
        for (const pageEl of pages) {
          const rect = pageEl.getBoundingClientRect();
          const heightMm = rect.height / pxPerMm;
          const r = heightMm / usableAtMin;
          if (r > worstAtMin) worstAtMin = r;
        }

        if (worstAtMin <= 1) {
          // Apenas reduzir margens já resolve
          marginMm = Math.max(minMargin, Math.ceil(pageHmm / 2 - (pageHmm / 2) / worstRatio));
        } else {
          // Precisamos escalar o conteúdo
          marginMm = minMargin;
          const scale = Math.min(1, 1 / worstAtMin) * 0.98; // 2% de folga
          for (const pageEl of pages) {
            pageEl.style.transformOrigin = 'top left';
            pageEl.style.transform = `scale(${scale})`;
            // Compensa o "buraco" deixado pelo scale ajustando largura/altura
            pageEl.style.width = `${100 / scale}%`;
          }
          // Reajusta tipografia base proporcionalmente para manter legibilidade nominal
          const baseFont = Math.max(10, Math.floor(12 * scale));
          container.style.fontSize = `${baseFont}px`;
          console.log(`📐 Auto-fit aplicado: scale=${scale.toFixed(3)}, margem=${marginMm}mm, fonte=${baseFont}px`);
        }
      }

      // Aguarda reflow após mudanças de layout
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
    }

    // Configurações otimizadas do PDF para artigos acadêmicos
    const opt = {
      margin: [marginMm, marginMm, marginMm, marginMm],
      filename,
      pagebreak: { 
        mode: ['css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: '.page-break-avoid'
      },
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
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
        floatPrecision: 16
      }
    };

    // Gerar PDF
    console.log('🖨️ Gerando arquivo PDF...', { marginMm, autoFit });
    const pdfInstance = html2pdf().set(opt).from(root);
    await pdfInstance.save();
    try { const blob = await pdfInstance.outputPdf('blob'); await savePDFToStorage(blob, opt.filename || 'document.pdf', "report"); } catch(e) { console.warn(e); }
    
    // Limpar container e root do React
    reactRoot.unmount();
    document.body.removeChild(container);
    
    console.log('✅ PDF gerado com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    console.error('Stack trace:', (error as Error).stack);
    toast.error('Erro ao gerar PDF. Por favor, tente novamente.');
    return false;
  }
};
