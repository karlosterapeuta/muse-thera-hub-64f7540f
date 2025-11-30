import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, StatusLog, UserActivityStats } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Activity, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface ActivityHistoryTabProps {
  user: Profile;
}

interface UsageChartData {
  date: string;
  logins: number;
  pageViews: number;
}

export function ActivityHistoryTab({ user }: ActivityHistoryTabProps) {
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [activityStats, setActivityStats] = useState<UserActivityStats | null>(null);
  const [usageChartData, setUsageChartData] = useState<UsageChartData[]>([]);
  const [totalActions, setTotalActions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
  }, [user.id]);

  const loadActivityData = async () => {
    setIsLoading(true);
    try {
      // Load status change history
      const { data: logs, error: logsError } = await supabase
        .from('user_status_logs')
        .select(`
          id,
          user_id,
          changed_by,
          previous_status,
          new_status,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      if (logs && logs.length > 0) {
        const changerIds = [...new Set(logs.map(log => log.changed_by))];
        const { data: changers } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', changerIds);

        const logsWithNames = logs.map(log => {
          const changer = changers?.find(c => c.id === log.changed_by);
          return {
            ...log,
            changer_name: changer?.name || 'Usuário desconhecido'
          };
        });
        
        setStatusLogs(logsWithNames);
      }

      // Load activity logs for stats
      const { data: activityLogs, error: activityError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (activityError) throw activityError;

      if (activityLogs && activityLogs.length > 0) {
        // Calculate stats
        const lastLoginLog = activityLogs.find(log => log.activity_type === 'login');
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const monthlyLogins = activityLogs.filter(
          log => log.activity_type === 'login' && new Date(log.created_at) >= startOfMonth
        ).length;

        // Count page views
        const pageViews = activityLogs.filter(log => log.activity_type === 'page_view');
        const pageCounts: Record<string, number> = {};
        pageViews.forEach(log => {
          const activityData = typeof log.activity_data === 'object' && log.activity_data !== null 
            ? log.activity_data as Record<string, any>
            : {};
          const pageName = activityData.pageName || activityData.page || 'Unknown';
          pageCounts[pageName] = (pageCounts[pageName] || 0) + 1;
        });

        const topPages = Object.entries(pageCounts)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setActivityStats({
          lastLogin: lastLoginLog?.created_at || null,
          monthlyLogins,
          topPages
        });

        // Calculate total actions
        setTotalActions(activityLogs.length);

        // Build chart data for last 14 days
        const last14Days: UsageChartData[] = [];
        const today = new Date();
        
        for (let i = 13; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const dayLogins = activityLogs.filter(log => {
            const logDate = new Date(log.created_at);
            return log.activity_type === 'login' && logDate >= date && logDate < nextDate;
          }).length;
          
          const dayPageViews = activityLogs.filter(log => {
            const logDate = new Date(log.created_at);
            return log.activity_type === 'page_view' && logDate >= date && logDate < nextDate;
          }).length;
          
          last14Days.push({
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            logins: dayLogins,
            pageViews: dayPageViews
          });
        }
        
        setUsageChartData(last14Days);
      } else {
        setActivityStats({
          lastLogin: null,
          monthlyLogins: 0,
          topPages: []
        });
        setUsageChartData([]);
        setTotalActions(0);
      }
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    logins: {
      label: "Logins",
      color: "hsl(var(--primary))",
    },
    pageViews: {
      label: "Páginas",
      color: "hsl(var(--secondary))",
    },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Último Login</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {activityStats?.lastLogin 
                ? new Date(activityStats.lastLogin).toLocaleDateString('pt-BR')
                : 'Nunca'}
            </div>
            <p className="text-xs text-muted-foreground">
              {activityStats?.lastLogin 
                ? new Date(activityStats.lastLogin).toLocaleTimeString('pt-BR')
                : 'Sem registros'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Logins no Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{activityStats?.monthlyLogins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Páginas Únicas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {activityStats?.topPages.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Páginas visitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total de Ações</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalActions}</div>
            <p className="text-xs text-muted-foreground">
              Logins + Page Views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Uso da Plataforma
          </CardTitle>
          <CardDescription>Atividade nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          {usageChartData.some(d => d.logins > 0 || d.pageViews > 0) ? (
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageChartData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="logins" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                    name="Logins"
                  />
                  <Bar 
                    dataKey="pageViews" 
                    fill="hsl(var(--secondary))" 
                    radius={[4, 4, 0, 0]} 
                    name="Páginas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Sem dados de atividade nos últimos 14 dias</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Pages */}
      {activityStats && activityStats.topPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Páginas Mais Acessadas</CardTitle>
            <CardDescription>Páginas que o usuário mais visitou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activityStats.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1">{page.page}</span>
                  <Badge variant="secondary" className="ml-2">{page.count} visitas</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Change History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Mudanças de Status</CardTitle>
          <CardDescription>Registro de todas as alterações de status do usuário</CardDescription>
        </CardHeader>
        <CardContent>
          {statusLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma mudança de status registrada
            </p>
          ) : (
            <div className="space-y-4">
              {statusLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 border-b pb-4 last:border-0">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={log.previous_status === 'active' ? 'default' : 'secondary'}>
                        {log.previous_status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">→</span>
                      <Badge variant={log.new_status === 'active' ? 'default' : 'secondary'}>
                        {log.new_status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Alterado por <span className="font-medium">{log.changer_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
