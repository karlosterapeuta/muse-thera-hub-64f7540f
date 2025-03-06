
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function NewPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password
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
      console.log("Attempting to update password");
      
      // Get current session to verify we're authenticated for password reset
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Current session:", sessionData?.session ? "Active" : "None");
      
      if (!sessionData?.session) {
        throw new Error("Sessão expirada. Por favor, solicite um novo link de recuperação de senha.");
      }
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }

      console.log("Password updated successfully");
      setSuccess(true);
      toast({
        title: "Senha atualizada com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
      });
      
      // Clear hash from URL after successful password update
      window.history.replaceState(null, '', window.location.pathname);

      // Redirect to login after successful password reset
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
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
      <div className="mt-8 space-y-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-800">Senha atualizada!</h3>
          <p className="mt-2 text-sm text-green-700">
            Sua senha foi atualizada com sucesso. Você será redirecionado para a página de login.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Nova Senha
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
              placeholder="********"
              required
              minLength={6}
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

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Senha
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
              placeholder="********"
              required
              minLength={6}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Carregando..." : "Atualizar Senha"}
      </Button>
    </form>
  );
}
