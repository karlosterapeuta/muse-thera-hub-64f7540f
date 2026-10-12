
import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "../types/dashboardTypes";
import { getCurrentUserId } from "../services/professionalService";
import { getWeekSessions } from "../services/sessionsService";
import { getWeekFinancialRecords, getFinancialSchedule } from "../services/financialService";
import { createWeekStructure, organizeSessionsByDay, addFinancialDataToDays } from "../utils/weekDataProcessor";
import { calculateStatistics } from "../utils/statisticsCalculator";
import { usePatientsCount, useAnamnesisCount, useReportsCount, useInterventionsCount } from "@/hooks/useDashboardCounts";

export const useDashboardData = (): DashboardData => {
  // Use individual hooks for counts to leverage React Query caching
  const { data: totalPatients = 0, isLoading: isLoadingPatients } = usePatientsCount();
  const { data: totalAnamnesis = 0, isLoading: isLoadingAnamnesis } = useAnamnesisCount();
  const { data: totalReports = 0, isLoading: isLoadingReports } = useReportsCount();
  const { data: totalInterventions = 0, isLoading: isLoadingInterventions } = useInterventionsCount();

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      console.log("🔄 Carregando dados do dashboard...");
      
      const professionalId = await getCurrentUserId();
      if (!professionalId) {
        throw new Error("Professional ID não encontrado");
      }

      // Create date range for this week
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // Execute queries in parallel
      const [sessionsData, financialData, financialSchedule] = await Promise.all([
        getWeekSessions(professionalId, startOfWeek, endOfWeek).catch(() => []),
        getWeekFinancialRecords(professionalId, startOfWeek, endOfWeek).catch(() => []),
        getFinancialSchedule(professionalId).catch(() => [])
      ]);

      // Process the data
      const weekStructure = createWeekStructure(startOfWeek);
      organizeSessionsByDay(weekStructure, sessionsData);
      addFinancialDataToDays(weekStructure, financialData);
      const statistics = calculateStatistics(sessionsData, financialData);

      return {
        weekDays: weekStructure,
        totalSessions: statistics.totalSessions,
        totalRevenue: statistics.totalRevenue,
        averagePerSession: statistics.averagePerSession,
        upcomingSessions: statistics.futureSessions,
        monthlyChange: 0,
        completionRate: statistics.completionRate,
        sessionData: statistics.sessionData,
        financialSchedule: financialSchedule || [],
      };
    },
    retry: 1,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingPatients || isLoadingAnamnesis || isLoadingReports || isLoadingInterventions || isLoadingDashboard;

  return {
    ...dashboardData,
    totalPatients,
    totalAnamnesis, 
    totalReports,
    totalInterventions,
    isLoading,
    // Fallback values
    weekDays: dashboardData?.weekDays || [],
    totalSessions: dashboardData?.totalSessions || 0,
    totalRevenue: dashboardData?.totalRevenue || 0,
    averagePerSession: dashboardData?.averagePerSession || 0,
    upcomingSessions: dashboardData?.upcomingSessions || [],
    monthlyChange: dashboardData?.monthlyChange || 0,
    completionRate: dashboardData?.completionRate || 0,
    sessionData: dashboardData?.sessionData || [],
    financialSchedule: dashboardData?.financialSchedule || [],
  };
};
