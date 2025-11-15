import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Infinity } from "lucide-react";

interface ExpirationBadgeProps {
  expiresAt: string | null;
}

export function ExpirationBadge({ expiresAt }: ExpirationBadgeProps) {
  if (!expiresAt) {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
        <Infinity className="w-3 h-3 mr-1" />
        Ilimitado
      </Badge>
    );
  }

  const now = new Date();
  const expiration = new Date(expiresAt);
  const daysUntilExpiration = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
        <Clock className="w-3 h-3 mr-1" />
        Expirado
      </Badge>
    );
  }

  if (daysUntilExpiration <= 7) {
    return (
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">
        <Clock className="w-3 h-3 mr-1" />
        {daysUntilExpiration} dia{daysUntilExpiration !== 1 ? 's' : ''}
      </Badge>
    );
  }

  if (daysUntilExpiration <= 30) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
        <Calendar className="w-3 h-3 mr-1" />
        {daysUntilExpiration} dias
      </Badge>
    );
  }

  return (
    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
      <Calendar className="w-3 h-3 mr-1" />
      {daysUntilExpiration} dias
    </Badge>
  );
}
