
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import AuthHeader from "@/components/auth/AuthHeader";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Parse hash parameters from URL
      if (window.location.hash) {
        const hashParams: Record<string, string> = {};
        const hash = window.location.hash.substring(1);
        
        hash.split('&').forEach(pair => {
          if (pair && pair.includes('=')) {
            const [key, value] = pair.split('=');
            hashParams[key] = decodeURIComponent(value || '');
          }
        });
        
        // Check if this is a password recovery flow
        if (hashParams.type === 'recovery' && hashParams.access_token) {
          try {
            // Set session with the provided tokens
            await supabase.auth.setSession({
              access_token: hashParams.access_token,
              refresh_token: hashParams.refresh_token || '',
            });
            setLoading(false);
          } catch (error: any) {
            console.error("Error processing password reset:", error);
            setError("Link inválido ou expirado. Por favor, solicite um novo link de redefinição de senha.");
            setLoading(false);
          }
        } else {
          setError("Link inválido. Por favor, solicite um novo link de redefinição de senha.");
          setLoading(false);
        }
      } else {
        setError("Nenhum token de recuperação encontrado. Por favor, solicite um link de redefinição de senha.");
        setLoading(false);
      }
    };

    handlePasswordReset();
  }, [navigate]);

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
        
        {!error ? (
          <NewPasswordForm onSuccessCallback={() => navigate("/login")} />
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
