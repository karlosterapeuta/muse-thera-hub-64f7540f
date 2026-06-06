import React from 'react';
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
    <div className="w-full">
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
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {patient.name.substring(0, 2).toUpperCase()}
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
                      <span className="text-[10px] uppercase tracking-wider opacity-60">
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
                {patient.has_anamnesis ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-semibold text-[10px] uppercase tracking-widest">
                    Completa
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 font-semibold text-[10px] uppercase tracking-widest">
                    Pendente
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-4 text-right pr-6">
                <div className="flex items-center justify-end gap-1">
                  {patient.has_anamnesis && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewAnamnesis(patient)}
                      className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="Ver Anamnese"
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
                      className="h-9 w-9 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/5 rounded-lg transition-all"
                      title="Editar Anamnese"
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
                    className="h-9 w-9 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/5 rounded-lg transition-all"
                    title="Editar Cadastro"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all"
                        title="Excluir Paciente"
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
