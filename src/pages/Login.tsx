
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

      {/* Right side - Enhanced Welcome Section */}
      <div className="relative hidden xl:flex xl:w-1/2 items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/3 to-background p-8 lg:p-12 xl:p-16 overflow-hidden">
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-secondary/8"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary)/0.1),transparent_50%)]"></div>
        
        {/* Musical Floating Elements */}
        <div className="absolute top-16 left-16 w-16 lg:w-20 xl:w-24 h-16 lg:h-20 xl:h-24 bg-gradient-to-br from-primary/25 to-secondary/25 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-14 lg:w-16 xl:w-20 h-14 lg:h-16 xl:h-20 bg-gradient-to-br from-secondary/25 to-primary/25 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-24 w-12 lg:w-14 xl:w-16 h-12 lg:h-14 xl:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-16 w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-md animate-pulse delay-700"></div>
        
        {/* Musical Notes Decoration */}
        <div className="absolute top-20 right-32 text-primary/20 text-2xl lg:text-3xl xl:text-4xl animate-bounce delay-300">♪</div>
        <div className="absolute bottom-32 left-32 text-secondary/20 text-xl lg:text-2xl xl:text-3xl animate-bounce delay-1000">♫</div>
        <div className="absolute top-1/2 right-20 text-primary/15 text-lg lg:text-xl xl:text-2xl animate-bounce delay-1500">♬</div>

        <div className="relative z-10 text-center max-w-lg xl:max-w-xl space-y-8 lg:space-y-10 animate-fade-in">
          {/* Main Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-foreground leading-tight tracking-tight">
                Revolucione sua
                <span className="block bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent text-4xl lg:text-5xl xl:text-6xl mt-2">
                  Musicoterapia
                </span>
              </h2>
              <p className="text-base lg:text-lg xl:text-xl text-muted-foreground/80 leading-relaxed font-medium">
                Descubra ferramentas inovadoras que transformam a experiência terapêutica através da música e tecnologia
              </p>
            </div>

            {/* Enhanced Device Mockup */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl lg:rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-white/15 backdrop-blur-2xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 xl:p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                {/* Browser Header */}
                <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                  <div className="w-3 lg:w-4 h-3 lg:h-4 bg-red-400 rounded-full shadow-sm"></div>
                  <div className="w-3 lg:w-4 h-3 lg:h-4 bg-yellow-400 rounded-full shadow-sm"></div>
                  <div className="w-3 lg:w-4 h-3 lg:h-4 bg-green-400 rounded-full shadow-sm"></div>
                  <div className="flex-1 h-2 lg:h-3 bg-white/20 rounded-full ml-3 lg:ml-4"></div>
                </div>
                
                {/* Content Bars with Musical Theme */}
                <div className="space-y-3 lg:space-y-4">
                  <div className="h-3 lg:h-4 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full shadow-sm"></div>
                  <div className="h-3 lg:h-4 bg-gradient-to-r from-secondary/40 to-primary/40 rounded-full w-4/5 shadow-sm"></div>
                  <div className="h-3 lg:h-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full w-3/5 shadow-sm"></div>
                  <div className="grid grid-cols-3 gap-2 lg:gap-3 mt-4 lg:mt-6">
                    <div className="h-6 lg:h-8 bg-gradient-to-b from-primary/40 to-primary/20 rounded-lg"></div>
                    <div className="h-8 lg:h-12 bg-gradient-to-b from-secondary/40 to-secondary/20 rounded-lg"></div>
                    <div className="h-4 lg:h-6 bg-gradient-to-b from-primary/30 to-primary/15 rounded-lg"></div>
                  </div>
                </div>
                
                {/* Floating Chart Element */}
                <div className="absolute -top-2 lg:-top-3 -right-2 lg:-right-3 w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm shadow-lg">
                  ♪
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Features List */}
          <div className="space-y-4 lg:space-y-6">
            <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4 lg:mb-6">Recursos Exclusivos</h3>
            <div className="space-y-3 lg:space-y-5">
              <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-2.5 lg:w-3 h-2.5 lg:h-3 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                <span className="text-sm lg:text-base text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">Interface intuitiva e moderna</span>
              </div>
              
              <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-2.5 lg:w-3 h-2.5 lg:h-3 bg-gradient-to-r from-secondary to-primary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                <span className="text-sm lg:text-base text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">Relatórios profissionais automatizados</span>
              </div>
              
              <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-2.5 lg:w-3 h-2.5 lg:h-3 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                <span className="text-sm lg:text-base text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">Ferramentas interativas inovadoras</span>
              </div>
              
              <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-2.5 lg:w-3 h-2.5 lg:h-3 bg-gradient-to-r from-secondary to-primary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                <span className="text-sm lg:text-base text-muted-foreground font-semibold group-hover:text-foreground transition-colors duration-300">Análise de dados avançada</span>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="pt-4 lg:pt-6 border-t border-white/20">
              <p className="text-primary font-bold text-base lg:text-lg">
                Junte-se a milhares de profissionais
              </p>
              <p className="text-muted-foreground/70 text-xs lg:text-sm mt-1">
                Transformando vidas através da música
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
