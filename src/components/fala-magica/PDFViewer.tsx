
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Music, Download, ArrowLeftCircle, ArrowRightCircle, Fullscreen } from 'lucide-react';
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
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { toast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get current word being viewed
  const currentWord = pdf.words[currentWordIndex];
  
  // Effect to preload images for better user experience
  useEffect(() => {
    const preloadImages = () => {
      pdf.words.forEach(word => {
        const img = new Image();
        img.src = word.imageUrl;
      });
    };
    
    preloadImages();
  }, [pdf]);
  
  // Handle audio playback completion
  useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setIsLoadingAudio(false);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [audioRef.current]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextWord();
      } else if (e.key === 'ArrowLeft') {
        handlePrevWord();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handlePlayRegular();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentWordIndex]);
  
  // Handle fullscreen mode
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen]);
  
  const handleNextWord = () => {
    if (currentWordIndex < pdf.words.length - 1) {
      setCurrentWordIndex(prevIndex => prevIndex + 1);
      // Stop any currently playing audio
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
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
      // Stop any currently playing audio
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  };
  
  const playAudio = (url: string) => {
    // Create or reuse audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Stop any currently playing audio
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Set up new audio
    audioRef.current.src = url;
    setIsLoadingAudio(true);
    setIsPlaying(true);
    
    // Play the audio
    audioRef.current.play()
      .then(() => {
        setIsLoadingAudio(false);
        onPlayWord(currentWord);
      })
      .catch(error => {
        console.error("Error playing audio:", error);
        setIsLoadingAudio(false);
        setIsPlaying(false);
        toast({
          title: "Erro na reprodução",
          description: "Não foi possível reproduzir o áudio.",
          variant: "destructive"
        });
      });
  };
  
  const handlePlayRegular = () => {
    playAudio(currentWord.audioUrl);
  };
  
  const handlePlaySung = () => {
    playAudio(currentWord.sungAudioUrl);
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
    
    // Use Fullscreen API if available
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(err => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.error("Error attempting to exit fullscreen:", err);
          });
        }
      }
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
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
                title={isFullscreen ? "Sair do modo de tela cheia" : "Entrar no modo de tela cheia"}
              >
                <Fullscreen className="h-4 w-4" />
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
                className="bg-white rounded-lg shadow-md p-4 w-full max-w-md flex flex-col items-center justify-center"
              >
                <div className="w-full h-64 overflow-hidden rounded-lg border mb-6 relative">
                  <img 
                    src={currentWord.imageUrl} 
                    alt={currentWord.text} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback for broken images
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/400x300?text=Imagem+não+disponível";
                      toast({
                        title: "Erro ao carregar imagem",
                        description: "A imagem para esta palavra não pode ser carregada.",
                        variant: "destructive"
                      });
                    }}
                  />
                </div>
                <h3 className="text-3xl font-bold text-center text-purple-700 mb-2">
                  {currentWord.text}
                </h3>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={handlePlayRegular}
                disabled={isLoadingAudio}
                className={cn(
                  "flex-1", 
                  isPlaying ? "bg-purple-700 hover:bg-purple-800" : "bg-purple-600 hover:bg-purple-700"
                )}
              >
                {isLoadingAudio ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Carregando...
                  </div>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-4 w-4" /> Ouvir Palavra
                  </>
                )}
              </Button>
              
              <Button
                onClick={handlePlaySung}
                disabled={isLoadingAudio}
                className={cn(
                  "flex-1",
                  isPlaying ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                )}
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
