import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Loader2 } from "lucide-react";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfBlob: Blob | null;
  filename: string;
  title?: string;
  onDownload?: () => void;
  isBuilding?: boolean;
}

/**
 * Modal de pré-visualização página-a-página de um PDF (Blob).
 * Usa o visualizador nativo do navegador via <iframe> + object URL,
 * permitindo rolar todas as páginas antes de baixar.
 */
export const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  open,
  onOpenChange,
  pdfBlob,
  filename,
  title = "Pré-visualização do PDF",
  onDownload,
  isBuilding = false,
}) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfBlob) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(pdfBlob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [pdfBlob]);

  const handleDownload = () => {
    if (onDownload) return onDownload();
    if (!pdfBlob) return;
    const a = document.createElement("a");
    const downloadUrl = URL.createObjectURL(pdfBlob);
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {filename}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 bg-muted/40">
          {isBuilding || !url ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Montando pré-visualização página a página…</p>
            </div>
          ) : (
            <iframe
              title="PDF Preview"
              src={`${url}#toolbar=1&navpanes=0&view=FitH`}
              className="w-full h-full border-0"
            />
          )}
        </div>

        <DialogFooter className="px-6 py-3 border-t bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!pdfBlob || isBuilding}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
