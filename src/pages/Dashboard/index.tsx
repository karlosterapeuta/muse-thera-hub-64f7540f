
import React from "react";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { CacheStatsCard } from "./components/CacheStatsCard";
import { useDashboardData } from "./hooks/useDashboardData";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 w-full overflow-x-hidden">
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Statistics Cards */}
        <div>
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            totalAnamnesis={data.totalAnamnesis}
            totalInterventions={data.totalInterventions}
            isLoading={data.isLoading}
          />
        </div>

        {/* Financial Agenda & Cache Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
