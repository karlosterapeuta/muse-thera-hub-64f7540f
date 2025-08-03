
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
        console.log("🚀 Iniciando carregamento dos dados do dashboard...");
        
        const professionalId = await getProfessionalId();
        if (!professionalId) {
          console.log("⚠️ Nenhum ID profissional encontrado - usuário pode não estar logado");
          // Still show the dashboard but with zero values
          setData(prev => ({ 
            ...prev, 
            isLoading: false 
          }));
          
          toast({
            title: "Atenção",
            description: "Faça login para visualizar seus dados do dashboard.",
            variant: "default",
          });
          return;
        }

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        console.log("📅 Buscando dados da semana:", startDate.toISOString().split('T')[0], "até", endDate.toISOString().split('T')[0]);
        
        // Fetch all data in parallel with error handling for each
        const [
          totalPatients,
          totalAnamnesis,
          totalReports,
          sessions,
          financialRecords,
          financialSchedule
        ] = await Promise.allSettled([
          getPatientsCount(professionalId),
          getAnamnesisCount(professionalId),
          getReportsCount(professionalId),
          getWeekSessions(professionalId, startDate, endDate),
          getWeekFinancialRecords(professionalId, startDate, endDate),
          getFinancialSchedule(professionalId)
        ]);

        // Extract values, defaulting to 0 or empty array on error
        const patientsCount = totalPatients.status === 'fulfilled' ? totalPatients.value : 0;
        const anamnesisCount = totalAnamnesis.status === 'fulfilled' ? totalAnamnesis.value : 0;
        const reportsCount = totalReports.status === 'fulfilled' ? totalReports.value : 0;
        const sessionsData = sessions.status === 'fulfilled' ? sessions.value : [];
        const financialData = financialRecords.status === 'fulfilled' ? financialRecords.value : [];
        const scheduleData = financialSchedule.status === 'fulfilled' ? financialSchedule.value : [];

        // Log any errors but don't stop execution
        [totalPatients, totalAnamnesis, totalReports, sessions, financialRecords, financialSchedule].forEach((result, index) => {
          if (result.status === 'rejected') {
            const labels = ['pacientes', 'anamneses', 'relatórios', 'sessões', 'registros financeiros', 'agenda financeira'];
            console.warn(`⚠️ Erro ao buscar ${labels[index]}:`, result.reason);
          }
        });

        // Prepare week structure and organize data
        const weekDays = createWeekStructure(startDate);
        organizeSessionsByDay(weekDays, sessionsData);
        addFinancialDataToDays(weekDays, financialData);

        // Calculate statistics
        const stats = calculateStatistics(sessionsData, financialData);

        console.log("✅ Dashboard data prepared successfully");
        console.log(`📊 Totais: ${patientsCount} pacientes, ${anamnesisCount} anamneses, ${reportsCount} relatórios, ${sessionsData.length} sessões`);

        setData({
          weekDays,
          totalSessions: stats.totalSessions,
          totalRevenue: stats.totalRevenue,
          averagePerSession: stats.averagePerSession,
          upcomingSessions: stats.futureSessions,
          monthlyChange: 5, // Placeholder
          completionRate: stats.completionRate,
          sessionData: stats.sessionData,
          totalPatients: patientsCount,
          totalAnamnesis: anamnesisCount,
          totalReports: reportsCount,
          financialSchedule: scheduleData,
          isLoading: false,
        });

      } catch (error) {
        console.error('❌ Erro crítico ao carregar dados do dashboard:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar os dados do dashboard. Tente recarregar a página.",
          variant: "destructive",
        });
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, [toast]);

  return data;
}
