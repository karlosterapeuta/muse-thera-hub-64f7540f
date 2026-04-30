// Public registration endpoint for WhatsApp bot integration
// Authenticated via x-api-key header (WHATSAPP_BOT_API_KEY secret)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\+?[1-9]\d{7,14}$/.test(phone.replace(/\s|-/g, ""));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  // 1. API Key authentication
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = Deno.env.get("WHATSAPP_BOT_API_KEY");

  if (!expectedKey) {
    console.error("WHATSAPP_BOT_API_KEY not configured");
    return json(500, { error: "Server misconfiguration" });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return json(401, { error: "Invalid or missing API key" });
  }

  // 2. Parse and validate body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { name, email, password, phone } = body ?? {};

  const errors: Record<string, string> = {};
  if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    errors.name = "Name must be 2-100 characters";
  }
  if (!email || typeof email !== "string" || !isValidEmail(email) || email.length > 255) {
    errors.email = "Valid email required (max 255 chars)";
  }
  if (!password || typeof password !== "string" || password.length < 6 || password.length > 72) {
    errors.password = "Password must be 6-72 characters";
  }
  if (phone !== undefined && phone !== null && phone !== "") {
    if (typeof phone !== "string" || !isValidPhone(phone)) {
      errors.phone = "Phone must be in E.164 format (e.g. +5511999999999)";
    }
  }

  if (Object.keys(errors).length > 0) {
    return json(400, { error: "Validation failed", details: errors });
  }

  // 3. Create user via service role
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: {
      name: trimmedName,
      phone: phone ?? null,
      registration_source: "whatsapp_bot",
    },
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return json(409, { error: "Email já cadastrado" });
    }
    console.error("createUser error:", error);
    return json(500, { error: "Erro ao criar usuário", details: error.message });
  }

  if (!data?.user) {
    return json(500, { error: "Usuário não foi criado" });
  }

  // The handle_new_user trigger automatically creates the profile with status='pending'
  console.log(`User created via WhatsApp bot: ${data.user.id} (${normalizedEmail})`);

  return json(200, {
    success: true,
    userId: data.user.id,
    status: "pending",
    message:
      "Cadastro realizado com sucesso. Aguardando aprovação do administrador antes do primeiro acesso.",
  });
});
