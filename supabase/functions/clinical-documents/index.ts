// MuseTera: proxy autenticado para PDFs clínicos no bucket PRIVADO do Cloudflare R2.
// Nunca exponha credenciais R2 no frontend e nunca habilite r2.dev/public access.
// A função deve continuar com verify_jwt=true em supabase/config.toml.
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "npm:@aws-sdk/client-s3@3.879.0";
import { createClient } from "npm:@supabase/supabase-js@2.105.4";

const MAX_PDF_BYTES = 20 * 1024 * 1024;
const validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const kinds = new Set(["anamnesis", "report", "evaluation", "treatment-plan", "intervention", "session"]);
const allowedOrigins = new Set(
  (Deno.env.get("R2_ALLOWED_ORIGINS") || "https://portal.musetera.com.br")
    .split(",").map((x) => x.trim()).filter(Boolean),
);
type DocumentKind = "anamnesis" | "report" | "evaluation" | "treatment-plan" | "intervention" | "session";

function cors(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return {
    "Vary": "Origin",
    ...(origin && allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type, x-filename, x-patient-id, x-document-kind, x-document-id",
    "Access-Control-Expose-Headers": "content-disposition, x-musetera-sha256",
    "Cache-Control": "no-store",
  };
}
function json(request: Request, value: object, status = 200) {
  return Response.json(value, { status, headers: cors(request) });
}
function getConfig() {
  const accountId = Deno.env.get("R2_ACCOUNT_ID");
  const bucket = Deno.env.get("R2_BUCKET");
  const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!accountId || !/^[a-f0-9]{32}$/i.test(accountId) || !bucket ||
      !/^[a-z0-9-]{3,63}$/.test(bucket) || !accessKeyId || !secretAccessKey ||
      !supabaseUrl || !supabaseAnonKey) return null;
  return { accountId, bucket, accessKeyId, secretAccessKey, supabaseUrl, supabaseAnonKey };
}
async function sha256(bytes: Uint8Array): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, "0")).join("");
}
function safeName(input: string): string {
  return input.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}
Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(request) });
  }
  if (request.method !== "GET" && request.method !== "POST") {
    return json(request, { error: "Método não permitido" }, 405);
  }
  const cfg = getConfig();
  if (!cfg) return json(request, { error: "Arquivo privado ainda não configurado" }, 503);

  const bearer = request.headers.get("authorization");
  if (!bearer?.startsWith("Bearer ")) return json(request, { error: "Acesso não autorizado" }, 401);

  const supabase = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: bearer } },
  });
  // getUser faz a validação do token no Auth, em vez de confiar em claims fornecidas pelo navegador.
  const { data: { user }, error: authError } = await supabase.auth.getUser(bearer.substring(7));
  if (authError || !user) return json(request, { error: "Sessão inválida" }, 401);
  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
  });

  if (request.method === "POST") {
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/pdf") {
      return json(request, { error: "Somente PDF é permitido" }, 415);
    }
    const declaredSize = Number(request.headers.get("content-length") || 0);
    if (declaredSize > MAX_PDF_BYTES) return json(request, { error: "PDF excede 20 MB" }, 413);
    const rawKind = request.headers.get("x-document-kind") || "";
    if (!kinds.has(rawKind)) return json(request, { error: "Categoria inválida" }, 400);
    const kind = rawKind as DocumentKind;
    let filename = "";
    try { filename = safeName(decodeURIComponent(request.headers.get("x-filename") || "")); }
    catch { return json(request, { error: "Nome do arquivo inválido" }, 400); }
    if (!filename || !filename.toLowerCase().endsWith(".pdf")) {
      return json(request, { error: "O arquivo precisa ter extensão .pdf" }, 400);
    }
    const patientId = request.headers.get("x-patient-id") || null;
    if (patientId) {
      if (!validUuid.test(patientId)) return json(request, { error: "Paciente inválido" }, 400);
      const { data: patient, error } = await supabase.from("patients")
        .select("id").eq("id", patientId).eq("professional_id", user.id).maybeSingle();
      if (error || !patient) return json(request, { error: "Paciente não autorizado" }, 403);
    }
    const bytes = new Uint8Array(await request.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_PDF_BYTES) return json(request, { error: "Tamanho de PDF inválido" }, 413);
    // Proteção básica contra outros tipos de arquivo enviados com o header application/pdf.
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") {
      return json(request, { error: "Conteúdo não é PDF" }, 415);
    }
    const id = crypto.randomUUID();
    const objectKey = `${user.id}/${id}.pdf`; // Sem nome do paciente na chave do R2.
    const digest = await sha256(bytes);
    try {
      await s3.send(new PutObjectCommand({
        Bucket: cfg.bucket, Key: objectKey, Body: bytes,
        ContentType: "application/pdf", CacheControl: "private, no-store",
      }));
    } catch (_error) {
      return json(request, { error: "Falha no armazenamento privado" }, 502);
    }
    const { error } = await supabase.from("clinical_documents").insert({
      id, owner_user_id: user.id, patient_id: patientId,
      object_key: objectKey, filename, document_kind: kind,
      byte_size: bytes.byteLength, sha256_hex: digest,
    });
    if (error) {
      // Remove apenas o novo objeto criado por esta requisição, sem tocar em documentos antigos.
      try { await s3.send(new DeleteObjectCommand({ Bucket: cfg.bucket, Key: objectKey })); }
      catch { console.error("R2: objeto novo sem referência; investigar pelo id", id); }
      return json(request, { error: "Não foi possível registrar o documento" }, 500);
    }
    return json(request, { id, filename, byteSize: bytes.byteLength, sha256: digest }, 201);
  }

  const id = request.headers.get("x-document-id");
  if (!id) {
    const { data, error } = await supabase.from("clinical_documents")
      .select("id,patient_id,filename,document_kind,byte_size,sha256_hex,created_at")
      .eq("owner_user_id", user.id).order("created_at", { ascending: false }).limit(100);
    return error ? json(request, { error: "Falha ao listar documentos" }, 500) : json(request, { documents: data ?? [] });
  }
  if (!validUuid.test(id)) return json(request, { error: "Documento inválido" }, 400);
  const { data: doc, error } = await supabase.from("clinical_documents")
    .select("object_key,filename,byte_size,sha256_hex")
    .eq("id", id).eq("owner_user_id", user.id).maybeSingle();
  if (error || !doc) return json(request, { error: "Documento não encontrado" }, 404);
  try {
    const result = await s3.send(new GetObjectCommand({ Bucket: cfg.bucket, Key: doc.object_key }));
    if (!result.Body) return json(request, { error: "Documento indisponível" }, 502);
    const bytes = await result.Body.transformToByteArray();
    // Checksum conferido antes de disponibilizar documentos clínicos.
    if (bytes.byteLength !== doc.byte_size || (await sha256(bytes)) !== doc.sha256_hex) {
      return json(request, { error: "Integridade do documento não confirmada" }, 502);
    }
    return new Response(bytes, {
      headers: {
        ...cors(request), "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName(doc.filename)}"`,
        "X-MuseTera-SHA256": doc.sha256_hex,
      },
    });
  } catch (_error) {
    return json(request, { error: "Falha ao recuperar documento do arquivo privado" }, 502);
  }
});
