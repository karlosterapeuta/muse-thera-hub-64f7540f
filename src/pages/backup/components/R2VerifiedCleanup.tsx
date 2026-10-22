import { useRef, useState } from "react";
import { Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CleanupResult = {removed?:boolean;finished?:boolean;bytes?:number;archiveRetained?:boolean;error?:string};
export function R2VerifiedCleanup() {
 const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState("");
 const [removed,setRemoved]=useState(0);
 const [error,setError]=useState(false);
 const stop=useRef(false);
 async function clean() {
  if(busy)return;
  const accepted=window.confirm(
   "EXCLUSÃO DAS CÓPIAS DO SUPABASE: cada PDF será removido SOMENTE após validar novamente " +
   "o original e sua cópia no R2 pelo SHA-256. Os documentos serão mantidos no R2 privado. " +
   "Links antigos do Supabase podem deixar de funcionar. Confirma que deseja continuar?"
  );
  if(!accepted)return;
  stop.current=false;setBusy(true);setError(false);setRemoved(0);
  let count=0,bytes=0;
  try {
   while(!stop.current && count<600) {
    setStatus(`Removidos nesta execução: ${count} PDFs (${(bytes/1048576).toFixed(2)} MB). R2 preservado.`);
    const {data,error:fnError}=await supabase.functions.invoke<CleanupResult>("cleanup-verified-clinical-pdfs",{method:"POST",body:{action:"remove_one_verified"}});
    if(fnError){
      const context=(fnError as {context?:unknown}).context;
      let reason="Falha de rede ou servidor, operação interrompida";
      if(context instanceof Response){try{const b=await context.clone().json();if(typeof b.error==="string")reason=b.error;}catch{}}
      throw Error(reason);
    }
    if(data?.finished){setStatus(`Limpeza concluída nesta verificação: ${count} PDFs (${(bytes/1048576).toFixed(2)} MB) excluídos do Supabase. Arquivos R2 preservados.`);return;}
    if(data?.removed!==true||data.archiveRetained!==true)throw Error("Resposta sem confirmação segura de exclusão");
    count++;bytes+=Number(data.bytes||0);setRemoved(count);
   }
   setStatus(stop.current?`Pausado após ${count} PDFs. É possível retomar sem repetir remoções.`:`Limite de lote atingido: ${count} PDFs.`);
  }catch(e){setError(true);setStatus(`Interrompido após ${count} remoções: ${e instanceof Error?e.message:"erro inesperado"}`);}
  finally{setBusy(false);}
 }
 return <Card><CardContent className="space-y-3 p-4 sm:p-6">
  <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-teal-500"/><h3 className="text-lg font-semibold">Liberar espaço — PDFs conferidos no R2</h3></div>
  <p className="text-sm text-muted-foreground">Remove somente cópias do Supabase com R2 verificado novamente, registra a exclusão e mantém documentos originais não migrados. Atenção: endereços antigos de download do Supabase deixarão de funcionar; confirme que seus fluxos clínicos consultam o R2.</p>
  <div className="flex flex-wrap gap-2">
    <Button variant="destructive" disabled={busy} onClick={()=>void clean()}>{busy?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<Trash2 className="mr-2 h-4 w-4"/>}{busy?`Limpando (${removed})...`:"Excluir PDFs do Supabase já verificados no R2"}</Button>
    {busy&&<Button variant="outline" onClick={()=>{stop.current=true;}}>Pausar depois do arquivo atual</Button>}
  </div>
  {status&&<p className={error?"text-sm text-destructive":"text-sm text-muted-foreground"} role={error?"alert":"status"}>{status}</p>}
 </CardContent></Card>;
}
