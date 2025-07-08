
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

interface TreatmentPlanActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export function TreatmentPlanActions({ onCancel, onSubmit }: TreatmentPlanActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 pb-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex items-center gap-2 px-8 py-3 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        Cancelar
      </Button>
      <Button 
        type="submit"
        onClick={onSubmit}
        className="flex items-center gap-2 px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Download className="w-5 h-5" />
        Salvar e Baixar PDF
      </Button>
    </div>
  );
}
