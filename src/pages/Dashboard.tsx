import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, Users, TrendingUp, Activity, LogOut } from "lucide-react";
import LogoRound from "@/components/LogoRound";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WeeklySchedule } from "@/components/WeeklySchedule";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [monthlyChangePercentage, setMonthlyChangePercentage] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [completionRateChange, setCompletionRateChange] = useState(0);
  const [sessionData, setSessionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      console.log("Iniciando logout...");
      
      // Clear any local storage data first
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase with scope local to remove session completely
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) {
        console.error("Erro no logout:", error);
        toast({
          title: "Erro ao fazer logout",
          description: "Ocorreu um erro ao tentar desconectar.",
          variant: "destructive",
        });
      } else {
        console.log("Logout realizado com sucesso");
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
      }
      
      // Force a complete page reload to login to ensure all state is cleared
      window.location.href = "/login";
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      
      // Even if there's an error, force redirect to login
      window.location.href = "/login";
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 space-y-8 animate-fadeIn">
        {/* Hero Section */}
        <div className="text-center space-y-6 relative">
          {/* Logout Button - Only visible on desktop */}
          <div className="hidden md:block absolute top-0 right-0">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full"></div>
            <LogoRound size="lg" className="relative animate-pulse-gentle" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bem-vindo ao seu painel de controle musicoterapêutico
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white hover:shadow-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 md:p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white/90">Sessões esta Semana</h3>
                  <p className="text-blue-100 text-sm">Atendimentos realizados</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold">
                  {isLoading ? (
                    <div className="w-16 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                  ) : (
                    totalSessions
                  )}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  monthlyChangePercentage >= 0 
                    ? 'bg-green-500/20 text-green-100' 
                    : 'bg-red-500/20 text-red-100'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {monthlyChangePercentage >= 0 ? '+' : ''}{monthlyChangePercentage}% vs. mês anterior
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:shadow-2xl transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-6 md:p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white/90">Taxa de Conclusão</h3>
                  <p className="text-purple-100 text-sm">Sessões finalizadas</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold">
                  {isLoading ? (
                    <div className="w-20 h-12 bg-white/20 rounded-lg animate-pulse"></div>
                  ) : (
                    `${completionRate}%`
                  )}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-100">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{completionRateChange}% vs. mês anterior
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
          <div className="p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Evolução de Sessões
              </h3>
            </div>
            {isLoading ? (
              <div className="h-[300px] md:h-[350px] flex items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="text-gray-500">Carregando dados...</p>
                </div>
              </div>
            ) : (
              <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="url(#gradient)"
                      strokeWidth={3}
                      dot={{ fill: "#6D28D9", r: 6 }}
                      activeDot={{ r: 8, fill: "#6D28D9" }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6D28D9" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>
        
        {/* Weekly Schedule */}
        <WeeklySchedule isLoading={isLoading} />

        {/* Upcoming Sessions */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
          <div className="p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Próximas Sessões
              </h3>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="space-y-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="text-gray-500">Carregando sessões...</p>
                </div>
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="group flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                          {session.name ? session.name[0] : '?'}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{session.name}</h4>
                        <p className="text-gray-600">Sessão {session.type}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="font-bold text-gray-800 text-lg">{session.date}</p>
                      <p className="text-gray-600">{session.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma sessão agendada</h4>
                <p className="text-gray-500">Suas próximas sessões aparecerão aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
