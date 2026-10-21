// Piloto controlado: COPIA um PDF histórico do próprio administrador para R2 privado.
// Nunca remove, move, substitui ou altera arquivos no Supabase Storage.
import { createClient } from "npm:@supabase/supabase-js@2.105.4";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "npm:@aws-sdk/client-s3@3.879.0";

const MAX_SIZE = 20 * 1024 * 1024;
const allowedKinds = new Set(["anamnesis", "evaluation", "report", "intervention", "session", "treatment-plan"]);
const allowedOrigins = new Set((Deno.env.get("R2_ALLOWED_ORIGINS") || "https://portal.musetera.com.br").split(",").map(x => x.trim()).filter(Boolean));
function headers(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  return {
    "Vary": "Origin",
    ...(origin && allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Cache-Control": "no-store",
  };
}
function answer(req: Request, response: object, status = 200): Response {
  return Response.json(response, {status,headers:headers(req)});
}
async function hash(data: Uint8Array): Promise<string> {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)),b=>b.toString(16).padStart(2,"0")).join("");
}
async function removeOnlyNewObject(s3: S3Client,bucket: string,key: string) {
  try { await s3.send(new DeleteObjectCommand({Bucket:bucket,Key:key})); }
  catch { console.error("[R2 pilot] Rollback of newly created test-copy failed; investigate storage."); }
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null,{status:204,headers:headers(req)});
  if (req.method !== "POST") return answer(req,{error:"Método não permitido"},405);
  const origin = req.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return answer(req,{error:"Origem não permitida"},403);
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const account = Deno.env.get("R2_ACCOUNT_ID");
  const bucket = Deno.env.get("R2_BUCKET");
  const keyId = Deno.env.get("R2_ACCESS_KEY_ID");
  const secret = Deno.env.get("R2_SECRET_ACCESS_KEY");
  if (!url || !anon || !serviceKey || !account || !bucket ||
      !/^[a-f0-9]{32}$/i.test(account) || !/^[a-f0-9]{32}$/i.test(keyId||"") ||
      !/^[a-f0-9]{64}$/i.test(secret||"")) {
    return answer(req,{error:"Configuração privada incompleta"},503);
  }
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return answer(req,{error:"Autenticação obrigatória"},401);
  const caller = createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false},
    global:{headers:{Authorization:auth}}});
  const {data:{user},error:authError} = await caller.auth.getUser(auth.substring(7));
  if (authError || !user) return answer(req,{error:"Sessão inválida"},401);

  // Nenhum fallback de e-mail: apenas cargo admin no banco (que usuário não pode editar).
  const {data:isAdmin,error:roleError} = await caller.rpc("has_role",{role:"admin"});
  if (roleError || isAdmin !== true) return answer(req,{error:"Acesso exclusivo da administração"},403);

  let data: {action?: string} = {};
  try { data=await req.json(); } catch { return answer(req,{error:"Requisição inválida"},400); }
  if (data.action !== "copy_one") return answer(req,{error:"Apenas cópia unitária autorizada"},400);

  const {data:rows,error:selectError}=await caller.rpc("admin_next_legacy_clinical_pdf");
  if(selectError) return answer(req,{error:"Falha ao selecionar origem elegível"},500);
  const item=rows?.[0] as {source_path:string; owner_user_id:string; expected_bytes:number; document_kind:string}|undefined;
  if(!item) return answer(req,{finished:true,copied:false});
  if(item.owner_user_id!==user.id || !item.source_path.startsWith(user.id+"/") ||
      !allowedKinds.has(item.document_kind) || !Number.isSafeInteger(Number(item.expected_bytes)) ||
      Number(item.expected_bytes) < 1 || Number(item.expected_bytes)>MAX_SIZE) {
    return answer(req,{error:"Origem não autorizada para o piloto"},403);
  }
  const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:original,error:downloadError}=await admin.storage.from("clinical-pdfs").download(item.source_path);
  if(downloadError || !original) return answer(req,{error:"Falha ao ler cópia original no Supabase"},502);
  const bytes=new Uint8Array(await original.arrayBuffer());
  if(bytes.byteLength !== Number(item.expected_bytes) ||
    new TextDecoder().decode(bytes.slice(0,5)) !== "%PDF-") {
    return answer(req,{error:"Origem não corresponde ao PDF catalogado"},409);
  }
  const digest=await hash(bytes);
  const fileId=crypto.randomUUID();
  const newKey=`${item.owner_user_id}/${fileId}.pdf`;
  const s3=new S3Client({
    region:"auto",
    endpoint:`https://${account}.r2.cloudflarestorage.com`,
    forcePathStyle:true,requestChecksumCalculation:"WHEN_REQUIRED",
    credentials:{accessKeyId:keyId!,secretAccessKey:secret!},
  });
  try {
    await s3.send(new PutObjectCommand({
      Bucket:bucket,Key:newKey,Body:bytes,
      ContentLength:bytes.byteLength,ContentType:"application/pdf",
    }));
  } catch {
    return answer(req,{error:"R2 não aceitou a cópia do PDF legado"},502);
  }
  try {
    const response=await s3.send(new GetObjectCommand({Bucket:bucket,Key:newKey}));
    if(!response.Body) throw new Error("No R2 body");
    const restored=await response.Body.transformToByteArray();
    if(restored.byteLength!==bytes.byteLength || (await hash(restored))!==digest) {
      throw new Error("SHA256 mismatch");
    }
  } catch {
    await removeOnlyNewObject(s3,bucket!,newKey);
    return answer(req,{error:"Verificação da cópia falhou. Origem preservada."},502);
  }
  const filename=item.source_path.split("/").pop()?.replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,120) || "documento.pdf";
  const {error:insertError}=await admin.from("clinical_documents").insert({
    id:fileId,
    owner_user_id:item.owner_user_id,
    patient_id:null,
    object_key:newKey,
    filename:filename.toLowerCase().endsWith(".pdf")?filename:filename+".pdf",
    document_kind:item.document_kind,
    provider:"cloudflare_r2",
    byte_size:bytes.byteLength,
    sha256_hex:digest,
    legacy_source_bucket:"clinical-pdfs",
    legacy_source_path:item.source_path,
    legacy_verified_at:new Date().toISOString(),
  });
  if(insertError) {
    await removeOnlyNewObject(s3,bucket!,newKey);
    return answer(req,{error:"Falha no registro da migração. Origem preservada."},500);
  }
  // No nomes, URLs, dados do paciente ou caminhos antigos retornados ao navegador.
  return answer(req,{copied:true,verified:true,bytes:bytes.byteLength,sha256:digest,
    kind:item.document_kind,sourceRetained:true,sourceDeleted:false});
});
