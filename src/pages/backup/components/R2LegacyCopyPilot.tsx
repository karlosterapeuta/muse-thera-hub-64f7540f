import { useRef, useState } from "react";
import { Archive, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type CopyResponse = {
  copied?: boolean;
  finished?: boolean;
  verified?: boolean;
  bytes?: number;
  sha256?: string;
  kind?: string;
  sourceRetained?: boolean;
  sourceDeleted?: boolean;
  error?: string;
};

/** O piloto copia NO MÁXIMO UM PDF REAL da conta do próprio administrador. */
export function R2LegacyCopyPilot() {
  const [busy,setBusy]=useState(false);
  const stopRequested = useRef(false);
  const [progress,setProgress]=useState(0);
  const [message,setMessage]=useState("");
  const [error,setError]=useState(false);


  const migrateAll = async () => {
    if (busy) return;
    const approved=window.confirm(
      "Migrar PDFs clínicos de TODOS os profissionais para o bucket PRIVADO R2? " +
      "O processo transfere dados sensíveis para a região configurada no Cloudflare. " +
      "TODOS os originais permanecem no Supabase. Nenhuma exclusão será realizada. " +
      "Continue apenas após validar LGPD, segurança e retenção documental."
    );
    if(!approved) return;
    stopRequested.current=false;
    setProgress(0);setBusy(true);setError(false);
    let count=0;let bytesTotal=0;
    try {
      // Uma requisição por objeto, sem concorrência; erros interrompem o lote.
      // O navegador deve permanecer aberto. Reabrir depois retoma sem duplicar itens já verificados.
      while(!stopRequested.current && count<600) {
        setMessage(`Migrando PDFs: ${count} novos nesta execução, ${(bytesTotal/1048576).toFixed(2)} MB. Originais preservados.`);
        const { data, error: fnError }=await supabase.functions.invoke<CopyResponse>(
          "migrate-legacy-clinical-pdf",{method:"POST",body:{action:"copy_one"}}
        );
        if(fnError) {
          const response=(fnError as {context?:unknown}).context;
          let reason="Falha de rede ou de servidor durante a migração";
          if(response instanceof Response) {
            try {
              const body=await response.clone().json() as CopyResponse;
              if(typeof body.error==="string") reason=body.error;
            } catch { /* usa mensagem segura */ }
          }
          throw new Error(reason);
        }
        if(data?.finished) {
          setMessage(`Migração concluída: ${count} PDFs nesta execução, ${(bytesTotal/1048576).toFixed(2)} MB. Todos os originais preservados.`);
          return;
        }
        if(!data?.copied||!data.verified||!data.sourceRetained||data.sourceDeleted!==false) {
          throw new Error("O servidor não confirmou integridade e preservação; migração interrompida.");
        }
        count++;bytesTotal+=Number(data.bytes)||0;setProgress(count);
      }
      setMessage(stopRequested.current
        ? `Pausado após ${count} PDFs nesta execução. Clique novamente para retomar sem repetir cópias verificadas.`
        : `Limite operacional atingido: ${count} PDFs. Clique novamente para continuar.`);
    } catch(err) {
      setError(true);
      setMessage(`Interrompido após ${count} PDFs nesta execução: ${err instanceof Error?err.message:"erro inesperado"}. As cópias verificadas permanecem registradas e os originais permanecem no Supabase.`);
    } finally {setBusy(false);}
  };

  const copyOne = async () => {
    if (busy) return;
    const approved=window.confirm(
      "Esta operação COPIA 1 PDF clínico de um profissional para o bucket PRIVADO Cloudflare R2, possivelmente fora do Brasil. " +
      "O original permanecerá no Supabase e a cópia será verificada pelo SHA-256. " +
      "Confirme somente após avaliar os requisitos de LGPD e conservação dos documentos. Continuar?"
    );
    if(!approved) return;
    setBusy(true);setError(false);setMessage("Selecionando um documento com segurança...");
    try {
      const {data, error:fnError}=await supabase.functions.invoke<CopyResponse>(
        "migrate-legacy-clinical-pdf", {method:"POST",body:{action:"copy_one"}}
      );
      if(fnError) {
        const response=(fnError as {context?:unknown}).context;
        let why="Não foi possível confirmar a operação";
        if(response instanceof Response) {
          try {
            const body=await response.clone().json() as CopyResponse;
            if(typeof body?.error==="string") why=body.error;
          } catch { /* sem conteúdo estruturado */ }
        }
        throw new Error(why);
      }
      if(data?.finished) {
        setMessage("Nenhum PDF elegível da sua conta resta para copiar neste piloto.");
        return;
      }
      if(!data?.copied || !data?.verified || !data?.sourceRetained || data?.sourceDeleted !== false) {
        throw new Error("A operação não confirmou a cópia íntegra e a preservação da origem.");
      }
      setMessage(`Cópia privada verificada: ${(Number(data.bytes||0)/1048576).toFixed(2)} MB; SHA-256 ${data.sha256}. O PDF original permanece no Supabase. Nenhum arquivo foi excluído.`);
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error?err.message:"Falha inesperada; confira os logs do Supabase.");
    } finally {setBusy(false);}
  };

  return <Card aria-label="Piloto de cópia de documentos históricos para R2">
    <CardContent className="space-y-3 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <Archive className="mt-0.5 h-6 w-6 shrink-0 text-teal-600"/>
        <div>
          <h3 className="font-semibold text-lg">Migração para R2 — piloto controlado</h3>
          <p className="text-sm text-muted-foreground">
            Migração administrada: copie todos os PDFs de todos os profissionais em sequência, ou um PDF por vez. Compara cada arquivo
            baixado do R2 pelo SHA-256 e mantém a versão original no Supabase.
            Não apaga, não move nem modifica prontuários existentes.
          </p>
        </div>
      </div>
      <p className="text-xs text-amber-800 dark:text-amber-300">
        Atenção: documentos clínicos são dados sensíveis. Verifique os requisitos de segurança,
        conservação e eventual transferência internacional antes de iniciar.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy} onClick={()=>void migrateAll()}>
          {busy?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<Archive className="mr-2 h-4 w-4"/>}
          {busy?`Migrando (${progress})...`:"Migrar PDFs de todos os profissionais (sem excluir)"}
        </Button>
        {busy&&<Button type="button" variant="outline" onClick={()=>{stopRequested.current=true;}}>Pausar após PDF atual</Button>}
      </div>
      <Button type="button" variant="outline" disabled={busy} onClick={()=>void copyOne()}>
        {busy?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<Archive className="mr-2 h-4 w-4"/>}
        {busy?"Verificando cópia...":"Copiar próximo PDF para R2 (sem excluir origem)"}
      </Button>
      {message && <div role={error?"alert":"status"} className="rounded-lg border p-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          {error?<ShieldAlert className="h-4 w-4 text-amber-500"/>:<CheckCircle2 className="h-4 w-4 text-teal-600"/>}
          {error?"Piloto não confirmado":"Resultado do piloto"}
        </p>
        <p className="mt-2 break-all text-xs">{message}</p>
      </div>}
    </CardContent>
  </Card>;
}
