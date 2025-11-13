
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
    <div className="relative p-4 border-b border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <ProfessionalAvatar size="md" editable={!collapsed} />
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Plataforma Para Musicoterapeutas
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-800 truncate">
              {professionalInfo.name}
            </span>
            <span className="text-xs text-slate-500/80 truncate">
              {professionalInfo.role}
            </span>
            {professional?.license_number && (
              <span className="text-xs text-slate-400/80 truncate">
                {professional.license_number}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
