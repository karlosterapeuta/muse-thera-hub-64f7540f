import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { checkVersionAndCleanup, startVersionPolling } from './utils/versionManager'

// Set initial theme
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(theme);

// Check version and clean caches before rendering
checkVersionAndCleanup().then((needsReload) => {
  if (needsReload) return; // Page will reload, stop here

  // Register Service Worker with auto-update
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      console.log('[PWA] SW registrado:', swUrl);
      if (registration) {
        setInterval(() => {
          console.log('[PWA] Verificando atualizações (intervalo)...');
          registration.update();
        }, 30 * 1000);

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            console.log('[PWA] Verificando atualizações (visibility)...');
            registration.update();
          }
        });

        window.addEventListener('focus', () => {
          console.log('[PWA] Verificando atualizações (focus)...');
          registration.update();
        });
      }
    },
    onNeedRefresh() {
      console.log('[PWA] Nova versão disponível, atualizando...');
      updateSW(true);
    },
    onOfflineReady() {
      console.log('[PWA] App pronto para uso offline');
    },
  });

  // Load push notification handler into SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(async (registration) => {
      try {
        // Fetch and inject push handler
        const response = await fetch('/sw-push.js');
        if (response.ok) {
          console.log('[Push] Push handler available for SW');
        }
      } catch (e) {
        console.log('[Push] Push handler check:', e);
      }
    });
  }

  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
});