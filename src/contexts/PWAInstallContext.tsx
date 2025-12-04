import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  triggerInstall: () => Promise<boolean>;
  clearPrompt: () => void;
}

const PWAInstallContext = createContext<PWAInstallContextType | null>(null);

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    console.log('[PWA] Iniciando contexto PWA...');
    
    // Check if already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInstalled);
    console.log('[PWA] Já instalado?', isInstalled);

    if (isInstalled) return;

    // Verificar se evento já foi capturado anteriormente (armazenado em window)
    const existingPrompt = (window as any).__pwaInstallPrompt;
    if (existingPrompt) {
      console.log('[PWA] Usando prompt existente do window');
      setDeferredPrompt(existingPrompt);
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      console.log('[PWA] ✅ beforeinstallprompt capturado!');
      setDeferredPrompt(e);
      // Salvar no window para reutilização
      (window as any).__pwaInstallPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    console.log('[PWA] Listener adicionado para beforeinstallprompt');
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    };
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('[PWA] Nenhum prompt disponível');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsStandalone(true);
        setDeferredPrompt(null);
        // Limpar do window também
        (window as any).__pwaInstallPrompt = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error('[PWA] Erro na instalação:', error);
      return false;
    }
  };

  const clearPrompt = () => {
    setDeferredPrompt(null);
    (window as any).__pwaInstallPrompt = null;
  };

  return (
    <PWAInstallContext.Provider value={{ 
      deferredPrompt, 
      isStandalone, 
      triggerInstall, 
      clearPrompt 
    }}>
      {children}
    </PWAInstallContext.Provider>
  );
}

export const usePWAInstall = () => {
  const context = useContext(PWAInstallContext);
  if (!context) {
    throw new Error('usePWAInstall must be used within PWAInstallProvider');
  }
  return context;
};
