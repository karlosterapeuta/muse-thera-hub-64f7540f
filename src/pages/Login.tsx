import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { supabase } from "@/integrations/supabase/client";

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
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        console.log("URL atual:", window.location.href);
        console.log("Hash:", window.location.hash);
        console.log("Parâmetros de pesquisa:", window.location.search);
        
        if (window.location.hash) {
          console.log("Hash encontrado na URL");
          
          const hashParams: HashParams = {};
          const hash = window.location.hash.substring(1);
          
          hash.split('&').forEach(pair => {
            if (pair && pair.includes('=')) {
              const [key, value] = pair.split('=');
              hashParams[key] = decodeURIComponent(value || '');
            }
          });
          
          console.log("Parâmetros de hash analisados:", hashParams);
          
          if (hashParams.type === 'recovery') {
            console.log("Este é um fluxo de recuperação de senha");
            
            try {
              if (hashParams.access_token) {
                console.log("Token de acesso encontrado, configurando sessão");
                
                await supabase.auth.setSession({
                  access_token: hashParams.access_token,
                  refresh_token: hashParams.refresh_token || '',
                });
                
                setIsSettingNewPassword(true);
                
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
              }
            } catch (error: any) {
              console.error("Erro ao processar redefinição de senha:", error);
              toast({
                title: "Erro na redefinição de senha",
                description: error.message || "Ocorreu um erro ao processar sua solicitação.",
                variant: "destructive",
              });
            }
          } else if (hashParams.type === 'signup') {
            console.log("Este é um fluxo de confirmação de inscrição");
            
            try {
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
        
        const searchParams = new URLSearchParams(window.location.search);
        const resetType = searchParams.get('type');
        
        if (resetType === 'recovery') {
          setIsResettingPassword(true);
        }
        
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
      } finally {
        setIsProcessingToken(false);
      }
    };

    handlePasswordReset();
  }, [location, toast]);

  if (isProcessingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderForm = () => {
    if (isSettingNewPassword) {
      return <NewPasswordForm onSuccessCallback={() => {
        setIsSettingNewPassword(false);
        window.history.replaceState(null, '', window.location.pathname);
      }} />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {renderForm()}
        </div>
      </div>

      {/* Right side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-white relative">
        <div className="text-center max-w-2xl">
          {/* Header */}
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Seja bem-vindo ao MuseTera!
          </h1>
          <p className="text-gray-600 text-lg mb-12">
            A solução mais completa e segura em musicoterapia<br />
            e serviços terapêuticos.
          </p>
          
          {/* Security Shield Icon */}
          <div className="absolute top-8 right-8">
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <span className="text-blue-600 text-2xl font-bold">$</span>
          </div>

          {/* Devices Section */}
          <div className="relative">
            {/* Laptop */}
            <div className="relative mx-auto" style={{ width: '400px', height: '250px' }}>
              <div className="absolute inset-0 bg-gray-800 rounded-t-lg" style={{ height: '85%' }}>
                <div className="p-4 h-full bg-white rounded-t-lg m-2">
                  <img 
                    src="/lovable-uploads/1348d6f9-1270-4ad5-9dff-9ab07c0e92b1.png"
                    alt="MuseTera Dashboard"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-800 rounded-b-lg"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-700 rounded-full"></div>
            </div>

            {/* Mobile Phone */}
            <div className="absolute -bottom-12 -right-8" style={{ width: '120px', height: '200px' }}>
              <div className="w-full h-full bg-blue-600 rounded-3xl p-2">
                <div className="w-full h-full bg-white rounded-2xl p-2">
                  <img 
                    src="/lovable-uploads/ee49096e-05e2-47e5-9605-999a529e68b3.png"
                    alt="MuseTera Mobile"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
