
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
            isLoading: false,
            weekDays: createWeekStructure(startOfWeek(new Date(), { weekStartsOn: 0 }))
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
        console.log("📊 Iniciando busca de dados...");
        
        const [
          patientsCount,
          anamnesisCount,
          reportsCount,
          sessionsData,
          financialData,
          scheduleData
        ] = await Promise.all([
          getPatientsCount(professionalId).catch(err => {
            console.error("❌ Erro ao buscar pacientes:", err);
            return 0;
          }),
          getAnamnesisCount(professionalId).catch(err => {
            console.error("❌ Erro ao buscar anamneses:", err);
            return 0;
          }),
          getReportsCount(professionalId).catch(err => {
            console.error("❌ Erro ao buscar relatórios:", err);
            return 0;
          }),
          getWeekSessions(professionalId, startDate, endDate).catch(err => {
            console.error("❌ Erro ao buscar sessões:", err);
            return [];
          }),
          getWeekFinancialRecords(professionalId, startDate, endDate).catch(err => {
            console.error("❌ Erro ao buscar dados financeiros:", err);
            return [];
          }),
          getFinancialSchedule(professionalId).catch(err => {
            console.error("❌ Erro ao buscar agenda financeira:", err);
            return [];
          })
        ]);

        console.log("📊 Dados coletados:", {
          pacientes: patientsCount,
          anamneses: anamnesisCount,
          relatórios: reportsCount,
          sessões: sessionsData?.length || 0,
          financeiro: financialData?.length || 0,
          agenda: scheduleData?.length || 0
        });

        // Prepare week structure and organize data
        const weekDays = createWeekStructure(startDate);
        
        if (sessionsData && sessionsData.length > 0) {
          organizeSessionsByDay(weekDays, sessionsData);
        }
        
        if (financialData && financialData.length > 0) {
          addFinancialDataToDays(weekDays, financialData);
        }

        // Calculate statistics
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
          financialSchedule: scheduleData || [],
          isLoading: false,
        });

      } catch (error) {
        console.error('❌ Erro crítico ao carregar dados do dashboard:', error);
        
        // Set safe defaults when error occurs
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
          description: "Ocorreu um erro ao carregar os dados do dashboard. Tente recarregar a página.",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [toast]);

  return data;
}
