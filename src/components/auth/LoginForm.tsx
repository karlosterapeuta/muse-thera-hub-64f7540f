
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="w-full max-w-xl">
      {/* Header with Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-3xl shadow-2xl shadow-primary/20 mb-8 transform hover:scale-105 transition-all duration-500 hover:shadow-primary/30">
          <img 
            src="/lovable-uploads/934e42dc-e002-4eaa-add0-0fd741e314c8.png" 
            alt="MuseTera Logo" 
            className="w-14 h-14 object-contain filter drop-shadow-sm"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-4 tracking-tight">
          Bem-vindo ao MuseTera
        </h1>
        <p className="text-muted-foreground text-xl font-medium">
          A solução mais completa em musicoterapia
        </p>
        <p className="text-muted-foreground/70 text-base mt-2">
          Faça login para acessar sua conta
        </p>
      </div>

      <div className="bg-white/80 dark:bg-background/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/5 dark:shadow-black/20 border border-white/20 dark:border-white/10">
        <form onSubmit={handleLogin} className="space-y-7">
          <div className="space-y-3">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground/90 ml-1">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-5 text-base rounded-2xl border-2 border-border/40 bg-background/60 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary/50"
                placeholder="seu@email.com"
                required
              />
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-r-2xl"></div>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="block text-sm font-semibold text-foreground/90 ml-1">
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 px-5 pr-14 text-base rounded-2xl border-2 border-border/40 bg-background/60 backdrop-blur-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary/50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 p-1 rounded-lg hover:bg-primary/5"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-r-2xl"></div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onSwitchToPasswordReset}
              className="text-sm text-primary hover:text-primary/80 font-semibold transition-all duration-200 px-2 py-1 rounded-lg hover:bg-primary/5"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-primary via-primary/95 to-secondary hover:from-primary/90 hover:via-primary/85 hover:to-secondary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>Carregando...</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Acessar conta
                <span className="text-xl">→</span>
              </span>
            )}
          </Button>

          <div className="text-center pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Ainda não possui uma conta?</p>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-lg font-bold text-primary hover:text-primary/80 transition-all duration-200 px-4 py-2 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20"
            >
              Criar uma conta gratuita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
