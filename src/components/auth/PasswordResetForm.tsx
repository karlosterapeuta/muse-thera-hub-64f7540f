
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PasswordResetFormProps = {
  onSwitchToLogin: () => void;
};

export default function PasswordResetForm({ onSwitchToLogin }: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: "Email necessário",
        description: "Por favor, digite seu email para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Get the current origin for redirects
      const siteUrl = window.location.origin;
      console.log("Using site URL for password reset:", siteUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperação:", error);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email de recuperação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="mt-8 space-y-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-800">Email enviado!</h3>
          <p className="mt-2 text-sm text-green-700">
            Verifique sua caixa de entrada para o link de recuperação de senha.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onSwitchToLogin}
        >
          Voltar ao login
        </Button>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
      <div className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="seu@email.com"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Enviar link de recuperação"}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="block w-full text-sm text-primary hover:text-primary/80"
        >
          Voltar ao login
        </button>
      </div>
    </form>
  );
}
