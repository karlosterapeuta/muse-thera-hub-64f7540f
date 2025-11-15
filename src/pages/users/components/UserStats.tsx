
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield, Infinity, Clock, Calendar } from "lucide-react";
import { Profile } from "../types";

interface UserStatsProps {
  users: Profile[];
}

export function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  const adminUsers = users.filter(user => user.user_roles?.[0]?.role === 'admin').length;

  // Calculate plan statistics
  const now = new Date();
  const unlimitedPlans = users.filter(user => !user.expires_at).length;
  const expiredPlans = users.filter(user => {
    if (!user.expires_at) return false;
    return new Date(user.expires_at) < now;
  }).length;
  const expiringSoon7Days = users.filter(user => {
    if (!user.expires_at) return false;
    const expiration = new Date(user.expires_at);
    const daysUntil = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 7;
  }).length;
  const expiringSoon30Days = users.filter(user => {
    if (!user.expires_at) return false;
    const expiration = new Date(user.expires_at);
    const daysUntil = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 7 && daysUntil <= 30;
  }).length;

  const stats = [
    {
      title: "Total de Usuários",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Usuários Ativos",
      value: activeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Usuários Inativos",
      value: inactiveUsers,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Administradores",
      value: adminUsers,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Planos Ilimitados",
      value: unlimitedPlans,
      icon: Infinity,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Expirando em 7 dias",
      value: expiringSoon7Days,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Expirando em 30 dias",
      value: expiringSoon30Days,
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Planos Expirados",
      value: expiredPlans,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
