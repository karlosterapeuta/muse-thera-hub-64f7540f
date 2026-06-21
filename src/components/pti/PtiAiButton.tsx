import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PtiAiButtonProps {
  section: string;
  context: Record<string, any>;
  onApply: (text: string, mode: "replace" | "append") => void;
  label?: string;
}

export function PtiAiButton({ section, context, onApply, label = "Gerar com IA" }: PtiAiButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const generate = async () => {
    setLoading(true);
    setSuggestion("");
    try {
      const { data, error } = await supabase.functions.invoke("pti-ai-assist", {
        body: { section, context },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSuggestion(data.suggestion || "");
    } catch (e: any) {
      toast.error(e.message || "Erro ao gerar sugestão");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    generate();
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
        onClick={handleOpen}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Sugestão da IA
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Gerando sugestão...
            </div>
          ) : (
            <Textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={10}
              placeholder="A sugestão aparecerá aqui. Você pode editá-la antes de aplicar."
            />
          )}

          <p className="text-xs text-muted-foreground">
            A IA nunca substitui automaticamente seu texto. Revise e edite antes de aplicar.
          </p>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={generate} disabled={loading}>
              Gerar novamente
            </Button>
            <Button
              variant="secondary"
              disabled={loading || !suggestion}
              onClick={() => {
                onApply(suggestion, "append");
                setOpen(false);
              }}
            >
              Adicionar ao texto
            </Button>
            <Button
              disabled={loading || !suggestion}
              onClick={() => {
                onApply(suggestion, "replace");
                setOpen(false);
              }}
            >
              Substituir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
