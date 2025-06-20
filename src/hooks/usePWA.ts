
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
  const [browserInfo, setBrowserInfo] = useState<{
    name: string;
    isMobile: boolean;
    isDesktop: boolean;
    supportsInstall: boolean;
  }>({
    name: 'unknown',
    isMobile: false,
    isDesktop: false,
    supportsInstall: false
  });

  // Detectar navegador e dispositivo
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isDesktop = !isMobile;
    
    let browserName = 'unknown';
    let supportsInstall = false;

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'chrome';
      supportsInstall = true;
    } else if (userAgent.includes('Edg')) {
      browserName = 'edge';
      supportsInstall = true;
    } else if (userAgent.includes('Firefox')) {
      browserName = 'firefox';
      supportsInstall = false; // Firefox não suporta instalação PWA nativa
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'safari';
      supportsInstall = isMobile; // Safari iOS suporta "Add to Home Screen"
    }

    setBrowserInfo({
      name: browserName,
      isMobile,
      isDesktop,
      supportsInstall
    });

    console.log('🔍 Detecção de navegador:', {
      userAgent,
      browserName,
      isMobile,
      isDesktop,
      supportsInstall
    });
  }, []);

  useEffect(() => {
    console.log('🔧 Inicializando PWA hook...');
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppIOS = (window.navigator as any).standalone === true;
    const appInstalled = isStandalone || isInWebAppIOS;
    
    console.log('📱 Status de instalação:', { isStandalone, isInWebAppIOS, appInstalled });
    setIsInstalled(appInstalled);

    // Verificar requisitos PWA
    const checkPWARequirements = () => {
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
      
      console.log('✅ Requisitos PWA:', {
        isHTTPS,
        hasManifest,
        hasServiceWorker: 'serviceWorker' in navigator
      });

      return isHTTPS && hasManifest;
    };

    const pwaRequirements = checkPWARequirements();

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
      
      if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
        console.log('✅ Mostrando popup de instalação...');
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

    // Para navegadores que suportam PWA mas não dispararam o evento
    if (!appInstalled && pwaRequirements && browserInfo.supportsInstall) {
      setTimeout(() => {
        if (!installPrompt) {
          console.log('⚠️ Navegador suporta PWA mas evento não foi capturado, forçando exibição');
          setIsInstallable(true);
          setTimeout(() => setShowInstallPrompt(true), 5000);
        }
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [browserInfo.supportsInstall]);

  const installApp = async () => {
    console.log('🚀 Tentando instalar app...');
    
    if (!installPrompt) {
      console.log('❌ Sem prompt de instalação disponível');
      // Fallback: mostrar instruções manuais
      return false;
    }

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      console.log('📊 Resultado da instalação:', result.outcome);
      
      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        setShowInstallPrompt(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro durante instalação:', error);
      return false;
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

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    showInstallPrompt,
    browserInfo,
    installApp,
    updateApp,
    dismissInstallPrompt
  };
}
