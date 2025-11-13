import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "./ThemeToggle";
import { Sparkles } from "lucide-react";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Gradiente decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 animate-gradient"></div>
      
      <div className="relative flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Área esquerda - Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <SidebarTrigger className="relative hover:bg-muted/50 transition-all duration-300" />
          </div>
        </div>

        {/* Área central - Logo e Nome */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-full border border-purple-200/50 dark:border-purple-800/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse-slow" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              MuseTera
            </span>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Área direita - Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Sombra inferior suave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </header>
  );
}
