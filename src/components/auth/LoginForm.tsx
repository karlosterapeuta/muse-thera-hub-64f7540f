import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
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
    <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-1 ring-emerald-900/10 sm:h-28 sm:w-28">
      <img
        src={transparentLogo || BRAND_LOGO}
        alt="Logotipo MuseTera"
        width={112}
        height={112}
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
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: welcomeData } = useWelcomeMessage(userId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setFormError("");
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
      setFormError(description || "Não foi possível entrar. Confira os dados e tente novamente.");
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
      <div className="mb-8 text-center">
        <LoginBrandLogo />
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-300">Seu espaço profissional</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-[#104f49] dark:text-teal-100 sm:text-4xl">Bem-vindo ao MuseTera</h1>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Tudo pronto para cuidar de cada evolução musical.
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
      <div className="relative w-full min-w-0 overflow-hidden rounded-[24px] border border-emerald-950/10 bg-white p-5 text-slate-900 shadow-[0_24px_70px_-34px_rgba(6,78,59,0.38)] sm:p-8">
        <div className="mb-7">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Acessar minha conta</h2>
          <p className="mt-1 text-sm text-slate-600">Entre com seu e-mail e sua senha.</p>
        </div>
        <form onSubmit={handleLogin} className="relative space-y-5" aria-busy={isLoading}>
          {formError && (
            <div role="alert" id="login-error" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}
          {/* Enhanced Email Input */}
          <div className="space-y-2 group">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 transition-colors group-focus-within:text-teal-800">
              E-mail
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Mail aria-hidden="true" className="h-5 w-5 text-slate-500" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (formError) setFormError(""); }}
                className="h-14 rounded-xl border border-slate-300 bg-white pl-12 text-base text-slate-950 placeholder:text-slate-500 transition-colors hover:border-teal-600 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
                placeholder="seu@email.com"
                autoComplete="email"
                aria-invalid={!!formError}
                aria-describedby={formError ? "login-error" : undefined}
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
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Lock aria-hidden="true" className="h-5 w-5 text-slate-500" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (formError) setFormError(""); }}
                className="h-14 rounded-xl border border-slate-300 bg-white pl-12 pr-14 text-base text-slate-950 placeholder:text-slate-500 transition-colors hover:border-teal-600 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!formError}
                aria-describedby={formError ? "login-error" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <Eye aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSwitchToPasswordReset}
              className="min-h-11 cursor-pointer rounded-md px-1 text-sm font-semibold text-teal-800 underline-offset-4 transition-colors hover:text-teal-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Enhanced Gradient Submit Button */}
          <button type="submit" disabled={isLoading} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 disabled:cursor-wait disabled:opacity-70">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />Entrando com segurança...</> : <><span>Entrar na plataforma</span><ArrowRight className="h-5 w-5" aria-hidden="true" /></>}
          </button>
        </form>

        {onSwitchToRegister && (
          <div className="relative z-10 mt-5 text-center">
            <p className="text-sm text-slate-700">
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="min-h-11 cursor-pointer rounded-md px-1 font-semibold text-teal-800 underline-offset-4 transition-colors hover:text-teal-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
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
