
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays, Users, AlertCircle } from "lucide-react";
import LogoRound from "@/components/LogoRound";
import { Card } from "@/components/ui/card";
import { useDashboardData } from "./Dashboard/hooks/useDashboardData";
import { DashboardStats } from "./Dashboard/components/DashboardStats";
import { UnifiedWeeklySchedule } from "./Dashboard/components/UnifiedWeeklySchedule";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Dashboard() {
  const dashboardData = useDashboardData();

  if (dashboardData.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6">
          <EmptyState
            icon={AlertCircle}
            title="Erro ao carregar dados"
            description={dashboardData.error}
            action={{
              label: "Tentar novamente",
              onClick: () => window.location.reload()
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6 space-y-8 animate-fadeIn">
          {/* Hero Section */}
          <div className="text-center space-y-6">
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
          <DashboardStats
            totalSessions={dashboardData.totalSessions}
            totalRevenue={dashboardData.totalRevenue}
            averagePerSession={dashboardData.averagePerSession}
            completionRate={dashboardData.completionRate}
            monthlyChange={dashboardData.monthlyChange}
            isLoading={false}
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
            </div>
          </Card>
          
          {/* Unified Weekly Schedule */}
          <UnifiedWeeklySchedule 
            weekDays={dashboardData.weekDays}
            isLoading={false}
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
              {dashboardData.upcomingSessions.length > 0 ? (
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
                <EmptyState
                  icon={Users}
                  title="Nenhuma sessão agendada"
                  description="Suas próximas sessões aparecerão aqui quando forem agendadas"
                  className="border-none shadow-none"
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
