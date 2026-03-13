import { Calendar, Clock, Infinity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";

export function PlanStatusCard() {

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
    <Card className="relative overflow-hidden border-0 shadow-2xl rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-600">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
      </div>
      <CardContent className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-white shrink-0" />
          </div>
          <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap drop-shadow-sm">Status do Plano</span>
          {getStatusBadge()}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-white/80 whitespace-nowrap">Adesão:</span>
            <span className="font-semibold text-white">{formatDate(planData.planStartDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-white/80 whitespace-nowrap">Término:</span>
            <span className="font-semibold">
              {planData.isUnlimited ? (
                <span className="flex items-center gap-1 text-yellow-200">
                  <Infinity className="h-4 w-4" />
                  Sem limite
                </span>
              ) : (
                <span className="text-white">{formatDate(planData.expiresAt!)}</span>
              )}
            </span>
          </div>
          {!planData.isUnlimited && planData.daysRemaining !== null && planData.daysRemaining > 0 && (
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/90">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">
                Restam <strong className="text-yellow-200">{planData.daysRemaining}</strong> {planData.daysRemaining === 1 ? "dia" : "dias"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
