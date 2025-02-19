
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
import { Trash2, UserCircle } from "lucide-react";
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

type UserRole = {
  role: 'admin' | 'professional'
}

type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  user_roles: UserRole[];
}

export default function Users() {
  const queryClient = useQueryClient();
  
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

  const handleDeleteUser = async (userId: string) => {
    try {
      // Primeiro deletamos os user_roles associados
      const { error: userRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (userRolesError) {
        console.error('Error deleting user roles:', userRolesError);
        throw userRolesError;
      }

      // Depois deletamos o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      // Atualiza a lista de usuários imediatamente no client-side
      queryClient.setQueryData<Profile[]>(["users"], (oldData) => {
        return oldData?.filter(user => user.id !== userId) ?? [];
      });

      // Invalida a query para buscar dados atualizados do servidor
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
                  <Badge variant="secondary">Ativo</Badge>
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
    </div>
  );
}
