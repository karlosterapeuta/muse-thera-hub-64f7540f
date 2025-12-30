import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useAccessManagement() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is admin - admins cannot have their access modified
  const checkIsAdmin = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    
    return !!data;
  };

  const blockAdminAction = () => {
    toast({
      variant: "destructive",
      title: "Ação não permitida",
      description: "Não é possível alterar o acesso do administrador do sistema.",
    });
    return false;
  };

  const renewPlan = async (userId: string, userName: string | null, days: number) => {
    // Check if user is admin first
    if (await checkIsAdmin(userId)) {
      return blockAdminAction();
    }
    setIsLoading(true);
    try {
      // Get current expiration date
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('expires_at')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Calculate new expiration date
      const baseDate = profile.expires_at 
        ? new Date(profile.expires_at) 
        : new Date();
      
      // If expired or no expiration, start from today
      const startDate = profile.expires_at && new Date(profile.expires_at) > new Date()
        ? new Date(profile.expires_at)
        : new Date();
      
      const newExpiresAt = new Date(startDate);
      newExpiresAt.setDate(newExpiresAt.getDate() + days);

      const { error } = await supabase.rpc('update_user_expiration', {
        target_user_id: userId,
        new_expires_at: newExpiresAt.toISOString()
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Plano renovado",
        description: `O plano de ${userName} foi renovado por ${days} dias.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error renewing plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao renovar plano",
        description: error.message || "Ocorreu um erro ao tentar renovar o plano.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const extendAccess = async (userId: string, userName: string | null, newDate: Date) => {
    // Check if user is admin first
    if (await checkIsAdmin(userId)) {
      return blockAdminAction();
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('update_user_expiration', {
        target_user_id: userId,
        new_expires_at: newDate.toISOString()
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Acesso estendido",
        description: `O acesso de ${userName} foi estendido até ${newDate.toLocaleDateString('pt-BR')}.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error extending access:', error);
      toast({
        variant: "destructive",
        title: "Erro ao estender acesso",
        description: error.message || "Ocorreu um erro ao tentar estender o acesso.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const makeUnlimited = async (userId: string, userName: string | null) => {
    // Check if user is admin first
    if (await checkIsAdmin(userId)) {
      return blockAdminAction();
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('update_user_expiration', {
        target_user_id: userId,
        new_expires_at: null
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Plano ilimitado",
        description: `O plano de ${userName} agora é ilimitado.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error making unlimited:', error);
      toast({
        variant: "destructive",
        title: "Erro ao tornar ilimitado",
        description: error.message || "Ocorreu um erro ao tentar tornar o plano ilimitado.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setLimit = async (userId: string, userName: string | null, expirationDate: Date) => {
    // Check if user is admin first
    if (await checkIsAdmin(userId)) {
      return blockAdminAction();
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('update_user_expiration', {
        target_user_id: userId,
        new_expires_at: expirationDate.toISOString()
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "Limite definido",
        description: `O plano de ${userName} expira em ${expirationDate.toLocaleDateString('pt-BR')}.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error setting limit:', error);
      toast({
        variant: "destructive",
        title: "Erro ao definir limite",
        description: error.message || "Ocorreu um erro ao tentar definir o limite.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const configurePlan = async (
    userId: string, 
    userName: string | null, 
    startDate: Date, 
    planType: '30-days' | '6-months' | '1-year'
  ) => {
    // Check if user is admin first
    if (await checkIsAdmin(userId)) {
      return blockAdminAction();
    }
    
    setIsLoading(true);
    try {
      // Calculate expiration date based on start date and plan type
      const expirationDate = new Date(startDate);
      
      switch (planType) {
        case '30-days':
          expirationDate.setDate(expirationDate.getDate() + 30);
          break;
        case '6-months':
          expirationDate.setDate(expirationDate.getDate() + 180);
          break;
        case '1-year':
          expirationDate.setDate(expirationDate.getDate() + 365);
          break;
      }

      // Update plan_start_date and expires_at
      const { error } = await supabase
        .from('profiles')
        .update({
          plan_start_date: startDate.toISOString(),
          expires_at: expirationDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["users"] });

      const planLabels = {
        '30-days': '30 dias',
        '6-months': '6 meses',
        '1-year': '1 ano'
      };

      toast({
        title: "Plano configurado",
        description: `Plano de ${planLabels[planType]} aplicado para ${userName}. Expira em ${expirationDate.toLocaleDateString('pt-BR')}.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error configuring plan:', error);
      toast({
        variant: "destructive",
        title: "Erro ao configurar plano",
        description: error.message || "Ocorreu um erro ao tentar configurar o plano.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    renewPlan,
    extendAccess,
    makeUnlimited,
    setLimit,
    configurePlan
  };
}
