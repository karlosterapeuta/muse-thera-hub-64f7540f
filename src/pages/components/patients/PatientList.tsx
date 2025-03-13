
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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

// Updated Patient type to match the one used in patients.tsx
type Patient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  birth_date: string | null;
  responsible: string | null;
  contact: string | null;
  age: number | null;
};

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export function PatientList({ patients, onEdit, onDelete }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
        Nenhum paciente encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="font-medium">Nome</TableHead>
            <TableHead className="font-medium">Idade</TableHead>
            <TableHead className="font-medium">Responsável</TableHead>
            <TableHead className="font-medium">Contato</TableHead>
            <TableHead className="text-right font-medium">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>
                {patient.age !== null ? `${patient.age} anos` : "N/A"}
              </TableCell>
              <TableCell>{patient.responsible || "N/A"}</TableCell>
              <TableCell>{patient.contact || "N/A"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(patient)}
                  className="text-gray-600 hover:text-primary mr-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-600 hover:text-destructive"
                    >
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
                      <AlertDialogAction
                        onClick={() => onDelete(patient)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
