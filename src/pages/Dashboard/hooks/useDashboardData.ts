
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { DashboardData } from "../types/dashboard";
import { fetchProfessionalProfile, fetchSessionsAndFinancials, fetchMonthlyData } from "../services/dashboardService";
import { createWeekStructure, organizeSessions, addFinancialData, calculateStatistics, prepareUpcomingSessions, generateChartData } from "../utils/dashboardCalculations";

export function useDashboardData(): DashboardData {
  const [currentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-data', weekStart, weekEnd],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const professional = await fetchProfessionalProfile(user.id);
      
      const [currentData, monthlyData] = await Promise.all([
        fetchSessionsAndFinancials(professional.id, weekStart, weekEnd),
        fetchMonthlyData(professional.id, monthStart, monthEnd)
      ]);

      const weekDays = createWeekStructure(weekStart);
      organizeSessions(currentData.sessions, weekDays);
      addFinancialData(currentData.financialRecords, weekDays);

      const stats = calculateStatistics(currentData.sessions, currentData.financialRecords);
      const monthlyStats = calculateStatistics(monthlyData.monthlySessions, monthlyData.monthlyFinancialRecords);
      
      const monthlyChange = monthlyStats.totalSessions > 0 
        ? Math.round(((stats.totalSessions - monthlyStats.totalSessions) / monthlyStats.totalSessions) * 100)
        : 0;

      return {
        weekDays,
        ...stats,
        upcomingSessions: prepareUpcomingSessions(currentData.sessions),
        monthlyChange,
        sessionData: generateChartData(currentData.sessions)
      };
    }
  });

  return {
    weekDays: data?.weekDays || [],
    totalSessions: data?.totalSessions || 0,
    totalRevenue: data?.totalRevenue || 0,
    averagePerSession: data?.averagePerSession || 0,
    upcomingSessions: data?.upcomingSessions || [],
    monthlyChange: data?.monthlyChange || 0,
    completionRate: data?.completionRate || 0,
    sessionData: data?.sessionData || [],
    isLoading,
    error: error?.message
  };
}
