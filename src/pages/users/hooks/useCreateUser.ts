import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CreateUserData {
  name: string;
  email: string;
  role: 'admin' | 'professional';
  method: 'direct' | 'invite';
  password?: string;
}

export function useCreateUser() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDirectUser = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      // Usar senha fornecida ou gerar uma temporária
      const password = userData.password || Math.random().toString(36).slice(-12) + 'A1!';
      const isTemporaryPassword = !userData.password;
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: password,
        user_metadata: {
          name: userData.name
        },
        email_confirm: true
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Usuário não foi criado');

      // Criar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name
        });

      if (profileError) throw profileError;

      // Criar role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: userData.role
        });

      if (roleError) throw roleError;

      return { user: authData.user, password, isTemporaryPassword };
    },
    onSuccess: (data, variables) => {
      const passwordMessage = data.isTemporaryPassword 
        ? `Senha temporária: ${data.password}`
        : 'Senha definida conforme especificado';
        
      toast({
        title: "Usuário criado com sucesso!",
        description: `${variables.name} foi adicionado ao sistema. ${passwordMessage}`,
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateInviteCode = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data, error } = await supabase.rpc('generate_invite_code', {
        expiration_days: 7
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setInviteCode(data);
      setShowInviteCode(true);
      toast({
        title: "Código de convite gerado!",
        description: "Compartilhe o link com o novo usuário.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar código de convite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = async (userData: CreateUserData) => {
    if (userData.method === 'direct') {
      await createDirectUser.mutateAsync(userData);
    } else {
      await generateInviteCode.mutateAsync(userData);
    }
  };

  const closeInviteCode = () => {
    setShowInviteCode(false);
    setInviteCode(null);
  };

  return {
    createUser: handleCreateUser,
    isLoading: createDirectUser.isPending || generateInviteCode.isPending,
    inviteCode,
    showInviteCode,
    closeInviteCode,
  };
}