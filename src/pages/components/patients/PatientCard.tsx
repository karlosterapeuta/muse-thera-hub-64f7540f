
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Patient = {
  id: string;
  name: string;
  age: number | null;
  responsible: string | null;
  contact: string | null;
  has_anamnesis?: boolean;
};

interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
  onViewAnamnesis: () => void;
  onEditAnamnesis?: () => void;
}

export function PatientCard({ patient, onEdit, onDelete, onViewAnamnesis, onEditAnamnesis }: PatientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold truncate">{patient.name}</h3>
            <div className="space-y-1 mt-2 text-sm text-gray-600">
              <p>Idade: {patient.age !== null ? `${patient.age} anos` : "N/A"}</p>
              <p className="truncate">Responsável: {patient.responsible || "N/A"}</p>
              <p className="truncate">Contato: {patient.contact || "N/A"}</p>
            </div>
          </div>
          <div className="ml-2">
            {patient.has_anamnesis ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 text-xs whitespace-nowrap">
                Anamnese
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200 text-xs whitespace-nowrap">
                Sem Anamnese
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-1 bg-gray-50 p-2">
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
          <Pencil className="h-3.5 w-3.5" />
          <span className="ml-1 text-xs">Editar</span>
        </Button>
        
        {patient.has_anamnesis && (
          <>
            <Button variant="ghost" size="sm" onClick={onViewAnamnesis} className="h-8 px-2">
              <FileText className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">Ver</span>
            </Button>
            
            {onEditAnamnesis && (
              <Button variant="ghost" size="sm" onClick={onEditAnamnesis} className="h-8 px-2">
                <Pencil className="h-3.5 w-3.5" />
                <span className="ml-1 text-xs">Editar Anm.</span>
              </Button>
            )}
          </>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:text-destructive h-8 px-2">
              <Trash2 className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">Excluir</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá excluir o paciente "{patient.name}" permanentemente e
                não poderá ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
