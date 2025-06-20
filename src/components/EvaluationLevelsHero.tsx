
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

const developmentLevels = [
  {
    level: 0,
    name: "Não Observado",
    description: "Habilidade não demonstrada ou não observada durante a avaliação",
    color: "border-gray-500 bg-gray-50 text-gray-700",
    circleColor: "bg-gray-500"
  },
  {
    level: 1,
    name: "Emergente", 
    description: "Início do desenvolvimento da habilidade, demonstrações esporádicas",
    color: "border-red-500 bg-red-50 text-red-700",
    circleColor: "bg-red-500"
  },
  {
    level: 2,
    name: "Inconsistente",
    description: "Habilidade demonstrada ocasionalmente, com variação na qualidade",
    color: "border-orange-400 bg-orange-50 text-orange-700",
    circleColor: "bg-orange-400"
  },
  {
    level: 3,
    name: "Moderado",
    description: "Habilidade demonstrada de forma moderada, com apoio ou orientação",
    color: "border-yellow-400 bg-yellow-50 text-yellow-700",
    circleColor: "bg-yellow-400"
  },
  {
    level: 4,
    name: "Consistente",
    description: "Habilidade demonstrada regularmente e de forma independente",
    color: "border-blue-500 bg-blue-50 text-blue-700",
    circleColor: "bg-blue-500"
  },
  {
    level: 5,
    name: "Avançado",
    description: "Habilidade bem desenvolvida, demonstrada com qualidade superior",
    color: "border-green-500 bg-green-50 text-green-700",
    circleColor: "bg-green-500"
  },
  {
    level: 6,
    name: "Excepcional",
    description: "Habilidade altamente desenvolvida, performance exemplar e criativa",
    color: "border-purple-500 bg-purple-50 text-purple-700",
    circleColor: "bg-purple-500"
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
    return "grid-cols-4"; // Reduzido de 7 para 4 colunas
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
                Guia de Níveis de Desenvolvimento - Escala MuseTera
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Sistema de pontuação expandido (0-6) para avaliação musicoterapêutica profissional
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
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className={cn("grid gap-3 sm:gap-4 lg:gap-6", getGridCols())}>
            {developmentLevels.map((level) => (
              <div
                key={level.level}
                className={cn(
                  "p-4 sm:p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md h-auto min-h-[160px] sm:min-h-[180px]",
                  level.color
                )}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-start gap-3 mb-3 flex-shrink-0">
                    <div className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0",
                      level.circleColor
                    )}>
                      {level.level}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base leading-tight flex-1 hyphens-auto">
                      {level.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-justify hyphens-auto flex-1">
                    {level.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-white/60 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
              Como usar a Escala MuseTera (0-6):
            </h4>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
              <li className="leading-relaxed">• <strong>0 - Não Observado:</strong> Use quando a habilidade não foi demonstrada ou observada</li>
              <li className="leading-relaxed">• <strong>1 - Emergente:</strong> Primeiros sinais da habilidade, demonstrações muito esporádicas</li>
              <li className="leading-relaxed">• <strong>2 - Inconsistente:</strong> Habilidade presente mas com grande variação na qualidade</li>
              <li className="leading-relaxed">• <strong>3 - Moderado:</strong> Habilidade funcional que requer apoio ou orientação</li>
              <li className="leading-relaxed">• <strong>4 - Consistente:</strong> Habilidade bem estabelecida e demonstrada independentemente</li>
              <li className="leading-relaxed">• <strong>5 - Avançado:</strong> Performance superior com qualidade e refinamento</li>
              <li className="leading-relaxed">• <strong>6 - Excepcional:</strong> Demonstração exemplar com criatividade e maestria</li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-800 font-medium leading-relaxed">
                💡 <strong>Dica:</strong> Considere o contexto individual de cada paciente e use evidências observáveis para justificar sua pontuação.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
