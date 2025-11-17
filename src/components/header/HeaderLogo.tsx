import { Sparkles } from "lucide-react";

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-xl border border-purple-300/30 dark:border-purple-700/30 hover:scale-105 transition-all duration-300 cursor-pointer group">
      {/* Logo com glow effect */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition-all animate-gradient"></div>
        <img 
          src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
          alt="MuseTera"
          className="relative h-7 w-7 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300"
        />
      </div>
      
      {/* Nome com gradiente */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-sm font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 bg-clip-text text-transparent">
          MuseTera
        </span>
        <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
      </div>
    </div>
  );
}
