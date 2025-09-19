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

      // Chamar Edge Function com Service Role que cria usuário e registra perfil/role
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password,
          isTemporaryPassword,
        },
      });

      if (error) throw error;
      if (!data?.user) throw new Error('Usuário não foi criado');

      return {
        user: data.user,
        password,
        isTemporaryPassword,
        userData: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      
      // Extract error message from Supabase function response
      let errorMessage = "Erro desconhecido ao criar usuário";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const createUserAction = async (userData: CreateUserData) => {
    return await createUser.mutateAsync(userData);
  };

  return {
    createUser: createUserAction,
    isLoading: createUser.isPending,
  };
}