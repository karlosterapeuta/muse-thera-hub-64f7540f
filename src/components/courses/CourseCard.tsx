import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, BookOpen } from "lucide-react";
import { CourseWithProgress } from "@/types/courses";

interface CourseCardProps {
  course: CourseWithProgress;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const hasStarted = course.progressPercentage > 0;

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

        {/* Progress bar */}
        {hasStarted && (
          <div className="absolute bottom-0 left-0 right-0">
            <Progress 
              value={course.progressPercentage} 
              className="h-1 rounded-none bg-black/30"
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

        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.totalLessons} aulas
            </span>
          </div>

          <Button 
            size="sm" 
            variant={hasStarted ? "default" : "outline"}
            className="gap-2"
          >
            {hasStarted ? (
              <>
                <Play className="h-4 w-4" />
                Continuar
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Começar
              </>
            )}
          </Button>
        </div>

        {hasStarted && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Progresso:</span>
            <span className="font-medium text-primary">{Math.round(course.progressPercentage)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
