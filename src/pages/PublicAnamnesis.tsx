import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarfieldBackground } from "@/components/auth/StarfieldBackground";
import { InitialEvaluationForm } from "@/pages/anamnesis/components/InitialEvaluationForm";
import { Loader2, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type LoadState = "loading" | "ready" | "error" | "done";

export default function PublicAnamnesis() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [state, setState] = useState<LoadState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [patientName, setPatientName] = useState("");
  const [professionalName, setProfessionalName] = useState("");
  const [content, setContent] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (!token) {
        setState("error");
        setErrorMsg("Link inválido.");
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke(
          `get-public-anamnesis?token=${encodeURIComponent(token)}`,
          { method: "GET" }
        );
        if (error) {
          // Try to read the error context body
          const ctx: any = (error as any).context;
          let msg = "Não foi possível abrir este link.";
          try {
            const body = ctx && (await ctx.json?.());
            if (body?.error) msg = body.error;
          } catch (_) { /* ignore */ }
          setState("error");
          setErrorMsg(msg);
          return;
        }
        setPatientName(data.patientName);
        setProfessionalName(data.professionalName);
        setState("ready");
      } catch (e) {
        setState("error");
        setErrorMsg("Não foi possível abrir este link.");
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    try {
      setSubmitting(true);
      const { error } = await supabase.functions.invoke("submit-public-anamnesis", {
        method: "POST",
        body: { token, content },
      });
      if (error) {
        const ctx: any = (error as any).context;
        let msg = "Não foi possível enviar. Tente novamente.";
        try {
          const body = ctx && (await ctx.json?.());
          if (body?.error) msg = body.error;
        } catch (_) { /* ignore */ }
        toast({ title: "Erro", description: msg, variant: "destructive" });
        return;
      }
      setState("done");
    } catch (e) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a1f] text-foreground">
      <StarfieldBackground />
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/lovable-uploads/ln-new.png"
            alt="MuseTera"
            className="h-20 w-auto mb-4 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
          />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Anamnese MuseTera
          </h1>
        </div>

        {state === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 text-white/80">
            <Loader2 className="h-10 w-10 animate-spin mb-3 text-amber-400" />
            <p>Carregando formulário...</p>
          </div>
        )}

        {state === "error" && (
          <Card className="max-w-md mx-auto border-destructive/40 bg-card/80 backdrop-blur">
            <CardContent className="flex flex-col items-center text-center gap-3 py-10">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h2 className="text-lg font-semibold">Link indisponível</h2>
              <p className="text-muted-foreground">{errorMsg}</p>
            </CardContent>
          </Card>
        )}

        {state === "done" && (
          <Card className="max-w-md mx-auto border-green-500/40 bg-card/80 backdrop-blur">
            <CardContent className="flex flex-col items-center text-center gap-3 py-10">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
              <h2 className="text-xl font-semibold">Obrigado!</h2>
              <p className="text-muted-foreground">
                As informações de <strong>{patientName}</strong> foram enviadas com sucesso
                para {professionalName}. Você já pode fechar esta página.
              </p>
            </CardContent>
          </Card>
        )}

        {state === "ready" && (
          <Card className="bg-card/90 backdrop-blur border-border shadow-2xl">
            <CardContent className="p-5 sm:p-8 space-y-6">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Anamnese de
                </p>
                <p className="text-lg font-semibold">{patientName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  solicitada por {professionalName}
                </p>
              </div>

              <InitialEvaluationForm content={content} onChange={setContent} />

              <div className="flex justify-end border-t border-border pt-6">
                <Button onClick={handleSubmit} disabled={submitting} size="lg" className="gap-2">
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Enviar anamnese
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
