
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
import { CreateUserDialog } from "./components/CreateUserDialog";
import { UserDetailsDialog } from "./components/UserDetailsDialog";
import { useUsers } from "./hooks/useUsers";
import { useUserActions } from "./hooks/useUserActions";
import { useExpiringUsers } from "./hooks/useExpiringUsers";
import { Profile } from "./types";
import { ExpirationBanner } from "./components/ExpirationBanner";
import { UserAnalyticsDashboard } from "./components/UserAnalyticsDashboard";

export default function Users() {
  const { data: users, isLoading } = useUsers();
  const { data: isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { data: expiringUsers = [] } = useExpiringUsers(7);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expirationFilter, setExpirationFilter] = useState("all");
  const [planTypeFilter, setPlanTypeFilter] = useState("all");
  const [detailsUser, setDetailsUser] = useState<Profile | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Helper function to calculate plan type based on duration
  const getPlanType = (profile: { expires_at?: string | null; plan_start_date?: string | null }): string => {
    if (!profile.expires_at || !profile.plan_start_date) {
      return 'unlimited';
    }
    
    const start = new Date(profile.plan_start_date);
    const end = new Date(profile.expires_at);
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Tolerance of +/- 5 days for month variations
    if (diffDays >= 25 && diffDays <= 35) return '30-days';
    if (diffDays >= 175 && diffDays <= 195) return '6-months';
    if (diffDays >= 355 && diffDays <= 380) return '12-months';
    
    return 'other';
  };
  
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

  const handleViewDetails = (user: Profile) => {
    setDetailsUser(user);
    setShowDetailsDialog(true);
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.user_roles?.[0]?.role === roleFilter;
      
      // Expiration filter logic
      let matchesExpiration = true;
      if (expirationFilter !== "all") {
        const now = new Date();
        
        if (expirationFilter === "unlimited") {
          matchesExpiration = !user.expires_at;
        } else if (expirationFilter === "expired") {
          matchesExpiration = user.expires_at ? new Date(user.expires_at) < now : false;
        } else if (expirationFilter === "expiring_7") {
          if (!user.expires_at) {
            matchesExpiration = false;
          } else {
            const expiration = new Date(user.expires_at);
            const daysUntil = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            matchesExpiration = daysUntil > 0 && daysUntil <= 7;
          }
        } else if (expirationFilter === "expiring_30") {
          if (!user.expires_at) {
            matchesExpiration = false;
          } else {
            const expiration = new Date(user.expires_at);
            const daysUntil = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            matchesExpiration = daysUntil > 7 && daysUntil <= 30;
          }
        } else if (expirationFilter === "active") {
          matchesExpiration = !user.expires_at || new Date(user.expires_at) >= now;
        }
      }
      
      // Plan type filter logic
      let matchesPlanType = true;
      if (planTypeFilter !== "all") {
        matchesPlanType = getPlanType(user) === planTypeFilter;
      }
      
      return matchesSearch && matchesStatus && matchesRole && matchesExpiration && matchesPlanType;
    });
  }, [users, searchTerm, statusFilter, roleFilter, expirationFilter, planTypeFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setExpirationFilter("all");
    setPlanTypeFilter("all");
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
      <div className="w-full px-2 sm:px-3 py-4 sm:py-6">
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para acessar este recurso.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-3 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Gestão de Usuários</h1>
        <CreateUserDialog />
      </div>
      
      <ExpirationBanner expiringUsers={expiringUsers} days={7} />
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Usuários inativos não podem fazer login. Usuários com sessão ativa serão desconectados automaticamente quando desativados.
        </AlertDescription>
      </Alert>

      <UserAnalyticsDashboard />

      <UserStats users={users || []} />
      
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          expirationFilter={expirationFilter}
          onExpirationFilterChange={setExpirationFilter}
          planTypeFilter={planTypeFilter}
          onPlanTypeFilterChange={setPlanTypeFilter}
          onClearFilters={handleClearFilters}
        />
      
      <UsersTable 
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onViewStatusLogs={handleViewStatusLogs}
        onDeleteUser={handleDeleteUser}
        onForceLogout={handleForceLogout}
        onViewDetails={handleViewDetails}
        loadingLogout={loadingLogout}
      />

      <StatusLogsDialog 
        isOpen={showStatusLogs}
        onOpenChange={setShowStatusLogs}
        logs={statusLogs}
        userName={selectedUser?.name}
        isLoading={loadingLogs}
      />

      <UserDetailsDialog
        user={detailsUser}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
}
