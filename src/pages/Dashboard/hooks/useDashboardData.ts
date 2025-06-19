
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

        // First try to get professional profile
        let professionalId = null;
        const { data: professional, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (professional) {
          professionalId = professional.id;
          console.log("👨‍⚕️ Profissional encontrado:", professionalId);
        } else {
          console.log("⚠️ Perfil profissional não encontrado, usando user_id diretamente...");
          professionalId = user.id;
        }

        // Get current week dates
        const today = new Date();
        const startDate = startOfWeek(today, { weekStartsOn: 0 });
        const endDate = endOfWeek(today, { weekStartsOn: 0 });
        
        console.log("📅 Buscando dados da semana:", format(startDate, "yyyy-MM-dd"), "até", format(endDate, "yyyy-MM-dd"));
        
        // Query patients with better error handling
        console.log("🔍 Buscando pacientes...");
        const { data: patientsData, error: patientsError, count: totalPatients } = await supabase
          .from("patients")
          .select('id', { count: 'exact', head: true })
          .eq('professional_id', professionalId);

        if (patientsError) {
          console.error("❌ Erro ao buscar pacientes:", patientsError);
        } else {
          console.log("✅ Total de pacientes encontrados:", totalPatients);
        }

        // Query anamnesis with corrected professional_id field
        console.log("🔍 Buscando anamneses...");
        const { data: anamnesisData, error: anamnesisError, count: totalAnamnesis } = await supabase
          .from("anamnesis")
          .select('id', { count: 'exact', head: true })
          .eq('professional_id', professionalId);

        if (anamnesisError) {
          console.error("❌ Erro ao buscar anamneses:", anamnesisError);
          console.log("🔄 Tentando busca alternativa de anamneses usando user_id...");
          
          // Fallback: try with user_id if professional_id fails
          const { data: anamnesisDataFallback, error: anamnesisErrorFallback, count: totalAnamnesisAlt } = await supabase
            .from("anamnesis")
            .select('id', { count: 'exact', head: true })
            .eq('professional_id', user.id);
          
          if (anamnesisErrorFallback) {
            console.error("❌ Erro na busca alternativa de anamneses:", anamnesisErrorFallback);
          } else {
            console.log("✅ Total de anamneses encontradas (busca alternativa):", totalAnamnesisAlt);
          }
        } else {
          console.log("✅ Total de anamneses encontradas:", totalAnamnesis);
        }

        // Query reports with better error handling
        console.log("🔍 Buscando relatórios...");
        const { data: reportsData, error: reportsError, count: totalReports } = await supabase
          .from("reports")
          .select('id', { count: 'exact', head: true })
          .eq('professional_id', professionalId);

        if (reportsError) {
          console.error("❌ Erro ao buscar relatórios:", reportsError);
        } else {
          console.log("✅ Total de relatórios encontrados:", totalReports);
        }

        // Query sessions for this week
        console.log("🔍 Buscando sessões da semana...");
        const { data: sessions, error: sessionsError } = await supabase
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
          .eq('patients.professional_id', professionalId)
          .gte('date', format(startDate, "yyyy-MM-dd"))
          .lte('date', format(endDate, "yyyy-MM-dd"))
          .order('date');

        if (sessionsError) {
          console.error("❌ Erro ao buscar sessões:", sessionsError);
        } else {
          console.log("✅ Sessões da semana encontradas:", sessions?.length || 0);
        }

        // Query financial records for this week
        console.log("🔍 Buscando registros financeiros da semana...");
        const { data: financialRecords, error: financialError } = await supabase
          .from("financial_records")
          .select(`
            id, 
            amount, 
            session_date, 
            description,
            professional_id
          `)
          .eq('professional_id', professionalId)
          .gte('session_date', format(startDate, "yyyy-MM-dd"))
          .lte('session_date', format(endDate, "yyyy-MM-dd"));

        if (financialError) {
          console.error("❌ Erro ao buscar registros financeiros:", financialError);
        } else {
          console.log("✅ Registros financeiros da semana encontrados:", financialRecords?.length || 0);
        }

        // Query financial schedule (last 30 days)
        console.log("🔍 Buscando agenda financeira...");
        const { data: financialScheduleData, error: financialScheduleError } = await supabase
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
          .eq('professional_id', professionalId)
          .gte('session_date', format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))
          .order('session_date', { ascending: false })
          .limit(10);

        if (financialScheduleError) {
          console.error("❌ Erro ao buscar agenda financeira:", financialScheduleError);
        } else {
          console.log("✅ Agenda financeira encontrada:", financialScheduleData?.length || 0);
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
        if (sessions && sessions.length > 0) {
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
        if (financialRecords && financialRecords.length > 0) {
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

        // Calculate totals and statistics
        const totalSessions = sessions?.length || 0;
        const totalRevenue = financialRecords?.reduce((sum, record) => sum + record.amount, 0) || 0;
        const averagePerSession = totalSessions > 0 ? totalRevenue / totalSessions : 0;

        console.log("📊 Estatísticas calculadas:", {
          totalSessions,
          totalRevenue,
          averagePerSession,
          totalPatients: totalPatients || 0,
          totalAnamnesis: totalAnamnesis || 0,
          totalReports: totalReports || 0
        });

        // Calculate completion rate
        const sessionsWithNotes = sessions?.filter(s => s.notes && s.notes.trim() !== '').length || 0;
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

        // Calculate chart data for recent months
        const recentMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const currentDate = new Date();
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        const sessionsByMonth = {};
        recentMonths.slice(-4).forEach(month => {
          sessionsByMonth[month] = 0;
        });

        sessions?.forEach(session => {
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
