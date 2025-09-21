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
          className: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
        };
      case 'completed':
        return {
          label: 'Concluída',
          variant: 'secondary' as const,
          icon: CheckCircleIcon,
          className: 'bg-green-500 hover:bg-green-600 text-white border-green-500'
        };
      case 'no_show':
        return {
          label: 'Faltou',
          variant: 'destructive' as const,
          icon: XCircleIcon,
          className: 'bg-red-500 hover:bg-red-600 text-white border-red-500'
        };
      default:
        return {
          label: 'Agendada',
          variant: 'default' as const,
          icon: ClockIcon,
          className: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
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