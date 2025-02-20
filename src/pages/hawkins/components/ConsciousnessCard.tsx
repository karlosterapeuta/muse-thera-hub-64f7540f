
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gauge, List, Target, Brain, Lightbulb } from "lucide-react";
import { ConsciousnessLevel } from "../types";

type ConsciousnessCardProps = {
  level: ConsciousnessLevel;
  isSelected: boolean;
  onClick: () => void;
};

export function ConsciousnessCard({ level, isSelected, onClick }: ConsciousnessCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg overflow-hidden border border-border ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className={`h-2 ${level.color}`} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          {level.level} ({level.frequency} Hz)
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-muted-foreground">
          {level.direction === "up" ? "↑" : "↓"} {level.emotion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p className="text-foreground">{level.description}</p>
          
          <div>
            <span className="font-medium flex items-center gap-1 text-foreground">
              <Brain className="h-4 w-4" /> Visão de Vida:
            </span> 
            <span className="text-muted-foreground">{level.lifeView}</span>
          </div>
          
          <div>
            <span className="font-medium flex items-center gap-1 text-foreground">
              <Lightbulb className="h-4 w-4" /> Visão de Deus:
            </span> 
            <span className="text-muted-foreground">{level.divineView}</span>
          </div>
          
          <div>
            <span className="font-medium flex items-center gap-1 text-foreground">
              <List className="h-4 w-4" /> Processo:
            </span> 
            <span className="text-muted-foreground">{level.process}</span>
          </div>

          <div>
            <span className="font-medium flex items-center gap-1 mb-1 text-foreground">
              <Target className="h-4 w-4" /> Características Principais:
            </span>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {level.mainCharacteristics.map((char, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {char}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
