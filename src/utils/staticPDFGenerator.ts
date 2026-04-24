
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

    // Configurações otimizadas do PDF para artigos acadêmicos
    const opt = {
      margin: [15, 15, 15, 15], // margem em mm
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
        imageTimeout: 20000
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
    console.log('🖨️ Gerando arquivo PDF...');
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
