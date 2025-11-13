
import React from "react";
import { Clock, Calendar, TrendingUp, Users, FileText, Activity, BarChart3, Camera } from "lucide-react";
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import LogoRound from "@/components/LogoRound";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { formatCurrency } from "@/lib/utils";

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
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const quickStats = [
    {
      icon: Users,
      label: "Pacientes",
      value: totalPatients,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      change: "+12%"
    },
    {
      icon: FileText,
      label: "Relatórios",
      value: totalReports,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      change: "+8%"
    },
    {
      icon: TrendingUp,
      label: "Faturamento",
      value: formatCurrency(totalRevenue),
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      change: "+15%"
    },
    {
      icon: Activity,
      label: "Taxa de Conclusão",
      value: `${completionRate}%`,
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100",
      change: "+5%"
    }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Main header container */}
      <div className="relative w-full bg-white border-b border-slate-200/60 shadow-sm rounded-none">
        <div className="w-full pl-0 pr-0 py-2 sm:py-3">
          {/* Header Top Section - Logo + Title + Time */}
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:space-y-0 lg:justify-between lg:items-center mb-6 sm:mb-8 pl-0 pr-0">
            {/* Left - Logo + Title */}
            <div className="flex items-center gap-3 sm:gap-4 pl-0">
              <LogoRound size="md" className="shadow-lg border border-slate-200/50 w-12 h-12 sm:w-14 sm:h-14" />
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                  Sistema MuseTera
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">Dashboard Profissional</span>
                </div>
              </div>
            </div>

            {/* Right - Time + Avatar */}
            <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-end lg:self-center">
              <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:block">{getCurrentDate()}</span>
                  <span className="text-xs font-medium sm:hidden">{getCurrentDate().split(',')[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-lg sm:text-xl font-bold">{getCurrentTime()}</span>
                </div>
              </div>
              
              <div className="relative group">
                <ProfessionalAvatar size="lg" editable={true} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                
                {/* Camera indicator */}
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <Camera className="h-3 w-3 text-white" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  Clique para alterar foto
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8 text-center lg:text-left pl-0 pr-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 mb-2">
              {getGreeting()}, {professional?.name?.split(' ')[0] || 'Profissional'}!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Bem-vindo ao seu painel de controle. Acompanhe suas atividades e resultados de musicoterapia.
            </p>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 pl-0 pr-0">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-none bg-white border-0 shadow-none transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-0">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${stat.color} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">
                        {stat.change}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">
                        {typeof stat.value === 'string' && stat.value.includes('R$') ? (
                          <span className="text-sm sm:text-lg lg:text-xl">{stat.value}</span>
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-none`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
