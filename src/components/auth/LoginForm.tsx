
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
    <div className="w-full max-w-md bg-blue-600 p-4 sm:p-6 lg:p-8 rounded-lg">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Acesso ao MuseTera</h2>
        <p className="text-sm sm:text-base text-blue-100">Olá, use os campos abaixo para acessar sua conta MuseTera.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white text-sm sm:text-base"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white text-sm sm:text-base"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSwitchToPasswordReset}
            className="text-xs sm:text-sm text-blue-100 hover:text-white"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-3 px-4 rounded-md transition-colors text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Acessar conta"}
        </Button>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-blue-100">Ainda não possui uma conta?</p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm sm:text-base text-white hover:text-blue-100 font-medium"
          >
            Criar uma conta
          </button>
        </div>
      </form>
    </div>
  );
}
