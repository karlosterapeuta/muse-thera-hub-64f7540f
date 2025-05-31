
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { ScientificArticle } from "@/components/ScientificArticle";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";

export default function ScientificArticlePage() {
  const handleGeneratePDF = async () => {
    try {
      toast.loading("Gerando PDF do artigo científico...");

      const element = document.getElementById('scientific-article');
      if (!element) {
        toast.error("Erro ao encontrar o conteúdo do artigo");
        return;
      }

      const opt = {
        margin: [10, 10],
        filename: 'artigo-cientifico-escala-avaliacao-tea.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast.success("PDF do artigo científico gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header with Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Artigo Científico
              </h1>
              <p className="text-gray-600">
                Escala de Avaliação Musicoterapêutica para TEA - Estudo de Validação
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2 bg-white hover:bg-gray-50"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button
                onClick={handleGeneratePDF}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <FileDown className="h-4 w-4" />
                Gerar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div id="scientific-article">
            <ScientificArticle />
          </div>
        </div>
      </div>
    </div>
  );
}
