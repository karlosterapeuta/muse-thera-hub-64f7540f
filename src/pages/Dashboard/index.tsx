
import React from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { CacheStatsCard } from "./components/CacheStatsCard";
import { useDashboardData } from "./hooks/useDashboardData";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Modern Header */}
      <DashboardHeader
        totalPatients={data.totalPatients}
        totalReports={data.totalReports}
        totalRevenue={data.totalRevenue}
        completionRate={data.completionRate}
      />

      {/* Main Content */}
      <div className="w-full px-0 py-0 space-y-2 sm:space-y-3">
        {/* Statistics Cards - mantendo como backup/detalhado */}
        <div className="mt-0 px-0">
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            isLoading={data.isLoading}
          />
        </div>

        {/* Cache Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 px-0">
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
