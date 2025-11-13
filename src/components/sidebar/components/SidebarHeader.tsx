import { Music2, Sparkles } from "lucide-react";

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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
            <img
              src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
              alt="MuseTera"
              className="relative h-10 w-10 rounded-full shadow-xl ring-2 ring-border group-hover:ring-border/80 transition-all group-hover:scale-110 duration-300"
            />
          </div>
        </div>
      ) : (
        // Versão expandida - logo grande com texto
        <div className="relative flex flex-col items-center space-y-3">
          {/* Logo com efeitos */}
          <div className="relative group cursor-pointer">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-all duration-500 animate-gradient"></div>
            
            {/* Logo principal */}
            <div className="relative">
              <img
                src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
                alt="MuseTera"
                className="h-16 w-16 rounded-full shadow-2xl ring-4 ring-border group-hover:ring-border/80 transition-all group-hover:scale-110 duration-300"
              />
              
              {/* Badge decorativo */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-background">
                <Music2 className="w-3 h-3 text-white" />
              </div>
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
