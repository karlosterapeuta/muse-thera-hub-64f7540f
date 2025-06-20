
import { generateStaticPDF } from './staticPDFGenerator';
import { ScientificArticlePDFContent } from '@/components/ScientificArticlePDFContent';
import { toast } from 'sonner';
import React from 'react';

export const generateScientificArticlePDF = async (): Promise<boolean> => {
  try {
    console.log("📄 Gerando PDF do Artigo Científico...");
    
    const component = React.createElement(ScientificArticlePDFContent);

    const success = await generateStaticPDF(component, {
      filename: `Artigo_Cientifico_Escala_MuseTera_${new Date().toISOString().split('T')[0]}.pdf`,
      waitTime: 6000, // Increased wait time
      quality: 2.0,
      format: 'a4',
      orientation: 'portrait'
    });

    if (success) {
      toast.success('PDF do artigo científico gerado com sucesso!');
      console.log("✅ PDF do artigo científico gerado com sucesso!");
    } else {
      toast.error('Erro ao gerar PDF do artigo científico');
      console.log("❌ Erro ao gerar PDF do artigo científico");
    }

    return success;
    
  } catch (error) {
    console.error("❌ Erro ao gerar PDF do artigo científico:", error);
    toast.error('Erro ao gerar PDF do artigo científico. Tente novamente.');
    return false;
  }
};
