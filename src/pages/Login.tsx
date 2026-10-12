
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import RegisterForm from "@/components/auth/RegisterForm";

import { StarfieldBackground } from "@/components/auth/StarfieldBackground";
import { CosmicAmbientMusic } from "@/components/auth/CosmicAmbientMusic";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ClipboardList, ChartNoAxesCombined, CalendarDays, ShieldCheck, Music2 } from "lucide-react";

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
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated and redirect to dashboard
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Validate profile status before redirecting
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('status, expires_at')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Error checking profile status:", error);
            navigate('/dashboard');
            return;
          }

          if (!profile) {
            // Profile not found - still navigate to dashboard, Layout will handle it
            navigate('/dashboard');
            return;
          }

          const isExpired = profile?.expires_at ? new Date(profile.expires_at) < new Date() : false;
          
          if (profile?.status !== 'active' || isExpired) {
            await supabase.auth.signOut();
            toast({
              title: "Acesso bloqueado - Pagamento pendente",
              description: "Sua conta está desativada por falta de pagamento. Regularize para voltar a usar o sistema.",
              variant: "destructive",
            });
            return;
          }
          
          navigate('/dashboard');
        } catch (error) {
          console.error("Error validating profile:", error);
          navigate('/dashboard');
        }
        return;
      }
    };

    // Set up auth state listener - NÃO navegar automaticamente no SIGNED_IN
    // O LoginForm.tsx vai controlar a navegação após verificar o status
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Apenas logar o evento, não navegar automaticamente
      // Isso evita race condition com o LoginForm que verifica o status
      console.log("Auth state changed:", event, session?.user?.id);
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
            
            if (hashParams.access_token) {
              try {
                // DECODE JWT locally WITHOUT consuming the token
                // JWT format: header.payload.signature (base64 encoded)
                const tokenParts = hashParams.access_token.split('.');
                
                if (tokenParts.length >= 2) {
                  // Decode the payload (second part) to get user_id
                  const payload = JSON.parse(atob(tokenParts[1]));
                  const userId = payload.sub; // 'sub' contains the user_id in Supabase JWTs
                  
                  console.log("Decoded user_id from JWT:", userId);
                  
                  if (userId) {
                    // Check if this user is a creator WITHOUT consuming the token
                    const { data: creator } = await supabase
                      .from('course_creators')
                      .select('id')
                      .eq('user_id', userId)
                      .maybeSingle();
                    
                    if (creator) {
                      // This is a creator - redirect with ORIGINAL hash (token NOT consumed)
                      console.log("User is a creator, redirecting to /creator-login with intact token");
                      window.location.replace(`/creator-login${window.location.hash}`);
                      return;
                    }
                  }
                }
                
                // NOT a creator - NOW we can consume the token
                console.log("User is not a creator, consuming token for normal flow");
                await supabase.auth.setSession({
                  access_token: hashParams.access_token,
                  refresh_token: hashParams.refresh_token || '',
                });
                
                setIsSettingNewPassword(true);
                
                toast({
                  title: "Redefinição de senha",
                  description: "Agora você pode definir uma nova senha."
                });
              } catch (error: any) {
                console.error("Erro ao processar redefinição de senha:", error);
                toast({
                  title: "Erro na redefinição de senha",
                  description: error.message || "Ocorreu um erro ao processar sua solicitação.",
                  variant: "destructive",
                });
              }
            } else {
              console.error("Token de acesso não encontrado nos parâmetros de hash da URL");
              toast({
                title: "Erro na redefinição de senha",
                description: "Link inválido ou expirado. Por favor, solicite um novo link.",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, toast, navigate]);

  if (isProcessingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground font-medium">Carregando...</p>
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
          onSwitchToPasswordReset={() => setIsResettingPassword(true)}
          onSwitchToRegister={() => setIsRegistering(true)}
        />
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#060c20] text-white">
      <StarfieldBackground />
      <CosmicAmbientMusic />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#061429]/90 via-[#07172d]/65 to-[#0b2034]/85" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1440px] items-center gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:gap-12 lg:px-12 xl:px-20">
        <section className="mx-auto hidden w-full max-w-xl lg:block" aria-label="Conheça o MuseTera">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-300/10 px-4 py-2 text-sm font-medium text-teal-100">
            <Music2 className="h-4 w-4" aria-hidden="true" />
            Tecnologia para a musicoterapia
          </div>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.12] tracking-tight text-white xl:text-6xl">
            Mais tempo para <span className="text-teal-300">cuidar.</span><br />
            Menos tempo com burocracia.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-200">
            Organize sua prática musicoterapêutica em um só lugar, do primeiro acolhimento ao acompanhamento da evolução.
          </p>
          <div className="mt-9 grid max-w-lg grid-cols-2 gap-3">
            {[
              { icon: ClipboardList, title: "Anamnese e avaliação", text: "Registros clínicos estruturados" },
              { icon: ChartNoAxesCombined, title: "Evolução e relatórios", text: "Acompanhe cada conquista" },
              { icon: CalendarDays, title: "Agenda e atendimentos", text: "Rotina mais organizada" },
              { icon: ShieldCheck, title: "Gestão profissional", text: "Informações em seu espaço de trabalho" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-sm">
                <Icon className="mb-3 h-5 w-5 text-teal-300" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-300">MuseTera · Anamnese, avaliação, plano terapêutico, intervenção e relatórios.</p>
        </section>
        <section className="mx-auto w-full max-w-[520px]" aria-label="Acesso à plataforma MuseTera">
          <div className="mb-5 text-center lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Gestão em musicoterapia</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Sua prática clínica, mais organizada.</h1>
            <p className="mt-2 text-sm text-slate-200">Anamnese, avaliação, evolução e relatórios em um só lugar.</p>
          </div>
          {renderForm()}
          <p className="mt-6 text-center text-xs text-slate-300">MuseTera · Gestão para musicoterapeutas</p>
        </section>
      </div>
    </main>
  );
}
