import { Badge } from "@/components/ui/badge";
import { CheckCircle2Icon, ClockIcon } from "lucide-react";
import { PaymentStatus } from "../types";

interface Props {
  status?: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status = "pendente", className }: Props) {
  if (status === "pago") {
    return (
      <Badge
        variant="outline"
        className={`gap-1 border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300 ${className ?? ""}`}
      >
        <CheckCircle2Icon className="h-3 w-3" />
        Pago
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={`gap-1 border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 ${className ?? ""}`}
    >
      <ClockIcon className="h-3 w-3" />
      Pendente
    </Badge>
  );
}
