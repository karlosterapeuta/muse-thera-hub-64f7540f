
import React from "react";
import { Clock, Sparkles } from "lucide-react";
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import LogoRound from "@/components/LogoRound";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";

interface DashboardHeaderProps {
  totalPatients: number;
  totalReports: number;
  totalRevenue: number;
  completionRate: number;
}

export function DashboardHeader({
  totalPatients,
  totalReports,
  totalRevenue,
  completionRate
}: DashboardHeaderProps) {
  const { data: professional } = useProfessionalData();

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Gradiente decorativo superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 animate-gradient"></div>
      
      <div className="relative w-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu Toggle + Logo + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* SidebarTrigger com efeito glow */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <SidebarTrigger className="relative hover:bg-muted/50 transition-all duration-300" />
            </div>
            
            {/* Logo + Title */}
            <div className="flex items-center gap-2">
              <LogoRound size="sm" className="flex-shrink-0" />
              <div className="min-w-0 hidden sm:block">
                <h1 className="text-base font-bold text-foreground truncate">MuseTera</h1>
                <p className="text-[10px] text-muted-foreground truncate">Dashboard</p>
              </div>
            </div>

            {/* Badge MuseTera para mobile */}
            <div className="flex sm:hidden items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-full border border-purple-200/50 dark:border-purple-800/50">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                MuseTera
              </span>
            </div>
          </div>
          
          {/* Center: Greeting + Date - Desktop only */}
          <div className="hidden lg:flex flex-col items-center text-center flex-1">
            <span className="text-sm font-semibold text-foreground truncate">
              {getGreeting()}, {professional?.name?.split(' ')[0] || 'Profissional'}
            </span>
            <span className="text-xs text-muted-foreground truncate">{getCurrentDate()}</span>
          </div>
          
          {/* Right: Time + Theme Toggle + Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Time - Desktop only */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{getCurrentTime()}</span>
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Avatar */}
            <ProfessionalAvatar />
          </div>
        </div>
      </div>

      {/* Sombra inferior suave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </div>
  );
}
