
import React from "react";
import { Clock } from "lucide-react";
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import LogoRound from "@/components/LogoRound";
import { useProfessionalData } from "@/hooks/useProfessionalData";

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
    <div className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <LogoRound size="sm" className="flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">MuseTera</h1>
              <p className="text-xs text-slate-600 truncate">Dashboard</p>
            </div>
          </div>
          
          {/* Center: Greeting + Date */}
          <div className="hidden md:flex flex-col items-center text-center flex-1">
            <span className="text-sm font-semibold text-slate-900 truncate">
              {getGreeting()}, {professional?.name?.split(' ')[0] || 'Profissional'}
            </span>
            <span className="text-xs text-slate-600 truncate">{getCurrentDate()}</span>
          </div>
          
          {/* Right: Time + Avatar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <Clock className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">{getCurrentTime()}</span>
            </div>
            <ProfessionalAvatar />
          </div>
        </div>
      </div>
    </div>
  );
}
