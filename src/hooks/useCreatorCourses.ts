import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getYouTubeId, getYouTubeThumbnail } from "@/utils/youtubeUtils";

export interface CreatorCourse {
  id: string;
  title: string;
  description: string | null;
  price_cents: number | null;
  thumbnail_url: string | null;
  is_published: boolean;
  creator_id: string;
  created_at: string;
  modules?: CreatorModule[];
  // Stats
  enrolled_students?: number;
  view_count?: number;
}

export interface CreatorModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons?: CreatorLesson[];
}

export interface CreatorLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  duration_minutes: number | null;
  order_index: number;
  is_free_preview: boolean;
}

// Helper function to call the creator-operations edge function
const callCreatorOperation = async (operation: string, params: Record<string, any>) => {
  const creatorId = localStorage.getItem("creatorId");
  const creatorToken = localStorage.getItem("creatorToken");

  if (!creatorId || !creatorToken) {
    throw new Error("Não autenticado como criador");
  }

  const response = await supabase.functions.invoke("creator-operations", {
    body: {
      operation,
      creatorId,
      creatorToken,
      ...params,
    },
  });

  if (response.error) {
    console.error("Edge function error:", response.error);
    throw new Error(response.error.message || "Erro na operação");
  }

  return response.data;
};

export function useCreatorCourses(creatorId: string | null) {
  const [courses, setCourses] = useState<CreatorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCourses = useCallback(async () => {
    if (!creatorId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          modules:course_modules(
            *,
            lessons:course_lessons(*)
          )
        `)
        .eq("creator_id", creatorId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get stats for each course (enrolled students and views)
      const courseIds = (data || []).map((c: any) => c.id);
      
      // Fetch enrolled students count (from course_access with is_active = true)
      const { data: accessData } = await supabase
        .from("course_access")
        .select("course_id")
        .in("course_id", courseIds)
        .eq("is_active", true);

      // Fetch view counts
      const { data: viewsData } = await supabase
        .from("course_views")
        .select("course_id")
        .in("course_id", courseIds);

      // Count per course
      const enrolledCount: Record<string, number> = {};
      const viewCount: Record<string, number> = {};

      (accessData || []).forEach((a: any) => {
        enrolledCount[a.course_id] = (enrolledCount[a.course_id] || 0) + 1;
      });

      (viewsData || []).forEach((v: any) => {
        viewCount[v.course_id] = (viewCount[v.course_id] || 0) + 1;
      });

      // Sort modules and lessons by order_index
      const sortedData = (data || []).map((course: any) => ({
        ...course,
        enrolled_students: enrolledCount[course.id] || 0,
        view_count: viewCount[course.id] || 0,
        modules: (course.modules || [])
          .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
          .map((module: any) => ({
            ...module,
            lessons: (module.lessons || []).sort(
              (a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)
            ),
          })),
      }));

      setCourses(sortedData);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Erro ao carregar cursos");
    } finally {
      setIsLoading(false);
    }
  }, [creatorId]);

  // Course CRUD - Using Edge Function to bypass RLS
  const createCourse = async (data: {
    title: string;
    description?: string;
    price_cents?: number;
    thumbnail_url?: string;
  }) => {
    if (!creatorId) return null;

    try {
      const result = await callCreatorOperation("createCourse", data);
      
      if (result?.course) {
        toast.success("Curso criado com sucesso!");
        await loadCourses();
        return result.course;
      }
      return null;
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast.error(error.message || "Erro ao criar curso");
      return null;
    }
  };

  const updateCourse = async (
    courseId: string,
    data: Partial<CreatorCourse>
  ) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update(data as any)
        .eq("id", courseId);

      if (error) throw error;

      toast.success("Curso atualizado!");
      await loadCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Erro ao atualizar curso");
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      toast.success("Curso excluído!");
      await loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Erro ao excluir curso");
    }
  };

  const togglePublish = async (courseId: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: !isPublished })
        .eq("id", courseId);

      if (error) throw error;

      toast.success(
        isPublished ? "Curso despublicado" : "Curso publicado!"
      );
      await loadCourses();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Erro ao alterar publicação");
    }
  };

  // Module CRUD - Using Edge Function to bypass RLS
  const createModule = async (courseId: string, title: string) => {
    try {
      console.log("📦 Creating module via Edge Function:", { courseId, title });
      
      const result = await callCreatorOperation("createModule", {
        courseId,
        title,
      });

      if (result?.module) {
        console.log("✅ Module created:", result.module);
        toast.success("Módulo criado!");
        await loadCourses();
        return result.module;
      }
      return null;
    } catch (error: any) {
      console.error("Error creating module:", error);
      toast.error(error.message || "Erro ao criar módulo");
      return null;
    }
  };

  const updateModule = async (
    moduleId: string,
    data: Partial<CreatorModule>
  ) => {
    try {
      const { error } = await supabase
        .from("course_modules")
        .update(data as any)
        .eq("id", moduleId);

      if (error) throw error;

      toast.success("Módulo atualizado!");
      await loadCourses();
    } catch (error) {
      console.error("Error updating module:", error);
      toast.error("Erro ao atualizar módulo");
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from("course_modules")
        .delete()
        .eq("id", moduleId);

      if (error) throw error;

      toast.success("Módulo excluído!");
      await loadCourses();
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Erro ao excluir módulo");
    }
  };

  // Lesson CRUD - Using Edge Function to bypass RLS
  const createLesson = async (
    moduleId: string,
    data: {
      title: string;
      youtube_url: string;
      description?: string;
      duration_minutes?: number;
      is_free_preview?: boolean;
    }
  ) => {
    try {
      console.log("📦 Creating lesson via Edge Function:", { moduleId, ...data });
      
      const result = await callCreatorOperation("createLesson", {
        moduleId,
        ...data,
      });

      if (result?.lesson) {
        console.log("✅ Lesson created:", result.lesson);
        toast.success("Aula criada!");
        await loadCourses();
      }
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      toast.error(error.message || "Erro ao criar aula");
    }
  };

  const updateLesson = async (
    lessonId: string,
    data: Partial<CreatorLesson>
  ) => {
    try {
      const { error } = await supabase
        .from("course_lessons")
        .update(data)
        .eq("id", lessonId);

      if (error) throw error;

      toast.success("Aula atualizada!");
      await loadCourses();
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Erro ao atualizar aula");
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from("course_lessons")
        .delete()
        .eq("id", lessonId);

      if (error) throw error;

      toast.success("Aula excluída!");
      await loadCourses();
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Erro ao excluir aula");
    }
  };

  // Reorder modules
  const reorderModules = async (courseId: string, moduleIds: string[]) => {
    try {
      await Promise.all(
        moduleIds.map((id, index) =>
          supabase
            .from("course_modules")
            .update({ order_index: index })
            .eq("id", id)
        )
      );
      await loadCourses();
    } catch (error) {
      console.error("Error reordering modules:", error);
      toast.error("Erro ao reordenar módulos");
    }
  };

  // Reorder lessons
  const reorderLessons = async (moduleId: string, lessonIds: string[]) => {
    try {
      await Promise.all(
        lessonIds.map((id, index) =>
          supabase
            .from("course_lessons")
            .update({ order_index: index })
            .eq("id", id)
        )
      );
      await loadCourses();
    } catch (error) {
      console.error("Error reordering lessons:", error);
      toast.error("Erro ao reordenar aulas");
    }
  };

  return {
    courses,
    isLoading,
    loadCourses,
    // Course
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    // Module
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
    // Lesson
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
  };
}
