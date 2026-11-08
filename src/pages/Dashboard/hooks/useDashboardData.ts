
import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "../types/dashboardTypes";
import { getWeekSessions } from "../services/sessionsService";
import { getWeekFinancialRecords, getFinancialSchedule } from "../services/financialService";
import { createWeekStructure, organizeSessionsByDay, addFinancialDataToDays } from "../utils/weekDataProcessor";
import { calculateStatistics } from "../utils/statisticsCalculator";
import { usePatientsCount, useAnamnesisCount, useReportsCount, useInterventionsCount } from "@/hooks/useDashboardCounts";
import { endOfWeek, format, startOfWeek } from "date-fns";

export const useDashboardData = (userId: string | null = null, identityReady = true): DashboardData => {
  const patients = usePatientsCount(userId);
  const anamnesis = useAnamnesisCount(userId);
  const reports = useReportsCount(userId);
  const interventions = useInterventionsCount(userId);
  const weekKey = format(startOfWeek(new Date(), { weekStartsOn: 0 }), "yyyy-MM-dd");

  const weekly = useQuery({
    queryKey: ["dashboard-data", userId, weekKey],
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) throw new Error("Profissional não autenticado");
      const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
      const endDate = endOfWeek(startDate, { weekStartsOn: 0 });

      // Erro na consulta clínica nunca deve ser tratado como uma semana vazia.
      const [sessionsData, financialData, financialSchedule] = await Promise.all([
        getWeekSessions(userId, startDate, endDate),
        getWeekFinancialRecords(userId, startDate, endDate).catch(() => []),
        getFinancialSchedule(userId).catch(() => [])
      ]);

      const weekStructure = createWeekStructure(startDate);
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
    refetchOnWindowFocus: true,
  });

  const countQueries = { patients, anamnesis, interventions, reports };
  const metricLoading = Object.fromEntries(Object.entries(countQueries).map(([name, query]) => [name, !identityReady || (!!userId && query.isPending)])) as DashboardData["metricLoading"];
  const metricErrors = Object.fromEntries(Object.entries(countQueries).map(([name, query]) => [name, query.isError])) as DashboardData["metricErrors"];
  const updatedAt = Math.max(weekly.dataUpdatedAt, ...Object.values(countQueries).map(query => query.dataUpdatedAt));

  return {
    totalPatients: patients.data ?? 0,
    totalAnamnesis: anamnesis.data ?? 0,
    totalReports: reports.data ?? 0,
    totalInterventions: interventions.data ?? 0,
    isLoading: !identityReady || (Boolean(userId) && weekly.isPending),
    isError: weekly.isError,
    hasAnyError: weekly.isError || Object.values(countQueries).some(query => query.isError),
    isRefreshing: weekly.isFetching || Object.values(countQueries).some(query => query.isFetching),
    updatedAt,
    metricLoading,
    metricErrors,
    refresh: () => {
      if (!userId) return;
      void Promise.all([weekly.refetch(), ...Object.values(countQueries).map(query => query.refetch())]);
    },
    weekDays: weekly.data?.weekDays || [],
    totalSessions: weekly.data?.totalSessions || 0,
    totalRevenue: weekly.data?.totalRevenue || 0,
    averagePerSession: weekly.data?.averagePerSession || 0,
    upcomingSessions: weekly.data?.upcomingSessions || [],
    monthlyChange: weekly.data?.monthlyChange || 0,
    completionRate: weekly.data?.completionRate || 0,
    sessionData: weekly.data?.sessionData || [],
    financialSchedule: weekly.data?.financialSchedule || [],
  };
};
