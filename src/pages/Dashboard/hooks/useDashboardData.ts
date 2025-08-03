
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek } from "date-fns";
import { DashboardData } from "../types/dashboardTypes";
import { getProfessionalId, getCurrentUserId } from "../services/professionalService";
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
        
        const userId = await getCurrentUserId();
        console.log("🎯 User ID obtido:", userId);
        
        if (!userId) {
          console.log("⚠️ Nenhum usuário logado encontrado");
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

        // Usar data atual para buscar dados da semana atual
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        console.log("📅 Buscando dados da semana atual:", startDate.toISOString().split('T')[0], "até", endDate.toISOString().split('T')[0]);
        
        // Usar o userId diretamente como professionalId para compatibilidade
        const professionalId = userId;
        
        // Buscar dados com logs detalhados
        console.log("📊 Iniciando busca de pacientes...");
        const patientsCount = await getPatientsCount(professionalId);
        console.log("📊 Pacientes encontrados:", patientsCount);
        
        console.log("📊 Iniciando busca de anamneses...");
        const anamnesisCount = await getAnamnesisCount(professionalId);
        console.log("📊 Anamneses encontradas:", anamnesisCount);
        
        console.log("📊 Iniciando busca de relatórios...");
        const reportsCount = await getReportsCount(professionalId);
        console.log("📊 Relatórios encontrados:", reportsCount);
        
        console.log("📊 Iniciando busca de sessões...");
        const sessionsData = await getWeekSessions(professionalId, startDate, endDate);
        console.log("📊 Sessões encontradas:", sessionsData?.length || 0);
        
        console.log("📊 Iniciando busca de dados financeiros...");
        const financialData = await getWeekFinancialRecords(professionalId, startDate, endDate);
        console.log("📊 Dados financeiros encontrados:", financialData?.length || 0);
        
        console.log("📊 Iniciando busca de agenda financeira...");
        const scheduleData = await getFinancialSchedule(professionalId);
        console.log("📊 Agenda financeira encontrada:", scheduleData?.length || 0);

        // Prepare week structure and organize data
        const weekDays = createWeekStructure(startDate);
        organizeSessionsByDay(weekDays, sessionsData);
        addFinancialDataToDays(weekDays, financialData);

        // Calculate statistics
        const stats = calculateStatistics(sessionsData, financialData);

        console.log("✅ Dashboard data prepared successfully");
        console.log(`📊 Resumo final: ${patientsCount} pacientes, ${anamnesisCount} anamneses, ${reportsCount} relatórios, ${sessionsData.length} sessões`);

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
