import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  Calendar,
  Download,
  Share2,
  Filter,
  BarChart3
} from 'lucide-react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityData {
  id: string;
  title: string;
  category: string;
  completions: number;
  views: number;
  favorites: number;
  rating: number;
  duration: number;
  completionTime: number; // average time to complete
}

interface UsageStats {
  totalActivities: number;
  totalCompletions: number;
  totalViews: number;
  averageRating: number;
  mostPopularCategory: string;
  activeUsers: number;
  completionRate: number;
}

interface TimeSeriesData {
  date: string;
  completions: number;
  views: number;
  newUsers: number;
}

interface ActivityAnalyticsProps {
  activityData: ActivityData[];
  usageStats: UsageStats;
  timeSeriesData: TimeSeriesData[];
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  onDateRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
}

export const ActivityAnalytics: React.FC<ActivityAnalyticsProps> = ({
  activityData,
  usageStats,
  timeSeriesData,
  dateRange,
  onDateRangeChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Process data for charts
  const categoryData = activityData.reduce((acc, activity) => {
    const category = activity.category;
    if (!acc[category]) {
      acc[category] = {
        name: category,
        completions: 0,
        views: 0,
        activities: 0,
        rating: 0
      };
    }
    acc[category].completions += activity.completions;
    acc[category].views += activity.views;
    acc[category].activities += 1;
    acc[category].rating += activity.rating;
    return acc;
  }, {} as Record<string, any>);

  const categoryChartData = Object.values(categoryData).map((cat: any) => ({
    ...cat,
    rating: cat.rating / cat.activities
  }));

  const topActivities = [...activityData]
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 10);

  const difficultyData = activityData.reduce((acc, activity) => {
    // Simulate difficulty based on completion time
    let difficulty = 'Fácil';
    if (activity.completionTime > 30) difficulty = 'Médio';
    if (activity.completionTime > 60) difficulty = 'Difícil';
    
    if (!acc[difficulty]) {
      acc[difficulty] = { name: difficulty, value: 0, color: '' };
    }
    acc[difficulty].value += 1;
    return acc;
  }, {} as Record<string, any>);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
  Object.values(difficultyData).forEach((item: any, index) => {
    item.color = colors[index % colors.length];
  });

  const exportData = () => {
    const csvContent = [
      ['Atividade', 'Categoria', 'Conclusões', 'Visualizações', 'Favoritos', 'Avaliação'],
      ...activityData.map(activity => [
        activity.title,
        activity.category,
        activity.completions,
        activity.views,
        activity.favorites,
        activity.rating
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics de Atividades
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onDateRangeChange(range as any)}
                    className="px-3"
                  >
                    {range === 'week' && 'Semana'}
                    {range === 'month' && 'Mês'}
                    {range === 'quarter' && 'Trimestre'}
                    {range === 'year' && 'Ano'}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Target className="h-4 w-4 text-teal-700 dark:text-teal-300" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageStats.totalActivities}</p>
                <p className="text-xs text-muted-foreground">Total de Atividades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageStats.totalCompletions.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Conclusões</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-4 w-4 text-teal-700 dark:text-teal-300" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usageStats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Usuários Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(usageStats.completionRate * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição por Dificuldade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.values(difficultyData)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.values(difficultyData).map((entry: any, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engajamento ao Longo do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completions" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Conclusões"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Visualizações"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completions" fill="#8884d8" name="Conclusões" />
                  <Bar dataKey="views" fill="#82ca9d" name="Visualizações" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 10 Atividades Mais Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{activity.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Categoria: {activity.category}</span>
                        <span>⭐ {activity.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{activity.completions}</div>
                      <div className="text-xs text-muted-foreground">conclusões</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendências de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Conclusões"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Visualizações"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    name="Novos Usuários"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};