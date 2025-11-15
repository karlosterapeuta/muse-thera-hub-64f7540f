import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Profile } from "../types";

interface ExpirationBannerProps {
  expiringUsers: Profile[];
  days: number;
}

export function ExpirationBanner({ expiringUsers, days }: ExpirationBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || expiringUsers.length === 0) {
    return null;
  }

  return (
    <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertTitle className="text-orange-800 dark:text-orange-300">
        Atenção: Planos Expirando
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-400">
        {expiringUsers.length} {expiringUsers.length === 1 ? "usuário tem" : "usuários têm"} plano expirando em {days} dias
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
