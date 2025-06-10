
import html2pdf from "html2pdf.js";
import React from "react";
import { createRoot } from "react-dom/client";

interface PDFGenerationOptions {
  filename: string;
  waitTime?: number;
  quality?: number;
}

export const generateStaticPDF = async (
  component: React.ReactElement,
  options: PDFGenerationOptions
): Promise<boolean> => {
  try {
    console.log("🎯 Iniciando geração de PDF estático...");
    
    // Criar elemento temporário
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    document.body.appendChild(tempDiv);

    // Renderizar componente
    const root = createRoot(tempDiv);
    root.render(component);

    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, options.waitTime || 2000));

    console.log("📊 Componente renderizado, iniciando captura...");

    // Configurações otimizadas para gráficos estáticos
    const pdfOptions = {
      margin: [10, 10, 10, 10],
      filename: options.filename,
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy']
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      html2canvas: {
        scale: options.quality || 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc: Document) => {
          // Garantir que elementos SVG sejam renderizados corretamente
          const svgs = clonedDoc.querySelectorAll('svg');
          svgs.forEach(svg => {
            svg.style.display = 'block';
            svg.style.visibility = 'visible';
          });
        }
      },
    };

    // Gerar PDF
    await html2pdf().from(tempDiv).set(pdfOptions).save();
    
    // Limpar
    root.unmount();
    document.body.removeChild(tempDiv);
    
    console.log("✅ PDF estático gerado com sucesso!");
    return true;
    
  } catch (error) {
    console.error("❌ Erro ao gerar PDF estático:", error);
    return false;
  }
};
