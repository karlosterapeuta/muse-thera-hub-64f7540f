import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/use-admin";

export function UserExpirationWarning() {
  const [dismissed, setDismissed] = useState(false);
  const { data: isAdmin } = useAdmin();

  const { data: expirationData } = useQuery({
    queryKey: ["user-expiration-warning"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("expires_at")
        .eq("id", user.id)
        .single();

      if (!profile?.expires_at) return null;

      const expiresAt = new Date(profile.expires_at);
      const now = new Date();
      const diffTime = expiresAt.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        expiresAt,
        daysRemaining: diffDays,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Reset dismissed state on new session
  useEffect(() => {
    const sessionKey = `expiration-warning-dismissed-${new Date().toDateString()}`;
    const wasDismissed = sessionStorage.getItem(sessionKey);
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    const sessionKey = `expiration-warning-dismissed-${new Date().toDateString()}`;
    sessionStorage.setItem(sessionKey, "true");
    setDismissed(true);
  };

  // Don't show for admins
  if (isAdmin) return null;

  // Don't show if dismissed
  if (dismissed) return null;

  // Don't show if no expiration data or more than 3 days remaining
  if (!expirationData || expirationData.daysRemaining > 3) return null;

  // Don't show if already expired (system will block them)
  if (expirationData.daysRemaining <= 0) return null;

  return (
    <Alert className="mb-0 rounded-none border-x-0 border-t-0 border-orange-500 bg-orange-50 dark:bg-orange-950/30">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-700 dark:text-orange-300 font-medium">
            ⚠️ Seu plano encerra em {expirationData.daysRemaining} {expirationData.daysRemaining === 1 ? "dia" : "dias"}! 
            Entre em contato com o administrador para renovar.
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 shrink-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
