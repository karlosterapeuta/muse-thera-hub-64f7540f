
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Safe initialization function
function initializeApp() {
  try {
    // Set initial theme
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(theme);

    // Get root element
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    // Create and render React app
    const root = createRoot(rootElement);
    root.render(<App />);
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback: show basic error message
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          background: #f8fafc;
          color: #334155;
        ">
          <div style="text-align: center;">
            <h1 style="margin-bottom: 16px;">Sistema Indisponível</h1>
            <p style="margin-bottom: 24px;">Ocorreu um erro ao carregar a aplicação.</p>
            <button 
              onclick="window.location.reload()" 
              style="
                padding: 8px 16px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
              "
            >
              Recarregar
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
