import { Music, Sparkles } from "lucide-react";

interface ModernAnamnesisHeaderProps {
  editMode?: boolean;
}

export function ModernAnamnesisHeader({ editMode = false }: ModernAnamnesisHeaderProps) {
  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/10">
        <div className="relative p-5 sm:p-7">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="relative p-3 rounded-xl bg-primary">
                <Music className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-card/80 text-xs font-semibold text-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Avaliação Clínica · Musicoterapia
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {editMode ? "Editar Anamnese" : "Anamnese MuseTera"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Avaliação completa do paciente através de uma abordagem musicoterapêutica integral.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
