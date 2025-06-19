
export function calculateStatistics(sessions: any[], financialRecords: any[]) {
  const totalSessions = sessions?.length || 0;
  const totalRevenue = financialRecords?.reduce((sum, record) => sum + record.amount, 0) || 0;
  const averagePerSession = totalSessions > 0 ? totalRevenue / totalSessions : 0;

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

  console.log("📊 Estatísticas calculadas:", {
    totalSessions,
    totalRevenue,
    averagePerSession,
    completionRate
  });

  return {
    totalSessions,
    totalRevenue,
    averagePerSession,
    completionRate,
    futureSessions,
    sessionData
  };
}
