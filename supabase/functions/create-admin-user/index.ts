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

    // Check if the caller is admin
    const { data: roles, error: rolesError } = await callerClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id);

    if (rolesError) {
      return jsonResponse({ error: rolesError.message }, { status: 400 });
    }

    const isAdmin = (roles || []).some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return jsonResponse({ error: "Only admins can create users" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, role, password, isTemporaryPassword } = body as {
      name: string;
      email: string;
      role: "admin" | "professional";
      password: string;
      isTemporaryPassword: boolean;
    };

    if (!email || !name || !role || !password) {
      return jsonResponse({ error: "Missing required fields" }, { status: 400 });
    }

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
      return jsonResponse({ error: authError?.message || "Failed to create auth user" }, { status: 400 });
    }

    const newUserId = authData.user.id;

    // Create profile
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: newUserId,
      name,
    });
    if (profileError) {
      return jsonResponse({ error: profileError.message }, { status: 400 });
    }

    // Assign role
    const { error: roleError } = await adminClient.from("user_roles").insert({
      user_id: newUserId,
      role,
    });
    if (roleError) {
      return jsonResponse({ error: roleError.message }, { status: 400 });
    }

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