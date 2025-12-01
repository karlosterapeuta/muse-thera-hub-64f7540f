import { Button } from "@/components/ui/button";
import { LogOut, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { globalCacheManager } from "@/utils/cacheManager";
import { useNavigate } from "react-router-dom";
import { usePWAInstall } from "@/contexts/PWAInstallContext";
import { Badge } from "@/components/ui/badge";

interface SidebarFooterProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarFooter({ collapsed, onNavigate }: SidebarFooterProps) {
  const { deferredPrompt, isStandalone } = usePWAInstall();
  const navigate = useNavigate();
  
  const canInstallNatively = !!deferredPrompt;

  const handleLogout = async () => {
    try {
      console.log("Iniciando logout...");
      
      // Perform comprehensive cache cleanup
      globalCacheManager.performFullCleanup();
      globalCacheManager.clearAll();
      
      // Clear any local storage data
      localStorage.clear();
      sessionStorage.clear();
      
      // Unregister service worker to prevent cached content on next login
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('[PWA] Service Worker desregistrado no logout');
        }
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
      } else {
        console.log("Logout realizado com sucesso");
      }
      
      // Call onNavigate if provided
      onNavigate?.();
      
      // Force complete reload to clear all cache
      window.location.href = '/login';
      window.location.reload();
    } catch (error) {
      console.error("Erro durante o logout:", error);
      // Even if there's an error, redirect to login with reload
      onNavigate?.();
      window.location.href = '/login';
      window.location.reload();
    }
  };

  const handleInstallClick = () => {
    onNavigate?.();
    navigate("/install");
  };

  return (
    <div className="relative p-3 border-t border-border/50 bg-muted/20 backdrop-blur-sm space-y-2">
      {/* Install App Button - Only show if not installed */}
      {!isStandalone && (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-center text-foreground hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-600 hover:text-white hover:shadow-md transition-all duration-200 rounded-lg h-9 group relative",
            !collapsed && "justify-start"
          )}
          onClick={handleInstallClick}
        >
          <Download size={16} className="group-hover:animate-bounce" />
          {!collapsed && (
            <>
              <span className="ml-2 font-medium text-sm">
                Instalar App
              </span>
              {canInstallNatively && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-700 dark:text-green-400"
                >
                  ✓
                </Badge>
              )}
            </>
          )}
        </Button>
      )}

      {/* Logout Button */}
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-center text-foreground hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white hover:shadow-md transition-all duration-200 rounded-lg h-9 group",
          !collapsed && "justify-start"
        )}
        onClick={handleLogout}
      >
        <LogOut size={16} className="group-hover:animate-pulse" />
        {!collapsed && (
          <span className="ml-2 font-medium text-sm">
            Sair do Sistema
          </span>
        )}
      </Button>
    </div>
  );
}
