
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
}

export function PatientCard({ patient, onEdit, onDelete, onViewAnamnesis }: PatientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <div className="space-y-1 mt-2 text-sm text-gray-600">
              <p>Idade: {patient.age !== null ? `${patient.age} anos` : "N/A"}</p>
              <p>Responsável: {patient.responsible || "N/A"}</p>
              <p>Contato: {patient.contact || "N/A"}</p>
            </div>
          </div>
          <div className="mt-1">
            {patient.has_anamnesis ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                Anamnese Registrada
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200">
                Sem Anamnese
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-gray-50 p-3">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-1" />
          Editar
        </Button>
        
        {patient.has_anamnesis && (
          <Button variant="ghost" size="sm" onClick={onViewAnamnesis}>
            <FileText className="h-4 w-4 mr-1" />
            Ver Anamnese
          </Button>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação irá excluir o paciente permanentemente e
                não poderá ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
