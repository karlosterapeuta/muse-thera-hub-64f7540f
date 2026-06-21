
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";

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
    <div className={cn("relative px-3 py-2.5 border-b border-border/40", collapsed && "px-2")}>
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl p-2 transition-all duration-300",
          "bg-gradient-to-br from-primary/10 via-card/60 to-purple-500/10",
          "ring-1 ring-border/40 hover:ring-primary/40 shadow-sm hover:shadow-md",
          collapsed && "justify-center bg-transparent ring-0 shadow-none hover:shadow-none p-0"
        )}
      >
        <div className="relative shrink-0">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary to-purple-600 opacity-40 blur-[3px] group-hover:opacity-70 transition-opacity duration-300" />
          <div className="relative">
            <ProfessionalAvatar size="sm" editable={!collapsed} />
          </div>
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[13px] font-bold text-foreground truncate leading-tight">
              {professionalInfo.name}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide truncate">
              {professionalInfo.role}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
