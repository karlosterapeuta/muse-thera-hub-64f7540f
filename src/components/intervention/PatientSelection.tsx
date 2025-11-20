import { PatientSelect } from "@/pages/anamnesis/components/PatientSelect";
import { Loader2 } from "lucide-react";

interface PatientSelectionProps {
  patients: Array<{ id: string; name: string }>;
  selectedPatient: string;
  isLoading: boolean;
  onPatientChange: (patientId: string) => void;
}

export function PatientSelection({ patients, selectedPatient, isLoading, onPatientChange }: PatientSelectionProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando pacientes...</span>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum paciente cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Selecione o Paciente</label>
      <PatientSelect patients={patients} selectedPatient={selectedPatient} onSelect={onPatientChange} />
    </div>
  );
}
