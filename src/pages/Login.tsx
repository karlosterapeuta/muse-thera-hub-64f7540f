
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Get the full URL including hash
      const fullUrl = window.location.href;
      
      // Check if URL has recovery token parameters
      if (fullUrl.includes('type=recovery')) {
        try {
          // Set the form to new password mode
          setIsSettingNewPassword(true);
          
          // Parse hash parameters
          const hashParams = {};
          const hash = window.location.hash.substring(1);
          
          hash.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            hashParams[key] = decodeURIComponent(value);
          });
          
          // Check if we have the access token
          if (hashParams.access_token) {
            // Set the session with only the parameters that the type expects
            await supabase.auth.setSession({
              access_token: hashParams.access_token,
              refresh_token: hashParams.refresh_token || '',
            });
            
            toast({
              title: "Redefinição de senha",
              description: "Agora você pode definir uma nova senha."
            });
          }
        } catch (error: any) {
          console.error("Erro ao processar redefinição de senha:", error);
          toast({
            title: "Erro na redefinição de senha",
            description: error.message,
            variant: "destructive",
          });
          
          // Reset to login form on error
          setIsSettingNewPassword(false);
        }
      } 
      // Handle expired or invalid token error
      else if (location.hash && location.hash.includes('error=access_denied')) {
        toast({
          title: "Link expirado",
          description: "O link de redefinição de senha expirou ou é inválido. Por favor, solicite um novo link.",
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
        description: "Insira suas credenciais abaixo:"
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
