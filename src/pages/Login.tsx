
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { supabase } from "@/integrations/supabase/client";

// Interface para parâmetros de hash para evitar erros de TypeScript
interface HashParams {
  [key: string]: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: string;
  token_type?: string;
  type?: string;
}

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Debug: Registrar URL completa para solução de problemas
      console.log("URL atual:", window.location.href);
      console.log("Hash:", window.location.hash);
      console.log("Parâmetros de pesquisa:", window.location.search);
      
      // Verificar se temos um hash com um token de acesso ou erro
      if (window.location.hash) {
        console.log("Hash encontrado na URL");
        
        // Analisar parâmetros de hash
        const hashParams: HashParams = {};
        const hash = window.location.hash.substring(1);
        
        hash.split('&').forEach(pair => {
          if (pair && pair.includes('=')) {
            const [key, value] = pair.split('=');
            hashParams[key] = decodeURIComponent(value || '');
          }
        });
        
        console.log("Parâmetros de hash analisados:", hashParams);
        
        // Verificar se é um tipo de recuperação
        if (hashParams.type === 'recovery') {
          console.log("Este é um fluxo de recuperação de senha");
          
          try {
            // Definir o formulário para o modo de nova senha
            setIsSettingNewPassword(true);
            
            // Verificar se temos o token de acesso
            if (hashParams.access_token) {
              console.log("Token de acesso encontrado, configurando sessão");
              
              // Configurar a sessão com os parâmetros
              await supabase.auth.setSession({
                access_token: hashParams.access_token,
                refresh_token: hashParams.refresh_token || '',
              });
              
              toast({
                title: "Redefinição de senha",
                description: "Agora você pode definir uma nova senha."
              });
            } else {
              console.error("Token de acesso não encontrado nos parâmetros de hash da URL");
              toast({
                title: "Erro na redefinição de senha",
                description: "Link inválido ou expirado. Por favor, solicite um novo link.",
                variant: "destructive",
              });
              setIsSettingNewPassword(false);
            }
          } catch (error: any) {
            console.error("Erro ao processar redefinição de senha:", error);
            toast({
              title: "Erro na redefinição de senha",
              description: error.message || "Ocorreu um erro ao processar sua solicitação.",
              variant: "destructive",
            });
            
            // Redefinir para o formulário de login em caso de erro
            setIsSettingNewPassword(false);
          }
        } else if (hashParams.type === 'signup') {
          // Esta é uma confirmação de inscrição
          console.log("Este é um fluxo de confirmação de inscrição");
          
          try {
            // Se tivermos o token de acesso, o usuário confirmou seu email
            if (hashParams.access_token) {
              toast({
                title: "Cadastro confirmado!",
                description: "Seu email foi confirmado com sucesso. Você já pode fazer login.",
              });
            }
          } catch (error: any) {
            console.error("Erro ao processar confirmação de cadastro:", error);
          }
        }
      }
      
      // Verificar parâmetros de consulta para 'type=recovery'
      const searchParams = new URLSearchParams(window.location.search);
      const resetType = searchParams.get('type');
      
      if (resetType === 'recovery') {
        setIsResettingPassword(true);
      }
      
      // Tratar erro de token expirado ou inválido dos parâmetros de consulta
      const errorCode = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (errorCode) {
        console.error("Erro nos parâmetros de consulta:", errorCode, errorDescription);
        toast({
          title: "Link expirado ou inválido",
          description: errorDescription || "O link de redefinição de senha expirou ou é inválido. Por favor, solicite um novo link.",
          variant: "destructive",
        });
      }
    };

    handlePasswordReset();
  }, [location, toast]);

  const getHeaderContent = () => {
    if (isSettingNewPassword) {
      return {
        title: "Definir Nova Senha",
        description: "Digite sua nova senha abaixo:"
      };
    } else if (isResettingPassword) {
      return {
        title: "Recuperar Senha",
        description: "Digite seu email para receber o link de recuperação"
      };
    } else if (isRegistering) {
      return {
        title: "Registro",
        description: "Crie sua conta para acessar o sistema"
      };
    } else {
      return {
        title: "Login",
        description: "Sistema Para Musicoterapeutas"
      };
    }
  };

  const renderForm = () => {
    if (isSettingNewPassword) {
      return <NewPasswordForm />;
    } else if (isResettingPassword) {
      return (
        <PasswordResetForm
          onSwitchToLogin={() => setIsResettingPassword(false)}
        />
      );
    } else if (isRegistering) {
      return (
        <RegisterForm
          onSwitchToLogin={() => setIsRegistering(false)}
        />
      );
    } else {
      return (
        <LoginForm
          onSwitchToRegister={() => setIsRegistering(true)}
          onSwitchToPasswordReset={() => setIsResettingPassword(true)}
        />
      );
    }
  };

  const { title, description } = getHeaderContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader title={title} description={description} />
        {renderForm()}
      </div>
    </div>
  );
}
