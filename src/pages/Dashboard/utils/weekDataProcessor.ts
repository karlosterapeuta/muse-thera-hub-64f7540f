
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayData, DashboardSession } from "../types/dashboardTypes";

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

export function organizeSessionsByDay(weekDays: DayData[], sessions: any[]): void {
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
}

export function addFinancialDataToDays(weekDays: DayData[], financialRecords: any[]): void {
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
}
