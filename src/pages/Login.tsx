
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { supabase } from "@/integrations/supabase/client";

// Define interface for hash parameters to avoid TypeScript errors
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
      // Debug: Log the full URL for troubleshooting
      console.log("Current URL:", window.location.href);
      console.log("Hash:", window.location.hash);
      console.log("Search params:", window.location.search);
      
      // First check if we have a hash with an access token or error
      if (window.location.hash) {
        console.log("Found hash in URL");
        
        // Parse hash parameters
        const hashParams: HashParams = {};
        const hash = window.location.hash.substring(1);
        
        hash.split('&').forEach(pair => {
          if (pair && pair.includes('=')) {
            const [key, value] = pair.split('=');
            hashParams[key] = decodeURIComponent(value || '');
          }
        });
        
        console.log("Parsed hash params:", hashParams);
        
        // Check if this is a recovery type
        if (hashParams.type === 'recovery') {
          console.log("This is a password recovery flow");
          
          try {
            // Set the form to new password mode
            setIsSettingNewPassword(true);
            
            // Check if we have the access token
            if (hashParams.access_token) {
              console.log("Found access token, setting session");
              
              // Set the session with the parameters
              await supabase.auth.setSession({
                access_token: hashParams.access_token,
                refresh_token: hashParams.refresh_token || '',
              });
              
              toast({
                title: "Redefinição de senha",
                description: "Agora você pode definir uma nova senha."
              });
            } else {
              console.error("Access token not found in URL hash parameters");
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
            
            // Reset to login form on error
            setIsSettingNewPassword(false);
          }
        } else if (hashParams.type === 'signup') {
          // This is a signup confirmation
          console.log("This is a signup confirmation flow");
          
          try {
            // If we have the access token, the user has confirmed their email
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
      
      // Handle expired or invalid token error from query parameters
      const searchParams = new URLSearchParams(window.location.search);
      const errorCode = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (errorCode) {
        console.error("Error in query params:", errorCode, errorDescription);
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
