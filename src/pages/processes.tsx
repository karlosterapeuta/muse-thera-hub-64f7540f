import { Card } from "@/components/ui/card";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Processes() {
  const isMobile = useIsMobile();

  const processes = [
    {
      title: "Anamnese",
      description: "Coleta inicial de informações e histórico do paciente",
      icon: ClipboardList,
      path: "/anamnesis",
      accentColor: "blue",
    },
    {
      title: "Avaliação",
      description: "Avaliação das necessidades e potencialidades musicoterapêuticas",
      icon: FileText,
      path: "/evaluation",
      accentColor: "purple",
    },
    {
      title: "Planos Musicoterapêuticos",
      description: "Crie e gerencie planos de tratamento musicoterapêutico personalizados",
      icon: ClipboardList,
      path: "/musicotherapy-treatment-plans",
      accentColor: "emerald",
      isNew: true,
    },
    {
      title: "Intervenção",
      description: "Aplicação das técnicas e atividades musicoterapêuticas",
      icon: Users,
      path: "/intervention",
      accentColor: "orange",
      isNew: true,
    },
    {
      title: "Reavaliação",
      description: "Análise do progresso e ajustes no tratamento",
      icon: ChartBar,
      path: "/reevaluation",
      accentColor: "indigo",
    },
    {
      title: "Relatório MuseTera TEA",
      description: "Relatórios especializados em Musicoterapia para TEA",
      icon: Music,
      path: "/processes/musicoterapia",
      accentColor: "violet",
    },
    {
      title: "Relatório de Evolução",
      description: "Relatório detalhado de evolução do paciente em musicoterapia",
      icon: TrendingUp,
      path: "/processes/evolution",
      accentColor: "teal",
      isNew: true,
    },
    {
      title: "Devolutiva TEA",
      description: "Relatório simplificado para famílias de pacientes com TEA",
      icon: Heart,
      path: "/processes/devolutiva-tea",
      accentColor: "rose",
      isNew: true,
    },
  ];

  const colorMap: Record<string, { gradient: string; iconBg: string; glow: string; border: string; text: string; badge: string }> = {
    blue:    { gradient: "from-blue-500 to-blue-600",       iconBg: "bg-blue-500/10 dark:bg-blue-500/20",       glow: "shadow-blue-500/20",    border: "border-blue-500/20 dark:border-blue-400/20",       text: "text-blue-600 dark:text-blue-400",       badge: "bg-blue-500" },
    purple:  { gradient: "from-purple-500 to-purple-600",   iconBg: "bg-purple-500/10 dark:bg-purple-500/20",   glow: "shadow-purple-500/20",  border: "border-purple-500/20 dark:border-purple-400/20",   text: "text-purple-600 dark:text-purple-400",   badge: "bg-purple-500" },
    emerald: { gradient: "from-emerald-500 to-emerald-600", iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20", glow: "shadow-emerald-500/20", border: "border-emerald-500/20 dark:border-emerald-400/20", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500" },
    orange:  { gradient: "from-orange-500 to-orange-600",   iconBg: "bg-orange-500/10 dark:bg-orange-500/20",   glow: "shadow-orange-500/20",  border: "border-orange-500/20 dark:border-orange-400/20",   text: "text-orange-600 dark:text-orange-400",   badge: "bg-orange-500" },
    indigo:  { gradient: "from-indigo-500 to-indigo-600",   iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",   glow: "shadow-indigo-500/20",  border: "border-indigo-500/20 dark:border-indigo-400/20",   text: "text-indigo-600 dark:text-indigo-400",   badge: "bg-indigo-500" },
    violet:  { gradient: "from-violet-500 to-fuchsia-600",  iconBg: "bg-violet-500/10 dark:bg-violet-500/20",   glow: "shadow-violet-500/20",  border: "border-violet-500/20 dark:border-violet-400/20",   text: "text-violet-600 dark:text-violet-400",   badge: "bg-violet-500" },
    teal:    { gradient: "from-teal-500 to-cyan-600",       iconBg: "bg-teal-500/10 dark:bg-teal-500/20",       glow: "shadow-teal-500/20",    border: "border-teal-500/20 dark:border-teal-400/20",       text: "text-teal-600 dark:text-teal-400",       badge: "bg-teal-500" },
    rose:    { gradient: "from-rose-500 to-pink-600",       iconBg: "bg-rose-500/10 dark:bg-rose-500/20",       glow: "shadow-rose-500/20",    border: "border-rose-500/20 dark:border-rose-400/20",       text: "text-rose-600 dark:text-rose-400",       badge: "bg-rose-500" },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Sparkles className="h-4 w-4" />
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
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {processes.map((process, index) => {
            const colors = colorMap[process.accentColor];
            return (
              <Link to={process.path} key={index} className="group block">
                <Card
                  className={`relative h-full overflow-hidden rounded-2xl border ${colors.border} bg-card transition-all duration-500 hover:shadow-xl hover:${colors.glow} hover:-translate-y-1`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

                  {/* NEW badge */}
                  {process.isNew && (
                    <Badge className={`absolute top-4 right-4 z-10 ${colors.badge} text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md`}>
                      NOVO
                    </Badge>
                  )}

                  <div className="relative p-5 lg:p-6 flex flex-col h-full">
                    {/* Icon container */}
                    <div className={`${colors.iconBg} w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <process.icon className={`h-6 w-6 lg:h-7 lg:w-7 ${colors.text}`} />
                    </div>

                    {/* Title */}
                    <h2 className="text-lg lg:text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-foreground/90 transition-colors">
                      {process.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-4">
                      {process.description}
                    </p>

                    {/* CTA */}
                    <div className={`flex items-center gap-1.5 ${colors.text} text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300`}>
                      <span>Acessar</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-5 py-2.5 rounded-full border border-border/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Sistema integrado de gestão musicoterapêutica
          </div>
        </div>
      </div>
    </div>
  );
}
