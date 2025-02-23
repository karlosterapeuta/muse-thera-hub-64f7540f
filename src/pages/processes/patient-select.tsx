
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Patient = {
  id: string;
  name: string;
};

export function PatientSelect() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pacientes",
          description: "Usuário não autenticado.",
        });
        return;
      }

      const { data, error } = await supabase
        .from("patients")
        .select("id, name")
        .eq('professional_id', user.id)
        .order('name');

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar pacientes",
          description: "Ocorreu um erro ao carregar a lista de pacientes.",
        });
        return;
      }

      setPatients(data || []);
    };

    fetchPatients();
  }, [toast]);

  return (
    <div className="w-full max-w-sm">
      <Label>Selecione um Paciente</Label>
      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um paciente" />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
