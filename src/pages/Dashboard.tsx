
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, Users } from "lucide-react";
import LogoRound from "@/components/LogoRound";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WeeklySchedule } from "@/components/WeeklySchedule";

export default function Dashboard() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [monthlyChangePercentage, setMonthlyChangePercentage] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [completionRateChange, setCompletionRateChange] = useState(0);
  const [sessionData, setSessionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função para obter o mês atual e os 3 meses anteriores
  const getRecentMonths = () => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    const recentMonths = [];
    for (let i = 3; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      recentMonths.push(months[monthIndex]);
    }
    
    return recentMonths;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar sessões do profissional logado
        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('id, date, patient_id, notes');

        if (sessionsError) {
          console.error('Erro ao buscar sessões:', sessionsError);
          throw sessionsError;
        }

        // Calcular total de sessões
        setTotalSessions(sessions ? sessions.length : 0);

        // Calcular dados para o gráfico (últimos 4 meses)
        const recentMonths = getRecentMonths();
        const currentDate = new Date();
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

        // Filtrar sessões dos últimos 4 meses
        const recentSessions = sessions ? sessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= fourMonthsAgo && sessionDate <= currentDate;
        }) : [];

        // Agrupar sessões por mês
        const sessionsByMonth = {};
        recentMonths.forEach(month => {
          sessionsByMonth[month] = 0;
        });

        recentSessions.forEach(session => {
          const sessionDate = new Date(session.date);
          const monthIndex = sessionDate.getMonth();
          const monthName = recentMonths.find((_, i) => 
            (currentDate.getMonth() - i + 12) % 12 === monthIndex
          );
          
          if (monthName && sessionsByMonth[monthName] !== undefined) {
            sessionsByMonth[monthName]++;
          }
        });

        // Converter para formato do gráfico
        const chartData = recentMonths.map(month => ({
          name: month,
          sessions: sessionsByMonth[month]
        }));

        setSessionData(chartData);

        // Calcular variação percentual (mês atual vs. mês anterior)
        const currentMonthSessions = sessionsByMonth[recentMonths[3]] || 0;
        const lastMonthSessions = sessionsByMonth[recentMonths[2]] || 0;
        const percentage = lastMonthSessions > 0
          ? Math.round(((currentMonthSessions - lastMonthSessions) / lastMonthSessions) * 100)
          : 0;
        setMonthlyChangePercentage(percentage);

        // Taxa de conclusão (sessões com notas vs. total)
        const sessionsWithNotes = sessions ? sessions.filter(s => s.notes && s.notes.trim() !== '').length : 0;
        const completionRate = sessions && sessions.length > 0
          ? Math.round((sessionsWithNotes / sessions.length) * 100)
          : 0;
        setCompletionRate(completionRate);
        setCompletionRateChange(3); // Placeholder, poderia ser calculado com dados históricos

        // Buscar pacientes para as próximas sessões
        // Primeiro, separar as futuras sessões
        const futureSessions = sessions
          ? sessions
              .filter(session => new Date(session.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
          : [];

        // Extrair IDs dos pacientes das próximas sessões
        const patientIds = futureSessions.map(session => session.patient_id).filter(Boolean);

        console.log("IDs de pacientes encontrados:", patientIds);
        
        if (patientIds.length > 0) {
          // Buscar dados dos pacientes
          const { data: patients, error: patientsError } = await supabase
            .from('patients')
            .select('id, name')
            .in('id', patientIds);

          if (patientsError) {
            console.error('Erro ao buscar pacientes:', patientsError);
            throw patientsError;
          }

          console.log("Pacientes encontrados:", patients);

          // Combinar informações de sessões e pacientes
          const upcomingSessionsWithNames = futureSessions
            .map(session => {
              const patient = patients.find(p => p.id === session.patient_id);
              const sessionDate = new Date(session.date);
              return {
                id: session.id,
                name: patient ? patient.name : 'Paciente não encontrado',
                type: session.notes?.includes('inicial') ? 'Inicial' : 'Regular',
                date: sessionDate.toLocaleDateString('pt-BR'),
                time: sessionDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              };
            });

          setUpcomingSessions(upcomingSessionsWithNames);
          console.log("Sessões processadas:", upcomingSessionsWithNames);
        } else {
          console.log("Nenhum paciente encontrado para as próximas sessões");
          setUpcomingSessions([]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <div className="flex flex-col items-center justify-center w-full mb-6 space-y-4">
        <LogoRound size="lg" className="animate-pulse" />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-primary" />
            <h3 className="text-lg font-semibold">Sessões esta Semana</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {isLoading ? "..." : totalSessions}
          </div>
          <div className={`text-sm ${monthlyChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {monthlyChangePercentage >= 0 ? '+' : ''}{monthlyChangePercentage}% vs. mês anterior
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CalendarDays className="text-primary" />
            <h3 className="text-lg font-semibold">Taxa de Conclusão</h3>
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {isLoading ? "..." : `${completionRate}%`}
          </div>
          <div className="text-sm text-green-600">
            +{completionRateChange}% vs. mês anterior
          </div>
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução de Sessões</h3>
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <p>Carregando dados...</p>
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessionData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#6D28D9"
                  strokeWidth={2}
                  dot={{ fill: "#6D28D9" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
      
      {/* Weekly Schedule Card */}
      <WeeklySchedule isLoading={isLoading} />

      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Sessões</h3>
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <p>Carregando sessões...</p>
          </div>
        ) : upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                    {session.name ? session.name[0] : '?'}
                  </div>
                  <div>
                    <h4 className="font-semibold">{session.name}</h4>
                    <p className="text-sm text-gray-600">Sessão {session.type}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-semibold">{session.date}</p>
                  <p className="text-sm text-gray-600">{session.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Nenhuma sessão agendada para os próximos dias
          </div>
        )}
      </Card>
    </div>
  );
}
