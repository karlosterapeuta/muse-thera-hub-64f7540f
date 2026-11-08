import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Music } from "lucide-react";

interface AnamnesisProgressBarProps {
  progress: number;
  totalSections: number;
  completedSections: number;
}

export function AnamnesisProgressBar({ 
  progress, 
  totalSections, 
  completedSections 
}: AnamnesisProgressBarProps) {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 mb-6 border border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Cobertura do preenchimento
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            {completedSections}/{totalSections} seções
          </span>
        </div>
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-muted"
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {progress < 30 && "Continue preenchendo..."}
          {progress >= 30 && progress < 70 && "Bom progresso!"}
          {progress >= 70 && progress < 100 && "Quase lá!"}
          {progress === 100 && "Todos os itens considerados foram respondidos."}
        </span>
        <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Indicador de preenchimento, não de conclusão ou validação clínica.</p>
    </div>
  );
}
