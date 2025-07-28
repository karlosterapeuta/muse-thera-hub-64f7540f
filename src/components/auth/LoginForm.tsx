
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
    <div className="w-full max-w-lg">
      {/* Header with Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
          <img 
            src="/lovable-uploads/934e42dc-e002-4eaa-add0-0fd741e314c8.png" 
            alt="MuseTera Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          Bem-vindo ao MuseTera
        </h2>
        <p className="text-muted-foreground text-lg">
          Faça login para acessar sua conta
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 px-4 text-base rounded-xl border-2 border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-4 pr-12 text-base rounded-xl border-2 border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSwitchToPasswordReset}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Carregando...
            </div>
          ) : (
            "Acessar conta"
          )}
        </Button>

        <div className="text-center pt-4 border-t border-border/20">
          <p className="text-sm text-muted-foreground mb-2">Ainda não possui uma conta?</p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Criar uma conta
          </button>
        </div>
      </form>
    </div>
  );
}
