
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek } from "date-fns";
import { DashboardData } from "../types/dashboardTypes";
import { getProfessionalId } from "../services/professionalService";
import { getPatientsCount, getAnamnesisCount, getReportsCount } from "../services/countsService";
import { getWeekSessions } from "../services/sessionsService";
import { getWeekFinancialRecords, getFinancialSchedule } from "../services/financialService";
import { createWeekStructure, organizeSessionsByDay, addFinancialDataToDays } from "../utils/weekDataProcessor";
import { calculateStatistics } from "../utils/statisticsCalculator";

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    weekDays: [],
    totalSessions: 0,
    totalRevenue: 0,
    averagePerSession: 0,
    upcomingSessions: [],
    monthlyChange: 0,
    completionRate: 0,
    sessionData: [],
    totalPatients: 0,
    totalAnamnesis: 0,
    totalReports: 0,
    financialSchedule: [],
    isLoading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const professionalId = await getProfessionalId();
        if (!professionalId) {
          setData(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        console.log("📅 Buscando dados da semana:", startDate.toISOString().split('T')[0], "até", endDate.toISOString().split('T')[0]);
        
        // Fetch all data in parallel
        const [
          totalPatients,
          totalAnamnesis,
          totalReports,
          sessions,
          financialRecords,
          financialSchedule
        ] = await Promise.all([
          getPatientsCount(professionalId),
          getAnamnesisCount(professionalId),
          getReportsCount(professionalId),
          getWeekSessions(professionalId, startDate, endDate),
          getWeekFinancialRecords(professionalId, startDate, endDate),
          getFinancialSchedule(professionalId)
        ]);

        // Prepare week structure and organize data
        const weekDays = createWeekStructure(startDate);
        organizeSessionsByDay(weekDays, sessions);
        addFinancialDataToDays(weekDays, financialRecords);

        // Calculate statistics
        const stats = calculateStatistics(sessions, financialRecords);

        console.log("✅ Dashboard data prepared successfully");

        setData({
          weekDays,
          totalSessions: stats.totalSessions,
          totalRevenue: stats.totalRevenue,
          averagePerSession: stats.averagePerSession,
          upcomingSessions: stats.futureSessions,
          monthlyChange: 5, // Placeholder
          completionRate: stats.completionRate,
          sessionData: stats.sessionData,
          totalPatients,
          totalAnamnesis,
          totalReports,
          financialSchedule,
          isLoading: false,
        });

      } catch (error) {
        console.error('❌ Erro ao carregar dados do dashboard:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, [toast]);

  return data;
}
