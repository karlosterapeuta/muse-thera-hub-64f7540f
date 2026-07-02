
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import { ConsciousnessCard } from "./components/ConsciousnessCard";
import { MusicSuggestions } from "./components/MusicSuggestions";
import { consciousnessLevels } from "./data/consciousness-levels";
import type { ConsciousnessLevel } from "./types";
import { ResourceBackButton } from "@/components/ResourceBackButton";

export default function HawkinsScale() {
  const [selectedLevel, setSelectedLevel] = useState<ConsciousnessLevel | null>(null);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 animate-fade-in">
      <ResourceBackButton />
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <HeartPulse className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-primary">Escala de Consciência de Hawkins</h1>
        <p className="text-muted-foreground max-w-3xl">
          Desenvolvida pelo Dr. David Hawkins, esta escala mapeia os níveis de consciência 
          humana, desde estados mais densos até os mais elevados, medindo a frequência 
          vibracional de 20 Hz a 1000 Hz. A escala é uma ferramenta valiosa para 
          compreender o desenvolvimento da consciência e planejar intervenções terapêuticas apropriadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consciousnessLevels.map((level) => (
          <ConsciousnessCard
            key={level.level}
            level={level}
            isSelected={selectedLevel?.level === level.level}
            onClick={() => setSelectedLevel(level)}
          />
        ))}
      </div>

      {selectedLevel && <MusicSuggestions level={selectedLevel} />}

      {selectedLevel && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setSelectedLevel(null)}
          >
            Escolher Outro Nível
          </Button>
        </div>
      )}
    </div>
  );
}
