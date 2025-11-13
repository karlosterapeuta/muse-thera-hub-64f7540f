import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  FileText,
  Users,
  ChartBar,
  Edit,
  ArrowRight,
  Music,
  TrendingUp,
  Heart,
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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      bgGradientDark: "dark:from-blue-950/30 dark:to-cyan-950/30"
    },
    {
      title: "Avaliação",
      description: "Avaliação das necessidades e potencialidades musicoterapêuticas",
      icon: FileText,
      path: "/evaluation",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      bgGradientDark: "dark:from-purple-950/30 dark:to-pink-950/30"
    },
    {
      title: "Planos Musicoterapêuticos",
      description: "Crie e gerencie planos de tratamento musicoterapêutico personalizados",
      icon: ClipboardList,
      path: "/musicotherapy-treatment-plans",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      bgGradientDark: "dark:from-emerald-950/30 dark:to-teal-950/30",
      isNew: true
    },
    {
      title: "Intervenção",
      description: "Aplicação das técnicas e atividades musicoterapêuticas",
      icon: Users,
      path: "/intervention",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      bgGradientDark: "dark:from-orange-950/30 dark:to-red-950/30",
      isNew: true
    },
    {
      title: "Reavaliação",
      description: "Análise do progresso e ajustes no tratamento",
      icon: ChartBar,
      path: "/reevaluation",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      bgGradientDark: "dark:from-indigo-950/30 dark:to-purple-950/30"
    },
    {
      title: "Relatório MuseTera TEA",
      description: "Relatórios especializados em Musicoterapia para TEA",
      icon: Music,
      path: "/processes/musicoterapia",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      bgGradientDark: "dark:from-purple-950/30 dark:to-pink-950/30"
    },
    {
      title: "Relatório de Evolução – MuseTera",
      description: "Relatório detalhado de evolução do paciente em musicoterapia",
      icon: TrendingUp,
      path: "/processes/evolution",
      gradient: "from-green-500 to-blue-500",
      bgGradient: "from-green-50 to-blue-50",
      bgGradientDark: "dark:from-green-950/30 dark:to-blue-950/30",
      isNew: true
    },
    {
      title: "Devolutiva Musicoterapia TEA",
      description: "Relatório simplificado para famílias de pacientes com TEA",
      icon: Heart,
      path: "/processes/devolutiva-tea",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      bgGradientDark: "dark:from-pink-950/30 dark:to-rose-950/30",
      isNew: true
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-0 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16 px-2 sm:px-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-6 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Processos Musicoterapêuticos
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Gerencie todo o ciclo terapêutico com ferramentas especializadas para cada etapa do tratamento
          </p>
        </div>
        
        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-3">
          {processes.map((process, index) => (
            <Link 
              to={process.path} 
              key={index}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <Card className={`relative overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500 bg-card h-full group`}>
                {/* NEW Badge */}
                {process.isNew && (
                  <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xs px-2 py-1 animate-pulse shadow-lg">
                    NOVO
                  </Badge>
                )}
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white dark:via-gray-800 to-transparent transform rotate-12 scale-150"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 lg:p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${process.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <process.icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3 transition-colors">
                    {process.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-base lg:text-lg leading-relaxed flex-grow mb-4">
                    {process.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
                    <span className="text-sm font-medium mr-2">Acessar</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${process.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center px-2 sm:px-3">
          <div className="inline-flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema integrado de gestão musicoterapêutica</span>
          </div>
        </div>
      </div>
    </div>
  );
}
