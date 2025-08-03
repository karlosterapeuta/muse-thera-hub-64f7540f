
import React from "react";
import { Clock, Calendar, TrendingUp, Users, FileText, Activity, BarChart3 } from "lucide-react";
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
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.06),transparent_50%)]" />
      
      {/* Main header container */}
      <div className="relative backdrop-blur-sm bg-white/95 border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          {/* Header Top Section - Logo + Title + Time */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            {/* Left - Logo + Title */}
            <div className="flex items-center gap-4">
              <LogoRound size="md" className="shadow-lg border border-slate-200/50" />
              <div className="flex flex-col">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                  Sistema MuseTera
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-slate-600 font-medium">Dashboard Profissional</span>
                </div>
              </div>
            </div>

            {/* Right - Time + Avatar */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{getCurrentDate()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-xl font-bold">{getCurrentTime()}</span>
                </div>
              </div>
              
              <div className="relative">
                <ProfessionalAvatar size="lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 mb-2">
              {getGreeting()}, {professional?.name?.split(' ')[0] || 'Profissional'}!
            </h2>
            <p className="text-slate-600 max-w-2xl">
              Bem-vindo ao seu painel de controle. Acompanhe suas atividades e resultados de musicoterapia.
            </p>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        {stat.change}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    </div>
  );
}
