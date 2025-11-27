import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { CourseLesson, Course, UserCourseProgress } from "@/types/courses";
import { getYouTubeId } from "@/utils/youtubeUtils";
import { cn } from "@/lib/utils";

interface CoursePlayerProps {
  lesson: CourseLesson;
  course: Course;
  progress: UserCourseProgress[];
  onMarkComplete: (lessonId: string) => void;
  onNavigate: (direction: "prev" | "next") => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
}

export function CoursePlayer({ 
  lesson, 
  course,
  progress,
  onMarkComplete, 
  onNavigate,
  canNavigatePrev,
  canNavigateNext 
}: CoursePlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const youtubeId = getYouTubeId(lesson.youtube_url);

  useEffect(() => {
    const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
    setIsCompleted(lessonProgress?.is_completed || false);
  }, [lesson.id, progress]);

  const handleMarkComplete = () => {
    onMarkComplete(lesson.id);
    setIsCompleted(true);
  };

  // Find current module and lesson index for breadcrumb
  let currentModuleTitle = "";
  let currentLessonIndex = 0;
  let totalLessonsInModule = 0;

  course.modules?.forEach(module => {
    const lessonIdx = module.lessons?.findIndex(l => l.id === lesson.id);
    if (lessonIdx !== undefined && lessonIdx >= 0) {
      currentModuleTitle = module.title;
      currentLessonIndex = lessonIdx + 1;
      totalLessonsInModule = module.lessons?.length || 0;
    }
  });

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={lesson.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <p>URL do YouTube inválida</p>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>{currentModuleTitle}</span>
          <span>•</span>
          <span>Aula {currentLessonIndex} de {totalLessonsInModule}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

        {/* Description */}
        {lesson.description && (
          <p className="text-muted-foreground mb-6 whitespace-pre-wrap">
            {lesson.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            variant={isCompleted ? "secondary" : "default"}
            className={cn(
              "gap-2",
              isCompleted && "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            )}
          >
            <Check className="h-4 w-4" />
            {isCompleted ? "Concluída" : "Marcar como Concluída"}
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("prev")}
              disabled={!canNavigatePrev}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("next")}
              disabled={!canNavigateNext}
              className="gap-1"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
