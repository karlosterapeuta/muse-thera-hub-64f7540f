
import { Music, Users, Brain, Activity, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ModernAnamnesisHeaderProps {
  editMode?: boolean;
}

export function ModernAnamnesisHeader({ editMode = false }: ModernAnamnesisHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 animate-fade-in" />
      
      {/* Musical notes pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="flex items-center justify-center h-full">
          <Music className="h-32 w-32 text-primary transform rotate-12" />
          <Music className="h-24 w-24 text-primary transform -rotate-12 ml-8" />
          <Music className="h-20 w-20 text-primary transform rotate-45 ml-6" />
        </div>
      </div>
      
      <div className="relative z-10 p-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            {editMode ? "Editar Anamnese" : "Nova Anamnese Musicoterapêutica"}
          </h1>
        </div>
        
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Avaliação completa do paciente através de uma abordagem musicoterapêutica integral
        </p>
        
        {/* Progress indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {[
            { icon: Users, label: "Pessoal", color: "from-blue-500 to-blue-600" },
            { icon: Music, label: "Musical", color: "from-purple-500 to-purple-600" },
            { icon: Activity, label: "Clínico", color: "from-emerald-500 to-emerald-600" },
            { icon: Brain, label: "Cognitivo", color: "from-amber-500 to-amber-600" },
            { icon: Heart, label: "Emocional", color: "from-rose-500 to-rose-600" }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className={`p-2 bg-gradient-to-r ${item.color} rounded-full mb-1 transition-transform group-hover:scale-110`}>
                <item.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
