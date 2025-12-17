import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreatorDashboardData {
  creator: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    pix_key: string;
    pix_key_type: string;
    bio: string | null;
    commission_percentage: number;
    is_active: boolean;
    created_at: string;
  } | null;
  courses: Array<{
    id: string;
    title: string;
    description: string | null;
    price_cents: number;
    thumbnail_url: string | null;
    is_published: boolean;
    sales_count: number;
    revenue: number;
  }>;
  sales: Array<{
    id: string;
    course_id: string;
    course_title: string;
    buyer_name: string | null;
    buyer_email: string | null;
    amount_cents: number;
    creator_amount_cents: number;
    payment_status: string;
    paid_at: string | null;
    created_at: string;
  }>;
  stats: {
    totalRevenue: number;
    pendingRevenue: number;
    confirmedSales: number;
    pendingSales: number;
    totalStudents: number;
    totalCourses: number;
  };
  monthlySales: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
}

export function useCreatorDashboard(creatorId: string | undefined) {
  return useQuery({
    queryKey: ["creator-dashboard", creatorId],
    queryFn: async (): Promise<CreatorDashboardData> => {
      if (!creatorId) throw new Error("Creator ID required");

      // Fetch creator data
      const { data: creator, error: creatorError } = await supabase
        .from("course_creators")
        .select("*")
        .eq("id", creatorId)
        .single();

      if (creatorError) throw creatorError;

      // Fetch courses with sales count
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("id, title, description, price_cents, thumbnail_url, is_published")
        .eq("creator_id", creatorId);

      if (coursesError) throw coursesError;

      // Fetch all sales/purchases
      const { data: sales, error: salesError } = await supabase
        .from("course_purchases")
        .select(`
          id,
          course_id,
          buyer_name,
          buyer_email,
          amount_cents,
          creator_amount_cents,
          payment_status,
          paid_at,
          created_at,
          courses!inner(title)
        `)
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false });

      if (salesError) throw salesError;

      // Process courses with sales data
      const coursesWithStats = (courses || []).map((course) => {
        const courseSales = (sales || []).filter(
          (s) => s.course_id === course.id && s.payment_status === "confirmed"
        );
        return {
          ...course,
          price_cents: course.price_cents || 0,
          sales_count: courseSales.length,
          revenue: courseSales.reduce((sum, s) => sum + s.creator_amount_cents, 0) / 100,
        };
      });

      // Process sales with course titles
      const salesWithTitles = (sales || []).map((sale) => ({
        id: sale.id,
        course_id: sale.course_id || "",
        course_title: (sale.courses as any)?.title || "Curso removido",
        buyer_name: sale.buyer_name,
        buyer_email: sale.buyer_email,
        amount_cents: sale.amount_cents,
        creator_amount_cents: sale.creator_amount_cents,
        payment_status: sale.payment_status || "pending",
        paid_at: sale.paid_at,
        created_at: sale.created_at || "",
      }));

      // Calculate stats
      const confirmedSales = salesWithTitles.filter((s) => s.payment_status === "confirmed");
      const pendingSales = salesWithTitles.filter((s) => s.payment_status === "pending");
      const uniqueStudents = new Set(confirmedSales.map((s) => s.buyer_email)).size;

      const stats = {
        totalRevenue: confirmedSales.reduce((sum, s) => sum + s.creator_amount_cents, 0) / 100,
        pendingRevenue: pendingSales.reduce((sum, s) => sum + s.creator_amount_cents, 0) / 100,
        confirmedSales: confirmedSales.length,
        pendingSales: pendingSales.length,
        totalStudents: uniqueStudents,
        totalCourses: (courses || []).length,
      };

      // Calculate monthly sales (last 6 months)
      const monthlySales: CreatorDashboardData["monthlySales"] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7);
        const monthName = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        
        const monthSales = confirmedSales.filter((s) => {
          const saleDate = new Date(s.paid_at || s.created_at);
          return saleDate.toISOString().slice(0, 7) === monthKey;
        });

        monthlySales.push({
          month: monthName,
          sales: monthSales.length,
          revenue: monthSales.reduce((sum, s) => sum + s.creator_amount_cents, 0) / 100,
        });
      }

      return {
        creator,
        courses: coursesWithStats,
        sales: salesWithTitles,
        stats,
        monthlySales,
      };
    },
    enabled: !!creatorId,
  });
}

export function useCreatorSales(creatorId: string | undefined) {
  return useQuery({
    queryKey: ["creator-sales", creatorId],
    queryFn: async () => {
      if (!creatorId) throw new Error("Creator ID required");

      const { data, error } = await supabase
        .from("course_purchases")
        .select(`
          *,
          courses(title, thumbnail_url)
        `)
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });
}
