
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserCircle, AlertCircle, History } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";

type UserRole = {
  role: 'admin' | 'professional'
}

type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  status: string;
  user_roles: UserRole[];
}

type StatusLog = {
  id: string;
  user_id: string;
  changed_by: string;
  previous_status: string;
  new_status: string;
  created_at: string;
  changer_name?: string;
}

export default function Users() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showStatusLogs, setShowStatusLogs] = useState(false);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const { data: isAdmin } = useAdmin();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          avatar_url,
          created_at,
          status,
          user_roles (
            role
          )
        `);

      if (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }

      return profiles as Profile[];
    },
  });

  const handleToggleStatus = async (user: Profile) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const { data, error } = await supabase.rpc(
        'update_user_status',
        {
          target_user_id: user.id,
          new_status: newStatus
        }
      );

      if (error) {
        console.error('Error updating user status:', error);
        throw error;
      }

      // Update the users list immediately on the client-side
      queryClient.setQueryData<Profile[]>(["users"], (oldData) => {
        return oldData?.map(u => {
          if (u.id === user.id) {
            return { ...u, status: newStatus };
          }
          return u;
        }) ?? [];
      });

      // Invalidate the query to fetch updated data from the server
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Status atualizado",
        description: `O usuário ${user.name} foi ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Error in update process:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao tentar atualizar o status do usuário. Tente novamente.",
      });
    }
  };

  const handleViewStatusLogs = async (user: Profile) => {
    try {
      setSelectedUser(user);
      setLoadingLogs(true);
      setShowStatusLogs(true);

      // Fetch user status logs
      const { data: logs, error } = await supabase
        .from('user_status_logs')
        .select(`
          id,
          user_id,
          changed_by,
          previous_status,
          new_status,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching status logs:', error);
        throw error;
      }

      // If we have logs, fetch the names of the users who made the changes
      if (logs.length > 0) {
        const changerIds = [...new Set(logs.map(log => log.changed_by))];
        const { data: changers, error: changersError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', changerIds);

        if (changersError) {
          console.error('Error fetching changer names:', changersError);
        } else {
          // Add changer names to logs
          const logsWithNames = logs.map(log => {
            const changer = changers?.find(c => c.id === log.changed_by);
            return {
              ...log,
              changer_name: changer?.name || 'Usuário desconhecido'
            };
          });
          
          setStatusLogs(logsWithNames);
        }
      } else {
        setStatusLogs([]);
      }
    } catch (error) {
      console.error('Error fetching status logs:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar logs",
        description: "Ocorreu um erro ao tentar buscar o histórico de status do usuário.",
      });
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // First check if the user has any patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id')
        .eq('professional_id', userId);

      if (patientsError) {
        console.error('Error checking for patients:', patientsError);
        throw patientsError;
      }

      if (patients && patients.length > 0) {
        toast({
          variant: "destructive",
          title: "Não é possível excluir o usuário",
          description: "Este usuário tem pacientes associados. Exclua os pacientes primeiro.",
        });
        return;
      }

      // Proceed with deletion if no patients are found
      // First delete the user_roles associated
      const { error: userRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (userRolesError) {
        console.error('Error deleting user roles:', userRolesError);
        throw userRolesError;
      }

      // Then delete any status logs associated with the user
      const { error: statusLogsError } = await supabase
        .from('user_status_logs')
        .delete()
        .eq('user_id', userId);

      if (statusLogsError) {
        console.error('Error deleting status logs:', statusLogsError);
        throw statusLogsError;
      }

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      // Update the users list immediately on the client-side
      queryClient.setQueryData<Profile[]>(["users"], (oldData) => {
        return oldData?.filter(user => user.id !== userId) ?? [];
      });

      // Invalidate the query to fetch updated data from the server
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error in deletion process:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro ao tentar excluir o usuário. Tente novamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Card className="p-4">
          <Skeleton className="h-[300px]" />
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para acessar este recurso.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Usuários do Sistema</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-2">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || "Avatar"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">{user.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.user_roles?.[0]?.role === 'admin' ? "destructive" : "default"}>
                    {user.user_roles?.[0]?.role === 'admin' ? 'Administrador' : 'Profissional'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={user.status === 'active'}
                      onCheckedChange={() => handleToggleStatus(user)}
                    />
                    <Badge variant={user.status === 'active' ? "secondary" : "outline"}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewStatusLogs(user)}
                      title="Ver histórico de status"
                    >
                      <History className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Status Logs Dialog */}
      <Dialog open={showStatusLogs} onOpenChange={setShowStatusLogs}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Histórico de Status - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Registro de alterações de status do usuário.
            </DialogDescription>
          </DialogHeader>
          {loadingLogs ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : statusLogs.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Nenhum registro de alteração de status encontrado.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Alterado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.previous_status === 'active' ? "secondary" : "outline"}>
                          {log.previous_status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.new_status === 'active' ? "secondary" : "outline"}>
                          {log.new_status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.changer_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
