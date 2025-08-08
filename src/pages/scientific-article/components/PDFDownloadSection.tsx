
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Loader2 } from 'lucide-react';
import { generateScientificArticlePDF } from '@/utils/scientificArticlePDFGenerator';
import { generateMuseTeraLiteratureReviewDOCX } from '@/utils/scientificLiteratureReviewWordGenerator';
import { useAdmin } from '@/hooks/use-admin';

export function PDFDownloadSection() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingDOC, setIsGeneratingDOC] = useState(false);
  const { data: isAdmin } = useAdmin();

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateScientificArticlePDF();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateDOC = async () => {
    setIsGeneratingDOC(true);
    try {
      await generateMuseTeraLiteratureReviewDOCX();
    } finally {
      setIsGeneratingDOC(false);
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
          Versão do artigo científico formatada para publicação e submissão em periódicos
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PDF Download */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Versão PDF</h3>
              <p className="text-sm text-gray-600">Formato ideal para leitura e impressão</p>
            </div>
          </div>
          <Button 
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
            size="lg"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Baixar PDF
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Formatação acadêmica padrão, pronto para submissão
          </p>
        </div>

        {/* DOC Download - Apenas para Administradores */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">Versão DOC (Administradores)</h3>
                <p className="text-sm text-gray-600">Formato editável para revisão e personalização</p>
              </div>
            </div>
            <Button 
              onClick={handleGenerateDOC}
              disabled={isGeneratingDOC}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              size="lg"
            >
              {isGeneratingDOC ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando DOC...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Baixar DOC
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Formato editável para revisão e adaptação institucional
            </p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded">
              <BookOpen className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-amber-800 mb-1">Informações sobre o Artigo</h4>
              <ul className="text-amber-700 space-y-1">
                <li>• Artigo de Revisão de Literatura (integrativa) com metodologia explícita</li>
                <li>• Metodologia alinhada a PRISMA 2020 e COSMIN (quando aplicável)</li>
                <li>• Inclui resumo em português e inglês (abstract)</li>
                <li>• Referências bibliográficas com fontes reais</li>
                <li>• Pronto para submissão em periódicos especializados</li>
                {isAdmin && <li>• Versão DOC disponível para edição personalizada (acesso administrativo)</li>}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
