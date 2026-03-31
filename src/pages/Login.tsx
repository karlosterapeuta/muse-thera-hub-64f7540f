
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
import { Loader2 } from "lucide-react";

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
            .single();
          
          if (error) {
            console.error("Error checking profile status:", error);
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarfieldBackground />
      <CosmicAmbientMusic />
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6">
        {renderForm()}
      </div>
    </div>
  );
}
