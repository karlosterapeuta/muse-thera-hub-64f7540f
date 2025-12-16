import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileEvaluationCardsProps {
  subdomain: { title: string; parameters: string[] };
  domain: { title: string };
  selections: Record<string, string>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const levels = [
  { value: "nao_observado", label: "Não Obs.", score: 0, colors: "bg-gray-100 border-gray-400 text-gray-700", selectedColors: "bg-gray-300 border-gray-600 text-gray-900" },
  { value: "emergente", label: "Emergente", score: 1, colors: "bg-red-50 border-red-300 text-red-700", selectedColors: "bg-red-200 border-red-500 text-red-900" },
  { value: "inconsistente", label: "Inconsist.", score: 2, colors: "bg-orange-50 border-orange-300 text-orange-700", selectedColors: "bg-orange-200 border-orange-500 text-orange-900" },
  { value: "moderado", label: "Moderado", score: 3, colors: "bg-yellow-50 border-yellow-300 text-yellow-700", selectedColors: "bg-yellow-200 border-yellow-500 text-yellow-900" },
  { value: "consistente", label: "Consistente", score: 4, colors: "bg-lime-50 border-lime-300 text-lime-700", selectedColors: "bg-lime-200 border-lime-500 text-lime-900" },
  { value: "excepcional", label: "Excepcional", score: 5, colors: "bg-green-50 border-green-300 text-green-700", selectedColors: "bg-green-200 border-green-500 text-green-900" },
];

export function MobileEvaluationCards({
  subdomain,
  domain,
  selections,
  setSelections,
}: MobileEvaluationCardsProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const getSelectionKey = (parameter: string) => 
    `${domain.title}-${subdomain.title}-${parameter}`;

  const getSelectedLevel = (parameter: string) => {
    const key = getSelectionKey(parameter);
    return levels.find(l => l.value === selections[key]);
  };

  const handleSelect = (parameter: string, value: string) => {
    const key = getSelectionKey(parameter);
    setSelections(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleItem = (parameter: string) => {
    setOpenItems(prev => ({
      ...prev,
      [parameter]: !prev[parameter]
    }));
  };

  return (
    <div className="space-y-3">
      {subdomain.parameters.map((parameter, index) => {
        const selectedLevel = getSelectedLevel(parameter);
        const isOpen = openItems[parameter] || false;

        return (
          <Collapsible
            key={index}
            open={isOpen}
            onOpenChange={() => toggleItem(parameter)}
          >
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                selectedLevel 
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300" 
                  : "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200",
                isOpen && "rounded-b-none border-b-0"
              )}>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-foreground leading-tight">
                    {parameter}
                  </p>
                  {selectedLevel && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                        selectedLevel.selectedColors
                      )}>
                        <Check className="w-3 h-3" />
                        {selectedLevel.label} ({selectedLevel.score})
                      </span>
                    </div>
                  )}
                  {!selectedLevel && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Toque para avaliar
                    </p>
                  )}
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className={cn(
                "p-4 border-2 border-t-0 rounded-b-xl",
                selectedLevel 
                  ? "bg-gradient-to-b from-green-50/50 to-white border-green-300" 
                  : "bg-gradient-to-b from-gray-50/50 to-white border-gray-200"
              )}>
                <p className="text-xs text-muted-foreground mb-3 font-medium">
                  Selecione o nível de desenvolvimento:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {levels.map((level) => {
                    const isSelected = selections[getSelectionKey(parameter)] === level.value;
                    
                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => handleSelect(parameter, level.value)}
                        className={cn(
                          "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 touch-manipulation",
                          "min-h-[52px] text-sm font-medium",
                          isSelected 
                            ? `${level.selectedColors} shadow-md scale-[1.02]`
                            : `${level.colors} hover:scale-[1.01] active:scale-[0.98]`
                        )}
                      >
                        {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                        <span className="leading-tight">
                          {level.label}
                          <span className="block text-xs opacity-75">({level.score})</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
