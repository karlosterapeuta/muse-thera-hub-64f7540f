
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { ScientificArticlePDFContent } from '@/components/ScientificArticlePDFContent';
import React from 'react';

export const generateScientificArticlePDF = async (): Promise<boolean> => {
  try {
    console.log("📄 Gerando PDF do Artigo Científico...");
    
    const component = React.createElement(ScientificArticlePDFContent);

    return await generateStaticPDF(component, {
      filename: `Artigo_Cientifico_Escala_MuseTera_${new Date().toISOString().split('T')[0]}.pdf`,
      waitTime: 6000, // Aumentado para aguardar renderização das figuras
      quality: 2.5, // Aumentada a qualidade
      format: 'a4',
      orientation: 'portrait'
    });
    
  } catch (error) {
    console.error("Erro ao gerar PDF do artigo científico:", error);
    return false;
  }
};
