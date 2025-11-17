
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, UserCheck, Plus, ClipboardList, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DashboardStatsProps {
  totalPatients: number;
  totalReports: number;
  totalAnamnesis: number;
  totalInterventions: number;
  isLoading: boolean;
}

export function DashboardStats({
  totalPatients,
  totalReports,
  totalAnamnesis,
  totalInterventions,
  isLoading
}: DashboardStatsProps) {
  const { t } = useTranslation('financial');
  
  console.log("🎯 DashboardStats recebeu os dados:", {
    totalPatients,
    totalReports,
    totalAnamnesis,
    totalInterventions,
    isLoading
  });

  const stats = [
    {
      title: t('dashboard.stats.patientsRegistered'),
      value: totalPatients || 0,
      subtitle: t('dashboard.stats.totalPatients'),
      icon: UserCheck,
      gradient: "from-emerald-500 via-emerald-600 to-green-700",
      actionText: totalPatients === 0 ? t('dashboard.stats.registerFirstPatient') : `${totalPatients} ${t('dashboard.stats.patientsActive')}`,
      isEmpty: totalPatients === 0
    },
    {
      title: t('dashboard.stats.anamnesisCompleted'),
      value: totalAnamnesis || 0,
      subtitle: t('dashboard.stats.completeEvaluations'),
      icon: ClipboardList,
      gradient: "from-blue-500 via-blue-600 to-indigo-700",
      actionText: totalAnamnesis === 0 ? t('dashboard.stats.performFirstAnamnesis') : `${totalAnamnesis} ${t('dashboard.stats.anamnesisRegistered')}`,
      isEmpty: totalAnamnesis === 0
    },
    {
      title: t('dashboard.stats.interventionsCreated'),
      value: totalInterventions || 0,
      subtitle: t('dashboard.stats.therapeuticPlans'),
      icon: Target,
      gradient: "from-amber-500 via-orange-600 to-red-700",
      actionText: totalInterventions === 0 ? t('dashboard.stats.createFirstIntervention') : `${totalInterventions} ${t('dashboard.stats.plansActive')}`,
      isEmpty: totalInterventions === 0
    },
    {
      title: t('dashboard.stats.reportsGenerated'),
      value: totalReports || 0,
      subtitle: t('dashboard.stats.documentsProduced'),
      icon: FileText,
      gradient: "from-violet-500 via-violet-600 to-purple-700",
      actionText: totalReports === 0 ? t('dashboard.stats.generateFirstReport') : `${totalReports} ${t('dashboard.stats.reportsCreated')}`,
      isEmpty: totalReports === 0
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((_, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse">
            <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gray-300 dark:bg-gray-600 rounded-lg sm:rounded-xl"></div>
                <div className="space-y-1 sm:space-y-2 flex-1">
                  <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-1.5 sm:h-2 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="h-5 sm:h-6 lg:h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-2.5 sm:h-3 lg:h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
      {stats.map((stat, index) => {
        console.log(`📊 Renderizando card ${index}:`, stat.title, "Valor:", stat.value);
        
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden border-0 shadow-lg rounded-xl bg-gradient-to-br ${stat.gradient} text-white hover:shadow-2xl sm:hover:scale-105 transition-all duration-300 group cursor-pointer`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <div className="p-1 sm:p-1.5 lg:p-2 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-white/90 truncate leading-tight">
                    {stat.title}
                  </h3>
                  <p className="text-[8px] sm:text-[10px] lg:text-xs text-white/70 truncate">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                  {stat.isEmpty ? (
                    <span className="text-sm sm:text-base lg:text-lg text-white/80">0</span>
                  ) : (
                    <span className="drop-shadow-lg">{stat.value}</span>
                  )}
                </div>
                
                {stat.isEmpty ? (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-[9px] sm:text-xs w-full group/button py-1 sm:py-1.5 h-auto"
                  >
                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 group-hover/button:rotate-90 transition-transform duration-300 flex-shrink-0" />
                    <span className="truncate leading-tight">{stat.actionText}</span>
                  </Button>
                ) : (
                  <div className="inline-flex items-center px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium bg-white/10 text-white/80 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
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
