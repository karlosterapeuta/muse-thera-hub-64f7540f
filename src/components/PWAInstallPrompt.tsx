import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISS_KEY = "pwa-banner-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isInstalled);

    if (isInstalled) return;

    // Check if user dismissed the banner recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return; // Don't show banner if dismissed within 7 days
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show banner after 30 seconds delay
    const timer = setTimeout(() => {
      // Don't show if on login, reset-password, or install page
      const currentPath = window.location.pathname;
      const excludedPaths = ["/login", "/reset-password", "/install"];
      if (!excludedPaths.includes(currentPath)) {
        setShowBanner(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setShowBanner(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error("Error installing PWA:", error);
        // Redirect to install page for manual instructions
        window.location.href = "/install";
        setShowBanner(false);
      }
    } else {
      // No native prompt available, redirect to install page
      window.location.href = "/install";
      setShowBanner(false);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
    setShowBanner(false);
  };

  // Don't render anything if installed or banner shouldn't show
  if (isStandalone || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/95 to-primary/80 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="hidden sm:flex p-3 bg-background/20 rounded-xl shrink-0">
            <Smartphone className="w-6 h-6 text-primary-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-primary-foreground">
              📱 Instale o <span className="font-bold">MuseTera</span> para acesso rápido!
            </p>
            
            {/* Don't show again checkbox */}
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-primary-foreground/30 bg-background/20 text-primary focus:ring-primary/50"
              />
              <span className="text-xs text-primary-foreground/70">
                Não mostrar novamente
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="bg-background text-foreground hover:bg-background/90 font-medium shadow-lg"
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Instalar</span>
            </Button>
            
            <Button
              onClick={handleClose}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-background/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep the named export for backward compatibility
export { PWAInstallPrompt as default };
