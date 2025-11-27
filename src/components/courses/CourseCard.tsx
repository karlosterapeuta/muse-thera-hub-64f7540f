import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, BookOpen, Layers } from "lucide-react";
import { CourseWithProgress, formatDuration } from "@/types/courses";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: CourseWithProgress;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const hasStarted = course.progressPercentage > 0;
  const isComplete = course.progressPercentage === 100;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30">
      <div 
        className="relative aspect-video overflow-hidden bg-muted"
        onClick={onClick}
      >
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/30" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Play className="h-8 w-8 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Status Badge */}
        {hasStarted && (
          <div className="absolute top-3 left-3">
            <Badge 
              variant={isComplete ? "default" : "secondary"}
              className={isComplete ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600 text-white"}
            >
              {isComplete ? "Concluído" : "Em andamento"}
            </Badge>
          </div>
        )}

        {/* Progress bar at bottom */}
        {hasStarted && (
          <div className="absolute bottom-0 left-0 right-0">
            <Progress 
              value={course.progressPercentage} 
              className="h-1.5 rounded-none bg-black/30"
            />
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3" onClick={onClick}>
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {course.instructor_name && (
          <p className="text-sm text-muted-foreground">
            {course.instructor_name}
          </p>
        )}

        {/* Course Stats - Hotmart Style */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="h-4 w-4" />
            {course.totalModules} {course.totalModules === 1 ? "módulo" : "módulos"}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.totalLessons} {course.totalLessons === 1 ? "aula" : "aulas"}
          </span>
          {course.totalDurationMinutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(course.totalDurationMinutes)}
            </span>
          )}
        </div>

        {/* Progress Section */}
        {hasStarted ? (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {course.completedLessons}/{course.totalLessons} aulas
              </span>
              <span className="font-medium text-primary">
                {Math.round(course.progressPercentage)}%
              </span>
            </div>
            <Progress 
              value={course.progressPercentage} 
              className="h-2"
            />
          </div>
        ) : null}

        {/* Action Button */}
        <div className="pt-2">
          <Button 
            className="w-full gap-2"
            variant={hasStarted ? "default" : "outline"}
          >
            <Play className="h-4 w-4" />
            {isComplete ? "Rever curso" : hasStarted ? "Continuar" : "Começar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
