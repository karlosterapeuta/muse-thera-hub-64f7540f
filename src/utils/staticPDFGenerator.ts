
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
  fullBleedPages?: boolean;
}

/**
 * Utilitário centralizado para geração de PDFs profissionais a partir de componentes React.
 * Projetado para ser resiliente a layouts complexos e carregar recursos externos.
 */
export const generateStaticPDF = async (
  component: React.ReactElement,
  options: PDFOptions = {}
): Promise<boolean> => {
  const {
    filename = 'documento.pdf',
    waitTime = 3000,
    quality = 2.0, // Qualidade balanceada para evitar erros de memória
    format = 'a4',
    orientation = 'portrait',
    fullBleedPages = false
  } = options;

  let container: HTMLDivElement | null = null;
  let reactRoot: any = null;

  try {
    console.log('🔄 [PDF Generator] Iniciando...', { filename, waitTime, quality });
    
    // 1. Criar container temporário
    container = document.createElement('div');
    container.id = 'musetera-pdf-render-container';
    // Estilos para tornar o container "invisível" mas capturável pelo html2canvas
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '210mm',
      height: 'auto',
      zIndex: '-10000',
      backgroundColor: '#ffffff',
      opacity: '1',
      visibility: 'visible',
      pointerEvents: 'none',
      overflow: 'visible'
    });
    
    document.body.appendChild(container);

    // 2. Renderizar via React 18
    const rootElement = document.createElement('div');
    rootElement.style.width = '100%';
    container.appendChild(rootElement);
    
    reactRoot = createRoot(rootElement);
    reactRoot.render(component);

    // 3. Aguardar renderização inicial
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // 4. Garantir carregamento de imagens antes de capturar
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length > 0) {
      console.log(`🖼️ [PDF Generator] Aguardando ${images.length} imagens...`);
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
          // Timeout de segurança por imagem
          setTimeout(resolve, 5000);
        });
      }));
    }

    // 5. Verificar conteúdo
    const htmlContent = rootElement.innerHTML;
    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('O conteúdo renderizado está vazio ou é insuficiente.');
    }
    console.log(`📄 [PDF Generator] Conteúdo pronto (${htmlContent.length} chars)`);

    // 6. Configurações html2pdf
    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc: Document) => {
          // Garante que o elemento clonado esteja visível
          const el = clonedDoc.getElementById('musetera-pdf-render-container');
          if (el) {
            el.style.position = 'static';
            el.style.zIndex = '1';
            el.style.opacity = '1';
          }
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: format, 
        orientation: orientation,
        compress: true,
        precision: 2
      },
      pagebreak: { 
        mode: ['css'],
        avoid: ['.musetera-card', '.musetera-pdf-page', 'table', 'tr', 'thead', 'tbody']
      }
    };

    // 7. Executar geração e download
    console.log('🖨️ [PDF Generator] Criando arquivo...');
    const worker = html2pdf().set(opt).from(rootElement);
    
    // Gerar o PDF e salvar
    await worker.save();
    
    // 8. Opcional: Salvar no storage do Supabase
    try {
      const pdfBlob = await worker.output('blob');
      if (pdfBlob && pdfBlob.size > 500) {
        await savePDFToStorage(pdfBlob, filename, "report");
      }
    } catch (e) {
      console.warn('⚠️ [PDF Generator] Falha ao salvar cópia no storage:', e);
    }

    console.log('✅ [PDF Generator] Concluído com sucesso!');
    return true;

  } catch (error) {
    console.error('❌ [PDF Generator] Erro Crítico:', error);
    toast.error('Não foi possível gerar o PDF. Verifique sua conexão e tente novamente.');
    return false;
  } finally {
    // 9. Limpeza do DOM e React
    setTimeout(() => {
      if (reactRoot) {
        try { reactRoot.unmount(); } catch (e) {}
      }
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
    }, 2000);
  }
};
