import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize, X, Music, Star, Heart, Smartphone, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SprunKi() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  // Monitor device orientation for mobile
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

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
    
    // On mobile, also request native fullscreen if available
    if (isMobile && !isFullscreen) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    } else if (isMobile && isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`container mx-auto px-4 ${isMobile ? 'py-4' : 'py-6'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* MuseTera Logo */}
            <img
              src="/images/logo-musetera.png"
              alt="MuseTera Logo"
              className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-xl shadow-md ring-2 ring-primary/20`}
            />
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent`}>
                🎵 Sprunki Musical - MuseTera
              </h1>
              <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Ferramenta de Musicoterapia Interativa • Plataforma MuseTera
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
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
              ? "fixed inset-0 z-50 rounded-none" 
              : isMobile && orientation === 'portrait'
                ? "aspect-[3/4] min-h-[60vh]" 
                : isMobile && orientation === 'landscape'
                  ? "aspect-[16/9] h-[calc(100vh-8rem)]"
                  : "aspect-[16/10] max-h-[calc(100vh-12rem)]"
          }`}
        >
          {/* Powered by MuseTera Badge */}
          {!isFullscreen && (
            <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} z-20`}>
              <div className={`flex items-center gap-2 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full shadow-lg`}>
                <Music className="h-3 w-3" />
                <span className={isMobile ? 'hidden sm:inline' : ''}>Powered by MuseTera</span>
                {isMobile && <span className="sm:hidden">MuseTera</span>}
              </div>
            </div>
          )}
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center p-8">
              {/* MuseTera Logo in Loading */}
              <div className="mb-6">
                <img
                  src="/images/logo-musetera.png"
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
                <p className="text-xs text-muted-foreground/60 mt-1">
                  💡 Aguarde! Anúncios podem aparecer - procure pelo botão "Skip Ad"
                </p>
              </div>
            </div>
          )}

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <Button
              onClick={toggleFullscreen}
              variant="secondary"
              size={isMobile ? "sm" : "default"}
              className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-20 rounded-full ${isMobile ? 'w-10 h-10' : 'w-8 h-8'} p-0 touch-manipulation`}
            >
              <X className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
          )}

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            src="https://iframegame.com/embed/sprunki-modded/index.html"
            className="w-full h-full border-0 touch-manipulation"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-pointer-lock"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media; gamepad; gyroscope; accelerometer; touch; pointer; microphone"
            title="Sprunki Musical - Jogo Educativo"
            onLoad={handleLoad}
            style={{ 
              WebkitOverflowScrolling: 'touch',
              touchAction: 'manipulation'
            }}
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

        {/* Ad Instructions Card */}
        <Card className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <Info className="h-4 w-4" />
                  📺 Instruções para Anúncios
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed mb-3">
                  Este jogo pode exibir anúncios antes de iniciar. Para pular os anúncios, siga estas instruções:
                </p>
                <div className="space-y-2 text-xs text-yellow-700 dark:text-yellow-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span><strong>⏱️ Aguarde 5-10 segundos</strong> para o botão "Skip Ad" aparecer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span><strong>🖱️ Clique no "X" ou "Skip"</strong> quando o botão estiver disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                    <span><strong>🔄 Use o botão "Atualizar"</strong> acima se necessário recarregar</span>
                  </div>
                  {isMobile && (
                    <div className="flex items-center gap-2 pt-1 border-t border-yellow-200 dark:border-yellow-800">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span><strong>📱 Mobile:</strong> Toque diretamente nos botões que aparecem na tela</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Tips */}
        {isMobile && !isFullscreen && (
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Dicas para Mobile</span>
              </div>
              <div className="text-muted-foreground space-y-1 text-xs">
                {orientation === 'portrait' ? (
                  <div>📱 Gire o dispositivo para paisagem para melhor experiência</div>
                ) : (
                  <div>🎮 Ótimo! Modo paisagem é ideal para jogar</div>
                )}
                <div>🖱️ Use gestos de toque para interagir com os personagens</div>
                <div>🔊 Ative o som para experiência completa</div>
                <div>📺 Se aparecer anúncio, aguarde e procure "Skip Ad" para pular</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MuseTera Footer */}
      <footer className="w-full py-6 mt-8 border-t bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/images/logo-musetera.png"
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