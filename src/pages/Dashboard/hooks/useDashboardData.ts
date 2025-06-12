
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export type DashboardSession = {
  id: string;
  date: Date;
  patient_name: string;
  formatted_time: string;
  formatted_date: string;
  financial_amount?: number;
  notes?: string;
};

export type DayData = {
  date: Date;
  formatted_date: string;
  day_name: string;
  sessions: DashboardSession[];
  total_financial: number;
  session_count: number;
};

export type FinancialAgendaItem = {
  id: string;
  amount: number;
  session_date: string;
  description?: string;
  patient_name?: string;
  clinic_name?: string;
  formatted_date: string;
  formatted_amount: string;
};

export type DashboardData = {
  weekDays: DayData[];
  totalSessions: number;
  totalRevenue: number;
  averagePerSession: number;
  upcomingSessions: any[];
  monthlyChange: number;
  completionRate: number;
  sessionData: any[];
  totalPatients: number;
  totalAnamnesis: number;
  totalReports: number;
  financialSchedule: FinancialAgendaItem[];
  isLoading: boolean;
};

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
        console.log("🔍 Iniciando busca de dados do dashboard...");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("❌ Usuário não encontrado");
          setData(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        console.log("👤 Usuário encontrado:", user.id);

        // Get professional profile
        const { data: professional, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (professionalError || !professional) {
          console.log("❌ Perfil profissional não encontrado:", professionalError);
          setData(prev => ({ ...prev, isLoading: false }));
          return;
        }

        console.log("👨‍⚕️ Profissional encontrado:", professional.id);

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        // Also get last month for fallback data
        const monthStartDate = startOfMonth(today);
        const monthEndDate = endOfMonth(today);
        
        console.log("📅 Buscando dados da semana:", format(startDate, "yyyy-MM-dd"), "até", format(endDate, "yyyy-MM-dd"));
        
        // Parallel queries for better performance
        const [
          sessionsResult,
          financialRecordsResult,
          patientsResult,
          anamnesisResult,
          reportsResult,
          financialScheduleResult
        ] = await Promise.all([
          // Fetch sessions for this week
          supabase
            .from("sessions")
            .select(`
              id, 
              date, 
              notes,
              patient_id, 
              patients!inner (
                id,
                name,
                professional_id
              )
            `)
            .eq('patients.professional_id', professional.id)
            .gte('date', format(startDate, "yyyy-MM-dd"))
            .lte('date', format(endDate, "yyyy-MM-dd"))
            .order('date'),

          // Fetch financial records for this week
          supabase
            .from("financial_records")
            .select(`
              id, 
              amount, 
              session_date, 
              description,
              professional_id
            `)
            .eq('professional_id', professional.id)
            .gte('session_date', format(startDate, "yyyy-MM-dd"))
            .lte('session_date', format(endDate, "yyyy-MM-dd")),

          // Count total patients
          supabase
            .from("patients")
            .select('id', { count: 'exact', head: true })
            .eq('professional_id', professional.id),

          // Count total anamnesis
          supabase
            .from("anamnesis")
            .select('id', { count: 'exact', head: true })
            .eq('professional_id', professional.id),

          // Count total reports
          supabase
            .from("reports")
            .select('id', { count: 'exact', head: true })
            .eq('professional_id', professional.id),

          // Get financial schedule (last 30 days)
          supabase
            .from("financial_records")
            .select(`
              id,
              amount,
              session_date,
              description,
              professional_id,
              patients:patient_id (name),
              clinics:clinic_id (name)
            `)
            .eq('professional_id', professional.id)
            .gte('session_date', format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))
            .order('session_date', { ascending: false })
            .limit(10)
        ]);

        const { data: sessions, error: sessionsError } = sessionsResult;
        const { data: financialRecords, error: financialError } = financialRecordsResult;
        const { count: totalPatients } = patientsResult;
        const { count: totalAnamnesis } = anamnesisResult;
        const { count: totalReports } = reportsResult;
        const { data: financialScheduleData, error: financialScheduleError } = financialScheduleResult;

        console.log("📊 Dados coletados:", {
          sessions: sessions?.length || 0,
          financialRecords: financialRecords?.length || 0,
          totalPatients: totalPatients || 0,
          totalAnamnesis: totalAnamnesis || 0,
          totalReports: totalReports || 0,
          financialSchedule: financialScheduleData?.length || 0
        });

        // If no data this week, try to get monthly data for stats
        let monthlyFinancialRecords = [];
        let monthlySessions = [];
        
        if ((!sessions || sessions.length === 0) && (!financialRecords || financialRecords.length === 0)) {
          console.log("🔍 Nenhum dado da semana, buscando dados do mês...");
          
          const { data: monthSessions } = await supabase
            .from("sessions")
            .select(`
              id, 
              date, 
              notes,
              patient_id, 
              patients!inner (
                id,
                name,
                professional_id
              )
            `)
            .eq('patients.professional_id', professional.id)
            .gte('date', format(monthStartDate, "yyyy-MM-dd"))
            .lte('date', format(monthEndDate, "yyyy-MM-dd"))
            .order('date');

          const { data: monthFinancial } = await supabase
            .from("financial_records")
            .select(`
              id, 
              amount, 
              session_date, 
              description,
              professional_id
            `)
            .eq('professional_id', professional.id)
            .gte('session_date', format(monthStartDate, "yyyy-MM-dd"))
            .lte('session_date', format(monthEndDate, "yyyy-MM-dd"));

          monthlySessions = monthSessions || [];
          monthlyFinancialRecords = monthFinancial || [];
          
          console.log("📊 Dados do mês - Sessões:", monthlySessions.length, "Financeiro:", monthlyFinancialRecords.length);
        }

        if (sessionsError || financialError) {
          console.error("❌ Erro ao buscar dados:", sessionsError || financialError);
          return;
        }

        // Prepare week structure
        const weekDays: DayData[] = [];
        for (let i = 0; i < 7; i++) {
          const date = addDays(startDate, i);
          weekDays.push({
            date,
            formatted_date: format(date, "dd/MM", { locale: ptBR }),
            day_name: format(date, "EEEE", { locale: ptBR }),
            sessions: [],
            total_financial: 0,
            session_count: 0
          });
        }

        // Organize sessions by day
        if (sessions) {
          sessions.forEach(session => {
            const sessionDate = parseISO(session.date);
            const dayIndex = weekDays.findIndex(day => 
              isSameDay(day.date, sessionDate)
            );
            
            if (dayIndex !== -1) {
              weekDays[dayIndex].sessions.push({
                id: session.id,
                date: sessionDate,
                patient_name: session.patients?.name || "Paciente não encontrado",
                formatted_time: format(sessionDate, "HH:mm", { locale: ptBR }),
                formatted_date: format(sessionDate, "dd/MM", { locale: ptBR }),
                notes: session.notes
              });
              weekDays[dayIndex].session_count++;
            }
          });
        }

        // Add financial data to days
        if (financialRecords) {
          financialRecords.forEach(record => {
            const recordDate = parseISO(record.session_date);
            const dayIndex = weekDays.findIndex(day => 
              isSameDay(day.date, recordDate)
            );
            
            if (dayIndex !== -1) {
              weekDays[dayIndex].total_financial += record.amount;
              
              // Try to match with existing session
              const sessionIndex = weekDays[dayIndex].sessions.findIndex(session =>
                isSameDay(session.date, recordDate)
              );
              
              if (sessionIndex !== -1) {
                weekDays[dayIndex].sessions[sessionIndex].financial_amount = record.amount;
              }
            }
          });
        }

        // Calculate totals and statistics (use monthly data if weekly is empty)
        const dataToUse = (sessions && sessions.length > 0) ? sessions : monthlySessions;
        const financialToUse = (financialRecords && financialRecords.length > 0) ? financialRecords : monthlyFinancialRecords;
        
        const totalSessions = dataToUse?.length || 0;
        const totalRevenue = financialToUse?.reduce((sum, record) => sum + record.amount, 0) || 0;
        const averagePerSession = totalSessions > 0 ? totalRevenue / totalSessions : 0;

        console.log("📊 Estatísticas calculadas:", {
          totalSessions,
          totalRevenue,
          averagePerSession,
          usingMonthlyData: dataToUse === monthlySessions
        });

        // Calculate completion rate
        const sessionsWithNotes = dataToUse?.filter(s => s.notes && s.notes.trim() !== '').length || 0;
        const completionRate = totalSessions > 0 ? Math.round((sessionsWithNotes / totalSessions) * 100) : 0;

        // Get upcoming sessions
        const futureSessions = sessions
          ?.filter(session => new Date(session.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5)
          .map(session => ({
            id: session.id,
            name: session.patients?.name || 'Paciente não encontrado',
            type: session.notes?.includes('inicial') ? 'Inicial' : 'Regular',
            date: new Date(session.date).toLocaleDateString('pt-BR'),
            time: new Date(session.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          })) || [];

        // Calculate monthly chart data (use broader dataset)
        const chartSessions = monthlySessions.length > 0 ? monthlySessions : dataToUse;
        const recentMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const currentDate = new Date();
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        const sessionsByMonth = {};
        recentMonths.slice(-4).forEach(month => {
          sessionsByMonth[month] = 0;
        });

        chartSessions?.forEach(session => {
          const sessionDate = new Date(session.date);
          if (sessionDate >= fourMonthsAgo && sessionDate <= currentDate) {
            const monthIndex = sessionDate.getMonth();
            const monthName = recentMonths[monthIndex];
            if (sessionsByMonth[monthName] !== undefined) {
              sessionsByMonth[monthName]++;
            }
          }
        });

        const sessionData = recentMonths.slice(-4).map(month => ({
          name: month,
          sessions: sessionsByMonth[month]
        }));

        // Prepare financial schedule
        const financialSchedule: FinancialAgendaItem[] = financialScheduleData?.map(record => ({
          id: record.id,
          amount: record.amount,
          session_date: record.session_date,
          description: record.description,
          patient_name: record.patients?.name || 'Não informado',
          clinic_name: record.clinics?.name || 'Não informado',
          formatted_date: format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR }),
          formatted_amount: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(record.amount)
        })) || [];

        console.log("✅ Dashboard data prepared successfully");

        setData({
          weekDays,
          totalSessions,
          totalRevenue,
          averagePerSession,
          upcomingSessions: futureSessions,
          monthlyChange: 5, // Placeholder
          completionRate,
          sessionData,
          totalPatients: totalPatients || 0,
          totalAnamnesis: totalAnamnesis || 0,
          totalReports: totalReports || 0,
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
