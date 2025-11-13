
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
    <div className="relative p-1.5 border-b border-border/50 bg-muted/20 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <ProfessionalAvatar size="sm" editable={!collapsed} />
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground truncate">
              {professionalInfo.name}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {professionalInfo.role}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
