import { Badge } from "@/components/ui/badge";
import { SessionStatus } from "../types";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";

interface SessionStatusBadgeProps {
  status: SessionStatus;
  className?: string;
}

export function SessionStatusBadge({ status, className }: SessionStatusBadgeProps) {
  const getStatusConfig = (status: SessionStatus) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Agendada',
          variant: 'default' as const,
          icon: ClockIcon,
          className: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
        };
      case 'completed':
        return {
          label: 'Concluída',
          variant: 'secondary' as const,
          icon: CheckCircleIcon,
          className: 'bg-green-600 hover:bg-green-700 text-white border-green-600'
        };
      case 'no_show':
        return {
          label: 'Faltou',
          variant: 'destructive' as const,
          icon: XCircleIcon,
          className: 'bg-red-600 hover:bg-red-700 text-white border-red-600'
        };
      default:
        return {
          label: 'Agendada',
          variant: 'default' as const,
          icon: ClockIcon,
          className: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${className || ''}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}