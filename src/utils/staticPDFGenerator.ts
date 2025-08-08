
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom';
import { toast } from 'sonner';

interface PDFOptions {
  filename?: string;
  waitTime?: number;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export const generateStaticPDF = async (
  component: React.ReactElement,
  options: PDFOptions = {}
): Promise<boolean> => {
  const {
    filename = 'documento.pdf',
    waitTime = 4000,
    quality = 2.0,
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
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

    // Renderizar componente
    ReactDOM.render(component, root);

    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, waitTime));

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
        imageTimeout: 20000,
        height: container.scrollHeight,
        width: container.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123 // A4 height in pixels at 96 DPI
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
    await html2pdf().set(opt).from(root).save();
    
    // Limpar container
    document.body.removeChild(container);
    
    return true;
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    toast.error('Erro ao gerar PDF. Por favor, tente novamente.');
    return false;
  }
};
