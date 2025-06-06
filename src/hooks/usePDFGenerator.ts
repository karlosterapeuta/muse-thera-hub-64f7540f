
import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

interface PDFOptions {
  filename?: string;
  margin?: number[];
  format?: string;
  orientation?: 'portrait' | 'landscape';
}

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (
    htmlContent: string,
    options: PDFOptions = {}
  ) => {
    try {
      setIsGenerating(true);
      toast.loading("Gerando PDF...", { id: "pdf-generation" });

      const {
        filename = `documento-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
        margin = [10, 10, 10, 10],
        format = 'a4',
        orientation = 'portrait'
      } = options;

      // Criar elemento temporário
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // Definir HTML completo
      const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Documento PDF</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
            body { background: white; color: #333; line-height: 1.6; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #374151; margin-bottom: 8px; }
            .content { margin: 20px 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
            @media print { body { padding: 15px; } }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      tempDiv.innerHTML = fullHTML;

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdfOptions = {
        margin,
        filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format, 
          orientation
        }
      };

      await html2pdf().set(pdfOptions).from(tempDiv).save();
      
      // Limpar elemento temporário
      document.body.removeChild(tempDiv);
      
      toast.dismiss("pdf-generation");
      toast.success("PDF gerado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.dismiss("pdf-generation");
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating
  };
};
