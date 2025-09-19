import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Profile, StatusLog } from "../types";

export function useUserActions() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showStatusLogs, setShowStatusLogs] = useState(false);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState<Record<string, boolean>>({});
  const [lastLogoutAttempts, setLastLogoutAttempts] = useState<Record<string, number>>({});

  const handleToggleStatus = async (user: Profile) => {
    // Prevent multiple simultaneous status changes
    if (loadingLogout[user.id]) {
      console.log('Status change already in progress for user:', user.id);
      return;
    }

    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      console.log(`Updating user ${user.id} status to:`, newStatus);
      
      const { error } = await supabase.rpc('update_user_status', {
        target_user_id: user.id,
        new_status: newStatus
      });

      if (error) {
        console.error('Error updating user status:', error.message);
        throw error;
      }

      // Update local cache immediately for better UX
      queryClient.setQueryData<Profile[]>(["users"], (oldData) => {
        return oldData?.map(u => {
          if (u.id === user.id) {
            return { ...u, status: newStatus };
          }
          return u;
        }) ?? [];
      });

      // Note: The database trigger will automatically force logout if user was deactivated
      // No need to call handleForceLogout here to avoid multiple logout calls
      
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

      if (logs.length > 0) {
        const changerIds = [...new Set(logs.map(log => log.changed_by))];
        const { data: changers, error: changersError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', changerIds);

        if (changersError) {
          console.error('Error fetching changer names:', changersError);
        } else {
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

      const { error: userRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (userRolesError) {
        console.error('Error deleting user roles:', userRolesError);
        throw userRolesError;
      }

      const { error: statusLogsError } = await supabase
        .from('user_status_logs')
        .delete()
        .eq('user_id', userId);

      if (statusLogsError) {
        console.error('Error deleting status logs:', statusLogsError);
        throw statusLogsError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      queryClient.setQueryData<Profile[]>(["users"], (oldData) => {
        return oldData?.filter(user => user.id !== userId) ?? [];
      });

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

  const handleForceLogout = async (userId: string, userName: string | null): Promise<void> => {
    // Prevent multiple simultaneous calls for the same user
    if (loadingLogout[userId]) {
      console.log('Logout already in progress for user:', userId);
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!userId || !uuidRegex.test(userId)) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID de usuário inválido",
      });
      console.error('Invalid user ID format:', userId);
      return;
    }

    // Rate limiting check - max 3 attempts per minute per user
    const now = Date.now();
    const lastAttempt = lastLogoutAttempts[userId];
    const RATE_LIMIT_DELAY = 20000; // 20 seconds between attempts
    
    if (lastAttempt && now - lastAttempt < RATE_LIMIT_DELAY) {
      toast({
        variant: "destructive",
        title: "Aguarde",
        description: "Aguarde antes de tentar novamente",
      });
      return;
    }

    setLastLogoutAttempts(prev => ({ ...prev, [userId]: now }));
    setLoadingLogout(prev => ({ ...prev, [userId]: true }));
    
    try {
      console.log('Forcing logout for user:', userId);
      
      const { error } = await supabase.rpc('force_user_logout', {
        target_user_id: userId
      });

      if (error) {
        console.error('Erro RPC force_user_logout:', error.message);
        throw error;
      }

      console.log('Force logout executado com sucesso');
      
      toast({
        title: "Logout forçado",
        description: `O usuário ${userName || 'selecionado'} foi desconectado com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['users'] });
      
    } catch (error) {
      console.error('Erro ao forçar logout:', error);
      
      let errorMessage = "Ocorreu um erro ao tentar forçar o logout do usuário.";
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          errorMessage = "Função de logout não encontrada. Entre em contato com o administrador.";
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao forçar logout",
        description: errorMessage,
      });
    } finally {
      // Always clear loading state with a small delay to prevent rapid successive calls
      setTimeout(() => {
        setLoadingLogout(prev => ({ ...prev, [userId]: false }));
      }, 1000);
    }
  };

  return {
    selectedUser,
    showStatusLogs,
    statusLogs,
    loadingLogs,
    loadingLogout,
    lastLogoutAttempts,
    setShowStatusLogs,
    handleToggleStatus,
    handleViewStatusLogs,
    handleDeleteUser,
    handleForceLogout
  };
}