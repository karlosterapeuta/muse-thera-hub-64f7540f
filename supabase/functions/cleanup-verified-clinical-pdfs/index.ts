// MuseTera: Remove SOMENTE um PDF com cópia no R2 verificada novamente por SHA-256.
// Não remove R2 e não remove dados estruturados; não opera sem admin autenticado.
import { createClient } from "npm:@supabase/supabase-js@2.105.4";
import { S3Client, GetObjectCommand } from "npm:@aws-sdk/client-s3@3.879.0";
const origins=new Set(["https://portal.musetera.com.br","https://708c4d34.portal-musetera.pages.dev",...(Deno.env.get("R2_ALLOWED_ORIGINS")||"").split(",").map(x=>x.trim()).filter(Boolean)]);
function h(req:Request){const o=req.headers.get("origin");return {"Vary":"Origin",...(o&&origins.has(o)?{"Access-Control-Allow-Origin":o}:{}),"Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"POST,OPTIONS","Cache-Control":"no-store"};}
function out(req:Request,data:object,status=200){return Response.json(data,{status,headers:h(req)});}
async function digest(bytes:Uint8Array){return [...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(x=>x.toString(16).padStart(2,"0")).join("");}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS") return new Response(null,{status:204,headers:h(req)});
 if(req.method!=="POST") return out(req,{error:"Método não permitido"},405);
 const origin=req.headers.get("origin");if(origin&&!origins.has(origin))return out(req,{error:"Origem não autorizada"},403);
 const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const acct=Deno.env.get("R2_ACCOUNT_ID"),bucket=Deno.env.get("R2_BUCKET"),key=Deno.env.get("R2_ACCESS_KEY_ID"),secret=Deno.env.get("R2_SECRET_ACCESS_KEY");
 if(!url||!anon||!service||!acct||!bucket||!key||!secret)return out(req,{error:"Serviço ainda não configurado"},503);
 const bearer=req.headers.get("authorization");if(!bearer?.startsWith("Bearer "))return out(req,{error:"Login obrigatório"},401);
 const caller=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:bearer}}});
 const {data:{user},error:authError}=await caller.auth.getUser(bearer.substring(7));
 if(authError||!user)return out(req,{error:"Sessão inválida"},401);
 const {data:isAdmin,error:roleError}=await caller.rpc("has_role",{role:"admin"});
 if(roleError||isAdmin!==true)return out(req,{error:"Apenas administrador"},403);
 let action;try{action=(await req.json()).action;}catch{return out(req,{error:"Corpo inválido"},400);}
 if(action!=="remove_one_verified")return out(req,{error:"Operação não autorizada"},400);
 const db=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 // Select only previously migrated and verified documents that still exist in Storage.
 const {data:docs,error:listError}=await db.from("clinical_documents")
 .select("id,owner_user_id,object_key,byte_size,sha256_hex,legacy_source_bucket,legacy_source_path,legacy_verified_at")
 .eq("legacy_source_bucket","clinical-pdfs").not("legacy_verified_at","is",null)
 .is("legacy_removed_at",null).order("legacy_verified_at",{ascending:true}).limit(25);
 if(listError)return out(req,{error:"Falha ao consultar documentos verificados"},500);
 const s3=new S3Client({region:"auto",endpoint:`https://${acct}.r2.cloudflarestorage.com`,forcePathStyle:true,requestChecksumCalculation:"WHEN_REQUIRED",credentials:{accessKeyId:key,secretAccessKey:secret}});
 for(const doc of docs||[]){
   if(!doc.legacy_source_path?.startsWith(doc.owner_user_id+"/")||
      !doc.object_key?.startsWith(doc.owner_user_id+"/")||
      !Number.isSafeInteger(doc.byte_size)||doc.byte_size<1||
      !/^[0-9a-f]{64}$/.test(doc.sha256_hex))continue;
   // Don't remove objects referenced by receipt records.
   const {count:receiptCount,error:receiptError}=await db.from("payment_receipts").select("id",{count:"exact",head:true}).eq("pdf_path",doc.legacy_source_path);
   if(receiptError)return out(req,{error:"Falha ao verificar referências do recibo"},500);
   if((receiptCount||0)>0)continue;
   const {data:original,error:originalError}=await db.storage.from("clinical-pdfs").download(doc.legacy_source_path);
   if(originalError||!original){continue;} // Already absent: do not claim removal.
   const originalBytes=new Uint8Array(await original.arrayBuffer());
   if(originalBytes.byteLength!==doc.byte_size || (await digest(originalBytes))!==doc.sha256_hex){
     return out(req,{error:"Arquivo original não confere com cópia registrada; limpeza interrompida"},409);
   }
   try{
     const response=await s3.send(new GetObjectCommand({Bucket:bucket,Key:doc.object_key}));
     if(!response.Body)throw Error("Missing archive");
     const bytes=await response.Body.transformToByteArray();
     if(bytes.byteLength!==doc.byte_size||(await digest(bytes))!==doc.sha256_hex)
       return out(req,{error:"A cópia privada do R2 não passou na revisão de integridade"},409);
   }catch{return out(req,{error:"Não foi possível confirmar leitura íntegra do R2; nenhum arquivo apagado"},502);}
   // Storage API deletes the object from the backend, not a SQL metadata-only DELETE.
   const {error:removeError}=await db.storage.from("clinical-pdfs").remove([doc.legacy_source_path]);
   if(removeError)return out(req,{error:"Falha na remoção pelo Storage API"},502);
   const {error:markError}=await db.from("clinical_documents").update({legacy_removed_at:new Date().toISOString()}).eq("id",doc.id);
   if(markError)return out(req,{error:"Arquivo removido, mas registro de auditoria pendente; interrompa operação"},500);
   return out(req,{removed:true,bytes:doc.byte_size,remainingSource:false,archiveRetained:true});
 }
 return out(req,{finished:true,removed:false});
});
