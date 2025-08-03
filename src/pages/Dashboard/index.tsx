
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
      <div className="container mx-auto p-6 space-y-8">
        {/* Statistics Cards - mantendo como backup/detalhado */}
        <div className="mt-8">
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            isLoading={data.isLoading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
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
          <div>
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
