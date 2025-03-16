
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdmin } from "@/hooks/use-admin";
import { StatusLogsDialog } from "./components/StatusLogsDialog";
import { UsersTable } from "./components/UsersTable";
import { useUsers } from "./hooks/useUsers";
import { useUserActions } from "./hooks/useUserActions";

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const { data: isAdmin } = useAdmin();
  
  const {
    selectedUser,
    showStatusLogs,
    statusLogs,
    loadingLogs,
    setShowStatusLogs,
    handleToggleStatus,
    handleViewStatusLogs,
    handleDeleteUser,
    handleForceLogout
  } = useUserActions();

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
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Usuários inativos não podem fazer login. Usuários com sessão ativa serão desconectados automaticamente quando desativados.
        </AlertDescription>
      </Alert>
      
      <UsersTable 
        users={users || []}
        onToggleStatus={handleToggleStatus}
        onViewStatusLogs={handleViewStatusLogs}
        onDeleteUser={handleDeleteUser}
        onForceLogout={handleForceLogout}
      />

      <StatusLogsDialog 
        isOpen={showStatusLogs}
        onOpenChange={setShowStatusLogs}
        logs={statusLogs}
        userName={selectedUser?.name}
        isLoading={loadingLogs}
      />
    </div>
  );
}
