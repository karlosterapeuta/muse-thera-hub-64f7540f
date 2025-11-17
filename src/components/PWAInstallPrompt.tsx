import { useEffect, useState } from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    console.log('[PWA InstallPrompt] Componente montado');
    
    // Detectar iOS e Android
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Verificar se já está instalado (múltiplas formas)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true ||
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    console.log('[PWA InstallPrompt] Detecção de plataforma:', {
      iOS,
      isAndroid,
      isChrome,
      standalone,
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia('(display-mode: standalone)').matches,
      navigatorStandalone: (window.navigator as any).standalone
    });

    // Se já está instalado, não mostrar
    if (standalone) {
      console.log('[PWA InstallPrompt] App já instalado, não mostrando prompt');
      return;
    }

    // Capturar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('[PWA InstallPrompt] beforeinstallprompt capturado!', e);
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verificar se beforeinstallprompt já foi disparado
    setTimeout(() => {
      console.log('[PWA InstallPrompt] Verificando deferredPrompt após 1s:', !!deferredPrompt);
    }, 1000);

    // Mostrar popup após 3 segundos
    const timer = setTimeout(() => {
      console.log('[PWA InstallPrompt] Timer de 3s disparado');
      console.log('[PWA InstallPrompt] Estado atual:', {
        standalone,
        iOS,
        isAndroid,
        isChrome,
        deferredPromptExists: !!deferredPrompt
      });
      
      // Mostrar prompt se não estiver instalado
      if (!standalone) {
        setShowPrompt(true);
        console.log('[PWA InstallPrompt] Popup configurado para aparecer!');
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

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
        console.error('[PWA] Erro ao mostrar prompt de instalação:', error);
        setShowManualInstructions(true);
      }
    } else {
      console.log('[PWA] deferredPrompt não disponível, mostrando instruções manuais');
      setShowManualInstructions(true);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    setShowManualInstructions(false);
  };

  // Não renderizar nada se o app já estiver instalado ou se não for pra mostrar
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Download className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('install.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('install.subtitle')}
            </p>
          </div>

          <div className="w-full bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="font-semibold text-sm text-foreground">
              {t('install.benefits.title')}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>✓ {t('install.benefits.offline')}</li>
              <li>✓ {t('install.benefits.faster')}</li>
              <li>✓ {t('install.benefits.notifications')}</li>
              <li>✓ {t('install.benefits.homescreen')}</li>
            </ul>
          </div>

          {showManualInstructions && (
            <div className="w-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left space-y-3">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2">
                    <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                        {t('install.manual.ios.title')}
                      </p>
                      <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                        <li>{t('install.manual.ios.step1')} <span className="inline-block">⬆️</span></li>
                        <li>{t('install.manual.ios.step2')}</li>
                        <li>{t('install.manual.ios.step3')}</li>
                      </ol>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                        {t('install.manual.android.title')}
                      </p>
                      <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                        <li>{t('install.manual.android.step1')}</li>
                        <li>{t('install.manual.android.step2')}</li>
                        <li>{t('install.manual.android.step3')}</li>
                      </ol>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3 w-full pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              {t('install.buttons.later')}
            </Button>
            <Button
              className="flex-1"
              onClick={handleInstallClick}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('install.buttons.install')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
