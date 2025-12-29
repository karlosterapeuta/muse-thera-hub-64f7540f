import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const suggestions = [
  "Quais atividades usar para regulação sensorial?",
  "Como estruturar uma sessão de musicoterapia?",
  "Sugestões de instrumentos para crianças com TEA",
  "Técnicas para estimular comunicação não-verbal",
  "Como documentar evolução terapêutica?",
  "Atividades para trabalhar coordenação motora",
];

const SuggestedQuestions = ({ onSelect, disabled }: SuggestedQuestionsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-violet-500" />
        <span>Sugestões de perguntas:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="text-xs h-auto py-2 px-3 whitespace-normal text-left hover:bg-violet-500/10 hover:border-violet-500/50 transition-colors"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
