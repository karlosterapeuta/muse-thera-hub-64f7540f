import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';

interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export const generateReactPDF = async (
  component: React.ReactElement,
  options: PDFOptions = {}
): Promise<boolean> => {
  const {
    filename = 'documento.pdf',
    format = 'a4',
    orientation = 'portrait'
  } = options;

  let container: HTMLDivElement | null = null;
  let reactRoot: any = null;

  try {
    console.log('🔄 Iniciando geração de PDF...', { filename });
    
    // Criar container VISÍVEL temporariamente
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.minHeight = '297mm';
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '-9999';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    // Renderizar com React 18
    reactRoot = createRoot(container);
    
    // Usar Promise para aguardar renderização
    await new Promise<void>((resolve) => {
      reactRoot.render(component);
      
      // Aguardar múltiplos frames para garantir renderização completa
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 2000);
        });
      });
    });

    console.log('📄 Conteúdo renderizado:', container.innerHTML.length, 'caracteres');
    
    if (container.innerHTML.length < 100) {
      throw new Error('Conteúdo insuficiente para gerar PDF');
    }

    // Capturar com html2canvas
    console.log('📸 Capturando conteúdo...');
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794, // A4 width em pixels (210mm)
      windowHeight: 1123 // A4 height em pixels (297mm)
    });

    console.log('🖨️ Gerando PDF...');
    
    // Criar PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format
    });

    const imgWidth = orientation === 'portrait' ? 210 : 297;
    const pageHeight = orientation === 'portrait' ? 297 : 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Adicionar primeira página
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Adicionar páginas adicionais se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Salvar PDF
    pdf.save(filename);
    
    console.log('✅ PDF gerado com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    console.error('Stack trace:', (error as Error).stack);
    toast.error('Erro ao gerar PDF. Por favor, tente novamente.');
    return false;
  } finally {
    // Limpar SEMPRE
    if (reactRoot) {
      try {
        reactRoot.unmount();
      } catch (e) {
        console.warn('Erro ao desmontar root:', e);
      }
    }
    if (container && container.parentNode) {
      try {
        document.body.removeChild(container);
      } catch (e) {
        console.warn('Erro ao remover container:', e);
      }
    }
  }
};
