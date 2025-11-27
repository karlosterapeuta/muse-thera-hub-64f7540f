import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserCourseProgress, CourseWithProgress, Course } from "@/types/courses";

export function useCourseProgress(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all lessons for this course
      const { data: modules } = await supabase
        .from("course_modules")
        .select("id")
        .eq("course_id", courseId);

      if (!modules || modules.length === 0) return [];

      const moduleIds = modules.map((m: any) => m.id);

      const { data: lessons } = await supabase
        .from("course_lessons")
        .select("id")
        .in("module_id", moduleIds);

      if (!lessons || lessons.length === 0) return [];

      const lessonIds = lessons.map((l: any) => l.id);

      const { data: progress, error } = await supabase
        .from("user_course_progress")
        .select("*")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);

      if (error) throw error;
      return (progress || []) as unknown as UserCourseProgress[];
    },
    enabled: !!courseId,
  });
}

export function useAllCoursesProgress() {
  return useQuery({
    queryKey: ["all-courses-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: progress, error } = await supabase
        .from("user_course_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return (progress || []) as unknown as UserCourseProgress[];
    },
  });
}

export function useCoursesWithProgress() {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Course[];
    },
  });

  const { data: allProgress, isLoading: progressLoading } = useAllCoursesProgress();

  const coursesWithProgress: CourseWithProgress[] = (courses || []).map((course) => {
    return {
      ...course,
      totalLessons: 0,
      completedLessons: 0,
      progressPercentage: 0,
    };
  });

  return {
    data: coursesWithProgress,
    isLoading: coursesLoading || progressLoading,
  };
}

export function useMarkLessonComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, courseId }: { lessonId: string; courseId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("user_course_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          is_completed: true,
          completed_at: new Date().toISOString(),
        } as any, {
          onConflict: "user_id,lesson_id",
        })
        .select()
        .single();

      if (error) throw error;
      return { ...(data as unknown as UserCourseProgress), courseId };
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["course-progress", data.courseId] });
      queryClient.invalidateQueries({ queryKey: ["all-courses-progress"] });
    },
  });
}

export function useUpdateWatchTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, watchTimeSeconds, courseId }: { lessonId: string; watchTimeSeconds: number; courseId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("user_course_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          watch_time_seconds: watchTimeSeconds,
        } as any, {
          onConflict: "user_id,lesson_id",
        })
        .select()
        .single();

      if (error) throw error;
      return { ...(data as unknown as UserCourseProgress), courseId };
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["course-progress", data.courseId] });
    },
  });
}
