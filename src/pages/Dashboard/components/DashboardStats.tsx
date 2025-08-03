
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, FileText, ClipboardList, UserCheck } from "lucide-react";
import { formatDashboardValue } from "./DashboardErrorFixes";

interface DashboardStatsProps {
  totalSessions: number;
  totalRevenue: number;
  averagePerSession: number;
  completionRate: number;
  monthlyChange: number;
  totalPatients: number;
  totalAnamnesis: number;
  totalReports: number;
  isLoading: boolean;
}

export function DashboardStats({
  totalSessions,
  totalRevenue,
  averagePerSession,
  completionRate,
  monthlyChange,
  totalPatients,
  totalAnamnesis,
  totalReports,
  isLoading
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Pacientes Cadastrados",
      value: totalPatients.toString(),
      subtitle: "Total de pacientes",
      icon: UserCheck,
      gradient: "from-emerald-500 via-emerald-600 to-green-700",
      change: 0,
      changeLabel: "pacientes ativos"
    },
    {
      title: "Anamneses Realizadas",
      value: totalAnamnesis.toString(),
      subtitle: "Avaliações iniciais",
      icon: ClipboardList,
      gradient: "from-cyan-500 via-cyan-600 to-blue-700",
      change: 0,
      changeLabel: "anamneses completas"
    },
    {
      title: "Relatórios Gerados",
      value: totalReports.toString(),
      subtitle: "Documentos produzidos",
      icon: FileText,
      gradient: "from-violet-500 via-violet-600 to-purple-700",
      change: 0,
      changeLabel: "relatórios criados"
    },
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
      value: formatDashboardValue(totalRevenue, 'currency'),
      subtitle: "Faturamento total",
      icon: DollarSign,
      gradient: "from-green-500 via-green-600 to-emerald-700",
      change: 8,
      changeLabel: "vs. semana anterior"
    },
    {
      title: "Média por Sessão",
      value: formatDashboardValue(averagePerSession, 'currency'),
      subtitle: "Valor médio",
      icon: TrendingUp,
      gradient: "from-purple-500 via-purple-600 to-indigo-700",
      change: 12,
      changeLabel: "vs. semana anterior"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          data-dashboard-stat={stat.title}
          className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${stat.gradient} text-white hover:shadow-2xl transition-all duration-500 group`}
        >
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
                  <span className="min-h-[32px] block">
                    {stat.value === "0" || stat.value === "R$ 0" || stat.value === "R$ 0,00" ? (
                      <span className="text-lg text-white/80">
                        {stat.title.includes("Receita") || stat.title.includes("Média") ? "R$ 0,00" : "Nenhum registro"}
                      </span>
                    ) : (
                      stat.value
                    )}
                  </span>
                )}
              </div>
              {!isLoading && (
                <>
                  {stat.change !== 0 ? (
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      stat.change >= 0 
                        ? 'bg-green-500/20 text-green-100' 
                        : 'bg-red-500/20 text-red-100'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change >= 0 ? '+' : ''}{stat.change}% {stat.changeLabel}
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                      {stat.changeLabel}
                    </div>
                  )}
                </>
              )}
              {isLoading && (
                <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
