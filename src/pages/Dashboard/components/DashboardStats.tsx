
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity, Calendar } from "lucide-react";

interface DashboardStatsProps {
  totalSessions: number;
  totalRevenue: number;
  averagePerSession: number;
  completionRate: number;
  monthlyChange: number;
  isLoading: boolean;
}

export function DashboardStats({
  totalSessions,
  totalRevenue,
  averagePerSession,
  completionRate,
  monthlyChange,
  isLoading
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Sessões desta Semana",
      value: totalSessions.toString(),
      subtitle: "Atendimentos realizados",
      icon: Users,
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      change: monthlyChange,
      changeLabel: "vs. semana anterior"
    },
    {
      title: "Receita Semanal",
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(totalRevenue),
      subtitle: "Faturamento total",
      icon: DollarSign,
      gradient: "from-green-500 via-green-600 to-emerald-700",
      change: 8,
      changeLabel: "vs. semana anterior"
    },
    {
      title: "Média por Sessão",
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(averagePerSession),
      subtitle: "Valor médio",
      icon: TrendingUp,
      gradient: "from-purple-500 via-purple-600 to-indigo-700",
      change: 12,
      changeLabel: "vs. semana anterior"
    },
    {
      title: "Taxa de Conclusão",
      value: `${completionRate}%`,
      subtitle: "Sessões finalizadas",
      icon: Activity,
      gradient: "from-orange-500 via-orange-600 to-red-700",
      change: completionRate > 80 ? 5 : -2,
      changeLabel: "vs. semana anterior"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${stat.gradient} text-white hover:shadow-2xl transition-all duration-500 group`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">{stat.title}</h3>
                <p className="text-xs text-white/70">{stat.subtitle}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="w-16 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                ) : (
                  stat.value
                )}
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stat.change >= 0 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-red-500/20 text-red-100'
              }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change >= 0 ? '+' : ''}{stat.change}% {stat.changeLabel}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
