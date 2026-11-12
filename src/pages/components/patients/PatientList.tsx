import { PatientCareMenu } from "./PatientCareMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBirthDateForDisplay } from '@/utils/dateUtils';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { PatientPhotoAvatar } from "./PatientPhotoAvatar";

// Updated Patient type to include anamnesis status
type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  age: number | null;
  has_anamnesis?: boolean;
  anamnesis_status?: "none" | "draft" | "registered" | "finalized";
  photo_url?: string | null;
};

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onViewAnamnesis: (patient: Patient) => void;
  onEditAnamnesis?: (patient: Patient) => void;
  loadingAnamnesisPatientId?: string | null;
}

export function PatientList({ patients, onEdit, onDelete, onViewAnamnesis, onEditAnamnesis, loadingAnamnesisPatientId }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 bg-muted/30 rounded-md">
        Nenhum paciente encontrado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50 border-b border-border/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-5 font-bold text-foreground tracking-tight pl-6">Paciente</TableHead>
            <TableHead className="py-5 font-bold text-foreground tracking-tight">Idade</TableHead>
            <TableHead className="py-5 font-bold text-foreground tracking-tight">Responsável</TableHead>
            <TableHead className="py-5 font-bold text-foreground tracking-tight">Anamnese</TableHead>
            <TableHead className="py-5 font-bold text-foreground tracking-tight text-right pr-6">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="group transition-colors hover:bg-muted/30 border-b border-border/50">
              <TableCell className="py-4 pl-6 font-semibold text-foreground">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden border border-primary/10">
                    <PatientPhotoAvatar value={patient.photo_url} name={patient.name} />

                  </div>
                  <div className="flex flex-col">
                    <span className="leading-tight">{patient.name}</span>
                    <span className="text-xs text-muted-foreground font-normal mt-0.5">{patient.contact || "Sem contato"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 font-medium text-muted-foreground">
                {patient.age !== null ? (
                  <div className="flex flex-col">
                    <span className="text-foreground">{patient.age} anos</span>
                    {patient.birth_date && (
                      <span className="text-xs uppercase tracking-wider opacity-60">
                        {formatBirthDateForDisplay(patient.birth_date)}
                      </span>
                    )}
                  </div>
                ) : <span className="opacity-40">N/A</span>}
              </TableCell>
              <TableCell className="py-4 text-muted-foreground italic font-medium">
                {patient.responsible || <span className="opacity-40 font-normal">Não informado</span>}
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className={patient.anamnesis_status === "finalized"
                  ? "border-primary/30 bg-primary/10 text-primary px-2 py-1 font-semibold text-xs"
                  : patient.anamnesis_status === "draft"
                  ? "border-amber-700/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 px-2 py-1 font-semibold text-xs"
                  : "border-border bg-muted text-foreground px-2 py-1 font-semibold text-xs"}>
                  {patient.anamnesis_status === "finalized" ? "Finalizada" :
                   patient.anamnesis_status === "draft" ? "Em preenchimento" :
                   patient.anamnesis_status === "registered" || patient.has_anamnesis ? "Registrada" : "Não iniciada"}
                </Badge>
              </TableCell>
              <TableCell className="py-4 text-right pr-6">
                <div className="flex items-center justify-end gap-1">
                  <PatientCareMenu patient={patient} />
                  {patient.has_anamnesis && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewAnamnesis(patient)}
                      className="h-11 w-11 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="Ver Anamnese"
                       aria-label={"Ver anamnese de " + patient.name}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onEditAnamnesis && patient.has_anamnesis && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditAnamnesis(patient)}
                      disabled={loadingAnamnesisPatientId === patient.id}
                      className="h-11 w-11 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/5 rounded-lg transition-all"
                      title="Editar Anamnese"
                       aria-label={"Editar anamnese de " + patient.name}
                    >
                      {loadingAnamnesisPatientId === patient.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(patient)}
                    className="h-11 w-11 text-muted-foreground hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-500/5 rounded-lg transition-all"
                    title="Editar Cadastro"
                       aria-label={"Editar cadastro de " + patient.name}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-11 w-11 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                        title="Excluir Paciente"
                       aria-label={"Excluir paciente " + patient.name}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold">Excluir Paciente</AlertDialogTitle>
                        <AlertDialogDescription>
                          Deseja realmente excluir <strong>{patient.name}</strong>? Esta ação é definitiva e removerá todos os dados vinculados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(patient)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        >
                          Confirmar Exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
