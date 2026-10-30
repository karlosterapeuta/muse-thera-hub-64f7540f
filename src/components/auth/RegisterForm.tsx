
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, CheckCircle2, AlertTriangle } from "lucide-react";
import { LoginBrandLogo } from "./LoginForm";
import { supabase } from "@/integrations/supabase/client";

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem. Confira os dois campos.");
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      setFormError("Utilize uma senha com pelo menos 6 caracteres.");
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      setRegistered(true);
    } catch (error: any) {
      let description = error.message;
      if (error.message?.includes("already been registered")) {
        description = "Este email já está cadastrado. Tente fazer login.";
      }
      setFormError(description || "Não foi possível concluir o cadastro.");
      toast({
        title: "Erro no cadastro",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="w-full min-w-0">
        <div className="mb-6 text-center">
          <LoginBrandLogo />
        </div>
        <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 text-slate-900 shadow-[0_24px_70px_-34px_rgba(6,78,59,0.38)] sm:p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-800" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-950">Cadastro realizado!</h1>
            <p className="text-base leading-relaxed text-slate-700">
              Sua conta foi criada com sucesso. O administrador precisa liberar seu acesso antes que você possa utilizar o sistema.
            </p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0">
      <div className="mb-7 text-center">
        <LoginBrandLogo />
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-800 dark:text-teal-300">Seu espaço profissional</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-[#104f49] dark:text-teal-100 sm:text-4xl">Faça parte do MuseTera</h1>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-slate-600 dark:text-slate-300">Organize seus atendimentos e acompanhe cada evolução musical.</p>
      </div>

      <div className="w-full min-w-0 rounded-[24px] border border-emerald-950/10 bg-white p-5 text-slate-900 shadow-[0_24px_70px_-34px_rgba(6,78,59,0.38)] sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Criar minha conta</h2>
          <p className="mt-1 text-sm text-slate-600">Preencha os dados para começar.</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5" aria-busy={isLoading}>
          {formError && (
            <div id="register-error" role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </div>
          )}
          {/* Name */}
          <div className="space-y-2 group">
            <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-800">
              Nome completo
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <User className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <Input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl border border-slate-300 bg-white pl-12 text-base text-slate-950 placeholder:text-slate-500 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
                placeholder="Seu nome completo"
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-800">
              E-mail
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-xl border border-slate-300 bg-white pl-12 text-base text-slate-950 placeholder:text-slate-500 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
                placeholder="seu@email.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 group">
            <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-800">
              Senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-xl border border-slate-300 bg-white pl-12 pr-14 text-base text-slate-950 placeholder:text-slate-500 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                minLength={6}
                aria-describedby="register-password-hint"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
                aria-pressed={showPassword}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            <p id="register-password-hint" className="text-xs text-slate-600">Use pelo menos 6 caracteres. Evite senhas utilizadas em outros serviços.</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2 group">
            <label htmlFor="reg-confirm" className="block text-sm font-semibold text-slate-800">
              Confirmar senha
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <Input
                id="reg-confirm"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 rounded-xl border border-slate-300 bg-white pl-12 text-base text-slate-950 placeholder:text-slate-500 focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700/25"
                placeholder="Repita a senha"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 disabled:cursor-wait disabled:opacity-70"
          >
            {!isLoading && (
              <>
                <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                Criar conta
              </>
            )}
            {isLoading && <span>Criando conta...</span>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-700">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="inline-flex min-h-11 items-center rounded-md px-1 font-semibold text-teal-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
