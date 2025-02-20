
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Music2, Target, Lightbulb } from "lucide-react";
import { ConsciousnessLevel } from "../types";

type MusicSuggestionsProps = {
  level: ConsciousnessLevel;
};

export function MusicSuggestions({ level }: MusicSuggestionsProps) {
  return (
    <div className="space-y-6">
      <Card className="animate-fade-in border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Music2 className="h-5 w-5 text-primary" />
            Sugestões Musicais para {level.level}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Músicas que podem auxiliar na elevação da frequência neste nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {level.suggestedSongs.map((song, index) => (
              <li key={index} className="flex items-center gap-2 text-foreground">
                <span className={`h-2 w-2 rounded-full ${level.color}`} />
                {song}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="animate-fade-in border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Objetivos Terapêuticos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Metas específicas para este nível de consciência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {level.therapeuticGoals.map((goal, index) => (
              <li key={index} className="flex items-center gap-2 text-foreground">
                <span className={`h-2 w-2 rounded-full ${level.color}`} />
                {goal}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="animate-fade-in border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="h-5 w-5 text-primary" />
            Estratégias de Intervenção
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Abordagens recomendadas para este nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {level.interventionStrategies.map((strategy, index) => (
              <li key={index} className="flex items-center gap-2 text-foreground">
                <span className={`h-2 w-2 rounded-full ${level.color}`} />
                {strategy}
              </li>
            ))}
          </ul>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground">Observações Técnicas:</p>
            <p className="text-sm text-muted-foreground mt-1">{level.technicalObservations}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
