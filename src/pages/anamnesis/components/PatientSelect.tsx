
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Patient = {
  id: string;
  name: string;
};

type PatientSelectProps = {
  patients: Patient[];
  selectedPatient: string;
  onSelect: (value: string) => void;
  isLoading?: boolean;
};

export function PatientSelect({ 
  patients, 
  selectedPatient, 
  onSelect, 
  isLoading = false 
}: PatientSelectProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Paciente</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Paciente</Label>
      <Select 
        value={selectedPatient} 
        onValueChange={onSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            patients && patients.length > 0 
              ? "Selecione um paciente" 
              : "Nenhum paciente encontrado"
          } />
        </SelectTrigger>
        <SelectContent>
          {patients && patients.length > 0 ? (
            patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-patients" disabled>
              Nenhum paciente encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
