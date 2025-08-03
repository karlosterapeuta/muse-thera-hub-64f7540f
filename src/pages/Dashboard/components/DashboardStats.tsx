
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, UserCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardStatsProps {
  totalPatients: number;
  totalReports: number;
  isLoading: boolean;
}

export function DashboardStats({
  totalPatients,
  totalReports,
  isLoading
}: DashboardStatsProps) {
  console.log("🎯 DashboardStats recebeu os dados:", {
    totalPatients,
    totalReports,
    isLoading
  });

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
      title: "Relatórios Gerados",
      value: totalReports || 0,
      subtitle: "Documentos produzidos",
      icon: FileText,
      gradient: "from-violet-500 via-violet-600 to-purple-700",
      actionText: totalReports === 0 ? "Gerar Primeiro Relatório" : `${totalReports} relatórios criados`,
      isEmpty: totalReports === 0
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {stats.map((_, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 sm:h-8 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        console.log(`📊 Renderizando card ${index}:`, stat.title, "Valor:", stat.value);
        
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden border-0 shadow-xl bg-gradient-to-br ${stat.gradient} text-white hover:shadow-2xl transition-all duration-500 group cursor-pointer`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white/90 truncate">{stat.title}</h3>
                  <p className="text-xs text-white/70">{stat.subtitle}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {stat.isEmpty ? (
                    <span className="text-lg text-white/80">0</span>
                  ) : (
                    <span>{stat.value}</span>
                  )}
                </div>
                
                {stat.isEmpty ? (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs w-full sm:w-auto"
                  >
                    <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{stat.actionText}</span>
                  </Button>
                ) : (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                    <span className="truncate">{stat.actionText}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
