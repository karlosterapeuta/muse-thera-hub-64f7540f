import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Clock, Layers, BookOpen } from "lucide-react";
import { CourseWithProgress, formatDuration, formatPrice } from "@/types/courses";
import { PurchaseButton } from "@/components/courses/PurchaseButton";

interface NetflixHeroProps {
  course: CourseWithProgress & { hasAccess?: boolean };
  onPlay: () => void;
  onInfo: () => void;
  onPurchase?: () => void;
}

export function NetflixHero({ course, onPlay, onInfo, onPurchase }: NetflixHeroProps) {
  const isFree = !course.price_cents || course.price_cents === 0;
  
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {course.progressPercentage > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {course.progressPercentage === 100 ? "Concluído" : `${Math.round(course.progressPercentage)}% concluído`}
              </Badge>
            )}
            {isFree ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Gratuito
              </Badge>
            ) : (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                {formatPrice(course.price_cents || 0)}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {course.title}
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {course.instructor_name && (
              <span className="font-medium text-foreground">{course.instructor_name}</span>
            )}
            <span className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              {course.totalModules} módulos
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {course.totalLessons} aulas
            </span>
            {course.totalDurationMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(course.totalDurationMinutes)}
              </span>
            )}
          </div>

          {/* Description */}
          {course.description && (
            <p className="text-lg text-muted-foreground line-clamp-3 max-w-xl">
              {course.description}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {course.hasAccess || isFree ? (
              <Button
                size="lg"
                className="gap-2 bg-white text-black hover:bg-white/90 font-semibold"
                onClick={onPlay}
              >
                <Play className="h-5 w-5 fill-current" />
                {course.progressPercentage > 0 ? "Continuar" : "Assistir"}
              </Button>
            ) : (
              <PurchaseButton
                priceCents={course.price_cents || 0}
                onClick={onPurchase || onPlay}
                size="lg"
                variant="hero"
              />
            )}
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-muted/50 border-muted-foreground/30 hover:bg-muted"
              onClick={onInfo}
            >
              <Info className="h-5 w-5" />
              Mais informações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
