
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

export function PatientSelect({ patients, selectedPatient, onSelect, isLoading = false }: PatientSelectProps) {
  return (
    <div>
      <Label>Paciente</Label>
      <Select value={selectedPatient} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um paciente"} />
        </SelectTrigger>
        <SelectContent>
          {!isLoading && patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
