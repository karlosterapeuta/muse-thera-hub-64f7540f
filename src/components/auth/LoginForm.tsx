
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Music, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onSwitchToPasswordReset: () => void;
};

export default function LoginForm({ onSwitchToRegister, onSwitchToPasswordReset }: LoginFormProps) {
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
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl animate-fade-in">
      {/* Floating Musical Elements */}
      <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -top-3 md:-top-4 -right-6 md:-right-8 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-lg animate-pulse delay-1000"></div>
      
      {/* Header with Enhanced Logo */}
      <div className="text-center mb-8 md:mb-10 lg:mb-12 relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-36 lg:w-40 h-24 sm:h-32 md:h-36 lg:h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Logo Container */}
        <div className="relative inline-flex items-center justify-center w-16 sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-full shadow-xl md:shadow-2xl shadow-primary/25 mb-6 md:mb-8 animate-scale-in group hover:scale-110 transition-all duration-700 hover:shadow-primary/40">
          <div className="absolute inset-1 md:inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
          <div className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <img 
            src="/lovable-uploads/6302f00d-e2bf-4d19-95f3-eb52823c19d8.png" 
            alt="MuseTera Logo" 
            className="relative w-full h-full object-cover filter drop-shadow-lg z-10 rounded-full"
          />
          {/* Musical Notes */}
          <Music className="absolute -top-1 md:-top-2 -right-1 md:-right-2 w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 text-primary animate-bounce delay-500" />
          <Sparkles className="absolute -bottom-0.5 md:-bottom-1 -left-1 md:-left-2 w-2.5 md:w-3 lg:w-4 h-2.5 md:h-3 lg:h-4 text-secondary animate-pulse delay-700" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-4 md:mb-6 tracking-tight leading-tight">
          Bem-vindo ao
          <br />
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">MuseTera</span>
        </h1>
        
        {/* Subtitle */}
        <div className="space-y-2 md:space-y-3">
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-semibold">
            A solução mais completa em musicoterapia
          </p>
          <p className="text-muted-foreground/70 text-sm md:text-base">
            Transformando vidas através da música e tecnologia
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="relative group">
        {/* Background Blur Effect */}
        <div className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl md:rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
        
        {/* Form */}
        <div className="relative bg-white/90 dark:bg-background/90 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/10 dark:shadow-black/30 border border-white/30 dark:border-white/10 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-2xl md:rounded-bl-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-tr-2xl md:rounded-tr-3xl"></div>
          
          <form onSubmit={handleLogin} className="relative space-y-6 md:space-y-8">
            {/* Email Field */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-foreground/90 ml-1">
                <Mail className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                Email
              </label>
              <div className="relative group/input">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 md:h-14 lg:h-16 pl-10 md:pl-12 lg:pl-14 pr-4 md:pr-6 text-base md:text-lg rounded-xl md:rounded-2xl border-2 border-border/30 bg-background/70 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-primary/60 group-focus-within/input:border-primary group-focus-within/input:shadow-primary/10"
                  placeholder="seu@email.com"
                  required
                />
                <Mail className="absolute left-3 md:left-4 lg:left-5 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors duration-200" />
                <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/30 to-secondary/30 rounded-r-xl md:rounded-r-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-foreground/90 ml-1">
                <Lock className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                Senha
              </label>
              <div className="relative group/input">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 md:h-14 lg:h-16 pl-10 md:pl-12 lg:pl-14 pr-12 md:pr-14 lg:pr-16 text-base md:text-lg rounded-xl md:rounded-2xl border-2 border-border/30 bg-background/70 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:border-primary/60 group-focus-within/input:border-primary group-focus-within/input:shadow-primary/10"
                  placeholder="••••••••••••"
                  required
                />
                <Lock className="absolute left-3 md:left-4 lg:left-5 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 md:right-4 lg:right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 p-1.5 md:p-2 rounded-xl hover:bg-primary/10 group-focus-within/input:text-primary"
                >
                  {showPassword ? <EyeOff size={18} className="md:w-5 md:h-5 lg:w-6 lg:h-6" /> : <Eye size={18} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />}
                </button>
                <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/30 to-secondary/30 rounded-r-xl md:rounded-r-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-1 md:pt-2">
              <button
                type="button"
                onClick={onSwitchToPasswordReset}
                className="text-xs md:text-sm text-primary hover:text-primary/80 font-bold transition-all duration-200 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 md:h-14 lg:h-16 bg-gradient-to-r from-primary via-primary/95 to-secondary hover:from-primary/90 hover:via-primary/85 hover:to-secondary/90 text-primary-foreground font-black text-base md:text-lg lg:text-xl rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 border border-white/30 group overflow-hidden"
              disabled={isLoading}
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 border-2 md:border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2 md:gap-3">
                    <Lock className="w-4 md:w-5 h-4 md:h-5" />
                    Acessar minha conta
                    <span className="text-lg md:text-xl lg:text-2xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                )}
              </div>
            </Button>

            {/* Register Link */}
            <div className="text-center pt-6 md:pt-8 border-t border-border/20">
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 font-medium">Ainda não possui uma conta?</p>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="group text-base md:text-lg lg:text-xl font-black text-primary hover:text-primary/80 transition-all duration-300 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hover:bg-primary/10 border-2 border-transparent hover:border-primary/30 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 md:w-5 h-4 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Crie sua conta
                  <Music className="w-4 md:w-5 h-4 md:h-5 group-hover:-rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
