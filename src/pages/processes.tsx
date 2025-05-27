
import { Card } from "@/components/ui/card";
import {
  ClipboardList,
  FileText,
  Users,
  ChartBar,
  Edit,
  ArrowRight,
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
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Avaliação",
      description: "Avaliação das necessidades e potencialidades musicoterapêuticas",
      icon: FileText,
      path: "/evaluation",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      title: "Plano Terapêutico",
      description: "Definição dos objetivos e estratégias de tratamento",
      icon: Edit,
      path: "/treatment-plan",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      title: "Intervenção",
      description: "Aplicação das técnicas e atividades musicoterapêuticas",
      icon: Users,
      path: "/intervention",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      title: "Reavaliação",
      description: "Análise do progresso e ajustes no tratamento",
      icon: ChartBar,
      path: "/reevaluation",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50"
    },
    {
      title: "Relatório",
      description: "Documentação e registro dos resultados",
      icon: Edit,
      path: "/processes/reports",
      gradient: "from-amber-500 to-yellow-500",
      bgGradient: "from-amber-50 to-yellow-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-6 shadow-lg">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Processos Musicoterapêuticos
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gerencie todo o ciclo terapêutico com ferramentas especializadas para cada etapa do tratamento
          </p>
        </div>
        
        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {processes.map((process, index) => (
            <Link 
              to={process.path} 
              key={index}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${process.bgGradient} h-full group-hover:bg-gradient-to-r`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 lg:p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${process.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <process.icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {process.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-base lg:text-lg leading-relaxed flex-grow mb-4">
                    {process.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="flex items-center text-primary group-hover:text-purple-600 transition-colors">
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
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema integrado de gestão musicoterapêutica</span>
          </div>
        </div>
      </div>
    </div>
  );
}
