
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdmin } from "@/hooks/use-admin";
import { StatusLogsDialog } from "./components/StatusLogsDialog";
import { UsersTable } from "./components/UsersTable";
import { UserFilters } from "./components/UserFilters";
import { UserStats } from "./components/UserStats";
import { useUsers } from "./hooks/useUsers";
import { useUserActions } from "./hooks/useUserActions";

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const { data: isAdmin } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const {
    selectedUser,
    showStatusLogs,
    statusLogs,
    loadingLogs,
    loadingLogout,
    setShowStatusLogs,
    handleToggleStatus,
    handleViewStatusLogs,
    handleDeleteUser,
    handleForceLogout
  } = useUserActions();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      const matchesRole = roleFilter === "all" || 
        user.user_roles?.[0]?.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
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
      <h1 className="text-2xl font-bold mb-6 text-primary">Gestão de Usuários</h1>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Usuários inativos não podem fazer login. Usuários com sessão ativa serão desconectados automaticamente quando desativados.
        </AlertDescription>
      </Alert>

      <UserStats users={users || []} />
      
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onClearFilters={handleClearFilters}
      />
      
      <UsersTable 
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onViewStatusLogs={handleViewStatusLogs}
        onDeleteUser={handleDeleteUser}
        onForceLogout={handleForceLogout}
        loadingLogout={loadingLogout}
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
