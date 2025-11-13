
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
    <div className="relative p-4 border-b backdrop-blur-sm bg-white/10 border-white/20 dark:bg-gray-800/20 dark:border-gray-700/30">
      <div className="flex items-center space-x-3">
        <ProfessionalAvatar size="md" editable={!collapsed} />
        {!collapsed && (
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Plataforma Para Musicoterapeutas
              </span>
            </div>
            <span className="text-sm font-semibold truncate text-slate-800 dark:text-gray-100">
              {professionalInfo.name}
            </span>
            <span className="text-xs truncate text-slate-500/80 dark:text-gray-400">
              {professionalInfo.role}
            </span>
            {professional?.license_number && (
              <span className="text-xs truncate text-slate-400/80 dark:text-gray-500">
                {professional.license_number}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
