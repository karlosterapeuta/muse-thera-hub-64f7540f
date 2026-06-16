
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "./GradientButton";

type NewPasswordFormProps = {
  onSuccessCallback?: () => void;
};

export default function NewPasswordForm({ onSuccessCallback }: NewPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        throw new Error("Sessão expirada. Por favor, solicite um novo link de recuperação de senha.");
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Senha atualizada!",
        description: "Você pode fazer login com sua nova senha agora.",
      });
      
      window.history.replaceState(null, '', window.location.pathname);

      if (onSuccessCallback) {
        setTimeout(() => onSuccessCallback(), 2000);
      } else {
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      }
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      toast({
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao tentar redefinir sua senha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/lovable-uploads/musetera-logo-new.png"
            alt="MuseTera Logo"
            className="h-20 w-20"
          />
          <h2 className="text-2xl font-bold text-primary">MuseTera</h2>
        </div>

        {/* Success Card */}
        <div className="relative w-full bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/20 p-6 sm:p-8 overflow-hidden">
          <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-tl-3xl blur-2xl"></div>
          
          <div className="relative z-10 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground">Senha atualizada!</h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sua senha foi atualizada com sucesso. Você será redirecionado para o login em instantes.
            </p>
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
          src="/lovable-uploads/musetera-logo-new.png"
          alt="MuseTera Logo"
          className="h-20 w-20"
        />
        <h2 className="text-2xl font-bold text-primary">MuseTera</h2>
        <p className="text-sm text-muted-foreground">Definir nova senha</p>
      </div>

      {/* Form Card */}
      <div className="relative w-full bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/20 p-6 sm:p-8 overflow-hidden">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-primary/30 to-transparent rounded-tl-3xl blur-2xl"></div>
        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-tl from-secondary/30 to-transparent rounded-br-3xl blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent blur-sm"></div>

        <form onSubmit={handleUpdatePassword} className="space-y-5 relative z-10">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Crie uma nova senha segura para sua conta MuseTera.
          </p>

          {/* New Password Input */}
          <div className="space-y-2 group">
            <label htmlFor="newPassword" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              Nova Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Lock className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 md:pl-12 pr-10 md:pr-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2 group">
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <ShieldCheck className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Password hint */}
          <p className="text-xs text-muted-foreground text-center">
            Mínimo de 6 caracteres
          </p>

          {/* Submit Button */}
          <GradientButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full h-12 md:h-14 font-bold rounded-xl text-sm md:text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {!isLoading && (
              <>
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                Atualizar Senha
              </>
            )}
            {isLoading && <span>Atualizando...</span>}
          </GradientButton>
        </form>
      </div>
    </div>
  );
}
