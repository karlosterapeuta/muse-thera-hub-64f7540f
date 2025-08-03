
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, Clock } from "lucide-react";
import LogoRound from "@/components/LogoRound";
import { Card } from "@/components/ui/card";
import { useDashboardData } from "./hooks/useDashboardData";
import { DashboardStats } from "./components/DashboardStats";
import { UnifiedWeeklySchedule } from "./components/UnifiedWeeklySchedule";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const dashboardData = useDashboardData();
  const { data: professional, isLoading: isLoadingProfessional } = useProfessionalData();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current date time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 space-y-8 animate-fadeIn">
        {/* Custom Header Section */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* System Information (Left Side) */}
              <div className="flex items-center gap-4">
                <LogoRound size="md" className="animate-pulse-gentle" />
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sistema MuseTera
                  </h1>
                  <p className="text-md text-gray-600">
                    Plataforma de Musicoterapia
                  </p>
                </div>
              </div>

              {/* Professional Information (Right Side) */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-right order-2 md:order-1">
                  <div className="flex flex-col items-end">
                    <h2 className="font-semibold text-lg text-gray-800">
                      {isLoadingProfessional ? "Carregando..." : professional?.name}
                    </h2>
                    <p className="text-gray-600">
                      {professional?.specialty || "Musicoterapeuta"}
                    </p>
                    {professional?.license_number && (
                      <p className="text-sm text-gray-500">
                        Registro: {professional.license_number}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{formatDate(currentDateTime)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatTime(currentDateTime)}</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <ProfessionalAvatar size="lg" editable={true} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <DashboardStats
          totalPatients={dashboardData.totalPatients}
          totalAnamnesis={dashboardData.totalAnamnesis}
          totalReports={dashboardData.totalReports}
          totalSessions={dashboardData.totalSessions}
          isLoading={dashboardData.isLoading}
        />

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
            {dashboardData.isLoading ? (
              <div className="h-[300px] md:h-[350px] flex items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="text-gray-500">Carregando dados...</p>
                </div>
              </div>
            ) : (
              <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.sessionData}>
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
        
        {/* Unified Weekly Schedule */}
        <UnifiedWeeklySchedule 
          weekDays={dashboardData.weekDays}
          isLoading={dashboardData.isLoading}
        />

        {/* Financial Agenda */}
        <FinancialAgenda 
          financialSchedule={dashboardData.financialSchedule}
          isLoading={dashboardData.isLoading}
        />

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
            {dashboardData.isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="space-y-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="text-gray-500">Carregando sessões...</p>
                </div>
              </div>
            ) : dashboardData.upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingSessions.map((session, index) => (
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
