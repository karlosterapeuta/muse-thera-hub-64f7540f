import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WelcomeMessageData {
  greeting: string;
  greetingIcon: string;
  mainMessage: string;
  secondaryInfo: Array<{
    icon: string;
    text: string;
    variant?: "default" | "warning" | "success";
  }>;
}

export function useWelcomeMessage(userId: string | undefined) {
  return useQuery({
    queryKey: ["welcome-message", userId],
    queryFn: async (): Promise<WelcomeMessageData | null> => {
      if (!userId) return null;

      try {
        // Buscar dados em paralelo
        const [profileResult, professionalResult, activityResult] = await Promise.all([
          supabase.from("profiles").select("name, status, expires_at, created_at").eq("id", userId).maybeSingle(),
          supabase.from("professionals").select("name, specialty").eq("user_id", userId).maybeSingle(),
          supabase
            .from("user_activity_logs")
            .select("created_at")
            .eq("user_id", userId)
            .eq("activity_type", "login")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        const profile = profileResult.data;
        const professional = professionalResult.data;
        const lastActivity = activityResult.data;

        // Determinar saudação baseada na hora
        const hour = new Date().getHours();
        let greeting = "";
        let greetingIcon = "";

        if (hour >= 5 && hour < 12) {
          greeting = "Bom dia";
          greetingIcon = "🌅";
        } else if (hour >= 12 && hour < 18) {
          greeting = "Boa tarde";
          greetingIcon = "☀️";
        } else {
          greeting = "Boa noite";
          greetingIcon = "🌙";
        }

        // Determinar nome do usuário
        const userName = professional?.name || profile?.name || "Profissional";

        // Determinar se é primeiro login
        const isFirstLogin = !lastActivity;

        // Calcular dias desde último login
        let daysSinceLastLogin = 0;
        if (lastActivity) {
          const lastLoginDate = new Date(lastActivity.created_at);
          const today = new Date();
          daysSinceLastLogin = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Gerar mensagem principal
        let mainMessage = "";
        if (isFirstLogin) {
          mainMessage = `${greeting}, ${userName}! Bem-vindo ao MuseTera! 🎉`;
        } else if (daysSinceLastLogin === 0) {
          mainMessage = `${greeting} novamente, ${userName}!`;
        } else if (daysSinceLastLogin === 1) {
          mainMessage = `${greeting}, ${userName}! Pronto para mais um dia transformador?`;
        } else if (daysSinceLastLogin > 7) {
          mainMessage = `${greeting}, ${userName}! Que bom ter você de volta! 💙`;
        } else {
          mainMessage = `${greeting}, ${userName}! Pronto para transformar vidas através da música?`;
        }

        // Construir informações secundárias
        const secondaryInfo: Array<{
          icon: string;
          text: string;
          variant?: "default" | "warning" | "success";
        }> = [];

        // Último acesso
        if (lastActivity && daysSinceLastLogin > 0) {
          const lastLoginDate = new Date(lastActivity.created_at);
          const formattedDate = lastLoginDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });
          const formattedTime = lastLoginDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          if (daysSinceLastLogin === 1) {
            secondaryInfo.push({
              icon: "📊",
              text: `Último acesso: Ontem às ${formattedTime}`,
            });
          } else if (daysSinceLastLogin <= 7) {
            secondaryInfo.push({
              icon: "📊",
              text: `Último acesso: ${formattedDate} às ${formattedTime}`,
            });
          } else {
            secondaryInfo.push({
              icon: "📊",
              text: `Ausente por ${daysSinceLastLogin} dias`,
            });
          }
        }

        // Status da conta
        if (profile?.expires_at) {
          const expiresDate = new Date(profile.expires_at);
          const today = new Date();
          const daysRemaining = Math.ceil((expiresDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          if (daysRemaining <= 0) {
            secondaryInfo.push({
              icon: "❌",
              text: "Sua conta expirou",
              variant: "warning",
            });
          } else if (daysRemaining <= 7) {
            secondaryInfo.push({
              icon: "⚠️",
              text: `Seu plano expira em ${daysRemaining} ${daysRemaining === 1 ? "dia" : "dias"}`,
              variant: "warning",
            });
          } else if (daysRemaining <= 30) {
            secondaryInfo.push({
              icon: "⚡",
              text: `Conta válida por mais ${daysRemaining} dias`,
              variant: "success",
            });
          }
        } else {
          secondaryInfo.push({
            icon: "♾️",
            text: "Conta ilimitada",
            variant: "success",
          });
        }

        // Especialidade
        if (professional?.specialty) {
          secondaryInfo.push({
            icon: "🎵",
            text: professional.specialty,
          });
        }

        return {
          greeting,
          greetingIcon,
          mainMessage,
          secondaryInfo,
        };
      } catch (error) {
        console.error("Erro ao buscar dados para mensagem de boas-vindas:", error);
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 0,
  });
}
