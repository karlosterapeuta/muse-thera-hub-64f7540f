import { motion } from "framer-motion";
import { Check, Shield, Zap, Gift } from "lucide-react";
import { PurchaseButton } from "@/components/courses/PurchaseButton";
import { CourseWithProgress, formatPrice } from "@/types/courses";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  course: CourseWithProgress;
  onPurchase: () => void;
  onPlay: () => void;
}

const features = [
  "Acesso vitalício ao conteúdo",
  "Atualizações gratuitas",
  "Certificado de conclusão",
  "Suporte direto com o instrutor",
  "Materiais complementares",
  "Acesso via app mobile",
  "Comunidade exclusiva de alunos",
  "Bônus: Templates e recursos",
];

export function PricingSection({ course, onPurchase, onPlay }: PricingSectionProps) {
  const isFree = !course.price_cents || course.price_cents === 0;
  const originalPrice = course.price_cents ? course.price_cents * 1.5 : 0;

  return (
    <section id="pricing" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Investimento
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comece Sua Transformação Agora
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um investimento que se paga com seu crescimento profissional
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="relative bg-card border-2 border-primary/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/10">
            {/* Most popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
                <Zap className="h-4 w-4" />
                Mais Popular
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {course.title}
              </h3>
              <p className="text-muted-foreground">
                Acesso completo a todo o conteúdo
              </p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              {isFree ? (
                <div className="text-5xl font-bold text-emerald-500">
                  GRÁTIS
                </div>
              ) : (
                <>
                  <div className="text-muted-foreground line-through text-lg mb-1">
                    De {formatPrice(originalPrice)}
                  </div>
                  <div className="text-5xl font-bold text-foreground mb-2">
                    {formatPrice(course.price_cents!)}
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                    <Gift className="h-4 w-4" />
                    Economia de {formatPrice(originalPrice - course.price_cents!)}
                  </div>
                </>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isFree || course.hasAccess ? (
              <Button
                size="lg"
                onClick={onPlay}
                className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90"
              >
                {course.hasAccess ? "Continuar Assistindo" : "Acessar Grátis"}
              </Button>
            ) : (
              <PurchaseButton
                priceCents={course.price_cents!}
                onClick={onPurchase}
                size="lg"
                variant="card"
                className="h-14 text-lg rounded-full"
              />
            )}

            {/* Guarantee */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>7 dias de garantia incondicional</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
