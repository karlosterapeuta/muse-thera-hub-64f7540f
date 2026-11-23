import { Music, Sparkles } from "lucide-react";

interface ModernAnamnesisHeaderProps {
  editMode?: boolean;
}

export function ModernAnamnesisHeader({ editMode = false }: ModernAnamnesisHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center gap-4 px-4 py-5 sm:px-7 sm:py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Music className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Avaliação clínica · Musicoterapia
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {editMode ? "Editar anamnese" : "Anamnese MuseTera"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Registro clínico e musicoterapêutico integral do paciente.
          </p>
        </div>
      </div>
    </header>
  );
}
