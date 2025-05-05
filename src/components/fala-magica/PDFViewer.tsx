
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Music, Download, ArrowLeftCircle, ArrowRightCircle, Maximize } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { InteractivePDF, Word } from './types';

interface PDFViewerProps {
  pdf: InteractivePDF;
  onPlayWord: (word: Word) => void;
}

const PDFViewer = ({ pdf, onPlayWord }: PDFViewerProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Get current word being viewed
  const currentWord = pdf.words[currentWordIndex];
  
  const handleNextWord = () => {
    if (currentWordIndex < pdf.words.length - 1) {
      setCurrentWordIndex(prevIndex => prevIndex + 1);
    } else {
      toast({
        title: "Fim do material",
        description: "Você chegou ao fim das palavras deste material.",
      });
    }
  };
  
  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handlePlayRegular = () => {
    onPlayWord(currentWord);
    const audio = new Audio(currentWord.audioUrl);
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast({
        title: "Erro na reprodução",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive"
      });
    });
  };
  
  const handlePlaySung = () => {
    onPlayWord(currentWord);
    const audio = new Audio(currentWord.sungAudioUrl);
    audio.play().catch(error => {
      console.error("Error playing sung audio:", error);
      toast({
        title: "Erro na reprodução",
        description: "Não foi possível reproduzir o áudio cantado.",
        variant: "destructive"
      });
    });
  };
  
  const handleDownload = () => {
    // Create a link to download the PDF
    const link = document.createElement('a');
    link.href = pdf.pdfUrl;
    link.download = `${pdf.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: `O material "${pdf.title}" está sendo baixado.`,
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "transition-all duration-300", 
          isFullscreen ? "fixed inset-0 z-50 bg-white p-6" : ""
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className={cn("h-full shadow-lg", isFullscreen && "border-0")}>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-purple-800">{pdf.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-600">
              <span className="bg-purple-100 px-2 py-0.5 rounded-full">
                {pdf.category}
              </span>
              <span>
                {pdf.words.length} palavras
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="flex justify-between mb-6">
              <div className="text-sm text-gray-500">
                Palavra {currentWordIndex + 1} de {pdf.words.length}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" /> PDF
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-8">
              <motion.div 
                key={currentWord.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-4 w-full max-w-md aspect-square flex flex-col items-center justify-center"
              >
                <img 
                  src={currentWord.imageUrl} 
                  alt={currentWord.text} 
                  className="object-contain max-h-48 mb-6 rounded-lg border"
                />
                <h3 className="text-2xl font-bold text-center text-purple-700 mb-2">
                  {currentWord.text}
                </h3>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={handlePlayRegular}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Volume2 className="mr-2 h-4 w-4" /> Ouvir Palavra
              </Button>
              
              <Button
                onClick={handlePlaySung}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Music className="mr-2 h-4 w-4" /> Ouvir Cantando
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevWord}
                disabled={currentWordIndex === 0}
                className="flex items-center"
              >
                <ArrowLeftCircle className="mr-2 h-4 w-4" /> Anterior
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNextWord}
                disabled={currentWordIndex === pdf.words.length - 1}
                className="flex items-center"
              >
                Próxima <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFViewer;
