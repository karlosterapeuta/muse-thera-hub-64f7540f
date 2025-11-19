import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
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
    
    // Criar container VISÍVEL mas fora da tela
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px'; // Fora da tela - NÃO usar opacity:0!
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.minHeight = '297mm';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    container.style.overflow = 'visible';
    document.body.appendChild(container);

    // Copiar todos os estilos da página para o container
    console.log('📋 Injetando estilos CSS...');
    const styleSheets = Array.from(document.styleSheets);
    const styleContainer = document.createElement('div');

    styleSheets.forEach((sheet) => {
      try {
        // Tentar clonar folhas de estilo inline
        if (sheet.href === null) {
          const rules = Array.from(sheet.cssRules);
          const style = document.createElement('style');
          rules.forEach(rule => {
            style.appendChild(document.createTextNode(rule.cssText));
          });
          styleContainer.appendChild(style);
        } else {
          // Adicionar link para folhas de estilo externas
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = sheet.href;
          styleContainer.appendChild(link);
        }
      } catch (e) {
        console.warn('Não foi possível clonar stylesheet:', e);
      }
    });

    container.prepend(styleContainer);
    console.log('📋 Estilos injetados no container');

    // Aguardar carregamento de estilos externos
    await new Promise<void>((resolve) => {
      const links = styleContainer.querySelectorAll('link[rel="stylesheet"]');
      if (links.length === 0) {
        resolve();
        return;
      }
      
      let loadedCount = 0;
      links.forEach(link => {
        link.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === links.length) {
            resolve();
          }
        });
        link.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === links.length) {
            resolve();
          }
        });
      });
      
      // Timeout de segurança
      setTimeout(() => resolve(), 1000);
    });

    console.log('✅ Estilos carregados');

    // Renderizar com React 18 de forma SÍNCRONA
    console.log('🔄 Renderizando componente...');
    reactRoot = createRoot(container);
    
    // flushSync garante renderização síncrona e imediata
    flushSync(() => {
      reactRoot.render(component);
    });

    console.log('✅ Componente renderizado sincronamente');

    console.log('📄 Conteúdo renderizado:', container.innerHTML.length, 'caracteres');
    
    if (container.innerHTML.length < 100) {
      throw new Error('Conteúdo insuficiente para gerar PDF');
    }

    // Capturar com html2canvas
    console.log('📸 Capturando conteúdo com html2canvas...');
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true, // Ativar logs para debug
      windowWidth: 794, // A4 width em pixels (210mm)
      windowHeight: 1123 // A4 height em pixels (297mm)
    });

    console.log('🖼️ Canvas capturado:', {
      width: canvas.width,
      height: canvas.height,
      isEmpty: canvas.width === 0 || canvas.height === 0
    });

    console.log('🖼️ Canvas capturado:', {
      width: canvas.width,
      height: canvas.height,
      isEmpty: canvas.width === 0 || canvas.height === 0
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas vazio - falha na captura do conteúdo');
    }

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
    
    console.log('✅ PDF gerado e baixado com sucesso!', {
      filename,
      pages: pdf.getNumberOfPages(),
      fileSize: `${(imgData.length / 1024).toFixed(2)} KB`
    });
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
