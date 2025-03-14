
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status === 'active' ? "secondary" : "outline"}>
      {status === 'active' ? 'Ativo' : 'Inativo'}
    </Badge>
  );
}
