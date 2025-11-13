
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AuthStatusChecker() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const checkIntervalRef = useRef<number | null>(null);

  // Função para verificar o status do usuário
  const checkUserStatus = async () => {
    try {
      // Obtém o usuário atual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Verifica se o usuário está expirado usando a função do banco
        const { data: isExpired, error: expiredError } = await supabase
          .rpc('is_user_access_expired', { user_id: session.user.id });

        if (expiredError) {
          console.error("Erro ao verificar expiração:", expiredError);
        }

        // Se o acesso expirou, atualiza o status para inactive
        if (isExpired) {
          console.log("⏰ Acesso do usuário expirado, fazendo logout...");
          
          // Atualiza o status para inactive
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ status: 'inactive' })
            .eq('id', session.user.id);

          if (updateError) {
            console.error("Erro ao atualizar status:", updateError);
          }

          // Limpa o intervalo
          if (checkIntervalRef.current) {
            window.clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
          
          // Faz logout imediatamente
          await supabase.auth.signOut();
          
          // Navega para a página de login
          navigate("/login");
          
          // Exibe mensagem de expiração
          toast({
            title: "⚠️ Acesso Bloqueado - Pagamento Pendente",
            description: "Seu acesso está suspenso por falta de pagamento. Para continuar usando o MuseTera, regularize sua situação financeira entrando em contato com o administrador ou através da área de pagamentos.",
            variant: "destructive",
            duration: 8000,
          });
          return;
        }

        // Verifica o status do usuário
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('status, expires_at')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao verificar status do usuário:", error);
          return;
        }
        
        // Log para debug
        if (profile?.expires_at) {
          const expiresAt = new Date(profile.expires_at);
          const now = new Date();
          const timeLeft = expiresAt.getTime() - now.getTime();
          console.log(`⏰ Tempo restante de acesso: ${Math.round(timeLeft / 1000 / 60)} minutos`);
        }

        // Se o usuário não estiver ativo, faz logout imediatamente
        if (profile && profile.status !== 'active') {
          // Limpa o intervalo
          if (checkIntervalRef.current) {
            window.clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
          
          // Faz logout imediatamente
          await supabase.auth.signOut();
          
          // Navega para a página de login
          navigate("/login");
          
          // Exibe uma mensagem
          toast({
            title: "⚠️ Acesso Bloqueado - Pagamento Pendente",
            description: "Seu acesso está suspenso por falta de pagamento. Para continuar usando o MuseTera, regularize sua situação financeira entrando em contato com o administrador ou através da área de pagamentos.",
            variant: "destructive",
            duration: 8000,
          });
        }
      }
    } catch (error) {
      console.error("Erro no AuthStatusChecker:", error);
    }
  };

  useEffect(() => {
    try {
      // Verifica imediatamente ao montar o componente
      checkUserStatus();
      
      // Configura verificação periódica - mais frequente para contas de teste
      const checkInterval = 1 * 60 * 1000; // 1 minuto para contas de teste
      checkIntervalRef.current = window.setInterval(checkUserStatus, checkInterval);
      console.log("🔄 AuthStatusChecker iniciado - verificação a cada 1 minuto");
    } catch (error) {
      console.error("Erro ao inicializar AuthStatusChecker:", error);
    }
    
    // Limpeza ao desmontar
    return () => {
      if (checkIntervalRef.current) {
        window.clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Este componente não renderiza nada visível
  return null;
}
