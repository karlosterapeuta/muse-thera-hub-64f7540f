import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseWithProgress } from "@/types/courses";

export function useCoursesWithStats() {
  return useQuery({
    queryKey: ["courses-with-stats"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      // Fetch all courses
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch all modules with lesson counts and durations
      const { data: modules, error: modulesError } = await supabase
        .from("course_modules")
        .select(`
          id,
          course_id,
          title,
          description,
          order_index,
          course_lessons (
            id,
            duration_minutes,
            youtube_url,
            is_free_preview,
            title,
            order_index
          )
        `)
        .order("order_index", { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch user progress if logged in
      let userProgress: { lesson_id: string; is_completed: boolean }[] = [];
      if (user) {
        const { data: progress } = await supabase
          .from("user_course_progress")
          .select("lesson_id, is_completed")
          .eq("user_id", user.id)
          .eq("is_completed", true);
        
        userProgress = progress || [];
      }

      const completedLessonIds = new Set(userProgress.map(p => p.lesson_id));

      // Group modules by course_id
      const modulesByCourse = new Map<string, any[]>();
      
      (modules || []).forEach((module: any) => {
        const courseId = module.course_id;
        if (!modulesByCourse.has(courseId)) {
          modulesByCourse.set(courseId, []);
        }
        modulesByCourse.get(courseId)!.push({
          id: module.id,
          course_id: module.course_id,
          title: module.title,
          description: module.description,
          order_index: module.order_index,
          lessons: (module.course_lessons || []).map((l: any) => ({
            id: l.id,
            duration_minutes: l.duration_minutes,
            youtube_url: l.youtube_url,
            is_free_preview: l.is_free_preview,
            title: l.title,
            order_index: l.order_index,
          })).sort((a: any, b: any) => a.order_index - b.order_index),
        });
      });

      // Build stats per course
      const courseStats = new Map<string, {
        totalModules: number;
        totalLessons: number;
        totalDurationMinutes: number;
        completedLessons: number;
        lessonIds: string[];
      }>();

      (modules || []).forEach((module: any) => {
        const courseId = module.course_id;
        const lessons = module.course_lessons || [];
        
        if (!courseStats.has(courseId)) {
          courseStats.set(courseId, {
            totalModules: 0,
            totalLessons: 0,
            totalDurationMinutes: 0,
            completedLessons: 0,
            lessonIds: [],
          });
        }
        
        const stats = courseStats.get(courseId)!;
        stats.totalModules += 1;
        stats.totalLessons += lessons.length;
        stats.totalDurationMinutes += lessons.reduce(
          (acc: number, l: any) => acc + (l.duration_minutes || 0), 
          0
        );
        
        lessons.forEach((lesson: any) => {
          stats.lessonIds.push(lesson.id);
          if (completedLessonIds.has(lesson.id)) {
            stats.completedLessons += 1;
          }
        });
      });

      // Map courses with stats and modules
      const coursesWithProgress: CourseWithProgress[] = (courses || []).map((course: any) => {
        const stats = courseStats.get(course.id) || {
          totalModules: 0,
          totalLessons: 0,
          totalDurationMinutes: 0,
          completedLessons: 0,
        };

        const progressPercentage = stats.totalLessons > 0 
          ? (stats.completedLessons / stats.totalLessons) * 100 
          : 0;

        // Get modules for this course sorted by order_index
        const courseModules = (modulesByCourse.get(course.id) || [])
          .sort((a: any, b: any) => a.order_index - b.order_index);

        return {
          ...course,
          modules: courseModules,
          totalModules: stats.totalModules,
          totalLessons: stats.totalLessons,
          totalDurationMinutes: stats.totalDurationMinutes,
          completedLessons: stats.completedLessons,
          progressPercentage,
        };
      });

      return coursesWithProgress;
    },
  });
}
