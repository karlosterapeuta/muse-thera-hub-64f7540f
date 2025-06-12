
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

const developmentLevels = [
  {
    level: 0,
    name: "Ausente",
    description: "Habilidade não demonstrada",
    color: "border-red-500 bg-red-50 text-red-700",
    circleColor: "bg-red-500"
  },
  {
    level: 1,
    name: "Emergente", 
    description: "Início do desenvolvimento",
    color: "border-orange-400 bg-orange-50 text-orange-700",
    circleColor: "bg-orange-400"
  },
  {
    level: 2,
    name: "Inconsistente",
    description: "Demonstrada ocasionalmente",
    color: "border-yellow-400 bg-yellow-50 text-yellow-700",
    circleColor: "bg-yellow-400"
  },
  {
    level: 3,
    name: "Consistente",
    description: "Demonstrada regularmente",
    color: "border-blue-500 bg-blue-50 text-blue-700",
    circleColor: "bg-blue-500"
  },
  {
    level: 4,
    name: "Independente",
    description: "Totalmente desenvolvida",
    color: "border-green-500 bg-green-50 text-green-700",
    circleColor: "bg-green-500"
  }
];

export function EvaluationLevelsHero() {
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('evaluation-levels-expanded');
    return saved ? JSON.parse(saved) : true;
  });

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('evaluation-levels-expanded', JSON.stringify(newState));
  };

  const getGridCols = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-5";
  };

  return (
    <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200 shadow-lg">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">
                Guia de Níveis de Desenvolvimento
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Entenda como aplicar cada nível na escala de avaliação
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            onClick={toggleExpanded}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 self-start sm:self-center flex-shrink-0"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {!isMobile && "Recolher"}
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {!isMobile && "Expandir"}
              </>
            )}
          </Button>
        </div>

        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className={cn("grid gap-2 sm:gap-3 lg:gap-4", getGridCols())}>
            {developmentLevels.map((level) => (
              <div
                key={level.level}
                className={cn(
                  "p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md",
                  level.color
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0",
                    level.circleColor
                  )}>
                    {level.level}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base leading-tight">{level.name}</h3>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {level.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              Como usar esta escala:
            </h4>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
              <li>• Observe atentamente o comportamento do paciente durante as atividades musicais</li>
              <li>• Considere a frequência e consistência com que a habilidade é demonstrada</li>
              <li>• Use evidências observáveis para justificar sua avaliação</li>
              <li>• Quando em dúvida, opte pelo nível mais conservador</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
