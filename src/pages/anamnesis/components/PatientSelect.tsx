
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Patient = {
  id: string;
  name: string;
};

type PatientSelectProps = {
  patients: Patient[];
  selectedPatient: string;
  onSelect: (value: string) => void;
};

export function PatientSelect({ patients, selectedPatient, onSelect }: PatientSelectProps) {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatientsForProfessional = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar apenas pacientes associados ao profissional logado
      const { data: patientsData, error } = await supabase
        .from('patients')
        .select('id, name')
        .eq('professional_id', user.id)
        .order('name');

      if (error) {
        console.error('Erro ao carregar pacientes:', error);
        return;
      }

      setFilteredPatients(patientsData || []);
    };

    fetchPatientsForProfessional();
  }, []);

  return (
    <div>
      <Label>Paciente</Label>
      <Select value={selectedPatient} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um paciente" />
        </SelectTrigger>
        <SelectContent>
          {filteredPatients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
