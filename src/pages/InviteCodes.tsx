
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/use-admin";
import { Navigate } from "react-router-dom";

type InviteCode = {
  id: string;
  code: string;
  status: "unused" | "used" | "expired";
  created_at: string;
  used_at: string | null;
  expires_at: string;
};

export default function InviteCodes() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useAdmin();

  const { data: inviteCodes, refetch } = useQuery({
    queryKey: ["inviteCodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invite_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InviteCode[];
    },
    enabled: isAdmin,
  });

  // Se ainda está carregando, não mostra nada
  if (isLoadingAdmin) {
    return null;
  }

  // Se não é admin, redireciona para o dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const generateCode = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc("generate_invite_code", {
        expiration_days: 7,
      });

      if (error) throw error;

      toast({
        title: "Código gerado com sucesso",
        description: `Novo código: ${data}`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao gerar código",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: InviteCode["status"]) => {
    switch (status) {
      case "unused":
        return "text-green-600";
      case "used":
        return "text-blue-600";
      case "expired":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: InviteCode["status"]) => {
    switch (status) {
      case "unused":
        return "Disponível";
      case "used":
        return "Usado";
      case "expired":
        return "Expirado";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Códigos de Convite</h1>
        <Button onClick={generateCode} disabled={isGenerating}>
          {isGenerating ? "Gerando..." : "Gerar Novo Código"}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead>Usado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inviteCodes?.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono">{code.code}</TableCell>
                <TableCell>
                  <span className={getStatusColor(code.status)}>
                    {getStatusText(code.status)}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(code.created_at), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {format(new Date(code.expires_at), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {code.used_at
                    ? format(new Date(code.used_at), "dd/MM/yyyy HH:mm")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
            {!inviteCodes?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Nenhum código de convite encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
