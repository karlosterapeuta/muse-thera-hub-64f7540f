
import { useQuery } from "@tanstack/react-query";
import { DashboardData, DayData, DashboardSession, FinancialAgendaItem } from "../types/dashboardTypes";
import { getCurrentUserId } from "../services/professionalService";
import { getWeekSessions, SessionData } from "../services/sessionsService";
import { getWeekFinancialRecords, getFinancialSchedule } from "../services/financialService";
import { createWeekStructure, organizeSessionsByDay, addFinancialDataToDays, calculateStatistics } from "../utils/weekDataProcessor";
import { usePatientsCount, useAnamnesisCount, useReportsCount } from "@/hooks/useDashboardCounts";

export const useDashboardData = (): DashboardData => {
  // Use individual hooks for counts to leverage React Query caching
  const { data: totalPatients = 0, isLoading: isLoadingPatients } = usePatientsCount();
  const { data: totalAnamnesis = 0, isLoading: isLoadingAnamnesis } = useAnamnesisCount();
  const { data: totalReports = 0, isLoading: isLoadingReports } = useReportsCount();

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
      const weekStructure = createWeekStructure();
      const organizedSessions = organizeSessionsByDay(sessionsData, weekStructure);
      const daysWithFinancialData = addFinancialDataToDays(organizedSessions, financialData);
      const statistics = calculateStatistics(daysWithFinancialData);

      // Mock data for upcoming sessions and session chart
      const mockUpcomingSessions = [
        { id: "1", patientName: "Maria Silva", time: "10:00 - 11:00" },
        { id: "2", patientName: "João Pereira", time: "14:00 - 15:00" },
        { id: "3", patientName: "Ana Souza", time: "16:00 - 17:00" },
      ];

      const mockSessionData = [
        { date: "Seg", sessions: statistics.totalSessions > 0 ? Math.ceil(statistics.totalSessions / 7) : 0 },
        { date: "Ter", sessions: statistics.totalSessions > 0 ? Math.ceil(statistics.totalSessions / 7) : 0 },
        { date: "Qua", sessions: statistics.totalSessions > 0 ? Math.ceil(statistics.totalSessions / 7) : 0 },
        { date: "Qui", sessions: statistics.totalSessions > 0 ? Math.ceil(statistics.totalSessions / 7) : 0 },
        { date: "Sex", sessions: statistics.totalSessions > 0 ? Math.ceil(statistics.totalSessions / 7) : 0 },
        { date: "Sab", sessions: 0 },
        { date: "Dom", sessions: 0 },
      ];

      return {
        weekDays: daysWithFinancialData,
        totalSessions: statistics.totalSessions,
        totalRevenue: statistics.totalRevenue,
        averagePerSession: statistics.averagePerSession,
        upcomingSessions: mockUpcomingSessions,
        monthlyChange: 5.2,
        completionRate: 87,
        sessionData: mockSessionData,
        financialSchedule: financialSchedule || [],
      };
    },
    retry: 1,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingPatients || isLoadingAnamnesis || isLoadingReports || isLoadingDashboard;

  return {
    ...dashboardData,
    totalPatients,
    totalAnamnesis, 
    totalReports,
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
