
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col lg:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-lg">
          {renderForm()}
        </div>
      </div>

      {/* Right side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 bg-white relative">
        <div className="text-center max-w-2xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-blue-600 mb-6">
              Seja bem-vindo ao MuseTera!
            </h1>
            <p className="text-gray-600 text-lg xl:text-xl leading-relaxed">
              A solução mais completa e segura em musicoterapia<br />
              e serviços terapêuticos.
            </p>
          </div>

          {/* Devices Section with better organization */}
          <div className="relative flex items-center justify-center">
            {/* Main Laptop Display */}
            <div className="relative z-10">
              <div className="bg-gray-800 rounded-t-xl p-3 shadow-2xl" style={{ width: '450px', height: '280px' }}>
                <div className="bg-white rounded-lg h-full p-4 overflow-hidden">
                  <img 
                    src="/lovable-uploads/f063cdb1-310e-48c3-8765-3ede078ec8c1.png"
                    alt="Processos Musicoterapêuticos"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </div>
              {/* Laptop base */}
              <div className="relative">
                <div className="bg-gray-800 h-6 rounded-b-xl mx-auto" style={{ width: '460px' }}></div>
                <div className="bg-gray-700 h-3 rounded-full mx-auto mt-1" style={{ width: '120px' }}></div>
              </div>
            </div>

            {/* Mobile Phone positioned better */}
            <div className="absolute -bottom-8 -right-16 z-20 transform rotate-12">
              <div className="bg-blue-600 rounded-3xl p-3 shadow-xl" style={{ width: '140px', height: '240px' }}>
                <div className="bg-white rounded-2xl h-full p-3 overflow-hidden">
                  <img 
                    src="/lovable-uploads/97952175-ee1b-403e-afb8-96f9556133c6.png"
                    alt="Atividades Musicoterapêuticas"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Tablet positioned on the left */}
            <div className="absolute -bottom-4 -left-20 z-15 transform -rotate-6">
              <div className="bg-gray-300 rounded-2xl p-2 shadow-lg" style={{ width: '180px', height: '240px' }}>
                <div className="bg-white rounded-xl h-full p-3 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-blue-600">
                      <div className="text-2xl mb-2">🎵</div>
                      <div className="text-sm font-medium">MuseTera</div>
                      <div className="text-xs">Mobile App</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features highlights */}
          <div className="mt-16 grid grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">🎼</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Processos</h3>
              <p className="text-sm text-gray-600">Completos</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Pacientes</h3>
              <p className="text-sm text-gray-600">Organizados</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Relatórios</h3>
              <p className="text-sm text-gray-600">Detalhados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
