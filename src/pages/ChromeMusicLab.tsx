import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Music, Maximize2, RotateCcw, Star, Heart, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceBackButton } from "@/components/ResourceBackButton";

export default function ChromeMusicLab() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerHeight > window.innerWidth) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      
      // Native fullscreen on mobile
      if (isMobile && iframeRef.current && iframeRef.current.requestFullscreen) {
        try {
          await iframeRef.current.requestFullscreen();
        } catch (error) {
          console.log('Fullscreen not supported');
        }
      }
    } else {
      setIsFullscreen(false);
      
      // Exit native fullscreen on mobile
      if (isMobile && document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (error) {
          console.log('Exit fullscreen not supported');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* MuseTera Logo */}
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera Logo"
              className="h-12 w-12 rounded-xl shadow-md ring-2 ring-primary/20"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                🎵 Jogos Musicais - MuseTera
              </h1>
              <p className="text-sm text-muted-foreground">
                Experimentos Musicais Interativos • Plataforma MuseTera
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={handleRefresh}
              className="gap-2 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {!isMobile && "Atualizar"}
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
              ? 'fixed inset-0 z-50 bg-background' 
              : isMobile 
                ? orientation === 'portrait' 
                  ? 'aspect-[9/16] max-h-[70vh]' 
                  : 'aspect-[16/10] max-h-[80vh]'
                : 'h-[calc(100vh-200px)] min-h-[500px]'
            }
          `}
        >
          {/* Powered by MuseTera Badge */}
          {!isFullscreen && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full shadow-lg">
                <Music className="h-3 w-3" />
                <span>Powered by MuseTera</span>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-20">
              {/* MuseTera Logo in Loading */}
              <div className="mb-6">
                <img
                  src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
                  alt="MuseTera"
                  className="h-16 w-16 rounded-xl shadow-lg ring-2 ring-primary/20 animate-pulse-gentle"
                />
              </div>
              
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
                  <div className="absolute inset-0 w-8 h-8 border-2 border-primary/30 border-b-primary rounded-full animate-spin mx-auto mt-2 animate-pulse"></div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Carregando Chrome Music Lab via MuseTera
                  </p>
                  <p className="text-xs text-muted-foreground">
                    🎵 Preparando experimentos musicoterapêuticos...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Chrome Music Lab Iframe */}
          <iframe
            ref={iframeRef}
            id="chrome-music-lab-iframe"
            src="https://musiclab.chromeexperiments.com/"
            className="w-full h-full border-0"
            style={{ 
              touchAction: 'manipulation',
              WebkitOverflowScrolling: 'touch'
            }}
            allow="microphone; camera; midi; encrypted-media; autoplay; fullscreen; pointer-lock"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads allow-pointer-lock"
            onLoad={handleLoad}
            title="Chrome Music Lab - Experimentos Musicais Interativos via MuseTera"
            loading="lazy"
          />
          
          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-30 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Educational Context Card */}
        <Card className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Chrome Music Lab em Musicoterapia
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  O Chrome Music Lab oferece experimentos interativos que ajudam a compreender conceitos musicais 
                  fundamentais através de visualizações e atividades práticas, ideais para sessões terapêuticas.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="text-xs">
                    <div className="font-medium text-primary">🎯 Experimentos</div>
                    <div className="text-muted-foreground">Ritmo, harmonia e melodia</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-primary">🧠 Aprendizado</div>
                    <div className="text-muted-foreground">Conceitos visuais e auditivos</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-primary">👥 Terapia</div>
                    <div className="text-muted-foreground">Todas as idades</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Mobile Tips */}
        {isMobile && !isFullscreen && (
          <div className="mt-4 space-y-2">
            <div className="p-4 rounded-lg bg-card border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                💡 Dicas para Mobile - Chrome Music Lab
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                {orientation === 'portrait' && (
                  <div>📱 Para melhor experiência, gire o dispositivo para modo paisagem</div>
                )}
                <div>🖱️ Use gestos de toque para interagir com os experimentos musicais</div>
                <div>🔊 Ative o som para experiência completa dos experimentos</div>
                <div>🎯 Toque diretamente nos instrumentos e controles na tela</div>
                <div>🔄 Use o botão "Atualizar" acima se houver problemas de carregamento</div>
                <div>📺 Alguns experimentos podem funcionar melhor em tela cheia</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* MuseTera Footer */}
      <footer className="w-full py-6 mt-8 border-t bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera"
              className="h-8 w-8 rounded-lg shadow-sm"
            />
            <div className="text-sm">
              <div className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                🎵 Sistema MuseTera
              </div>
              <div className="text-xs text-muted-foreground">
                Plataforma Especializada em Musicoterapia
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2025 MuseTera • Desenvolvido para Musicoterapeutas Profissionais
          </div>
        </div>
      </footer>
    </div>
  );
}