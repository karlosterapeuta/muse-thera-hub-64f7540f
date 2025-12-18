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

  // Course CRUD
  const createCourse = async (data: {
    title: string;
    description?: string;
    price_cents?: number;
    thumbnail_url?: string;
  }) => {
    if (!creatorId) return null;

    try {
      const { data: course, error } = await supabase
        .from("courses")
        .insert({
          ...data,
          creator_id: creatorId,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Curso criado com sucesso!");
      await loadCourses();
      return course;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Erro ao criar curso");
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
        .update(data)
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

  // Module CRUD
  const createModule = async (courseId: string, title: string) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      const orderIndex = (course?.modules?.length || 0);

      const { data: module, error } = await supabase.from("course_modules").insert({
        course_id: courseId,
        title,
        order_index: orderIndex,
      }).select().single();

      if (error) throw error;

      toast.success("Módulo criado!");
      await loadCourses();
      return module;
    } catch (error) {
      console.error("Error creating module:", error);
      toast.error("Erro ao criar módulo");
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
        .update(data)
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

  // Lesson CRUD
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
      // Find module to get order index and course info
      let orderIndex = 0;
      let courseId: string | null = null;
      let courseThumbnail: string | null = null;

      courses.forEach((course) => {
        const module = course.modules?.find((m) => m.id === moduleId);
        if (module) {
          orderIndex = module.lessons?.length || 0;
          courseId = course.id;
          courseThumbnail = course.thumbnail_url;
        }
      });

      const { error } = await supabase.from("course_lessons").insert({
        ...data,
        module_id: moduleId,
        order_index: orderIndex,
      });

      if (error) throw error;

      // If course has no thumbnail, generate from this video
      if (courseId && !courseThumbnail && data.youtube_url) {
        const videoId = getYouTubeId(data.youtube_url);
        if (videoId) {
          const thumbnailUrl = getYouTubeThumbnail(videoId, 'maxres');
          await supabase
            .from("courses")
            .update({ thumbnail_url: thumbnailUrl })
            .eq("id", courseId);
        }
      }

      toast.success("Aula criada!");
      await loadCourses();
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Erro ao criar aula");
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
