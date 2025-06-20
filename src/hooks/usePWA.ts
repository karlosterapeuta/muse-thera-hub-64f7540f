
import { useState, useEffect } from 'react';
import { Workbox } from 'workbox-window';

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
    setIsInstalled(appInstalled);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 Evento beforeinstallprompt detectado!');
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
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
    const handleAppInstalled = () => {
      console.log('🎉 App instalado com sucesso!');
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      setShowInstallPrompt(false);
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

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      
      wb.addEventListener('waiting', () => {
        console.log('🔄 Atualização disponível');
        setUpdateAvailable(true);
      });

      wb.register().then(() => {
        console.log('✅ Service Worker registrado');
      }).catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
      });
    }

    // Para teste em desenvolvimento, simular o evento se não estiver instalado e não for localhost com HTTPS
    if (!appInstalled && location.hostname !== 'localhost') {
      console.log('🧪 Simulando evento de instalação para desenvolvimento...');
      setTimeout(() => {
        setIsInstallable(true);
        setShowInstallPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    console.log('🚀 Tentando instalar app...');
    if (!installPrompt) {
      console.log('❌ Sem prompt de instalação disponível');
      return;
    }

    try {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      console.log('📊 Resultado da instalação:', result.outcome);
      
      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        setShowInstallPrompt(false);
      }
    } catch (error) {
      console.error('❌ Erro durante instalação:', error);
    }
  };

  const dismissInstallPrompt = () => {
    console.log('❌ Popup dismissado pelo usuário');
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const updateApp = () => {
    console.log('🔄 Atualizando app...');
    window.location.reload();
  };

  // Log do estado atual para debug
  useEffect(() => {
    console.log('📊 Estado PWA:', {
      isInstallable,
      isInstalled,
      isOnline,
      showInstallPrompt,
      hasInstallPrompt: !!installPrompt,
      isMobile,
      isDesktop
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
