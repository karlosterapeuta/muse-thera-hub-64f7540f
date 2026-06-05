
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

export const generateStaticPDF = async (
  component: React.ReactElement,
  options: PDFOptions = {}
): Promise<boolean> => {
  const {
    filename = 'documento.pdf',
    waitTime = 3500, // Aumentado para garantir carregamento de fontes/imagens
    quality = 2.0, // Reduzido levemente para evitar estouro de memória
    format = 'a4',
    orientation = 'portrait',
    fullBleedPages = false
  } = options;

  let container: HTMLDivElement | null = null;
  let reactRoot: any = null;

  try {
    console.log('🔄 Iniciando geração de PDF...', { filename, waitTime, quality });
    
    // Criar container temporário visível mas fora da tela principal para html2canvas
    container = document.createElement('div');
    container.id = 'pdf-generation-container';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '210mm'; // Largura fixa de A4
    container.style.height = 'auto';
    container.style.zIndex = '-9999';
    container.style.backgroundColor = '#ffffff';
    container.style.opacity = '1'; // Mantemos opacidade 1 para o canvas não sair transparente
    container.style.pointerEvents = 'none';
    container.style.visibility = 'visible'; // Deve estar visível para o html2canvas
    
    document.body.appendChild(container);

    const rootElement = document.createElement('div');
    rootElement.style.width = '100%';
    container.appendChild(rootElement);

    // Renderizar componente com React 18
    reactRoot = createRoot(rootElement);
    reactRoot.render(component);

    // Aguardar renderização e carregamento de recursos
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Garantir que todas as imagens foram carregadas
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Verificar se o conteúdo foi renderizado
    const content = rootElement.innerHTML;
    console.log('📄 Conteúdo renderizado:', content.length, 'caracteres');
    
    if (content.length < 200) {
      console.warn('⚠️ Conteúdo possivelmente vazio detectado');
    }

    // Configurações otimizadas do PDF
    const opt = {
      margin: fullBleedPages ? 0 : [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: quality,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        logging: true, // Habilitar logs para depuração interna se necessário
        onclone: (clonedDoc: Document) => {
          // Ajustes extras no clone se necessário
          const el = clonedDoc.getElementById('pdf-generation-container');
          if (el) {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
          }
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: format, 
        orientation: orientation,
        compress: true
      },
      pagebreak: { 
        mode: ['css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['.page-break-avoid', '.musetera-pdf-page', 'table', 'tr', 'thead', 'tbody']
      }
    };

    // Gerar PDF usando html2pdf
    console.log('🖨️ Capturando canvas e gerando arquivo...');
    const worker = html2pdf().set(opt).from(rootElement);
    
    // Salvar e aguardar conclusão
    await worker.save();
    
    // Backup para storage
    try {
      const blob = await worker.outputPdf('blob');
      if (blob && blob.size > 1000) {
        await savePDFToStorage(blob, filename, "report");
        console.log('💾 PDF salvo no storage com sucesso');
      }
    } catch (storageError) {
      console.warn('⚠️ Erro ao salvar cópia no storage:', storageError);
    }
    
    console.log('✅ PDF gerado e baixado com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro crítico ao gerar PDF:', error);
    toast.error('Ocorreu um erro ao gerar o PDF. Tente salvar as alterações e atualizar a página.');
    return false;
  } finally {
    // Limpeza segura
    setTimeout(() => {
      if (reactRoot) {
        try { reactRoot.unmount(); } catch (e) { console.error('Erro ao desmontar root do PDF:', e); }
      }
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
    }, 1000);
  }
};
