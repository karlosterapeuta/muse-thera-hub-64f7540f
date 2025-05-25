
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
    <div className="w-full max-w-md bg-blue-600 p-6 sm:p-8 lg:p-10 rounded-lg min-h-[500px] sm:min-h-[450px]">
      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">Acesso ao MuseTera</h2>
        <p className="text-base sm:text-lg text-blue-100">Olá, use os campos abaixo para acessar sua conta MuseTera.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
        <div>
          <label htmlFor="email" className="block text-base font-medium text-white mb-3">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white text-base sm:text-lg"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-base font-medium text-white mb-3">
            Senha
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white text-base sm:text-lg"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSwitchToPasswordReset}
            className="text-sm sm:text-base text-blue-100 hover:text-white"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 sm:py-4 px-4 rounded-md transition-colors text-base sm:text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Acessar conta"}
        </Button>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm sm:text-base text-blue-100">Ainda não possui uma conta?</p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-base sm:text-lg text-white hover:text-blue-100 font-medium"
          >
            Criar uma conta
          </button>
        </div>
      </form>
    </div>
  );
}
