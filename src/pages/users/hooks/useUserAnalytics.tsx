import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format } from "date-fns";

export function useUserAnalytics() {
  return useQuery({
    queryKey: ["user-analytics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!roles || roles.role !== "admin") {
        throw new Error("Not authorized");
      }

      // Get all users with roles
      const { data: users, error } = await supabase
        .from("profiles")
        .select(`
          id,
          created_at,
          status,
          expires_at,
          plan_start_date,
          user_roles (role)
        `)
        .order("created_at", { ascending: true });

      // Helper function to calculate plan type
      const getPlanType = (profile: { expires_at?: string | null; plan_start_date?: string | null }): string => {
        if (!profile.expires_at || !profile.plan_start_date) {
          return 'unlimited';
        }
        
        const start = new Date(profile.plan_start_date);
        const end = new Date(profile.expires_at);
        const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 25 && diffDays <= 35) return '30-days';
        if (diffDays >= 175 && diffDays <= 195) return '6-months';
        if (diffDays >= 355 && diffDays <= 380) return '12-months';
        
        return 'other';
      };

      if (error) throw error;

      // Calculate new users per month (last 6 months)
      const newUsersByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const count = users?.filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt >= monthStart && createdAt < monthEnd;
        }).length || 0;

        newUsersByMonth.push({
          month: format(monthDate, "MMM"),
          users: count,
        });
      }

      // Calculate role distribution
      const adminCount = users?.filter(u => u.user_roles?.[0]?.role === "admin").length || 0;
      const professionalCount = users?.filter(u => u.user_roles?.[0]?.role === "professional").length || 0;

      const roleDistribution = [
        { name: "Administradores", value: adminCount },
        { name: "Profissionais", value: professionalCount },
      ];

      // Calculate active vs inactive by month (last 6 months)
      const statusByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const monthUsers = users?.filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt < monthEnd;
        }) || [];

        const active = monthUsers.filter(u => u.status === "active").length;
        const inactive = monthUsers.filter(u => u.status === "inactive").length;

        statusByMonth.push({
          month: format(monthDate, "MMM"),
          ativos: active,
          inativos: inactive,
        });
      }

      // Calculate retention rate (last 6 months)
      const retentionByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(new Date(), i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const totalUsers = users?.filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt < monthEnd;
        }).length || 0;

        const activeUsers = users?.filter(u => {
          const createdAt = new Date(u.created_at);
          return createdAt < monthEnd && u.status === "active";
        }).length || 0;

        const retention = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

        retentionByMonth.push({
          month: format(monthDate, "MMM"),
          taxa: Math.round(retention),
        });
      }

      // Calculate plan type distribution
      const planTypeDistribution = [
        { name: "30 dias", value: users?.filter(u => getPlanType(u) === '30-days').length || 0 },
        { name: "6 meses", value: users?.filter(u => getPlanType(u) === '6-months').length || 0 },
        { name: "12 meses", value: users?.filter(u => getPlanType(u) === '12-months').length || 0 },
        { name: "Ilimitado", value: users?.filter(u => getPlanType(u) === 'unlimited').length || 0 },
      ].filter(item => item.value > 0);

      return {
        newUsersByMonth,
        roleDistribution,
        statusByMonth,
        retentionByMonth,
        planTypeDistribution,
      };
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
