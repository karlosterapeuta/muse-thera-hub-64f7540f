
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { ConsciousnessLevel } from "../types";

type ConsciousnessCardProps = {
  level: ConsciousnessLevel;
  isSelected: boolean;
  onClick: () => void;
};

export function ConsciousnessCard({ level, isSelected, onClick }: ConsciousnessCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg overflow-hidden ${
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
        <CardDescription className="flex items-center gap-1">
          {level.direction === "up" ? "↑" : "↓"} {level.emotion}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Visão de Vida:</span> {level.lifeView}
        </div>
        <div className="text-sm">
          <span className="font-medium">Visão de Deus:</span> {level.divineView}
        </div>
        <div className="text-sm">
          <span className="font-medium">Processo:</span> {level.process}
        </div>
      </CardContent>
    </Card>
  );
}
