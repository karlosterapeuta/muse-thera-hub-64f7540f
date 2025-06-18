
import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';
import ReactDOM from 'react-dom';
import { MuseteraScientificArticle } from '@/components/MuseteraScientificArticle';

export const useMuseteraArticlePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateArticlePDF = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      toast.loading("Gerando artigo científico em PDF...");

      // Criar o conteúdo do artigo
      const articleContent = (
        <div id="article-content" style={{ display: 'block' }}>
          <MuseteraScientificArticle />
        </div>
      );

      // Criar container temporário
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '210mm'; // A4 width
      document.body.appendChild(container);

      const root = document.createElement('div');
      container.appendChild(root);

      // Renderizar o componente
      ReactDOM.render(articleContent, root);

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Configurações do PDF
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `artigo-cientifico-escala-musetera-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123 // A4 height in pixels at 96 DPI
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.page-break-avoid'
        }
      };

      // Gerar PDF
      await html2pdf().set(opt).from(root).save();
      
      // Limpar
      document.body.removeChild(container);
      
      toast.success("Artigo científico gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar artigo científico:", error);
      toast.error("Erro ao gerar artigo científico. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateArticlePDF,
    isGenerating
  };
};
