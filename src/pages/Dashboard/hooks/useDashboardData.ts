
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek, subDays } from "date-fns";
import { DashboardData } from "../types/dashboardTypes";
import { getCurrentUserId } from "../services/professionalService";
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
          const today = new Date();
          const startDate = startOfWeek(today, { weekStartsOn: 0 });
          
          setData(prev => ({ 
            ...prev, 
            isLoading: false,
            weekDays: createWeekStructure(startDate)
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
        
        const professionalId = userId;
        
        // Buscar dados com melhor tratamento de erro
        console.log("📊 Iniciando busca de dados...");
        
        // Executar todas as buscas em paralelo com tratamento individual de erro
        const [
          patientsResult,
          anamnesisResult,
          reportsResult,
          sessionsResult,
          financialResult,
          scheduleResult
        ] = await Promise.allSettled([
          getPatientsCount(professionalId),
          getAnamnesisCount(professionalId),
          getReportsCount(professionalId),
          getWeekSessions(professionalId, startDate, endDate),
          getWeekFinancialRecords(professionalId, startDate, endDate),
          getFinancialSchedule(professionalId)
        ]);

        // Extrair dados com fallbacks seguros
        const patientsCount = patientsResult.status === 'fulfilled' ? patientsResult.value : 0;
        const anamnesisCount = anamnesisResult.status === 'fulfilled' ? anamnesisResult.value : 0;
        const reportsCount = reportsResult.status === 'fulfilled' ? reportsResult.value : 0;
        const sessionsData = sessionsResult.status === 'fulfilled' ? sessionsResult.value : [];
        const financialData = financialResult.status === 'fulfilled' ? financialResult.value : [];
        const scheduleData = scheduleResult.status === 'fulfilled' ? scheduleResult.value : [];

        // Log de erros se houver
        if (patientsResult.status === 'rejected') console.error("❌ Erro ao buscar pacientes:", patientsResult.reason);
        if (anamnesisResult.status === 'rejected') console.error("❌ Erro ao buscar anamneses:", anamnesisResult.reason);
        if (reportsResult.status === 'rejected') console.error("❌ Erro ao buscar relatórios:", reportsResult.reason);
        if (sessionsResult.status === 'rejected') console.error("❌ Erro ao buscar sessões:", sessionsResult.reason);
        if (financialResult.status === 'rejected') console.error("❌ Erro ao buscar dados financeiros:", financialResult.reason);
        if (scheduleResult.status === 'rejected') console.error("❌ Erro ao buscar agenda financeira:", scheduleResult.reason);

        console.log("📊 Dados coletados:", {
          pacientes: patientsCount,
          anamneses: anamnesisCount,
          relatórios: reportsCount,
          sessões: sessionsData?.length || 0,
          financeiro: financialData?.length || 0,
          agenda: scheduleData?.length || 0
        });

        // Preparar estrutura da semana
        const weekDays = createWeekStructure(startDate);
        
        // Organizar dados da semana com validação
        if (Array.isArray(sessionsData) && sessionsData.length > 0) {
          organizeSessionsByDay(weekDays, sessionsData);
        }
        
        if (Array.isArray(financialData) && financialData.length > 0) {
          addFinancialDataToDays(weekDays, financialData);
        }

        // Calcular estatísticas
        const stats = calculateStatistics(sessionsData, financialData);

        console.log("✅ Dashboard data prepared successfully");
        console.log(`📊 Resumo final: ${patientsCount} pacientes, ${anamnesisCount} anamneses, ${reportsCount} relatórios, ${sessionsData?.length || 0} sessões`);

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
          financialSchedule: Array.isArray(scheduleData) ? scheduleData : [],
          isLoading: false,
        });

      } catch (error) {
        console.error('❌ Erro crítico ao carregar dados do dashboard:', error);
        
        // Definir valores seguros quando há erro
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        
        setData({
          weekDays: createWeekStructure(startDate),
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
          isLoading: false,
        });

        toast({
          title: "Erro ao carregar dados",
          description: "Alguns dados podem não estar disponíveis. Tente recarregar a página ou verifique sua conexão.",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [toast]);

  return data;
}
