import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Copy, Check, MessageCircle, Loader2, Link2 } from "lucide-react";

interface SendAnamnesisLinkDialogProps {
  professionalId: string;
  patientId: string;
  patientName: string;
  disabled?: boolean;
}

function generateToken() {
  if (crypto?.randomUUID) {
    return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
  }
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}

export function SendAnamnesisLinkDialog({
  professionalId,
  patientId,
  patientName,
  disabled,
}: SendAnamnesisLinkDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOpen = async () => {
    if (!patientId) {
      toast({
        title: "Selecione um paciente",
        description: "Escolha o paciente antes de gerar o link.",
        variant: "destructive",
      });
      return;
    }

    setOpen(true);

    if (link) return;

    try {
      setIsGenerating(true);
      const token = generateToken();

      const { error } = await supabase.from("anamnesis_invitations").insert({
        token,
        professional_id: professionalId,
        patient_id: patientId,
        expires_at: null,
      });

      if (error) throw error;

      setLink(`${window.location.origin}/anamnese-publica/${token}`);
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link. Tente novamente.",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Link copiado!", description: "Cole e envie ao responsável." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Por favor, preencha a anamnese de ${patientName} através deste link: ${link}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        disabled={disabled}
        title={disabled ? "Selecione um paciente para gerar o link" : undefined}
        className="gap-2 w-full sm:w-auto"
      >
        <Send className="h-4 w-4" />
        Enviar link para o responsável
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Link da Anamnese
            </DialogTitle>
            <DialogDescription>
              Envie este link para o responsável de <strong>{patientName}</strong> preencher
              a anamnese. As respostas serão salvas automaticamente no seu sistema.
            </DialogDescription>
          </DialogHeader>

          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Gerando link...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={link} readOnly className="text-sm" />
                <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" onClick={handleCopy} variant="secondary" className="flex-1 gap-2">
                  <Copy className="h-4 w-4" />
                  Copiar link
                </Button>
                <Button type="button" onClick={handleWhatsApp} className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                O link não expira e pode ser preenchido apenas uma vez.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
