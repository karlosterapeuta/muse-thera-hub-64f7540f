
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Download, Loader2 } from "lucide-react";

interface ModernActionButtonsProps {
  onSave?: () => void;
  onCancel?: () => void;
  onExportPDF?: () => void;
  isSaving?: boolean;
  isExportingPDF?: boolean;
  showBack?: boolean;
}

export function ModernActionButtons({
  onSave,
  onCancel,
  onExportPDF,
  isSaving = false,
  isExportingPDF = false,
  showBack = false
}: ModernActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {showBack && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 hover:bg-gray-50 transition-all duration-200"
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
            className="px-6 py-3 hover:bg-gray-50 transition-all duration-200"
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-200"
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
  );
}
