
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

  // Detectar navegador e dispositivo com melhor precisão
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
                     (window.innerWidth <= 768 && 'ontouchstart' in window);
    const isTablet = /iPad|Android/i.test(userAgent) && window.innerWidth >= 768;
    const isDesktop = !isMobile && !isTablet;
    
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
      supportsInstall = false; // Firefox ainda não suporta bem PWA install
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'safari';
      supportsInstall = isMobile || isTablet; // Safari mobile/tablet suporta Add to Home Screen
    } else if (userAgent.includes('SamsungBrowser')) {
      browserName = 'samsung';
      supportsInstall = true;
    }

    setBrowserInfo({
      name: browserName,
      isMobile,
      isDesktop,
      supportsInstall
    });

    console.log('🔍 Enhanced browser detection:', {
      userAgent: userAgent.substring(0, 100) + '...',
      browserName,
      isMobile,
      isTablet,
      isDesktop,
      supportsInstall,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      touchSupport: 'ontouchstart' in window,
      standalone: window.matchMedia('(display-mode: standalone)').matches
    });
  }, []);

  useEffect(() => {
    console.log('🔧 Initializing PWA hook...');
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppIOS = (window.navigator as any).standalone === true;
    const appInstalled = isStandalone || isInWebAppIOS;
    
    console.log('📱 Installation status:', { isStandalone, isInWebAppIOS, appInstalled });
    setIsInstalled(appInstalled);

    if (appInstalled) {
      console.log('✅ App already installed');
      return;
    }

    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    // Listen for install prompt with improved handling
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 beforeinstallprompt event captured!', e);
      e.preventDefault();
      
      const promptEvent = e as BeforeInstallPromptEvent;
      deferredPrompt = promptEvent;
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
      
      // Only show prompt on mobile devices
      if (browserInfo.isMobile) {
        // Check if not dismissed recently
        const lastDismissed = localStorage.getItem('pwa-install-dismissed');
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
          console.log('✅ Showing install popup in 2 seconds...');
          setTimeout(() => {
            setShowInstallPrompt(true);
          }, 2000);
        } else {
          console.log('❌ Popup was dismissed recently');
        }
      } else {
        console.log('❌ Desktop device - not showing install prompt');
      }
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('🎉 App installed successfully!');
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      setShowInstallPrompt(false);
      deferredPrompt = null;
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

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker with retry mechanism
    if ('serviceWorker' in navigator) {
      const registerSW = async (retries = 3) => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('✅ Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 Update available');
                  setUpdateAvailable(true);
                }
              });
            }
          });
        } catch (error) {
          console.error('❌ Service Worker registration failed:', error);
          if (retries > 0) {
            console.log(`🔄 Retrying registration... (${retries} attempts left)`);
            setTimeout(() => registerSW(retries - 1), 1000);
          }
        }
      };

      registerSW();
    }

    // Fallback for mobile browsers that support PWA but didn't trigger event
    if (browserInfo.supportsInstall && !appInstalled && browserInfo.isMobile) {
      setTimeout(() => {
        if (!deferredPrompt) {
          console.log('⚠️ Mobile browser supports PWA but event not captured, showing fallback');
          setIsInstallable(true);
          
          const lastDismissed = localStorage.getItem('pwa-install-dismissed');
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
          
          if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
            setTimeout(() => {
              setShowInstallPrompt(true);
            }, 3000);
          }
        }
      }, 1000);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [browserInfo.supportsInstall, browserInfo.isMobile]);

  const installApp = async () => {
    console.log('🚀 Attempting to install app...', {
      hasInstallPrompt: !!installPrompt,
      browserSupportsInstall: browserInfo.supportsInstall,
      browserName: browserInfo.name
    });
    
    if (!installPrompt) {
      console.log('❌ No install prompt available, using fallback');
      return false;
    }

    try {
      console.log('📱 Calling install prompt...');
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      console.log('📊 Installation result:', result.outcome);
      
      if (result.outcome === 'accepted') {
        console.log('✅ Installation accepted by user');
        setIsInstallable(false);
        setInstallPrompt(null);
        setShowInstallPrompt(false);
        return true;
      } else {
        console.log('❌ Installation rejected by user');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      return false;
    } catch (error) {
      console.error('❌ Error during installation:', error);
      return false;
    }
  };

  const dismissInstallPrompt = () => {
    console.log('❌ Popup dismissed by user');
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const updateApp = () => {
    console.log('🔄 Updating app...');
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
