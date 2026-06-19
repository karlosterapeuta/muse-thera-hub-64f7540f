import { Music, Users, Brain, Activity, Heart, Sparkles } from "lucide-react";

interface ModernAnamnesisHeaderProps {
  editMode?: boolean;
}

export function ModernAnamnesisHeader({ editMode = false }: ModernAnamnesisHeaderProps) {
  return (
    <div className="relative w-full">
      {/* Ambient cosmic blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-xl opacity-40" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-lg">
                <Music className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/40 backdrop-blur text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Avaliação Clínica · Musicoterapia
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {editMode ? "Editar Anamnese" : "Anamnese MuseTera"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Avaliação completa do paciente através de uma abordagem musicoterapêutica integral.
              </p>
            </div>
          </div>

          {/* Domain pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { icon: Users, label: "Pessoal" },
              { icon: Music, label: "Musical" },
              { icon: Activity, label: "Clínico" },
              { icon: Brain, label: "Cognitivo" },
              { icon: Heart, label: "Emocional" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium"
              >
                <item.icon className="h-3.5 w-3.5 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
