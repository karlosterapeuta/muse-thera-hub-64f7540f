import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Menu, BookOpen } from "lucide-react";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { CoursePlayer } from "@/components/courses/CoursePlayer";
import { useCourse } from "@/hooks/useCourses";
import { useCourseProgress, useMarkLessonComplete } from "@/hooks/useCourseProgress";
import { CourseLesson } from "@/types/courses";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdmin } from "@/hooks/use-admin";
import { CourseAccessRestricted } from "@/components/courses/CourseAccessRestricted";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreatorOfCourse, setIsCreatorOfCourse] = useState<boolean | null>(null);

  const { data: isAdmin, isLoading: adminLoading } = useAdmin();
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: progress = [], isLoading: progressLoading } = useCourseProgress(courseId);
  const markComplete = useMarkLessonComplete();
  const viewTracked = useRef(false);

  // Check if current user is the creator of this course
  useEffect(() => {
    const checkCreatorAccess = async () => {
      if (!course) {
        setIsCreatorOfCourse(false);
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsCreatorOfCourse(false);
        return;
      }
      
      // Check if user is the creator of this specific course
      const { data: creator } = await supabase
        .from('course_creators')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
      
      // Check if creator's id matches course's creator_id
      setIsCreatorOfCourse(creator?.id === course.creator_id);
    };
    
    checkCreatorAccess();
  }, [course]);

  // Track course view (once per session)
  useEffect(() => {
    if (courseId && !viewTracked.current) {
      viewTracked.current = true;
      const sessionId = sessionStorage.getItem("session_id") || crypto.randomUUID();
      sessionStorage.setItem("session_id", sessionId);
      
      supabase.from("course_views").insert({
        course_id: courseId,
        user_id: null, // Anonymous tracking or add auth.uid() if needed
        session_id: sessionId,
      }).then(() => {
        console.log("Course view tracked");
      });
    }
  }, [courseId]);

  // Get all lessons in order
  const allLessons: CourseLesson[] = course?.modules?.flatMap(m => m.lessons || []) || [];

  // Set initial lesson
  useEffect(() => {
    if (course && allLessons.length > 0 && !currentLesson) {
      // Find last incomplete lesson or first lesson
      const completedIds = progress.filter(p => p.is_completed).map(p => p.lesson_id);
      const firstIncomplete = allLessons.find(l => !completedIds.includes(l.id));
      setCurrentLesson(firstIncomplete || allLessons[0]);
    }
  }, [course, progress, currentLesson, allLessons]);

  const currentLessonIndex = currentLesson 
    ? allLessons.findIndex(l => l.id === currentLesson.id)
    : -1;

  const canNavigatePrev = currentLessonIndex > 0;
  const canNavigateNext = currentLessonIndex < allLessons.length - 1;

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && canNavigatePrev) {
      setCurrentLesson(allLessons[currentLessonIndex - 1]);
    } else if (direction === "next" && canNavigateNext) {
      setCurrentLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const handleMarkComplete = async (lessonId: string) => {
    if (!courseId) return;
    
    try {
      await markComplete.mutateAsync({ lessonId, courseId });
      toast.success("Aula marcada como concluída!");
      
      // Auto-advance to next lesson if available
      if (canNavigateNext) {
        setTimeout(() => {
          handleNavigate("next");
        }, 1000);
      }
    } catch (error) {
      toast.error("Erro ao marcar aula como concluída");
    }
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  if (adminLoading || courseLoading || progressLoading || isCreatorOfCourse === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Block users who are neither admin nor the course creator
  if (!isAdmin && !isCreatorOfCourse) {
    return <CourseAccessRestricted />;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">Curso não encontrado</h2>
        <Button onClick={() => navigate("/courses")} variant="outline">
          Voltar para Cursos
        </Button>
      </div>
    );
  }

  const sidebarContent = (
    <CourseSidebar
      course={course}
      progress={progress}
      currentLessonId={currentLesson?.id || null}
      onSelectLesson={handleSelectLesson}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b bg-background flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        )}

        <h1 className="font-medium truncate flex-1">{course.title}</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && sidebarContent}

        {/* Player */}
        {currentLesson ? (
          <CoursePlayer
            lesson={currentLesson}
            course={course}
            progress={progress}
            onMarkComplete={handleMarkComplete}
            onNavigate={handleNavigate}
            canNavigatePrev={canNavigatePrev}
            canNavigateNext={canNavigateNext}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Curso sem conteúdo</h2>
              <p className="text-muted-foreground max-w-md">
                Este curso ainda não possui aulas disponíveis. Volte em breve!
              </p>
            </div>
            <Button onClick={() => navigate("/courses")} variant="outline">
              Voltar para Cursos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
