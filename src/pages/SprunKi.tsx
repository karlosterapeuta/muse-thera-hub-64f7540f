import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize, X, Music, Star, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

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
          <div className="flex items-center gap-4">
            {/* MuseTera Logo */}
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera Logo"
              className="h-12 w-12 rounded-xl shadow-md ring-2 ring-primary/20"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                🎵 Sprunki Musical - MuseTera
              </h1>
              <p className="text-muted-foreground mt-1">
                Ferramenta de Musicoterapia Interativa • Plataforma MuseTera
              </p>
            </div>
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
          {/* Powered by MuseTera Badge */}
          {!isFullscreen && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full shadow-lg">
                <Music className="h-3 w-3" />
                <span>Powered by MuseTera</span>
              </div>
            </div>
          )}
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center p-8">
              {/* MuseTera Logo in Loading */}
              <div className="mb-6">
                <img
                  src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
                  alt="MuseTera"
                  className="h-16 w-16 rounded-xl shadow-lg ring-2 ring-primary/20 animate-pulse-gentle"
                />
              </div>
              
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
                  Carregando Sprunki Musical via MuseTera...
                </div>
                <p className="text-xs text-muted-foreground/80 mt-2">
                  🎵 Ferramenta especializada em musicoterapia
                </p>
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
            src="https://iframegame.com/embed/sprunki-modded/index.html"
            className="w-full h-full border-0"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media; gamepad; gyroscope; accelerometer"
            title="Sprunki Musical - Jogo Educativo"
            onLoad={handleLoad}
          />
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
                  Sprunki Musical em Musicoterapia
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  O Sprunki Musical é uma ferramenta terapêutica que permite aos pacientes criar música de forma 
                  intuitiva através do drag-and-drop de personagens únicos, cada um com sons e ritmos específicos.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="text-xs">
                    <div className="font-medium text-primary">🎯 Objetivo</div>
                    <div className="text-muted-foreground">Estimular criatividade musical</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-primary">🧠 Benefícios</div>
                    <div className="text-muted-foreground">Coordenação e concentração</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-primary">👥 Aplicação</div>
                    <div className="text-muted-foreground">Sessões individuais/grupo</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Tip */}
        {isMobile && !isFullscreen && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
            💡 Para melhor experiência, gire o dispositivo ou use o modo tela cheia
          </div>
        )}
      </main>

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