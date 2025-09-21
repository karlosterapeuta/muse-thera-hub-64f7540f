import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SessionStatus } from '../types';

export function useUpdateSessionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, status }: { recordId: string; status: SessionStatus }) => {
      const { data, error } = await supabase
        .from('financial_records')
        .update({ session_status: status })
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch financial records
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
      
      const statusLabels = {
        scheduled: 'agendada',
        completed: 'concluída',
        no_show: 'faltou'
      };
      
      toast({
        title: "Status atualizado",
        description: `Sessão marcada como ${statusLabels[variables.status]}.`,
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error updating session status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da sessão.",
        variant: "destructive",
      });
    }
  });
}