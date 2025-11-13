
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { globalCacheManager } from "@/utils/cacheManager";

interface SidebarFooterProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export function SidebarFooter({ collapsed, onNavigate }: SidebarFooterProps) {
  const handleLogout = async () => {
    try {
      console.log("Iniciando logout...");
      
      // Perform comprehensive cache cleanup
      globalCacheManager.performFullCleanup();
      globalCacheManager.clearAll();
      
      // Clear any local storage data
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
      } else {
        console.log("Logout realizado com sucesso");
      }
      
      // Call onNavigate if provided
      onNavigate?.();
      
      // Force redirect to login page
      window.location.replace('/login');
    } catch (error) {
      console.error("Erro durante o logout:", error);
      // Even if there's an error, redirect to login
      onNavigate?.();
      window.location.replace('/login');
    }
  };

  return (
    <div className="relative p-3 border-t backdrop-blur-sm bg-white/10 border-white/20 dark:bg-gray-800/20 dark:border-gray-700/30">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-center transition-all duration-200 rounded-lg h-9 group",
          "text-slate-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white hover:shadow-md",
          "dark:text-gray-300 dark:hover:from-red-600 dark:hover:to-pink-700",
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
