
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SessionChartData {
  name: string;
  sessions: number;
}

interface EnhancedSessionChartProps {
  sessionData: SessionChartData[];
  isLoading: boolean;
}

export function EnhancedSessionChart({ sessionData, isLoading }: EnhancedSessionChartProps) {
  const { t } = useTranslation('financial');
  
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.sessionChart.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="space-y-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">{t('dashboard.sessionChart.loading')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = sessionData && Array.isArray(sessionData) && sessionData.length > 0;
  const totalSessions = hasData ? sessionData.reduce((sum, item) => sum + (item.sessions || 0), 0) : 0;

  // Generate fallback data if no real data exists
  const chartData = hasData && totalSessions > 0 ? sessionData : [
    { name: "Jan", sessions: 0 },
    { name: "Fev", sessions: 0 },
    { name: "Mar", sessions: 0 },
    { name: "Abr", sessions: 0 }
  ];

  return (
    <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.sessionChart.title')}
          </div>
          {totalSessions === 0 && (
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-1" />
              {t('dashboard.sessionChart.firstSession')}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalSessions === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full p-6 mb-6">
              <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('dashboard.sessionChart.firstSession')}</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md leading-relaxed">
              {t('dashboard.sessionChart.firstSessionDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.sessionChart.scheduleFirst')}
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {t('dashboard.upcomingSessions.scheduleFirst')}
              </Button>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="sessions" 
                fill="url(#sessionGradient)" 
                radius={[4, 4, 0, 0]}
                name={t('dashboard.sessionChart.sessionsLabel')}
              />
              <defs>
                <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
