import { Button } from "@/components/ui/button";
import { LogOut, Download, ExternalLink } from "lucide-react";
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
      globalCacheManager.performFullCleanup();
      globalCacheManager.clearAll();
      localStorage.clear();
      sessionStorage.clear();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
      } else {
        console.log("Logout realizado com sucesso");
      }
      onNavigate?.();
      window.location.replace('/login');
    } catch (error) {
      console.error("Erro durante o logout:", error);
      onNavigate?.();
      window.location.replace('/login');
    }
  };

  const handleInstallClick = () => {
    onNavigate?.();
    navigate("/install");
  };

  return (
    <div className="relative border-t border-border/30">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="p-3 space-y-1.5">
        {/* Install App Button */}
        {!isStandalone && (
          <Button
            variant="ghost"
            className={cn(
              "w-full h-10 rounded-xl transition-all duration-300 group relative overflow-hidden",
              collapsed ? "justify-center px-2" : "justify-start gap-3 px-3"
            )}
            onClick={handleInstallClick}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300 rounded-xl" />
            
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-muted/60 group-hover:bg-blue-500/10 transition-colors duration-200">
              <Download size={15} className="text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            {!collapsed && (
              <div className="relative flex items-center gap-2 flex-1">
                <span className="font-medium text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">
                  Instalar App
                </span>
                {canInstallNatively && (
                  <Badge 
                    variant="outline" 
                    className="ml-auto text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  >
                    ✓ Pronto
                  </Badge>
                )}
              </div>
            )}
          </Button>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-full h-10 rounded-xl transition-all duration-300 group relative overflow-hidden",
            collapsed ? "justify-center px-2" : "justify-start gap-3 px-3"
          )}
          onClick={handleLogout}
        >
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-pink-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-pink-500/10 group-hover:to-red-500/10 transition-all duration-300 rounded-xl" />
          
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-muted/60 group-hover:bg-red-500/10 transition-colors duration-200">
            <LogOut size={15} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
          </div>
          {!collapsed && (
            <span className="relative font-medium text-[13px] text-foreground/80 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              Sair do Sistema
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
