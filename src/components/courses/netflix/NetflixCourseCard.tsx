import { useState } from "react";
import { Play, Plus, ChevronDown, Clock, Check, ShoppingCart } from "lucide-react";
import { CourseWithProgress, formatDuration, formatPrice } from "@/types/courses";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NetflixCourseCardProps {
  course: CourseWithProgress & { hasAccess?: boolean };
  onClick: () => void;
  onInfoClick: () => void;
  onPurchaseClick?: () => void;
}

export function NetflixCourseCard({ course, onClick, onInfoClick, onPurchaseClick }: NetflixCourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isFree = !course.price_cents || course.price_cents === 0;
  const hasStarted = course.progressPercentage > 0;
  const isComplete = course.progressPercentage === 100;
  const hasAccess = course.hasAccess ?? (isFree || false);

  return (
    <div
      className={cn(
        "relative flex-shrink-0 transition-all duration-300 ease-out cursor-pointer",
        "w-[160px] sm:w-[200px] md:w-[240px]",
        isHovered && "z-50 scale-125 md:scale-150"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div
        className={cn(
          "relative rounded-md overflow-hidden transition-all duration-300",
          isHovered && "shadow-2xl"
        )}
      >
        {/* Thumbnail */}
        <div className="aspect-video relative">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>
          )}

          {/* Progress bar overlay */}
          {hasStarted && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress 
                value={course.progressPercentage} 
                className="h-1 rounded-none bg-muted/50"
              />
            </div>
          )}

          {/* Price badge */}
          <div className="absolute top-2 right-2">
            {isFree ? (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                GRÁTIS
              </span>
            ) : (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                {formatPrice(course.price_cents || 0)}
              </span>
            )}
          </div>

          {/* Completed badge */}
          {isComplete && (
            <div className="absolute top-2 left-2">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Check className="h-3 w-3" />
                Concluído
              </span>
            </div>
          )}
        </div>

        {/* Expanded info on hover */}
        {isHovered && (
          <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-b-md p-3 space-y-2 shadow-xl">
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {hasAccess ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onClick(); }}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors"
                >
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onPurchaseClick?.(); }}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white flex items-center justify-center hover:from-emerald-400 hover:to-green-400 transition-all shadow-lg hover:shadow-emerald-500/30"
                  title={`Comprar por ${formatPrice(course.price_cents || 0)}`}
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              )}
              <button
                className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="flex-1" />
              <button
                onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
                className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-white transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm line-clamp-1">{course.title}</h3>

            {/* Stats */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{course.totalModules} módulos</span>
              <span>•</span>
              <span>{course.totalLessons} aulas</span>
              {course.totalDurationMinutes > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {formatDuration(course.totalDurationMinutes)}
                  </span>
                </>
              )}
            </div>

            {/* Instructor */}
            {course.instructor_name && (
              <p className="text-xs text-muted-foreground">{course.instructor_name}</p>
            )}
          </div>
        )}
      </div>

      {/* Title below card (when not hovered) */}
      {!isHovered && (
        <h3 className="mt-2 text-sm font-medium line-clamp-1">{course.title}</h3>
      )}
    </div>
  );
}
