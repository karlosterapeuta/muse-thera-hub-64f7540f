import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CreateUserData {
  name: string;
  email: string;
  role: 'admin' | 'professional';
  password?: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createUser = useMutation({
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

      return { 
        user: authData.user, 
        password, 
        isTemporaryPassword,
        userData: {
          name: userData.name,
          email: userData.email,
          role: userData.role
        }
      };
    },
    onSuccess: (data) => {
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

  return {
    createUser: createUser.mutateAsync,
    isLoading: createUser.isPending,
  };
}