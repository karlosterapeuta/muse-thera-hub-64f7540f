
import React from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <FinancialAgenda 
            financialSchedule={data.financialSchedule} 
            isLoading={data.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
