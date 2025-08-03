
import React from "react";
import { Clock, Calendar, TrendingUp, Users, FileText, Activity, Sparkles } from "lucide-react";
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
    <div className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20" />
      
      {/* Main header container */}
      <div className="relative backdrop-blur-sm bg-white/90 border-b border-white/60 shadow-lg">
        <div className="container mx-auto p-6">
          {/* Sistema MuseTera Title Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 group">
              <Sparkles className="h-8 w-8 text-blue-500 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
              <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm hover:scale-105 transition-transform duration-300 cursor-default">
                Sistema MuseTera
              </h1>
              <Sparkles className="h-8 w-8 text-pink-500 animate-pulse group-hover:-rotate-12 transition-transform duration-300" />
            </div>
            <div className="h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-60" />
          </div>

          {/* Welcome section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            {/* Professional welcome */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <LogoRound size="md" className="shadow-xl border-2 border-white/80" />
                <div className="flex flex-col">
                  <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {getGreeting()}, {professional?.name?.split(' ')[0] || 'Profissional'}!
                  </h2>
                  <p className="text-lg text-gray-600 font-medium">
                    Pronto para mais um dia de transformação através da música
                  </p>
                </div>
              </div>
            </div>

            {/* Time and professional info */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{getCurrentDate()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-xl font-bold">{getCurrentTime()}</span>
                </div>
              </div>
              
              <div className="relative">
                <ProfessionalAvatar size="lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <span className="text-xs lg:text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500" />
    </div>
  );
}
