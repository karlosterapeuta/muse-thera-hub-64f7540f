import { useEffect, useRef, useState } from "react";
import { Star, Users, Clock, Award } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString('pt-BR')}{suffix}
    </span>
  );
}

function StatItem({ icon, value, suffix, label, delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-foreground">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export function SocialProofBar() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: 500, suffix: "+", label: "Alunos Matriculados" },
    { icon: <Clock className="h-6 w-6" />, value: 50, suffix: "h", label: "De Conteúdo" },
    { icon: <Star className="h-6 w-6" />, value: 4.9, suffix: "", label: "Avaliação Média" },
    { icon: <Award className="h-6 w-6" />, value: 98, suffix: "%", label: "Taxa de Satisfação" },
  ];

  return (
    <section id="social-proof" className="py-16 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Junte-se a Centenas de Profissionais
          </h2>
          <p className="text-muted-foreground">
            Que já transformaram suas carreiras com nossos cursos
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
