import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateRandomPassword(length: number = 8): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      throw new Error("Não autorizado - Token não fornecido");
    }

    // Create client with user token to verify identity
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const { data: { user: currentUser }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !currentUser) {
      console.error("Error getting user:", userError);
      throw new Error("Não autorizado - Usuário não encontrado");
    }

    console.log("Current user ID:", currentUser.id);

    // Check if current user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Error checking role:", roleError);
      throw new Error("Erro ao verificar permissões");
    }

    if (!roleData) {
      throw new Error("Não autorizado - Apenas administradores podem redefinir senhas");
    }

    console.log("User is admin, proceeding with password reset");

    // Get target user ID from request body
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      throw new Error("ID do usuário não fornecido");
    }

    console.log("Target user ID:", targetUserId);

    // Create admin client for password update
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Generate new password
    const newPassword = generateRandomPassword(8);

    // Update user password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      targetUserId,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      throw new Error("Erro ao atualizar senha: " + updateError.message);
    }

    console.log("Password updated successfully for user:", targetUserId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        newPassword,
        message: "Senha redefinida com sucesso" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in reset-user-password:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
