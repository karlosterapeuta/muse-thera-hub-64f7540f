import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Menu, BookOpen } from "lucide-react";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { CoursePlayer } from "@/components/courses/CoursePlayer";
import { CourseLesson } from "@/types/courses";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons?: CourseLesson[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  modules?: CourseModule[];
}

export default function CreatorCoursePreview() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Verify creator authorization
  useEffect(() => {
    const verifyCreator = async () => {
      const creatorToken = localStorage.getItem("creatorToken");
      const creatorId = localStorage.getItem("creatorId");

      if (!creatorToken || !creatorId) {
        setIsAuthorized(false);
        return;
      }

      // Verify the course belongs to this creator
      const { data: courseData, error } = await supabase
        .from("courses")
        .select("creator_id")
        .eq("id", courseId)
        .single();

      if (error || !courseData) {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(courseData.creator_id === creatorId);
    };

    verifyCreator();
  }, [courseId]);

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId || isAuthorized === false) return;

      try {
        // Load course with modules and lessons
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, title, description, thumbnail_url")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        // Load modules
        const { data: modulesData, error: modulesError } = await supabase
          .from("course_modules")
          .select("id, title, description, order_index")
          .eq("course_id", courseId)
          .order("order_index");

        if (modulesError) throw modulesError;

        // Load lessons for each module
        const modulesWithLessons = await Promise.all(
          (modulesData || []).map(async (module) => {
            const { data: lessonsData } = await supabase
              .from("course_lessons")
              .select("*")
              .eq("module_id", module.id)
              .order("order_index");

            return {
              ...module,
              lessons: (lessonsData || []) as CourseLesson[],
            };
          })
        );

        setCourse({
          ...courseData,
          modules: modulesWithLessons,
        });
      } catch (error) {
        console.error("Error loading course:", error);
        toast.error("Erro ao carregar o curso");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized === true) {
      loadCourse();
    } else if (isAuthorized === false) {
      setIsLoading(false);
    }
  }, [courseId, isAuthorized]);

  // Get all lessons in order
  const allLessons: CourseLesson[] = course?.modules?.flatMap(m => m.lessons || []) || [];

  // Set initial lesson
  useEffect(() => {
    if (course && allLessons.length > 0 && !currentLesson) {
      setCurrentLesson(allLessons[0]);
    }
  }, [course, currentLesson, allLessons]);

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
    // For preview mode, just show a message (no actual progress tracking)
    toast.info("Modo preview: progresso não será salvo");
    
    // Auto-advance to next lesson if available
    if (canNavigateNext) {
      setTimeout(() => {
        handleNavigate("next");
      }, 1000);
    }
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  const handleBack = () => {
    navigate("/creator-dashboard");
  };

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h2 className="text-xl font-semibold">Acesso não autorizado</h2>
        <p className="text-muted-foreground">Você não tem permissão para visualizar este curso.</p>
        <Button onClick={handleBack} variant="outline">
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h2 className="text-xl font-semibold mb-2">Curso não encontrado</h2>
        <Button onClick={handleBack} variant="outline">
          Voltar ao Dashboard
        </Button>
      </div>
    );
  }

  const sidebarContent = (
    <CourseSidebar
      course={course as any}
      progress={[]}
      currentLessonId={currentLesson?.id || null}
      onSelectLesson={handleSelectLesson}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-14 border-b bg-background flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
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
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-medium">
          PREVIEW
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && sidebarContent}

        {/* Player */}
        {currentLesson ? (
          <CoursePlayer
            lesson={currentLesson}
            course={course as any}
            progress={[]}
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
                Este curso ainda não possui aulas disponíveis.
              </p>
            </div>
            <Button onClick={handleBack} variant="outline">
              Voltar ao Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
