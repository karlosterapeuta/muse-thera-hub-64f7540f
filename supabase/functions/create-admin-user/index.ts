// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function jsonResponse(body: any, init: ResponseInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");
  return new Response(JSON.stringify(body), { ...init, headers });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return jsonResponse({ error: "Missing Supabase environment variables" }, { status: 500 });
    }

    const authHeader = req.headers.get("Authorization") || "";

    // Client with the caller's JWT (to read their own roles via RLS)
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: caller },
      error: getUserError,
    } = await callerClient.auth.getUser();

    if (getUserError || !caller) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the caller is admin using RPC function
    console.log("Checking admin privileges for user:", caller.id);
    const { data: isAdmin, error: roleCheckError } = await callerClient.rpc('has_role', { role: 'admin' });
    
    console.log("Admin check result:", { isAdmin, roleCheckError });
    
    if (roleCheckError) {
      console.error("Error checking admin role:", roleCheckError);
      return jsonResponse({ error: "Erro ao verificar permissões: " + roleCheckError.message }, { status: 400 });
    }

    if (!isAdmin) {
      console.warn("Non-admin user attempted to create user:", caller.id);
      return jsonResponse({ error: "Apenas administradores podem criar usuários" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, role, password, isTemporaryPassword, accessLimit } = body as {
      name: string;
      email: string;
      role: "admin" | "professional";
      password: string;
      isTemporaryPassword: boolean;
      accessLimit?: "30-minutes" | "30-days" | "6-months" | "1-year";
    };

    console.log("Creating user with data:", { email, name, role, accessLimit });
    
    if (!email || !name || !role || !password) {
      console.error("Missing required fields:", { email: !!email, name: !!name, role: !!role, password: !!password });
      return jsonResponse({ error: "Email, nome, função e senha são obrigatórios" }, { status: 400 });
    }

    // Calculate expiration date based on access limit
    const calculateExpirationDate = (limit: string) => {
      const now = new Date();
      switch (limit) {
        case '30-minutes':
          return new Date(now.getTime() + 30 * 60 * 1000);
        case '30-days':
          return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        case '6-months':
          return new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
        case '1-year':
          return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        default:
          return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days
      }
    };

    const expirationDate = calculateExpirationDate(accessLimit || '30-days');

    // Admin client with service role key
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (authError || !authData?.user) {
      console.error("Auth user creation failed:", authError);
      return jsonResponse({ error: authError?.message || "Falha ao criar usuário de autenticação" }, { status: 400 });
    }
    
    console.log("Auth user created successfully:", authData.user.id);

    const newUserId = authData.user.id;

    // Create profile with expiration date
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert(
        { id: newUserId, name, expires_at: expirationDate.toISOString() },
        { onConflict: "id", ignoreDuplicates: true }
      );
    if (profileError) {
      console.error("Profile upsert failed:", profileError);
      return jsonResponse({ error: "Erro ao criar perfil: " + profileError.message }, { status: 400 });
    }
    
    console.log("Profile created successfully for user:", newUserId);

    // Assign role
    const { error: assignRoleError } = await adminClient
      .from("user_roles")
      .insert({ user_id: newUserId, role });
    if (assignRoleError) {
      // Ignore duplicate role assignments
      if ((assignRoleError as any).code === "23505") {
        console.warn("Role already assigned, ignoring duplicate constraint:", assignRoleError?.message);
      } else {
        console.error("Role assignment failed:", assignRoleError);
        return jsonResponse({ error: "Erro ao atribuir função: " + assignRoleError.message }, { status: 400 });
      }
    }
    
    console.log("Role assigned successfully:", { userId: newUserId, role });

    return jsonResponse({
      user: authData.user,
      password,
      isTemporaryPassword,
      userData: { name, email, role },
    });
  } catch (e: any) {
    return jsonResponse({ error: e?.message || "Unknown error" }, { status: 500 });
  }
});