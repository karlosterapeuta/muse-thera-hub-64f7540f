import { Music, Users, Brain, Activity, Heart, Sparkles } from "lucide-react";

interface ModernAnamnesisHeaderProps {
  editMode?: boolean;
}

export function ModernAnamnesisHeader({ editMode = false }: ModernAnamnesisHeaderProps) {
  return (
    <div className="relative w-full">
      {/* Ambient cosmic blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-teal-900/20 bg-gradient-to-br from-[#0f302f] via-[#164845] to-[#155e58] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-teal-400/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/30 to-transparent" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800 blur-xl opacity-40" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-800 shadow-lg">
                <Music className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-100/20 bg-white/10 backdrop-blur text-xs font-medium text-teal-50">
                <Sparkles className="h-3 w-3 text-teal-100" />
                Avaliação Clínica · Musicoterapia
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {editMode ? "Editar Anamnese" : "Anamnese MuseTera"}
              </h1>
              <p className="text-sm sm:text-base text-teal-50/85 max-w-2xl leading-relaxed">
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
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-teal-100/20 bg-white/10 backdrop-blur text-xs font-medium text-teal-50"
              >
                <item.icon className="h-3.5 w-3.5 text-teal-100" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
