
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: 'admin' | 'professional';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge variant={role === 'admin' ? "destructive" : "default"}>
      {role === 'admin' ? 'Administrador' : 'Profissional'}
    </Badge>
  );
}
