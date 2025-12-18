import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Download, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
      
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          {showBack && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-3 hover:bg-accent transition-all duration-200"
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
              className="px-6 py-3 hover:bg-accent transition-all duration-200"
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
              className={cn(
                "flex items-center gap-2 px-6 py-3 transition-all duration-200",
                "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
                "dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white"
              )}
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
              className={cn(
                "flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200",
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
              )}
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
