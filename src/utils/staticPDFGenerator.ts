
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
    waitTime = 2000,
    quality = 1.5,
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    // Criar container temporário
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.style.minHeight = '100vh';
    document.body.appendChild(container);

    const root = document.createElement('div');
    container.appendChild(root);

    // Renderizar componente
    ReactDOM.render(component, root);

    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Aguardar um pouco mais para garantir que todas as imagens e estilos sejam aplicados
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Configurações aprimoradas do PDF
    const opt = {
      margin: [15, 15, 15, 15],
      filename,
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
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
        imageTimeout: 20000, // Aumentado timeout para imagens
        height: window.innerHeight * 2, // Aumentada altura
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: true,
        ignoreElements: function(element) {
          return element.tagName === 'SCRIPT';
        }
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
