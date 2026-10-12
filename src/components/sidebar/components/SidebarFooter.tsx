import { Button } from "@/components/ui/button";
import { LogOut, Download, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { globalCacheManager } from "@/utils/cacheManager";
import { useNavigate } from "react-router-dom";
import { usePWAInstall } from "@/contexts/PWAInstallContext";
import { Badge } from "@/components/ui/badge";
import { forceClientUpdate } from "@/utils/forceUpdate";
import { useState } from "react";
import { toast } from "sonner";

interface SidebarFooterProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarFooter({ collapsed, onNavigate }: SidebarFooterProps) {
  const { deferredPrompt, isStandalone } = usePWAInstall();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const canInstallNatively = !!deferredPrompt;

  const handleForceUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    toast.loading("Limpando cache e atualizando o sistema...", { id: "force-update" });
    try {
      globalCacheManager.performFullCleanup();
      await forceClientUpdate();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar. Tente novamente.", { id: "force-update" });
      setIsUpdating(false);
    }
  };

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
    <div className="relative border-t border-white/5">
      <div className="p-3 space-y-1">
        {/* Install App Button */}
        {!isStandalone && (
          <Button
            variant="ghost"
            className={cn(
              "w-full h-11 rounded-xl transition-all duration-300 group text-foreground/60 hover:text-foreground hover:bg-white/5",
              collapsed ? "justify-center px-2" : "justify-start gap-3 px-4"
            )}
            onClick={handleInstallClick}
          >
            <Download size={18} className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            {!collapsed && (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium">Instalar App</span>
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

        {/* Force Update / Clear Cache Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-full h-11 rounded-xl transition-all duration-300 group text-teal-600 hover:text-teal-700 hover:bg-teal-600/10 dark:text-teal-300 dark:hover:text-teal-200",
            collapsed ? "justify-center px-2" : "justify-start gap-3 px-4"
          )}
          onClick={handleForceUpdate}
          disabled={isUpdating}
        >
          <RefreshCw
            size={18}
            className={cn(
              "shrink-0 opacity-80 group-hover:scale-110 transition-transform",
              isUpdating && "animate-spin"
            )}
          />
          {!collapsed && (
            <span className="text-sm font-medium">
              {isUpdating ? "Atualizando..." : "Limpar cache e atualizar"}
            </span>
          )}
        </Button>

        {/* Logout Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-full h-11 rounded-xl transition-all duration-300 group text-rose-400 hover:text-rose-300 hover:bg-rose-500/10",
            collapsed ? "justify-center px-2" : "justify-start gap-3 px-4"
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} className="shrink-0 opacity-80 group-hover:scale-110 transition-transform" />
          {!collapsed && (
            <span className="text-sm font-medium">Sair do Sistema</span>
          )}
        </Button>
      </div>
    </div>
  );
}
