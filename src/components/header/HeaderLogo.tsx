import { Sparkles } from "lucide-react";

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 via-amber-400/10 to-primary/10 rounded-xl border border-border/60 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-amber-500 rounded-lg blur opacity-40 group-hover:opacity-70 transition-all"></div>
        <img 
          src="/lovable-uploads/musetera-logo-new.png"
          alt="MuseTera"
          className="relative h-7 w-7 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300"
        />
      </div>
      
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-sm font-bold bg-gradient-to-br from-primary to-amber-500 bg-clip-text text-transparent">
          MuseTera
        </span>
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
      </div>
    </div>
  );
}
