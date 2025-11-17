import { Sparkles } from "lucide-react";
import { MuseteraLogo } from "@/components/MuseteraLogo";

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-xl border border-purple-300/30 dark:border-purple-700/30 hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="relative group-hover:rotate-12 transition-transform duration-300">
        <MuseteraLogo size={28} showText={false} />
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
