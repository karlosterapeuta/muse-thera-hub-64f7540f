import { Music2, Sparkles } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border/30">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-teal-500/5 to-emerald-500/8" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.1),transparent_60%)]" />

      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-3 left-4 w-1 h-1 rounded-full bg-primary/30 animate-pulse" />
        <div className="absolute top-6 right-5 w-1.5 h-1.5 rounded-full bg-teal-500/20 animate-pulse delay-700" />
        <div className="absolute bottom-4 left-8 w-1 h-1 rounded-full bg-emerald-500/25 animate-pulse delay-1000" />
      </div>

      {collapsed ? (
        <div className="flex items-center justify-center py-5 px-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-teal-700 to-emerald-700 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <img
              src="/lovable-uploads/musetera-logo-new.png"
              alt="MuseTera"
              className="relative h-10 w-10 rounded-xl shadow-xl ring-2 ring-border/50 group-hover:ring-primary/40 transition-all group-hover:scale-110 duration-300"
            />
          </div>
        </div>
      ) : (
        <div className="relative flex items-center gap-4 p-5">
          {/* Logo */}
          <div className="relative group cursor-pointer shrink-0">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-teal-700 to-emerald-700 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500" />
            <div className="relative">
              <img
                src="/lovable-uploads/musetera-logo-new.png"
                alt="MuseTera"
                className="h-12 w-12 rounded-xl shadow-xl ring-2 ring-border/40 group-hover:ring-primary/40 transition-all group-hover:scale-105 duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-teal-700 to-emerald-700 rounded-lg flex items-center justify-center shadow-md ring-2 ring-background">
                <Music2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>

          {/* Brand text */}
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-teal-700 to-emerald-700 bg-clip-text text-transparent tracking-tight leading-tight">
              MuseTera
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-primary/60 shrink-0" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                Musicoterapia
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
