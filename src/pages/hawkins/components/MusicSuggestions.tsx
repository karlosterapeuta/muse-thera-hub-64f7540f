
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Music2 } from "lucide-react";
import { ConsciousnessLevel } from "../types";

type MusicSuggestionsProps = {
  level: ConsciousnessLevel;
};

export function MusicSuggestions({ level }: MusicSuggestionsProps) {
  return (
    <Card className="mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music2 className="h-5 w-5 text-primary" />
          Sugestões Musicais para {level.level}
        </CardTitle>
        <CardDescription>
          Músicas que podem auxiliar na elevação da frequência neste nível
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {level.suggestedSongs.map((song, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${level.color}`} />
              {song}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
