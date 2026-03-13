import { Calendar, Clock, Infinity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/use-admin";
import { Skeleton } from "@/components/ui/skeleton";

export function PlanStatusCard() {
  const { data: isAdmin } = useAdmin();

  const { data: planData, isLoading } = useQuery({
    queryKey: ["user-plan-status"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("created_at, expires_at, plan_start_date")
        .eq("id", user.id)
        .single();

      if (!profile) return null;

      // Use plan_start_date if available, otherwise fallback to created_at
      const planStartDate = profile.plan_start_date 
        ? new Date(profile.plan_start_date) 
        : new Date(profile.created_at);
      const expiresAt = profile.expires_at ? new Date(profile.expires_at) : null;
      
      let daysRemaining: number | null = null;
      if (expiresAt) {
        const now = new Date();
        const diffTime = expiresAt.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        planStartDate,
        expiresAt,
        daysRemaining,
        isUnlimited: !expiresAt,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });


  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (!planData) return null;
    
    if (planData.isUnlimited) {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          <Infinity className="h-3 w-3 mr-1" />
          Ilimitado
        </Badge>
      );
    }

    const days = planData.daysRemaining ?? 0;

    if (days <= 0) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expirado
        </Badge>
      );
    }

    if (days <= 3) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          Expira em {days} {days === 1 ? "dia" : "dias"}
        </Badge>
      );
    }

    if (days <= 7) {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
          <Clock className="h-3 w-3 mr-1" />
          {days} dias restantes
        </Badge>
      );
    }

    if (days <= 30) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          {days} dias restantes
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
        <Clock className="h-3 w-3 mr-1" />
        {days} dias restantes
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Status do Plano
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (!planData) return null;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Status do Plano
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Data de Adesão:</span>
          <span className="font-medium">{formatDate(planData.planStartDate)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Data de Término:</span>
          <span className="font-medium">
            {planData.isUnlimited ? (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Infinity className="h-4 w-4" />
                Sem limite
              </span>
            ) : (
              formatDate(planData.expiresAt!)
            )}
          </span>
        </div>

        {!planData.isUnlimited && planData.daysRemaining !== null && planData.daysRemaining > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Restam <strong className="text-foreground">{planData.daysRemaining}</strong> {planData.daysRemaining === 1 ? "dia" : "dias"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
