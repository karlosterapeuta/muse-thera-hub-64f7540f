import { PatientCareMenu } from "./PatientCareMenu";
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
import { PatientPhotoAvatar } from "./PatientPhotoAvatar";

type Patient = {
  id: string;
  name: string;
  age: number | null;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  has_anamnesis?: boolean;
  anamnesis_status?: "none" | "draft" | "registered" | "finalized";
  photo_url?: string | null;
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
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-card group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden border border-primary/10 shadow-sm">
            <PatientPhotoAvatar value={patient.photo_url} name={patient.name} />

          </div>
          <div className="flex-1 min-w-0">
            <h3 title={patient.name} className="text-lg sm:text-xl font-bold truncate text-foreground leading-tight">{patient.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {patient.age !== null ? `${patient.age} anos` : "Idade N/A"}
              </span>
              <Badge variant="outline" className={patient.anamnesis_status === "finalized"
                ? "border-primary/30 bg-primary/10 text-primary px-2 py-1 text-xs font-semibold"
                : patient.anamnesis_status === "draft"
                ? "border-amber-700/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 px-2 py-1 text-xs font-semibold"
                : "border-border bg-muted text-foreground px-2 py-1 text-xs font-semibold"}>
                {patient.anamnesis_status === "finalized" ? "Finalizada" :
                 patient.anamnesis_status === "draft" ? "Em preenchimento" :
                 patient.anamnesis_status === "registered" || patient.has_anamnesis ? "Registrada" : "Não iniciada"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Responsável</span>
            <span className="font-semibold truncate max-w-[150px]">{patient.responsible || "Não informado"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Contato</span>
            <span className="font-semibold">{patient.contact || "Sem contato"}</span>
          </div>
        </div>
      </CardContent>
      
      <div className="px-3 pb-3"><PatientCareMenu patient={patient} /></div>
      <CardFooter className="flex items-center justify-between gap-2 p-3 bg-muted/30 border-t border-border/50">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit} 
            aria-label={"Editar cadastro de " + patient.name}
             className="min-h-11 min-w-11 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                aria-label={"Excluir paciente " + patient.name}
             className="min-h-11 min-w-11 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-none shadow-2xl max-w-[90vw]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">Remover Registro</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseja excluir permanentemente o cadastro de <strong>{patient.name}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Voltar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex gap-2">
          {patient.has_anamnesis ? (
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewAnamnesis} 
                className="min-h-11 px-4 rounded-xl border-border/50 font-semibold shadow-sm text-xs bg-card"
              >
                Ficha
              </Button>
              {onEditAnamnesis && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={onEditAnamnesis} 
                  disabled={isLoadingAnamnesis}
                  className="min-h-11 px-4 rounded-xl font-semibold shadow-sm text-xs bg-primary"
                >
                  {isLoadingAnamnesis ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Anamnese"
                  )}
                </Button>
              )}
            </div>
          ) : (
            <Button variant="outline" size="sm" className="min-h-11 px-4 rounded-xl font-semibold text-xs w-full sm:w-auto"
              onClick={() => { window.location.assign("/anamnesis?patient_id=" + encodeURIComponent(patient.id)); }}>
              Iniciar anamnese
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
