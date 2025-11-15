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
          user_roles (role)
        `)
        .order("created_at", { ascending: true });

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

      return {
        newUsersByMonth,
        roleDistribution,
        statusByMonth,
        retentionByMonth,
      };
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
