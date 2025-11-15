import { supabase } from "@/integrations/supabase/client";

export async function logUserActivity(userId: string, activityType: "login" | "logout" | "page_view") {
  try {
    const { error } = await supabase.from("user_activity_logs").insert({
      user_id: userId,
      activity_type: activityType,
      activity_data: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    });

    if (error) {
      console.error("Erro ao registrar atividade:", error);
    }
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
  }
}
