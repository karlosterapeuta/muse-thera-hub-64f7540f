import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Music, CheckCircle2, AlertTriangle } from "lucide-react";
import { CosmicHeroLogo } from "./CosmicHeroLogo";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "./GradientButton";
import { WelcomeToast } from "./WelcomeToast";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { logUserActivity } from "@/utils/activityLogger";
import { createPortal } from "react-dom";

type LoginFormProps = {
  onSwitchToPasswordReset: () => void;
};

export default function LoginForm({ onSwitchToPasswordReset }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: welcomeData } = useWelcomeMessage(userId);

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
        // Fazer signOut e aguardar completar
        await supabase.auth.signOut();
        
        // Aguardar um pouco para garantir que a sessão seja completamente encerrada
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Mostrar card visual de bloqueio
        setShowBlockedMessage(true);
        setIsLoading(false);
        return;
      }
      
      // Registrar atividade de login
      await logUserActivity(result.data.user.id, "login");
      
      // Definir userId para buscar dados de boas-vindas
      setUserId(result.data.user.id);
      
      // Aguardar um pouco para o hook carregar os dados
      setTimeout(() => {
        setShowWelcome(true);
        
        // Navegar após mostrar a mensagem
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      }, 300);
      
    } catch (error: any) {
      let description = error.message;
      if (error.message?.includes('Invalid login credentials')) {
        description = "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
      }
      toast({
        title: "Falha no login",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl animate-fade-in relative">
      {/* Enhanced Floating Musical Elements */}
      <div className="absolute -top-4 md:-top-6 -left-4 md:-left-6 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -top-3 md:-top-4 -right-6 md:-right-8 w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-secondary/40 to-primary/40 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-10 -left-8 w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="relative inline-flex items-center justify-center w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-full shadow-2xl shadow-primary/30 mb-4 animate-scale-in">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-30 animate-pulse"></div>
          <img 
            src="/lovable-uploads/musetera-logo-new.png" 
            alt="MuseTera Logo" 
            className="relative w-full h-full object-cover rounded-full z-10"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent mb-2 tracking-tight animate-fade-in">
          MuseTera
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground animate-fade-in delay-200 font-medium">
          Musicoterapia baseada em evidências científicas
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full bg-primary/5 border border-primary/10 animate-fade-in delay-300">
          <CheckCircle2 className="w-3 h-3 text-primary" />
          <span className="text-xs text-muted-foreground">Plataforma Certificada</span>
        </div>
      </div>
      
      {/* Card de Bloqueio - Usuário Inativo */}
      {showBlockedMessage && (
        <div className="mb-6 p-6 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/30 dark:to-red-950/30 border-2 border-amber-400 dark:border-amber-600 rounded-2xl shadow-lg animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">
                Acesso Temporariamente Suspenso
              </h3>
              <p className="text-amber-700 dark:text-amber-300 mb-3">
                Sua conta está <strong>inativa</strong> devido a um <strong>pagamento pendente</strong>.
              </p>
              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 mb-3">
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  Para reativar seu acesso:
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1">
                  <li>• Regularize seu pagamento</li>
                  <li>• Entre em contato com o suporte se precisar de ajuda</li>
                </ul>
              </div>
              <button
                onClick={() => setShowBlockedMessage(false)}
                className="text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 underline font-medium transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Form Card with Glassmorphism */}
      <div className="relative bg-gradient-to-br from-background/60 via-background/50 to-background/60 backdrop-blur-2xl rounded-3xl md:rounded-[2rem] shadow-2xl border border-primary/20 p-6 sm:p-8 md:p-10 lg:p-12 animate-scale-in delay-300 overflow-hidden">
        {/* Enhanced Decorative Elements */}
        <div className="absolute -top-2 -left-2 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-tl-3xl blur-2xl"></div>
        <div className="absolute -bottom-2 -right-2 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tl from-secondary/30 to-transparent rounded-br-3xl blur-2xl"></div>
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent blur-sm"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent blur-sm"></div>
        
        <form onSubmit={handleLogin} className="space-y-5 md:space-y-6 relative z-10">
          {/* Enhanced Email Input */}
          <div className="space-y-2 group">
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Mail className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 md:pl-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Enhanced Password Input */}
          <div className="space-y-2 group">
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-foreground transition-colors group-focus-within:text-primary">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Lock className="text-muted-foreground w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 md:pl-12 pr-10 md:pr-12 h-12 md:h-14 bg-background/60 backdrop-blur-sm border-2 border-primary/20 focus:border-primary transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSwitchToPasswordReset}
              className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-all duration-300 font-semibold hover:underline underline-offset-4"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Enhanced Gradient Submit Button */}
          <GradientButton
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full h-12 md:h-14 font-bold rounded-xl text-sm md:text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {!isLoading && (
              <>
                <Music className="w-4 h-4 md:w-5 md:h-5" />
                Entrar
              </>
            )}
            {isLoading && <span>Entrando...</span>}
          </GradientButton>
        </form>
      </div>
    </div>

    {/* WelcomeToast - renderizado com portal */}
    {showWelcome && welcomeData &&
      createPortal(
        <WelcomeToast
          greetingIcon={welcomeData.greetingIcon}
          mainMessage={welcomeData.mainMessage}
          secondaryInfo={welcomeData.secondaryInfo}
          onClose={() => setShowWelcome(false)}
        />,
        document.body
      )}
  </>
  );
}
