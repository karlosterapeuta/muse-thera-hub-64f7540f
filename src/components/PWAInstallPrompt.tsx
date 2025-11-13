import { useEffect, useState } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Verificar se já está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    console.log('[PWA] Configuração inicial:', {
      iOS,
      standalone,
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia('(display-mode: standalone)').matches
    });

    // Capturar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('[PWA] beforeinstallprompt capturado!', e);
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Mostrar popup após 2 segundos (SEMPRE, para debug)
    const timer = setTimeout(() => {
      console.log('[PWA] Timer de 2s disparado');
      console.log('[PWA] Estado atual:', {
        standalone,
        iOS,
        deferredPromptExists: !!deferredPrompt
      });
      
      // SEMPRE mostrar o prompt para debug
      setShowPrompt(true);
      console.log('[PWA] Popup configurado para aparecer!');
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    console.log('[PWA] Botão de instalação clicado');
    console.log('[PWA] deferredPrompt disponível:', !!deferredPrompt);

    if (deferredPrompt) {
      try {
        console.log('[PWA] Chamando deferredPrompt.prompt()');
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        console.log('[PWA] Escolha do usuário:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] Usuário aceitou a instalação');
        } else {
          console.log('[PWA] Usuário rejeitou a instalação');
        }
        
        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('[PWA] Erro ao tentar instalar:', error);
        setShowManualInstructions(true);
      }
    } else {
      console.log('[PWA] Sem deferredPrompt, mostrando instruções manuais');
      setShowManualInstructions(true);
    }
  };

  const handleClose = () => {
    console.log('[PWA] Popup fechado pelo usuário');
    setShowPrompt(false);
    setShowManualInstructions(false);
  };

  // Não mostrar se já estiver instalado
  if (isStandalone) {
    console.log('[PWA] App já está instalado (standalone mode)');
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="relative max-w-md w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-muted/50 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <img 
                  src="/icon-original.png" 
                  alt="Musetera" 
                  className="w-20 h-20 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Título e descrição */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Instale o Musetera
            </h2>
            <p className="text-muted-foreground">
              Tenha acesso rápido e fácil ao app, direto da sua tela inicial!
            </p>
          </div>

          {/* Benefícios */}
          <div className="space-y-3 text-left bg-muted/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Download className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Acesso instantâneo sem abrir o navegador</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Funciona offline e carrega mais rápido</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Monitor className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Experiência como app nativo</p>
            </div>
          </div>

          {/* Instruções manuais */}
          {showManualInstructions && (
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3 border border-border animate-in slide-in-from-top-2 duration-300">
              <h3 className="font-semibold text-foreground text-sm">Como instalar:</h3>
              
              {isIOS ? (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary">1.</span>
                    Toque no botão <span className="font-bold">Compartilhar</span> (ícone com seta para cima) na barra inferior do Safari
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary">2.</span>
                    Role para baixo e toque em <span className="font-bold">"Adicionar à Tela de Início"</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary">3.</span>
                    Toque em <span className="font-bold">"Adicionar"</span> no canto superior direito
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary">1.</span>
                    Toque no menu do navegador (⋮) no canto superior direito
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary">2.</span>
                    Selecione <span className="font-bold">"Adicionar à tela inicial"</span> ou <span className="font-bold">"Instalar app"</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-primary">3.</span>
                    Confirme a instalação
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleInstallClick}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              {showManualInstructions ? 'Ver instruções acima' : 'Instalar Agora'}
            </Button>
            
            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full"
            >
              Agora não
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
