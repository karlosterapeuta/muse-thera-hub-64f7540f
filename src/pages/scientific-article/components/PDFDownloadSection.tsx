
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Loader2 } from 'lucide-react';
import { generateScientificArticlePDF } from '@/utils/scientificArticlePDFGenerator';
import { generateScientificArticleWord } from '@/utils/scientificArticleWordGenerator';

export function PDFDownloadSection() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateScientificArticlePDF();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateWord = async () => {
    setIsGeneratingWord(true);
    try {
      await generateScientificArticleWord();
    } finally {
      setIsGeneratingWord(false);
    }
  };

  return (
    <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
          <BookOpen className="h-6 w-6 text-green-600" />
          Baixar Artigo Científico
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Versões do artigo científico formatadas para publicação e submissão em periódicos
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PDF Download */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Versão PDF</h3>
                <p className="text-sm text-gray-600">Formato ideal para leitura e impressão</p>
              </div>
            </div>
            <Button 
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Formatação acadêmica padrão, pronto para submissão
            </p>
          </div>

          {/* Word Download */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Versão Word</h3>
                <p className="text-sm text-gray-600">Formato editável para revisões</p>
              </div>
            </div>
            <Button 
              onClick={handleGenerateWord}
              disabled={isGeneratingWord}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGeneratingWord ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Word...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Word
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Formato RTF compatível com editores de texto
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded">
              <BookOpen className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-amber-800 mb-1">Informações sobre o Artigo</h4>
              <ul className="text-amber-700 space-y-1">
                <li>• Artigo científico completo com metodologia, resultados e discussão</li>
                <li>• Formatação seguindo padrões acadêmicos internacionais</li>
                <li>• Inclui resumo em português e inglês (abstract)</li>
                <li>• Referências bibliográficas no formato ABNT</li>
                <li>• Pronto para submissão em periódicos especializados</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
