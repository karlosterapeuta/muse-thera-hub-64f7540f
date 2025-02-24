
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);

        // Primeiro, obter o profissional atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('Usuário não autenticado');
          return;
        }

        const { data: professionalData, error: professionalError } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (professionalError) {
          console.error('Erro ao buscar profissional:', professionalError);
          return;
        }

        // Agora buscar apenas os pacientes deste profissional
        const { data: patientsData, error } = await supabase
          .from('patients')
          .select('id, name')
          .eq('professional_id', professionalData.id)
          .order('name');

        if (error) {
          console.error('Erro ao carregar pacientes:', error);
          return;
        }

        setFilteredPatients(patientsData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <Label>Paciente</Label>
      <Select value={selectedPatient} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um paciente"} />
        </SelectTrigger>
        <SelectContent>
          {!isLoading && filteredPatients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
