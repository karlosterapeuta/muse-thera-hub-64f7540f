
import { Button } from "@/components/ui/button";
import { Pen, Save, X, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ActionButtons({ 
  isEditing, 
  isLoading, 
  onEdit, 
  onSave, 
  onCancel 
}: ActionButtonsProps) {
  if (!isEditing) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={onEdit}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Pen className="h-4 w-4 mr-2" />
          Editar Perfil
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button
        onClick={onSave}
        disabled={isLoading}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </>
        )}
      </Button>
      
      <Button
        onClick={onCancel}
        variant="outline"
        disabled={isLoading}
        className="border-gray-300 hover:bg-gray-50 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <X className="h-4 w-4 mr-2" />
        Cancelar
      </Button>
    </div>
  );
}
