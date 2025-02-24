
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
  const getPlaceholderText = () => {
    if (isLoading) return "Carregando...";
    if (patients.length === 0) return "Nenhum paciente encontrado";
    if (!selectedPatient) return "Selecione um paciente";
    const patient = patients.find(p => p.id === selectedPatient);
    return patient ? patient.name : "Selecione um paciente";
  };

  return (
    <div>
      <Label>Paciente</Label>
      <Select value={selectedPatient} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder={getPlaceholderText()} />
        </SelectTrigger>
        <SelectContent>
          {!isLoading && patients.length > 0 ? (
            patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))
          ) : !isLoading && (
            <SelectItem value="no-patients" disabled>
              Nenhum paciente encontrado
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
