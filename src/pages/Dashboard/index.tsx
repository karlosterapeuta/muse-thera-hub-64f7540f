
import React from "react";
import { DashboardStats } from "./components/DashboardStats";
import { UnifiedWeeklySchedule } from "./components/UnifiedWeeklySchedule";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { EnhancedSessionChart } from "./components/EnhancedSessionChart";
import { UpcomingSessions } from "./components/UpcomingSessions";
import { useDashboardData } from "./hooks/useDashboardData";

export default function Dashboard() {
  const data = useDashboardData();

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Dashboard Profissional
        </h1>
        <p className="text-gray-600 text-lg">
          Acompanhe seu desempenho e gerencie suas atividades
        </p>
      </div>

      {/* Statistics Cards */}
      <DashboardStats
        totalSessions={data.totalSessions}
        totalRevenue={data.totalRevenue}
        averagePerSession={data.averagePerSession}
        completionRate={data.completionRate}
        monthlyChange={data.monthlyChange}
        totalPatients={data.totalPatients}
        totalAnamnesis={data.totalAnamnesis}
        totalReports={data.totalReports}
        isLoading={data.isLoading}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <UnifiedWeeklySchedule 
            weekDays={data.weekDays} 
            isLoading={data.isLoading}
          />
        </div>

        {/* Side Panel */}
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
      </div>

      {/* Session Evolution Chart */}
      <EnhancedSessionChart 
        sessionData={data.sessionData} 
        isLoading={data.isLoading}
      />
    </div>
  );
}
