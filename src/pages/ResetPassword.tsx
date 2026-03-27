
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StarfieldBackground } from "@/components/auth/StarfieldBackground";
import { CosmicAmbientMusic } from "@/components/auth/CosmicAmbientMusic";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasValidToken, setHasValidToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        if (window.location.hash) {
          const hashParams: Record<string, string> = {};
          const hash = window.location.hash.substring(1);
          
          hash.split('&').forEach(pair => {
            if (pair && pair.includes('=')) {
              const [key, value] = pair.split('=');
              hashParams[key] = decodeURIComponent(value || '');
            }
          });
          
          if (hashParams.type === 'recovery' && hashParams.access_token) {
            try {
              await supabase.auth.setSession({
                access_token: hashParams.access_token,
                refresh_token: hashParams.refresh_token || '',
              });
              
              setHasValidToken(true);
              setLoading(false);
            } catch (error: any) {
              setError("Link inválido ou expirado. Solicite um novo link de redefinição.");
              toast({
                title: "Erro",
                description: "Link inválido ou expirado.",
                variant: "destructive",
              });
              setLoading(false);
            }
          } else {
            setError("Link inválido. Solicite um novo link de redefinição.");
            setLoading(false);
          }
        } else {
          setError("Nenhum token de recuperação encontrado. Solicite um link de redefinição.");
          setLoading(false);
        }
      } catch (error: any) {
        setError("Ocorreu um erro. Tente novamente ou solicite um novo link.");
        setLoading(false);
      }
    };

    handlePasswordReset();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <StarfieldBackground />
        <CosmicAmbientMusic />
        <div className="relative z-10 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground font-medium">Processando seu link de recuperação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarfieldBackground />
      <CosmicAmbientMusic />
      <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6">
        {hasValidToken ? (
          <NewPasswordForm onSuccessCallback={() => {
            toast({
              title: "Sucesso!",
              description: "Sua senha foi atualizada. Redirecionando para o login...",
            });
            setTimeout(() => navigate("/login"), 2000);
          }} />
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/lovable-uploads/musetera-logo-new.png"
                alt="MuseTera Logo"
                className="h-20 w-20"
              />
              <h2 className="text-2xl font-bold text-primary">MuseTera</h2>
            </div>

            <div className="relative w-full bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-destructive/20 p-6 sm:p-8 overflow-hidden">
              <div className="relative z-10 text-center space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{error}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 font-semibold hover:underline underline-offset-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
