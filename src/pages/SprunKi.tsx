import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SprunKi() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = window.innerWidth < 768;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              🎵 Sprunki Musical
            </h1>
            <p className="text-muted-foreground mt-2">
              Crie música de forma divertida e interativa com personagens únicos
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {!isMobile && "Atualizar"}
            </Button>
            
            <Button
              onClick={toggleFullscreen}
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2"
            >
              <Maximize className="h-4 w-4" />
              {!isMobile && "Tela Cheia"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-6">
        <div 
          className={`relative rounded-xl border bg-card shadow-2xl overflow-hidden transition-all duration-300 ${
            isFullscreen 
              ? "fixed inset-4 z-50 rounded-none" 
              : isMobile 
                ? "aspect-[4/3]" 
                : "aspect-[16/10] max-h-[calc(100vh-12rem)]"
          }`}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center p-8">
              <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Carregando Sprunki Musical...
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-20 rounded-full w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            src="https://www.gameflare.com/online-game/sprunki-ultimate-deluxe/"
            className="w-full h-full border-0"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media; gamepad; gyroscope; accelerometer"
            title="Sprunki Musical - Jogo Educativo"
            onLoad={handleLoad}
          />
        </div>

        {/* Mobile Tip */}
        {isMobile && !isFullscreen && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
            💡 Para melhor experiência, gire o dispositivo ou use o modo tela cheia
          </div>
        )}
      </main>
    </div>
  );
}