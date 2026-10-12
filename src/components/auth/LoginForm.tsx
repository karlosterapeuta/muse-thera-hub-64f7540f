import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeToast } from "./WelcomeToast";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { logUserActivity } from "@/utils/activityLogger";
import { createPortal } from "react-dom";

const BRAND_LOGO = "/lovable-uploads/musetera-logo-new.png";

function LoginBrandLogo() {
  const [transparentLogo, setTransparentLogo] = useState<string | null>(null);
  useEffect(() => {
    const image = new Image();
    image.src = BRAND_LOGO;
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        // Remove only near-black, neutral backdrop pixels from the original logo.
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          const spread = Math.max(r, g, b) - Math.min(r, g, b);
          if ((r < 36 && g < 36 && b < 36) || ((r + g + b) / 3 < 52 && spread < 18)) {
            pixels[i + 3] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setTransparentLogo(canvas.toDataURL("image/png"));
      } catch (error) {
        console.warn("Não foi possível preparar a transparência da logo.", error);
      }
    };
  }, []);

  return (
    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full sm:h-28 sm:w-28">
      <img
        src={transparentLogo || BRAND_LOGO}
        alt="Logotipo MuseTera"
        className="h-full w-full rounded-full object-contain"
      />
    </div>
  );
}

type LoginFormProps = {
  onSwitchToPasswordReset: () => void;
  onSwitchToRegister?: () => void;
};

export default function LoginForm({ onSwitchToPasswordReset, onSwitchToRegister }: LoginFormProps) {
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
    if (isLoading) return;
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
      
      if (profile.status === 'pending') {
        // Pending users can proceed - Layout will show PendingApprovalScreen
        await logUserActivity(result.data.user.id, "login");
        setUserId(result.data.user.id);
        setTimeout(() => {
          navigate("/dashboard");
        }, 300);
        setIsLoading(false);
        return;
      }
      
      if (profile.status !== 'active') {
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 200));
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
      <div className="relative w-full min-w-0">
      <div className="mb-7 text-center">
        <LoginBrandLogo />
        <h1 className="text-3xl font-bold tracking-tight text-[#104f49] dark:text-teal-100 sm:text-4xl">Bem-vindo ao MuseTera</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Acesse sua área de trabalho e organize seus atendimentos musicoterapêuticos.
        </p>
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
      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-4 text-slate-900 shadow-2xl shadow-black/30 backdrop-blur-xl animate-scale-in delay-300 sm:rounded-3xl sm:p-7 lg:p-8">
        <form onSubmit={handleLogin} className="relative space-y-5">
          {/* Enhanced Email Input */}
          <div className="space-y-2 group">
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-800 transition-colors group-focus-within:text-teal-800">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Mail className="text-slate-600 w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 md:pl-12 h-12 sm:h-13 bg-white text-slate-950 placeholder:text-slate-500 border-2 border-slate-300 focus:border-teal-700 transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Enhanced Password Input */}
          <div className="space-y-2 group">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 transition-colors group-focus-within:text-teal-800">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110">
                <Lock className="text-slate-600 w-4 h-4 md:w-5 md:h-5 transition-colors group-focus-within:text-primary" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 md:pl-12 pr-10 md:pr-12 h-12 md:h-14 bg-white text-slate-950 placeholder:text-slate-500 border-2 border-slate-300 focus:border-teal-700 transition-all duration-300 focus:ring-4 focus:ring-primary/20 text-sm md:text-base rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-primary transition-all duration-300 hover:scale-110"
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
              className="text-xs sm:text-sm text-teal-800 hover:text-teal-950 transition-all duration-300 font-semibold hover:underline underline-offset-4"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Enhanced Gradient Submit Button */}
          <button type="submit" disabled={isLoading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-base font-bold text-white transition-colors hover:bg-[#115e59] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 disabled:cursor-wait disabled:opacity-70">
            {isLoading ? "Entrando..." : <><span>Entrar na plataforma</span><ArrowRight className="h-5 w-5" aria-hidden="true" /></>}
          </button>
        </form>

        {onSwitchToRegister && (
          <div className="relative z-10 mt-5 text-center">
            <p className="text-sm text-slate-700">
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-teal-800 hover:text-teal-950 font-semibold transition-all duration-300 hover:underline underline-offset-4"
              >
                Criar conta
              </button>
            </p>
          </div>
        )}
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
