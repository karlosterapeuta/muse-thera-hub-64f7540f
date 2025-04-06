
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasValidToken, setHasValidToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Log the current URL for debugging
        console.log("Current URL:", window.location.href);
        console.log("Hash part:", window.location.hash);
        
        // Check if this is a password recovery flow from URL hash params
        if (window.location.hash) {
          const hashParams: Record<string, string> = {};
          const hash = window.location.hash.substring(1);
          
          hash.split('&').forEach(pair => {
            if (pair && pair.includes('=')) {
              const [key, value] = pair.split('=');
              hashParams[key] = decodeURIComponent(value || '');
            }
          });
          
          console.log("Parsed hash parameters:", hashParams);
          
          if (hashParams.type === 'recovery' && hashParams.access_token) {
            try {
              // Set the session with the recovery tokens
              await supabase.auth.setSession({
                access_token: hashParams.access_token,
                refresh_token: hashParams.refresh_token || '',
              });
              
              console.log("Session set successfully with recovery tokens");
              setHasValidToken(true);
              setLoading(false);
            } catch (error: any) {
              console.error("Error setting recovery session:", error);
              setError("Link inválido ou expirado. Por favor, solicite um novo link de redefinição de senha.");
              toast({
                title: "Erro",
                description: "Link inválido ou expirado. Por favor, solicite um novo link de redefinição de senha.",
                variant: "destructive",
              });
              setLoading(false);
            }
          } else {
            console.error("Invalid hash parameters", hashParams);
            setError("Link inválido. Por favor, solicite um novo link de redefinição de senha.");
            toast({
              title: "Erro",
              description: "Link inválido. Por favor, solicite um novo link de redefinição de senha.",
              variant: "destructive",
            });
            setLoading(false);
          }
        } else {
          console.error("No hash parameters found in URL");
          setError("Nenhum token de recuperação encontrado. Por favor, solicite um link de redefinição de senha.");
          toast({
            title: "Erro",
            description: "Nenhum token de recuperação encontrado. Por favor, solicite um link de redefinição de senha.",
            variant: "destructive",
          });
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Unexpected error processing reset:", error);
        setError("Ocorreu um erro ao processar seu link. Por favor, tente novamente ou solicite um novo link.");
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao processar seu link. Por favor, tente novamente ou solicite um novo link.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    handlePasswordReset();
    
    // Cleanup function to handle component unmounting gracefully
    return () => {
      // Any cleanup needed
    };
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Processando seu link de recuperação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader 
          title="Definir Nova Senha" 
          description={error || "Digite sua nova senha abaixo:"}
        />
        
        {hasValidToken ? (
          <NewPasswordForm onSuccessCallback={() => {
            toast({
              title: "Sucesso!",
              description: "Sua senha foi atualizada com sucesso. Você será redirecionado para a página de login.",
            });
            setTimeout(() => navigate("/login"), 2000);
          }} />
        ) : (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80"
            >
              Voltar para o login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
