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
    
    // Criar container VISÍVEL mas "invisível" ao usuário
    container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px'; // Move para fora da tela
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.minHeight = '297mm';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    container.style.overflow = 'visible';
    container.style.visibility = 'visible'; // Explicitamente visível para html2canvas
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-9999';
    document.body.appendChild(container);

    console.log('📦 Container criado e anexado ao DOM');

    // Renderizar com React 18 de forma SÍNCRONA
    console.log('🔄 Renderizando componente...');
    reactRoot = createRoot(container);
    
    // flushSync garante renderização síncrona do DOM
    flushSync(() => {
      reactRoot.render(component);
    });

    console.log('✅ Componente renderizado no DOM');

    // CRÍTICO: Aguardar carregamento de fontes e recursos CSS
    console.log('⏳ Aguardando carregamento de recursos (fontes, imagens)...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ Recursos carregados');

    // Verificar se há conteúdo no container
    const contentLength = container.innerHTML.length;
    console.log('📄 Conteúdo renderizado:', contentLength, 'caracteres');
    
    // Verificar se estilos foram aplicados
    const hasStyles = container.querySelector('[style]') !== null;
    console.log('🎨 Estilos inline detectados:', hasStyles);
    
    // Debug detalhado do container
    console.log('🔍 Debug do container:', {
      innerHTML: container.innerHTML.substring(0, 500),
      childNodes: container.childNodes.length,
      hasContent: container.textContent ? container.textContent.length : 0,
      opacity: window.getComputedStyle(container).opacity,
      display: window.getComputedStyle(container).display
    });
    
    if (!hasStyles) {
      console.warn('⚠️ Nenhum estilo inline encontrado - PDF pode estar sem formatação');
    }
    
    if (contentLength < 500) {
      console.error('❌ Conteúdo insuficiente:', container.innerHTML.substring(0, 200));
      throw new Error('Componente não renderizou corretamente - conteúdo muito pequeno');
    }

    // Capturar com html2canvas
    console.log('📸 Iniciando captura com html2canvas...');
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: container.offsetWidth,
      windowHeight: container.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0
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
    
    // Verificar se canvas tem conteúdo visível (não totalmente branco)
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
      const hasColor = imageData.data.some((value, index) => {
        // Verificar se há pixels não-brancos (RGB diferente de 255)
        if (index % 4 < 3) return value < 255;
        return false;
      });
      console.log('🎨 Canvas tem conteúdo colorido:', hasColor);
      if (!hasColor) {
        console.warn('⚠️ Canvas parece estar totalmente branco - possível problema na captura');
      }
    }
    
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
