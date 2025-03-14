
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface StatusToggleProps {
  status: string;
  onToggle: () => Promise<void>;
  onViewLogs: () => void;
}

export function StatusToggle({ status, onToggle, onViewLogs }: StatusToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={status === 'active'}
        onCheckedChange={onToggle}
      />
      <StatusBadge status={status} />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onViewLogs}
        title="Ver histórico de status"
      >
        <History className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  );
}
