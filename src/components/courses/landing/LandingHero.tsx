import { Button } from "@/components/ui/button";
import { PurchaseButton } from "@/components/courses/PurchaseButton";
import { CourseWithProgress, formatDuration } from "@/types/courses";
import { Play, ChevronDown, Star, Users, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface LandingHeroProps {
  course: CourseWithProgress;
  onPlay: () => void;
  onPurchase: () => void;
}

export function LandingHero({ course, onPlay, onPurchase }: LandingHeroProps) {
  const isFree = !course.price_cents || course.price_cents === 0;

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: `url(${course.thumbnail_url || '/placeholder.svg'})`,
          }}
        />
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
      </div>

      {/* Animated particles/music notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20 text-4xl"
            initial={{ y: "100vh", x: `${15 + i * 15}%`, opacity: 0 }}
            animate={{
              y: "-20vh",
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          >
            ♪
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-3xl space-y-8">
          {/* Urgency Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 text-destructive font-semibold text-sm animate-pulse">
              🔥 Oferta por tempo limitado
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="text-foreground">{course.title}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            {course.description || "Transforme sua carreira com este curso completo e prático."}
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-foreground">4.9</span>
              <span>(127 avaliações)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span><span className="font-semibold text-foreground">500+</span> alunos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>{formatDuration(course.totalDurationMinutes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{course.totalModules} módulos</span>
            </div>
          </motion.div>

          {/* Instructor */}
          {course.instructor_name && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {course.instructor_name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Instrutor</p>
                <p className="font-semibold text-foreground">{course.instructor_name}</p>
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4"
          >
            {isFree || course.hasAccess ? (
              <Button
                size="lg"
                onClick={onPlay}
                className="group h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                <Play className="h-6 w-6 mr-2 fill-current" />
                {course.hasAccess ? "Continuar Assistindo" : "Assistir Grátis"}
              </Button>
            ) : (
              <div className="space-y-2">
                <PurchaseButton
                  priceCents={course.price_cents!}
                  onClick={onPurchase}
                  size="lg"
                  variant="hero"
                  className="h-14 text-lg"
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                  Pagamento 100% seguro via PIX
                </p>
              </div>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-14 px-8 text-lg rounded-full border-muted-foreground/30 hover:bg-muted/50"
            >
              Saiba Mais
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              ✅ Acesso imediato
            </span>
            <span className="flex items-center gap-2">
              ✅ Certificado incluso
            </span>
            <span className="flex items-center gap-2">
              ✅ 7 dias de garantia
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
          onClick={() => {
            document.getElementById('social-proof')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-sm">Rolar para baixo</span>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
