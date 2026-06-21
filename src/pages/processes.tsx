import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  FileText,
  Users,
  ChartBar,
  ArrowRight,
  Music,
  TrendingUp,
  Heart,
  Sparkles,
  Zap,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export default function Processes() {
  const isMobile = useIsMobile();

  const processes = [
    {
      title: "Anamnese",
      description: "Coleta inicial de informações e histórico do paciente",
      icon: ClipboardList,
      path: "/anamnesis",
      accentColor: "blue",
      step: 1,
    },
    {
      title: "Avaliação",
      description: "Avaliação das necessidades e potencialidades musicoterapêuticas",
      icon: FileText,
      path: "/evaluation",
      accentColor: "purple",
      step: 2,
    },
    {
      title: "Plano Terapêutico Individual (PTI)",
      description: "Plano terapêutico completo e individualizado de Musicoterapia, com IA e exportação em PDF",
      icon: Stethoscope,
      path: "/pti",
      accentColor: "emerald",
      step: 3,
    },
    {
      title: "Intervenção",
      description: "Aplicação das técnicas e atividades musicoterapêuticas",
      icon: Users,
      path: "/intervention",
      accentColor: "orange",
      step: 4,
    },
    {
      title: "Reavaliação",
      description: "Análise do progresso e ajustes no tratamento",
      icon: ChartBar,
      path: "/reevaluation",
      accentColor: "indigo",
      step: 5,
    },
    {
      title: "Relatório MuseTera TEA",
      description: "Relatórios especializados em Musicoterapia para TEA",
      icon: Music,
      path: "/processes/musicoterapia",
      accentColor: "violet",
      step: 6,
    },
    {
      title: "Relatório de Evolução",
      description: "Relatório detalhado de evolução do paciente",
      icon: TrendingUp,
      path: "/processes/evolution",
      accentColor: "teal",
      step: 7,
    },
    {
      title: "Devolutiva TEA",
      description: "Relatório simplificado para famílias de pacientes com TEA",
      icon: Heart,
      path: "/processes/devolutiva-tea",
      accentColor: "rose",
      step: 8,
    },
  ];

  const colorMap: Record<string, {
    gradient: string;
    iconGradient: string;
    glow: string;
    glowHover: string;
    ring: string;
    text: string;
    badge: string;
    bg: string;
    stepBg: string;
  }> = {
    blue: {
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      iconGradient: "from-blue-400 to-blue-600",
      glow: "shadow-blue-500/10",
      glowHover: "shadow-blue-500/30",
      ring: "ring-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      stepBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    purple: {
      gradient: "from-purple-500 via-purple-600 to-violet-600",
      iconGradient: "from-purple-400 to-purple-600",
      glow: "shadow-purple-500/10",
      glowHover: "shadow-purple-500/30",
      ring: "ring-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      stepBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    emerald: {
      gradient: "from-emerald-500 via-emerald-600 to-green-600",
      iconGradient: "from-emerald-400 to-emerald-600",
      glow: "shadow-emerald-500/10",
      glowHover: "shadow-emerald-500/30",
      ring: "ring-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      stepBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    orange: {
      gradient: "from-orange-500 via-amber-500 to-orange-600",
      iconGradient: "from-orange-400 to-orange-600",
      glow: "shadow-orange-500/10",
      glowHover: "shadow-orange-500/30",
      ring: "ring-orange-500/20",
      text: "text-orange-600 dark:text-orange-400",
      badge: "bg-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      stepBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    indigo: {
      gradient: "from-indigo-500 via-indigo-600 to-blue-700",
      iconGradient: "from-indigo-400 to-indigo-600",
      glow: "shadow-indigo-500/10",
      glowHover: "shadow-indigo-500/30",
      ring: "ring-indigo-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      stepBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    violet: {
      gradient: "from-violet-500 via-purple-600 to-fuchsia-600",
      iconGradient: "from-violet-400 to-fuchsia-600",
      glow: "shadow-violet-500/10",
      glowHover: "shadow-violet-500/30",
      ring: "ring-violet-500/20",
      text: "text-violet-600 dark:text-violet-400",
      badge: "bg-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      stepBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    teal: {
      gradient: "from-teal-500 via-teal-600 to-cyan-600",
      iconGradient: "from-teal-400 to-cyan-600",
      glow: "shadow-teal-500/10",
      glowHover: "shadow-teal-500/30",
      ring: "ring-teal-500/20",
      text: "text-teal-600 dark:text-teal-400",
      badge: "bg-teal-500",
      bg: "bg-teal-50 dark:bg-teal-950/30",
      stepBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
    rose: {
      gradient: "from-rose-500 via-pink-500 to-rose-600",
      iconGradient: "from-rose-400 to-pink-600",
      glow: "shadow-rose-500/10",
      glowHover: "shadow-rose-500/30",
      ring: "ring-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      badge: "bg-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      stepBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative w-full px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/15 via-purple-500/15 to-pink-500/15 text-primary text-sm font-semibold mb-5 backdrop-blur-sm ring-1 ring-primary/20 shadow-lg shadow-primary/10">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Fluxo Terapêutico Completo
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Processos{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Musicoterapêuticos
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Gerencie todo o ciclo terapêutico com ferramentas especializadas
          </p>

          {/* Step flow chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {["Anamnese", "Avaliação", "PTI", "Intervenção", "Reavaliação"].map((label, i, arr) => (
              <div key={label} className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-card/70 border border-border/60 text-xs font-medium text-foreground/80 backdrop-blur-sm shadow-sm">
                  {label}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </motion.div>


        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
          {processes.map((process, index) => {
            const colors = colorMap[process.accentColor];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Link to={process.path} className="group block h-full">
                  <div
                    className={`relative h-full rounded-2xl bg-card border border-border/60 dark:border-border/40 overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-lg ${colors.glow} hover:shadow-2xl hover:${colors.glowHover}`}
                  >
                    {/* Gradient background overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-500`} />

                    {/* Top gradient bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${colors.gradient} rounded-t-2xl`} />

                    {/* Decorative corner glow */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-[0.07] dark:opacity-[0.12] rounded-full blur-2xl group-hover:opacity-[0.15] dark:group-hover:opacity-[0.2] transition-opacity duration-500`} />


                    <div className="relative p-5 lg:p-6 flex flex-col h-full">
                      {/* Step number + Icon row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.iconGradient} p-[1px] shadow-lg ${colors.glow} group-hover:shadow-xl group-hover:${colors.glowHover} transition-all duration-300 group-hover:scale-105`}>
                          <div className="w-full h-full rounded-2xl bg-card dark:bg-card flex items-center justify-center">
                            <process.icon className={`h-6 w-6 ${colors.text}`} />
                          </div>
                        </div>
                        <span className={`text-xs font-bold ${colors.stepBg} px-2.5 py-1 rounded-full`}>
                          {String(process.step).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-bold text-foreground mb-2 leading-tight tracking-tight">
                        {process.title}
                      </h2>

                      {/* Description */}
                      <p className="text-[13px] text-muted-foreground leading-relaxed flex-grow mb-5">
                        {process.description}
                      </p>

                      {/* CTA */}
                      <div className={`flex items-center justify-between pt-4 border-t border-border/50`}>
                        <span className={`text-sm font-semibold ${colors.text}`}>
                          Acessar
                        </span>
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}>
                          <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-5 py-2.5 rounded-full border border-border/50 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Sistema integrado de gestão musicoterapêutica
          </div>
        </motion.div>
      </div>
    </div>
  );
}
