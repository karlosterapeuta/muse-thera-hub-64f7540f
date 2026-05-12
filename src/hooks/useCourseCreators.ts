import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { CourseCreator } from "@/types/courses";

export function useCourseCreators() {
  return useQuery({
    queryKey: ["course-creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_creators")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as CourseCreator[];
    },
  });
}

export function useAllCourseCreators() {
  return useQuery({
    queryKey: ["course-creators-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CourseCreator[];
    },
  });
}

export function useCreateCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creator: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      pix_key: string;
      pix_key_type: "cpf" | "cnpj" | "email" | "phone" | "random";
      bio?: string;
      commission_percentage?: number;
    }) => {
      // Hash password
      const password_hash = await bcrypt.hash(creator.password, 10);

      const { data, error } = await supabase
        .from("course_creators")
        .insert({
          name: creator.name,
          email: creator.email,
          password_hash,
          phone: creator.phone,
          pix_key: creator.pix_key,
          pix_key_type: creator.pix_key_type,
          bio: creator.bio,
          commission_percentage: creator.commission_percentage || 70,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-creators"] });
      queryClient.invalidateQueries({ queryKey: ["course-creators-all"] });
      toast.success("Criador cadastrado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error creating creator:", error);
      toast.error("Erro ao cadastrar criador");
    },
  });
}

export function useUpdateCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creator: {
      id: string;
      name?: string;
      email?: string;
      phone?: string;
      pix_key?: string;
      pix_key_type?: "cpf" | "cnpj" | "email" | "phone" | "random";
      bio?: string;
      commission_percentage?: number;
      is_active?: boolean;
      newPassword?: string;
    }) => {
      const updateData: Record<string, unknown> = {};

      if (creator.name) updateData.name = creator.name;
      if (creator.email) updateData.email = creator.email;
      if (creator.phone !== undefined) updateData.phone = creator.phone;
      if (creator.pix_key) updateData.pix_key = creator.pix_key;
      if (creator.pix_key_type) updateData.pix_key_type = creator.pix_key_type;
      if (creator.bio !== undefined) updateData.bio = creator.bio;
      if (creator.commission_percentage !== undefined) {
        updateData.commission_percentage = creator.commission_percentage;
      }
      if (creator.is_active !== undefined) updateData.is_active = creator.is_active;

      // Hash new password if provided
      if (creator.newPassword) {
        updateData.password_hash = await bcrypt.hash(creator.newPassword, 10);
      }

      const { data, error } = await supabase
        .from("course_creators")
        .update(updateData as any)
        .eq("id", creator.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-creators"] });
      queryClient.invalidateQueries({ queryKey: ["course-creators-all"] });
      toast.success("Criador atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error updating creator:", error);
      toast.error("Erro ao atualizar criador");
    },
  });
}

export function useDeleteCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creatorId: string) => {
      // Check if creator has courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id")
        .eq("creator_id", creatorId)
        .limit(1);

      if (courses && courses.length > 0) {
        throw new Error("Este criador possui cursos associados. Remova os cursos primeiro.");
      }

      const { error } = await supabase
        .from("course_creators")
        .delete()
        .eq("id", creatorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-creators"] });
      queryClient.invalidateQueries({ queryKey: ["course-creators-all"] });
      queryClient.invalidateQueries({ queryKey: ["creator-stats"] });
      toast.success("Criador excluído com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Error deleting creator:", error);
      toast.error(error.message || "Erro ao excluir criador");
    },
  });
}

export function useCreatorStats(creatorId: string | undefined) {
  return useQuery({
    queryKey: ["creator-stats", creatorId],
    queryFn: async () => {
      if (!creatorId) return null;

      // Get courses count
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("id")
        .eq("creator_id", creatorId);

      if (coursesError) throw coursesError;

      // Get sales data
      const { data: sales, error: salesError } = await supabase
        .from("course_purchases")
        .select("amount_cents, creator_amount_cents, user_id, payment_status")
        .eq("creator_id", creatorId)
        .eq("payment_status", "paid");

      if (salesError) throw salesError;

      const totalSales = sales?.length || 0;
      const totalRevenue = sales?.reduce((acc, s) => acc + (s.creator_amount_cents || 0), 0) || 0;
      const uniqueStudents = new Set(sales?.map(s => s.user_id)).size;

      return {
        coursesCount: courses?.length || 0,
        totalSales,
        totalRevenue: totalRevenue / 100, // Convert to reais
        studentsCount: uniqueStudents,
      };
    },
    enabled: !!creatorId,
  });
}

export function useCreatorSales(creatorId: string | undefined) {
  return useQuery({
    queryKey: ["creator-sales", creatorId],
    queryFn: async () => {
      if (!creatorId) return [];

      const { data, error } = await supabase
        .from("course_purchases")
        .select(`
          *,
          course:courses(title, thumbnail_url)
        `)
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });
}
