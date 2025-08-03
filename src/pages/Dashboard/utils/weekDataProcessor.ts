
import { format, addDays, isSameDay, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayData, DashboardSession } from "../types/dashboardTypes";

export function createWeekStructure(startDate: Date): DayData[] {
  if (!startDate || !isValid(startDate)) {
    console.error("❌ Data de início inválida para estrutura da semana");
    const today = new Date();
    return createWeekStructure(today);
  }

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
  if (!weekDays || weekDays.length === 0) {
    console.log("⚠️ Estrutura da semana não disponível para organizar sessões");
    return;
  }

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    console.log("📊 Nenhuma sessão para organizar");
    return;
  }

  console.log("📊 Organizando", sessions.length, "sessões por dia");

  sessions.forEach((session, index) => {
    try {
      if (!session || !session.date) {
        console.warn(`⚠️ Sessão ${index} sem data:`, session);
        return;
      }

      const sessionDate = parseISO(session.date);
      if (!isValid(sessionDate)) {
        console.warn(`⚠️ Data de sessão ${index} inválida:`, session.date);
        return;
      }

      const dayIndex = weekDays.findIndex(day => 
        isSameDay(day.date, sessionDate)
      );
      
      if (dayIndex !== -1) {
        const sessionData: DashboardSession = {
          id: session.id || `session-${index}`,
          date: sessionDate,
          patient_name: session.patients?.name || "Paciente não encontrado",
          formatted_time: format(sessionDate, "HH:mm", { locale: ptBR }),
          formatted_date: format(sessionDate, "dd/MM", { locale: ptBR }),
          notes: session.notes || null,
          financial_amount: undefined
        };

        weekDays[dayIndex].sessions.push(sessionData);
        weekDays[dayIndex].session_count++;
        
        console.log(`📅 Sessão adicionada ao dia ${weekDays[dayIndex].day_name}: ${sessionData.patient_name}`);
      } else {
        console.log(`⚠️ Sessão fora do período da semana: ${session.date}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar sessão ${index}:`, session, error);
    }
  });

  console.log("✅ Organização por dia concluída");
}

export function addFinancialDataToDays(weekDays: DayData[], financialRecords: any[]): void {
  if (!weekDays || weekDays.length === 0) {
    console.log("⚠️ Estrutura da semana não disponível para dados financeiros");
    return;
  }

  if (!financialRecords || !Array.isArray(financialRecords) || financialRecords.length === 0) {
    console.log("💰 Nenhum dado financeiro para adicionar");
    return;
  }

  console.log("💰 Adicionando", financialRecords.length, "registros financeiros");

  financialRecords.forEach((record, index) => {
    try {
      if (!record || !record.session_date) {
        console.warn(`⚠️ Registro financeiro ${index} sem data:`, record);
        return;
      }

      const recordDate = parseISO(record.session_date);
      if (!isValid(recordDate)) {
        console.warn(`⚠️ Data de registro financeiro ${index} inválida:`, record.session_date);
        return;
      }

      const dayIndex = weekDays.findIndex(day => 
        isSameDay(day.date, recordDate)
      );
      
      if (dayIndex !== -1) {
        const amount = parseFloat(record.amount) || 0;
        weekDays[dayIndex].total_financial += amount;
        
        // Tentar associar com sessão existente na mesma data
        const sessionIndex = weekDays[dayIndex].sessions.findIndex(session =>
          isSameDay(session.date, recordDate)
        );
        
        if (sessionIndex !== -1) {
          weekDays[dayIndex].sessions[sessionIndex].financial_amount = amount;
          console.log(`💰 Valor R$ ${amount} adicionado à sessão de ${weekDays[dayIndex].sessions[sessionIndex].patient_name}`);
        } else {
          console.log(`💰 Registro financeiro sem sessão correspondente: R$ ${amount} em ${format(recordDate, "dd/MM")}`);
        }
      } else {
        console.log(`⚠️ Registro financeiro fora do período da semana: ${record.session_date}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar registro financeiro ${index}:`, record, error);
    }
  });

  console.log("✅ Dados financeiros adicionados com sucesso");
}
