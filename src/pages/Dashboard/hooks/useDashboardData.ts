
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek } from "date-fns";
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

        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        console.log("📅 Buscando dados da semana atual:", startDate.toISOString().split('T')[0], "até", endDate.toISOString().split('T')[0]);
        
        const professionalId = userId;
        
        console.log("📊 Iniciando busca de dados com tratamento de erro aprimorado...");
        
        // Executar todas as buscas em paralelo com tratamento individual de erro
        const [
          patientsResult,
          anamnesisResult,
          reportsResult,
          sessionsResult,
          financialResult,
          scheduleResult
        ] = await Promise.allSettled([
          getPatientsCount(professionalId).catch(err => {
            console.error("Erro em pacientes:", err);
            return 0;
          }),
          getAnamnesisCount(professionalId).catch(err => {
            console.error("Erro em anamneses:", err);
            return 0;
          }),
          getReportsCount(professionalId).catch(err => {
            console.error("Erro em relatórios:", err);
            return 0;
          }),
          getWeekSessions(professionalId, startDate, endDate).catch(err => {
            console.error("Erro em sessões:", err);
            return [];
          }),
          getWeekFinancialRecords(professionalId, startDate, endDate).catch(err => {
            console.error("Erro em dados financeiros:", err);
            return [];
          }),
          getFinancialSchedule(professionalId).catch(err => {
            console.error("Erro em agenda financeira:", err);
            return [];
          })
        ]);

        // Extrair dados com fallbacks seguros e logs detalhados
        const patientsCount = patientsResult.status === 'fulfilled' ? patientsResult.value : 0;
        const anamnesisCount = anamnesisResult.status === 'fulfilled' ? anamnesisResult.value : 0;
        const reportsCount = reportsResult.status === 'fulfilled' ? reportsResult.value : 0;
        const sessionsData = sessionsResult.status === 'fulfilled' ? sessionsResult.value : [];
        const financialData = financialResult.status === 'fulfilled' ? financialResult.value : [];
        const scheduleData = scheduleResult.status === 'fulfilled' ? scheduleResult.value : [];

        // Log detalhado de resultados
        console.log("📊 Resultados das buscas:", {
          pacientes: { status: patientsResult.status, valor: patientsCount },
          anamneses: { status: anamnesisResult.status, valor: anamnesisCount },
          relatórios: { status: reportsResult.status, valor: reportsCount },
          sessões: { status: sessionsResult.status, quantidade: Array.isArray(sessionsData) ? sessionsData.length : 0 },
          financeiro: { status: financialResult.status, quantidade: Array.isArray(financialData) ? financialData.length : 0 },
          agenda: { status: scheduleResult.status, quantidade: Array.isArray(scheduleData) ? scheduleData.length : 0 }
        });

        // Log de erros específicos
        [patientsResult, anamnesisResult, reportsResult, sessionsResult, financialResult, scheduleResult]
          .forEach((result, index) => {
            const names = ['pacientes', 'anamneses', 'relatórios', 'sessões', 'financeiro', 'agenda'];
            if (result.status === 'rejected') {
              console.error(`❌ Erro ao buscar ${names[index]}:`, result.reason);
            }
          });

        // Preparar estrutura da semana com validação
        let weekDays: any[] = [];
        try {
          weekDays = createWeekStructure(startDate);
          console.log("✅ Estrutura da semana criada:", weekDays.length, "dias");
        } catch (error) {
          console.error("❌ Erro ao criar estrutura da semana:", error);
          weekDays = [];
        }
        
        // Organizar dados da semana com validação aprimorada
        if (Array.isArray(sessionsData) && sessionsData.length > 0 && weekDays.length > 0) {
          try {
            organizeSessionsByDay(weekDays, sessionsData);
            console.log("✅ Sessões organizadas por dia");
          } catch (error) {
            console.error("❌ Erro ao organizar sessões:", error);
          }
        } else {
          console.log("ℹ️ Sem sessões para organizar ou estrutura inválida");
        }
        
        if (Array.isArray(financialData) && financialData.length > 0 && weekDays.length > 0) {
          try {
            addFinancialDataToDays(weekDays, financialData);
            console.log("✅ Dados financeiros adicionados");
          } catch (error) {
            console.error("❌ Erro ao adicionar dados financeiros:", error);
          }
        } else {
          console.log("ℹ️ Sem dados financeiros para adicionar ou estrutura inválida");
        }

        // Calcular estatísticas com validação
        let stats;
        try {
          stats = calculateStatistics(sessionsData, financialData);
          console.log("✅ Estatísticas calculadas:", stats);
        } catch (error) {
          console.error("❌ Erro ao calcular estatísticas:", error);
          stats = {
            totalSessions: 0,
            totalRevenue: 0,
            averagePerSession: 0,
            completionRate: 0,
            futureSessions: [],
            sessionData: []
          };
        }

        console.log("✅ Dashboard data prepared successfully");
        console.log(`📊 Resumo final: ${patientsCount} pacientes, ${anamnesisCount} anamneses, ${reportsCount} relatórios, ${Array.isArray(sessionsData) ? sessionsData.length : 0} sessões`);

        setData({
          weekDays: weekDays || [],
          totalSessions: stats.totalSessions || 0,
          totalRevenue: stats.totalRevenue || 0,
          averagePerSession: stats.averagePerSession || 0,
          upcomingSessions: stats.futureSessions || [],
          monthlyChange: 5, // Placeholder
          completionRate: stats.completionRate || 0,
          sessionData: stats.sessionData || [],
          totalPatients: patientsCount || 0,
          totalAnamnesis: anamnesisCount || 0,
          totalReports: reportsCount || 0,
          financialSchedule: Array.isArray(scheduleData) ? scheduleData : [],
          isLoading: false,
        });

      } catch (error) {
        console.error('❌ Erro crítico ao carregar dados do dashboard:', error);
        
        // Definir valores seguros quando há erro crítico
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
          description: "Alguns dados podem não estar disponíveis. Tente recarregar a página.",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [toast]);

  return data;
}
