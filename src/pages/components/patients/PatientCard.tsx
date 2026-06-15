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
            <h3 className="text-xl font-bold truncate text-foreground leading-tight">{patient.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                {patient.age !== null ? `${patient.age} anos` : "Idade N/A"}
              </span>
              {patient.has_anamnesis ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0 text-[10px] uppercase font-bold tracking-widest">
                  Completa
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-2 py-0 text-[10px] uppercase font-bold tracking-widest">
                  Pendente
                </Badge>
              )}
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
      
      <CardFooter className="flex items-center justify-between gap-2 p-3 bg-muted/30 border-t border-border/50">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit} 
            className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-colors"
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
                className="h-9 px-4 rounded-xl border-border/50 font-semibold shadow-sm text-xs bg-card"
              >
                Ficha
              </Button>
              {onEditAnamnesis && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={onEditAnamnesis} 
                  disabled={isLoadingAnamnesis}
                  className="h-9 px-4 rounded-xl font-semibold shadow-sm text-xs bg-primary"
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
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-9 px-4 rounded-xl font-semibold text-xs w-full sm:w-auto"
              disabled
            >
              Sem Anamnese
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
