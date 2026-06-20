import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize, X, Music, Star, Briefcase, Smartphone, Globe, TrendingUp, Users, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import VagasSources from "@/pages/vagas/VagasSources";

export default function VagasEmbed() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.title = "💼 Vagas MuseTera";
    
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

  const handleShare = async () => {
    const shareData = {
      title: "💼 Vagas MuseTera",
      text: "Confira as oportunidades para musicoterapeutas no Vagas MuseTera!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link copiado!",
        description: "O link das vagas foi copiado para a área de transferência.",
      });
    } catch (error) {
      // Usuário cancelou o compartilhamento ou recurso indisponível
      if ((error as Error)?.name === "AbortError") return;
      toast({
        title: "Não foi possível compartilhar",
        description: "Tente copiar o link manualmente.",
        variant: "destructive",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
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
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera Logo"
              className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-xl shadow-md ring-2 ring-primary/20`}
            />
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent`}>
                💼 Vagas MuseTera
              </h1>
              <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Oportunidades para Musicoterapeutas • Plataforma MuseTera
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
                ? "h-[calc(100vh-16rem)] min-h-[500px]" 
                : isMobile && orientation === 'landscape'
                  ? "h-[calc(100vh-10rem)]"
                  : "h-[calc(100vh-18rem)] min-h-[600px]"
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
                  Carregando Vagas MuseTera...
                </div>
                <p className="text-xs text-muted-foreground/80 mt-2">
                  💼 Conectando oportunidades para musicoterapeutas
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
            src="https://vagasmusetera.lovable.app"
            className="w-full h-full border-0 touch-manipulation"
            loading="lazy"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media"
            title="Vagas MuseTera - Oportunidades para Musicoterapeutas"
            onLoad={handleLoad}
            style={{ 
              WebkitOverflowScrolling: 'touch',
              touchAction: 'manipulation'
            }}
          />
        </div>

        {/* Info Context Card */}
        <Card className="mt-6 border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.03] to-transparent backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-cyan-500" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Star className="h-5 w-5 text-cyan-500" />
                  Portal de Vagas para Musicoterapeutas
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  O Vagas MuseTera é um hub exclusivo de oportunidades profissionais voltadas para a área de 
                  musicoterapia. Encontre vagas de emprego, estágios, projetos freelance e oportunidades 
                  acadêmicas em todo o Brasil.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="text-xs">
                    <div className="font-medium text-cyan-500 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Vagas Remotas
                    </div>
                    <div className="text-muted-foreground">Trabalhe de qualquer lugar</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-cyan-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Carreira
                    </div>
                    <div className="text-muted-foreground">Crescimento profissional</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-cyan-500 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Comunidade
                    </div>
                    <div className="text-muted-foreground">Network de profissionais</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curated additional job sources */}
        <VagasSources />


        {/* Mobile Tips */}
        {isMobile && !isFullscreen && (
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-blue-600/5 border border-cyan-500/20 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-cyan-500" />
                <span className="font-medium text-cyan-500">Dicas para Mobile</span>
              </div>
              <div className="text-muted-foreground space-y-1 text-xs">
                {orientation === 'portrait' ? (
                  <div>📱 Gire o dispositivo para paisagem para melhor visualização das vagas</div>
                ) : (
                  <div>🖥️ Modo paisagem ideal para navegar entre as oportunidades</div>
                )}
                <div>🔍 Use os filtros para encontrar vagas mais relevantes para você</div>
                <div>💼 Clique nas vagas para ver detalhes e requisitos completos</div>
                <div>🔄 Use o botão "Atualizar" se as vagas não carregarem corretamente</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MuseTera Footer */}
      <footer className="w-full py-6 mt-8 border-t bg-gradient-to-r from-cyan-500/5 to-blue-600/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera"
              className="h-8 w-8 rounded-lg shadow-sm"
            />
            <div className="text-sm">
              <div className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
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
