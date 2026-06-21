
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface ProfessionalInfoProps {
  collapsed: boolean;
  professionalInfo: {
    name: string;
    role: string;
  };
  professional: any;
}

export function ProfessionalInfo({ collapsed, professionalInfo, professional }: ProfessionalInfoProps) {
  return (
    <div className={cn("relative px-4 py-3", collapsed && "px-2")}>
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl p-3 transition-all duration-300",
          "bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20",
          collapsed && "justify-center bg-transparent border-0 hover:bg-transparent p-0"
        )}
      >
        <div className="relative shrink-0">
          <ProfessionalAvatar size="sm" editable={!collapsed} />
          {/* Online status dot */}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background",
              collapsed && "w-2.5 h-2.5"
            )}
          />
        </div>
        {!collapsed && (
          <>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground truncate leading-tight">
                {professionalInfo.name}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider truncate">
                {professionalInfo.role}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
          </>
        )}
      </div>
    </div>
  );
}
