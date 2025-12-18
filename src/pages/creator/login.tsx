import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreatorPasswordResetForm } from "@/components/courses/CreatorPasswordResetForm";
import { CreatorNewPasswordForm } from "@/components/courses/CreatorNewPasswordForm";

type ViewMode = "login" | "forgot-password" | "new-password";

export default function CreatorLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("login");

  // Check URL for recovery token or error
  useEffect(() => {
    const checkRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Check for error in URL (e.g., expired link)
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      
      if (error) {
        // Clean the URL first
        window.history.replaceState({}, document.title, window.location.pathname);
        
        if (error === "access_denied" || errorDescription?.includes("expired")) {
          toast.error("Link expirado! Solicite um novo link de recuperação de senha.", {
            duration: 6000,
          });
          setViewMode("forgot-password");
        } else {
          toast.error(errorDescription?.replace(/\+/g, ' ') || "Erro ao processar link");
        }
        return;
      }
      
      // Check hash params for recovery
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");
      
      if (accessToken && type === "recovery") {
        // Set session from recovery token
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (!sessionError) {
            setViewMode("new-password");
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            toast.error("Link de recuperação inválido ou expirado. Solicite um novo.", {
              duration: 6000,
            });
            setViewMode("forgot-password");
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }
    };
    
    checkRecoveryToken();
  }, []);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is a creator
        const { data: creator } = await supabase
          .from('course_creators')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();
        
        if (creator) {
          navigate('/creator-dashboard');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(authError.message);
        }
        return;
      }

      if (!authData.user) {
        toast.error("Erro ao fazer login");
        return;
      }

      // Check if user is an active creator
      const { data: creator, error: creatorError } = await supabase
        .from('course_creators')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('is_active', true)
        .single();

      if (creatorError || !creator) {
        // User exists in auth but is not a creator
        await supabase.auth.signOut();
        toast.error("Esta conta não está vinculada a um criador de cursos");
        return;
      }

      toast.success(`Bem-vindo, ${creator.name}!`);
      navigate('/creator-dashboard');

    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSuccess = () => {
    setViewMode("login");
    navigate('/creator-dashboard');
  };

  const getCardTitle = () => {
    switch (viewMode) {
      case "forgot-password":
        return "Recuperar Senha";
      case "new-password":
        return "Nova Senha";
      default:
        return "Painel do Criador";
    }
  };

  const getCardDescription = () => {
    switch (viewMode) {
      case "forgot-password":
        return "Digite seu email para receber um link de recuperação";
      case "new-password":
        return "Digite sua nova senha para acessar sua conta";
      default:
        return "Acesse seu painel de criador de cursos MuseTera";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 mb-4 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <img 
              src="/lovable-uploads/musetera-logo-new.png" 
              alt="MuseTera Logo" 
              className="relative w-full h-full object-cover rounded-full shadow-lg"
            />
          </div>
          <CardTitle className="text-2xl">{getCardTitle()}</CardTitle>
          <CardDescription>
            {getCardDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "login" && (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setViewMode("forgot-password")}
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  Ainda não tem conta?{" "}
                  <Link to="/creator-register" className="text-primary hover:underline font-medium">
                    Cadastre-se como criador
                  </Link>
                </p>
              </div>
            </>
          )}

          {viewMode === "forgot-password" && (
            <CreatorPasswordResetForm onBack={() => setViewMode("login")} />
          )}

          {viewMode === "new-password" && (
            <CreatorNewPasswordForm onSuccess={handlePasswordResetSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
