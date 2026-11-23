import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ClipboardList } from "lucide-react";

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
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <section
      aria-label="Progresso de preenchimento da anamnese"
      className="mb-6 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Progresso do preenchimento</p>
            <p className="text-xs text-muted-foreground">Cobertura dos campos acompanhados</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-primary">{safeProgress}%</p>
          <p className="text-xs text-muted-foreground">{completedSections} de {totalSections} seções com registros</p>
        </div>
      </div>
      <Progress value={safeProgress} className="h-2.5 bg-muted" aria-label={`Progresso: ${safeProgress}%`} />
      <p className="mt-2 text-xs text-muted-foreground">
        O indicador representa a presença de informações, não uma avaliação da qualidade clínica. A finalização possui critérios próprios.
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {safeProgress === 100 ? "Todos os campos acompanhados possuem registros." : safeProgress === 0 ? "O preenchimento ainda não foi iniciado." : "Você pode salvar como rascunho e continuar depois."}
      </div>
    </section>
  );
}
