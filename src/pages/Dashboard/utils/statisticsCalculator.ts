
export function calculateStatistics(sessions: any[], financialRecords: any[]) {
  // Garantir que os parâmetros sejam arrays válidos
  const validSessions = Array.isArray(sessions) ? sessions : [];
  const validFinancialRecords = Array.isArray(financialRecords) ? financialRecords : [];

  console.log("📊 Calculando estatísticas com:", {
    sessões: validSessions.length,
    registrosFinanceiros: validFinancialRecords.length
  });

  const totalSessions = validSessions.length;
  const totalRevenue = validFinancialRecords.reduce((sum, record) => {
    const amount = parseFloat(record?.amount) || 0;
    return sum + amount;
  }, 0);
  
  const averagePerSession = totalSessions > 0 ? totalRevenue / totalSessions : 0;

  // Calcular taxa de conclusão baseada em sessões com notas
  const sessionsWithNotes = validSessions.filter(s => 
    s?.notes && typeof s.notes === 'string' && s.notes.trim() !== ''
  ).length;
  const completionRate = totalSessions > 0 ? Math.round((sessionsWithNotes / totalSessions) * 100) : 0;

  // Obter sessões futuras com validação
  const currentDate = new Date();
  const futureSessions = validSessions
    .filter(session => {
      try {
        return session?.date && new Date(session.date) >= currentDate;
      } catch (error) {
        console.warn("⚠️ Erro ao processar data da sessão:", session?.date);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } catch (error) {
        console.warn("⚠️ Erro ao ordenar sessões:", error);
        return 0;
      }
    })
    .slice(0, 5)
    .map(session => {
      try {
        const sessionDate = new Date(session.date);
        return {
          id: session.id || 'unknown',
          name: session.patients?.name || 'Paciente não encontrado',
          type: (session.notes?.includes('inicial') || session.notes?.includes('Inicial')) ? 'Inicial' : 'Regular',
          date: sessionDate.toLocaleDateString('pt-BR'),
          time: sessionDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
      } catch (error) {
        console.warn("⚠️ Erro ao formatar sessão futura:", session, error);
        return {
          id: session.id || 'unknown',
          name: 'Paciente não encontrado',
          type: 'Regular',
          date: 'Data inválida',
          time: '--:--'
        };
      }
    });

  // Calcular dados do gráfico para os últimos meses
  const recentMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const currentDate2 = new Date();
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  const sessionsByMonth: { [key: string]: number } = {};
  recentMonths.slice(-4).forEach(month => {
    sessionsByMonth[month] = 0;
  });

  validSessions.forEach(session => {
    try {
      if (!session?.date) return;
      
      const sessionDate = new Date(session.date);
      if (isNaN(sessionDate.getTime())) return;
      
      if (sessionDate >= fourMonthsAgo && sessionDate <= currentDate2) {
        const monthIndex = sessionDate.getMonth();
        const monthName = recentMonths[monthIndex];
        if (sessionsByMonth[monthName] !== undefined) {
          sessionsByMonth[monthName]++;
        }
      }
    } catch (error) {
      console.warn("⚠️ Erro ao processar sessão para gráfico:", session, error);
    }
  });

  const sessionData = recentMonths.slice(-4).map(month => ({
    name: month,
    sessions: sessionsByMonth[month] || 0
  }));

  const result = {
    totalSessions,
    totalRevenue,
    averagePerSession,
    completionRate,
    futureSessions,
    sessionData
  };

  console.log("✅ Estatísticas calculadas:", result);
  return result;
}
