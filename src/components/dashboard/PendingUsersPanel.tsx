import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, UserX, ShieldCheck, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface PendingUser {
  id: string;
  name: string | null;
  created_at: string;
  status: string;
}

export function PendingUsersPanel() {
  const { data: isAdmin, isLoading: isAdminLoading } = useAdmin();
  const queryClient = useQueryClient();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ["pending-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, created_at, status")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PendingUser[];
    },
    enabled: isAdmin === true,
    refetchInterval: 30000,
  });

  if (isAdminLoading || !isAdmin) return null;
  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!pendingUsers || pendingUsers.length === 0) return null;

  const handleApprove = async (userId: string, userName: string | null) => {
    setLoadingUserId(userId);
    try {
      const { data, error } = await supabase.rpc("update_user_status", {
        target_user_id: userId,
        new_status: "active",
      });

      if (error) throw error;

      toast.success(`✅ ${userName || "Usuário"} aprovado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      console.error("Error approving user:", error);
      toast.error("Erro ao aprovar usuário: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleReject = async (userId: string, userName: string | null) => {
    setLoadingUserId(userId);
    try {
      const { data, error } = await supabase.rpc("update_user_status", {
        target_user_id: userId,
        new_status: "inactive",
      });

      if (error) throw error;

      toast.success(`❌ ${userName || "Usuário"} rejeitado.`);
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      console.error("Error rejecting user:", error);
      toast.error("Erro ao rejeitar usuário: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoadingUserId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent shadow-lg shadow-amber-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span>Aprovação de Usuários</span>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
            {pendingUsers.length} pendente{pendingUsers.length > 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background/80 border border-border/50 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user.name || "Sem nome"}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700 h-8 px-3"
                onClick={() => handleReject(user.id, user.name)}
                disabled={loadingUserId === user.id}
              >
                <UserX className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3"
                onClick={() => handleApprove(user.id, user.name)}
                disabled={loadingUserId === user.id}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
