import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBirthDateForDisplay } from '@/utils/dateUtils';
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
  birth_date: string | null;
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
  isLoadingAnamnesis?: boolean;
}

export function PatientCard({ patient, onEdit, onDelete, onViewAnamnesis, onEditAnamnesis, isLoadingAnamnesis }: PatientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold truncate">{patient.name}</h3>
            <div className="space-y-1 mt-2 text-sm text-muted-foreground">
              <p>
                Idade: {patient.age !== null ? (
                  <>
                    {patient.age} anos
                    {patient.birth_date && (
                      <span className="text-xs ml-1 opacity-70">
                        ({formatBirthDateForDisplay(patient.birth_date)})
                      </span>
                    )}
                  </>
                ) : "N/A"}
              </p>
              <p className="truncate">Responsável: {patient.responsible || "N/A"}</p>
              <p className="truncate">Contato: {patient.contact || "N/A"}</p>
            </div>
          </div>
          <div className="ml-2">
            {patient.has_anamnesis ? (
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-700 text-xs whitespace-nowrap">
                Anamnese
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground hover:bg-muted/80 border-border text-xs whitespace-nowrap">
                Sem Anamnese
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-1 bg-muted/30 p-2">
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEditAnamnesis} 
                disabled={isLoadingAnamnesis}
                className="h-8 px-2"
              >
                {isLoadingAnamnesis ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Pencil className="h-3.5 w-3.5" />
                )}
                <span className="ml-1 text-xs">{isLoadingAnamnesis ? "Carregando..." : "Editar Anm."}</span>
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
