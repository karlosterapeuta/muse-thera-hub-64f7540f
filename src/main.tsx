import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set initial theme
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(theme);

createRoot(document.getElementById("root")!).render(<App />);

// Registrar Service Worker explicitamente
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[PWA] Service Worker registrado com sucesso:', registration.scope);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          console.log('[PWA] Nova versão do SW disponível');
        });
      })
      .catch(error => {
        console.error('[PWA] Erro ao registrar Service Worker:', error);
      });
  });
}
