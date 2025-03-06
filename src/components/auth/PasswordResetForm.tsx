
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
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the application URL - use the deployed URL if available, otherwise use current origin
      const siteUrl = window.location.origin;
      
      // Log the redirect URL for debugging
      console.log("Using redirect URL:", `${siteUrl}/login`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      onSwitchToLogin();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        {isLoading ? "Carregando..." : "Enviar email de recuperação"}
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
