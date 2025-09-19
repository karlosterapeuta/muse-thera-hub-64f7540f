
import React from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { CacheStatsCard } from "./components/CacheStatsCard";
import { useDashboardData } from "./hooks/useDashboardData";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <DashboardHeader
        totalPatients={data.totalPatients}
        totalReports={data.totalReports}
        totalRevenue={data.totalRevenue}
        completionRate={data.completionRate}
      />

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Statistics Cards - mantendo como backup/detalhado */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            isLoading={data.isLoading}
          />
        </div>

        {/* Cache Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <FinancialAgenda 
              financialSchedule={data.financialSchedule} 
              isLoading={data.isLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <CacheStatsCard />
          </div>
        </div>

      </div>
    </div>
  );
}
