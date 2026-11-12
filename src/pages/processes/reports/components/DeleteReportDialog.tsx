import { useEffect, useState } from "react";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DeleteReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportType: string;
  patientName: string;
  onDeleteSuccess: () => void;
}

export function DeleteReportDialog({
  isOpen, onClose, reportId, reportType, patientName, onDeleteSuccess,
}: DeleteReportDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (!isOpen) setConfirmation("");
  }, [isOpen]);

  const handleDelete = async () => {
    if (isDeleting || confirmation !== "EXCLUIR") return;
    setIsDeleting(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Sua sessão expirou. Faça login novamente.");
      // The table belongs to professionals.id, not directly to auth.uid().
      const { data: professional, error: profileError } = await supabase
        .from("professionals").select("id").eq("user_id", user.id).maybeSingle();
      if (profileError || !professional?.id) throw new Error("Profissional não autorizado.");

      const { data: deleted, error } = await supabase.from("reports")
        .delete()
        .eq("id", reportId)
        .eq("professional_id", professional.id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!deleted?.id) throw new Error("Relatório não encontrado ou exclusão não autorizada.");

      toast({ title: "Relatório excluído", description: "A exclusão individual foi confirmada pelo banco." });
      setConfirmation("");
      onDeleteSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Exclusão não realizada",
        description: error instanceof Error ? error.message : "Verifique sua conexão e tente novamente.",
      });
      // Keep the dialog open on failure; do not misreport a successful deletion.
    } finally {
      setIsDeleting(false);
    }
  };

  return <AlertDialog open={isOpen} onOpenChange={open => { if (!open && !isDeleting) onClose(); }}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmar exclusão de relatório</AlertDialogTitle>
        <AlertDialogDescription>
          Você está prestes a excluir o relatório {reportType} de {patientName}.
          A exclusão poderá remover dados clínicos relacionados e não pode ser desfeita.
          Confira a política de retenção e digite EXCLUIR para confirmar.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <label htmlFor="confirm-report-deletion" className="text-sm font-semibold text-foreground">
        Digite EXCLUIR
        <Input id="confirm-report-deletion" autoComplete="off" className="mt-2 min-h-11"
          value={confirmation} onChange={event => setConfirmation(event.target.value)}
          disabled={isDeleting} />
      </label>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
        <Button type="button" variant="destructive" disabled={isDeleting || confirmation !== "EXCLUIR"}
          onClick={() => void handleDelete()}>
          {isDeleting ? "Excluindo..." : "Excluir permanentemente"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}
