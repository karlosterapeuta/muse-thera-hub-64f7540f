
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
  disabled?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  label?: string;
};

export function PatientSelect({ 
  patients, 
  selectedPatient, 
  onSelect, 
  disabled = false,
  isLoading = false,
  emptyMessage = "Nenhum paciente encontrado",
  label = "Paciente"
}: PatientSelectProps) {
  const hasPatients = Array.isArray(patients) && patients.length > 0;
  
  const getPlaceholderText = () => {
    if (isLoading) return "Carregando...";
    if (!Array.isArray(patients)) return "Erro ao carregar pacientes";
    if (!hasPatients) return emptyMessage;
    if (!selectedPatient) return "Selecione um paciente";
    const patient = patients.find(p => p.id === selectedPatient);
    return patient ? patient.name : "Selecione um paciente";
  };

  return (
    <div>
      <Label>{label}</Label>
      <Select 
        value={selectedPatient} 
        onValueChange={onSelect}
        disabled={disabled || isLoading || !hasPatients}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getPlaceholderText()} />
        </SelectTrigger>
        <SelectContent className="z-[9999] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          {!isLoading && hasPatients ? (
            patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id} className="text-foreground">
                {patient.name}
              </SelectItem>
            ))
          ) : !isLoading && (
            <SelectItem value="no-patients" disabled className="text-muted-foreground">
              {emptyMessage}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
