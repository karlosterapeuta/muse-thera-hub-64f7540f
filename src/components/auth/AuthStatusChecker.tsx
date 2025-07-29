
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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao verificar status do usuário:", error);
          return;
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
            title: "Sessão encerrada",
            description: "Sua conta está desativa. Entre em contato com o administrador.",
            variant: "destructive",
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
      
      // Configura verificação periódica a cada 5 minutos
      checkIntervalRef.current = window.setInterval(checkUserStatus, 5 * 60 * 1000);
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
