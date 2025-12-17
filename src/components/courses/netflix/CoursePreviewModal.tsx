import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, X, Clock, Layers, BookOpen, User, ShoppingCart } from "lucide-react";
import { CourseWithProgress, formatDuration, formatPrice } from "@/types/courses";

interface CoursePreviewModalProps {
  course: CourseWithProgress | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
  onPurchase: () => void;
  hasAccess: boolean;
}

export function CoursePreviewModal({
  course,
  isOpen,
  onClose,
  onPlay,
  onPurchase,
  hasAccess
}: CoursePreviewModalProps) {
  if (!course) return null;

  const isFree = !course.price_cents || course.price_cents === 0;
  const hasStarted = course.progressPercentage > 0;
  const isComplete = course.progressPercentage === 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border">
        {/* Hero image */}
        <div className="relative aspect-video">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="text-6xl">🎵</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="gap-2 bg-white text-black hover:bg-white/90 font-semibold rounded-full px-8"
              onClick={hasAccess || isFree ? onPlay : onPurchase}
            >
              {hasAccess || isFree ? (
                <>
                  <Play className="h-6 w-6 fill-current" />
                  {hasStarted ? "Continuar" : "Assistir"}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  Comprar {formatPrice(course.price_cents || 0)}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {isFree ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Gratuito
              </Badge>
            ) : (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                {formatPrice(course.price_cents || 0)}
              </Badge>
            )}
            {hasAccess && !isFree && (
              <Badge className="bg-primary">Você tem acesso</Badge>
            )}
            {isComplete && (
              <Badge className="bg-emerald-500 text-white">Concluído</Badge>
            )}
            {hasStarted && !isComplete && (
              <Badge variant="secondary">{Math.round(course.progressPercentage)}% concluído</Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold">{course.title}</h2>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {course.instructor_name && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {course.instructor_name}
              </span>
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

          {/* Progress */}
          {hasStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {course.completedLessons}/{course.totalLessons} aulas concluídas
                </span>
                <span className="font-medium">{Math.round(course.progressPercentage)}%</span>
              </div>
              <Progress value={course.progressPercentage} className="h-2" />
            </div>
          )}

          {/* Description */}
          {course.description && (
            <p className="text-muted-foreground">{course.description}</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {hasAccess || isFree ? (
              <Button className="flex-1 gap-2" onClick={onPlay}>
                <Play className="h-4 w-4" />
                {hasStarted ? "Continuar assistindo" : "Começar curso"}
              </Button>
            ) : (
              <Button className="flex-1 gap-2" onClick={onPurchase}>
                <ShoppingCart className="h-4 w-4" />
                Comprar por {formatPrice(course.price_cents || 0)}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
