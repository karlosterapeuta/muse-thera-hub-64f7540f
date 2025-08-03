
import React from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { EnhancedSessionChart } from "./components/EnhancedSessionChart";
import { UpcomingSessions } from "./components/UpcomingSessions";
import { useDashboardData } from "./hooks/useDashboardData";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <UpcomingSessions 
              upcomingSessions={data.upcomingSessions} 
              isLoading={data.isLoading}
            />
            <FinancialAgenda 
              financialSchedule={data.financialSchedule} 
              isLoading={data.isLoading}
            />
          </div>

          {/* Right Column */}
          <div className="w-full">
            <EnhancedSessionChart 
              sessionData={data.sessionData} 
              isLoading={data.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
