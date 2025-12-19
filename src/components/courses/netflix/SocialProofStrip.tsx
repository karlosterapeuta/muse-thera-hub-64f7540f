import { motion } from "framer-motion";
import { Users, Clock, Star, Award, TrendingUp } from "lucide-react";

interface SocialProofStripProps {
  totalStudents?: number;
  totalHours?: number;
  rating?: number;
  completionRate?: number;
}

export function SocialProofStrip({
  totalStudents = 500,
  totalHours = 50,
  rating = 4.9,
  completionRate = 98
}: SocialProofStripProps) {
  const stats = [
    {
      icon: Users,
      value: `${totalStudents}+`,
      label: "Alunos",
      color: "text-emerald-400"
    },
    {
      icon: Clock,
      value: `${totalHours}h`,
      label: "De conteúdo",
      color: "text-blue-400"
    },
    {
      icon: Star,
      value: rating.toFixed(1),
      label: "Avaliação",
      color: "text-amber-400"
    },
    {
      icon: TrendingUp,
      value: `${completionRate}%`,
      label: "Taxa de conclusão",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
      
      {/* Animated border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative container mx-auto px-6 md:px-12">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-center"
            >
              <div className={`p-2 rounded-full bg-background/50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
