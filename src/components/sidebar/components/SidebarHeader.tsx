import { Music2, Sparkles } from "lucide-react";
import { MuseteraLogo } from "@/components/MuseteraLogo";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="relative overflow-hidden p-6 border-b border-border/50">
      {/* Background animado com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-500/10 to-pink-500/10 animate-gradient"></div>
      
      {/* Notas musicais decorativas flutuantes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Music2 className="absolute top-2 left-2 w-4 h-4 text-purple-600 dark:text-purple-400 animate-float-slow" />
        <Sparkles className="absolute top-4 right-4 w-3 h-3 text-blue-500 dark:text-blue-400 animate-float-slower" />
        <Music2 className="absolute bottom-2 right-2 w-4 h-4 text-pink-500 dark:text-pink-400 animate-float-slow" />
      </div>

      {collapsed ? (
        // Versão colapsada - logo médio centralizado
        <div className="flex items-center justify-center">
          <div className="relative group">
            <MuseteraLogo size={40} showText={false} className="group-hover:scale-110 transition-all duration-300" />
          </div>
        </div>
      ) : (
        // Versão expandida - logo grande com texto
        <div className="relative flex flex-col items-center space-y-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-all duration-500 animate-gradient"></div>
            <div className="relative group-hover:scale-110 transition-all duration-300">
              <MuseteraLogo size={64} showText={false} />
            </div>
          </div>

          {/* Nome da plataforma */}
          <div className="flex flex-col items-center space-y-1 text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient tracking-tight">
              MuseTera
            </h1>
            
            {/* Tagline */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/80 backdrop-blur-sm rounded-full border border-border shadow-sm">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <p className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                Musicoterapia
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
