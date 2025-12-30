import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserAnalytics } from "../hooks/useUserAnalytics";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b"];

export function UserAnalyticsDashboard() {
  const { data: analytics, isLoading } = useUserAnalytics();

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analytics de Usuários</CardTitle>
          <CardDescription>Carregando estatísticas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Analytics de Usuários</CardTitle>
        <CardDescription>Estatísticas e métricas de usuários da plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Users by Month */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Novos Usuários por Mês</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.newUsersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Usuários"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Role Distribution */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Distribuição de Funções</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {analytics.roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Type Distribution */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Distribuição por Tipo de Plano</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.planTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {analytics.planTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Active vs Inactive by Month */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Usuários Ativos vs Inativos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.statusByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ativos" fill="hsl(var(--primary))" name="Ativos" />
                <Bar dataKey="inativos" fill="hsl(var(--muted))" name="Inativos" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Retention Rate */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Taxa de Retenção (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.retentionByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="taxa"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  name="Retenção"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
