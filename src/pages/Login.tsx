
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      const hash = location.hash;
      try {
        // Handle the recovery link (type=recovery)
        if (hash && hash.includes('type=recovery')) {
          setIsSettingNewPassword(true);
          
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (!accessToken) {
            throw new Error("Token de acesso não encontrado");
          }
          
          toast({
            title: "Redefina sua senha",
            description: "Por favor, digite uma nova senha."
          });
        } 
        // Handle expired or invalid token error
        else if (hash && hash.includes('error=access_denied')) {
          toast({
            title: "Link expirado",
            description: "O link de redefinição de senha expirou ou é inválido. Por favor, solicite um novo link.",
            variant: "destructive",
          });
        }
        // Handle recovery token directly
        else if (hash && hash.includes('access_token') && hash.includes('type=recovery')) {
          setIsSettingNewPassword(true);
          
          toast({
            title: "Redefina sua senha",
            description: "Por favor, digite uma nova senha."
          });
        }
      } catch (error: any) {
        console.error("Erro ao processar redefinição de senha:", error);
        toast({
          title: "Erro na redefinição de senha",
          description: error.message,
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
