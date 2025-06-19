
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="relative flex items-center justify-between p-3 border-b border-white/20 bg-white/20 backdrop-blur-sm">
      <div className="flex items-center">
        <img
          src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
          alt="MuseTera"
          className="h-8 w-8 rounded-lg shadow-md ring-1 ring-white/40"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="hover:bg-white/30 rounded-lg transition-all duration-200 h-8 w-8"
      >
        <ChevronLeft 
          size={16} 
          className={cn(
            "transition-transform duration-200 text-slate-600",
            collapsed && "rotate-180"
          )} 
        />
      </Button>
    </div>
  );
}
