
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, FileText, ClipboardList, UserCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

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
      value: totalPatients || 0,
      subtitle: "Total de pacientes",
      icon: UserCheck,
      gradient: "from-emerald-500 via-emerald-600 to-green-700",
      actionText: totalPatients === 0 ? "Cadastrar Primeiro Paciente" : `${totalPatients} pacientes ativos`,
      isEmpty: totalPatients === 0
    },
    {
      title: "Anamneses Realizadas",
      value: totalAnamnesis || 0,
      subtitle: "Avaliações iniciais",
      icon: ClipboardList,
      gradient: "from-cyan-500 via-cyan-600 to-blue-700",
      actionText: totalAnamnesis === 0 ? "Criar Primeira Anamnese" : `${totalAnamnesis} anamneses completas`,
      isEmpty: totalAnamnesis === 0
    },
    {
      title: "Relatórios Gerados",
      value: totalReports || 0,
      subtitle: "Documentos produzidos",
      icon: FileText,
      gradient: "from-violet-500 via-violet-600 to-purple-700",
      actionText: totalReports === 0 ? "Gerar Primeiro Relatório" : `${totalReports} relatórios criados`,
      isEmpty: totalReports === 0
    },
    {
      title: "Sessões desta Semana",
      value: totalSessions || 0,
      subtitle: "Atendimentos realizados",
      icon: Users,
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      actionText: totalSessions === 0 ? "Agendar Primeira Sessão" : `${totalSessions} sessões realizadas`,
      isEmpty: totalSessions === 0
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((_, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${stat.gradient} text-white hover:shadow-2xl transition-all duration-500 group cursor-pointer`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white/90">{stat.title}</h3>
                <p className="text-xs text-white/70">{stat.subtitle}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-2xl font-bold text-white">
                {stat.isEmpty ? (
                  <span className="text-lg text-white/80">0</span>
                ) : (
                  stat.value
                )}
              </div>
              
              {stat.isEmpty ? (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {stat.actionText}
                </Button>
              ) : (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                  {stat.actionText}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
