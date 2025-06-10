
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

export type DashboardData = {
  weekDays: DayData[];
  totalSessions: number;
  totalRevenue: number;
  averagePerSession: number;
  upcomingSessions: any[];
  monthlyChange: number;
  completionRate: number;
  sessionData: any[];
  isLoading: boolean;
  error?: string;
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
    isLoading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: undefined }));
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setData(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: "Usuário não encontrado" 
          }));
          return;
        }

        // Get professional profile
        const { data: professional, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (professionalError || !professional) {
          setData(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: "Perfil profissional não encontrado" 
          }));
          return;
        }

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        const monthStartDate = startOfMonth(today);
        const monthEndDate = endOfMonth(today);
        
        // Fetch sessions and financial records in parallel
        const [sessionsResponse, financialResponse] = await Promise.all([
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
            .lte('session_date', format(endDate, "yyyy-MM-dd"))
        ]);

        if (sessionsResponse.error || financialResponse.error) {
          throw new Error("Erro ao carregar dados");
        }

        const sessions = sessionsResponse.data || [];
        const financialRecords = financialResponse.data || [];

        // If no data this week, try to get monthly data for stats
        let monthlyFinancialRecords = [];
        let monthlySessions = [];
        
        if (sessions.length === 0 && financialRecords.length === 0) {
          const [monthSessionsResponse, monthFinancialResponse] = await Promise.all([
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
              .gte('date', format(monthStartDate, "yyyy-MM-dd"))
              .lte('date', format(monthEndDate, "yyyy-MM-dd"))
              .order('date'),

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
              .gte('session_date', format(monthStartDate, "yyyy-MM-dd"))
              .lte('session_date', format(monthEndDate, "yyyy-MM-dd"))
          ]);

          monthlySessions = monthSessionsResponse.data || [];
          monthlyFinancialRecords = monthFinancialResponse.data || [];
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

        // Add financial data to days
        financialRecords.forEach(record => {
          const recordDate = parseISO(record.session_date);
          const dayIndex = weekDays.findIndex(day => 
            isSameDay(day.date, recordDate)
          );
          
          if (dayIndex !== -1) {
            weekDays[dayIndex].total_financial += record.amount;
            
            const sessionIndex = weekDays[dayIndex].sessions.findIndex(session =>
              isSameDay(session.date, recordDate)
            );
            
            if (sessionIndex !== -1) {
              weekDays[dayIndex].sessions[sessionIndex].financial_amount = record.amount;
            }
          }
        });

        // Calculate statistics
        const dataToUse = sessions.length > 0 ? sessions : monthlySessions;
        const financialToUse = financialRecords.length > 0 ? financialRecords : monthlyFinancialRecords;
        
        const totalSessions = dataToUse.length;
        const totalRevenue = financialToUse.reduce((sum, record) => sum + record.amount, 0);
        const averagePerSession = totalSessions > 0 ? totalRevenue / totalSessions : 0;
        const sessionsWithNotes = dataToUse.filter(s => s.notes && s.notes.trim() !== '').length;
        const completionRate = totalSessions > 0 ? Math.round((sessionsWithNotes / totalSessions) * 100) : 0;

        // Get upcoming sessions
        const futureSessions = sessions
          .filter(session => new Date(session.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5)
          .map(session => ({
            id: session.id,
            name: session.patients?.name || 'Paciente não encontrado',
            type: session.notes?.includes('inicial') ? 'Inicial' : 'Regular',
            date: new Date(session.date).toLocaleDateString('pt-BR'),
            time: new Date(session.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          }));

        // Calculate monthly chart data
        const chartSessions = monthlySessions.length > 0 ? monthlySessions : dataToUse;
        const recentMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const currentDate = new Date();
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        const sessionsByMonth: Record<string, number> = {};
        recentMonths.slice(-4).forEach(month => {
          sessionsByMonth[month] = 0;
        });

        chartSessions.forEach(session => {
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

        setData({
          weekDays,
          totalSessions,
          totalRevenue,
          averagePerSession,
          upcomingSessions: futureSessions,
          monthlyChange: 5, // This could be calculated based on historical data
          completionRate,
          sessionData,
          isLoading: false,
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        setData(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorMessage 
        }));
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [toast]);

  return data;
}
