import { motion } from "framer-motion";
import { ArrowRight, Clock, Users } from "lucide-react";
import { PurchaseButton } from "@/components/courses/PurchaseButton";
import { CourseWithProgress } from "@/types/courses";
import { Button } from "@/components/ui/button";

interface FinalCTAProps {
  course: CourseWithProgress;
  onPurchase: () => void;
  onPlay: () => void;
}

export function FinalCTA({ course, onPurchase, onPlay }: FinalCTAProps) {
  const isFree = !course.price_cents || course.price_cents === 0;

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Urgency indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-medium text-sm">
              <Clock className="h-4 w-4" />
              Oferta por tempo limitado
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-medium text-sm">
              <Users className="h-4 w-4" />
              +50 alunos esta semana
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Pronto Para Transformar Sua
            <span className="text-primary"> Carreira</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Não deixe para depois. Cada dia que passa é um dia a menos para alcançar seus objetivos profissionais.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isFree || course.hasAccess ? (
              <Button
                size="lg"
                onClick={onPlay}
                className="group h-16 px-10 text-xl rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30"
              >
                {course.hasAccess ? "Continuar Agora" : "Começar Grátis"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <PurchaseButton
                priceCents={course.price_cents!}
                onClick={onPurchase}
                size="lg"
                variant="hero"
                className="h-16 px-10 text-xl"
              />
            )}
          </div>

          {/* Final trust */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-muted-foreground"
          >
            ✅ Pagamento 100% seguro &nbsp;&nbsp;|&nbsp;&nbsp; ✅ Acesso imediato &nbsp;&nbsp;|&nbsp;&nbsp; ✅ 7 dias de garantia
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
