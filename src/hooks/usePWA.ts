
import { useState, useEffect } from 'react';
import { Workbox } from 'workbox-window';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWACapabilities {
  hasServiceWorker: boolean;
  hasManifest: boolean;
  isSecure: boolean;
  canInstall: boolean;
}

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [pwaCapabilities, setPwaCapabilities] = useState<PWACapabilities>({
    hasServiceWorker: false,
    hasManifest: false,
    isSecure: false,
    canInstall: false
  });

  // Detectar tipo de dispositivo e navegador
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isDesktop = !isMobile;
  const isChrome = /Chrome/i.test(userAgent) && !/Edg/i.test(userAgent);
  const isEdge = /Edg/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  const isFirefox = /Firefox/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  // Verificar capacidades PWA
  const checkPWACapabilities = async () => {
    console.log('🔍 Verificando capacidades PWA...');
    
    const capabilities: PWACapabilities = {
      hasServiceWorker: 'serviceWorker' in navigator,
      hasManifest: false,
      isSecure: location.protocol === 'https:' || location.hostname === 'localhost',
      canInstall: false
    };

    // Verificar manifest
    try {
      const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      if (manifestLink) {
        const response = await fetch(manifestLink.href);
        if (response.ok) {
          const manifest = await response.json();
          capabilities.hasManifest = !!(manifest.name && manifest.start_url && manifest.icons);
          console.log('📄 Manifest encontrado:', manifest);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar manifest:', error);
    }

    // Verificar se pode instalar
    capabilities.canInstall = capabilities.hasServiceWorker && capabilities.hasManifest && capabilities.isSecure;

    console.log('📊 Capacidades PWA:', capabilities);
    setPwaCapabilities(capabilities);
    
    return capabilities;
  };

  useEffect(() => {
    console.log('🔧 Inicializando PWA hook...');
    console.log('🌐 Navegador detectado:', {
      userAgent,
      isMobile,
      isDesktop,
      isChrome,
      isEdge,
      isSafari,
      isFirefox,
      isIOS,
      isAndroid
    });
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppIOS = (window.navigator as any).standalone === true;
    const isInWebApp = isStandalone || isInWebAppIOS;
    
    console.log('📱 Estado de instalação:', {
      isStandalone,
      isInWebAppIOS,
      isInWebApp
    });
    
    setIsInstalled(isInWebApp);

    // Verificar capacidades PWA
    checkPWACapabilities().then((capabilities) => {
      if (!isInWebApp && capabilities.canInstall) {
        console.log('✅ PWA instalável detectado');
        setIsInstallable(true);
        
        // Mostrar prompt após delay se suportado
        if (isChrome || isEdge) {
          console.log('🎯 Navegador com suporte nativo ao beforeinstallprompt');
          // Para Chrome/Edge, aguardar o evento beforeinstallprompt
        } else {
          console.log('📝 Navegador sem suporte nativo, usando instrução manual');
          // Para outros navegadores, mostrar instruções manuais
          const lastDismissed = localStorage.getItem('pwa-install-dismissed');
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
          
          if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
            setTimeout(() => {
              setShowInstallPrompt(true);
            }, 3000);
          }
        }
      }
    });

    // Listen for install prompt (apenas Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 Evento beforeinstallprompt detectado!');
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Verificar se não foi rejeitado recentemente
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
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

    // Registrar eventos apenas para navegadores suportados
    if (isChrome || isEdge) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
    
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

    return () => {
      if (isChrome || isEdge) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    console.log('🚀 Tentando instalar app...');
    console.log('🔧 Estado atual:', {
      hasInstallPrompt: !!installPrompt,
      isChrome,
      isEdge,
      isSafari,
      isIOS,
      isAndroid
    });
    
    if (installPrompt && (isChrome || isEdge)) {
      // Instalação nativa para Chrome/Edge
      try {
        console.log('📱 Usando instalação nativa...');
        await installPrompt.prompt();
        const result = await installPrompt.userChoice;
        
        console.log('📊 Resultado da instalação:', result.outcome);
        
        if (result.outcome === 'accepted') {
          setIsInstallable(false);
          setInstallPrompt(null);
          setShowInstallPrompt(false);
        }
      } catch (error) {
        console.error('❌ Erro durante instalação nativa:', error);
      }
    } else {
      // Para outros navegadores, não fechar o popup
      // O usuário seguirá as instruções manuais
      console.log('📝 Mostrando instruções manuais de instalação');
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
    console.log('📊 Estado PWA completo:', {
      isInstallable,
      isInstalled,
      isOnline,
      showInstallPrompt,
      hasInstallPrompt: !!installPrompt,
      isMobile,
      isDesktop,
      isChrome,
      isEdge,
      isSafari,
      isIOS,
      isAndroid,
      pwaCapabilities
    });
  }, [isInstallable, isInstalled, isOnline, showInstallPrompt, installPrompt, isMobile, isDesktop, isChrome, isEdge, isSafari, isIOS, isAndroid, pwaCapabilities]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    showInstallPrompt,
    isMobile,
    isDesktop,
    isChrome,
    isEdge,
    isSafari,
    isFirefox,
    isIOS,
    isAndroid,
    pwaCapabilities,
    installApp,
    updateApp,
    dismissInstallPrompt
  };
}
