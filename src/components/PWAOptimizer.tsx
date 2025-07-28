import { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';

/**
 * Componente que otimiza a experiência PWA
 * - Aplica estilos específicos para PWA
 * - Gerencia viewport e orientação
 * - Configura comportamentos mobile-specific
 */
export function PWAOptimizer() {
  const { isInstalled, browserInfo } = usePWA();

  useEffect(() => {
    // Aplicar estilos específicos para PWA quando instalado
    if (isInstalled) {
      document.body.classList.add('pwa-installed');
      
      // Configurações específicas para iOS standalone
      if (browserInfo.name === 'safari' && (window.navigator as any).standalone) {
        document.body.classList.add('ios-standalone');
        
        // Prevenir zoom duplo toque no iOS
        let lastTouchEnd = 0;
        const preventZoom = (e: TouchEvent) => {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        };
        
        document.addEventListener('touchend', preventZoom, { passive: false });
        
        return () => {
          document.removeEventListener('touchend', preventZoom);
        };
      }
    }

    // Configurar viewport dinâmico para mobile
    if (browserInfo.isMobile) {
      const setViewportHeight = () => {
        // Usar CSS custom property para altura real da viewport
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);

      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
      };
    }
  }, [isInstalled, browserInfo]);

  useEffect(() => {
    // Configurar tema-cor dinâmico baseado no tema atual
    const updateThemeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const themeColor = isDark ? '#1a1a1a' : '#4A90E2';
      
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', themeColor);
      
      // iOS status bar
      let metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!metaStatusBar) {
        metaStatusBar = document.createElement('meta');
        metaStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(metaStatusBar);
      }
      metaStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
    };

    updateThemeColor();

    // Observer para mudanças de tema
    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Preload críticos para melhor performance
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/lovable-uploads/3d7825ca-4115-46a1-a33f-069a18aaf1a2.png',
        // Adicionar outros recursos críticos aqui
      ];

      criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    };

    // Preload depois que a página carregou
    if (document.readyState === 'complete') {
      preloadCriticalResources();
    } else {
      window.addEventListener('load', preloadCriticalResources);
      return () => window.removeEventListener('load', preloadCriticalResources);
    }
  }, []);

  useEffect(() => {
    // Configurar scroll behavior para iOS
    if (browserInfo.name === 'safari' && browserInfo.isMobile) {
      // Prevenir scroll bounce no iOS
      const preventBounce = (e: TouchEvent) => {
        const target = e.target as Element;
        if (!target.closest('.scroll-container')) {
          e.preventDefault();
        }
      };

      // Aplicar apenas em elementos que não devem ter scroll bounce
      document.addEventListener('touchmove', preventBounce, { passive: false });

      return () => {
        document.removeEventListener('touchmove', preventBounce);
      };
    }
  }, [browserInfo]);

  // Estilos CSS injetados dinamicamente
  useEffect(() => {
    if (!document.getElementById('pwa-optimizer-styles')) {
      const style = document.createElement('style');
      style.id = 'pwa-optimizer-styles';
      style.textContent = `
        /* PWA Optimizer Styles */
        :root {
          --vh: 1vh;
        }

        /* PWA Installed Styles */
        .pwa-installed {
          /* Remover espaços desnecessários quando instalado */
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        /* iOS Standalone Styles */
        .ios-standalone {
          /* Ajustes específicos para iOS standalone */
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Mobile Viewport Fix */
        @media (max-width: 768px) {
          .mobile-vh {
            height: calc(var(--vh, 1vh) * 100);
          }

          .min-mobile-vh {
            min-height: calc(var(--vh, 1vh) * 100);
          }

          /* Otimizações de scroll para mobile */
          .scroll-container {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }

          /* Botões touch-friendly */
          button, .btn, [role="button"] {
            min-height: 44px;
            min-width: 44px;
            touch-action: manipulation;
          }
        }

        /* PWA Splash Screen Simulation */
        .pwa-splash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          z-index: 9999;
          opacity: 1;
          transition: opacity 0.3s ease-out;
        }

        .pwa-splash.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .pwa-splash-logo {
          width: 120px;
          height: 120px;
          border-radius: 20px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .pwa-splash-text {
          color: white;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        /* Landscape specific adjustments */
        @media (orientation: landscape) and (max-height: 500px) {
          .mobile-landscape-adjust {
            padding-top: 10px;
            padding-bottom: 10px;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .high-dpi-optimize {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Dark mode PWA adjustments */
        .dark .pwa-splash {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%);
        }

        /* Pull-to-refresh prevention */
        body {
          overscroll-behavior-y: contain;
        }

        /* iOS specific adjustments */
        @supports (-webkit-touch-callout: none) {
          .ios-safe-area {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Este componente não renderiza nada visível
  return null;
}