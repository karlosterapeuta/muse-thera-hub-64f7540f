
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "./GradientButton";
import { Mail, ArrowLeft, CheckCircle2, Music } from "lucide-react";

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
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error("Error sending reset password email:", error);
      
      let errorMsg = "Não foi possível enviar o email de recuperação.";
      
      if (error.message?.includes("User not found")) {
        errorMsg = "Não foi encontrado nenhum usuário com este email.";
      } else if (error.message?.includes("rate limit") || error.message?.includes("rate_limit")) {
        errorMsg = "Você já solicitou a recuperação recentemente. Aguarde alguns minutos e verifique sua caixa de entrada (incluindo spam).";
      } else if (error.status === 0 || error.message?.includes("Failed to fetch")) {
        errorMsg = "Erro de conexão. Tente novamente no site publicado ou verifique sua internet.";
      }
      
      toast({
        title: "Erro ao enviar email",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/assets-uploads/musetera-logo-new.png"
            alt="MuseTera Logo"
            className="h-20 w-20"
          />
          <h2 className="text-2xl font-bold text-primary">MuseTera</h2>
        </div>

        {/* Success Card */}
        <div className="relative w-full bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/20 p-6 sm:p-8 overflow-hidden">
          <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-tl-3xl blur-2xl"></div>
          <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-tl from-primary/20 to-transparent rounded-br-3xl blur-2xl"></div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground">Email enviado!</h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enviamos um link de recuperação para{" "}
              <span className="font-semibold text-primary">{email}</span>.
            </p>
            
            <p className="text-xs text-muted-foreground">
              Verifique também sua pasta de spam ou lixo eletrônico.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 font-semibold hover:underline underline-offset-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center space-y-2">
        <img
          src="/assets-uploads/musetera-logo-new.png"
          alt="MuseTera Logo"
          className="h-20 w-20"
        />
        <h2 className="text-2xl font-bold text-primary">MuseTera</h2>
        <p className="text-sm text-muted-foreground">Recuperação de senha</p>
      </div>

      {/* Form Card */}
      <div className="relative w-full bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/20 p-6 sm:p-8 overflow-hidden">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-primary/30 to-transparent rounded-tl-3xl blur-2xl"></div>
        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-tl from-secondary/30 to-transparent rounded-br-3xl blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent blur-sm"></div>

        <form onSubmit={handleResetPassword} className="space-y-5 relative z-10">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Digite seu email e enviaremos um link para você criar uma nova senha.
          </p>

          {/* Email Input */}
          <div className="space-y-2 group">
            <label htmlFor="reset-email" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Mail className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <GradientButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full h-12 md:h-14 font-bold rounded-xl text-sm md:text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {!isLoading && (
              <>
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                Enviar link de recuperação
              </>
            )}
            {isLoading && <span>Enviando...</span>}
          </GradientButton>

          {/* Back to Login */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary hover:text-primary/80 transition-all duration-300 font-semibold hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
