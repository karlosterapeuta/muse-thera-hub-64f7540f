import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize, X, Music, Star, Briefcase, Smartphone, Globe, TrendingUp, Users, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import VagasSources from "@/pages/vagas/VagasSources";
import VagasAdminPanel from "@/pages/vagas/VagasAdminPanel";

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
              onClick={handleShare}
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md transition-all"
            >
              <Share2 className="h-4 w-4" />
              {!isMobile && "Compartilhar"}
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
      <main className="container mx-auto px-4 pb-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold text-muted-foreground">Quadro de Vagas em manutenção</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A área de vagas está temporariamente indisponível. Em breve novas oportunidades para musicoterapeutas.
          </p>
        </div>
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
