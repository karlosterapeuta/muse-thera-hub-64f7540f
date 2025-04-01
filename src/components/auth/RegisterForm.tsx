
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const validateInviteCode = async (code: string) => {
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code)
      .eq('status', 'unused')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      throw new Error("Código de convite inválido ou expirado");
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate invite code first
      try {
        await validateInviteCode(inviteCode);
      } catch (error: any) {
        toast({
          title: "Código de convite inválido",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Register user with Supabase without email confirmation
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0],
          },
          // Skip email confirmation by not setting emailRedirectTo
        },
      });
      
      if (result.error) throw result.error;

      // Immediately update the invite code status after successful registration
      const { error: updateError } = await supabase.rpc(
        'validate_and_use_invite_code',
        { 
          invite_code: inviteCode,
          user_id: result.data.user?.id
        }
      );

      if (updateError) throw updateError;
      
      console.log("Registration successful");
      toast({
        title: "Registro realizado com sucesso!",
        description: "Você já pode fazer login com suas credenciais.",
      });
      
      // Switch to login after successful registration
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Falha no registro",
        description: error.message || "Erro ao registrar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
      <div className="space-y-4">
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <Input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
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

        <div>
          <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
            Código de Convite
          </label>
          <Input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="mt-1"
            placeholder="Digite seu código de convite"
            required
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="register-remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="register-remember-me" className="ml-2 block text-sm text-gray-700">
          Lembrar-me
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Carregando..." : "Registrar"}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-primary hover:text-primary/80"
        >
          Já tem uma conta? Faça login
        </button>
      </div>
    </form>
  );
}
