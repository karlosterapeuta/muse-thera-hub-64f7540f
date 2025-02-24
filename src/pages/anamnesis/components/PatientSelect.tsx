
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
  console.log('PatientSelect - patients:', patients);
  console.log('PatientSelect - selectedPatient:', selectedPatient);
  
  const getPlaceholderText = () => {
    if (isLoading) return "Carregando...";
    if (!patients || patients.length === 0) return "Nenhum paciente encontrado";
    return "Selecione um paciente";
  };

  return (
    <div className="space-y-2">
      <Label>Paciente</Label>
      <Select 
        value={selectedPatient} 
        onValueChange={onSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getPlaceholderText()} />
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
