import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Profile {
  id: string;
  name: string | null;
  expires_at: string | null;
  status: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get users expiring in the next 7 days
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const { data: expiringUsers, error: usersError } = await supabase
      .from("profiles")
      .select("id, name, expires_at, status")
      .not("expires_at", "is", null)
      .gte("expires_at", new Date().toISOString())
      .lte("expires_at", futureDate.toISOString());

    if (usersError) {
      console.error("Error fetching expiring users:", usersError);
      throw usersError;
    }

    // Get admin emails
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw rolesError;
    }

    const adminIds = adminRoles?.map(r => r.user_id) || [];

    const { data: adminUsers, error: adminError } = await supabase.auth.admin.listUsers();

    if (adminError) {
      console.error("Error fetching admin users:", adminError);
      throw adminError;
    }

    const adminEmails = adminUsers.users
      .filter(u => adminIds.includes(u.id))
      .map(u => u.email)
      .filter((email): email is string => email !== undefined);

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (expiringUsers && expiringUsers.length > 0) {
      const usersList = expiringUsers
        .map((user: Profile) => {
          const daysUntil = Math.ceil(
            (new Date(user.expires_at!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return `<li><strong>${user.name || "Sem nome"}</strong> - Expira em ${daysUntil} ${daysUntil === 1 ? "dia" : "dias"}</li>`;
        })
        .join("");

      // Send email to all admins
      const emailResponse = await resend.emails.send({
        from: "Sistema <onboarding@resend.dev>",
        to: adminEmails,
        subject: `⚠️ Alerta: ${expiringUsers.length} ${expiringUsers.length === 1 ? "usuário tem" : "usuários têm"} plano expirando`,
        html: `
          <h1>Alerta de Planos Expirando</h1>
          <p>Os seguintes usuários têm planos expirando nos próximos 7 dias:</p>
          <ul>
            ${usersList}
          </ul>
          <p>Acesse o sistema para gerenciar os planos desses usuários.</p>
        `,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(
        JSON.stringify({ 
          message: "Notification sent successfully",
          expiringUsersCount: expiringUsers.length,
          adminEmailsSent: adminEmails.length
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ message: "No expiring users found" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in notify-expiring-users function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
