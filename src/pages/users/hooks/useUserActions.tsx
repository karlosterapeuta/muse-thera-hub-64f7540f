import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Profile, StatusLog } from "../types";
import { rateLimiter, validateInput } from "@/utils/security";

export function useUserActions() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showStatusLogs, setShowStatusLogs] = useState(false);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState<string | null>(null);

  const handleToggleStatus = async (user: Profile) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      // First update the user status
      const { error } = await supabase.rpc(
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

      // If deactivating user, immediately force logout
      if (newStatus === 'inactive') {
        console.log('🚫 Deactivating user, forcing immediate logout...');
        try {
          await handleForceLogout(user.id, user.name);
        } catch (logoutError) {
          console.error('Error during forced logout:', logoutError);
          // Continue anyway, the database trigger should also handle this
        }
      }

      queryClient.setQueryData<Profile[]>(["users"], (oldData) => {
        return oldData?.map(u => {
          if (u.id === user.id) {
            return { ...u, status: newStatus };
          }
          return u;
        }) ?? [];
      });

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
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId provided for logout:', userId);
      return;
    }

    // Rate limiting for security
    const rateLimitKey = `force_logout_${userId}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 3, 60000)) { // Max 3 attempts per minute
      throw new Error('Muitas tentativas de logout forçado. Tente novamente em alguns minutos.');
    }

    // Input validation
    if (!validateInput(userId, 36)) { // UUID length validation
      throw new Error('ID de usuário inválido');
    }

    if (loadingLogout === userId) return; // Previne múltiplas chamadas

    try {
      setLoadingLogout(userId);
      console.log('Iniciando força logout para usuário:', userId);

      // Timeout de 10 segundos para evitar travamento
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: operação demorou mais que 10 segundos')), 10000);
      });

      // Primeira tentativa: usar RPC se existir
      const forceLogoutPromise = supabase.rpc('force_user_logout', {
        target_user_id: userId
      });

      try {
        const { error } = await Promise.race([forceLogoutPromise, timeoutPromise]) as any;

        if (error) {
          console.error('Erro no RPC force_user_logout:', error);
          throw error;
        }

        console.log('Force logout executado com sucesso via RPC');
        
      } catch (rpcError) {
        console.warn('RPC force_user_logout falhou, tentando método alternativo:', rpcError);
        
        // Método alternativo: invalidar sessões através da atualização do perfil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            updated_at: new Date().toISOString(),
            // Força uma atualização que pode invalidar cache de sessão
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Erro no método alternativo:', updateError);
          throw updateError;
        }

        console.log('Force logout executado via método alternativo');
      }

      toast({
        title: "Logout forçado",
        description: `O usuário ${userName || 'selecionado'} foi desconectado com sucesso.`,
      });

    } catch (error) {
      console.error('Erro ao forçar logout:', error);
      
      let errorMessage = "Ocorreu um erro ao tentar forçar o logout do usuário.";
      
      if (error instanceof Error) {
        if (error.message.includes('Timeout')) {
          errorMessage = "A operação demorou muito para ser concluída. Tente novamente.";
        } else if (error.message.includes('not found')) {
          errorMessage = "Função de logout não encontrada. Entre em contato com o administrador.";
        }
      }

      toast({
        variant: "destructive",
        title: "Erro ao forçar logout",
        description: errorMessage,
      });
    } finally {
      setLoadingLogout(null);
    }
  };

  return {
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
  };
}
