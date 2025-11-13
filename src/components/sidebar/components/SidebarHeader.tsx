
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ collapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="relative flex items-center justify-between p-3 border-b backdrop-blur-sm bg-white/20 border-white/20 dark:bg-gray-800/30 dark:border-gray-700/30">
      <div className="flex items-center">
        <img
          src="/lovable-uploads/7e9c8dee-0549-4b2a-9a82-3b3e2717c34f.png"
          alt="MuseTera"
          className="h-8 w-8 rounded-lg shadow-md ring-1 ring-white/40 dark:ring-gray-600/40"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="rounded-lg transition-all duration-200 h-8 w-8 hover:bg-white/30 dark:hover:bg-gray-700/30"
      >
        <ChevronLeft 
          size={16} 
          className={cn(
            "transition-transform duration-200 text-slate-600 dark:text-gray-300",
            collapsed && "rotate-180"
          )} 
        />
      </Button>
    </div>
  );
}
