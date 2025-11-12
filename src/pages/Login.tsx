
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
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
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated and redirect to dashboard
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/dashboard');
        return;
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && !isProcessingToken) {
        navigate('/dashboard');
      }
    });

    checkAuthState();

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

    return () => subscription.unsubscribe();
  }, [location, toast, navigate, isProcessingToken]);

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
    } else {
      return (
        <LoginForm
          onSwitchToPasswordReset={() => setIsResettingPassword(true)}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col xl:flex-row relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 md:-top-40 -left-20 md:-left-40 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 md:-bottom-40 -right-20 md:-right-40 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-r from-secondary/15 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 md:w-80 xl:w-[30rem] h-60 md:h-80 xl:h-[30rem] bg-gradient-to-r from-accent/8 to-secondary/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/4 w-36 md:w-72 h-36 md:h-72 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>

      {/* Left side - Login Form */}
      <div className="w-full xl:w-1/2 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-8 relative z-10 min-h-screen xl:min-h-auto">
        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl md:rounded-3xl blur-xl transform rotate-1"></div>
          <div className="relative bg-background/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-0.5 md:p-1">
            <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-background/90 dark:to-background/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              {renderForm()}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Video Section (Desktop Only) */}
      <div className="relative hidden xl:flex xl:w-1/2 items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/3 to-background overflow-hidden">
        {/* Overlay gradiente para melhor contraste */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10 pointer-events-none"></div>
        
        {/* Video de fundo - substitua o src quando tiver o vídeo real */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/assets/videos/musicotherapy-poster.jpg"
        >
          <source src="/assets/videos/musicotherapy-demo.mp4" type="video/mp4" />
          {/* Fallback: se o vídeo não carregar, mostra apenas o poster */}
        </video>

        {/* Overlay de conteúdo sobre o vídeo */}
        <div className="relative z-20 text-center max-w-lg xl:max-w-xl space-y-8 px-8 py-12">
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Musicoterapia
              <span className="block bg-gradient-to-r from-white via-primary/90 to-secondary bg-clip-text text-transparent">
                Inteligente
              </span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed font-medium">
              Transforme suas sessões com tecnologia e criatividade
            </p>
            
            {/* Features mini-list */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Gestão completa de pacientes</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Ferramentas interativas inovadoras</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Relatórios profissionais automatizados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decoração musical flutuante */}
        <div className="absolute top-20 right-32 text-white/30 text-4xl animate-bounce delay-300 z-20">♪</div>
        <div className="absolute bottom-32 left-32 text-white/30 text-3xl animate-bounce delay-1000 z-20">♫</div>
        <div className="absolute top-1/2 right-20 text-white/25 text-2xl animate-bounce delay-1500 z-20">♬</div>
      </div>
    </div>
  );
}
