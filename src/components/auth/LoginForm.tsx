import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Music, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "./GradientButton";

type LoginFormProps = {
  onSwitchToPasswordReset: () => void;
};

export default function LoginForm({ onSwitchToPasswordReset }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (result.error) throw result.error;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', result.data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profile.status !== 'active') {
        await supabase.auth.signOut();
        
        toast({
          title: "Acesso negado",
          description: "Sua conta está desativa. Atualize seu pagamento.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao MuseTera!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Falha no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl animate-fade-in relative">
      {/* Enhanced Floating Musical Elements */}
      <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -top-3 md:-top-4 -right-6 md:-right-8 w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-secondary/40 to-primary/40 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-10 -left-8 w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      {/* Header with Enhanced Logo */}
      <div className="text-center mb-8 md:mb-10 lg:mb-12 relative">
        {/* Enhanced Background Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 md:w-48 lg:w-56 h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Logo Container with Enhanced Effects */}
        <div className="relative inline-flex items-center justify-center w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-full shadow-2xl shadow-primary/30 mb-6 md:mb-8 animate-scale-in group hover:scale-110 transition-all duration-700 hover:shadow-primary/50">
          <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
          <div className="absolute -inset-1 md:-inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>
          <img 
            src="/lovable-uploads/6302f00d-e2bf-4d19-95f3-eb52823c19d8.png" 
            alt="MuseTera Logo" 
            className="relative w-full h-full object-cover filter drop-shadow-2xl z-10 rounded-full"
          />
          {/* Animated Musical Notes */}
          <Music className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-primary animate-bounce delay-500" />
          <Sparkles className="absolute -bottom-2 md:-bottom-3 -left-2 md:-left-3 w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 text-secondary animate-pulse delay-700" />
          <Music className="absolute top-0 -left-4 w-3 md:w-4 h-3 md:h-4 text-primary/70 animate-float-slow" />
        </div>
        
        {/* Enhanced Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-3 md:mb-4 animate-slide-in tracking-tight">
          MuseTera
        </h1>
        
        {/* Enhanced Subtitle with Badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground animate-fade-in delay-200 font-medium">
            Musicoterapia baseada em evidências científicas
          </p>
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-500"></div>
        </div>
        
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 animate-fade-in delay-300">
          <CheckCircle2 className="w-3 h-3 text-primary" />
          <span className="text-xs text-muted-foreground">Plataforma Certificada</span>
        </div>
      </div>
      
      {/* Enhanced Form Card with Glassmorphism */}
      <div className="relative bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl md:rounded-[2rem] shadow-2xl border border-primary/20 p-6 sm:p-8 md:p-10 lg:p-12 animate-scale-in delay-300 overflow-hidden">
        {/* Enhanced Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-tl-3xl blur-2xl"></div>
        <div className="absolute -bottom-2 -right-2 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tl from-secondary/30 to-transparent rounded-br-3xl blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent blur-sm"></div>
        
        <form onSubmit={handleLogin} className="space-y-5 md:space-y-6 relative z-10">
          {/* Enhanced Email Input */}
          <div className="space-y-2 group">
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Mail className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Enhanced Password Input */}
          <div className="space-y-2 group">
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Lock className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 md:pl-12 pr-10 md:pr-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSwitchToPasswordReset}
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-all duration-300 font-semibold hover:underline underline-offset-4"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Enhanced Gradient Submit Button */}
          <GradientButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full h-12 md:h-14 font-bold rounded-xl text-sm md:text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {!isLoading && (
              <>
                <Music className="w-4 h-4 md:w-5 md:h-5" />
                Entrar
              </>
            )}
            {isLoading && <span>Entrando...</span>}
          </GradientButton>

          {/* Enhanced Divider */}
          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="bg-gradient-to-r from-background via-background to-background px-4 md:px-6 text-muted-foreground font-medium backdrop-blur-sm">
                Primeira vez aqui?
              </span>
            </div>
          </div>

          {/* Enhanced Sign Up Link */}
          <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ainda não possui uma conta?{" "}
              <a
                href="/cadastro"
                className="font-bold text-primary hover:text-primary/80 transition-all duration-300 underline underline-offset-4 hover:underline-offset-8"
              >
                Criar conta gratuita
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
