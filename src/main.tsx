import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Set initial theme
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(theme);

// Register Service Worker with auto-update
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.log('[PWA] SW registrado:', swUrl);
    if (registration) {
      // Verificar atualizações a cada 30 segundos
      setInterval(() => {
        console.log('[PWA] Verificando atualizações (intervalo)...');
        registration.update();
      }, 30 * 1000);

      // Verificar quando usuário volta ao app (tab visible)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log('[PWA] Verificando atualizações (visibility)...');
          registration.update();
        }
      });

      // Verificar ao focar na janela
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

createRoot(document.getElementById("root")!).render(<App />);