
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Detectar tipo de dispositivo
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isDesktop = !isMobile;

  useEffect(() => {
    console.log('🔧 Inicializando PWA hook...');
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppIOS = (window.navigator as any).standalone === true;
    const appInstalled = isStandalone || isInWebAppIOS;
    
    console.log('📱 App já instalado?', appInstalled);
    console.log('🔍 Display mode:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('🍎 iOS standalone:', (window.navigator as any).standalone);
    
    setIsInstalled(appInstalled);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 Evento beforeinstallprompt detectado!', e);
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
      
      // Verificar se não foi rejeitado recentemente
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      console.log('⏰ Último dismiss:', lastDismissed);
      
      if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
        console.log('✅ Mostrando popup em 3 segundos...');
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      } else {
        console.log('❌ Popup foi dismissado recentemente');
      }
    };

    // Listen for app installed
    const handleAppInstalled = (e: Event) => {
      console.log('🎉 App instalado com sucesso!', e);
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      setShowInstallPrompt(false);
      localStorage.removeItem('pwa-install-dismissed');
    };

    // Listen for online/offline
    const handleOnline = () => {
      console.log('🌐 Online');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('📴 Offline');
      setIsOnline(false);
    };

    // Service Worker update detection
    const handleSWUpdate = () => {
      console.log('🔄 Service Worker atualizado');
      setUpdateAvailable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleSWUpdate);
      
      // Check for existing service worker
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          console.log('✅ Service Worker já registrado:', registration.scope);
          
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Atualização de SW encontrada');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        } else {
          console.log('⚠️ Nenhum Service Worker encontrado');
        }
      });
    }

    // Para desenvolvimento, simular evento após timeout se não estiver instalado
    if (!appInstalled && (location.hostname === 'localhost' || location.hostname.includes('lovableproject.com'))) {
      console.log('🧪 Modo desenvolvimento detectado');
      const devTimeout = setTimeout(() => {
        if (!isInstallable) {
          console.log('🧪 Simulando instalabilidade para desenvolvimento...');
          setIsInstallable(true);
          setTimeout(() => {
            setShowInstallPrompt(true);
          }, 2000);
        }
      }, 5000);

      return () => {
        clearTimeout(devTimeout);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.removeEventListener('controllerchange', handleSWUpdate);
        }
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleSWUpdate);
      }
    };
  }, []);

  const installApp = async () => {
    console.log('🚀 Tentando instalar app...');
    
    if (!installPrompt) {
      console.log('❌ Sem prompt de instalação disponível');
      
      // Fallback para casos onde o prompt não está disponível
      if (isDesktop) {
        console.log('💻 Desktop detectado - instruções manuais');
        alert('Para instalar no computador:\n\n1. Clique no ícone de instalação na barra de endereços (se disponível)\n2. Ou vá no menu do navegador > "Instalar MuseTera"\n3. Chrome: Menu ⋮ > "Instalar MuseTera"\n4. Edge: Menu ⋯ > "Aplicativos" > "Instalar este site como aplicativo"');
      }
      return;
    }

    try {
      console.log('📋 Executando prompt...');
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      console.log('📊 Resultado da instalação:', result.outcome);
      
      if (result.outcome === 'accepted') {
        console.log('✅ Usuário aceitou a instalação');
        setIsInstallable(false);
        setInstallPrompt(null);
        setShowInstallPrompt(false);
      } else {
        console.log('❌ Usuário rejeitou a instalação');
        dismissInstallPrompt();
      }
    } catch (error) {
      console.error('❌ Erro durante instalação:', error);
      
      // Fallback com instruções manuais
      if (isDesktop) {
        alert('Instalação automática falhou. Tente:\n\n1. Verificar se há um ícone de instalação na barra de endereços\n2. Menu do navegador > "Instalar MuseTera"\n3. Recarregar a página e tentar novamente');
      }
    }
  };

  const dismissInstallPrompt = () => {
    console.log('❌ Popup dismissado pelo usuário');
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const updateApp = () => {
    console.log('🔄 Atualizando app...');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    window.location.reload();
  };

  // Log do estado atual para debug
  useEffect(() => {
    console.log('📊 Estado PWA atual:', {
      isInstallable,
      isInstalled,
      isOnline,
      showInstallPrompt,
      hasInstallPrompt: !!installPrompt,
      isMobile,
      isDesktop,
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
    });
  }, [isInstallable, isInstalled, isOnline, showInstallPrompt, installPrompt, isMobile, isDesktop]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    showInstallPrompt,
    isMobile,
    isDesktop,
    installApp,
    updateApp,
    dismissInstallPrompt
  };
}
