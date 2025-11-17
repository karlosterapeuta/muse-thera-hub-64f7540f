import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config'
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
      // Verificar atualizações a cada 60 segundos
      setInterval(() => {
        console.log('[PWA] Verificando atualizações...');
        registration.update();
      }, 60 * 1000);
    }
  },
  onNeedRefresh() {
    console.log('[PWA] Nova versão disponível, atualizando...');
    // Força ativação do novo SW e recarrega
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[PWA] App pronto para uso offline');
  },
});

createRoot(document.getElementById("root")!).render(<App />);