
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  QrCode,
  Volume2
} from "lucide-react";
import { InteractivePDF, Word } from "./types";

interface PDFViewerProps {
  pdf: InteractivePDF;
  onPlayWord?: (word: Word) => void;
}

export default function PDFViewer({ pdf, onPlayWord }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Placeholder - would be dynamic in a real implementation
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // In a real implementation, this would download the PDF
    const link = document.createElement("a");
    link.href = pdf.pdfUrl;
    link.download = `${pdf.title}.pdf`;
    link.click();
  };
  
  const handlePlayWord = (word: Word) => {
    if (onPlayWord) {
      onPlayWord(word);
    }
  };
  
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between bg-purple-600 text-white p-4">
        <h3 className="text-xl font-bold flex items-center">
          <FileText className="mr-2" /> {pdf.title}
        </h3>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handlePrint}
            className="text-white hover:bg-purple-500"
            aria-label="Imprimir PDF"
          >
            <Printer size={20} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDownload}
            className="text-white hover:bg-purple-500"
            aria-label="Baixar PDF"
          >
            <Download size={20} />
          </Button>
        </div>
      </div>
      
      <div className="relative bg-gray-100 min-h-[500px] flex items-center justify-center border-t border-b border-gray-200">
        {/* PDF Preview area - in a real implementation, this would render the PDF */}
        <div className="w-full max-w-3xl bg-white shadow-md mx-auto my-8 p-8 rounded">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
            {pdf.title} - Página {currentPage}
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {pdf.words.slice(0, 4).map((word) => (
              <Card key={word.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={word.imageUrl} 
                      alt={word.text}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => handlePlayWord(word)}
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-purple-100"
                      aria-label={`Ouvir a palavra ${word.text}`}
                    >
                      <Volume2 size={18} className="text-purple-600" />
                    </button>
                    
                    <div className="absolute top-2 right-2">
                      <QrCode size={24} className="text-white drop-shadow-md" />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-center text-purple-700">
                      {word.text}
                    </h4>
                    <p className="text-sm text-center text-gray-500 mt-1">
                      Toque para ouvir
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-3">
              Atividades:
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-800">Complete a palavra:</p>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <span className="text-2xl font-bold text-purple-700">C</span>
                  <span className="text-2xl font-bold text-purple-700">A</span>
                  <div className="w-8 h-8 border-b-2 border-purple-700"></div>
                  <div className="w-8 h-8 border-b-2 border-purple-700"></div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">Fale e ganhe um selo:</p>
                <div className="flex justify-center mt-2">
                  <div className="w-14 h-14 border-2 border-dashed border-green-500 rounded-full flex items-center justify-center text-green-500">
                    <span className="text-xs">Selo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <Button 
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="absolute left-4 bg-white rounded-full shadow-md h-10 w-10"
          aria-label="Página anterior"
        >
          <ChevronLeft size={20} />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="absolute right-4 bg-white rounded-full shadow-md h-10 w-10"
          aria-label="Próxima página"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
      
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
}
