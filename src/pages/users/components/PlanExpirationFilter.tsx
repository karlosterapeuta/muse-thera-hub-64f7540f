import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PlanExpirationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlanExpirationFilter({ value, onChange }: PlanExpirationFilterProps) {
  return (
    <div className="space-y-2">
      <Label>Filtrar por Expiração</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos os planos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os planos</SelectItem>
          <SelectItem value="unlimited">Planos ilimitados</SelectItem>
          <SelectItem value="expired">Planos expirados</SelectItem>
          <SelectItem value="expiring_7">Expirando em 7 dias</SelectItem>
          <SelectItem value="expiring_30">Expirando em 30 dias</SelectItem>
          <SelectItem value="active">Planos ativos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
