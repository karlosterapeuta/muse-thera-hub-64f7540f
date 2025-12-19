import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, X, Clock, Layers, BookOpen, User, Shield, Check, 
  Star, Award, Zap, Users, MessageSquare 
} from "lucide-react";
import { CourseWithProgress, formatDuration, formatPrice } from "@/types/courses";
import { PurchaseButton } from "@/components/courses/PurchaseButton";

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
  const originalPrice = course.price_cents ? Math.round(course.price_cents * 1.4) : 0;

  const benefits = [
    { icon: Zap, text: "Acesso imediato após confirmação" },
    { icon: Clock, text: "Assista quando e onde quiser" },
    { icon: Award, text: "Certificado de conclusão" },
    { icon: Users, text: "Comunidade de alunos" },
  ];

  const testimonial = {
    name: "Maria Silva",
    role: "Musicoterapeuta",
    text: "Este curso transformou minha prática profissional. Conteúdo excelente e muito bem estruturado!",
    rating: 5
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border max-h-[90vh] overflow-y-auto">
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Urgency badge */}
          {!isFree && !hasAccess && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 text-white animate-pulse">
                🔥 12 pessoas compraram hoje
              </Badge>
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {hasAccess || isFree ? (
              <Button
                size="lg"
                className="gap-2 bg-white text-black hover:bg-white/90 font-semibold rounded-full px-8"
                onClick={onPlay}
              >
                <Play className="h-6 w-6 fill-current" />
                {hasStarted ? "Continuar" : "Assistir"}
              </Button>
            ) : (
              <PurchaseButton
                priceCents={course.price_cents || 0}
                onClick={onPurchase}
                size="lg"
                variant="hero"
                showIcon={true}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {!isFree && !hasAccess && (
              <>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  -30% OFF
                </Badge>
              </>
            )}
            {isFree && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Gratuito
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

          {/* Title & Price */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{course.title}</h2>
            {!isFree && !hasAccess && (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatPrice(course.price_cents || 0)}
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-bold">4.9</span>
              <span className="text-muted-foreground">(127 avaliações)</span>
            </div>
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

          {/* Benefits Section */}
          {!hasAccess && !isFree && (
            <motion.div 
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3"
                >
                  <benefit.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Testimonial */}
          {!hasAccess && !isFree && (
            <motion.div 
              className="bg-muted/30 rounded-lg p-4 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      — {testimonial.name}, {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {hasAccess || isFree ? (
              <Button className="flex-1 gap-2" onClick={onPlay}>
                <Play className="h-4 w-4" />
                {hasStarted ? "Continuar assistindo" : "Começar curso"}
              </Button>
            ) : (
              <PurchaseButton
                priceCents={course.price_cents || 0}
                onClick={onPurchase}
                variant="card"
                className="flex-1"
              />
            )}
          </div>

          {/* Guarantee */}
          {!isFree && !hasAccess && (
            <motion.div 
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Garantia incondicional de 7 dias ou seu dinheiro de volta</span>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
