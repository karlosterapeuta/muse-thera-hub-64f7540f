
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
    <div className="relative p-2 border-b border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <ProfessionalAvatar size="sm" editable={!collapsed} />
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                Musicoterapia
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              {professionalInfo.name}
            </span>
            <span className="text-[11px] text-slate-500/80 truncate">
              {professionalInfo.role}
            </span>
            {professional?.license_number && (
              <span className="text-[10px] text-slate-400/80 truncate">
                {professional.license_number}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
