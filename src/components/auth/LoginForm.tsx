
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
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Primeiro tenta fazer o login normalmente
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (result.error) throw result.error;
      
      // 2. Se o login for bem-sucedido, verifica o status do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', result.data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // 3. Se o usuário estiver inativo, faz logout e mostra uma mensagem
      if (profile.status !== 'active') {
        // Faz logout imediatamente
        await supabase.auth.signOut();
        
        toast({
          title: "Acesso negado",
          description: "Sua conta está desativada. Entre em contato com o administrador do sistema.",
          variant: "destructive",
        });
        return;
      }
      
      // 4. Se tudo estiver ok, continua o login normalmente
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
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-700">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 text-base"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-base font-medium text-gray-700">
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 text-base"
              placeholder="********"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-base text-gray-700">
            Lembrar-me
          </label>
        </div>
        <button
          type="button"
          onClick={onSwitchToPasswordReset}
          className="text-base text-primary hover:text-primary/80"
        >
          Recuperar senha
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-base py-6"
        disabled={isLoading}
      >
        {isLoading ? "Carregando..." : "Entrar"}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-base text-primary hover:text-primary/80"
        >
          Não tem uma conta? Registre-se
        </button>
      </div>
    </form>
  );
}
