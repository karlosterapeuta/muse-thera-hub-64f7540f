
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface DownloadSelectorProps {
  onDownloadPDF: () => Promise<void>;
  onDownloadWord: () => Promise<void>;
}

export function DownloadSelector({ onDownloadPDF, onDownloadWord }: DownloadSelectorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDownload = async (format: 'pdf' | 'word') => {
    setIsGenerating(true);
    try {
      if (format === 'pdf') {
        await onDownloadPDF();
        toast.success('PDF gerado com sucesso!');
      } else {
        await onDownloadWord();
        toast.success('Documento Word gerado com sucesso!');
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      toast.error('Erro ao gerar documento. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700",
            "hover:from-purple-700 hover:via-pink-700 hover:to-purple-800",
            "text-white font-semibold shadow-lg",
            "border-2 border-purple-400",
            "animate-blink-glow",
            "transition-all duration-300 hover:scale-105",
            "motion-reduce:animate-none motion-reduce:transform-none",
            isMobile ? "text-xs px-3 py-2" : "text-sm px-4 py-2"
          )}
          size={isMobile ? "sm" : "default"}
        >
          <div className="relative z-10 flex items-center gap-1">
            <BookOpen className={cn(
              "animate-icon-bounce motion-reduce:animate-none",
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span className="font-bold tracking-wide">
              {isMobile ? "Artigo" : "Artigo Científico"}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 animate-pulse" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Baixar Artigo Científico
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Escolha o formato para baixar o artigo científico completo da Escala MuseTera:
          </p>
          
          <div className="grid gap-3">
            <Button
              onClick={() => handleDownload('pdf')}
              disabled={isGenerating}
              className="flex items-center gap-3 h-12 justify-start bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
              variant="outline"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              <div className="text-left">
                <div className="font-medium">Baixar PDF</div>
                <div className="text-xs text-gray-500">Formato ideal para leitura e impressão</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleDownload('word')}
              disabled={isGenerating}
              className="flex items-center gap-3 h-12 justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              variant="outline"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              <div className="text-left">
                <div className="font-medium">Baixar Word</div>
                <div className="text-xs text-gray-500">Formato editável (.rtf)</div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
