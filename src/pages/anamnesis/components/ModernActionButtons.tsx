import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Download, Loader2, AlertCircle } from "lucide-react";

interface ModernActionButtonsProps {
  onSave?: () => void;
  onCancel?: () => void;
  onExportPDF?: () => void;
  isSaving?: boolean;
  isExportingPDF?: boolean;
  showBack?: boolean;
  isValid?: boolean;
  validationMessage?: string;
}

export function ModernActionButtons({
  onSave,
  onCancel,
  onExportPDF,
  isSaving = false,
  isExportingPDF = false,
  showBack = false,
  isValid = true,
  validationMessage
}: ModernActionButtonsProps) {
  return (
    <div className="space-y-4">
      {/* Validation warning */}
      {!isValid && validationMessage && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{validationMessage}</span>
        </div>
      )}
      
      <div className="sticky bottom-0 z-20 -mx-3 flex flex-col gap-3 border-t border-border bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:static sm:mx-0 sm:flex-row sm:justify-end sm:gap-4 sm:bg-transparent sm:px-0 sm:pt-6 sm:backdrop-blur-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {showBack && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="min-h-11 flex items-center justify-center gap-2 px-5 hover:bg-accent transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          )}
          
          {!showBack && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="min-h-11 px-5 hover:bg-accent transition-all duration-200"
            >
              Cancelar
            </Button>
          )}
          
          {onSave && (
            <Button
              type="button"
              variant="secondary"
              onClick={onSave}
              disabled={isSaving}
              className="min-h-11 flex items-center justify-center gap-2 px-5 transition-colors bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Salvando..." : "Salvar Anamnese"}
            </Button>
          )}
          
          {onExportPDF && (
            <Button
              type="button"
              onClick={onExportPDF}
              disabled={isExportingPDF || isSaving}
              className="min-h-11 flex items-center justify-center gap-2 px-5 border border-primary/30 bg-card text-foreground hover:bg-primary/10 transition-colors"
            >
              {isExportingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExportingPDF ? "Exportando..." : "Exportar PDF"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
