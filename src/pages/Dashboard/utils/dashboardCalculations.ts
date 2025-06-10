
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayData, DashboardSession, SupabaseSession, FinancialRecord } from "../types/dashboard";

export function createWeekStructure(startDate: Date): DayData[] {
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
  return weekDays;
}

export function organizeSessions(sessions: SupabaseSession[], weekDays: DayData[]): void {
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

export function addFinancialData(financialRecords: FinancialRecord[], weekDays: DayData[]): void {
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
}

export function calculateStatistics(
  sessions: SupabaseSession[], 
  financialRecords: FinancialRecord[]
) {
  const totalSessions = sessions.length;
  const totalRevenue = financialRecords.reduce((sum, record) => sum + record.amount, 0);
  const averagePerSession = totalSessions > 0 ? totalRevenue / totalSessions : 0;
  const sessionsWithNotes = sessions.filter(s => s.notes && s.notes.trim() !== '').length;
  const completionRate = totalSessions > 0 ? Math.round((sessionsWithNotes / totalSessions) * 100) : 0;

  return {
    totalSessions,
    totalRevenue,
    averagePerSession,
    completionRate
  };
}

export function prepareUpcomingSessions(sessions: SupabaseSession[]) {
  return sessions
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
}

export function generateChartData(sessions: SupabaseSession[]) {
  const recentMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const currentDate = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  const sessionsByMonth: Record<string, number> = {};
  recentMonths.slice(-4).forEach(month => {
    sessionsByMonth[month] = 0;
  });

  sessions.forEach(session => {
    const sessionDate = new Date(session.date);
    if (sessionDate >= fourMonthsAgo && sessionDate <= currentDate) {
      const monthIndex = sessionDate.getMonth();
      const monthName = recentMonths[monthIndex];
      if (sessionsByMonth[monthName] !== undefined) {
        sessionsByMonth[monthName]++;
      }
    }
  });

  return recentMonths.slice(-4).map(month => ({
    name: month,
    sessions: sessionsByMonth[month]
  }));
}
