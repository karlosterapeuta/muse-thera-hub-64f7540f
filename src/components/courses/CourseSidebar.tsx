import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Play, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Course, CourseLesson, UserCourseProgress } from "@/types/courses";

interface CourseSidebarProps {
  course: Course;
  progress: UserCourseProgress[];
  currentLessonId: string | null;
  onSelectLesson: (lesson: CourseLesson) => void;
}

export function CourseSidebar({ course, progress, currentLessonId, onSelectLesson }: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules?.map(m => m.id) || []
  );

  const completedLessonIds = progress.filter(p => p.is_completed).map(p => p.lesson_id);
  
  const totalLessons = course.modules?.reduce(
    (acc, module) => acc + (module.lessons?.length || 0), 
    0
  ) || 0;
  
  const completedCount = completedLessonIds.length;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);

  return (
    <div className="w-80 bg-slate-900 text-white flex flex-col h-full">
      {/* Course Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="font-bold text-lg line-clamp-2 mb-3">{course.title}</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Seu progresso</span>
            <span className="text-emerald-400 font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-slate-700"
          />
          <p className="text-xs text-slate-400">
            {completedCount} de {totalLessons} aulas concluídas
          </p>
        </div>
      </div>

      {/* Modules List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {course.modules?.map((module, moduleIndex) => {
            const isExpanded = expandedModules.includes(module.id);
            const moduleLessons = module.lessons || [];
            const moduleCompletedCount = moduleLessons.filter(l => isLessonCompleted(l.id)).length;
            const isModuleComplete = moduleLessons.length > 0 && moduleCompletedCount === moduleLessons.length;

            return (
              <div key={module.id} className="mb-1">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                    "hover:bg-slate-800"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    isModuleComplete ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                  )}>
                    {isModuleComplete ? <Check className="h-3 w-3" /> : moduleIndex + 1}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{module.title}</p>
                    <p className="text-xs text-slate-400">
                      {moduleCompletedCount}/{moduleLessons.length} aulas
                    </p>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {moduleLessons.map((lesson, lessonIndex) => {
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                            isCurrent 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-slate-800",
                          )}
                        >
                          <span className={cn(
                            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                            isCompleted 
                              ? "bg-emerald-500 text-white" 
                              : isCurrent
                                ? "bg-primary-foreground text-primary"
                                : "bg-slate-700 text-slate-400"
                          )}>
                            {isCompleted ? (
                              <Check className="h-3 w-3" />
                            ) : isCurrent ? (
                              <Play className="h-3 w-3 fill-current" />
                            ) : (
                              <span className="text-xs">{lessonIndex + 1}</span>
                            )}
                          </span>
                          
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm line-clamp-2",
                              isCurrent ? "font-medium" : "",
                              isCompleted && !isCurrent ? "text-slate-400" : ""
                            )}>
                              {lesson.title}
                            </p>
                            {lesson.duration_minutes > 0 && (
                              <p className={cn(
                                "text-xs mt-0.5",
                                isCurrent ? "text-primary-foreground/70" : "text-slate-500"
                              )}>
                                {lesson.duration_minutes} min
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
