import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseModule, CourseLesson } from "@/types/courses";
import { toast } from "sonner";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Course[];
    },
  });
}

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) return null;

      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!course) return null;

      const { data: modules, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (modulesError) throw modulesError;

      const modulesWithLessons = await Promise.all(
        ((modules || []) as unknown as CourseModule[]).map(async (module) => {
          const { data: lessons, error: lessonsError } = await supabase
            .from("course_lessons")
            .select("*")
            .eq("module_id", module.id)
            .order("order_index");

          if (lessonsError) throw lessonsError;

          return { ...module, lessons: (lessons || []) as unknown as CourseLesson[] } as CourseModule;
        })
      );

      return { ...(course as unknown as Course), modules: modulesWithLessons } as Course;
    },
    enabled: !!courseId,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Partial<Course>) => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("courses")
        .insert({ 
          title: course.title!, 
          description: course.description,
          thumbnail_url: course.thumbnail_url,
          instructor_name: course.instructor_name,
          is_published: course.is_published,
          created_by: user.id 
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar curso: " + error.message);
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase
        .from("courses")
        .update({
          title: updates.title,
          description: updates.description,
          thumbnail_url: updates.thumbnail_url,
          instructor_name: updates.instructor_name,
          is_published: updates.is_published,
        } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Course;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      toast.success("Curso atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar curso: " + error.message);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Curso excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir curso: " + error.message);
    },
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (module: Partial<CourseModule>) => {
      const { data, error } = await supabase
        .from("course_modules")
        .insert({
          course_id: module.course_id,
          title: module.title!,
          description: module.description,
          order_index: module.order_index,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CourseModule;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course", variables.course_id] });
      toast.success("Módulo criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar módulo: " + error.message);
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, course_id, ...updates }: Partial<CourseModule> & { id: string; course_id: string }) => {
      const { data, error } = await supabase
        .from("course_modules")
        .update({
          title: updates.title,
          description: updates.description,
          order_index: updates.order_index,
        } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...(data as unknown as CourseModule), course_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.course_id] });
      toast.success("Módulo atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar módulo: " + error.message);
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ moduleId, courseId }: { moduleId: string; courseId: string }) => {
      const { error } = await supabase.from("course_modules").delete().eq("id", moduleId);
      if (error) throw error;
      return { courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] });
      toast.success("Módulo excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir módulo: " + error.message);
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, ...lesson }: Partial<CourseLesson> & { courseId: string }) => {
      const { data, error } = await supabase
        .from("course_lessons")
        .insert({
          module_id: lesson.module_id,
          title: lesson.title!,
          description: lesson.description,
          youtube_url: lesson.youtube_url!,
          duration_minutes: lesson.duration_minutes,
          order_index: lesson.order_index,
          is_free_preview: lesson.is_free_preview,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return { ...(data as unknown as CourseLesson), courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] });
      toast.success("Aula criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar aula: " + error.message);
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, courseId, ...updates }: Partial<CourseLesson> & { id: string; courseId: string }) => {
      const { data, error } = await supabase
        .from("course_lessons")
        .update({
          title: updates.title,
          description: updates.description,
          youtube_url: updates.youtube_url,
          duration_minutes: updates.duration_minutes,
          order_index: updates.order_index,
          is_free_preview: updates.is_free_preview,
        } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...(data as unknown as CourseLesson), courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] });
      toast.success("Aula atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar aula: " + error.message);
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, courseId }: { lessonId: string; courseId: string }) => {
      const { error } = await supabase.from("course_lessons").delete().eq("id", lessonId);
      if (error) throw error;
      return { courseId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] });
      toast.success("Aula excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir aula: " + error.message);
    },
  });
}
