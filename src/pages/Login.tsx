
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      const hash = location.hash;
      try {
        if (hash && hash.includes('type=recovery')) {
          setIsSettingNewPassword(true);
          
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (!accessToken) {
            throw new Error("Token de acesso não encontrado");
          }
          
          toast({
            title: "Redefina sua senha",
            description: "Por favor, digite uma nova senha."
          });
        }
      } catch (error: any) {
        console.error("Erro ao processar redefinição de senha:", error);
        toast({
          title: "Erro na redefinição de senha",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    handlePasswordReset();
  }, [location, toast]);

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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
      });
      
      setIsSettingNewPassword(false);
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the current deployment URL dynamically
      const siteUrl = window.location.origin;
      
      // Log the redirect URL for debugging
      console.log("Using redirect URL:", `${siteUrl}/login`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setIsResettingPassword(false);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (isRegistering) {
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

        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0],
            },
          },
        });
        
        if (result.error) throw result.error;

        const { error: updateError } = await supabase.rpc(
          'validate_and_use_invite_code',
          { 
            invite_code: inviteCode,
            user_id: result.data.user?.id
          }
        );

        if (updateError) throw updateError;
        
        toast({
          title: "Registro realizado com sucesso!",
          description: "Por favor, verifique seu email para confirmar sua conta.",
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (result.error) throw result.error;
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao MuseTera!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: isRegistering ? "Falha no registro" : "Falha no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSettingNewPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img
              src="/lovable-uploads/a8f641fc-f081-490d-8028-c68c5eb3f911.png"
              alt="Musicoterapia Logo"
              className="mx-auto h-24 w-24 mb-4"
            />
            <h2 className="text-4xl font-bold text-primary mb-2">Musicoterapia</h2>
            <h3 className="text-xl text-gray-600">Definir Nova Senha</h3>
            <p className="mt-2 text-gray-600">
              Digite sua nova senha abaixo:
            </p>
          </div>

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

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Atualizar Senha"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="/lovable-uploads/a8f641fc-f081-490d-8028-c68c5eb3f911.png"
            alt="Musicoterapia Logo"
            className="mx-auto h-24 w-24 mb-4"
          />
          <h2 className="text-4xl font-bold text-primary mb-2">Musicoterapia</h2>
          <h3 className="text-xl text-gray-600">
            {isResettingPassword ? "Recuperar Senha" : isRegistering ? "Registro" : "Login"}
          </h3>
          <p className="mt-2 text-gray-600">
            {isResettingPassword
              ? "Digite seu email para receber o link de recuperação"
              : isRegistering
              ? "Crie sua conta para acessar o sistema"
              : "Insira suas credenciais abaixo:"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isResettingPassword ? handleResetPassword : handleAuth}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="seu@email.com"
                required
              />
            </div>

            {!isResettingPassword && (
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
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
            )}

            {isRegistering && !isResettingPassword && (
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
            )}
          </div>

          {!isResettingPassword && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>
              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(true)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Recuperar senha
                </button>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading
              ? "Carregando..."
              : isResettingPassword
              ? "Enviar email de recuperação"
              : isRegistering
              ? "Registrar"
              : "Entrar"}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setIsResettingPassword(false);
              }}
              className="text-sm text-primary hover:text-primary/80"
            >
              {isRegistering
                ? "Já tem uma conta? Faça login"
                : "Não tem uma conta? Registre-se"}
            </button>
            {isResettingPassword && (
              <button
                type="button"
                onClick={() => setIsResettingPassword(false)}
                className="block w-full text-sm text-primary hover:text-primary/80"
              >
                Voltar ao login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
