import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Clock, Layers, BookOpen, Star, Users, Shield, Flame } from "lucide-react";
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
  const originalPrice = course.price_cents ? Math.round(course.price_cents * 1.4) : 0;
  
  return (
    <div className="relative w-full h-[80vh] min-h-[600px] max-h-[800px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-20 px-6 md:px-12 lg:px-16">
        <motion.div 
          className="max-w-2xl space-y-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Urgency Badge */}
          {!isFree && !course.hasAccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge 
                className="bg-red-500/90 hover:bg-red-500 text-white border-none px-4 py-1.5 text-sm animate-pulse"
              >
                <Flame className="h-4 w-4 mr-1.5" />
                Oferta por tempo limitado
              </Badge>
            </motion.div>
          )}

          {/* Social Proof Quick */}
          <motion.div 
            className="flex items-center gap-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-bold">4.9</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>+500 alunos</span>
            </div>
            {course.progressPercentage > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                {course.progressPercentage === 100 ? "Concluído" : `${Math.round(course.progressPercentage)}% concluído`}
              </Badge>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {course.title}
          </motion.h1>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>

          {/* Description */}
          {course.description && (
            <motion.p 
              className="text-lg text-muted-foreground line-clamp-2 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {course.description}
            </motion.p>
          )}

          {/* Price Display for Paid Courses */}
          {!isFree && !course.hasAccess && (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-muted-foreground line-through text-lg">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-3xl font-bold text-emerald-400">
                {formatPrice(course.price_cents || 0)}
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                -30% OFF
              </Badge>
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div 
            className="flex flex-wrap gap-3 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {course.hasAccess || isFree ? (
              <Button
                size="lg"
                className="gap-2 bg-white text-black hover:bg-white/90 font-bold text-lg px-8"
                onClick={onPlay}
              >
                <Play className="h-5 w-5 fill-current" />
                {course.progressPercentage > 0 ? "Continuar" : "Assistir Agora"}
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
          </motion.div>

          {/* Guarantee Badge */}
          {!isFree && !course.hasAccess && (
            <motion.div 
              className="flex items-center gap-2 text-sm text-muted-foreground pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Garantia de 7 dias ou seu dinheiro de volta</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
