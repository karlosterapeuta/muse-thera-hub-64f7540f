import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Music, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChromeMusicLab() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.querySelector('#chrome-music-lab-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20">
              <Music className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chrome Music Lab
              </h1>
              <p className="text-sm text-muted-foreground">
                Explore música através de experimentos interativos
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={handleRefresh}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {!isMobile && "Recarregar"}
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={toggleFullscreen}
              className="gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              {!isMobile && (isFullscreen ? "Sair Tela Cheia" : "Tela Cheia")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-6">
        <div 
          className={`
            relative rounded-xl overflow-hidden shadow-2xl border border-border/50
            ${isFullscreen 
              ? 'fixed inset-4 z-50 bg-background' 
              : isMobile 
                ? 'aspect-[4/3]' 
                : 'h-[calc(100vh-200px)] min-h-[500px]'
            }
          `}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-20">
              <div className="text-center space-y-6 max-w-sm mx-auto p-6">
                {/* Skeleton Loader */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-2 w-48 mx-auto" />
                  <Skeleton className="h-2 w-40 mx-auto" />
                </div>
                
                {/* Animated Loader */}
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-8 h-8 border-2 border-purple-500/30 border-b-purple-500 rounded-full animate-spin mx-auto mt-2 animate-pulse"></div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Carregando Chrome Music Lab
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Preparando os experimentos musicais...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Chrome Music Lab Iframe */}
          <iframe
            id="chrome-music-lab-iframe"
            src="https://musiclab.chromeexperiments.com/"
            className="w-full h-full border-0"
            allow="microphone; camera; midi; encrypted-media; autoplay; fullscreen"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads"
            onLoad={handleLoad}
            title="Chrome Music Lab - Experimentos Musicais Interativos"
            loading="lazy"
          />
          
          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-30 gap-2 bg-background/80 backdrop-blur-sm"
            >
              <Maximize2 className="w-4 h-4" />
              Sair
            </Button>
          )}
        </div>
        
        {/* Info Cards for Mobile */}
        {isMobile && (
          <div className="mt-6 grid gap-4">
            <div className="p-4 rounded-lg bg-card border border-border/50">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Dica para Mobile
              </h3>
              <p className="text-xs text-muted-foreground">
                Para melhor experiência, rotacione o dispositivo para modo paisagem ou use o botão de tela cheia.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}