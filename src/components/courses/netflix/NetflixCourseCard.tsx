import { useState, useRef, useEffect } from "react";
import { Play, Plus, ChevronDown, Clock, Check, ShoppingCart, Flame, Star, Zap, Volume2, VolumeX } from "lucide-react";
import { CourseWithProgress, formatDuration, formatPrice } from "@/types/courses";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getYouTubeId } from "@/utils/youtubeUtils";

interface NetflixCourseCardProps {
  course: CourseWithProgress & { hasAccess?: boolean; trailer_url?: string | null; modules?: Array<{ lessons?: Array<{ youtube_url: string; is_free_preview: boolean }> }> };
  onClick: () => void;
  onInfoClick: () => void;
  onPurchaseClick?: () => void;
}

export function NetflixCourseCard({ course, onClick, onInfoClick, onPurchaseClick }: NetflixCourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isFree = !course.price_cents || course.price_cents === 0;
  const hasStarted = course.progressPercentage > 0;
  const isComplete = course.progressPercentage === 100;
  const hasAccess = course.hasAccess ?? (isFree || false);
  const isPremium = course.price_cents && course.price_cents > 5000; // > R$50

  // Get preview video URL - prioritize trailer_url, fallback to first free preview lesson
  const getPreviewUrl = (): { type: 'mp4' | 'youtube'; url: string } | null => {
    if (course.trailer_url) {
      return { type: 'mp4', url: course.trailer_url };
    }
    
    // Find first lesson with is_free_preview
    if (course.modules) {
      for (const module of course.modules) {
        if (module.lessons) {
          const previewLesson = module.lessons.find(lesson => lesson.is_free_preview);
          if (previewLesson) {
            const youtubeId = getYouTubeId(previewLesson.youtube_url);
            if (youtubeId) {
              return { type: 'youtube', url: youtubeId };
            }
          }
        }
      }
    }
    return null;
  };

  const previewInfo = getPreviewUrl();

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (previewInfo) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 1500);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  return (
    <div
      className={cn(
        "relative flex-shrink-0 transition-all duration-300 ease-out cursor-pointer group",
        "w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px] xl:w-[280px]",
        isHovered && "z-50 scale-110 sm:scale-125 md:scale-150"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Card */}
      <div
        className={cn(
          "relative rounded-md overflow-hidden transition-all duration-300",
          isHovered && "shadow-2xl shadow-primary/20"
        )}
      >
        {/* Thumbnail / Video Preview */}
        <div className="aspect-video relative">
          {showPreview && previewInfo ? (
            previewInfo.type === 'mp4' ? (
              <video
                src={previewInfo.url}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${previewInfo.url}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${previewInfo.url}&modestbranding=1&rel=0&showinfo=0`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
                title={`Preview: ${course.title}`}
              />
            )
          ) : course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>
          )}

          {/* Mute/Unmute button when preview is playing */}
          {showPreview && previewInfo && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
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

          {/* Top badges row */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            {/* Left badges */}
            <div className="flex flex-col gap-1">
              {isPremium && !hasAccess && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Flame className="h-2.5 w-2.5" />
                  POPULAR
                </span>
              )}
              {isComplete && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Check className="h-2.5 w-2.5" />
                  CONCLUÍDO
                </span>
              )}
            </div>

            {/* Price badge */}
            <div>
              {isFree ? (
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">
                  GRÁTIS
                </span>
              ) : (
                <div className="flex flex-col items-end gap-0.5">
                  {!hasAccess && (
                    <span className="bg-red-500/80 text-white text-[9px] px-1 rounded">
                      -30%
                    </span>
                  )}
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">
                    {formatPrice(course.price_cents || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick benefit badge (bottom) */}
          {!isHovered && !isFree && !hasAccess && (
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-background/80 backdrop-blur-sm text-[10px] text-foreground px-2 py-1 rounded flex items-center gap-1 justify-center">
                <Zap className="h-3 w-3 text-amber-400" />
                <span>Acesso imediato + Certificado</span>
              </div>
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

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-3 w-3 fill-current" />
                <span className="font-bold">4.9</span>
              </div>
              <span className="text-muted-foreground">• 98% aprovação</span>
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

            {/* Quick benefit on hover */}
            {!isFree && !hasAccess && (
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Garantia de 7 dias
              </div>
            )}

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
