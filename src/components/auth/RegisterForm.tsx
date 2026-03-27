
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, CheckCircle2 } from "lucide-react";
import { CosmicHeroLogo } from "./CosmicHeroLogo";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "./GradientButton";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      setRegistered(true);
    } catch (error: any) {
      let description = error.message;
      if (error.message?.includes("already been registered")) {
        description = "Este email já está cadastrado. Tente fazer login.";
      }
      toast({
        title: "Erro no cadastro",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg animate-fade-in">
        <div className="text-center mb-6">
          <CosmicHeroLogo />
        </div>
        <div className="relative bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-primary/20 p-8 md:p-10 animate-scale-in">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Cadastro Realizado!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sua conta foi criada com sucesso. O administrador precisa liberar seu acesso antes que você possa utilizar o sistema.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-semibold text-sm transition-all hover:underline underline-offset-4"
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg animate-fade-in relative">
      <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl animate-pulse"></div>

      <div className="text-center mb-4 md:mb-6 relative">
        <CosmicHeroLogo />
        <p className="text-sm sm:text-base text-muted-foreground animate-fade-in delay-200 font-medium mt-1">
          Crie sua conta na plataforma
        </p>
      </div>

      <div className="relative bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl md:rounded-[2rem] shadow-2xl border border-primary/20 p-6 sm:p-8 md:p-10 animate-scale-in delay-300 overflow-hidden">
        <div className="absolute -top-2 -left-2 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-tl-3xl blur-2xl"></div>
        <div className="absolute -bottom-2 -right-2 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tl from-secondary/30 to-transparent rounded-br-3xl blur-2xl"></div>

        <form onSubmit={handleRegister} className="space-y-4 md:space-y-5 relative z-10">
          {/* Name */}
          <div className="space-y-2 group">
            <label htmlFor="reg-name" className="block text-xs sm:text-sm font-semibold text-foreground">
              Nome completo
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
                <User className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary rounded-xl text-sm md:text-base"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <label htmlFor="reg-email" className="block text-xs sm:text-sm font-semibold text-foreground">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
                <Mail className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary rounded-xl text-sm md:text-base"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 group">
            <label htmlFor="reg-password" className="block text-xs sm:text-sm font-semibold text-foreground">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
                <Lock className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 md:pl-12 pr-10 md:pr-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary rounded-xl text-sm md:text-base"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2 group">
            <label htmlFor="reg-confirm" className="block text-xs sm:text-sm font-semibold text-foreground">
              Confirmar senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
                <Lock className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary rounded-xl text-sm md:text-base"
                placeholder="Repita a senha"
                required
              />
            </div>
          </div>

          <GradientButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full h-12 md:h-14 font-bold rounded-xl text-sm md:text-base"
          >
            {!isLoading && (
              <>
                <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                Criar conta
              </>
            )}
            {isLoading && <span>Criando conta...</span>}
          </GradientButton>
        </form>

        <div className="mt-6 text-center relative z-10">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-semibold transition-all hover:underline underline-offset-4"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
